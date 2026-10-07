'use client';

import React from 'react';
import { Card, Skeleton } from 'antd';
import {
  ReadOutlined,
  CheckCircleOutlined,
  UsergroupAddOutlined,
  StarFilled,
  RiseOutlined
} from '@ant-design/icons';
import { useCourseStats } from '@/hooks/useCourses';

export const CourseStatsOverview: React.FC = () => {
  const { data: statsData, isLoading } = useCourseStats();
  const stats = statsData?.data;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="shadow-sm border-slate-200">
            <Skeleton active paragraph={{ rows: 1 }} />
          </Card>
        ))}
      </div>
    );
  }

  const items = [
    {
      title: 'Total Courses',
      value: stats?.totalCourses ?? 0,
      subText: `${stats?.draftCourses ?? 0} in draft`,
      icon: <ReadOutlined className="text-xl text-blue-600" />,
      bgIcon: 'bg-blue-50',
      badgeColor: 'text-blue-600'
    },
    {
      title: 'Published Courses',
      value: stats?.publishedCourses ?? 0,
      subText: `${stats?.archivedCourses ?? 0} archived`,
      icon: <CheckCircleOutlined className="text-xl text-emerald-600" />,
      bgIcon: 'bg-emerald-50',
      badgeColor: 'text-emerald-600'
    },
    {
      title: 'Total Students',
      value: (stats?.totalStudents ?? 0).toLocaleString(),
      subText: 'Active learners',
      icon: <UsergroupAddOutlined className="text-xl text-violet-600" />,
      bgIcon: 'bg-violet-50',
      badgeColor: 'text-violet-600'
    },
    {
      title: 'Average Rating',
      value: stats?.averageRating ? `${stats.averageRating} / 5.0` : '5.0 / 5.0',
      subText: `Avg Price: $${stats?.averagePrice?.toFixed(2) ?? '0.00'}`,
      icon: <StarFilled className="text-xl text-amber-500" />,
      bgIcon: 'bg-amber-50',
      badgeColor: 'text-amber-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-slate-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {item.title}
              </p>
              <h3 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900">
                {item.value}
              </h3>
              <p className="mt-1 text-xs text-slate-500 font-medium">
                {item.subText}
              </p>
            </div>
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.bgIcon}`}>
              {item.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
