"""
Main FastAPI application
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging
import os

from .core.config import settings
from .core.database import Database, get_users_collection
from .core.security import get_password_hash
from .api.routes import auth, reports

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    # Startup
    logger.info("Starting Road Accident Detection System...")
    
    # Connect to database
    await Database.connect_db()
    
    # Create admin user if not exists
    await create_admin_user()
    
    # Create upload directory
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    
    logger.info("Application started successfully!")
    
    yield
    
    # Shutdown
    logger.info("Shutting down application...")
    await Database.close_db()
    logger.info("Application shut down complete")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-powered Road Accident Detection System with Admin Panel",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix=settings.API_V1_PREFIX)
app.include_router(reports.router, prefix=settings.API_V1_PREFIX)

# Mount static files (uploads)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Road Accident Detection System API",
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Check database connection
        await Database.get_database().command('ping')
        db_status = "connected"
    except Exception as e:
        db_status = f"disconnected: {str(e)}"
    
    return {
        "status": "healthy",
        "database": db_status,
        "version": settings.APP_VERSION
    }


async def create_admin_user():
    """Create default admin user if not exists"""
    try:
        users_collection = await get_users_collection()
        
        # Check if admin exists
        admin = await users_collection.find_one({"email": settings.ADMIN_EMAIL})
        
        if not admin:
            admin_data = {
                "email": settings.ADMIN_EMAIL,
                "full_name": "System Administrator",
                "hashed_password": get_password_hash(settings.ADMIN_PASSWORD),
                "is_active": True,
                "is_admin": True,
                "phone": None
            }
            
            await users_collection.insert_one(admin_data)
            logger.info(f"Admin user created: {settings.ADMIN_EMAIL}")
            logger.warning(f"Default admin password: {settings.ADMIN_PASSWORD}")
            logger.warning("Please change the admin password in production!")
        else:
            logger.info("Admin user already exists")
    
    except Exception as e:
        logger.error(f"Error creating admin user: {e}")


# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Handle HTTP exceptions"""
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handle general exceptions"""
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
