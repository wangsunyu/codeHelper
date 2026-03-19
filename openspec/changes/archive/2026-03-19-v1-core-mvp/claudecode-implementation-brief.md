# V1 Core MVP ClaudeCode 开发执行文档

## 目的

本文档面向 ClaudeCode，目标是让其在不反复追问上下文的前提下，直接依据需求文档、设计稿和设计交接文档进入前端开发。

## 必读输入文档

ClaudeCode 在开始开发前应按下面顺序阅读：

1. `docs/requirements/10-v1-core-mvp.md`
2. `openspec/changes/archive/2026-03-19-v1-core-mvp/design.md`
3. `designs/design-tokens.md`
4. `openspec/changes/archive/2026-03-19-v1-core-mvp/ui-design-handoff.md`
5. `openspec/changes/archive/2026-03-19-v1-core-mvp/tasks.md`

## 原始需求摘要

以下内容来自 `docs/requirements/10-v1-core-mvp.md`，属于本次开发必须覆盖的范围。

### 功能目标

- 首页展示平台介绍、热门 Skills、排行榜预览、平台统计
- 用户注册、登录、登出、获取当前登录用户、Token 自动刷新
- Skills 发布、详情查看、下载、删除
- 收藏与取消收藏、我的收藏页
- 下载排行榜与分类榜

### 页面路由

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

### 明确不做

- MCP 管理
- 评论系统
- 内容分享文章
- AI 工具下载区
- OAuth
- 管理后台
- 暗色模式

开发过程中不要擅自扩展到这些范围。

## 设计资产

### Pencil 源文件

- `designs/current/homepage.pen`
- `designs/current/skills-list.pen`
- `designs/current/skills-detail.pen`
- `designs/current/skills-publish.pen`
- `designs/current/login.pen`
- `designs/current/register.pen`
- `designs/current/favorites.pen`
- `designs/current/rankings.pen`

### 页面截图

- `designs/screenshots/homepage.png`
- `designs/screenshots/skills-list.png`
- `designs/screenshots/skills-detail.png`
- `designs/screenshots/skills-publish.png`
- `designs/screenshots/login.png`
- `designs/screenshots/register.png`
- `designs/screenshots/favorites.png`
- `designs/screenshots/rankings.png`

## 视觉与实现原则

- 严格遵循 `designs/design-tokens.md`
- 先保证桌面端 1440px 版本还原，再做响应式收敛
- 业务页导航样式统一
- 卡片、Tab、榜单条目等可复用部分优先组件化
- 认证页保持比业务页更聚焦的双区/单卡表达，不要混入首页式复杂区块
- 如果设计稿与旧探索稿冲突，以当前 `.pen` 和 `.png` 为准

## 页面实现清单

### 1. 首页 `/`

对应设计：

- `designs/current/homepage.pen`
- `designs/screenshots/homepage.png`

必须包含：

- 导航栏
- Hero 标题、副标题、搜索入口
- 热门 Skills 区
- 排行榜预览区
- 平台统计区
- Footer

建议拆分：

- `Navbar`
- `HeroSearch`
- `SkillCard`
- `RankingPreview`
- `StatsStrip`
- `Footer`

数据来源建议：

- `GET /api/v1/home`

### 2. Skills 列表页 `/skills`

对应设计：

- `designs/current/skills-list.pen`
- `designs/screenshots/skills-list.png`

必须包含：

- 标题
- 分类 Tab
- 3 列卡片
- 分页

建议拆分：

- `PageHeader`
- `CategoryTabs`
- `SkillCard`
- `Pagination`

数据来源建议：

- `GET /api/v1/skills`

### 3. Skills 详情页 `/skills/:id`

对应设计：

- `designs/current/skills-detail.pen`
- `designs/screenshots/skills-detail.png`

必须包含：

- 面包屑
- 标题与分类
- 描述
- 文件信息
- 作者卡片
- 下载按钮
- 收藏按钮
- 下载数/收藏数

建议拆分：

- `Breadcrumbs`
- `SkillDetailMain`
- `SkillAuthorCard`
- `ActionPanel`

数据来源建议：

- `GET /api/v1/skills/:id`
- `GET /api/v1/skills/:id/download`
- `POST /api/v1/favorites`
- `DELETE /api/v1/favorites/:skillId`

### 4. 发布 Skills 页 `/skills/publish`

对应设计：

- `designs/current/skills-publish.pen`
- `designs/screenshots/skills-publish.png`

必须包含：

- 上传拖拽区
- 标题输入
- 分类选择
- 描述文本域
- 限制说明
- 提交按钮

建议拆分：

- `UploadDropzone`
- `SkillPublishForm`

数据来源建议：

- `POST /api/v1/skills`

### 5. 登录页 `/login`

对应设计：

- `designs/current/login.pen`
- `designs/screenshots/login.png`

必须包含：

- 左侧品牌内容区
- 右侧登录卡片
- 邮箱输入
- 密码输入
- 登录按钮
- 去注册链接

建议拆分：

- `AuthShowcase`
- `LoginForm`

数据来源建议：

- `POST /api/v1/auth/login`

### 6. 注册页 `/register`

对应设计：

- `designs/current/register.pen`
- `designs/screenshots/register.png`

必须包含：

- 左侧品牌面板
- 右侧注册卡片
- 用户名、邮箱、密码、确认密码
- 注册按钮
- 去登录链接

建议拆分：

- `AuthShowcase`
- `RegisterForm`

数据来源建议：

- `POST /api/v1/auth/register`

### 7. 我的收藏页 `/favorites`

对应设计：

- `designs/current/favorites.pen`
- `designs/screenshots/favorites.png`

必须包含：

- 已登录导航
- 标题和收藏数量
- 3 列收藏卡片
- 空状态

建议拆分：

- `Navbar`
- `PageHeader`
- `SkillCard`
- `EmptyState`

数据来源建议：

- `GET /api/v1/favorites`

### 8. 排行榜页 `/rankings`

对应设计：

- `designs/current/rankings.pen`
- `designs/screenshots/rankings.png`

必须包含：

- 标题
- 分类 Tab
- 排行榜列表
- Top 3 特殊高亮
- 下载按钮

建议拆分：

- `CategoryTabs`
- `RankingRow`

数据来源建议：

- `GET /api/v1/rankings/skills`

## 推荐组件清单

建议优先创建以下可复用组件：

- `Navbar`
- `Button`
- `Input`
- `Textarea`
- `Select`
- `SkillCard`
- `CategoryTabs`
- `Pagination`
- `EmptyState`
- `RankingRow`
- `AuthShowcase`
- `AuthCard`

## 推荐开发顺序

### 第一阶段：基础骨架

- 搭建 React Router 路由
- 建立页面目录
- 建立全局布局与导航
- 建立全局设计 Token 对应的 Tailwind 变量或主题层

### 第二阶段：基础组件

- Button
- Input
- Card
- Tabs
- Pagination
- EmptyState

### 第三阶段：认证与静态页面

- `/login`
- `/register`
- `/favorites`
- `/rankings`

这四页组件边界更清晰，适合先做出完整视觉体系。

### 第四阶段：资源主流程页面

- `/`
- `/skills`
- `/skills/:id`
- `/skills/publish`

### 第五阶段：接 API

- 先接认证
- 再接首页聚合接口
- 再接 Skills 列表、详情、发布
- 最后接收藏与排行榜

## 交互与状态要求

- 登录状态决定导航栏右侧内容
- `/skills/publish` 和 `/favorites` 需要路由级登录保护
- 收藏按钮应区分未登录、已收藏、未收藏三种状态
- 下载按钮在详情页和排行榜页都要有一致的视觉层级
- 排行榜 Tab 切换必须映射分类参数

## 实现时的注意事项

- 不要自行发明新页面结构，优先对齐现有截图
- 不要过度装饰动画，优先保证布局、间距、圆角、配色正确
- 注册页以当前最终版本为准，左侧文案已经为前端收敛过
- `favorites` 页面同时包含“有内容列表态”和“空状态展示块”，可以先做静态结构，后续按数据切换
- `rankings` 的 Top 3 是样式状态，不要写死成三套完全独立结构

## 与现有任务的关系

此文档是以下文档的执行补充，不替代原文：

- `docs/requirements/10-v1-core-mvp.md`
- `openspec/changes/archive/2026-03-19-v1-core-mvp/design.md`
- `openspec/changes/archive/2026-03-19-v1-core-mvp/tasks.md`
- `openspec/changes/archive/2026-03-19-v1-core-mvp/ui-design-handoff.md`

ClaudeCode 应同时参考这几份文档，但前端落地时优先使用本文档作为开发顺序与页面实现说明。
