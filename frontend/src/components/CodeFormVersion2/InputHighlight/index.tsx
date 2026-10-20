import { Switch } from 'antd'
import React from 'react'

interface InputHighlightProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
}

const InputHighlight = ({ checked, onChange }: InputHighlightProps) => {
    return (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200/80">
            <Switch
                checked={checked}
                onChange={onChange}
            />


            <div>
                <span className="text-xs font-bold text-slate-800">
                    Highlight as Featured Course (Khóa học nổi bật)
                </span>
                <p className="text-[11px] text-slate-500">
                    Khóa học nổi bật sẽ hiển thị huy hiệu và ưu tiên trên trang chủ.
                </p>
            </div>
        </div>
    )
}

export default InputHighlight

