# 生产环境部署总结

## 服务器信息

| 项目 | 值 |
|------|-----|
| 云服务商 | 阿里云 ECS |
| 公网 IP | 39.103.65.215 |
| 系统 | Alibaba Cloud Linux 3 |
| 配置 | 2核 2G内存 40G SSD |
| 登录用户 | ecs-assist-user |
| SSH 认证 | 密钥（本地 ~/.ssh/id_rsa） |

## 访问地址

| 服务 | 地址 |
|------|------|
| 前端 | http://39.103.65.215 |
| 后端 API | http://39.103.65.215/api/v1 |

> 暂无域名，HTTPS 待绑定域名后配置

## 已安装软件

| 软件 | 版本 | 说明 |
|------|------|------|
| Node.js | 20.x | 后端运行时 |
| npm | 10.x | 包管理器 |
| MySQL | 8.0 | 主数据库 |
| Redis | 6.2 | 缓存 |
| Nginx | 1.20 | Web 服务器 / 反向代理 |
| PM2 | 6.x | 进程守护 |
| Git | 2.43 | 代码拉取 |

## 项目部署结构

```
/home/ecs-assist-user/
├── app/
│   ├── current/                    # 当前运行版本（软链 → releases/<版本>）
│   ├── releases/                   # 历史版本（保留最近 5 个）
│   │   └── 20260321_140530/
│   │       ├── backend/dist/       # 后端构建产物
│   │       ├── backend/node_modules -> ../../backend/node_modules
│   │       ├── frontend/dist/      # 前端构建产物
│   │       └── .version            # 版本元数据
│   ├── backups/                    # 数据库备份（保留最近 5 个）
│   ├── scripts/
│   │   ├── deploy.sh               # 主部署脚本
│   │   └── rollback.sh             # 一键回滚脚本
│   ├── shared/
│   │   ├── .env                    # 跨版本共享环境变量
│   │   └── uploads/                # 用户上传文件
│   ├── backend/                    # 源码（含 node_modules）
│   └── frontend/                   # 源码（含 node_modules）
└── .pm2/                           # PM2 配置和日志
```

## Nginx 配置

配置文件：`/etc/nginx/conf.d/app.conf`

- `/` → 前端静态文件（`/home/ecs-assist-user/app/current/frontend/dist`）
- `/api` → 反向代理到后端（`http://127.0.0.1:3000`）
- `/uploads` → 用户上传文件目录

## 进程管理

```bash
# 查看运行状态
pm2 list

# 查看日志
pm2 logs api

# 重启后端
pm2 restart api

# 开机自启（已配置）
pm2 save
```

## 数据库

- 数据库名：`ai_platform`
- 用户：`app_user`（密码见 CLAUDE.md）
- 初始化脚本：`backend/migrations/001_init.sql`

## 初次部署步骤（已完成，记录备查）

1. 安装依赖：`dnf install git nginx nodejs mysql-server redis`
2. 启动服务：`systemctl start mysqld redis nginx`
3. 安装 PM2：`npm install -g pm2`
4. 克隆代码：`git clone https://github.com/wangsunyu/codeHelper.git app`
5. 创建 `.env`：填写生产环境变量
6. 安装依赖：`npm install`（前后端分别执行）
7. 编译代码：`npm run build`（前后端分别执行）
8. 初始化数据库：`mysql ai_platform < migrations/001_init.sql`
9. 启动后端：`pm2 start dist/index.js --name api && pm2 save`
10. 配置 Nginx：`/etc/nginx/conf.d/app.conf`
11. 开放安全组：放行 80、443 端口

## 更新部署

**方式：git push 到服务器（push-to-deploy）**

```bash
# 本地执行，推送代码并自动触发构建+部署
make deploy
```

服务器 git hook 自动执行完整流程：
DB 备份 → 智能 npm install（仅依赖变更时） → 构建前后端 → 版本化 release → 切换软链 → PM2 重启 → 健康检查（失败自动回滚）

## 回滚

```bash
# 回滚到上一版本
make rollback

# 回滚到指定版本
make rollback VERSION=20260321_113940

# 查看所有可用版本
make versions
```

> 回滚脚本会询问是否同时回滚数据库，大多数情况下只需回滚代码。

## 注意事项

- `.env` 文件不在 Git 中，每次重新克隆需手动重建（密码见 CLAUDE.md）
- 上传目录 `uploads/` 不在 Git 中，数据在服务器本地
- 数据库数据不会随代码更新被覆盖
