/**
 * Centralized API Client
 * Phase II: Authentication and User Identity
 *
 * All backend API calls MUST go through this client.
 * Automatically attaches JWT tokens to requests.
 *
 * Feature 006: Task Organization & Usability Enhancements
 * - Added query parameters for search, filtering, and sorting
 *
 * Constitution v1.1.0 Compliance:
 * - Section II: Frontend communicates ONLY via REST API
 * - Section III: JWT token attached to all protected endpoints
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Task query parameters for filtering, searching, and sorting
 * Feature 006: All parameters are optional
 */
export interface TaskQueryParams {
  search?: string;
  status?: 'pending' | 'completed';
  priority?: 'high' | 'medium' | 'low';
  tags?: string;
  sort?: 'date' | 'alpha' | 'priority';
}

/**
 * Get JWT token from localStorage
 */
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

/**
 * Get authorization headers with JWT token
 * @returns Headers object with Authorization and Content-Type
 * @throws Error if no valid token exists
 */
function getAuthHeaders(): HeadersInit {
  const token = getToken();

  if (!token) {
    throw new Error('No authentication token available');
  }

  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

/**
 * Handle API errors
 * Redirects to signin on 401 Unauthorized
 */
function handleApiError(response: Response) {
  if (response.status === 401) {
    // Token expired or invalid - redirect to signin
    if (typeof window !== 'undefined') {
      window.location.href = '/signin';
    }
    throw new Error('Authentication required');
  }

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
}

/**
 * Centralized API client
 * All methods automatically include JWT token in Authorization header
 */
export const api = {
  /**
   * Get all tasks for authenticated user with optional search, filtering, and sorting
   * Feature 006: Task Organization & Usability Enhancements
   * @param userId User ID (must match authenticated user from JWT)
   * @param params Optional query parameters for filtering, searching, and sorting
   */
  async getTasks(userId: string, params?: TaskQueryParams) {
    const headers = getAuthHeaders();

    // Build query string from params
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.set('search', params.search);
    if (params?.status) queryParams.set('status', params.status);
    if (params?.priority) queryParams.set('priority', params.priority);
    if (params?.tags) queryParams.set('tags', params.tags);
    if (params?.sort) queryParams.set('sort', params.sort);

    const queryString = queryParams.toString();
    const url = `${API_BASE}/api/${userId}/tasks${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    handleApiError(response);
    return response.json();
  },

  /**
   * Create a new task
   * @param userId User ID (must match authenticated user from JWT)
   * @param data Task data (title, description)
   */
  async createTask(userId: string, data: { title: string; description?: string }) {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_BASE}/api/${userId}/tasks`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    handleApiError(response);
    return response.json();
  },

  /**
   * Get a specific task by ID
   * @param userId User ID (must match authenticated user from JWT)
   * @param taskId Task ID
   */
  async getTask(userId: string, taskId: number) {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_BASE}/api/${userId}/tasks/${taskId}`, {
      method: 'GET',
      headers,
    });

    handleApiError(response);
    return response.json();
  },

  /**
   * Update a task
   * @param userId User ID (must match authenticated user from JWT)
   * @param taskId Task ID
   * @param data Partial task data to update
   */
  async updateTask(
    userId: string,
    taskId: number,
    data: { title?: string; description?: string; completed?: boolean }
  ) {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_BASE}/api/${userId}/tasks/${taskId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    handleApiError(response);
    return response.json();
  },

  /**
   * Delete a task
   * @param userId User ID (must match authenticated user from JWT)
   * @param taskId Task ID
   */
  async deleteTask(userId: string, taskId: number) {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_BASE}/api/${userId}/tasks/${taskId}`, {
      method: 'DELETE',
      headers,
    });

    handleApiError(response);
    return null;
  },

  /**
   * Toggle task completion status
   * @param userId User ID (must match authenticated user from JWT)
   * @param taskId Task ID
   */
  async toggleTaskCompletion(userId: string, taskId: number) {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_BASE}/api/${userId}/tasks/${taskId}/complete`, {
      method: 'PATCH',
      headers,
    });

    handleApiError(response);
    return response.json();
  },
};
