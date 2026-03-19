# AI助手资源分享平台

一个用于分享和下载MCP配置、Skills技能包的社区平台。

## 项目状态

🚧 **当前阶段**：需求梳理完成，准备开始开发

## 快速开始

### 查看项目文档

1. **开发指南**：[CLAUDE.md](./CLAUDE.md) - 包含技术栈、开发规范、常用命令
2. **需求文档**：[docs/requirements/](./docs/requirements/) - 详细的功能需求
3. **技术设计**：[openspec/changes/ai-assistant-resource-platform/](./openspec/changes/ai-assistant-resource-platform/) - 技术选型和架构设计

### 开始开发

```bash
# 1. 查看开发指南
cat CLAUDE.md

# 2. 查看总体需求
cat docs/requirements/00-总体需求.md

# 3. 查看技术设计
cat openspec/changes/ai-assistant-resource-platform/design.md

# 4. 查看任务清单
cat openspec/changes/ai-assistant-resource-platform/tasks.md
```

## 技术栈

- **前端**：React + TypeScript + Tailwind CSS
- **后端**：Node.js + Express + TypeScript
- **数据库**：MySQL 8.0 + Redis
- **部署**：Nginx + PM2（2核2G云服务器）

## 项目结构

```
.
├── CLAUDE.md                 # Claude开发指南
├── README.md                 # 本文件
├── docs/                     # 文档目录
│   └── requirements/         # 需求文档
│       ├── README.md         # 需求文档说明
│       ├── 00-总体需求.md    # 总体需求
│       └── ...               # 子模块需求（待创建）
├── openspec/                 # OpenSpec规划文档
│   └── changes/
│       └── ai-assistant-resource-platform/
│           ├── proposal.md              # 项目提案
│           ├── design.md                # 技术设计
│           ├── tasks.md                 # 任务清单
│           ├── specs/                   # 功能规格
│           ├── mysql-2g-config.cnf      # MySQL配置
│           └── deployment-checklist.md  # 部署清单
├── frontend/                 # 前端项目（待创建）
└── backend/                  # 后端项目（待创建）
```

## 核心功能

- ✅ 用户注册和登录
- ✅ MCP配置文件上传下载
- ✅ Skills技能包上传下载
- ✅ 资源搜索和浏览
- ✅ 评论和讨论
- ✅ 收藏功能
- ✅ 下载排行榜
- ✅ AI使用心得分享
- ✅ AI工具推荐

## 开发阶段

### 第一阶段：基础设施（进行中）
- [x] 需求梳理
- [x] 技术选型
- [ ] 项目初始化
- [ ] 数据库设计
- [ ] 用户认证系统

### 第二阶段：核心功能
- [ ] MCP管理
- [ ] Skills管理
- [ ] 文件上传下载
- [ ] 搜索功能

### 第三阶段：社区功能
- [ ] 评论系统
- [ ] 收藏系统
- [ ] 排行榜

### 第四阶段：扩展功能
- [ ] 内容分享
- [ ] AI工具下载区

### 第五阶段：部署上线
- [ ] 性能优化
- [ ] 安全加固
- [ ] 部署配置
- [ ] 监控告警

## 部署环境

- **服务器配置**：2核CPU，2G内存，50G SSD
- **操作系统**：Ubuntu 20.04+
- **域名**：待配置
- **HTTPS**：Let's Encrypt

## 资源限制

由于服务器资源有限（2G内存），项目采用了针对性的优化：

- MySQL配置优化（512MB buffer pool）
- Redis内存限制（100MB）
- Node.js内存限制（400MB）
- 使用本地文件存储（初期）
- 合理的连接池配置

详见：[技术设计文档](./openspec/changes/ai-assistant-resource-platform/design.md)

## 开发规范

- 使用TypeScript严格模式
- 遵循ESLint和Prettier配置
- Git提交遵循Conventional Commits
- 代码审查后合并
- 编写单元测试

详见：[CLAUDE.md](./CLAUDE.md)

## 文档说明

### 需求文档
- **位置**：`docs/requirements/`
- **说明**：包含总体需求和各子模块的详细需求
- **使用**：开发前先查看对应模块的需求文档

### 技术文档
- **位置**：`openspec/changes/ai-assistant-resource-platform/`
- **说明**：包含技术设计、任务清单、配置文件等
- **使用**：了解技术选型和实施方案

### 开发指南
- **位置**：`CLAUDE.md`
- **说明**：包含技术栈、开发规范、常用命令等
- **使用**：开发过程中的参考手册

## 常见问题

### 如何开始开发某个功能？

1. 查看 `docs/requirements/00-总体需求.md` 了解整体
2. 查看或创建对应的子模块需求文档
3. 查看 `openspec/changes/ai-assistant-resource-platform/design.md` 了解技术方案
4. 查看 `openspec/changes/ai-assistant-resource-platform/tasks.md` 了解任务分解
5. 开始编码

### 如何处理大文件写入？

参考 `CLAUDE.md` 中的"处理大文件写入的方法"章节。

### 数据库如何配置？

使用 `openspec/changes/ai-assistant-resource-platform/mysql-2g-config.cnf` 配置文件。

### 如何部署？

参考 `openspec/changes/ai-assistant-resource-platform/deployment-checklist.md` 部署清单。

## 贡献指南

1. 创建功能分支
2. 编写代码和测试
3. 提交代码（遵循提交规范）
4. 创建Pull Request
5. 代码审查
6. 合并到主分支

## 许可证

待定

## 联系方式

- 项目文档：`docs/` 目录
- 技术问题：查看 `CLAUDE.md`
- 需求问题：查看 `docs/requirements/`

---

**最后更新**：2024-03-18
