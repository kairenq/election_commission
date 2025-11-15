from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    PROJECT_NAME: str = "718@0B5;L=0O :><8AA8O @O=A:>9 >1;0AB8"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    SECRET_KEY: str = "your-secret-key-change-this-in-production-please-use-strong-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    DATABASE_URL: str = "sqlite:///./database/election_commission.db"

    # CORS
    BACKEND_CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://*.netlify.app",
        "https://*.onrender.com"
    ]

    # First superuser
    FIRST_SUPERUSER_EMAIL: str = "admin@election.ru"
    FIRST_SUPERUSER_PASSWORD: str = "admin123"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
