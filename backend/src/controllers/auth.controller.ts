import { Response } from 'express';
import { AuthenticatedRequest, getClerkUserInfo } from '../middlewares/clerkAuth.js';
import { ENV } from '../config/env.js';

export const authController = {
  /**
   * GET /api/auth/me
   * Validates token via Clerk, fetches Google/Clerk user information and returns it
   */
  getMe: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Không tìm thấy thông tin phiên đăng nhập.',
          code: 'UNAUTHORIZED'
        });
      }

      const userInfo = await getClerkUserInfo(userId);

      return res.status(200).json({
        success: true,
        message: 'Xác thực tài khoản thành công qua Clerk',
        data: {
          user: userInfo,
          sessionId: req.auth?.sessionId,
          verifiedAt: new Date().toISOString()
        }
      });
    } catch (error: any) {
      console.error('[Auth Controller] Error fetching /api/auth/me:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi xác thực hoặc lấy thông tin người dùng từ Clerk.',
        error: error.message
      });
    }
  },

  /**
   * GET /api/auth/status
   * Public health/diagnostic endpoint to check Clerk integration status
   */
  getStatus: (_req: AuthenticatedRequest, res: Response) => {
    const isConfigured = Boolean(
      ENV.CLERK_SECRET_KEY &&
      !ENV.CLERK_SECRET_KEY.includes('your_clerk_secret_key')
    );

    return res.status(200).json({
      success: true,
      service: 'Clerk Authentication Service',
      isConfigured,
      publishableKeyConfigured: Boolean(
        ENV.CLERK_PUBLISHABLE_KEY &&
        !ENV.CLERK_PUBLISHABLE_KEY.includes('your_clerk_publishable_key')
      ),
      authFlow: [
        '1. User clicks Google Login on Frontend',
        '2. Clerk authenticates Google OAuth and issues active Session',
        '3. Frontend receives JWT Session Token via useAuth()',
        '4. Frontend attaches token: Authorization: Bearer <token>',
        '5. Backend verifies JWT token with Clerk Public Keys / JWKS',
        '6. Backend fetches user profile (Google email, name, avatar)',
        '7. Access granted to protected web features and courses'
      ]
    });
  }
};
