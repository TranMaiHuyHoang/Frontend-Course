import type { Metadata } from 'next';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import QueryProvider from '@/providers/QueryProvider';
import AntdProvider from '@/providers/AntdProvider';
import { ClerkAuthProvider } from '@/providers/ClerkAuthProvider';

export const metadata: Metadata = {
  title: 'Course Management System | EduHub Pro',
  description: 'Manage online courses, curriculum, pricing, and enrollments with Next.js, TanStack Query, and PostgreSQL.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <html lang="en">
        <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
          <QueryProvider>
            <AntdProvider>
              <ClerkAuthProvider>{children}</ClerkAuthProvider>
            </AntdProvider>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
