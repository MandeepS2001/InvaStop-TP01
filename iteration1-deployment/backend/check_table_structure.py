#!/usr/bin/env python3
import sys
import os

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import engine
from sqlalchemy import text

def check_table_structure():
    try:
        print("🔍 Checking table structure in AWS RDS database...")
        
        with engine.connect() as conn:
            # Check top_5_common table structure
            print("\n📋 Table: top_5_common")
            result = conn.execute(text('DESCRIBE top_5_common'))
            columns = result.fetchall()
            for col in columns:
                print(f"  {col[0]} - {col[1]} - {col[2]} - {col[3]} - {col[4]} - {col[5]}")
            
            # Check risk_invasive_species table structure
            print("\n📋 Table: risk_invasive_species")
            result = conn.execute(text('DESCRIBE risk_invasive_species'))
            columns = result.fetchall()
            for col in columns:
                print(f"  {col[0]} - {col[1]} - {col[2]} - {col[3]} - {col[4]} - {col[5]}")
            
            # Check taxon_dataset table structure
            print("\n📋 Table: taxon_dataset")
            result = conn.execute(text('DESCRIBE taxon_dataset'))
            columns = result.fetchall()
            for col in columns:
                print(f"  {col[0]} - {col[1]} - {col[2]} - {col[3]} - {col[4]} - {col[5]}")
            
            # Show sample data from top_5_common
            print("\n📊 Sample data from top_5_common:")
            result = conn.execute(text('SELECT * FROM top_5_common LIMIT 3'))
            sample_data = result.fetchall()
            for row in sample_data:
                print(f"  {row}")
                
    except Exception as e:
        print(f"❌ Error checking table structure: {str(e)}")
        return False
    
    return True

if __name__ == "__main__":
    success = check_table_structure()
    if success:
        print("\n🎉 Table structure check completed!")
    else:
        print("\n💥 Table structure check failed!")
        sys.exit(1)
