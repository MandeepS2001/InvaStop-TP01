#!/usr/bin/env python3
"""
Test Script for Epic 1.0 API Endpoints
Verifies that all endpoints are working correctly
"""

import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_endpoint(endpoint, description):
    """Test a single endpoint"""
    print(f"\n🧪 Testing: {description}")
    print(f"   URL: {BASE_URL}{endpoint}")
    
    try:
        response = requests.get(f"{BASE_URL}{endpoint}")
        
        if response.status_code == 200:
            print(f"   ✅ Status: {response.status_code}")
            data = response.json()
            
            if isinstance(data, list):
                print(f"   📊 Records: {len(data)}")
                if data:
                    print(f"   📋 Sample: {data[0]}")
            elif isinstance(data, dict):
                print(f"   📊 Keys: {list(data.keys())}")
                if 'message' in data:
                    print(f"   💬 Message: {data['message']}")
            
        else:
            print(f"   ❌ Status: {response.status_code}")
            print(f"   📝 Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print(f"   ❌ Connection Error: Server not running at {BASE_URL}")
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")

def main():
    """Main test function"""
    print("🚀 Testing InvaStop Epic 1.0 API Endpoints")
    print("=" * 50)
    
    # Wait a moment for server to start
    print("⏳ Waiting for server to be ready...")
    time.sleep(2)
    
    # Test all endpoints
    endpoints = [
        ("/api/v1/epic1/states/risk-levels", "State Risk Levels"),
        ("/api/v1/epic1/statistics/overview", "Statistics Overview"),
        ("/api/v1/epic1/statistics/biodiversity", "Biodiversity Impacts"),
        ("/api/v1/epic1/map/state-data", "Map State Data"),
        ("/api/v1/epic1/states/New%20South%20Wales/species", "NSW Species"),
        ("/api/v1/epic1/states/Queensland/species", "Queensland Species"),
        ("/api/v1/epic1/states/Victoria/species", "Victoria Species"),
    ]
    
    for endpoint, description in endpoints:
        test_endpoint(endpoint, description)
        time.sleep(0.5)  # Small delay between requests
    
    print("\n" + "=" * 50)
    print("🎯 Epic 1.0 API Testing Complete!")
    print("\n📋 Next Steps:")
    print("   1. Check the results above")
    print("   2. Visit http://localhost:8000/docs for full API documentation")
    print("   3. Update your frontend to use these real endpoints")
    print("   4. Test the interactive map with real data")

if __name__ == "__main__":
    main()
