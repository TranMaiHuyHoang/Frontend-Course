import { Col, Select } from 'antd'
import React from 'react'

const InputSkill = () => {
    return (
        <Col xs={24} sm={14}>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
                Skills & Tags (Kỹ năng, Công nghệ)
            </label>
            <Select
                mode="tags"
                placeholder="e.g. React, TypeScript, Python"
                defaultValue={['React', 'Next.js']}
                className="w-full"
                tokenSeparators={[',']}
            />
        </Col>
    )
}

export default InputSkill
