from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class VotingResultBase(BaseModel):
    election_id: int
    party_id: int
    vote_count: int
    percentage: float


class VotingResultCreate(VotingResultBase):
    pass


class VotingResultUpdate(BaseModel):
    vote_count: Optional[int] = None
    percentage: Optional[float] = None


class VotingResultResponse(VotingResultBase):
    id: int
    processed_date: datetime

    class Config:
        from_attributes = True
