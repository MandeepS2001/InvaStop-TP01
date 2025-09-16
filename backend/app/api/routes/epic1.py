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
    limit: int = None,
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
        
        # Apply limit only if specified (default: no limit - show all records)
        if limit is not None:
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

@router.get("/invasive-records/near-location")
def get_invasive_records_near_location(
    latitude: float,
    longitude: float,
    radius_km: float = 50.0,
    species: str = None,
    year_start: int = None,
    year_end: int = None,
    limit: int = 1000,
    db: Session = Depends(get_db)
):
    """Get invasive species occurrence records near a specific location"""
    try:
        from app.models.biodiversity_impact import InvasiveRecord
        from sqlalchemy import func
        
        # Calculate bounding box for the radius (approximate)
        # 1 degree latitude ≈ 111 km
        # 1 degree longitude ≈ 111 km * cos(latitude)
        lat_delta = radius_km / 111.0
        lng_delta = radius_km / (111.0 * func.cos(func.radians(latitude)))
        
        # Build query for invasive_records table within bounding box
        query = db.query(InvasiveRecord).filter(
            InvasiveRecord.decimalLatitude.between(latitude - lat_delta, latitude + lat_delta),
            InvasiveRecord.decimalLongitude.between(longitude - lng_delta, longitude + lng_delta)
        )
        
        # Apply species filter if provided
        if species:
            query = query.filter(InvasiveRecord.vernacularName.ilike(f"%{species}%"))
        
        # Apply year range filter if provided
        if year_start:
            query = query.filter(InvasiveRecord.eventDate >= f"{year_start}-01-01")
        if year_end:
            query = query.filter(InvasiveRecord.eventDate <= f"{year_end}-12-31")
        
        # Apply limit
        if limit is not None:
            query = query.limit(limit)
        
        # Execute query
        records = query.all()
        
        # Format records for frontend
        formatted_records = []
        for record in records:
            # Calculate distance from center point
            import math
            lat_diff = float(record.decimalLatitude) - latitude
            lng_diff = float(record.decimalLongitude) - longitude
            distance_km = math.sqrt(lat_diff**2 + lng_diff**2) * 111.0  # Approximate
            
            formatted_records.append({
                "vernacularName": record.vernacularName,
                "decimalLatitude": float(record.decimalLatitude),
                "decimalLongitude": float(record.decimalLongitude),
                "eventDate": record.eventDate.isoformat() if record.eventDate else None,
                "stateProvince": record.stateProvince,
                "scientificName": record.scientificName,
                "country": record.country,
                "countryCode": record.occurrenceStatus,
                "distance_km": round(distance_km, 2)
            })
        
        # Sort by distance
        formatted_records.sort(key=lambda x: x["distance_km"])
        
        return {
            "records": formatted_records,
            "total_count": len(formatted_records),
            "center_location": {
                "latitude": latitude,
                "longitude": longitude,
                "radius_km": radius_km
            },
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
            detail=f"Error fetching invasive records near location: {str(e)}"
        )

@router.get("/seasonal-risk")
def get_seasonal_risk_data(
    season: str,
    postcode: str = None,
    radius_km: float = 50.0,
    db: Session = Depends(get_db)
):
    """Get seasonal invasive species risk data based on season and location"""
    try:
        from app.models.biodiversity_impact import InvasiveRecord
        from sqlalchemy import func, and_, or_
        import math
        
        # Map seasons to date ranges (using month ranges)
        season_months = {
            "Spring": [9, 10, 11],  # Sep, Oct, Nov (Australian spring)
            "Summer": [12, 1, 2],   # Dec, Jan, Feb (Australian summer)
            "Autumn": [3, 4, 5],    # Mar, Apr, May (Australian autumn)
            "Winter": [6, 7, 8]     # Jun, Jul, Aug (Australian winter)
        }
        
        if season not in season_months:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid season. Must be one of: Spring, Summer, Autumn, Winter"
            )
        
        months = season_months[season]
        
        # Build base query for seasonal data
        query = db.query(InvasiveRecord)
        
        # Filter by season (month)
        if len(months) == 3:
            # Handle year transition for summer (Dec, Jan, Feb)
            if season == "Summer":
                query = query.filter(
                    or_(
                        func.month(InvasiveRecord.eventDate) == 12,
                        func.month(InvasiveRecord.eventDate) == 1,
                        func.month(InvasiveRecord.eventDate) == 2
                    )
                )
            else:
                query = query.filter(func.month(InvasiveRecord.eventDate).in_(months))
        
        # If postcode is provided, filter by location
        if postcode:
            # Simple geocoding for major Australian cities (for demo purposes)
            # In production, you'd use a proper geocoding service
            city_coords = {
                "3000": {"lat": -37.8136, "lng": 144.9631},  # Melbourne
                "2000": {"lat": -33.8688, "lng": 151.2093},  # Sydney
                "4000": {"lat": -27.4698, "lng": 153.0251},  # Brisbane
                "6000": {"lat": -31.9505, "lng": 115.8605},  # Perth
                "5000": {"lat": -34.9285, "lng": 138.6007},  # Adelaide
                "7000": {"lat": -42.8821, "lng": 147.3272},  # Hobart
                "2600": {"lat": -35.2809, "lng": 149.1300},  # Canberra
                "0800": {"lat": -12.4634, "lng": 130.8456},  # Darwin
            }
            
            if postcode in city_coords:
                coords = city_coords[postcode]
                lat_delta = radius_km / 111.0
                lng_delta = radius_km / (111.0 * func.cos(func.radians(coords["lat"])))
                
                query = query.filter(
                    and_(
                        InvasiveRecord.decimalLatitude.between(
                            coords["lat"] - lat_delta, 
                            coords["lat"] + lat_delta
                        ),
                        InvasiveRecord.decimalLongitude.between(
                            coords["lng"] - lng_delta, 
                            coords["lng"] + lng_delta
                        )
                    )
                )
        
        # Get records
        records = query.all()
        
        # Analyze data by species
        species_data = {}
        total_records = len(records)
        
        for record in records:
            species_name = record.vernacularName or "Unknown"
            if species_name not in species_data:
                species_data[species_name] = {
                    "count": 0,
                    "locations": set(),
                    "months": set(),
                    "risk_level": "Medium"
                }
            
            species_data[species_name]["count"] += 1
            if record.stateProvince:
                species_data[species_name]["locations"].add(record.stateProvince)
            if record.eventDate:
                species_data[species_name]["months"].add(record.eventDate.month)
        
        # Convert sets to lists and determine risk levels
        for species, data in species_data.items():
            data["locations"] = list(data["locations"])
            data["months"] = list(data["months"])
            
            # Simple risk assessment based on count and spread
            if data["count"] >= 100 or len(data["locations"]) >= 3:
                data["risk_level"] = "High"
            elif data["count"] >= 50 or len(data["locations"]) >= 2:
                data["risk_level"] = "Medium"
            else:
                data["risk_level"] = "Low"
        
        # Sort species by count (highest risk first)
        sorted_species = sorted(
            species_data.items(), 
            key=lambda x: x[1]["count"], 
            reverse=True
        )
        
        # Get top 5 species for the season
        top_species = dict(sorted_species[:5])
        
        # Create seasonal insights
        seasonal_insights = {
            "season": season,
            "total_sightings": total_records,
            "top_species": top_species,
            "risk_summary": {
                "high_risk": len([s for s in species_data.values() if s["risk_level"] == "High"]),
                "medium_risk": len([s for s in species_data.values() if s["risk_level"] == "Medium"]),
                "low_risk": len([s for s in species_data.values() if s["risk_level"] == "Low"])
            },
            "location": postcode if postcode else "Australia-wide",
            "radius_km": radius_km if postcode else None
        }
        
        return seasonal_insights
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching seasonal risk data: {str(e)}"
        )
