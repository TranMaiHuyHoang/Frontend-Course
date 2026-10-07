import React from 'react';
import { Row, Col, InputNumber } from 'antd';

interface InputPriceProps {
    price: number;
    discountPrice?: number | null;
    durationHours: number;
    lessonsCount: number;
    isFree: boolean;
    onChangePrice: (value: number) => void;
    onChangeDiscountPrice: (value: number | null) => void;
    onChangeDuration: (value: number) => void;
    onChangeLessonsCount: (value: number) => void;
    priceError?: string;
    durationError?: string;
    lessonsCountError?: string;
    disabled?: boolean;
}

export const InputPrice: React.FC<InputPriceProps> = ({
    price,
    discountPrice,
    durationHours,
    lessonsCount,
    isFree,
    onChangePrice,
    onChangeDiscountPrice,
    onChangeDuration,
    onChangeLessonsCount,
    priceError,
    durationError,
    lessonsCountError,
    disabled = false
}) => {
    return (
        <Row gutter={16}>
            <Col xs={12} sm={6}>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Price ($) <span className="text-red-500">*</span>
                </label>
                <InputNumber
                    value={isFree ? 0 : price}
                    onChange={(val) => onChangePrice(val ?? 0)}
                    min={0}
                    step={0.99}
                    className="w-full"
                    disabled={disabled || isFree}
                    status={priceError ? 'error' : ''}
                    placeholder={isFree ? '0.00 (Free)' : '49.99'}
                />
                {priceError && (
                    <span className="text-xs text-red-500 mt-1 block">
                        {priceError}
                    </span>
                )}
            </Col>

            <Col xs={12} sm={6}>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Discount Price ($)
                </label>
                <InputNumber
                    value={isFree ? undefined : (discountPrice ?? undefined)}
                    onChange={(val) => onChangeDiscountPrice(val ?? null)}
                    min={0}
                    step={0.99}
                    placeholder="Optional"
                    className="w-full"
                    disabled={disabled || isFree}
                />
            </Col>

            <Col xs={12} sm={6}>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Duration (Hours) <span className="text-red-500">*</span>
                </label>
                <InputNumber
                    value={durationHours}
                    onChange={(val) => onChangeDuration(val ?? 0)}
                    min={0.5}
                    step={0.5}
                    className="w-full"
                    disabled={disabled}
                    status={durationError ? 'error' : ''}
                />
                {durationError && (
                    <span className="text-xs text-red-500 mt-1 block">
                        {durationError}
                    </span>
                )}
            </Col>

            <Col xs={12} sm={6}>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lessons Count <span className="text-red-500">*</span>
                </label>
                <InputNumber
                    value={lessonsCount}
                    onChange={(val) => onChangeLessonsCount(val ?? 1)}
                    min={1}
                    className="w-full"
                    disabled={disabled}
                    status={lessonsCountError ? 'error' : ''}
                />
                {lessonsCountError && (
                    <span className="text-xs text-red-500 mt-1 block">
                        {lessonsCountError}
                    </span>
                )}
            </Col>
        </Row>
    );
};
