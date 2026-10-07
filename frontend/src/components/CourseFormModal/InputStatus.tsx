import React from 'react';
import { Select, Switch } from 'antd';
import { CourseStatus } from '@/types/course';

interface InputStatusProps {
    value: CourseStatus;
    onChange: (value: CourseStatus) => void;
    isFeatured?: boolean;
    onChangeFeatured?: (value: boolean) => void;
    error?: string;
    disabled?: boolean;
}

export const STATUS_OPTIONS = [
    { label: 'Draft (Bản nháp)', value: 'DRAFT' },
    { label: 'Published (Xuất bản công khai)', value: 'PUBLISHED' },
    { label: 'Archived (Lưu trữ)', value: 'ARCHIVED' }
];

export const InputStatus: React.FC<InputStatusProps> = ({
    value,
    onChange,
    isFeatured = false,
    onChangeFeatured,
    error,
    disabled = false
}) => {
    return (
        <div className="space-y-3">
            <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Publish Status (Trạng thái) <span className="text-red-500">*</span>
                </label>
                <Select
                    value={value}
                    onChange={(val) => onChange(val)}
                    options={STATUS_OPTIONS}
                    className="w-full"
                    status={error ? 'error' : ''}
                    disabled={disabled}
                />
                {error && (
                    <span className="text-xs text-red-500 mt-1 block">
                        {error}
                    </span>
                )}
            </div>

            {onChangeFeatured && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                    <Switch
                        checked={isFeatured}
                        onChange={(checked) => onChangeFeatured(checked)}
                        disabled={disabled}
                    />
                    <div>
                        <span className="text-xs font-bold text-slate-800">
                            Highlight as Featured Course
                        </span>
                        <p className="text-[11px] text-slate-500">
                            Khóa học nổi bật sẽ hiển thị huy hiệu và ưu tiên trên trang chủ.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};
