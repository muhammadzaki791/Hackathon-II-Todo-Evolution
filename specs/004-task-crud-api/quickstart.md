# Task CRUD API - Quickstart Guide

## Prerequisites

- Backend running (Feature 002: Authentication implemented)
- Database with User and Task models (Feature 003)
- Valid JWT token from authentication

## Authentication

All requests require JWT token in Authorization header:

```bash
Authorization: Bearer <jwt_token>
```

## Example Requests

### 1. List All Tasks

```bash
curl -X GET http://localhost:8000/api/user-123/tasks \
  -H "Authorization: Bearer <jwt_token>"
```

Response (200 OK):
```json
[
  {
    "id": 1,
    "user_id": "user-123",
    "title": "Buy groceries",
    "description": "Milk, bread, eggs",
    "completed": false,
    "created_at": "2026-02-07T10:00:00Z",
    "updated_at": "2026-02-07T10:00:00Z"
  }
]
```

### 2. Create New Task

```bash
curl -X POST http://localhost:8000/api/user-123/tasks \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Finish project",
    "description": "Complete all remaining tasks"
  }'
```

Response (201 Created):
```json
{
  "id": 2,
  "user_id": "user-123",
  "title": "Finish project",
  "description": "Complete all remaining tasks",
  "completed": false,
  "created_at": "2026-02-07T10:05:00Z",
  "updated_at": "2026-02-07T10:05:00Z"
}
```

### 3. Get Single Task

```bash
curl -X GET http://localhost:8000/api/user-123/tasks/1 \
  -H "Authorization: Bearer <jwt_token>"
```

Response (200 OK): Same as create response

### 4. Update Task

```bash
curl -X PUT http://localhost:8000/api/user-123/tasks/1 \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy groceries (updated)",
    "completed": true
  }'
```

Response (200 OK): Updated task object

### 5. Toggle Completion

```bash
curl -X PATCH http://localhost:8000/api/user-123/tasks/1/complete \
  -H "Authorization: Bearer <jwt_token>"
```

Response (200 OK): Task with toggled completion status

### 6. Delete Task

```bash
curl -X DELETE http://localhost:8000/api/user-123/tasks/1 \
  -H "Authorization: Bearer <jwt_token>"
```

Response (204 No Content): Empty response

## Error Responses

### 401 Unauthorized (Missing/Invalid Token)

```json
{
  "detail": "Not authenticated"
}
```

### 403 Forbidden (User Mismatch)

```json
{
  "detail": "Access denied"
}
```

### 404 Not Found (Task Doesn't Exist)

```json
{
  "detail": "Task not found"
}
```

### 400 Bad Request (Validation Error)

```json
{
  "detail": "Title is required and must be between 1 and 200 characters"
}
```

## Testing with pytest

Run integration tests:

```bash
cd backend
pytest tests/test_tasks.py -v
```

Run with coverage:

```bash
pytest tests/test_tasks.py --cov=routes.tasks --cov-report=term-missing
```

## Dependencies

This feature depends on:
- **Feature 002**: Authentication (get_current_user_id dependency)
- **Feature 003**: Database models (User, Task models)
- **Constitution**: Security and architectural requirements
