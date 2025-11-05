from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    voter_id = Column(Integer, ForeignKey("voters.id"), nullable=False)
    staff_id = Column(Integer, ForeignKey("staff.id"), nullable=True)  # B> >1@010BK205B
    complaint_type = Column(String, nullable=False)  # 0@CH5=85, "5E=8G5A:0O ?@>1;5<0, @C3>5
    description = Column(Text, nullable=False)
    complaint_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default=">20O")  # >20O,  >1@01>B:5,  5H5=0, B:;>=5=0

    # Relationships
    voter = relationship("Voter", back_populates="complaints")
    staff = relationship("Staff", back_populates="complaints_handled")
