from app.core.cache.decorators import cache_result, invalidate_cache

def cache_bi_stats(ttl: int = 60):
    return cache_result("bi_stats", ttl=ttl)

def clear_bi_cache():
    invalidate_cache("bi_stats")
