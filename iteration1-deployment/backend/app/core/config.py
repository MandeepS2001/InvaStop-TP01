from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # Application settings
    APP_NAME: str = "InvaStop API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # Database settings
    DATABASE_URL: str = "mysql+pymysql://admin:tp01industryexp@tp01.cpyqoog2o4qg.ap-southeast-2.rds.amazonaws.com:3306/invastopdb"
    
    # Security settings
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS settings
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",  # React development server
        "http://localhost:3001",
        "https://invastop.com",   # Production domain (when deployed)
        "https://invastop.vercel.app",  # Vercel deployment
        "https://invastop.vercel.app/iteration1",  # Iteration1 deployment
        "https://*.vercel.app",   # All Vercel deployments
    ]
    
    # File upload settings
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_IMAGE_TYPES: List[str] = ["image/jpeg", "image/png", "image/webp"]
    
    # Geospatial settings
    DEFAULT_SRID: int = 4326  # WGS84
    
    # External APIs
    MAPBOX_ACCESS_TOKEN: str = ""
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create settings instance
settings = Settings()

# Ensure upload directory exists (skip in serverless environments)
try:
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
except OSError:
    # In serverless environments like Vercel, file system is read-only
    # Skip directory creation
    pass
