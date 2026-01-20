/**
 * Attendance Types
 *
 * Types for check-in and attendance tracking.
 */

import type { User } from './auth';
import type { Gym } from './gym';

// ============================================================================
// ATTENDANCE MODELS
// ============================================================================

export type CheckInMethod = 'self' | 'manual';

export interface Attendance {
  id: string;
  gymId: string;
  gym?: Gym;
  userId: string;
  user?: User;
  checkInDate: string; // YYYY-MM-DD format
  checkInTime: string; // ISO timestamp
  method: CheckInMethod;
  createdBy: string; // userId who created the record (self or manager)
  location?: AttendanceLocation;
  note?: string;
  createdAt: string;
}

export interface AttendanceLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface AttendanceWithUser extends Attendance {
  user: User;
}

// ============================================================================
// CHECK-IN STATUS
// ============================================================================

export interface TodayCheckInStatus {
  hasCheckedIn: boolean;
  attendance?: Attendance;
  canCheckIn: boolean;
  reason?: CheckInBlockedReason;
}

export type CheckInBlockedReason =
  | 'already_checked_in'
  | 'membership_expired'
  | 'membership_inactive'
  | 'membership_not_started'
  | 'location_required'
  | 'outside_gym_location';

// ============================================================================
// ATTENDANCE STATISTICS
// ============================================================================

export interface AttendanceStats {
  currentStreak: number;
  longestStreak: number;
  thisWeek: number;
  thisMonth: number;
  thisYear: number;
  total: number;
  lastCheckIn?: string; // ISO timestamp
}

export interface AttendanceCalendarDay {
  date: string; // YYYY-MM-DD
  hasCheckIn: boolean;
  method?: CheckInMethod;
}

export interface AttendanceCalendarMonth {
  year: number;
  month: number; // 1-12
  days: AttendanceCalendarDay[];
  totalCheckIns: number;
}

// ============================================================================
// STREAK CALCULATION
// ============================================================================

/**
 * Calculate attendance streak from a list of dates.
 * @param checkInDates Array of YYYY-MM-DD formatted dates (sorted descending)
 * @returns Current streak count
 */
export function calculateStreak(checkInDates: string[]): number {
  if (checkInDates.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Sort dates descending (most recent first)
  const sortedDates = [...checkInDates].sort((a, b) => b.localeCompare(a));

  // Check if the most recent check-in is today or yesterday
  const mostRecent = new Date(sortedDates[0]);
  mostRecent.setHours(0, 0, 0, 0);

  if (mostRecent < yesterday) {
    // Streak is broken
    return 0;
  }

  // Count consecutive days
  let streak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const current = new Date(sortedDates[i - 1]);
    const previous = new Date(sortedDates[i]);

    // Check if dates are consecutive
    const diffDays = Math.floor((current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

// ============================================================================
// ATTENDANCE REQUEST/RESPONSE TYPES
// ============================================================================

export interface CheckInRequest {
  location?: AttendanceLocation;
  note?: string;
}

export interface CheckInResponse {
  attendance: Attendance;
  stats: AttendanceStats;
}

export interface ManualCheckInRequest {
  userId: string;
  date?: string; // YYYY-MM-DD, defaults to today
  note?: string;
}

export interface GetAttendanceParams {
  userId?: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string;
  method?: CheckInMethod;
  page?: number;
  limit?: number;
}

export interface GetAttendanceResponse {
  attendance: AttendanceWithUser[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface GetMyAttendanceParams {
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface GetCalendarParams {
  year: number;
  month: number;
}

// ============================================================================
// DATE HELPERS
// ============================================================================

/**
 * Format date to YYYY-MM-DD string.
 */
export function formatDateToString(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Get today's date as YYYY-MM-DD string.
 */
export function getTodayString(): string {
  return formatDateToString(new Date());
}

/**
 * Check if two dates are the same day.
 */
export function isSameDay(date1: string | Date, date2: string | Date): boolean {
  const d1 = typeof date1 === 'string' ? date1 : formatDateToString(date1);
  const d2 = typeof date2 === 'string' ? date2 : formatDateToString(date2);
  return d1 === d2;
}
