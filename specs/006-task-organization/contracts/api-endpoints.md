# API Contracts: Task Organization & Usability Enhancements

**Feature**: 006-task-organization
**Date**: 2026-02-08
**Related**: [spec.md](../spec.md), [data-model.md](../data-model.md)

## Overview

This document defines API contract changes for task organization features. The primary change is extending the existing `GET /api/{user_id}/tasks` endpoint to accept query parameters for search, filtering, and sorting.

**Key Principle**: **NO BREAKING CHANGES** - Existing API calls continue to work unchanged.

---

## Modified Endpoints

### GET /api/{user_id}/tasks (MODIFIED)

**Description**: Retrieve all tasks for authenticated user with optional search, filtering, and sorting.

**Path**: `/api/{user_id}/tasks`

**Method**: GET

**Authentication**: Required (JWT Bearer token in Authorization header)

**Path Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | string | Yes | User ID (must match authenticated user from JWT) |

**Query Parameters** (ALL OPTIONAL - NEW):

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|---------|
| search | string | null | Search keyword (case-insensitive, partial match in title/description) | `?search=groceries` |
| status | enum | null | Filter by completion status: "pending", "completed" | `?status=pending` |
| priority | enum | null | Filter by priority level: "high", "medium", "low" | `?priority=high` |
| tags | string | null | Filter by tag (single tag name, comma-separated for multiple) | `?tags=work` or `?tags=work,urgent` |
| sort | enum | "date" | Sort order: "date" (newest first), "alpha" (A-Z), "priority" (high→low) | `?sort=priority` |

**Query Parameter Behavior**:
- **Omitted parameters**: Ignored (no filtering applied for that dimension)
- **Multiple filters**: Applied with AND logic (all must match)
- **Empty values**: Treated as null (e.g., `?search=` same as no search param)
- **Invalid values**: Return 400 Bad Request with validation error
- **Backward compatibility**: No query params = return all user's tasks (existing behavior)

**Request Headers**:
```
Authorization: Bearer <jwt_token>
```

**Request Example 1** (Backward compatible - no query params):
```
GET /api/user-abc/tasks
Authorization: Bearer eyJhbGci...
```

**Request Example 2** (Search only):
```
GET /api/user-abc/tasks?search=meeting
Authorization: Bearer eyJhbGci...
```

**Request Example 3** (Multiple filters):
```
GET /api/user-abc/tasks?status=pending&priority=high&tags=work&sort=date
Authorization: Bearer eyJhbGci...
```

**Response Format** (UNCHANGED):

**Success (200 OK)**:
```json
[
  {
    "id": 1,
    "user_id": "user-abc",
    "title": "Buy groceries",
    "description": "Milk, bread, eggs",
    "completed": false,
    "priority": "high",
    "tags": ["shopping", "urgent"],
    "created_at": "2026-02-08T10:00:00Z",
    "updated_at": "2026-02-08T10:00:00Z"
  },
  {
    "id": 2,
    "user_id": "user-abc",
    "title": "Finish project",
    "description": "Complete API documentation",
    "completed": false,
    "priority": "medium",
    "tags": ["work"],
    "created_at": "2026-02-07T15:30:00Z",
    "updated_at": "2026-02-07T15:30:00Z"
  }
]
```

**Empty Result**:
```json
[]
```

**Error Responses**:

**401 Unauthorized** (Missing or invalid JWT token):
```json
{
  "detail": "Not authenticated"
}
```

**403 Forbidden** (user_id doesn't match JWT token):
```json
{
  "detail": "Access denied"
}
```

**400 Bad Request** (Invalid query parameter value):
```json
{
  "detail": "Invalid priority value. Must be one of: high, medium, low"
}
```

---

### POST /api/{user_id}/tasks (MODIFIED - Accepts new fields)

**Description**: Create a new task with optional priority and tags.

**Changes**: TaskCreate schema now accepts `priority` and `tags` fields (both optional).

**Request Body** (NEW FIELDS):
```json
{
  "title": "Buy groceries",
  "description": "Milk, bread, eggs",
  "priority": "high",
  "tags": ["shopping", "urgent"]
}
```

**Backward Compatible Request** (priority/tags omitted):
```json
{
  "title": "Buy groceries",
  "description": "Milk, bread, eggs"
}
// Backend applies defaults: priority="medium", tags=[]
```

**Response** (includes new fields):
```json
{
  "id": 1,
  "user_id": "user-abc",
  "title": "Buy groceries",
  "description": "Milk, bread, eggs",
  "completed": false,
  "priority": "high",
  "tags": ["shopping", "urgent"],
  "created_at": "2026-02-08T10:00:00Z",
  "updated_at": "2026-02-08T10:00:00Z"
}
```

**Validation**:
- `priority`: Must be "high", "medium", or "low" (default: "medium")
- `tags`: Must be array of strings, each 1-50 chars, max 20 tags (default: [])

---

### PUT /api/{user_id}/tasks/{task_id} (MODIFIED - Accepts new fields)

**Description**: Update an existing task with optional priority and tags.

**Changes**: TaskUpdate schema now accepts `priority` and `tags` fields (both optional).

**Request Body Example** (update priority only):
```json
{
  "priority": "low"
}
```

**Request Body Example** (update tags only):
```json
{
  "tags": ["work", "documentation"]
}
```

**Request Body Example** (update multiple fields):
```json
{
  "title": "Updated title",
  "priority": "high",
  "tags": ["urgent", "review"]
}
```

**Backward Compatible Request** (no new fields):
```json
{
  "title": "Updated title",
  "description": "Updated description"
}
// Priority and tags remain unchanged
```

**Response**: Same as POST (includes all fields including priority and tags)

---

## Query Parameter Details

### Search Parameter

**Format**: `?search=<keyword>`

**Behavior**:
- Case-insensitive matching (ILIKE in PostgreSQL)
- Partial word matching ("gro" matches "groceries")
- Searches both `title` and `description` fields (OR logic)
- Empty string treated as null (no search applied)

**Examples**:
```
?search=meeting
→ WHERE (title ILIKE '%meeting%' OR description ILIKE '%meeting%')

?search=buy%20groceries
→ WHERE (title ILIKE '%buy groceries%' OR description ILIKE '%buy groceries%')
```

**Edge Cases**:
- Special characters: URL-encoded automatically by browser
- SQL injection: Prevented by SQLModel parameterization
- Empty search: `?search=` → Ignored (returns all tasks)

---

### Status Filter Parameter

**Format**: `?status=<value>`

**Allowed Values**:
- `pending` → completed = false
- `completed` → completed = true

**Behavior**:
- Filters tasks by completion status
- Invalid value returns 400 Bad Request
- Omitted parameter returns all tasks (regardless of status)

**Examples**:
```
?status=pending
→ WHERE completed = false

?status=completed
→ WHERE completed = true
```

---

### Priority Filter Parameter

**Format**: `?priority=<value>`

**Allowed Values**:
- `high` → priority = 'high'
- `medium` → priority = 'medium'
- `low` → priority = 'low'

**Behavior**:
- Filters tasks by priority level
- Invalid value returns 400 Bad Request
- Omitted parameter returns all tasks (regardless of priority)

**Examples**:
```
?priority=high
→ WHERE priority = 'high'

?priority=medium
→ WHERE priority = 'medium'
```

---

### Tags Filter Parameter

**Format**: `?tags=<tag_name>` (single tag)

**Behavior**:
- Filters tasks that contain the specified tag
- Uses JSON containment operator (`@>`)
- Case-sensitive (matches exact tag name)
- Omitted parameter returns all tasks

**Examples**:
```
?tags=work
→ WHERE tags @> '["work"]'

?tags=urgent
→ WHERE tags @> '["urgent"]'
```

**Future Enhancement** (not in MVP):
- Multiple tags: `?tags=work,urgent` → Tasks with ANY of these tags (OR logic)
- All tags: `?tags=work+urgent` → Tasks with ALL of these tags (AND logic)

---

### Sort Parameter

**Format**: `?sort=<order>`

**Allowed Values**:
- `date` (default) → Sort by created_at DESC (newest first)
- `alpha` → Sort by title ASC (A-Z)
- `priority` → Sort by priority (high→medium→low), then by created_at DESC

**Behavior**:
- Applied after all filtering (sorts only visible tasks)
- Invalid value returns 400 Bad Request
- Omitted parameter defaults to "date"

**Examples**:
```
?sort=date
→ ORDER BY created_at DESC

?sort=alpha
→ ORDER BY title ASC

?sort=priority
→ ORDER BY
    CASE priority
      WHEN 'high' THEN 1
      WHEN 'medium' THEN 2
      WHEN 'low' THEN 3
    END,
    created_at DESC
```

**Secondary Sort**: When primary sort has ties (e.g., multiple tasks with same priority), secondary sort by `created_at DESC` ensures consistent ordering.

---

## Combined Query Examples

### Example 1: Search with Status Filter
```
GET /api/user-abc/tasks?search=meeting&status=pending

SQL Equivalent:
SELECT * FROM tasks
WHERE user_id = 'user-abc'
  AND completed = false
  AND (title ILIKE '%meeting%' OR description ILIKE '%meeting%')
ORDER BY created_at DESC;
```

### Example 2: All Filters + Sort
```
GET /api/user-abc/tasks?search=project&status=pending&priority=high&tags=work&sort=alpha

SQL Equivalent:
SELECT * FROM tasks
WHERE user_id = 'user-abc'
  AND completed = false
  AND priority = 'high'
  AND tags @> '["work"]'
  AND (title ILIKE '%project%' OR description ILIKE '%project%')
ORDER BY title ASC;
```

### Example 3: Priority Sort Only
```
GET /api/user-abc/tasks?sort=priority

SQL Equivalent:
SELECT * FROM tasks
WHERE user_id = 'user-abc'
ORDER BY
  CASE priority
    WHEN 'high' THEN 1
    WHEN 'medium' THEN 2
    WHEN 'low' THEN 3
  END,
  created_at DESC;
```

---

## Request/Response Schemas (Pydantic)

### TaskCreate (Modified)

```python
class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    priority: str = Field(default="medium", pattern="^(high|medium|low)$")
    tags: List[str] = Field(default_factory=list, max_items=20)

    @validator('tags')
    def validate_tags(cls, v):
        for tag in v:
            if not tag or len(tag) > 50:
                raise ValueError('Each tag must be 1-50 characters')
        return v
```

### TaskUpdate (Modified)

```python
class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    completed: Optional[bool] = None
    priority: Optional[str] = Field(None, pattern="^(high|medium|low)$")
    tags: Optional[List[str]] = Field(None, max_items=20)

    @validator('tags')
    def validate_tags(cls, v):
        if v is not None:
            for tag in v:
                if not tag or len(tag) > 50:
                    raise ValueError('Each tag must be 1-50 characters')
        return v
```

### TaskResponse (Modified)

```python
class TaskResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: str
    title: str
    description: Optional[str]
    completed: bool
    priority: str
    tags: List[str]
    created_at: datetime
    updated_at: datetime
```

### TaskQueryParams (NEW)

```python
class TaskQueryParams(BaseModel):
    search: Optional[str] = Field(None, max_length=100)
    status: Optional[Literal["pending", "completed"]] = None
    priority: Optional[Literal["high", "medium", "low"]] = None
    tags: Optional[str] = Field(None, max_length=200)  # Single tag or comma-separated
    sort: Literal["date", "alpha", "priority"] = "date"
```

---

## Implementation Notes

### Backend Changes Required

1. **models.py**: Add priority and tags fields to Task model
2. **schemas.py**: Update TaskCreate, TaskUpdate, TaskResponse with new fields; add TaskQueryParams
3. **routes/tasks.py**: Modify GET endpoint to accept and process query parameters

### Frontend Changes Required

1. **types/Task.ts**: Add priority and tags to Task interface
2. **lib/api.ts**: Update getTasks() to accept query params object
3. **hooks/useTasks.ts**: Add search/filter/sort params to hook
4. **components/**: Create new components for search/filter/sort UI

### Testing Requirements

**Backend Integration Tests**:
- Test GET /tasks with each query parameter individually
- Test GET /tasks with combined query parameters
- Test backward compatibility (no query params)
- Test invalid query parameter values (expect 400)
- Test query parameter injection attacks (verify sanitization)

**Frontend E2E Tests**:
- Test search updates task list dynamically
- Test filters apply correctly (status, priority, tags)
- Test sort changes order correctly
- Test combined search + filters + sort

---

## OpenAPI Schema (FastAPI Auto-Generated)

```yaml
paths:
  /api/{user_id}/tasks:
    get:
      summary: Get Tasks
      parameters:
        - name: user_id
          in: path
          required: true
          schema:
            type: string
        - name: search
          in: query
          required: false
          schema:
            type: string
            maxLength: 100
        - name: status
          in: query
          required: false
          schema:
            type: string
            enum: [pending, completed]
        - name: priority
          in: query
          required: false
          schema:
            type: string
            enum: [high, medium, low]
        - name: tags
          in: query
          required: false
          schema:
            type: string
        - name: sort
          in: query
          required: false
          schema:
            type: string
            enum: [date, alpha, priority]
            default: date
      responses:
        200:
          description: List of tasks (filtered, searched, sorted)
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/TaskResponse'
        400:
          description: Invalid query parameter value
        401:
          description: Missing or invalid JWT token
        403:
          description: User ID doesn't match authenticated user
```

---

## Contract Verification Checklist

- [x] No breaking changes to existing endpoints
- [x] All query parameters are optional (backward compatible)
- [x] Response format unchanged (added fields to existing structure)
- [x] Authentication requirements unchanged
- [x] Error responses follow existing patterns
- [x] Query parameter validation defined
- [x] Combined filter logic specified (AND)
- [x] Sort behavior with ties defined (secondary sort)
- [x] Edge cases documented (empty results, invalid values)

**Contract Status**: Ready for implementation ✅
