from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ComplaintBase(BaseModel):
    voter_id: int
    complaint_type: str
    description: str


class ComplaintCreate(ComplaintBase):
    pass


class ComplaintUpdate(BaseModel):
    complaint_type: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    staff_id: Optional[int] = None


class ComplaintResponse(ComplaintBase):
    id: int
    staff_id: Optional[int] = None
    complaint_date: datetime
    status: str

    class Config:
        from_attributes = True
