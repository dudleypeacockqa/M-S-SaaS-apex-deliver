"""
Tests for Blog API endpoints (DEV-019).

Following TDD RED → GREEN → REFACTOR methodology.
"""
import pytest
from starlette.testclient import TestClient
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.blog_post import BlogPost


def test_list_blog_posts_returns_200(client: TestClient):
    """Test that /api/blog endpoint returns 200 OK (not 500)."""
    response = client.get("/api/blog?limit=5")

    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    data = response.json()
    assert isinstance(data, list), "Response should be a list of blog posts"


def test_list_blog_posts_with_data(client: TestClient, db_session: Session):
    """Test that blog API returns posts when data exists."""
    # Create test blog post
    test_post = BlogPost(
        title="Test M&A Post",
        slug="test-ma-post",
        excerpt="Test excerpt for M&A strategy",
        content="# Full content\n\nTest content for M&A post.",
        category="M&A Strategy",
        primary_keyword="M&A testing",
        secondary_keywords="testing,tdd,bmad",
        meta_description="Test meta description",
        author="Test Author",
        read_time_minutes=5,
        published=True,
        featured_image_url="https://example.com/test.jpg",
    )
    db_session.add(test_post)
    db_session.commit()

    response = client.get("/api/blog?limit=10")

    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1, "Should return at least the test post"

    # Verify structure
    first_post = data[0]
    assert "id" in first_post
    assert "title" in first_post
    assert "slug" in first_post
    assert "category" in first_post
    assert "featured_image_url" in first_post


def test_list_blog_posts_category_filter(client: TestClient, db_session: Session):
    """Test filtering blog posts by category."""
    # Create posts in different categories
    fpa_post = BlogPost(
        title="FP&A Best Practices",
        slug="fpa-best-practices",
        excerpt="FP&A excerpt",
        content="FP&A content",
        category="FP&A",
        primary_keyword="FP&A",
        meta_description="FP&A meta",
        author="Test Author",
        read_time_minutes=5,
        published=True,
    )
    pmi_post = BlogPost(
        title="PMI Strategy",
        slug="pmi-strategy",
        excerpt="PMI excerpt",
        content="PMI content",
        category="PMI",
        primary_keyword="PMI",
        meta_description="PMI meta",
        author="Test Author",
        read_time_minutes=5,
        published=True,
    )
    db_session.add_all([fpa_post, pmi_post])
    db_session.commit()

    response = client.get("/api/blog?category=FP%26A")

    assert response.status_code == 200
    data = response.json()

    # All returned posts should be FP&A category
    for post in data:
        assert post["category"] == "FP&A", f"Expected FP&A, got {post['category']}"


def test_list_blog_posts_search(client: TestClient, db_session: Session):
    """Test searching blog posts by keyword."""
    searchable_post = BlogPost(
        title="Ultimate Guide to M&A Valuation",
        slug="ma-valuation-guide",
        excerpt="Comprehensive valuation guide",
        content="Detailed valuation methodologies...",
        category="M&A Strategy",
        primary_keyword="valuation",
        meta_description="Valuation guide",
        author="Test Author",
        read_time_minutes=10,
        published=True,
    )
    db_session.add(searchable_post)
    db_session.commit()

    response = client.get("/api/blog?search=valuation")

    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1, "Should find posts with 'valuation' keyword"
    assert any("valuation" in post["title"].lower() for post in data)


def test_list_blog_posts_pagination(client: TestClient, db_session: Session):
    """Test blog post pagination."""
    # Create multiple posts
    for i in range(15):
        post = BlogPost(
            title=f"Test Post {i}",
            slug=f"test-post-{i}",
            excerpt=f"Excerpt {i}",
            content=f"Content {i}",
            category="M&A Strategy",
            primary_keyword=f"keyword{i}",
            meta_description=f"Meta {i}",
            author="Test Author",
            read_time_minutes=5,
            published=True,
        )
        db_session.add(post)
    db_session.commit()

    # Test first page
    response = client.get("/api/blog?limit=10&offset=0")
    assert response.status_code == 200
    page1 = response.json()
    assert len(page1) == 10

    # Test second page
    response = client.get("/api/blog?limit=10&offset=10")
    assert response.status_code == 200
    page2 = response.json()
    assert len(page2) >= 5  # At least 5 more posts


def test_list_blog_posts_published_only(client: TestClient, db_session: Session):
    """Test that only published posts are returned by default."""
    published_post = BlogPost(
        title="Published Post",
        slug="published-post",
        excerpt="Published excerpt",
        content="Published content",
        category="M&A Strategy",
        primary_keyword="published",
        meta_description="Published meta",
        author="Test Author",
        read_time_minutes=5,
        published=True,
    )
    draft_post = BlogPost(
        title="Draft Post",
        slug="draft-post",
        excerpt="Draft excerpt",
        content="Draft content",
        category="M&A Strategy",
        primary_keyword="draft",
        meta_description="Draft meta",
        author="Test Author",
        read_time_minutes=5,
        published=False,
    )
    db_session.add_all([published_post, draft_post])
    db_session.commit()

    response = client.get("/api/blog")

    assert response.status_code == 200
    data = response.json()

    # Should not include draft posts
    assert all(post["published"] is True for post in data)
    assert not any(post["slug"] == "draft-post" for post in data)


def test_create_blog_post_success(client: TestClient, db_session: Session):
    """Ensure POST /api/blog creates a blog post."""
    payload = {
        "title": "New FP&A Insights",
        "slug": "new-fpa-insights",
        "excerpt": "Short FP&A summary",
        "content": "## Full content\n\nLots of insights.",
        "category": "FP&A",
        "primary_keyword": "FP&A insights",
        "secondary_keywords": ["finance", "planning"],
        "meta_description": "FP&A description",
        "featured_image_url": "https://example.com/fpa.jpg",
        "author": "Automation",
        "read_time_minutes": 6,
        "published": True,
    }

    response = client.post("/api/blog", json=payload)

    assert response.status_code == 201, response.text
    data = response.json()
    assert data["slug"] == payload["slug"]
    assert data["secondary_keywords"] == ["finance", "planning"]

    post = db_session.execute(
        select(BlogPost).where(BlogPost.slug == payload["slug"])
    ).scalar_one()
    assert post.title == payload["title"]


def test_create_blog_post_duplicate_slug_returns_409(client: TestClient, db_session: Session):
    """Duplicate slugs should return 409 Conflict."""
    existing = BlogPost(
        title="Existing Post",
        slug="duplicate-slug",
        excerpt="Existing",
        content="Existing content",
        category="M&A Strategy",
        primary_keyword="existing",
        meta_description="Existing meta",
        author="Tester",
        read_time_minutes=5,
        published=True,
    )
    db_session.add(existing)
    db_session.commit()

    payload = {
        "title": "New Post",
        "slug": "duplicate-slug",
        "excerpt": "New excerpt",
        "content": "New content",
        "category": "M&A Strategy",
        "primary_keyword": "new",
        "meta_description": "New meta",
        "published": False,
    }

    response = client.post("/api/blog", json=payload)

    assert response.status_code == 409
