from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.voting import Vote
from app.models.user import User
from app.schemas.voting import VoteCreate, VoteResponse
from app.api.deps import get_current_user, get_current_admin

router = APIRouter()


@router.get("/", response_model=List[VoteResponse])
def get_votes(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    votes = db.query(Vote).offset(skip).limit(limit).all()
    return votes


@router.get("/{vote_id}", response_model=VoteResponse)
def get_vote(
    vote_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    vote = db.query(Vote).filter(Vote.id == vote_id).first()
    if not vote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Vote not found"
        )
    return vote


@router.post("/", response_model=VoteResponse, status_code=status.HTTP_201_CREATED)
def create_vote(
    vote_data: VoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Check if voter already voted in this election
    existing_vote = db.query(Vote).filter(
        Vote.voter_id == vote_data.voter_id,
        Vote.election_id == vote_data.election_id
    ).first()

    if existing_vote:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Voter has already voted in this election"
        )

    vote = Vote(**vote_data.model_dump())
    db.add(vote)
    db.commit()
    db.refresh(vote)
    return vote


@router.delete("/{vote_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_vote(
    vote_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    vote = db.query(Vote).filter(Vote.id == vote_id).first()
    if not vote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Vote not found"
        )

    db.delete(vote)
    db.commit()
    return None
