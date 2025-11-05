from sqlalchemy import Column, Integer, String, DateTime, Date
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Voter(Base):
    __tablename__ = "voters"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    date_of_birth = Column(Date, nullable=False)
    address = Column(String, nullable=False)
    registration_date = Column(DateTime, default=datetime.utcnow)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String, nullable=True)

    # Relationships
    votes = relationship("Vote", back_populates="voter", cascade="all, delete-orphan")
    complaints = relationship("Complaint", back_populates="voter", cascade="all, delete-orphan")
    user = relationship("User", back_populates="voter", uselist=False)
