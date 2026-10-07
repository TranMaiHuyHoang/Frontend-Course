import React from 'react';
import { Input } from 'antd';

const { TextArea } = Input;

interface InputDescriptionProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    disabled?: boolean;
}

export const InputDescription: React.FC<InputDescriptionProps> = ({
    value,
    onChange,
    error,
    disabled = false
}) => {
    return (
        <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
                Course Description <span className="text-red-500">*</span>
            </label>
            <TextArea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={3}
                placeholder="Comprehensive summary of what this course covers..."
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