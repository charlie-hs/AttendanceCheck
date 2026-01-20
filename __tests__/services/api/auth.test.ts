/**
 * Auth API Service Tests
 *
 * TDD: RED phase - Write failing tests first
 */

import { authApi, AuthResponse, LoginRequest, RegisterRequest } from '@/services/api/auth';
import { apiClient } from '@/services/api/client';
import * as secureStorage from '@/services/storage/secure-storage';
import type { User, AuthTokens } from '@/types';

// Mock API client
jest.mock('@/services/api/client', () => ({
  apiClient: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

// Mock secure storage
jest.mock('@/services/storage/secure-storage', () => ({
  setTokens: jest.fn(),
  clearTokens: jest.fn(),
}));

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;
const mockSecureStorage = secureStorage as jest.Mocked<typeof secureStorage>;

describe('authApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  const mockTokens: AuthTokens = {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
    expiresIn: 3600,
    tokenType: 'Bearer',
  };

  const mockAuthResponse: AuthResponse = {
    user: mockUser,
    tokens: mockTokens,
  };

  describe('register', () => {
    it('should register new user and store tokens', async () => {
      mockApiClient.post.mockResolvedValueOnce(mockAuthResponse);

      const result = await authApi.register({
        email: 'test@example.com',
        password: 'Password123',
        name: 'Test User',
      });

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/register', {
        email: 'test@example.com',
        password: 'Password123',
        name: 'Test User',
      });
      expect(mockSecureStorage.setTokens).toHaveBeenCalledWith(
        mockTokens.accessToken,
        mockTokens.refreshToken
      );
      expect(result).toEqual(mockAuthResponse);
    });

    it('should throw on registration failure', async () => {
      mockApiClient.post.mockRejectedValueOnce({
        message: 'Email already exists',
        statusCode: 400,
      });

      await expect(
        authApi.register({
          email: 'existing@example.com',
          password: 'Password123',
          name: 'Test User',
        })
      ).rejects.toMatchObject({
        message: 'Email already exists',
        statusCode: 400,
      });

      expect(mockSecureStorage.setTokens).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login user and store tokens', async () => {
      mockApiClient.post.mockResolvedValueOnce(mockAuthResponse);

      const result = await authApi.login({
        email: 'test@example.com',
        password: 'Password123',
      });

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'Password123',
      });
      expect(mockSecureStorage.setTokens).toHaveBeenCalledWith(
        mockTokens.accessToken,
        mockTokens.refreshToken
      );
      expect(result).toEqual(mockAuthResponse);
    });

    it('should throw on invalid credentials', async () => {
      mockApiClient.post.mockRejectedValueOnce({
        message: 'Invalid credentials',
        statusCode: 401,
      });

      await expect(
        authApi.login({
          email: 'test@example.com',
          password: 'wrong',
        })
      ).rejects.toMatchObject({
        message: 'Invalid credentials',
        statusCode: 401,
      });

      expect(mockSecureStorage.setTokens).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should clear tokens and call logout endpoint', async () => {
      mockApiClient.post.mockResolvedValueOnce({});

      await authApi.logout();

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/logout');
      expect(mockSecureStorage.clearTokens).toHaveBeenCalled();
    });

    it('should clear tokens even if API call fails', async () => {
      mockApiClient.post.mockRejectedValueOnce(new Error('Network error'));

      await authApi.logout();

      expect(mockSecureStorage.clearTokens).toHaveBeenCalled();
    });
  });

  describe('refreshToken', () => {
    it('should refresh tokens and store new ones', async () => {
      const newTokens: AuthTokens = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        expiresIn: 3600,
        tokenType: 'Bearer',
      };
      mockApiClient.post.mockResolvedValueOnce(newTokens);

      const result = await authApi.refreshToken('old-refresh-token');

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/refresh', {
        refreshToken: 'old-refresh-token',
      });
      expect(mockSecureStorage.setTokens).toHaveBeenCalledWith(
        newTokens.accessToken,
        newTokens.refreshToken
      );
      expect(result).toEqual(newTokens);
    });
  });

  describe('getMe', () => {
    it('should fetch current user', async () => {
      mockApiClient.get.mockResolvedValueOnce(mockUser);

      const result = await authApi.getMe();

      expect(mockApiClient.get).toHaveBeenCalledWith('/auth/me');
      expect(result).toEqual(mockUser);
    });
  });

  describe('forgotPassword', () => {
    it('should request password reset email', async () => {
      mockApiClient.post.mockResolvedValueOnce({ message: 'Email sent' });

      await authApi.forgotPassword('test@example.com');

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/forgot-password', {
        email: 'test@example.com',
      });
    });
  });

  describe('resetPassword', () => {
    it('should reset password with token', async () => {
      mockApiClient.post.mockResolvedValueOnce({ message: 'Password reset' });

      await authApi.resetPassword('reset-token', 'NewPassword123');

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/reset-password', {
        token: 'reset-token',
        password: 'NewPassword123',
      });
    });
  });
});
