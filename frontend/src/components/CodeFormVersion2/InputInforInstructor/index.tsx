import { Col, Input, Row } from 'antd'
import React from 'react'


interface InputInforInstructorProps {
    instructorName: string;
    instructorEmail: string;
    onChange: (key: 'instructor' | 'instructorEmail', value: string) => void;
}
const InputInforInstructor = ({ instructorName, instructorEmail, onChange }: InputInforInstructorProps) => {
    return (
        <Row gutter={16}>
            <Col xs={24} sm={12}>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Instructor Name (Tên giảng viên) <span className="text-red-500">*</span>
                </label>
                <Input
                    value={instructorName}
                    onChange={e => onChange('instructor', e.target.value)}
                    placeholder="e.g. Alex Rivera"
                />
            </Col>
            <Col xs={24} sm={12}>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Instructor Email (Email liên hệ)
                </label>
                <Input
                    value={instructorEmail}
                    onChange={e => onChange('instructorEmail', e.target.value)}
                    placeholder="e.g. instructor@edupro.dev"
                />
            </Col>
        </Row>
    )
}

export default InputInforInstructor

