"""
FastAPI Application Entry Point
Phase II: Todo Full-Stack Web Application

Constitution v1.1.0 Compliance:
- Section I: Spec-first development
- Section II: Strict architectural boundaries
- Section III: Security-by-design with JWT authentication
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, create_engine, Session
import os
from dotenv import load_dotenv

from models import User, Task
from routes import tasks, auth

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is required")

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# Create database engine with connection pooling for Neon Serverless PostgreSQL
engine = create_engine(
    DATABASE_URL,
    echo=True,  # Set to False in production
    pool_pre_ping=True,  # Verify connections (important for serverless)
    pool_size=5,
    max_overflow=10
)


def create_db_and_tables():
    """
    Create database tables on startup.

    Constitution Compliance:
    - SQLModel ORM only (no raw SQL)
    - User model with user_id for isolation
    """
    SQLModel.metadata.create_all(engine)


def get_session():
    """
    Dependency for getting database session.

    Yields:
        Session: SQLModel database session

    Constitution Compliance:
    - Dependency injection pattern for database access
    """
    with Session(engine) as session:
        yield session


# Initialize FastAPI application
app = FastAPI(
    title="Todo API",
    description="Multi-user task management API with JWT authentication",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration for Next.js frontend
# Constitution Section III: Explicit origin allowlist (no wildcard in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        FRONTEND_URL,
        "http://localhost:3000",  # Next.js dev server
        "http://localhost:3001",  # Next.js dev server (alternate port)
    ],
    allow_credentials=True,  # Required for JWT cookies
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    """
    Initialize database tables on application startup.

    Constitution Compliance:
    - FR-012 (tasks spec): Database initialization
    - SQLModel.metadata.create_all (no raw SQL)
    """
    print("Creating database tables...")
    create_db_and_tables()
    print("Database tables created successfully")


# Register Authentication routes
# Feature 002: Authentication
app.include_router(auth.router)

# Register Task CRUD API routes
# Feature 004: Task CRUD REST API
app.include_router(tasks.router)


@app.get("/")
async def root():
    """
    API root endpoint.

    Returns:
        dict: API information and documentation links
    """
    return {
        "message": "Todo API - Phase II",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc",
        "authentication": "JWT Bearer tokens required for protected endpoints"
    }


@app.get("/health")
async def health_check():
    """
    Health check endpoint (public - no authentication required).

    Returns:
        dict: Service health status
    """
    return {
        "status": "healthy",
        "service": "todo-api",
        "version": "1.0.0"
    }


# Import and register route modules here
# Example:
# from routes import tasks
# app.include_router(tasks.router)
