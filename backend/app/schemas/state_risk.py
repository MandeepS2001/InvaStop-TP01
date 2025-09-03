from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class Top5CommonBase(BaseModel):
    state: str
    species_name: str
    common_name: Optional[str] = None
    species_type: Optional[str] = None
    risk_level: Optional[str] = None
    impact_level: Optional[str] = None
    spread_likelihood: Optional[str] = None

class Top5CommonCreate(Top5CommonBase):
    pass

class Top5CommonUpdate(Top5CommonBase):
    pass

class Top5Common(Top5CommonBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class RiskInvasiveSpeciesBase(BaseModel):
    species_name: str
    disease_name: Optional[str] = None
    exotic_status: Optional[str] = None
    category: Optional[str] = None
    risk_level: Optional[str] = None
    impact_level: Optional[str] = None
    spread_likelihood: Optional[str] = None
    management_difficulty: Optional[str] = None
    economic_impact: Optional[str] = None
    social_impact: Optional[str] = None

class RiskInvasiveSpeciesCreate(RiskInvasiveSpeciesBase):
    pass

class RiskInvasiveSpeciesUpdate(RiskInvasiveSpeciesBase):
    pass

class RiskInvasiveSpecies(RiskInvasiveSpeciesBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class TaxonDatasetBase(BaseModel):
    scientific_name: str
    common_name: Optional[str] = None
    taxon_group: Optional[str] = None
    conservation_status: Optional[str] = None
    threat_category: Optional[int] = None
    threat_name: Optional[str] = None
    threat_code: Optional[str] = None
    threat_subcategory: Optional[str] = None
    threat_subcode: Optional[str] = None
    threat_description: Optional[str] = None
    threat_type: Optional[str] = None
    threat_status: Optional[str] = None
    severity_score: Optional[int] = None
    scope_score: Optional[int] = None
    impact_score: Optional[int] = None
    overall_score: Optional[int] = None
    risk_level: Optional[str] = None
    primary_threat: Optional[str] = None

class TaxonDatasetCreate(TaxonDatasetBase):
    pass

class TaxonDatasetUpdate(TaxonDatasetBase):
    pass

class TaxonDataset(TaxonDatasetBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Response schemas for API endpoints
class StateSpeciesList(BaseModel):
    state_name: str
    species: List[Top5Common]
    overall_risk: str

class StatisticsOverview(BaseModel):
    total_invasive_species: int
    total_biodiversity_impact: int
    high_risk_states: int
    annual_cost_estimate: str
    message: str
