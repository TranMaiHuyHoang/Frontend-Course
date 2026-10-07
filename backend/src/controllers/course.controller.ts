import { Request, Response, NextFunction } from 'express';
import { CourseService } from '../services/course.service.js';
import { CourseQueryParams, CreateCourseInput, UpdateCourseInput } from '../validators/course.validator.js';

export class CourseController {
  // GET /api/courses
  static async getCourses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const queryParams = req.query as unknown as CourseQueryParams;
      const result = await CourseService.getCourses(queryParams);
      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/courses/:id
  static async getCourseById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const course = await CourseService.getCourseById(id);
      res.status(200).json({
        success: true,
        data: course
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/courses/slug/:slug
  static async getCourseBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const course = await CourseService.getCourseBySlug(slug);
      res.status(200).json({
        success: true,
        data: course
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/courses
  static async createCourse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = req.body as CreateCourseInput;
      const newCourse = await CourseService.createCourse(input);
      res.status(201).json({
        success: true,
        message: 'Course created successfully',
        data: newCourse
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/courses/:id
  static async updateCourse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const input = req.body as UpdateCourseInput;
      const updatedCourse = await CourseService.updateCourse(id, input);
      res.status(200).json({
        success: true,
        message: 'Course updated successfully',
        data: updatedCourse
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/courses/:id
  static async deleteCourse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const result = await CourseService.deleteCourse(id);
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/courses/stats/summary
  static async getStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await CourseService.getStats();
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}
