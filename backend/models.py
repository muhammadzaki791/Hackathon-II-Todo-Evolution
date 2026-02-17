"""
Database Models
Phase II: Todo Full-Stack Web Application

SQLModel models for database tables.
Constitution v1.1.0: SQLModel ORM only (no raw SQL).

Feature 006: Task Organization & Usability Enhancements
- Added priority field (high/medium/low, default="medium")
- Added tags field (JSON array, default=[])
"""

from sqlmodel import Field, SQLModel, Column
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime
from typing import Optional, List


class User(SQLModel, table=True):
    """
    User model for authentication.

    Managed by Better Auth library on the frontend.
    This model mirrors Better Auth's user table structure for reference.

    Constitution Compliance:
    - Section III: User entity with unique email constraint
    - FR-001 to FR-006: Supports signup and signin requirements
    """
    __tablename__ = "users"

    id: Optional[str] = Field(default=None, primary_key=True)  # UUID from Better Auth
    email: str = Field(unique=True, nullable=False, index=True)
    password_hash: str = Field(nullable=False)  # Hashed by Better Auth (FR-017)
    name: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "email": "user@example.com",
                "name": "John Doe",
                "created_at": "2026-02-06T12:00:00Z",
                "updated_at": "2026-02-06T12:00:00Z"
            }
        }


class Task(SQLModel, table=True):
    """
    Task model with user ownership.

    Constitution Compliance:
    - Section III: Every table with user data MUST have user_id field
    - User isolation: All queries filtered by user_id

    Feature 006: Task Organization & Usability Enhancements
    - priority: Task priority level (high, medium, low) - default "medium"
    - tags: Array of tag strings for categorization - default []
    """
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True, nullable=False, foreign_key="users.id")
    title: str = Field(max_length=200, nullable=False)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    priority: str = Field(
        default="medium",
        max_length=10,
        sa_column_kwargs={"server_default": "medium"}
    )
    tags: List[str] = Field(
        default_factory=list,
        sa_column=Column(JSONB, server_default="[]")
    )
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Complete project documentation",
                "description": "Write comprehensive API documentation",
                "completed": False,
                "priority": "high",
                "tags": ["work", "documentation"]
            }
        }
