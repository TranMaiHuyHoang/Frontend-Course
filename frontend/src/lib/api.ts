import axios from 'axios';
import {
  Course,
  CourseFilterParams,
  CourseFormData,
  PaginatedCoursesResponse,
  CourseStatsResponse
} from '@/types/course';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Dynamic token getter supplied by ClerkAuthProvider
let tokenGetter: (() => Promise<string | null>) | null = null;

export const setAuthTokenGetter = (fn: () => Promise<string | null>) => {
  tokenGetter = fn;
};

// Request interceptor to automatically attach Clerk Session Token
apiClient.interceptors.request.use(
  async (config) => {
    if (tokenGetter) {
      try {
        const token = await tokenGetter();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.warn('[API Client] Error getting auth token:', err);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export interface ClerkAuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  imageUrl: string;
  hasImage: boolean;
  authProvider: string;
  isGoogleAuth: boolean;
  googleId: string | null;
  createdAt: number;
  lastSignInAt?: number;
}

export interface AuthMeResponse {
  success: boolean;
  message: string;
  data: {
    user: ClerkAuthUser;
    sessionId: string;
    verifiedAt: string;
  };
}

export interface AuthStatusResponse {
  success: boolean;
  service: string;
  isConfigured: boolean;
  publishableKeyConfigured: boolean;
  authFlow: string[];
}

export const authApi = {
  // Verify token and retrieve current user from Express backend
  getMe: async (): Promise<AuthMeResponse> => {
    const response = await apiClient.get<AuthMeResponse>('/auth/me');
    return response.data;
  },

  // Check auth service status and flow
  getStatus: async (): Promise<AuthStatusResponse> => {
    const response = await apiClient.get<AuthStatusResponse>('/auth/status');
    return response.data;
  }
};

export const courseApi = {
  // Fetch paginated courses with filters
  getCourses: async (params: CourseFilterParams = {}): Promise<PaginatedCoursesResponse> => {
    const response = await apiClient.get<PaginatedCoursesResponse>('/courses', { params });
    return response.data;
  },

  // Fetch single course by ID
  getCourseById: async (id: string): Promise<{ success: boolean; data: Course }> => {
    const response = await apiClient.get<{ success: boolean; data: Course }>(`/courses/${id}`);
    return response.data;
  },

  // Fetch course by slug
  getCourseBySlug: async (slug: string): Promise<{ success: boolean; data: Course }> => {
    const response = await apiClient.get<{ success: boolean; data: Course }>(`/courses/slug/${slug}`);
    return response.data;
  },

  // Fetch dashboard stats
  getStats: async (): Promise<CourseStatsResponse> => {
    const response = await apiClient.get<CourseStatsResponse>('/courses/stats/summary');
    return response.data;
  },

  // Create course
  createCourse: async (data: CourseFormData): Promise<{ success: boolean; message: string; data: Course }> => {
    const response = await apiClient.post<{ success: boolean; message: string; data: Course }>('/courses', data);
    return response.data;
  },

  // Update course
  updateCourse: async (
    id: string,
    data: Partial<CourseFormData>
  ): Promise<{ success: boolean; message: string; data: Course }> => {
    const response = await apiClient.put<{ success: boolean; message: string; data: Course }>(`/courses/${id}`, data);
    return response.data;
  },

  // Delete course
  deleteCourse: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/courses/${id}`);
    return response.data;
  }
};
