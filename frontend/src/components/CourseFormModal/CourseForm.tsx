'use client';

import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'antd';
import { CourseFormValues } from '@/validations/courseSchema';
import { useCreateCourse } from '@/hooks/useCourses';

// Subcomponents
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
    tags: ['React'],
    requirements: ['Basic programming fundamentals'],
    objectives: ['Build end-to-end fullstack applications']
};

export const CourseForm: React.FC<CourseFormProps> = ({
    isOpen = true,
    onClose
}) => {
    // Mutation tạo môn học
    const createMutation = useCreateCourse();

    // Dữ liệu của form
    const [formData, setFormData] =
        useState<CourseFormValues>(DEFAULT_FORM_VALUES);

    // Lưu lỗi của từng field
    const [errors, setErrors] = useState<
        Partial<Record<keyof CourseFormValues, string>>
    >({});

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Miễn phí / Có phí
    const [isFree, setIsFree] = useState<boolean>(true);

    // Khi mở form → reset lại form
    useEffect(() => {
        if (isOpen) {
            setFormData(DEFAULT_FORM_VALUES);
            setErrors({});
            setIsFree(true);
        }
    }, [isOpen]);

    // Hàm thay đổi dữ liệu form
    const handleChangeForm = <K extends keyof CourseFormValues>(
        field: K,
        value: CourseFormValues[K]
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }));

        // Xóa lỗi của field khi người dùng sửa
        if (errors[field]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    };

    // Thay đổi loại phí
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

    // Validate bằng if
    const validateForm = () => {
        const newErrors: Partial<
            Record<keyof CourseFormValues, string>
        > = {};

        // Title
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.trim().length < 3) {
            newErrors.title = 'Title must be at least 3 characters';
        } else if (formData.title.trim().length > 150) {
            newErrors.title = 'Title cannot exceed 150 characters';
        }

        // Slug
        if (formData.slug && !/^[a-z0-9-]+$/.test(formData.slug)) {
            newErrors.slug =
                'Slug can only contain lowercase letters, numbers, and hyphens';
        }

        // Description
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        } else if (formData.description.trim().length < 10) {
            newErrors.description =
                'Description must be at least 10 characters';
        }

        // Instructor
        if (!formData.instructor.trim()) {
            newErrors.instructor = 'Instructor name is required';
        } else if (formData.instructor.trim().length < 2) {
            newErrors.instructor =
                'Instructor name must be at least 2 characters';
        }

        // Instructor Email
        if (formData.instructorEmail) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(formData.instructorEmail)) {
                newErrors.instructorEmail = 'Invalid email address';
            }
        }

        // Category
        if (!formData.category.trim()) {
            newErrors.category = 'Please select or enter a category';
        }

        // Price
        if (formData.price < 0) {
            newErrors.price = 'Price must be 0 or higher';
        }

        // Discount Price
        if (
            formData.discountPrice !== null &&
            formData.discountPrice !== undefined &&
            formData.discountPrice < 0
        ) {
            newErrors.discountPrice =
                'Discount price must be 0 or higher';
        }

        // Duration
        if (formData.durationHours < 0.5) {
            newErrors.durationHours =
                'Duration must be at least 0.5 hours';
        }

        // Lessons
        if (formData.lessonsCount < 1) {
            newErrors.lessonsCount =
                'Must have at least 1 lesson';
        }

        // Thumbnail
        if (formData.thumbnail) {
            try {
                new URL(formData.thumbnail);
            } catch {
                newErrors.thumbnail =
                    'Thumbnail must be a valid URL';
            }
        }

        // Status
        if (
            !['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(
                formData.status
            )
        ) {
            newErrors.status = 'Invalid status';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // Submit tạo môn học
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate
        const isValid = validateForm();

        if (!isValid) {
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                ...formData,
                slug:
                    formData.slug &&
                        formData.slug.trim() !== ''
                        ? formData.slug.trim()
                        : undefined
            };

            await createMutation.mutateAsync(payload as any);

            // Tạo thành công → đóng form
            onClose();
        } catch (error) {
            // Mutation đã xử lý toast lỗi
        } finally {
            setIsSubmitting(false);
        }
    };

    const isPending =
        createMutation.isPending || isSubmitting;

    return (
        <Modal
            title={<TitleCourse isEditing={false} />}
            open={isOpen}
            onCancel={onClose}
            width={820}
            footer={null}
            destroyOnClose
            centered
            className="top-6"
        >
            <form
                onSubmit={handleSubmit}
                className="space-y-4 pt-3"
            >
                {/* 1. Tên môn học */}
                <InputTitle
                    value={formData.title}
                    onChange={(val) =>
                        handleChangeForm('title', val)
                    }
                    error={errors.title}
                    disabled={isPending}
                />

                {/* 2. Mô tả */}
                <InputDescription
                    value={formData.description}
                    onChange={(val) =>
                        handleChangeForm('description', val)
                    }
                    error={errors.description}
                    disabled={isPending}
                />

                {/* 3. Giảng viên */}
                <InputInstructor
                    instructor={formData.instructor}
                    instructorEmail={formData.instructorEmail}
                    onChangeInstructor={(val) =>
                        handleChangeForm('instructor', val)
                    }
                    onChangeEmail={(val) =>
                        handleChangeForm('instructorEmail', val)
                    }
                    instructorError={errors.instructor}
                    emailError={errors.instructorEmail}
                />

                {/* 4. Cấp độ */}
                <SelectLevel
                    value={formData.level}
                    onChange={(val) =>
                        handleChangeForm('level', val)
                    }
                    error={errors.level}
                    disabled={isPending}
                />

                {/* 5. Loại phí */}
                <SelectChargeType
                    isFree={isFree}
                    onChange={handleChargeTypeChange}
                    disabled={isPending}
                />

                {/* 6. Giá + thời lượng */}
                <InputPrice
                    price={formData.price}
                    discountPrice={formData.discountPrice}
                    durationHours={formData.durationHours}
                    lessonsCount={formData.lessonsCount}
                    isFree={isFree}
                    onChangePrice={(val) =>
                        handleChangeForm('price', val)
                    }
                    onChangeDiscountPrice={(val) =>
                        handleChangeForm('discountPrice', val)
                    }
                    onChangeDuration={(val) =>
                        handleChangeForm('durationHours', val)
                    }
                    onChangeLessonsCount={(val) =>
                        handleChangeForm('lessonsCount', val)
                    }
                    priceError={errors.price}
                    durationError={errors.durationHours}
                    lessonsCountError={errors.lessonsCount}
                    disabled={isPending}
                />

                {/* 7. Metadata */}
                <SelectMetadata
                    category={formData.category}
                    tags={formData.tags}
                    thumbnail={formData.thumbnail}
                    onChangeCategory={(val) =>
                        handleChangeForm('category', val)
                    }
                    onChangeTags={(val) =>
                        handleChangeForm('tags', val)
                    }
                    onChangeThumbnail={(val) =>
                        handleChangeForm('thumbnail', val)
                    }
                    categoryError={errors.category}
                    thumbnailError={errors.thumbnail}
                    disabled={isPending}
                />

                {/* 8. Status */}
                <InputStatus
                    value={formData.status}
                    onChange={(val) =>
                        handleChangeForm('status', val)
                    }
                    isFeatured={formData.isFeatured}
                    onChangeFeatured={(val) =>
                        handleChangeForm('isFeatured', val)
                    }
                    error={errors.status}
                    disabled={isPending}
                />

                {/* Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <Button
                        onClick={onClose}
                        disabled={isPending}
                    >
                        Cancel (Hủy bỏ)
                    </Button>

                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isPending}
                        className="bg-blue-600 hover:bg-blue-500 font-semibold px-6"
                    >
                        Create Course (Tạo mới)
                    </Button>
                </div>
            </form>
        </Modal>
    );
};