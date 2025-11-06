from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# ============= User Schemas =============
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None

class UserResponse(UserBase):
    id: int
    is_active: bool
    role_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: Optional[int] = None

# ============= Role Schemas =============
class RoleBase(BaseModel):
    name: str
    description: Optional[str] = None

class RoleCreate(RoleBase):
    pass

class RoleResponse(RoleBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# ============= Poll Option Schemas =============
class PollOptionBase(BaseModel):
    name: str
    description: Optional[str] = None
    order: int = 0

class PollOptionCreate(PollOptionBase):
    pass  # poll_id will be set in the route

class PollOptionResponse(PollOptionBase):
    id: int
    poll_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# ============= Poll Schemas =============
class PollBase(BaseModel):
    name: str
    description: Optional[str] = None
    poll_type: Optional[str] = "corporate_survey"
    status: Optional[str] = "draft"

class PollCreate(PollBase):
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    options: Optional[List[dict]] = None

class PollUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

class PollResponse(PollBase):
    id: int
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# ============= Team Schemas =============
class TeamBase(BaseModel):
    name: str
    description: Optional[str] = None
    status: Optional[str] = "active"

class TeamCreate(TeamBase):
    pass

class TeamUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

class TeamResponse(TeamBase):
    id: int
    registration_date: datetime
    created_at: datetime

    class Config:
        from_attributes = True

# ============= Participant Schemas =============
class ParticipantBase(BaseModel):
    full_name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class ParticipantCreate(ParticipantBase):
    user_id: Optional[int] = None
    team_id: Optional[int] = None
    birth_date: Optional[datetime] = None

class ParticipantUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    team_id: Optional[int] = None
    status: Optional[str] = None

class ParticipantResponse(ParticipantBase):
    id: int
    user_id: Optional[int] = None
    team_id: Optional[int] = None
    status: str
    registration_date: datetime
    created_at: datetime

    class Config:
        from_attributes = True

# ============= Vote Schemas =============
class VoteBase(BaseModel):
    poll_id: int
    option_id: int

class VoteCreate(VoteBase):
    participant_id: Optional[int] = None  # Optional - will be set from current_user
    location: Optional[str] = None

class VoteResponse(VoteBase):
    id: int
    participant_id: int
    vote_time: datetime
    created_at: datetime

    class Config:
        from_attributes = True

# ============= Result Schemas =============
class ResultBase(BaseModel):
    poll_id: int
    vote_count: int = 0
    percentage: float = 0.0

class ResultCreate(ResultBase):
    team_id: Optional[int] = None
    option_id: Optional[int] = None

class ResultResponse(ResultBase):
    id: int
    team_id: Optional[int] = None
    option_id: Optional[int] = None
    processed_at: datetime
    created_at: datetime

    class Config:
        from_attributes = True

# ============= Feedback Schemas =============
class FeedbackBase(BaseModel):
    title: str
    description: str
    feedback_type: Optional[str] = "suggestion"

class FeedbackCreate(FeedbackBase):
    pass

class FeedbackUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    admin_id: Optional[int] = None

class FeedbackResponse(FeedbackBase):
    id: int
    participant_id: int
    admin_id: Optional[int] = None
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# ============= Staff Schemas =============
class StaffBase(BaseModel):
    full_name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    position: Optional[str] = None

class StaffCreate(StaffBase):
    user_id: int
    birth_date: Optional[datetime] = None
    address: Optional[str] = None

class StaffUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    position: Optional[str] = None
    status: Optional[str] = None

class StaffResponse(StaffBase):
    id: int
    user_id: int
    status: str
    hire_date: datetime
    created_at: datetime

    class Config:
        from_attributes = True
