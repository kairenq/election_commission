from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from app.database import get_db
from app.core.security import create_access_token, verify_password, get_password_hash
from app.core.config import settings
from app.models.user import User, Role
from app.models.voter import Voter
from app.models.party import Party
from app.models.staff import Staff
from app.schemas.token import Token
from app.schemas.user import UserResponse
from app.schemas.voter import VoterCreate
from app.schemas.party import PartyCreate
from app.schemas.staff import StaffCreate
from app.api.deps import get_current_user

router = APIRouter()


@router.post("/login", response_model=Token)
def login(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
):
    user = db.query(User).filter(User.login == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect login or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user"
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(subject=user.id, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
def read_current_user(current_user: User = Depends(get_current_user)):
    return {
        **current_user.__dict__,
        "role_name": current_user.role.name if current_user.role else None,
    }


@router.post("/register/voter", response_model=Token, status_code=status.HTTP_201_CREATED)
def register_voter(voter_data: VoterCreate, db: Session = Depends(get_db)):
    # Check if email or voter already exists
    existing_user = db.query(User).filter(User.email == voter_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    existing_voter = db.query(Voter).filter(Voter.email == voter_data.email).first()
    if existing_voter:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Voter already registered",
        )

    # Get voter role
    voter_role = db.query(Role).filter(Role.name == "voter").first()
    if not voter_role:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Voter role not found",
        )

    # Create voter
    voter = Voter(
        full_name=voter_data.full_name,
        date_of_birth=voter_data.date_of_birth,
        address=voter_data.address,
        email=voter_data.email,
        phone=voter_data.phone,
    )
    db.add(voter)
    db.flush()

    # Create user
    user = User(
        email=voter_data.email,
        login=voter_data.email,
        hashed_password=get_password_hash(voter_data.password),
        role_id=voter_role.id,
        voter_id=voter.id,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(subject=user.id, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/register/party", response_model=Token, status_code=status.HTTP_201_CREATED)
def register_party(party_data: PartyCreate, db: Session = Depends(get_db)):
    # Check if party name already exists
    existing_party = db.query(Party).filter(Party.name == party_data.name).first()
    if existing_party:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Party already registered",
        )

    # Get party role
    party_role = db.query(Role).filter(Role.name == "party").first()
    if not party_role:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Party role not found",
        )

    # Create party
    party = Party(
        name=party_data.name,
        registration_date=party_data.registration_date,
        status=party_data.status,
    )
    db.add(party)
    db.flush()

    # Create user
    user = User(
        email=f"{party_data.name.lower().replace(' ', '_')}@party.ru",
        login=party_data.name.lower().replace(' ', '_'),
        hashed_password=get_password_hash(party_data.password),
        role_id=party_role.id,
        party_id=party.id,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(subject=user.id, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/register/staff", response_model=Token, status_code=status.HTTP_201_CREATED)
def register_staff(staff_data: StaffCreate, db: Session = Depends(get_db)):
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == staff_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    existing_staff = db.query(Staff).filter(Staff.email == staff_data.email).first()
    if existing_staff:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Staff member already registered",
        )

    # Get staff role
    staff_role = db.query(Role).filter(Role.name == "staff").first()
    if not staff_role:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Staff role not found",
        )

    # Create staff member
    staff = Staff(
        full_name=staff_data.full_name,
        date_of_birth=staff_data.date_of_birth,
        address=staff_data.address,
        email=staff_data.email,
        phone=staff_data.phone,
    )
    db.add(staff)
    db.flush()

    # Create user
    user = User(
        email=staff_data.email,
        login=staff_data.email,
        hashed_password=get_password_hash(staff_data.password),
        role_id=staff_role.id,
        staff_id=staff.id,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(subject=user.id, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}
