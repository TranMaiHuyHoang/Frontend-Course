'use client';

import React from 'react';
import { Drawer, Tag, Divider, Button, Avatar, Space } from 'antd';
import {
  StarFilled,
  ClockCircleOutlined,
  BookOutlined,
  UserOutlined,
  MailOutlined,
  CalendarOutlined,
  CheckOutlined,
  EditOutlined,
  TagOutlined
} from '@ant-design/icons';
import { Course, CourseLevel, CourseStatus } from '@/types/course';

interface CourseDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  onEdit: (course: Course) => void;
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

export const CourseDetailDrawer: React.FC<CourseDetailDrawerProps> = ({
  isOpen,
  onClose,
  course,
  onEdit
}) => {
  if (!course) return null;

  const status = STATUS_CONFIG[course.status] || { color: 'default', label: course.status };

  return (
    <Drawer
      title="Course Details"
      placement="right"
      onClose={onClose}
      open={isOpen}
      width={580}
      extra={
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => {
            onClose();
            onEdit(course);
          }}
          className="bg-blue-600 hover:bg-blue-500"
        >
          Edit Course
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Thumbnail banner */}
        <div className="relative h-52 w-full overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-200 text-slate-400">
              <BookOutlined className="text-4xl" />
            </div>
          )}
          <div className="absolute top-3 left-3 flex gap-1.5">
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
            <Tag color={LEVEL_COLORS[course.level]} className="font-semibold">
              {course.level.replace('_', ' ')}
            </Tag>
          </div>
        </div>

        {/* Title and category */}
        <div>
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            {course.category}
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1 leading-snug">
            {course.title}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">
            Slug: /{course.slug}
          </p>
        </div>

        {/* Pricing & Key Metrics */}
        <div className="grid grid-cols-3 gap-3 rounded-xl bg-slate-50 p-4 border border-slate-100 text-center">
          <div>
            <p className="text-xs text-slate-500">Price</p>
            <p className="text-lg font-bold text-slate-900 mt-0.5">
              {course.discountPrice !== null && course.discountPrice !== undefined && course.discountPrice < course.price ? (
                <>
                  <span>${course.discountPrice.toFixed(2)}</span>{' '}
                  <span className="text-xs text-slate-400 line-through">
                    ${course.price.toFixed(2)}
                  </span>
                </>
              ) : course.price === 0 ? (
                'Free'
              ) : (
                `$${course.price.toFixed(2)}`
              )}
            </p>
          </div>
          <div className="border-x border-slate-200">
            <p className="text-xs text-slate-500">Duration</p>
            <p className="text-lg font-bold text-slate-900 mt-0.5">
              {course.durationHours}h
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Lessons</p>
            <p className="text-lg font-bold text-slate-900 mt-0.5">
              {course.lessonsCount}
            </p>
          </div>
        </div>

        {/* Rating and Students */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-1.5">
            <StarFilled className="text-amber-500 text-base" />
            <span className="font-bold text-slate-900 text-sm">{course.rating.toFixed(1)}</span>
            <span className="text-xs text-slate-400">({course.ratingCount} reviews)</span>
          </div>
          <span className="text-xs text-slate-600 font-medium">
            👥 {course.studentsCount.toLocaleString()} enrolled learners
          </span>
        </div>

        <Divider className="my-2" />

        {/* Description */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Description
          </h4>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {course.description}
          </p>
        </div>

        {/* Learning Objectives */}
        {course.objectives && course.objectives.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              What you will learn
            </h4>
            <div className="space-y-1.5">
              {course.objectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                  <CheckOutlined className="text-emerald-500 mt-0.5" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Requirements */}
        {course.requirements && course.requirements.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Prerequisites
            </h4>
            <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
              {course.requirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags */}
        {course.tags && course.tags.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Tags & Keywords
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {course.tags.map((tag, i) => (
                <Tag key={i} color="processing" icon={<TagOutlined className="mr-1" />}>
                  {tag}
                </Tag>
              ))}
            </div>
          </div>
        )}

        <Divider className="my-2" />

        {/* Instructor */}
        <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 border border-slate-100">
          <Avatar
            size="large"
            icon={<UserOutlined />}
            className="bg-blue-600 text-white font-bold"
          >
            {course.instructor.charAt(0)}
          </Avatar>
          <div>
            <p className="text-xs text-slate-400 font-medium">Instructor</p>
            <p className="text-sm font-bold text-slate-900">{course.instructor}</p>
            {course.instructorEmail && (
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MailOutlined /> {course.instructorEmail}
              </p>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className="text-[11px] text-slate-400 flex justify-between pt-2 border-t border-slate-100">
          <span>Created: {new Date(course.createdAt).toLocaleDateString()}</span>
          <span>Updated: {new Date(course.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>
    </Drawer>
  );
};
