import { z } from 'zod';

export const courseFormValidationSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(150, 'Title cannot exceed 150 characters'),
  slug: z
    .string()
    .optional()
    .refine((val) => !val || /^[a-z0-9-]+$/.test(val), {
      message: 'Slug can only contain lowercase letters, numbers, and hyphens'
    }),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  instructor: z.string().min(2, 'Instructor name is required'),
  instructorEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  category: z.string().min(1, 'Please select or enter a category'),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS'] as const),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const),
  price: z.coerce.number().min(0, 'Price must be 0 or higher'),
  discountPrice: z.coerce.number().min(0, 'Discount price must be 0 or higher').optional().nullable(),
  durationHours: z.coerce.number().min(0.5, 'Duration must be at least 0.5 hours'),
  lessonsCount: z.coerce.number().int().min(1, 'Must have at least 1 lesson'),
  thumbnail: z.string().url('Thumbnail must be a valid URL').optional().or(z.literal('')),
  isFeatured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  requirements: z.array(z.string()).default([]),
  objectives: z.array(z.string()).default([])
});

export type CourseFormValues = z.infer<typeof courseFormValidationSchema>;
