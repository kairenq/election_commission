from sqlalchemy import Column, Integer, String, DateTime, Date
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Election(Base):
    __tablename__ = "elections"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    election_type = Column(String, nullable=False)  # @57845=BA:85, C15@=0B>@A:85, etc.
    status = Column(String, default="0?;0=8@>20=K")  # 0?;0=8@>20=K, 4CB, 025@H5=K
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    votes = relationship("Vote", back_populates="election", cascade="all, delete-orphan")
    results = relationship("VotingResult", back_populates="election", cascade="all, delete-orphan")
