import { AuthenticateWithRedirectCallback } from '@clerk/nextjs';

export default function SSOCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-slate-100 max-w-sm w-full">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4" />
        <h3 className="text-base font-semibold text-slate-800">Đang hoàn tất đăng nhập Google...</h3>
        <p className="text-xs text-slate-500 mt-1">Vui lòng chờ trong giây lát.</p>
        <AuthenticateWithRedirectCallback />
      </div>
    </div>
  );
}
