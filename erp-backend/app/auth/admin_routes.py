from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from app.core.database import get_db
from app.auth.models import User, Role, Permission
from app.auth.dependencies import get_current_user
from app.auth import schemas

router = APIRouter(prefix="/admin", tags=["Admin"])

def require_super_admin(user=Depends(get_current_user)):
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Super Admin access required")
    return user

# --- Users ---

@router.get("/users", response_model=List[schemas.User])
def get_users(db: Session = Depends(get_db), admin=Depends(require_super_admin)):
    return db.query(User).filter(User.tenant_id == admin.tenant_id).all()

@router.post("/users", response_model=schemas.UserResponse)
def create_user(
    data: schemas.CreateUserRequest,
    db: Session = Depends(get_db),
    admin=Depends(require_super_admin)
):
    from app.core.security import hash_password
    exists = db.query(User).filter(User.username == data.username).first()
    if exists:
        raise HTTPException(status_code=400, detail="User already exists")
    
    new_user = User(
        username=data.username,
        email=data.email,
        hashed_password=hash_password(data.password),
        is_admin=data.is_admin,
        tenant_id=admin.tenant_id
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

class UpdateUserRoles(BaseModel):
    roles: List[int]

@router.patch("/users/{user_id}/roles")
def update_user_roles(
    user_id: int,
    data: UpdateUserRoles,
    request: Request,
    db: Session = Depends(get_db),
    admin=Depends(require_super_admin)
):
    user = db.query(User).filter(User.id == user_id, User.tenant_id == admin.tenant_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    before_roles = [r.name for r in user.roles]
    roles = db.query(Role).filter(Role.id.in_(data.roles)).all()
    user.roles = roles
    db.commit()

    from app.auth.service import clear_permission_cache
    clear_permission_cache(user_id=user.id)

    from app.core.audit.service import log_action
    log_action(
        db,
        tenant_id=admin.tenant_id,
        user_id=admin.id,
        action="admin.user_roles_updated",
        module="admin",
        entity_type="User",
        entity_id=user.id,
        before={"roles": before_roles},
        after={"roles": [r.name for r in roles]},
        request=request
    )

    return {"message": "Roles updated"}

# --- Roles ---

@router.get("/roles", response_model=List[schemas.Role])
def get_roles(db: Session = Depends(get_db), admin=Depends(require_super_admin)):
    return db.query(Role).all()

class CreateRoleRequest(BaseModel):
    name: str
    description: Optional[str] = None
    permissions: List[int] = []

@router.post("/roles", response_model=schemas.Role)
def create_role(
    data: CreateRoleRequest,
    db: Session = Depends(get_db),
    admin=Depends(require_super_admin)
):
    role = Role(name=data.name, description=data.description)
    if data.permissions:
        perms = db.query(Permission).filter(Permission.id.in_(data.permissions)).all()
        role.permissions = perms
    db.add(role)
    db.commit()
    db.refresh(role)
    return role

class UpdateRoleRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    permissions: Optional[List[int]] = None

@router.patch("/roles/{role_id}", response_model=schemas.Role)
def update_role(
    role_id: int,
    data: UpdateRoleRequest,
    request: Request,
    db: Session = Depends(get_db),
    admin=Depends(require_super_admin)
):
    role = db.query(Role).get(role_id)
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    
    before_state = {"name": role.name, "description": role.description, "permissions": [p.code for p in role.permissions]}
    
    if data.name: role.name = data.name
    if data.description: role.description = data.description
    if data.permissions is not None:
        perms = db.query(Permission).filter(Permission.id.in_(data.permissions)).all()
        role.permissions = perms
    
    db.commit()
    db.refresh(role)

    from app.auth.service import clear_permission_cache
    clear_permission_cache(user_id=None)

    from app.core.audit.service import log_action
    log_action(
        db,
        tenant_id=admin.tenant_id,
        user_id=admin.id,
        action="admin.role_policy_updated",
        module="admin",
        entity_type="Role",
        entity_id=role.id,
        before=before_state,
        after={"name": role.name, "description": role.description, "permissions": [p.code for p in role.permissions]},
        request=request
    )

    return role

# --- Permissions ---

@router.get("/permissions", response_model=List[schemas.Permission])
def get_permissions(db: Session = Depends(get_db), admin=Depends(require_super_admin)):
    return db.query(Permission).all()
