from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime


class VoterBase(BaseModel):
    full_name: str
    date_of_birth: date
    address: str
    email: EmailStr
    phone: Optional[str] = None


class VoterCreate(VoterBase):
    password: str


class VoterUpdate(BaseModel):
    full_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    address: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None


class VoterResponse(VoterBase):
    id: int
    registration_date: datetime

    class Config:
        from_attributes = True
