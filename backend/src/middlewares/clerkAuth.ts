import { Request, Response, NextFunction } from 'express';
import { clerkMiddleware, getAuth, clerkClient } from '@clerk/express';
import { ENV } from '../config/env.js';

// Global Clerk middleware
export const clerkAuthMiddleware = clerkMiddleware({
  publishableKey: ENV.CLERK_PUBLISHABLE_KEY || undefined,
  secretKey: ENV.CLERK_SECRET_KEY || undefined
});

/**
 * Interface for authenticated request with Clerk auth context
 */
export interface AuthenticatedRequest extends Request {
  auth?: ReturnType<typeof getAuth>;
  clerkUser?: any;
}

/**
 * Middleware: Requires a valid Clerk session token.
 * Token must be sent in header: `Authorization: Bearer <session_token>`
 */
export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // If Clerk keys are not configured yet, notify developer in dev mode
  if (!ENV.CLERK_SECRET_KEY || ENV.CLERK_SECRET_KEY.includes('your_clerk_secret_key')) {
    console.warn('⚠️ [Clerk Auth] CLERK_SECRET_KEY is not configured in backend/.env');
  }

  const auth = getAuth(req);

  if (!auth || !auth.userId) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Bạn cần đăng nhập (Google qua Clerk) để thực hiện thao tác này.',
      code: 'AUTH_REQUIRED'
    });
  }

  req.auth = auth;
  next();
};

/**
 * Middleware: Optional authentication. Attaches auth context if token present.
 */
export const optionalAuth = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const auth = getAuth(req);
    if (auth && auth.userId) {
      req.auth = auth;
    }
  } catch (err) {
    // Ignore error in optional auth
  }
  next();
};

/**
 * Helper: Fetch user information directly from Clerk API using userId
 */
export const getClerkUserInfo = async (userId: string) => {
  try {
    const user = await clerkClient.users.getUser(userId);

    const primaryEmail =
      user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress ||
      user.emailAddresses[0]?.emailAddress ||
      '';

    // Find Google external OAuth account if connected
    const googleAccount = user.externalAccounts.find(
      (acc: any) => acc.provider === 'google' || acc.provider === 'oauth_google'
    );

    const fullName =
      [user.firstName, user.lastName].filter(Boolean).join(' ').trim() ||
      user.username ||
      primaryEmail.split('@')[0] ||
      'User';

    return {
      id: user.id,
      email: primaryEmail,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      fullName,
      imageUrl: user.imageUrl,
      hasImage: Boolean(user.hasImage),
      authProvider: googleAccount ? 'Google' : 'Clerk / Email',
      isGoogleAuth: Boolean(googleAccount),
      googleId: googleAccount?.providerUserId || null,
      createdAt: user.createdAt,
      lastSignInAt: user.lastSignInAt
    };
  } catch (error: any) {
    console.error(`[Clerk Auth] Failed to fetch user info for ${userId}:`, error.message);
    throw error;
  }
};
