export type CourseLevelType = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS';
export type CourseStatusType = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface CourseFilterQuery {
  search?: string;
  category?: string;
  level?: CourseLevelType;
  status?: CourseStatusType;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'price' | 'rating' | 'title' | 'studentsCount';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface CourseStats {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  archivedCourses: number;
  totalStudents: number;
  averageRating: number;
  categoryBreakdown: { category: string; count: number }[];
}
