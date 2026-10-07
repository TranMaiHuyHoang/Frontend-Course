'use client';

// Xuất bản component cha CourseForm theo kiến trúc thầy yêu cầu
export { CourseForm } from './CourseForm';
export type { CourseFormProps } from './CourseForm';

// Hỗ trợ alias CourseFormModal để tương thích ngược 100% với các file trong dự án
export { CourseForm as CourseFormModal } from './CourseForm';

// Xuất bản các component con
export { TitleCourse } from './TitleCourse';
export { InputTitle } from './InputTitle';
export { InputDescription } from './InputDescription';
export { InputInstructor } from './InputInstructor';
export { SelectLevel } from './SelectLevel';
export { SelectChargeType } from './SelectChargeType';
export { InputPrice } from './InputPrice';
export { SelectMetadata } from './SelectMetadata';
export { InputStatus } from './InputStatus';
export { InputCategory } from './InputCategory';
