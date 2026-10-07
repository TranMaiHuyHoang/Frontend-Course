'use client';

import React, { useState } from 'react';
import { Alert, Button } from 'antd';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CourseStatsOverview } from '@/components/courses/CourseStatsOverview';
import { CourseFilterBar } from '@/components/courses/CourseFilterBar';
import { CourseTable } from '@/components/courses/CourseTable';
import { CourseGrid } from '@/components/courses/CourseGrid';
import { CourseForm } from '@/components/CourseFormModal';
import { CourseDetailDrawer } from '@/components/courses/CourseDetailDrawer';
import { DeleteCourseModal } from '@/components/courses/DeleteCourseModal';
import { useCourses } from '@/hooks/useCourses';
import { Course, CourseFilterParams } from '@/types/course';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useClerkAuth } from '@/providers/ClerkAuthProvider';
import { AuthBanner } from '@/components/auth/AuthBanner';
import { AuthRequiredModal } from '@/components/auth/AuthRequiredModal';

export default function HomePage() {
  // Query Filters state
  const [filters, setFilters] = useState<CourseFilterParams>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    search: '',
    category: 'ALL',
    level: undefined,
    status: undefined
  });

  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Modals state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);

  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [courseToView, setCourseToView] = useState<Course | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  // Auth requirement modal
  const { isSignedIn } = useClerkAuth();
  const [authRequiredOpen, setAuthRequiredOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState('quản lý khóa học');

  // TanStack Query to fetch courses
  const { data, isLoading, error, refetch } = useCourses(filters);

  const courses = data?.data || [];
  const pagination = data?.pagination || {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  };

  const handleFilterChange = (updated: Partial<CourseFilterParams>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: viewMode === 'grid' ? 6 : 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      search: '',
      category: 'ALL',
      level: undefined,
      status: undefined
    });
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setFilters((prev) => ({ ...prev, page, limit: pageSize }));
  };

  const handleOpenCreateModal = () => {
    if (!isSignedIn) {
      setPendingAction('tạo khóa học mới');
      setAuthRequiredOpen(true);
      return;
    }
    setCourseToEdit(null);
    setFormModalOpen(true);
  };

  const handleOpenEditModal = (course: Course) => {
    if (!isSignedIn) {
      setPendingAction('chỉnh sửa thông tin khóa học');
      setAuthRequiredOpen(true);
      return;
    }
    setCourseToEdit(course);
    setFormModalOpen(true);
  };

  const handleOpenDetailDrawer = (course: Course) => {
    setCourseToView(course);
    setDetailDrawerOpen(true);
  };

  const handleOpenDeleteModal = (course: Course) => {
    if (!isSignedIn) {
      setPendingAction('xóa khóa học này');
      setAuthRequiredOpen(true);
      return;
    }
    setCourseToDelete(course);
    setDeleteModalOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      {/* Navbar */}
      <Navbar onAddNewCourse={handleOpenCreateModal} />

      {/* Main Container */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Heading banner */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Course Management Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500 font-medium">
              Create, curate, update, and manage your online learning curriculum in real time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenCreateModal}
              className="bg-blue-600 hover:bg-blue-500 font-semibold"
            >
              Add New Course
            </Button>
          </div>
        </div>

        {/* Authentication Flow Banner */}
        <AuthBanner />

        {/* Backend offline warning banner if network error */}
        {error && (
          <div className="mb-6">
            <Alert
              message="Cannot connect to Backend API"
              description="Make sure the backend server is running at http://localhost:5000 (with PostgreSQL active). You can run 'docker compose up -d' to start PostgreSQL, then run 'npm run dev' inside backend/."
              type="warning"
              showIcon
              action={
                <Button size="small" icon={<ReloadOutlined />} onClick={() => refetch()}>
                  Retry Connection
                </Button>
              }
            />
          </div>
        )}

        {/* Overview Stats */}
        <CourseStatsOverview />

        {/* Search and Filters Bar */}
        <CourseFilterBar
          filters={filters}
          onChangeFilters={handleFilterChange}
          onResetFilters={handleResetFilters}
          onRefresh={() => refetch()}
          viewMode={viewMode}
          onChangeViewMode={(mode) => {
            setViewMode(mode);
            setFilters((prev) => ({
              ...prev,
              page: 1,
              limit: mode === 'grid' ? 6 : 10
            }));
          }}
        />

        {/* Courses Display (Table or Grid View) */}
        {viewMode === 'table' ? (
          <CourseTable
            courses={courses}
            isLoading={isLoading}
            total={pagination.total}
            currentPage={pagination.page}
            pageSize={pagination.limit}
            onPageChange={handlePageChange}
            onView={handleOpenDetailDrawer}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteModal}
          />
        ) : (
          <CourseGrid
            courses={courses}
            isLoading={isLoading}
            total={pagination.total}
            currentPage={pagination.page}
            pageSize={pagination.limit}
            onPageChange={handlePageChange}
            onView={handleOpenDetailDrawer}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteModal}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Course Create / Edit Form (Dùng chung CourseForm) */}
      <CourseForm
        isOpen={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setCourseToEdit(null);
        }}
        courseToEdit={courseToEdit}
      />

      {/* Course Detail Drawer */}
      <CourseDetailDrawer
        isOpen={detailDrawerOpen}
        onClose={() => {
          setDetailDrawerOpen(false);
          setCourseToView(null);
        }}
        course={courseToView}
        onEdit={handleOpenEditModal}
      />

      {/* Delete Confirmation Modal */}
      <DeleteCourseModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setCourseToDelete(null);
        }}
        course={courseToDelete}
      />

      {/* Auth Required Modal (shown when unauthenticated user tries to edit/create/delete) */}
      <AuthRequiredModal
        isOpen={authRequiredOpen}
        onClose={() => setAuthRequiredOpen(false)}
        actionName={pendingAction}
      />
    </div>
  );
}
