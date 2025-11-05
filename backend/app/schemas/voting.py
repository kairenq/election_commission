from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class VoteBase(BaseModel):
    voter_id: int
    election_id: int
    voting_place: str
    voting_address: str


class VoteCreate(VoteBase):
    pass


class VoteUpdate(BaseModel):
    voting_place: Optional[str] = None
    voting_address: Optional[str] = None


class VoteResponse(VoteBase):
    id: int
    voting_time: datetime

    class Config:
        from_attributes = True
