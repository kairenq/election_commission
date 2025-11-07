from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..core import get_db
from ..models import Participant, User, Team
from ..schemas import ParticipantCreate, ParticipantUpdate, ParticipantResponse
from .auth import get_current_user

router = APIRouter(prefix="/participants", tags=["Participants"])

@router.get("/", response_model=List[ParticipantResponse])
async def get_participants(
    skip: int = 0,
    limit: int = 100,
    team_id: int = None,
    db: Session = Depends(get_db)
):
    """Get all participants, optionally filtered by team"""
    query = db.query(Participant)
    if team_id:
        query = query.filter(Participant.team_id == team_id)
    return query.offset(skip).limit(limit).all()

@router.get("/me", response_model=ParticipantResponse)
async def get_my_participant(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's participant record, creating it if it doesn't exist"""
    participant = db.query(Participant).filter(Participant.user_id == current_user.id).first()

    # Auto-create participant record if it doesn't exist
    if not participant:
        participant = Participant(
            user_id=current_user.id,
            full_name=current_user.full_name or current_user.username,
            email=current_user.email,
            status="active"
        )
        db.add(participant)
        db.commit()
        db.refresh(participant)

    return participant

@router.post("/join-team", response_model=ParticipantResponse)
async def join_team(
    team_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Join a team or update team membership"""
    # Check if team exists
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    # Check if user already has a participant record
    participant = db.query(Participant).filter(Participant.user_id == current_user.id).first()

    if participant:
        # Update existing participant's team
        participant.team_id = team_id
    else:
        # Create new participant record
        participant = Participant(
            user_id=current_user.id,
            team_id=team_id,
            full_name=current_user.full_name or current_user.username,
            email=current_user.email
        )
        db.add(participant)

    db.commit()
    db.refresh(participant)
    return participant

@router.post("/leave-team", response_model=ParticipantResponse)
async def leave_team(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Leave current team"""
    participant = db.query(Participant).filter(Participant.user_id == current_user.id).first()
    if not participant:
        raise HTTPException(status_code=404, detail="Participant record not found")

    participant.team_id = None
    db.commit()
    db.refresh(participant)
    return participant

@router.get("/{participant_id}", response_model=ParticipantResponse)
async def get_participant(participant_id: int, db: Session = Depends(get_db)):
    """Get a specific participant"""
    participant = db.query(Participant).filter(Participant.id == participant_id).first()
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")
    return participant

@router.post("/", response_model=ParticipantResponse, status_code=201)
async def create_participant(
    participant_data: ParticipantCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new participant (admin only)"""
    if not (current_user.is_superuser or current_user.role_id == 1):
        raise HTTPException(status_code=403, detail="Not authorized")

    db_participant = Participant(**participant_data.model_dump())
    db.add(db_participant)
    db.commit()
    db.refresh(db_participant)
    return db_participant

@router.put("/{participant_id}", response_model=ParticipantResponse)
async def update_participant(
    participant_id: int,
    participant_data: ParticipantUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a participant (admin only)"""
    if not (current_user.is_superuser or current_user.role_id == 1):
        raise HTTPException(status_code=403, detail="Not authorized")

    db_participant = db.query(Participant).filter(Participant.id == participant_id).first()
    if not db_participant:
        raise HTTPException(status_code=404, detail="Participant not found")

    for field, value in participant_data.model_dump(exclude_unset=True).items():
        setattr(db_participant, field, value)

    db.commit()
    db.refresh(db_participant)
    return db_participant

@router.delete("/{participant_id}", status_code=204)
async def delete_participant(
    participant_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a participant (admin only)"""
    if not (current_user.is_superuser or current_user.role_id == 1):
        raise HTTPException(status_code=403, detail="Not authorized")

    db_participant = db.query(Participant).filter(Participant.id == participant_id).first()
    if not db_participant:
        raise HTTPException(status_code=404, detail="Participant not found")

    db.delete(db_participant)
    db.commit()

@router.delete("/{participant_id}/remove-from-team", status_code=204)
async def remove_from_team(
    participant_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove a participant from their team (admin only)"""
    if not (current_user.is_superuser or current_user.role_id == 1):
        raise HTTPException(status_code=403, detail="Not authorized")

    db_participant = db.query(Participant).filter(Participant.id == participant_id).first()
    if not db_participant:
        raise HTTPException(status_code=404, detail="Participant not found")

    db_participant.team_id = None
    db.commit()
