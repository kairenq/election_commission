from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from ..core import get_db
from ..models import Vote, Poll, Participant, PollOption, User
from ..schemas import VoteCreate, VoteResponse
from .auth import get_current_active_user

router = APIRouter(prefix="/votes", tags=["Votes"])

@router.get("/", response_model=List[VoteResponse])
async def get_votes(
    skip: int = 0,
    limit: int = 100,
    poll_id: int = None,
    db: Session = Depends(get_db)
):
    """Get all votes"""
    query = db.query(Vote)
    if poll_id:
        query = query.filter(Vote.poll_id == poll_id)
    return query.offset(skip).limit(limit).all()

@router.get("/{vote_id}", response_model=VoteResponse)
async def get_vote(vote_id: int, db: Session = Depends(get_db)):
    """Get a specific vote"""
    vote = db.query(Vote).filter(Vote.id == vote_id).first()
    if not vote:
        raise HTTPException(status_code=404, detail="Vote not found")
    return vote

@router.post("/", response_model=VoteResponse, status_code=201)
async def create_vote(
    vote_data: VoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Cast a vote"""
    # Check if poll exists and is active
    poll = db.query(Poll).filter(Poll.id == vote_data.poll_id).first()
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")
    if poll.status != "active":
        raise HTTPException(status_code=400, detail="Poll is not active")

    # Check if option exists
    option = db.query(PollOption).filter(PollOption.id == vote_data.option_id).first()
    if not option or option.poll_id != vote_data.poll_id:
        raise HTTPException(status_code=404, detail="Invalid poll option")

    # Check if participant exists
    participant = db.query(Participant).filter(Participant.id == vote_data.participant_id).first()
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")

    # Check if already voted
    existing_vote = db.query(Vote).filter(
        Vote.poll_id == vote_data.poll_id,
        Vote.participant_id == vote_data.participant_id
    ).first()
    if existing_vote:
        raise HTTPException(status_code=400, detail="Already voted in this poll")

    # Create vote
    vote_time = datetime.utcnow()
    db_vote = Vote(
        **vote_data.model_dump(),
        vote_time=vote_time,
        vote_month=vote_time.strftime("%Y-%m")
    )
    db.add(db_vote)
    db.commit()
    db.refresh(db_vote)
    return db_vote

@router.get("/poll/{poll_id}/results")
async def get_poll_results(poll_id: int, db: Session = Depends(get_db)):
    """Get voting results for a poll"""
    poll = db.query(Poll).filter(Poll.id == poll_id).first()
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")

    # Count votes by option
    votes = db.query(Vote).filter(Vote.poll_id == poll_id).all()
    total_votes = len(votes)

    results = {}
    for vote in votes:
        option_id = vote.option_id
        if option_id not in results:
            option = db.query(PollOption).filter(PollOption.id == option_id).first()
            results[option_id] = {
                "option_id": option_id,
                "option_name": option.name if option else "Unknown",
                "vote_count": 0,
                "percentage": 0.0
            }
        results[option_id]["vote_count"] += 1

    # Calculate percentages
    for option_id in results:
        results[option_id]["percentage"] = (results[option_id]["vote_count"] / total_votes * 100) if total_votes > 0 else 0

    return {
        "poll_id": poll_id,
        "poll_name": poll.name,
        "total_votes": total_votes,
        "results": list(results.values())
    }
