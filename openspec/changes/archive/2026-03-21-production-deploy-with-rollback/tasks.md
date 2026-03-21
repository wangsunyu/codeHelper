# 生产环境版本更新部署 — Tasks

## Phase 0：服务器环境准备（前置，必须先做）

- [x] **0.1** 创建 Swap 文件，防止 build 时 OOM
  ```bash
  sudo dd if=/dev/zero of=/swapfile bs=1M count=1024
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
  # 验证
  free -h
  ```
- [x] **0.2** 验证 Swap 已激活（`free -h` 中 Swap 行不为 0）

## Phase 1：服务器端目录结构初始化

- [x] **1.1** SSH 连接服务器，创建目录结构，并将当前线上版本存为首个 release（基线备份）
  ```bash
  APP_DIR=~/app
  VERSION=$(date +%Y%m%d_%H%M%S)
  mkdir -p $APP_DIR/releases/$VERSION/backend $APP_DIR/releases/$VERSION/frontend
  mkdir -p $APP_DIR/backups $APP_DIR/shared/uploads

  # 备份当前运行的构建产物
  cp -r $APP_DIR/backend/dist $APP_DIR/releases/$VERSION/backend/
  cp -r $APP_DIR/frontend/dist $APP_DIR/releases/$VERSION/frontend/
  echo "commit=$(cd $APP_DIR && git rev-parse HEAD) time=$VERSION" > $APP_DIR/releases/$VERSION/.version

  # 创建 current 软链指向首个基线版本
  ln -sfn $APP_DIR/releases/$VERSION $APP_DIR/current
  ```
- [x] **1.2** 备份当前数据库（建立基线，凭据从 `backend/.env` 读取）
  ```bash
  source ~/app/backend/.env
  mysqldump -u $DB_USER -p$DB_PASSWORD $DB_NAME | gzip > ~/app/backups/db_$VERSION.sql.gz
  ```
- [x] **1.3** 将 `backend/.env` 移入 `shared/.env`，在 `backend/` 目录创建软链，保持原有路径可用
  ```bash
  cp ~/app/backend/.env ~/app/shared/.env
  # 保留原文件（不删除，确保现有服务不中断）
  ```

## Phase 2：编写 deploy.sh

- [x] **2.1** 在服务器 `~/app/scripts/deploy.sh` 写入完整部署脚本（参考 design.md 流程）
  - 从 `~/app/backend/.env` 读取 DB 凭据
  - **智能 npm install**：用 `md5sum package-lock.json` 与上次对比，有变更才重新安装（节省内存）
  - 构建时加 `NODE_OPTIONS=--max-old-space-size=512` 限制内存，防止 OOM
  - **首次执行时**：`pm2 delete api && pm2 start current/backend/dist/index.js --name api --cwd current/backend`
  - **后续执行**：`pm2 restart api`（软链已切换，自动加载新版本）
  - 健康检查失败时自动调用 `rollback.sh` 回滚到上一版本
  - 清理旧版本（保留最近 5 个 releases 目录和 5 个 DB 备份）
- [x] **2.2** 赋予执行权限 `chmod +x ~/app/scripts/deploy.sh`
- [x] **2.3** 首次执行后运行 `pm2 save` 保存新的 PM2 配置路径
- [x] **2.4** 本地测试：`ssh ecs-assist-user@39.103.65.215 "bash ~/app/scripts/deploy.sh"` 验证全流程

## Phase 3：编写 rollback.sh

- [x] **3.1** 在服务器 `~/app/scripts/rollback.sh` 写入回滚脚本（参考 design.md 流程）
  - 支持无参数（回滚上一版本）和指定版本号两种模式
  - 先询问数据库回滚意向，再停服务（减少不必要停机时间）
  - **数据库还原命令**（注意 gzip）：
    ```bash
    gunzip -c ~/app/backups/db_<版本>.sql.gz | mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME
    ```
- [x] **3.2** 赋予执行权限 `chmod +x ~/app/scripts/rollback.sh`
- [x] **3.3** 测试回滚：部署一个测试版本后执行回滚，验证服务恢复正常

## Phase 4：后端添加健康检查端点

- [x] **4.1** 在 `backend/src/index.ts`（或路由文件）添加：
  ```typescript
  app.get('/health', (req, res) => res.json({ status: 'ok' }));
  ```
- [x] **4.2** 本地验证 `curl http://localhost:3000/health` 返回 `{"status":"ok"}`

## Phase 5：Nginx 配置更新

- [x] **5.1** 修改 Nginx 配置，将前端 `root` 指向 `~/app/current/frontend/dist`
  ```nginx
  root /home/ecs-assist-user/app/current/frontend/dist;
  ```
- [x] **5.2** `sudo nginx -t && sudo systemctl reload nginx` 验证配置

## Phase 6：本地快捷指令

- [x] **6.1** 在项目根目录 `package.json` 的 `scripts` 中添加：
  > 根目录无 package.json，改用 `Makefile`（已创建）：
  > - `make deploy` — 一键部署
  > - `make rollback` — 回滚上一版本
  > - `make rollback VERSION=20260320_120000` — 回滚到指定版本
  > - `make logs` / `make status` / `make versions`
  ```json
  "deploy": "ssh ecs-assist-user@39.103.65.215 'bash ~/app/scripts/deploy.sh'",
  "rollback": "ssh ecs-assist-user@39.103.65.215 'bash ~/app/scripts/rollback.sh'"
  ```
- [x] **6.2** 验证 `npm run deploy` 本地触发完整部署流程

## Phase 7：文档更新

- [x] **7.1** 更新 `docs/deployment.md`，补充新的部署流程、目录结构说明、回滚操作指南
- [x] **7.2** 在 `CLAUDE.md` 的「常用运维命令」中补充 `rollback.sh` 用法

## 验收标准

- [x] `free -h` 显示 Swap ≥ 1GB（OOM 保护）
- [x] 执行 `make deploy` 后，服务器自动完成备份 → 构建 → 部署 → 健康检查全流程，无 OOM 错误
- [x] 执行 `make rollback` 后，服务回滚到上一版本，服务正常响应
- [x] 服务器 `~/app/releases/` 中保留最近 5 个版本，`~/app/backups/` 中保留最近 5 个 DB 备份
- [x] 健康检查失败时，`deploy.sh` 自动触发回滚并输出错误信息
