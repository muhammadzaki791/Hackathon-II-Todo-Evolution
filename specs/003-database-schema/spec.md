# Feature Specification: Database Schema and Persistence

**Feature Branch**: `003-database-schema`
**Created**: 2026-02-06
**Status**: Draft
**Input**: User description: "Database Schema and Persistence - The application must persist tasks in a PostgreSQL database using SQLModel. Each task must belong to a single authenticated user."

**Note**: This specification documents the database schema that supports both authentication (Feature 002) and task management features. Models already implemented in `backend/models.py`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Task Persistence Across Sessions (Priority: P1)

As a user, I need my tasks to be saved in the database so that when I sign out and sign back in, all my tasks are still available.

**Why this priority**: Without persistence, users lose all their work when they close the browser. This is the core value proposition of the application.

**Independent Test**: User creates 3 tasks, signs out, closes browser, reopens, signs in - all 3 tasks are still present.

**Acceptance Scenarios**:

1. **Given** I am signed in and have created 5 tasks, **When** I sign out and sign back in, **Then** all 5 tasks are still present
2. **Given** I create a task and immediately close my browser, **When** I reopen the browser and sign in, **Then** the task I created is still there
3. **Given** I mark a task as completed, **When** I sign out and sign back in, **Then** the task is still marked as completed

---

### User Story 2 - User-Task Ownership (Priority: P1)

As the system, I need to associate each task with its owner (user) so that users only see their own tasks and cannot access other users' tasks.

**Why this priority**: Multi-user data isolation is a security requirement. Without proper ownership, users could access each other's data, violating privacy and security.

**Independent Test**: Create two users (User A and User B). User A creates 3 tasks, User B creates 2 tasks. User A can only see their 3 tasks, User B can only see their 2 tasks.

**Acceptance Scenarios**:

1. **Given** User A has created 3 tasks and User B has created 2 tasks, **When** User A views their task list, **Then** they see only their 3 tasks
2. **Given** User A knows the ID of a task belonging to User B, **When** User A attempts to access that task via API, **Then** they receive a 403 Forbidden error
3. **Given** a task exists in the database, **When** querying the tasks table, **Then** each task has a user_id field identifying its owner

---

### User Story 3 - Automatic Timestamps (Priority: P2)

As a user, I want to see when I created and last updated each task so that I can track task history.

**Why this priority**: Timestamps provide context and history, but the application can function without them initially. Lower priority than core persistence and ownership.

**Independent Test**: User creates a task, notes the created_at timestamp, waits 5 seconds, updates the task, verifies updated_at timestamp is newer than created_at.

**Acceptance Scenarios**:

1. **Given** I create a new task, **When** I view the task details, **Then** I see a created_at timestamp matching the creation time
2. **Given** I update an existing task, **When** I save the changes, **Then** the updated_at timestamp is updated to the current time
3. **Given** I have multiple tasks, **When** I sort them by creation date, **Then** they appear in chronological order

---

### Edge Cases

- **Database Connection Loss**: What happens if the database connection is lost during a write operation? (Transaction rolls back, user sees error message, no partial data)
- **Concurrent Updates**: What happens if two browser tabs update the same task simultaneously? (Last write wins - no conflict resolution in Phase II)
- **Large Task Descriptions**: What is the maximum description length? (1000 characters - enforced by database constraint)
- **User Deletion**: What happens to tasks if a user is deleted? (Out of scope - user deletion not supported in Phase II)
- **Null Values**: Can title or user_id be null? (No - both are required fields with NOT NULL constraints)
- **Boolean Default**: What is the default completed status for new tasks? (False - tasks start as incomplete)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Database MUST store user records with id, email, password_hash, name, created_at, updated_at fields
- **FR-002**: Database MUST enforce unique constraint on user email addresses
- **FR-003**: Database MUST store task records with id, user_id, title, description, completed, created_at, updated_at fields
- **FR-004**: Database MUST enforce foreign key constraint from tasks.user_id to users.id
- **FR-005**: Database MUST enforce NOT NULL constraint on tasks.title and tasks.user_id
- **FR-006**: Database MUST set default value of false for tasks.completed field
- **FR-007**: Database MUST create indexes on users.email and tasks.user_id for query performance
- **FR-008**: Database MUST automatically set created_at timestamp when records are created
- **FR-009**: Database MUST automatically update updated_at timestamp when records are modified
- **FR-010**: Database MUST enforce maximum length of 200 characters for task title
- **FR-011**: Database MUST enforce maximum length of 1000 characters for task description
- **FR-012**: System MUST use SQLModel ORM for all database operations (no raw SQL)
- **FR-013**: System MUST use Neon Serverless PostgreSQL as database provider
- **FR-014**: System MUST initialize database tables on application startup using SQLModel.metadata.create_all
- **FR-015**: System MUST use connection pooling configured for serverless (pool_pre_ping=True)

### Key Entities

- **User**: Represents an authenticated user account
  - Attributes: id (string/UUID, primary key), email (string, unique, indexed), password_hash (string, hashed), name (string, optional), created_at (datetime), updated_at (datetime)
  - Relationships: One user owns many tasks (one-to-many)
  - Constraints: Email must be unique, email must be indexed for lookup performance

- **Task**: Represents a todo item owned by a user
  - Attributes: id (integer, primary key, auto-increment), user_id (string/UUID, foreign key to users.id, indexed), title (string, max 200 chars, required), description (string, max 1000 chars, optional), completed (boolean, default false), created_at (datetime), updated_at (datetime)
  - Relationships: Many tasks belong to one user (many-to-one)
  - Constraints: user_id must reference valid user, title required, user_id indexed for filtering

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Tasks persist across user sessions with 100% data retention
- **SC-002**: Users can only access their own tasks (100% user isolation enforcement)
- **SC-003**: Database queries return results in under 100ms for up to 10,000 tasks per user
- **SC-004**: Zero data loss during normal operations (transactions, rollbacks work correctly)
- **SC-005**: Automatic timestamps are accurate within 1 second of actual creation/update time
- **SC-006**: Email uniqueness is enforced (0% duplicate email registrations succeed)
- **SC-007**: Foreign key constraints prevent orphaned tasks (tasks without valid users cannot exist)
- **SC-008**: Connection pooling handles concurrent requests efficiently (no connection exhaustion under normal load)

## Assumptions *(include if making significant assumptions)*

1. **No Migrations**: Database schema is created via SQLModel.metadata.create_all (no Alembic migrations in Phase II)
2. **Auto-Increment IDs**: Task IDs are auto-incrementing integers (simpler than UUIDs for Phase II)
3. **UUID for Users**: User IDs are UUIDs managed by Better Auth (not auto-increment integers)
4. **UTC Timestamps**: All timestamps stored in UTC (no timezone conversions)
5. **No Soft Deletes**: Deleted tasks are permanently removed from database (no deleted_at field)
6. **No Audit Trail**: No history tracking for task modifications (single version only)
7. **Single Database**: All tables in single Neon PostgreSQL database (no separate auth database)
8. **Connection Pooling**: Pool size of 5 with max overflow of 10 is sufficient for Phase II load
9. **No Indexes on Completed**: No index on tasks.completed field (not frequently queried alone)
10. **Last Write Wins**: No optimistic locking or conflict resolution for concurrent updates

## Dependencies & Constraints *(include if external dependencies exist)*

### Dependencies

- **Constitution v1.1.0**: Must comply with Section II (Architectural Boundaries) and Technology Stack
- **Neon PostgreSQL Account**: Active Neon project with database provisioned
- **DATABASE_URL**: Connection string environment variable configured in both frontend (.env.local) and backend (.env)
- **SQLModel Library**: Installed in backend (pip install sqlmodel)
- **psycopg2-binary**: PostgreSQL driver installed (pip install psycopg2-binary)

### Constraints

- **Database Provider**: MUST use Neon Serverless PostgreSQL (no alternatives - constitution requirement)
- **ORM**: MUST use SQLModel exclusively (no raw SQL, no other ORMs - constitution requirement)
- **Connection String**: MUST use DATABASE_URL environment variable (never hardcoded)
- **User ID Type**: MUST match Better Auth's UUID format for users (string, not integer)
- **Foreign Key**: tasks.user_id MUST reference users.id (enforce referential integrity)
- **No Raw SQL**: All queries through SQLModel (select, insert, update, delete methods)
- **Serverless Config**: Connection pool MUST use pool_pre_ping=True for Neon compatibility

## Out of Scope *(clarify what's NOT included)*

- **Database Migrations**: No Alembic migration files (SQLModel.create_all only)
- **Soft Deletes**: No deleted_at field or soft delete functionality
- **Audit Trail**: No history tracking or versioning of record changes
- **Full-Text Search**: No PostgreSQL full-text search indexes
- **Analytics Tables**: No separate analytics, reporting, or aggregation tables
- **Caching Layer**: No Redis or in-memory caching (database only)
- **Read Replicas**: No read-only database replicas
- **Sharding**: No database sharding or partitioning
- **Backup Configuration**: No automated backup configuration (relies on Neon's built-in backups)
- **Performance Monitoring**: No query performance monitoring or slow query logging

## Notes *(optional - for additional context)*

### Database Architecture

This specification documents the database layer supporting Phase II features:

1. **Users Table** (managed by Better Auth):
   - Stores user authentication information
   - Primary key: UUID string
   - Unique constraint on email
   - Index on email for login lookups

2. **Tasks Table**:
   - Stores todo items for each user
   - Primary key: Auto-increment integer
   - Foreign key: user_id → users.id
   - Index on user_id for efficient user-specific queries
   - Boolean completed flag for task status

3. **Relationships**:
   - One-to-Many: User (1) → Tasks (N)
   - Cascade behavior: No cascades defined (user deletion out of scope)

### SQLModel Benefits

Using SQLModel provides:
- **Type Safety**: Python type hints integrated with Pydantic validation
- **ORM and Pydantic**: Single class definition for both database and API schemas
- **FastAPI Integration**: Seamless integration with FastAPI endpoints
- **Migration Path**: Can add Alembic migrations later without rewriting models
- **Query Safety**: Parameterized queries prevent SQL injection

### Neon Serverless PostgreSQL

Neon provides:
- **Serverless Scaling**: Automatic scaling based on load
- **Connection Pooling**: Built-in pooler for connection management
- **Branching**: Database branching for testing (not used in Phase II)
- **Point-in-Time Recovery**: Automatic backups
- **Cold Start Handling**: pool_pre_ping=True validates connections before use

### Connection Configuration

```python
# backend/main.py (already implemented)
engine = create_engine(
    DATABASE_URL,
    echo=True,  # SQL logging in development
    pool_pre_ping=True,  # Verify connections for serverless
    pool_size=5,  # Concurrent connections
    max_overflow=10  # Additional connections under load
)
```

### Schema Evolution

For Phase III (AI Chatbot) or future phases:
- Add Alembic migrations for schema changes
- Consider adding soft deletes (deleted_at field)
- Consider adding audit trail tables
- Consider adding full-text search on task titles/descriptions
- Consider adding task tags or categories

### Performance Considerations

**Indexes:**
- users.email: Fast email lookups during signin
- tasks.user_id: Fast filtering of tasks by user (most common query)
- Primary keys automatically indexed

**Query Patterns:**
- Most queries filter by user_id (indexed)
- Task listing: `SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC`
- Single task: `SELECT * FROM tasks WHERE id = ? AND user_id = ?` (security check)

**Connection Pooling:**
- Pool size 5: Handles typical web traffic
- Max overflow 10: Handles traffic spikes
- pool_pre_ping: Prevents stale connection errors with serverless

### Success Validation

This database schema is successful when:
1. User and Task models created via SQLModel
2. Foreign key relationship enforced (tasks → users)
3. Indexes created on email and user_id
4. Automatic timestamps working (created_at, updated_at)
5. Data persists across application restarts
6. User isolation enforced at query level
7. Connection pooling handles concurrent requests
8. No raw SQL in application code

### Implementation Status

**✅ Already Implemented** (Feature 002 - Phase 2):
- User model in `backend/models.py`
- Task model in `backend/models.py`
- Database initialization in `backend/main.py`
- Connection pooling configured
- SQLModel ORM integration

**This Specification Documents**:
- Schema requirements and rationale
- Entity relationships and constraints
- Performance considerations
- Constitution compliance
- Success criteria for validation

### Next Steps

This is a **documentation and validation** spec:
1. Validate existing models.py matches all FR requirements
2. Verify database initialization works correctly
3. Test data persistence and user isolation
4. Confirm indexes are created properly
5. Validate connection pooling for Neon

No new implementation needed - models already created during authentication setup.
