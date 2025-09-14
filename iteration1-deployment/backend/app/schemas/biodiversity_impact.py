from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BiodiversityImpactBase(BaseModel):
    taxon: str
    number_impacted: int
    description: Optional[str] = None

class BiodiversityImpactCreate(BiodiversityImpactBase):
    pass

class BiodiversityImpactUpdate(BaseModel):
    number_impacted: Optional[int] = None
    description: Optional[str] = None

class BiodiversityImpact(BiodiversityImpactBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
