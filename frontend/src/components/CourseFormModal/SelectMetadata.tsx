import React from 'react';
import { Row, Col, Select, Input } from 'antd';
import { CATEGORY_SELECT_OPTIONS } from './InputCategory';

interface SelectMetadataProps {
    category: string;
    tags: string[];
    thumbnail?: string | null;
    onChangeCategory: (value: string) => void;
    onChangeTags: (tags: string[]) => void;
    onChangeThumbnail: (value: string) => void;
    categoryError?: string;
    thumbnailError?: string;
    disabled?: boolean;
}

export const SelectMetadata: React.FC<SelectMetadataProps> = ({
    category,
    tags,
    thumbnail,
    onChangeCategory,
    onChangeTags,
    onChangeThumbnail,
    categoryError,
    thumbnailError,
    disabled = false
}) => {
    return (
        <div className="space-y-4">
            {/* Lĩnh vực & Kỹ năng / Ngôn ngữ */}
            <Row gutter={16}>
                <Col xs={24} sm={10}>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Category (Lĩnh vực) <span className="text-red-500">*</span>
                    </label>
                    <Select
                        value={category}
                        onChange={(val) => onChangeCategory(val)}
                        options={CATEGORY_SELECT_OPTIONS}
                        className="w-full"
                        showSearch
                        placeholder="Chọn lĩnh vực khóa học"
                        status={categoryError ? 'error' : ''}
                        disabled={disabled}
                    />
                    {categoryError && (
                        <span className="text-xs text-red-500 mt-1 block">
                            {categoryError}
                        </span>
                    )}
                </Col>

                <Col xs={24} sm={14}>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Skills & Languages (Kỹ năng, Ngôn ngữ)
                    </label>
                    <Select
                        mode="tags"
                        value={tags}
                        onChange={(val) => onChangeTags(val)}
                        placeholder="e.g. React, TypeScript, Python, English"
                        className="w-full"
                        tokenSeparators={[',']}
                        disabled={disabled}
                    />
                </Col>
            </Row>

            {/* Thumbnail Image URL */}
            <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Thumbnail Image URL (Ảnh đại diện khóa học)
                </label>
                <Input
                    value={thumbnail || ''}
                    onChange={(e) => onChangeThumbnail(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    status={thumbnailError ? 'error' : ''}
                    disabled={disabled}
                />
                {thumbnailError && (
                    <span className="text-xs text-red-500 mt-1 block">
                        {thumbnailError}
                    </span>
                )}
            </div>
        </div>
    );
};
