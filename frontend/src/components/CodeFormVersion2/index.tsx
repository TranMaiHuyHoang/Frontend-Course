'use client';

import React, { useState } from 'react';
import { Modal, Input, Button, Row, Col } from 'antd';
import InputTitle from './InputTitle';
import InputDescription from './InputDescription';
import InputInforInstructor from './InputInforInstructor';
import InputLevel from './InputLevel';
import InputChargeType from './InputChargeType';
import InputMetadata from './InputMetadata';
import InputCategory from './InputCategory';
import InputSkill from './InputSkill';
import InputStatus from './InputStatus';
import InputHighlight from './InputHighlight';
import InputThumbnail from './InputThumbnail';
import CourseTitle from './CourseTitle';

export interface CodeFormVersion2Props {
    isOpen?: boolean;
    onClose?: () => void;
}

type CourseFormValues = {
    title: string;
    slug: string;
    description: string;
    instructor: string;
    instructorEmail: string;
    category: string;
    level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    price: number;
    discountPrice?: number | null;
    durationHours: number;
    lessonsCount: number;
    thumbnail: string;
    isFeatured: boolean;
    tags: string[];
    requirements: string[];
    objectives: string[];
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


export const CodeFormVersion2: React.FC<CodeFormVersion2Props> = ({
    isOpen = true,
    onClose
}) => {
    const [formData, setFormData] = useState<CourseFormValues>(DEFAULT_FORM_VALUES);

    console.log('formData', formData);

    const handleChangeForm = (key: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value
        }));
    }

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            width={840}
            footer={null}
            destroyOnClose
            centered
            className="top-6"
            title={<CourseTitle />}
        >
            <form className="space-y-4 pt-3" onSubmit={(e) => e.preventDefault()}>
                <InputTitle
                    value={formData.title}
                    onChange={(value) => handleChangeForm('title', value)}
                />

                <InputDescription
                    value={formData.description}
                    onChange={(value) => handleChangeForm('description', value)}
                />

                <InputInforInstructor
                    instructorName={formData.instructor}
                    instructorEmail={formData.instructorEmail}
                    onChange={handleChangeForm} />


                <Row gutter={16}>
                    <InputLevel
                        value={formData.level}
                        onChange={(value) => handleChangeForm('level', value)} />
                    <InputChargeType />
                </Row>

                <InputMetadata />

                <Row gutter={16}>
                    <InputCategory
                        value={formData.category}
                        onChange={(value) => handleChangeForm('category', value)}
                    />
                    <InputSkill
                        value={formData.tags}
                        onChange={(value) => handleChangeForm('tags', value)} />
                </Row>

                <InputThumbnail
                    value={formData.thumbnail}
                    onChange={(value) => handleChangeForm('thumbnail', value)}
                />

                <div className="space-y-3">
                    <InputStatus
                        value={formData.status}
                        onChange={(value) => handleChangeForm("status", value)} />

                    <InputHighlight
                        checked={formData.isFeatured}
                        onChange={(checked) => handleChangeForm('isFeatured', checked)}
                    />
                </div>

                {/* 9. Buttons hành động (Footer) */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <Button onClick={onClose}>
                        Cancel (Hủy bỏ)
                    </Button>

                    <Button
                        type="primary"
                        htmlType="button"
                        className="bg-blue-600 hover:bg-blue-500 font-semibold px-6"
                    >
                        Create Course (Tạo mới)
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default CodeFormVersion2;
