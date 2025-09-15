from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Any
from app.core.database import get_db
from app.models.state_risk import Top5Common, RiskInvasiveSpecies, TaxonDataset
from app.schemas.state_risk import Top5Common as Top5CommonSchema, RiskInvasiveSpecies as RiskInvasiveSpeciesSchema, TaxonDataset as TaxonDatasetSchema, StateSpeciesList, StatisticsOverview

router = APIRouter()

@router.get("/states/risk-levels", response_model=List[Dict[str, Any]])
def get_states_risk_levels(db: Session = Depends(get_db)):
    """Get risk levels for all Australian states based on top 5 common species"""
    try:
        # Get unique states and their species counts
        states_data = db.query(
            Top5Common.state_name,
            func.count(Top5Common.id).label('species_count')
        ).group_by(Top5Common.state_name).all()
        
        result = []
        for state_data in states_data:
            # Determine overall risk based on species count
            if state_data.species_count >= 4:
                overall_risk = "high"
            elif state_data.species_count >= 2:
                overall_risk = "moderate"
            else:
                overall_risk = "low"
            
            result.append({
                "state_name": state_data.state_name,
                "species_count": state_data.species_count,
                "overall_risk": overall_risk
            })
        
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching state risk levels: {str(e)}"
        )

@router.get("/states/{state_name}/species", response_model=StateSpeciesList)
def get_species_by_state(state_name: str, db: Session = Depends(get_db)):
    """Get invasive species for a specific state"""
    try:
        # Get species for this state
        species = db.query(Top5Common).filter(
            Top5Common.state_name.ilike(f"%{state_name}%")
        ).all()
        
        if not species:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"State {state_name} not found"
            )
        
        # Determine overall risk for the state based on species count
        if len(species) >= 4:
            overall_risk = "high"
        elif len(species) >= 2:
            overall_risk = "moderate"
        else:
            overall_risk = "low"
        
        return StateSpeciesList(
            state_name=species[0].state_name,
            species=species,
            overall_risk=overall_risk
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching species for state {state_name}: {str(e)}"
        )

@router.get("/statistics/overview", response_model=StatisticsOverview)
def get_statistics_overview(db: Session = Depends(get_db)):
    """Get key statistics for Epic 1.0 homepage"""
    try:
        # Calculate total species count from top 5 common
        total_species = db.query(func.count(func.distinct(Top5Common.sp_scientific_name))).scalar() or 0
        
        # Calculate total biodiversity impact from taxon dataset
        total_impact = db.query(func.count(TaxonDataset.species_name)).scalar() or 0
        
        # Calculate high risk states count (states with 4+ species)
        high_risk_states = db.query(func.count(func.distinct(Top5Common.state_name))).select_from(
            db.query(Top5Common.state_name, func.count(Top5Common.id).label('count'))
            .group_by(Top5Common.state_name)
            .having(func.count(Top5Common.id) >= 4)
            .subquery()
        ).scalar() or 0
        
        return StatisticsOverview(
            total_invasive_species=total_species,
            total_biodiversity_impact=total_impact,
            high_risk_states=high_risk_states,
            annual_cost_estimate="25B",  # Placeholder - can be calculated from detailed data
            message="Statistics calculated from current invasive species data in AWS RDS"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error calculating statistics: {str(e)}"
        )

@router.get("/statistics/biodiversity", response_model=List[TaxonDatasetSchema])
def get_biodiversity_impacts(db: Session = Depends(get_db)):
    """Get biodiversity impact by taxon"""
    try:
        impacts = db.query(TaxonDataset).limit(100).all()  # Limit to first 100 for performance
        return impacts
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching biodiversity impacts: {str(e)}"
        )

@router.get("/map/state-data")
def get_map_state_data(db: Session = Depends(get_db)):
    """Get data formatted for the interactive map"""
    try:
        # Get state data with species information
        states_data = db.query(
            Top5Common.state_name,
            func.count(Top5Common.id).label('species_count')
        ).group_by(Top5Common.state_name).all()
        
        result = []
        for state_data in states_data:
            # Get all 5 species for this state
            species = db.query(Top5Common).filter(
                Top5Common.state_name == state_data.state_name
            ).all()
            
            # Determine risk level and color
            risk_level = get_risk_level_for_state(state_data.species_count)
            color = get_risk_color(risk_level)
            
            # Format species data
            species_data = []
            for sp in species:
                species_data.append({
                    "name": sp.sp_common_name,
                    "impact": "High",  # Default since we don't have impact data in this table
                    "spread": "Moderate",  # Default since we don't have spread data in this table
                    "risk": risk_level
                })
            
            result.append({
                "name": state_data.state_name,
                "risk": risk_level,
                "color": color,
                "species": species_data
            })
        
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching map state data: {str(e)}"
        )

def get_risk_level_for_state(species_count: int) -> str:
    """Determine risk level based on species count"""
    if species_count >= 4:
        return "high"
    elif species_count >= 2:
        return "moderate"
    else:
        return "low"

def get_risk_color(risk_level: str) -> str:
    """Get color for risk level"""
    if risk_level == "high":
        return "#dc2626"  # Red
    elif risk_level == "moderate":
        return "#f97316"  # Orange
    else:
        return "#facc15"  # Yellow

@router.get("/invasive-records")
def get_invasive_records(
    species: str = None, 
    year_start: int = None, 
    year_end: int = None,
    limit: int = 1000,
    db: Session = Depends(get_db)
):
    """Get invasive species occurrence records for the interactive map overlay"""
    try:
        from app.models.biodiversity_impact import InvasiveRecord
        
        # Build query for invasive_records table
        query = db.query(InvasiveRecord)
        
        # Apply species filter if provided
        if species:
            query = query.filter(InvasiveRecord.vernacularName.ilike(f"%{species}%"))
        
        # Apply year range filter if provided
        if year_start:
            query = query.filter(InvasiveRecord.eventDate >= f"{year_start}-01-01")
        if year_end:
            query = query.filter(InvasiveRecord.eventDate <= f"{year_end}-12-31")
        
        # Apply limit to prevent overwhelming the frontend
        query = query.limit(limit)
        
        # Execute query
        records = query.all()
        
        # Format records for frontend
        formatted_records = []
        for record in records:
            formatted_records.append({
                "vernacularName": record.vernacularName,
                "decimalLatitude": float(record.decimalLatitude),
                "decimalLongitude": float(record.decimalLongitude),
                "eventDate": record.eventDate.isoformat() if record.eventDate else None,
                "stateProvince": record.stateProvince,
                "scientificName": record.scientificName,
                "country": record.country,
                "countryCode": record.occurrenceStatus  # Using occurrenceStatus as countryCode
            })
        
        return {
            "records": formatted_records,
            "total_count": len(formatted_records),
            "filters_applied": {
                "species": species,
                "year_start": year_start,
                "year_end": year_end,
                "limit": limit
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching invasive records: {str(e)}"
        )
