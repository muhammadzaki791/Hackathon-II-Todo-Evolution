"""
JWT Authentication and Verification
Phase II: Authentication and User Identity

Implements JWT token verification for FastAPI backend.
Constitution v1.1.0 Section III: Security-By-Design compliance.
"""

import jwt
import os
from fastapi import HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from typing import Dict
from dotenv import load_dotenv

load_dotenv()

BETTER_AUTH_SECRET = os.getenv("BETTER_AUTH_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

if not BETTER_AUTH_SECRET:
    raise ValueError("BETTER_AUTH_SECRET environment variable is required")

# HTTP Bearer token security scheme
security = HTTPBearer()


def verify_jwt_token(
    credentials: HTTPAuthorizationCredentials = Security(security)
) -> Dict:
    """
    Verify JWT token and extract payload.

    Verifies:
    - Token signature using BETTER_AUTH_SECRET
    - Token expiration

    Args:
        credentials: HTTP Bearer token from Authorization header

    Returns:
        dict: Decoded token payload containing user_id, email, exp, iat

    Raises:
        HTTPException: 401 if token is invalid, expired, or missing

    Constitution Compliance:
    - FR-009: Verifies JWT signature on EVERY API request
    - FR-012: Returns 401 for expired tokens
    - FR-011: Returns 401 for invalid tokens
    """
    token = credentials.credentials

    try:
        # Decode and verify JWT token
        payload = jwt.decode(
            token,
            BETTER_AUTH_SECRET,
            algorithms=[JWT_ALGORITHM]
        )
        return payload
    except jwt.ExpiredSignatureError:
        # FR-012: Return 401 for expired tokens with specific message
        raise HTTPException(
            status_code=401,
            detail="Token has expired"
        )
    except jwt.InvalidTokenError:
        # FR-011: Return 401 for invalid tokens
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )
    except Exception as e:
        # Catch-all for other JWT errors
        raise HTTPException(
            status_code=401,
            detail="Authentication failed"
        )


def get_current_user_id(
    token_payload: Dict = Security(verify_jwt_token)
) -> str:
    """
    Extract user_id from verified JWT token payload.

    Args:
        token_payload: Decoded JWT payload from verify_jwt_token

    Returns:
        str: User ID for data isolation

    Raises:
        HTTPException: 401 if user_id not found in token payload

    Constitution Compliance:
    - FR-010: Extracts user_id from verified JWT token
    - Section III: User identity derived ONLY from JWT token
    """
    # Check both 'sub' (JWT standard) and 'user_id' (Better Auth)
    user_id = token_payload.get("sub") or token_payload.get("user_id")

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="User ID not found in token"
        )

    return user_id


def verify_user_id_match(url_user_id: str, authenticated_user_id: str) -> None:
    """
    Verify that URL user_id parameter matches authenticated user from JWT token.

    This enforces user isolation at the API level by ensuring users cannot
    access resources belonging to other users by modifying the URL.

    Args:
        url_user_id: User ID from URL path parameter
        authenticated_user_id: User ID extracted from JWT token

    Raises:
        HTTPException: 403 if user IDs don't match

    Constitution Compliance:
    - Section III: URL user_id parameter MUST be verified against JWT token user
    - FR-010: User isolation enforcement
    """
    if url_user_id != authenticated_user_id:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )
