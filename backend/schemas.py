"""
Pydantic schemas for Task CRUD API request/response validation.

This module defines the data transfer objects (DTOs) used for API endpoints:
- TaskCreate: Request body for creating new tasks
- TaskUpdate: Request body for updating existing tasks (partial updates supported)
- TaskResponse: Response body for all task operations

All schemas use Pydantic v2 for validation and are compatible with SQLModel ORM models.

Feature 006: Task Organization & Usability Enhancements
- Added priority and tags fields to all schemas
- Added TaskQueryParams for search/filter/sort query parameters
"""

from pydantic import BaseModel, Field, ConfigDict, field_validator
from datetime import datetime
from typing import List, Optional, Literal


class TaskCreate(BaseModel):
    """
    Request schema for creating a new task.

    Attributes:
        title: Task title (required, 1-200 characters)
        description: Optional task description (max 1000 characters)
        priority: Task priority level (high/medium/low, default="medium")
        tags: Array of tag strings (optional, default=[])

    Notes:
        - completed field is not included (defaults to False in backend)
        - user_id is not included (automatically set from JWT token)
        - Timestamps (created_at, updated_at) are automatically generated
    """
    title: str = Field(
        ...,
        min_length=1,
        max_length=200,
        description="Task title (required)",
        examples=["Buy groceries", "Finish project report"]
    )
    description: str | None = Field(
        None,
        max_length=1000,
        description="Optional task description",
        examples=["Milk, bread, eggs", None]
    )
    priority: str = Field(
        default="medium",
        pattern="^(high|medium|low)$",
        description="Task priority level",
        examples=["high", "medium", "low"]
    )
    tags: List[str] = Field(
        default_factory=list,
        max_length=20,
        description="Array of tag strings for categorization",
        examples=[["work", "urgent"], ["personal"], []]
    )

    @field_validator('tags')
    @classmethod
    def validate_tags(cls, v: List[str]) -> List[str]:
        """Validate each tag is 1-50 characters."""
        for tag in v:
            if not tag or len(tag) > 50:
                raise ValueError('Each tag must be 1-50 characters')
        return v


class TaskUpdate(BaseModel):
    """
    Request schema for updating an existing task.

    All fields are optional to support partial updates.
    Only provided fields will be updated; others remain unchanged.

    Attributes:
        title: Updated task title (1-200 characters if provided)
        description: Updated task description (max 1000 characters if provided)
        completed: Updated completion status
        priority: Updated priority level (high/medium/low if provided)
        tags: Updated tags array (replaces existing tags if provided)

    Notes:
        - updated_at timestamp is automatically updated by backend
        - user_id cannot be changed (enforced by backend)
    """
    title: str | None = Field(
        None,
        min_length=1,
        max_length=200,
        description="Updated task title",
        examples=["Buy groceries (updated)"]
    )
    description: str | None = Field(
        None,
        max_length=1000,
        description="Updated task description",
        examples=["Milk, bread, eggs, cheese"]
    )
    completed: bool | None = Field(
        None,
        description="Updated completion status",
        examples=[True, False]
    )
    priority: str | None = Field(
        None,
        pattern="^(high|medium|low)$",
        description="Updated priority level",
        examples=["high", "medium", "low"]
    )
    tags: List[str] | None = Field(
        None,
        max_length=20,
        description="Updated tags array (replaces existing tags)",
        examples=[["work", "urgent"], ["personal"], []]
    )

    @field_validator('tags')
    @classmethod
    def validate_tags(cls, v: List[str] | None) -> List[str] | None:
        """Validate each tag is 1-50 characters."""
        if v is not None:
            for tag in v:
                if not tag or len(tag) > 50:
                    raise ValueError('Each tag must be 1-50 characters')
        return v


class TaskResponse(BaseModel):
    """
    Response schema for task operations.

    Returned by all task endpoints (GET, POST, PUT, PATCH).
    Includes all task fields from the database model.

    Attributes:
        id: Unique task identifier (auto-generated)
        user_id: ID of the user who owns this task
        title: Task title
        description: Optional task description
        completed: Completion status (True if complete, False if incomplete)
        priority: Task priority level (high, medium, low)
        tags: Array of tag strings for categorization
        created_at: Timestamp when task was created (UTC)
        updated_at: Timestamp when task was last updated (UTC)
    """
    model_config = ConfigDict(from_attributes=True)  # Enable ORM mode for SQLModel compatibility

    id: int = Field(description="Unique task identifier", examples=[1, 42])
    user_id: str = Field(description="ID of the user who owns this task", examples=["user-123", "auth0|abc"])
    title: str = Field(description="Task title", examples=["Buy groceries"])
    description: str | None = Field(description="Optional task description", examples=["Milk, bread, eggs", None])
    completed: bool = Field(description="Completion status", examples=[False, True])
    priority: str = Field(description="Task priority level", examples=["high", "medium", "low"])
    tags: List[str] = Field(description="Array of tag strings", examples=[["work", "urgent"], []])
    created_at: datetime = Field(description="Timestamp when task was created (UTC)", examples=["2026-02-07T10:00:00Z"])
    updated_at: datetime = Field(description="Timestamp when task was last updated (UTC)", examples=["2026-02-07T10:15:00Z"])


class TaskQueryParams(BaseModel):
    """
    Query parameters for filtering, searching, and sorting tasks.

    Used by GET /api/{user_id}/tasks endpoint.
    All parameters are optional - omitting a parameter means no filtering for that dimension.

    Attributes:
        search: Keyword to search in title/description (case-insensitive, partial matching)
        status: Filter by completion status (pending or completed)
        priority: Filter by priority level (high, medium, or low)
        tags: Filter by tag name (single tag for MVP)
        sort: Sort order (date=newest first, alpha=A-Z, priority=high→low)
    """
    search: Optional[str] = Field(
        None,
        max_length=100,
        description="Search keyword for title/description",
        examples=["meeting", "groceries"]
    )
    status: Optional[Literal["pending", "completed"]] = Field(
        None,
        description="Filter by completion status",
        examples=["pending", "completed"]
    )
    priority: Optional[Literal["high", "medium", "low"]] = Field(
        None,
        description="Filter by priority level",
        examples=["high", "medium", "low"]
    )
    tags: Optional[str] = Field(
        None,
        max_length=200,
        description="Filter by tag name (single tag)",
        examples=["work", "urgent", "personal"]
    )
    sort: Literal["date", "alpha", "priority"] = Field(
        default="date",
        description="Sort order (date=newest first, alpha=A-Z, priority=high→low)",
        examples=["date", "alpha", "priority"]
    )
