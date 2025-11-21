"""
Tests for Redis HTTP Response Caching

TDD RED Phase: Write failing tests first
"""

import pytest
from unittest.mock import Mock, patch, MagicMock
from app.core.cache import (
    generate_cache_key,
    get_cache_stats,
    invalidate_cache_pattern,
    cached_response,
)


class TestCacheKeyGeneration:
    """Test cache key generation logic."""

    def test_generate_cache_key_basic(self):
        """Should generate consistent cache keys."""
        key = generate_cache_key(
            endpoint="/api/deals",
            organization_id="org-123",
            query_params={"status": "active"},
        )

        assert key.startswith("api:v1:deals:org-123:")
        assert len(key.split(":")) == 5  # api:v1:deals:org-123:hash

    def test_generate_cache_key_with_user(self):
        """Should include user ID when specified."""
        key = generate_cache_key(
            endpoint="/api/users/me",
            organization_id="org-123",
            query_params={},
            user_id="user-456",
        )

        assert "user-456" in key
        assert key.endswith("user-456")  # User ID should be last component

    def test_generate_cache_key_consistency(self):
        """Should generate same key for same inputs."""
        key1 = generate_cache_key(
            endpoint="/api/deals",
            organization_id="org-123",
            query_params={"status": "active", "page": "1"},
        )
        key2 = generate_cache_key(
            endpoint="/api/deals",
            organization_id="org-123",
            query_params={"page": "1", "status": "active"},  # Different order
        )

        assert key1 == key2  # Should be same despite param order

    def test_generate_cache_key_different_orgs(self):
        """Should generate different keys for different organizations."""
        key1 = generate_cache_key(
            endpoint="/api/deals",
            organization_id="org-123",
            query_params={},
        )
        key2 = generate_cache_key(
            endpoint="/api/deals",
            organization_id="org-456",
            query_params={},
        )

        assert key1 != key2
        assert "org-123" in key1
        assert "org-456" in key2


class TestCacheStats:
    """Test cache statistics tracking."""

    @patch("app.core.cache.get_redis_client")
    def test_get_cache_stats_no_redis(self, mock_redis):
        """Should return zeros when Redis unavailable."""
        mock_redis.return_value = None

        stats = get_cache_stats()

        assert stats["hits"] == 0
        assert stats["misses"] == 0
        assert stats["hit_rate"] == 0.0
        assert stats["available"] is False

    @patch("app.core.cache.get_redis_client")
    def test_get_cache_stats_with_data(self, mock_redis):
        """Should calculate hit rate correctly."""
        mock_client = MagicMock()
        mock_client.get.side_effect = lambda key: {
            "cache:stats:hits": "80",
            "cache:stats:misses": "20",
        }.get(key, "0")
        mock_redis.return_value = mock_client

        stats = get_cache_stats()

        assert stats["hits"] == 80
        assert stats["misses"] == 20
        assert stats["total_requests"] == 100
        assert stats["hit_rate"] == 80.0
        assert stats["available"] is True


class TestCacheInvalidation:
    """Test cache invalidation functionality."""

    @patch("app.core.cache.get_redis_client")
    def test_invalidate_cache_pattern(self, mock_redis):
        """Should delete keys matching pattern."""
        mock_client = MagicMock()
        mock_client.keys.return_value = [
            "api:v1:deals:org-123:abc123",
            "api:v1:deals:org-123:def456",
        ]
        mock_client.delete.return_value = 2
        mock_redis.return_value = mock_client

        deleted = invalidate_cache_pattern("api:v1:deals:org-123:*")

        assert deleted == 2
        mock_client.keys.assert_called_once_with("api:v1:deals:org-123:*")
        mock_client.delete.assert_called_once()

    @patch("app.core.cache.get_redis_client")
    def test_invalidate_cache_pattern_no_matches(self, mock_redis):
        """Should return 0 when no keys match."""
        mock_client = MagicMock()
        mock_client.keys.return_value = []
        mock_redis.return_value = mock_client

        deleted = invalidate_cache_pattern("api:v1:nonexistent:*")

        assert deleted == 0
        mock_client.delete.assert_not_called()


class DummyUser:
    def __init__(self, organization_id="org-1", user_id="user-1"):
        self.organization_id = organization_id
        self.id = user_id


class FakeRedis:
    def __init__(self):
        self.store: dict[str, str] = {}

    def get(self, key: str):
        return self.store.get(key)

    def setex(self, key: str, ttl: int, value: str):
        self.store[key] = value

    def incr(self, key: str):
        current = int(self.store.get(key, "0"))
        self.store[key] = str(current + 1)
        return self.store[key]

    def keys(self, pattern: str):
        from fnmatch import fnmatch
        return [k for k in self.store if fnmatch(k, pattern)]

    def delete(self, *keys):
        deleted = 0
        for key in keys:
            if key in self.store:
                del self.store[key]
                deleted += 1
        return deleted


class TestCachedResponseDecorator:
    """Test the @cached_response decorator."""

    def _build_client(self, monkeypatch, redis_client):
        from fastapi import FastAPI, Depends, Request
        from fastapi.testclient import TestClient
        from app.core.cache import cached_response, get_redis_client

        monkeypatch.setattr("app.core.cache.get_redis_client", lambda: redis_client)

        app = FastAPI()
        hit_counter = {"count": 0}

        def get_user():
            return DummyUser()

        @app.get("/cached")
        @cached_response(ttl=60)
        async def cached_endpoint(request: Request, current_user: DummyUser = Depends(get_user)):
            hit_counter["count"] += 1
            return {"hits": hit_counter["count"]}

        @app.post("/cached")
        @cached_response(ttl=60)
        async def cached_post(request: Request, current_user: DummyUser = Depends(get_user)):
            hit_counter["count"] += 1
            return {"hits": hit_counter["count"]}

        return TestClient(app), hit_counter

    def test_caches_get_requests(self, monkeypatch):
        redis_client = FakeRedis()
        client, counter = self._build_client(monkeypatch, redis_client)

        first = client.get("/cached")
        second = client.get("/cached")

        assert first.json() == {"hits": 1}
        assert second.json() == {"hits": 1}
        assert "X-Cache" in second.headers
        assert second.headers["X-Cache"] == "HIT"
        assert redis_client.store  # cache populated

    def test_bypasses_non_get_requests(self, monkeypatch):
        redis_client = FakeRedis()
        client, counter = self._build_client(monkeypatch, redis_client)

        response = client.post("/cached")

        assert response.status_code == 200
        assert response.json() == {"hits": 1}
        assert counter["count"] == 1
        assert not redis_client.store  # POST should not cache

    def test_respects_bypass_header(self, monkeypatch):
        redis_client = FakeRedis()
        client, counter = self._build_client(monkeypatch, redis_client)

        response = client.get("/cached", headers={"X-Cache-Bypass": "true"})

        assert response.status_code == 200
        assert "X-Cache" not in response.headers
        assert counter["count"] == 1
        assert not redis_client.store

    def test_returns_cached_response_on_hit(self, monkeypatch):
        redis_client = FakeRedis()
        client, counter = self._build_client(monkeypatch, redis_client)

        client.get("/cached")
        second = client.get("/cached")

        assert second.headers["X-Cache"] == "HIT"
        assert counter["count"] == 1  # endpoint executed once

    def test_caches_response_on_miss(self, monkeypatch):
        redis_client = FakeRedis()
        client, counter = self._build_client(monkeypatch, redis_client)

        client.get("/cached")
        cached_keys = [
            key
            for key in redis_client.store
            if key.startswith("api:v1:cached") or key.startswith("api:v1::cached")
        ]
        assert cached_keys, f"No cached keys found in store: {redis_client.store}"


class TestCacheMultiTenancy:
    """Test multi-tenant cache isolation."""

    def test_different_orgs_different_caches(self):
        """Should isolate cache by organization."""
        key1 = generate_cache_key(
            endpoint="/api/deals",
            organization_id="org-A",
            query_params={"status": "active"},
        )
        key2 = generate_cache_key(
            endpoint="/api/deals",
            organization_id="org-B",
            query_params={"status": "active"},
        )

        assert key1 != key2
        assert "org-A" in key1
        assert "org-B" in key2

    def test_cache_key_includes_org_id(self):
        """Should always include organization ID in cache keys."""
        key = generate_cache_key(
            endpoint="/api/analytics/dashboard",
            organization_id="org-XYZ",
            query_params={},
        )

        assert "org-XYZ" in key


# TDD RED PHASE COMPLETE
# These tests establish requirements for cache functionality
# Next: Implement caching on actual endpoints (GREEN phase)
