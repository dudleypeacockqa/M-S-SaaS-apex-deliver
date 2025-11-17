"""Community Platform API endpoints."""
from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.db.session import get_db
from app.models.community import PostCategory, PostStatus, ReactionType, TargetType
from app.models.user import User
from app.schemas.community import (
    CommentCreate,
    CommentResponse,
    CommunityAnalytics,
    FlaggedContent,
    FollowCreate,
    FollowResponse,
    FollowStats,
    ModerationActionCreate,
    ModerationActionResponse,
    PostCreate,
    PostListResponse,
    PostResponse,
    PostUpdate,
    ReactionCreate,
    ReactionResponse,
    ReactionSummary,
)
from app.services import community_service

router = APIRouter(prefix="/community", tags=["community"])


# ============================================================================
# Post Endpoints
# ============================================================================


@router.post("/posts", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
def create_post(
    post: PostCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create a new community post.

    The post is automatically associated with the current user's organization
    and the user is set as the author.
    """
    created_post = community_service.create_post(post, current_user, db)
    return created_post


@router.get("/posts", response_model=PostListResponse)
def list_posts(
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(20, ge=1, le=100, description="Items per page"),
    category: Optional[PostCategory] = Query(None, description="Filter by category"),
    status: Optional[PostStatus] = Query(None, description="Filter by status"),
    author_user_id: Optional[str] = Query(None, description="Filter by author"),
    search: Optional[str] = Query(None, description="Search in title/content"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    List all posts for the current user's organization.

    Supports pagination and filtering by category, status, and author.
    """
    posts, total = community_service.list_posts(
        organization_id=current_user.organization_id,
        db=db,
        page=page,
        per_page=per_page,
        category=category,
        status=status,
        author_user_id=author_user_id,
        search=search,
    )

    total_pages = (total + per_page - 1) // per_page if total > 0 else 0

    return PostListResponse(
        posts=posts,
        total=total,
        page=page,
        page_size=per_page,
        total_pages=total_pages,
    )


@router.get("/posts/{post_id}", response_model=PostResponse)
def get_post(
    post_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get post details by ID.

    Users can only view posts within their organization.
    View count is incremented on each retrieval.
    """
    post = community_service.get_post_by_id(post_id, current_user.organization_id, db)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found",
        )

    # Get comment count
    comments = community_service.get_comments_for_post(post_id, db)
    comment_count = len(comments)

    # Get reaction counts
    reaction_counts = community_service.get_reactions(TargetType.post, post_id, db)

    response = PostResponse.model_validate(post)
    response.comment_count = comment_count
    response.reaction_counts = reaction_counts

    return response


@router.put("/posts/{post_id}", response_model=PostResponse)
def update_post(
    post_id: str,
    post_update: PostUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Update a post.

    Only the author can update their own posts.
    """
    updated_post = community_service.update_post(post_id, post_update, current_user, db)
    if not updated_post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found or you don't have permission to update it",
        )
    return updated_post


@router.delete("/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Delete a post.

    Only the author can delete their own posts.
    """
    success = community_service.delete_post(post_id, current_user, db)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found or you don't have permission to delete it",
        )


# ============================================================================
# Comment Endpoints
# ============================================================================


@router.post("/posts/{post_id}/comments", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
def create_comment(
    post_id: str,
    comment: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Add a comment to a post.

    Supports nested replies via parent_comment_id.
    """
    created_comment = community_service.create_comment(comment, post_id, current_user, db)
    if not created_comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found",
        )
    return created_comment


@router.get("/posts/{post_id}/comments", response_model=list[CommentResponse])
def get_post_comments(
    post_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get all comments for a post, including nested replies.
    """
    comments = community_service.get_comments_for_post(post_id, db)

    # Build nested structure
    comment_map = {}
    root_comments = []

    for comment in comments:
        comment_dict = CommentResponse.model_validate(comment).model_dump()
        comment_dict["replies"] = []
        comment_map[comment.id] = comment_dict

        if comment.parent_comment_id is None:
            root_comments.append(comment_dict)

    # Nest replies
    for comment in comments:
        if comment.parent_comment_id:
            parent = comment_map.get(comment.parent_comment_id)
            if parent:
                parent["replies"].append(comment_map[comment.id])

    return root_comments


@router.delete("/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(
    comment_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Delete a comment.

    Only the author can delete their own comments.
    """
    success = community_service.delete_comment(comment_id, current_user, db)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found or you don't have permission to delete it",
        )


# ============================================================================
# Reaction Endpoints
# ============================================================================


@router.post("/reactions", response_model=ReactionResponse, status_code=status.HTTP_201_CREATED)
def add_reaction(
    reaction: ReactionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Add a reaction to a post or comment.

    Users cannot react twice with the same reaction type.
    """
    created_reaction = community_service.add_reaction(reaction, current_user, db)
    if not created_reaction:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You have already reacted with this type",
        )
    return created_reaction


@router.delete("/reactions/{target_type}/{target_id}/{reaction_type}", status_code=status.HTTP_204_NO_CONTENT)
def remove_reaction(
    target_type: TargetType,
    target_id: str,
    reaction_type: ReactionType,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Remove a reaction from a post or comment.
    """
    success = community_service.remove_reaction(target_type, target_id, reaction_type, current_user, db)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reaction not found",
        )


@router.get("/reactions/{target_type}/{target_id}", response_model=dict)
def get_reactions(
    target_type: TargetType,
    target_id: str,
    db: Session = Depends(get_db),
):
    """
    Get reaction counts for a post or comment.
    """
    counts = community_service.get_reactions(target_type, target_id, db)
    return counts


# ============================================================================
# Follow Endpoints
# ============================================================================


@router.post("/follow", response_model=FollowResponse, status_code=status.HTTP_201_CREATED)
def follow_user(
    follow: FollowCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Follow a user.

    Users cannot follow themselves or follow the same user twice.
    """
    created_follow = community_service.follow_user(follow, current_user, db)
    if not created_follow:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cannot follow yourself or already following this user",
        )
    # Convert UUID fields to strings for Pydantic validation
    return FollowResponse(
        id=str(created_follow.id),
        follower_user_id=str(created_follow.follower_user_id),
        following_user_id=str(created_follow.following_user_id),
        organization_id=str(created_follow.organization_id),
        created_at=created_follow.created_at,
    )


@router.delete("/follow/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def unfollow_user(
    user_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Unfollow a user.
    """
    success = community_service.unfollow_user(user_id, current_user, db)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Follow relationship not found",
        )


@router.get("/follow/stats/{user_id}", response_model=FollowStats)
def get_follow_stats(
    user_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get follow statistics for a user.
    """
    stats = community_service.get_follow_stats(user_id, db)

    # Check if current user is following this user
    followers = community_service.get_followers(user_id, db)
    is_following = any(f.follower_user_id == str(current_user.id) for f in followers)

    return FollowStats(
        user_id=user_id,
        followers_count=stats["followers_count"],
        following_count=stats["following_count"],
        is_following=is_following,
    )


@router.get("/follow/followers/{user_id}", response_model=list[FollowResponse])
def get_followers(
    user_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get list of users following this user.
    """
    followers = community_service.get_followers(user_id, db)
    # Convert UUID fields to strings for Pydantic validation
    return [
        FollowResponse(
            id=str(f.id),
            follower_user_id=str(f.follower_user_id),
            following_user_id=str(f.following_user_id),
            organization_id=str(f.organization_id),
            created_at=f.created_at,
        )
        for f in followers
    ]


@router.get("/follow/following/{user_id}", response_model=list[FollowResponse])
def get_following(
    user_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get list of users this user is following.
    """
    following = community_service.get_following(user_id, db)
    # Convert UUID fields to strings for Pydantic validation
    return [
        FollowResponse(
            id=str(f.id),
            follower_user_id=str(f.follower_user_id),
            following_user_id=str(f.following_user_id),
            organization_id=str(f.organization_id),
            created_at=f.created_at,
        )
        for f in following
    ]


# ============================================================================
# Moderation Endpoints
# ============================================================================


@router.post("/moderation/actions", response_model=ModerationActionResponse, status_code=status.HTTP_201_CREATED)
def moderate_content(
    moderation: ModerationActionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Moderate content (flag, approve, reject, delete).

    Requires admin/moderator permissions.
    """
    # Verify moderator permissions
    # Check if user is admin or has moderator role in organization
    if current_user.role not in ["admin", "owner"]:
        raise HTTPException(
            status_code=403,
            detail="Moderator or admin access required"
        )

    action = community_service.moderate_content(moderation, current_user, db)
    return action


@router.get("/moderation/flagged", response_model=list[FlaggedContent])
def get_flagged_content(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get list of flagged content for moderation.

    Requires admin/moderator permissions.
    """
    # Verify moderator permissions
    if current_user.role not in ["admin", "owner"]:
        raise HTTPException(
            status_code=403,
            detail="Moderator or admin access required"
        )

    flagged = community_service.get_flagged_content(current_user.organization_id, db)
    return flagged


# ============================================================================
# Analytics Endpoints
# ============================================================================


@router.get("/analytics", response_model=CommunityAnalytics)
def get_community_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get community analytics for the organization.
    """
    analytics = community_service.get_community_analytics(current_user.organization_id, db)
    return analytics
