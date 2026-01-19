/**
 * Notification API Service
 *
 * Handles notification settings and notification history
 */

import { apiClient } from './client';
import type {
  UserNotificationSettings,
  CoachNotificationSettings,
  CoachNotificationPreference,
  UpdateNotificationSettingsRequest,
  UpdateCoachNotificationPreferenceRequest,
  UpdateCoachNotificationSettingsRequest,
  Notification,
} from '@/types/models';

export const notificationService = {
  // ============================================================================
  // USER NOTIFICATION SETTINGS
  // ============================================================================

  /**
   * Get current user's notification settings
   */
  async getUserNotificationSettings(userId: string): Promise<UserNotificationSettings> {
    return apiClient.get<UserNotificationSettings>(`/users/${userId}/notification-settings`);
  },

  /**
   * Update user notification settings
   */
  async updateUserNotificationSettings(
    userId: string,
    settings: UpdateNotificationSettingsRequest
  ): Promise<UserNotificationSettings> {
    return apiClient.patch<UserNotificationSettings>(
      `/users/${userId}/notification-settings`,
      settings
    );
  },

  /**
   * Update coach-specific notification preference
   */
  async updateCoachNotificationPreference(
    userId: string,
    preference: UpdateCoachNotificationPreferenceRequest
  ): Promise<CoachNotificationPreference> {
    return apiClient.post<CoachNotificationPreference>(
      `/users/${userId}/notification-settings/coach-preferences`,
      preference
    );
  },

  /**
   * Delete coach notification preference (use default)
   */
  async deleteCoachNotificationPreference(
    userId: string,
    coachId: string
  ): Promise<void> {
    return apiClient.delete(
      `/users/${userId}/notification-settings/coach-preferences/${coachId}`
    );
  },

  // ============================================================================
  // COACH NOTIFICATION SETTINGS
  // ============================================================================

  /**
   * Get coach notification settings
   */
  async getCoachNotificationSettings(coachId: string): Promise<CoachNotificationSettings> {
    return apiClient.get<CoachNotificationSettings>(
      `/coaches/${coachId}/notification-settings`
    );
  },

  /**
   * Update coach notification settings
   */
  async updateCoachNotificationSettings(
    coachId: string,
    settings: UpdateCoachNotificationSettingsRequest
  ): Promise<CoachNotificationSettings> {
    return apiClient.patch<CoachNotificationSettings>(
      `/coaches/${coachId}/notification-settings`,
      settings
    );
  },

  // ============================================================================
  // NOTIFICATION HISTORY
  // ============================================================================

  /**
   * Get user's notifications
   */
  async getUserNotifications(userId: string, limit = 50): Promise<Notification[]> {
    return apiClient.get<Notification[]>(`/users/${userId}/notifications`, { limit });
  },

  /**
   * Get unread notifications count
   */
  async getUnreadCount(userId: string): Promise<{ count: number }> {
    return apiClient.get<{ count: number }>(`/users/${userId}/notifications/unread-count`);
  },

  /**
   * Mark notification as read
   */
  async markNotificationAsRead(notificationId: string): Promise<void> {
    return apiClient.patch(`/notifications/${notificationId}/read`, {});
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string): Promise<void> {
    return apiClient.post(`/users/${userId}/notifications/mark-all-read`, {});
  },

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    return apiClient.delete(`/notifications/${notificationId}`);
  },

  // ============================================================================
  // PUSH NOTIFICATION TOKENS
  // ============================================================================

  /**
   * Register push notification token for a user
   */
  async registerPushToken(userId: string, token: string): Promise<void> {
    return apiClient.post(`/users/${userId}/push-tokens`, { token });
  },

  /**
   * Unregister push notification token
   */
  async unregisterPushToken(userId: string, token: string): Promise<void> {
    return apiClient.delete(`/users/${userId}/push-tokens/${token}`);
  },
};
