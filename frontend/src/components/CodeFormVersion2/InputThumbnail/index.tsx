import { Input } from 'antd'
import React from 'react'

const InputThumbnail = () => {
    return (
        <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
                Thumbnail Image URL (Ảnh đại diện khóa học)
            </label>
            <Input
                placeholder="https://images.unsplash.com/..."
            />
        </div>
    )
}

export default InputThumbnail
