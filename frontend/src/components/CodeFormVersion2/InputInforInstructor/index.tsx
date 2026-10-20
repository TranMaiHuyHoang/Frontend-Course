import { Col, Input, Row } from 'antd'
import React from 'react'

const InputInforInstructor = () => {
    return (
        <Row gutter={16}>
            <Col xs={24} sm={12}>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Instructor Name (Tên giảng viên) <span className="text-red-500">*</span>
                </label>
                <Input
                    placeholder="e.g. Alex Rivera"
                />
            </Col>
            <Col xs={24} sm={12}>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Instructor Email (Email liên hệ)
                </label>
                <Input
                    placeholder="e.g. instructor@edupro.dev"
                />
            </Col>
        </Row>
    )
}

export default InputInforInstructor

