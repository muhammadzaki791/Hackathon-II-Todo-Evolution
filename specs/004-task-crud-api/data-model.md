# Data Model - Task CRUD API

## Overview

This feature uses existing database models from Feature 003. No schema changes required.

## Entities

### Task

**Table**: `task`
**Description**: Represents a todo item belonging to a user

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `int` | PRIMARY KEY, AUTO INCREMENT | Unique task identifier |
| `user_id` | `str` | FOREIGN KEY → user.id, NOT NULL, INDEXED | Owner of the task |
| `title` | `str` | NOT NULL, MAX LENGTH 200 | Task title (required) |
| `description` | `str` | NULL, MAX LENGTH 1000 | Optional task description |
| `completed` | `bool` | NOT NULL, DEFAULT false | Completion status |
| `created_at` | `datetime` | NOT NULL, DEFAULT UTC NOW | Timestamp when task was created |
| `updated_at` | `datetime` | NOT NULL, DEFAULT UTC NOW | Timestamp when task was last updated |

**Relationships**:
- `user_id` → `user.id`: Many-to-one relationship (many tasks belong to one user)

**Indexes**:
- Primary key on `id`
- Foreign key index on `user_id` (for efficient user-scoped queries)

**SQLModel Definition** (existing from Feature 003):

```python
from sqlmodel import SQLModel, Field
from datetime import datetime, timezone

class Task(SQLModel, table=True):
    """Task model representing a user's todo item."""

    id: int | None = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="user.id", index=True)
    title: str = Field(max_length=200)
    description: str | None = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
```

### User

**Table**: `user`
**Description**: Represents an authenticated user (from Feature 002)

**Note**: This feature does NOT modify the User table, but references it via `task.user_id` foreign key.

## Validation Rules

### Task Creation
- `title`: REQUIRED, non-empty, max 200 characters
- `description`: OPTIONAL, max 1000 characters
- `completed`: Defaults to `false`, not settable during creation (must use update/toggle)
- `user_id`: Set automatically from authenticated JWT token (not from request body)
- `created_at`, `updated_at`: Set automatically to current UTC time

### Task Update
- `title`: OPTIONAL, if provided must be non-empty and max 200 characters
- `description`: OPTIONAL, if provided must be max 1000 characters
- `completed`: OPTIONAL, can be set to `true` or `false`
- `updated_at`: MUST be updated to current UTC time on any change

### Task Toggle Completion
- Flips `completed` from `true` → `false` or `false` → `true`
- `updated_at`: MUST be updated to current UTC time

## State Transitions

```
[New Task]
   ↓ (Create: POST /api/{user_id}/tasks)
[Task: completed=false]
   ↓ (Toggle: PATCH /api/{user_id}/tasks/{id}/complete)
[Task: completed=true]
   ↓ (Toggle: PATCH /api/{user_id}/tasks/{id}/complete)
[Task: completed=false]
   ↓ (Update: PUT /api/{user_id}/tasks/{id} with completed=true)
[Task: completed=true]
   ↓ (Delete: DELETE /api/{user_id}/tasks/{id})
[Deleted]
```

## User Isolation

**CRITICAL**: All database queries MUST filter by authenticated `user_id`.

**Pattern**:
```python
# ✅ CORRECT: Filter by authenticated user
statement = select(Task).where(Task.user_id == authenticated_user_id)

# ❌ WRONG: No user filter (exposes all users' tasks)
statement = select(Task)  # FORBIDDEN
```

**Enforcement**:
1. Extract `authenticated_user_id` from JWT token via `Depends(get_current_user_id)`
2. Verify URL `user_id` matches `authenticated_user_id` (403 Forbidden if mismatch)
3. Use `authenticated_user_id` (NOT URL `user_id`) in WHERE clauses
4. For specific task queries, verify `task.user_id == authenticated_user_id` after fetch

## Database Access Patterns

### List Tasks
```python
statement = select(Task).where(Task.user_id == authenticated_user_id)
tasks = session.exec(statement).all()
```

### Get Single Task
```python
statement = select(Task).where(
    Task.id == task_id,
    Task.user_id == authenticated_user_id
)
task = session.exec(statement).first()
if not task:
    raise HTTPException(status_code=404, detail="Task not found")
```

### Create Task
```python
task = Task(
    user_id=authenticated_user_id,  # From JWT, NOT request body
    title=task_create.title,
    description=task_create.description,
    completed=False,
    created_at=datetime.now(timezone.utc),
    updated_at=datetime.now(timezone.utc)
)
session.add(task)
session.commit()
session.refresh(task)
```

### Update Task
```python
# Fetch and verify ownership first
task = session.get(Task, task_id)
if not task or task.user_id != authenticated_user_id:
    raise HTTPException(status_code=404, detail="Task not found")

# Update fields
if task_update.title is not None:
    task.title = task_update.title
if task_update.description is not None:
    task.description = task_update.description
if task_update.completed is not None:
    task.completed = task_update.completed
task.updated_at = datetime.now(timezone.utc)

session.add(task)
session.commit()
session.refresh(task)
```

### Delete Task
```python
task = session.get(Task, task_id)
if not task or task.user_id != authenticated_user_id:
    raise HTTPException(status_code=404, detail="Task not found")

session.delete(task)
session.commit()
```

## No Schema Changes Required

This feature uses the existing `Task` model from Feature 003. No migrations or schema modifications are needed.

**Verification**:
- ✅ `Task` model already exists in `backend/models.py`
- ✅ `user_id` foreign key already defined
- ✅ All required fields present (`title`, `description`, `completed`, timestamps)
- ✅ Appropriate indexes already exist
- ✅ Database table already created via `create_all()`
