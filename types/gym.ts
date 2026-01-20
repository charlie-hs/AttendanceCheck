/**
 * Gym Types
 *
 * Types for gym management and membership.
 */

import type { User, UserRole } from './auth';

// ============================================================================
// GYM MODELS
// ============================================================================

export interface Gym {
  id: string;
  name: string;
  description?: string;
  address?: string;
  logoUrl?: string;
  ownerId: string;
  owner?: User;
  location?: GymLocation;
  settings?: GymSettings;
  createdAt: string;
  updatedAt: string;
}

export interface GymLocation {
  latitude: number;
  longitude: number;
  radiusMeters: number; // For check-in geofencing
}

export interface GymSettings {
  timezone: string;
  checkInEnabled: boolean;
  locationVerificationRequired: boolean;
  maxDailyCheckIns: number; // Usually 1
}

// ============================================================================
// MEMBERSHIP MODELS
// ============================================================================

export type MembershipRole = Extract<UserRole, 'owner' | 'manager' | 'member'>;

export interface GymMembership {
  id: string;
  gymId: string;
  gym?: Gym;
  userId: string;
  user?: User;
  role: MembershipRole;
  activeFrom: string; // ISO date
  activeUntil: string | null; // null = unlimited
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GymMembershipWithUser extends GymMembership {
  user: User;
}

export interface GymMembershipWithGym extends GymMembership {
  gym: Gym;
}

// ============================================================================
// MEMBERSHIP STATUS
// ============================================================================

export enum MembershipStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
  PENDING = 'pending',
}

/**
 * Calculate membership status based on active period.
 */
export function getMembershipStatus(membership: GymMembership): MembershipStatus {
  if (!membership.isActive) {
    return MembershipStatus.INACTIVE;
  }

  const now = new Date();
  const activeFrom = new Date(membership.activeFrom);
  const activeUntil = membership.activeUntil ? new Date(membership.activeUntil) : null;

  if (now < activeFrom) {
    return MembershipStatus.PENDING;
  }

  if (activeUntil && now > activeUntil) {
    return MembershipStatus.EXPIRED;
  }

  return MembershipStatus.ACTIVE;
}

// ============================================================================
// GYM REQUEST/RESPONSE TYPES
// ============================================================================

export interface CreateGymRequest {
  name: string;
  description?: string;
  address?: string;
  logoUrl?: string;
  location?: GymLocation;
}

export interface UpdateGymRequest {
  name?: string;
  description?: string;
  address?: string;
  logoUrl?: string;
  location?: GymLocation;
  settings?: Partial<GymSettings>;
}

export interface GetGymsResponse {
  gyms: GymMembershipWithGym[];
}

// ============================================================================
// MEMBER REQUEST/RESPONSE TYPES
// ============================================================================

export interface RegisterMemberRequest {
  email: string;
  name?: string; // For new users
  role: MembershipRole;
  activeFrom: string;
  activeUntil?: string | null;
}

export interface UpdateMemberRequest {
  role?: MembershipRole;
  isActive?: boolean;
}

export interface SetActivePeriodRequest {
  activeFrom: string;
  activeUntil: string | null;
}

export interface GetMembersParams {
  search?: string;
  role?: MembershipRole;
  status?: MembershipStatus;
  page?: number;
  limit?: number;
}

export interface GetMembersResponse {
  members: GymMembershipWithUser[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ============================================================================
// PERMISSION HELPERS
// ============================================================================

/**
 * Check if a role has permission for an action.
 * Owners can do everything managers can do, etc.
 */
export function hasPermission(userRole: MembershipRole, requiredRole: MembershipRole): boolean {
  const roleLevel: Record<MembershipRole, number> = {
    owner: 1,
    manager: 2,
    member: 3,
  };

  return roleLevel[userRole] <= roleLevel[requiredRole];
}

/**
 * Check if user can manage members (owner or manager).
 */
export function canManageMembers(role: MembershipRole): boolean {
  return role === 'owner' || role === 'manager';
}

/**
 * Check if user can manage gym settings (owner only).
 */
export function canManageGym(role: MembershipRole): boolean {
  return role === 'owner';
}
