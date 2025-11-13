"""Community platform schemas."""
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field, field_validator

from app.models.community import (
    ModerationActionType,
    PostCategory,
    PostStatus,
    ReactionType,
    TargetType,
)


# ============================================================================
# Post Schemas
# ============================================================================


class PostCreate(BaseModel):
    """Schema for creating a post."""

    title: str = Field(..., min_length=1, max_length=255)
    content: str = Field(..., min_length=1)
    category: PostCategory = PostCategory.general
    tags: Optional[str] = None
    status: PostStatus = PostStatus.published


class PostUpdate(BaseModel):
    """Schema for updating a post."""

    title: Optional[str] = Field(None, min_length=1, max_length=255)
    content: Optional[str] = Field(None, min_length=1)
    category: Optional[PostCategory] = None
    tags: Optional[str] = None
    status: Optional[PostStatus] = None


class PostResponse(BaseModel):
    """Schema for post response."""

    id: str
    organization_id: str
    author_user_id: str
    title: str
    content: str
    category: PostCategory
    tags: Optional[str] = None
    status: PostStatus
    view_count: int
    created_at: datetime
    updated_at: datetime
    comment_count: Optional[int] = 0
    reaction_counts: Optional[dict] = Field(default_factory=dict)

    class Config:
        from_attributes = True


class PostListResponse(BaseModel):
    """Schema for paginated post list."""

    posts: List[PostResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


# ============================================================================
# Comment Schemas
# ============================================================================


class CommentCreate(BaseModel):
    """Schema for creating a comment."""

    content: str = Field(..., min_length=1)
    parent_comment_id: Optional[str] = None


class CommentUpdate(BaseModel):
    """Schema for updating a comment."""

    content: str = Field(..., min_length=1)


class CommentResponse(BaseModel):
    """Schema for comment response."""

    id: str
    post_id: str
    author_user_id: str
    content: str
    parent_comment_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    reaction_counts: Optional[dict] = Field(default_factory=dict)
    replies: Optional[List["CommentResponse"]] = Field(default_factory=list)

    class Config:
        from_attributes = True


# ============================================================================
# Reaction Schemas
# ============================================================================


class ReactionCreate(BaseModel):
    """Schema for creating a reaction."""

    target_type: TargetType
    target_id: str
    reaction_type: ReactionType


class ReactionResponse(BaseModel):
    """Schema for reaction response."""

    id: str
    target_type: TargetType
    target_id: str
    user_id: str
    reaction_type: ReactionType
    created_at: datetime

    class Config:
        from_attributes = True


class ReactionSummary(BaseModel):
    """Schema for reaction summary by type."""

    reaction_type: ReactionType
    count: int
    user_reacted: bool = False


# ============================================================================
# Follow Schemas
# ============================================================================


class FollowCreate(BaseModel):
    """Schema for creating a follow relationship."""

    following_user_id: str

    @field_validator("following_user_id")
    @classmethod
    def validate_not_empty(cls, v: str) -> str:
        """Validate following_user_id is not empty."""
        if not v or not v.strip():
            raise ValueError("following_user_id cannot be empty")
        return v


class FollowResponse(BaseModel):
    """Schema for follow response."""

    id: str
    follower_user_id: str
    following_user_id: str
    organization_id: str
    created_at: datetime

    class Config:
        from_attributes = True


class FollowStats(BaseModel):
    """Schema for user follow statistics."""

    user_id: str
    followers_count: int
    following_count: int
    is_following: Optional[bool] = None


# ============================================================================
# Moderation Schemas
# ============================================================================


class ModerationActionCreate(BaseModel):
    """Schema for creating a moderation action."""

    target_type: TargetType
    target_id: str
    action_type: ModerationActionType
    reason: Optional[str] = None


class ModerationActionResponse(BaseModel):
    """Schema for moderation action response."""

    id: str
    target_type: TargetType
    target_id: str
    action_type: ModerationActionType
    moderator_user_id: str
    reason: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class FlaggedContent(BaseModel):
    """Schema for flagged content item."""

    target_type: TargetType
    target_id: str
    content_preview: str
    author_user_id: str
    flag_count: int
    last_flagged_at: datetime


# ============================================================================
# Analytics Schemas
# ============================================================================


class CommunityAnalytics(BaseModel):
    """Schema for community analytics."""

    total_posts: int
    total_comments: int
    total_reactions: int
    total_follows: int
    active_users_count: int
    top_categories: List[dict]
    recent_activity: List[dict]


class UserActivity(BaseModel):
    """Schema for user activity summary."""

    user_id: str
    posts_count: int
    comments_count: int
    reactions_given: int
    reactions_received: int
    followers_count: int
    following_count: int
