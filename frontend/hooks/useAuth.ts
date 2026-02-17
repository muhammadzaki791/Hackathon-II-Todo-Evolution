/**
 * useAuth Hook
 * Custom React hook for authentication state management
 *
 * Provides access to current user session, authentication status,
 * and methods for sign in, sign up, and sign out.
 *
 * Constitution Compliance:
 * - FR-013: Manages JWT token automatically
 * - FR-014: Provides authentication state for protected routes
 */

'use client';

import { useState, useEffect } from 'react';
import { getSession, signIn, signUp, signOut } from '@/lib/auth';
import { UserSession } from '@/types/User';

interface UseAuthReturn {
  /** Current user session (null if not authenticated) */
  session: UserSession | null;

  /** Loading state during authentication operations */
  isLoading: boolean;

  /** Error message from authentication operations */
  error: string | null;

  /** Sign in with email and password */
  login: (email: string, password: string) => Promise<void>;

  /** Sign up new user with email and password */
  signup: (email: string, password: string, name?: string) => Promise<void>;

  /** Sign out current user */
  logout: () => Promise<void>;

  /** Refresh session from server */
  refreshSession: () => Promise<void>;
}

/**
 * Custom hook for authentication state and operations
 *
 * Usage:
 * ```typescript
 * const { session, isLoading, error, login, signup, logout } = useAuth();
 *
 * if (isLoading) return <div>Loading...</div>;
 * if (!session) return <div>Please log in</div>;
 *
 * return <div>Welcome, {session.user.email}!</div>;
 * ```
 */
export function useAuth(): UseAuthReturn {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load session on mount
  useEffect(() => {
    async function loadSession() {
      try {
        const currentSession = await getSession();
        setSession(currentSession as UserSession | null);
      } catch (err) {
        console.error('Failed to load session:', err);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadSession();
  }, []);

  /**
   * Sign in with email and password
   * FR-002: Authenticate users and redirect to dashboard
   */
  async function login(email: string, password: string) {
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn(email, password);

      // signIn already stores the token in localStorage
      // Now set the session state directly from the result
      if (result && result.user && result.token) {
        setSession({
          user: result.user,
          token: result.token,
          expiresAt: result.expiresAt,
        });
      } else {
        throw new Error('Invalid response from server');
      }

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Sign up new user with email and password
   * FR-003: Register new user account
   */
  async function signup(email: string, password: string, name?: string) {
    setError(null);
    setIsLoading(true);

    try {
      const result = await signUp(email, password, name);

      // signUp already stores the token in localStorage
      // Now set the session state directly from the result
      if (result && result.user && result.token) {
        setSession({
          user: result.user,
          token: result.token,
          expiresAt: result.expiresAt,
        });
      } else {
        throw new Error('Invalid response from server');
      }

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signup failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Sign out current user
   * Clears session and JWT token
   */
  async function logout() {
    setError(null);
    setIsLoading(true);

    try {
      // Call backend logout and remove token from localStorage
      await signOut();

      // Clear session state
      setSession(null);

      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Logout failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Refresh session from server
   * Useful after authentication state changes
   */
  async function refreshSession() {
    try {
      const currentSession = await getSession();
      setSession(currentSession as UserSession | null);
    } catch (err) {
      console.error('Failed to refresh session:', err);
      setSession(null);
    }
  }

  return {
    session,
    isLoading,
    error,
    login,
    signup,
    logout,
    refreshSession,
  };
}
