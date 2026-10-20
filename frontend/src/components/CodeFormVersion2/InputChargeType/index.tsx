import { Col, Radio } from 'antd'
import React from 'react'

const InputChargeType = () => {
    return (
        <Col xs={24} sm={12}>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
                Charge Type (Hình thức thu phí) <span className="text-red-500">*</span>
            </label>
            <Radio.Group
                defaultValue="FREE"
                className="w-full flex gap-4 pt-1 pb-1"
            >
                <Radio value="FREE" className="text-xs font-medium text-slate-700">
                    🟢 Miễn phí (Free - $0)
                </Radio>
                <Radio value="PAID" className="text-xs font-medium text-slate-700">
                    💳 Có phí (Paid)
                </Radio>
            </Radio.Group>
        </Col>
    )
}

export default InputChargeType

