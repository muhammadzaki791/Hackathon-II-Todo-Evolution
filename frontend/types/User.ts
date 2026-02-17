/**
 * User interface for authenticated user session
 *
 * Represents the authenticated user's session data with JWT token.
 * Used for authentication state management in the frontend.
 */
export interface User {
  /** User unique identifier */
  id: string;

  /** User email address */
  email: string;

  /** User's name (if available) */
  name?: string;
}

/**
 * UserSession interface for frontend authentication state
 *
 * Represents the complete user session including JWT token.
 * Managed by Better Auth and stored securely in the frontend.
 */
export interface UserSession {
  /** JWT token from Better Auth */
  token: string;

  /** User identity information */
  user: User;

  /** Expiration timestamp (UTC) */
  expiresAt: string;
}

/**
 * AuthState interface for authentication context
 *
 * Represents the current authentication state in the application.
 * Used by useAuth hook and authentication components.
 */
export interface AuthState {
  /** Current user session (null if not authenticated) */
  session: UserSession | null;

  /** Loading state during authentication operations */
  isLoading: boolean;

  /** Error message from authentication operations */
  error: string | null;
}
