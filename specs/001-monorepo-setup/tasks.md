# Tasks: Project Architecture and Monorepo Setup

**Input**: Specification from `/specs/001-monorepo-setup/spec.md`
**Prerequisites**: Constitution v1.0.0 (already created), CLAUDE.md files (already created - need validation)

**Note**: This feature is about establishing structure and documentation, NOT implementing application logic. No tests are required since we're creating directories and documentation files only.

**Organization**: Tasks are grouped to enable independent verification of each structural component.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- All paths are relative to repository root

---

## Phase 1: Repository Foundation (Shared Infrastructure)

**Purpose**: Establish core directory structure and git configuration

**⚠️ CRITICAL**: This phase creates the physical structure that all other phases depend on

- [ ] T001 Create `/specs/features/` directory for feature specifications
- [ ] T002 Create `/specs/api/` directory for API contract specifications
- [ ] T003 Create `/specs/database/` directory for database schema specifications
- [ ] T004 Create `/specs/ui/` directory for UI/UX specifications
- [ ] T005 Update `.gitignore` to exclude `.env`, `.env.local`, `node_modules/`, `__pycache__/`, `.pytest_cache/`, `.venv/`, `*.pyc`

**Acceptance Criteria for Phase 1**:
- All four spec category directories exist
- `.gitignore` configured to prevent secrets from being committed
- Directory structure matches FR-001, FR-006

**Verification**:
```bash
ls -la specs/           # Should show features/, api/, database/, ui/
cat .gitignore          # Should contain .env, node_modules, __pycache__
```

---

## Phase 2: Spec-Kit Plus Configuration

**Purpose**: Configure Spec-Kit Plus for organized spec management

**Dependencies**: Phase 1 must be complete (specs directories must exist)

- [ ] T006 Verify `.specify/memory/constitution.md` exists and is v1.0.0
- [ ] T007 Verify `.specify/templates/` directory contains all required templates (spec, plan, tasks, adr, phr, checklist)
- [ ] T008 Create `.specify/config.yaml` with project configuration (spec directories, phase definitions)

**Acceptance Criteria for Phase 2**:
- Constitution v1.0.0 confirmed present
- All templates present and accessible
- `config.yaml` defines spec structure matching Phase 1 directories
- Matches FR-007, FR-008

**config.yaml Structure**:
```yaml
name: todo-web-app
version: "1.0"

structure:
  specs_dir: specs
  features_dir: specs/features
  api_dir: specs/api
  database_dir: specs/database
  ui_dir: specs/ui

phases:
  - name: phase1-console
    features: []
  - name: phase2-web
    features: [monorepo-setup]
  - name: phase3-chatbot
    features: []
```

**Verification**:
```bash
cat .specify/memory/constitution.md | grep "Version: 1.0.0"
ls .specify/templates/
cat .specify/config.yaml
```

---

## Phase 3: User Story 1 - AI Agent Navigation (Priority: P1) 🎯 MVP

**Goal**: Enable AI agents to understand and navigate the monorepo structure

**Independent Test**: Ask AI agent "Where should I implement a new API endpoint?" - should correctly identify `backend/` directory and reference backend/CLAUDE.md

**Dependencies**: Phase 1 (directory structure) and Phase 2 (Spec-Kit config)

### Validation Tasks for User Story 1

- [ ] T009 [US1] Verify root CLAUDE.md exists and documents monorepo structure
- [ ] T010 [US1] Verify root CLAUDE.md documents Phase II technology stack table
- [ ] T011 [US1] Verify root CLAUDE.md documents Spec-Driven workflow (5 phases)
- [ ] T012 [US1] Verify root CLAUDE.md documents development commands (frontend, backend, Docker)
- [ ] T013 [US1] Verify root CLAUDE.md includes directory tree visualization

**Acceptance Criteria for User Story 1**:
- Root CLAUDE.md contains complete monorepo structure documentation
- Directory tree shows frontend/, backend/, specs/, .specify/, history/
- Development commands documented for all layers
- Spec-Driven workflow clearly outlined (Specification → Planning → Tasks → Implementation → Review)
- Matches FR-003, Success Criteria SC-001, SC-004

**Verification** (manual):
1. Open `CLAUDE.md` at repository root
2. Confirm sections: Project Structure, Technology Stack, Development Commands, Spec-Driven Workflow
3. Ask AI agent: "What's the project structure?" - should list frontend, backend, specs
4. Ask AI agent: "Where should I implement authentication?" - should identify need for spec first, then mention both frontend (Better Auth) and backend (JWT verification)

**Checkpoint**: AI agents can now navigate the monorepo structure

---

## Phase 4: User Story 2 - Architectural Boundaries (Priority: P1) 🎯 MVP

**Goal**: Ensure AI agents understand and enforce architectural boundaries (frontend, backend, database)

**Independent Test**: Ask AI agent to implement data fetching from frontend - should use centralized API client, never direct database access

**Dependencies**: Phase 3 (root CLAUDE.md validated)

### Validation Tasks for User Story 2

- [ ] T014 [US2] Verify frontend/CLAUDE.md exists and documents Next.js 16+ patterns
- [ ] T015 [US2] Verify frontend/CLAUDE.md documents centralized API client pattern with JWT injection
- [ ] T016 [US2] Verify frontend/CLAUDE.md explicitly prohibits direct database access
- [ ] T017 [US2] Verify frontend/CLAUDE.md documents Server Components vs Client Components
- [ ] T018 [US2] Verify backend/CLAUDE.md exists and documents FastAPI patterns
- [ ] T019 [US2] Verify backend/CLAUDE.md documents JWT verification middleware pattern
- [ ] T020 [US2] Verify backend/CLAUDE.md documents user isolation enforcement (user_id verification)
- [ ] T021 [US2] Verify backend/CLAUDE.md documents SQLModel ORM requirement (no raw SQL)

**Acceptance Criteria for User Story 2**:
- Frontend CLAUDE.md documents API client with automatic JWT attachment
- Frontend CLAUDE.md explicitly forbids direct database queries
- Backend CLAUDE.md documents JWT verification on every endpoint
- Backend CLAUDE.md documents user_id verification pattern (URL vs token)
- Backend CLAUDE.md documents SQLModel ORM usage (no raw SQL)
- Matches FR-004, FR-005, Success Criteria SC-002, SC-007

**Boundary Verification** (manual):
1. Open `frontend/CLAUDE.md`
2. Confirm section: "API Client Pattern" with centralized `lib/api.ts` example
3. Confirm explicit prohibition: "NEVER make raw fetch calls" and "NO direct database access"
4. Open `backend/CLAUDE.md`
5. Confirm section: "JWT Authentication" with verification pattern
6. Confirm section: "Authorization Checks" with user_id verification code example
7. Confirm section: "SQLModel ORM usage" and "no raw SQL" requirement

**Test Scenarios** (manual validation with AI agent):
- Scenario 1: "Fetch user tasks from frontend" → Should use `api.getTasks(userId)`, not database query
- Scenario 2: "Query tasks in backend" → Should use `select(Task).where(Task.user_id == authenticated_user_id)`
- Scenario 3: "Implement authentication" → Should correctly place Better Auth (frontend) and JWT verification (backend)

**Checkpoint**: AI agents understand and enforce architectural boundaries

---

## Phase 5: User Story 3 - Spec-Driven Workflow (Priority: P1) 🎯 MVP

**Goal**: Ensure AI agents follow spec-first development and never implement without reading specifications

**Independent Test**: Ask AI agent to implement a feature - should refuse until it reads the relevant spec file

**Dependencies**: Phase 3 (root CLAUDE.md validated), Phase 4 (layer CLAUDE.md validated)

### Validation Tasks for User Story 3

- [ ] T022 [US3] Verify root CLAUDE.md mandates reading specs before implementation
- [ ] T023 [US3] Verify root CLAUDE.md documents `@specs/[category]/[file].md` reference pattern
- [ ] T024 [US3] Verify frontend/CLAUDE.md includes "Spec-Driven Development" section
- [ ] T025 [US3] Verify backend/CLAUDE.md includes "Spec-Driven Development" section
- [ ] T026 [US3] Verify all CLAUDE.md files reference constitution

**Acceptance Criteria for User Story 3**:
- All three CLAUDE.md files mandate spec-first development
- Clear documentation of spec reference pattern (`@specs/features/[feature].md`)
- All CLAUDE.md files reference `.specify/memory/constitution.md`
- Workflow: Read spec → Plan → Tasks → Implement → Verify against spec
- Matches FR-009, Success Criteria SC-003

**Spec-First Verification** (manual):
1. Open each CLAUDE.md (root, frontend, backend)
2. Confirm text: "ALWAYS read relevant specifications before making code changes"
3. Confirm text: "Reference specifications with `@specs/[category]/[file].md`"
4. Confirm text: "See `.specify/memory/constitution.md` for code quality, testing, performance, security, and architecture principles"

**Test Scenarios** (manual validation with AI agent):
- Scenario 1: "Implement task creation" → Agent should ask "Have you created the spec?" or "Let me read `@specs/features/task-crud.md`"
- Scenario 2: Agent given feature request without spec → Should refuse or ask for spec creation first
- Scenario 3: "Implement based on this description" → Should suggest creating spec via `/sp.specify` first

**Checkpoint**: AI agents follow spec-driven workflow

---

## Phase 6: User Story 4 - Monorepo Configuration (Priority: P2)

**Goal**: Provide clear documentation of Spec-Kit Plus configuration for developers

**Independent Test**: Developer can locate Spec-Kit Plus configuration and understand spec organization

**Dependencies**: Phase 2 (config.yaml created)

### Documentation Tasks for User Story 4

- [ ] T027 [US4] Verify root CLAUDE.md documents Spec-Kit Plus directory structure
- [ ] T028 [US4] Verify root CLAUDE.md documents spec organization (by category)
- [ ] T029 [US4] Verify root CLAUDE.md lists Spec-Kit Plus commands (`/sp.specify`, `/sp.plan`, `/sp.tasks`, `/sp.adr`)

**Acceptance Criteria for User Story 4**:
- Root CLAUDE.md documents `.specify/` directory contents
- Spec organization by category clearly explained (features, api, database, ui)
- Spec-Kit Plus commands documented with brief descriptions
- Matches Success Criteria SC-005

**Configuration Verification** (manual):
1. Open `CLAUDE.md` at root
2. Confirm section: "Project Structure - Phase II: Full-Stack Web Application"
3. Confirm directory tree includes `.specify/` with subdirectories
4. Confirm explanation: "specs/ organized by category (features, api, database, ui)"
5. Confirm section: "Spec-Driven Development Workflow" with command list

**Checkpoint**: Developers understand Spec-Kit Plus configuration

---

## Phase 7: Environment Configuration & Docker Setup

**Purpose**: Document environment variables and provide Docker Compose for local development

**Dependencies**: All previous phases (structure and documentation complete)

- [ ] T030 [P] Create `.gitignore` entry example for `.env` files (if not already in T005)
- [ ] T031 [P] Verify root CLAUDE.md documents environment variables section
- [ ] T032 Create `docker-compose.yml` template for frontend + backend services
- [ ] T033 Add README.md section explaining local development setup

**Acceptance Criteria for Phase 7**:
- `.gitignore` configured to exclude `.env`, `.env.local`
- Root CLAUDE.md documents required environment variables for both layers
- `docker-compose.yml` present with frontend (port 3000) and backend (port 8000) services
- README.md explains how to start services
- Matches FR-010, FR-011, FR-012, Success Criteria SC-006, SC-008

**docker-compose.yml Structure**:
```yaml
version: '3.8'
services:
  frontend:
    # Next.js development server
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}

  backend:
    # FastAPI development server
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
      - JWT_ALGORITHM=HS256
```

**Verification**:
```bash
cat .gitignore | grep ".env"          # Should exclude .env files
cat docker-compose.yml                # Should define frontend + backend services
cat README.md | grep "docker-compose" # Should explain docker-compose up
```

**Checkpoint**: Local development environment documented and ready

---

## Phase 8: Architectural Documentation

**Purpose**: Create explicit architectural boundary documentation

**Dependencies**: Phase 4 (architectural boundaries validated in CLAUDE.md files)

- [ ] T034 Create `docs/architecture.md` documenting three-tier architecture
- [ ] T035 Add architectural decision rationale (monorepo vs multi-repo)
- [ ] T036 Document API boundary between frontend and backend
- [ ] T037 Document authentication ownership (Better Auth frontend, JWT verification backend)

**Acceptance Criteria for Phase 8**:
- `docs/architecture.md` exists with clear three-tier diagram (Frontend | Backend | Database)
- Monorepo decision documented with rationale
- API boundary clearly defined (RESTful endpoints under `/api/`)
- Authentication ownership documented (session management frontend, verification backend)

**architecture.md Structure**:
```markdown
# Todo Full-Stack Web Application Architecture

## Three-Tier Architecture

Frontend (Next.js 16+)
  ↓ REST API (JWT Bearer tokens)
Backend (FastAPI)
  ↓ SQLModel ORM (parameterized queries)
Database (Neon PostgreSQL)

## Architectural Boundaries

### Frontend → Backend
- Communication: REST API only
- No direct database access from frontend
- JWT tokens in Authorization header

### Backend → Database
- Access: SQLModel ORM only
- No raw SQL queries
- User isolation enforced at query level

## Key Decisions

### Monorepo vs Multi-Repo
Decision: Monorepo
Rationale:
- Single context for AI agents
- Unified versioning
- Cross-cutting changes in single PR
- Shared specifications

### Authentication Ownership
- Frontend: Better Auth (session creation, JWT issuance)
- Backend: JWT verification (middleware, user_id extraction)
- Shared Secret: BETTER_AUTH_SECRET (both environments)
```

**Verification**:
```bash
cat docs/architecture.md | grep "Three-Tier Architecture"
cat docs/architecture.md | grep "Monorepo vs Multi-Repo"
```

**Checkpoint**: Architectural decisions and boundaries fully documented

---

## Phase 9: Final Validation & Testing Strategy

**Purpose**: Validate all components are in place and functioning as specified

**Dependencies**: All previous phases complete

### Manual Validation Checklist

- [ ] T038 Verify all directories exist: frontend/, backend/, specs/{features,api,database,ui}/, .specify/, history/, docs/
- [ ] T039 Verify all CLAUDE.md files exist: root, frontend/, backend/
- [ ] T040 Verify constitution exists: `.specify/memory/constitution.md` v1.0.0
- [ ] T041 Verify Spec-Kit config exists: `.specify/config.yaml`
- [ ] T042 Verify docker-compose.yml exists
- [ ] T043 Verify .gitignore excludes secrets (.env files)
- [ ] T044 Verify architecture documentation exists: `docs/architecture.md`

### AI Agent Navigation Tests (Manual)

- [ ] T045 Test: Ask agent "Where should I implement a new API endpoint?" → Should respond "backend/ directory" and reference backend/CLAUDE.md
- [ ] T046 Test: Ask agent "How do I fetch data from the frontend?" → Should mention centralized API client in `lib/api.ts`
- [ ] T047 Test: Ask agent "Can the frontend query the database directly?" → Should respond "NO" and explain architectural boundary
- [ ] T048 Test: Ask agent "Where do I find feature specifications?" → Should respond "specs/features/" directory

### Spec Referencing Tests (Manual)

- [ ] T049 Test: Reference `@specs/features/` in conversation → Should be accessible
- [ ] T050 Test: Reference `@specs/api/` in conversation → Should be accessible
- [ ] T051 Test: Reference `.specify/memory/constitution.md` → Should be accessible

### Success Criteria Validation

- [ ] T052 SC-001: AI agent identifies correct directory in under 5 seconds ✓
- [ ] T053 SC-002: No architectural boundary violations in CLAUDE.md ✓
- [ ] T054 SC-003: Spec-first mandate present in all CLAUDE.md files ✓
- [ ] T055 SC-004: Project structure understandable within 3 minutes ✓
- [ ] T056 SC-005: Specs organized by category (verified in Phase 1) ✓
- [ ] T057 SC-006: Development commands documented (frontend, backend, Docker) ✓
- [ ] T058 SC-007: Layer-specific CLAUDE.md files referenced correctly ✓
- [ ] T059 SC-008: .gitignore configured to exclude secrets ✓

**Acceptance Criteria for Phase 9**:
- All 12 functional requirements (FR-001 to FR-012) verified
- All 8 success criteria (SC-001 to SC-008) validated
- AI agent navigation tests pass
- Spec referencing tests pass

**Final Checkpoint**: Monorepo architecture fully established and validated

---

## Summary

**Total Tasks**: 59 (5 phases of structural setup, 4 phases of user story validation, 2 phases of final validation)

**Estimated Completion**: All tasks are verification/documentation tasks (no code implementation), can be completed in one session

**Critical Path**:
1. Phase 1: Directory structure (T001-T005)
2. Phase 2: Spec-Kit config (T006-T008)
3. Phase 3-6: CLAUDE.md validation (T009-T029)
4. Phase 7: Environment config (T030-T033)
5. Phase 8: Architecture docs (T034-T037)
6. Phase 9: Final validation (T038-T059)

**Parallelization**: Tasks within each phase can be done in parallel where marked [P], but phases must be sequential

**Dependencies**:
- Phase 2 depends on Phase 1 (directories must exist)
- Phases 3-6 depend on Phases 1-2 (structure and config must exist)
- Phase 7 depends on Phases 3-6 (CLAUDE.md files must be validated)
- Phase 8 depends on Phase 4 (architectural boundaries must be defined)
- Phase 9 depends on all previous phases (everything must exist)

**Next Steps After Completion**:
1. Run `/sp.specify` to create authentication feature specification
2. Run `/sp.specify` to create task CRUD feature specification
3. Begin implementation using established monorepo structure
4. All future work will reference this architecture foundation
