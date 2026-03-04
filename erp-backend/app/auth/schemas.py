from typing import List, Optional
from pydantic import BaseModel, EmailStr, validator

# --- AUTH SCHEMAS (Step 5.2 & 7.1) ---

class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    username: Optional[str] = None

class RefreshTokenRequest(BaseModel):
    refresh_token: str

# --- USER SCHEMAS (Step 7.1) ---

class CreateUserRequest(BaseModel):
    username: str
    email: str
    password: str
    is_admin: bool = False

class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: str
    company_name: str
    
    @validator('username')
    def username_valid(cls, v):
        import re
        if not re.match(r'^[a-zA-Z0-9_]{3,20}$', v):
            raise ValueError('Username must be 3-20 characters (alphanumeric and underscore only)')
        return v
    
    @validator('password')
    def password_strong(cls, v):
        import re
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one number')
        return v

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: Optional[str] = None
    is_admin: bool
    is_active: bool

    class Config:
        from_attributes = True

# --- ROLE & PERMISSION SCHEMAS (Internal) ---

class PermissionBase(BaseModel):
    code: str
    description: Optional[str] = None

class Permission(PermissionBase):
    id: int
    class Config:
        from_attributes = True

class RoleBase(BaseModel):
    name: str
    description: Optional[str] = None

class Role(RoleBase):
    id: int
    permissions: List[Permission] = []
    class Config:
        from_attributes = True

class User(UserResponse):
    roles: List[Role] = []
    class Config:
        from_attributes = True
