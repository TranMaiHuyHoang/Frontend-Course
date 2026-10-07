import React from 'react';
import { Row, Col, Input } from 'antd';

interface InputTitleProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    disabled?: boolean;
}

export const InputTitle: React.FC<InputTitleProps> = ({
    value,
    onChange,
    error,
    disabled = false
}) => {
    return (
        <Row gutter={16}>
            <Col span={24}>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Course Title <span className="text-red-500">*</span>
                </label>

                <Input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="e.g. Master Next.js 15 & PostgreSQL"
                    status={error ? 'error' : ''}
                    disabled={disabled}
                />

                {error && (
                    <span className="text-xs text-red-500 mt-1 block">
                        {error}
                    </span>
                )}
            </Col>
        </Row>
    );
};