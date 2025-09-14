from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from typing import List, Dict, Any
from datetime import datetime, timedelta
from app.core.database import get_db
from app.core.security import get_current_active_user
from app.models.user import User
from app.models.report import Report
from app.models.species import Species

router = APIRouter()

@router.get("/dashboard")
def get_dashboard_stats(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get dashboard statistics"""
    # Total reports
    total_reports = db.query(func.count(Report.id)).scalar()
    
    # Reports by status
    reports_by_status = db.query(
        Report.status,
        func.count(Report.id)
    ).group_by(Report.status).all()
    
    # Total species
    total_species = db.query(func.count(Report.species_id.distinct())).scalar()
    
    # Recent reports (last 30 days)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    recent_reports = db.query(func.count(Report.id)).filter(
        Report.created_at >= thirty_days_ago
    ).scalar()
    
    # Top reported species
    top_species = db.query(
        Species.common_name,
        func.count(Report.id).label('report_count')
    ).join(Report).group_by(Species.id, Species.common_name).order_by(
        func.count(Report.id).desc()
    ).limit(5).all()
    
    return {
        "total_reports": total_reports,
        "reports_by_status": dict(reports_by_status),
        "total_species": total_species,
        "recent_reports": recent_reports,
        "top_species": [{"name": s.common_name, "count": s.report_count} for s in top_species]
    }

@router.get("/species-distribution")
def get_species_distribution(
    db: Session = Depends(get_db)
):
    """Get species distribution by impact level and threat category"""
    # Distribution by impact level
    impact_distribution = db.query(
        Species.impact_level,
        func.count(Species.id)
    ).filter(Species.is_active == True).group_by(Species.impact_level).all()
    
    # Distribution by threat category
    threat_distribution = db.query(
        Species.threat_category,
        func.count(Species.id)
    ).filter(Species.is_active == True).group_by(Species.threat_category).all()
    
    return {
        "impact_levels": dict(impact_distribution),
        "threat_categories": dict(threat_distribution)
    }

@router.get("/reports-timeline")
def get_reports_timeline(
    days: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db)
):
    """Get reports timeline for the specified number of days"""
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days)
    
    # Group reports by date
    timeline_data = db.query(
        func.date(Report.created_at).label('date'),
        func.count(Report.id).label('count')
    ).filter(
        Report.created_at >= start_date
    ).group_by(
        func.date(Report.created_at)
    ).order_by(
        func.date(Report.created_at)
    ).all()
    
    return [
        {"date": str(item.date), "count": item.count}
        for item in timeline_data
    ]

@router.get("/geographic-distribution")
def get_geographic_distribution(
    db: Session = Depends(get_db)
):
    """Get geographic distribution of reports"""
    # Get reports with coordinates
    reports = db.query(
        Report.latitude,
        Report.longitude,
        Report.species_id,
        Species.common_name,
        Report.status
    ).join(Species).filter(
        Report.latitude.isnot(None),
        Report.longitude.isnot(None)
    ).all()
    
    return [
        {
            "latitude": report.latitude,
            "longitude": report.longitude,
            "species_id": report.species_id,
            "species_name": report.common_name,
            "status": report.status
        }
        for report in reports
    ]

@router.get("/user-contributions")
def get_user_contributions(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user contribution statistics"""
    # User's total reports
    user_reports = db.query(func.count(Report.id)).filter(
        Report.user_id == current_user.id
    ).scalar()
    
    # User's reports by status
    user_reports_by_status = db.query(
        Report.status,
        func.count(Report.id)
    ).filter(
        Report.user_id == current_user.id
    ).group_by(Report.status).all()
    
    # User's recent activity
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    recent_activity = db.query(func.count(Report.id)).filter(
        and_(
            Report.user_id == current_user.id,
            Report.created_at >= thirty_days_ago
        )
    ).scalar()
    
    return {
        "total_reports": user_reports,
        "reports_by_status": dict(user_reports_by_status),
        "recent_activity": recent_activity
    }

@router.get("/species-analytics/{species_id}")
def get_species_analytics(
    species_id: int,
    db: Session = Depends(get_db)
):
    """Get detailed analytics for a specific species"""
    # Verify species exists
    species = db.query(Species).filter(Species.id == species_id).first()
    if not species:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Species not found"
        )
    
    # Total reports for this species
    total_reports = db.query(func.count(Report.id)).filter(
        Report.species_id == species_id
    ).scalar()
    
    # Reports by status
    reports_by_status = db.query(
        Report.status,
        func.count(Report.id)
    ).filter(
        Report.species_id == species_id
    ).group_by(Report.status).all()
    
    # Geographic spread
    geographic_data = db.query(
        Report.latitude,
        Report.longitude,
        Report.created_at
    ).filter(
        Report.species_id == species_id,
        Report.latitude.isnot(None),
        Report.longitude.isnot(None)
    ).all()
    
    # Timeline data
    timeline_data = db.query(
        func.date(Report.created_at).label('date'),
        func.count(Report.id).label('count')
    ).filter(
        Report.species_id == species_id
    ).group_by(
        func.date(Report.created_at)
    ).order_by(
        func.date(Report.created_at)
    ).all()
    
    return {
        "species": {
            "id": species.id,
            "scientific_name": species.scientific_name,
            "common_name": species.common_name,
            "impact_level": species.impact_level,
            "threat_category": species.threat_category
        },
        "total_reports": total_reports,
        "reports_by_status": dict(reports_by_status),
        "geographic_data": [
            {
                "latitude": item.latitude,
                "longitude": item.longitude,
                "date": item.created_at.isoformat()
            }
            for item in geographic_data
        ],
        "timeline": [
            {"date": str(item.date), "count": item.count}
            for item in timeline_data
        ]
    }
