# InvaStop Pair Programming Plan
## Masters of IT - FIT5120 Project

### Team Members
- **Development Team**: Mandeep, Shiyu
- **Data Science Team**: Taufik, Ketan

---

## 1) Code Quality to Final Release

### Basic Rules
- Follow PEP8 coding style guidelines for Python backend
- Use ESLint/Prettier for TypeScript frontend code
- Use clear file and function names with descriptive comments
- Include short comments on important logic and business rules

### Branches & Commits
- The `main` branch must remain stable
- Each feature should be developed in a dedicated `feature/...` branch
- Commit messages should use prefixes like `feat/`, `fix/`, `docs/`, or `data/` for easy-to-read history
- Data science work should use `data/` prefix for dataset processing and analysis

### Code Review
- **Mandeep and Shiyu** are designated to review each other's code
- **Taufik and Ketan** review data processing scripts and analysis code
- Review checklist includes:
  - Edge cases and proper error handling
  - Privacy/permissions considerations (especially for species data)
  - Data validation and integrity checks
  - Presence of tests
  - Performance considerations for large datasets

### Testing
- **Unit tests** required for:
  - Core business logic (species risk calculations)
  - API endpoints and data validation
  - Data processing functions
- **Integration tests** needed for:
  - Database operations and migrations
  - API-to-frontend data flow
  - Map integration and geolocation features
- **Coverage gates**:
  - Backend code: ≥ 80% coverage
  - Frontend code: ≥ 70% coverage
  - Data processing scripts: ≥ 60% coverage

### CI/CD (Simple)
1. Open Pull Request
2. Automated pipeline runs "format + checks + tests"
3. Code review by designated team members
4. Merge upon approval
5. Automatic deployment to staging environment
6. Smoke test execution
7. Manual approval for production deployment
8. Keep last version for one-click rollback

### Definition of Done
- [ ] Code reviewed and tested
- [ ] All tests pass ("all green")
- [ ] Coverage requirements met
- [ ] Documentation updated (API docs, README)
- [ ] Data processing scripts validated with sample data
- [ ] Test environment verification passed

---

## 2) Pair Programming Plan

| Pair | Goal | Output |
|------|------|--------|
| **Dev(Owner) & Dev(Observer)** | Core API logic and species risk calculations | Unit tests + production code |
| **Dev & Data Science** | Data pipeline and risk factor definitions | Field specifications + validation scripts |
| **Dev & Data Science** | Map integration and geospatial data processing | Data dictionary + sample datasets |
| **Dev & Dev** | Frontend components and user experience | Component tests + UI implementation |
| **Data Science & Data Science** | Dataset cleaning and analysis | Clean datasets + analysis notebooks |

---

## 3) Feature Estimates & Workload

### **Currently Implemented Features (Epic 1.0)**
| Feature | Status | Est. Hours | Risk/Notes | Owner |
|---------|--------|------------|------------|-------|
| **Epic 1.0 Backend API** | ✅ Complete | 0h | State risk levels, species data, statistics | Taufik, Ketan, Mandeep |
| **Homepage with Statistics** | ✅ Complete | 0h | Key facts display, interactive stats | Shiyu, Mandeep |
| **Interactive Map (Basic)** | ✅ Complete | 0h | State risk visualization, species overlay | Shiyu, Mandeep |
| **Species Detail Pages** | ✅ Complete | 0h | Individual species information display | Shiyu, Mandeep |
| **Education Page** | ✅ Complete | 0h | Educational content and resources | Shiyu, Mandeep |
| **Basic Authentication** | ✅ Complete | 0h | Simple login system (TP01/TP01) | Mandeep, Shiyu |
| **Data Import Pipeline** | ✅ Complete | 0h | CSV to database import scripts | Taufik, Ketan |

### **Features to Complete/Enhance**
| Feature | Est. Hours | Risk/Notes | Owner |
|---------|------------|------------|-------|
| **Enhanced Authentication & User Management** | 20h | JWT security, role-based access, user profiles | Mandeep, Shiyu |
| **Species Reporting & Submission System** | 35h | Image upload, geolocation, form validation | Mandeep, Shiyu |
| **Advanced Data Visualization** | 25h | Enhanced charts, real-time updates, filtering | Taufik, Ketan, Shiyu |
| **Species Search & Filtering** | 15h | Advanced search, category filters, pagination | Shiyu, Mandeep |
| **Report Management System** | 30h | Report CRUD, status tracking, admin review | Mandeep, Shiyu |
| **Analytics Dashboard** | 20h | User analytics, report trends, species insights | Taufik, Ketan, Shiyu |
| **Species Identification (AI)** | 40h | OpenCV integration, image classification | Taufik, Ketan, Mandeep |
| **Community Features** | 25h | User profiles, report sharing, notifications | Shiyu, Mandeep |
| **Admin Panel** | 30h | User management, report moderation, data export | Mandeep, Shiyu |
| **Mobile Responsiveness** | 15h | Mobile optimization, touch interactions | Shiyu, Mandeep |
| **Performance Optimization** | 20h | API caching, image optimization, lazy loading | Mandeep, Shiyu |
| **End-to-end Testing** | 25h | Multi-page flows, API testing, user journeys | Mandeep, Shiyu |
| **CI/CD & AWS Deployment** | 20h | Production deployment, monitoring, backups | Mandeep, Shiyu |

### **Data Science & Analysis Features**
| Feature | Est. Hours | Risk/Notes | Owner |
|---------|------------|------------|-------|
| **Advanced Risk Modeling** | 30h | Machine learning risk prediction, species spread models | Taufik, Ketan |
| **Data Quality & Validation** | 20h | Data cleaning pipelines, validation rules | Taufik, Ketan |
| **Statistical Analysis Tools** | 25h | Trend analysis, correlation studies, impact assessment | Taufik, Ketan |
| **Predictive Analytics** | 35h | Species spread prediction, risk forecasting | Taufik, Ketan |
| **Data Export & Reporting** | 15h | CSV/PDF exports, automated reports | Taufik, Ketan |

### **Total Estimated Hours: 395h**
- **Development Features**: 300h
- **Data Science Features**: 95h
- **Already Completed**: ~150h (Epic 1.0)

---

## 4) Cross-Discipline Pairing

### Dev & Dev
- **Goal**: Build core application logic and refactor existing code
- **Approach**: Write tests first, then implement features
- **Focus Areas**: API development, frontend components, system architecture

### Dev & Data Science
- **Goal**: Define data fields, relationships, and processing pipelines
- **Approach**: Map data flow from CSV to database to API to frontend
- **Deliverables**: 
  - Data dictionary with field specifications
  - Sample datasets for testing
  - Validation scripts for data integrity
  - Risk calculation algorithms

### Data Science & Data Science
- **Goal**: Clean datasets and perform statistical analysis
- **Approach**: Collaborative analysis using Jupyter notebooks
- **Deliverables**:
  - Cleaned and validated datasets
  - Statistical analysis reports
  - Risk assessment models
  - Data visualization prototypes

### Dev & Data Science (Integration)
- **Goal**: Integrate data science models into production system
- **Approach**: API-first design with model serving
- **Deliverables**:
  - Model serving endpoints
  - Data preprocessing pipelines
  - Performance monitoring for ML models

---

## 5) Roles & Responsibilities

### Primary Roles
- **Mandeep**: Backend Lead, API Development, System Architecture
- **Shiyu**: Frontend Lead, UI/UX Implementation, User Experience
- **Taufik**: Data Science Lead, Dataset Processing, Risk Modeling
- **Ketan**: Data Analysis, Statistical Modeling, Visualization

### Cross-Functional Responsibilities
- Each feature has an **Owner** and **Observer**
- Start by aligning acceptance criteria and identifying risks
- Switch roles when needed to ensure knowledge sharing
- Regular pair rotation to maintain team cohesion

---

## 6) Weekly Sprint Structure

### Monday: Planning & Pair Assignment
- Review previous week's progress
- Assign pairs for current week's features
- Identify blockers and dependencies

### Tuesday-Thursday: Development & Pairing
- Focused pair programming sessions
- Daily standups to sync progress
- Code reviews and testing

### Friday: Integration & Testing
- Merge feature branches
- Integration testing
- Demo preparation
- Retrospective and planning for next week

---

## 7) Communication & Collaboration

### Daily Standups (15 minutes)
- What did you complete yesterday?
- What are you working on today?
- Any blockers or help needed?

### Weekly Tech Reviews (1 hour)
- Code quality review
- Architecture decisions
- Technical debt assessment

### Bi-weekly Demo Sessions (30 minutes)
- Showcase completed features
- Gather feedback from stakeholders
- Plan next iteration priorities

---

## 8) Success Metrics

### Code Quality
- Test coverage above defined thresholds
- Zero critical bugs in production
- Code review completion rate > 95%

### Team Collaboration
- Equal participation in pair programming
- Knowledge sharing across all team members
- Effective cross-discipline communication

### Project Delivery
- Features delivered on time
- User acceptance criteria met
- Performance benchmarks achieved

---

## 9) Development Artifacts & Documentation

### GitHub Repository & Code Management
- **Repository**: [InvaStop-TP01 GitHub Repository](https://github.com/[username]/InvaStop-TP01)
- **Branch Strategy**: 
  - `main` - Production-ready code
  - `develop` - Integration branch for features
  - `feature/[feature-name]` - Individual feature development
  - `data/[dataset-name]` - Data science work and analysis
- **Pair Programming Notes**: 
  - All pair programming sessions documented in commit messages
  - Use format: `feat: [feature] - paired with [partner] - [brief description]`
  - Example: `feat: species-risk-calculation - paired with Taufik - implemented risk scoring algorithm`

### Code Repository Structure
```
InvaStop-TP01/
├── .github/
│   ├── workflows/          # CI/CD pipelines
│   └── ISSUE_TEMPLATE/     # Issue templates
├── docs/
│   ├── PAIR_PROGRAMMING_PLAN.md
│   ├── API_DOCUMENTATION.md
│   ├── DATA_MODELS.md
│   └── DEPLOYMENT_GUIDE.md
├── backend/                # FastAPI application
├── frontend/               # React TypeScript application
├── Data-Science/          # Jupyter notebooks and datasets
└── tests/                 # Integration and E2E tests
```

### Pair Programming Documentation
- **Session Logs**: Document each pair programming session with:
  - Date and duration
  - Participants
  - Goals achieved
  - Challenges faced
  - Knowledge transferred
- **Code Review Records**: Track all code reviews with feedback and improvements
- **Decision Log**: Document architectural and technical decisions made during pairing

---

## 10) Technology Stack & Development Approach

### First-Cut Technology Selection

#### **Backend Technology Stack**
- **Framework**: FastAPI (Python 3.9+)
  - *Rationale*: High performance, automatic API documentation, type hints support
- **Database**: PostgreSQL with SQLAlchemy ORM
  - *Rationale*: ACID compliance, excellent geospatial support, mature ecosystem
- **Authentication**: JWT with OAuth2
  - *Rationale*: Stateless, scalable, industry standard
- **Data Processing**: Pandas, GeoPandas, NumPy
  - *Rationale*: Powerful data manipulation, geospatial capabilities
- **Image Processing**: OpenCV, PIL
  - *Rationale*: Species identification and image analysis

#### **Frontend Technology Stack**
- **Framework**: React 18 with TypeScript
  - *Rationale*: Component-based architecture, type safety, large ecosystem
- **Styling**: Tailwind CSS
  - *Rationale*: Utility-first, responsive design, rapid development
- **State Management**: React Query + Context API
  - *Rationale*: Server state management, caching, optimistic updates
- **Maps**: Mapbox GL JS
  - *Rationale*: High-performance mapping, custom styling, geospatial features
- **Charts**: D3.js with React integration
  - *Rationale*: Flexible data visualization, custom charts for species data

#### **Data Science Stack**
- **Analysis**: Jupyter Notebooks, Python
- **Libraries**: Pandas, NumPy, Scikit-learn, Matplotlib, Seaborn
- **Geospatial**: GeoPandas, Folium, Shapely
- **Machine Learning**: TensorFlow/PyTorch (for future AI features)

#### **DevOps & Infrastructure**
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Cloud Platform**: AWS (RDS, Lambda, S3)
- **Monitoring**: AWS CloudWatch, Sentry

### Development Approach

#### **API-First Development**
- Design APIs before implementation
- Use OpenAPI/Swagger for documentation
- Mock APIs for frontend development
- Version control for API changes

#### **Data-Driven Development**
- Start with real datasets (CSV files provided)
- Build data models based on actual data structure
- Implement data validation and cleaning pipelines
- Create data dictionaries and schemas

#### **Test-Driven Development (TDD)**
- Write tests before implementation
- Focus on business logic and critical paths
- Maintain high test coverage
- Automated testing in CI/CD pipeline

### First-Cut Data Models

#### **Core Entities**
```python
# User Management
class User(BaseModel):
    id: UUID
    email: str
    username: str
    role: UserRole  # citizen, researcher, admin
    created_at: datetime
    is_active: bool

# Species Information
class Species(BaseModel):
    id: UUID
    scientific_name: str
    common_name: str
    species_type: SpeciesType  # plant, animal, insect, etc.
    native_range: str
    threat_level: ThreatLevel  # high, moderate, low
    description: str
    image_url: Optional[str]

# Species Reports
class SpeciesReport(BaseModel):
    id: UUID
    user_id: UUID
    species_id: UUID
    location: Point  # PostGIS geometry
    latitude: float
    longitude: float
    report_date: datetime
    status: ReportStatus  # pending, verified, rejected
    confidence_score: float
    image_urls: List[str]
    notes: Optional[str]

# State Risk Assessment
class StateRisk(BaseModel):
    state_name: str
    risk_level: RiskLevel  # high, moderate, low
    species_count: int
    high_risk_species: int
    last_updated: datetime

# Biodiversity Impact
class BiodiversityImpact(BaseModel):
    taxon: str  # Plants, Birds, Mammals, etc.
    impacted_species_count: int
    threat_score: float
    conservation_priority: int
```

#### **Geospatial Data Models**
```python
# State Boundaries (for mapping)
class StateBoundary(BaseModel):
    state_name: str
    geometry: Polygon  # PostGIS geometry
    area_km2: float
    population: int

# Species Distribution
class SpeciesDistribution(BaseModel):
    species_id: UUID
    state_name: str
    occurrence_count: int
    last_sighting: datetime
    density_score: float
```

### Software Packages & Dependencies

#### **Backend Dependencies**
```txt
# Core Framework
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0

# Database
sqlalchemy==2.0.23
alembic==1.13.0
psycopg2-binary==2.9.9
geoalchemy2==0.14.2

# Authentication
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6

# Data Processing
pandas==2.1.4
geopandas==0.14.1
numpy==1.25.2
scikit-learn==1.3.2

# Image Processing
opencv-python==4.8.1.78
Pillow==10.1.0

# HTTP & Validation
httpx==0.25.2
email-validator==2.1.0
```

#### **Frontend Dependencies**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.3.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.0",
    "@tanstack/react-query": "^5.0.0",
    "mapbox-gl": "^2.15.0",
    "d3": "^7.8.0",
    "tailwindcss": "^3.3.0",
    "lucide-react": "^0.294.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.1.0",
    "vite": "^5.0.0",
    "eslint": "^8.54.0",
    "prettier": "^3.1.0",
    "@types/d3": "^7.4.0"
  }
}
```

### Development Environment Setup

#### **Local Development**
```bash
# Backend setup
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend setup
cd frontend
npm install
npm run dev

# Database setup
docker-compose up -d postgres
python init_db.py
python import_data.py
```

#### **Docker Development**
```bash
# Full stack development
docker-compose up --build

# Individual services
docker-compose up backend
docker-compose up frontend
docker-compose up postgres
```

---

*This plan ensures effective collaboration between development and data science teams while maintaining high code quality and project delivery standards for the InvaStop invasive species tracking application.*
