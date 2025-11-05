from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime


class StaffBase(BaseModel):
    full_name: str
    date_of_birth: date
    address: str
    email: EmailStr
    phone: Optional[str] = None


class StaffCreate(StaffBase):
    password: str


class StaffUpdate(BaseModel):
    full_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    address: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None


class StaffResponse(StaffBase):
    id: int
    registration_date: datetime

    class Config:
        from_attributes = True
