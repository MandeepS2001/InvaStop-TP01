from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SpeciesBase(BaseModel):
    scientific_name: str
    common_name: str
    family: Optional[str] = None
    genus: Optional[str] = None
    description: Optional[str] = None
    habitat: Optional[str] = None
    impact_level: Optional[str] = None
    threat_category: Optional[str] = None
    native_region: Optional[str] = None
    control_methods: Optional[str] = None
    image_url: Optional[str] = None

class SpeciesCreate(SpeciesBase):
    pass

class SpeciesUpdate(BaseModel):
    common_name: Optional[str] = None
    family: Optional[str] = None
    genus: Optional[str] = None
    description: Optional[str] = None
    habitat: Optional[str] = None
    impact_level: Optional[str] = None
    threat_category: Optional[str] = None
    native_region: Optional[str] = None
    control_methods: Optional[str] = None
    image_url: Optional[str] = None

class SpeciesInDB(SpeciesBase):
    id: int
    first_detected_australia: Optional[datetime] = None
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Species(SpeciesInDB):
    pass

class SpeciesList(BaseModel):
    id: int
    scientific_name: str
    common_name: str
    impact_level: Optional[str] = None
    threat_category: Optional[str] = None
    image_url: Optional[str] = None

    class Config:
        from_attributes = True
