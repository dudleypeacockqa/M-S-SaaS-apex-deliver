"""Community platform models for social features."""
from __future__ import annotations

import enum
import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from app.db.base import Base, GUID


class PostStatus(str, enum.Enum):
    """Post status options."""

    draft = "draft"
    published = "published"
    archived = "archived"
    flagged = "flagged"


class PostCategory(str, enum.Enum):
    """Post category options."""

    general = "general"
    deals = "deals"
    insights = "insights"
    qa = "qa"
    networking = "networking"


class ReactionType(str, enum.Enum):
    """Reaction type options."""

    like = "like"
    love = "love"
    insightful = "insightful"
    celebrate = "celebrate"


class ModerationActionType(str, enum.Enum):
    """Moderation action type options."""

    approve = "approve"
    reject = "reject"
    flag = "flag"
    delete = "delete"
    unflag = "unflag"


class TargetType(str, enum.Enum):
    """Target type for reactions and moderation."""

    post = "post"
    comment = "comment"


class Post(Base):
    """Community post model."""

    __tablename__ = "community_posts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String(36), nullable=False, index=True)
    author_user_id = Column(GUID, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    category = Column(Enum(PostCategory, native_enum=False, length=32), default=PostCategory.general, nullable=False)
    tags = Column(Text, nullable=True)  # Comma-separated tags
    status = Column(Enum(PostStatus, native_enum=False, length=32), default=PostStatus.published, nullable=False)
    view_count = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan")
    reactions = relationship(
        "Reaction",
        primaryjoin="and_(Post.id == foreign(Reaction.target_id), Reaction.target_type == 'post')",
        viewonly=True,
    )

    __table_args__ = (
        Index("idx_community_posts_org_id", "organization_id"),
        Index("idx_community_posts_author", "author_user_id"),
        Index("idx_community_posts_status", "status"),
        Index("idx_community_posts_category", "category"),
        Index("idx_community_posts_created", "created_at"),
    )

    def __repr__(self) -> str:  # pragma: no cover
        return f"Post(id={self.id!s}, title={self.title!r})"


class Comment(Base):
    """Comment model for posts and nested replies."""

    __tablename__ = "community_comments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    post_id = Column(String(36), ForeignKey("community_posts.id"), nullable=False, index=True)
    author_user_id = Column(GUID, ForeignKey("users.id"), nullable=False, index=True)
    content = Column(Text, nullable=False)
    parent_comment_id = Column(String(36), ForeignKey("community_comments.id"), nullable=True, index=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    post = relationship("Post", back_populates="comments")
    parent = relationship("Comment", remote_side=[id], backref="replies")
    reactions = relationship(
        "Reaction",
        primaryjoin="and_(Comment.id == foreign(Reaction.target_id), Reaction.target_type == 'comment')",
        viewonly=True,
    )

    __table_args__ = (
        Index("idx_community_comments_post", "post_id"),
        Index("idx_community_comments_author", "author_user_id"),
        Index("idx_community_comments_parent", "parent_comment_id"),
        Index("idx_community_comments_created", "created_at"),
    )

    def __repr__(self) -> str:  # pragma: no cover
        return f"Comment(id={self.id!s}, post_id={self.post_id!s})"


class Reaction(Base):
    """Reaction model for posts and comments."""

    __tablename__ = "community_reactions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    target_type = Column(Enum(TargetType, native_enum=False, length=32), nullable=False)
    target_id = Column(String(36), nullable=False, index=True)
    user_id = Column(GUID, ForeignKey("users.id"), nullable=False, index=True)
    reaction_type = Column(Enum(ReactionType, native_enum=False, length=32), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    __table_args__ = (
        Index("idx_community_reactions_target", "target_type", "target_id"),
        Index("idx_community_reactions_user", "user_id"),
        Index("idx_community_reactions_unique", "target_type", "target_id", "user_id", "reaction_type", unique=True),
    )

    def __repr__(self) -> str:  # pragma: no cover
        return f"Reaction(id={self.id!s}, type={self.reaction_type!s})"


class Follow(Base):
    """Follow relationship between users."""

    __tablename__ = "community_follows"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    follower_user_id = Column(GUID, ForeignKey("users.id"), nullable=False, index=True)
    following_user_id = Column(GUID, ForeignKey("users.id"), nullable=False, index=True)
    organization_id = Column(String(36), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    __table_args__ = (
        Index("idx_community_follows_follower", "follower_user_id"),
        Index("idx_community_follows_following", "following_user_id"),
        Index("idx_community_follows_org", "organization_id"),
        Index("idx_community_follows_unique", "follower_user_id", "following_user_id", unique=True),
    )

    def __repr__(self) -> str:  # pragma: no cover
        return f"Follow(id={self.id!s}, follower={self.follower_user_id!s}, following={self.following_user_id!s})"


class ModerationAction(Base):
    """Moderation action log."""

    __tablename__ = "community_moderation_actions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    target_type = Column(Enum(TargetType, native_enum=False, length=32), nullable=False)
    target_id = Column(String(36), nullable=False, index=True)
    action_type = Column(Enum(ModerationActionType, native_enum=False, length=32), nullable=False)
    moderator_user_id = Column(GUID, ForeignKey("users.id"), nullable=False, index=True)
    reason = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    __table_args__ = (
        Index("idx_community_moderation_target", "target_type", "target_id"),
        Index("idx_community_moderation_moderator", "moderator_user_id"),
        Index("idx_community_moderation_created", "created_at"),
    )

    def __repr__(self) -> str:  # pragma: no cover
        return f"ModerationAction(id={self.id!s}, action={self.action_type!s})"
