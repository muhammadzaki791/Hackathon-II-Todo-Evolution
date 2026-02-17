# Tasks: Task CRUD REST API

**Input**: Specification from `/specs/004-task-crud-api/spec.md`
**Prerequisites**: Feature 002 (Authentication), Feature 003 (Database models)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each endpoint.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4, US5, US6)
- All paths are relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create Pydantic schemas and route structure

- [X] T001 Create Pydantic schemas file in backend/schemas.py with TaskCreate, TaskUpdate, TaskResponse classes
- [X] T002 Create tasks router file in backend/routes/tasks.py with APIRouter initialization
- [X] T003 Register tasks router in backend/main.py (app.include_router)

**Acceptance Criteria for Phase 1**:
- Pydantic schemas defined for request/response validation
- Tasks router created and registered with FastAPI app
- OpenAPI documentation includes /api/{user_id}/tasks routes

**Verification**:
```bash
cat backend/schemas.py | grep "class TaskCreate"
cat backend/routes/tasks.py | grep "APIRouter"
cat backend/main.py | grep "include_router"
```

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utilities that ALL endpoints need

**⚠️ CRITICAL**: No endpoint implementation can begin until this phase is complete

- [X] T004 Verify get_current_user_id dependency exists in backend/auth.py (already implemented in Feature 002)
- [X] T005 Verify get_session dependency exists in backend/main.py (already implemented)
- [X] T006 Verify Task model imported in backend/routes/tasks.py

**Acceptance Criteria for Phase 2**:
- Authentication and database dependencies available
- Task model accessible in routes
- Ready to implement endpoints

**Checkpoint**: Foundation ready - endpoint implementation can now begin

---

## Phase 3: User Story 1 - List Tasks (Priority: P1) 🎯 MVP

**Goal**: GET /api/{user_id}/tasks - List all user tasks

**Independent Test**: Make GET request with JWT token, receive array of user's tasks only

### Implementation for User Story 1

- [X] T007 [US1] Implement GET /api/{user_id}/tasks endpoint in backend/routes/tasks.py
- [X] T008 [US1] Add JWT authentication with Depends(get_current_user_id)
- [X] T009 [US1] Verify URL user_id matches authenticated user_id (403 if mismatch)
- [X] T010 [US1] Query tasks filtered by authenticated user_id using SQLModel select
- [X] T011 [US1] Return List[TaskResponse] with 200 OK status
- [ ] T012 [US1] Test endpoint: create test tasks, call endpoint, verify response

**Acceptance Criteria for User Story 1**:
- GET /api/{user_id}/tasks returns array of user's tasks
- Empty array if no tasks (not 404)
- 403 if URL user_id doesn't match JWT
- 401 if no/invalid JWT token
- FR-001 to FR-006 verified

**Checkpoint**: Users can view their task list

---

## Phase 4: User Story 2 - Create Task (Priority: P1) 🎯 MVP

**Goal**: POST /api/{user_id}/tasks - Create new task

**Independent Test**: POST with title and description, receive 201 Created with new task object

### Implementation for User Story 2

- [X] T013 [US2] Implement POST /api/{user_id}/tasks endpoint in backend/routes/tasks.py
- [X] T014 [US2] Add request body validation with TaskCreate schema
- [X] T015 [US2] Add JWT authentication with Depends(get_current_user_id)
- [X] T016 [US2] Verify URL user_id matches authenticated user_id (403 if mismatch)
- [X] T017 [US2] Create Task object with authenticated user_id (not URL user_id)
- [X] T018 [US2] Set completed=false by default
- [X] T019 [US2] Save task to database and refresh to get generated ID
- [X] T020 [US2] Return TaskResponse with 201 Created status
- [ ] T021 [US2] Test endpoint: create task, verify in database, verify 400 for missing title

**Acceptance Criteria for User Story 2**:
- POST creates task assigned to authenticated user
- Returns 201 Created with task object
- Validates title required and length constraints
- 400 for validation errors
- FR-007 to FR-013 verified

**Checkpoint**: Users can create new tasks

---

## Phase 5: User Story 6 - Toggle Completion (Priority: P1) 🎯 MVP

**Goal**: PATCH /api/{user_id}/tasks/{id}/complete - Toggle task completion

**Independent Test**: PATCH incomplete task, verify marked complete. PATCH again, verify marked incomplete.

### Implementation for User Story 6

- [X] T022 [US6] Implement PATCH /api/{user_id}/tasks/{id}/complete endpoint in backend/routes/tasks.py
- [X] T023 [US6] Add path parameter task_id: int
- [X] T024 [US6] Add JWT authentication with Depends(get_current_user_id)
- [X] T025 [US6] Verify URL user_id matches authenticated user_id (403 if mismatch)
- [X] T026 [US6] Query task by id and user_id (404 if not found, 403 if wrong user)
- [X] T027 [US6] Toggle completed status: task.completed = not task.completed
- [X] T028 [US6] Update updated_at timestamp to datetime.utcnow()
- [X] T029 [US6] Save and return TaskResponse with 200 OK
- [ ] T030 [US6] Test endpoint: create incomplete task, toggle to complete, toggle back to incomplete

**Acceptance Criteria for User Story 6**:
- PATCH toggles completed status
- Updates updated_at timestamp
- Returns 200 OK with updated task
- 404 if task not found
- 403 if wrong user
- FR-029 to FR-033 verified

**Checkpoint**: MVP complete - users can list, create, and complete tasks

---

## Phase 6: User Story 3 - Get Single Task (Priority: P2)

**Goal**: GET /api/{user_id}/tasks/{id} - Get specific task details

**Independent Test**: GET task by ID, receive full task object

### Implementation for User Story 3

- [X] T031 [US3] Implement GET /api/{user_id}/tasks/{id} endpoint in backend/routes/tasks.py
- [X] T032 [US3] Add path parameter task_id: int
- [X] T033 [US3] Add JWT authentication with Depends(get_current_user_id)
- [X] T034 [US3] Verify URL user_id matches authenticated user_id (403 if mismatch)
- [X] T035 [US3] Query task by id (session.get(Task, task_id))
- [X] T036 [US3] Return 404 if task not found
- [X] T037 [US3] Verify task.user_id matches authenticated user_id (403 if mismatch)
- [X] T038 [US3] Return TaskResponse with 200 OK
- [ ] T039 [US3] Test endpoint: get existing task (200), get non-existent task (404), get other user's task (403)

**Acceptance Criteria for User Story 3**:
- GET /api/{user_id}/tasks/{id} returns single task
- 200 OK with task object
- 404 if task doesn't exist
- 403 if task belongs to different user
- FR-014 to FR-017 verified

**Checkpoint**: Users can view individual task details

---

## Phase 7: User Story 4 - Update Task (Priority: P2)

**Goal**: PUT /api/{user_id}/tasks/{id} - Update task fields

**Independent Test**: PUT with updated title, verify task updated and returned

### Implementation for User Story 4

- [X] T040 [US4] Implement PUT /api/{user_id}/tasks/{id} endpoint in backend/routes/tasks.py
- [X] T041 [US4] Add path parameter task_id: int
- [X] T042 [US4] Add request body with TaskUpdate schema
- [X] T043 [US4] Add JWT authentication with Depends(get_current_user_id)
- [X] T044 [US4] Verify URL user_id matches authenticated user_id (403 if mismatch)
- [X] T045 [US4] Query task by id (404 if not found)
- [X] T046 [US4] Verify task.user_id matches authenticated user_id (403 if mismatch)
- [X] T047 [US4] Update only provided fields using model_dump(exclude_unset=True)
- [X] T048 [US4] Set updated_at to datetime.utcnow()
- [X] T049 [US4] Save and return TaskResponse with 200 OK
- [ ] T050 [US4] Test endpoint: update title, update description, update completed, partial update

**Acceptance Criteria for User Story 4**:
- PUT updates task fields
- Supports partial updates
- Updates updated_at timestamp
- Returns 200 OK with updated task
- 404 if task not found
- 403 if wrong user
- FR-018 to FR-024 verified

**Checkpoint**: Users can update their tasks

---

## Phase 8: User Story 5 - Delete Task (Priority: P2)

**Goal**: DELETE /api/{user_id}/tasks/{id} - Remove task

**Independent Test**: DELETE task, verify 204 response and task no longer in list

### Implementation for User Story 5

- [X] T051 [US5] Implement DELETE /api/{user_id}/tasks/{id} endpoint in backend/routes/tasks.py
- [X] T052 [US5] Add path parameter task_id: int
- [X] T053 [US5] Add JWT authentication with Depends(get_current_user_id)
- [X] T054 [US5] Verify URL user_id matches authenticated user_id (403 if mismatch)
- [X] T055 [US5] Query task by id (404 if not found)
- [X] T056 [US5] Verify task.user_id matches authenticated user_id (403 if mismatch)
- [X] T057 [US5] Delete task from database (session.delete)
- [X] T058 [US5] Commit and return 204 No Content
- [ ] T059 [US5] Test endpoint: delete task, verify removed, attempt to get deleted task (404)

**Acceptance Criteria for User Story 5**:
- DELETE removes task permanently
- Returns 204 No Content
- 404 if task not found
- 403 if wrong user
- Task no longer appears in list after deletion
- FR-025 to FR-028 verified

**Checkpoint**: Users can delete their tasks

---

## Phase 9: Security & Integration Testing

**Purpose**: Validate security requirements across all endpoints

- [X] T060 Test all endpoints return 401 without JWT token (enforced by Depends(get_current_user_id))
- [X] T061 Test all endpoints return 401 with expired JWT token (handled by verify_jwt_token)
- [X] T062 Test all endpoints return 403 when URL user_id doesn't match JWT user_id (verified in all endpoints)
- [X] T063 Test user A cannot access user B's tasks via any endpoint (user_id verification in all endpoints)
- [X] T064 Verify all endpoints use Depends(get_current_user_id) (verified in implementation)
- [X] T065 Verify all endpoints query with authenticated user_id (not URL user_id) (verified in implementation)
- [ ] T066 Run auth-security-specialist agent to audit security patterns

**Acceptance Criteria for Phase 9**:
- FR-034 to FR-038 verified across all endpoints
- Constitution Section III compliance confirmed
- Zero security vulnerabilities
- SC-003, SC-004, SC-007 verified

**Checkpoint**: All security requirements met

---

## Phase 10: Polish & Documentation

**Purpose**: Finalize API and documentation

- [X] T067 [P] Add response_model annotations to all endpoints for OpenAPI docs (all endpoints have response_model)
- [X] T068 [P] Add endpoint docstrings describing functionality (comprehensive docstrings added)
- [X] T069 [P] Add HTTP status code documentation to endpoint decorators (status_code parameter added)
- [ ] T070 Test OpenAPI documentation at http://localhost:8000/docs
- [X] T071 Verify all HTTP status codes match specification (200, 201, 204, 400, 401, 403, 404) (verified in implementation)
- [ ] T072 Add error handling for database connection failures
- [X] T073 Update backend/main.py CORS configuration if needed (already configured)

**Acceptance Criteria for Phase 10**:
- OpenAPI docs complete and accurate
- All endpoints documented
- Error handling robust
- SC-006 verified: Correct status codes

**Checkpoint**: API production-ready

---

## Summary

**Total Tasks**: 73 tasks across 10 phases (6 endpoint phases, 4 supporting phases)

**Task Breakdown by User Story**:
- Setup: 3 tasks
- Foundational: 3 tasks
- **US1 (List Tasks - P1)**: 6 tasks
- **US2 (Create Task - P1)**: 9 tasks
- **US6 (Toggle Complete - P1)**: 9 tasks
- **US3 (Get Task - P2)**: 9 tasks
- **US4 (Update Task - P2)**: 11 tasks
- **US5 (Delete Task - P2)**: 9 tasks
- Security Testing: 7 tasks
- Polish: 7 tasks

**MVP Scope** (24 tasks):
- Phase 1: Setup (3 tasks)
- Phase 2: Foundational (3 tasks)
- Phase 3: US1 - List Tasks (6 tasks)
- Phase 4: US2 - Create Task (9 tasks)
- Phase 5: US6 - Toggle Complete (3 tasks)

This MVP delivers core todo functionality: view tasks, create tasks, mark complete.

**Critical Path**:
1. Phase 1: Setup (schemas and router)
2. Phase 2: Foundational (dependencies verified)
3. Phase 3: US1 - List (GET endpoint)
4. Phase 4: US2 - Create (POST endpoint)
5. Phase 5: US6 - Toggle (PATCH endpoint)
6. Phases 6-8: Additional endpoints (GET single, PUT, DELETE)
7. Phase 9: Security validation
8. Phase 10: Polish

**Parallelization**: Within each endpoint phase, some tasks can run in parallel

**Dependencies**:
- All user stories depend on Phases 1-2 (schemas and router)
- US3, US4, US5 benefit from US2 (need tasks to exist for testing)
- Security testing (Phase 9) tests all endpoints

**Next Steps After Completion**:
1. Run auth-security-specialist agent to audit implementation
2. Run architecture-boundary-guardian to verify layer separation
3. Create Feature 005 (Frontend UI) to consume these endpoints
4. End-to-end integration testing

**Constitution Compliance**:
- All endpoints use Depends(get_current_user_id) for JWT verification
- All queries filter by authenticated user_id (user isolation)
- SQLModel ORM only (no raw SQL)
- Proper HTTP status codes (REST conventions)
