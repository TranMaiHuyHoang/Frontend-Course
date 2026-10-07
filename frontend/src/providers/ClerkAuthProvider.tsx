'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth, useUser, useSignIn } from '@clerk/nextjs';
import { setAuthTokenGetter, authApi, ClerkAuthUser } from '@/lib/api';

interface ClerkAuthContextType {
  isLoaded: boolean;
  isSignedIn: boolean;
  token: string | null;
  backendUser: ClerkAuthUser | null;
  isBackendVerified: boolean;
  backendLoading: boolean;
  backendError: string | null;
  refetchBackendUser: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const ClerkAuthContext = createContext<ClerkAuthContextType>({
  isLoaded: false,
  isSignedIn: false,
  token: null,
  backendUser: null,
  isBackendVerified: false,
  backendLoading: false,
  backendError: null,
  refetchBackendUser: async () => {},
  signInWithGoogle: async () => {},
});

export const ClerkAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const { signIn } = useSignIn();

  const [token, setToken] = useState<string | null>(null);
  const [backendUser, setBackendUser] = useState<ClerkAuthUser | null>(null);
  const [isBackendVerified, setIsBackendVerified] = useState(false);
  const [backendLoading, setBackendLoading] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);

  // Bind token getter to Axios instance
  useEffect(() => {
    if (isLoaded) {
      setAuthTokenGetter(async () => {
        try {
          const t = await getToken();
          setToken(t);
          return t;
        } catch {
          return null;
        }
      });
    }
  }, [isLoaded, getToken]);

  // When user is signed in, verify token with Express Backend
  const verifyWithBackend = useCallback(async () => {
    if (!isSignedIn) {
      setBackendUser(null);
      setIsBackendVerified(false);
      setBackendError(null);
      return;
    }

    setBackendLoading(true);
    setBackendError(null);

    try {
      // Call backend endpoint GET /api/auth/me
      const res = await authApi.getMe();
      if (res.success && res.data?.user) {
        setBackendUser(res.data.user);
        setIsBackendVerified(true);
      }
    } catch (err: any) {
      console.warn('[ClerkAuthProvider] Backend verification note:', err?.response?.data || err.message);
      // In dev mode, if backend doesn't have secret key yet or server is restarting
      const msg = err?.response?.data?.message || err.message || 'Chưa thể kết nối tới Backend để xác thực';
      setBackendError(msg);
      setIsBackendVerified(false);
    } finally {
      setBackendLoading(false);
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      verifyWithBackend();
    } else if (isLoaded && !isSignedIn) {
      setBackendUser(null);
      setIsBackendVerified(false);
      setToken(null);
    }
  }, [isLoaded, isSignedIn, verifyWithBackend]);

  // One-click Google Sign In helper
  const signInWithGoogle = async () => {
    if (!signIn) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/'
      });
    } catch (err: any) {
      console.error('Google Sign In error:', err);
    }
  };

  return (
    <ClerkAuthContext.Provider
      value={{
        isLoaded,
        isSignedIn: Boolean(isSignedIn),
        token,
        backendUser,
        isBackendVerified,
        backendLoading,
        backendError,
        refetchBackendUser: verifyWithBackend,
        signInWithGoogle
      }}
    >
      {children}
    </ClerkAuthContext.Provider>
  );
};

export const useClerkAuth = () => useContext(ClerkAuthContext);
