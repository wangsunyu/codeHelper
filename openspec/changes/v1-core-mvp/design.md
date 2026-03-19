## Context

V1 MVP 版本，目标是在 2核2G 云服务器上稳定运行，同时支持本地开发环境一键启动。功能范围严格限定在：首页、用户认证、Skills 发布/下载/收藏/排行榜。

## Goals / Non-Goals

**Goals:**
- 完整的前后端项目，本地 `npm run dev` 可运行
- 生产环境 Nginx + PM2 部署方案
- 用户注册/登录/登出（JWT + HTTP-only Cookie）
- Skills 发布（文件上传 + 元数据）
- Skills 下载（无需登录，自动计数）
- Skills 收藏（需登录）
- Skills 排行榜（Redis Sorted Set，总榜 + 分类榜）
- 首页展示热门 Skills 和排行榜预览

**Non-Goals:**
- MCP 管理、评论、文章分享、AI 工具下载
- OAuth 登录、管理后台、暗色模式
- 付费功能、实时通知

## Decisions

### 1. 技术栈

| 层级 | 技术 | 理由 |
|------|------|------|
| 前端 | React 18 + TypeScript + Vite + Tailwind CSS | 生态成熟，构建快，样式灵活 |
| 后端 | Node.js 18 + Express + TypeScript | 轻量，与前端同语言，团队熟悉 |
| 数据库 | MySQL 8.0 | 2G 内存下比 PostgreSQL 更省资源（~300-500MB） |
| 缓存/排行榜 | Redis 7 | Sorted Set 天然适合排行榜，内存限制 100MB |
| 文件存储 | 本地文件系统（`/data/uploads/skills/`） | V1 简单可靠，V2 可迁移对象存储 |
| 认证 | JWT + HTTP-only Cookie + Refresh Token | 防 XSS，无状态易扩展 |
| 部署 | Nginx + PM2 | 成熟稳定，支持进程守护和零停机重启 |

### 2. 数据库 Schema

```sql
-- 用户表
CREATE TABLE users (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username    VARCHAR(50) NOT NULL UNIQUE,
  email       VARCHAR(100) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,         -- bcrypt hash
  avatar_url  VARCHAR(500),
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email)
);

-- Skills 表
CREATE TABLE skills (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id       INT UNSIGNED NOT NULL,
  title         VARCHAR(200) NOT NULL,
  description   TEXT,
  category      VARCHAR(50) NOT NULL,         -- 分类：productivity/coding/writing/other
  file_path     VARCHAR(500) NOT NULL,        -- 服务器存储路径
  file_name     VARCHAR(200) NOT NULL,        -- 原始文件名
  file_size     INT UNSIGNED NOT NULL,        -- 字节数
  download_count INT UNSIGNED DEFAULT 0,
  favorite_count INT UNSIGNED DEFAULT 0,
  status        ENUM('active','deleted') DEFAULT 'active',
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user_id (user_id),
  INDEX idx_category (category),
  INDEX idx_download_count (download_count DESC),
  INDEX idx_created_at (created_at DESC)
);

-- 收藏表
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

### 3. API 设计

**认证**
```
POST /api/v1/auth/register    注册
POST /api/v1/auth/login       登录（返回 JWT cookie）
POST /api/v1/auth/logout      登出（清除 cookie）
POST /api/v1/auth/refresh     刷新 token
GET  /api/v1/auth/me          获取当前用户信息
```

**Skills**
```
GET    /api/v1/skills              列表（支持分页、分类筛选、排序）
POST   /api/v1/skills              发布（需登录，multipart/form-data）
GET    /api/v1/skills/:id          详情
GET    /api/v1/skills/:id/download 下载文件（无需登录，自动计数）
DELETE /api/v1/skills/:id          删除（需登录，仅作者）
```

**收藏**
```
POST   /api/v1/favorites           添加收藏（需登录）
DELETE /api/v1/favorites/:skillId  取消收藏（需登录）
GET    /api/v1/favorites           我的收藏列表（需登录）
```

**排行榜**
```
GET /api/v1/rankings/skills        Skills 排行榜（?category=all|productivity|coding|writing&limit=10）
```

**首页**
```
GET /api/v1/home                   首页数据（热门 Skills + 排行榜 Top5 + 统计数据）
```

### 4. 排行榜实现

使用 Redis Sorted Set：
- Key: `ranking:skills:all`、`ranking:skills:coding` 等
- Score: 下载次数
- 每次下载时：`ZINCRBY ranking:skills:all 1 <skill_id>`
- 获取排行：`ZREVRANGE ranking:skills:all 0 9 WITHSCORES`
- 每小时同步一次 Redis 数据到 MySQL `download_count` 字段（定时任务）

### 5. 文件上传安全

- 文件类型白名单：`.json`、`.yaml`、`.yml`、`.zip`、`.md`
- 文件大小限制：50MB
- 文件名重命名：`uuid + 原始扩展名`，防止路径遍历
- 存储路径：`/data/uploads/skills/<uuid>.<ext>`

### 6. 前端页面结构

```
/                    首页
/login               登录页
/register            注册页
/skills              Skills 列表页
/skills/:id          Skills 详情页
/skills/publish      发布 Skills（需登录）
/favorites           我的收藏（需登录）
/rankings            排行榜页
```

### 7. 内存分配（2G 服务器）

```
系统预留:     ~300MB
Nginx:        ~50MB
Node.js 后端: ~400MB
Redis:        ~100MB (maxmemory=100mb)
MySQL:        ~500MB (innodb_buffer_pool_size=512M)
缓冲:         ~650MB
```

## Open Questions

1. Skills 文件是否需要病毒扫描？V1 先做文件类型白名单，V2 集成 ClamAV
2. 用户头像是否支持上传？V1 暂不支持，使用默认头像
3. 排行榜是否需要时间维度（日榜/周榜）？V1 只做总榜，V2 扩展
