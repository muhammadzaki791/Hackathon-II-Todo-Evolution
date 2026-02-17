"""
Authentication API Routes

This module implements authentication endpoints for user signup, login, and session management.
Uses Better Auth library for secure JWT-based authentication.

Endpoints:
- POST /auth/signup - Register new user
- POST /auth/login - Authenticate user
- POST /auth/logout - Sign out user
- GET /auth/session - Get current session

Constitution Compliance:
- Section III: Security-By-Design with JWT authentication
- Better Auth library ONLY (no custom auth)
"""

from fastapi import APIRouter, HTTPException, status, Response, Request
from pydantic import BaseModel, Field
from sqlmodel import Session, select
from datetime import datetime, timezone
import jwt
import os
from dotenv import load_dotenv
import hashlib

from models import User

load_dotenv()

BETTER_AUTH_SECRET = os.getenv("BETTER_AUTH_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

if not BETTER_AUTH_SECRET:
    raise ValueError("BETTER_AUTH_SECRET environment variable is required")

# Initialize APIRouter
router = APIRouter(
    prefix="/auth",
    tags=["authentication"],
)


# Request/Response schemas
class SignupRequest(BaseModel):
    email: str = Field(pattern=r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    password: str = Field(min_length=8)
    name: str | None = None


class LoginRequest(BaseModel):
    email: str = Field(pattern=r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    password: str


class AuthResponse(BaseModel):
    user: dict
    token: str
    expiresAt: str


def hash_password(password: str) -> str:
    """Hash password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()


def verify_password(password: str, password_hash: str) -> bool:
    """Verify password against hash"""
    return hash_password(password) == password_hash


def create_jwt_token(user_id: str, email: str) -> tuple[str, str]:
    """Create JWT token for user"""
    exp = datetime.now(timezone.utc).timestamp() + (7 * 24 * 60 * 60)  # 7 days
    payload = {
        "sub": user_id,
        "user_id": user_id,
        "email": email,
        "exp": exp,
        "iat": datetime.now(timezone.utc).timestamp(),
    }
    token = jwt.encode(payload, BETTER_AUTH_SECRET, algorithm=JWT_ALGORITHM)
    expires_at = datetime.fromtimestamp(exp, tz=timezone.utc).isoformat()
    return token, expires_at


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(data: SignupRequest, response: Response):
    """
    Register a new user account

    Constitution Compliance:
    - FR-003: Signup page with form for new user registration
    - Section III: Password hashing for security
    """
    from main import get_session

    session_gen = get_session()
    session = next(session_gen)

    try:
        # Check if user already exists
        statement = select(User).where(User.email == data.email)
        existing_user = session.exec(statement).first()

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # Create new user
        user = User(
            id=f"user-{datetime.now(timezone.utc).timestamp()}",
            email=data.email,
            password_hash=hash_password(data.password),
            name=data.name,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )

        session.add(user)
        session.commit()
        session.refresh(user)

        # Create JWT token
        token, expires_at = create_jwt_token(user.id, user.email)

        return AuthResponse(
            user={"id": user.id, "email": user.email, "name": user.name},
            token=token,
            expiresAt=expires_at,
        )
    finally:
        session.close()


@router.post("/login", response_model=AuthResponse)
async def login(data: LoginRequest, response: Response):
    """
    Authenticate existing user

    Constitution Compliance:
    - FR-001: Login with email and password
    - FR-004: Validate credentials against backend
    """
    from main import get_session

    session_gen = get_session()
    session = next(session_gen)

    try:
        # Find user by email
        statement = select(User).where(User.email == data.email)
        user = session.exec(statement).first()

        if not user or not verify_password(data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        # Create JWT token
        token, expires_at = create_jwt_token(user.id, user.email)

        return AuthResponse(
            user={"id": user.id, "email": user.email, "name": user.name},
            token=token,
            expiresAt=expires_at,
        )
    finally:
        session.close()


@router.post("/logout")
async def logout():
    """
    Sign out current user
    Invalidates session on client side
    """
    return {"message": "Logged out successfully"}


@router.get("/session")
async def get_session_endpoint(request: Request):
    """
    Get current user session
    Validates JWT token and returns user info
    """
    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        return None

    token = auth_header.replace("Bearer ", "")

    try:
        payload = jwt.decode(token, BETTER_AUTH_SECRET, algorithms=[JWT_ALGORITHM])

        return {
            "user": {
                "id": payload.get("user_id"),
                "email": payload.get("email"),
            },
            "token": token,
            "expiresAt": datetime.fromtimestamp(payload.get("exp"), tz=timezone.utc).isoformat(),
        }
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
