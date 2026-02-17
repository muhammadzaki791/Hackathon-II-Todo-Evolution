# Implementation Plan: Task Organization & Usability Enhancements

**Branch**: `006-task-organization` | **Date**: 2026-02-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-task-organization/spec.md`

## Summary

Extend existing Todo application with task organization features: priority levels (high/medium/low), custom tags, search functionality, status/priority/tag filtering, and sorting options (date/alphabetical/priority). All features must maintain backward compatibility with existing tasks and integrate seamlessly with current UI/backend architecture.

**Technical Approach**:
- Backend: Add priority (string enum) and tags (JSON array) columns to Task table with default values for existing rows
- Backend: Extend GET /tasks endpoint to accept query parameters for search, filtering, and sorting
- Frontend: Add search bar, filter dropdowns, sort selector, and priority/tag UI components to dashboard
- Frontend: Update TaskCard to display priority badges and tag chips
- Frontend: Update TaskForm to include priority dropdown and tag input field

## Technical Context

**Language/Version**: Python 3.11+ (Backend), TypeScript 5.x+ (Frontend)
**Primary Dependencies**:
- Backend: FastAPI, SQLModel, Pydantic v2, PyJWT
- Frontend: Next.js 16+ (App Router), React 18+, Tailwind CSS

**Storage**: Neon Serverless PostgreSQL (existing database)
**Testing**: pytest + httpx (Backend), Jest + React Testing Library + Playwright (Frontend)
**Target Platform**: Web application (Browser + Server)
**Project Type**: Web (monorepo with separate frontend/backend)

**Performance Goals**:
- Search/filter operations: <1 second response time for 100+ tasks
- Database queries: <200ms p95 latency
- UI updates: Real-time (no noticeable delay)

**Constraints**:
- Zero breaking changes to existing API endpoints
- Backward compatibility with existing tasks (default values applied)
- No external UI libraries (Tailwind CSS only)
- All filtering/search/sort operations server-side (not client-side)

**Scale/Scope**:
- Target: 5-100 tasks per user (average)
- Support: Up to 500 tasks per user without performance degradation
- New fields: 2 (priority, tags)
- New UI components: 5 (SearchBar, FilterPanel, SortSelector, PriorityBadge, TagChip)
- Modified components: 2 (TaskCard, TaskForm)
- API changes: 1 endpoint modified (GET /tasks to accept query params)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Section I: Spec-First Development ✅
- ✅ Feature specification exists at `/specs/006-task-organization/spec.md`
- ✅ Specification defines 5 user stories with 21 acceptance scenarios
- ✅ API contracts defined (query parameters for GET /tasks endpoint)
- ✅ Database schema changes documented (priority + tags fields)
- ✅ UI requirements documented (search, filters, sort controls)
- ✅ Implementation follows `/sp.specify → /sp.plan → /sp.tasks → /sp.implement` workflow

### Section II: Strict Architectural Boundaries ✅
- ✅ Frontend: No direct database access - all data via REST API
- ✅ Backend: All business logic (search/filter/sort) handled server-side
- ✅ Database: Accessed only through SQLModel ORM (no raw SQL)
- ✅ Clear separation: Frontend (UI/state) → Backend (logic/validation) → Database (persistence)

### Section III: Security-By-Design ✅
- ✅ All API endpoints require JWT authentication (existing pattern maintained)
- ✅ User data isolation: All queries filtered by authenticated user_id
- ✅ Input validation: Priority values validated (enum), tags validated (array of strings)
- ✅ No new authentication mechanisms (uses existing Better Auth + JWT)
- ✅ CORS policy unchanged (existing frontend origin)

### Section IV: Test-Driven Development ✅
- ✅ Tests required for: Backend filtering/search/sort logic, frontend filter/search UI
- ✅ Integration tests: API endpoints with various query parameter combinations
- ✅ E2E tests: User flows (search → filter → sort → create with priority/tags)
- ✅ Coverage target: 95%+ for new backend logic, component tests for new UI

### Section V: Monorepo Organization ✅
- ✅ Specifications in `/specs/006-task-organization/`
- ✅ Backend code in `/backend/` (models.py, routes/tasks.py, schemas.py)
- ✅ Frontend code in `/frontend/` (components/, app/dashboard/)
- ✅ History in `/history/prompts/006-task-organization/`
- ✅ No new directories required (extends existing structure)

### Section VI: API-First Design ✅
- ✅ RESTful endpoint: GET /api/{user_id}/tasks accepts query parameters
- ✅ Standard HTTP status codes maintained (200, 400, 401, 403, 404)
- ✅ JSON request/response format maintained
- ✅ Query parameters: `search`, `status`, `priority`, `tags`, `sort`
- ✅ Backward compatible: Existing requests without query params work unchanged

### Section VII: Reproducibility & Traceability ✅
- ✅ Specification created and tracked in git
- ✅ PHR created for spec phase
- ✅ ADR will be created for database migration strategy (if needed)
- ✅ All decisions documented in spec or plan
- ✅ Git commits will reference spec file

### Section VIII: AI-Native Development ✅
- ✅ Development via `/sp.*` commands (no manual coding)
- ✅ Agents: `spec-compliance-auditor` (post-implementation), `architecture-boundary-guardian` (validation)
- ✅ Constitution compliance verified throughout workflow
- ✅ PHRs capture all development activities

### Technology Stack Standards ✅
- ✅ Frontend: Next.js 16+ (App Router), TypeScript strict mode, Tailwind CSS only
- ✅ Backend: FastAPI, SQLModel ORM, Pydantic v2 validation
- ✅ Database: Neon Serverless PostgreSQL (no changes to provider)
- ✅ Authentication: Existing Better Auth + JWT (no changes)
- ✅ No external UI frameworks (build custom components with Tailwind)

### Constitution Violations: NONE ✅

All constitution requirements are satisfied. No violations require justification.

## Project Structure

### Documentation (this feature)

```text
specs/006-task-organization/
├── spec.md              # Feature specification (COMPLETE)
├── plan.md              # This file (IN PROGRESS)
├── research.md          # Phase 0 output (TO BE CREATED)
├── data-model.md        # Phase 1 output (TO BE CREATED)
├── quickstart.md        # Phase 1 output (TO BE CREATED)
├── contracts/           # Phase 1 output (TO BE CREATED)
│   └── api-endpoints.md # Query parameter specifications
├── checklists/
│   └── requirements.md  # Spec validation (COMPLETE)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

**Web Application Structure** (existing monorepo - extends current codebase):

```text
backend/
├── models.py                   # MODIFY: Add priority + tags fields to Task model
├── schemas.py                  # MODIFY: Add priority + tags to TaskCreate/TaskUpdate/TaskResponse
├── routes/
│   ├── tasks.py                # MODIFY: Add query parameter handling to GET endpoint
│   └── auth.py                 # NO CHANGE
├── db.py                       # NO CHANGE (database migration handled via SQLModel)
├── auth.py                     # NO CHANGE
├── main.py                     # NO CHANGE
└── tests/
    ├── test_tasks.py           # ADD: Tests for search/filter/sort query parameters
    └── test_auth.py            # NO CHANGE

frontend/
├── types/
│   ├── Task.ts                 # MODIFY: Add priority + tags fields
│   └── User.ts                 # NO CHANGE
├── lib/
│   ├── api.ts                  # MODIFY: Update getTasks to accept query params
│   └── auth.ts                 # NO CHANGE
├── hooks/
│   ├── useTasks.ts             # MODIFY: Add search/filter/sort state and logic
│   └── useAuth.ts              # NO CHANGE
├── components/
│   ├── TaskCard/
│   │   └── TaskCard.tsx        # MODIFY: Display priority badge + tag chips
│   ├── TaskForm/
│   │   └── TaskForm.tsx        # MODIFY: Add priority dropdown + tag input
│   ├── SearchBar/              # NEW COMPONENT
│   │   └── SearchBar.tsx
│   ├── FilterPanel/            # NEW COMPONENT
│   │   └── FilterPanel.tsx
│   ├── SortSelector/           # NEW COMPONENT
│   │   └── SortSelector.tsx
│   ├── PriorityBadge/          # NEW COMPONENT
│   │   └── PriorityBadge.tsx
│   └── TagChip/                # NEW COMPONENT
│       └── TagChip.tsx
├── app/
│   ├── dashboard/
│   │   └── page.tsx            # MODIFY: Add search/filter/sort UI controls
│   ├── login/                  # NO CHANGE
│   └── signup/                 # NO CHANGE
└── tests/
    ├── components/
    │   ├── SearchBar.test.tsx  # NEW TEST
    │   ├── FilterPanel.test.tsx # NEW TEST
    │   └── SortSelector.test.tsx # NEW TEST
    └── e2e/
        └── task-organization.spec.ts # NEW E2E TEST
```

**Structure Decision**: Extends existing web application monorepo. Backend modifications are minimal (add 2 fields to model, extend 1 endpoint with query params). Frontend adds 5 new components and modifies 3 existing components. No new directories required at root level - all changes fit within current `/backend/` and `/frontend/` structure.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations detected. Constitution check passed with 100% compliance.

---

## Phase 0: Research & Technology Decisions

### Research Tasks

#### R1: Database Migration Strategy for Adding Columns
**Question**: How to safely add `priority` and `tags` columns to existing Task table with default values?

**Research Findings**:
- **SQLModel/SQLAlchemy Approach**: Use `create_all()` with model updates - SQLAlchemy will detect new columns and add them (works for simple additions)
- **Default Values**: SQLModel `Field(default="medium")` for priority, `Field(default_factory=list)` for tags
- **Migration Safety**: For production, Alembic is recommended, but for Phase II (existing dev workflow), SQLModel's `create_all()` is sufficient
- **Backward Compatibility**: Existing rows get NULL for new columns initially; application logic applies defaults on first read/update

**Decision**: Use SQLModel `Field(default=...)` with server_default parameter to ensure database-level defaults. This ensures existing tasks automatically get `priority="medium"` and `tags=[]` without manual migration scripts.

**Implementation**:
```python
# backend/models.py
class Task(SQLModel, table=True):
    # ... existing fields ...
    priority: str = Field(default="medium", sa_column_kwargs={"server_default": "medium"})
    tags: List[str] = Field(default_factory=list, sa_column=Column(JSON, server_default="[]"))
```

---

#### R2: PostgreSQL Full-Text Search vs LIKE for Task Search
**Question**: Should we use PostgreSQL full-text search (tsvector/tsquery) or simple ILIKE for title/description search?

**Research Findings**:
- **LIKE/ILIKE Approach**:
  - Simple: `WHERE title ILIKE '%keyword%' OR description ILIKE '%keyword%'`
  - Performance: Acceptable for <1000 tasks, especially with GIN indexes on text columns
  - Supports partial matching by default
  - Case-insensitive with ILIKE

- **Full-Text Search Approach**:
  - Complex: Requires tsvector columns, ts_query functions
  - Performance: Better for large datasets (10k+ rows) and complex queries
  - More features: Ranking, stemming, stop words
  - Overhead: Additional indexes and query complexity

**Decision**: Use ILIKE (case-insensitive LIKE) for simplicity. Rationale:
- User base: 5-100 tasks per user (avg), max 500 tasks
- Requirement: Partial word matching (ILIKE supports this)
- Performance target: <1 second for 100 tasks (ILIKE achieves this with index)
- Simplicity: No need for tsvector setup or complex query syntax

**Implementation**:
```python
# Backend query logic
if search:
    query = query.filter(
        or_(
            Task.title.ilike(f"%{search}%"),
            Task.description.ilike(f"%{search}%")
        )
    )
```

**Index Strategy**: Add GIN indexes on title and description for ILIKE performance:
```python
Index('idx_task_title_gin', Task.title, postgresql_using='gin', postgresql_ops={'title': 'gin_trgm_ops'})
Index('idx_task_description_gin', Task.description, postgresql_using='gin', postgresql_ops={'description': 'gin_trgm_ops'})
```

---

#### R3: JSON vs Array Column Type for Tags in PostgreSQL
**Question**: Should tags be stored as JSON array or PostgreSQL native array type?

**Research Findings**:
- **JSON Array** (`tags: JSON = ["work", "urgent"]`):
  - Flexible: Can store complex structures if needed later
  - SQLModel support: Use `Column(JSON)` with `List[str]` type hint
  - Query: Use `@>` operator for containment checks
  - Index: GIN index on JSON column for fast tag filtering

- **Native Array** (`tags: ARRAY(TEXT)`):
  - Typed: Database enforces string array type
  - Query: Use `ANY` or `@>` operators for membership
  - SQLModel support: Less direct (requires custom column type)
  - Index: GIN index on array column

**Decision**: Use JSON column with `List[str]` type hint. Rationale:
- SQLModel integration: Direct support via `Column(JSON)` with Pydantic `List[str]`
- Flexibility: Easy to extend tag structure later if needed (e.g., tag metadata)
- Querying: PostgreSQL JSON operators (`@>`, `?`) are powerful and well-indexed
- Validation: Pydantic validates array of strings on application layer

**Implementation**:
```python
# backend/models.py
from sqlalchemy import Column, JSON
from typing import List

class Task(SQLModel, table=True):
    tags: List[str] = Field(default_factory=list, sa_column=Column(JSON, server_default="[]"))
```

**Query for Tag Filtering**:
```python
# Check if task has specific tag
if tag_filter:
    query = query.filter(Task.tags.op('@>')(f'["{tag_filter}"]'))
```

---

#### R4: Frontend State Management for Search/Filter/Sort
**Question**: How to manage search, filter, and sort state in the frontend dashboard?

**Research Findings**:
- **URL Query Parameters**:
  - Pros: Shareable URLs, browser back/forward support, persistent state across refreshes
  - Cons: Complexity with Next.js App Router, URL encoding for tags
  - Implementation: `useSearchParams()` + `useRouter()`

- **React Local State (useState)**:
  - Pros: Simple, fast updates, no URL pollution
  - Cons: State lost on refresh, not shareable
  - Implementation: `useState()` for each filter + debounced API calls

- **Custom Hook (useTasks with filters)**:
  - Pros: Centralized logic, reusable, clean component code
  - Cons: Requires custom hook design
  - Implementation: Extend `useTasks` hook to accept filter params

**Decision**: Use React local state (useState) within dashboard component. Rationale:
- Spec priority: P1 (search), P2 (filters), P3 (sort) - not critical to persist across refreshes
- Simplicity: Faster development, less complexity than URL state management
- User expectation: Filter state persistence is not a core requirement in spec
- Future enhancement: Can add URL persistence later if user feedback requests it

**Implementation**:
```typescript
// frontend/app/dashboard/page.tsx
const [searchQuery, setSearchQuery] = useState('');
const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
const [tagFilter, setTagFilter] = useState<string | null>(null);
const [sortOrder, setSortOrder] = useState<'date' | 'alpha' | 'priority'>('date');

// Pass filters to useTasks hook
const { tasks, isLoading } = useTasks(userId, {
  search: searchQuery,
  status: statusFilter,
  priority: priorityFilter,
  tag: tagFilter,
  sort: sortOrder
});
```

---

#### R5: Tag Input UI Pattern (Autocomplete vs Free Text)
**Question**: Should tag input use autocomplete (suggest existing tags) or free-text input?

**Research Findings**:
- **Autocomplete with Existing Tags**:
  - Pros: Consistency (reuse existing tags), prevents typos, better UX
  - Cons: Requires fetching all user's unique tags, more complex UI component
  - Implementation: Fetch unique tags from backend, render dropdown on input focus

- **Free-Text Input**:
  - Pros: Simple implementation, full user control, no backend query needed
  - Cons: Tag proliferation (typos create duplicates), inconsistent naming
  - Implementation: Simple input field + "Enter to add" pattern

**Decision**: Start with free-text input, add autocomplete in future iteration. Rationale:
- Spec requirement: "Users can add tags" - no explicit autocomplete requirement
- Simplicity: Faster MVP, fewer API calls
- User expectation: Most task managers allow free-form tagging initially
- Performance: No additional backend query to fetch unique tags
- Future enhancement: Track user feedback; add autocomplete if tag proliferation becomes an issue

**Implementation (MVP)**:
```typescript
// frontend/components/TaskForm/TaskForm.tsx
<input
  type="text"
  placeholder="Type tag and press Enter"
  onKeyDown={(e) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      e.preventDefault();
      addTag(e.currentTarget.value.trim());
      e.currentTarget.value = '';
    }
  }}
/>
```

---

### Research Summary

All technical unknowns resolved. Key decisions:
1. **Database Migration**: SQLModel with server defaults (no manual migration needed)
2. **Search Implementation**: PostgreSQL ILIKE (simple, sufficient for scale)
3. **Tags Storage**: JSON column (flexible, well-supported by SQLModel)
4. **State Management**: React local state (simple, meets requirements)
5. **Tag Input**: Free-text with Enter key (MVP, future autocomplete)

No additional research or external dependencies required. Ready to proceed to Phase 1 (Data Model & Contracts).

---

*Research findings documented in: `/specs/006-task-organization/research.md` (to be created)*

## Phase 1: Data Model & Contracts ✅ COMPLETE

### Artifacts Created

1. **data-model.md** ✅
   - Task entity with priority (string enum) and tags (JSON array) fields
   - Validation rules and constraints
   - State transitions and backward compatibility strategy
   - Database indexes for performance (priority, tags GIN index)
   - Query performance estimates

2. **contracts/api-endpoints.md** ✅
   - Modified GET /tasks endpoint with query parameters
   - TaskQueryParams schema (search, status, priority, tags, sort)
   - Request/response examples for all filter combinations
   - Pydantic schemas for validation
   - OpenAPI specification updates
   - Error response definitions

3. **quickstart.md** ✅
   - Step-by-step implementation guide
   - Code examples for all major changes
   - Testing guide with curl commands
   - Troubleshooting section
   - Acceptance checklist
   - Estimated effort: ~6 hours total

4. **Agent Context Updated** ✅
   - CLAUDE.md updated with Python 3.11+ and TypeScript 5.x+ technologies
   - Database context (Neon PostgreSQL) confirmed
   - Project type (Web monorepo) documented

### Phase 1 Summary

**Data Model Changes**:
- Task entity extended with 2 new fields (priority, tags)
- Default values ensure backward compatibility (medium, [])
- JSON storage for tags (flexible, indexed)
- Priority enum validated (high/medium/low)

**API Contracts**:
- GET /tasks accepts 5 optional query parameters
- Backward compatible (no query params = existing behavior)
- Combined filters use AND logic
- Sort applied after filtering

**Implementation Approach**:
- Backend: SQLModel server defaults (no manual migration)
- Search: PostgreSQL ILIKE (simple, sufficient for scale)
- Frontend: React local state (simple, meets requirements)
- Tag input: Free-text with Enter key (MVP)

### Constitution Re-Check ✅

All constitution requirements remain satisfied after Phase 1 design:
- ✅ No breaking API changes
- ✅ Backward compatible data model
- ✅ Security patterns maintained (JWT + user isolation)
- ✅ Architectural boundaries respected
- ✅ Technology stack unchanged (FastAPI + Next.js + PostgreSQL)

**Phase 1 Status**: COMPLETE - Ready for `/sp.tasks` command to generate task breakdown.

---

## Phase 2: Task Breakdown

**Command**: `/sp.tasks`

**Expected Output**: `specs/006-task-organization/tasks.md` with:
- Dependency-ordered task list
- Backend tasks (model, schemas, routes, tests)
- Frontend tasks (types, API client, components, tests)
- Integration and E2E testing tasks

**Estimated Tasks**: ~25-30 tasks across backend, frontend, and testing

*This phase is NOT part of `/sp.plan` command. Run `/sp.tasks` separately.*
