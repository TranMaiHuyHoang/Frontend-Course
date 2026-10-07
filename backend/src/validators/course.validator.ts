import { z } from 'zod';

export const CourseLevelEnum = z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS']);
export const CourseStatusEnum = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']);

export const CreateCourseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(150, 'Title cannot exceed 150 characters'),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase alphanumeric characters and hyphens')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  instructor: z.string().min(2, 'Instructor name is required'),
  instructorEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  category: z.string().min(2, 'Category is required'),
  level: CourseLevelEnum.default('BEGINNER'),
  status: CourseStatusEnum.default('DRAFT'),
  price: z.coerce.number().min(0, 'Price must be 0 or positive').default(0),
  discountPrice: z.coerce.number().min(0).optional().nullable(),
  durationHours: z.coerce.number().min(0.5, 'Duration must be at least 0.5 hours').default(10),
  lessonsCount: z.coerce.number().int().min(1, 'Lessons count must be at least 1').default(1),
  thumbnail: z.string().url('Thumbnail must be a valid URL').optional().or(z.literal('')),
  isFeatured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  requirements: z.array(z.string()).default([]),
  objectives: z.array(z.string()).default([])
});

export const UpdateCourseSchema = CreateCourseSchema.partial();

export const CourseQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  level: CourseLevelEnum.optional(),
  status: CourseStatusEnum.optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  isFeatured: z.preprocess((val) => (val === 'true' ? true : val === 'false' ? false : undefined), z.boolean().optional()),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['createdAt', 'price', 'rating', 'title', 'studentsCount']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

export type CreateCourseInput = z.infer<typeof CreateCourseSchema>;
export type UpdateCourseInput = z.infer<typeof UpdateCourseSchema>;
export type CourseQueryParams = z.infer<typeof CourseQuerySchema>;
