from fastapi import APIRouter, HTTPException, Query
from typing import Optional, Dict, Any
from sqlalchemy import text
from app.core.database import engine


router = APIRouter()


def _clamp(value: float, low: float = 0.0, high: float = 100.0) -> float:
    return max(low, min(high, value))


@router.get("/summary")
def impact_summary(state: Optional[str] = Query(None, description="Two-letter state code e.g., VIC, NSW")) -> Dict[str, Any]:
    """
    Live-backed impact summary:
    - Uses real counts from invasive_records (optionally filtered by state)
    - Uses average risk from risk_invasive_species
    - Derives before/after as a simple intervention model (removal reduces coverage and risk)
    """
    try:
        with engine.connect() as conn:
            # Invasive records counts (optionally by state)
            if state:
                rec_count = conn.execute(
                    text("SELECT COUNT(*) FROM invasive_records WHERE stateProvince=:state"),
                    {"state": state}
                ).scalar_one()
                # For normalization, get max per-state count
                max_state = conn.execute(
                    text("SELECT MAX(c) FROM (SELECT stateProvince, COUNT(*) c FROM invasive_records GROUP BY stateProvince) t")
                ).scalar_one() or 1
            else:
                # Use average per-state prevalence relative to the max state to avoid flat 100%
                row = conn.execute(
                    text("SELECT AVG(c) avg_c, MAX(c) max_c, SUM(c) total_c FROM (SELECT stateProvince, COUNT(*) c FROM invasive_records GROUP BY stateProvince) t")
                ).first()
                avg_c = float(row[0] or 0.0)
                max_c = float(row[1] or 1.0)
                rec_count = int(row[2] or 0)
                max_state = max_c if max_c > 0 else 1.0

            coverage_pct = _clamp(( (rec_count if state else avg_c) / max_state) * 100.0)

            # Average environmental impact from risk table
            env_impact_avg = float(conn.execute(
                text("SELECT AVG(COALESCE(environmental_impact,0)) FROM risk_invasive_species")
            ).scalar_one() or 0.0)

            # Tie condition to observed prevalence; higher coverage lowers these scores
            biodiversity_before = _clamp(100.0 - (coverage_pct * 0.6))
            water_before = _clamp(100.0 - (coverage_pct * 0.4))
            soil_before = _clamp(100.0 - (coverage_pct * 0.5))
            fire_risk_before = _clamp(20.0 + (coverage_pct * 0.5))

            # Simple intervention model: assume effective removal reduces coverage by 80%
            reduction_factor = 0.8
            coverage_after = _clamp(coverage_pct * (1.0 - reduction_factor))
            biodiversity_after = _clamp(biodiversity_before + 25.0)
            water_after = _clamp(water_before + 25.0)
            soil_after = _clamp(soil_before + 25.0)
            fire_risk_after = _clamp(max(0.0, fire_risk_before - 40.0))

            # Benefits estimation proportional to record count (illustrative but live-backed)
            benefits = {
                "carbonSequestration": round(max(1.0, rec_count * 0.0004), 2),
                "waterSaved": int(rec_count * 150),
                "speciesProtected": int(max(5, env_impact_avg / 2)),
                "economicValue": int(rec_count * 0.4),
            }

            return {
                "scope": "state" if state else "national",
                "filter": {"state": state} if state else {},
                "before": {
                    "invasiveCoverage": round(coverage_pct, 2),
                    "biodiversity": round(biodiversity_before, 2),
                    "waterQuality": round(water_before, 2),
                    "soilHealth": round(soil_before, 2),
                    "fireRisk": round(fire_risk_before, 2),
                },
                "after": {
                    "invasiveCoverage": round(coverage_after, 2),
                    "biodiversity": round(biodiversity_after, 2),
                    "waterQuality": round(water_after, 2),
                    "soilHealth": round(soil_after, 2),
                    "fireRisk": round(fire_risk_after, 2),
                },
                "benefits": benefits,
                "sources": [
                    "invastopdb.invasive_records",
                    "invastopdb.risk_invasive_species",
                ],
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to compute impact summary: {str(e)}")


