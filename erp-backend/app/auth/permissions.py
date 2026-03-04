from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.auth.models import Permission, User
from app.auth.dependencies import get_current_user
from app.core.database import get_db

from app.auth.service import get_user_permissions

def require_permission(permission_code: str):
    def checker(
        user: User = Depends(get_current_user),
        db: Session = Depends(get_db),
    ):
        # Admin has full access
        if user.is_admin:
            return user

        # Use CACHED permission fetch
        user_permissions = get_user_permissions(user_id=user.id, db=db)

        if "*" in user_permissions or permission_code in user_permissions:
            return user

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access denied: {permission_code} required"
        )

    return checker
