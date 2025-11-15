from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.voter import Voter
from app.models.user import User
from app.schemas.voter import VoterUpdate, VoterResponse
from app.api.deps import get_current_user, get_current_admin

router = APIRouter()


@router.get("/", response_model=List[VoterResponse])
def get_voters(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    voters = db.query(Voter).offset(skip).limit(limit).all()
    return voters


@router.get("/{voter_id}", response_model=VoterResponse)
def get_voter(
    voter_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    voter = db.query(Voter).filter(Voter.id == voter_id).first()
    if not voter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Voter not found"
        )

    # Check if user is admin or the voter themselves
    if current_user.role.name != "admin" and current_user.voter_id != voter_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions"
        )

    return voter


@router.put("/{voter_id}", response_model=VoterResponse)
def update_voter(
    voter_id: int,
    voter_data: VoterUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    voter = db.query(Voter).filter(Voter.id == voter_id).first()
    if not voter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Voter not found"
        )

    # Check if user is admin or the voter themselves
    if current_user.role.name != "admin" and current_user.voter_id != voter_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions"
        )

    for key, value in voter_data.model_dump(exclude_unset=True).items():
        setattr(voter, key, value)

    db.commit()
    db.refresh(voter)
    return voter


@router.delete("/{voter_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_voter(
    voter_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    voter = db.query(Voter).filter(Voter.id == voter_id).first()
    if not voter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Voter not found"
        )

    db.delete(voter)
    db.commit()
    return None
