from app.core.cache.decorators import cache_result, invalidate_cache

def cache_inventory_list(ttl: int = 60):
    return cache_result("inventory_list", ttl=ttl)

def clear_inventory_cache():
    invalidate_cache("inventory_list")
