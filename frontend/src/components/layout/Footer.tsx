'use client';

import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
      <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© {new Date().getFullYear()} EduHub Course Management System. All rights reserved.</p>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Express + Prisma + PostgreSQL</span>
          <span>•</span>
          <span>Next.js + TanStack Query + Ant Design + React Hook Form</span>
        </div>
      </div>
    </footer>
  );
};
