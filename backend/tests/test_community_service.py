"""Tests for community service layer."""
import uuid

import pytest

from app.models.community import (
    ModerationActionType,
    PostCategory,
    PostStatus,
    ReactionType,
    TargetType,
)
from app.models.user import User, UserRole
from app.schemas.community import (
    CommentCreate,
    FollowCreate,
    ModerationActionCreate,
    PostCreate,
    PostUpdate,
    ReactionCreate,
)
from app.services import community_service


@pytest.fixture
def test_org_user(db_session):
    """Create a test user with organization."""
    user = User(
        id=str(uuid.uuid4()),
        clerk_user_id=f"clerk_{uuid.uuid4()}",
        email="test@example.com",
        first_name="Test",
        last_name="User",
        role=UserRole.growth,
        organization_id=str(uuid.uuid4()),
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def test_org_user_2(db_session):
    """Create a second test user in same organization."""
    org_id = str(uuid.uuid4())
    user = User(
        id=str(uuid.uuid4()),
        clerk_user_id=f"clerk_{uuid.uuid4()}",
        email="test2@example.com",
        first_name="Test2",
        last_name="User2",
        role=UserRole.growth,
        organization_id=org_id,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


# ============================================================================
# Post Service Tests
# ============================================================================


def test_create_post(db_session, test_org_user):
    """Test creating a post."""
    post_data = PostCreate(
        title="Test Post",
        content="This is test content",
        category=PostCategory.general,
        status=PostStatus.published,
    )

    post = community_service.create_post(post_data, test_org_user, db_session)

    assert post.id is not None
    assert post.title == "Test Post"
    assert post.content == "This is test content"
    assert post.category == PostCategory.general
    assert post.status == PostStatus.published
    assert post.organization_id == test_org_user.organization_id
    # GUID column returns UUID, but User.id is string in fixture, so compare as strings
    assert str(post.author_user_id) == str(test_org_user.id)


def test_get_post_by_id(db_session, test_org_user):
    """Test getting a post by ID."""
    post_data = PostCreate(title="Test", content="Content", category=PostCategory.general)
    created_post = community_service.create_post(post_data, test_org_user, db_session)

    retrieved_post = community_service.get_post_by_id(created_post.id, test_org_user.organization_id, db_session)

    assert retrieved_post is not None
    assert retrieved_post.id == created_post.id
    assert retrieved_post.view_count == 1  # Incremented on retrieval


def test_get_post_by_id_wrong_org(db_session, test_org_user):
    """Test that post cannot be accessed from wrong organization."""
    post_data = PostCreate(title="Test", content="Content", category=PostCategory.general)
    created_post = community_service.create_post(post_data, test_org_user, db_session)

    wrong_org_id = str(uuid.uuid4())
    retrieved_post = community_service.get_post_by_id(created_post.id, wrong_org_id, db_session)

    assert retrieved_post is None


def test_update_post(db_session, test_org_user):
    """Test updating a post."""
    post_data = PostCreate(title="Original", content="Content", category=PostCategory.general)
    post = community_service.create_post(post_data, test_org_user, db_session)

    update_data = PostUpdate(title="Updated", content="New content")
    updated_post = community_service.update_post(post.id, update_data, test_org_user, db_session)

    assert updated_post is not None
    assert updated_post.title == "Updated"
    assert updated_post.content == "New content"


def test_update_post_unauthorized(db_session, test_org_user, test_org_user_2):
    """Test that users cannot update posts they don't own."""
    post_data = PostCreate(title="Original", content="Content", category=PostCategory.general)
    post = community_service.create_post(post_data, test_org_user, db_session)

    update_data = PostUpdate(title="Hacked")
    updated_post = community_service.update_post(post.id, update_data, test_org_user_2, db_session)

    assert updated_post is None


def test_delete_post(db_session, test_org_user):
    """Test deleting a post."""
    post_data = PostCreate(title="To Delete", content="Content", category=PostCategory.general)
    post = community_service.create_post(post_data, test_org_user, db_session)

    result = community_service.delete_post(post.id, test_org_user, db_session)
    assert result is True

    # Verify post is deleted
    retrieved = community_service.get_post_by_id(post.id, test_org_user.organization_id, db_session)
    assert retrieved is None


def test_delete_post_unauthorized(db_session, test_org_user, test_org_user_2):
    """Test that users cannot delete posts they don't own."""
    post_data = PostCreate(title="Protected", content="Content", category=PostCategory.general)
    post = community_service.create_post(post_data, test_org_user, db_session)

    result = community_service.delete_post(post.id, test_org_user_2, db_session)
    assert result is False


def test_list_posts(db_session, test_org_user):
    """Test listing posts with pagination."""
    # Create multiple posts
    for i in range(5):
        post_data = PostCreate(title=f"Post {i}", content="Content", category=PostCategory.general)
        community_service.create_post(post_data, test_org_user, db_session)

    posts, total = community_service.list_posts(test_org_user.organization_id, db_session, page=1, per_page=3)

    assert total == 5
    assert len(posts) == 3


def test_list_posts_filter_by_category(db_session, test_org_user):
    """Test filtering posts by category."""
    post_data_1 = PostCreate(title="General Post", content="Content", category=PostCategory.general)
    post_data_2 = PostCreate(title="Deals Post", content="Content", category=PostCategory.deals)

    community_service.create_post(post_data_1, test_org_user, db_session)
    community_service.create_post(post_data_2, test_org_user, db_session)

    posts, total = community_service.list_posts(
        test_org_user.organization_id, db_session, category=PostCategory.deals
    )

    assert total == 1
    assert posts[0].category == PostCategory.deals


def test_list_posts_search(db_session, test_org_user):
    """Test searching posts."""
    post_data_1 = PostCreate(title="Python Tutorial", content="Learn Python", category=PostCategory.general)
    post_data_2 = PostCreate(title="Java Guide", content="Learn Java", category=PostCategory.general)

    community_service.create_post(post_data_1, test_org_user, db_session)
    community_service.create_post(post_data_2, test_org_user, db_session)

    posts, total = community_service.list_posts(test_org_user.organization_id, db_session, search="Python")

    assert total == 1
    assert "Python" in posts[0].title


# ============================================================================
# Comment Service Tests
# ============================================================================


def test_create_comment(db_session, test_org_user):
    """Test creating a comment."""
    post_data = PostCreate(title="Post", content="Content", category=PostCategory.general)
    post = community_service.create_post(post_data, test_org_user, db_session)

    comment_data = CommentCreate(content="Great post!")
    comment = community_service.create_comment(comment_data, post.id, test_org_user, db_session)

    assert comment is not None
    assert comment.content == "Great post!"
    assert comment.post_id == post.id
    # GUID column returns UUID, but User.id is string in fixture, so compare as strings
    assert str(comment.author_user_id) == str(test_org_user.id)


def test_create_comment_on_nonexistent_post(db_session, test_org_user):
    """Test that comment creation fails for nonexistent post."""
    comment_data = CommentCreate(content="Comment")
    comment = community_service.create_comment(comment_data, str(uuid.uuid4()), test_org_user, db_session)

    assert comment is None


def test_create_nested_comment(db_session, test_org_user):
    """Test creating a nested reply comment."""
    post_data = PostCreate(title="Post", content="Content", category=PostCategory.general)
    post = community_service.create_post(post_data, test_org_user, db_session)

    parent_comment_data = CommentCreate(content="Parent comment")
    parent_comment = community_service.create_comment(parent_comment_data, post.id, test_org_user, db_session)

    reply_comment_data = CommentCreate(content="Reply to parent", parent_comment_id=parent_comment.id)
    reply_comment = community_service.create_comment(reply_comment_data, post.id, test_org_user, db_session)

    assert reply_comment is not None
    assert reply_comment.parent_comment_id == parent_comment.id


def test_delete_comment(db_session, test_org_user):
    """Test deleting a comment."""
    post_data = PostCreate(title="Post", content="Content", category=PostCategory.general)
    post = community_service.create_post(post_data, test_org_user, db_session)

    comment_data = CommentCreate(content="To delete")
    comment = community_service.create_comment(comment_data, post.id, test_org_user, db_session)

    result = community_service.delete_comment(comment.id, test_org_user, db_session)
    assert result is True


def test_delete_comment_unauthorized(db_session, test_org_user, test_org_user_2):
    """Test that users cannot delete comments they don't own."""
    post_data = PostCreate(title="Post", content="Content", category=PostCategory.general)
    post = community_service.create_post(post_data, test_org_user, db_session)

    comment_data = CommentCreate(content="Protected")
    comment = community_service.create_comment(comment_data, post.id, test_org_user, db_session)

    result = community_service.delete_comment(comment.id, test_org_user_2, db_session)
    assert result is False


def test_get_comments_for_post(db_session, test_org_user):
    """Test getting all comments for a post."""
    post_data = PostCreate(title="Post", content="Content", category=PostCategory.general)
    post = community_service.create_post(post_data, test_org_user, db_session)

    for i in range(3):
        comment_data = CommentCreate(content=f"Comment {i}")
        community_service.create_comment(comment_data, post.id, test_org_user, db_session)

    comments = community_service.get_comments_for_post(post.id, db_session)
    assert len(comments) == 3


# ============================================================================
# Reaction Service Tests
# ============================================================================


def test_add_reaction(db_session, test_org_user):
    """Test adding a reaction to a post."""
    post_data = PostCreate(title="Post", content="Content", category=PostCategory.general)
    post = community_service.create_post(post_data, test_org_user, db_session)

    reaction_data = ReactionCreate(target_type=TargetType.post, target_id=post.id, reaction_type=ReactionType.like)
    reaction = community_service.add_reaction(reaction_data, test_org_user, db_session)

    assert reaction is not None
    assert reaction.target_id == post.id
    assert reaction.reaction_type == ReactionType.like


def test_add_reaction_duplicate(db_session, test_org_user):
    """Test that duplicate reactions are not allowed."""
    post_data = PostCreate(title="Post", content="Content", category=PostCategory.general)
    post = community_service.create_post(post_data, test_org_user, db_session)

    reaction_data = ReactionCreate(target_type=TargetType.post, target_id=post.id, reaction_type=ReactionType.like)
    community_service.add_reaction(reaction_data, test_org_user, db_session)

    # Try to add same reaction again
    duplicate = community_service.add_reaction(reaction_data, test_org_user, db_session)
    assert duplicate is None


def test_remove_reaction(db_session, test_org_user):
    """Test removing a reaction."""
    post_data = PostCreate(title="Post", content="Content", category=PostCategory.general)
    post = community_service.create_post(post_data, test_org_user, db_session)

    reaction_data = ReactionCreate(target_type=TargetType.post, target_id=post.id, reaction_type=ReactionType.like)
    community_service.add_reaction(reaction_data, test_org_user, db_session)

    result = community_service.remove_reaction(TargetType.post, post.id, ReactionType.like, test_org_user, db_session)
    assert result is True


def test_get_reactions(db_session, test_org_user, test_org_user_2):
    """Test getting reaction counts."""
    post_data = PostCreate(title="Post", content="Content", category=PostCategory.general)
    post = community_service.create_post(post_data, test_org_user, db_session)

    # Add multiple reactions
    reaction_data_1 = ReactionCreate(target_type=TargetType.post, target_id=post.id, reaction_type=ReactionType.like)
    reaction_data_2 = ReactionCreate(target_type=TargetType.post, target_id=post.id, reaction_type=ReactionType.love)

    community_service.add_reaction(reaction_data_1, test_org_user, db_session)
    community_service.add_reaction(reaction_data_2, test_org_user_2, db_session)

    counts = community_service.get_reactions(TargetType.post, post.id, db_session)

    assert counts["like"] == 1
    assert counts["love"] == 1


# ============================================================================
# Follow Service Tests
# ============================================================================


def test_follow_user(db_session, test_org_user, test_org_user_2):
    """Test following a user."""
    follow_data = FollowCreate(following_user_id=str(test_org_user_2.id))
    follow = community_service.follow_user(follow_data, test_org_user, db_session)

    assert follow is not None
    # GUID columns return UUID, but User.id is string in fixture, so compare as strings
    assert str(follow.follower_user_id) == str(test_org_user.id)
    assert str(follow.following_user_id) == str(test_org_user_2.id)


def test_follow_user_self(db_session, test_org_user):
    """Test that users cannot follow themselves."""
    follow_data = FollowCreate(following_user_id=str(test_org_user.id))
    follow = community_service.follow_user(follow_data, test_org_user, db_session)

    assert follow is None


def test_follow_user_duplicate(db_session, test_org_user, test_org_user_2):
    """Test that duplicate follows are not allowed."""
    follow_data = FollowCreate(following_user_id=str(test_org_user_2.id))
    community_service.follow_user(follow_data, test_org_user, db_session)

    # Try to follow again
    duplicate = community_service.follow_user(follow_data, test_org_user, db_session)
    assert duplicate is None


def test_unfollow_user(db_session, test_org_user, test_org_user_2):
    """Test unfollowing a user."""
    follow_data = FollowCreate(following_user_id=str(test_org_user_2.id))
    community_service.follow_user(follow_data, test_org_user, db_session)

    result = community_service.unfollow_user(str(test_org_user_2.id), test_org_user, db_session)
    assert result is True


def test_get_follow_stats(db_session, test_org_user, test_org_user_2):
    """Test getting follow statistics."""
    follow_data = FollowCreate(following_user_id=str(test_org_user_2.id))
    community_service.follow_user(follow_data, test_org_user, db_session)

    stats = community_service.get_follow_stats(str(test_org_user_2.id), db_session)

    assert stats["followers_count"] == 1
    assert stats["following_count"] == 0


# ============================================================================
# Moderation Service Tests
# ============================================================================


def test_moderate_content_flag(db_session, test_org_user):
    """Test flagging content."""
    post_data = PostCreate(title="Bad Post", content="Inappropriate", category=PostCategory.general)
    post = community_service.create_post(post_data, test_org_user, db_session)

    moderation_data = ModerationActionCreate(
        target_type=TargetType.post,
        target_id=post.id,
        action_type=ModerationActionType.flag,
        reason="Spam",
    )
    moderation = community_service.moderate_content(moderation_data, test_org_user, db_session)

    assert moderation is not None
    assert moderation.action_type == ModerationActionType.flag

    # Verify post status changed
    flagged_post = community_service.get_post_by_id(post.id, test_org_user.organization_id, db_session)
    assert flagged_post.status == PostStatus.flagged


def test_moderate_content_delete(db_session, test_org_user):
    """Test deleting content via moderation."""
    post_data = PostCreate(title="Bad Post", content="Inappropriate", category=PostCategory.general)
    post = community_service.create_post(post_data, test_org_user, db_session)

    moderation_data = ModerationActionCreate(
        target_type=TargetType.post,
        target_id=post.id,
        action_type=ModerationActionType.delete,
        reason="Severe violation",
    )
    community_service.moderate_content(moderation_data, test_org_user, db_session)

    # Verify post is deleted
    deleted_post = community_service.get_post_by_id(post.id, test_org_user.organization_id, db_session)
    assert deleted_post is None


def test_get_flagged_content(db_session, test_org_user):
    """Test getting flagged content."""
    post_data = PostCreate(title="Bad Post", content="Inappropriate", category=PostCategory.general)
    post = community_service.create_post(post_data, test_org_user, db_session)

    moderation_data = ModerationActionCreate(
        target_type=TargetType.post,
        target_id=post.id,
        action_type=ModerationActionType.flag,
        reason="Spam",
    )
    community_service.moderate_content(moderation_data, test_org_user, db_session)

    flagged = community_service.get_flagged_content(test_org_user.organization_id, db_session)

    assert len(flagged) == 1
    assert flagged[0]["target_id"] == post.id
    assert flagged[0]["flag_count"] == 1


# ============================================================================
# Analytics Service Tests
# ============================================================================


def test_get_community_analytics(db_session, test_org_user):
    """Test getting community analytics."""
    # Create sample data
    post_data = PostCreate(title="Post", content="Content", category=PostCategory.general)
    post = community_service.create_post(post_data, test_org_user, db_session)

    comment_data = CommentCreate(content="Comment")
    community_service.create_comment(comment_data, post.id, test_org_user, db_session)

    reaction_data = ReactionCreate(target_type=TargetType.post, target_id=post.id, reaction_type=ReactionType.like)
    community_service.add_reaction(reaction_data, test_org_user, db_session)

    analytics = community_service.get_community_analytics(test_org_user.organization_id, db_session)

    assert analytics["total_posts"] == 1
    assert analytics["total_comments"] == 1
    assert analytics["total_reactions"] == 1
    assert analytics["active_users_count"] >= 1
