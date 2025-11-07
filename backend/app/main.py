from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
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

# Include API routers
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

# Test POST endpoint to verify POST works
@app.post("/api/test")
async def test_post(data: dict = None):
    return {"message": "POST works!", "data": data}

# Frontend setup
frontend_dist = Path(__file__).parent.parent.parent / "frontend" / "dist"

if frontend_dist.exists():
    # Mount static assets
    app.mount("/assets", StaticFiles(directory=str(frontend_dist / "assets")), name="assets")

# Custom 404 handler for SPA - serve index.html for non-API routes
@app.exception_handler(StarletteHTTPException)
async def custom_404_handler(request, exc):
    # If it's a 404 and NOT an API route, serve the SPA
    if exc.status_code == 404 and not request.url.path.startswith("/api"):
        if frontend_dist.exists():
            index_file = frontend_dist / "index.html"
            if index_file.exists():
                return FileResponse(index_file)

    # Otherwise, return the original 404
    return HTMLResponse(content=f"Not found: {request.url.path}", status_code=404)

# Serve root
@app.get("/")
async def serve_root():
    if frontend_dist.exists():
        return FileResponse(frontend_dist / "index.html")
    return {"message": "API is running. Frontend not found."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
