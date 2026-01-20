/**
 * Secure Storage Service Tests
 *
 * TDD: RED phase - Write failing tests first
 */

import {
  secureStorage,
  TOKEN_KEYS,
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from '@/services/storage/secure-storage';

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

import * as SecureStore from 'expo-secure-store';

const mockSecureStore = SecureStore as jest.Mocked<typeof SecureStore>;

describe('secureStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('setItem', () => {
    it('should store value securely', async () => {
      mockSecureStore.setItemAsync.mockResolvedValueOnce(undefined);

      await secureStorage.setItem('test-key', 'test-value');

      expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith('test-key', 'test-value');
    });
  });

  describe('getItem', () => {
    it('should retrieve stored value', async () => {
      mockSecureStore.getItemAsync.mockResolvedValueOnce('stored-value');

      const result = await secureStorage.getItem('test-key');

      expect(result).toBe('stored-value');
      expect(mockSecureStore.getItemAsync).toHaveBeenCalledWith('test-key');
    });

    it('should return null for non-existent key', async () => {
      mockSecureStore.getItemAsync.mockResolvedValueOnce(null);

      const result = await secureStorage.getItem('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('deleteItem', () => {
    it('should remove stored value', async () => {
      mockSecureStore.deleteItemAsync.mockResolvedValueOnce(undefined);

      await secureStorage.deleteItem('test-key');

      expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('test-key');
    });
  });
});

describe('Token helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('TOKEN_KEYS', () => {
    it('should have correct key names', () => {
      expect(TOKEN_KEYS.ACCESS_TOKEN).toBe('auth_access_token');
      expect(TOKEN_KEYS.REFRESH_TOKEN).toBe('auth_refresh_token');
    });
  });

  describe('getAccessToken', () => {
    it('should retrieve access token', async () => {
      mockSecureStore.getItemAsync.mockResolvedValueOnce('access-token');

      const result = await getAccessToken();

      expect(result).toBe('access-token');
      expect(mockSecureStore.getItemAsync).toHaveBeenCalledWith(TOKEN_KEYS.ACCESS_TOKEN);
    });
  });

  describe('getRefreshToken', () => {
    it('should retrieve refresh token', async () => {
      mockSecureStore.getItemAsync.mockResolvedValueOnce('refresh-token');

      const result = await getRefreshToken();

      expect(result).toBe('refresh-token');
      expect(mockSecureStore.getItemAsync).toHaveBeenCalledWith(TOKEN_KEYS.REFRESH_TOKEN);
    });
  });

  describe('setTokens', () => {
    it('should store both access and refresh tokens', async () => {
      mockSecureStore.setItemAsync.mockResolvedValue(undefined);

      await setTokens('new-access', 'new-refresh');

      expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith(
        TOKEN_KEYS.ACCESS_TOKEN,
        'new-access'
      );
      expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith(
        TOKEN_KEYS.REFRESH_TOKEN,
        'new-refresh'
      );
    });
  });

  describe('clearTokens', () => {
    it('should remove both tokens', async () => {
      mockSecureStore.deleteItemAsync.mockResolvedValue(undefined);

      await clearTokens();

      expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith(TOKEN_KEYS.ACCESS_TOKEN);
      expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith(TOKEN_KEYS.REFRESH_TOKEN);
    });
  });
});
