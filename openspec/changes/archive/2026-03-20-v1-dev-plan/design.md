# V1 Core MVP 开发计划 — Design

## 整体架构

```
frontend/          React 18 + TypeScript + Vite + Tailwind CSS
backend/           Node.js 18 + Express + TypeScript
  ├── src/
  │   ├── config/        环境变量、数据库、Redis 连接
  │   ├── middlewares/   auth、错误处理、文件上传
  │   ├── routes/        路由注册
  │   ├── controllers/   请求处理
  │   ├── services/      业务逻辑
  │   ├── models/        数据库查询
  │   └── utils/         工具函数
  └── migrations/        SQL 迁移文件
```

---

## 第一阶段：数据库

### MySQL Schema

#### users 表
```sql
CREATE TABLE users (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username    VARCHAR(50)  NOT NULL UNIQUE,
  email       VARCHAR(100) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  avatar_url  VARCHAR(500),
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email)
);
```

#### skills 表
```sql
CREATE TABLE skills (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id        INT UNSIGNED NOT NULL,
  title          VARCHAR(200) NOT NULL,
  description    TEXT,
  category       ENUM('productivity','coding','writing','other') NOT NULL,
  file_path      VARCHAR(500) NOT NULL,
  file_name      VARCHAR(200) NOT NULL,
  file_size      INT UNSIGNED NOT NULL,
  download_count INT UNSIGNED DEFAULT 0,
  favorite_count INT UNSIGNED DEFAULT 0,
  status         ENUM('active','deleted') DEFAULT 'active',
  created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user_id (user_id),
  INDEX idx_category (category),
  INDEX idx_download_count (download_count DESC),
  INDEX idx_created_at (created_at DESC)
);
```

#### favorites 表
```sql
CREATE TABLE favorites (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL,
  skill_id   INT UNSIGNED NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_skill (user_id, skill_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (skill_id) REFERENCES skills(id)
);
```

### Redis Key 规范

| Key | 类型 | 用途 |
|-----|------|------|
| `ranking:skills:all` | Sorted Set | 全部 Skills 下载量排行 |
| `ranking:skills:productivity` | Sorted Set | 分类排行 |
| `ranking:skills:coding` | Sorted Set | 分类排行 |
| `ranking:skills:writing` | Sorted Set | 分类排行 |
| `ranking:skills:other` | Sorted Set | 分类排行 |
| `refresh_token:<userId>` | String | Refresh Token 存储，TTL=30d |

每次下载执行：
```
ZINCRBY ranking:skills:all 1 <skill_id>
ZINCRBY ranking:skills:<category> 1 <skill_id>
```

每小时定时任务将 Redis score 同步到 MySQL `download_count`。

---

## 第二阶段：后端

### API 清单

#### 认证 `/api/v1/auth`
| 方法 | 路径 | 说明 | 登录要求 |
|------|------|------|----------|
| POST | `/register` | 注册 | 无 |
| POST | `/login` | 登录，返回 JWT HTTP-only Cookie | 无 |
| POST | `/logout` | 登出，清除 Cookie | 无 |
| POST | `/refresh` | 刷新 Access Token | 无 |
| GET  | `/me` | 获取当前用户信息 | 是 |

#### Skills `/api/v1/skills`
| 方法 | 路径 | 说明 | 登录要求 |
|------|------|------|----------|
| GET | `/` | 列表，支持 `?category=&page=&limit=&sort=` | 无 |
| POST | `/` | 发布，`multipart/form-data` | 是 |
| GET | `/:id` | 详情 | 无 |
| GET | `/:id/download` | 下载文件，自动计数 | 无 |
| DELETE | `/:id` | 删除，仅作者 | 是 |

#### 收藏 `/api/v1/favorites`
| 方法 | 路径 | 说明 | 登录要求 |
|------|------|------|----------|
| GET | `/` | 我的收藏列表 | 是 |
| POST | `/` | 添加收藏，body: `{ skillId }` | 是 |
| DELETE | `/:skillId` | 取消收藏 | 是 |

#### 排行榜 `/api/v1/rankings`
| 方法 | 路径 | 说明 | 登录要求 |
|------|------|------|----------|
| GET | `/skills` | `?category=all&limit=10` | 无 |

#### 首页 `/api/v1/home`
| 方法 | 路径 | 说明 | 登录要求 |
|------|------|------|----------|
| GET | `/` | 热门 Skills Top8 + 排行榜 Top5 + 统计数据 | 无 |

### 统一响应格式
```typescript
// 成功
{ success: true, data: any, message?: string }
// 失败
{ success: false, error: string, code?: string }
```

### 文件上传规范
- 白名单：`.json` `.yaml` `.yml` `.zip` `.md`
- 大小限制：50MB
- 存储路径：`/data/uploads/skills/<uuid>.<ext>`
- 文件名重命名防路径遍历

### 认证方案
- Access Token：JWT，15min 有效期，存 HTTP-only Cookie
- Refresh Token：JWT，30d 有效期，存 Redis + HTTP-only Cookie
- 中间件：`authRequired`（强制登录）、`authOptional`（可选登录，用于详情页判断收藏状态）

---

## 第三阶段：前端

### 技术配置
- React 18 + TypeScript + Vite
- Tailwind CSS，主题扩展严格按 `designs/design-tokens.md`
- React Router v6
- Axios（封装统一请求拦截器）
- React Hook Form（表单）

### Tailwind 主题扩展（必须配置）
```js
colors: {
  primary: '#7C9082',
  'primary-tint': 'rgba(124,144,130,0.08)',
  'bg-page': '#FAF8F5',
  'bg-surface': '#F5F3EF',
  'bg-muted': '#F0EDE8',
  'bg-dark': '#2D2D2D',
  'text-primary': '#2D2D2D',
  'text-secondary': '#8A8A8A',
  'text-muted': '#ADADAD',
  border: '#E8E4DF',
  'border-subtle': '#F0EDE8',
},
fontFamily: {
  display: ['Fraunces', 'serif'],
  ui: ['Inter', 'sans-serif'],
  mono: ['IBM Plex Mono', 'monospace'],
},
borderRadius: {
  card: '20px', btn: '24px', search: '28px',
  badge: '16px', rank: '16px', icon: '8px',
},
```

### 目录结构
```
frontend/src/
├── components/
│   ├── common/       Navbar, Button, Input, Textarea, Select
│   │                 SkillCard, CategoryTabs, Pagination
│   │                 EmptyState, RankingRow, AuthShowcase
│   └── layout/       MainLayout, AuthLayout
├── pages/
│   ├── HomePage.tsx
│   ├── SkillsListPage.tsx
│   ├── SkillDetailPage.tsx
│   ├── SkillPublishPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── FavoritesPage.tsx
│   └── RankingsPage.tsx
├── services/         api.ts + 各模块请求函数
├── hooks/            useAuth, useFavorite
├── types/            index.ts（IUser, ISkill, IFavorite 等）
└── utils/            formatFileSize, formatDate
```

### 页面与设计稿对应

| 页面 | 设计稿 | 截图 |
|------|--------|------|
| `/` | `homepage.pen` | `homepage.png` |
| `/skills` | `skills-list.pen` | `skills-list.png` |
| `/skills/:id` | `skills-detail.pen` | `skills-detail.png` |
| `/skills/publish` | `skills-publish.pen` | `skills-publish.png` |
| `/login` | `login.pen` | `login.png` |
| `/register` | `register.pen` | `register.png` |
| `/favorites` | `favorites.pen` | `favorites.png` |
| `/rankings` | `rankings.pen` | `rankings.png` |

### 实现原则
- 先桌面端 1440px，再补响应式
- 以 PNG 截图为视觉验收标准，以 `.pen` 文件确认布局结构
- 不自行发明新页面结构，不过度添加动画
- 优先保证层级、留白、圆角、配色正确
