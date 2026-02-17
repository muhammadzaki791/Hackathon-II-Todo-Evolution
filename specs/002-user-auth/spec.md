# Feature Specification: Authentication and User Identity

**Feature Branch**: `002-user-auth`
**Created**: 2026-02-06
**Status**: Draft
**Input**: User description: "Authentication and User Identity - Users must be able to securely sign up and sign in to access their todo lists. Authentication is handled on the frontend using Better Auth and enforced on the backend using JWT verification."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - User Signup (Priority: P1)

As a new user, I need to create an account with my email and password so that I can access the todo application.

**Why this priority**: Without user signup, no users can access the system. This is the entry point for all users and must work correctly before any other feature.

**Independent Test**: New user can successfully create an account, receive confirmation, and immediately use those credentials to sign in.

**Acceptance Scenarios**:

1. **Given** I am a new user on the signup page, **When** I enter a valid email and password and submit, **Then** my account is created and I am redirected to the dashboard
2. **Given** I am on the signup page, **When** I enter an email that is already registered, **Then** I see an error message "Email already in use"
3. **Given** I am on the signup page, **When** I enter an invalid email format, **Then** I see an error message "Invalid email format"
4. **Given** I am on the signup page, **When** I enter a password that doesn't meet requirements, **Then** I see an error message specifying the password requirements

---

### User Story 2 - User Signin (Priority: P1)

As a registered user, I need to sign in with my email and password so that I can access my todo lists.

**Why this priority**: Returning users need to access their data. Without signin, the application is unusable after the initial signup.

**Independent Test**: Registered user can successfully sign in with correct credentials and access their dashboard. User with wrong credentials receives appropriate error message.

**Acceptance Scenarios**:

1. **Given** I am a registered user on the signin page, **When** I enter my correct email and password and submit, **Then** I am signed in and redirected to my dashboard
2. **Given** I am on the signin page, **When** I enter an incorrect password, **Then** I see an error message "Invalid email or password" (no hint about which is wrong)
3. **Given** I am on the signin page, **When** I enter an email that doesn't exist, **Then** I see an error message "Invalid email or password"
4. **Given** I have just signed in, **When** I navigate to different pages in the app, **Then** I remain signed in without needing to re-authenticate

---

### User Story 3 - JWT Token Management (Priority: P1)

As the system, I need to issue and manage JWT tokens so that users can securely access protected API endpoints.

**Why this priority**: JWT tokens are the security foundation. Without proper token issuance and validation, the entire security model fails.

**Independent Test**: After signin, a valid JWT token is issued. API requests with valid token succeed. API requests without token or with expired token are rejected with 401 Unauthorized.

**Acceptance Scenarios**:

1. **Given** a user successfully signs in, **When** the authentication completes, **Then** a JWT token containing user_id, email, exp, and iat is issued
2. **Given** a user has a valid JWT token, **When** they make an API request with the token in the Authorization header, **Then** the request succeeds and backend extracts user_id from token
3. **Given** a user makes an API request, **When** they don't include a JWT token, **Then** the API returns 401 Unauthorized
4. **Given** a user has an expired JWT token, **When** they make an API request with the expired token, **Then** the API returns 401 Unauthorized with message "Token has expired"

---

### User Story 4 - Logout Functionality (Priority: P2)

As a signed-in user, I need to be able to sign out so that I can end my session and prevent unauthorized access on shared devices.

**Why this priority**: While lower priority than signin/signup, logout is important for security on shared devices. The application can function without it initially, but it's needed for complete security.

**Independent Test**: Signed-in user can click logout, session ends, JWT token is cleared, and user cannot access protected resources without signing in again.

**Acceptance Scenarios**:

1. **Given** I am signed in, **When** I click the logout button, **Then** I am signed out and redirected to the signin page
2. **Given** I have just logged out, **When** I try to access a protected page, **Then** I am redirected to the signin page
3. **Given** I have just logged out, **When** I attempt to use my previous JWT token for an API request, **Then** the request is rejected (token should be invalidated or expired)

---

### Edge Cases

- **Concurrent Sessions**: What happens when a user signs in from multiple devices/browsers? (Allow multiple sessions - JWT is stateless)
- **Token Refresh**: What happens when a JWT token expires during active use? (User must sign in again - no refresh token in scope)
- **Password Requirements**: What are the minimum password requirements? (Minimum 8 characters, at least one uppercase, one lowercase, one number)
- **Email Validation**: Is email verification required after signup? (No - out of scope for Phase II)
- **Brute Force Protection**: How do we prevent repeated login attempts? (Rate limiting at API level - implementation detail)
- **Session Persistence**: Should users remain signed in after browser close? (Yes - JWT stored in httpOnly cookie or localStorage with expiration)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow new users to sign up with email and password
- **FR-002**: System MUST validate email format during signup (standard email regex)
- **FR-003**: System MUST enforce password requirements: minimum 8 characters, at least one uppercase letter, one lowercase letter, and one number
- **FR-004**: System MUST prevent duplicate email registration (unique constraint)
- **FR-005**: System MUST allow registered users to sign in with email and password
- **FR-006**: System MUST verify email and password combination during signin
- **FR-007**: System MUST issue a JWT token on successful signin containing user_id, email, exp (expiration), and iat (issued at)
- **FR-008**: System MUST set JWT token expiration to 7 days from issuance
- **FR-009**: Backend MUST verify JWT signature on EVERY API request to protected endpoints
- **FR-010**: Backend MUST extract user_id from verified JWT token for data isolation
- **FR-011**: Backend MUST return 401 Unauthorized for requests without valid JWT token
- **FR-012**: Backend MUST return 401 Unauthorized for requests with expired JWT tokens
- **FR-013**: System MUST allow signed-in users to log out and clear their session
- **FR-014**: Frontend MUST use Better Auth library for authentication (no custom auth code)
- **FR-015**: Backend MUST use PyJWT library for token verification (no custom JWT code)
- **FR-016**: System MUST use BETTER_AUTH_SECRET environment variable as shared secret (minimum 32 characters)
- **FR-017**: System MUST hash passwords before storage (Better Auth handles this)
- **FR-018**: System MUST NOT expose whether email exists or password is wrong during signin (generic error message)

### Key Entities

- **User**: Represents an authenticated user in the system
  - Attributes: id (string, UUID), email (string, unique), password_hash (string, hashed), name (string, optional), created_at (datetime), updated_at (datetime)
  - Relationships: One user owns many tasks (defined in task CRUD feature)

- **JWT Token**: Self-contained authentication token (not stored in database)
  - Attributes: user_id (string, subject), email (string), exp (integer, Unix timestamp), iat (integer, Unix timestamp), signature (string, HMAC-SHA256)
  - Relationships: References one user via user_id (sub claim)

- **Session**: Represents a user's authenticated session on the frontend
  - Attributes: JWT token (string), user (object with id, email, name), expires_at (datetime)
  - Relationships: Managed by Better Auth, not persisted to database

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: New users can complete signup in under 60 seconds
- **SC-002**: Registered users can sign in within 30 seconds
- **SC-003**: 100% of protected API requests validate JWT tokens before processing
- **SC-004**: Zero unauthorized users can access protected resources (100% security enforcement)
- **SC-005**: JWT token validation adds less than 10ms latency to API requests
- **SC-006**: 95% of signin attempts with correct credentials succeed on first try
- **SC-007**: Users cannot access other users' data (100% user isolation enforcement)
- **SC-008**: Logout successfully terminates session and prevents further access without re-authentication

## Assumptions *(include if making significant assumptions)*

1. **No Email Verification**: Users can sign in immediately after signup without email verification (out of scope)
2. **No Password Reset**: Users cannot reset forgotten passwords (out of scope - will be added in future phase)
3. **No OAuth Providers**: Only email/password authentication (no Google, GitHub, etc. - out of scope)
4. **No Role-Based Access**: All users have the same permissions (out of scope)
5. **Single Factor Authentication**: No two-factor authentication or MFA (out of scope)
6. **JWT Expiration**: 7-day token expiration is acceptable (no refresh token mechanism)
7. **Stateless Authentication**: Backend does not maintain session state (JWT is self-contained)
8. **HTTP-Only Cookies**: JWT tokens stored in HTTP-only cookies for security (or secure localStorage if cookies unavailable)
9. **Better Auth Database**: Better Auth manages its own user table (may be separate from application tables)
10. **Password Hashing**: Better Auth handles password hashing with industry-standard algorithms (bcrypt/argon2)

## Dependencies & Constraints *(include if external dependencies exist)*

### Dependencies

- **Constitution v1.1.0**: Must comply with Section III (Security-By-Design) requirements
- **Monorepo Setup**: Frontend and backend directories must exist (Feature 001-monorepo-setup)
- **Better Auth Library**: Frontend authentication library (npm package)
- **PyJWT Library**: Backend JWT verification library (pip package)
- **BETTER_AUTH_SECRET**: Shared environment variable (minimum 32 characters, same in both frontend and backend)
- **Neon PostgreSQL**: Database for storing user records (managed by Better Auth)

### Constraints

- **Authentication Library**: MUST use Better Auth (no alternatives - constitution requirement)
- **Token Format**: MUST use JWT tokens exclusively (no session cookies, no bearer tokens - constitution requirement)
- **Stateless**: NO shared session state between frontend and backend (JWT is self-contained)
- **Default Secure**: ALL API endpoints require authentication by default (constitution requirement)
- **No Custom Auth**: NO custom authentication logic outside Better Auth and PyJWT libraries
- **Shared Secret**: Both frontend and backend MUST use identical BETTER_AUTH_SECRET value
- **User Isolation**: ALL backend operations MUST filter by authenticated user_id from JWT token

## Out of Scope *(clarify what's NOT included)*

- **OAuth Providers**: No Google, GitHub, Facebook, or other OAuth providers
- **Email Verification**: No email confirmation required after signup
- **Password Reset**: No "forgot password" functionality
- **Two-Factor Authentication**: No 2FA or MFA
- **Role-Based Access Control**: No roles, permissions, or admin users
- **Account Management**: No profile editing, account deletion, or email change
- **Session Management UI**: No "active sessions" view or remote logout
- **Refresh Tokens**: No token refresh mechanism (users must re-authenticate after 7 days)
- **Remember Me**: No extended session duration option
- **Rate Limiting**: No brute force protection (may be added at infrastructure level)
- **Audit Logging**: No login attempt tracking or security event logging

## Notes *(optional - for additional context)*

### Authentication Architecture

This feature implements the JWT-based authentication architecture defined in the constitution:

1. **Frontend (Better Auth)**:
   - Handles user signup and signin UI
   - Manages authentication forms and validation
   - Issues JWT tokens on successful authentication
   - Stores JWT token securely (httpOnly cookie or secure storage)
   - Attaches JWT token to all API requests via centralized API client

2. **Backend (FastAPI + PyJWT)**:
   - Verifies JWT signature on every protected endpoint
   - Extracts user_id from validated token
   - Enforces user isolation by filtering queries with user_id
   - Returns 401 Unauthorized for missing/invalid/expired tokens

3. **Shared Secret**:
   - `BETTER_AUTH_SECRET` environment variable
   - Minimum 32 characters, cryptographically secure
   - Same value in both frontend (.env.local) and backend (.env)
   - Never committed to git (in .gitignore)

### Security Considerations

**Password Security:**
- Better Auth handles password hashing (bcrypt or argon2)
- Passwords never stored in plain text
- Minimum complexity requirements enforced

**Token Security:**
- JWT tokens signed with HMAC-SHA256
- Tokens include expiration timestamp (7 days)
- Backend verifies signature and expiration on every request
- Expired tokens rejected with 401 Unauthorized

**User Isolation:**
- Every protected endpoint validates JWT token
- User_id extracted from token payload
- All database queries filtered by authenticated user_id
- URL user_id parameter verified against token user_id

**Error Messages:**
- Generic error messages prevent user enumeration
- "Invalid email or password" (doesn't reveal which is wrong)
- No hints about whether email exists during signin

### Success Validation

This feature is successful when:
1. New users can sign up and immediately sign in
2. Registered users can sign in and access their data
3. JWT tokens are issued correctly with proper expiration
4. Backend validates all tokens and enforces user isolation
5. Users cannot access other users' data
6. Logout terminates sessions cleanly
7. All authentication flows complete within performance targets
8. Security requirements met (password hashing, token verification, error messages)

### Next Steps After This Feature

Once authentication is implemented:
1. Integrate with task CRUD feature (Feature 003) for protected data access
2. Add authentication UI (signup/signin forms) in frontend
3. Implement JWT verification middleware in backend
4. Configure environment variables (BETTER_AUTH_SECRET)
5. Test authentication flows end-to-end
6. Validate user isolation with multiple test users
