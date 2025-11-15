from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)  # admin, staff, party, voter

    # Relationships
    users = relationship("User", back_populates="role")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    login = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)
    is_active = Column(Integer, default=1)  # Using Integer for SQLite boolean
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    role = relationship("Role", back_populates="users")

    # Link to actual entity (staff or party or voter)
    staff_id = Column(Integer, ForeignKey("staff.id"), nullable=True)
    party_id = Column(Integer, ForeignKey("parties.id"), nullable=True)
    voter_id = Column(Integer, ForeignKey("voters.id"), nullable=True)

    staff = relationship("Staff", back_populates="user", foreign_keys=[staff_id])
    party = relationship("Party", back_populates="user", foreign_keys=[party_id])
    voter = relationship("Voter", back_populates="user", foreign_keys=[voter_id])
