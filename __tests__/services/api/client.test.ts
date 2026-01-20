/**
 * API Client Tests
 *
 * TDD: Tests for the API client with auth interceptors.
 */

import { apiClient, ApiError, isApiError, createApiError } from '@/services/api/client';
import * as secureStorage from '@/services/storage/secure-storage';

// Mock fetch globally
global.fetch = jest.fn();

// Mock secure storage
jest.mock('@/services/storage/secure-storage', () => ({
  getAccessToken: jest.fn(),
  getRefreshToken: jest.fn(),
  setTokens: jest.fn(),
  clearTokens: jest.fn(),
}));

const mockFetch = global.fetch as jest.Mock;
const mockSecureStorage = secureStorage as jest.Mocked<typeof secureStorage>;

describe('ApiClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSecureStorage.getAccessToken.mockResolvedValue(null);
  });

  describe('GET requests', () => {
    it('should make GET request without auth when no token', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => 'application/json' },
        json: async () => ({ data: 'test' }),
      });

      const result = await apiClient.get('/test');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.not.objectContaining({
            Authorization: expect.any(String),
          }),
        })
      );
      expect(result).toEqual({ data: 'test' });
    });

    it('should add auth header when token is available', async () => {
      mockSecureStorage.getAccessToken.mockResolvedValue('test-token');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => 'application/json' },
        json: async () => ({ data: 'test' }),
      });

      await apiClient.get('/test');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      );
    });

    it('should handle query parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => 'application/json' },
        json: async () => ({}),
      });

      await apiClient.get('/test', { page: 1, limit: 10 });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('page=1'),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('limit=10'),
        expect.any(Object)
      );
    });
  });

  describe('POST requests', () => {
    it('should send JSON body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => 'application/json' },
        json: async () => ({ id: 1 }),
      });

      await apiClient.post('/test', { name: 'test' });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'test' }),
        })
      );
    });
  });

  describe('Error handling', () => {
    it('should throw ApiError on non-ok response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        headers: { get: () => 'application/json' },
        json: async () => ({ message: 'Bad request', errors: { email: ['Invalid'] } }),
      });

      await expect(apiClient.get('/test')).rejects.toMatchObject({
        message: 'Bad request',
        statusCode: 400,
        errors: { email: ['Invalid'] },
      });
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(apiClient.get('/test')).rejects.toThrow('Network error');
    });
  });

  describe('401 handling (token refresh)', () => {
    it('should attempt token refresh on 401', async () => {
      mockSecureStorage.getAccessToken.mockResolvedValue('old-token');
      mockSecureStorage.getRefreshToken.mockResolvedValue('refresh-token');

      // First call returns 401
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        headers: { get: () => 'application/json' },
        json: async () => ({ message: 'Unauthorized' }),
      });

      // Refresh token call succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => 'application/json' },
        json: async () => ({
          accessToken: 'new-access-token',
          refreshToken: 'new-refresh-token',
        }),
      });

      // Retry original call succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => 'application/json' },
        json: async () => ({ data: 'success' }),
      });

      const result = await apiClient.get('/protected');

      expect(mockSecureStorage.setTokens).toHaveBeenCalledWith(
        'new-access-token',
        'new-refresh-token'
      );
      expect(result).toEqual({ data: 'success' });
    });

    it('should clear tokens and throw on refresh failure', async () => {
      mockSecureStorage.getAccessToken.mockResolvedValue('old-token');
      mockSecureStorage.getRefreshToken.mockResolvedValue('refresh-token');

      // First call returns 401
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        headers: { get: () => 'application/json' },
        json: async () => ({ message: 'Unauthorized' }),
      });

      // Refresh token call fails
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        headers: { get: () => 'application/json' },
        json: async () => ({ message: 'Invalid refresh token' }),
      });

      await expect(apiClient.get('/protected')).rejects.toMatchObject({
        statusCode: 401,
      });

      expect(mockSecureStorage.clearTokens).toHaveBeenCalled();
    });
  });
});

describe('ApiError utilities', () => {
  describe('isApiError', () => {
    it('should return true for ApiError objects', () => {
      const error: ApiError = {
        message: 'Test error',
        statusCode: 400,
      };
      expect(isApiError(error)).toBe(true);
    });

    it('should return false for regular errors', () => {
      const error = new Error('Regular error');
      expect(isApiError(error)).toBe(false);
    });

    it('should return false for non-objects', () => {
      expect(isApiError('string')).toBe(false);
      expect(isApiError(null)).toBe(false);
      expect(isApiError(undefined)).toBe(false);
    });
  });

  describe('createApiError', () => {
    it('should create ApiError with all fields', () => {
      const error = createApiError('Not found', 404, { id: ['Invalid'] });

      expect(error).toEqual({
        message: 'Not found',
        statusCode: 404,
        errors: { id: ['Invalid'] },
      });
    });

    it('should create ApiError with required fields only', () => {
      const error = createApiError('Server error', 500);

      expect(error).toEqual({
        message: 'Server error',
        statusCode: 500,
      });
    });
  });
});
