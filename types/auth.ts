/**
 * Authentication Types
 *
 * Types for user authentication, sessions, and authorization.
 */

// ============================================================================
// USER ROLES
// ============================================================================

/**
 * User roles with hierarchy levels.
 * Lower level = more permissions.
 */
export enum UserRole {
  ADMIN = 'admin', // Level 0: System-wide access
  OWNER = 'owner', // Level 1: Full control of owned gyms
  MANAGER = 'manager', // Level 2: Manage members, post WODs
  MEMBER = 'member', // Level 3: Check-in, vote on WODs
}

/**
 * Role hierarchy for permission checks.
 */
export const RoleHierarchy: Record<UserRole, number> = {
  [UserRole.ADMIN]: 0,
  [UserRole.OWNER]: 1,
  [UserRole.MANAGER]: 2,
  [UserRole.MEMBER]: 3,
};

// ============================================================================
// USER MODELS
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserWithRole extends User {
  role: UserRole;
}

// ============================================================================
// AUTH TOKENS
// ============================================================================

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds until access token expires
  tokenType: 'Bearer';
}

export interface AuthSession {
  user: User;
  tokens: AuthTokens;
}

// ============================================================================
// AUTH REQUEST/RESPONSE TYPES
// ============================================================================

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResponse {
  user: User;
  tokens: AuthTokens;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  tokens: AuthTokens;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  avatarUrl?: string;
}

// ============================================================================
// AUTH STATE
// ============================================================================

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ============================================================================
// VALIDATION
// ============================================================================

export interface PasswordValidation {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  isValid: boolean;
}

/**
 * Validates password strength.
 * Requirements: min 8 chars, 1 uppercase, 1 lowercase, 1 number.
 */
export function validatePassword(password: string): PasswordValidation {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    get isValid() {
      return this.minLength && this.hasUppercase && this.hasLowercase && this.hasNumber;
    },
  };
}
