#!/usr/bin/env python3
"""
Data Import Script for InvaStop
Imports CSV datasets into the database for Epic 1.0
"""

import pandas as pd
import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.models.state_risk import StateRisk, StateSpecies
from app.models.biodiversity_impact import BiodiversityImpact

def create_database_connection():
    """Create database connection"""
    try:
        # For development, use SQLite if no PostgreSQL connection
        if "postgresql" in settings.DATABASE_URL:
            engine = create_engine(settings.DATABASE_URL)
        else:
            # Fallback to SQLite for development
            engine = create_engine("sqlite:///./invastop.db")
        
        return engine
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return None

def import_state_species_data(engine, csv_path):
    """Import state species data from CSV"""
    try:
        # Read CSV
        df = pd.read_csv(csv_path)
        print(f"Loaded {len(df)} records from {csv_path}")
        
        # Create session
        Session = sessionmaker(bind=engine)
        session = Session()
        
        # Clear existing data
        session.query(StateSpecies).delete()
        session.query(StateRisk).delete()
        
        # Process each row
        state_risk_data = {}
        
        for _, row in df.iterrows():
            # Determine risk level based on species type and other factors
            risk_level = determine_risk_level(row['species_type'], row['sp_common_name'])
            
            # Create StateSpecies record
            species = StateSpecies(
                state_abb=row['state_abb'],
                state_name=row['state_name'],
                sp_common_name=row['sp_common_name'],
                species_type=row['species_type'],
                sp_scientific_name=row['sp_scientific_name'],
                native_range=row['native_range'],
                risk_level=risk_level,
                impact_level=risk_level,  # Same as risk for now
                spread_likelihood="Moderate"  # Default value
            )
            session.add(species)
            
            # Track state risk data
            if row['state_name'] not in state_risk_data:
                state_risk_data[row['state_name']] = {
                    'state_abb': row['state_abb'],
                    'species_count': 0,
                    'high_risk_count': 0
                }
            
            state_risk_data[row['state_name']]['species_count'] += 1
            if risk_level == 'high':
                state_risk_data[row['state_name']]['high_risk_count'] += 1
        
        # Create StateRisk records
        for state_name, data in state_risk_data.items():
            # Determine overall risk based on high-risk species count
            if data['high_risk_count'] >= 3:
                overall_risk = 'high'
            elif data['high_risk_count'] >= 1:
                overall_risk = 'moderate'
            else:
                overall_risk = 'low'
            
            state_risk = StateRisk(
                state_abb=data['state_abb'],
                state_name=state_name,
                overall_risk=overall_risk,
                species_count=data['species_count']
            )
            session.add(state_risk)
        
        session.commit()
        print(f"Successfully imported {len(df)} species records")
        session.close()
        
    except Exception as e:
        print(f"Error importing state species data: {e}")
        session.rollback()
        session.close()

def import_biodiversity_impact_data(engine, csv_path):
    """Import biodiversity impact data from CSV"""
    try:
        # Read CSV
        df = pd.read_csv(csv_path)
        print(f"Loaded {len(df)} records from {csv_path}")
        
        # Create session
        Session = sessionmaker(bind=engine)
        session = Session()
        
        # Clear existing data
        session.query(BiodiversityImpact).delete()
        
        # Process each row
        for _, row in df.iterrows():
            impact = BiodiversityImpact(
                taxon=row['taxon'],
                number_impacted=row['number_impacted']
            )
            session.add(impact)
        
        session.commit()
        print(f"Successfully imported {len(df)} biodiversity impact records")
        session.close()
        
    except Exception as e:
        print(f"Error importing biodiversity impact data: {e}")
        session.rollback()
        session.close()

def determine_risk_level(species_type, common_name):
    """Determine risk level based on species type and name"""
    # High-risk species based on common knowledge
    high_risk_species = [
        'cane toad', 'lantana', 'red fox', 'feral pig', 'buffel grass',
        'gamba grass', 'bitou bush', 'common myna'
    ]
    
    # Check if this is a known high-risk species
    if any(high_risk in common_name.lower() for high_risk in high_risk_species):
        return 'high'
    
    # Plants generally have moderate risk
    if species_type.lower() == 'plant':
        return 'moderate'
    
    # Animals generally have high risk
    if species_type.lower() == 'animal':
        return 'high'
    
    return 'moderate'

def main():
    """Main import function"""
    print("🚀 Starting InvaStop Data Import...")
    
    # Create database connection
    engine = create_database_connection()
    if not engine:
        print("❌ Failed to create database connection")
        return
    
    # Get CSV file paths
    base_path = os.path.join(os.path.dirname(__file__), '..', 'Data-Science')
    
    state_species_csv = os.path.join(base_path, 'Draft Dataset - top_5_common.csv')
    biodiversity_csv = os.path.join(base_path, 'taxon_threat_impact_for_d3.csv')
    
    # Check if files exist
    if not os.path.exists(state_species_csv):
        print(f"❌ State species CSV not found: {state_species_csv}")
        return
    
    if not os.path.exists(biodiversity_csv):
        print(f"❌ Biodiversity CSV not found: {biodiversity_csv}")
        return
    
    print("📊 Importing State Species Data...")
    import_state_species_data(engine, state_species_csv)
    
    print("🌿 Importing Biodiversity Impact Data...")
    import_biodiversity_impact_data(engine, biodiversity_csv)
    
    print("✅ Data import completed successfully!")
    print("\n📋 Available API endpoints:")
    print("  - GET /api/v1/epic1/states/risk-levels")
    print("  - GET /api/v1/epic1/states/{state_name}/species")
    print("  - GET /api/v1/epic1/statistics/overview")
    print("  - GET /api/v1/epic1/statistics/biodiversity")
    print("  - GET /api/v1/epic1/map/state-data")

if __name__ == "__main__":
    main()
