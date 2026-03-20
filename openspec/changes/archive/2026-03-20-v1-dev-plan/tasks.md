# V1 Core MVP 开发计划 — Tasks

> 执行顺序：数据库 → 后端 → 前端
> 每个任务完成后在 `[ ]` 打勾

---

## 阶段一：数据库

### DB-01 初始化数据库环境
- [x] 本地安装 MySQL 8.0 + Redis 7（brew install）
- [x] 创建数据库 `ai_platform`
- [x] 创建应用用户 `app_user` 并授权

### DB-02 执行 Schema 迁移
- [x] 创建 `backend/migrations/001_init.sql`，包含 users / skills / favorites 三张表
- [x] 本地执行迁移，验证表结构（users / skills / favorites 三张表已创建）
- [x] 迁移命令：`mysql -u app_user -p ai_platform < migrations/001_init.sql`

### DB-03 Redis 初始化验证
- [x] 确认 Redis 连接正常（redis-cli ping → PONG）
- [x] 验证 Sorted Set 操作（ZINCRBY / ZREVRANGE）正常

---

## 阶段二：后端

### BE-01 项目初始化
- [x] `cd backend && npm init -y`
- [x] 安装依赖：express, typescript, ts-node-dev, mysql2, ioredis, jsonwebtoken, bcrypt, multer, express-validator, winston, uuid, cors, cookie-parser
- [x] 配置 `tsconfig.json`、`eslint`、`.env.example`
- [x] 创建 `src/index.ts` 入口

### BE-02 基础设施
- [x] `src/config/db.ts`：mysql2 连接池
- [x] `src/config/redis.ts`：ioredis 连接
- [x] `src/config/env.ts`：环境变量类型化读取
- [x] `src/middlewares/error.ts`：统一错误处理中间件
- [x] `src/utils/response.ts`：统一响应格式工具函数

### BE-03 用户认证模块
- [x] `src/models/user.model.ts`：findByEmail, findById, create
- [x] `src/services/auth.service.ts`：register, login, refresh, logout 业务逻辑
- [x] `src/middlewares/auth.ts`：authRequired, authOptional 中间件
- [x] `src/controllers/auth.controller.ts`：5 个接口处理函数
- [x] `src/routes/auth.routes.ts`：注册路由
- [ ] 验证：Postman 测试注册、登录、/me、刷新、登出（等待 MySQL）

### BE-04 Skills 模块
- [x] `src/models/skill.model.ts`：findAll, findById, create, softDelete, incrementDownload
- [x] `src/middlewares/upload.ts`：multer 配置，白名单校验，50MB 限制，uuid 重命名
- [x] `src/services/skill.service.ts`：列表分页、详情、发布、删除、下载计数业务逻辑
- [x] `src/controllers/skill.controller.ts`：5 个接口处理函数
- [x] `src/routes/skill.routes.ts`：注册路由
- [ ] 验证：上传文件、获取列表、下载文件、删除（等待 MySQL）

### BE-05 收藏模块
- [x] `src/models/favorite.model.ts`：findByUser, add, remove, checkExists
- [x] `src/services/favorite.service.ts`：收藏/取消/列表业务逻辑
- [x] `src/controllers/favorite.controller.ts`：3 个接口处理函数
- [x] `src/routes/favorite.routes.ts`：注册路由
- [ ] 验证：收藏、取消收藏、获取列表（等待 MySQL）

### BE-06 排行榜模块
- [x] `src/services/ranking.service.ts`：从 Redis 读取排行，回填 skill 详情
- [x] `src/controllers/ranking.controller.ts`：1 个接口处理函数
- [x] `src/routes/ranking.routes.ts`：注册路由
- [x] `src/jobs/sync-rankings.ts`：每小时将 Redis score 同步到 MySQL download_count
- [ ] 验证：获取总榜和分类榜（等待 MySQL）

### BE-07 首页聚合接口
- [x] `src/services/home.service.ts`：并行获取热门 Skills Top8 + 排行榜 Top5 + 统计数据
- [x] `src/controllers/home.controller.ts`：1 个接口处理函数
- [x] `src/routes/home.routes.ts`：注册路由
- [ ] 验证：GET /api/v1/home 返回完整数据结构（等待 MySQL）

### BE-08 后端集成验证
- [x] 所有路由注册到 `src/index.ts`
- [x] CORS 配置（允许前端开发端口）
- [ ] 完整 API 流程测试（等待 MySQL）

---

## 阶段三：前端

### FE-01 项目初始化
- [x] `npm create vite@latest frontend -- --template react-ts`
- [x] 安装依赖：tailwindcss, axios, react-router-dom, react-hook-form
- [x] 配置 Tailwind（@tailwindcss/vite），写入 design-tokens.md 中的全部主题扩展
- [x] 引入 Google Fonts：Fraunces, Inter, IBM Plex Mono
- [x] 验证：`npm run build` 构建成功（105 modules）

### FE-02 基础设施
- [x] `src/types/index.ts`：IUser, ISkill, IFavorite, IApiResponse 等类型定义
- [x] `src/services/api.ts`：Axios 实例，统一请求/响应拦截器，401 自动刷新
- [x] `src/services/auth.ts`、`skill.ts`、`favorite.ts`、`ranking.ts`、`home.ts`
- [x] `src/hooks/useAuth.tsx`：登录状态管理（Context）
- [x] `src/hooks/useFavorite.ts`：收藏状态切换
- [x] `src/utils/format.ts`：formatFileSize, formatDate, formatNumber

### FE-03 基础组件
- [x] `Button`：primary / secondary / danger，lg / md
- [x] `Input`：带 label、错误提示
- [x] `Textarea`：带 label、错误提示
- [x] `Select`：带 label、选项列表
- [x] `CategoryTabs`：Tab 切换，激活态用深色
- [x] `Pagination`：上一页/下一页/页码
- [x] `EmptyState`：图标 + 标题 + 描述 + 操作按钮
- [x] `SkillCard`：封面图标区、标题、分类徽章、描述、下载数、收藏数、作者
- [x] `RankingRow`：排名数字（Top3 特殊色）、标题、分类、下载数、下载按钮
- [x] `Navbar`：Logo、导航链接、登录态/未登录态右侧区域
- [x] `AuthShowcase`：登录/注册页左侧品牌面板

### FE-04 路由与布局
- [x] `src/App.tsx`：React Router v6 路由配置，8 个页面路由
- [x] `ProtectedRoute`：未登录跳转 `/login`
- [x] `MainLayout`：含 Navbar + 页面内容区
- [x] `AuthLayout`：双栏布局（左侧 AuthShowcase + 右侧卡片）

### FE-05 认证页面
- [x] `LoginPage`：邮箱、密码、登录按钮、去注册链接
- [x] `RegisterPage`：用户名、邮箱、密码、确认密码、注册按钮
- [x] 表单校验：必填、邮箱格式、密码长度、两次密码一致
- [x] 接 API：POST /api/v1/auth/login、/register

### FE-06 排行榜页
- [x] `RankingsPage`：标题 + CategoryTabs + RankingRow 列表
- [x] Top 3 条目特殊高亮（金/银/铜色）
- [x] 接 API：GET /api/v1/rankings/skills?category=

### FE-07 收藏页
- [x] `FavoritesPage`：标题与数量 + 3 列 SkillCard + EmptyState
- [x] 路由保护：未登录跳转 /login
- [x] 接 API：GET /api/v1/favorites

### FE-08 Skills 列表页
- [x] `SkillsListPage`：CategoryTabs + 3 列 SkillCard + Pagination
- [x] 分类 Tab 切换更新查询参数
- [x] 接 API：GET /api/v1/skills?category=&page=&limit=

### FE-09 Skills 详情页
- [x] `SkillDetailPage`：面包屑 + 主信息区 + 文件信息 + 作者卡片 + ActionPanel
- [x] ActionPanel：下载按钮 + 收藏按钮（三态）
- [x] 接 API：GET /api/v1/skills/:id、/:id/download、POST/DELETE /api/v1/favorites

### FE-10 发布 Skills 页
- [x] `SkillPublishPage`：UploadDropzone + 表单
- [x] UploadDropzone：拖拽 + 点击上传，白名单校验
- [x] 路由保护：未登录跳转 /login
- [x] 接 API：POST /api/v1/skills（multipart/form-data）

### FE-11 首页
- [x] `HomePage`：HeroSearch + 热门 Skills + RankingPreview + StatsStrip + Footer
- [x] 接 API：GET /api/v1/home

### FE-12 前端集成验证
- [ ] 完整用户流程测试（等待 MySQL + 后端启动）
- [ ] 桌面端 1440px 视觉对照截图验收
- [ ] 响应式：md/sm 断点收敛
- [ ] 路由保护验证

---

## 验收标准

| 项目 | 标准 |
|------|------|
| 数据库 | 三张表结构正确，索引完整，Redis 连接正常 |
| 后端 | 全部 API 可通过 Postman 测试，认证流程完整 |
| 前端 | 8 个页面视觉还原设计稿，完整业务流程可跑通 |
| 部署 | `npm run dev` 本地可运行，前后端联调无报错 |
