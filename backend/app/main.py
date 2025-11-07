from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path
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

# Include API routers FIRST - highest priority
app.include_router(auth_router, prefix="/api")
app.include_router(polls_router, prefix="/api")
app.include_router(teams_router, prefix="/api")
app.include_router(votes_router, prefix="/api")
app.include_router(feedback_router, prefix="/api")

# Health check
@app.get("/health")
@app.head("/health")
async def health_check():
    return {"status": "ok", "app": settings.APP_NAME}

# Frontend static files - AFTER API routes
frontend_dist = Path(__file__).parent.parent.parent / "frontend" / "dist"

if frontend_dist.exists():
    # Serve static assets
    app.mount("/assets", StaticFiles(directory=str(frontend_dist / "assets")), name="assets")

    # Serve SPA for root
    @app.get("/")
    async def serve_root():
        return FileResponse(frontend_dist / "index.html")

    # Catch-all for SPA routes - LAST!
    @app.get("/{catchall:path}")
    async def serve_spa(catchall: str):
        # Only serve SPA if file doesn't exist and it's not an API route
        index_file = frontend_dist / "index.html"
        return FileResponse(index_file)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
