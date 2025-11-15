from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime


class ElectionBase(BaseModel):
    name: str
    start_date: date
    end_date: date
    election_type: str
    status: Optional[str] = "0?;0=8@>20=K"


class ElectionCreate(ElectionBase):
    pass


class ElectionUpdate(BaseModel):
    name: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    election_type: Optional[str] = None
    status: Optional[str] = None


class ElectionResponse(ElectionBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
