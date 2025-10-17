# InvaStop - Invasive Species Tracker

## Project Overview
InvaStop is an innovative invasive species tracking application developed for Monash University's Master of IT FIT5120 unit. The project addresses **Climate Action** (UN SDG 13) by helping to monitor and manage invasive species that threaten Australia's biodiversity and ecosystem health.

## Problem Statement
Invasive species pose a significant threat to Australia's unique biodiversity and agricultural productivity. Early detection and rapid response are crucial for effective management, but current tracking systems are often fragmented and lack real-time capabilities.

## Solution
InvaStop provides a comprehensive platform for:
- **Real-time invasive species reporting** by citizens and professionals
- **Geospatial tracking** of invasive species spread
- **Data visualization** and analytics for researchers and policymakers
- **Community engagement** in biodiversity conservation
- **Integration with existing databases** and research institutions

## Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API communication
- **React Query** - Data fetching and caching
- **Mapbox/Leaflet** - Interactive maps for species tracking

### Backend
- **Python FastAPI** - High-performance web framework
- **SQLAlchemy** - ORM for database operations
- **PostgreSQL** - Primary database
- **Pydantic** - Data validation
- **JWT** - Authentication
- **GeoPandas** - Geospatial data processing
- **OpenCV** - Image processing for species identification

### DevOps & Tools
- **Docker** - Containerization
- **GitHub Actions** - CI/CD
- **Postman** - API testing
- **ESLint/Prettier** - Code formatting

## Project Structure
```
InvaStop-TP01/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom React hooks
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── package.json
├── backend/                 # FastAPI application
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── models/         # Database models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   ├── requirements.txt
│   └── main.py
├── docs/                   # Documentation
├── docker-compose.yml      # Development environment
└── README.md
```

## Documentation
- Maintenance guide: see `docs/MAINTENANCE.md` for security, ops, and extension guidance.

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- Docker (optional)
- PostgreSQL (for production)

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Docker Setup (Alternative)
```bash
docker-compose up --build
```

## Key Features

### Phase 1 (Current)
- [ ] User authentication and authorization
- [ ] Species reporting with geolocation
- [ ] Basic data visualization
- [ ] Mobile-responsive design

### Phase 2 (Future)
- [ ] AI-powered species identification
- [ ] Real-time alerts and notifications
- [ ] Advanced analytics dashboard
- [ ] Integration with government databases
- [ ] Community engagement features

## Contributing
This project is developed as part of Monash University's FIT5120 unit. Please refer to the project documentation for contribution guidelines.

## License
This project is developed for educational purposes as part of Monash University's Master of IT program.

## Contact
For questions regarding this project, please contact the development team through Monash University's FIT5120 unit channels.
