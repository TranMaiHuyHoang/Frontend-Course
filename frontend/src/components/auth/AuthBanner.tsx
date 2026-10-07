'use client';

import React, { useState } from 'react';
import { Tag, Button } from 'antd';
import {
  SafetyCertificateOutlined,
  CheckCircleFilled,
  RightOutlined,
  ThunderboltOutlined,
  UserOutlined,
  SyncOutlined
} from '@ant-design/icons';
import { useClerkAuth } from '@/providers/ClerkAuthProvider';
import { useUser } from '@clerk/nextjs';
import { GoogleLoginButton, GoogleIcon } from './GoogleLoginButton';
import { AuthInspectorModal } from './AuthInspectorModal';

export const AuthBanner: React.FC = () => {
  const { isSignedIn, isLoaded, backendUser, isBackendVerified, backendLoading } = useClerkAuth();
  const { user } = useUser();
  const [inspectorOpen, setInspectorOpen] = useState(false);

  if (!isLoaded) return null;

  return (
    <>
      <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-slate-50 p-4 sm:p-5 shadow-sm">
        {isSignedIn ? (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.fullName || 'User'}
                    className="h-12 w-12 rounded-full border-2 border-white shadow-sm object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                    <UserOutlined />
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow">
                  <GoogleIcon className="w-3 h-3" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-slate-800">
                    Xin chào, {user?.fullName || user?.firstName || 'User'}!
                  </h3>
                  <Tag color="green" className="border-0 bg-emerald-50 text-emerald-700 font-semibold text-xs flex items-center gap-1">
                    <CheckCircleFilled /> Google Account
                  </Tag>
                  {isBackendVerified ? (
                    <Tag color="blue" className="border-0 bg-blue-50 text-blue-700 font-semibold text-xs">
                      Backend Token Verified
                    </Tag>
                  ) : backendLoading ? (
                    <Tag color="processing" className="text-xs">
                      <SyncOutlined spin /> Verifying Token...
                    </Tag>
                  ) : null}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Đã xác thực qua Clerk &bull; Phiên đăng nhập hoạt động &bull; Toàn quyền quản trị khóa học
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="middle"
                icon={<SafetyCertificateOutlined className="text-blue-600" />}
                onClick={() => setInspectorOpen(true)}
                className="bg-white hover:bg-slate-50 text-slate-700 border-slate-200 text-xs font-semibold shadow-sm"
              >
                Kiểm tra Token & Backend
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-white text-xs font-bold">
                  <SafetyCertificateOutlined />
                </span>
                <h3 className="text-sm font-bold text-slate-800">
                  Hệ thống xác thực Google OAuth & Clerk Session
                </h3>
                <Tag color="processing" className="text-[10px] font-semibold">
                  Sẵn sàng
                </Tag>
              </div>
              <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                Đăng nhập bằng tài khoản Google để nhận Session Token, tự động xác thực với Backend Express và kích hoạt quyền tạo, sửa, xóa khóa học.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <GoogleLoginButton className="shadow-sm" />
              <Button
                size="middle"
                onClick={() => setInspectorOpen(true)}
                className="text-xs font-medium text-slate-600 bg-transparent border-slate-300 hover:border-slate-400"
              >
                Xem quy trình 7 bước
              </Button>
            </div>
          </div>
        )}
      </div>

      <AuthInspectorModal isOpen={inspectorOpen} onClose={() => setInspectorOpen(false)} />
    </>
  );
};
