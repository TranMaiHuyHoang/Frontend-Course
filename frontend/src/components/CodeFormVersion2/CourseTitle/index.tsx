import React from 'react'

const CourseTitle = () => {
    return (
        <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>✨</span>
                <span>Create New Course (Tạo khóa học mới)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
                Điền đầy đủ thông tin để tạo và xuất bản một khóa học mới lên hệ thống.
            </p>
        </div>
    )
}

export default CourseTitle
