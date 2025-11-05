from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.result import VotingResult
from app.models.user import User
from app.schemas.result import VotingResultCreate, VotingResultUpdate, VotingResultResponse
from app.api.deps import get_current_user, get_current_admin

router = APIRouter()


@router.get("/", response_model=List[VotingResultResponse])
def get_voting_results(
    skip: int = 0,
    limit: int = 100,
    election_id: int = None,
    db: Session = Depends(get_db),
):
    query = db.query(VotingResult)
    if election_id:
        query = query.filter(VotingResult.election_id == election_id)
    results = query.offset(skip).limit(limit).all()
    return results


@router.get("/{result_id}", response_model=VotingResultResponse)
def get_voting_result(
    result_id: int,
    db: Session = Depends(get_db),
):
    result = db.query(VotingResult).filter(VotingResult.id == result_id).first()
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Voting result not found"
        )
    return result


@router.post("/", response_model=VotingResultResponse, status_code=status.HTTP_201_CREATED)
def create_voting_result(
    result_data: VotingResultCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    result = VotingResult(**result_data.model_dump())
    db.add(result)
    db.commit()
    db.refresh(result)
    return result


@router.put("/{result_id}", response_model=VotingResultResponse)
def update_voting_result(
    result_id: int,
    result_data: VotingResultUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    result = db.query(VotingResult).filter(VotingResult.id == result_id).first()
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Voting result not found"
        )

    for key, value in result_data.model_dump(exclude_unset=True).items():
        setattr(result, key, value)

    db.commit()
    db.refresh(result)
    return result


@router.delete("/{result_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_voting_result(
    result_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    result = db.query(VotingResult).filter(VotingResult.id == result_id).first()
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Voting result not found"
        )

    db.delete(result)
    db.commit()
    return None
