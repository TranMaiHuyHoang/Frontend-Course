import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/clerkAuth.js';

const router = Router();

// Public diagnostic route
router.get('/status', authController.getStatus);

// Protected route: requires Bearer Clerk token, returns verified user info
router.get('/me', requireAuth, authController.getMe);

export default router;
