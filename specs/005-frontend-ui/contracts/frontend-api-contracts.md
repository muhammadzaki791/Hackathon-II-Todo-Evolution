# Frontend API Contracts

This feature consumes the backend API endpoints created in Feature 004 (Task CRUD API).
All endpoints require JWT authentication via Authorization header.

## Task Endpoints

### GET /api/{user_id}/tasks - List all tasks for authenticated user
- **Headers**: `Authorization: Bearer {token}`
- **URL Params**: `user_id` (from JWT token)
- **Response**: `Task[]`
- **Success**: 200 OK
- **Errors**: 401 Unauthorized, 403 Forbidden

### POST /api/{user_id}/tasks - Create new task
- **Headers**: `Authorization: Bearer {token}`
- **URL Params**: `user_id` (from JWT token)
- **Body**: `{title: string, description?: string}`
- **Response**: `Task`
- **Success**: 201 Created
- **Errors**: 400 Bad Request, 401 Unauthorized, 403 Forbidden

### GET /api/{user_id}/tasks/{id} - Get single task
- **Headers**: `Authorization: Bearer {token}`
- **URL Params**: `user_id`, `id` (task ID)
- **Response**: `Task`
- **Success**: 200 OK
- **Errors**: 401 Unauthorized, 403 Forbidden, 404 Not Found

### PUT /api/{user_id}/tasks/{id} - Update task
- **Headers**: `Authorization: Bearer {token}`
- **URL Params**: `user_id`, `id` (task ID)
- **Body**: `{title?: string, description?: string, completed?: boolean}`
- **Response**: `Task`
- **Success**: 200 OK
- **Errors**: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found

### DELETE /api/{user_id}/tasks/{id} - Delete task
- **Headers**: `Authorization: Bearer {token}`
- **URL Params**: `user_id`, `id` (task ID)
- **Response**: `void`
- **Success**: 204 No Content
- **Errors**: 401 Unauthorized, 403 Forbidden, 404 Not Found

### PATCH /api/{user_id}/tasks/{id}/complete - Toggle task completion
- **Headers**: `Authorization: Bearer {token}`
- **URL Params**: `user_id`, `id` (task ID)
- **Response**: `Task`
- **Success**: 200 OK
- **Errors**: 401 Unauthorized, 403 Forbidden, 404 Not Found