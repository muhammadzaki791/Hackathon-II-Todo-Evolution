/**
 * Authentication Helpers
 * Frontend authentication utilities
 *
 * Constitution Compliance:
 * - Section II: Frontend communicates ONLY via REST API (no direct database access)
 * - Section III: JWT token management for authentication
 *
 * NOTE: Better Auth full configuration lives in the backend.
 * Frontend only needs to manage session state and make API calls.
 */

'use client';

// Ensure API_BASE is always a full URL in the browser
const API_BASE = typeof window !== 'undefined'
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000')
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');

/**
 * Get JWT token from localStorage
 */
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

/**
 * Store JWT token in localStorage
 */
function setToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_token', token);
}

/**
 * Remove JWT token from localStorage
 */
function removeToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
}

/**
 * Sign up a new user
 * Calls backend authentication endpoint and stores JWT token
 */
export async function signUp(email: string, password: string, name?: string) {
  const response = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Signup failed' }));
    throw new Error(error.message || 'Signup failed');
  }

  const data = await response.json();

  // Store JWT token
  if (data.token) {
    setToken(data.token);
  }

  return data;
}

/**
 * Sign in an existing user
 * Calls backend authentication endpoint and stores JWT token
 */
export async function signIn(email: string, password: string) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Login failed' }));
    throw new Error(error.message || 'Login failed');
  }

  const data = await response.json();

  // Store JWT token
  if (data.token) {
    setToken(data.token);
  }

  return data;
}

/**
 * Sign out current user
 * Removes JWT token from storage and calls backend
 */
export async function signOut() {
  try {
    const token = getToken();

    const response = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });

    if (!response.ok) {
      console.error('Logout request failed');
    }
  } finally {
    // Always remove token, even if backend request fails
    removeToken();
  }
}

/**
 * Get current user session
 * Calls backend to retrieve session with JWT token from localStorage
 */
export async function getSession() {
  try {
    const token = getToken();

    if (!token) {
      return null;
    }

    const response = await fetch(`${API_BASE}/auth/session`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Token is invalid or expired, remove it
      removeToken();
      return null;
    }

    const data = await response.json();

    // Ensure token is still stored (might have been refreshed)
    if (data && data.token) {
      setToken(data.token);
    }

    return data;
  } catch (error) {
    console.error('Failed to get session:', error);
    removeToken();
    return null;
  }
}

