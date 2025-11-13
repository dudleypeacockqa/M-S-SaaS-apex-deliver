"""Tests for community models."""
import uuid
from datetime import datetime, timezone

import pytest
from sqlalchemy import select

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
from app.models.user import User, UserRole


@pytest.fixture
def test_user_data():
    """Create test user data."""
    return {
        "id": str(uuid.uuid4()),
        "clerk_user_id": f"clerk_{uuid.uuid4()}",
        "email": "test@example.com",
        "first_name": "Test",
        "last_name": "User",
        "role": UserRole.growth,
        "organization_id": str(uuid.uuid4()),
    }


@pytest.fixture
def test_user_data_2():
    """Create second test user data."""
    return {
        "id": str(uuid.uuid4()),
        "clerk_user_id": f"clerk_{uuid.uuid4()}",
        "email": "test2@example.com",
        "first_name": "Test2",
        "last_name": "User2",
        "role": UserRole.growth,
        "organization_id": str(uuid.uuid4()),
    }


def test_create_post(db_session, test_user_data: dict):
    """Test creating a post."""
    # Create user first
    user = User(**test_user_data)
    db_session.add(user)
    db_session.commit()

    # Create post
    post = Post(
        organization_id=test_user_data["organization_id"],
        author_user_id=user.id,
        title="Test Post",
        content="This is a test post content.",
        category=PostCategory.general,
        status=PostStatus.published,
    )
    db_session.add(post)
    await db_session.commit()
    await db_session.refresh(post)

    # Verify
    assert post.id is not None
    assert post.title == "Test Post"
    assert post.content == "This is a test post content."
    assert post.category == PostCategory.general
    assert post.status == PostStatus.published
    assert post.view_count == 0
    assert isinstance(post.created_at, datetime)
    assert isinstance(post.updated_at, datetime)


@pytest.mark.asyncio
async def test_post_with_tags(db_session: AsyncSession, test_user_data: dict):
    """Test creating a post with tags."""
    user = User(**test_user_data)
    db_session.add(user)
    await db_session.commit()

    post = Post(
        organization_id=test_user_data["organization_id"],
        author_user_id=user.id,
        title="Tagged Post",
        content="Post with tags",
        tags="ma,deals,valuation",
    )
    db_session.add(post)
    await db_session.commit()
    await db_session.refresh(post)

    assert post.tags == "ma,deals,valuation"


@pytest.mark.asyncio
async def test_post_multi_tenancy(db_session: AsyncSession, test_user_data: dict):
    """Test post multi-tenancy isolation."""
    user = User(**test_user_data)
    db_session.add(user)
    await db_session.commit()

    post = Post(
        organization_id=test_user_data["organization_id"],
        author_user_id=user.id,
        title="Org Post",
        content="Organization specific post",
    )
    db_session.add(post)
    await db_session.commit()

    # Query with correct org_id
    result = await db_session.execute(
        select(Post).where(Post.organization_id == test_user_data["organization_id"])
    )
    posts = result.scalars().all()
    assert len(posts) == 1

    # Query with wrong org_id
    wrong_org_id = str(uuid.uuid4())
    result = await db_session.execute(select(Post).where(Post.organization_id == wrong_org_id))
    posts = result.scalars().all()
    assert len(posts) == 0


@pytest.mark.asyncio
async def test_create_comment(db_session: AsyncSession, test_user_data: dict):
    """Test creating a comment."""
    user = User(**test_user_data)
    db_session.add(user)
    await db_session.commit()

    post = Post(
        organization_id=test_user_data["organization_id"],
        author_user_id=user.id,
        title="Post",
        content="Content",
    )
    db_session.add(post)
    await db_session.commit()

    comment = Comment(
        post_id=post.id,
        author_user_id=user.id,
        content="This is a comment",
    )
    db_session.add(comment)
    await db_session.commit()
    await db_session.refresh(comment)

    assert comment.id is not None
    assert comment.post_id == post.id
    assert comment.author_user_id == user.id
    assert comment.content == "This is a comment"
    assert comment.parent_comment_id is None


@pytest.mark.asyncio
async def test_nested_comments(db_session: AsyncSession, test_user_data: dict):
    """Test nested comment threading."""
    user = User(**test_user_data)
    db_session.add(user)
    await db_session.commit()

    post = Post(
        organization_id=test_user_data["organization_id"],
        author_user_id=user.id,
        title="Post",
        content="Content",
    )
    db_session.add(post)
    await db_session.commit()

    # Parent comment
    parent_comment = Comment(
        post_id=post.id,
        author_user_id=user.id,
        content="Parent comment",
    )
    db_session.add(parent_comment)
    await db_session.commit()

    # Reply comment
    reply_comment = Comment(
        post_id=post.id,
        author_user_id=user.id,
        content="Reply to parent",
        parent_comment_id=parent_comment.id,
    )
    db_session.add(reply_comment)
    await db_session.commit()
    await db_session.refresh(reply_comment)

    assert reply_comment.parent_comment_id == parent_comment.id


@pytest.mark.asyncio
async def test_post_comment_relationship(db_session: AsyncSession, test_user_data: dict):
    """Test relationship between post and comments."""
    user = User(**test_user_data)
    db_session.add(user)
    await db_session.commit()

    post = Post(
        organization_id=test_user_data["organization_id"],
        author_user_id=user.id,
        title="Post",
        content="Content",
    )
    db_session.add(post)
    await db_session.commit()

    # Add multiple comments
    for i in range(3):
        comment = Comment(
            post_id=post.id,
            author_user_id=user.id,
            content=f"Comment {i}",
        )
        db_session.add(comment)
    await db_session.commit()
    await db_session.refresh(post)

    assert len(post.comments) == 3


@pytest.mark.asyncio
async def test_create_reaction(db_session: AsyncSession, test_user_data: dict):
    """Test creating a reaction."""
    user = User(**test_user_data)
    db_session.add(user)
    await db_session.commit()

    post = Post(
        organization_id=test_user_data["organization_id"],
        author_user_id=user.id,
        title="Post",
        content="Content",
    )
    db_session.add(post)
    await db_session.commit()

    reaction = Reaction(
        target_type=TargetType.post,
        target_id=post.id,
        user_id=user.id,
        reaction_type=ReactionType.like,
    )
    db_session.add(reaction)
    await db_session.commit()
    await db_session.refresh(reaction)

    assert reaction.id is not None
    assert reaction.target_type == TargetType.post
    assert reaction.target_id == post.id
    assert reaction.user_id == user.id
    assert reaction.reaction_type == ReactionType.like


@pytest.mark.asyncio
async def test_reaction_on_comment(db_session: AsyncSession, test_user_data: dict):
    """Test creating a reaction on a comment."""
    user = User(**test_user_data)
    db_session.add(user)
    await db_session.commit()

    post = Post(
        organization_id=test_user_data["organization_id"],
        author_user_id=user.id,
        title="Post",
        content="Content",
    )
    db_session.add(post)
    await db_session.commit()

    comment = Comment(
        post_id=post.id,
        author_user_id=user.id,
        content="Comment",
    )
    db_session.add(comment)
    await db_session.commit()

    reaction = Reaction(
        target_type=TargetType.comment,
        target_id=comment.id,
        user_id=user.id,
        reaction_type=ReactionType.insightful,
    )
    db_session.add(reaction)
    await db_session.commit()
    await db_session.refresh(reaction)

    assert reaction.target_type == TargetType.comment
    assert reaction.target_id == comment.id
    assert reaction.reaction_type == ReactionType.insightful


@pytest.mark.asyncio
async def test_unique_reaction_constraint(db_session: AsyncSession, test_user_data: dict):
    """Test that a user cannot react twice with the same reaction type."""
    user = User(**test_user_data)
    db_session.add(user)
    await db_session.commit()

    post = Post(
        organization_id=test_user_data["organization_id"],
        author_user_id=user.id,
        title="Post",
        content="Content",
    )
    db_session.add(post)
    await db_session.commit()

    # First reaction
    reaction1 = Reaction(
        target_type=TargetType.post,
        target_id=post.id,
        user_id=user.id,
        reaction_type=ReactionType.like,
    )
    db_session.add(reaction1)
    await db_session.commit()

    # Try to add duplicate reaction
    reaction2 = Reaction(
        target_type=TargetType.post,
        target_id=post.id,
        user_id=user.id,
        reaction_type=ReactionType.like,
    )
    db_session.add(reaction2)

    with pytest.raises(Exception):  # Will raise IntegrityError
        await db_session.commit()


@pytest.mark.asyncio
async def test_create_follow(db_session: AsyncSession, test_user_data: dict, test_user_data_2: dict):
    """Test creating a follow relationship."""
    user1 = User(**test_user_data)
    user2 = User(**test_user_data_2)
    db_session.add(user1)
    db_session.add(user2)
    await db_session.commit()

    follow = Follow(
        follower_user_id=user1.id,
        following_user_id=user2.id,
        organization_id=test_user_data["organization_id"],
    )
    db_session.add(follow)
    await db_session.commit()
    await db_session.refresh(follow)

    assert follow.id is not None
    assert follow.follower_user_id == user1.id
    assert follow.following_user_id == user2.id
    assert isinstance(follow.created_at, datetime)


@pytest.mark.asyncio
async def test_unique_follow_constraint(db_session: AsyncSession, test_user_data: dict, test_user_data_2: dict):
    """Test that a user cannot follow the same user twice."""
    user1 = User(**test_user_data)
    user2 = User(**test_user_data_2)
    db_session.add(user1)
    db_session.add(user2)
    await db_session.commit()

    # First follow
    follow1 = Follow(
        follower_user_id=user1.id,
        following_user_id=user2.id,
        organization_id=test_user_data["organization_id"],
    )
    db_session.add(follow1)
    await db_session.commit()

    # Try to add duplicate follow
    follow2 = Follow(
        follower_user_id=user1.id,
        following_user_id=user2.id,
        organization_id=test_user_data["organization_id"],
    )
    db_session.add(follow2)

    with pytest.raises(Exception):  # Will raise IntegrityError
        await db_session.commit()


@pytest.mark.asyncio
async def test_create_moderation_action(db_session: AsyncSession, test_user_data: dict):
    """Test creating a moderation action."""
    user = User(**test_user_data)
    db_session.add(user)
    await db_session.commit()

    post = Post(
        organization_id=test_user_data["organization_id"],
        author_user_id=user.id,
        title="Post",
        content="Inappropriate content",
    )
    db_session.add(post)
    await db_session.commit()

    moderation = ModerationAction(
        target_type=TargetType.post,
        target_id=post.id,
        action_type=ModerationActionType.flag,
        moderator_user_id=user.id,
        reason="Inappropriate content",
    )
    db_session.add(moderation)
    await db_session.commit()
    await db_session.refresh(moderation)

    assert moderation.id is not None
    assert moderation.target_type == TargetType.post
    assert moderation.target_id == post.id
    assert moderation.action_type == ModerationActionType.flag
    assert moderation.moderator_user_id == user.id
    assert moderation.reason == "Inappropriate content"


@pytest.mark.asyncio
async def test_moderation_action_types(db_session: AsyncSession, test_user_data: dict):
    """Test different moderation action types."""
    user = User(**test_user_data)
    db_session.add(user)
    await db_session.commit()

    post = Post(
        organization_id=test_user_data["organization_id"],
        author_user_id=user.id,
        title="Post",
        content="Content",
    )
    db_session.add(post)
    await db_session.commit()

    # Test all action types
    action_types = [
        ModerationActionType.approve,
        ModerationActionType.reject,
        ModerationActionType.flag,
        ModerationActionType.delete,
        ModerationActionType.unflag,
    ]

    for action_type in action_types:
        moderation = ModerationAction(
            target_type=TargetType.post,
            target_id=post.id,
            action_type=action_type,
            moderator_user_id=user.id,
        )
        db_session.add(moderation)

    await db_session.commit()

    # Verify all were created
    result = await db_session.execute(select(ModerationAction).where(ModerationAction.target_id == post.id))
    actions = result.scalars().all()
    assert len(actions) == len(action_types)
