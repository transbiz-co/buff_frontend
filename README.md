# Buff Frontend

此專案使用 Next.js 15，由 v0 生成，並集成了 Supabase Auth 進行身份驗證。

## Supabase 身份驗證設置

### 環境變量

在運行專案之前，需要設置以下 Supabase 環境變量。根據 docker-compose.yml 的配置，這些變量會從父目錄的 .env 文件中獲取並掛載到前端容器中：

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

請確保在專案根目錄（buff）中的 .env 文件中設置了這些變量。

### 已實現的功能

- **電子郵件/密碼登入**：使用 Supabase Auth 實現了基本的電子郵件和密碼登入功能。
- **身份驗證狀態管理**：使用 React Context 在整個應用程序中管理和共享身份驗證狀態。
- **受保護路由**：使用 `<ProtectedRoute>` 組件來保護需要登入才能訪問的頁面。

### 使用方法

1. **登入**：訪問 `/sign-in` 路徑使用電子郵件和密碼登入。
2. **保護頁面**：要保護頁面僅限已登入用戶訪問，請使用 `<ProtectedRoute>` 組件包裝頁面内容：

```jsx
import { ProtectedRoute } from "@/components/protected-route"

export default function SecurePage() {
  return (
    <ProtectedRoute>
      {/* 您的頁面内容 */}
    </ProtectedRoute>
  )
}
```

3. **使用身份驗證狀態**：在任何客戶端組件中，您可以使用 `useAuth` hook 訪問身份驗證狀態：

```jsx
import { useAuth } from "@/hooks/useAuth"

function MyComponent() {
  const { user, isLoading } = useAuth()
  
  if (isLoading) return <div>Loading...</div>
  if (!user) return <div>Not authenticated</div>
  
  return <div>Hello, {user.email}</div>
}
```

### 待實現功能

- 忘記密碼功能
- 註冊功能
- 社交登入選項
- 用戶簡介管理

## 開發說明

### 本地開發

```bash
npm run dev
```

### 使用 Docker

```bash
# 在 buff 目錄下運行
docker-compose up --build
```

訪問 http://localhost:3000 查看應用程序。 