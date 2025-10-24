"""
M&A Intelligence Platform - Backend API
FastAPI application with authentication, database, and business logic
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import os

# Initialize FastAPI app
app = FastAPI(
    title="M&A Intelligence Platform API",
    description="Backend API for M&A SaaS Platform",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# CORS configuration
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,https://apexdeliver.com,https://100daysandbeyond.com").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    """
    Health check endpoint for monitoring and load balancers
    """
    return {
        "status": "healthy",
        "service": "ma-saas-backend",
        "version": "2.0.0",
        "timestamp": datetime.utcnow().isoformat(),
        "environment": os.getenv("ENVIRONMENT", "production"),
    }

# Root endpoint
@app.get("/")
async def root():
    """
    Root endpoint with API information
    """
    return {
        "message": "M&A Intelligence Platform API",
        "version": "2.0.0",
        "docs": "/api/docs",
        "health": "/health",
    }

# API v1 router placeholder
@app.get("/api/v1/status")
async def api_status():
    """
    API status endpoint
    """
    return {
        "api_version": "v1",
        "status": "operational",
        "timestamp": datetime.utcnow().isoformat(),
    }

# Startup event
@app.on_event("startup")
async def startup_event():
    """
    Application startup tasks
    """
    print("🚀 M&A Intelligence Platform API starting...")
    print(f"📝 Environment: {os.getenv('ENVIRONMENT', 'production')}")
    print(f"🔗 CORS Origins: {CORS_ORIGINS}")
    print("✅ Backend ready!")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """
    Application shutdown tasks
    """
    print("👋 M&A Intelligence Platform API shutting down...")

