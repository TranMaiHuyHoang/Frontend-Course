export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS';
export type CourseStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  instructor: string;
  instructorEmail?: string | null;
  category: string;
  level: CourseLevel;
  status: CourseStatus;
  price: number;
  discountPrice?: number | null;
  durationHours: number;
  lessonsCount: number;
  thumbnail?: string | null;
  isFeatured: boolean;
  rating: number;
  ratingCount: number;
  studentsCount: number;
  tags: string[];
  requirements: string[];
  objectives: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CourseFilterParams {
  search?: string;
  category?: string;
  level?: CourseLevel;
  status?: CourseStatus;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'price' | 'rating' | 'title' | 'studentsCount';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedCoursesResponse {
  success: boolean;
  data: Course[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface CourseStatsResponse {
  success: boolean;
  data: {
    totalCourses: number;
    publishedCourses: number;
    draftCourses: number;
    archivedCourses: number;
    totalStudents: number;
    averageRating: number;
    averagePrice: number;
    categoryBreakdown: { category: string; count: number }[];
  };
}

export interface CourseFormData {
  title: string;
  slug?: string;
  description: string;
  instructor: string;
  instructorEmail?: string;
  category: string;
  level: CourseLevel;
  status: CourseStatus;
  price: number;
  discountPrice?: number | null;
  durationHours: number;
  lessonsCount: number;
  thumbnail?: string;
  isFeatured?: boolean;
  tags: string[];
  requirements: string[];
  objectives: string[];
}
