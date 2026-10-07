'use client';

import React from 'react';
import { Input, Select, Button, Space, Radio, Segmented } from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  ClearOutlined,
  UnorderedListOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import { CourseFilterParams, CourseLevel, CourseStatus } from '@/types/course';

interface CourseFilterBarProps {
  filters: CourseFilterParams;
  onChangeFilters: (updated: Partial<CourseFilterParams>) => void;
  onResetFilters: () => void;
  onRefresh: () => void;
  viewMode: 'table' | 'grid';
  onChangeViewMode: (mode: 'table' | 'grid') => void;
  categories?: string[];
}

const CATEGORY_OPTIONS = [
  { label: 'All Categories', value: 'ALL' },
  { label: 'Frontend', value: 'Frontend' },
  { label: 'Backend', value: 'Backend' },
  { label: 'Fullstack', value: 'Fullstack' },
  { label: 'Database', value: 'Database' },
  { label: 'AI & ML', value: 'AI & ML' },
  { label: 'DevOps', value: 'DevOps' }
];

const LEVEL_OPTIONS = [
  { label: 'All Levels', value: '' },
  { label: 'Beginner', value: 'BEGINNER' },
  { label: 'Intermediate', value: 'INTERMEDIATE' },
  { label: 'Advanced', value: 'ADVANCED' },
  { label: 'All Levels', value: 'ALL_LEVELS' }
];

const STATUS_OPTIONS = [
  { label: 'All Statuses', value: '' },
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Archived', value: 'ARCHIVED' }
];

export const CourseFilterBar: React.FC<CourseFilterBarProps> = ({
  filters,
  onChangeFilters,
  onResetFilters,
  onRefresh,
  viewMode,
  onChangeViewMode
}) => {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search input */}
        <div className="flex-1 min-w-[240px]">
          <Input
            placeholder="Search by title, instructor, tag, or description..."
            prefix={<SearchOutlined className="text-slate-400 mr-1" />}
            value={filters.search || ''}
            onChange={(e) => onChangeFilters({ search: e.target.value, page: 1 })}
            allowClear
            className="w-full rounded-lg"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Select
            placeholder="Category"
            value={filters.category || 'ALL'}
            onChange={(val) => onChangeFilters({ category: val, page: 1 })}
            options={CATEGORY_OPTIONS}
            className="w-36"
          />

          <Select
            placeholder="Level"
            value={filters.level || ''}
            onChange={(val) => onChangeFilters({ level: (val || undefined) as CourseLevel | undefined, page: 1 })}
            options={LEVEL_OPTIONS}
            className="w-32"
          />

          <Select
            placeholder="Status"
            value={filters.status || ''}
            onChange={(val) => onChangeFilters({ status: (val || undefined) as CourseStatus | undefined, page: 1 })}
            options={STATUS_OPTIONS}
            className="w-32"
          />

          <Button
            icon={<ClearOutlined />}
            onClick={onResetFilters}
            className="text-slate-600 border-slate-200 hover:text-slate-800"
          >
            Reset
          </Button>

          <Button
            icon={<ReloadOutlined />}
            onClick={onRefresh}
            title="Refresh list"
            className="text-slate-600 border-slate-200"
          />

          {/* View Mode Toggle */}
          <div className="ml-auto lg:ml-2">
            <Segmented
              value={viewMode}
              onChange={(value) => onChangeViewMode(value as 'table' | 'grid')}
              options={[
                {
                  value: 'table',
                  icon: <UnorderedListOutlined />
                },
                {
                  value: 'grid',
                  icon: <AppstoreOutlined />
                }
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
