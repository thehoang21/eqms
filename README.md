# 📋 Hệ thống Quản lý Chất lượng (QMS)

Ứng dụng web quản lý chất lượng xây dựng bằng **React + TypeScript + Vite**, tổ chức theo **feature-based** để dễ mở rộng, bảo trì và tái sử dụng.

---

## 🚀 Bắt đầu nhanh

### Yêu cầu
- Node.js v16 trở lên
- npm hoặc yarn

### Cài đặt & chạy

1) Cài dependencies:
```bash
npm install
```

2) Tạo và cấu hình biến môi trường:
```bash
cp .env.example .env
```
Chỉnh `.env`:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Quality Management System
```

3) Chạy chế độ phát triển:
```bash
npm run dev
```

4) Build bản production:
```bash
npm run build
```

---

## 📁 Cấu trúc dự án (rút gọn)

```
quality-management/
├─ styles/           # CSS global & utilities
├─ services/api/     # Client & endpoints (auth, documents, tasks)
├─ contexts/         # Auth, Theme, Notification + AppProviders
├─ hooks/            # useApi, useAuth, useDebounce, usePagination...
├─ middleware/       # ProtectedRoute
├─ utils/            # format, validation, helpers
├─ types/            # Kiểu dữ liệu dùng chung
├─ features/         # Dashboard, Documents, My Tasks, ...
└─ components/       # UI tái sử dụng (Button, Select, Badge, ...)
```

---

## 🎯 Tính năng chính

- Dashboard: thẻ chỉ số, thông báo hệ thống, responsive grid
- Document Control: danh sách, lọc trạng thái, e-signature, xuất CSV
- My Tasks: xem dạng bảng/thẻ, lọc nâng cao, chi tiết có timeline
- Đang phát triển: Training, Deviation, CAPA, Change Control, Complaints, Audit Trail, Settings

---

## 🏗️ Kiến trúc & Best Practices

- Triết lý: đơn giản hóa, tách biệt trách nhiệm, ưu tiên tái sử dụng.
- Feature-based: mỗi module tự quản lý components/hooks/utils/types.
- CSS Modules: style theo component, tránh xung đột toàn cục.
- Context API: quản lý trạng thái chung (Auth/Theme/Notification).
- ProtectedRoute: chặn truy cập khi chưa đăng nhập / sai quyền.
- API Service Layer: mọi gọi API đi qua client chung.

### Sơ đồ luồng dữ liệu
- Component (UI) → Hooks (logic) → Services (API) → Backend
- Types định nghĩa cấu trúc dữ liệu, dùng xuyên suốt.
- Context cung cấp state toàn cục cho Auth/Theme/Notification.

### Quy ước đặt tên
- Thư mục: `kebab-case` (vd: `my-tasks`, `change-control`).
- File TS/TSX: `PascalCase` cho component, `camelCase` cho helpers.
- CSS Modules: `[Component].module.css`.
- Hook: bắt đầu bằng `use` (vd: `useAuth`, `usePagination`).
- Type/interface: `PascalCase` (vd: `Document`, `Task`).

### Path alias
- Sử dụng alias `@/` để import nhanh từ root.
- Ví dụ: `import { Button } from '@/components/ui/Button';`

### Tổ chức `index.ts`
- Mỗi feature có `index.ts` để export các phần public.
- Tránh import sâu vào cấu trúc nội bộ.

Ví dụ dùng CSS Modules:
```tsx
import styles from './Component.module.css';

export function Component() {
  return <div className={styles.container}>Nội dung</div>;
}
```

Ví dụ dùng hook API:
```tsx
import { useEffect } from 'react';
import { useApi } from '@/hooks';
import { documentApi } from '@/services/api';

export function DocumentList() {
  const { data, loading, error, execute } = useApi(() => documentApi.getDocuments());
  useEffect(() => { execute(); }, []);
  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {String(error)}</div>;
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

Ví dụ bảo vệ route:
```tsx
import { ProtectedRoute } from '@/middleware/ProtectedRoute';

<ProtectedRoute requiredRole={['Admin', 'Manager']}>
  <AdminPanel />
</ProtectedRoute>
```

---

## ➕ Thêm Feature mới (Workflow chuẩn)

1) Tạo thư mục `features/training/` với các file cơ bản:
```
features/training/
├─ TrainingView.tsx
├─ TrainingView.module.css
├─ components/
├─ hooks/
├─ utils/
├─ types.ts
└─ index.ts
```

2) Viết `TrainingView.tsx` (container component):
```tsx
import styles from './TrainingView.module.css';

export function TrainingView() {
  return (
    <div className={styles.container}>
      <h1>Training Management</h1>
    </div>
  );
}
```

3) Export feature trong [features/training/index.ts](features/training/index.ts):
```ts
export { TrainingView } from './TrainingView';
```

4) Thêm mục vào menu trong [constants.tsx](constants.tsx):
```ts
{ id: 'training', label: 'Training Management', icon: GraduationCap }
```

5) Tạo hooks/ utils khi cần, đặt trong `features/training/hooks` và `features/training/utils`.

6) Kết nối API (nếu cần) qua [services/api/training.ts](services/api/training.ts) tương tự các module khác.

---

## 🔌 Cấu hình API nhanh

`services/api/client.ts` tạo sẵn Axios instance, thêm token vào header và xử lý lỗi 401:
```ts
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err)
);
```

---

## 🛠️ Scripts tiện dụng

```bash
npm run dev        # Chạy dev server
npm run build      # Build production
npm run preview    # Xem thử bản build
npm run lint       # Kiểm tra lint
npm run type-check # Kiểm tra type TS
npm test           # Chạy test (nếu thiết lập)
```

---

## 📦 Biến môi trường

```env
VITE_API_BASE_URL=https://api.example.com
VITE_APP_NAME=Quality Management System
VITE_ENABLE_AUDIT_TRAIL=true
```

---

## 🔐 Luồng đăng nhập & phân quyền

- Đăng nhập gọi `authApi.login`, lưu token vào `localStorage`.
- Interceptor tự gắn `Authorization: Bearer <token>` cho mọi request.
- `ProtectedRoute` kiểm tra `isAuthenticated` và `requiredRole`.

Ví dụ sử dụng trong component:
```tsx
import { useAuth } from '@/contexts';

export function UserMenu() {
  const { user, logout } = useAuth();
  return (
    <div>
      <span>{user?.name}</span>
      <button onClick={logout}>Đăng xuất</button>
    </div>
  );
}
```

---

## 🧱 Chuẩn component & hooks

- Component chia rõ: Presentational (UI thuần) và Container (logic + fetch).
- Không gọi API trực tiếp trong UI; dùng hooks (`useApi`, `useFeatureX`).
- Props rõ ràng, có type đầy đủ; tránh `any`.
- Tránh inline styles; dùng CSS Modules.

Mẫu Presentational component:
```tsx
type Props = { title: string; status: 'ok' | 'error' };

export function StatusCard({ title, status }: Props) {
  return <div>{title} - {status}</div>;
}
```

Mẫu Container component:
```tsx
import { useEffect } from 'react';
import { useApi } from '@/hooks';
import { taskApi } from '@/services/api';

export function TaskContainer() {
  const { data, execute } = useApi(() => taskApi.getTasks());
  useEffect(() => { execute(); }, []);
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

---

## 🎨 Styling Guidelines

- Global: định nghĩa biến màu, spacing trong [styles/globals.css](styles/globals.css).
- Utilities: dùng lớp tiện ích trong [styles/utilities.css](styles/utilities.css).
- Component: tạo file `[Name].module.css`, import vào TSX.
- Theme: dùng [contexts/ThemeContext.tsx](contexts/ThemeContext.tsx) để đổi light/dark.

Ví dụ biến màu:
```css
:root {
  --color-primary: #2563eb;
  --color-success: #10b981;
  --color-danger:  #ef4444;
}
```

---

## 🧪 Testing (khuyến nghị)

Thiết lập:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

Ví dụ test component:
```ts
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

it('hiển thị nội dung', () => {
  render(<Button>Nhấn</Button>);
  expect(screen.getByText('Nhấn')).toBeInTheDocument();
});
```

Vị trí test: `__tests__` hoặc cùng thư mục với component (`Button.test.tsx`).

---

## 🧭 Quy ước commit & nhánh

- Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`...
- Nhánh theo tính năng: `feature/<ten-tinh-nang>`.
- Pull Request nhỏ, mô tả rõ ràng.

Ví dụ commit:
```
feat(documents): thêm filter theo status
```

---

## 🤝 Đóng góp

1) Tạo nhánh mới: `git checkout -b feature/ten-tinh-nang`
2) Commit rõ ràng: `git commit -m "Mo ta ngan gon"`
3) Tạo Pull Request để review

---

## 📄 Giấy phép

MIT License

