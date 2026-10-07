import React from 'react';

interface TitleCourseProps {
    isEditing: boolean;
}

export const TitleCourse: React.FC<TitleCourseProps> = ({ isEditing }) => {
    return (
        <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>{isEditing ? '✏️' : '✨'}</span>
                <span>{isEditing ? 'Edit Course' : 'Create New Course'}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
                {isEditing
                    ? 'Chỉnh sửa thông tin giáo trình, học phí và cấu hình khóa học hiện tại.'
                    : 'Điền đầy đủ thông tin để tạo và xuất bản một khóa học mới lên hệ thống.'}
            </p>
        </div>
    );
};
