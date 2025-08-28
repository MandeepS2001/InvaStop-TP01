from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.core.security import get_current_active_user
from app.models.user import User
from app.models.species import Species
from app.schemas.species import SpeciesCreate, Species as SpeciesSchema, SpeciesList, SpeciesUpdate

router = APIRouter()

@router.get("/", response_model=List[SpeciesList])
def get_species(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    search: Optional[str] = None,
    impact_level: Optional[str] = None,
    threat_category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get list of invasive species with optional filtering"""
    query = db.query(Species).filter(Species.is_active == True)
    
    if search:
        query = query.filter(
            (Species.common_name.ilike(f"%{search}%")) |
            (Species.scientific_name.ilike(f"%{search}%")) |
            (Species.family.ilike(f"%{search}%"))
        )
    
    if impact_level:
        query = query.filter(Species.impact_level == impact_level)
    
    if threat_category:
        query = query.filter(Species.threat_category == threat_category)
    
    species = query.offset(skip).limit(limit).all()
    return species

@router.get("/{species_id}", response_model=SpeciesSchema)
def get_species_by_id(species_id: int, db: Session = Depends(get_db)):
    """Get specific species by ID"""
    species = db.query(Species).filter(Species.id == species_id, Species.is_active == True).first()
    if not species:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Species not found"
        )
    return species

@router.post("/", response_model=SpeciesSchema)
def create_species(
    species: SpeciesCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new species (admin/researcher only)"""
    if current_user.role not in ["admin", "researcher"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create species"
        )
    
    # Check if species already exists
    existing_species = db.query(Species).filter(
        Species.scientific_name == species.scientific_name
    ).first()
    if existing_species:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Species with this scientific name already exists"
        )
    
    db_species = Species(**species.dict())
    db.add(db_species)
    db.commit()
    db.refresh(db_species)
    return db_species

@router.put("/{species_id}", response_model=SpeciesSchema)
def update_species(
    species_id: int,
    species_update: SpeciesUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update species information (admin/researcher only)"""
    if current_user.role not in ["admin", "researcher"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update species"
        )
    
    db_species = db.query(Species).filter(Species.id == species_id).first()
    if not db_species:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Species not found"
        )
    
    for field, value in species_update.dict(exclude_unset=True).items():
        setattr(db_species, field, value)
    
    db.commit()
    db.refresh(db_species)
    return db_species

@router.delete("/{species_id}")
def delete_species(
    species_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete species (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can delete species"
        )
    
    db_species = db.query(Species).filter(Species.id == species_id).first()
    if not db_species:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Species not found"
        )
    
    db_species.is_active = False
    db.commit()
    return {"message": "Species deleted successfully"}
