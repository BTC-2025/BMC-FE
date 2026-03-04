from fastapi import Depends, HTTPException, Request
from typing import Optional
from app.core.database import get_db
from app.auth.dependencies import get_current_user
from app.auth.models import User

# In a real SaaS, we might parse subdomain (e.g., acme.erp.com)
# For now, we rely on the User's tenant_id

def get_current_tenant_id(
    user: Optional[User] = Depends(get_current_user),
    request: Request = None
) -> int:
    """
    Resolves the tenant_id for the current request.
    1. If user is logged in -> return user.tenant_id
    2. If public endpoint (no user) -> check header X-Tenant-ID (for testing/onboarding)
    3. Fail if unresolved.
    """
    if user and user.tenant_id:
        return user.tenant_id
    
    # Fallback for onboarding/testing without login
    if request:
        header_tenant = request.headers.get("X-Tenant-ID")
        if header_tenant:
           try:
               return int(header_tenant)
           except ValueError:
               pass

    # If we are here, we failed to resolve tenant
    # However, some endpoints might be truly public (like login). 
    # Those endpoints shouldn't depend on this function.
    # If this dependency is enforced, we must raise error.
    raise HTTPException(status_code=400, detail="Tenant context required but not resolved")
