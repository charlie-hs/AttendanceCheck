/**
 * API Client Configuration
 *
 * This file sets up the base API client for making HTTP requests to the backend.
 * Includes authentication interceptors and token refresh handling.
 */

import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from '@/services/storage/secure-storage';

// TODO: Replace with your actual backend URL
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

// ============================================================================
// TYPES
// ============================================================================

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// ============================================================================
// ERROR UTILITIES
// ============================================================================

/**
 * Type guard to check if an error is an ApiError.
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'statusCode' in error &&
    typeof (error as ApiError).message === 'string' &&
    typeof (error as ApiError).statusCode === 'number'
  );
}

/**
 * Create an ApiError object.
 */
export function createApiError(
  message: string,
  statusCode: number,
  errors?: Record<string, string[]>
): ApiError {
  const error: ApiError = { message, statusCode };
  if (errors) {
    error.errors = errors;
  }
  return error;
}

// ============================================================================
// API CLIENT CLASS
// ============================================================================

class ApiClient {
  private baseUrl: string;
  private isRefreshing = false;
  private refreshPromise: Promise<boolean> | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get headers for requests, including auth token if available.
   */
  private async getHeaders(): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = await getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Handle response parsing and error detection.
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    if (!response.ok) {
      const errorData = isJson ? await response.json() : await response.text();
      const error: ApiError = createApiError(
        errorData.message || 'An error occurred',
        response.status,
        errorData.errors
      );
      throw error;
    }

    if (isJson) {
      return response.json();
    }

    return response.text() as T;
  }

  /**
   * Attempt to refresh the access token.
   * Returns true if refresh succeeded, false otherwise.
   */
  private async refreshAccessToken(): Promise<boolean> {
    // If already refreshing, wait for that to complete
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.doRefreshToken();

    try {
      return await this.refreshPromise;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private async doRefreshToken(): Promise<boolean> {
    try {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) {
        await clearTokens();
        return false;
      }

      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        await clearTokens();
        return false;
      }

      const data = await response.json();
      await setTokens(data.accessToken, data.refreshToken);
      return true;
    } catch {
      await clearTokens();
      return false;
    }
  }

  /**
   * Make a request with automatic 401 handling and token refresh.
   */
  private async request<T>(
    method: string,
    endpoint: string,
    options: { body?: unknown; params?: Record<string, unknown> } = {}
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    if (options.params) {
      Object.keys(options.params).forEach((key) => {
        const value = options.params![key];
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const headers = await this.getHeaders();
    const fetchOptions: RequestInit = {
      method,
      headers,
    };

    if (options.body !== undefined) {
      fetchOptions.body = JSON.stringify(options.body);
    }

    let response = await fetch(url.toString(), fetchOptions);

    // Handle 401 with token refresh
    if (response.status === 401) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        // Retry with new token
        const newHeaders = await this.getHeaders();
        fetchOptions.headers = newHeaders;
        response = await fetch(url.toString(), fetchOptions);
      }
    }

    return this.handleResponse<T>(response);
  }

  // ============================================================================
  // PUBLIC HTTP METHODS
  // ============================================================================

  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
    return this.request<T>('GET', endpoint, { params });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>('POST', endpoint, { body: data });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>('PUT', endpoint, { body: data });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>('PATCH', endpoint, { body: data });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>('DELETE', endpoint);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
