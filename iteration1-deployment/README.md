# InvaStop Iteration 1 Deployment

This folder contains the complete InvaStop application from the `iteration1-sept5` branch, ready for deployment to `https://invastop.vercel.app/iteration1`.

## 🚀 Deployment Structure

```
iteration1-deployment/
├── backend/           # FastAPI backend
├── frontend/          # React frontend
├── Data-Science/      # Data files and datasets
├── docker-compose.yml # Docker configuration
└── README.md         # This file
```

## 📋 Features Included

### Backend (FastAPI)
- ✅ AWS RDS database connection
- ✅ Epic 1.0 API endpoints
- ✅ Interactive map data API
- ✅ Species and biodiversity data
- ✅ CORS configuration for frontend

### Frontend (React)
- ✅ Interactive Google Maps integration
- ✅ Species visualization components
- ✅ Educational pages
- ✅ Responsive design
- ✅ Environment configuration

### Data
- ✅ Top 5 common invasive species dataset
- ✅ Taxon threat impact data
- ✅ Biodiversity impact metrics

## 🔧 Deployment Instructions

### For Vercel Deployment:

1. **Backend Deployment**:
   - Deploy the `backend/` folder to Vercel
   - Set environment variables in Vercel dashboard
   - Ensure AWS RDS connection is configured

2. **Frontend Deployment**:
   - Deploy the `frontend/` folder to Vercel
   - Set environment variables for API URL and Google Maps key
   - Configure build settings

### Environment Variables Needed:

**Backend (.env)**:
```
DATABASE_URL=mysql+pymysql://admin:tp01industryexp@tp01.cpyqoog2o4qg.ap-southeast-2.rds.amazonaws.com:3306/invastopdb
SECRET_KEY=your-secret-key-here-change-in-production
ALLOWED_ORIGINS=["https://invastop.vercel.app","https://invastop.vercel.app/iteration1"]
```

**Frontend (.env)**:
```
REACT_APP_API_URL=https://invastopbackend.vercel.app/api/v1
REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyB41DRuKWuJdGrZgCrUdLZtrKEJd_ZmJ9g
```

## 🎯 API Endpoints Available

- `GET /api/v1/epic1/map/state-data` - Interactive map data
- `GET /api/v1/epic1/states/risk-levels` - State risk levels
- `GET /api/v1/epic1/statistics/overview` - Key statistics
- `GET /api/v1/epic1/statistics/biodiversity` - Biodiversity impacts
- `GET /api/v1/epic1/states/{state_name}/species` - Species by state

## 📊 Data Sources

- **State Species Data**: `Data-Science/Draft Dataset - top_5_common.csv`
- **Biodiversity Impact**: `Data-Science/taxon_threat_impact_for_d3.csv`
- **Database**: AWS RDS MySQL instance

## 🔍 Testing

Before deployment, test locally:
```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm start
```

## 📝 Notes

- This deployment includes all fixes for the interactive map
- Google Maps API key is configured
- CORS is properly set up for Vercel deployment
- All data is connected to the AWS RDS database
- Frontend includes debug logging for troubleshooting

## 🚀 Ready for Deployment

This folder contains everything needed to deploy the iteration1 version of InvaStop to `https://invastop.vercel.app/iteration1`.
