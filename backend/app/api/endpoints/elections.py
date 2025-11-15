from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.election import Election
from app.models.user import User
from app.schemas.election import ElectionCreate, ElectionUpdate, ElectionResponse
from app.api.deps import get_current_user, get_current_admin

router = APIRouter()


@router.get("/", response_model=List[ElectionResponse])
def get_elections(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    elections = db.query(Election).offset(skip).limit(limit).all()
    return elections


@router.get("/{election_id}", response_model=ElectionResponse)
def get_election(
    election_id: int,
    db: Session = Depends(get_db),
):
    election = db.query(Election).filter(Election.id == election_id).first()
    if not election:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Election not found"
        )
    return election


@router.post("/", response_model=ElectionResponse, status_code=status.HTTP_201_CREATED)
def create_election(
    election_data: ElectionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    election = Election(**election_data.model_dump())
    db.add(election)
    db.commit()
    db.refresh(election)
    return election


@router.put("/{election_id}", response_model=ElectionResponse)
def update_election(
    election_id: int,
    election_data: ElectionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    election = db.query(Election).filter(Election.id == election_id).first()
    if not election:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Election not found"
        )

    for key, value in election_data.model_dump(exclude_unset=True).items():
        setattr(election, key, value)

    db.commit()
    db.refresh(election)
    return election


@router.delete("/{election_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_election(
    election_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    election = db.query(Election).filter(Election.id == election_id).first()
    if not election:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Election not found"
        )

    db.delete(election)
    db.commit()
    return None
