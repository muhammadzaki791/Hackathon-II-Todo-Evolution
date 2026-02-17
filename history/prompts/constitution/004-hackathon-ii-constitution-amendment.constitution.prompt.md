---
id: 004
title: Hackathon II Constitution Amendment
stage: constitution
date: 2026-02-06
surface: agent
model: claude-sonnet-4-5
feature: none
branch: 001-monorepo-setup
user: dell
command: /sp.constitution
labels: ["constitution", "amendment", "hackathon", "ai-native", "auditability"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
 - none (governance document)
---

## Prompt

/sp.constitution

Project: Hackathon II – Todo Full-Stack Web Application

Core principles:
- Spec-first development: no code without an approved specification
- Single global constitution governing all features
- Strict separation of concerns (Frontend, Backend, Database)
- Security-by-design across all layers
- AI-native development using Claude Code and Spec-Kit Plus
- No manual coding outside /sp.implement

Key standards:
- All features must be defined using /sp.specify
- All implementation must trace back to specs
- Authentication uses JWT tokens exclusively
- All API endpoints require authentication unless explicitly specified
- User data must be isolated and ownership enforced
- Database access only via ORM (SQLModel)
- Secrets managed via environment variables only
- Reusable Intelligence (sub-agents + skills) encouraged

Constraints:
- Monorepo architecture
- Frontend: Next.js 16+ (App Router)
- Backend: Python FastAPI
- ORM: SQLModel
- Database: Neon Serverless PostgreSQL
- Auth: Better Auth with JWT
- No external UI/auth frameworks outside specification

Success criteria:
- Constitution applies uniformly to all specs
- All features follow Spec-Kit Plus workflow
- No undocumented behavior in codebase
- Project is auditable, reproducible, and judge-review ready

## Response snapshot

Updated constitution from v1.0.0 to v1.1.0 with Hackathon II enhancements focusing on auditability, AI-native development, and mandatory technology constraints.

**Amendment Scope:**

### 1. Preamble Addition
- Added hackathon context and project metadata
- Established constitution as single global authority
- Defined auditability requirements for judge review
- Emphasized AI-native development model

### 2. Section I Enhancements (Spec-First Development)
- **Added Spec-Kit Plus Workflow**: Mandatory 5-step process (specify → plan → tasks → implement → review)
- **Prohibited Manual Coding**: All code MUST be written by Claude Code via `/sp.implement`
- **Traceability Requirement**: Full traceability from spec to implementation for judges
- **Enforcement**: Manual code changes require retroactive spec creation

### 3. Section III Enhancements (Security-By-Design)
- **JWT Exclusive**: JWT tokens ONLY - no other auth methods
- **Stateless Requirement**: No shared sessions between frontend and backend
- **Default Secure**: All API endpoints require auth UNLESS explicitly marked public in spec
- **Framework Prohibition**: Better Auth ONLY - no custom auth, no Auth0, no Firebase

### 4. Section VII Enhancements (Reproducibility & Traceability)
- **Made NON-NEGOTIABLE**: Critical for hackathon evaluation
- **Auditability Requirements**: Added explicit judge-review criteria
  - Complete traceability (every code change → spec)
  - Reproducible process (judges can follow PHRs)
  - Documented decisions (ADRs for architectural choices)
  - No undocumented behavior
  - AI-native evidence (PHRs + git co-authorship)
- **Hackathon Success Criteria**: 5 specific validation points

### 5. Section VIII Addition (AI-Native Development)
**NEW SECTION**: Reusable Intelligence & Specialized Agents
- **AI-Native Principles**: Claude Code as primary developer, no manual coding
- **Specialized Agents**:
  - `spec-compliance-auditor`: Verify spec adherence
  - `auth-security-specialist`: Validate auth patterns
  - `architecture-boundary-guardian`: Enforce boundaries
  - `fullstack-feature-executor`: Orchestrate features
- **Skills**: Spec-Kit Plus commands (`/sp.specify`, `/sp.plan`, `/sp.tasks`, etc.)
- **Benefits**: Consistent quality, specialized expertise, parallel execution

### 6. Technology Stack Constraints (Made MANDATORY)
**Frontend (Next.js 16+):**
- NO external UI frameworks (Material-UI, Ant Design, etc.)
- NO alternative auth providers (Auth0, Firebase, Clerk)
- NO state management without spec justification (Redux, Zustand)
- Build custom components with Tailwind CSS only

**Backend (Python FastAPI):**
- NO alternative frameworks (Django, Flask)
- NO alternative ORMs (raw SQL, Tortoise ORM, Peewee)
- NO custom JWT libraries (PyJWT only)

**Database (Neon PostgreSQL):**
- NO alternative providers (AWS RDS, Supabase, Railway)
- NO raw SQL queries in application code
- NO stored procedures or database triggers
- SQLModel ORM ONLY

### 7. Version Update & Changelog
- **Version**: 1.0.0 → 1.1.0
- **Comprehensive Changelog**: Documented all additions and enhancements
- **Constitutional Authority Section**: Added enforcement rules and auditability statement

## Outcome

- ✅ Impact: Constitution now explicitly governs Hackathon II requirements with judge-ready auditability
- 🧪 Tests: N/A (governance document, no code)
- 📁 Files: Updated constitution.md (v1.1.0, ~650 lines with enhancements)
- 🔁 Next prompts: All future features must comply with enhanced constitution (use `/sp.specify` for auth feature)
- 🧠 Reflection: Amendment strengthens AI-native development model and ensures hackathon evaluation success

## Evaluation notes (flywheel)

- Failure modes observed: None - constitution amendment successful
- Graders run and results (PASS/FAIL): N/A (governance document)
- Prompt variant (if applicable): Amendment request (not initial constitution)
- Next experiment (smallest change to try): Create authentication feature spec under new constitution rules

**Key Enhancements:**
1. **Auditability First**: Every principle now considers judge review requirements
2. **Technology Lock-Down**: Explicit MANDATORY constraints prevent framework drift
3. **AI-Native Enforcement**: Prohibition on manual coding ensures AI-driven development
4. **Reusable Intelligence**: Formal recognition of agents and skills
5. **Single Source of Truth**: Constitution applies uniformly to ALL features

**Constitutional Compliance Validation:**
- ✅ All principles marked (NON-NEGOTIABLE) where critical
- ✅ Technology stack constraints explicit and mandatory
- ✅ Auditability requirements defined for judge review
- ✅ AI-native development model formalized
- ✅ Spec-Kit Plus workflow mandated
- ✅ Traceability and reproducibility emphasized

**Next Phase**: Use enhanced constitution to govern authentication feature specification (`/sp.specify`) and ensure all principles are followed.
