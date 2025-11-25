"""
Comprehensive tests for blog API endpoints using synchronous test client.

Covers:
- GET /api/blog with filtering, search, pagination, and validation paths
- GET /api/blog/{slug}
- GET /api/blog/categories/list
"""

from datetime import datetime, timezone

import pytest
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import Session
from sqlalchemy.orm import session as sa_session
from starlette.testclient import TestClient

from app.models.blog_post import BlogPost


@pytest.fixture
def sample_blog_posts(db_session: Session):
    """Create a set of blog posts covering published/unpublished scenarios."""
    posts = [
        BlogPost(
            title="Test M&A Strategy Post",
            slug="test-ma-strategy-post",
            excerpt="A comprehensive guide to M&A strategy in 2025",
            content="# M&A Strategy\n\nThis is a test post about M&A strategy.",
            author="Dudley Peacock",
            category="M&A Strategy",
            primary_keyword="M&A strategy",
            secondary_keywords="deal flow, mergers, acquisitions",
            meta_description="Learn M&A strategy fundamentals and best practices for 2025",
            featured_image_url="https://example.com/image1.png",
            published=True,
            published_at=datetime.now(timezone.utc),
            read_time_minutes=8,
        ),
        BlogPost(
            title="Advanced FP&A Techniques",
            slug="advanced-fpa-techniques",
            excerpt="Master FP&A with these advanced techniques",
            content="# FP&A Techniques\n\nLearn advanced FP&A methodologies.",
            author="Dudley Peacock",
            category="FP&A",
            primary_keyword="FP&A techniques",
            secondary_keywords="financial planning, analysis, forecasting",
            meta_description="Advanced FP&A techniques for finance professionals",
            featured_image_url="https://example.com/image2.png",
            published=True,
            published_at=datetime.now(timezone.utc),
            read_time_minutes=10,
        ),
        BlogPost(
            title="PMI Best Practices",
            slug="pmi-best-practices",
            excerpt="Post-merger integration strategies that work",
            content="# PMI Best Practices\n\nSuccessful integration strategies.",
            author="Dudley Peacock",
            category="PMI",
            primary_keyword="post-merger integration",
            secondary_keywords="PMI, integration, M&A",
            meta_description="PMI best practices for successful post-merger integration",
            featured_image_url=None,
            published=True,
            published_at=datetime.now(timezone.utc),
            read_time_minutes=12,
        ),
        BlogPost(
            title="Unpublished Draft Post",
            slug="unpublished-draft-post",
            excerpt="This post is not yet published",
            content="# Draft\n\nThis is an unpublished draft.",
            author="Dudley Peacock",
            category="M&A Strategy",
            primary_keyword="draft",
            secondary_keywords="test",
            meta_description="Draft post for testing",
            featured_image_url=None,
            published=False,
            published_at=None,
            read_time_minutes=5,
        ),
    ]

    for post in posts:
        db_session.add(post)
    db_session.commit()

    for post in posts:
        db_session.refresh(post)

    return posts


def test_list_blog_posts_default(client: TestClient, sample_blog_posts):
    response = client.get("/api/blog")

    assert response.status_code == 200
    data = response.json()

    assert isinstance(data, list)
    assert len(data) == 3  # Only published posts
    assert all(post["published"] is True for post in data)

    first_post = data[0]
    for field in [
        "id",
        "title",
        "slug",
        "excerpt",
        "content",
        "category",
        "author",
        "read_time_minutes",
        "published",
        "published_at",
        "created_at",
        "updated_at",
    ]:
        assert field in first_post


def test_list_blog_posts_with_category_filter(client: TestClient, sample_blog_posts):
    response = client.get("/api/blog?category=FP%26A")

    assert response.status_code == 200
    data = response.json()

    assert len(data) == 1
    assert data[0]["category"] == "FP&A"
    assert data[0]["title"] == "Advanced FP&A Techniques"


def test_list_blog_posts_with_search(client: TestClient, sample_blog_posts):
    response = client.get("/api/blog?search=integration")

    assert response.status_code == 200
    data = response.json()

    assert len(data) == 1
    assert "PMI" in data[0]["title"]


def test_list_blog_posts_include_unpublished(client: TestClient, sample_blog_posts):
    response = client.get("/api/blog?published_only=false")

    assert response.status_code == 200
    data = response.json()

    assert len(data) == 4  # Includes unpublished post
    unpublished = [p for p in data if not p["published"]]
    assert len(unpublished) == 1
    assert unpublished[0]["slug"] == "unpublished-draft-post"


def test_list_blog_posts_with_pagination(client: TestClient, sample_blog_posts):
    response_page_1 = client.get("/api/blog?limit=2")
    assert response_page_1.status_code == 200
    data_page_1 = response_page_1.json()
    assert len(data_page_1) == 2

    response_page_2 = client.get("/api/blog?limit=2&offset=2")
    assert response_page_2.status_code == 200
    data_page_2 = response_page_2.json()
    assert len(data_page_2) == 1
    assert data_page_1[0]["id"] != data_page_2[0]["id"]


def test_list_blog_posts_empty_result(client: TestClient, sample_blog_posts):
    response = client.get("/api/blog?category=Nonexistent+Category")

    assert response.status_code == 200
    data = response.json()
    assert data == []


def test_get_blog_post_by_slug_success(client: TestClient, sample_blog_posts):
    response = client.get("/api/blog/test-ma-strategy-post")

    assert response.status_code == 200
    data = response.json()
    assert data["slug"] == "test-ma-strategy-post"


def test_get_blog_post_by_slug_not_found(client: TestClient, sample_blog_posts):
    response = client.get("/api/blog/nonexistent-slug-12345")

    assert response.status_code == 404
    data = response.json()
    assert "detail" in data and "not found" in data["detail"].lower()


def test_get_unpublished_post_by_slug(client: TestClient, sample_blog_posts):
    response = client.get("/api/blog/unpublished-draft-post")

    assert response.status_code == 200
    data = response.json()
    assert data["published"] is False
    assert data["slug"] == "unpublished-draft-post"


def test_list_blog_categories(client: TestClient, sample_blog_posts):
    response = client.get("/api/blog/categories/list")

    assert response.status_code == 200
    data = response.json()

    assert isinstance(data, list)
    assert len(data) == 3
    assert {"M&A Strategy", "FP&A", "PMI"}.issubset(set(data))


def test_list_blog_categories_empty_database(client: TestClient, db_session: Session):
    response = client.get("/api/blog/categories/list")

    assert response.status_code == 200
    data = response.json()
    assert data == []


def test_list_blog_posts_with_invalid_limit(client: TestClient, sample_blog_posts):
    response_high = client.get("/api/blog?limit=200")
    assert response_high.status_code == 422

    response_low = client.get("/api/blog?limit=0")
    assert response_low.status_code == 422


def test_list_blog_posts_with_invalid_offset(client: TestClient, sample_blog_posts):
    response = client.get("/api/blog?offset=-1")
    assert response.status_code == 422


def test_blog_post_response_schema(client: TestClient, sample_blog_posts):
    response = client.get("/api/blog/test-ma-strategy-post")

    assert response.status_code == 200
    data = response.json()

    required_fields = [
        "id",
        "title",
        "slug",
        "excerpt",
        "content",
        "category",
        "primary_keyword",
        "secondary_keywords",
        "meta_description",
        "author",
        "read_time_minutes",
        "published",
        "created_at",
        "updated_at",
    ]
    for field in required_fields:
        assert field in data, f"Missing required field: {field}"

    assert "featured_image_url" in data
    assert "published_at" in data
    assert isinstance(data["id"], int)
    assert isinstance(data["read_time_minutes"], int)
    assert isinstance(data["published"], bool)


def test_blog_search_case_insensitive(client: TestClient, sample_blog_posts):
    response_upper = client.get("/api/blog?search=STRATEGY")
    response_lower = client.get("/api/blog?search=strategy")

    assert response_upper.status_code == 200
    assert response_lower.status_code == 200

    data_upper = response_upper.json()
    data_lower = response_lower.json()

    assert len(data_upper) == len(data_lower)
    assert len(data_upper) >= 1


def test_blog_list_ordering(client: TestClient, sample_blog_posts):
    response = client.get("/api/blog")

    assert response.status_code == 200
    data = response.json()

    assert len(data) >= 2
    for idx in range(len(data) - 1):
        current = data[idx]["published_at"]
        next_item = data[idx + 1]["published_at"]
        assert current >= next_item


def test_list_blog_posts_returns_fallback_when_db_errors(monkeypatch, client: TestClient):
    original_execute = sa_session.Session.execute

    def failing_execute(self, clause, *args, **kwargs):
        sql_text = str(clause)
        if "SELECT 1 FROM blog_posts" in sql_text:
            return original_execute(self, clause, *args, **kwargs)
        raise OperationalError(sql_text, {}, Exception("db down"))

    monkeypatch.setattr(sa_session.Session, "execute", failing_execute)

    response = client.get("/api/blog?limit=5")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["slug"] == "pricing-strategy-for-new-product-launches-why-95-get-it-wrong-and-how-to-be-the-5"


def test_get_blog_post_by_slug_returns_fallback(monkeypatch, client: TestClient):
    original_execute = sa_session.Session.execute

    def failing_execute(self, clause, *args, **kwargs):
        sql_text = str(clause)
        if "SELECT 1 FROM blog_posts" in sql_text:
            return original_execute(self, clause, *args, **kwargs)
        raise OperationalError(sql_text, {}, Exception("db down"))

    monkeypatch.setattr(sa_session.Session, "execute", failing_execute)

    slug = "pricing-strategy-for-new-product-launches-why-95-get-it-wrong-and-how-to-be-the-5"
    response = client.get(f"/api/blog/{slug}")
    assert response.status_code == 200
    assert response.json()["slug"] == slug


def test_list_categories_returns_fallback(monkeypatch, client: TestClient):
    original_execute = sa_session.Session.execute

    def failing_execute(self, clause, *args, **kwargs):
        sql_text = str(clause)
        if "SELECT 1 FROM blog_posts" in sql_text:
            return original_execute(self, clause, *args, **kwargs)
        raise OperationalError(sql_text, {}, Exception("db down"))

    monkeypatch.setattr(sa_session.Session, "execute", failing_execute)

    response = client.get("/api/blog/categories/list")
    assert response.status_code == 200
    categories = response.json()
    assert "Pricing Strategy" in categories


def test_upload_blog_image_success(client: TestClient, tmp_path, monkeypatch):
    """Test successful blog image upload."""
    from pathlib import Path
    import io
    
    # Create a test image file
    test_image_content = b"fake png content"
    test_file = ("test_image.png", io.BytesIO(test_image_content), "image/png")
    
    response = client.post(
        "/api/blog/upload-image",
        files={"file": test_file}
    )
    
    # Should return 200 with image URL
    assert response.status_code == 200
    data = response.json()
    assert "image_url" in data
    assert "file_key" in data
    assert "file_size" in data
    assert data["file_size"] == len(test_image_content)


def test_upload_blog_image_invalid_format(client: TestClient):
    """Test blog image upload with invalid file format."""
    import io
    
    test_file = ("test.txt", io.BytesIO(b"not an image"), "text/plain")
    
    response = client.post(
        "/api/blog/upload-image",
        files={"file": test_file}
    )
    
    assert response.status_code == 400
    assert "Invalid image format" in response.json()["detail"]


def test_upload_blog_image_too_large(client: TestClient):
    """Test blog image upload with file too large."""
    import io
    
    # Create a file larger than 5MB
    large_content = b"x" * (6 * 1024 * 1024)  # 6MB
    test_file = ("test_image.png", io.BytesIO(large_content), "image/png")
    
    response = client.post(
        "/api/blog/upload-image",
        files={"file": test_file}
    )
    
    assert response.status_code == 400
    assert "File too large" in response.json()["detail"]


def test_upload_blog_image_missing_filename(client: TestClient):
    """Test blog image upload without filename."""
    import io
    
    test_file = ("", io.BytesIO(b"image content"), "image/png")
    
    response = client.post(
        "/api/blog/upload-image",
        files={"file": test_file}
    )
    
    assert response.status_code == 400
    assert "Filename is required" in response.json()["detail"]