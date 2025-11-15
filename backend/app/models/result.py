from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class VotingResult(Base):
    __tablename__ = "voting_results"

    id = Column(Integer, primary_key=True, index=True)
    election_id = Column(Integer, ForeignKey("elections.id"), nullable=False)
    party_id = Column(Integer, ForeignKey("parties.id"), nullable=False)
    vote_count = Column(Integer, default=0)
    percentage = Column(Float, default=0.0)
    processed_date = Column(DateTime, default=datetime.utcnow)

    # Relationships
    election = relationship("Election", back_populates="results")
    party = relationship("Party", back_populates="results")
