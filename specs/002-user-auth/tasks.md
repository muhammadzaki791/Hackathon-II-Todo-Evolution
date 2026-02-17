# Tasks: Authentication and User Identity

**Input**: Specification from `/specs/002-user-auth/spec.md`
**Prerequisites**: spec.md (user stories with priorities), constitution v1.1.0, monorepo setup (Feature 001)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- All paths are relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency installation

- [x] T001 Install Better Auth library in frontend: `cd frontend && npm install better-auth`
- [x] T002 Install PyJWT library in backend: `cd backend && pip install pyjwt python-dotenv`
- [x] T003 [P] Create frontend `.env.local` with BETTER_AUTH_SECRET placeholder
- [x] T004 [P] Create backend `.env` with BETTER_AUTH_SECRET and DATABASE_URL placeholders
- [x] T005 Add `.env` and `.env.local` to `.gitignore` (if not already present)

**Acceptance Criteria for Phase 1**:
- Better Auth installed in frontend (check package.json)
- PyJWT installed in backend (check requirements.txt or verify with `pip list`)
- Environment files created with proper placeholders
- Secrets excluded from git

**Verification**:
```bash
cd frontend && npm list better-auth
cd backend && pip show pyjwt
cat .gitignore | grep ".env"
```

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Create Better Auth configuration file in frontend/lib/auth.ts
- [x] T007 Configure Better Auth with email/password provider and JWT plugin
- [x] T008 Create PyJWT verification utility in backend/auth.py with verify_jwt_token function
- [x] T009 Create get_current_user_id dependency in backend/auth.py
- [x] T010 [P] Create User model in backend/models.py with SQLModel (id, email, password_hash, name, created_at, updated_at)
- [x] T011 [P] Create centralized API client in frontend/lib/api.ts with JWT token attachment logic
- [x] T012 Update backend/main.py to initialize database tables on startup (SQLModel.metadata.create_all)

**Acceptance Criteria for Phase 2**:
- Better Auth configured with JWT plugin
- Backend JWT verification middleware ready
- User model defined with proper fields and constraints
- Centralized API client created
- Database initialization configured

**Verification**:
```bash
cat frontend/lib/auth.ts | grep "betterAuth"
cat backend/auth.py | grep "verify_jwt_token"
cat backend/models.py | grep "class User"
cat frontend/lib/api.ts | grep "Authorization"
```

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - User Signup (Priority: P1) 🎯 MVP

**Goal**: Enable new users to create accounts with email and password

**Independent Test**: New user can create account, see confirmation, and immediately sign in with those credentials

### Implementation for User Story 1

- [ ] T013 [P] [US1] Create signup page component in frontend/app/signup/page.tsx
- [ ] T014 [P] [US1] Create signup form component in frontend/components/auth/SignupForm.tsx with email and password fields
- [ ] T015 [US1] Implement client-side validation in SignupForm (email format, password requirements: min 8 chars, 1 uppercase, 1 lowercase, 1 number)
- [ ] T016 [US1] Integrate Better Auth signup function in SignupForm handleSubmit
- [ ] T017 [US1] Add error handling for duplicate email ("Email already in use")
- [ ] T018 [US1] Add redirect to dashboard on successful signup
- [ ] T019 [P] [US1] Create POST /api/auth/signup endpoint in Better Auth (handled by Better Auth library - verify configuration)
- [ ] T020 [US1] Test signup flow end-to-end: valid email/password creates account and redirects

**Acceptance Criteria for User Story 1**:
- Signup page accessible at /signup
- Email format validation works
- Password requirements enforced (8+ chars, mixed case, number)
- Duplicate email returns "Email already in use" error
- Successful signup creates user in database and redirects to dashboard
- User can immediately sign in with new credentials

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - User Signin (Priority: P1) 🎯 MVP

**Goal**: Enable registered users to sign in with email and password

**Independent Test**: Registered user can sign in with correct credentials and access dashboard. Wrong credentials show appropriate error.

### Implementation for User Story 2

- [ ] T021 [P] [US2] Create signin page component in frontend/app/signin/page.tsx
- [ ] T022 [P] [US2] Create signin form component in frontend/components/auth/SigninForm.tsx with email and password fields
- [ ] T023 [US2] Integrate Better Auth signin function in SigninForm handleSubmit
- [ ] T024 [US2] Add error handling for invalid credentials (generic message: "Invalid email or password")
- [ ] T025 [US2] Add redirect to dashboard on successful signin
- [ ] T026 [US2] Store JWT token in httpOnly cookie or secure localStorage (Better Auth handles this)
- [ ] T027 [P] [US2] Create POST /api/auth/signin endpoint in Better Auth (handled by Better Auth library - verify configuration)
- [ ] T028 [US2] Test signin flow: correct credentials work, wrong password shows error, non-existent email shows same error

**Acceptance Criteria for User Story 2**:
- Signin page accessible at /signin
- Correct email+password signs user in and redirects to dashboard
- Wrong password returns "Invalid email or password" (no hint)
- Non-existent email returns same error message
- JWT token stored securely after successful signin
- User remains signed in across page navigation

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - JWT Token Management (Priority: P1) 🎯 MVP

**Goal**: Issue and validate JWT tokens for secure API access

**Independent Test**: API requests with valid token succeed. Requests without token or with expired token return 401 Unauthorized.

### Implementation for User Story 3

- [ ] T029 [P] [US3] Verify Better Auth JWT token generation includes user_id, email, exp, iat claims (check auth.ts configuration)
- [ ] T030 [P] [US3] Set JWT token expiration to 7 days in Better Auth configuration (frontend/lib/auth.ts)
- [ ] T031 [US3] Create JWT verification middleware in backend using verify_jwt_token from auth.py
- [ ] T032 [US3] Apply JWT verification to all protected API endpoints (create Depends(get_current_user_id) dependency)
- [ ] T033 [US3] Implement 401 Unauthorized response for missing JWT token
- [ ] T034 [US3] Implement 401 Unauthorized response with "Token has expired" message for expired tokens
- [ ] T035 [P] [US3] Create protected test endpoint GET /api/{user_id}/test in backend to validate JWT verification
- [ ] T036 [US3] Test JWT verification: valid token succeeds, missing token returns 401, expired token returns 401 with message

**Acceptance Criteria for User Story 3**:
- JWT tokens issued on signin contain user_id, email, exp (7 days), iat
- Backend extracts user_id from validated token
- API requests without token return 401 Unauthorized
- API requests with expired token return 401 with "Token has expired"
- Protected endpoints only accessible with valid JWT
- User_id from token used for data filtering (ready for task CRUD feature)

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently - complete authentication system functional

---

## Phase 6: User Story 4 - Logout Functionality (Priority: P2)

**Goal**: Allow signed-in users to terminate their session

**Independent Test**: User clicks logout, session ends, JWT cleared, cannot access protected resources without re-authentication

### Implementation for User Story 4

- [ ] T037 [P] [US4] Create logout button component in frontend/components/auth/LogoutButton.tsx
- [ ] T038 [US4] Integrate Better Auth logout function in LogoutButton onClick handler
- [ ] T039 [US4] Clear JWT token from storage on logout (Better Auth handles this)
- [ ] T040 [US4] Redirect to signin page after successful logout
- [ ] T041 [P] [US4] Add logout button to dashboard header or navigation
- [ ] T042 [P] [US4] Create protected route middleware in frontend/middleware.ts to check authentication
- [ ] T043 [US4] Redirect unauthenticated users to signin page when accessing protected routes
- [ ] T044 [US4] Test logout flow: click logout, redirected to signin, cannot access dashboard without re-authentication

**Acceptance Criteria for User Story 4**:
- Logout button visible on dashboard/navigation
- Clicking logout clears session and redirects to signin page
- After logout, accessing protected pages redirects to signin
- After logout, API requests with old token are rejected (token no longer valid)
- User must sign in again to access protected resources

**Checkpoint**: All user stories (1, 2, 3, 4) should now be independently functional - complete authentication feature delivered

---

## Phase 7: Integration & Polish

**Purpose**: Cross-cutting concerns and final integration

- [ ] T045 [P] Create dashboard placeholder page in frontend/app/dashboard/page.tsx (for post-signin redirect)
- [ ] T046 [P] Add authentication status indicator in navigation (show user email when signed in)
- [ ] T047 [P] Update root page (frontend/app/page.tsx) to redirect to dashboard if authenticated, signin if not
- [ ] T048 Add loading states to signup and signin forms
- [ ] T049 [P] Add password visibility toggle to signup and signin forms
- [ ] T050 [P] Style authentication forms with Tailwind CSS (consistent with app design)
- [ ] T051 Update frontend/lib/api.ts to handle 401 responses by redirecting to signin page
- [ ] T052 [P] Add user-friendly error messages for network failures
- [ ] T053 Document BETTER_AUTH_SECRET generation and configuration in README.md

**Acceptance Criteria for Phase 7**:
- Dashboard page exists and shows authenticated user
- Root page intelligently redirects based on auth status
- Forms have loading states during submission
- 401 responses trigger automatic redirect to signin
- README documents environment setup

**Checkpoint**: Authentication feature polished and production-ready

---

## Phase 8: Security Validation

**Purpose**: Validate security requirements from constitution

- [ ] T054 Verify all API endpoints use Depends(get_current_user_id) for authentication
- [ ] T055 Verify user_id from JWT is used for data filtering (ready for task CRUD)
- [ ] T056 Verify URL user_id matches token user_id in all endpoints (pattern ready for task CRUD)
- [ ] T057 Verify generic error messages ("Invalid email or password") prevent user enumeration
- [ ] T058 Verify BETTER_AUTH_SECRET is not committed to git (check .gitignore)
- [ ] T059 Verify passwords are hashed before storage (Better Auth handles this - confirm)
- [ ] T060 Test concurrent sessions: user signs in from multiple browsers - both sessions work
- [ ] T061 Test token expiration: manually set short expiration, verify 401 after expiration

**Acceptance Criteria for Phase 8**:
- Constitution Section III (Security-By-Design) requirements met
- JWT-exclusive authentication verified
- User isolation pattern established
- No security vulnerabilities (generic errors, hashed passwords, secret management)
- Ready for auth-security-specialist agent review

**Checkpoint**: Security foundation validated and constitution-compliant

---

## Summary

**Total Tasks**: 61 tasks across 8 phases (4 user story phases, 4 supporting phases)

**Task Breakdown by User Story**:
- Setup: 5 tasks
- Foundational: 7 tasks
- **User Story 1 (Signup)**: 8 tasks
- **User Story 2 (Signin)**: 8 tasks
- **User Story 3 (JWT Management)**: 8 tasks
- **User Story 4 (Logout)**: 8 tasks
- Integration & Polish: 9 tasks
- Security Validation: 8 tasks

**Estimated Completion**: Implementation can begin immediately with full-stack tasks

**Critical Path**:
1. Phase 1: Setup (install dependencies)
2. Phase 2: Foundational (Better Auth config, JWT utils, User model, API client)
3. Phase 3: US1 - Signup (can test independently)
4. Phase 4: US2 - Signin (depends on signup for testing, but can implement in parallel)
5. Phase 5: US3 - JWT Management (validates US1 and US2 security)
6. Phase 6: US4 - Logout (builds on US2)
7. Phase 7: Integration (polish)
8. Phase 8: Security validation

**Parallelization Opportunities**:
- Within Phase 1: T003 and T004 (environment files)
- Within Phase 2: T010 (User model) and T011 (API client)
- Within each user story: UI components and backend endpoints can be developed in parallel (marked with [P])

**MVP Scope** (Minimum Viable Product):
- Phase 1: Setup (required)
- Phase 2: Foundational (required)
- Phase 3: User Story 1 - Signup (P1)
- Phase 4: User Story 2 - Signin (P1)
- Phase 5: User Story 3 - JWT Management (P1)

This MVP delivers a complete authentication system (signup, signin, JWT verification) in 28 tasks. User Story 4 (Logout) and polish phases can be added incrementally.

**Independent Testing**:
- US1 can be tested standalone: create account, verify database entry
- US2 can be tested standalone: sign in with test account
- US3 can be tested standalone: make API calls with/without valid tokens
- US4 can be tested standalone: logout and verify session termination

**Dependencies**:
- US2 (Signin) depends on US1 (Signup) for testing (need accounts to sign in)
- US3 (JWT Management) depends on US2 (Signin) for token issuance
- US4 (Logout) depends on US2 (Signin) for session existence
- Integration phase depends on all user stories

**Next Steps After Completion**:
1. Run auth-security-specialist agent to validate security patterns
2. Begin Task CRUD feature (Feature 003) which will use this authentication
3. Integrate authentication into existing monorepo structure
4. Configure production environment variables
