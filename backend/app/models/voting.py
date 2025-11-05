from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Vote(Base):
    __tablename__ = "votes"

    id = Column(Integer, primary_key=True, index=True)
    voter_id = Column(Integer, ForeignKey("voters.id"), nullable=False)
    election_id = Column(Integer, ForeignKey("elections.id"), nullable=False)
    voting_time = Column(DateTime, default=datetime.utcnow)
    voting_place = Column(String, nullable=False)
    voting_address = Column(String, nullable=False)

    # Relationships
    voter = relationship("Voter", back_populates="votes")
    election = relationship("Election", back_populates="votes")
