# InvaStop Setup Guide

This guide will help you set up the InvaStop project for development and production.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)
- **Docker** and **Docker Compose** (optional, for containerized setup)
- **PostgreSQL** (v13 or higher, for local development)
- **Git**

## Quick Start with Docker (Recommended)

The easiest way to get started is using Docker Compose:

```bash
# Clone the repository
git clone <repository-url>
cd InvaStop-TP01

# Start all services
docker-compose up --build

# The application will be available at:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Documentation: http://localhost:8000/docs
```

## Manual Setup

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Initialize database (if using SQLite for development)
# For PostgreSQL, create database and update DATABASE_URL in .env

# Run migrations (when implemented)
# alembic upgrade head

# Start the development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start the development server
npm start
```

## Environment Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Application settings
APP_NAME=InvaStop API
APP_VERSION=1.0.0
DEBUG=True

# Database settings
DATABASE_URL=postgresql://user:password@localhost/invastop

# Security settings
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS settings
ALLOWED_ORIGINS=["http://localhost:3000","http://localhost:3001"]

# File upload settings
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
ALLOWED_IMAGE_TYPES=["image/jpeg","image/png","image/webp"]

# Geospatial settings
DEFAULT_SRID=4326

# External APIs
MAPBOX_ACCESS_TOKEN=your-mapbox-token
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:8000/api/v1
REACT_APP_MAPBOX_TOKEN=your-mapbox-token
```

## Database Setup

### PostgreSQL (Recommended for Production)

1. Install PostgreSQL
2. Create a database:
   ```sql
   CREATE DATABASE invastop;
   CREATE USER invastop_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE invastop TO invastop_user;
   ```
3. Update `DATABASE_URL` in your `.env` file

### SQLite (Development Only)

For development, you can use SQLite by setting:
```env
DATABASE_URL=sqlite:///./invastop.db
```

## API Documentation

Once the backend is running, you can access:

- **Interactive API Documentation**: http://localhost:8000/docs
- **ReDoc Documentation**: http://localhost:8000/redoc
- **OpenAPI Schema**: http://localhost:8000/openapi.json

## Development Workflow

### Backend Development

1. **Code Structure**:
   ```
   backend/
   ├── app/
   │   ├── api/routes/     # API endpoints
   │   ├── core/          # Configuration and utilities
   │   ├── models/        # Database models
   │   └── schemas/       # Pydantic schemas
   ├── main.py           # Application entry point
   └── requirements.txt  # Python dependencies
   ```

2. **Adding New Endpoints**:
   - Create route files in `app/api/routes/`
   - Add schemas in `app/schemas/`
   - Update models in `app/models/`
   - Register routes in `main.py`

### Frontend Development

1. **Code Structure**:
   ```
   frontend/
   ├── src/
   │   ├── components/    # Reusable UI components
   │   ├── pages/        # Page components
   │   ├── services/     # API services
   │   ├── hooks/        # Custom React hooks
   │   ├── types/        # TypeScript definitions
   │   └── utils/        # Utility functions
   ├── public/           # Static assets
   └── package.json      # Node.js dependencies
   ```

2. **Adding New Features**:
   - Create components in `src/components/`
   - Add pages in `src/pages/`
   - Create services in `src/services/`
   - Define types in `src/types/`

## Testing

### Backend Testing

```bash
cd backend
pytest
```

### Frontend Testing

```bash
cd frontend
npm test
```

## Deployment

### Production Deployment

1. **Backend Deployment**:
   - Use a production WSGI server (Gunicorn)
   - Set up reverse proxy (Nginx)
   - Configure environment variables
   - Set up SSL certificates

2. **Frontend Deployment**:
   ```bash
   cd frontend
   npm run build
   # Deploy the build folder to your web server
   ```

3. **Database**:
   - Use PostgreSQL in production
   - Set up regular backups
   - Configure connection pooling

### Docker Production Deployment

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy with production configuration
docker-compose -f docker-compose.prod.yml up -d
```

## Troubleshooting

### Common Issues

1. **Database Connection Errors**:
   - Check `DATABASE_URL` in `.env`
   - Ensure database is running
   - Verify user permissions

2. **CORS Errors**:
   - Update `ALLOWED_ORIGINS` in backend `.env`
   - Check frontend API URL configuration

3. **Port Conflicts**:
   - Change ports in `docker-compose.yml` or `.env`
   - Check if ports are already in use

4. **Dependency Issues**:
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Recreate virtual environment: `rm -rf venv && python -m venv venv`

### Getting Help

- Check the API documentation at `/docs`
- Review the logs for error messages
- Ensure all environment variables are set correctly
- Verify all dependencies are installed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is developed for educational purposes as part of Monash University's Master of IT program.
