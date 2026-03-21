# 生产环境版本更新部署 — Design

## 服务器现状与约束

| 项目 | 现状 | 风险 |
|------|------|------|
| 内存 | 1.8GB，无 Swap | Vite build 峰值 ~600MB，OOM 会导致半部署状态 |
| 磁盘 | 40GB，已用 5.6GB | 充足，releases 只存 dist（~500KB/版本） |
| CPU | 2 核 | 前后端串行 build，无并发风险 |
| PM2 | 运行中，81MB | 部署期间短暂停机不可避免 |
| .env | `~/app/backend/.env` | 部署脚本需从此路径读取 DB 凭据 |

**前置要求：部署前必须先建 Swap（否则 build 有 OOM 风险）**

```bash
# 创建 1GB Swap（一次性操作）
sudo dd if=/dev/zero of=/swapfile bs=1M count=1024
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
# 持久化（重启后生效）
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```



```
/home/ecs-assist-user/app/
├── current/                    # 当前运行版本（软链接 → releases/<版本>）
├── releases/                   # 所有历史版本
│   ├── 20260321_153000/        # 时间戳版本目录
│   │   ├── backend/dist/       # 后端构建产物
│   │   ├── frontend/dist/      # 前端构建产物
│   │   └── .version            # 版本元数据（时间、commit hash）
│   └── 20260320_120000/
├── backups/                    # 数据库备份
│   ├── db_20260321_153000.sql.gz
│   └── db_20260320_120000.sql.gz
├── scripts/
│   ├── deploy.sh               # 主部署脚本（更新）
│   └── rollback.sh             # 一键回滚脚本（新增）
└── shared/                     # 跨版本共享（上传文件、.env）
    ├── .env
    └── uploads/
```

## 部署流程（deploy.sh）

```
1.  生成版本号 VERSION=$(date +%Y%m%d_%H%M%S)
2.  从 ~/app/backend/.env 读取 DB 凭据（source ~/app/backend/.env）
3.  备份数据库 → backups/db_$VERSION.sql.gz
4.  git pull 拉取最新代码
5.  智能 npm install（仅当 package-lock.json 有变更时才重新安装，节省内存和时间）：
      后端：diff package-lock.json → 有变更则 npm ci，否则跳过
      前端：同上
6.  构建后端（NODE_OPTIONS=--max-old-space-size=512 npm run build）
      产物输出到 releases/$VERSION/backend/dist/
7.  构建前端（NODE_OPTIONS=--max-old-space-size=512 npm run build）
      产物输出到 releases/$VERSION/frontend/dist/
8.  写入 .version 文件（commit=$(git rev-parse HEAD)，time=$VERSION）
9.  软链切换 ln -sfn releases/$VERSION current
10. 更新 PM2 指向新路径：
      pm2 stop api
      pm2 delete api
      pm2 start current/backend/dist/index.js --name api \
        --cwd current/backend \
        --max-memory-restart 400M
11. nginx reload（nginx root 已指向 current/frontend/dist）
12. 健康检查：curl -sf localhost:3000/health，失败则自动回滚
13. 保存 PM2 配置：pm2 save
14. 清理：保留最近 5 个版本（删除旧版本目录和 DB 备份）
```

> **注意**：步骤 10 首次执行后，pm2 的 script 路径变为 `current/backend/dist/index.js`，此后每次部署软链已切换，`pm2 restart api` 即可加载新版本，无需 delete/start。

## 回滚流程（rollback.sh）

```
用法：./rollback.sh [版本号]
     ./rollback.sh            # 回滚到上一个版本（取 releases/ 中倒数第二个）
     ./rollback.sh 20260320_120000   # 回滚到指定版本

流程：
1. 列出可用版本（ls -1t releases/）
2. 确认目标版本存在；无参数时自动选择上一版本
3. 询问是否同时回滚数据库（需用户输入 y/N）
4. 停止后端（pm2 stop api）
5. 如选择回滚数据库：
     gunzip -c backups/db_<目标版本>.sql.gz | mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME
   否则跳过
6. 切换软链 ln -sfn releases/<目标版本> current
7. pm2 restart api
8. nginx reload
9. 健康检查（curl -sf localhost:3000/health），输出回滚结果
```

> **数据库回滚风险提示**：仅当本次部署包含不兼容的 schema 变更时才需要回滚 DB；大多数情况下只需回滚代码即可。

## Nginx 配置调整

```nginx
# 前端静态文件指向 current 软链
root /home/ecs-assist-user/app/current/frontend/dist;

# 后端 API 代理不变
location /api/ {
    proxy_pass http://localhost:3000;
}
```

## 本地触发方式

在项目根目录 `Makefile` 或 `package.json` 中添加：

```bash
# 方式一：Makefile
deploy:
    ssh ecs-assist-user@39.103.65.215 "bash /home/ecs-assist-user/app/scripts/deploy.sh"

rollback:
    ssh ecs-assist-user@39.103.65.215 "bash /home/ecs-assist-user/app/scripts/rollback.sh $(VERSION)"

# 方式二：package.json scripts
"deploy": "ssh ecs-assist-user@39.103.65.215 'bash ~/app/scripts/deploy.sh'"
```

## 版本保留策略

- 代码版本：保留最近 **5** 个（`deploy.sh` 自动清理）
- 数据库备份：保留最近 **5** 个
- 可通过修改 `KEEP_RELEASES=5` 环境变量调整

## 健康检查端点

后端需暴露 `GET /health`，返回 `{"status":"ok"}`，用于部署后自动验证。
