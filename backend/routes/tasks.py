"""
Task CRUD API Routes

This module implements RESTful API endpoints for task management:
- GET /api/{user_id}/tasks - List all tasks for authenticated user
- POST /api/{user_id}/tasks - Create a new task
- GET /api/{user_id}/tasks/{id} - Get a specific task
- PUT /api/{user_id}/tasks/{id} - Update a task
- DELETE /api/{user_id}/tasks/{id} - Delete a task
- PATCH /api/{user_id}/tasks/{id}/complete - Toggle task completion

All endpoints require JWT authentication and enforce user ownership isolation.

Security:
- JWT token required via Authorization: Bearer header
- URL user_id must match authenticated user_id from JWT (403 if mismatch)
- All queries filtered by authenticated user_id only
- Tasks accessible only by their owner
"""

from fastapi import APIRouter, Depends, HTTPException, Path, Query, status
from sqlmodel import Session, select, create_engine, or_, desc, asc, case
from datetime import datetime, timezone
from typing import List, Optional, Literal
import os
from dotenv import load_dotenv

from auth import get_current_user_id
from models import Task
from schemas import TaskCreate, TaskUpdate, TaskResponse

# Load environment variables
load_dotenv()

# Create engine for database connection (same as main.py)
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is required")

engine = create_engine(
    DATABASE_URL,
    echo=True,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10
)

# Database session dependency (to avoid circular import with main.py)
def get_session():
    """Dependency for getting database session."""
    with Session(engine) as session:
        yield session


# Initialize APIRouter with prefix and tags for OpenAPI documentation
router = APIRouter(
    prefix="/api",
    tags=["tasks"],
    responses={
        401: {"description": "Unauthorized - Missing or invalid JWT token"},
        403: {"description": "Forbidden - User ID mismatch or unauthorized access"},
        404: {"description": "Not Found - Task does not exist"},
    }
)



# ============================================================================
# Phase 3: User Story 1 - List Tasks (Priority: P1)
# ============================================================================

@router.get("/{user_id}/tasks", response_model=List[TaskResponse], status_code=status.HTTP_200_OK)
async def get_tasks(
    user_id: str = Path(..., description="User ID from URL path"),
    search: Optional[str] = Query(None, max_length=100, description="Search keyword for title/description"),
    status_filter: Optional[Literal["pending", "completed"]] = Query(None, alias="status", description="Filter by completion status"),
    priority: Optional[Literal["high", "medium", "low"]] = Query(None, description="Filter by priority level"),
    tags: Optional[str] = Query(None, max_length=200, description="Filter by tag name"),
    sort: Literal["date", "alpha", "priority"] = Query("date", description="Sort order"),
    authenticated_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """
    Get all tasks for the authenticated user with optional search, filtering, and sorting.

    **Feature 006**: Task Organization & Usability Enhancements
    - US1 (P1): Search by keyword in title/description
    - US3 (P2): Filter by status and priority
    - US4 (P2): Filter by tags
    - US5 (P3): Sort by date/alpha/priority

    **Security**:
    - Requires valid JWT token in Authorization: Bearer header
    - Verifies URL user_id matches authenticated user_id from JWT
    - Returns only tasks owned by authenticated user

    **Query Parameters** (all optional):
    - search: Keyword search (case-insensitive, partial matching)
    - status: Filter by "pending" or "completed"
    - priority: Filter by "high", "medium", or "low"
    - tags: Filter by tag name (single tag)
    - sort: Sort order "date" (newest first), "alpha" (A-Z), "priority" (high→low)

    **Returns**:
    - 200 OK: Array of tasks (filtered, searched, sorted)
    - 400 Bad Request: Invalid query parameter value
    - 401 Unauthorized: Missing or invalid JWT token
    - 403 Forbidden: URL user_id doesn't match authenticated user_id

    **Functional Requirements**:
    - FR-001 to FR-006: Base task retrieval (existing)
    - FR-008 to FR-014: Search functionality (US1)
    - FR-015 to FR-021: Filter functionality (US3, US4)
    - FR-022 to FR-025: Sorting functionality (US5)
    - FR-031 to FR-035: Backend API requirements
    """
    # Step 1: Verify URL user_id matches authenticated user
    if user_id != authenticated_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: URL user_id does not match authenticated user"
        )

    # Step 2: Base query - filter by authenticated user
    query = select(Task).where(Task.user_id == authenticated_user_id)

    # Step 3: Apply search filter (US1 - FR-009, FR-010, FR-014)
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Task.title.ilike(search_pattern),
                Task.description.ilike(search_pattern)
            )
        )

    # Step 4: Apply status filter (US3 - FR-015)
    if status_filter:
        query = query.filter(Task.completed == (status_filter == "completed"))

    # Step 5: Apply priority filter (US3 - FR-016)
    if priority:
        query = query.filter(Task.priority == priority)

    # Step 6: Apply tag filter (US4 - FR-017)
    if tags:
        # JSONB containment operator - check if tags array contains the specified tag
        from sqlalchemy.dialects.postgresql import JSONB
        import json
        query = query.filter(Task.tags.cast(JSONB).contains([tags]))

    # Step 7: Apply sorting (US5 - FR-022, FR-023, FR-024)
    if sort == "date":
        query = query.order_by(desc(Task.created_at))
    elif sort == "alpha":
        query = query.order_by(asc(Task.title))
    elif sort == "priority":
        # Sort by priority (high→medium→low), then by date
        priority_order = case(
            (Task.priority == "high", 1),
            (Task.priority == "medium", 2),
            (Task.priority == "low", 3),
        )
        query = query.order_by(priority_order, desc(Task.created_at))

    # Step 8: Execute query and return results
    tasks = session.exec(query).all()
    return tasks



# ============================================================================
# Phase 4: User Story 2 - Create Task (Priority: P1)
# ============================================================================

@router.post("/{user_id}/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreate,
    user_id: str = Path(..., description="User ID from URL path"),
    authenticated_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """
    Create a new task for the authenticated user.

    **Security**:
    - Requires valid JWT token in Authorization: Bearer header
    - Verifies URL user_id matches authenticated user_id from JWT
    - Task is automatically assigned to authenticated user (not URL user_id)

    **Request Body**:
    - title: Task title (required, 1-200 characters)
    - description: Optional task description (max 1000 characters)

    **Returns**:
    - 201 Created: Task created successfully with generated ID
    - 400 Bad Request: Invalid input (missing title, length violations)
    - 401 Unauthorized: Missing or invalid JWT token
    - 403 Forbidden: URL user_id doesn't match authenticated user_id
    - 422 Unprocessable Entity: Validation error details

    **Functional Requirements**:
    - FR-007: Creates new task with title and optional description
    - FR-008: Validates title is present and non-empty
    - FR-009: Validates title max length 200 characters
    - FR-010: Validates description max length 1000 characters if provided
    - FR-011: Assigns task to authenticated user_id (from JWT, not URL)
    - FR-012: Sets completed=false by default for new tasks
    - FR-013: Returns created task with 201 Created status
    """
    # Step 1: Verify URL user_id matches authenticated user (FR-035)
    if user_id != authenticated_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: URL user_id does not match authenticated user"
        )

    # Step 2: Create Task object with authenticated user_id (FR-011, NOT URL user_id)
    task = Task(
        user_id=authenticated_user_id,  # CRITICAL: Use JWT user_id, not URL param
        title=task_data.title,
        description=task_data.description,
        completed=False,  # FR-012: Default to false
        priority=task_data.priority,  # Feature 006: Priority field
        tags=task_data.tags,  # Feature 006: Tags field
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )

    # Step 3: Save task to database
    session.add(task)
    session.commit()
    session.refresh(task)  # Get generated ID and timestamps

    # FR-013: Return created task with 201 Created
    return task



# ============================================================================
# Phase 5: User Story 6 - Toggle Completion (Priority: P1)
# ============================================================================

@router.patch("/{user_id}/tasks/{task_id}/complete", response_model=TaskResponse, status_code=status.HTTP_200_OK)
async def toggle_task_completion(
    task_id: int = Path(..., description="Task ID to toggle"),
    user_id: str = Path(..., description="User ID from URL path"),
    authenticated_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """
    Toggle task completion status (true → false, false → true).

    **Security**:
    - Requires valid JWT token in Authorization: Bearer header
    - Verifies URL user_id matches authenticated user_id from JWT
    - Only allows toggling tasks owned by authenticated user

    **Returns**:
    - 200 OK: Task completion toggled successfully
    - 401 Unauthorized: Missing or invalid JWT token
    - 403 Forbidden: URL user_id mismatch or task belongs to different user
    - 404 Not Found: Task does not exist

    **Functional Requirements**:
    - FR-029: Toggles completed status (true→false, false→true)
    - FR-030: Updates updated_at timestamp
    - FR-031: Returns 200 OK with updated task object
    - FR-032: Returns 404 if task doesn't exist
    - FR-033: Returns 403 if task belongs to different user
    """
    # Step 1: Verify URL user_id matches authenticated user (FR-035)
    if user_id != authenticated_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: URL user_id does not match authenticated user"
        )

    # Step 2: Query task by id
    task = session.get(Task, task_id)

    # FR-032: Return 404 if task doesn't exist
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # FR-033: Verify task belongs to authenticated user
    if task.user_id != authenticated_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Task belongs to different user"
        )

    # FR-029: Toggle completed status
    task.completed = not task.completed

    # FR-030: Update updated_at timestamp
    task.updated_at = datetime.now(timezone.utc)

    # Step 3: Save changes
    session.add(task)
    session.commit()
    session.refresh(task)

    # FR-031: Return 200 OK with updated task
    return task



# ============================================================================
# Phase 6: User Story 3 - Get Single Task (Priority: P2)
# ============================================================================

@router.get("/{user_id}/tasks/{task_id}", response_model=TaskResponse, status_code=status.HTTP_200_OK)
async def get_task(
    task_id: int = Path(..., description="Task ID to retrieve"),
    user_id: str = Path(..., description="User ID from URL path"),
    authenticated_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """
    Get a specific task by ID.

    **Security**:
    - Requires valid JWT token in Authorization: Bearer header
    - Verifies URL user_id matches authenticated user_id from JWT
    - Only returns task if it belongs to authenticated user

    **Returns**:
    - 200 OK: Task details
    - 401 Unauthorized: Missing or invalid JWT token
    - 403 Forbidden: URL user_id mismatch or task belongs to different user
    - 404 Not Found: Task does not exist

    **Functional Requirements**:
    - FR-014: Returns task details if task exists and belongs to authenticated user
    - FR-015: Returns 404 Not Found if task doesn't exist
    - FR-016: Returns 403 Forbidden if task exists but belongs to different user
    - FR-017: Returns 200 OK with task object on success
    """
    # Step 1: Verify URL user_id matches authenticated user (FR-035)
    if user_id != authenticated_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: URL user_id does not match authenticated user"
        )

    # Step 2: Query task by id
    task = session.get(Task, task_id)

    # FR-015: Return 404 if task doesn't exist
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # FR-016: Verify task belongs to authenticated user
    if task.user_id != authenticated_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Task belongs to different user"
        )

    # FR-017: Return 200 OK with task object
    return task



# ============================================================================
# Phase 7: User Story 4 - Update Task (Priority: P2)
# ============================================================================

@router.put("/{user_id}/tasks/{task_id}", response_model=TaskResponse, status_code=status.HTTP_200_OK)
async def update_task(
    task_data: TaskUpdate,
    task_id: int = Path(..., description="Task ID to update"),
    user_id: str = Path(..., description="User ID from URL path"),
    authenticated_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """
    Update a task's title, description, or completion status.

    Supports partial updates - only provided fields are updated.

    **Security**:
    - Requires valid JWT token in Authorization: Bearer header
    - Verifies URL user_id matches authenticated user_id from JWT
    - Only allows updating tasks owned by authenticated user

    **Request Body** (all fields optional):
    - title: Updated task title (1-200 characters if provided)
    - description: Updated task description (max 1000 characters if provided)
    - completed: Updated completion status

    **Returns**:
    - 200 OK: Task updated successfully
    - 400 Bad Request: Invalid input (title too long, description too long)
    - 401 Unauthorized: Missing or invalid JWT token
    - 403 Forbidden: URL user_id mismatch or task belongs to different user
    - 404 Not Found: Task does not exist

    **Functional Requirements**:
    - FR-018: Allows updating title, description, and/or completed status
    - FR-019: Supports partial updates (only provided fields are changed)
    - FR-020: Validates title and description length constraints
    - FR-021: Updates updated_at timestamp to current time
    - FR-022: Returns 404 if task doesn't exist
    - FR-023: Returns 403 if task belongs to different user
    - FR-024: Returns 200 OK with updated task object on success
    """
    # Step 1: Verify URL user_id matches authenticated user (FR-035)
    if user_id != authenticated_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: URL user_id does not match authenticated user"
        )

    # Step 2: Query task by id
    task = session.get(Task, task_id)

    # FR-022: Return 404 if task doesn't exist
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # FR-023: Verify task belongs to authenticated user
    if task.user_id != authenticated_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Task belongs to different user"
        )

    # FR-019: Update only provided fields (partial update)
    update_data = task_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)

    # FR-021: Update updated_at timestamp
    task.updated_at = datetime.now(timezone.utc)

    # Step 3: Save changes
    session.add(task)
    session.commit()
    session.refresh(task)

    # FR-024: Return 200 OK with updated task
    return task



# ============================================================================
# Phase 8: User Story 5 - Delete Task (Priority: P2)
# ============================================================================

@router.delete("/{user_id}/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: int = Path(..., description="Task ID to delete"),
    user_id: str = Path(..., description="User ID from URL path"),
    authenticated_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """
    Delete a task permanently.

    **Security**:
    - Requires valid JWT token in Authorization: Bearer header
    - Verifies URL user_id matches authenticated user_id from JWT
    - Only allows deleting tasks owned by authenticated user

    **Returns**:
    - 204 No Content: Task deleted successfully (empty response body)
    - 401 Unauthorized: Missing or invalid JWT token
    - 403 Forbidden: URL user_id mismatch or task belongs to different user
    - 404 Not Found: Task does not exist

    **Functional Requirements**:
    - FR-025: Permanently deletes task if it exists and belongs to authenticated user
    - FR-026: Returns 204 No Content on successful deletion
    - FR-027: Returns 404 if task doesn't exist
    - FR-028: Returns 403 if task belongs to different user
    """
    # Step 1: Verify URL user_id matches authenticated user (FR-035)
    if user_id != authenticated_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: URL user_id does not match authenticated user"
        )

    # Step 2: Query task by id
    task = session.get(Task, task_id)

    # FR-027: Return 404 if task doesn't exist
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # FR-028: Verify task belongs to authenticated user
    if task.user_id != authenticated_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Task belongs to different user"
        )

    # FR-025: Permanently delete task
    session.delete(task)
    session.commit()

    # FR-026: Return 204 No Content (FastAPI handles empty response with 204)
    return None
