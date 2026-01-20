/**
 * Type Models Compilation Tests
 *
 * These tests verify that TypeScript types compile correctly
 * and helper functions work as expected.
 */

import {
  // Auth types
  type User,
  type AuthTokens,
  type AuthSession,
  UserRole,
  RoleHierarchy,
  validatePassword,

  // Gym types
  type Gym,
  type GymMembership,
  MembershipStatus,
  getMembershipStatus,
  hasPermission,
  canManageMembers,
  canManageGym,

  // Attendance types
  type Attendance,
  type AttendanceStats,
  type TodayCheckInStatus,
  calculateStreak,
  formatDateToString,
  getTodayString,
  isSameDay,

  // WOD types
  type WOD,
  type TimeSlot,
  type WODVote,
  getWODStatus,
  canVote,
  formatTimeSlot,
  hasCapacity,
  getRemainingSpots,
} from '@/types';

describe('Auth Types', () => {
  describe('UserRole enum', () => {
    it('should have correct role values', () => {
      expect(UserRole.ADMIN).toBe('admin');
      expect(UserRole.OWNER).toBe('owner');
      expect(UserRole.MANAGER).toBe('manager');
      expect(UserRole.MEMBER).toBe('member');
    });
  });

  describe('RoleHierarchy', () => {
    it('should have correct hierarchy levels', () => {
      expect(RoleHierarchy[UserRole.ADMIN]).toBe(0);
      expect(RoleHierarchy[UserRole.OWNER]).toBe(1);
      expect(RoleHierarchy[UserRole.MANAGER]).toBe(2);
      expect(RoleHierarchy[UserRole.MEMBER]).toBe(3);
    });
  });

  describe('validatePassword', () => {
    it('should validate a strong password', () => {
      const result = validatePassword('Password123');
      expect(result.minLength).toBe(true);
      expect(result.hasUppercase).toBe(true);
      expect(result.hasLowercase).toBe(true);
      expect(result.hasNumber).toBe(true);
      expect(result.isValid).toBe(true);
    });

    it('should reject a weak password', () => {
      const result = validatePassword('weak');
      expect(result.minLength).toBe(false);
      expect(result.isValid).toBe(false);
    });

    it('should require uppercase', () => {
      const result = validatePassword('password123');
      expect(result.hasUppercase).toBe(false);
      expect(result.isValid).toBe(false);
    });
  });

  describe('User type', () => {
    it('should allow creating a valid user object', () => {
      const user: User = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      expect(user.id).toBe('1');
    });
  });

  describe('AuthTokens type', () => {
    it('should allow creating valid auth tokens', () => {
      const tokens: AuthTokens = {
        accessToken: 'access',
        refreshToken: 'refresh',
        expiresIn: 3600,
        tokenType: 'Bearer',
      };
      expect(tokens.tokenType).toBe('Bearer');
    });
  });
});

describe('Gym Types', () => {
  describe('getMembershipStatus', () => {
    const baseMembership: GymMembership = {
      id: '1',
      gymId: 'gym1',
      userId: 'user1',
      role: 'member',
      activeFrom: '2024-01-01',
      activeUntil: '2024-12-31',
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    };

    it('should return INACTIVE for inactive membership', () => {
      const membership = { ...baseMembership, isActive: false };
      expect(getMembershipStatus(membership)).toBe(MembershipStatus.INACTIVE);
    });

    it('should return EXPIRED for expired membership', () => {
      const membership = {
        ...baseMembership,
        activeUntil: '2020-01-01', // Past date
      };
      expect(getMembershipStatus(membership)).toBe(MembershipStatus.EXPIRED);
    });

    it('should return ACTIVE for valid membership', () => {
      const membership = {
        ...baseMembership,
        activeFrom: '2020-01-01',
        activeUntil: '2030-12-31',
      };
      expect(getMembershipStatus(membership)).toBe(MembershipStatus.ACTIVE);
    });

    it('should return ACTIVE for unlimited membership', () => {
      const membership = {
        ...baseMembership,
        activeFrom: '2020-01-01',
        activeUntil: null,
      };
      expect(getMembershipStatus(membership)).toBe(MembershipStatus.ACTIVE);
    });
  });

  describe('hasPermission', () => {
    it('should allow owner to do manager tasks', () => {
      expect(hasPermission('owner', 'manager')).toBe(true);
    });

    it('should allow owner to do member tasks', () => {
      expect(hasPermission('owner', 'member')).toBe(true);
    });

    it('should not allow member to do manager tasks', () => {
      expect(hasPermission('member', 'manager')).toBe(false);
    });
  });

  describe('canManageMembers', () => {
    it('should return true for owner', () => {
      expect(canManageMembers('owner')).toBe(true);
    });

    it('should return true for manager', () => {
      expect(canManageMembers('manager')).toBe(true);
    });

    it('should return false for member', () => {
      expect(canManageMembers('member')).toBe(false);
    });
  });

  describe('canManageGym', () => {
    it('should return true only for owner', () => {
      expect(canManageGym('owner')).toBe(true);
      expect(canManageGym('manager')).toBe(false);
      expect(canManageGym('member')).toBe(false);
    });
  });
});

describe('Attendance Types', () => {
  describe('calculateStreak', () => {
    it('should return 0 for empty array', () => {
      expect(calculateStreak([])).toBe(0);
    });

    it('should calculate consecutive days streak', () => {
      const today = new Date();
      const dates = [
        formatDateToString(today),
        formatDateToString(new Date(today.getTime() - 86400000)), // yesterday
        formatDateToString(new Date(today.getTime() - 86400000 * 2)), // 2 days ago
      ];
      expect(calculateStreak(dates)).toBe(3);
    });

    it('should break streak on gap', () => {
      const today = new Date();
      const dates = [
        formatDateToString(today),
        formatDateToString(new Date(today.getTime() - 86400000 * 3)), // 3 days ago (gap)
      ];
      expect(calculateStreak(dates)).toBe(1);
    });
  });

  describe('formatDateToString', () => {
    it('should format date to YYYY-MM-DD', () => {
      const date = new Date('2024-01-15T12:00:00Z');
      expect(formatDateToString(date)).toBe('2024-01-15');
    });
  });

  describe('getTodayString', () => {
    it('should return today in YYYY-MM-DD format', () => {
      const today = getTodayString();
      expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('isSameDay', () => {
    it('should return true for same dates', () => {
      expect(isSameDay('2024-01-15', '2024-01-15')).toBe(true);
    });

    it('should return false for different dates', () => {
      expect(isSameDay('2024-01-15', '2024-01-16')).toBe(false);
    });

    it('should work with Date objects', () => {
      const date1 = new Date('2024-01-15T10:00:00Z');
      const date2 = new Date('2024-01-15T20:00:00Z');
      expect(isSameDay(date1, date2)).toBe(true);
    });
  });
});

describe('WOD Types', () => {
  describe('getWODStatus', () => {
    it('should return "today" for today\'s date', () => {
      const today = formatDateToString(new Date());
      expect(getWODStatus(today)).toBe('today');
    });

    it('should return "upcoming" for future date', () => {
      const future = formatDateToString(
        new Date(Date.now() + 86400000 * 7) // 7 days from now
      );
      expect(getWODStatus(future)).toBe('upcoming');
    });

    it('should return "past" for past date', () => {
      const past = '2020-01-01';
      expect(getWODStatus(past)).toBe('past');
    });
  });

  describe('canVote', () => {
    it('should allow voting for today', () => {
      const today = formatDateToString(new Date());
      expect(canVote(today)).toBe(true);
    });

    it('should allow voting for upcoming WOD', () => {
      const future = formatDateToString(new Date(Date.now() + 86400000));
      expect(canVote(future)).toBe(true);
    });

    it('should not allow voting for past WOD', () => {
      expect(canVote('2020-01-01')).toBe(false);
    });
  });

  describe('formatTimeSlot', () => {
    it('should format time slot correctly', () => {
      const slot = { startTime: '09:00', endTime: '10:00' };
      expect(formatTimeSlot(slot)).toBe('09:00 - 10:00');
    });
  });

  describe('hasCapacity', () => {
    it('should return true for unlimited capacity', () => {
      const slot: TimeSlot = {
        id: '1',
        wodId: 'wod1',
        startTime: '09:00',
        endTime: '10:00',
        voteCount: 100,
      };
      expect(hasCapacity(slot)).toBe(true);
    });

    it('should return true when under capacity', () => {
      const slot: TimeSlot = {
        id: '1',
        wodId: 'wod1',
        startTime: '09:00',
        endTime: '10:00',
        capacity: 20,
        voteCount: 10,
      };
      expect(hasCapacity(slot)).toBe(true);
    });

    it('should return false when at capacity', () => {
      const slot: TimeSlot = {
        id: '1',
        wodId: 'wod1',
        startTime: '09:00',
        endTime: '10:00',
        capacity: 20,
        voteCount: 20,
      };
      expect(hasCapacity(slot)).toBe(false);
    });
  });

  describe('getRemainingSpots', () => {
    it('should return null for unlimited capacity', () => {
      const slot: TimeSlot = {
        id: '1',
        wodId: 'wod1',
        startTime: '09:00',
        endTime: '10:00',
        voteCount: 10,
      };
      expect(getRemainingSpots(slot)).toBeNull();
    });

    it('should return remaining spots', () => {
      const slot: TimeSlot = {
        id: '1',
        wodId: 'wod1',
        startTime: '09:00',
        endTime: '10:00',
        capacity: 20,
        voteCount: 15,
      };
      expect(getRemainingSpots(slot)).toBe(5);
    });

    it('should return 0 when full', () => {
      const slot: TimeSlot = {
        id: '1',
        wodId: 'wod1',
        startTime: '09:00',
        endTime: '10:00',
        capacity: 20,
        voteCount: 25, // Over capacity
      };
      expect(getRemainingSpots(slot)).toBe(0);
    });
  });
});
