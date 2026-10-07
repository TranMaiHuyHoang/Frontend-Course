'use client';

import React from 'react';
import { Modal, Typography, Button } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Course } from '@/types/course';
import { useDeleteCourse } from '@/hooks/useCourses';

const { Text } = Typography;

interface DeleteCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
}

export const DeleteCourseModal: React.FC<DeleteCourseModalProps> = ({
  isOpen,
  onClose,
  course
}) => {
  const deleteMutation = useDeleteCourse();

  if (!course) return null;

  const handleConfirmDelete = async () => {
    try {
      await deleteMutation.mutateAsync(course.id);
      onClose();
    } catch (error) {
      // Handled in mutation hook
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose} disabled={deleteMutation.isPending}>
          Cancel
        </Button>,
        <Button
          key="delete"
          danger
          type="primary"
          loading={deleteMutation.isPending}
          onClick={handleConfirmDelete}
        >
          Delete Course
        </Button>
      ]}
      width={460}
      centered
    >
      <div className="flex items-start gap-3.5 pt-2">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
          <ExclamationCircleFilled className="text-xl" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Delete Course
          </h3>
          <p className="mt-1 text-xs text-slate-600 leading-relaxed">
            Are you sure you want to permanently delete{' '}
            <Text strong className="text-slate-800">
              &quot;{course.title}&quot;
            </Text>
            ? This action cannot be undone.
          </p>
        </div>
      </div>
    </Modal>
  );
};
