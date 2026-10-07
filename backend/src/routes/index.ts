import { Router } from 'express';
import courseRoutes from './course.routes.js';
import authRoutes from './auth.routes.js';

const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Course Management API'
  });
});

apiRouter.use('/auth', authRoutes);
apiRouter.use('/courses', courseRoutes);

export default apiRouter;
