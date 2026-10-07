import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import { courseApi } from '@/lib/api';
import { CourseFilterParams, CourseFormData } from '@/types/course';

export const COURSE_KEYS = {
  all: ['courses'] as const,
  lists: () => [...COURSE_KEYS.all, 'list'] as const,
  list: (params: CourseFilterParams) => [...COURSE_KEYS.lists(), params] as const,
  details: () => [...COURSE_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...COURSE_KEYS.details(), id] as const,
  stats: () => [...COURSE_KEYS.all, 'stats'] as const
};

// Hook: fetch paginated course list
export function useCourses(params: CourseFilterParams = {}) {
  return useQuery({
    queryKey: COURSE_KEYS.list(params),
    queryFn: () => courseApi.getCourses(params),
    placeholderData: (previousData) => previousData
  });
}

// Hook: fetch single course
export function useCourse(id: string) {
  return useQuery({
    queryKey: COURSE_KEYS.detail(id),
    queryFn: () => courseApi.getCourseById(id),
    enabled: Boolean(id)
  });
}

// Hook: fetch course statistics
export function useCourseStats() {
  return useQuery({
    queryKey: COURSE_KEYS.stats(),
    queryFn: () => courseApi.getStats(),
    staleTime: 30 * 1000
  });
}

// Hook: create course mutation
export function useCreateCourse() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  return useMutation({
    mutationFn: (data: CourseFormData) => courseApi.createCourse(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: COURSE_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: COURSE_KEYS.stats() });
      message.success(res.message || 'Course created successfully!');
    },
    onError: (error: any) => {
      const errMsg = error.response?.data?.message || 'Failed to create course';
      message.error(errMsg);
    }
  });
}

// Hook: update course mutation
export function useUpdateCourse() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CourseFormData> }) =>
      courseApi.updateCourse(id, data),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: COURSE_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: COURSE_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: COURSE_KEYS.stats() });
      message.success(res.message || 'Course updated successfully!');
    },
    onError: (error: any) => {
      const errMsg = error.response?.data?.message || 'Failed to update course';
      message.error(errMsg);
    }
  });
}

// Hook: delete course mutation
export function useDeleteCourse() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  return useMutation({
    mutationFn: (id: string) => courseApi.deleteCourse(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: COURSE_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: COURSE_KEYS.stats() });
      message.success(res.message || 'Course deleted successfully!');
    },
    onError: (error: any) => {
      const errMsg = error.response?.data?.message || 'Failed to delete course';
      message.error(errMsg);
    }
  });
}
