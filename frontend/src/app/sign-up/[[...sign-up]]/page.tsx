import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-12">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại trang chủ
        </Link>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-1 border border-slate-100 flex justify-center">
        <SignUp
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'shadow-none border-0 p-6',
              headerTitle: 'text-2xl font-bold text-slate-800',
              headerSubtitle: 'text-slate-500 text-sm',
              socialButtonsBlockButton:
                'border-slate-200 hover:bg-slate-50 font-medium transition-all text-slate-700 shadow-sm py-2.5',
              formButtonPrimary:
                'bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all shadow-md shadow-blue-500/20'
            }
          }}
        />
      </div>
    </div>
  );
}
