# Implementation Plan: Frontend UI and User Experience

**Branch**: `005-frontend-ui` | **Date**: 2026-02-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-frontend-ui/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement responsive Next.js web interface for todo task management with JWT-based authentication. Create Login, Signup, and Task Dashboard pages with complete task CRUD functionality (Create, Read, Update, Delete) and completion toggling. Follow Next.js 16+ App Router architecture with Tailwind CSS styling and integrated API client for JWT token management.

## Technical Context

**Language/Version**: TypeScript 5.0+ (strict mode), React 18+
**Primary Dependencies**: Next.js 16+ with App Router, Better Auth (frontend authentication), React Hook Form (forms), Zod (validation)
**Storage**: API-driven state management (no local persistence needed), JWT tokens in secure storage
**Testing**: Jest, React Testing Library, Playwright (E2E)
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Web frontend (Next.js application in `/frontend/` directory)
**Performance Goals**: FCP <1.5s, TTI <3s, responsive design 320px-1920px
**Constraints**: Must use Next.js App Router (not Pages Router), Tailwind CSS only (no external UI libs), Better Auth only (no custom auth), JWT auto-attachment to API requests
**Scale/Scope**: Single-page application with 3 main pages, 20+ component hierarchy, 5 API endpoints for task management

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ Frontend Technology Stack (Section VIII: Technology Stack Standards)
- [X] Next.js 16+ with App Router (NOT Pages Router) - mandated by constitution
- [X] TypeScript with strict mode enabled - mandated by constitution
- [X] Tailwind CSS for styling (no external UI frameworks like Material-UI) - mandated by constitution
- [X] Better Auth for authentication (NO custom auth, NO external auth frameworks) - mandated by constitution
- [X] Centralized API client with JWT injection (NO direct fetch calls) - mandated by constitution

### ✅ Security-By-Design (Section III: Security-By-Design)
- [X] JWT tokens exclusively (issued by Better Auth) - mandated by constitution
- [X] Automatic JWT attachment to all API requests - mandated by specification
- [X] Stateless authentication (JWT tokens self-contained) - mandated by constitution
- [X] Server Components by default (better security/performance) - mandated by constitution
- [X] Client Components only when needed (interactivity, hooks) - mandated by constitution

### ✅ Strict Architectural Boundaries (Section II: Architectural Boundaries)
- [X] Frontend layer handles UI/UX, user interactions, client-side state - mandated by constitution
- [X] Frontend communicates ONLY via REST API (no direct database access) - mandated by constitution
- [X] Frontend manages authentication sessions and JWT tokens - mandated by constitution
- [X] Located in `/frontend/` directory - mandated by constitution
- [X] NO direct database access - mandated by constitution

### ✅ API-First Design (Section VI: API-First Design)
- [X] Integration with existing backend API endpoints (Feature 004: Task CRUD API)
- [X] Follows RESTful conventions (GET, POST, PUT, DELETE, PATCH)
- [X] JSON request/response bodies
- [X] Standard HTTP status codes (200, 201, 204, 400, 401, 403, 404)

### ✅ Spec-First Development (Section I: Spec-First Development)
- [X] Complete feature spec exists in `/specs/005-frontend-ui/spec.md`
- [X] Implementation plan in `/specs/005-frontend-ui/plan.md` (this file)
- [X] Task breakdown will be in `/specs/005-frontend-ui/tasks.md` (Phase 2)
- [X] No manual coding outside `/sp.implement` workflow - mandated by constitution

### ✅ Test-Driven Development (Section IV: Test-Driven Development)
- [X] Jest + React Testing Library + Playwright (E2E) testing framework - mandated by constitution
- [X] Component tests for critical UI components - mandated by constitution
- [X] E2E tests for user flows (login, task CRUD) - mandated by constitution

**GATE STATUS**: ✅ PASS - All constitution requirements satisfied

## Project Structure

### Documentation (this feature)

```text
specs/005-frontend-ui/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
frontend/
├── app/                 # Next.js App Router pages
│   ├── login/           # Login page (client component)
│   ├── signup/          # Signup page (client component)
│   ├── dashboard/       # Task dashboard page (client component)
│   └── layout.tsx       # Root layout component
├── components/          # Reusable UI components
│   ├── TaskCard/        # Component to display individual task
│   ├── TaskForm/        # Component for creating/updating tasks
│   ├── LoginForm/       # Component for login form
│   ├── SignupForm/      # Component for signup form
│   └── ProtectedRoute/  # Component for authentication check
├── lib/                 # Utility functions and API client
│   ├── api.ts           # Centralized API client with JWT injection
│   ├── auth.ts          # Authentication helpers
│   └── types.ts         # TypeScript type definitions
├── hooks/               # Custom React hooks
│   ├── useTasks.ts      # Hook for task data management
│   └── useAuth.ts       # Hook for authentication state
├── styles/              # Global styles and Tailwind configuration
│   └── globals.css      # Main stylesheet
├── types/               # Type definitions
│   ├── Task.ts          # Task interface
│   └── User.ts          # User interface
├── package.json         # Dependencies (Next.js, Better Auth, Tailwind, etc.)
├── tsconfig.json        # TypeScript configuration
├── tailwind.config.ts   # Tailwind CSS configuration
└── .env.local           # Local environment variables
```

**Structure Decision**: This is a web application with separate frontend and backend. This feature focuses only on the frontend layer, creating UI components for the 3 required pages (Login, Signup, Task Dashboard) and utility functions for API communication. The backend layer remains untouched. The structure follows Next.js App Router conventions with proper component organization and type safety.

**Dependency on Feature 004**: This frontend consumes the Task CRUD API endpoints created in Feature 004 (backend/routes/tasks.py). The API client will connect to the backend API at the endpoints defined there.

## Complexity Tracking

No constitution violations. All requirements align with constitutional standards.

## Phase 0: Research & Clarifications

**Status**: Minimal research required - most technical decisions are mandated by constitution.

**Key Decisions** (from constitution and existing architecture):
- **Decision**: Use Next.js 16+ with App Router
  - **Rationale**: Constitution mandates Next.js with App Router (not Pages Router)
  - **Alternatives**: React with Create React App, Vue.js, Angular - rejected per constitution

- **Decision**: Better Auth for authentication
  - **Rationale**: Constitution mandates Better Auth library only (no custom auth, no external frameworks)
  - **Alternatives**: Auth0, Firebase Auth, custom JWT solution - rejected per constitution

- **Decision**: Tailwind CSS for styling
  - **Rationale**: Constitution mandates Tailwind CSS (no external UI frameworks like Material-UI)
  - **Alternatives**: Styled-components, Emotion, CSS Modules - rejected per constitution

- **Decision**: TypeScript with strict mode
  - **Rationale**: Constitution mandates TypeScript with strict mode
  - **Alternatives**: JavaScript - rejected per constitution

- **Decision**: Centralized API client with JWT injection
  - **Rationale**: Constitution mandates centralized API client with JWT auto-attachment
  - **Alternatives**: Direct fetch calls, Axios instances scattered across components - rejected per constitution

- **Decision**: Server Components by default, Client Components when needed
  - **Rationale**: Constitution mandates Server Components for performance/security
  - **Alternatives**: Client Components for everything - rejected per constitution

**No research.md file required** - all technical context resolved by constitution and existing backend API (Feature 004).

## Phase 1: Design & Contracts

### Data Model

**Entity: User Session** (frontend only)
```typescript
interface UserSession {
  /** JWT token from Better Auth */
  token: string;
  /** User identity from token payload */
  userId: string;
  /** Email for display */
  email: string;
  /** Expiration timestamp */
  expiresAt: Date;
}
```

**Entity: Task** (matches backend model from Feature 003/004)
```typescript
interface Task {
  /** Unique task identifier (auto-generated by backend) */
  id: number;
  /** ID of the user who owns this task */
  user_id: string;
  /** Task title */
  title: string;
  /** Optional task description */
  description: string | null;
  /** Completion status */
  completed: boolean;
  /** Timestamp when task was created (UTC) */
  created_at: Date;
  /** Timestamp when task was last updated (UTC) */
  updated_at: Date;
}
```

### API Contracts

**File**: `specs/005-frontend-ui/contracts/frontend-api-contracts.md`

```markdown
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
```

### Quickstart Guide

**File**: `specs/005-frontend-ui/quickstart.md`

```markdown
# Frontend UI - Quickstart Guide

## Prerequisites

- Backend API running (Feature 004: Task CRUD API implemented)
- Valid JWT token from authentication
- Node.js 18+ and npm/yarn installed

## Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Update API URL in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Running the Application

```bash
npm run dev
```

Application will start at http://localhost:3000

## Key Components

### Authentication
- **Login Page**: `/app/login/page.tsx` - Login form with Better Auth integration
- **Signup Page**: `/app/signup/page.tsx` - Registration form with Better Auth integration
- **Protected Routes**: `components/ProtectedRoute.tsx` - Ensures user is authenticated

### Task Management
- **Dashboard**: `/app/dashboard/page.tsx` - Main task management page
- **Task Card**: `components/TaskCard.tsx` - Displays individual task with completion toggle
- **Task Form**: `components/TaskForm.tsx` - Form for creating and updating tasks

### API Client
- **API Service**: `lib/api.ts` - Centralized API client with JWT auto-attachment
- **Hooks**: `hooks/useTasks.ts`, `hooks/useAuth.ts` - Custom React hooks for data management

## Testing

Run component tests:
```bash
npm run test
```

Run E2E tests:
```bash
npm run test:e2e
```

## Dependencies

This feature depends on:
- **Feature 002**: Authentication (Better Auth backend service)
- **Feature 004**: Task CRUD API endpoints
- **Constitution**: Frontend technology stack requirements
```

## Phase 2: Implementation Planning

**This phase is handled by the `/sp.tasks` command** - NOT by `/sp.plan`.

The `/sp.tasks` command will generate a detailed task breakdown in `specs/005-frontend-ui/tasks.md` based on this implementation plan.

## Summary

**Planning Complete**:
- ✅ Technical context established (Next.js 16+, TypeScript, Tailwind, Better Auth)
- ✅ Constitution check passed (all requirements satisfied)
- ✅ Project structure defined (frontend with App Router, components, API client)
- ✅ Data models documented (User Session, Task interfaces)
- ✅ API contracts documented (consumes Feature 004 backend API)
- ✅ Quickstart guide created (setup and running instructions)

**Next Steps**:
1. Run `/sp.tasks` to generate task breakdown
2. Run `/sp.implement` to execute tasks
3. Validate implementation against spec acceptance criteria
4. Run architecture audit with architecture-boundary-guardian agent
5. Run frontend-specific security validation

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
