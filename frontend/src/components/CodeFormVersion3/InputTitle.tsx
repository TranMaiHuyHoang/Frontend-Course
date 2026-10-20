import React from 'react';
import { Row, Col, Input } from 'antd';

// Định nghĩa 3 props cơ bản theo tư duy của Leader: value, onChange, error
export interface InputTitleProps {
    value: string;                       // Giá trị chữ hiển thị trong ô
    onChange: (value: string) => void;   // Hàm gọi báo cho cha biết khi người dùng gõ phím
    error?: string;                      // Thông báo lỗi nếu có (không bắt buộc)
}

export const InputTitle: React.FC<InputTitleProps> = ({
    value,
    onChange,
    error
}) => {
    return (
        <Row gutter={16}>
            <Col span={24}>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Course Title (Tên khóa học) <span className="text-red-500">*</span>
                </label>

                <Input
                    placeholder="e.g. Master Next.js 15 & PostgreSQL"
                    size="middle"
                    value={value}
                    status={error ? 'error' : ''}
                    onChange={(e) => onChange(e.target.value)}
                />

                {/* Nếu có lỗi thì hiển thị dòng chữ đỏ */}
                {error && (
                    <span className="text-xs text-red-500 mt-1 block">
                        {error}
                    </span>
                )}
            </Col>
        </Row>
    );
};
