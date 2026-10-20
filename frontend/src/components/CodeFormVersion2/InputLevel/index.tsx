import { Col, Row, Select } from 'antd'
import React from 'react'

const LEVEL_OPTIONS = [
    { label: 'Beginner (Cơ bản)', value: 'BEGINNER' },
    { label: 'Intermediate (Trung cấp)', value: 'INTERMEDIATE' },
    { label: 'Advanced (Nâng cao)', value: 'ADVANCED' },
    { label: 'All Levels (Mọi cấp độ)', value: 'ALL_LEVELS' }
];

const InputLevel = () => {
    return (

        <Col xs={24} sm={12}>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
                Skill Level (Trình độ) <span className="text-red-500">*</span>
            </label>
            <Select
                placeholder="Chọn trình độ phù hợp"
                defaultValue="BEGINNER"
                options={LEVEL_OPTIONS}
                className="w-full"
            />
        </Col>

    )
}

export default InputLevel

