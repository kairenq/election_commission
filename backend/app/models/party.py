from sqlalchemy import Column, Integer, String, DateTime, Date
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Party(Base):
    __tablename__ = "parties"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    registration_date = Column(Date, nullable=False)
    status = Column(String, default=":B82=0")  # :B82=0, @8>AB0=>2;5=0, 8:2848@>20=0
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    results = relationship("VotingResult", back_populates="party", cascade="all, delete-orphan")
    user = relationship("User", back_populates="party", uselist=False)
