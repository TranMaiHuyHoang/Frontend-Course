import { Col, Select } from 'antd'
import React from 'react'

interface InputSkillProps {
    value: string[];
    onChange: (value: string[]) => void;
}
const InputSkill = ({ value, onChange }: InputSkillProps) => {
    return (
        <Col xs={24} sm={14}>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
                Skills & Tags (Kỹ năng, Công nghệ)
            </label>
            <Select
                mode="tags"
                placeholder="e.g. React, TypeScript, Python"
                value={value}
                onChange={onChange}
                className="w-full"
                tokenSeparators={[',']}
            />
        </Col>
    )
}

export default InputSkill
