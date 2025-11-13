"""Service layer for Community Platform operations."""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import and_, func, or_, select
from sqlalchemy.orm import Session

from app.models.community import (
    Comment,
    Follow,
    ModerationAction,
    ModerationActionType,
    Post,
    PostCategory,
    PostStatus,
    Reaction,
    ReactionType,
    TargetType,
)
from app.models.user import User
from app.schemas.community import (
    CommentCreate,
    CommentUpdate,
    FollowCreate,
    ModerationActionCreate,
    PostCreate,
    PostUpdate,
    ReactionCreate,
)


# ============================================================================
# Post Operations
# ============================================================================


def create_post(post_data: PostCreate, author: User, db: Session) -> Post:
    """
    Create a new community post.

    Args:
        post_data: Post creation data
        author: User creating the post
        db: Database session

    Returns:
        Created post instance
    """
    post = Post(
        organization_id=author.organization_id,
        author_user_id=str(author.id),
        title=post_data.title,
        content=post_data.content,
        category=post_data.category,
        tags=post_data.tags,
        status=post_data.status,
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


def get_post_by_id(post_id: str, organization_id: str, db: Session) -> Optional[Post]:
    """
    Get post by ID (organization-scoped).

    Args:
        post_id: Post ID
        organization_id: Organization ID for multi-tenant isolation
        db: Database session

    Returns:
        Post instance or None if not found
    """
    post = db.scalar(select(Post).where(Post.id == post_id, Post.organization_id == organization_id))

    # Increment view count
    if post:
        post.view_count += 1
        db.commit()
        db.refresh(post)

    return post


def update_post(post_id: str, post_data: PostUpdate, user: User, db: Session) -> Optional[Post]:
    """
    Update a post (author only).

    Args:
        post_id: Post ID
        post_data: Post update data
        user: User updating the post
        db: Database session

    Returns:
        Updated post instance or None if not found/unauthorized
    """
    post = db.scalar(
        select(Post).where(
            Post.id == post_id,
            Post.organization_id == user.organization_id,
            Post.author_user_id == str(user.id),
        )
    )

    if not post:
        return None

    # Update fields
    if post_data.title is not None:
        post.title = post_data.title
    if post_data.content is not None:
        post.content = post_data.content
    if post_data.category is not None:
        post.category = post_data.category
    if post_data.tags is not None:
        post.tags = post_data.tags
    if post_data.status is not None:
        post.status = post_data.status

    db.commit()
    db.refresh(post)
    return post


def delete_post(post_id: str, user: User, db: Session) -> bool:
    """
    Delete a post (author only).

    Args:
        post_id: Post ID
        user: User deleting the post
        db: Database session

    Returns:
        True if deleted, False if not found/unauthorized
    """
    post = db.scalar(
        select(Post).where(
            Post.id == post_id,
            Post.organization_id == user.organization_id,
            Post.author_user_id == str(user.id),
        )
    )

    if not post:
        return False

    db.delete(post)
    db.commit()
    return True


def list_posts(
    organization_id: str,
    db: Session,
    page: int = 1,
    per_page: int = 20,
    category: Optional[PostCategory] = None,
    status: Optional[PostStatus] = None,
    author_user_id: Optional[str] = None,
    search: Optional[str] = None,
) -> tuple[list[Post], int]:
    """
    List posts with pagination and filtering.

    Args:
        organization_id: Organization ID for multi-tenant isolation
        db: Database session
        page: Page number (1-indexed)
        per_page: Items per page
        category: Filter by category
        status: Filter by status
        author_user_id: Filter by author
        search: Search in title/content

    Returns:
        Tuple of (post list, total count)
    """
    query = select(Post).where(Post.organization_id == organization_id)

    # Filters
    if category:
        query = query.where(Post.category == category)
    if status:
        query = query.where(Post.status == status)
    else:
        # Default: only show published posts
        query = query.where(Post.status == PostStatus.published)
    if author_user_id:
        query = query.where(Post.author_user_id == author_user_id)
    if search:
        search_pattern = f"%{search}%"
        query = query.where(or_(Post.title.ilike(search_pattern), Post.content.ilike(search_pattern)))

    # Count total
    total = db.scalar(select(func.count()).select_from(query.subquery()))

    # Pagination
    query = query.order_by(Post.created_at.desc())
    query = query.offset((page - 1) * per_page).limit(per_page)

    posts = list(db.scalars(query).all())
    return posts, total


# ============================================================================
# Comment Operations
# ============================================================================


def create_comment(comment_data: CommentCreate, post_id: str, author: User, db: Session) -> Optional[Comment]:
    """
    Create a comment on a post.

    Args:
        comment_data: Comment creation data
        post_id: Post ID
        author: User creating the comment
        db: Database session

    Returns:
        Created comment instance or None if post not found
    """
    # Verify post exists and is in user's org
    post = db.scalar(select(Post).where(Post.id == post_id, Post.organization_id == author.organization_id))
    if not post:
        return None

    comment = Comment(
        post_id=post_id,
        author_user_id=str(author.id),
        content=comment_data.content,
        parent_comment_id=comment_data.parent_comment_id,
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment


def get_comment_by_id(comment_id: str, db: Session) -> Optional[Comment]:
    """Get comment by ID."""
    return db.scalar(select(Comment).where(Comment.id == comment_id))


def delete_comment(comment_id: str, user: User, db: Session) -> bool:
    """
    Delete a comment (author only).

    Args:
        comment_id: Comment ID
        user: User deleting the comment
        db: Database session

    Returns:
        True if deleted, False if not found/unauthorized
    """
    comment = db.scalar(select(Comment).where(Comment.id == comment_id, Comment.author_user_id == str(user.id)))

    if not comment:
        return False

    db.delete(comment)
    db.commit()
    return True


def get_comments_for_post(post_id: str, db: Session) -> list[Comment]:
    """Get all comments for a post, including nested replies."""
    return list(db.scalars(select(Comment).where(Comment.post_id == post_id).order_by(Comment.created_at.asc())).all())


# ============================================================================
# Reaction Operations
# ============================================================================


def add_reaction(reaction_data: ReactionCreate, user: User, db: Session) -> Optional[Reaction]:
    """
    Add a reaction to a post or comment.

    Args:
        reaction_data: Reaction creation data
        user: User adding the reaction
        db: Database session

    Returns:
        Created reaction instance or None if already exists
    """
    # Check if reaction already exists
    existing = db.scalar(
        select(Reaction).where(
            Reaction.target_type == reaction_data.target_type,
            Reaction.target_id == reaction_data.target_id,
            Reaction.user_id == str(user.id),
            Reaction.reaction_type == reaction_data.reaction_type,
        )
    )

    if existing:
        return None  # User already reacted with this type

    reaction = Reaction(
        target_type=reaction_data.target_type,
        target_id=reaction_data.target_id,
        user_id=str(user.id),
        reaction_type=reaction_data.reaction_type,
    )
    db.add(reaction)
    db.commit()
    db.refresh(reaction)
    return reaction


def remove_reaction(target_type: TargetType, target_id: str, reaction_type: ReactionType, user: User, db: Session) -> bool:
    """
    Remove a reaction from a post or comment.

    Args:
        target_type: Target type (post/comment)
        target_id: Target ID
        reaction_type: Reaction type
        user: User removing the reaction
        db: Database session

    Returns:
        True if removed, False if not found
    """
    reaction = db.scalar(
        select(Reaction).where(
            Reaction.target_type == target_type,
            Reaction.target_id == target_id,
            Reaction.user_id == str(user.id),
            Reaction.reaction_type == reaction_type,
        )
    )

    if not reaction:
        return False

    db.delete(reaction)
    db.commit()
    return True


def get_reactions(target_type: TargetType, target_id: str, db: Session) -> dict:
    """
    Get reaction counts for a target.

    Args:
        target_type: Target type (post/comment)
        target_id: Target ID
        db: Database session

    Returns:
        Dictionary with counts by reaction type
    """
    reactions = db.scalars(
        select(Reaction).where(Reaction.target_type == target_type, Reaction.target_id == target_id)
    ).all()

    counts = {rt.value: 0 for rt in ReactionType}
    for reaction in reactions:
        counts[reaction.reaction_type.value] += 1

    return counts


# ============================================================================
# Follow Operations
# ============================================================================


def follow_user(follow_data: FollowCreate, follower: User, db: Session) -> Optional[Follow]:
    """
    Follow a user.

    Args:
        follow_data: Follow creation data
        follower: User following
        db: Database session

    Returns:
        Created follow instance or None if already following/self-follow
    """
    # Prevent self-follow
    if str(follower.id) == follow_data.following_user_id:
        return None

    # Check if already following
    existing = db.scalar(
        select(Follow).where(
            Follow.follower_user_id == str(follower.id),
            Follow.following_user_id == follow_data.following_user_id,
        )
    )

    if existing:
        return None

    follow = Follow(
        follower_user_id=str(follower.id),
        following_user_id=follow_data.following_user_id,
        organization_id=follower.organization_id,
    )
    db.add(follow)
    db.commit()
    db.refresh(follow)
    return follow


def unfollow_user(following_user_id: str, follower: User, db: Session) -> bool:
    """
    Unfollow a user.

    Args:
        following_user_id: User ID to unfollow
        follower: User unfollowing
        db: Database session

    Returns:
        True if unfollowed, False if not found
    """
    follow = db.scalar(
        select(Follow).where(
            Follow.follower_user_id == str(follower.id),
            Follow.following_user_id == following_user_id,
        )
    )

    if not follow:
        return False

    db.delete(follow)
    db.commit()
    return True


def get_followers(user_id: str, db: Session) -> list[Follow]:
    """Get list of users following this user."""
    return list(db.scalars(select(Follow).where(Follow.following_user_id == user_id)).all())


def get_following(user_id: str, db: Session) -> list[Follow]:
    """Get list of users this user is following."""
    return list(db.scalars(select(Follow).where(Follow.follower_user_id == user_id)).all())


def get_follow_stats(user_id: str, db: Session) -> dict:
    """
    Get follow statistics for a user.

    Args:
        user_id: User ID
        db: Database session

    Returns:
        Dictionary with followers_count and following_count
    """
    followers_count = db.scalar(select(func.count(Follow.id)).where(Follow.following_user_id == user_id))
    following_count = db.scalar(select(func.count(Follow.id)).where(Follow.follower_user_id == user_id))

    return {
        "followers_count": followers_count or 0,
        "following_count": following_count or 0,
    }


# ============================================================================
# Moderation Operations
# ============================================================================


def moderate_content(moderation_data: ModerationActionCreate, moderator: User, db: Session) -> ModerationAction:
    """
    Moderate content (flag, approve, reject, delete).

    Args:
        moderation_data: Moderation action data
        moderator: User performing moderation
        db: Database session

    Returns:
        Created moderation action instance
    """
    moderation = ModerationAction(
        target_type=moderation_data.target_type,
        target_id=moderation_data.target_id,
        action_type=moderation_data.action_type,
        moderator_user_id=str(moderator.id),
        reason=moderation_data.reason,
    )
    db.add(moderation)

    # Update target status if needed
    if moderation_data.action_type == ModerationActionType.flag:
        if moderation_data.target_type == TargetType.post:
            post = db.scalar(select(Post).where(Post.id == moderation_data.target_id))
            if post:
                post.status = PostStatus.flagged
    elif moderation_data.action_type == ModerationActionType.delete:
        if moderation_data.target_type == TargetType.post:
            post = db.scalar(select(Post).where(Post.id == moderation_data.target_id))
            if post:
                db.delete(post)
        elif moderation_data.target_type == TargetType.comment:
            comment = db.scalar(select(Comment).where(Comment.id == moderation_data.target_id))
            if comment:
                db.delete(comment)

    db.commit()
    db.refresh(moderation)
    return moderation


def get_flagged_content(organization_id: str, db: Session) -> list[dict]:
    """
    Get list of flagged content for moderation.

    Args:
        organization_id: Organization ID
        db: Database session

    Returns:
        List of flagged content items
    """
    # Get flagged posts
    flagged_posts = db.scalars(
        select(Post).where(Post.organization_id == organization_id, Post.status == PostStatus.flagged)
    ).all()

    flagged_content = []
    for post in flagged_posts:
        # Count flags
        flag_count = db.scalar(
            select(func.count(ModerationAction.id)).where(
                ModerationAction.target_type == TargetType.post,
                ModerationAction.target_id == post.id,
                ModerationAction.action_type == ModerationActionType.flag,
            )
        )

        # Get last flagged time
        last_flag = db.scalar(
            select(ModerationAction.created_at)
            .where(
                ModerationAction.target_type == TargetType.post,
                ModerationAction.target_id == post.id,
                ModerationAction.action_type == ModerationActionType.flag,
            )
            .order_by(ModerationAction.created_at.desc())
        )

        flagged_content.append({
            "target_type": "post",
            "target_id": post.id,
            "content_preview": post.title[:100],
            "author_user_id": post.author_user_id,
            "flag_count": flag_count or 0,
            "last_flagged_at": last_flag,
        })

    return flagged_content


# ============================================================================
# Analytics Operations
# ============================================================================


def get_community_analytics(organization_id: str, db: Session) -> dict:
    """
    Get community analytics.

    Args:
        organization_id: Organization ID
        db: Database session

    Returns:
        Dictionary with analytics data
    """
    total_posts = db.scalar(
        select(func.count(Post.id)).where(Post.organization_id == organization_id, Post.status == PostStatus.published)
    )

    total_comments = db.scalar(
        select(func.count(Comment.id)).where(
            Comment.post_id.in_(select(Post.id).where(Post.organization_id == organization_id))
        )
    )

    total_reactions = db.scalar(
        select(func.count(Reaction.id)).where(
            Reaction.target_id.in_(select(Post.id).where(Post.organization_id == organization_id))
        )
    )

    total_follows = db.scalar(select(func.count(Follow.id)).where(Follow.organization_id == organization_id))

    # Active users (users who posted/commented in last 30 days)
    active_users = db.scalar(
        select(func.count(func.distinct(Post.author_user_id))).where(
            Post.organization_id == organization_id,
            Post.created_at >= datetime.now(timezone.utc).replace(day=1),
        )
    )

    # Top categories
    top_categories_query = (
        select(Post.category, func.count(Post.id).label("count"))
        .where(Post.organization_id == organization_id, Post.status == PostStatus.published)
        .group_by(Post.category)
        .order_by(func.count(Post.id).desc())
        .limit(5)
    )
    top_categories = [{"category": cat.value, "count": count} for cat, count in db.execute(top_categories_query).all()]

    return {
        "total_posts": total_posts or 0,
        "total_comments": total_comments or 0,
        "total_reactions": total_reactions or 0,
        "total_follows": total_follows or 0,
        "active_users_count": active_users or 0,
        "top_categories": top_categories,
        "recent_activity": [],  # Can be expanded
    }
