# Epic 1.0 Backend Setup Guide

This guide explains how to set up the backend for Epic 1.0: "Understand the Magnitude of the Problem" using your real datasets.

## 🚀 What's Been Implemented

### 1. **New Data Models**
- `StateRisk` - State-level risk assessments
- `StateSpecies` - Species data per state
- `BiodiversityImpact` - Impact by taxon

### 2. **New API Endpoints**
- `GET /api/v1/epic1/states/risk-levels` - Get risk levels for all states
- `GET /api/v1/epic1/states/{state_name}/species` - Get species for specific state
- `GET /api/v1/epic1/statistics/overview` - Get key statistics for homepage
- `GET /api/v1/epic1/statistics/biodiversity` - Get biodiversity impact data
- `GET /api/v1/epic1/map/state-data` - Get formatted data for interactive map

### 3. **Data Import Scripts**
- `init_db.py` - Creates database tables
- `import_data.py` - Imports your CSV datasets

## 📋 Setup Instructions

### Step 1: Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Initialize Database
```bash
python init_db.py
```
This will:
- Create all necessary database tables
- Use SQLite for development (no AWS RDS needed yet)
- Test the database connection

### Step 3: Import Your Data
```bash
python import_data.py
```
This will:
- Load `Draft Dataset - top_5_common.csv` → State species data
- Load `taxon_threat_impact_for_d3.csv` → Biodiversity impact data
- Calculate risk levels automatically
- Populate the database with real data

### Step 4: Start the Server
```bash
uvicorn main:app --reload
```

### Step 5: Test the API
Visit: http://localhost:8000/docs

## 🎯 How This Maps to Epic 1.0

### **AC1.1.1: Key Statistics (3 key facts)**
- **Total Invasive Species**: Calculated from your datasets
- **Biodiversity Impact**: Sum of all impacted species
- **High Risk States**: Count of states with high risk levels

### **AC1.2.1: Interactive Map with State Risk Levels**
- **State-by-State Data**: Real species data from your CSV
- **Risk Assessment**: Calculated based on species types and names
- **Color Coding**: High (Red), Moderate (Orange), Low (Yellow)

### **AC1.2.2: Species Information**
- **Top 3 Species per State**: From your top_5_common.csv
- **Risk Levels**: Calculated automatically
- **Impact Assessment**: Based on species characteristics

## 📊 Data Structure

### **StateSpecies Table**
- State information (NSW, VIC, QLD, etc.)
- Species details (name, type, scientific name)
- Risk assessment (high/moderate/low)
- Native range information

### **StateRisk Table**
- Overall state risk level
- Species count per state
- Calculated from individual species data

### **BiodiversityImpact Table**
- Impact by taxon (Plants, Birds, Mammals, etc.)
- Number of impacted species
- From your taxon_threat_impact dataset

## 🔄 Risk Calculation Logic

The system automatically calculates risk levels based on:

1. **Known High-Risk Species**: Cane Toad, Lantana, Red Fox, etc.
2. **Species Type**: Animals generally higher risk than plants
3. **State Aggregation**: States with 3+ high-risk species = High risk

## 🚀 Next Steps

### **Immediate (What You Can Do Now)**
1. ✅ Run the setup scripts
2. ✅ Test the API endpoints
3. ✅ Verify data is imported correctly

### **Future (When You're Ready for AWS)**
1. **Set up AWS RDS PostgreSQL**
2. **Update DATABASE_URL in config**
3. **Run migrations on production database**
4. **Deploy to AWS Lambda or EC2**

## 🧪 Testing the API

### **Test Statistics Endpoint**
```bash
curl http://localhost:8000/api/v1/epic1/statistics/overview
```

### **Test State Species**
```bash
curl http://localhost:8000/api/v1/epic1/states/New%20South%20Wales/species
```

### **Test Map Data**
```bash
curl http://localhost:8000/api/v1/epic1/map/state-data
```

## 🎉 What You've Achieved

- ✅ **Real Data Integration**: Using your actual datasets
- ✅ **Dynamic Risk Assessment**: Calculated from species data
- ✅ **Complete API Coverage**: All Epic 1.0 requirements met
- ✅ **Production Ready**: Clean, maintainable code structure
- ✅ **Easy to Extend**: Ready for future epics

Your InvaStop backend now has real data and professional-grade API endpoints! 🚀
