# Feature Specification: Task CRUD REST API

**Feature Branch**: `004-task-crud-api`
**Created**: 2026-02-06
**Status**: Draft
**Input**: User description: "Task CRUD REST API - The backend must expose RESTful endpoints for managing tasks. All endpoints require authentication and enforce user ownership."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - List User's Tasks (Priority: P1)

As a signed-in user, I need to view a list of all my tasks so that I can see what I need to do.

**Why this priority**: Viewing tasks is the core functionality of a todo application. Without the ability to list tasks, users cannot see their work.

**Independent Test**: Sign in as a user with 5 tasks, make GET request to /api/{user_id}/tasks, receive array of 5 tasks belonging to that user only.

**Acceptance Scenarios**:

1. **Given** I am signed in with 5 tasks, **When** I request GET /api/{my_user_id}/tasks, **Then** I receive an array of my 5 tasks with id, title, description, completed, and timestamps
2. **Given** I am signed in but have no tasks, **When** I request GET /api/{my_user_id}/tasks, **Then** I receive an empty array
3. **Given** I am signed in as User A, **When** I request GET /api/{user_b_id}/tasks (another user's ID), **Then** I receive 403 Forbidden

---

### User Story 2 - Create New Task (Priority: P1)

As a signed-in user, I need to create a new task with a title and optional description so that I can track things I need to do.

**Why this priority**: Without task creation, users cannot add new items to their todo list. This is essential for the application to be useful.

**Independent Test**: Sign in, make POST request to /api/{user_id}/tasks with title and description, verify task is created in database and returned with generated ID.

**Acceptance Scenarios**:

1. **Given** I am signed in, **When** I POST to /api/{my_user_id}/tasks with {"title": "Buy groceries", "description": "Milk, bread, eggs"}, **Then** a new task is created, assigned to me, and returned with status 201 Created
2. **Given** I am signed in, **When** I POST to /api/{my_user_id}/tasks with {"title": "Quick task"} (no description), **Then** a task is created with null description
3. **Given** I am signed in, **When** I POST to /api/{my_user_id}/tasks with empty title, **Then** I receive 400 Bad Request with validation error
4. **Given** I am not authenticated, **When** I POST to /api/{any_user_id}/tasks, **Then** I receive 401 Unauthorized

---

### User Story 3 - View Single Task (Priority: P2)

As a signed-in user, I need to view the details of a specific task so that I can see its full information.

**Why this priority**: While useful for detailed views, users can function with the task list alone. Lower priority than list and create.

**Independent Test**: Sign in, create a task, request GET /api/{user_id}/tasks/{task_id}, receive full task details.

**Acceptance Scenarios**:

1. **Given** I own a task with ID 123, **When** I request GET /api/{my_user_id}/tasks/123, **Then** I receive the full task object with all fields
2. **Given** I request a task that doesn't exist, **When** I request GET /api/{my_user_id}/tasks/999, **Then** I receive 404 Not Found
3. **Given** User A owns task ID 123, **When** User B requests GET /api/{user_b_id}/tasks/123, **Then** User B receives 403 Forbidden

---

### User Story 4 - Update Existing Task (Priority: P2)

As a signed-in user, I need to update a task's title, description, or completion status so that I can keep my tasks current.

**Why this priority**: Task updates are important but the application can function with create/delete only. Users can delete and recreate if updates aren't available initially.

**Independent Test**: Sign in, create a task, update its title via PUT request, verify changes persisted.

**Acceptance Scenarios**:

1. **Given** I own task ID 123, **When** I PUT to /api/{my_user_id}/tasks/123 with {"title": "Updated title"}, **Then** the task title is updated and returned with status 200 OK
2. **Given** I own task ID 123, **When** I PUT with {"completed": true}, **Then** the task is marked as completed
3. **Given** User A owns task ID 123, **When** User B attempts PUT to /api/{user_b_id}/tasks/123, **Then** User B receives 403 Forbidden

---

### User Story 5 - Delete Task (Priority: P2)

As a signed-in user, I need to delete tasks I no longer need so that my task list stays clean and relevant.

**Why this priority**: Deletion is useful for list management but not critical. Users can leave completed tasks if deletion isn't available.

**Independent Test**: Sign in, create a task, delete it via DELETE request, verify it no longer appears in task list.

**Acceptance Scenarios**:

1. **Given** I own task ID 123, **When** I DELETE /api/{my_user_id}/tasks/123, **Then** the task is deleted and I receive 204 No Content
2. **Given** I delete task ID 123, **When** I try to GET that task, **Then** I receive 404 Not Found
3. **Given** User A owns task ID 123, **When** User B attempts DELETE /api/{user_b_id}/tasks/123, **Then** User B receives 403 Forbidden

---

### User Story 6 - Toggle Task Completion (Priority: P1)

As a signed-in user, I need to quickly mark tasks as complete or incomplete so that I can track my progress.

**Why this priority**: Marking tasks complete is the primary interaction in a todo app. Users need this to feel productive.

**Independent Test**: Sign in, create incomplete task, PATCH to toggle completion, verify task marked complete. PATCH again, verify marked incomplete.

**Acceptance Scenarios**:

1. **Given** I own incomplete task ID 123, **When** I PATCH /api/{my_user_id}/tasks/123/complete, **Then** the task's completed field toggles to true and I receive 200 OK
2. **Given** I own completed task ID 123, **When** I PATCH /api/{my_user_id}/tasks/123/complete, **Then** the task's completed field toggles to false
3. **Given** User A owns task ID 123, **When** User B attempts PATCH /api/{user_b_id}/tasks/123/complete, **Then** User B receives 403 Forbidden

---

### Edge Cases

- **Missing JWT Token**: What happens if request lacks Authorization header? (401 Unauthorized)
- **Expired JWT Token**: What happens if token is expired? (401 Unauthorized with "Token has expired")
- **Invalid Task ID**: What happens if task_id is not a valid integer? (400 Bad Request)
- **Task Ownership**: What if URL user_id doesn't match JWT token user_id? (403 Forbidden)
- **Empty Request Body**: What happens if POST/PUT has no body? (400 Bad Request with validation error)
- **Partial Updates**: Can users update just title without changing description? (Yes - PUT accepts partial updates)
- **Long Title/Description**: What if title exceeds 200 chars or description exceeds 1000? (400 Bad Request with validation error)
- **Concurrent Modifications**: What if two requests update same task simultaneously? (Last write wins - no conflict resolution)

## Requirements *(mandatory)*

### Functional Requirements

#### List Tasks (GET /api/{user_id}/tasks)
- **FR-001**: Endpoint MUST return array of all tasks owned by authenticated user
- **FR-002**: Endpoint MUST filter tasks by authenticated user_id (from JWT token)
- **FR-003**: Endpoint MUST verify URL user_id matches JWT token user_id (403 if mismatch)
- **FR-004**: Endpoint MUST require valid JWT token (401 if missing/invalid)
- **FR-005**: Endpoint MUST return empty array if user has no tasks (not 404)
- **FR-006**: Endpoint MUST return 200 OK on success

#### Create Task (POST /api/{user_id}/tasks)
- **FR-007**: Endpoint MUST create new task with title and optional description
- **FR-008**: Endpoint MUST validate title is present and non-empty (400 if missing)
- **FR-009**: Endpoint MUST validate title max length 200 characters (400 if exceeded)
- **FR-010**: Endpoint MUST validate description max length 1000 characters if provided (400 if exceeded)
- **FR-011**: Endpoint MUST assign task to authenticated user_id (from JWT, not URL)
- **FR-012**: Endpoint MUST set completed=false by default for new tasks
- **FR-013**: Endpoint MUST return created task with 201 Created status

#### Get Single Task (GET /api/{user_id}/tasks/{id})
- **FR-014**: Endpoint MUST return task details if task exists and belongs to authenticated user
- **FR-015**: Endpoint MUST return 404 Not Found if task doesn't exist
- **FR-016**: Endpoint MUST return 403 Forbidden if task exists but belongs to different user
- **FR-017**: Endpoint MUST return 200 OK with task object on success

#### Update Task (PUT /api/{user_id}/tasks/{id})
- **FR-018**: Endpoint MUST allow updating title, description, and/or completed status
- **FR-019**: Endpoint MUST support partial updates (only provided fields are changed)
- **FR-020**: Endpoint MUST validate title and description length constraints (same as create)
- **FR-021**: Endpoint MUST update updated_at timestamp to current time
- **FR-022**: Endpoint MUST return 404 if task doesn't exist
- **FR-023**: Endpoint MUST return 403 if task belongs to different user
- **FR-024**: Endpoint MUST return 200 OK with updated task object on success

#### Delete Task (DELETE /api/{user_id}/tasks/{id})
- **FR-025**: Endpoint MUST permanently delete task if it exists and belongs to authenticated user
- **FR-026**: Endpoint MUST return 204 No Content on successful deletion
- **FR-027**: Endpoint MUST return 404 if task doesn't exist
- **FR-028**: Endpoint MUST return 403 if task belongs to different user

#### Toggle Completion (PATCH /api/{user_id}/tasks/{id}/complete)
- **FR-029**: Endpoint MUST toggle completed status (true→false, false→true)
- **FR-030**: Endpoint MUST update updated_at timestamp
- **FR-031**: Endpoint MUST return 200 OK with updated task object
- **FR-032**: Endpoint MUST return 404 if task doesn't exist
- **FR-033**: Endpoint MUST return 403 if task belongs to different user

#### Security Requirements (All Endpoints)
- **FR-034**: ALL endpoints MUST require valid JWT token in Authorization: Bearer header
- **FR-035**: ALL endpoints MUST verify URL user_id matches JWT token user_id (403 if mismatch)
- **FR-036**: ALL endpoints MUST return 401 Unauthorized for missing/invalid/expired tokens
- **FR-037**: ALL endpoints MUST filter database queries by authenticated user_id only
- **FR-038**: Endpoints MUST use Depends(get_current_user_id) for authentication

### Key Entities

- **Task**: Todo item (already defined in Feature 003)
  - Attributes: id, user_id, title, description, completed, created_at, updated_at
  - Note: User entity also exists (Feature 002) but not directly accessed by these endpoints

- **TaskCreate Schema**: Request body for creating tasks
  - Attributes: title (required, max 200), description (optional, max 1000)

- **TaskUpdate Schema**: Request body for updating tasks
  - Attributes: title (optional, max 200), description (optional, max 1000), completed (optional)

- **TaskResponse Schema**: Response body for task operations
  - Attributes: All Task model fields (id, user_id, title, description, completed, created_at, updated_at)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can view their task list within 500ms
- **SC-002**: Users can create a new task within 1 second
- **SC-003**: 100% of requests enforce user isolation (users cannot see other users' tasks)
- **SC-004**: 100% of requests validate JWT tokens before processing
- **SC-005**: Users can complete common task operations (create, view, complete, delete) in under 10 seconds total
- **SC-006**: API returns correct HTTP status codes for all scenarios (200, 201, 204, 400, 401, 403, 404)
- **SC-007**: Zero unauthorized data access incidents (all security checks enforced)
- **SC-008**: 95% of valid requests succeed on first attempt

## Assumptions *(include if making significant assumptions)*

1. **URL Pattern**: Endpoints use /api/{user_id}/tasks pattern (user_id in path for clarity)
2. **No Pagination**: GET /api/{user_id}/tasks returns all tasks (no limit/offset in Phase II)
3. **No Filtering**: GET /api/{user_id}/tasks returns all tasks (no filter by completed status)
4. **No Sorting**: Tasks returned in database order (implementation may sort by created_at)
5. **Partial Updates**: PUT allows updating individual fields without providing all fields
6. **Hard Delete**: DELETE permanently removes tasks (no soft delete with deleted_at)
7. **No Batch Operations**: One task per request (no bulk create/update/delete)
8. **JSON Only**: Request and response bodies are JSON (no XML, form data, etc.)
9. **Standard REST**: Following RESTful conventions (GET for read, POST for create, PUT for update, DELETE for delete, PATCH for partial update)
10. **updated_at Manual**: Application code must manually update updated_at field (not automatic trigger)

## Dependencies & Constraints *(include if external dependencies exist)*

### Dependencies

- **Constitution v1.1.0**: Must comply with all security and architectural requirements
- **Feature 002**: Authentication with JWT tokens (get_current_user_id dependency)
- **Feature 003**: Database models (User and Task models in backend/models.py)
- **FastAPI Framework**: Installed and configured in backend
- **SQLModel ORM**: For database queries
- **Pydantic**: For request/response validation schemas

### Constraints

- **Authentication**: ALL endpoints MUST require JWT token (constitution requirement)
- **User Isolation**: ALL endpoints MUST filter by authenticated user_id only (constitution requirement)
- **No Raw SQL**: ALL queries via SQLModel ORM (constitution requirement)
- **RESTful Conventions**: Must follow standard REST patterns (GET, POST, PUT, DELETE, PATCH)
- **URL Pattern**: Must use /api/{user_id}/tasks format specified in constitution
- **Status Codes**: Must use standard HTTP status codes (200, 201, 204, 400, 401, 403, 404, 422)
- **FastAPI**: Must use FastAPI framework (no alternatives - constitution requirement)

## Out of Scope *(clarify what's NOT included)*

- **Bulk Operations**: No batch create, update, or delete multiple tasks at once
- **Admin Endpoints**: No admin-only endpoints to view all users' tasks
- **Task Filtering**: No query parameters to filter by completed status, date range, etc.
- **Task Sorting**: No query parameters to sort by title, date, completion status
- **Pagination**: No limit/offset parameters for large task lists
- **Search**: No full-text search on title or description
- **Task Sharing**: No ability to share tasks with other users
- **Task Categories/Tags**: No categorization or tagging system
- **Due Dates**: No due_date field or overdue task queries
- **Task Priority**: No priority field or priority-based sorting
- **Attachments**: No file attachments on tasks
- **Comments**: No comments or notes on tasks

## Notes *(optional - for additional context)*

### API Endpoint Specifications

#### GET /api/{user_id}/tasks
**Purpose**: List all tasks for authenticated user

**Request**:
- Method: GET
- Path: /api/{user_id}/tasks
- Headers: Authorization: Bearer <jwt_token>
- Body: None

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "user_id": "user-uuid",
    "title": "Task title",
    "description": "Task description",
    "completed": false,
    "created_at": "2026-02-06T12:00:00Z",
    "updated_at": "2026-02-06T12:00:00Z"
  }
]
```

**Errors**:
- 401: Missing/invalid/expired JWT token
- 403: URL user_id doesn't match JWT token user_id

---

#### POST /api/{user_id}/tasks
**Purpose**: Create new task

**Request**:
- Method: POST
- Path: /api/{user_id}/tasks
- Headers: Authorization: Bearer <jwt_token>, Content-Type: application/json
- Body:
```json
{
  "title": "Task title (required, max 200)",
  "description": "Optional description (max 1000)"
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "user_id": "user-uuid",
  "title": "Task title",
  "description": "Optional description",
  "completed": false,
  "created_at": "2026-02-06T12:00:00Z",
  "updated_at": "2026-02-06T12:00:00Z"
}
```

**Errors**:
- 400: Invalid input (missing title, title too long, description too long)
- 401: Missing/invalid/expired JWT token
- 403: URL user_id doesn't match JWT token user_id
- 422: Validation error details

---

#### GET /api/{user_id}/tasks/{id}
**Purpose**: Get specific task details

**Request**:
- Method: GET
- Path: /api/{user_id}/tasks/{id}
- Headers: Authorization: Bearer <jwt_token>
- Body: None

**Response** (200 OK):
```json
{
  "id": 1,
  "user_id": "user-uuid",
  "title": "Task title",
  "description": "Task description",
  "completed": false,
  "created_at": "2026-02-06T12:00:00Z",
  "updated_at": "2026-02-06T12:00:00Z"
}
```

**Errors**:
- 401: Missing/invalid/expired JWT token
- 403: Task exists but belongs to different user, OR URL user_id doesn't match JWT
- 404: Task doesn't exist

---

#### PUT /api/{user_id}/tasks/{id}
**Purpose**: Update task

**Request**:
- Method: PUT
- Path: /api/{user_id}/tasks/{id}
- Headers: Authorization: Bearer <jwt_token>, Content-Type: application/json
- Body (all fields optional):
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "user_id": "user-uuid",
  "title": "Updated title",
  "description": "Updated description",
  "completed": true,
  "created_at": "2026-02-06T12:00:00Z",
  "updated_at": "2026-02-06T12:15:00Z"
}
```

**Errors**:
- 400: Invalid input (title too long, description too long)
- 401: Missing/invalid/expired JWT token
- 403: Task belongs to different user, OR URL user_id doesn't match JWT
- 404: Task doesn't exist

---

#### DELETE /api/{user_id}/tasks/{id}
**Purpose**: Delete task

**Request**:
- Method: DELETE
- Path: /api/{user_id}/tasks/{id}
- Headers: Authorization: Bearer <jwt_token>
- Body: None

**Response** (204 No Content):
- Empty body

**Errors**:
- 401: Missing/invalid/expired JWT token
- 403: Task belongs to different user, OR URL user_id doesn't match JWT
- 404: Task doesn't exist

---

#### PATCH /api/{user_id}/tasks/{id}/complete
**Purpose**: Toggle task completion status

**Request**:
- Method: PATCH
- Path: /api/{user_id}/tasks/{id}/complete
- Headers: Authorization: Bearer <jwt_token>
- Body: None (completion status toggles automatically)

**Response** (200 OK):
```json
{
  "id": 1,
  "user_id": "user-uuid",
  "title": "Task title",
  "description": "Task description",
  "completed": true,
  "created_at": "2026-02-06T12:00:00Z",
  "updated_at": "2026-02-06T12:16:00Z"
}
```

**Errors**:
- 401: Missing/invalid/expired JWT token
- 403: Task belongs to different user, OR URL user_id doesn't match JWT
- 404: Task doesn't exist

---

### Security Pattern (Required for ALL Endpoints)

```python
# Pseudocode - implementation detail for reference
@router.get("/api/{user_id}/tasks")
async def get_tasks(
    user_id: str = Path(...),
    authenticated_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    # Step 1: Verify URL user_id matches authenticated user (FR-035)
    if user_id != authenticated_user_id:
        raise HTTPException(status_code=403, detail="Access denied")

    # Step 2: Query filtered by authenticated_user_id (FR-037)
    statement = select(Task).where(Task.user_id == authenticated_user_id)
    tasks = session.exec(statement).all()

    return tasks
```

### HTTP Status Code Reference

| Code | Meaning | When to Use |
|------|---------|-------------|
| 200 OK | Success | GET (list, single), PUT, PATCH successful |
| 201 Created | Resource created | POST successful |
| 204 No Content | Success, no body | DELETE successful |
| 400 Bad Request | Invalid input | Missing/invalid title, length violations |
| 401 Unauthorized | Authentication failure | Missing/invalid/expired JWT token |
| 403 Forbidden | Authorization failure | Valid token but accessing other user's resource |
| 404 Not Found | Resource doesn't exist | Task ID not found |
| 422 Unprocessable Entity | Validation errors | Pydantic validation failures (detailed errors) |

### Success Validation

This API feature is successful when:
1. All 6 endpoints implemented and functional
2. JWT authentication enforced on every endpoint
3. User isolation enforced (users see only their tasks)
4. Correct HTTP status codes returned for all scenarios
5. Request/response bodies follow specified schemas
6. No security vulnerabilities (user enumeration, unauthorized access)
7. Performance targets met (<500ms for list, <1s for create)
8. OpenAPI documentation auto-generated by FastAPI

### Next Steps After This Feature

Once Task CRUD API is implemented:
1. Integrate with frontend (Feature 005) - UI components that use these endpoints
2. End-to-end testing with authentication flow
3. Performance testing with large task datasets
4. Security audit with auth-security-specialist agent
5. Deploy to production (Phase III consideration)
