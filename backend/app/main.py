from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from contextlib import asynccontextmanager
import uvicorn

from .config import settings
from .database import init_database
from .routes import auth, patients, diseases, fhir, version


# Initialize database on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Initializing AYUSH EHR API...")
    init_database()
    print("✅ Database initialized successfully!")
    yield
    # Shutdown
    print("👋 Shutting down AYUSH EHR API...")


# Create FastAPI app with auto-generated docs
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=settings.description,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
    contact={
        "name": "AYUSH EMR Team",
        "email": "support@ayush-emr.gov.in",
    },
    license_info={
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT",
    },
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(patients.router, prefix="/api")
app.include_router(diseases.router, prefix="/api")
app.include_router(fhir.router, prefix="/api")
app.include_router(version.router, prefix="/api")


@app.get("/", include_in_schema=False)
async def root():
    """Redirect root to API documentation"""
    return RedirectResponse(url="/docs")


@app.get("/api/health")
async def health_check():
    """API health check endpoint"""
    return {
        "status": "healthy",
        "service": settings.app_name,
        "version": settings.app_version,
        "message": "AYUSH EHR API is running successfully! 🌿"
    }


@app.get("/api/info")
async def api_info():
    """Get API information and available endpoints"""
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "description": settings.description,
        "features": [
            "🔐 ABHA ID Authentication with OTP",
            "👤 Patient Profile Management",
            "🏥 WHO Disease Code Integration",
            "📊 AYUSH, Siddha, Unani & ICD-11 Support",
            "🔍 Advanced Disease Search",
            "📱 Mobile-Friendly API",
            "📖 Auto-Generated API Documentation"
        ],
        "endpoints": {
            "authentication": "/api/auth/*",
            "patients": "/api/patients/*",
            "diseases": "/api/diseases/*",
            "documentation": "/docs",
            "alternative_docs": "/redoc"
        },
        "mock_data": {
            "abha_ids": [
                "91-1234-5678-9012",
                "91-9876-5432-1098",
                "91-1111-2222-3333"
            ],
            "test_otp": "Any 6-digit number (e.g., 123456)"
        }
    }


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="127.0.0.1",  # Localhost
        port=500,          # Predefined port
        reload=True,
        log_level="info"
    )
