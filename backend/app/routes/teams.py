from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..core import get_db
from ..models import Team, Participant
from ..schemas import TeamCreate, TeamUpdate, TeamResponse, TeamWithMembers, TeamMember

router = APIRouter(prefix="/teams", tags=["Teams"])

@router.get("/", response_model=List[TeamResponse])
async def get_teams(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all teams"""
    return db.query(Team).offset(skip).limit(limit).all()

@router.get("/{team_id}", response_model=TeamResponse)
async def get_team(team_id: int, db: Session = Depends(get_db)):
    """Get a specific team"""
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return team

@router.get("/{team_id}/with-members", response_model=TeamWithMembers)
async def get_team_with_members(team_id: int, db: Session = Depends(get_db)):
    """Get a specific team with its members"""
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    # Get team members
    members = db.query(Participant).filter(Participant.team_id == team_id).all()

    # Convert to response format
    team_dict = {
        "id": team.id,
        "name": team.name,
        "description": team.description,
        "status": team.status,
        "registration_date": team.registration_date,
        "created_at": team.created_at,
        "members": members
    }

    return team_dict

@router.post("/", response_model=TeamResponse, status_code=201)
async def create_team(team_data: TeamCreate, db: Session = Depends(get_db)):
    """Create a new team"""
    db_team = Team(**team_data.model_dump())
    db.add(db_team)
    db.commit()
    db.refresh(db_team)
    return db_team

@router.put("/{team_id}", response_model=TeamResponse)
async def update_team(team_id: int, team_data: TeamUpdate, db: Session = Depends(get_db)):
    """Update a team"""
    db_team = db.query(Team).filter(Team.id == team_id).first()
    if not db_team:
        raise HTTPException(status_code=404, detail="Team not found")

    for field, value in team_data.model_dump(exclude_unset=True).items():
        setattr(db_team, field, value)

    db.commit()
    db.refresh(db_team)
    return db_team

@router.delete("/{team_id}", status_code=204)
async def delete_team(team_id: int, db: Session = Depends(get_db)):
    """Delete a team"""
    db_team = db.query(Team).filter(Team.id == team_id).first()
    if not db_team:
        raise HTTPException(status_code=404, detail="Team not found")

    db.delete(db_team)
    db.commit()
