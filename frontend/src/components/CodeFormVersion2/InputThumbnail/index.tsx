import { Input } from 'antd'
import React from 'react'


interface InputThumbnailProps {
    value: string;
    onChange: (value: string) => void;
}
const InputThumbnail = ({ value, onChange }: InputThumbnailProps) => {
    return (
        <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
                Thumbnail Image URL (Ảnh đại diện khóa học)
            </label>
            <Input
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder="https://images.unsplash.com/..."
            />
        </div>
    )
}

export default InputThumbnail
