from sqlalchemy import Column, Integer, String, DateTime, Date
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Staff(Base):
    __tablename__ = "staff"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    date_of_birth = Column(Date, nullable=False)
    address = Column(String, nullable=False)
    registration_date = Column(DateTime, default=datetime.utcnow)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String, nullable=True)

    # Relationships
    complaints_handled = relationship("Complaint", back_populates="staff", cascade="all, delete-orphan")
    user = relationship("User", back_populates="staff", uselist=False)
