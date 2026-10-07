import React from 'react';
import { Row, Col, Input } from 'antd';

interface InputInstructorProps {
    instructor: string;
    instructorEmail?: string | null;
    onChangeInstructor: (value: string) => void;
    onChangeEmail: (value: string) => void;
    instructorError?: string;
    emailError?: string;
}

export const InputInstructor: React.FC<InputInstructorProps> = ({
    instructor,
    instructorEmail,
    onChangeInstructor,
    onChangeEmail,
    instructorError,
    emailError
}) => {
    return (
        <Row gutter={16}>
            <Col xs={24} sm={12}>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Instructor Name <span className="text-red-500">*</span>
                </label>
                <Input
                    value={instructor}
                    onChange={(e) => onChangeInstructor(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    status={instructorError ? 'error' : ''}
                />
                {instructorError && (
                    <span className="text-xs text-red-500 mt-1 block">
                        {instructorError}
                    </span>
                )}
            </Col>
            <Col xs={24} sm={12}>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Instructor Email (Optional)
                </label>
                <Input
                    value={instructorEmail || ''}
                    onChange={(e) => onChangeEmail(e.target.value)}
                    placeholder="e.g. instructor@edupro.dev"
                    status={emailError ? 'error' : ''}
                />
                {emailError && (
                    <span className="text-xs text-red-500 mt-1 block">
                        {emailError}
                    </span>
                )}
            </Col>
        </Row>
    );
};
