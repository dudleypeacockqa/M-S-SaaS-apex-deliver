"""Blog API routes for marketing website."""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, desc, or_
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.blog_post import BlogPost
from pydantic import BaseModel

router = APIRouter(prefix="/blog", tags=["blog"])


class BlogPostResponse(BaseModel):
    """Blog post response schema."""
    id: int
    title: str
    slug: str
    excerpt: str
    content: str
    category: str
    primary_keyword: str
    secondary_keywords: List[str]
    meta_description: str
    featured_image: Optional[str]
    author: str
    read_time_minutes: int
    published: bool
    published_at: Optional[str]
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True


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
    
    # Order by published date (newest first)
    query = query.order_by(desc(BlogPost.published_at))
    
    # Apply pagination
    query = query.offset(offset).limit(limit)
    
    result = db.execute(query)
    posts = result.scalars().all()
    
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
            featured_image=post.featured_image_url,
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
    query = select(BlogPost).where(BlogPost.slug == slug)
    result = db.execute(query)
    post = result.scalar_one_or_none()
    
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
        featured_image=post.featured_image_url,
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
    query = select(BlogPost.category).distinct()
    result = db.execute(query)
    categories = [row[0] for row in result.all()]
    return categories
