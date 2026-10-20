import { Col, InputNumber, Row } from 'antd'
import React from 'react'

interface InputMetadataProps {
    price: number;
    discountPrice?: number | null;
    durationHours: number;
    lessonsCount: number;
    onChange: (key: string, value: any) => void;
}

const InputMetadata = ({
    price,
    discountPrice,
    durationHours,
    lessonsCount,
    onChange
}: InputMetadataProps) => {
    return (
        <Row gutter={16}>
            <Col xs={12} sm={6}>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Price ($) <span className="text-red-500">*</span>
                </label>
                <InputNumber
                    min={0}
                    step={0.99}
                    value={price}
                    onChange={(val) => onChange('price', val ?? 0)}
                    className="w-full"
                    placeholder="0.00"
                />
            </Col>

            <Col xs={12} sm={6}>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Discount Price ($)
                </label>
                <InputNumber
                    min={0}
                    step={0.99}
                    value={discountPrice ?? undefined}
                    onChange={(val) => onChange('discountPrice', val)}
                    className="w-full"
                    placeholder="Optional"
                />
            </Col>

            <Col xs={12} sm={6}>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Duration (Giờ) <span className="text-red-500">*</span>
                </label>
                <InputNumber
                    min={0.5}
                    step={0.5}
                    value={durationHours}
                    onChange={(val) => onChange('durationHours', val ?? 0)}
                    className="w-full"
                />
            </Col>

            <Col xs={12} sm={6}>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lessons (Bài học) <span className="text-red-500">*</span>
                </label>
                <InputNumber
                    min={1}
                    value={lessonsCount}
                    onChange={(val) => onChange('lessonsCount', val ?? 1)}
                    className="w-full"
                />
            </Col>
        </Row>
    )
}

export default InputMetadata

