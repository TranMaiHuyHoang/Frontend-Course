# Course Form Refactor - Learning Guide

> **Dành cho:** Người mới học lập trình (Junior / Beginner)  
> **Mục tiêu:** Hiểu sâu bản chất kiến trúc React Component, luồng dữ liệu một chiều (Unidirectional Data Flow), kỹ thuật tách component form dùng chung cho Create & Edit theo chuẩn workflow của thầy.

---

## 1. Mục tiêu bài này

* **Ban đầu có vấn đề gì?**  
  File cũ `src/components/courses/CourseFormModal.tsx` là một khối nguyên khối (monolithic) khổng lồ dài hơn 430 dòng. Nó nhồi nhét tất cả mọi thứ: từ nhãn `label`, từng ô `<Input>`, dropdown `<Select>`, chuyển đổi tính giá, validation, cho đến logic gọi API. Code dài khiến người mới học rất khó theo dõi, khó sửa lỗi và khó tái sử dụng.
* **Tại sao cần refactor?**  
  Refactor giúp chia nhỏ form thành các component con có trách nhiệm độc lập (Single Responsibility), giúp code dễ đọc, dễ test và dễ bảo trì.
* **Thầy yêu cầu gì?**  
  > *"Giữ các component con hiện tại. Đổi tên component cha CreateCourse thành CourseForm để dùng chung cho thêm và sửa."*  
  Mô hình cây component thầy hướng dẫn:
  ```text
  CourseForm                 → Giữ dữ liệu, kiểm tra và gọi API lưu
  ├── TitleCourse            → Tiêu đề thêm / sửa
  ├── InputTitle             → Tên môn học
  ├── InputDescription       → Mô tả
  ├── SelectLevel            → Cấp độ
  ├── SelectChargeType       → Miễn phí / có phí
  ├── InputPrice             → Giá
  ├── SelectMetadata         → Lĩnh vực, ngôn ngữ, kỹ năng
  ├── InputInstructor        → Giảng viên (giữ trường dữ liệu thực tế)
  └── InputStatus            → Tùy chọn trạng thái
  ```
* **Kết quả cuối cùng:**  
  Một component cha `CourseForm` duy nhất điều phối toàn bộ luồng tạo mới (Create) và chỉnh sửa (Edit), giữ một state `formData` tập trung. Các component con chỉ nhận props hiển thị và phát tín hiệu qua callback `onChange`.

---

## 2. Before → After

### 🛑 BEFORE (Code cũ)
```text
src/components/courses/CourseFormModal.tsx (432 dòng)
├── state formData (title, desc, price, level, category...)
├── JSX inline Title
├── JSX inline Description
├── JSX inline Instructor & Email
├── JSX inline Category, Level, Status
├── JSX inline Price, Discount, Duration, Lessons
├── JSX inline Thumbnail, Tags, Switch Featured
├── Zod validation inline
└── Submit / Mutations
```

### ✅ AFTER (Code mới chuẩn kiến trúc)
```text
src/components/CourseFormModal/
├── CourseForm.tsx           ──► COMPONENT CHA (Nhạc trưởng: state, validate, submit Create/Edit)
├── TitleCourse.tsx          ──► Tiêu đề form động (Create / Edit)
├── InputTitle.tsx           ──► Ô nhập Tên khóa học
├── InputDescription.tsx     ──► Khung nhập Mô tả (TextArea)
├── InputInstructor.tsx      ──► Cụm Tên & Email Giảng viên
├── SelectLevel.tsx          ──► Dropdown Cấp độ kỹ năng (Beginner, Intermediate...)
├── SelectChargeType.tsx     ──► Tùy chọn thu phí: Miễn phí ($0) vs Có phí
├── InputPrice.tsx           ──► Giá tiền, Giảm giá, Thời lượng & Số bài học
├── SelectMetadata.tsx       ──► Lĩnh vực, Ngôn ngữ, Kỹ năng & Ảnh Thumbnail
├── InputStatus.tsx          ──► Trạng thái xuất bản & Khóa học nổi bật
├── InputCategory.tsx        ──► Component chọn Danh mục (được tái sử dụng trong Metadata)
└── index.tsx                ──► File xuất bản (Barrel export & alias CourseFormModal)
```

---

## 3. Component cha: `CourseForm`

* **FULL PATH:** `/Users/admin/Desktop/Frontend-Course/frontend/src/components/CourseFormModal/CourseForm.tsx`
* **NHIỆM VỤ:**  
  Là "bộ não" trung tâm của toàn bộ biểu mẫu.
* **Nó nắm giữ những gì?**
  1. **Một `formData` duy nhất:** Nắm giữ toàn bộ giá trị của 14 trường dữ liệu khóa học.
  2. **`errors`:** Lưu trữ thông báo lỗi sau khi validate.
  3. **`isEditing` mode:** Tự động phát hiện đang ở chế độ Create hay Edit dựa vào prop `courseToEdit`.
  4. **`handleChangeForm`:** Hàm điều phối cập nhật state tập trung.
  5. **`handleSubmit`:** Chạy Zod validation ➔ Gọi API Create (`createMutation`) hoặc Edit (`updateMutation`).
  6. **`isPending` / loading:** Quản lý trạng thái đang gửi request để vô hiệu hóa nút bấm và input.

---

## 4. `formData` là gì?

`formData` là một **đối tượng JavaScript (Object)** đóng vai trò là "nguồn chân lý duy nhất" (Single Source of Truth) đại diện cho toàn bộ dữ liệu người dùng đang nhập vào form:

```typescript
const [formData, setFormData] = useState<CourseFormValues>({
    title: '',
    description: '',
    instructor: '',
    category: 'Frontend',
    level: 'BEGINNER',
    status: 'DRAFT',
    price: 0,
    durationHours: 10,
    tags: ['React', 'TypeScript'],
    // ...
});
```

### Tại sao `formData` phải nằm ở Component Cha?
Vì khi người dùng bấm nút **Submit ("Create Course")** ở cuối trang, ứng dụng cần đóng gói **toàn bộ dữ liệu** thành một cục JSON gửi sang Backend. Nếu mỗi ô input con tự giữ một state riêng thì Component Cha sẽ **không thể gom đủ dữ liệu** để gửi đi.

---

## 5. `handleChangeForm` hoạt động thế nào?

Đây là hàm điều phối trung tâm tại Component Cha:

```typescript
const handleChangeForm = <K extends keyof CourseFormValues>(
    field: K,
    value: CourseFormValues[K]
) => {
    // 1. Cập nhật trường dữ liệu tương ứng trong formData
    setFormData((prev) => ({
        ...prev,
        [field]: value
    }));

    // 2. Tự động xóa thông báo lỗi của trường đó nếu người dùng đã sửa
    if (errors[field]) {
        setErrors((prev) => {
            const next = { ...prev };
            delete next[field];
            return next;
        });
    }
};
```

* **INPUT:** Tên trường cần sửa (`field`) và Giá trị mới (`value`).
* **PROCESS:** Sao chép state cũ (`...prev`), ghi đè giá trị mới `[field]: value`, và xóa lỗi cũ.
* **OUTPUT:** State `formData` cập nhật ➔ React tự động kích hoạt render lại giao diện.

**Ví dụ:**  
Khi gọi `handleChangeForm('title', 'React Course Pro')`:  
➔ `formData.title` lập tức đổi thành `'React Course Pro'`  
➔ Dòng báo lỗi đỏ của `title` (nếu có trước đó) tự động biến mất!

---

## 6. Component Cha và Component Con

Mối quan hệ giữa Cha và Con trong React luôn tuân thủ nguyên tắc **Luồng dữ liệu một chiều (Unidirectional Data Flow)**:

```text
CourseForm (Cha)
      │
      ├─ Giữ State: formData.title
      │
      ▼ Truyền dữ liệu xuống qua PROPS: value={formData.title}
InputTitle (Con)
      │
      ▼ Hiển thị chữ lên màn hình cho người dùng
Người dùng gõ phím thêm chữ mới
      │
      ▼ Bắn tín hiệu qua CALLBACK: onChange(chuỗi_mới)
CourseForm (Cha)
      │
      ▼ Chạy hàm: handleChangeForm('title', chuỗi_mới)
State formData.title được cập nhật!
```

* **Props:** Bưu phẩm một chiều từ Cha đưa cho Con. Con chỉ đọc, không được tự ý ghi đè.
* **Value:** Giá trị hiển thị thực tế lấy từ Cha.
* **Callback:** Chiếc "bộ đàm" Cha gửi cho Con để Con gọi báo tin khi người dùng thao tác.

---

## 7. Giải thích từng Component sau Refactor

---

### ① `TitleCourse.tsx`
* **Full path:** `/Users/admin/Desktop/Frontend-Course/frontend/src/components/CourseFormModal/TitleCourse.tsx`
* **Mục đích:** Hiển thị tiêu đề đầu form linh hoạt theo ngữ cảnh thêm mới hay chỉnh sửa.
* **Input / Props:** `isEditing: boolean`.
* **Process:** Nếu `isEditing === true` thì hiện `"✏️ Edit Course"`, ngược lại hiện `"✨ Create New Course"`.
* **Output:** Mã JSX tiêu đề kèm mô tả.
* **Cha gọi ở đâu:** Được truyền vào thuộc tính `title` của Antd `<Modal title={<TitleCourse isEditing={isEditing} />} />`.
* **Điều cần nhớ:** Tách tiêu đề thành component giúp đổi phong cách giao diện mà không chạm vào logic form.

---

### ② `InputTitle.tsx`
* **Full path:** `/Users/admin/Desktop/Frontend-Course/frontend/src/components/CourseFormModal/InputTitle.tsx`
* **Mục đích:** Nhập tên môn học.
* **Input / Props:** `value: string`, `onChange: (value: string) => void`, `error?: string`, `disabled?: boolean`.
* **Process:** Bắt sự kiện gõ phím `e.target.value` của thẻ `<Input>`.
* **Output:** Gọi `onChange(chuoi_moi)`.
* **Cha gọi ở đâu:** Đầu danh sách các trường trong form của `CourseForm.tsx`.
* **Điều cần nhớ:** Thuộc tính `disabled` giúp khóa ô nhập khi đang submit dữ liệu lên server.

---

### ③ `InputDescription.tsx`
* **Full path:** `/Users/admin/Desktop/Frontend-Course/frontend/src/components/CourseFormModal/InputDescription.tsx`
* **Mục đích:** Nhập tóm tắt mô tả khóa học nhiều dòng.
* **Input / Props:** `value: string`, `onChange: (value: string) => void`, `error?: string`, `disabled?: boolean`.
* **Process:** Render thẻ `<TextArea rows={3}>` từ Ant Design.
* **Output:** Bắn chuỗi mô tả về cho Cha.
* **Điều cần nhớ:** Import chuẩn từ Ant Design là `import { Input } from 'antd'; const { TextArea } = Input;`.

---

### ④ `InputInstructor.tsx`
* **Full path:** `/Users/admin/Desktop/Frontend-Course/frontend/src/components/CourseFormModal/InputInstructor.tsx`
* **Mục đích:** Quản lý thông tin giảng viên (Tên bắt buộc & Email tùy chọn) trên 2 cột.
* **Input / Props:** `instructor`, `instructorEmail`, `onChangeInstructor`, `onChangeEmail`, `instructorError`, `emailError`.
* **Process:** Render hàng 2 cột (`<Col xs={24} sm={12}>`).
* **Output:** Báo riêng biệt từng thay đổi của Tên hoặc Email.
* **Điều cần nhớ:** Gom các trường có tính chất gắn liền (như Tên + Email) vào chung một component giúp form chính ngắn gọn.

---

### ⑤ `SelectLevel.tsx`
* **Full path:** `/Users/admin/Desktop/Frontend-Course/frontend/src/components/CourseFormModal/SelectLevel.tsx`
* **Mục đích:** Chọn cấp độ khóa học (Beginner, Intermediate, Advanced, All Levels).
* **Input / Props:** `value: CourseLevel`, `onChange: (value: CourseLevel) => void`, `error?: string`, `disabled?: boolean`.
* **Process:** Render dropdown `<Select>` với `LEVEL_OPTIONS`.
* **Output:** Gửi giá trị enum `BEGINNER` / `ADVANCED`... lên Cha.
* **Điều cần nhớ:** Đặt tên `SelectLevel` đúng chính xác theo kiến trúc thầy yêu cầu.

---

### ⑥ `SelectChargeType.tsx`
* **Full path:** `/Users/admin/Desktop/Frontend-Course/frontend/src/components/CourseFormModal/SelectChargeType.tsx`
* **Mục đích:** Cung cấp lựa chọn khóa học là **Miễn phí (Free - $0)** hay **Có phí (Paid)** bằng Radio Button trực quan.
* **Input / Props:** `isFree: boolean`, `onChange: (isFree: boolean) => void`, `disabled?: boolean`.
* **Process:** Render `<Radio.Group>` với 2 tùy chọn Free / Paid.
* **Output:** Bắn giá trị boolean (`true` nếu miễn phí, `false` nếu có phí).
* **Điều cần nhớ:** Khi chọn Miễn phí, Component Cha sẽ tự động đưa `price = 0` và khóa ô nhập giá.

---

### ⑦ `InputPrice.tsx`
* **Full path:** `/Users/admin/Desktop/Frontend-Course/frontend/src/components/CourseFormModal/InputPrice.tsx`
* **Mục đích:** Nhập Giá gốc, Giá khuyến mãi, Thời lượng (giờ), và Số bài học.
* **Input / Props:** `price`, `discountPrice`, `durationHours`, `lessonsCount`, `isFree`, 4 callbacks, 3 errors, `disabled`.
* **Process:** Nếu `isFree === true`, tự động vô hiệu hóa (disabled) ô nhập giá và hiển thị placeholder `$0.00 (Free)`.
* **Output:** Gọi các hàm cập nhật tương ứng.
* **Điều cần nhớ:** Thẻ `<InputNumber>` đảm bảo người dùng chỉ nhập số, không nhập được chữ linh tinh.

---

### ⑧ `SelectMetadata.tsx`
* **Full path:** `/Users/admin/Desktop/Frontend-Course/frontend/src/components/CourseFormModal/SelectMetadata.tsx`
* **Mục đích:** Quản lý toàn bộ thông tin siêu dữ liệu (Metadata) gồm: **Lĩnh vực (Category)**, **Kỹ năng & Ngôn ngữ (Tags)**, và **Ảnh đại diện (Thumbnail)**.
* **Input / Props:** `category`, `tags`, `thumbnail`, 3 hàm callback, lỗi, `disabled`.
* **Process:** Dùng `<Select showSearch>` cho Lĩnh vực, `<Select mode="tags">` cho Kỹ năng gõ tự do, và `<Input>` cho Thumbnail.
* **Output:** Gửi dữ liệu metadata về Cha.
* **Điều cần nhớ:** Đúng chuẩn định nghĩa "Metadata" mà thầy hướng dẫn: Lĩnh vực + Ngôn ngữ + Kỹ năng.

---

### ⑨ `InputStatus.tsx`
* **Full path:** `/Users/admin/Desktop/Frontend-Course/frontend/src/components/CourseFormModal/InputStatus.tsx`
* **Mục đích:** Tùy chọn trạng thái khóa học (`DRAFT`, `PUBLISHED`, `ARCHIVED`) kết hợp công tắc bật khóa học nổi bật (`isFeatured`).
* **Input / Props:** `value: CourseStatus`, `isFeatured: boolean`, callbacks, lỗi, `disabled`.
* **Process:** Dropdown chọn trạng thái + Thẻ `<Switch>` bật/tắt nổi bật.
* **Output:** Gửi trạng thái mới về Cha.

---

## 8. `InputTitle` — Ví dụ quan trọng nhất về luồng chạy

Hãy khắc ghi luồng 7 bước này:

```text
1. formData.title = "Master React" (ở CourseForm)
      ↓
2. <InputTitle value={formData.title} onChange={(val) => handleChangeForm('title', val)} />
      ↓
3. Thẻ Antd nhận: <Input value={value} onChange={(e) => onChange(e.target.value)} />
      ↓
4. Người dùng gõ thêm chữ " Pro" thành: "Master React Pro"
      ↓
5. InputTitle gọi callback: onChange("Master React Pro")
      ↓
6. CourseForm nhận được và chạy: handleChangeForm('title', 'Master React Pro')
      ↓
7. setFormData cập nhật ➔ formData.title = "Master React Pro" ➔ Màn hình render lại chữ mới!
```

---

## 9. `SelectMetadata` & `InputCategory`

* **`value` từ đâu?**  
  Từ `formData.category` (mặc định ban đầu là `'Frontend'`).
* **`options` từ đâu?**  
  Từ mảng hằng số `CATEGORY_SELECT_OPTIONS` gồm 8 danh mục: Frontend, Backend, Fullstack, Database, AI & ML, DevOps, Mobile, Cybersecurity.
* **Người dùng chọn thì chuyện gì xảy ra?**  
  Thẻ `<Select>` bắt sự kiện click ➔ Gọi `onChange(val)` ➔ Cha cập nhật `formData.category` ➔ Ô hiển thị nhảy sang danh mục mới.
* **Error hiển thị thế nào?**  
  Nếu submit mà chưa chọn danh mục, Cha gửi `error="Vui lòng chọn danh mục"` ➔ Thẻ `<Select status="error">` viền đỏ lên và thẻ `<span>` bên dưới hiện chữ đỏ.

---

## 10. Chức năng CREATE COURSE chạy như thế nào?

```text
Người dùng click nút "+ Add New Course" trên giao diện
      ↓
src/app/page.tsx: handleOpenCreateModal()
      ↓ setCourseToEdit(null), setFormModalOpen(true)
CourseForm mở lên
      ↓
useEffect nhận courseToEdit = null ➔ Nạp DEFAULT_FORM_VALUES (form trống)
      ↓
Người dùng điền các ô: Title, Description, Instructor, Price...
      ↓
Bấm nút "Create Course" (Submit)
      ↓
CourseForm chạy handleSubmit():
  1. Kiểm tra validation bằng Zod (courseFormValidationSchema)
  2. Nếu có lỗi ➔ Bật thông báo đỏ ở các ô con
  3. Nếu hợp lệ ➔ Gọi createMutation.mutateAsync(validatedData)
      ↓
Axios gửi HTTP POST /api/courses sang Backend Express
      ↓
Backend lưu vào PostgreSQL qua Prisma ORM
      ↓
Backend trả về mã 201 Created kèm dữ liệu khóa học mới
      ↓
React Query tự động làm mới (invalidate) danh sách khóa học
      ↓
Modal tự đóng (onClose()) và bảng Dashboard hiện ngay khóa học mới!
```

---

## 11. Chức năng EDIT COURSE chạy như thế nào?

```text
Người dùng click nút cây bút (✏️ Edit) tại 1 khóa học trên bảng
      ↓
src/app/page.tsx: handleOpenEditModal(course)
      ↓ setCourseToEdit(course), setFormModalOpen(true)
CourseForm mở lên
      ↓
useEffect nhận courseToEdit có dữ liệu khóa học cũ
      ↓ Đổ toàn bộ dữ liệu cũ vào formData (Title, Price cũ...)
Tất cả các component con tự động hiển thị đầy đủ thông tin cũ!
      ↓
Người dùng sửa giá tiền hoặc tiêu đề
      ↓
Bấm nút "Save Changes"
      ↓
CourseForm chạy handleSubmit():
  1. Kiểm tra validation hợp lệ
  2. Gọi updateMutation.mutateAsync({ id: courseToEdit.id, data: validatedData })
      ↓
Axios gửi HTTP PUT /api/courses/:id sang Backend
      ↓
Backend cập nhật bản ghi trong cơ sở dữ liệu
      ↓
Modal tự đóng, dòng khóa học trên bảng cập nhật ngay tức khắc!
```

---

## 12. CREATE và EDIT dùng chung `CourseForm` như thế nào?

| Đặc điểm | Chế độ CREATE (Tạo mới) | Chế độ EDIT (Chỉnh sửa) |
|---|---|---|
| **Biến nhận diện** | `isEditing = false` (`courseToEdit === null`) | `isEditing = true` (`courseToEdit` có dữ liệu) |
| **Tiêu đề (`TitleCourse`)** | Hiện `"✨ Create New Course"` | Hiện `"✏️ Edit Course"` |
| **Dữ liệu ban đầu** | Nạp `DEFAULT_FORM_VALUES` (trống) | Nạp dữ liệu cũ của khóa học được chọn |
| **Nút Submit** | Chữ `"Create Course (Tạo mới)"` | Chữ `"Save Changes (Cập nhật)"` |
| **API được gọi** | `createMutation.mutateAsync(...)` (HTTP `POST`) | `updateMutation.mutateAsync(...)` (HTTP `PUT`) |
| **Điểm GIỐNG NHAU** | **Dùng chung 100% giao diện, validation Zod, các component con và state `formData`!** |

---

## 13. Cơ chế Validation (Kiểm tra hợp lệ)

* **Quy tắc nằm ở đâu?**  
  Nằm ở file `src/validations/courseSchema.ts` sử dụng thư viện **Zod**:
  * `title`: Bắt buộc, tối thiểu 5 ký tự.
  * `description`: Bắt buộc, tối thiểu 10 ký tự.
  * `instructor`: Bắt buộc, tối thiểu 2 ký tự.
  * `price`: Số dương không âm (`min(0)`).
* **Luồng hiển thị lỗi:**
  ```text
  Người dùng xóa trắng ô Title ➔ Bấm Submit
        ↓
  handleSubmit chạy: courseFormValidationSchema.safeParse(formData)
        ↓ Thất bại (success: false)
  setErrors({ title: "Title must be at least 5 characters" })
        ↓
  CourseForm truyền prop: error={errors.title} xuống InputTitle
        ↓
  InputTitle nhận error ➔ Viền ô đỏ lên và render chữ đỏ báo lỗi!
  ```

---

## 14. Phân biệt State vs Props

* **STATE (`formData`):**  
  * Là **bộ nhớ nội bộ** do chính Component Cha quản lý.
  * Có thể tự thay đổi thông qua hàm `setFormData`.
* **PROPS (`value`, `onChange`, `error`):**  
  * Là **bưu phẩm từ bên ngoài truyền vào** cho Component Con.
  * Con chỉ được xem, **tuyệt đối không được gán đè trực tiếp** (Read-only). Muốn đổi, con phải gọi hàm callback để xin phép Cha đổi State.

---

## 15. Controlled Component là gì?

* Một thẻ nhập liệu trong HTML thông thường sẽ tự giữ chữ bên trong nó.
* Nhưng trong React, khi ta truyền cặp:
  ```tsx
  <Input value={value} onChange={(e) => onChange(e.target.value)} />
  ```
  Thẻ `<Input>` này trở thành **Controlled Component**:
  * Nó **không được tự quyết định** chữ nào đang hiện.
  * Chữ hiển thị hoàn toàn bị kiểm soát bởi biến `value` từ State của React.

---

## 16. Tại sao Component Con không được tự ý gọi API?

Nếu để `InputTitle` hoặc `InputPrice` tự gọi API lưu vào cơ sở dữ liệu:
1. Mỗi lần người dùng gõ 1 chữ, API sẽ bị gọi hàng chục lần ➔ Quá tải server.
2. Dữ liệu bị manh mún (chưa nhập xong Giá đã lưu Tên).
3. **Giải pháp chuẩn:** Con chỉ lo việc nhập liệu; chỉ khi người dùng bấm Submit ở cuối form, **duy nhất Component Cha** mới gom đủ 14 trường và gọi API đúng một lần duy nhất!

---

## 17. Bảng tổng kết các file đã thay đổi

| File | Trước khi refactor | Sau khi refactor | Lý do thay đổi |
|---|---|---|---|
| `components/courses/CourseFormModal.tsx` | Khối monolithic 432 dòng | **ĐÃ XÓA HOÀN TOÀN** | Dọn dẹp implementation cũ, tránh chạy 2 modal song song. |
| `CourseFormModal/CourseForm.tsx` | Chưa có | **ĐÃ TẠO MỚI (CHỦ LỰC)** | Component Cha chính thức điều phối Create & Edit dùng chung. |
| `CourseFormModal/TitleCourse.tsx` | Chưa có | **ĐÃ TẠO MỚI** | Hiển thị tiêu đề linh hoạt theo chế độ Create / Edit. |
| `CourseFormModal/InputTitle.tsx` | Chưa có `disabled` | Bổ sung `disabled` | Đồng bộ chuẩn form props. |
| `CourseFormModal/InputDescription.tsx` | Import sai đường dẫn | Chuẩn hóa import `{ Input }` | An toàn với Next.js build. |
| `CourseFormModal/InputInstructor.tsx` | Trước là file rỗng | Đã tạo hoàn chỉnh | Quản lý tên và email giảng viên. |
| `CourseFormModal/SelectLevel.tsx` | Trước đặt tên InputLevel | Đổi sang `SelectLevel` | Đúng chính xác tên theo workflow thầy yêu cầu. |
| `CourseFormModal/SelectChargeType.tsx`| Chưa có | **ĐÃ TẠO MỚI** | Thêm lựa chọn Miễn phí vs Có phí theo yêu cầu của thầy. |
| `CourseFormModal/InputPrice.tsx` | Trước là PricingFields | Đổi sang `InputPrice` | Đúng tên thầy yêu cầu, tích hợp tính năng khóa giá khi Free. |
| `CourseFormModal/SelectMetadata.tsx` | Trước chỉ có Category | Đã tạo `SelectMetadata` | Gom Lĩnh vực + Kỹ năng + Ảnh đại diện theo định nghĩa thầy. |
| `CourseFormModal/InputStatus.tsx` | Trước chỉ có status | Bổ sung `isFeatured` | Quản lý trạng thái xuất bản và khóa học nổi bật. |
| `CourseFormModal/index.tsx` | Code dở dang | Xuất bản chuẩn Barrel | Export `CourseForm` và alias `CourseFormModal`. |
| `src/app/page.tsx` | Dùng CourseFormModal | Đã đổi sang `CourseForm` | Kết nối trang chủ với kiến trúc mới. |

---

## 18. Ghi nhận phần bạn đã tự làm

* **`InputTitle.tsx`:**  
  * *Bạn đã làm:* Tự viết xong toàn bộ giao diện `<Input>`, nhãn label, thông báo lỗi và interface `InputTitleProps`.
  * *AI bổ sung:* Thêm thuộc tính `disabled` để khóa khi submit.
* **`InputDescription.tsx`:**  
  * *Bạn đã làm:* Tự viết xong component dùng thẻ `<TextArea>`, interface và luồng `onChange`.
  * *AI bổ sung:* Chuẩn hóa câu lệnh import từ thư viện Ant Design.
* **`InputCategory.tsx`:**  
  * *Bạn đã làm:* Tự viết xong `interface InputCategoryProps`, mảng `CATEGORY_SELECT_OPTIONS` và thẻ `<Select>`.
  * *AI bổ sung:* Thêm `showSearch`, `placeholder="Select Category"` và export mảng để `SelectMetadata` có thể tái sử dụng.

---

## 19. 15 Khái niệm cốt lõi cần nhớ

1. **Component:** Khối giao diện độc lập, tái sử dụng được (Ví dụ: `InputTitle`).
2. **Component Cha / Con:** Cha điều phối state; Con nhận dữ liệu và phục vụ cha.
3. **Props:** Dữ liệu hoặc hàm truyền từ cha xuống con theo một chiều.
4. **State:** Bộ nhớ tạm của component, thay đổi sẽ kích hoạt re-render.
5. **formData:** Object gom toàn bộ dữ liệu của form để chuẩn bị gửi API.
6. **value:** Giá trị hiển thị trên ô nhập tại thời điểm hiện tại.
7. **onChange:** Sự kiện bắt khi người dùng thao tác nhập liệu.
8. **Callback:** Hàm của cha gửi cho con mượn để báo tin khi có thay đổi.
9. **Interface Props:** Hợp đồng TypeScript quy định con nhận prop gì.
10. **handleChangeForm:** Hàm cập nhật state tập trung tại component cha.
11. **Controlled Component:** Ô nhập liệu bị kiểm soát hoàn toàn bởi React State.
12. **Validation:** Bộ quy tắc kiểm tra dữ liệu hợp lệ (dùng Zod).
13. **Single Responsibility:** Mỗi component chỉ làm tốt một nhiệm vụ duy nhất.
14. **Reusable Component:** Khả năng dùng lại component ở nhiều màn hình khác nhau.
15. **Unidirectional Data Flow:** Luồng dữ liệu chạy từ trên xuống dưới (Cha ➔ Con), sự kiện chạy từ dưới lên trên (Con ➔ Cha).

---

## 20. Công thức đọc nhanh một Input Component

Khi mở bất kỳ component con nào, hãy tự đặt 6 câu hỏi:
1. **Props nhận gì?** ➔ Đọc `interface ...Props`.
2. **`value` từ đâu đến?** ➔ Từ prop truyền xuống.
3. **`onChange` gọi ai?** ➔ Gọi hàm callback của Cha.
4. **`error` từ đâu đến?** ➔ Từ Zod validation của Cha gửi xuống.
5. **Component này có State riêng không?** ➔ Nếu không có `useState`, nó là stateless component thuần túy.
6. **Ai thực sự cập nhật dữ liệu?** ➔ Component Cha (`CourseForm`).

---

## 21. Công thức 7 bước tự tách Component lần sau

* **Bước 1:** Xác định đoạn mã JSX đang bị dài dòng trong component cha.
* **Bước 2:** Xác định đoạn JSX đó cần những dữ liệu gì để hiển thị.
* **Bước 3:** Tạo file mới và viết `interface TênProps { value: ...; onChange: ...; error?: string }`.
* **Bước 4:** Cắt đoạn JSX sang file mới, thay các biến của cha bằng `value` và `error`.
* **Bước 5:** Bắt sự kiện người dùng và gọi `onChange(...)`.
* **Bước 6:** Quay về Cha, `import` component mới và truyền `<TênComponent value={...} onChange={...} />`.
* **Bước 7:** Test trên trình duyệt để kiểm tra dữ liệu có cập nhật vào form không.

---

## 22. Hướng dẫn Test thủ công từng bước (Checklist)

* [ ] **Test 1 - Create Course:** Bấm "+ Add New Course", nhập dữ liệu, bấm Create ➔ Khóa học mới xuất hiện trên bảng.
* [ ] **Test 2 - Edit Course:** Bấm nút cây bút (Edit), kiểm tra dữ liệu cũ có tự điền không ➔ Sửa thông tin ➔ Bấm Save Changes ➔ Bảng cập nhật ngay.
* [ ] **Test 3 - Validation:** Xóa trắng Title và bấm Submit ➔ Viền đỏ báo lỗi hiện lên; gõ chữ vào thì lỗi đỏ biến mất.
* [ ] **Test 4 - Level:** Chọn thử các cấp độ Beginner, Advanced ➔ Giá trị lưu đúng.
* [ ] **Test 5 - Charge Type & Price:** Bấm chọn "🟢 Miễn phí" ➔ Ô nhập giá bị khóa và hiển thị `$0.00 (Free)`. Bấm chọn "💳 Có phí" ➔ Ô nhập giá mở lại bình thường.
* [ ] **Test 6 - Metadata:** Gõ từ khóa tìm kiếm trong Category, gõ thêm vài tag kỹ năng mới ➔ Dữ liệu nhận đầy đủ.
* [ ] **Test 7 - Status:** Chọn Published hoặc Draft kèm bật công tắc Featured Course.
* [ ] **Test 8 - Close & Reset:** Mở form, gõ vài chữ, bấm Cancel ➔ Mở lại form kiểm tra dữ liệu đã được làm sạch về mặc định.

---

## 23. 10 Câu hỏi tự kiểm tra độ hiểu bài

1. Tại sao State `formData` lại phải nằm ở component cha `CourseForm` mà không nằm riêng ở từng component con?
2. Khi người dùng click chọn một danh mục trong `SelectMetadata`, component con này có tự ý cập nhật cơ sở dữ liệu không? Nó làm cách nào để báo cho Cha?
3. Nếu chúng ta quên truyền prop `value={formData.title}` vào `InputTitle`, hiện tượng gì sẽ xảy ra khi người dùng bấm Edit một khóa học cũ?
4. Trong kiến trúc mới, `CourseForm` phân biệt giữa chế độ Tạo mới (Create) và Chỉnh sửa (Edit) dựa vào prop nào?
5. Khi người dùng chọn hình thức thu phí là "Miễn phí" trong `SelectChargeType`, ô nhập giá tiền trong `InputPrice` sẽ có phản ứng gì?
6. Hàm `handleChangeForm` ở component cha nhận 2 tham số gì?
7. Tại sao trong `InputDescription`, chúng ta không tự gọi API cập nhật mô tả mỗi khi người dùng gõ phím?
8. Thành phần `TitleCourse` nhận prop gì và nó hiển thị khác nhau như thế nào giữa Create và Edit?
9. Thư viện nào trong project đang chịu trách nhiệm kiểm tra tính hợp lệ (Validation) của form trước khi gửi API?
10. Luồng truyền dữ liệu bằng Props trong React đi theo chiều nào: Cha xuống Con hay Con lên Cha?

<details>
<summary>👉 Bấm vào đây để xem ĐÁP ÁN</summary>

1. **Đáp án:** Vì khi bấm Submit, Cha cần gom toàn bộ 14 trường dữ liệu thành một đối tượng JSON duy nhất để gửi sang Backend. Nếu State nằm rải rác ở từng con thì Cha không thể gom đủ dữ liệu.
2. **Đáp án:** Không, component con không tự ghi DB. Nó gọi hàm callback `onChangeCategory(val)` mà Cha truyền xuống để Cha cập nhật `formData`.
3. **Đáp án:** Ô nhập tiêu đề sẽ bị rỗng (hoặc chỉ nhận giá trị gõ tự do), không thể hiển thị tiêu đề cũ của khóa học cần sửa.
4. **Đáp án:** Dựa vào prop `courseToEdit`. Nếu có dữ liệu ➔ Edit mode; nếu `null` hoặc `undefined` ➔ Create mode.
5. **Đáp án:** Ô nhập giá tiền sẽ tự động nhận giá trị `0` và bị vô hiệu hóa (`disabled`), không cho người dùng nhập giá.
6. **Đáp án:** Nhận tên trường cần cập nhật (`field`) và giá trị mới (`value`).
7. **Đáp án:** Vì nếu gõ mỗi ký tự lại gọi API thì server sẽ bị quá tải bởi hàng chục request không cần thiết; chỉ khi bấm Submit mới gửi một lần duy nhất.
8. **Đáp án:** Nhận prop `isEditing: boolean`. Nếu `false` hiện `"✨ Create New Course"`; nếu `true` hiện `"✏️ Edit Course"`.
9. **Đáp án:** Thư viện **Zod** (thông qua `courseFormValidationSchema.safeParse`).
10. **Đáp án:** Đi theo chiều từ **Cha xuống Con**.

</details>

---

## 24. Tóm tắt 1 phút: Nếu chỉ nhớ 5 điều về bài này

1. **Một `formData` duy nhất tại Cha:** Component cha `CourseForm` nắm giữ toàn bộ state và điều phối Submit/API.
2. **Component con chỉ lo hiển thị:** Con nhận `value` để hiện, nhận `error` để báo lỗi, và bấm `onChange` để gửi tin nhắn lên Cha.
3. **Create & Edit dùng chung:** Chỉ cần kiểm tra `courseToEdit` để biết đang tạo mới hay chỉnh sửa, không bao giờ viết 2 form riêng biệt.
4. **Controlled Component:** Ô nhập liệu luôn đi liền cặp `value` + `onChange`.
5. **Cắt nhỏ chứ không viết lại:** Tách component thực chất là cắt bớt JSX dài dòng mang sang file con và kết nối lại bằng Props!
