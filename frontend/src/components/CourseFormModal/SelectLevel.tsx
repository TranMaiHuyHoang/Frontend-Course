import React from 'react';
import { Select } from 'antd';
import { CourseLevel } from '@/types/course';

interface SelectLevelProps {
    value: CourseLevel;
    onChange: (value: CourseLevel) => void;
    error?: string;
    disabled?: boolean;
}

export const LEVEL_OPTIONS = [
    { label: 'Beginner', value: 'BEGINNER' },
    { label: 'Intermediate', value: 'INTERMEDIATE' },
    { label: 'Advanced', value: 'ADVANCED' },
    { label: 'All Levels', value: 'ALL_LEVELS' }
];

export const SelectLevel: React.FC<SelectLevelProps> = ({
    value,
    onChange,
    error,
    disabled = false
}) => {
    return (
        <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
                Skill Level <span className="text-red-500">*</span>
            </label>
            <Select
                value={value}
                onChange={(val) => onChange(val)}
                options={LEVEL_OPTIONS}
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
    );
};
