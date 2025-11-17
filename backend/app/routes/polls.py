from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..core import get_db
from ..models import Poll, PollOption, User
from ..schemas import (
    PollCreate, PollUpdate, PollResponse,
    PollOptionCreate, PollOptionResponse
)
from .auth import get_current_active_user

router = APIRouter(prefix="/polls", tags=["Polls"])

@router.get("/", response_model=List[PollResponse])
async def get_polls(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all polls"""
    polls = db.query(Poll).offset(skip).limit(limit).all()
    return polls

@router.get("/{poll_id}", response_model=PollResponse)
async def get_poll(poll_id: int, db: Session = Depends(get_db)):
    """Get a specific poll with its options"""
    poll = db.query(Poll).filter(Poll.id == poll_id).first()
    if not poll:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Poll not found"
        )
    return poll

@router.post("/", response_model=PollResponse, status_code=status.HTTP_201_CREATED)
async def create_poll(
    poll_data: PollCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a new poll"""
    # Extract options from poll_data if present
    options_data = None
    poll_dict = poll_data.model_dump()

    if 'options' in poll_dict:
        options_data = poll_dict.pop('options')

    # Create poll
    db_poll = Poll(**poll_dict)
    db.add(db_poll)
    db.commit()
    db.refresh(db_poll)

    # Create options if provided
    if options_data:
        for idx, option_data in enumerate(options_data):
            db_option = PollOption(
                poll_id=db_poll.id,
                name=option_data.get('name', ''),
                description=option_data.get('description', ''),
                order=idx
            )
            db.add(db_option)
        db.commit()
        db.refresh(db_poll)

    return db_poll

@router.put("/{poll_id}", response_model=PollResponse)
async def update_poll(
    poll_id: int,
    poll_data: PollUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update a poll"""
    db_poll = db.query(Poll).filter(Poll.id == poll_id).first()
    if not db_poll:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Poll not found"
        )

    # Update fields
    update_data = poll_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_poll, field, value)

    db.commit()
    db.refresh(db_poll)
    return db_poll

@router.delete("/{poll_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_poll(
    poll_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Delete a poll"""
    db_poll = db.query(Poll).filter(Poll.id == poll_id).first()
    if not db_poll:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Poll not found"
        )

    db.delete(db_poll)
    db.commit()
    return None

# Poll Options endpoints
@router.get("/{poll_id}/options", response_model=List[PollOptionResponse])
async def get_poll_options(
    poll_id: int,
    db: Session = Depends(get_db)
):
    """Get all options for a specific poll"""
    poll = db.query(Poll).filter(Poll.id == poll_id).first()
    if not poll:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Poll not found"
        )

    options = db.query(PollOption).filter(PollOption.poll_id == poll_id).order_by(PollOption.order).all()
    return options

@router.post("/{poll_id}/options", response_model=PollOptionResponse, status_code=status.HTTP_201_CREATED)
async def create_poll_option(
    poll_id: int,
    option_data: PollOptionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a new option for a poll"""
    poll = db.query(Poll).filter(Poll.id == poll_id).first()
    if not poll:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Poll not found"
        )

    db_option = PollOption(
        poll_id=poll_id,
        **option_data.model_dump()
    )
    db.add(db_option)
    db.commit()
    db.refresh(db_option)
    return db_option
