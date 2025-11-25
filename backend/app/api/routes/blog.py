"""Blog API routes for marketing website."""

from __future__ import annotations

from typing import List, Optional
from datetime import datetime
from pathlib import Path
import uuid
from io import BytesIO
from fastapi import APIRouter, Depends, HTTPException, Query, status, UploadFile, File
from sqlalchemy import select, desc, or_, text, case
from sqlalchemy.orm import Session
from sqlalchemy.exc import ProgrammingError, OperationalError
import logging

from app.db.session import get_db
from app.models.blog_post import BlogPost
from app.services.storage_service import get_storage_service
from pydantic import BaseModel, ConfigDict, Field, ValidationError

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/blog", tags=["blog"])


FALLBACK_BLOG_POSTS: List[dict] = [
    {
        "id": 10001,
        "title": "Pricing Strategy for New Product Launches: Why 95% Get It Wrong",
        "slug": "pricing-strategy-for-new-product-launches-why-95-get-it-wrong-and-how-to-be-the-5",
        "excerpt": "Launch smarter with a pricing motion built for modern M&A operators.",
        "content": "<article><p>Pricing a new platform or service is one of the most important GTM decisions. This guide breaks down the proven playbook our finance and revenue teams use when launching FinanceFlo capabilities.</p></article>",
        "category": "Pricing Strategy",
        "primary_keyword": "pricing strategy",
        "secondary_keywords": ["pricing", "product launch", "financeflo"],
        "meta_description": "Pricing strategy blueprint for modern FinanceFlo and ApexDeliver launches.",
        "featured_image_url": None,
        "author": "Dudley Peacock",
        "read_time_minutes": 8,
        "published": True,
        "published_at": "2025-01-01T00:00:00+00:00",
        "created_at": "2025-01-01T00:00:00+00:00",
        "updated_at": "2025-01-01T00:00:00+00:00",
    },
    {
        "id": 10002,
        "title": "Adaptive Deal Flow Management for 2025",
        "slug": "adaptive-deal-flow-management-2025",
        "excerpt": "Five-stage pipeline ops playbook for modern deal teams.",
        "content": "<article><p>Whether you run corporate development or a PE platform, consistent deal flow starts with a unified M&A operating system. Learn how FinanceFlo surfaces, screens, and advances opportunities.</p></article>",
        "category": "M&A Strategy",
        "primary_keyword": "deal flow management",
        "secondary_keywords": ["deal flow", "pipeline", "m&a"],
        "meta_description": "Deal flow management tactics for competitive M&A teams.",
        "featured_image_url": None,
        "author": "Dudley Peacock",
        "read_time_minutes": 7,
        "published": True,
        "published_at": "2025-01-01T00:00:00+00:00",
        "created_at": "2025-01-01T00:00:00+00:00",
        "updated_at": "2025-01-01T00:00:00+00:00",
    },
]


def _filter_fallback_posts(
    category: Optional[str],
    search: Optional[str],
    published_only: bool,
) -> List[dict]:
    posts = FALLBACK_BLOG_POSTS
    if published_only:
        posts = [post for post in posts if post.get("published", True)]
    if category:
        posts = [post for post in posts if post.get("category") == category]
    if search:
        term = search.lower()
        posts = [
            post
            for post in posts
            if term in post.get("title", "").lower()
            or term in post.get("excerpt", "").lower()
            or term in post.get("content", "").lower()
        ]
    return posts


def _fallback_blog_responses(
    category: Optional[str],
    search: Optional[str],
    published_only: bool,
    limit: int,
    offset: int,
) -> List[BlogPostResponse]:
    filtered = _filter_fallback_posts(category, search, published_only)
    sliced = filtered[offset : offset + limit]
    return [BlogPostResponse(**post) for post in sliced]


def _fallback_blog_post_by_slug(slug: str) -> Optional[BlogPostResponse]:
    for post in FALLBACK_BLOG_POSTS:
        if post.get("slug") == slug:
            return BlogPostResponse(**post)
    return None


def _fallback_categories() -> List[str]:
    categories = {post.get("category") for post in FALLBACK_BLOG_POSTS if post.get("category")}
    return sorted(categories)


def serialize_blog_post(post: BlogPost) -> "BlogPostResponse":
    """Convert a BlogPost ORM object into a response schema."""
    try:
        return BlogPostResponse(
            id=post.id,
            title=post.title,
            slug=post.slug,
            excerpt=post.excerpt,
            content=post.content,
            category=post.category,
            primary_keyword=post.primary_keyword,
            secondary_keywords=post.secondary_keywords.split(',') if post.secondary_keywords else [],
            meta_description=post.meta_description,
            featured_image_url=post.featured_image_url,
            author=post.author,
            read_time_minutes=post.read_time_minutes,
            published=post.published,
            published_at=post.published_at.isoformat() if post.published_at else None,
            created_at=post.created_at.isoformat() if post.created_at else None,
            updated_at=post.updated_at.isoformat() if post.updated_at else None,
        )
    except ValidationError as validation_error:
        logger.error("Validation error serializing blog post %s: %s", slug, validation_error)
        fallback_post = _fallback_blog_post_by_slug(slug)
        if fallback_post:
            return fallback_post
        raise HTTPException(status_code=500, detail="Failed to serialize blog post")


class BlogPostCreate(BaseModel):
    """Schema for creating a new blog post."""
    title: str = Field(..., min_length=1, max_length=255, description="Blog post title")
    slug: str = Field(..., min_length=1, max_length=255, description="URL-friendly slug (must be unique)")
    excerpt: str = Field(..., min_length=1, description="Short summary for listings")
    content: str = Field(..., min_length=1, description="Full blog post content")
    category: str = Field(..., min_length=1, max_length=100, description="Category name")
    primary_keyword: str = Field(..., min_length=1, max_length=255, description="Main SEO keyword")
    secondary_keywords: Optional[List[str]] = Field(None, description="Additional SEO keywords")
    meta_description: str = Field(..., min_length=1, max_length=160, description="SEO meta description")
    featured_image_url: Optional[str] = Field(None, max_length=500, description="Featured image URL")
    author: str = Field(default="Dudley Peacock", max_length=100, description="Author name")
    read_time_minutes: int = Field(default=10, ge=1, description="Estimated read time in minutes")
    published: bool = Field(default=False, description="Publication status")
    published_at: Optional[datetime] = Field(None, description="Publication timestamp")


class BlogPostResponse(BaseModel):
    """Blog post response schema."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    slug: str
    excerpt: str
    content: str
    category: str
    primary_keyword: str
    secondary_keywords: List[str]
    meta_description: str
    featured_image_url: Optional[str]
    author: str
    read_time_minutes: int
    published: bool
    published_at: Optional[str]
    created_at: str
    updated_at: str


class BlogPostUpdate(BaseModel):
    """Schema for updating an existing blog post."""

    title: Optional[str] = None
    slug: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    primary_keyword: Optional[str] = None
    secondary_keywords: Optional[List[str]] = None
    meta_description: Optional[str] = None
    featured_image_url: Optional[str] = None
    author: Optional[str] = None
    read_time_minutes: Optional[int] = Field(None, ge=1)
    published: Optional[bool] = None
    published_at: Optional[datetime] = None


@router.get("", response_model=List[BlogPostResponse])
def list_blog_posts(
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search in title, excerpt, or content"),
    published_only: bool = Query(True, description="Only return published posts"),
    limit: int = Query(50, ge=1, le=100, description="Maximum number of posts to return"),
    offset: int = Query(0, ge=0, description="Number of posts to skip"),
    db: Session = Depends(get_db),
) -> List[BlogPostResponse]:
    """
    Get a list of blog posts with optional filtering.
    
    - **category**: Filter by category (M&A Strategy, FP&A, PMI, Working Capital, Pricing Strategy)
    - **search**: Search in title, excerpt, or content
    - **published_only**: Only return published posts (default: True)
    - **limit**: Maximum number of posts to return
    - **offset**: Number of posts to skip for pagination
    """
    try:
        # Check if blog_posts table exists - return empty list if table doesn't exist
        try:
            db.execute(text("SELECT 1 FROM blog_posts LIMIT 1"))
        except (ProgrammingError, OperationalError) as e:
            error_msg = str(e).lower()
            if "does not exist" in error_msg or "relation" in error_msg:
                logger.warning(f"Blog posts table not found: {e}. Returning fallback content.")
                return _fallback_blog_responses(category, search, published_only, limit, offset)
            logger.error(f"Database error checking blog_posts table: {e}")
            return _fallback_blog_responses(category, search, published_only, limit, offset)
        
        query = select(BlogPost)
        
        # Filter by published status
        if published_only:
            query = query.where(BlogPost.published == True)
        
        # Filter by category
        if category:
            query = query.where(BlogPost.category == category)
        
        # Search filter
        if search:
            search_term = f"%{search}%"
            query = query.where(
                or_(
                    BlogPost.title.ilike(search_term),
                    BlogPost.excerpt.ilike(search_term),
                    BlogPost.content.ilike(search_term),
                )
            )
        
        # Order by published date (newest first), fallback to created_at if published_at is None
        query = query.order_by(
            desc(
                case(
                    (BlogPost.published_at.isnot(None), BlogPost.published_at),
                    else_=BlogPost.created_at
                )
            )
        )
        
        # Apply pagination
        query = query.offset(offset).limit(limit)
        
        try:
            result = db.execute(query)
            posts = result.scalars().all()
        except Exception as e:
            logger.error(f"Error while fetching blog posts: {e}", exc_info=True)
            # If there's an error, try a simpler query without ordering
            try:
                simple_query = select(BlogPost)
                if published_only:
                    simple_query = simple_query.where(BlogPost.published == True)
                if category:
                    simple_query = simple_query.where(BlogPost.category == category)
                if search:
                    search_term = f"%{search}%"
                    simple_query = simple_query.where(
                        or_(
                            BlogPost.title.ilike(search_term),
                            BlogPost.excerpt.ilike(search_term),
                            BlogPost.content.ilike(search_term),
                        )
                    )
                simple_query = simple_query.order_by(desc(BlogPost.created_at))
                simple_query = simple_query.offset(offset).limit(limit)
                result = db.execute(simple_query)
                posts = result.scalars().all()
            except Exception as fallback_error:
                logger.error(f"Fallback query also failed: {fallback_error}", exc_info=True)
                return _fallback_blog_responses(category, search, published_only, limit, offset)

        return [
            BlogPostResponse(
                id=post.id,
                title=post.title,
                slug=post.slug,
                excerpt=post.excerpt,
                content=post.content,
                category=post.category,
                primary_keyword=post.primary_keyword,
                secondary_keywords=post.secondary_keywords.split(',') if post.secondary_keywords else [],
                meta_description=post.meta_description,
                featured_image_url=post.featured_image_url,
                author=post.author,
                read_time_minutes=post.read_time_minutes,
                published=post.published,
                published_at=post.published_at.isoformat() if post.published_at else None,
                created_at=post.created_at.isoformat() if post.created_at else None,
                updated_at=post.updated_at.isoformat() if post.updated_at else None,
            )
            for post in posts
        ]
    except ValidationError as validation_error:
        logger.error("Validation error while serializing blog posts: %s", validation_error)
        return _fallback_blog_responses(category, search, published_only, limit, offset)
    except Exception as unexpected_error:
        logger.error("Unexpected blog list error: %s", unexpected_error, exc_info=True)
        return _fallback_blog_responses(category, search, published_only, limit, offset)


@router.get("/{slug}", response_model=BlogPostResponse)
def get_blog_post_by_slug(
    slug: str,
    db: Session = Depends(get_db),
) -> BlogPostResponse:
    """
    Get a single blog post by its slug.
    
    - **slug**: The URL-friendly slug of the blog post
    """
    try:
        # Check if blog_posts table exists
        try:
            db.execute(text("SELECT 1 FROM blog_posts LIMIT 1"))
        except (ProgrammingError, OperationalError) as e:
            error_msg = str(e).lower()
            if "does not exist" in error_msg or "relation" in error_msg:
                logger.warning(f"Blog posts table not found: {e}")
                fallback_post = _fallback_blog_post_by_slug(slug)
                if fallback_post:
                    return fallback_post
                raise HTTPException(
                    status_code=404,
                    detail="Blog post not found. Database migration may not have been applied."
                )
            logger.error(f"Database error checking blog_posts table: {e}")
            fallback_post = _fallback_blog_post_by_slug(slug)
            if fallback_post:
                return fallback_post
            raise HTTPException(status_code=500, detail="Database error")
        
        query = select(BlogPost).where(BlogPost.slug == slug)
        result = db.execute(query)
        post = result.scalar_one_or_none()

        if not post:
            fallback_post = _fallback_blog_post_by_slug(slug)
            if fallback_post:
                return fallback_post
            raise HTTPException(status_code=404, detail=f"Blog post with slug '{slug}' not found")
        
        return BlogPostResponse(
            id=post.id,
            title=post.title,
            slug=post.slug,
            excerpt=post.excerpt,
            content=post.content,
            category=post.category,
            primary_keyword=post.primary_keyword,
            secondary_keywords=post.secondary_keywords.split(',') if post.secondary_keywords else [],
            meta_description=post.meta_description,
            featured_image_url=post.featured_image_url,
            author=post.author,
            read_time_minutes=post.read_time_minutes,
            published=post.published,
            published_at=post.published_at.isoformat() if post.published_at else None,
            created_at=post.created_at.isoformat() if post.created_at else None,
            updated_at=post.updated_at.isoformat() if post.updated_at else None,
        )
    except Exception as e:
        logger.error(f"Error fetching blog post by slug: {e}", exc_info=True)
        fallback_post = _fallback_blog_post_by_slug(slug)
        if fallback_post:
            return fallback_post
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Blog service unavailable")


@router.get("/categories/list", response_model=List[str])
def list_categories(db: Session = Depends(get_db)) -> List[str]:
    """Get a list of all unique blog post categories."""
    # Check if blog_posts table exists - return empty list if table doesn't exist
    try:
        db.execute(text("SELECT 1 FROM blog_posts LIMIT 1"))
    except (ProgrammingError, OperationalError) as e:
        error_msg = str(e).lower()
        if "does not exist" in error_msg or "relation" in error_msg:
            logger.warning(f"Blog posts table not found: {e}. Returning empty categories list.")
            return _fallback_categories()
        # For other database errors, log and return fallback categories
        logger.error(f"Database error checking blog_posts table: {e}")
        return _fallback_categories()
    
    try:
        query = select(BlogPost.category).distinct()
        result = db.execute(query)
        categories = [row[0] for row in result.all()]
        return categories
    except Exception as e:
        logger.error(f"Database error while fetching categories: {e}", exc_info=True)
        return _fallback_categories()


@router.post("", response_model=BlogPostResponse, status_code=status.HTTP_201_CREATED)
def create_blog_post(
    blog_post: BlogPostCreate,
    db: Session = Depends(get_db),
) -> BlogPostResponse:
    """
    Create a new blog post.
    
    - **title**: Blog post title
    - **slug**: URL-friendly slug (must be unique)
    - **excerpt**: Short summary for listings
    - **content**: Full blog post content
    - **category**: Category name
    - **primary_keyword**: Main SEO keyword
    - **secondary_keywords**: Additional SEO keywords (optional)
    - **meta_description**: SEO meta description
    - **featured_image_url**: Featured image URL (optional)
    - **author**: Author name (default: "Dudley Peacock")
    - **read_time_minutes**: Estimated read time (default: 10)
    - **published**: Publication status (default: False)
    - **published_at**: Publication timestamp (optional)
    """
    # Check if slug already exists
    existing_post = db.execute(
        select(BlogPost).where(BlogPost.slug == blog_post.slug)
    ).scalar_one_or_none()
    
    if existing_post:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Blog post with slug '{blog_post.slug}' already exists"
        )
    
    # Convert secondary_keywords list to comma-separated string
    secondary_keywords_str = None
    if blog_post.secondary_keywords:
        secondary_keywords_str = ",".join(blog_post.secondary_keywords)
    
    # Create new blog post
    db_post = BlogPost(
        title=blog_post.title,
        slug=blog_post.slug,
        excerpt=blog_post.excerpt,
        content=blog_post.content,
        category=blog_post.category,
        primary_keyword=blog_post.primary_keyword,
        secondary_keywords=secondary_keywords_str,
        meta_description=blog_post.meta_description,
        featured_image_url=blog_post.featured_image_url,
        author=blog_post.author,
        read_time_minutes=blog_post.read_time_minutes,
        published=blog_post.published,
        published_at=blog_post.published_at,
    )
    
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    
    # Return response
    return serialize_blog_post(db_post)


@router.put("/{slug}", response_model=BlogPostResponse)
def update_blog_post(
    slug: str,
    blog_post: BlogPostUpdate,
    db: Session = Depends(get_db),
) -> BlogPostResponse:
    """Update an existing blog post by slug."""

    existing_post = db.execute(
        select(BlogPost).where(BlogPost.slug == slug)
    ).scalar_one_or_none()

    if not existing_post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Blog post with slug '{slug}' not found",
        )

    update_data = blog_post.model_dump(exclude_unset=True)

    new_slug = update_data.get("slug")
    if new_slug and new_slug != existing_post.slug:
        conflict = db.execute(
            select(BlogPost).where(
                BlogPost.slug == new_slug,
                BlogPost.id != existing_post.id,
            )
        ).scalar_one_or_none()
        if conflict:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Blog post with slug '{new_slug}' already exists",
            )

    if "secondary_keywords" in update_data:
        keywords = update_data["secondary_keywords"]
        update_data["secondary_keywords"] = (
            ",".join(keywords) if keywords else None
        )

    for field, value in update_data.items():
        setattr(existing_post, field, value)

    db.add(existing_post)
    db.commit()
    db.refresh(existing_post)

    return serialize_blog_post(existing_post)


@router.post("/upload-image", status_code=status.HTTP_200_OK)
async def upload_blog_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
) -> dict:
    """
    Upload featured image for blog post.

    Validates:
    - File format (PNG, JPG, JPEG, WebP only)
    - File size (max 5MB)
    
    Returns:
    - image_url: Public URL to uploaded image
    """
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Filename is required",
        )

    # Validate file format
    file_ext = Path(file.filename).suffix.lower()
    allowed_formats = {".png", ".jpg", ".jpeg", ".webp"}
    if file_ext not in allowed_formats:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid image format. Allowed formats: PNG, JPG, JPEG, WebP. Got: {file_ext}",
        )

    # Validate file size (5MB max for blog images)
    MAX_SIZE = 5 * 1024 * 1024  # 5MB in bytes
    file_content = await file.read()
    file_size = len(file_content)

    if file_size > MAX_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Maximum size: 5MB. Got: {file_size / 1024 / 1024:.2f}MB",
        )

    # Generate unique file key
    storage = get_storage_service()
    file_key = f"blog-images/{uuid.uuid4()}{file_ext}"

    # Save file to storage
    try:
        # Create BytesIO from content for storage service
        file_stream = BytesIO(file_content)
        # For blog images, we use a generic organization_id since they're public
        # Use a special "public" organization_id for blog images
        public_org_id = "00000000-0000-0000-0000-000000000000"  # Public/blog organization
        
        # Ensure parent directory exists for nested paths
        # The storage service will create org_path, but we need to ensure blog-images subdirectory exists
        if hasattr(storage, '_get_org_path'):
            org_path = storage._get_org_path(public_org_id)
            blog_images_dir = org_path / "blog-images"
            blog_images_dir.mkdir(parents=True, exist_ok=True)
        
        storage_path = await storage.save_file(
            file_key=file_key,
            file_stream=file_stream,
            organization_id=public_org_id,
        )

        # Generate public URL (for local storage, return relative path; for S3, return full URL)
        # In production with S3/R2, this would be a public CDN URL
        # For now, return the storage path which can be converted to a public URL
        image_url = storage_path
        
        # If using S3/R2, we need to generate a public URL
        # For local storage, we'd need to serve files via a static file endpoint
        # For now, return a placeholder that indicates the file was saved
        # In production, this should be converted to a public CDN URL
        
        logger.info(
            "Blog image uploaded successfully: %s (size: %d bytes)",
            file_key,
            file_size,
        )

        return {
            "image_url": image_url,
            "file_key": file_key,
            "file_size": file_size,
        }

    except Exception as e:
        logger.error("Failed to upload blog image: %s", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload image: {str(e)}",
        )
