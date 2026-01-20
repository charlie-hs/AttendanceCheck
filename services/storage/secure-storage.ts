/**
 * Secure Storage Service
 *
 * Provides secure storage for sensitive data like authentication tokens.
 * Uses expo-secure-store for encrypted storage on device.
 */

import * as SecureStore from 'expo-secure-store';

/**
 * Storage keys for authentication tokens.
 */
export const TOKEN_KEYS = {
  ACCESS_TOKEN: 'auth_access_token',
  REFRESH_TOKEN: 'auth_refresh_token',
} as const;

/**
 * Secure storage wrapper for expo-secure-store.
 */
export const secureStorage = {
  /**
   * Store a value securely.
   */
  async setItem(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value);
  },

  /**
   * Retrieve a stored value.
   */
  async getItem(key: string): Promise<string | null> {
    return SecureStore.getItemAsync(key);
  },

  /**
   * Remove a stored value.
   */
  async deleteItem(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  },
};

// ============================================================================
// TOKEN HELPERS
// ============================================================================

/**
 * Get the stored access token.
 */
export async function getAccessToken(): Promise<string | null> {
  return secureStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
}

/**
 * Get the stored refresh token.
 */
export async function getRefreshToken(): Promise<string | null> {
  return secureStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
}

/**
 * Store both access and refresh tokens.
 */
export async function setTokens(accessToken: string, refreshToken: string): Promise<void> {
  await Promise.all([
    secureStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken),
    secureStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken),
  ]);
}

/**
 * Clear all authentication tokens.
 */
export async function clearTokens(): Promise<void> {
  await Promise.all([
    secureStorage.deleteItem(TOKEN_KEYS.ACCESS_TOKEN),
    secureStorage.deleteItem(TOKEN_KEYS.REFRESH_TOKEN),
  ]);
}
