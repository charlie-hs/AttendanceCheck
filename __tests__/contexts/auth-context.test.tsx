/**
 * Auth Context Tests
 *
 * TDD: RED phase - Write failing tests first
 */

import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { authApi } from '@/services/api/auth';
import * as secureStorage from '@/services/storage/secure-storage';
import type { User, AuthTokens } from '@/types';

// Mock auth API
jest.mock('@/services/api/auth', () => ({
  authApi: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    getMe: jest.fn(),
  },
}));

// Mock secure storage
jest.mock('@/services/storage/secure-storage', () => ({
  getAccessToken: jest.fn(),
  getRefreshToken: jest.fn(),
  setTokens: jest.fn(),
  clearTokens: jest.fn(),
}));

const mockAuthApi = authApi as jest.Mocked<typeof authApi>;
const mockSecureStorage = secureStorage as jest.Mocked<typeof secureStorage>;

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

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSecureStorage.getAccessToken.mockResolvedValue(null);
  });

  describe('initial state', () => {
    it('should start with loading state', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });
      expect(result.current.isLoading).toBe(true);
    });

    it('should be unauthenticated initially when no token', async () => {
      mockSecureStorage.getAccessToken.mockResolvedValue(null);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });
  });

  describe('session restore', () => {
    it('should restore session when token exists', async () => {
      mockSecureStorage.getAccessToken.mockResolvedValue('token');
      mockAuthApi.getMe.mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
    });

    it('should clear session when token is invalid', async () => {
      mockSecureStorage.getAccessToken.mockResolvedValue('invalid-token');
      mockAuthApi.getMe.mockRejectedValue({ statusCode: 401 });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });
  });

  describe('signIn', () => {
    it('should authenticate user on successful login', async () => {
      mockSecureStorage.getAccessToken.mockResolvedValue(null);
      mockAuthApi.login.mockResolvedValue({ user: mockUser, tokens: mockTokens });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.signIn('test@example.com', 'password');
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
    });

    it('should throw on login failure', async () => {
      mockSecureStorage.getAccessToken.mockResolvedValue(null);
      mockAuthApi.login.mockRejectedValue({ message: 'Invalid credentials', statusCode: 401 });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.signIn('test@example.com', 'wrong');
        })
      ).rejects.toMatchObject({ statusCode: 401 });

      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('signUp', () => {
    it('should authenticate user on successful registration', async () => {
      mockSecureStorage.getAccessToken.mockResolvedValue(null);
      mockAuthApi.register.mockResolvedValue({ user: mockUser, tokens: mockTokens });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.signUp('test@example.com', 'password', 'Test User');
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
    });
  });

  describe('signOut', () => {
    it('should clear user state on logout', async () => {
      mockSecureStorage.getAccessToken.mockResolvedValue('token');
      mockAuthApi.getMe.mockResolvedValue(mockUser);
      mockAuthApi.logout.mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      await act(async () => {
        await result.current.signOut();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });
  });
});
