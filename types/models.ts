/**
 * Core data models for the AttendanceCheck application
 */

// ============================================================================
// USER MODELS
// ============================================================================

export enum UserRole {
  ADMIN = 'ADMIN',
  COACH = 'COACH',
  MEMBER = 'MEMBER',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// COACH MODELS
// ============================================================================

export interface Coach {
  id: string;
  userId: string;
  user: User;
  bio?: string;
  specialties: string[];
  certifications: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// CLASS MODELS
// ============================================================================

export enum ClassStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface CrossFitClass {
  id: string;
  coachId: string;
  coach: Coach;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  maxCapacity: number;
  currentReservations: number;
  status: ClassStatus;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// RESERVATION MODELS
// ============================================================================

export enum ReservationStatus {
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  ATTENDED = 'ATTENDED',
  NO_SHOW = 'NO_SHOW',
}

export interface Reservation {
  id: string;
  userId: string;
  user: User;
  classId: string;
  class: CrossFitClass;
  status: ReservationStatus;
  reservedAt: Date;
  cancelledAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// NOTIFICATION SETTINGS MODELS
// ============================================================================

export interface UserNotificationSettings {
  id: string;
  userId: string;

  // Global notification toggle
  notificationsEnabled: boolean;

  // Class reminder settings
  classReminderEnabled: boolean;
  classReminderMinutesBefore: number; // e.g., 30 minutes before class

  // Coach-specific notification preferences
  coachNotificationPreferences: CoachNotificationPreference[];

  createdAt: Date;
  updatedAt: Date;
}

export interface CoachNotificationPreference {
  id: string;
  userNotificationSettingsId: string;
  coachId: string;
  coach: Coach;
  notificationsEnabled: boolean; // Receive notifications for this specific coach's classes
  createdAt: Date;
  updatedAt: Date;
}

export interface CoachNotificationSettings {
  id: string;
  coachId: string;

  // Notification when users reserve their classes
  reservationNotificationsEnabled: boolean;

  // Notification when users cancel
  cancellationNotificationsEnabled: boolean;

  // Daily summary of reservations
  dailySummaryEnabled: boolean;
  dailySummaryTime: string; // HH:mm format, e.g., "08:00"

  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// NOTIFICATION MODELS
// ============================================================================

export enum NotificationType {
  CLASS_REMINDER = 'CLASS_REMINDER',
  RESERVATION_CONFIRMED = 'RESERVATION_CONFIRMED',
  RESERVATION_CANCELLED = 'RESERVATION_CANCELLED',
  NEW_RESERVATION = 'NEW_RESERVATION', // For coaches
  USER_CANCELLED = 'USER_CANCELLED', // For coaches
  CLASS_CANCELLED = 'CLASS_CANCELLED',
  CLASS_UPDATED = 'CLASS_UPDATED',
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>; // Additional data for navigation
  isRead: boolean;
  sentAt: Date;
  readAt?: Date;
  createdAt: Date;
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

export interface CreateReservationRequest {
  classId: string;
  notes?: string;
}

export interface CreateReservationResponse {
  reservation: Reservation;
  message: string;
}

export interface CancelReservationRequest {
  reservationId: string;
  reason?: string;
}

export interface GetClassesRequest {
  startDate?: string; // ISO date string
  endDate?: string;
  coachId?: string;
  status?: ClassStatus;
}

export interface GetReservationsRequest {
  userId?: string;
  classId?: string;
  coachId?: string;
  status?: ReservationStatus;
  startDate?: string;
  endDate?: string;
}

export interface UpdateNotificationSettingsRequest {
  notificationsEnabled?: boolean;
  classReminderEnabled?: boolean;
  classReminderMinutesBefore?: number;
}

export interface UpdateCoachNotificationPreferenceRequest {
  coachId: string;
  notificationsEnabled: boolean;
}

export interface UpdateCoachNotificationSettingsRequest {
  reservationNotificationsEnabled?: boolean;
  cancellationNotificationsEnabled?: boolean;
  dailySummaryEnabled?: boolean;
  dailySummaryTime?: string;
}
