import json
from functools import wraps
from typing import Any, Callable, Optional
from app.core.cache.redis import redis_client

def cache_result(namespace: str, ttl: int = 300):
    """
    Decorator to cache function results in Redis.
    Args:
        namespace: Prefix for the cache key (e.g., 'bi_stats')
        ttl: Time to live in seconds (default 5 minutes)
    """
    def decorator(func: Callable):
        @wraps(func)
        def wrapper(*args, **kwargs) -> Any:
            # Create a unique key based on arguments
            # We skip the 'db' argument as it's not serializable
            filtered_kwargs = {k: v for k, v in kwargs.items() if k != 'db'}
            key = f"cache:{namespace}:{json.dumps(filtered_kwargs, sort_keys=True)}"
            
            try:
                # 1. Try fetching from cache
                cached_data = redis_client.get(key)
                if cached_data:
                    return json.loads(cached_data)
            except Exception as e:
                # If Redis is down, fail gracefully and hit the DB
                print(f"⚠️ Cache Error (GET): {e}")

            # 2. Cache miss or error - execute original function
            result = func(*args, **kwargs)

            try:
                # 3. Store result in cache
                redis_client.setex(key, ttl, json.dumps(result))
            except Exception as e:
                print(f"⚠️ Cache Error (SET): {e}")

            return result
        return wrapper
    return decorator

def invalidate_cache(namespace: str):
    """Clear all keys in a specific namespace"""
    try:
        pattern = f"cache:{namespace}:*"
        keys = redis_client.keys(pattern)
        if keys:
            redis_client.delete(*keys)
    except Exception as e:
        print(f"⚠️ Cache Invalidation Error: {e}")
