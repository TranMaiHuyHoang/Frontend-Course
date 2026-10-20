import TextArea from 'antd/es/input/TextArea'
import React from 'react'

interface InputDescriptionProps{
    value: string;
    onChange:(value: string) =>void;
}

const InputDescription = ({value, onChange}:InputDescriptionProps) => {
    return (
        <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
                Course Description (Mô tả chi tiết) <span className="text-red-500">*</span>
            </label>
            <TextArea
            value={value}
            onChange={(e) => onChange(e.target.value)}
                rows={3}
                placeholder="Comprehensive summary of what this course covers..."
            />
        </div>
    )
}

export default InputDescription

