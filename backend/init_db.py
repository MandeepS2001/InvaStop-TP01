#!/usr/bin/env python3
"""
Database Initialization Script for InvaStop
Creates all necessary tables for Epic 1.0
"""

import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.models.user import Base as UserBase
from app.models.species import Base as SpeciesBase
from app.models.report import Base as ReportBase
from app.models.state_risk import StateRisk, StateSpecies
from app.models.biodiversity_impact import BiodiversityImpact

def create_database_connection():
    """Create database connection"""
    try:
        # For development, use SQLite if no PostgreSQL connection
        if "postgresql" in settings.DATABASE_URL:
            engine = create_engine(settings.DATABASE_URL)
        else:
            # Fallback to SQLite for development
            engine = create_engine("sqlite:///./invastop.db")
        
        return engine
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return None

def init_database():
    """Initialize database with all tables"""
    print("🚀 Initializing InvaStop Database...")
    
    # Create database connection
    engine = create_database_connection()
    if not engine:
        print("❌ Failed to create database connection")
        return False
    
    try:
        # Import all models to ensure they're registered
        from app.models import user, species, report, state_risk, biodiversity_impact
        
        # Create all tables
        print("📋 Creating database tables...")
        
        # Create tables for existing models
        UserBase.metadata.create_all(bind=engine)
        SpeciesBase.metadata.create_all(bind=engine)
        ReportBase.metadata.create_all(bind=engine)
        
        # Create tables for new Epic 1.0 models
        StateRisk.__table__.create(engine, checkfirst=True)
        StateSpecies.__table__.create(engine, checkfirst=True)
        BiodiversityImpact.__table__.create(engine, checkfirst=True)
        
        print("✅ Database tables created successfully!")
        
        # Test connection
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("✅ Database connection test successful!")
        
        return True
        
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        return False

def main():
    """Main function"""
    if init_database():
        print("\n🎉 Database initialization completed!")
        print("\n📋 Next steps:")
        print("  1. Run: python import_data.py")
        print("  2. Start the server: uvicorn main:app --reload")
        print("  3. Visit: http://localhost:8000/docs")
    else:
        print("\n❌ Database initialization failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()
