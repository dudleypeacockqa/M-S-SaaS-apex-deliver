"""
Redis HTTP Response Caching Module

Provides decorators and utilities for caching HTTP responses in Redis.
Follows multi-tenant architecture with organization-scoped cache keys.

Usage:
    from app.core.cache import cached_response

    @router.get("/deals")
    @cached_response(ttl=300)  # 5 minutes
    async def get_deals(
        current_user: User = Depends(get_current_user),
        db: AsyncSession = Depends(get_db)
    ):
        # This response will be cached per organization
        return await deal_service.get_deals(db, current_user.organization_id)
"""

import hashlib
import json
from functools import wraps
from typing import Any, Callable, Optional
from fastapi import Request, Response
from redis import Redis
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# Redis client (will be initialized in lifespan)
_redis_client: Optional[Redis] = None


def get_redis_client() -> Optional[Redis]:
    """Get the global Redis client instance."""
    global _redis_client
    if _redis_client is None and settings.redis_url:
        try:
            _redis_client = Redis.from_url(
                settings.redis_url,
                decode_responses=True,
                socket_connect_timeout=5,
                socket_timeout=5,
            )
            # Test connection
            _redis_client.ping()
            logger.info("Redis client initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Redis client: {e}")
            _redis_client = None
    return _redis_client


def generate_cache_key(
    endpoint: str,
    organization_id: str,
    query_params: dict,
    user_id: Optional[str] = None,
) -> str:
    """
    Generate a unique cache key for the request.

    Format: api:v1:{endpoint}:{org_id}:{params_hash}[:user_id]

    Args:
        endpoint: API endpoint path (e.g., "/api/deals")
        organization_id: Organization ID for multi-tenancy
        query_params: Query parameters dictionary
        user_id: Optional user ID for user-specific caching

    Returns:
        Redis cache key string
    """
    # Sort query params for consistent hashing
    sorted_params = json.dumps(query_params, sort_keys=True)
    params_hash = hashlib.md5(sorted_params.encode()).hexdigest()[:8]

    # Clean endpoint path
    clean_endpoint = endpoint.replace("/api/", "").replace("/", ":")

    key_parts = ["api", "v1", clean_endpoint, organization_id, params_hash]

    if user_id:
        key_parts.append(user_id)

    return ":".join(key_parts)


def cached_response(
    ttl: int = 300,
    user_specific: bool = False,
    bypass_header: str = "X-Cache-Bypass",
):
    """
    Decorator for caching FastAPI endpoint responses in Redis.

    Features:
    - Multi-tenant: Cache keys include organization_id
    - Configurable TTL per endpoint
    - Optional user-specific caching
    - Cache bypass via header
    - Automatic cache invalidation on non-GET requests

    Args:
        ttl: Time-to-live in seconds (default: 300 = 5 minutes)
        user_specific: If True, cache separately per user (default: False)
        bypass_header: Header name to bypass cache (default: "X-Cache-Bypass")

    Usage:
        @router.get("/deals")
        @cached_response(ttl=300)
        async def get_deals(
            request: Request,
            current_user: User = Depends(get_current_user),
            db: AsyncSession = Depends(get_db)
        ):
            return await deal_service.get_deals(db, current_user.organization_id)

    Example cache keys:
        - api:v1:deals:org-123:a3f2e1c7  (organization-scoped)
        - api:v1:users:me:org-123:d4b9a8e2:user-456  (user-specific)
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Extract request and current_user from kwargs
            request: Optional[Request] = kwargs.get("request")
            current_user = kwargs.get("current_user")

            # If no request or user, skip caching
            if not request or not current_user:
                return await func(*args, **kwargs)

            # Check cache bypass header
            if request.headers.get(bypass_header) == "true":
                logger.debug(f"Cache bypass header detected for {request.url.path}")
                return await func(*args, **kwargs)

            # Only cache GET requests
            if request.method != "GET":
                return await func(*args, **kwargs)

            # Get Redis client
            redis = get_redis_client()
            if not redis:
                logger.warning("Redis not available, skipping cache")
                return await func(*args, **kwargs)

            # Generate cache key
            organization_id = str(current_user.organization_id)
            query_params = dict(request.query_params)
            user_id = str(current_user.id) if user_specific else None

            cache_key = generate_cache_key(
                endpoint=request.url.path,
                organization_id=organization_id,
                query_params=query_params,
                user_id=user_id,
            )

            try:
                # Try to get cached response
                cached_data = redis.get(cache_key)

                if cached_data:
                    logger.debug(f"Cache HIT: {cache_key}")
                    # Increment cache hit counter
                    redis.incr("cache:stats:hits")

                    # Parse and return cached response
                    return Response(
                        content=cached_data,
                        media_type="application/json",
                        headers={"X-Cache": "HIT"},
                    )

                # Cache miss - call the actual function
                logger.debug(f"Cache MISS: {cache_key}")
                redis.incr("cache:stats:misses")

                # Execute the endpoint function
                result = await func(*args, **kwargs)

                # Cache the result
                try:
                    # Serialize response
                    if hasattr(result, "model_dump_json"):
                        # Pydantic model
                        cached_content = result.model_dump_json()
                    elif isinstance(result, (dict, list)):
                        # Dict or list
                        cached_content = json.dumps(result)
                    else:
                        # Other types - skip caching
                        logger.warning(f"Cannot cache response type: {type(result)}")
                        return result

                    # Store in Redis with TTL
                    redis.setex(cache_key, ttl, cached_content)
                    logger.debug(f"Cached response for {cache_key} (TTL: {ttl}s)")

                except Exception as e:
                    logger.error(f"Failed to cache response: {e}")

                return result

            except Exception as e:
                logger.error(f"Cache operation failed: {e}")
                # Fallback to non-cached response
                return await func(*args, **kwargs)

        return wrapper
    return decorator


def invalidate_cache_pattern(pattern: str) -> int:
    """
    Invalidate all cache keys matching a pattern.

    Useful for cache invalidation on POST/PUT/DELETE operations.

    Args:
        pattern: Redis key pattern (e.g., "api:v1:deals:org-123:*")

    Returns:
        Number of keys deleted

    Example:
        # Invalidate all deal caches for org-123
        invalidate_cache_pattern("api:v1:deals:org-123:*")
    """
    redis = get_redis_client()
    if not redis:
        return 0

    try:
        keys = redis.keys(pattern)
        if keys:
            deleted = redis.delete(*keys)
            logger.info(f"Invalidated {deleted} cache keys matching: {pattern}")
            return deleted
        return 0
    except Exception as e:
        logger.error(f"Failed to invalidate cache pattern {pattern}: {e}")
        return 0


def get_cache_stats() -> dict:
    """
    Get cache performance statistics.

    Returns:
        Dictionary with hits, misses, hit rate
    """
    redis = get_redis_client()
    if not redis:
        return {"hits": 0, "misses": 0, "hit_rate": 0.0, "available": False}

    try:
        hits = int(redis.get("cache:stats:hits") or 0)
        misses = int(redis.get("cache:stats:misses") or 0)
        total = hits + misses
        hit_rate = (hits / total * 100) if total > 0 else 0.0

        return {
            "hits": hits,
            "misses": misses,
            "total_requests": total,
            "hit_rate": round(hit_rate, 2),
            "available": True,
        }
    except Exception as e:
        logger.error(f"Failed to get cache stats: {e}")
        return {"hits": 0, "misses": 0, "hit_rate": 0.0, "available": False}


def reset_cache_stats():
    """Reset cache statistics counters."""
    redis = get_redis_client()
    if redis:
        redis.delete("cache:stats:hits", "cache:stats:misses")
        logger.info("Cache statistics reset")
