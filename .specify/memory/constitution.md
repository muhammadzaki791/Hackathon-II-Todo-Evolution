# Todo Full-Stack Web Application Constitution
<!-- Hackathon II: Phase II – Multi-User Web Application with Authentication -->

## Preamble

This constitution governs **Hackathon II: Todo Full-Stack Web Application**, a Phase II project demonstrating Spec-Driven Development using Claude Code and Spec-Kit Plus. This document establishes the foundational principles, standards, and constraints that apply uniformly to ALL features and development activities.

**Project Context:**
- **Hackathon**: Hackathon II evaluation project
- **Phase**: Phase II (Full-Stack Web Application with Authentication)
- **Development Model**: AI-native using Claude Code (no manual coding)
- **Workflow**: Spec-Kit Plus commands (`/sp.specify`, `/sp.plan`, `/sp.tasks`, `/sp.implement`)
- **Audience**: Hackathon judges, AI agents, developers

**Constitution Authority:**
- **Single Global Constitution**: This document governs ALL features
- **Uniform Application**: All specs, plans, and implementations must comply
- **Non-Negotiable Principles**: Marked as (NON-NEGOTIABLE) cannot be violated
- **Auditability**: All decisions traceable to constitution, specs, or ADRs

## Core Principles

### I. Spec-First Development (NON-NEGOTIABLE)
**No implementation without specification. No manual coding outside Spec-Kit Plus workflow.**

#### Specification Requirements
- Every feature MUST have a complete specification in `/specs/features/` before any code is written
- Specifications define user stories, acceptance criteria, and validation rules
- API contracts documented in `/specs/api/` before endpoint implementation
- Database schemas documented in `/specs/database/` before model creation
- UI/UX requirements documented in `/specs/ui/` before component development
- Changes to existing functionality require spec updates first
- Implementation validates against spec acceptance criteria

#### Spec-Kit Plus Workflow (Mandatory)
All development MUST follow this workflow:
1. **Specify**: Run `/sp.specify <feature>` to create specification
2. **Plan**: Run `/sp.plan` to generate implementation plan
3. **Tasks**: Run `/sp.tasks` to break down into actionable tasks
4. **Implement**: Run `/sp.implement` to execute tasks via Claude Code
5. **Review**: Verify implementation against spec acceptance criteria

**No Manual Coding**: All code MUST be written by Claude Code via `/sp.implement`. Manual coding outside this workflow is prohibited to ensure:
- Full traceability from spec to implementation
- Auditability for hackathon judges
- Reproducibility of development process
- Consistency with AI-native development principles

#### Enforcement
- Claude Code must read relevant specs using `@specs/[category]/[feature].md` before coding
- Spec violations trigger immediate halt and spec correction
- All commits reference spec file in commit message
- Manual code changes require retroactive spec creation and documentation

### II. Strict Architectural Boundaries
**Clear separation of concerns across all layers.**

- **Frontend Layer**: Next.js App Router application
  - Handles UI/UX, user interactions, client-side state
  - Communicates ONLY via REST API (no direct database access)
  - Manages authentication sessions and JWT tokens
  - Located in `/frontend/` directory

- **Backend Layer**: FastAPI Python application
  - Handles business logic, data validation, and orchestration
  - Exposes REST API endpoints under `/api/` prefix
  - Enforces authentication and authorization
  - Located in `/backend/` directory

- **Database Layer**: Neon Serverless PostgreSQL
  - Accessed ONLY through SQLModel ORM (no raw SQL)
  - Schema managed via SQLModel models in `backend/models.py`
  - User data isolation enforced at query level

**Violations:**
- Frontend directly accessing database → FORBIDDEN
- Backend accessing frontend state → FORBIDDEN
- Business logic in database (stored procedures) → FORBIDDEN
- Raw SQL queries bypassing ORM → FORBIDDEN

### III. Security-By-Design (NON-NEGOTIABLE)
**Security is not optional; it's foundational.**

#### Authentication & Authorization
- **Authentication Library**: Better Auth (Next.js) - NO custom auth logic, NO external auth frameworks
- **Token Format**: JWT tokens EXCLUSIVELY - issued by Better Auth on successful login
- **Shared Secret**: `BETTER_AUTH_SECRET` environment variable (minimum 32 characters)
- **Backend Verification**: Token verification on EVERY backend API request (no exceptions)
- **Default Secure**: All API endpoints require authentication UNLESS explicitly specified as public in spec
- **Stateless**: No shared sessions between frontend and backend - JWT tokens are self-contained

#### User Data Isolation
- **CRITICAL**: Every database table with user data MUST have `user_id` field
- **CRITICAL**: All queries MUST filter by authenticated `user_id`
- **CRITICAL**: URL `user_id` parameter MUST be verified against JWT token user
- Users can ONLY access their own data (no cross-user access)
- Return `403 Forbidden` for unauthorized access attempts

#### Input Validation
- All API inputs validated via Pydantic schemas (backend)
- Frontend validates before API submission (prevent unnecessary requests)
- No user input directly interpolated into queries (ORM prevents SQL injection)

#### Environment Variables
- All secrets stored in `.env` files (NEVER committed to git)
- `.env` added to `.gitignore`
- Separate `.env` files for frontend and backend
- No hardcoded secrets in code

#### CORS Policy
- Explicit origin allowlist (no `"*"` wildcard in production)
- Frontend origin configured in backend CORS middleware
- Credentials allowed for cookie/token transmission

### IV. Test-Driven Development
**Tests validate specifications before implementation.**

- **Red-Green-Refactor cycle**: Write test → Verify failure → Implement → Verify pass → Refactor
- Unit tests for business logic and utilities
- Integration tests for API endpoints (with JWT authentication)
- Component tests for critical UI components
- E2E tests for user flows (login, task CRUD)
- All tests must pass before code review/merge

**Coverage Requirements:**
- Backend API endpoints: 100% coverage
- Business logic functions: 90%+ coverage
- Frontend API client: Integration tests required
- Critical user flows: E2E tests required

### V. Monorepo Organization
**Single repository, clear structure, cohesive versioning.**

```
Todo-Web-App/
├── .specify/              # Spec-Kit Plus configuration
├── specs/                 # Organized specifications
│   ├── features/          # Feature requirements
│   ├── api/               # API contracts
│   ├── database/          # Schema definitions
│   └── ui/                # UI/UX requirements
├── frontend/              # Next.js application
│   └── CLAUDE.md          # Frontend guidelines
├── backend/               # FastAPI application
│   └── CLAUDE.md          # Backend guidelines
├── history/               # PHRs and ADRs
├── CLAUDE.md              # Root development guidelines
└── docker-compose.yml     # Local development orchestration
```

**Benefits:**
- Single context for Claude Code
- Unified version control
- Cross-cutting changes in single PR
- Shared specs across frontend/backend

### VI. API-First Design
**API contracts define integration points.**

- RESTful conventions (GET, POST, PUT, DELETE, PATCH)
- JSON request/response bodies
- Standard HTTP status codes:
  - `200 OK`: Successful GET/PUT/PATCH
  - `201 Created`: Successful POST
  - `204 No Content`: Successful DELETE
  - `400 Bad Request`: Invalid input
  - `401 Unauthorized`: Missing/invalid JWT
  - `403 Forbidden`: Valid JWT but insufficient permissions
  - `404 Not Found`: Resource doesn't exist
  - `422 Unprocessable Entity`: Validation error

- Consistent error response format:
```json
{
  "detail": "Error message",
  "type": "ErrorType"
}
```

- All endpoints under `/api/{user_id}/` prefix
- User ID in path for clarity and validation
- OpenAPI documentation auto-generated by FastAPI

### VII. Reproducibility & Traceability (NON-NEGOTIABLE)
**Every decision and change is documented and traceable. Project must be auditable and judge-review ready.**

#### Documentation Requirements
All development activities MUST be traceable through:

- **Prompt History Records (PHRs)**: Created automatically after every user interaction
  - Located in `history/prompts/`
  - Routed to `constitution/`, `<feature-name>/`, or `general/`
  - Capture full prompt, response, files changed, tests run
  - Demonstrates AI-native development process for judges

- **Architecture Decision Records (ADRs)**: Document significant decisions
  - Located in `history/adr/`
  - Created via `/sp.adr <decision-title>` (user consent required)
  - Format: Context, Decision, Consequences, Alternatives
  - Examples: JWT vs sessions, monorepo vs multi-repo, Better Auth selection

- **Git Commits**: Reference specs and include co-authorship
  - Format: `<type>: <description> (refs @specs/<path>)`
  - Include: `Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`
  - Demonstrates collaboration between human and AI

#### Auditability Requirements
For hackathon evaluation, the project MUST demonstrate:
- **Complete Traceability**: Every code change traces back to a spec
- **Reproducible Process**: Judges can follow PHRs to understand development flow
- **Documented Decisions**: All architectural choices have ADRs or spec justification
- **No Undocumented Behavior**: All functionality explicitly specified and traceable
- **AI-Native Evidence**: PHRs and git co-authorship prove AI-driven development

#### Hackathon Success Criteria
- All features have complete specs in `/specs/`
- All implementations have task breakdowns in `/specs/[feature]/tasks.md`
- All PHRs captured in `history/prompts/`
- All significant decisions documented in `history/adr/`
- Git history shows spec references and AI co-authorship

### VIII. AI-Native Development & Reusable Intelligence
**Development driven by Claude Code using specialized agents and skills.**

#### AI-Native Development Principles
- **Primary Developer**: Claude Code (Claude Sonnet 4.5) is the primary developer
- **Human Role**: Provides requirements, reviews output, approves decisions
- **No Manual Coding**: All code written by Claude Code via `/sp.implement`
- **Workflow Enforcement**: Spec-Kit Plus commands ensure consistent process

#### Specialized Agents (Task Tool)
Leverage specialized agents for complex tasks:
- **spec-compliance-auditor**: Verify implementation matches specification
- **auth-security-specialist**: Validate authentication and authorization patterns
- **architecture-boundary-guardian**: Ensure architectural boundaries are respected
- **fullstack-feature-executor**: Orchestrate end-to-end feature implementation

**When to Use Agents:**
- After completing implementations (spec-compliance-auditor)
- When implementing auth features (auth-security-specialist)
- When spanning multiple layers (architecture-boundary-guardian)
- When executing complete features (fullstack-feature-executor)

#### Skills (Reusable Commands)
Use Spec-Kit Plus skills for standardized workflows:
- `/sp.specify`: Create feature specifications
- `/sp.plan`: Generate implementation plans
- `/sp.tasks`: Break down into actionable tasks
- `/sp.implement`: Execute task implementation
- `/sp.adr`: Document architectural decisions
- `/sp.phr`: Create prompt history records (automatic)
- `/sp.constitution`: Update project constitution

**Benefits of Reusable Intelligence:**
- Consistent quality across features
- Specialized expertise (security, architecture, compliance)
- Reduced cognitive load on primary agent
- Parallel execution of validation tasks
- Demonstrated AI-native development for judges

#### Intelligence Sharing
- **Sub-Agents**: Can be invoked proactively or on-demand
- **Skills**: Standardized workflows reusable across features
- **Constitution**: Single source of truth governing all agents
- **CLAUDE.md Files**: Layer-specific guidance for all agents

## Technology Stack Standards (NON-NEGOTIABLE)

**Stack Selection Rationale**: These technologies are mandated for Hackathon II evaluation. NO substitutions or external frameworks allowed unless explicitly specified in a feature spec.

### Frontend: Next.js 16+ (MANDATORY)
- **Framework**: Next.js with App Router (not Pages Router) - NO other frontend frameworks
- **Language**: TypeScript (strict mode enabled) - NO JavaScript
- **Styling**: Tailwind CSS (utility-first, no custom CSS) - NO external UI frameworks (Material-UI, Ant Design, etc.)
- **Authentication**: Better Auth library ONLY - NO custom auth, NO Auth0, NO Firebase Auth
- **HTTP Client**: Centralized API client (`lib/api.ts`) with JWT injection - NO direct fetch calls
- **State Management**: React Server Components + Client Components as needed - NO Redux, NO Zustand unless spec justifies
- **Testing**: Jest + React Testing Library + Playwright (E2E)

**Patterns:**
- Server Components by default (better performance)
- Client Components only when needed (interactivity, hooks)
- No inline styles (use Tailwind classes)
- API calls through centralized client (automatic JWT attachment)

**Constraints:**
- No external UI component libraries (build custom components)
- No additional auth providers (Better Auth only)
- No state management libraries without spec justification

### Backend: Python FastAPI (MANDATORY)
- **Framework**: FastAPI (latest stable) - NO Django, NO Flask, NO other Python frameworks
- **Language**: Python 3.11+
- **ORM**: SQLModel (combines SQLAlchemy + Pydantic) - NO raw SQL, NO other ORMs
- **Database Driver**: psycopg2-binary (PostgreSQL)
- **Authentication**: PyJWT for token verification - NO custom JWT libraries
- **Validation**: Pydantic v2
- **Testing**: pytest + httpx (TestClient)

**Patterns:**
- Dependency injection for database sessions
- Pydantic schemas for request/response validation
- HTTPException for error handling
- Async/await for all route handlers

### Database: Neon Serverless PostgreSQL (MANDATORY)
- **Platform**: Neon (serverless PostgreSQL) - NO other database providers (AWS RDS, Supabase, etc.)
- **Access**: SQLModel ORM ONLY - NO raw SQL, NO query builders, NO direct psycopg2 queries
- **Migrations**: SQLModel `create_all()` for Phase II (Alembic for production)
- **Connection Pooling**: Enabled via SQLModel engine configuration

**Schema Standards (MANDATORY):**
- Every user-owned table MUST have `user_id: str` foreign key
- Primary keys: Auto-incrementing integers (`id: int`)
- Timestamps: `created_at`, `updated_at` (UTC datetime)
- Indexes on: `user_id`, frequently queried fields
- Constraints: NOT NULL for required fields, UNIQUE where appropriate

**Constraints:**
- No raw SQL queries in application code
- No stored procedures or database functions
- No database triggers (business logic in backend only)
- All data access through SQLModel models

### Development Tools
- **Version Control**: Git + GitHub
- **Containerization**: Docker Compose (local development)
- **Environment Management**: `.env` files + python-dotenv
- **Spec Management**: Spec-Kit Plus
- **AI Assistant**: Claude Code (via Claude Sonnet 4.5)

## Development Workflow

### Phase 1: Specification
1. User describes feature requirements
2. Create/update spec in `/specs/features/<feature-name>.md`
3. Define acceptance criteria and validation rules
4. Document API contracts in `/specs/api/rest-endpoints.md`
5. Document database schema in `/specs/database/schema.md`
6. Document UI requirements in `/specs/ui/`
7. User reviews and approves spec

### Phase 2: Planning
1. Run `/sp.plan` to generate implementation plan
2. Plan documents in `/specs/<feature>/plan.md`:
   - Scope and dependencies
   - Key decisions and rationale
   - Interfaces and API contracts
   - Non-functional requirements
   - Risk analysis
3. Identify architecturally significant decisions
4. Create ADRs via `/sp.adr <title>` (user consent required)
5. User reviews and approves plan

### Phase 3: Task Breakdown
1. Run `/sp.tasks` to generate task list
2. Tasks documented in `/specs/<feature>/tasks.md`:
   - Task ID, description, dependencies
   - Acceptance criteria per task
   - Test cases per task
3. Tasks ordered by dependency (no parallel unsafe changes)
4. User reviews task breakdown

### Phase 4: Implementation (TDD Cycle)
1. Select next available task (no blocking dependencies)
2. Read relevant specs: `@specs/features/<feature>.md`
3. **RED**: Write failing tests (unit, integration, E2E)
4. User approves tests
5. **GREEN**: Implement minimum code to pass tests
6. **REFACTOR**: Clean up code, maintain passing tests
7. Mark task complete, create PHR
8. Repeat for next task

### Phase 5: Review & Integration
1. Run full test suite (backend + frontend)
2. Verify against spec acceptance criteria
3. Create git commit with spec references
4. Push to feature branch
5. Create pull request with spec and task references
6. Code review (security, architecture, tests)
7. Merge to main after approval

## Security Requirements

### Authentication Flow
1. User signs up/logs in via Better Auth (frontend)
2. Better Auth creates session and issues JWT token
3. Frontend stores token securely (httpOnly cookie or secure storage)
4. Frontend includes token in `Authorization: Bearer <token>` header
5. Backend middleware extracts and verifies JWT signature
6. Backend extracts `user_id` from verified token
7. Backend validates URL `user_id` matches token `user_id`
8. Backend filters all queries by authenticated `user_id`

### JWT Token Requirements
- Algorithm: HS256 (HMAC with SHA-256)
- Secret: Minimum 32 characters, stored in `BETTER_AUTH_SECRET`
- Expiration: 7 days (configurable)
- Payload includes: `sub` or `user_id`, `email`, `exp`, `iat`

### Authorization Checks (Backend)
```python
# ✅ REQUIRED PATTERN for all endpoints
async def endpoint(
    user_id: str = Path(...),
    authenticated_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    # Step 1: Verify URL user_id matches authenticated user
    if user_id != authenticated_user_id:
        raise HTTPException(status_code=403, detail="Access denied")

    # Step 2: Filter queries by authenticated_user_id (NOT url user_id)
    statement = select(Task).where(Task.user_id == authenticated_user_id)

    # Step 3: Verify resource ownership for specific resources
    if resource.user_id != authenticated_user_id:
        raise HTTPException(status_code=403, detail="Access denied")
```

### Input Validation
- Backend: Pydantic schemas with constraints (min_length, max_length, regex)
- Frontend: HTML5 validation + client-side checks
- Sanitization: React automatically escapes (XSS protection)
- No user input in raw SQL (SQLModel parameterizes)

### Secrets Management
- All secrets in `.env` files (git-ignored)
- No secrets in code, logs, or error messages
- Frontend: `BETTER_AUTH_SECRET`, `NEXT_PUBLIC_API_URL`
- Backend: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `JWT_ALGORITHM`

## Performance Standards

### Backend API
- P95 latency: <200ms for simple CRUD operations
- P99 latency: <500ms for simple CRUD operations
- Database connection pooling: 5-10 connections
- Response compression enabled (gzip)

### Frontend
- First Contentful Paint (FCP): <1.5s
- Time to Interactive (TTI): <3s
- Use Server Components to reduce client bundle
- Lazy load client components where appropriate
- Optimize images with Next.js `<Image>` component

### Database
- Indexes on `user_id` and frequently queried fields
- Avoid N+1 queries (use eager loading where needed)
- Connection pooling configured for serverless (pool_pre_ping=True)

## Code Quality Standards

### TypeScript (Frontend)
- Strict mode enabled (`"strict": true` in tsconfig.json)
- No `any` type (use `unknown` if type is truly unknown)
- Explicit return types for functions
- Interface/type definitions exported from `types/index.ts`

### Python (Backend)
- Type hints required for all functions
- Pydantic models for validation
- Docstrings for all public functions (Google style)
- Max line length: 100 characters (Black formatter)

### General
- DRY principle: Extract reusable logic into utilities
- YAGNI principle: Don't build features not in spec
- Clear variable/function names (self-documenting code)
- Comments only where logic is non-obvious
- No commented-out code (use git history)

## Testing Standards

### Backend Tests
```python
# tests/test_tasks.py
def test_create_task_with_auth():
    """Test task creation with valid JWT token."""
    token = create_test_token("test-user-123")
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post("/api/test-user-123/tasks", json={...}, headers=headers)
    assert response.status_code == 201

def test_create_task_unauthorized():
    """Test task creation without token returns 401."""
    response = client.post("/api/test-user-123/tasks", json={...})
    assert response.status_code == 401

def test_user_isolation():
    """Test user cannot access other user's tasks."""
    token = create_test_token("user-1")
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/user-2/tasks", headers=headers)
    assert response.status_code == 403
```

### Frontend Tests
```typescript
// components/TaskForm.test.tsx
describe('TaskForm', () => {
  it('calls API with form data on submit', async () => {
    const mockCreate = jest.spyOn(api, 'createTask');
    render(<TaskForm userId="test-user" />);

    await userEvent.type(screen.getByLabelText('Title'), 'New Task');
    await userEvent.click(screen.getByRole('button', { name: 'Create' }));

    expect(mockCreate).toHaveBeenCalledWith('test-user', {
      title: 'New Task'
    });
  });
});
```

## Deployment Standards (Future)
<!-- Phase II focuses on local development; production deployment in later phases -->

- Frontend: Vercel (Next.js optimized)
- Backend: Railway/Render (Python container)
- Database: Neon production tier (connection pooling, backups)
- Environment variables via platform secrets management
- HTTPS enforced (Let's Encrypt certificates)
- CORS restricted to production frontend domain

## Governance

### Constitution Authority
- This constitution supersedes all other development practices
- All code, specs, and decisions must comply with these principles
- Violations trigger immediate correction before proceeding

### Amendment Process
1. Identify principle requiring change
2. Document proposed amendment with rationale
3. Create ADR for the amendment (`/sp.adr constitution-amendment-<topic>`)
4. User approval required
5. Update constitution with version increment
6. Communicate change to all contributors

### Compliance Verification
- Claude Code verifies spec existence before implementation
- Code review checklist includes constitution compliance
- Security patterns validated in every PR
- Test coverage enforced via CI/CD (future)

### Exception Handling
- Exceptional circumstances require explicit user approval
- Document exception rationale in ADR
- Exceptions are temporary (create follow-up task for compliance)

## Spec-Kit Plus Integration

### Directory Structure
```
.specify/
├── memory/
│   └── constitution.md          # This file
├── templates/
│   ├── spec-template.md         # Feature specification template
│   ├── plan-template.md         # Implementation plan template
│   ├── tasks-template.md        # Task breakdown template
│   ├── adr-template.md          # ADR template
│   ├── phr-template.prompt.md   # PHR template
│   └── checklist-template.md    # Quality checklist template
└── scripts/                     # Automation scripts
```

### Commands
- `/sp.constitution` - Initialize/update constitution (this command)
- `/sp.specify` - Create/update feature specification
- `/sp.plan` - Generate implementation plan
- `/sp.tasks` - Generate task breakdown
- `/sp.implement` - Execute task implementation
- `/sp.adr <title>` - Create Architecture Decision Record
- `/sp.phr` - Create Prompt History Record (automatic)

### Workflow Integration
1. All specs created in `/specs/` (organized by category)
2. All history in `/history/` (prompts, ADRs)
3. CLAUDE.md files at root, frontend, backend
4. Templates in `.specify/templates/`
5. Constitution in `.specify/memory/constitution.md`

## Version History

**Version**: 1.1.0
**Ratified**: 2026-02-06
**Last Amended**: 2026-02-06

### Changelog

#### Version 1.1.0 (2026-02-06) - Hackathon II Enhancements
**Amendment Rationale**: Enhanced constitution to explicitly govern Hackathon II evaluation requirements

**Additions:**
- **Preamble**: Added hackathon context, auditability requirements, single global constitution authority
- **Section I Enhancement**: Added mandatory Spec-Kit Plus workflow (`/sp.specify`, `/sp.plan`, `/sp.tasks`, `/sp.implement`)
- **Section I Enhancement**: Added prohibition on manual coding (all code via Claude Code)
- **Section III Enhancement**: Added JWT-exclusive requirement, stateless auth, default-secure API endpoints
- **Section VII Enhancement**: Added auditability requirements for hackathon judges
- **Section VII Enhancement**: Added hackathon success criteria (traceability, reproducibility, no undocumented behavior)
- **Section VIII**: NEW - AI-Native Development & Reusable Intelligence
  - Specialized agents (spec-compliance-auditor, auth-security-specialist, etc.)
  - Skills (Spec-Kit Plus commands)
  - Intelligence sharing principles
- **Technology Stack**: Enhanced with MANDATORY constraints and NO-substitution rules
  - Frontend: NO external UI frameworks or auth providers
  - Backend: NO alternative ORMs or frameworks
  - Database: NO raw SQL or alternative providers

**Principles Strengthened:**
- (NON-NEGOTIABLE) markers added to critical sections (I, III, VII)
- Technology stack constraints made explicit and mandatory
- Auditability and reproducibility emphasized for judge review

#### Version 1.0.0 (2026-02-06) - Initial Constitution
- Spec-first development mandate
- Strict architectural boundaries (frontend/backend/database)
- Security-by-design with JWT authentication
- Test-driven development cycle
- Monorepo organization with Spec-Kit Plus
- API-first design patterns
- Reproducibility and traceability requirements

---

## Constitutional Authority

**This constitution governs ALL development activities for Hackathon II: Todo Full-Stack Web Application Phase II project.**

**Enforcement:**
- Adherence to all (NON-NEGOTIABLE) principles is MANDATORY
- Amendments require user approval and documentation via ADR
- Violations trigger immediate halt and correction
- All features, specs, plans, and implementations must comply

**Auditability for Judges:**
- Complete traceability from spec to implementation
- All decisions documented in constitution, specs, or ADRs
- All development captured in PHRs (history/prompts/)
- Git history demonstrates AI-native development (co-authorship)
- No undocumented behavior in codebase

**Hackathon Success = Constitution Compliance + Spec Compliance + Judge-Ready Traceability**
