from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class BiodiversityImpact(Base):
    __tablename__ = "biodiversity_impacts"
    
    id = Column(Integer, primary_key=True, index=True)
    taxon = Column(String(100), nullable=False, unique=True, index=True)
    number_impacted = Column(Integer, nullable=False)
    description = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
