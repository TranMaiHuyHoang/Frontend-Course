'use client';

import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { InputTitle } from './InputTitle';

export interface CodeFormVersion3Props {
    isOpen?: boolean;
    onClose?: () => void;
}

/**
 * Component Cha: CodeFormVersion3
 * Đúng theo thiết kế:
 * - Cha giữ: formData, errors, handleChange, validation
 * - Con nhận: value, onChange, error
 */
export const CodeFormVersion3: React.FC<CodeFormVersion3Props> = ({
    isOpen = true,
    onClose
}) => {
    // 1. Cha giữ dữ liệu của Form (formData)
    const [formData, setFormData] = useState({
        title: ''
    });

    // 2. Cha giữ danh sách các lỗi (errors)
    const [errors, setErrors] = useState<{ title?: string }>({});

    // 3. Hàm cập nhật dữ liệu chung (handleChange)
    const handleChange = (field: 'title', value: string) => {
        // Cập nhật giá trị mới vào formData
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }));

        // Nếu người dùng đã gõ có chữ thì xóa lỗi đi
        if (value.trim() !== '') {
            setErrors((prev) => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    // 4. Xử lý khi nhấn nút tạo khóa học
    const handleSubmit = () => {
        if (!formData.title.trim()) {
            setErrors({
                title: 'Course title is required (Vui lòng nhập tên khóa học)!'
            });
            return;
        }

        alert(`Tạo khóa học thành công: "${formData.title}"`);
    };

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            width={840}
            footer={null}
            destroyOnClose
            centered
            className="top-6"
            title={
                <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <span>✨</span>
                        <span>Create New Course (Version 3)</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Code ngắn gọn và dễ bảo trì nhờ bóc tách thành các component nhỏ.
                    </p>
                </div>
            }
        >
            <form className="space-y-4 pt-3" onSubmit={(e) => e.preventDefault()}>
                {/* 
                   1. TÊN MÔN HỌC - Bây giờ chỉ còn 5 dòng:
                   Truyền đủ 3 món: value, onChange, error
                */}
                <InputTitle
                    value={formData.title}
                    onChange={(value) => handleChange('title', value)}
                    error={errors.title}
                />
            </form>
        </Modal>
    );
};

export default CodeFormVersion3;
