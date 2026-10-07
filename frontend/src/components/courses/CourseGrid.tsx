'use client';

import React from 'react';
import { Card, Tag, Button, Empty, Pagination, Skeleton } from 'antd';
import {
  StarFilled,
  ClockCircleOutlined,
  BookOutlined,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { Course, CourseLevel, CourseStatus } from '@/types/course';

interface CourseGridProps {
  courses: Course[];
  isLoading: boolean;
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
  onView: (course: Course) => void;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
}

const LEVEL_COLORS: Record<CourseLevel, string> = {
  BEGINNER: 'green',
  INTERMEDIATE: 'blue',
  ADVANCED: 'purple',
  ALL_LEVELS: 'cyan'
};

const STATUS_CONFIG: Record<CourseStatus, { color: string; label: string }> = {
  PUBLISHED: { color: 'success', label: 'Published' },
  DRAFT: { color: 'warning', label: 'Draft' },
  ARCHIVED: { color: 'default', label: 'Archived' }
};

export const CourseGrid: React.FC<CourseGridProps> = ({
  courses,
  isLoading,
  total,
  currentPage,
  pageSize,
  onPageChange,
  onView,
  onEdit,
  onDelete
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="rounded-xl border-slate-200">
            <Skeleton.Image className="!w-full !h-44 rounded-lg mb-4" />
            <Skeleton active paragraph={{ rows: 3 }} />
          </Card>
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
        <Empty description="No courses match your filter criteria" />
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {courses.map((course) => {
          const status = STATUS_CONFIG[course.status] || { color: 'default', label: course.status };

          return (
            <div
              key={course.id}
              className="group flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm transition-all duration-200 hover:shadow-lg hover:border-slate-300"
            >
              <div>
                {/* Course Thumbnail */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-200 text-slate-400">
                      <BookOutlined className="text-3xl" />
                    </div>
                  )}

                  {/* Top badges */}
                  <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                    <Tag color={status.color} className="font-semibold shadow-sm">
                      {status.label}
                    </Tag>
                    {course.isFeatured && (
                      <Tag color="gold" className="font-bold shadow-sm">
                        FEATURED
                      </Tag>
                    )}
                  </div>

                  <div className="absolute top-3 right-3">
                    <Tag color={LEVEL_COLORS[course.level]} className="font-semibold backdrop-blur-md">
                      {course.level.replace('_', ' ')}
                    </Tag>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {course.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <ClockCircleOutlined className="text-xs" />
                      <span>{course.durationHours}h • {course.lessonsCount} lessons</span>
                    </div>
                  </div>

                  <h3
                    onClick={() => onView(course)}
                    className="cursor-pointer font-bold text-slate-900 text-base line-clamp-2 hover:text-blue-600 transition-colors mb-2"
                  >
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Instructor & Rating */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <UserOutlined className="text-slate-400" />
                      <span>{course.instructor}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <StarFilled className="text-amber-500 text-xs" />
                      <span className="font-semibold text-slate-900">{course.rating.toFixed(1)}</span>
                      <span className="text-slate-400">({course.ratingCount})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Price & Actions */}
              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-5 py-3">
                <div>
                  {course.discountPrice !== null && course.discountPrice !== undefined && course.discountPrice < course.price ? (
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-bold text-slate-900">
                        ${course.discountPrice.toFixed(2)}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        ${course.price.toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-base font-bold text-slate-900">
                      {course.price === 0 ? 'Free' : `$${course.price.toFixed(2)}`}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    type="text"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => onView(course)}
                    className="text-slate-600 hover:text-blue-600"
                  />
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => onEdit(course)}
                    className="text-slate-600 hover:text-amber-600"
                  />
                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => onDelete(course)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex justify-center sm:justify-end">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          showSizeChanger
          pageSizeOptions={['6', '12', '24']}
          onChange={onPageChange}
          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} courses`}
        />
      </div>
    </div>
  );
};
