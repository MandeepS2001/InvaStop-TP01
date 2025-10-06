from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import auth, species, reports, analytics, epic1, quiz, impact, ai
from app.core.config import settings

app = FastAPI(
    title="InvaStop API",
    description="Invasive Species Tracker API for Climate Action",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(species.router, prefix="/api/v1/species", tags=["Species"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["Reports"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["Analytics"])
app.include_router(epic1.router, prefix="/api/v1/epic1", tags=["Epic 1.0"])
app.include_router(quiz.router, prefix="/api/v1/quiz", tags=["Quiz"])
app.include_router(impact.router, prefix="/api/v1/impact", tags=["Impact"])
app.include_router(ai.router, prefix="/api/v1", tags=["AI"])

@app.get("/")
async def root():
    return {
        "message": "Welcome to InvaStop API",
        "description": "Invasive Species Tracker for Climate Action",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "InvaStop API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
