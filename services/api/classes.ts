/**
 * Class API Service
 *
 * Handles all CrossFit class-related API calls
 */

import { apiClient } from './client';
import type {
  CrossFitClass,
  GetClassesRequest,
  ClassStatus,
} from '@/types/models';

export interface CreateClassRequest {
  coachId: string;
  title: string;
  description?: string;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  maxCapacity: number;
}

export interface UpdateClassRequest {
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  maxCapacity?: number;
  status?: ClassStatus;
}

export const classService = {
  /**
   * Get all classes with optional filters
   */
  async getClasses(filters?: GetClassesRequest): Promise<CrossFitClass[]> {
    return apiClient.get<CrossFitClass[]>('/classes', filters);
  },

  /**
   * Get a single class by ID
   */
  async getClass(classId: string): Promise<CrossFitClass> {
    return apiClient.get<CrossFitClass>(`/classes/${classId}`);
  },

  /**
   * Get upcoming classes
   */
  async getUpcomingClasses(): Promise<CrossFitClass[]> {
    const now = new Date().toISOString();
    return apiClient.get<CrossFitClass[]>('/classes', {
      startDate: now,
      status: ClassStatus.SCHEDULED,
    });
  },

  /**
   * Get classes for a specific coach
   */
  async getCoachClasses(
    coachId: string,
    filters?: Omit<GetClassesRequest, 'coachId'>
  ): Promise<CrossFitClass[]> {
    return apiClient.get<CrossFitClass[]>('/classes', {
      coachId,
      ...filters,
    });
  },

  /**
   * Get classes for a specific date range
   */
  async getClassesByDateRange(
    startDate: string,
    endDate: string
  ): Promise<CrossFitClass[]> {
    return apiClient.get<CrossFitClass[]>('/classes', {
      startDate,
      endDate,
    });
  },

  /**
   * Create a new class (coach/admin only)
   */
  async createClass(request: CreateClassRequest): Promise<CrossFitClass> {
    return apiClient.post<CrossFitClass>('/classes', request);
  },

  /**
   * Update a class (coach/admin only)
   */
  async updateClass(
    classId: string,
    request: UpdateClassRequest
  ): Promise<CrossFitClass> {
    return apiClient.patch<CrossFitClass>(`/classes/${classId}`, request);
  },

  /**
   * Cancel a class (coach/admin only)
   */
  async cancelClass(classId: string, reason?: string): Promise<CrossFitClass> {
    return apiClient.patch<CrossFitClass>(`/classes/${classId}/cancel`, { reason });
  },

  /**
   * Delete a class (admin only)
   */
  async deleteClass(classId: string): Promise<void> {
    return apiClient.delete(`/classes/${classId}`);
  },

  /**
   * Check if a class is available for reservation
   */
  async checkAvailability(classId: string): Promise<{ available: boolean; spotsLeft: number }> {
    return apiClient.get(`/classes/${classId}/availability`);
  },
};
