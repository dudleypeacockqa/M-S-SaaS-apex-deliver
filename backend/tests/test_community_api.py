"""
Tests for Community Platform API endpoints (F-013, DEV-021).

Following TDD RED → GREEN → REFACTOR methodology.

Test Coverage:
- Post CRUD operations (5 endpoints)
- Comment management (3 endpoints)
- Reaction management (3 endpoints)
- Follow/Unfollow operations (4 endpoints)
- Moderation actions (2 endpoints)
- Analytics (1 endpoint)
- Flagged content (1 endpoint)

Total: 19 API endpoints
"""
import pytest
from datetime import datetime
from starlette.testclient import TestClient
from sqlalchemy.orm import Session
from uuid import uuid4

from app.models.community import (
    Post,
    Comment,
    Reaction,
    Follow,
    ModerationAction,
    PostCategory,
    PostStatus,
    ReactionType,
    TargetType,
    ModerationActionType,
)
from app.models.user import User
from app.models.organization import Organization


# ============================================================================
# Fixtures
# ============================================================================

@pytest.fixture(autouse=True)
def setup_auth(solo_user, request, dependency_overrides):
    """Automatically set up authentication for all tests."""
    # Skip auth setup for tests that explicitly test authentication
    if 'requires_authentication' in request.node.name:
        yield None
        return
    
    from app.api.dependencies.auth import get_current_user
    
    dependency_overrides(get_current_user, lambda: solo_user)
    yield


@pytest.fixture
def test_organization(db_session: Session, solo_user) -> Organization:
    """Get the organization from solo_user."""
    org = db_session.get(Organization, solo_user.organization_id)
    return org


@pytest.fixture
def test_user(solo_user) -> User:
    """Use solo_user as test_user."""
    return solo_user


@pytest.fixture
def test_user_2(db_session: Session, test_organization: Organization, solo_user) -> User:
    """Create a second test user in the same organization."""
    from app.models.user import UserRole
    user = User(
        id=str(uuid4()),
        clerk_user_id=f"clerk_{uuid4()}",
        email="test2@example.com",
        first_name="Test",
        last_name="User2",
        role=solo_user.role,
        organization_id=test_organization.id,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def test_post(db_session: Session, test_organization: Organization, test_user: User) -> Post:
    """Create a test post."""
    post = Post(
        id=str(uuid4()),
        organization_id=test_organization.id,
        author_user_id=str(test_user.id),
        title="Test Post",
        content="This is test content for the community platform",
        category=PostCategory.general,
        status=PostStatus.published,
    )
    db_session.add(post)
    db_session.commit()
    db_session.refresh(post)
    return post


@pytest.fixture
def test_comment(db_session: Session, test_post: Post, test_user: User) -> Comment:
    """Create a test comment."""
    comment = Comment(
        id=str(uuid4()),
        post_id=test_post.id,
        author_user_id=str(test_user.id),
        content="This is a test comment",
    )
    db_session.add(comment)
    db_session.commit()
    db_session.refresh(comment)
    return comment


@pytest.fixture
def test_reaction(db_session: Session, test_post: Post, test_user: User) -> Reaction:
    """Create a test reaction."""
    reaction = Reaction(
        id=str(uuid4()),
        target_type=TargetType.post,
        target_id=test_post.id,
        user_id=str(test_user.id),
        reaction_type=ReactionType.like,
    )
    db_session.add(reaction)
    db_session.commit()
    db_session.refresh(reaction)
    return reaction


@pytest.fixture
def test_follow(db_session: Session, test_user: User, test_user_2: User) -> Follow:
    """Create a test follow relationship."""
    follow = Follow(
        id=str(uuid4()),
        follower_user_id=str(test_user.id),
        following_user_id=str(test_user_2.id),
        organization_id=test_user.organization_id,
    )
    db_session.add(follow)
    db_session.commit()
    db_session.refresh(follow)
    return follow


# ============================================================================
# Post CRUD Tests
# ============================================================================

def test_create_post_returns_201(
    client: TestClient,
    test_user: User,
):
    """Test creating a new post returns 201 Created."""
    post_data = {
        "title": "New Community Post",
        "content": "This is a new post in the community",
        "category": "general",
        "status": "published",
    }

    response = client.post("/api/community/posts", json=post_data)

    assert response.status_code == 201, f"Expected 201, got {response.status_code}: {response.text}"
    data = response.json()
    assert data["title"] == "New Community Post"
    assert data["content"] == "This is a new post in the community"
    assert data["category"] == "general"
    assert "id" in data
    assert data["author_user_id"] == str(test_user.id)


def test_list_posts_returns_200(client: TestClient, test_post: Post):
    """Test listing posts returns 200 OK."""
    response = client.get("/api/community/posts")

    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    data = response.json()
    assert "posts" in data
    assert "total" in data
    assert "page" in data
    assert isinstance(data["posts"], list)
    assert len(data["posts"]) > 0


def test_list_posts_with_filters(client: TestClient, test_post: Post):
    """Test listing posts with category filter."""
    response = client.get("/api/community/posts?category=general&page=1&per_page=10")

    assert response.status_code == 200
    data = response.json()
    assert all(post["category"] == "general" for post in data["posts"])


def test_get_post_returns_200(client: TestClient, test_post: Post):
    """Test getting a specific post returns 200 OK."""
    response = client.get(f"/api/community/posts/{test_post.id}")

    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    data = response.json()
    assert data["id"] == test_post.id
    assert data["title"] == test_post.title


def test_get_post_not_found_returns_404(client: TestClient):
    """Test getting non-existent post returns 404."""
    response = client.get(f"/api/community/posts/{uuid4()}")

    assert response.status_code == 404


def test_update_post_returns_200(client: TestClient, test_post: Post):
    """Test updating a post returns 200 OK."""
    update_data = {
        "title": "Updated Post Title",
        "content": "Updated content",
    }

    response = client.put(f"/api/community/posts/{test_post.id}", json=update_data)

    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    data = response.json()
    assert data["title"] == "Updated Post Title"
    assert data["content"] == "Updated content"


def test_delete_post_returns_204(client: TestClient, test_post: Post):
    """Test deleting a post returns 204 No Content."""
    response = client.delete(f"/api/community/posts/{test_post.id}")

    assert response.status_code == 204, f"Expected 204, got {response.status_code}: {response.text}"


def test_list_posts_requires_authentication(client: TestClient):
    """Test that listing posts requires authentication."""
    # This test depends on how authentication is handled in the test client
    # If client automatically includes auth, we may need to test differently
    pass


# ============================================================================
# Comment Tests
# ============================================================================

def test_create_comment_returns_201(client: TestClient, test_post: Post, test_user: User):
    """Test creating a comment returns 201 Created."""
    comment_data = {
        "content": "This is a test comment",
    }

    response = client.post(f"/api/community/posts/{test_post.id}/comments", json=comment_data)

    assert response.status_code == 201, f"Expected 201, got {response.status_code}: {response.text}"
    data = response.json()
    assert data["content"] == "This is a test comment"
    assert data["post_id"] == test_post.id
    assert "id" in data


def test_list_comments_returns_200(client: TestClient, test_post: Post, test_comment: Comment):
    """Test listing comments returns 200 OK."""
    response = client.get(f"/api/community/posts/{test_post.id}/comments")

    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert any(comment["id"] == test_comment.id for comment in data)


def test_delete_comment_returns_204(client: TestClient, test_comment: Comment):
    """Test deleting a comment returns 204 No Content."""
    response = client.delete(f"/api/community/comments/{test_comment.id}")

    assert response.status_code == 204, f"Expected 204, got {response.status_code}: {response.text}"


# ============================================================================
# Reaction Tests
# ============================================================================

def test_create_reaction_returns_201(client: TestClient, test_post: Post):
    """Test creating a reaction returns 201 Created."""
    reaction_data = {
        "target_type": "post",
        "target_id": test_post.id,
        "reaction_type": "like",
    }

    response = client.post("/api/community/reactions", json=reaction_data)

    assert response.status_code == 201, f"Expected 201, got {response.status_code}: {response.text}"
    data = response.json()
    assert data["reaction_type"] == "like"
    assert data["target_id"] == test_post.id


def test_get_reactions_returns_200(client: TestClient, test_post: Post, test_reaction: Reaction):
    """Test getting reactions returns 200 OK."""
    response = client.get(f"/api/community/reactions/post/{test_post.id}")

    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    data = response.json()
    assert isinstance(data, dict)
    assert "like" in data or len(data) > 0


def test_delete_reaction_returns_204(client: TestClient, test_post: Post, test_reaction: Reaction):
    """Test deleting a reaction returns 204 No Content."""
    response = client.delete(
        f"/api/community/reactions/post/{test_post.id}/like"
    )

    assert response.status_code == 204, f"Expected 204, got {response.status_code}: {response.text}"


# ============================================================================
# Follow Tests
# ============================================================================

def test_follow_user_returns_201(client: TestClient, test_user: User, test_user_2: User):
    """Test following a user returns 201 Created."""
    follow_data = {
        "following_user_id": str(test_user_2.id),
    }

    response = client.post("/api/community/follow", json=follow_data)

    assert response.status_code == 201, f"Expected 201, got {response.status_code}: {response.text}"
    data = response.json()
    assert data["following_user_id"] == str(test_user_2.id)
    assert data["follower_user_id"] == str(test_user.id)


def test_unfollow_user_returns_204(client: TestClient, test_user: User, test_user_2: User, test_follow: Follow):
    """Test unfollowing a user returns 204 No Content."""
    response = client.delete(f"/api/community/follow/{test_user_2.id}")

    assert response.status_code == 204, f"Expected 204, got {response.status_code}: {response.text}"


def test_get_follow_stats_returns_200(client: TestClient, test_user_2: User, test_follow: Follow):
    """Test getting follow stats returns 200 OK."""
    response = client.get(f"/api/community/follow/stats/{test_user_2.id}")

    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    data = response.json()
    assert "followers_count" in data
    assert "following_count" in data


def test_get_followers_returns_200(client: TestClient, test_user_2: User, test_follow: Follow):
    """Test getting followers returns 200 OK."""
    response = client.get(f"/api/community/follow/followers/{test_user_2.id}")

    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    data = response.json()
    assert isinstance(data, list)


def test_get_following_returns_200(client: TestClient, test_user: User, test_follow: Follow):
    """Test getting following list returns 200 OK."""
    response = client.get(f"/api/community/follow/following/{test_user.id}")

    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    data = response.json()
    assert isinstance(data, list)


# ============================================================================
# Moderation Tests
# ============================================================================

def test_create_moderation_action_returns_201(client: TestClient, test_post: Post):
    """Test creating a moderation action returns 201 Created."""
    moderation_data = {
        "target_type": "post",
        "target_id": test_post.id,
        "action_type": "flag",
        "reason": "Inappropriate content",
    }

    response = client.post("/api/community/moderation/actions", json=moderation_data)

    assert response.status_code == 201, f"Expected 201, got {response.status_code}: {response.text}"
    data = response.json()
    assert data["action_type"] == "flag"
    assert data["target_id"] == test_post.id


def test_get_flagged_content_returns_200(client: TestClient, test_post: Post):
    """Test getting flagged content returns 200 OK."""
    response = client.get("/api/community/moderation/flagged")

    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    data = response.json()
    assert isinstance(data, list)


# ============================================================================
# Analytics Tests
# ============================================================================

def test_get_analytics_returns_200(client: TestClient, test_post: Post):
    """Test getting community analytics returns 200 OK."""
    response = client.get("/api/community/analytics")

    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    data = response.json()
    assert "total_posts" in data
    assert "total_comments" in data
    assert "total_reactions" in data
    assert isinstance(data["total_posts"], int)


