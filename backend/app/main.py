from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core import settings, Base, engine
from .routes import auth_router, polls_router, teams_router, votes_router, feedback_router
from .core.init_db import init_db

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize database with default data (roles and test users)
init_db()

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Corporate Voting Platform API - For polls, surveys, and project voting",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api")
app.include_router(polls_router, prefix="/api")
app.include_router(teams_router, prefix="/api")
app.include_router(votes_router, prefix="/api")
app.include_router(feedback_router, prefix="/api")

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to Voting Platform API",
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "description": "Corporate polling and voting system"
    }

# Health check (GET and HEAD methods for uptime monitoring)
@app.get("/health")
@app.head("/health")
async def health_check():
    return {"status": "ok", "app": settings.APP_NAME}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
