# V1 Core MVP 需求文档

> 状态：已确认 | 日期：2026-03-19

## 目标

构建平台从零到一的可运行版本，支持本地开发和服务器部署。功能形成完整闭环：用户可以注册登录、发布和下载 Skills、收藏喜欢的内容、通过排行榜发现热门资源。

---

## 功能范围

### 1. 首页

- Hero Banner（平台介绍 + 搜索框入口）
- 热门 Skills 卡片列表（下载量 Top 8）
- 排行榜预览（Top 5）
- 平台统计数字（总 Skills 数、总下载数、总用户数）

### 2. 用户认证

- 注册（用户名 + 邮箱 + 密码）
- 登录（返回 JWT，HTTP-only Cookie 存储）
- 登出（清除 Cookie）
- Token 自动刷新
- 获取当前登录用户信息

### 3. Skills 发布

- 需要登录
- 支持文件上传（拖拽 + 点击）
- 填写标题、描述、分类
- 文件类型白名单：`.json` `.yaml` `.yml` `.zip` `.md`
- 文件大小限制：50MB
- 作者可删除自己发布的 Skills

### 4. Skills 下载

- 无需登录
- 点击下载直接获取文件
- 每次下载自动累计计数（Redis + MySQL 双写）

### 5. Skills 收藏

- 需要登录
- 收藏 / 取消收藏
- 我的收藏列表页

### 6. 排行榜

- 按下载量排序
- 支持总榜 + 分类榜（productivity / coding / writing / other）
- 使用 Redis Sorted Set 实现，每小时同步到 MySQL

---

## 页面路由

| 路径 | 页面 | 登录要求 |
|------|------|----------|
| `/` | 首页 | 无需 |
| `/login` | 登录页 | 无需 |
| `/register` | 注册页 | 无需 |
| `/skills` | Skills 列表页 | 无需 |
| `/skills/:id` | Skills 详情页 | 无需 |
| `/skills/publish` | 发布 Skills | 需要 |
| `/favorites` | 我的收藏 | 需要 |
| `/rankings` | 排行榜 | 无需 |

---

## 技术约束

| 项目 | 选型 |
|------|------|
| 前端 | React 18 + TypeScript + Vite + Tailwind CSS |
| 后端 | Node.js 18 + Express + TypeScript |
| 数据库 | MySQL 8.0 |
| 缓存/排行榜 | Redis 7（maxmemory=100mb） |
| 文件存储 | 本地文件系统（`/data/uploads/skills/`） |
| 认证 | JWT + HTTP-only Cookie + Refresh Token |
| 部署 | Nginx + PM2 |

### 服务器内存分配（2核2G）

| 服务 | 内存 |
|------|------|
| 系统预留 | ~300MB |
| Nginx | ~50MB |
| Node.js 后端 | ~400MB |
| Redis | ~100MB |
| MySQL | ~500MB |
| 缓冲 | ~650MB |

---

## 明确不做（V2 实现）

- MCP 配置管理
- 评论系统
- 内容分享（经验文章）
- AI 工具下载区
- OAuth 第三方登录
- 管理后台
- 暗色模式
- 付费功能、实时通知
- 用户头像上传
- 排行榜时间维度（日榜/周榜）
- 文件病毒扫描（V2 集成 ClamAV）

---

## 关联文档

- 技术设计：`openspec/changes/archive/2026-03-19-v1-core-mvp/design.md`
- 任务清单：`openspec/changes/archive/2026-03-19-v1-core-mvp/tasks.md`
