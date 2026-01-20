/**
 * Auth API Service
 *
 * Provides authentication-related API calls.
 */

import { apiClient } from './client';
import { setTokens, clearTokens } from '@/services/storage/secure-storage';
import type { User, AuthTokens } from '@/types';

// ============================================================================
// TYPES
// ============================================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// ============================================================================
// AUTH API
// ============================================================================

export const authApi = {
  /**
   * Register a new user.
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    await setTokens(response.tokens.accessToken, response.tokens.refreshToken);
    return response;
  },

  /**
   * Login with email and password.
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    await setTokens(response.tokens.accessToken, response.tokens.refreshToken);
    return response;
  },

  /**
   * Logout the current user.
   * Always clears tokens, even if API call fails.
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore API errors - we still want to clear local tokens
    } finally {
      await clearTokens();
    }
  },

  /**
   * Refresh the access token.
   */
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const response = await apiClient.post<AuthTokens>('/auth/refresh', { refreshToken });
    await setTokens(response.accessToken, response.refreshToken);
    return response;
  },

  /**
   * Get the current authenticated user.
   */
  async getMe(): Promise<User> {
    return apiClient.get<User>('/auth/me');
  },

  /**
   * Request a password reset email.
   */
  async forgotPassword(email: string): Promise<void> {
    await apiClient.post('/auth/forgot-password', { email });
  },

  /**
   * Reset password using a reset token.
   */
  async resetPassword(token: string, password: string): Promise<void> {
    await apiClient.post('/auth/reset-password', { token, password });
  },
};
