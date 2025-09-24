#!/usr/bin/env python3
import sys
import os

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import engine
from sqlalchemy import text

def test_connection():
    try:
        print("🔌 Testing AWS RDS MySQL connection...")
        print(f"Database URL: {engine.url}")
        
        with engine.connect() as conn:
            result = conn.execute(text('SELECT 1 as test'))
            row = result.fetchone()
            print(f"✅ Database connection successful!")
            print(f"Test query result: {row}")
            
            # Show tables in the current database (invastopdb)
            result = conn.execute(text('SHOW TABLES'))
            tables = result.fetchall()
            print(f"📋 Tables in 'invastopdb' database: {[table[0] for table in tables]}")
            
            # If we have tables, show some sample data
            if tables:
                print(f"\n🔍 Sample data from tables:")
                for table in tables[:3]:  # Show first 3 tables
                    table_name = table[0]
                    try:
                        result = conn.execute(text(f'SELECT COUNT(*) as count FROM `{table_name}`'))
                        count = result.fetchone()[0]
                        print(f"  📊 {table_name}: {count} records")
                        
                        # Show first few records
                        if count > 0:
                            result = conn.execute(text(f'SELECT * FROM `{table_name}` LIMIT 2'))
                            sample_data = result.fetchall()
                            print(f"    Sample: {sample_data[:2]}")
                    except Exception as e:
                        print(f"  ❌ Error reading {table_name}: {str(e)}")
            
    except Exception as e:
        print(f"❌ Database connection failed: {str(e)}")
        print(f"Error type: {type(e).__name__}")
        return False
    
    return True

if __name__ == "__main__":
    success = test_connection()
    if success:
        print("\n🎉 Database connection test passed!")
    else:
        print("\n💥 Database connection test failed!")
        sys.exit(1)
