/**
 * Reservation API Service
 *
 * Handles all reservation-related API calls
 */

import { apiClient } from './client';
import type {
  Reservation,
  CreateReservationRequest,
  CreateReservationResponse,
  CancelReservationRequest,
  GetReservationsRequest,
  ReservationStatus,
} from '@/types/models';

export const reservationService = {
  /**
   * Create a new reservation for a class
   */
  async createReservation(
    request: CreateReservationRequest
  ): Promise<CreateReservationResponse> {
    return apiClient.post<CreateReservationResponse>('/reservations', request);
  },

  /**
   * Cancel an existing reservation
   */
  async cancelReservation(request: CancelReservationRequest): Promise<void> {
    return apiClient.patch(`/reservations/${request.reservationId}/cancel`, {
      reason: request.reason,
    });
  },

  /**
   * Get a single reservation by ID
   */
  async getReservation(reservationId: string): Promise<Reservation> {
    return apiClient.get<Reservation>(`/reservations/${reservationId}`);
  },

  /**
   * Get reservations with optional filters
   */
  async getReservations(filters?: GetReservationsRequest): Promise<Reservation[]> {
    return apiClient.get<Reservation[]>('/reservations', filters);
  },

  /**
   * Get user's reservations (upcoming)
   */
  async getMyReservations(userId: string): Promise<Reservation[]> {
    const now = new Date().toISOString();
    return apiClient.get<Reservation[]>('/reservations', {
      userId,
      startDate: now,
      status: ReservationStatus.CONFIRMED,
    });
  },

  /**
   * Get reservations for a specific class
   */
  async getClassReservations(classId: string): Promise<Reservation[]> {
    return apiClient.get<Reservation[]>(`/classes/${classId}/reservations`);
  },

  /**
   * Get reservations for a coach's classes
   */
  async getCoachReservations(
    coachId: string,
    filters?: { startDate?: string; endDate?: string }
  ): Promise<Reservation[]> {
    return apiClient.get<Reservation[]>('/reservations', {
      coachId,
      ...filters,
    });
  },

  /**
   * Update reservation status (for coaches/admins)
   */
  async updateReservationStatus(
    reservationId: string,
    status: ReservationStatus
  ): Promise<Reservation> {
    return apiClient.patch<Reservation>(`/reservations/${reservationId}/status`, {
      status,
    });
  },

  /**
   * Mark reservation as attended
   */
  async markAttended(reservationId: string): Promise<Reservation> {
    return this.updateReservationStatus(reservationId, ReservationStatus.ATTENDED);
  },

  /**
   * Mark reservation as no-show
   */
  async markNoShow(reservationId: string): Promise<Reservation> {
    return this.updateReservationStatus(reservationId, ReservationStatus.NO_SHOW);
  },
};
