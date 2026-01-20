/**
 * WOD (Workout of the Day) Types
 *
 * Types for WOD posting and voting.
 */

import type { User } from './auth';
import type { Gym } from './gym';

// ============================================================================
// WOD MODELS
// ============================================================================

export interface WOD {
  id: string;
  gymId: string;
  gym?: Gym;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  timeSlots?: TimeSlot[];
  createdBy: string;
  creator?: User;
  voteCount: number;
  hasVoted?: boolean; // Current user's vote status
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlot {
  id: string;
  wodId: string;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  capacity?: number; // null = unlimited
  voteCount: number;
}

export interface WODWithVotes extends WOD {
  votes: WODVote[];
}

// ============================================================================
// VOTE MODELS
// ============================================================================

export interface WODVote {
  id: string;
  wodId: string;
  timeSlotId?: string;
  timeSlot?: TimeSlot;
  userId: string;
  user?: User;
  createdAt: string;
}

export interface WODVoteWithUser extends WODVote {
  user: User;
}

// ============================================================================
// WOD STATUS
// ============================================================================

export type WODStatus = 'upcoming' | 'today' | 'past';

/**
 * Get WOD status based on date.
 */
export function getWODStatus(wodDate: string): WODStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const wod = new Date(wodDate);
  wod.setHours(0, 0, 0, 0);

  if (wod.getTime() === today.getTime()) {
    return 'today';
  } else if (wod > today) {
    return 'upcoming';
  } else {
    return 'past';
  }
}

/**
 * Check if voting is allowed for a WOD.
 * Voting is allowed for today and upcoming WODs.
 */
export function canVote(wodDate: string): boolean {
  const status = getWODStatus(wodDate);
  return status === 'today' || status === 'upcoming';
}

// ============================================================================
// WOD REQUEST/RESPONSE TYPES
// ============================================================================

export interface CreateWODRequest {
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  timeSlots?: CreateTimeSlotRequest[];
}

export interface CreateTimeSlotRequest {
  startTime: string; // HH:mm
  endTime: string;
  capacity?: number;
}

export interface UpdateWODRequest {
  title?: string;
  description?: string;
  date?: string;
  timeSlots?: CreateTimeSlotRequest[];
}

export interface VoteRequest {
  timeSlotId?: string; // Required if WOD has time slots
}

export interface GetWODsParams {
  startDate?: string; // YYYY-MM-DD
  endDate?: string;
  status?: WODStatus;
  page?: number;
  limit?: number;
}

export interface GetWODsResponse {
  wods: WOD[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface GetVotersParams {
  timeSlotId?: string;
}

export interface GetVotersResponse {
  voters: WODVoteWithUser[];
  total: number;
  byTimeSlot?: Record<string, WODVoteWithUser[]>;
}

// ============================================================================
// TIME HELPERS
// ============================================================================

/**
 * Format time slot for display.
 * @example formatTimeSlot({ startTime: '09:00', endTime: '10:00' }) => '09:00 - 10:00'
 */
export function formatTimeSlot(slot: Pick<TimeSlot, 'startTime' | 'endTime'>): string {
  return `${slot.startTime} - ${slot.endTime}`;
}

/**
 * Check if a time slot has capacity available.
 */
export function hasCapacity(slot: TimeSlot): boolean {
  if (slot.capacity === null || slot.capacity === undefined) {
    return true; // Unlimited capacity
  }
  return slot.voteCount < slot.capacity;
}

/**
 * Get remaining spots in a time slot.
 */
export function getRemainingSpots(slot: TimeSlot): number | null {
  if (slot.capacity === null || slot.capacity === undefined) {
    return null; // Unlimited
  }
  return Math.max(0, slot.capacity - slot.voteCount);
}
