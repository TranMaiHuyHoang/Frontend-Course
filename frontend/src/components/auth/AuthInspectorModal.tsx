'use client';

import React, { useState } from 'react';
import { Modal, Tabs, Tag, Button, Alert, Tooltip, message } from 'antd';
import {
  CheckCircleFilled,
  ClockCircleOutlined,
  CopyOutlined,
  SafetyCertificateOutlined,
  CodeOutlined,
  UserOutlined,
  ApiOutlined,
  KeyOutlined,
  SyncOutlined
} from '@ant-design/icons';
import { useClerkAuth } from '@/providers/ClerkAuthProvider';
import { useUser } from '@clerk/nextjs';

interface AuthInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthInspectorModal: React.FC<AuthInspectorModalProps> = ({ isOpen, onClose }) => {
  const { user } = useUser();
  const { token, backendUser, isBackendVerified, backendLoading, backendError, refetchBackendUser } = useClerkAuth();
  const [copied, setCopied] = useState(false);

  const handleCopyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopied(true);
      message.success('Đã sao chép Clerk Session Token vào clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const steps = [
    {
      title: '1. Đăng nhập Google',
      desc: 'Người dùng chọn đăng nhập qua Google OAuth',
      status: user ? 'done' : 'pending',
      detail: user?.primaryEmailAddress?.emailAddress || 'Chưa thực hiện'
    },
    {
      title: '2. Clerk xác thực & tạo Session',
      desc: 'Clerk xử lý OAuth callback và tạo phiên hoạt động',
      status: user ? 'done' : 'pending',
      detail: user ? `User ID: ${user.id}` : 'Chưa có phiên'
    },
    {
      title: '3. Frontend nhận Session Token',
      desc: 'useAuth().getToken() lấy JWT token của phiên',
      status: token ? 'done' : 'pending',
      detail: token ? `${token.slice(0, 20)}...${token.slice(-10)}` : 'Chưa lấy được token'
    },
    {
      title: '4. Gửi Token đến Express Backend',
      desc: 'Axios đính kèm: Authorization: Bearer <token>',
      status: token ? 'done' : 'pending',
      detail: 'GET /api/auth/me'
    },
    {
      title: '5. Backend xác thực Token',
      desc: 'Express dùng @clerk/express xác thực chữ ký token',
      status: isBackendVerified ? 'done' : backendError ? 'error' : 'pending',
      detail: isBackendVerified
        ? 'Chữ ký hợp lệ (200 OK)'
        : backendError || 'Đang chờ xác thực'
    },
    {
      title: '6. Lấy thông tin User từ Clerk',
      desc: 'Backend truy xuất hồ sơ người dùng qua Clerk API',
      status: backendUser ? 'done' : 'pending',
      detail: backendUser ? `${backendUser.fullName} (${backendUser.email})` : 'Chưa có'
    },
    {
      title: '7. Cho phép truy cập chức năng Web',
      desc: 'Mở khóa tạo, chỉnh sửa, xóa khóa học',
      status: isBackendVerified ? 'done' : 'pending',
      detail: isBackendVerified ? 'Đã cấp toàn quyền quản trị' : 'Chỉ xem'
    }
  ];

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-slate-800">
          <SafetyCertificateOutlined className="text-blue-600 text-lg" />
          <span className="font-bold text-base">Clerk & Backend Auth Flow Inspector</span>
          <Tag color={isBackendVerified ? 'green' : 'orange'} className="ml-2 font-medium">
            {isBackendVerified ? 'Đã xác thực Backend' : 'Chưa xác thực'}
          </Tag>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button
          key="refresh"
          icon={<SyncOutlined spin={backendLoading} />}
          onClick={() => refetchBackendUser()}
          loading={backendLoading}
        >
          Xác thực lại với Backend
        </Button>,
        <Button key="close" type="primary" onClick={onClose} className="bg-blue-600 hover:bg-blue-500">
          Đóng
        </Button>
      ]}
      width={720}
      className="clerk-auth-modal"
    >
      <div className="py-2">
        <Tabs
          defaultActiveKey="steps"
          items={[
            {
              key: 'steps',
              label: (
                <span className="flex items-center gap-1.5 font-medium">
                  <ApiOutlined /> Quy trình 7 bước (Workflow)
                </span>
              ),
              children: (
                <div className="space-y-3 mt-1">
                  <p className="text-xs text-slate-500">
                    Sơ đồ kiểm tra trạng thái thực tế của từng bước trong chu trình đăng nhập Google và xác thực Backend:
                  </p>

                  <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white overflow-hidden">
                    {steps.map((step, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-3 p-3.5 transition-colors ${
                          step.status === 'done'
                            ? 'bg-emerald-50/30'
                            : step.status === 'error'
                            ? 'bg-rose-50/40'
                            : 'bg-white'
                        }`}
                      >
                        <div className="mt-0.5">
                          {step.status === 'done' ? (
                            <CheckCircleFilled className="text-emerald-500 text-base" />
                          ) : step.status === 'error' ? (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-rose-600 text-xs font-bold">
                              ✕
                            </span>
                          ) : (
                            <ClockCircleOutlined className="text-slate-400 text-base" />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">{step.title}</span>
                            <Tag
                              color={
                                step.status === 'done'
                                  ? 'success'
                                  : step.status === 'error'
                                  ? 'error'
                                  : 'default'
                              }
                              className="text-[10px] font-semibold uppercase tracking-wider"
                            >
                              {step.status === 'done' ? 'Thành công' : step.status === 'error' ? 'Lỗi' : 'Chờ'}
                            </Tag>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                          <div className="mt-1 font-mono text-[11px] text-slate-600 bg-slate-100/70 px-2 py-1 rounded inline-block">
                            {step.detail}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            },
            {
              key: 'token',
              label: (
                <span className="flex items-center gap-1.5 font-medium">
                  <KeyOutlined /> JWT Session Token
                </span>
              ),
              children: (
                <div className="space-y-3 mt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">
                      Clerk Session Token (Bearer):
                    </span>
                    {token && (
                      <Button
                        size="small"
                        icon={<CopyOutlined />}
                        onClick={handleCopyToken}
                        className="text-xs"
                      >
                        {copied ? 'Đã chép!' : 'Copy Token'}
                      </Button>
                    )}
                  </div>

                  {token ? (
                    <div className="relative">
                      <pre className="max-h-48 overflow-x-auto rounded-lg bg-slate-900 p-3 text-[11px] font-mono text-emerald-400 leading-relaxed break-all select-all">
                        {token}
                      </pre>
                    </div>
                  ) : (
                    <Alert
                      type="warning"
                      message="Chưa có session token"
                      description="Vui lòng đăng nhập bằng Google trên Navbar để nhận Clerk session token."
                      showIcon
                    />
                  )}

                  <div className="rounded-lg bg-blue-50/70 border border-blue-100 p-3 text-xs text-blue-900">
                    <p className="font-semibold mb-1">Cách Frontend gửi token sang Backend:</p>
                    <code className="text-[11px] font-mono text-blue-800 block bg-white/80 p-2 rounded border border-blue-200">
                      apiClient.interceptors.request.use((config) =&gt; &#123;
                      <br />
                      &nbsp;&nbsp;config.headers.Authorization = `Bearer $&#123;token&#125;`;
                      <br />
                      &nbsp;&nbsp;return config;
                      <br />
                      &#125;);
                    </code>
                  </div>
                </div>
              )
            },
            {
              key: 'backend-user',
              label: (
                <span className="flex items-center gap-1.5 font-medium">
                  <UserOutlined /> Dữ liệu Backend (GET /api/auth/me)
                </span>
              ),
              children: (
                <div className="space-y-3 mt-1">
                  {backendLoading ? (
                    <div className="py-8 text-center text-slate-500">
                      <SyncOutlined spin className="text-2xl text-blue-600 mb-2" />
                      <p className="text-xs">Đang kiểm tra token với Express Backend...</p>
                    </div>
                  ) : backendUser ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                        {backendUser.imageUrl && (
                          <img
                            src={backendUser.imageUrl}
                            alt={backendUser.fullName}
                            className="w-14 h-14 rounded-full border-2 border-white shadow-md object-cover"
                          />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold text-slate-800">{backendUser.fullName}</h4>
                            <Tag color="geekblue" className="text-xs font-semibold">
                              {backendUser.authProvider}
                            </Tag>
                          </div>
                          <p className="text-xs text-slate-500">{backendUser.email}</p>
                          <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                            ID: {backendUser.id}
                          </p>
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-semibold text-slate-700 block mb-1">
                          JSON Response từ Express (`/api/auth/me`):
                        </span>
                        <pre className="max-h-44 overflow-auto rounded-lg bg-slate-900 p-3 text-[11px] font-mono text-sky-300">
                          {JSON.stringify(backendUser, null, 2)}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <Alert
                      type="info"
                      message="Chưa có dữ liệu từ backend"
                      description={
                        backendError
                          ? `Ghi chú: ${backendError}`
                          : 'Đăng nhập Google để xem kết quả xác thực trực tiếp từ Express Backend.'
                      }
                      showIcon
                    />
                  )}
                </div>
              )
            }
          ]}
        />
      </div>
    </Modal>
  );
};
