from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.staff import Staff
from app.models.user import User
from app.schemas.staff import StaffUpdate, StaffResponse
from app.api.deps import get_current_user, get_current_admin

router = APIRouter()


@router.get("/", response_model=List[StaffResponse])
def get_staff_members(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    staff_members = db.query(Staff).offset(skip).limit(limit).all()
    return staff_members


@router.get("/{staff_id}", response_model=StaffResponse)
def get_staff_member(
    staff_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    staff = db.query(Staff).filter(Staff.id == staff_id).first()
    if not staff:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Staff member not found"
        )

    # Check if user is admin or the staff member themselves
    if current_user.role.name != "admin" and current_user.staff_id != staff_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions"
        )

    return staff


@router.put("/{staff_id}", response_model=StaffResponse)
def update_staff_member(
    staff_id: int,
    staff_data: StaffUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    staff = db.query(Staff).filter(Staff.id == staff_id).first()
    if not staff:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Staff member not found"
        )

    # Check if user is admin or the staff member themselves
    if current_user.role.name != "admin" and current_user.staff_id != staff_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions"
        )

    for key, value in staff_data.model_dump(exclude_unset=True).items():
        setattr(staff, key, value)

    db.commit()
    db.refresh(staff)
    return staff


@router.delete("/{staff_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_staff_member(
    staff_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    staff = db.query(Staff).filter(Staff.id == staff_id).first()
    if not staff:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Staff member not found"
        )

    db.delete(staff)
    db.commit()
    return None
