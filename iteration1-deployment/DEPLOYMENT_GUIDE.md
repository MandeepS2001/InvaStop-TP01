# 🚀 InvaStop Iteration1 Deployment Guide

This guide will help you deploy the InvaStop Iteration1 application to `https://invastop.vercel.app/iteration1`.

## 📁 What's Included

The `iteration1-deployment/` folder contains:
- ✅ **Complete Backend** (FastAPI with AWS RDS connection)
- ✅ **Complete Frontend** (React with Google Maps integration)
- ✅ **Data Files** (CSV datasets and processed data)
- ✅ **Deployment Scripts** (Automated deployment tools)
- ✅ **Configuration Files** (Vercel, environment, CORS settings)

## 🎯 Quick Deployment

### Option 1: Automated Deployment (Recommended)
```bash
cd iteration1-deployment
./deploy.sh
```

### Option 2: Manual Deployment

#### Step 1: Deploy Backend
```bash
cd iteration1-deployment/backend
npx vercel --prod
```

#### Step 2: Deploy Frontend
```bash
cd iteration1-deployment/frontend
npm install
npm run build:iteration1
npx vercel --prod
```

## 🔧 Environment Variables

### Backend (Set in Vercel Dashboard)
```
DATABASE_URL=mysql+pymysql://admin:tp01industryexp@tp01.cpyqoog2o4qg.ap-southeast-2.rds.amazonaws.com:3306/invastopdb
SECRET_KEY=your-secret-key-here-change-in-production
ALLOWED_ORIGINS=["https://invastop.vercel.app","https://invastop.vercel.app/iteration1"]
```

### Frontend (Set in Vercel Dashboard)
```
REACT_APP_API_URL=https://invastopbackend.vercel.app/api/v1
REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyB41DRuKWuJdGrZgCrUdLZtrKEJd_ZmJ9g
```

## 📋 Pre-Deployment Checklist

- [ ] ✅ Backend API endpoints tested locally
- [ ] ✅ Frontend Google Maps integration working
- [ ] ✅ AWS RDS database connection verified
- [ ] ✅ CORS configuration updated for Vercel
- [ ] ✅ Environment variables configured
- [ ] ✅ Build scripts tested

## 🎨 Features Ready for Deployment

### Backend Features
- ✅ **Epic 1.0 API Endpoints**
  - `/api/v1/epic1/map/state-data` - Interactive map data
  - `/api/v1/epic1/states/risk-levels` - State risk levels
  - `/api/v1/epic1/statistics/overview` - Key statistics
  - `/api/v1/epic1/statistics/biodiversity` - Biodiversity impacts

- ✅ **Database Integration**
  - AWS RDS MySQL connection
  - Real species data from CSV files
  - Automated risk level calculations

### Frontend Features
- ✅ **Interactive Map**
  - Google Maps integration
  - State click interactions
  - Species information display
  - Real-time data from backend

- ✅ **Data Visualizations**
  - Taxon threat charts
  - Species impact metrics
  - Educational content

- ✅ **Responsive Design**
  - Mobile-friendly interface
  - Modern UI components
  - Accessibility features

## 🔍 Testing After Deployment

1. **Visit the deployed URL**: `https://invastop.vercel.app/iteration1`
2. **Test the Interactive Map**: Click on Australian states
3. **Verify API Endpoints**: Check browser network tab
4. **Test Mobile Responsiveness**: Use browser dev tools

## 🐛 Troubleshooting

### Common Issues:

1. **Map Not Loading**
   - Check Google Maps API key in Vercel environment variables
   - Verify CORS settings in backend

2. **API Errors**
   - Check AWS RDS connection
   - Verify environment variables are set

3. **Build Failures**
   - Run `npm install` in frontend directory
   - Check for TypeScript errors

### Debug Commands:
```bash
# Test backend locally
cd backend
uvicorn main:app --reload

# Test frontend locally
cd frontend
npm start

# Check build
npm run build:iteration1
```

## 📊 Data Sources

- **State Species Data**: `Data-Science/Draft Dataset - top_5_common.csv`
- **Biodiversity Impact**: `Data-Science/taxon_threat_impact_for_d3.csv`
- **Database**: AWS RDS MySQL instance

## 🎯 Expected Results

After successful deployment, you should have:
- ✅ Working interactive map at `https://invastop.vercel.app/iteration1`
- ✅ Backend API serving real data from AWS RDS
- ✅ Frontend displaying species information
- ✅ All Epic 1.0 features functional

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify environment variables in Vercel
3. Test API endpoints directly
4. Check the deployment logs in Vercel dashboard

---

**Ready to deploy! 🚀**

The iteration1-deployment folder contains everything needed to deploy your working InvaStop application to `https://invastop.vercel.app/iteration1`.
