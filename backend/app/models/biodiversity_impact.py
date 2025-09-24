from sqlalchemy import Column, Integer, String, DateTime, Date, DECIMAL
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

class InvasiveRecord(Base):
    __tablename__ = "invasive_records"
    
    id = Column(Integer, primary_key=True, index=True)
    occurrenceStatus = Column(String(20), nullable=True)
    country = Column(String(100), nullable=True)
    stateProvince = Column(String(100), nullable=True)
    decimalLatitude = Column(DECIMAL(9, 6), nullable=True)
    decimalLongitude = Column(DECIMAL(9, 6), nullable=True)
    scientificName = Column(String(255), nullable=True)
    vernacularName = Column(String(255), nullable=True)
    eventDate = Column(Date, nullable=True)
