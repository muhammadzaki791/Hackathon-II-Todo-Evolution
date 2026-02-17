---
id: 001
title: Phase II Constitution Creation
stage: constitution
date: 2026-02-06
surface: agent
model: claude-sonnet-4-5
feature: none
branch: master
user: dell
command: /sp.constitution
labels: ["constitution", "phase-ii", "full-stack", "security", "architecture"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
 - CLAUDE.md
 - frontend/CLAUDE.md
 - backend/CLAUDE.md
tests:
 - none (constitution definition)
---

## Prompt

/sp.constitution

Project: Phase II – Todo Full-Stack Web Application (Spec-Driven)

Core principles:
- Spec-first development (no implementation without specification)
- Strict separation of frontend, backend, and database layers
- Security-by-design with explicit authentication and authorization
- Reproducibility and traceability across all specs
- No manual coding outside Claude Code execution

Key standards:
- Every feature must be defined in a spec before implementation
- All API behavior must match documented endpoints
- Authentication must enforce user isolation
- Database access only via ORM (SQLModel)
- Frontend communicates only via REST API

Constraints:
- Monorepo architecture using Spec-Kit Plus
- Frontend: Next.js 16+ (App Router)
- Backend: Python FastAPI
- Database: Neon Serverless PostgreSQL
- Auth: Better Auth with JWT
- Environment configuration via .env only

Success criteria:
- Clear monorepo structure created
- CLAUDE.md files defined at root, frontend, backend
- Spec-Kit configuration initialized
- Architecture supports all Phase II requirements

## Response snapshot

Created comprehensive constitution for Phase II Todo Full-Stack Web Application (Version 1.0.0) with the following core principles:

**Seven Core Principles:**
1. **Spec-First Development (NON-NEGOTIABLE)**: Every feature requires complete specification before implementation
2. **Strict Architectural Boundaries**: Clear separation between frontend (Next.js), backend (FastAPI), and database (Neon PostgreSQL)
3. **Security-By-Design (NON-NEGOTIABLE)**: JWT authentication, user data isolation, input validation mandatory
4. **Test-Driven Development**: Red-Green-Refactor cycle with comprehensive test coverage requirements
5. **Monorepo Organization**: Single repository with organized specs and CLAUDE.md guidelines
6. **API-First Design**: RESTful conventions with OpenAPI documentation
7. **Reproducibility & Traceability**: PHRs, ADRs, and git commits document all decisions

**Technology Stack Defined:**
- Frontend: Next.js 16+ (App Router), TypeScript, Tailwind CSS, Better Auth
- Backend: Python FastAPI, SQLModel ORM, PyJWT
- Database: Neon Serverless PostgreSQL with connection pooling
- Development: Docker Compose, Spec-Kit Plus, Claude Code

**Security Requirements Established:**
- JWT token flow with shared BETTER_AUTH_SECRET
- User ID verification on every API endpoint (URL user_id vs token user_id)
- User data isolation enforced at query level
- All secrets in .env files (never committed)
- CORS explicitly configured (no wildcard in production)

**Development Workflow Codified:**
- Phase 1: Specification (features, API, database, UI specs)
- Phase 2: Planning (implementation plans with ADRs)
- Phase 3: Task Breakdown (dependency-ordered tasks)
- Phase 4: Implementation (TDD cycle)
- Phase 5: Review & Integration (tests, spec validation, PR)

**Also Updated:**
- Root CLAUDE.md: Added Phase II monorepo structure, commands, JWT authentication architecture
- frontend/CLAUDE.md: Created comprehensive Next.js guidelines with centralized API client pattern
- backend/CLAUDE.md: Created comprehensive FastAPI guidelines with JWT verification and user isolation patterns

## Outcome

- ✅ Impact: Constitution establishes foundational principles for all Phase II development
- 🧪 Tests: No tests required (governance document)
- 📁 Files: Created/updated 4 files (constitution.md, 3x CLAUDE.md)
- 🔁 Next prompts: Begin with `/sp.specify` to create first feature spec (authentication or task-crud)
- 🧠 Reflection: Constitution provides clear guardrails for spec-driven development with security-first approach

## Evaluation notes (flywheel)

- Failure modes observed: None - constitution creation successful
- Graders run and results (PASS/FAIL): N/A (governance document, no code)
- Prompt variant (if applicable): N/A (initial constitution)
- Next experiment (smallest change to try): Test constitution enforcement by creating first feature spec and validating compliance
