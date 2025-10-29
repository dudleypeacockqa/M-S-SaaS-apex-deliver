"""Blog post model for marketing content."""
from datetime import datetime
from typing import Optional
from sqlalchemy import Column, String, Text, DateTime, Integer, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class BlogPost(Base):
    """Blog post model for SEO-optimized marketing content."""
    
    __tablename__ = "blog_posts"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    excerpt: Mapped[str] = mapped_column(Text, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    author: Mapped[str] = mapped_column(String(100), nullable=False, default="Dudley Peacock")
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    primary_keyword: Mapped[str] = mapped_column(String(255), nullable=False)
    secondary_keywords: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    meta_description: Mapped[str] = mapped_column(String(160), nullable=False)
    featured_image_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    published: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    published_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    read_time_minutes: Mapped[int] = mapped_column(Integer, default=10, nullable=False)
    
    def __repr__(self) -> str:
        return f"<BlogPost(id={self.id}, title='{self.title}', slug='{self.slug}')>"
