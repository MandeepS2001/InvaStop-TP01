from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float, Date, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Top5Common(Base):
    """Model for top 5 common invasive species by state"""
    __tablename__ = "top_5_common"
    
    id = Column(Integer, primary_key=True, index=True)
    state_abb = Column(String(3), nullable=False, index=True)
    state_name = Column(String(64), nullable=False)
    sp_common_name = Column(String(128), nullable=False)
    species_type = Column(Enum('Plant', 'Animal'), nullable=False, index=True)
    sp_scientific_name = Column(String(128), nullable=False)
    native_range = Column(String(512), nullable=True)

class RiskInvasiveSpecies(Base):
    """Model for risk assessment of invasive species"""
    __tablename__ = "risk_invasive_species"
    
    id = Column(Integer, primary_key=True, index=True)
    species_name = Column(Text, nullable=False)
    common_name = Column(Text, nullable=True)
    higher_risk_species = Column(String(8), nullable=True)
    thematic_group = Column(String(64), nullable=True)
    overall_risk = Column(String(16), nullable=True)
    entry_likelihood = Column(String(16), nullable=True)
    establishment_likelihood = Column(String(16), nullable=True)
    spread_likelihood = Column(String(16), nullable=True)
    environmental_impact = Column(String(20), nullable=True)
    social_amenity_impact = Column(String(20), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class TaxonDataset(Base):
    """Model for biodiversity impact data"""
    __tablename__ = "taxon_dataset"
    
    id = Column(Integer, primary_key=True, index=True)
    species_name_adjusted = Column(String(255), nullable=True)
    species_name = Column(String(255), nullable=True)
    common_name = Column(String(255), nullable=True)
    group_name = Column(String(100), nullable=True)
    epbc_act_status = Column(String(255), nullable=True)
    iucn_threat_level_1 = Column(Integer, nullable=True)
    iucn_threat_level_1_description = Column(Text, nullable=True)
    iucn_threat_level_2 = Column(String(255), nullable=True)
    iucn_threat_level_2_description = Column(Text, nullable=True)
    iucn_threat_level_3 = Column(String(255), nullable=True)
    iucn_threat_level_3_description = Column(Text, nullable=True)
    broad_level_threat = Column(String(255), nullable=True)
    sub_category_threat = Column(String(255), nullable=True)
    timing = Column(String(255), nullable=True)
    scope = Column(Integer, nullable=True)
    severity = Column(Integer, nullable=True)
    timing_score = Column(Integer, nullable=True)
    sum_timing_scope_severity = Column(Integer, nullable=True)
    impact_score = Column(String(155), nullable=True)
    expert_threat_notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
