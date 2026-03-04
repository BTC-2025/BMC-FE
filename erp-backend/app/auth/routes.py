from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.security import verify_password, create_access_token, create_refresh_token, hash_password, SECRET_KEY, ALGORITHM
from jose import jwt, JWTError
from app.auth.models import User, Role, Permission
from app.auth.schemas import LoginRequest, TokenResponse, RefreshTokenRequest, CreateUserRequest, UserResponse, RegisterRequest
from app.auth.dependencies import get_current_user
from app.core.tenant.models import Tenant

from app.core.ratelimit import limiter
from fastapi import Request

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    # Check email separately
    email_exists = db.query(User).filter(User.email == data.email).first()
    if email_exists:
        raise HTTPException(
            status_code=400, 
            detail="Email already registered. Please use a different email or login."
        )
    
    # Check username separately  
    username_exists = db.query(User).filter(User.username == data.username).first()
    if username_exists:
        raise HTTPException(
            status_code=400,
            detail="Username already taken. Please choose a different username."
        )

    # 2. Create Tenant
    new_tenant = Tenant(name=data.company_name)
    db.add(new_tenant)
    db.flush() # Get ID

    # 3. Create User
    new_user = User(
        username=data.username,
        email=data.email,
        full_name=data.full_name,
        hashed_password=hash_password(data.password),
        is_admin=True, # First user is admin of their tenant
        tenant_id=new_tenant.id
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully", "user_id": new_user.id}

# --- AUTH LOGIC (Step 5) ---

@router.post("/login", response_model=TokenResponse)
@limiter.limit("5/minute")
def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    print(f"Login attempt for: {form_data.username}")
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user:
        print("User not found")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(form_data.password, user.hashed_password):
        print("Password mismatch")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not user.is_active:
        raise HTTPException(status_code=401, detail="User account is disabled")

    access_token = create_access_token({"sub": user.username})
    refresh_token = create_refresh_token({"sub": user.username})

    # PROD: Trigger Audit for Security Compliance
    from app.core.audit.service import log_action
    log_action(
        db,
        tenant_id=user.tenant_id,
        user_id=user.id,
        action="auth.login",
        module="auth",
        entity_type="User",
        entity_id=user.id,
        request=request
    )

    return {
        "access_token": access_token, 
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/refresh", response_model=TokenResponse)
def refresh_token(data: RefreshTokenRequest, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(data.refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid refresh token")
            
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate refresh token")

    user = db.query(User).filter(User.username == username).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User not found or inactive")

    new_access = create_access_token({"sub": user.username})
    new_refresh = create_refresh_token({"sub": user.username})
    
    return {
        "access_token": new_access,
        "refresh_token": new_refresh,
        "token_type": "bearer"
    }

@router.get("/me")
def me(user=Depends(get_current_user), db: Session = Depends(get_db)):
    from app.auth.service import get_user_permissions
    permissions = get_user_permissions(user.id, db)
    roles = [r.name for r in user.roles]
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "full_name": user.full_name,
        "is_admin": user.is_admin,
        "is_active": user.is_active,
        "roles": roles,
        "permissions": permissions
    }

# --- USER MANAGEMENT (Step 7 - ADMIN ONLY) ---

@router.post("/users", response_model=UserResponse)
def create_user(
    data: CreateUserRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Admin only")

    # Enforce User Limit (Step 29.5)
    from app.billing.context import check_user_limit
    check_user_limit(user.tenant_id, db)

    exists = db.query(User).filter(
        (User.username == data.username) |
        (User.email == data.email)
    ).first()
    if exists:
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = User(
        username=data.username,
        email=data.email,
        hashed_password=hash_password(data.password),
        is_admin=data.is_admin,
        tenant_id=user.tenant_id, # Safely inherit tenant
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@router.get("/users", response_model=List[UserResponse])
def list_users(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Admin only")

    return db.query(User).filter(User.tenant_id == user.tenant_id).all()

@router.patch("/users/{user_id}")
def toggle_user_status(
    user_id: int,
    is_active: bool,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Admin only")

    target = db.query(User).filter(User.id == user_id, User.tenant_id == user.tenant_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")

    target.is_active = is_active
    db.commit()
    return {"message": f"User status updated to {'active' if is_active else 'inactive'}"}

# --- ROLE & PERMISSION MANAGEMENT (Step 6 - ADMIN ONLY) ---

@router.post("/roles")
def create_role(
    name: str,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")

    role = Role(name=name)
    db.add(role)
    db.commit()
    return {"message": "Role created"}

@router.post("/permissions")
def create_permission(
    code: str,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")

    perm = Permission(code=code)
    db.add(perm)
    db.commit()
    return {"message": "Permission created"}

@router.post("/roles/{role_id}/permissions/{permission_id}")
def assign_permission_to_role(
    role_id: int,
    permission_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")

    role = db.query(Role).get(role_id)
    perm = db.query(Permission).get(permission_id)
    
    if not role or not perm:
        raise HTTPException(status_code=404, detail="Role or Permission not found")

    if perm not in role.permissions:
        role.permissions.append(perm)
        db.commit()
    return {"message": "Permission assigned"}

@router.post("/users/{user_id}/roles/{role_id}")
def assign_role_to_user(
    user_id: int,
    role_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")

    target_user = db.query(User).filter(User.id == user_id, User.tenant_id == user.tenant_id).first()
    role = db.query(Role).get(role_id) # Role management needs its own isolation check if roles are tenant-bound

    if not target_user or not role:
        raise HTTPException(status_code=404, detail="User or Role not found")

    if role not in target_user.roles:
        target_user.roles.append(role)
        db.commit()
    return {"message": "Role assigned"}
