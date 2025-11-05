from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database import Base, engine
from app.models import User, Role, Election, Voter, Party, Staff, Vote, Complaint, VotingResult
from app.api.endpoints import auth, elections, voters, parties, staff, voting, complaints, results
from app.core.security import get_password_hash
from sqlalchemy.orm import Session
from datetime import date

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Initialize database with roles and admin user
@app.on_event("startup")
def init_db():
    db = Session(bind=engine)
    try:
        # Create roles if they don't exist
        roles_data = ["admin", "staff", "party", "voter"]
        for role_name in roles_data:
            role = db.query(Role).filter(Role.name == role_name).first()
            if not role:
                role = Role(name=role_name)
                db.add(role)
        db.commit()

        # Create admin user if doesn't exist
        admin_role = db.query(Role).filter(Role.name == "admin").first()
        admin_user = db.query(User).filter(User.email == settings.FIRST_SUPERUSER_EMAIL).first()
        if not admin_user:
            admin_user = User(
                email=settings.FIRST_SUPERUSER_EMAIL,
                login="admin",
                hashed_password=get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
                role_id=admin_role.id,
                is_active=1
            )
            db.add(admin_user)
            db.commit()
    finally:
        db.close()


# Include routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["CB5=B8D8:0F8O"])
app.include_router(elections.router, prefix=f"{settings.API_V1_STR}/elections", tags=["K1>@K"])
app.include_router(voters.router, prefix=f"{settings.API_V1_STR}/voters", tags=["718@0B5;8"])
app.include_router(parties.router, prefix=f"{settings.API_V1_STR}/parties", tags=["0@B88"])
app.include_router(staff.router, prefix=f"{settings.API_V1_STR}/staff", tags=["!>B@C4=8:8"])
app.include_router(voting.router, prefix=f"{settings.API_V1_STR}/votes", tags=[">;>A>20=85"])
app.include_router(complaints.router, prefix=f"{settings.API_V1_STR}/complaints", tags=["0;>1K"])
app.include_router(results.router, prefix=f"{settings.API_V1_STR}/results", tags=[" 57C;LB0BK"])


@app.get("/")
def root():
    return {
        "message": "718@0B5;L=0O :><8AA8O @O=A:>9 >1;0AB8 API",
        "version": settings.VERSION,
        "docs": "/docs"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
