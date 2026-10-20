import { Select } from 'antd'
import React from 'react'

// Danh sách trạng thái môn học
const STATUS_OPTIONS = [
    { label: 'Draft (Bản nháp)', value: 'DRAFT' },
    { label: 'Published (Xuất bản công khai)', value: 'PUBLISHED' },
    { label: 'Archived (Lưu trữ)', value: 'ARCHIVED' }
];

interface InputStatusProps {
    value: string;
    onChange: (value: string) => void;
}

const InputStatus = ({ value, onChange }: InputStatusProps) => {
    return (
        <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
                Publish Status (Trạng thái) <span className="text-red-500">*</span>
            </label>
            <Select
                value={value}
                onChange={onChange}
                options={STATUS_OPTIONS}
                className="w-full"
            />
        </div>
    )
}

export default InputStatus

