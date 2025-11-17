from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..core import get_db
from ..models import Feedback, User
from ..schemas import FeedbackCreate, FeedbackUpdate, FeedbackResponse
from .auth import get_current_active_user

router = APIRouter(prefix="/feedback", tags=["Feedback"])

@router.get("/", response_model=List[FeedbackResponse])
async def get_feedback(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all feedback"""
    return db.query(Feedback).offset(skip).limit(limit).all()

@router.get("/{feedback_id}", response_model=FeedbackResponse)
async def get_feedback_item(feedback_id: int, db: Session = Depends(get_db)):
    """Get a specific feedback item"""
    feedback = db.query(Feedback).filter(Feedback.id == feedback_id).first()
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")
    return feedback

@router.post("/", response_model=FeedbackResponse, status_code=201)
async def create_feedback(
    feedback_data: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Submit feedback"""
    db_feedback = Feedback(
        **feedback_data.model_dump(),
        participant_id=current_user.id
    )
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback

@router.put("/{feedback_id}", response_model=FeedbackResponse)
async def update_feedback(
    feedback_id: int,
    feedback_data: FeedbackUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update feedback status"""
    db_feedback = db.query(Feedback).filter(Feedback.id == feedback_id).first()
    if not db_feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")

    for field, value in feedback_data.model_dump(exclude_unset=True).items():
        setattr(db_feedback, field, value)

    db.commit()
    db.refresh(db_feedback)
    return db_feedback

@router.delete("/{feedback_id}", status_code=204)
async def delete_feedback(
    feedback_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Delete feedback"""
    db_feedback = db.query(Feedback).filter(Feedback.id == feedback_id).first()
    if not db_feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")

    db.delete(db_feedback)
    db.commit()
