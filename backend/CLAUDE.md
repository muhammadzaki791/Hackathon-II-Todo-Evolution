# Backend Development Guidelines - Todo Full-Stack Web App

## Technology Stack
- **Framework**: Python FastAPI
- **ORM**: SQLModel (combines SQLAlchemy + Pydantic)
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: JWT verification (tokens issued by Better Auth frontend)
- **Validation**: Pydantic models

## Project Structure
```
backend/
├── main.py                       # FastAPI application entry point
├── models.py                     # SQLModel database models
├── schemas.py                    # Pydantic request/response schemas
├── db.py                         # Database connection and session management
├── auth.py                       # JWT verification middleware
├── routes/                       # API route handlers
│   ├── __init__.py
│   ├── tasks.py                  # Task CRUD endpoints
│   └── health.py                 # Health check endpoint
├── middleware/                   # Custom middleware
│   ├── __init__.py
│   └── auth_middleware.py        # JWT authentication middleware
├── utils/                        # Helper utilities
│   ├── __init__.py
│   └── security.py               # Security utilities
├── tests/                        # Test suite
│   ├── __init__.py
│   ├── test_tasks.py
│   └── test_auth.py
├── alembic/                      # Database migrations (optional)
├── requirements.txt              # Python dependencies
├── .env                          # Environment variables
└── README.md
```

## Core Dependencies
```txt
fastapi>=0.110.0
uvicorn[standard]>=0.27.0
sqlmodel>=0.0.14
psycopg2-binary>=2.9.9
pyjwt>=2.8.0
python-dotenv>=1.0.0
pydantic>=2.5.0
pydantic-settings>=2.1.0
```

## Database Models (`models.py`)

### Task Model
```python
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime
from typing import Optional

class Task(SQLModel, table=True):
    """Task model with user ownership."""
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True, nullable=False)  # From JWT token
    title: str = Field(max_length=200, nullable=False)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Complete project documentation",
                "description": "Write comprehensive API documentation",
                "completed": False
            }
        }
```

### Model Guidelines
- Use `SQLModel` for table models (combines SQLAlchemy + Pydantic)
- Always include `user_id` field for multi-user isolation
- Add indexes on frequently queried fields (`user_id`, `completed`)
- Use `Optional[type]` for nullable fields
- Provide default values where appropriate
- Include `created_at` and `updated_at` timestamps

## Pydantic Schemas (`schemas.py`)

```python
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime

class TaskCreate(BaseModel):
    """Schema for creating a new task."""
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)

class TaskUpdate(BaseModel):
    """Schema for updating a task."""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    completed: Optional[bool] = None

class TaskResponse(BaseModel):
    """Schema for task responses."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: str
    title: str
    description: Optional[str]
    completed: bool
    created_at: datetime
    updated_at: datetime
```

### Schema Patterns
- **Create schemas**: Only fields needed for creation (no id, timestamps)
- **Update schemas**: All fields optional (partial updates)
- **Response schemas**: All fields from database model
- Use `ConfigDict(from_attributes=True)` for ORM compatibility
- Add field validation with `Field()` constraints

## Database Connection (`db.py`)

```python
from sqlmodel import create_engine, Session, SQLModel
from typing import Generator
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

# Create engine with connection pooling
engine = create_engine(
    DATABASE_URL,
    echo=True,  # Set to False in production
    pool_pre_ping=True,  # Verify connections before using
    pool_size=5,
    max_overflow=10
)

def create_db_and_tables():
    """Create database tables on startup."""
    SQLModel.metadata.create_all(engine)

def get_session() -> Generator[Session, None, None]:
    """Dependency for getting database session."""
    with Session(engine) as session:
        yield session
```

### Database Best Practices
- Use connection pooling for performance
- Enable `pool_pre_ping` for serverless databases (Neon)
- Set `echo=False` in production to reduce logs
- Always use dependency injection for sessions
- Close sessions properly (handled by `with` statement)

## JWT Authentication (`auth.py`)

```python
import jwt
from fastapi import HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

BETTER_AUTH_SECRET = os.getenv("BETTER_AUTH_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

if not BETTER_AUTH_SECRET:
    raise ValueError("BETTER_AUTH_SECRET environment variable is not set")

security = HTTPBearer()

def verify_jwt_token(credentials: HTTPAuthorizationCredentials = Security(security)) -> dict:
    """
    Verify JWT token and extract user information.

    Args:
        credentials: HTTP Bearer token from Authorization header

    Returns:
        dict: Decoded token payload with user_id, email, etc.

    Raises:
        HTTPException: 401 if token is invalid or expired
    """
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            BETTER_AUTH_SECRET,
            algorithms=[JWT_ALGORITHM]
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_current_user_id(token_payload: dict = Security(verify_jwt_token)) -> str:
    """
    Extract user_id from verified JWT token.

    Args:
        token_payload: Decoded JWT payload from verify_jwt_token

    Returns:
        str: User ID

    Raises:
        HTTPException: 401 if user_id not in token
    """
    user_id = token_payload.get("sub") or token_payload.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="User ID not found in token")
    return user_id
```

### Authentication Flow
1. Frontend sends request with `Authorization: Bearer <token>` header
2. `verify_jwt_token` dependency extracts and verifies token
3. `get_current_user_id` extracts user ID from token payload
4. Route handler receives authenticated user ID
5. All database queries filtered by user ID

## API Route Patterns (`routes/tasks.py`)

```python
from fastapi import APIRouter, Depends, HTTPException, Path
from sqlmodel import Session, select
from typing import List
from ..db import get_session
from ..auth import get_current_user_id
from ..models import Task
from ..schemas import TaskCreate, TaskUpdate, TaskResponse

router = APIRouter(prefix="/api/{user_id}/tasks", tags=["tasks"])

@router.get("", response_model=List[TaskResponse])
async def get_tasks(
    user_id: str = Path(...),
    authenticated_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """
    Get all tasks for authenticated user.

    Security: Verifies user_id in URL matches authenticated user.
    """
    # Verify URL user_id matches authenticated user
    if user_id != authenticated_user_id:
        raise HTTPException(status_code=403, detail="Access denied")

    statement = select(Task).where(Task.user_id == user_id)
    tasks = session.exec(statement).all()
    return tasks

@router.post("", response_model=TaskResponse, status_code=201)
async def create_task(
    task_data: TaskCreate,
    user_id: str = Path(...),
    authenticated_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """
    Create a new task for authenticated user.

    Security: Task is automatically assigned to authenticated user.
    """
    # Verify URL user_id matches authenticated user
    if user_id != authenticated_user_id:
        raise HTTPException(status_code=403, detail="Access denied")

    task = Task(
        user_id=authenticated_user_id,  # Use authenticated ID, not URL param
        **task_data.model_dump()
    )
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: int,
    user_id: str = Path(...),
    authenticated_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """
    Get a specific task by ID.

    Security: Only returns task if it belongs to authenticated user.
    """
    if user_id != authenticated_user_id:
        raise HTTPException(status_code=403, detail="Access denied")

    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Verify task belongs to authenticated user
    if task.user_id != authenticated_user_id:
        raise HTTPException(status_code=403, detail="Access denied")

    return task

@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: int,
    task_data: TaskUpdate,
    user_id: str = Path(...),
    authenticated_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """
    Update a task.

    Security: Only allows updating tasks owned by authenticated user.
    """
    if user_id != authenticated_user_id:
        raise HTTPException(status_code=403, detail="Access denied")

    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task.user_id != authenticated_user_id:
        raise HTTPException(status_code=403, detail="Access denied")

    # Update only provided fields
    update_data = task_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)

    task.updated_at = datetime.utcnow()
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

@router.delete("/{task_id}", status_code=204)
async def delete_task(
    task_id: int,
    user_id: str = Path(...),
    authenticated_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """
    Delete a task.

    Security: Only allows deleting tasks owned by authenticated user.
    """
    if user_id != authenticated_user_id:
        raise HTTPException(status_code=403, detail="Access denied")

    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task.user_id != authenticated_user_id:
        raise HTTPException(status_code=403, detail="Access denied")

    session.delete(task)
    session.commit()
    return None

@router.patch("/{task_id}/complete", response_model=TaskResponse)
async def toggle_task_completion(
    task_id: int,
    user_id: str = Path(...),
    authenticated_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """
    Toggle task completion status.

    Security: Only allows toggling tasks owned by authenticated user.
    """
    if user_id != authenticated_user_id:
        raise HTTPException(status_code=403, detail="Access denied")

    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task.user_id != authenticated_user_id:
        raise HTTPException(status_code=403, detail="Access denied")

    task.completed = not task.completed
    task.updated_at = datetime.utcnow()
    session.add(task)
    session.commit()
    session.refresh(task)
    return task
```

## FastAPI Application (`main.py`)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import create_db_and_tables
from .routes import tasks, health
import os

app = FastAPI(
    title="Todo API",
    description="Multi-user task management API with JWT authentication",
    version="1.0.0"
)

# CORS configuration for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js dev server
        os.getenv("FRONTEND_URL", "http://localhost:3000")
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(tasks.router)
app.include_router(health.router)

@app.on_event("startup")
def on_startup():
    """Initialize database tables on startup."""
    create_db_and_tables()

@app.get("/")
async def root():
    """API root endpoint."""
    return {
        "message": "Todo API",
        "version": "1.0.0",
        "docs": "/docs"
    }
```

## Security Checklist

### Critical Security Rules
- ✅ **ALWAYS verify `user_id` in URL matches authenticated user from JWT**
- ✅ **ALWAYS filter database queries by authenticated user ID**
- ✅ **NEVER trust `user_id` from URL path - use JWT token user ID**
- ✅ **Return 403 Forbidden if user attempts to access other user's resources**
- ✅ **Validate all input with Pydantic schemas**
- ✅ **Use parameterized queries (SQLModel handles this)**
- ✅ **Set CORS origins explicitly, never use `"*"` in production**
- ✅ **Keep `BETTER_AUTH_SECRET` secret and consistent with frontend**

### User Isolation Pattern
```python
# ✅ CORRECT - Verify URL user_id matches authenticated user
if user_id != authenticated_user_id:
    raise HTTPException(status_code=403, detail="Access denied")

# ✅ CORRECT - Always filter by authenticated user ID
statement = select(Task).where(Task.user_id == authenticated_user_id)

# ❌ WRONG - Using URL user_id without verification
statement = select(Task).where(Task.user_id == user_id)  # INSECURE!

# ❌ WRONG - No user filtering at all
statement = select(Task)  # Returns ALL users' tasks!
```

## Error Handling

### Standard Error Responses
- `400 Bad Request`: Invalid input data (Pydantic validation)
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: Valid token but insufficient permissions
- `404 Not Found`: Resource does not exist
- `422 Unprocessable Entity`: Validation error details
- `500 Internal Server Error`: Server-side error

### Custom Exception Handler (Optional)
```python
from fastapi import Request
from fastapi.responses import JSONResponse

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Catch-all exception handler for unhandled errors."""
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "type": type(exc).__name__
        }
    )
```

## Environment Variables (`.env`)

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Authentication (must match frontend)
BETTER_AUTH_SECRET=your-secret-key-minimum-32-characters
JWT_ALGORITHM=HS256

# Frontend
FRONTEND_URL=http://localhost:3000

# Environment
ENVIRONMENT=development
DEBUG=True
```

## Running the Application

### Development
```bash
# Install dependencies
pip install -r requirements.txt

# Run with auto-reload
uvicorn main:app --reload --port 8000

# Run with specific host
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Production
```bash
# Run with Gunicorn + Uvicorn workers
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## Testing

```python
# tests/test_tasks.py
from fastapi.testclient import TestClient
from main import app
import jwt

client = TestClient(app)

def create_test_token(user_id: str) -> str:
    """Create a test JWT token."""
    payload = {"sub": user_id, "user_id": user_id}
    return jwt.encode(payload, BETTER_AUTH_SECRET, algorithm=JWT_ALGORITHM)

def test_create_task():
    """Test task creation with authentication."""
    token = create_test_token("test-user-123")
    headers = {"Authorization": f"Bearer {token}"}

    response = client.post(
        "/api/test-user-123/tasks",
        json={"title": "Test Task", "description": "Test Description"},
        headers=headers
    )

    assert response.status_code == 201
    assert response.json()["title"] == "Test Task"
    assert response.json()["user_id"] == "test-user-123"
```

## API Documentation
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## Spec-Driven Development

### Before Writing Code
1. **Read the spec**: `@specs/features/[feature].md`
2. **Check API spec**: `@specs/api/rest-endpoints.md`
3. **Review database spec**: `@specs/database/schema.md`
4. **Understand acceptance criteria**: Implement according to requirements

### Development Process
1. Define database models with SQLModel
2. Create Pydantic schemas for validation
3. Implement route handlers with security
4. Add comprehensive error handling
5. Write tests for all endpoints
6. Verify against spec acceptance criteria

## Common Pitfalls to Avoid
- ❌ Don't use `user_id` from URL without JWT verification
- ❌ Don't return data for users other than authenticated user
- ❌ Don't skip input validation
- ❌ Don't hardcode secrets in code
- ❌ Don't forget to close database sessions
- ❌ Don't disable CORS in production with `"*"`
- ❌ Don't log sensitive data (tokens, passwords)

## Resources
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLModel Documentation](https://sqlmodel.tiangolo.com/)
- [Pydantic Documentation](https://docs.pydantic.dev/)
- Specs: `@specs/features/`, `@specs/api/`, `@specs/database/`
