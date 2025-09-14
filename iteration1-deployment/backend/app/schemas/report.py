from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class ReportBase(BaseModel):
    species_id: int
    title: str
    description: Optional[str] = None
    location_name: Optional[str] = None
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    accuracy: Optional[float] = None
    report_date: datetime
    image_urls: Optional[List[str]] = None
    is_public: bool = True

class ReportCreate(ReportBase):
    pass

class ReportUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location_name: Optional[str] = None
    image_urls: Optional[List[str]] = None
    is_public: Optional[bool] = None

class ReportInDB(ReportBase):
    id: int
    user_id: int
    status: str
    verification_notes: Optional[str] = None
    verified_by: Optional[int] = None
    verified_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Report(ReportInDB):
    pass

class ReportList(BaseModel):
    id: int
    title: str
    species_id: int
    species_name: str
    latitude: float
    longitude: float
    report_date: datetime
    status: str
    image_urls: Optional[List[str]] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ReportVerification(BaseModel):
    status: str  # verified, rejected
    verification_notes: Optional[str] = None
