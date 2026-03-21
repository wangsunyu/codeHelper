# 部署经验手册

> 每次部署前必读。所有踩过的坑都在这里。

---

## 部署方式

**本项目使用 push-to-deploy**，不是在服务器上 git pull。

```bash
make deploy          # 推送代码 → 服务器自动构建+部署
make rollback        # 回滚到上一版本
make rollback VERSION=20260321_113940  # 回滚到指定版本
make versions        # 查看所有可用版本
make logs            # 查看后端日志
make status          # 查看服务状态
```

> 为什么不用 git pull？阿里云服务器无法访问 GitHub 的 git 协议（HTTPS 网页可达，但 git 数据传输被阻断）。

---

## 部署流程（deploy.sh 做了什么）

```
1. 备份数据库 → backups/db_<VERSION>.sql.gz
2. 跳过 git pull（代码已由本地 push 过来）
3. 智能 npm install（md5 对比 package-lock.json，有变更才重装）
4. 构建后端（tsc）、构建前端（vite build）
5. 创建 releases/<VERSION>/ 目录，软链三个共享资源（见下方）
6. 切换 current/ 软链到新版本
7. PM2 重启（首次迁移路径时 delete + start，后续 restart）
8. Nginx reload
9. 健康检查 GET /health，失败自动回滚
10. 清理旧版本，保留最近 5 个
```

---

## ⚠️ 每次 release 目录必须有的三条软链

这是最容易出问题的地方，缺任何一条都会导致服务启动失败：

```bash
releases/$VERSION/backend/node_modules  → ~/app/backend/node_modules
releases/$VERSION/backend/.env          → ~/app/backend/.env
releases/$VERSION/frontend/node_modules → ~/app/frontend/node_modules
```

deploy.sh step 5 已自动创建，**不要手动跳过或删除这一步**。

如果手动修复现有 release：
```bash
APP_DIR=~/app
for ver in $APP_DIR/releases/*/; do
  ln -sfn $APP_DIR/backend/node_modules ${ver}backend/node_modules
  ln -sfn $APP_DIR/backend/.env         ${ver}backend/.env
  ln -sfn $APP_DIR/frontend/node_modules ${ver}frontend/node_modules
done
pm2 restart api
```

---

## 踩过的坑

### 1. 登录/注册报 `Access denied (using password: NO)`

**原因**：releases 目录没有 `.env`，PM2 以 `current/backend` 为 cwd 启动，dotenv 找不到数据库密码，密码为空。

**排查**：
```bash
ls -la ~/app/current/backend/.env   # 检查软链是否存在
pm2 logs api --lines 20 --nostream  # 看启动日志
```

**修复**：补上 `.env` 软链后重启 PM2。

---

### 2. PM2 启动报 `Cannot find module 'dotenv/config'`

**原因**：releases 目录只有 dist，没有 node_modules，Node 找不到依赖。

**修复**：补上 `node_modules` 软链后重启 PM2。

---

### 3. git hook 覆盖了服务器上手动修改的脚本

**原因**：post-receive hook 执行 `git checkout -f main` 会把工作目录还原成 git 里的版本，手动改的文件会被覆盖。

**结论**：所有脚本改动必须先提交到 git，再 push 到服务器，不要直接在服务器上改脚本。

---

### 4. 构建时 OOM（内存不足）

**原因**：服务器 1.8GB RAM，无 Swap，Vite build 峰值 ~600MB，加上 API 进程容易 OOM。

**已处理**：服务器已创建 1GB Swap（`/swapfile`），构建时加了 `NODE_OPTIONS=--max-old-space-size=512`。

**验证**：
```bash
ssh ecs-assist-user@39.103.65.215 "free -h"  # Swap 行应显示 1.0Gi
```

---

## 服务器关键路径

| 路径 | 说明 |
|------|------|
| `~/app/current/` | 软链，指向当前运行版本 |
| `~/app/releases/` | 所有历史版本（保留最近 5 个） |
| `~/app/backups/` | 数据库备份（保留最近 5 个） |
| `~/app/backend/.env` | 生产环境变量（不在 git 中） |
| `~/app/shared/.env` | 同上的备份副本 |
| `~/app/scripts/deploy.sh` | 主部署脚本 |
| `~/app/scripts/rollback.sh` | 回滚脚本 |
| `~/app/.git/hooks/post-receive` | git push 触发部署的 hook |
| `/etc/nginx/conf.d/app.conf` | Nginx 配置 |

---

## 部署后验证清单

```bash
# 1. 健康检查
curl http://39.103.65.215/api/v1/../health   # 或直接在服务器上
ssh ecs-assist-user@39.103.65.215 "curl -sf http://localhost:3000/health"

# 2. PM2 状态
ssh ecs-assist-user@39.103.65.215 "pm2 list"  # api 应为 online

# 3. 确认版本正确
ssh ecs-assist-user@39.103.65.215 "cat ~/app/current/.version"

# 4. 查看有无报错
ssh ecs-assist-user@39.103.65.215 "pm2 logs api --lines 20 --nostream"
```

---

## 回滚操作

```bash
# 查看可用版本
make versions

# 回滚到上一版本（代码，不回滚数据库）
make rollback

# 回滚到指定版本
make rollback VERSION=20260321_113940
```

rollback.sh 会询问是否同时回滚数据库，**大多数情况下选 N**，只回滚代码即可。只有本次部署包含不兼容的数据库 schema 变更时才需要回滚 DB。
