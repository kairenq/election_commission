from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime


class PartyBase(BaseModel):
    name: str
    registration_date: date
    status: Optional[str] = ":B82=0"


class PartyCreate(PartyBase):
    password: str


class PartyUpdate(BaseModel):
    name: Optional[str] = None
    registration_date: Optional[date] = None
    status: Optional[str] = None


class PartyResponse(PartyBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
