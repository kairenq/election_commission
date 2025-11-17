from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import Union

class Settings(BaseSettings):
    # App
    APP_NAME: str = "Voting Platform API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "sqlite:///./voting_platform.db"

    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production-please-make-it-secure"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS - can be a list or comma-separated string
    BACKEND_CORS_ORIGINS: Union[list, str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8000",
        "https://*.pages.dev"
    ]

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v):
        """Parse CORS origins from string or list"""
        if isinstance(v, str):
            # Split by comma and strip whitespace
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
