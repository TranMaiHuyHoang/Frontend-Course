'use client';

import React from 'react';
import { Modal, Button } from 'antd';
import { LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { GoogleLoginButton } from './GoogleLoginButton';

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionName?: string;
}

export const AuthRequiredModal: React.FC<AuthRequiredModalProps> = ({
  isOpen,
  onClose,
  actionName = 'thực hiện chức năng này'
}) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={440}
      className="auth-required-modal"
    >
      <div className="text-center py-4 px-2">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-inner">
          <LockOutlined className="text-2xl" />
        </div>

        <h3 className="text-lg font-bold text-slate-800">
          Yêu cầu đăng nhập tài khoản
        </h3>

        <p className="mt-2 text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
          Bạn cần đăng nhập bằng Google qua <strong>Clerk</strong> để {actionName}. Hệ thống sẽ
          gửi Session Token đến <strong>Backend Express</strong> để cấp quyền truy cập.
        </p>

        <div className="mt-6 flex flex-col gap-2.5">
          <div className="flex justify-center" onClick={onClose}>
            <GoogleLoginButton className="w-full justify-center py-2.5 text-sm" />
          </div>

          <Button onClick={onClose} className="w-full text-xs text-slate-500 border-slate-200">
            Để sau (Tiếp tục xem)
          </Button>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <SafetyCertificateOutlined className="text-emerald-500" />
          <span>Bảo mật chuẩn JWT Session bởi Clerk & Express</span>
        </div>
      </div>
    </Modal>
  );
};
