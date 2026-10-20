import { Col, Select } from 'antd'
import React from 'react'

const CATEGORY_OPTIONS = [
    { label: 'Frontend Development', value: 'Frontend' },
    { label: 'Backend Development', value: 'Backend' },
    { label: 'Fullstack Development', value: 'Fullstack' },
    { label: 'Database & Big Data', value: 'Database' },
    { label: 'AI & Machine Learning', value: 'AI & ML' },
    { label: 'DevOps & Cloud Computing', value: 'DevOps' },
    { label: 'Mobile App Development', value: 'Mobile' },
    { label: 'Cybersecurity & Security', value: 'Cybersecurity' }
];

const InputCategory = () => {
    return (
        <Col xs={24} sm={10}>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category (Lĩnh vực) <span className="text-red-500">*</span>
            </label>
            <Select
                placeholder="Chọn lĩnh vực khóa học"
                defaultValue="Frontend"
                options={CATEGORY_OPTIONS}
                className="w-full"
                showSearch
            />
        </Col>
    )
}

export default InputCategory

