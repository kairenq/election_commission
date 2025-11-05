from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.party import Party
from app.models.user import User
from app.schemas.party import PartyUpdate, PartyResponse
from app.api.deps import get_current_user, get_current_admin

router = APIRouter()


@router.get("/", response_model=List[PartyResponse])
def get_parties(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    parties = db.query(Party).offset(skip).limit(limit).all()
    return parties


@router.get("/{party_id}", response_model=PartyResponse)
def get_party(
    party_id: int,
    db: Session = Depends(get_db),
):
    party = db.query(Party).filter(Party.id == party_id).first()
    if not party:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Party not found"
        )
    return party


@router.put("/{party_id}", response_model=PartyResponse)
def update_party(
    party_id: int,
    party_data: PartyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    party = db.query(Party).filter(Party.id == party_id).first()
    if not party:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Party not found"
        )

    # Check if user is admin or the party themselves
    if current_user.role.name != "admin" and current_user.party_id != party_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions"
        )

    for key, value in party_data.model_dump(exclude_unset=True).items():
        setattr(party, key, value)

    db.commit()
    db.refresh(party)
    return party


@router.delete("/{party_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_party(
    party_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    party = db.query(Party).filter(Party.id == party_id).first()
    if not party:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Party not found"
        )

    db.delete(party)
    db.commit()
    return None
