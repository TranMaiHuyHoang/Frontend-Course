'use client';

import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'antd';
import {
    courseFormValidationSchema,
    CourseFormValues
} from '@/validations/courseSchema';
import { Course } from '@/types/course';
import { useCreateCourse, useUpdateCourse } from '@/hooks/useCourses';

// Subcomponents theo kiến trúc của thầy
import { TitleCourse } from './TitleCourse';
import { InputTitle } from './InputTitle';
import { InputDescription } from './InputDescription';
import { InputInstructor } from './InputInstructor';
import { SelectLevel } from './SelectLevel';
import { SelectChargeType } from './SelectChargeType';
import { InputPrice } from './InputPrice';
import { SelectMetadata } from './SelectMetadata';
import { InputStatus } from './InputStatus';

export interface CourseFormProps {
    isOpen?: boolean;
    onClose: () => void;
    courseToEdit?: Course | null;
}

const DEFAULT_FORM_VALUES: CourseFormValues = {
    title: '',
    slug: '',
    description: '',
    instructor: '',
    instructorEmail: '',
    category: 'Frontend',
    level: 'BEGINNER',
    status: 'DRAFT',
    price: 0,
    discountPrice: null,
    durationHours: 10,
    lessonsCount: 1,
    thumbnail: '',
    isFeatured: false,
    tags: ['React', 'TypeScript'],
    requirements: ['Basic programming fundamentals'],
    objectives: ['Build end-to-end fullstack applications']
};

export const CourseForm: React.FC<CourseFormProps> = ({
    isOpen = true,
    onClose,
    courseToEdit
}) => {
    // 1. Xác định chế độ Create hay Edit
    const isEditing = Boolean(courseToEdit);
    const createMutation = useCreateCourse();
    const updateMutation = useUpdateCourse();

    // 2. Một formData duy nhất quản lý toàn bộ dữ liệu form tại Component Cha
    const [formData, setFormData] = useState<CourseFormValues>(DEFAULT_FORM_VALUES);
    const [errors, setErrors] = useState<Partial<Record<keyof CourseFormValues, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFree, setIsFree] = useState<boolean>(true);

    // 3. Khởi tạo dữ liệu khi mở form (Đổ dữ liệu cũ nếu là Edit, nạp mặc định nếu là Create)
    useEffect(() => {
        if (isOpen) {
            setErrors({});
            if (courseToEdit) {
                setFormData({
                    title: courseToEdit.title,
                    slug: courseToEdit.slug || '',
                    description: courseToEdit.description,
                    instructor: courseToEdit.instructor,
                    instructorEmail: courseToEdit.instructorEmail || '',
                    category: courseToEdit.category,
                    level: courseToEdit.level,
                    status: courseToEdit.status,
                    price: courseToEdit.price,
                    discountPrice: courseToEdit.discountPrice ?? null,
                    durationHours: courseToEdit.durationHours,
                    lessonsCount: courseToEdit.lessonsCount,
                    thumbnail: courseToEdit.thumbnail || '',
                    isFeatured: courseToEdit.isFeatured,
                    tags: courseToEdit.tags || [],
                    requirements: courseToEdit.requirements || [],
                    objectives: courseToEdit.objectives || []
                });
                setIsFree(courseToEdit.price === 0);
            } else {
                setFormData(DEFAULT_FORM_VALUES);
                setIsFree(true);
            }
        }
    }, [isOpen, courseToEdit]);

    // 4. Handler cập nhật form chung (handleChangeForm)
    const handleChangeForm = <K extends keyof CourseFormValues>(
        field: K,
        value: CourseFormValues[K]
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }));

        // Tự động xóa lỗi của field khi người dùng đã chỉnh sửa
        if (errors[field]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    };

    // 5. Xử lý chuyển đổi loại phí (Miễn phí vs Có phí)
    const handleChargeTypeChange = (free: boolean) => {
        setIsFree(free);
        if (free) {
            handleChangeForm('price', 0);
            handleChangeForm('discountPrice', null);
        } else {
            if (formData.price === 0) {
                handleChangeForm('price', 49.99);
            }
        }
    };

    // 6. Xử lý Submit chung cho cả Create và Edit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Kiểm tra hợp lệ dữ liệu bằng Zod Schema
        const validationResult = courseFormValidationSchema.safeParse(formData);
        if (!validationResult.success) {
            const fieldErrors: Partial<Record<keyof CourseFormValues, string>> = {};
            for (const issue of validationResult.error.issues) {
                const fieldName = issue.path[0] as keyof CourseFormValues;
                if (fieldName && !fieldErrors[fieldName]) {
                    fieldErrors[fieldName] = issue.message;
                }
            }
            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        setIsSubmitting(true);

        try {
            const validatedData = validationResult.data;
            if (isEditing && courseToEdit) {
                // UPDATE / EDIT FLOW
                await updateMutation.mutateAsync({
                    id: courseToEdit.id,
                    data: validatedData
                });
            } else {
                // CREATE FLOW
                await createMutation.mutateAsync(validatedData as any);
            }
            onClose();
        } catch (error) {
            // Error đã được xử lý bởi React Query mutation toast
        } finally {
            setIsSubmitting(false);
        }
    };

    const isPending = createMutation.isPending || updateMutation.isPending || isSubmitting;

    return (
        <Modal
            title={<TitleCourse isEditing={isEditing} />}
            open={isOpen}
            onCancel={onClose}
            width={820}
            footer={null}
            destroyOnClose
            centered
            className="top-6"
        >
            <form onSubmit={handleSubmit} className="space-y-4 pt-3">
                {/* 1. Tên môn học */}
                <InputTitle
                    value={formData.title}
                    onChange={(val) => handleChangeForm('title', val)}
                    error={errors.title}
                    disabled={isPending}
                />

                {/* 2. Mô tả */}
                <InputDescription
                    value={formData.description}
                    onChange={(val) => handleChangeForm('description', val)}
                    error={errors.description}
                    disabled={isPending}
                />

                {/* 3. Giảng viên (Tên & Email) */}
                <InputInstructor
                    instructor={formData.instructor}
                    instructorEmail={formData.instructorEmail}
                    onChangeInstructor={(val) => handleChangeForm('instructor', val)}
                    onChangeEmail={(val) => handleChangeForm('instructorEmail', val)}
                    instructorError={errors.instructor}
                    emailError={errors.instructorEmail}
                />

                {/* 4. Cấp độ (Level) */}
                <SelectLevel
                    value={formData.level}
                    onChange={(val) => handleChangeForm('level', val)}
                    error={errors.level}
                    disabled={isPending}
                />

                {/* 5. Tùy chọn thu phí (SelectChargeType) */}
                <SelectChargeType
                    isFree={isFree}
                    onChange={handleChargeTypeChange}
                    disabled={isPending}
                />

                {/* 6. Giá tiền & Thời lượng (InputPrice) */}
                <InputPrice
                    price={formData.price}
                    discountPrice={formData.discountPrice}
                    durationHours={formData.durationHours}
                    lessonsCount={formData.lessonsCount}
                    isFree={isFree}
                    onChangePrice={(val) => handleChangeForm('price', val)}
                    onChangeDiscountPrice={(val) => handleChangeForm('discountPrice', val)}
                    onChangeDuration={(val) => handleChangeForm('durationHours', val)}
                    onChangeLessonsCount={(val) => handleChangeForm('lessonsCount', val)}
                    priceError={errors.price}
                    durationError={errors.durationHours}
                    lessonsCountError={errors.lessonsCount}
                    disabled={isPending}
                />

                {/* 7. Lĩnh vực, Ngôn ngữ, Kỹ năng & Ảnh minh họa (SelectMetadata) */}
                <SelectMetadata
                    category={formData.category}
                    tags={formData.tags}
                    thumbnail={formData.thumbnail}
                    onChangeCategory={(val) => handleChangeForm('category', val)}
                    onChangeTags={(val) => handleChangeForm('tags', val)}
                    onChangeThumbnail={(val) => handleChangeForm('thumbnail', val)}
                    categoryError={errors.category}
                    thumbnailError={errors.thumbnail}
                    disabled={isPending}
                />

                {/* 8. Tùy chọn trạng thái & Khóa học nổi bật (InputStatus) */}
                <InputStatus
                    value={formData.status}
                    onChange={(val) => handleChangeForm('status', val)}
                    isFeatured={formData.isFeatured}
                    onChangeFeatured={(val) => handleChangeForm('isFeatured', val)}
                    error={errors.status}
                    disabled={isPending}
                />

                {/* Nút thao tác của Form */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <Button onClick={onClose} disabled={isPending}>
                        Cancel (Hủy bỏ)
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isPending}
                        className="bg-blue-600 hover:bg-blue-500 font-semibold px-6"
                    >
                        {isEditing ? 'Save Changes (Cập nhật)' : 'Create Course (Tạo mới)'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
