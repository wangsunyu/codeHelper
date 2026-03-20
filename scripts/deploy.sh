#!/bin/bash
# 线上更新部署脚本
# 用法：bash /home/ecs-assist-user/app/scripts/deploy.sh
# 在服务器上执行，拉取最新代码并重启服务

set -e

APP_DIR="/home/ecs-assist-user/app"
echo "=== 开始部署 $(date '+%Y-%m-%d %H:%M:%S') ==="

# 1. 拉取最新代码
echo ">>> 拉取代码..."
cd "$APP_DIR"
git pull origin main

# 2. 构建后端
echo ">>> 构建后端..."
cd "$APP_DIR/backend"
npm install --production=false
npm run build

# 3. 构建前端
echo ">>> 构建前端..."
cd "$APP_DIR/frontend"
npm install --production=false
npm run build

# 4. 确保 uploads 目录存在
mkdir -p "$APP_DIR/uploads"

# 5. 重启后端
echo ">>> 重启后端..."
pm2 restart api

# 6. 重载 Nginx
echo ">>> 重载 Nginx..."
sudo nginx -t && sudo systemctl reload nginx

echo "=== 部署完成 $(date '+%Y-%m-%d %H:%M:%S') ==="
pm2 list
