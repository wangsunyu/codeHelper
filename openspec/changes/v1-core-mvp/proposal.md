## Why

当前平台需要一个可以本地运行、可部署上线的 MVP 版本。用户需要能够浏览首页、注册登录账号、发布和下载 Skills 技能包、收藏喜欢的 Skills，并通过排行榜发现热门资源。这是平台从零到一的关键版本，所有功能必须形成完整闭环。

## What Changes

- 实现完整的首页（展示平台介绍、热门 Skills、排行榜入口）
- 实现用户注册和登录页面（用户名 + 密码）
- 实现 Skills 发布功能（需登录）
- 实现 Skills 下载功能（无需登录）
- 实现 Skills 收藏功能（需登录）
- 实现 Skills 下载排行榜（按下载量排序）
- 本地开发环境一键启动，生产环境支持服务器部署

## Capabilities

### New Capabilities

- `homepage`: 平台首页，展示 Banner、热门 Skills 卡片列表、排行榜预览、平台统计数据
- `user-auth`: 用户注册、登录、登出，JWT + HTTP-only Cookie 认证，前端认证状态管理
- `skills-publish`: 登录用户发布 Skills（标题、描述、分类、文件上传），支持文件类型和大小校验
- `skills-download`: 任意用户下载 Skills 文件，下载时自动累计下载计数
- `skills-favorites`: 登录用户收藏/取消收藏 Skills，个人收藏列表页
- `skills-ranking`: Skills 下载排行榜，支持总榜和分类榜，使用 Redis Sorted Set 实现

### Modified Capabilities

<!-- 无现有功能需要修改，全新项目 -->

## Impact

- 需要搭建完整的前后端项目结构（React + Express + TypeScript）
- 需要初始化 MySQL 数据库（用户表、Skills 表、收藏表）
- 需要配置 Redis（下载计数排行榜）
- 需要本地文件存储（Skills 文件上传）
- 需要 Nginx 配置（生产部署）
- 不涉及 MCP 管理、评论系统、内容分享、AI 工具下载等功能（V2 实现）

## Non-Goals

- 不实现 MCP 配置管理
- 不实现评论系统
- 不实现内容分享（经验文章）
- 不实现 AI 工具下载区
- 不实现 OAuth 第三方登录
- 不实现暗色模式
- 不实现管理后台
