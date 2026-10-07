import { Prisma } from '@prisma/client';
import { prisma } from '../config/db.js';
import { CreateCourseInput, UpdateCourseInput, CourseQueryParams } from '../validators/course.validator.js';
import { AppError } from '../middlewares/errorHandler.js';

// Helper to generate URL-friendly slug
const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export class CourseService {
  // Get courses with search, filters, pagination, and sorting
  static async getCourses(params: CourseQueryParams) {
    const {
      search,
      category,
      level,
      status,
      minPrice,
      maxPrice,
      isFeatured,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = params;

    const skip = (page - 1) * limit;
    const where: Prisma.CourseWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { instructor: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } }
      ];
    }

    if (category && category !== 'ALL') {
      where.category = { equals: category, mode: 'insensitive' };
    }

    if (level) {
      where.level = level;
    }

    if (status) {
      where.status = status;
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder
        }
      }),
      prisma.course.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: courses,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  }

  // Get course by ID
  static async getCourseById(id: string) {
    const course = await prisma.course.findUnique({
      where: { id }
    });

    if (!course) {
      throw new AppError(`Course with ID '${id}' not found`, 404);
    }

    return course;
  }

  // Get course by slug
  static async getCourseBySlug(slug: string) {
    const course = await prisma.course.findUnique({
      where: { slug }
    });

    if (!course) {
      throw new AppError(`Course with slug '${slug}' not found`, 404);
    }

    return course;
  }

  // Create course
  static async createCourse(data: CreateCourseInput) {
    let slug = data.slug || generateSlug(data.title);

    // Check slug uniqueness and append random suffix if collision
    const existing = await prisma.course.findUnique({
      where: { slug }
    });

    if (existing) {
      slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
    }

    const newCourse = await prisma.course.create({
      data: {
        ...data,
        slug,
        instructorEmail: data.instructorEmail || null,
        thumbnail: data.thumbnail || null
      }
    });

    return newCourse;
  }

  // Update course
  static async updateCourse(id: string, data: UpdateCourseInput) {
    await this.getCourseById(id); // Ensure course exists

    if (data.slug) {
      const slugExists = await prisma.course.findFirst({
        where: {
          slug: data.slug,
          NOT: { id }
        }
      });
      if (slugExists) {
        throw new AppError(`Slug '${data.slug}' is already in use by another course`, 409);
      }
    }

    const updated = await prisma.course.update({
      where: { id },
      data: {
        ...data,
        instructorEmail: data.instructorEmail !== undefined ? (data.instructorEmail || null) : undefined,
        thumbnail: data.thumbnail !== undefined ? (data.thumbnail || null) : undefined
      }
    });

    return updated;
  }

  // Delete course
  static async deleteCourse(id: string) {
    await this.getCourseById(id);

    await prisma.course.delete({
      where: { id }
    });

    return { message: 'Course deleted successfully' };
  }

  // Get system statistics for dashboard
  static async getStats() {
    const [totalCourses, publishedCourses, draftCourses, archivedCourses, aggregateStats, categoryGroups] =
      await Promise.all([
        prisma.course.count(),
        prisma.course.count({ where: { status: 'PUBLISHED' } }),
        prisma.course.count({ where: { status: 'DRAFT' } }),
        prisma.course.count({ where: { status: 'ARCHIVED' } }),
        prisma.course.aggregate({
          _sum: {
            studentsCount: true
          },
          _avg: {
            rating: true,
            price: true
          }
        }),
        prisma.course.groupBy({
          by: ['category'],
          _count: {
            id: true
          }
        })
      ]);

    const categoryBreakdown = categoryGroups.map((g) => ({
      category: g.category,
      count: g._count.id
    }));

    return {
      totalCourses,
      publishedCourses,
      draftCourses,
      archivedCourses,
      totalStudents: aggregateStats._sum.studentsCount || 0,
      averageRating: parseFloat((aggregateStats._avg.rating || 5.0).toFixed(2)),
      averagePrice: parseFloat((aggregateStats._avg.price || 0).toFixed(2)),
      categoryBreakdown
    };
  }
}
