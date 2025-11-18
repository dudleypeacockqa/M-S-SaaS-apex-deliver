"""Blog API routes for marketing website."""

from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, desc, or_, text, case
from sqlalchemy.orm import Session
from sqlalchemy.exc import ProgrammingError, OperationalError
import logging

from app.db.session import get_db
from app.models.blog_post import BlogPost
from pydantic import BaseModel, ConfigDict, Field

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/blog", tags=["blog"])


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
    # Check if blog_posts table exists - return empty list if table doesn't exist
    try:
        db.execute(text("SELECT 1 FROM blog_posts LIMIT 1"))
    except (ProgrammingError, OperationalError) as e:
        error_msg = str(e).lower()
        if "does not exist" in error_msg or "relation" in error_msg:
            logger.warning(f"Blog posts table not found: {e}. Returning empty list.")
            # Return empty list instead of 503 error to prevent site from breaking
            return []
        # For other database errors, log and return empty list
        logger.error(f"Database error checking blog_posts table: {e}")
        return []
    
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
    # This handles cases where published_at might be NULL
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
            raise HTTPException(
                status_code=500,
                detail=f"Database error: {str(fallback_error)}"
            )
    
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


@router.get("/{slug}", response_model=BlogPostResponse)
def get_blog_post_by_slug(
    slug: str,
    db: Session = Depends(get_db),
) -> BlogPostResponse:
    """
    Get a single blog post by its slug.
    
    - **slug**: The URL-friendly slug of the blog post
    """
    # Check if blog_posts table exists
    try:
        db.execute(text("SELECT 1 FROM blog_posts LIMIT 1"))
    except (ProgrammingError, OperationalError) as e:
        error_msg = str(e).lower()
        if "does not exist" in error_msg or "relation" in error_msg:
            logger.warning(f"Blog posts table not found: {e}")
            raise HTTPException(
                status_code=404,
                detail="Blog post not found. Database migration may not have been applied."
            )
        raise
    
    try:
        query = select(BlogPost).where(BlogPost.slug == slug)
        result = db.execute(query)
        post = result.scalar_one_or_none()
    except Exception as e:
        logger.error(f"Database error while fetching blog post: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )
    
    if not post:
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
            return []
        # For other database errors, log and return empty list
        logger.error(f"Database error checking blog_posts table: {e}")
        return []
    
    try:
        query = select(BlogPost.category).distinct()
        result = db.execute(query)
        categories = [row[0] for row in result.all()]
        return categories
    except Exception as e:
        logger.error(f"Database error while fetching categories: {e}", exc_info=True)
        # Return empty list instead of 500 error to prevent site from breaking
        return []


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
    return BlogPostResponse(
        id=db_post.id,
        title=db_post.title,
        slug=db_post.slug,
        excerpt=db_post.excerpt,
        content=db_post.content,
        category=db_post.category,
        primary_keyword=db_post.primary_keyword,
        secondary_keywords=db_post.secondary_keywords.split(',') if db_post.secondary_keywords else [],
        meta_description=db_post.meta_description,
        featured_image_url=db_post.featured_image_url,
        author=db_post.author,
        read_time_minutes=db_post.read_time_minutes,
        published=db_post.published,
        published_at=db_post.published_at.isoformat() if db_post.published_at else None,
        created_at=db_post.created_at.isoformat() if db_post.created_at else None,
        updated_at=db_post.updated_at.isoformat() if db_post.updated_at else None,
    )
