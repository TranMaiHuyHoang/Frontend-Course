import { Col, Input, Row } from 'antd'
import React from 'react'

interface InputTitleProps {
    value: string;
    onChange: (value: string) => void;
}

const InputTitle = ({ value, onChange }: InputTitleProps) => {
    return (
        <Row gutter={16}>
            <Col span={24}>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Course Title (Tên khóa học) <span className="text-red-500">*</span>
                </label>
                <Input
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder="e.g. Master Next.js 15 & PostgreSQL"
                    size="middle"
                />
            </Col>
        </Row>
    )
}

export default InputTitle

