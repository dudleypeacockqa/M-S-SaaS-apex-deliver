"""
Tests for blog API endpoints.

Tests cover:
- GET /api/blog (list with filters)
- GET /api/blog/{slug} (single post)
- GET /api/blog/categories/list (categories)
"""

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timezone

from app.models.blog_post import BlogPost


@pytest.fixture
async def sample_blog_posts(db: AsyncSession):
    """Create sample blog posts for testing."""
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
            featured_image_url=None,  # Test null image
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
            published=False,  # Unpublished
            published_at=None,
            read_time_minutes=5,
        ),
    ]

    for post in posts:
        db.add(post)
    await db.commit()

    # Refresh to get IDs
    for post in posts:
        await db.refresh(post)

    return posts


@pytest.mark.asyncio
async def test_list_blog_posts_default(client: AsyncClient, sample_blog_posts):
    """Test listing blog posts with default parameters (published only)."""
    response = await client.get("/api/blog")

    assert response.status_code == 200
    data = response.json()

    assert isinstance(data, list)
    assert len(data) == 3  # Only published posts
    assert all(post["published"] is True for post in data)

    # Verify response structure
    first_post = data[0]
    assert "id" in first_post
    assert "title" in first_post
    assert "slug" in first_post
    assert "excerpt" in first_post
    assert "content" in first_post
    assert "category" in first_post
    assert "author" in first_post
    assert "read_time_minutes" in first_post
    assert "published" in first_post
    assert "published_at" in first_post
    assert "created_at" in first_post
    assert "updated_at" in first_post


@pytest.mark.asyncio
async def test_list_blog_posts_with_category_filter(client: AsyncClient, sample_blog_posts):
    """Test filtering blog posts by category."""
    response = await client.get("/api/blog?category=FP%26A")

    assert response.status_code == 200
    data = response.json()

    assert len(data) == 1
    assert data[0]["category"] == "FP&A"
    assert data[0]["title"] == "Advanced FP&A Techniques"


@pytest.mark.asyncio
async def test_list_blog_posts_with_search(client: AsyncClient, sample_blog_posts):
    """Test searching blog posts in title, excerpt, or content."""
    response = await client.get("/api/blog?search=integration")

    assert response.status_code == 200
    data = response.json()

    assert len(data) == 1
    assert "PMI" in data[0]["title"]


@pytest.mark.asyncio
async def test_list_blog_posts_include_unpublished(client: AsyncClient, sample_blog_posts):
    """Test listing all blog posts including unpublished."""
    response = await client.get("/api/blog?published_only=false")

    assert response.status_code == 200
    data = response.json()

    assert len(data) == 4  # All 4 posts including unpublished
    unpublished = [p for p in data if not p["published"]]
    assert len(unpublished) == 1
    assert unpublished[0]["slug"] == "unpublished-draft-post"


@pytest.mark.asyncio
async def test_list_blog_posts_with_pagination(client: AsyncClient, sample_blog_posts):
    """Test pagination with limit and offset."""
    # Get first 2 posts
    response1 = await client.get("/api/blog?limit=2")
    assert response1.status_code == 200
    data1 = response1.json()
    assert len(data1) == 2

    # Get next post with offset
    response2 = await client.get("/api/blog?limit=2&offset=2")
    assert response2.status_code == 200
    data2 = response2.json()
    assert len(data2) == 1  # Only 3 published total, offset 2 means 1 remaining

    # Ensure different posts
    assert data1[0]["id"] != data2[0]["id"]


@pytest.mark.asyncio
async def test_list_blog_posts_empty_result(client: AsyncClient, sample_blog_posts):
    """Test filtering that returns no results."""
    response = await client.get("/api/blog?category=Nonexistent+Category")

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 0
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_get_blog_post_by_slug_success(client: AsyncClient, sample_blog_posts):
    """Test retrieving a single blog post by slug."""
    response = await client.get("/api/blog/test-ma-strategy-post")

    assert response.status_code == 200
    data = response.json()

    assert data["slug"] == "test-ma-strategy-post"
    assert data["title"] == "Test M&A Strategy Post"
    assert data["category"] == "M&A Strategy"
    assert data["author"] == "Dudley Peacock"
    assert data["read_time_minutes"] == 8
    assert data["published"] is True
    assert data["primary_keyword"] == "M&A strategy"
    assert "deal flow" in data["secondary_keywords"]


@pytest.mark.asyncio
async def test_get_blog_post_by_slug_not_found(client: AsyncClient, sample_blog_posts):
    """Test retrieving a blog post with invalid slug."""
    response = await client.get("/api/blog/nonexistent-slug-12345")

    assert response.status_code == 404
    data = response.json()
    assert "detail" in data
    assert "not found" in data["detail"].lower()


@pytest.mark.asyncio
async def test_get_unpublished_post_by_slug(client: AsyncClient, sample_blog_posts):
    """Test that unpublished posts can still be retrieved by slug (for preview)."""
    response = await client.get("/api/blog/unpublished-draft-post")

    assert response.status_code == 200
    data = response.json()
    assert data["published"] is False
    assert data["slug"] == "unpublished-draft-post"


@pytest.mark.asyncio
async def test_list_blog_categories(client: AsyncClient, sample_blog_posts):
    """Test listing all unique blog categories."""
    response = await client.get("/api/blog/categories/list")

    assert response.status_code == 200
    data = response.json()

    assert isinstance(data, list)
    assert len(data) == 3  # M&A Strategy, FP&A, PMI
    assert "M&A Strategy" in data
    assert "FP&A" in data
    assert "PMI" in data


@pytest.mark.asyncio
async def test_list_blog_categories_empty_database(client: AsyncClient, db: AsyncSession):
    """Test listing categories when database is empty."""
    response = await client.get("/api/blog/categories/list")

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 0


@pytest.mark.asyncio
async def test_list_blog_posts_with_invalid_limit(client: AsyncClient, sample_blog_posts):
    """Test that limit parameter is validated."""
    # Limit too high
    response = await client.get("/api/blog?limit=200")
    assert response.status_code == 422  # Validation error

    # Limit too low
    response = await client.get("/api/blog?limit=0")
    assert response.status_code == 422  # Validation error


@pytest.mark.asyncio
async def test_list_blog_posts_with_invalid_offset(client: AsyncClient, sample_blog_posts):
    """Test that offset parameter is validated."""
    response = await client.get("/api/blog?offset=-1")
    assert response.status_code == 422  # Validation error


@pytest.mark.asyncio
async def test_blog_post_response_schema(client: AsyncClient, sample_blog_posts):
    """Test that blog post response matches expected schema."""
    response = await client.get("/api/blog/test-ma-strategy-post")

    assert response.status_code == 200
    data = response.json()

    # Required fields
    required_fields = [
        "id", "title", "slug", "excerpt", "content", "category",
        "primary_keyword", "secondary_keywords", "meta_description",
        "author", "read_time_minutes", "published", "created_at", "updated_at"
    ]

    for field in required_fields:
        assert field in data, f"Missing required field: {field}"

    # Optional fields
    assert "featured_image_url" in data  # Can be null
    assert "published_at" in data  # Can be null for unpublished

    # Type checks
    assert isinstance(data["id"], int)
    assert isinstance(data["title"], str)
    assert isinstance(data["read_time_minutes"], int)
    assert isinstance(data["published"], bool)


@pytest.mark.asyncio
async def test_blog_search_case_insensitive(client: AsyncClient, sample_blog_posts):
    """Test that search is case-insensitive."""
    response_upper = await client.get("/api/blog?search=STRATEGY")
    response_lower = await client.get("/api/blog?search=strategy")

    assert response_upper.status_code == 200
    assert response_lower.status_code == 200

    data_upper = response_upper.json()
    data_lower = response_lower.json()

    assert len(data_upper) == len(data_lower)
    assert len(data_upper) >= 1  # Should find at least the M&A Strategy post


@pytest.mark.asyncio
async def test_blog_list_ordering(client: AsyncClient, sample_blog_posts):
    """Test that blog posts are ordered by published_at desc (newest first)."""
    response = await client.get("/api/blog")

    assert response.status_code == 200
    data = response.json()

    # With our sample data, verify order
    assert len(data) >= 2

    # Verify timestamps are in descending order
    for i in range(len(data) - 1):
        current_time = data[i]["published_at"]
        next_time = data[i + 1]["published_at"]
        # Most recent should be first (or equal if same second)
        assert current_time >= next_time
