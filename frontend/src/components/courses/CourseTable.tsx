'use client';

import React from 'react';
import { Table, Tag, Button, Space, Tooltip, Avatar } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  StarFilled,
  ClockCircleOutlined,
  BookOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Course, CourseLevel, CourseStatus } from '@/types/course';
import Image from 'next/image';

interface CourseTableProps {
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

export const CourseTable: React.FC<CourseTableProps> = ({
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
  const columns: ColumnsType<Course> = [
    {
      title: 'Course',
      key: 'course',
      width: 320,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-200">
            {record.thumbnail ? (
              <img
                src={record.thumbnail}
                alt={record.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-200 text-slate-400">
                <BookOutlined className="text-xl" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-slate-900 text-sm line-clamp-1">
                {record.title}
              </span>
              {record.isFeatured && (
                <Tag color="gold" className="text-[10px] py-0 px-1.5 font-bold m-0">
                  FEATURED
                </Tag>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Tag className="text-xs m-0 border-slate-200 bg-slate-50 text-slate-600">
                {record.category}
              </Tag>
              <span className="text-xs text-slate-400">
                {record.lessonsCount} lessons
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Instructor',
      key: 'instructor',
      width: 180,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Avatar
            size="small"
            icon={<UserOutlined />}
            className="bg-blue-100 text-blue-600 font-semibold"
          >
            {record.instructor.charAt(0)}
          </Avatar>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-800 line-clamp-1">
              {record.instructor}
            </p>
            {record.instructorEmail && (
              <p className="text-[11px] text-slate-400 line-clamp-1">
                {record.instructorEmail}
              </p>
            )}
          </div>
        </div>
      )
    },
    {
      title: 'Level & Duration',
      key: 'level',
      width: 170,
      render: (_, record) => (
        <div className="space-y-1">
          <Tag color={LEVEL_COLORS[record.level]} className="text-xs font-medium m-0">
            {record.level.replace('_', ' ')}
          </Tag>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <ClockCircleOutlined className="text-[11px]" />
            <span>{record.durationHours}h total</span>
          </div>
        </div>
      )
    },
    {
      title: 'Price',
      key: 'price',
      width: 120,
      render: (_, record) => (
        <div>
          {record.discountPrice !== null && record.discountPrice !== undefined && record.discountPrice < record.price ? (
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 text-sm">
                ${record.discountPrice.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 line-through">
                ${record.price.toFixed(2)}
              </span>
            </div>
          ) : (
            <span className="font-bold text-slate-900 text-sm">
              {record.price === 0 ? 'Free' : `$${record.price.toFixed(2)}`}
            </span>
          )}
        </div>
      )
    },
    {
      title: 'Rating & Students',
      key: 'stats',
      width: 150,
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <StarFilled className="text-amber-500 text-xs" />
            <span className="font-semibold text-xs text-slate-800">
              {record.rating.toFixed(1)}
            </span>
            <span className="text-[11px] text-slate-400">
              ({record.ratingCount})
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {record.studentsCount.toLocaleString()} students
          </p>
        </div>
      )
    },
    {
      title: 'Status',
      key: 'status',
      width: 110,
      render: (_, record) => {
        const conf = STATUS_CONFIG[record.status] || { color: 'default', label: record.status };
        return <Tag color={conf.color}>{conf.label}</Tag>;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 140,
      align: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined className="text-slate-500 hover:text-blue-600" />}
              onClick={() => onView(record)}
            />
          </Tooltip>
          <Tooltip title="Edit Course">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined className="text-slate-500 hover:text-amber-600" />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete Course">
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
      <Table
        columns={columns}
        dataSource={courses}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20', '50'],
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} courses`,
          onChange: onPageChange,
          className: 'px-4 py-3'
        }}
        scroll={{ x: 1000 }}
      />
    </div>
  );
};
