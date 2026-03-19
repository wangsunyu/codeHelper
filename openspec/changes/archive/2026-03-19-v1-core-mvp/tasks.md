## 1. 项目初始化

- [ ] 1.1 创建前端项目（React + TypeScript + Vite）
- [ ] 1.2 创建后端项目（Node.js + Express + TypeScript）
- [ ] 1.3 配置 Tailwind CSS
- [ ] 1.4 配置 ESLint + Prettier
- [ ] 1.5 创建 `.env.example` 和 `.gitignore`
- [ ] 1.6 创建本地开发启动脚本（`dev.sh`）

## 2. 数据库初始化

- [ ] 2.1 编写 MySQL 建表 SQL（users、skills、favorites）
- [ ] 2.2 配置 MySQL 连接（mysql2 + 连接池）
- [ ] 2.3 配置 Redis 连接（ioredis）
- [ ] 2.4 创建数据库初始化脚本（`scripts/init-db.sql`）
- [ ] 2.5 编写 MySQL 2G 内存优化配置（`my.cnf`）

## 3. 后端 - 用户认证

- [ ] 3.1 实现注册 API（POST /api/v1/auth/register）
  - 用户名/邮箱唯一校验
  - bcrypt 密码加密
- [ ] 3.2 实现登录 API（POST /api/v1/auth/login）
  - 返回 access token（HTTP-only cookie）+ refresh token
- [ ] 3.3 实现登出 API（POST /api/v1/auth/logout）
- [ ] 3.4 实现 token 刷新 API（POST /api/v1/auth/refresh）
- [ ] 3.5 实现获取当前用户 API（GET /api/v1/auth/me）
- [ ] 3.6 实现 JWT 认证中间件

## 4. 后端 - Skills 管理

- [ ] 4.1 实现文件上传中间件（multer，白名单校验，50MB 限制，uuid 重命名）
- [ ] 4.2 实现发布 Skills API（POST /api/v1/skills，需登录）
- [ ] 4.3 实现 Skills 列表 API（GET /api/v1/skills，支持分页/分类/排序）
- [ ] 4.4 实现 Skills 详情 API（GET /api/v1/skills/:id）
- [ ] 4.5 实现 Skills 下载 API（GET /api/v1/skills/:id/download）
  - 无需登录
  - 下载后 Redis ZINCRBY + MySQL download_count +1
- [ ] 4.6 实现删除 Skills API（DELETE /api/v1/skills/:id，仅作者）

## 5. 后端 - 收藏系统

- [ ] 5.1 实现添加收藏 API（POST /api/v1/favorites，需登录）
- [ ] 5.2 实现取消收藏 API（DELETE /api/v1/favorites/:skillId，需登录）
- [ ] 5.3 实现我的收藏列表 API（GET /api/v1/favorites，需登录）

## 6. 后端 - 排行榜

- [ ] 6.1 实现 Redis Sorted Set 排行榜写入（下载时触发）
- [ ] 6.2 实现排行榜查询 API（GET /api/v1/rankings/skills）
  - 支持 `?category=all|productivity|coding|writing&limit=10`
- [ ] 6.3 实现定时任务：每小时同步 Redis 下载数到 MySQL

## 7. 后端 - 首页数据

- [ ] 7.1 实现首页聚合 API（GET /api/v1/home）
  - 热门 Skills（下载量 Top 8）
  - 排行榜 Top 5
  - 平台统计（总 Skills 数、总下载数、总用户数）

## 8. 前端 - 基础架构

- [ ] 8.1 配置 React Router v6 路由
- [ ] 8.2 实现全局认证状态管理（Context + useReducer）
- [ ] 8.3 封装 Axios 请求实例（baseURL、拦截器、错误处理）
- [ ] 8.4 创建通用组件：Button、Input、Card、Loading、Toast
- [ ] 8.5 创建导航栏组件（含登录状态切换）
- [ ] 8.6 创建页脚组件

## 9. 前端 - 用户认证页面

- [ ] 9.1 创建登录页（/login）
- [ ] 9.2 创建注册页（/register）
- [ ] 9.3 实现登录/注册表单校验（React Hook Form）
- [ ] 9.4 实现登录后跳转逻辑

## 10. 前端 - 首页

- [ ] 10.1 创建首页（/）
  - Hero Banner（平台介绍 + 搜索框）
  - 热门 Skills 卡片列表
  - 排行榜预览（Top 5）
  - 平台统计数字

## 11. 前端 - Skills 页面

- [ ] 11.1 创建 Skills 列表页（/skills）
  - 分类筛选 Tab
  - 卡片网格布局
  - 分页
- [ ] 11.2 创建 Skills 详情页（/skills/:id）
  - 文件信息、描述、作者
  - 下载按钮（无需登录）
  - 收藏按钮（需登录）
- [ ] 11.3 创建发布 Skills 页（/skills/publish，需登录）
  - 文件上传拖拽区
  - 标题/描述/分类表单

## 12. 前端 - 收藏与排行榜页面

- [ ] 12.1 创建我的收藏页（/favorites，需登录）
- [ ] 12.2 创建排行榜页（/rankings）
  - 分类 Tab 切换
  - 排名列表（含下载数）

## 13. 部署配置

- [ ] 13.1 编写 Nginx 配置（反向代理 + 静态文件服务）
- [ ] 13.2 编写 PM2 配置（`ecosystem.config.js`）
- [ ] 13.3 编写生产环境部署脚本（`scripts/deploy.sh`）
- [ ] 13.4 编写本地开发环境 README（`README.md`）
- [ ] 13.5 编写 MySQL 2G 内存优化配置（`my.cnf`）
