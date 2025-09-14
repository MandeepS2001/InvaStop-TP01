from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.core.security import get_current_active_user
from app.models.user import User
from app.models.report import Report
from app.models.species import Species
from app.schemas.report import ReportCreate, Report as ReportSchema, ReportList, ReportUpdate, ReportVerification
import json

router = APIRouter()

@router.get("/", response_model=List[ReportList])
def get_reports(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    species_id: Optional[int] = None,
    status_filter: Optional[str] = None,
    user_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Get list of reports with optional filtering"""
    query = db.query(Report).join(Species)
    
    if species_id:
        query = query.filter(Report.species_id == species_id)
    
    if status_filter:
        query = query.filter(Report.status == status_filter)
    
    if user_id:
        query = query.filter(Report.user_id == user_id)
    
    reports = query.offset(skip).limit(limit).all()
    
    # Convert to ReportList format
    report_list = []
    for report in reports:
        report_list.append(ReportList(
            id=report.id,
            title=report.title,
            species_id=report.species_id,
            species_name=report.species.common_name,
            latitude=report.latitude,
            longitude=report.longitude,
            report_date=report.report_date,
            status=report.status,
            image_urls=json.loads(report.image_urls) if report.image_urls else None,
            created_at=report.created_at
        ))
    
    return report_list

@router.get("/{report_id}", response_model=ReportSchema)
def get_report_by_id(
    report_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get specific report by ID"""
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    # Check if user can access this report
    if report.user_id != current_user.id and current_user.role not in ["admin", "researcher"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this report"
        )
    
    return report

@router.post("/", response_model=ReportSchema)
def create_report(
    report: ReportCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new species sighting report"""
    # Verify species exists
    species = db.query(Species).filter(Species.id == report.species_id, Species.is_active == True).first()
    if not species:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Species not found"
        )
    
    # Create report
    report_data = report.dict()
    if report_data.get("image_urls"):
        report_data["image_urls"] = json.dumps(report_data["image_urls"])
    
    db_report = Report(
        user_id=current_user.id,
        **report_data
    )
    
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report

@router.put("/{report_id}", response_model=ReportSchema)
def update_report(
    report_id: int,
    report_update: ReportUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update report (owner or admin/researcher only)"""
    db_report = db.query(Report).filter(Report.id == report_id).first()
    if not db_report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    # Check authorization
    if db_report.user_id != current_user.id and current_user.role not in ["admin", "researcher"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this report"
        )
    
    update_data = report_update.dict(exclude_unset=True)
    if update_data.get("image_urls"):
        update_data["image_urls"] = json.dumps(update_data["image_urls"])
    
    for field, value in update_data.items():
        setattr(db_report, field, value)
    
    db.commit()
    db.refresh(db_report)
    return db_report

@router.post("/{report_id}/verify")
def verify_report(
    report_id: int,
    verification: ReportVerification,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Verify or reject a report (admin/researcher only)"""
    if current_user.role not in ["admin", "researcher"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to verify reports"
        )
    
    db_report = db.query(Report).filter(Report.id == report_id).first()
    if not db_report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    db_report.status = verification.status
    db_report.verification_notes = verification.verification_notes
    db_report.verified_by = current_user.id
    db_report.verified_at = db_report.updated_at
    
    db.commit()
    return {"message": f"Report {verification.status} successfully"}

@router.delete("/{report_id}")
def delete_report(
    report_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete report (owner or admin only)"""
    db_report = db.query(Report).filter(Report.id == report_id).first()
    if not db_report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    if db_report.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this report"
        )
    
    db.delete(db_report)
    db.commit()
    return {"message": "Report deleted successfully"}
