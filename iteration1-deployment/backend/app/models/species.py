from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Float
from sqlalchemy.sql import func
from app.core.database import Base

class Species(Base):
    __tablename__ = "species"
    
    id = Column(Integer, primary_key=True, index=True)
    scientific_name = Column(String, unique=True, index=True, nullable=False)
    common_name = Column(String, nullable=False)
    family = Column(String, nullable=True)
    genus = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    habitat = Column(Text, nullable=True)
    impact_level = Column(String, nullable=True)  # low, medium, high, critical
    threat_category = Column(String, nullable=True)  # established, emerging, potential
    native_region = Column(String, nullable=True)
    first_detected_australia = Column(DateTime, nullable=True)
    control_methods = Column(Text, nullable=True)
    image_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
