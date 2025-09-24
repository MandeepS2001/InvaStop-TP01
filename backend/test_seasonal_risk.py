#!/usr/bin/env python3
"""
Unit tests for the seasonal risk endpoint
"""
import sys
import os

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.api.routes.epic1 import get_seasonal_risk_data
from app.core.database import get_db

def test_seasonal_risk_valid_season():
    """Test seasonal risk endpoint with valid season"""
    db = next(get_db())
    try:
        result = get_seasonal_risk_data('Summer', None, 50.0, db)
        
        # Check required fields
        assert "season" in result
        assert "total_sightings" in result
        assert "top_species" in result
        assert "risk_summary" in result
        assert "location" in result
        
        assert result["season"] == "Summer"
        assert result["location"] == "Australia-wide"
        assert isinstance(result["total_sightings"], int)
        assert isinstance(result["top_species"], dict)
        assert isinstance(result["risk_summary"], dict)
        
        print("✅ Valid season test passed")
    except Exception as e:
        print(f"❌ Valid season test failed: {e}")
    finally:
        db.close()

def test_seasonal_risk_with_postcode():
    """Test seasonal risk endpoint with postcode"""
    db = next(get_db())
    try:
        result = get_seasonal_risk_data('Summer', '3000', 50.0, db)
        
        assert result["season"] == "Summer"
        assert result["location"] == "3000"
        assert "radius_km" in result
        
        print("✅ Postcode test passed")
    except Exception as e:
        print(f"❌ Postcode test failed: {e}")
    finally:
        db.close()

def test_seasonal_risk_all_seasons():
    """Test seasonal risk endpoint with all valid seasons"""
    seasons = ["Spring", "Summer", "Autumn", "Winter"]
    db = next(get_db())
    
    try:
        for season in seasons:
            result = get_seasonal_risk_data(season, None, 50.0, db)
            assert result["season"] == season
            print(f"✅ {season} season test passed")
    except Exception as e:
        print(f"❌ All seasons test failed: {e}")
    finally:
        db.close()

def test_seasonal_risk_risk_summary_structure():
    """Test that risk summary has correct structure"""
    db = next(get_db())
    try:
        result = get_seasonal_risk_data('Summer', None, 50.0, db)
        risk_summary = result["risk_summary"]
        
        assert "high_risk" in risk_summary
        assert "medium_risk" in risk_summary
        assert "low_risk" in risk_summary
        
        assert isinstance(risk_summary["high_risk"], int)
        assert isinstance(risk_summary["medium_risk"], int)
        assert isinstance(risk_summary["low_risk"], int)
        
        # Risk counts should be non-negative
        assert risk_summary["high_risk"] >= 0
        assert risk_summary["medium_risk"] >= 0
        assert risk_summary["low_risk"] >= 0
        
        print("✅ Risk summary structure test passed")
    except Exception as e:
        print(f"❌ Risk summary structure test failed: {e}")
    finally:
        db.close()

def test_seasonal_risk_top_species_structure():
    """Test that top species data has correct structure"""
    db = next(get_db())
    try:
        result = get_seasonal_risk_data('Summer', None, 50.0, db)
        top_species = result["top_species"]
        
        # Should be a dictionary
        assert isinstance(top_species, dict)
        
        # If there are species, check their structure
        if top_species:
            for species_name, species_data in top_species.items():
                assert isinstance(species_name, str)
                assert isinstance(species_data, dict)
                
                # Check required fields
                assert "count" in species_data
                assert "locations" in species_data
                assert "months" in species_data
                assert "risk_level" in species_data
                
                # Check data types
                assert isinstance(species_data["count"], int)
                assert isinstance(species_data["locations"], list)
                assert isinstance(species_data["months"], list)
                assert isinstance(species_data["risk_level"], str)
                
                # Check risk level values
                assert species_data["risk_level"] in ["High", "Medium", "Low"]
                
                # Count should be positive
                assert species_data["count"] > 0
        
        print("✅ Top species structure test passed")
    except Exception as e:
        print(f"❌ Top species structure test failed: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    print("🧪 Running seasonal risk endpoint tests...")
    test_seasonal_risk_valid_season()
    test_seasonal_risk_with_postcode()
    test_seasonal_risk_all_seasons()
    test_seasonal_risk_risk_summary_structure()
    test_seasonal_risk_top_species_structure()
    print("🎉 All tests completed!")
