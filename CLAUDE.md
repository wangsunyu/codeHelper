 # AI助手资源分享平台 - Claude开发指南

## 项目简介

这是一个AI助手资源分享平台，用户可以上传和下载MCP配置、Skills技能包，并通过评论、收藏、排行榜等功能进行社区互动。

## ⚠️ 重要提醒

### Pencil设计文件保存
**所有使用Pencil创建的.pen设计文件必须确保保存到磁盘！**

- 创建设计后，文件路径必须是实际存在的物理路径
- 使用 `mcp__pencil__open_document` 时，确保路径正确
- 设计完成后，验证文件是否真实保存在 `designs/current/` 目录
- 如果文件未保存，用户将无法在Pencil中打开和编辑

## 技术栈

### 前端技术栈
- **框架**: React 18+
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **构建工具**: Vite
- **状态管理**: React Context API / Zustand（待定）
- **路由**: React Router v6
- **HTTP客户端**: Axios
- **表单处理**: React Hook Form
- **UI组件**: 自定义组件 + Headless UI

### 后端技术栈
- **运行时**: Node.js 18+
- **框架**: Express
- **语言**: TypeScript
- **认证**: JWT (jsonwebtoken)
- **密码加密**: bcrypt
- **文件上传**: multer
- **验证**: express-validator
- **日志**: winston
- **进程管理**: PM2

### 数据库
- **主数据库**: MySQL 8.0
  - ORM: Prisma / TypeORM（待定）
  - 连接池: mysql2
- **缓存**: Redis
  - 客户端: ioredis
  - 用途: 会话存储、排行榜、缓存

### 开发工具
- **代码规范**: ESLint + Prettier
- **Git Hooks**: Husky
- **提交规范**: Conventional Commits
- **测试**: Jest + Supertest（后端）, Vitest（前端）

### 部署环境
- **服务器**: 2核2G内存，50G SSD
- **Web服务器**: Nginx
- **HTTPS**: Let's Encrypt
- **监控**: PM2 + 自定义监控脚本

## 项目结构

```
ai-assistant-platform/
├── frontend/                 # 前端项目
│   ├── src/
│   │   ├── components/      # 可复用组件
│   │   ├── pages/          # 页面组件
│   │   ├── hooks/          # 自定义Hooks
│   │   ├── services/       # API服务
│   │   ├── utils/          # 工具函数
│   │   ├── types/          # TypeScript类型定义
│   │   └── App.tsx
│   ├── public/
│   └── package.json
├── backend/                  # 后端项目
│   ├── src/
│   │   ├── controllers/    # 控制器
│   │   ├── routes/         # 路由
│   │   ├── models/         # 数据模型
│   │   ├── middlewares/    # 中间件
│   │   ├── services/       # 业务逻辑
│   │   ├── utils/          # 工具函数
│   │   ├── config/         # 配置文件
│   │   └── index.ts
│   ├── migrations/         # 数据库迁移
│   └── package.json
├── docs/                     # 文档
│   └── requirements/        # 需求文档
└── CLAUDE.md                # 本文件
```

## 需求文档

### 总体需求
📋 [总体需求文档](./docs/requirements/00-总体需求.md)

### 子模块需求（开发时创建）
1. 📝 [用户认证系统](./docs/requirements/01-用户认证系统.md) - 待创建
2. 📝 [MCP管理](./docs/requirements/02-MCP管理.md) - 待创建
3. 📝 [Skills管理](./docs/requirements/03-Skills管理.md) - 待创建
4. 📝 [评论系统](./docs/requirements/04-评论系统.md) - 待创建
5. 📝 [收藏系统](./docs/requirements/05-收藏系统.md) - 待创建
6. 📝 [排行榜系统](./docs/requirements/06-排行榜系统.md) - 待创建
7. 📝 [内容分享](./docs/requirements/07-内容分享.md) - 待创建
8. 📝 [AI工具下载](./docs/requirements/08-AI工具下载.md) - 待创建
9. 📝 [文件安全](./docs/requirements/09-文件安全.md) - 待创建

### 技术文档
- 📐 [技术设计文档](./openspec/changes/ai-assistant-resource-platform/design.md)
- 📋 [实施任务清单](./openspec/changes/ai-assistant-resource-platform/tasks.md)
- ⚙️ [MySQL配置文件](./openspec/changes/ai-assistant-resource-platform/mysql-2g-config.cnf)
- ✅ [部署检查清单](./openspec/changes/ai-assistant-resource-platform/deployment-checklist.md)
- 📚 [功能规格文档](./openspec/changes/ai-assistant-resource-platform/specs/)

## 开发规范

### 代码风格
- 使用TypeScript严格模式
- 遵循ESLint和Prettier配置
- 组件使用函数式组件 + Hooks
- 使用async/await处理异步操作
- 错误处理使用try-catch
- API响应统一格式

### 命名规范
- 文件名：kebab-case（user-profile.tsx）
- 组件名：PascalCase（UserProfile）
- 函数名：camelCase（getUserProfile）
- 常量名：UPPER_SNAKE_CASE（MAX_FILE_SIZE）
- 接口名：PascalCase + I前缀（IUser）
- 类型名：PascalCase（UserType）

### Git提交规范
```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建/工具相关
```

### API响应格式
```typescript
// 成功响应
{
  success: true,
  data: any,
  message?: string
}

// 错误响应
{
  success: false,
  error: string,
  code?: string
}
```

## 处理大文件写入的方法

### 问题说明
当需要写入超过50行的文件时，为了避免一次性写入过多内容导致性能问题，应该采用分步写入的方式。

### 解决方案

#### 方案1：使用Write + Edit组合（推荐）

```markdown
1. 使用Write工具写入文件的前50行（包含文件头部和主要结构）
2. 使用Edit工具追加剩余内容
3. 如果内容很多，可以多次使用Edit工具追加
```

**示例**：
```typescript
// 第一步：Write工具写入前50行
// 包含：imports, 接口定义, 前几个函数

// 第二步：Edit工具追加中间部分
// 在文件末尾前插入更多函数

// 第三步：Edit工具追加最后部分
// 添加剩余的工具函数和exports
```

#### 方案2：分文件组织（最佳实践）

将大文件拆分成多个小文件，每个文件职责单一：

```
// 不推荐：一个大文件
user-service.ts (200行)

// 推荐：拆分成多个文件
user/
  ├── user.controller.ts    (50行)
  ├── user.service.ts       (50行)
  ├── user.validator.ts     (30行)
  ├── user.types.ts         (20行)
  └── index.ts              (10行)
```

#### 方案3：使用模板文件

对于重复性高的代码，创建模板文件：

```typescript
// templates/controller.template.ts
// 包含控制器的基本结构

// 然后基于模板生成具体的控制器
// 只需要填充业务逻辑部分
```

### 具体操作步骤

#### 创建大文件时：

1. **规划文件结构**
   - 确定文件的主要部分（imports, types, functions, exports）
   - 估算每部分的行数

2. **第一次Write（前50行）**
   ```typescript
   // 包含：
   // - 所有imports
   // - 类型定义
   // - 前1-2个主要函数
   // - 预留位置注释
   ```

3. **后续Edit追加**
   ```typescript
   // 找到预留位置注释
   // 插入剩余函数
   // 可以分多次插入
   ```

#### 修改大文件时：

1. **使用Read工具先读取文件**
   - 了解文件结构
   - 找到需要修改的位置

2. **使用Edit工具精确修改**
   - 只修改需要改动的部分
   - 避免重写整个文件

### 最佳实践建议

1. **单一职责原则**
   - 每个文件只负责一个功能模块
   - 文件行数控制在100行以内

2. **模块化设计**
   - 将大功能拆分成小模块
   - 使用index.ts统一导出

3. **代码复用**
   - 提取公共逻辑到utils
   - 使用高阶函数减少重复代码

4. **渐进式开发**
   - 先实现核心功能（最小可用版本）
   - 再逐步添加辅助功能
   - 避免一次性写入大量代码

## 开发流程

### 开始新功能开发

1. **查看需求文档**
   ```bash
   # 查看总体需求
   cat docs/requirements/00-总体需求.md

   # 查看具体模块需求（如果已创建）
   cat docs/requirements/01-用户认证系统.md
   ```

2. **创建子模块需求文档（如果不存在）**
   - 基于总体需求和技术设计
   - 详细描述该模块的功能点
   - 列出API接口设计
   - 说明数据库表结构

3. **查看技术设计**
   ```bash
   # 查看技术选型和架构设计
   cat openspec/changes/ai-assistant-resource-platform/design.md
   ```

4. **查看任务清单**
   ```bash
   # 查看实施步骤
   cat openspec/changes/ai-assistant-resource-platform/tasks.md
   ```

5. **开始编码**
   - 遵循代码规范
   - 使用TypeScript类型
   - 编写单元测试
   - 提交代码前运行lint

### 文件写入策略

- **小文件（<50行）**：直接使用Write工具一次性写入
- **中等文件（50-100行）**：Write前50行 + Edit追加
- **大文件（>100行）**：考虑拆分成多个小文件

### 数据库操作

- 使用ORM（Prisma/TypeORM）而不是原生SQL
- 所有查询使用参数化，防止SQL注入
- 复杂查询先在MySQL客户端测试
- 添加适当的索引优化性能

### 错误处理

```typescript
// 统一的错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    code: err.code
  });
});
```

### 日志记录

```typescript
// 使用winston记录日志
logger.info('User logged in', { userId: user.id });
logger.error('Database connection failed', { error: err.message });
```

## 环境变量配置

### 后端 .env 示例

```env
# 服务器配置
PORT=3000
NODE_ENV=production

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=app_user
DB_PASSWORD=your_secure_password
DB_NAME=ai_platform

# Redis配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT配置
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRES_IN=30d

# 文件上传配置
UPLOAD_DIR=/data/uploads
MAX_FILE_SIZE_MCP=10485760    # 10MB
MAX_FILE_SIZE_SKILLS=52428800 # 50MB

# 安全配置
BCRYPT_ROUNDS=10
```

## 常用命令

### 开发环境

```bash
# 安装依赖
cd frontend && npm install
cd backend && npm install

# 启动开发服务器
cd frontend && npm run dev    # 前端开发服务器
cd backend && npm run dev     # 后端开发服务器

# 代码检查
npm run lint
npm run format

# 运行测试
npm run test
```

### 生产环境

```bash
# 构建
cd frontend && npm run build
cd backend && npm run build

# 启动（使用PM2）
pm2 start dist/index.js --name api --max-memory-restart 400M
pm2 save
pm2 startup
```

## 性能优化建议

### 前端优化
- 使用React.lazy()和Suspense进行代码分割
- 图片使用WebP格式并压缩
- 使用虚拟滚动处理长列表
- 合理使用useMemo和useCallback
- 启用Nginx gzip压缩

### 后端优化
- 使用Redis缓存热点数据
- 数据库查询添加适当索引
- 使用连接池管理数据库连接
- 实施API限流
- 使用PM2集群模式（如果需要）

### 数据库优化
- 合理设计索引
- 避免N+1查询
- 使用EXPLAIN分析慢查询
- 定期优化表
- 使用Redis缓存查询结果

## 安全注意事项

1. **永远不要**在代码中硬编码密码和密钥
2. **永远不要**信任用户输入，必须验证和清理
3. **永远不要**在客户端存储敏感信息
4. **必须**使用HTTPS加密传输
5. **必须**对密码进行加密存储
6. **必须**实施CSRF防护
7. **必须**设置合适的CORS策略
8. **必须**对上传文件进行安全检查

## 监控和维护

### 日常监控
```bash
# 查看系统资源
free -h
df -h
top

# 查看应用状态
pm2 status
pm2 logs

# 查看数据库状态
mysqladmin -u root -p status
```

### 备份策略
- 数据库：每日自动备份
- 文件：每周自动备份
- 保留最近30天的备份

## 问题排查

### 常见问题

1. **内存不足**
   - 检查各服务内存使用
   - 调整PM2内存限制
   - 考虑优化代码或升级服务器

2. **数据库连接失败**
   - 检查MySQL服务状态
   - 检查连接配置
   - 检查连接数是否超限

3. **文件上传失败**
   - 检查磁盘空间
   - 检查目录权限
   - 检查文件大小限制

4. **Redis连接失败**
   - 检查Redis服务状态
   - 检查连接配置
   - 检查内存使用

## 联系和支持

- 项目文档：`docs/` 目录
- 需求文档：`docs/requirements/` 目录
- 技术设计：`openspec/changes/ai-assistant-resource-platform/` 目录

## UI设计方案

本项目采用**Pencil设计工具**进行UI设计，实现需求→设计→代码的全自动化工作流。

### 设计文档

📐 **[完整设计指南](./docs/design-guide.md)** - Pencil设计方案、工作流、版本管理

📌 **[设计全局配置](./designs/design-tokens.md)** - 颜色、间距、字体等全局 Token（非必要不修改）

📋 **[设计版本记录](./designs/versions/DESIGN_VERSIONS.md)** - 所有设计变更的版本历史

### 快速开始

当你说"帮我设计"时，只需提供：

**最简单的方式：**
```
"帮我设计首页"
"帮我设计MCP列表页"
"帮我设计整个平台的UI"
```

**提供更多信息（可选）：**
- 设计范围：需要设计哪些页面
- 风格偏好：现代/简约/科技感/温暖（默认：现代简约）
- 主色调：蓝色/绿色/橙色/紫色（默认：蓝色）
- 特殊要求：参考网站、特殊功能、布局偏好

### 设计工作流

```
需求 → Pencil设计 → 截图确认 → 生成代码 → 需求迭代 → 自动同步
```

### 设计文件组织

```
designs/
├── versions/              # 设计版本记录
│   └── DESIGN_VERSIONS.md
├── current/               # 当前版本设计文件
│   ├── homepage.pen
│   ├── mcp-list.pen
│   └── ...
├── screenshots/           # 设计截图
└── archive/               # 历史版本归档
    ├── v0.1.0/
    └── v0.2.0/
```

### 版本管理

- 采用语义化版本号：`v{major}.{minor}.{patch}`
- 每次重要变更创建新版本并记录
- 历史版本自动归档到 `designs/archive/`
- 详见：[设计版本记录](./designs/versions/DESIGN_VERSIONS.md)

### 更多信息

详细的设计流程、规范、注意事项等，请查看：
- 📐 [完整设计指南](./docs/design-guide.md)

## 服务器配置

### 服务器信息
- **IP**: 39.103.65.215
- **系统**: Alibaba Cloud Linux 3
- **用户**: ecs-assist-user
- **Git 仓库**: https://github.com/wangsunyu/codeHelper.git

### 数据库密码（生产环境）
```
DB_USER=app_user
DB_PASSWORD=vR52Gqf50jJBvFxvF7c3
DB_NAME=ai_platform

REDIS_PASSWORD=u0SCC2cNrlGXl0UjMrEO

JWT_SECRET=27hufG5F0qLcQPwtOxrabacEAYBG2CKV
JWT_REFRESH_SECRET=uQID5xvAEXQf7xi4nWkUfy1ffzMUM565
```

### 文档
- 📋 [部署总结](./docs/deployment.md) - 完整部署记录、服务器信息、注意事项

## 远程部署能力

Claude 可以直接通过 SSH 连接服务器执行操作，无需人工介入。

### 触发方式

| 用户说 | Claude 执行的操作 |
|--------|-----------------|
| 帮我更新线上部署 | 拉取最新代码、重新构建、重启服务 |
| 查看线上日志 | SSH 连接后执行 `pm2 logs api` |
| 线上服务挂了 | 检查 PM2 状态和错误日志，自动修复 |
| 查看服务器状态 | 检查内存、磁盘、进程状态 |

### SSH 连接方式（Claude 内部使用）

```bash
# 免密登录（本地 ~/.ssh/id_rsa 已授权）
ssh ecs-assist-user@39.103.65.215 "command"

# 上传文件
scp local_file ecs-assist-user@39.103.65.215:/home/ecs-assist-user/app/
```

### 一键更新部署

**部署方式：git push 到服务器（push-to-deploy）**

```bash
# 本地推送代码，服务器自动构建+部署
make deploy
# 等价于：git push prod main
```

服务器 git hook 自动执行：DB 备份 → 智能 npm install → 构建前后端 → 版本化 release → 切换软链 → PM2 重启 → 健康检查（失败自动回滚）

```bash
# 手动在服务器执行（不含 git pull）
ssh ecs-assist-user@39.103.65.215 "bash ~/app/scripts/deploy.sh"
```

### 回滚

```bash
# 回滚到上一版本
make rollback

# 回滚到指定版本
make rollback VERSION=20260321_113940

# 查看可用版本
make versions
```

### 常用运维命令（Claude 可直接执行）

```bash
# 查看后端日志
ssh ecs-assist-user@39.103.65.215 "pm2 logs api --lines 50 --nostream"

# 查看服务状态
ssh ecs-assist-user@39.103.65.215 "pm2 list && sudo systemctl status nginx"

# 查看系统资源
ssh ecs-assist-user@39.103.65.215 "free -h && df -h /"

# 重启后端
ssh ecs-assist-user@39.103.65.215 "pm2 restart api"

# 查看 Nginx 错误日志
ssh ecs-assist-user@39.103.65.215 "sudo tail -20 /var/log/nginx/error.log"
```

## 更新日志

- 2024-03-18: 初始化项目文档，完成需求梳理和技术选型
- 2026-03-18: 添加Pencil UI设计方案，建立设计版本管理体系
- 2026-03-20: 完成生产环境首次部署，配置远程部署能力
