"""
Database initialization script
Creates default roles and test users
"""
from sqlalchemy.orm import Session
from ..models.models import User, Role
from .security import get_password_hash
from .database import SessionLocal


def create_default_roles(db: Session):
    """Create default roles if they don't exist"""
    roles = [
        {"id": 1, "name": "admin", "description": "System administrator with full access"},
        {"id": 2, "name": "moderator", "description": "Content moderator with limited admin access"},
        {"id": 3, "name": "participant", "description": "Regular user who can vote and submit feedback"},
    ]

    for role_data in roles:
        existing_role = db.query(Role).filter(Role.id == role_data["id"]).first()
        if not existing_role:
            role = Role(**role_data)
            db.add(role)

    db.commit()


def create_test_users(db: Session):
    """Create test users: admin/admin123 and user/user123"""

    # Check if test users already exist
    admin_exists = db.query(User).filter(User.username == "admin").first()
    user_exists = db.query(User).filter(User.username == "user").first()

    # Create admin user
    if not admin_exists:
        admin = User(
            username="admin",
            email="admin@votingsystem.com",
            full_name="System Administrator",
            hashed_password=get_password_hash("admin123"),
            is_active=True,
            is_superuser=True,
            role_id=1  # admin role
        )
        db.add(admin)
        print("✅ Created test admin user: admin/admin123")
    else:
        print("ℹ️  Admin user already exists")

    # Create regular user
    if not user_exists:
        user = User(
            username="user",
            email="user@votingsystem.com",
            full_name="Test User",
            hashed_password=get_password_hash("user123"),
            is_active=True,
            is_superuser=False,
            role_id=3  # participant role
        )
        db.add(user)
        print("✅ Created test user: user/user123")
    else:
        print("ℹ️  Regular user already exists")

    db.commit()


def init_db():
    """Initialize database with default data"""
    db = SessionLocal()
    try:
        print("🔄 Initializing database...")
        create_default_roles(db)
        print("✅ Default roles created")
        create_test_users(db)
        print("✅ Database initialization complete")
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    init_db()
