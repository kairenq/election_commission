from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    email: EmailStr
    login: str


class UserCreate(UserBase):
    password: str
    role_id: int


class UserLogin(BaseModel):
    login: str
    password: str


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    login: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None


class UserResponse(UserBase):
    id: int
    role_id: int
    is_active: bool
    created_at: datetime
    role_name: Optional[str] = None

    class Config:
        from_attributes = True


class RoleBase(BaseModel):
    name: str


class RoleCreate(RoleBase):
    pass


class RoleResponse(RoleBase):
    id: int

    class Config:
        from_attributes = True
