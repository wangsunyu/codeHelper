# V1 Core MVP 开发计划 — Proposal

## 背景

需求文档（`docs/requirements/10-v1-core-mvp.md`）和 UI 设计稿（`designs/current/`）均已完成。
本 change 的目标是将已有需求和设计转化为可执行的代码开发计划，按「数据库 → 后端 → 前端」顺序推进，确保每一层都有清晰的交付物和验收标准。

## 要做什么

1. **数据库层**：建立 MySQL Schema（users / skills / favorites）+ Redis 排行榜 key 规范
2. **后端层**：基于 Express + TypeScript 实现全部 REST API，含认证、Skills CRUD、收藏、排行榜、首页聚合
3. **前端层**：基于 React 18 + Vite + Tailwind CSS，严格还原 8 个设计页面，先桌面端后响应式

## 为什么这样做

- 数据库先行：后端和前端都依赖 Schema，先定好字段和索引可以避免后期改表
- 后端先于前端：前端接 API 时需要真实数据结构，Mock 数据只用于开发阶段过渡
- 前端严格还原设计：设计稿已经过多轮确认，直接按截图和 `.pen` 文件实现，不重新设计

## 不做什么

- MCP 管理、评论系统、内容分享文章、AI 工具下载区
- OAuth 登录、管理后台、暗色模式
- 付费功能、实时通知、用户头像上传
- 排行榜时间维度（日榜/周榜）
- 文件病毒扫描（V2 集成 ClamAV）
