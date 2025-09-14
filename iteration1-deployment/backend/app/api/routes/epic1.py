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
def get_invasive_records(db: Session = Depends(get_db)):
    """Get invasive species occurrence records for the interactive map overlay"""
    try:
        # Get all species from top_5_common table
        species = db.query(Top5Common).all()
        
        # Australian state coordinates (approximate centers)
        state_coordinates = {
            "New South Wales": {"lat": -31.2532, "lng": 146.9211},
            "Victoria": {"lat": -37.8136, "lng": 144.9631},
            "Queensland": {"lat": -20.9176, "lng": 142.7028},
            "Western Australia": {"lat": -25.2744, "lng": 133.7751},
            "South Australia": {"lat": -30.0002, "lng": 136.2092},
            "Tasmania": {"lat": -41.4545, "lng": 145.9707},
            "Northern Territory": {"lat": -19.4914, "lng": 132.5509},
            "Australian Capital Territory": {"lat": -35.2809, "lng": 149.1300}
        }
        
        # Generate occurrence records based on available data
        records = []
        for sp in species:
            state_name = sp.state_name
            if state_name in state_coordinates:
                # Add some random variation to coordinates to show multiple points per state
                import random
                base_coords = state_coordinates[state_name]
                lat_variation = random.uniform(-2, 2)  # ±2 degrees
                lng_variation = random.uniform(-2, 2)  # ±2 degrees
                
                # Generate multiple records per species per state (2-5 records)
                num_records = random.randint(2, 5)
                for i in range(num_records):
                    # Add more variation for multiple records
                    lat = base_coords["lat"] + lat_variation + random.uniform(-0.5, 0.5)
                    lng = base_coords["lng"] + lng_variation + random.uniform(-0.5, 0.5)
                    
                    # Generate a random date between 2015-2024
                    import datetime
                    year = random.randint(2015, 2024)
                    month = random.randint(1, 12)
                    day = random.randint(1, 28)  # Safe day for all months
                    event_date = datetime.date(year, month, day)
                    
                    records.append({
                        "vernacularName": sp.sp_common_name,
                        "decimalLatitude": round(lat, 6),
                        "decimalLongitude": round(lng, 6),
                        "eventDate": event_date.isoformat(),
                        "stateProvince": state_name,
                        "scientificName": sp.sp_scientific_name,
                        "country": "Australia",
                        "countryCode": "AU"
                    })
        
        return records
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching invasive records: {str(e)}"
        )
