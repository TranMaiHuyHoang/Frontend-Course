'use client';

import React, { useState } from 'react';
import { Button, Tag, Tooltip } from 'antd';
import {
  BookOutlined,
  PlusOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  LockOutlined,
  CheckCircleFilled,
  SyncOutlined
} from '@ant-design/icons';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import { useClerkAuth } from '@/providers/ClerkAuthProvider';
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton';
import { AuthInspectorModal } from '@/components/auth/AuthInspectorModal';

interface NavbarProps {
  onAddNewCourse: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onAddNewCourse }) => {
  const { user } = useUser();
  const { isBackendVerified, backendLoading, backendUser } = useClerkAuth();
  const [inspectorOpen, setInspectorOpen] = useState(false);

  const handleCreateCourseClick = () => {
    onAddNewCourse();
  };

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand logo & title */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <BookOutlined className="text-xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-slate-900">
                  EduHub Pro
                </span>
                <Tag color="blue" className="font-semibold text-xs border-0 bg-blue-50 text-blue-700">
                  Course Manager
                </Tag>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Next.js 14 • Express • Clerk Google Auth • PostgreSQL
              </p>
            </div>
          </div>

          {/* Right action items & Auth status */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Database status indicator */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
              <ThunderboltOutlined className="text-amber-500" />
              <span>DB Connected</span>
            </div>

            {/* Auth Inspector button (opens live 7-step inspection) */}
            <Tooltip title="Xem quy trình xác thực Token 7 bước với Backend">
              <Button
                size="middle"
                icon={<SafetyCertificateOutlined className="text-blue-600" />}
                onClick={() => setInspectorOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 border-slate-200 hover:border-blue-400 font-medium text-xs text-slate-700 bg-white shadow-sm"
              >
                <span>Auth Flow</span>
                {isBackendVerified ? (
                  <CheckCircleFilled className="text-emerald-500 text-xs ml-0.5" />
                ) : backendLoading ? (
                  <SyncOutlined spin className="text-blue-500 text-xs ml-0.5" />
                ) : null}
              </Button>
            </Tooltip>

            {/* Signed In State */}
            <SignedIn>
              <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-800 leading-tight">
                    {user?.fullName || user?.firstName || 'User'}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-medium">
                    {isBackendVerified ? 'Backend Verified ✅' : 'Clerk Authenticated'}
                  </span>
                </div>

                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: 'w-9 h-9 ring-2 ring-blue-500/20 shadow-sm'
                    }
                  }}
                />

                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreateCourseClick}
                  className="bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 font-semibold text-xs ml-1"
                >
                  Create Course
                </Button>
              </div>
            </SignedIn>

            {/* Signed Out State */}
            <SignedOut>
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <GoogleLoginButton />

                <Tooltip title="Đăng nhập tài khoản để thêm mới và quản lý khóa học">
                  <Button
                    type="primary"
                    icon={<LockOutlined />}
                    onClick={handleCreateCourseClick}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs shadow-sm"
                  >
                    Tạo khóa học
                  </Button>
                </Tooltip>
              </div>
            </SignedOut>
          </div>
        </div>
      </header>

      {/* Auth Inspector Modal */}
      <AuthInspectorModal isOpen={inspectorOpen} onClose={() => setInspectorOpen(false)} />
    </>
  );
};
