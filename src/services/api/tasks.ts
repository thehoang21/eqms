/**
 * Task Management API Service
 * All API calls related to tasks
 */

import { api } from './client';
import type { Task, TaskFilter, PaginatedResponse } from '@/types/task';

const TASKS_ENDPOINT = '/tasks';

export const taskApi = {
  /**
   * Get all tasks with filters and pagination
   */
  getTasks: async (filters?: TaskFilter, page = 1, limit = 10) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.module && { module: filters.module }),
      ...(filters?.priority && { priority: filters.priority }),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.assignee && { assignee: filters.assignee }),
      ...(filters?.fromDate && { fromDate: filters.fromDate }),
      ...(filters?.toDate && { toDate: filters.toDate }),
      ...(filters?.search && { search: filters.search }),
    });

    const response = await api.get<PaginatedResponse<Task>>(
      `${TASKS_ENDPOINT}?${params}`
    );
    return response.data;
  },

  /**
   * Get task by ID
   */
  getTaskById: async (id: string) => {
    const response = await api.get<Task>(`${TASKS_ENDPOINT}/${id}`);
    return response.data;
  },

  /**
   * Update task status
   */
  updateTaskStatus: async (id: string, status: string) => {
    const response = await api.patch(`${TASKS_ENDPOINT}/${id}/status`, { status });
    return response.data;
  },

  /**
   * Assign task to user
   */
  assignTask: async (id: string, assigneeId: string) => {
    const response = await api.patch(`${TASKS_ENDPOINT}/${id}/assign`, { assigneeId });
    return response.data;
  },

  /**
   * Add comment to task
   */
  addTaskComment: async (id: string, comment: string) => {
    const response = await api.post(`${TASKS_ENDPOINT}/${id}/comments`, { comment });
    return response.data;
  },

  /**
   * Get my tasks (current user)
   */
  getMyTasks: async (filters?: TaskFilter, page = 1, limit = 10) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.module && { module: filters.module }),
      ...(filters?.priority && { priority: filters.priority }),
      ...(filters?.status && { status: filters.status }),
    });

    const response = await api.get<PaginatedResponse<Task>>(
      `${TASKS_ENDPOINT}/my-tasks?${params}`
    );
    return response.data;
  },
};
