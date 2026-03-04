from sqlalchemy.orm import Session
from app.auth.models import User
from app.core.cache.decorators import cache_result, invalidate_cache

@cache_result("user_perms", ttl=300)
def get_user_permissions(user_id: int, db: Session):
    """
    Fetch all permission codes for a given user.
    Cached for 5 minutes.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return []
    
    if user.is_admin:
        return ["*"] # Superuser wildcard
        
    permissions = set()
    for role in user.roles:
        for perm in role.permissions:
            permissions.add(perm.code)
            
    return list(permissions)

def clear_permission_cache(user_id: int):
    """Invalidate permission cache for a specific user"""
    # Note: Our decorator uses kwargs in the key. 
    # To clear specific user, we'd need a more targeted invalidation or 
    # just clear all 'user_perms' namespace.
    invalidate_cache("user_perms")
