import React from 'react';
import { Radio } from 'antd';

interface SelectChargeTypeProps {
    isFree: boolean;
    onChange: (isFree: boolean) => void;
    disabled?: boolean;
}

export const SelectChargeType: React.FC<SelectChargeTypeProps> = ({
    isFree,
    onChange,
    disabled = false
}) => {
    return (
        <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
                Charge Type (Hình thức thu phí) <span className="text-red-500">*</span>
            </label>
            <Radio.Group
                value={isFree ? 'FREE' : 'PAID'}
                onChange={(e) => onChange(e.target.value === 'FREE')}
                disabled={disabled}
                className="w-full flex gap-4 pt-1 pb-1"
            >
                <Radio value="FREE" className="text-xs font-medium text-slate-700">
                    🟢 Miễn phí (Free - $0)
                </Radio>
                <Radio value="PAID" className="text-xs font-medium text-slate-700">
                    💳 Có phí (Paid)
                </Radio>
            </Radio.Group>
        </div>
    );
};
