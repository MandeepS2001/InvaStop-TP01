from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import POINT
from app.core.database import Base

class Report(Base):
    __tablename__ = "reports"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    species_id = Column(Integer, ForeignKey("species.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    location_name = Column(String, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    coordinates = Column(POINT, nullable=False)  # PostGIS point
    accuracy = Column(Float, nullable=True)  # GPS accuracy in meters
    report_date = Column(DateTime, nullable=False)
    image_urls = Column(Text, nullable=True)  # JSON array of image URLs
    status = Column(String, default="pending")  # pending, verified, rejected, resolved
    verification_notes = Column(Text, nullable=True)
    verified_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    verified_at = Column(DateTime, nullable=True)
    is_public = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", foreign_keys=[user_id])
    species = relationship("Species")
    verifier = relationship("User", foreign_keys=[verified_by])
