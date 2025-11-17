from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from ..core.database import Base

class Role(Base):
    """User roles (admin, moderator, participant)"""
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    description = Column(String(200))
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    users = relationship("User", back_populates="role")


class User(Base):
    """System users with authentication"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, index=True, nullable=False)
    username = Column(String(50), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100))
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    role_id = Column(Integer, ForeignKey("roles.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    role = relationship("Role", back_populates="users")
    participants = relationship("Participant", back_populates="user")
    staff = relationship("Staff", back_populates="user")
    feedback = relationship("Feedback", back_populates="participant")


class Poll(Base):
    """Polls and voting events"""
    __tablename__ = "polls"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text)
    poll_type = Column(String(50))  # corporate_survey, project_voting, feedback, etc.
    status = Column(String(20), default="draft")  # draft, active, completed, cancelled
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    votes = relationship("Vote", back_populates="poll")
    results = relationship("Result", back_populates="poll")
    options = relationship("PollOption", back_populates="poll")


class PollOption(Base):
    """Available options/choices for polls"""
    __tablename__ = "poll_options"

    id = Column(Integer, primary_key=True, index=True)
    poll_id = Column(Integer, ForeignKey("polls.id"), nullable=False)
    name = Column(String(200), nullable=False)
    description = Column(Text)
    order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    poll = relationship("Poll", back_populates="options")
    votes = relationship("Vote", back_populates="option")


class Team(Base):
    """Teams or groups of participants"""
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    status = Column(String(20), default="active")
    registration_date = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    participants = relationship("Participant", back_populates="team")
    results = relationship("Result", back_populates="team")


class Participant(Base):
    """Poll participants (voters)"""
    __tablename__ = "participants"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    team_id = Column(Integer, ForeignKey("teams.id"))
    full_name = Column(String(100), nullable=False)
    email = Column(String(100))
    phone = Column(String(20))
    birth_date = Column(DateTime)
    address = Column(String(200))
    registration_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String(20), default="active")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="participants")
    team = relationship("Team", back_populates="participants")
    votes = relationship("Vote", back_populates="participant")


class Vote(Base):
    """Individual votes cast by participants"""
    __tablename__ = "votes"

    id = Column(Integer, primary_key=True, index=True)
    poll_id = Column(Integer, ForeignKey("polls.id"), nullable=False)
    participant_id = Column(Integer, ForeignKey("participants.id"), nullable=False)
    option_id = Column(Integer, ForeignKey("poll_options.id"), nullable=False)
    vote_time = Column(DateTime, default=datetime.utcnow)
    vote_month = Column(String(7))  # YYYY-MM format
    location = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    poll = relationship("Poll", back_populates="votes")
    participant = relationship("Participant", back_populates="votes")
    option = relationship("PollOption", back_populates="votes")


class Result(Base):
    """Aggregated voting results"""
    __tablename__ = "results"

    id = Column(Integer, primary_key=True, index=True)
    poll_id = Column(Integer, ForeignKey("polls.id"), nullable=False)
    team_id = Column(Integer, ForeignKey("teams.id"))
    option_id = Column(Integer, ForeignKey("poll_options.id"))
    vote_count = Column(Integer, default=0)
    percentage = Column(Float, default=0.0)
    processed_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    poll = relationship("Poll", back_populates="results")
    team = relationship("Team", back_populates="results")


class Feedback(Base):
    """User feedback and complaints"""
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    participant_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    admin_id = Column(Integer, ForeignKey("staff.id"))
    feedback_type = Column(String(50))  # complaint, suggestion, question, bug_report
    title = Column(String(200))
    description = Column(Text, nullable=False)
    status = Column(String(20), default="open")  # open, in_progress, resolved, closed
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    participant = relationship("User", back_populates="feedback")
    admin = relationship("Staff", back_populates="feedback_handled")


class Staff(Base):
    """System administrators and moderators"""
    __tablename__ = "staff"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    full_name = Column(String(100), nullable=False)
    email = Column(String(100))
    phone = Column(String(20))
    birth_date = Column(DateTime)
    address = Column(String(200))
    hire_date = Column(DateTime, default=datetime.utcnow)
    department = Column(String(100))
    position = Column(String(100))
    status = Column(String(20), default="active")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="staff")
    feedback_handled = relationship("Feedback", back_populates="admin")
