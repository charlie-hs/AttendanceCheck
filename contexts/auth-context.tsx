/**
 * Auth Context
 *
 * Provides authentication state management throughout the app.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authApi, type AuthResponse } from '@/services/api/auth';
import { getAccessToken, clearTokens } from '@/services/storage/secure-storage';
import type { User } from '@/types';

// ============================================================================
// TYPES
// ============================================================================

export interface AuthContextValue {
  /** Current authenticated user */
  user: User | null;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Whether auth state is being loaded */
  isLoading: boolean;
  /** Sign in with email and password */
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  /** Sign up with email, password, and name */
  signUp: (email: string, password: string, name: string) => Promise<AuthResponse>;
  /** Sign out the current user */
  signOut: () => Promise<void>;
}

// ============================================================================
// CONTEXT
// ============================================================================

const AuthContext = createContext<AuthContextValue | null>(null);

// ============================================================================
// PROVIDER
// ============================================================================

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = user !== null;

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await getAccessToken();
        if (token) {
          const currentUser = await authApi.getMe();
          setUser(currentUser);
        }
      } catch {
        // Token is invalid, clear it
        await clearTokens();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    setUser(response.user);
    return response;
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    const response = await authApi.register({ email, password, name });
    setUser(response.user);
    return response;
  }, []);

  const signOut = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      signIn,
      signUp,
      signOut,
    }),
    [user, isAuthenticated, isLoading, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * Hook to access auth context.
 * Must be used within an AuthProvider.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
