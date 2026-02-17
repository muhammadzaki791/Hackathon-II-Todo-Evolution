# Tasks: Database Schema and Persistence

**Input**: Specification from `/specs/003-database-schema/spec.md`, Plan from `/specs/003-database-schema/plan.md`, Data Model from `/specs/003-database-schema/data-model.md`
**Prerequisites**: Models already implemented in `backend/models.py` (Feature 002, Phase 2)

**Task Type**: **Validation Tasks** (verify existing implementation, not new development)

**Organization**: Tasks validate that existing models meet specification requirements.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (independent validation checks)
- **[Story]**: Which user story this validation supports (US1, US2, US3)
- All paths are relative to repository root

---

## Phase 1: Schema Validation (User & Task Models)

**Purpose**: Verify backend/models.py contains correct entity definitions

- [x] T001 [P] Verify User model exists in backend/models.py with correct class name and table name
- [x] T002 [P] Verify User model has id field (Optional[str], primary_key=True) - FR-001
- [x] T003 [P] Verify User model has email field (unique=True, nullable=False, index=True) - FR-001, FR-002, FR-007
- [x] T004 [P] Verify User model has password_hash field (nullable=False) - FR-001
- [x] T005 [P] Verify User model has name field (Optional[str]) - FR-001
- [x] T006 [P] Verify User model has created_at field (default_factory=datetime.utcnow) - FR-001, FR-008
- [x] T007 [P] Verify User model has updated_at field (default_factory=datetime.utcnow) - FR-001, FR-009
- [x] T008 [P] Verify Task model exists in backend/models.py with correct class name and table name
- [x] T009 [P] Verify Task model has id field (Optional[int], primary_key=True) - FR-003
- [x] T010 [P] Verify Task model has user_id field (str, index=True, nullable=False, foreign_key="users.id") - FR-003, FR-004, FR-005, FR-007
- [x] T011 [P] Verify Task model has title field (str, max_length=200, nullable=False) - FR-003, FR-005, FR-010
- [x] T012 [P] Verify Task model has description field (Optional[str], max_length=1000) - FR-003, FR-011
- [x] T013 [P] Verify Task model has completed field (bool, default=False) - FR-003, FR-006
- [x] T014 [P] Verify Task model has created_at field (default_factory=datetime.utcnow) - FR-003, FR-008
- [x] T015 [P] Verify Task model has updated_at field (default_factory=datetime.utcnow) - FR-003, FR-009

**Acceptance Criteria for Phase 1**:
- All User model fields present with correct types and constraints
- All Task model fields present with correct types and constraints
- Models follow SQLModel pattern (inherit from SQLModel, table=True)
- FR-001 to FR-011 verified

**Verification Method**:
```bash
cat backend/models.py | grep "class User"
cat backend/models.py | grep "class Task"
# Manual inspection of field definitions
```

---

## Phase 2: Database Configuration Validation

**Purpose**: Verify database engine and initialization are configured correctly

- [x] T016 Verify DATABASE_URL environment variable is configured in backend/.env - FR-013
- [x] T017 Verify database engine created in backend/main.py with pool_pre_ping=True - FR-013, FR-015
- [x] T018 Verify connection pool configuration (pool_size=5, max_overflow=10) - FR-015
- [x] T019 Verify create_db_and_tables function calls SQLModel.metadata.create_all - FR-014
- [x] T020 Verify on_startup event handler calls create_db_and_tables - FR-014
- [x] T021 Verify no raw SQL queries in backend codebase (grep for "execute", "raw", "text(") - FR-012

**Acceptance Criteria for Phase 2**:
- Database engine configured for Neon serverless
- Connection pooling properly configured
- Tables initialized on startup
- SQLModel ORM used exclusively (no raw SQL)
- FR-012 to FR-015 verified

**Verification Method**:
```bash
cat backend/.env | grep "DATABASE_URL"
cat backend/main.py | grep "create_engine"
cat backend/main.py | grep "pool_pre_ping"
cat backend/main.py | grep "create_db_and_tables"
grep -r "execute\|\.raw\|text(" backend/ --exclude-dir=__pycache__
```

---

## Phase 3: User Story 1 - Task Persistence Validation (Priority: P1) 🎯 MVP

**Goal**: Verify tasks persist across application restarts and user sessions

**Independent Test**: Create tasks, restart backend, verify tasks still exist

### Validation Tasks for User Story 1

- [ ] T022 [US1] Verify SQLModel.metadata.create_all creates tables in database
- [ ] T023 [US1] Test creating a User record via SQLModel and verify it persists
- [ ] T024 [US1] Test creating a Task record via SQLModel and verify it persists
- [ ] T025 [US1] Test restarting backend application and verify existing tasks remain
- [ ] T026 [US1] Verify tasks retain title, description, and completed status after restart

**Acceptance Criteria for User Story 1**:
- Tables created successfully in Neon PostgreSQL
- User records persist after insert
- Task records persist after insert
- Data survives application restart
- All fields retain correct values
- SC-001 verified: 100% data retention

**Test Method** (requires DATABASE_URL configured):
```python
# Create test user and task
from sqlmodel import Session, select
from backend.models import User, Task
from backend.main import engine

with Session(engine) as session:
    # Create user
    user = User(id="test-uuid", email="test@example.com", password_hash="hashed")
    session.add(user)
    session.commit()

    # Create task
    task = Task(user_id=user.id, title="Test Task", description="Test")
    session.add(task)
    session.commit()

    # Verify retrieval
    tasks = session.exec(select(Task).where(Task.user_id == user.id)).all()
    assert len(tasks) == 1
    assert tasks[0].title == "Test Task"
```

**Checkpoint**: Task persistence verified

---

## Phase 4: User Story 2 - User-Task Ownership Validation (Priority: P1) 🎯 MVP

**Goal**: Verify user isolation and foreign key constraints work correctly

**Independent Test**: Create two users with different tasks, verify queries filter by user_id correctly

### Validation Tasks for User Story 2

- [ ] T027 [US2] Verify foreign key constraint enforced (cannot create task with invalid user_id)
- [ ] T028 [US2] Test creating tasks for multiple users and verify each user sees only their own
- [ ] T029 [US2] Verify querying with SELECT...WHERE user_id filters correctly
- [ ] T030 [US2] Test attempting to access another user's task (should fail or return empty)
- [ ] T031 [US2] Verify user_id index exists and is used in query plans

**Acceptance Criteria for User Story 2**:
- Foreign key constraint prevents invalid user_id
- Queries filtered by user_id return correct subset
- User A cannot see User B's tasks
- Index on user_id improves query performance
- SC-002 verified: 100% user isolation

**Test Method**:
```python
# Test user isolation
with Session(engine) as session:
    # Create two users
    user_a = User(id="user-a-uuid", email="a@example.com", password_hash="hash")
    user_b = User(id="user-b-uuid", email="b@example.com", password_hash="hash")
    session.add(user_a)
    session.add(user_b)
    session.commit()

    # Create tasks
    task_a1 = Task(user_id=user_a.id, title="A's Task 1")
    task_a2 = Task(user_id=user_a.id, title="A's Task 2")
    task_b1 = Task(user_id=user_b.id, title="B's Task 1")
    session.add_all([task_a1, task_a2, task_b1])
    session.commit()

    # Verify isolation
    a_tasks = session.exec(select(Task).where(Task.user_id == user_a.id)).all()
    assert len(a_tasks) == 2  # User A sees only their 2 tasks

    b_tasks = session.exec(select(Task).where(Task.user_id == user_b.id)).all()
    assert len(b_tasks) == 1  # User B sees only their 1 task
```

**Checkpoint**: User isolation verified

---

## Phase 5: User Story 3 - Automatic Timestamps Validation (Priority: P2)

**Goal**: Verify created_at and updated_at timestamps are set automatically

**Independent Test**: Create task, verify created_at. Update task, verify updated_at changes.

### Validation Tasks for User Story 3

- [ ] T032 [US3] Verify created_at is set automatically on task creation (default_factory works)
- [ ] T033 [US3] Verify created_at is set automatically on user creation
- [ ] T034 [US3] Test updating a task and verify updated_at is updated (application must handle this)
- [ ] T035 [US3] Verify timestamps are in UTC format
- [ ] T036 [US3] Test sorting tasks by created_at works correctly

**Acceptance Criteria for User Story 3**:
- created_at automatically set on insert
- updated_at can be updated manually (application responsibility)
- Timestamps are UTC datetimes
- Sorting by timestamp works correctly
- SC-005 verified: Timestamps accurate within 1 second

**Test Method**:
```python
import time
from datetime import datetime

with Session(engine) as session:
    # Create task
    before = datetime.utcnow()
    task = Task(user_id="test-user", title="Time Test")
    session.add(task)
    session.commit()
    session.refresh(task)
    after = datetime.utcnow()

    # Verify created_at in range
    assert before <= task.created_at <= after
    assert task.created_at == task.updated_at  # Initially same

    # Update task
    time.sleep(1)
    task.title = "Updated Title"
    task.updated_at = datetime.utcnow()  # App must set this
    session.add(task)
    session.commit()
    session.refresh(task)

    # Verify updated_at changed
    assert task.updated_at > task.created_at
```

**Checkpoint**: Automatic timestamps verified

---

## Phase 6: Constitution Compliance Validation

**Purpose**: Verify implementation follows all constitution requirements

- [ ] T037 Verify backend/models.py uses SQLModel ORM (no raw SQL classes)
- [ ] T038 Verify no raw SQL queries in backend/ directory (grep for execute, text, raw SQL)
- [ ] T039 Verify user_id field exists on Task model (user isolation requirement)
- [ ] T040 Verify user_id has index=True (performance requirement)
- [ ] T041 Verify email has unique=True constraint (prevents duplicates)
- [ ] T042 Verify connection pool has pool_pre_ping=True (Neon serverless requirement)
- [ ] T043 Verify all timestamp fields use datetime.utcnow (UTC requirement)

**Acceptance Criteria for Phase 6**:
- Constitution Section II compliance: SQLModel ORM only
- Constitution Section III compliance: User isolation enforced
- Technology Stack compliance: Neon + SQLModel (no alternatives)
- No violations found

**Verification Method**:
```bash
# Check for raw SQL
grep -r "execute\|\.raw\|text(" backend/ --exclude-dir=__pycache__ --exclude="*.pyc"

# Verify SQLModel usage
cat backend/models.py | grep "from sqlmodel import"

# Verify user_id field
cat backend/models.py | grep "user_id.*Field"

# Verify pool configuration
cat backend/main.py | grep "pool_pre_ping"
```

**Checkpoint**: Constitution compliance verified

---

## Phase 7: Performance & Integration Validation

**Purpose**: Verify database performs within specification limits

- [ ] T044 Test database connection with actual Neon PostgreSQL instance
- [ ] T045 Verify connection pool allows 15 concurrent connections (pool_size + max_overflow)
- [ ] T046 Test query performance with 100 tasks for one user (should be <100ms)
- [ ] T047 Test query performance with 10,000 tasks for one user (should be <100ms) - SC-003
- [ ] T048 Verify indexes are actually created in database (query PostgreSQL system tables)
- [ ] T049 Test email uniqueness constraint with duplicate insert attempt (should fail)
- [ ] T050 Test foreign key constraint with invalid user_id (should fail)

**Acceptance Criteria for Phase 7**:
- Connection to Neon successful
- Connection pooling handles concurrent requests
- Query performance meets SC-003 (<100ms for 10,000 tasks)
- Indexes created and used by query planner
- Constraints enforced at database level
- SC-003, SC-006, SC-007, SC-008 verified

**Test Method** (requires Neon DATABASE_URL):
```bash
# Start backend
cd backend
uvicorn main:app --reload

# Check logs for "Creating database tables..."
# Check logs for "Database tables created successfully"

# Connect to database and verify schema
psql $DATABASE_URL -c "\d users"
psql $DATABASE_URL -c "\d tasks"
psql $DATABASE_URL -c "\di"  # List indexes
```

**Checkpoint**: Database performance and integration verified

---

## Summary

**Total Tasks**: 50 validation tasks across 7 phases

**Task Breakdown**:
- Phase 1: Schema Validation (T001-T015) - 15 tasks
- Phase 2: Database Config Validation (T016-T021) - 6 tasks
- Phase 3: User Story 1 - Persistence (T022-T026) - 5 tasks
- Phase 4: User Story 2 - Ownership (T027-T031) - 5 tasks
- Phase 5: User Story 3 - Timestamps (T032-T036) - 5 tasks
- Phase 6: Constitution Compliance (T037-T043) - 7 tasks
- Phase 7: Performance & Integration (T044-T050) - 7 tasks

**Validation Strategy**:
- **Code Inspection**: Phases 1-2 (verify models.py and main.py structure)
- **Manual Testing**: Phases 3-5 (test with actual database)
- **Constitution Audit**: Phase 6 (verify compliance)
- **Performance Testing**: Phase 7 (benchmark queries)

**Parallelization**: Most tasks in Phases 1-2 can run in parallel (all marked [P])

**Dependencies**:
- Phases 1-2: Independent (code inspection only)
- Phases 3-5: Require working DATABASE_URL to Neon
- Phase 6: Can run in parallel with Phases 3-5
- Phase 7: Requires Phases 3-5 complete (needs test data)

**MVP Scope** (Minimal Validation):
- Phase 1: Schema validation (15 tasks) - Verify models exist
- Phase 2: Config validation (6 tasks) - Verify database setup
- Phase 3: Persistence test (5 tasks) - Basic functionality

**Full Validation** (All User Stories):
- All phases (50 tasks) - Complete verification

**Implementation Status**:
- ✅ **Already Implemented**: All models exist in backend/models.py
- ✅ **Already Configured**: Database initialization in backend/main.py
- **This Feature**: Validates existing code matches specification

**Next Steps After Completion**:
1. All validation tasks verify existing implementation
2. Move to Feature 004 (Task CRUD API) which uses these models
3. Integration testing with authentication (Feature 002)
4. End-to-end testing of full stack

**Note**: This is a **validation exercise**, not new development. All tasks verify existing code from Feature 002.
