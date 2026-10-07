import { Router } from 'express';
import { CourseController } from '../controllers/course.controller.js';
import { validateBody, validateQuery } from '../middlewares/validateRequest.js';
import {
  CreateCourseSchema,
  UpdateCourseSchema,
  CourseQuerySchema
} from '../validators/course.validator.js';

import { requireAuth } from '../middlewares/clerkAuth.js';

const router = Router();

// Stats route (must be before /:id)
router.get('/stats/summary', CourseController.getStats);

// Slug route
router.get('/slug/:slug', CourseController.getCourseBySlug);

// Public read routes
router.get('/', validateQuery(CourseQuerySchema), CourseController.getCourses);
router.get('/:id', CourseController.getCourseById);

// Protected mutation routes (requires Clerk token)
router.post('/', requireAuth, validateBody(CreateCourseSchema), CourseController.createCourse);
router.put('/:id', requireAuth, validateBody(UpdateCourseSchema), CourseController.updateCourse);
router.delete('/:id', requireAuth, CourseController.deleteCourse);

export default router;
