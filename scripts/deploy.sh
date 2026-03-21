#!/bin/bash
# 生产部署脚本（含备份、版本化、健康检查、自动回滚）
# 用法：
#   bash ~/app/scripts/deploy.sh        # 默认：不执行 git pull（push-to-deploy 模式）
#   bash ~/app/scripts/deploy.sh --pull # 强制 git pull（需要网络可达 GitHub）

set -e

APP_DIR="/home/ecs-assist-user/app"
KEEP_RELEASES=5
VERSION=$(date +%Y%m%d_%H%M%S)
SCRIPT_DIR="$APP_DIR/scripts"
DO_PULL=false
[ "$1" = '--pull' ] && DO_PULL=true

echo "=== 开始部署 $VERSION ==="

# 1. 读取 DB 凭据
source "$APP_DIR/backend/.env"

# 2. 备份数据库
echo ">>> [1/9] 备份数据库..."
mkdir -p "$APP_DIR/backups"
mysqldump -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" 2>/dev/null | gzip > "$APP_DIR/backups/db_${VERSION}.sql.gz"
echo "    数据库已备份: db_${VERSION}.sql.gz"

# 3. 拉取代码（可选）
if [ "$DO_PULL" = true ]; then
  echo ">>> [2/9] 拉取代码..."
  cd "$APP_DIR"
  git pull origin main
else
  echo ">>> [2/9] 跳过 git pull（push-to-deploy 模式）"
fi

# 4. 智能 npm install（仅 package-lock.json 有变更时才重装）
echo ">>> [3/9] 检查依赖变更..."
mkdir -p "$APP_DIR/.cache"

BACKEND_LOCK="$APP_DIR/backend/package-lock.json"
BACKEND_LOCK_CACHE="$APP_DIR/.cache/backend_lock_md5"
CURRENT_MD5=$(md5sum "$BACKEND_LOCK" | cut -d' ' -f1)
CACHED_MD5=$(cat "$BACKEND_LOCK_CACHE" 2>/dev/null || echo '')
if [ "$CURRENT_MD5" != "$CACHED_MD5" ]; then
  echo "    后端依赖有变更，重新安装..."
  cd "$APP_DIR/backend" && npm ci --production=false
  echo "$CURRENT_MD5" > "$BACKEND_LOCK_CACHE"
else
  echo "    后端依赖无变更，跳过"
fi

FRONTEND_LOCK="$APP_DIR/frontend/package-lock.json"
FRONTEND_LOCK_CACHE="$APP_DIR/.cache/frontend_lock_md5"
CURRENT_MD5=$(md5sum "$FRONTEND_LOCK" | cut -d' ' -f1)
CACHED_MD5=$(cat "$FRONTEND_LOCK_CACHE" 2>/dev/null || echo '')
if [ "$CURRENT_MD5" != "$CACHED_MD5" ]; then
  echo "    前端依赖有变更，重新安装..."
  cd "$APP_DIR/frontend" && npm ci --production=false
  echo "$CURRENT_MD5" > "$FRONTEND_LOCK_CACHE"
else
  echo "    前端依赖无变更，跳过"
fi

# 5. 创建本次 release 目录
mkdir -p "$APP_DIR/releases/$VERSION/backend" "$APP_DIR/releases/$VERSION/frontend"

# 6. 构建后端
echo ">>> [4/9] 构建后端..."
cd "$APP_DIR/backend"
NODE_OPTIONS='--max-old-space-size=512' npm run build
cp -r dist "$APP_DIR/releases/$VERSION/backend/"

# 7. 构建前端
echo ">>> [5/9] 构建前端..."
cd "$APP_DIR/frontend"
NODE_OPTIONS='--max-old-space-size=512' npm run build
cp -r dist "$APP_DIR/releases/$VERSION/frontend/"

# 8. 写入版本元数据
cd "$APP_DIR"
echo "commit=$(git rev-parse HEAD) time=$VERSION" > "$APP_DIR/releases/$VERSION/.version"

# 9. 切换 current 软链
echo ">>> [6/9] 切换版本..."
PREV_VERSION=$(readlink "$APP_DIR/current" 2>/dev/null | xargs basename 2>/dev/null || echo '')
ln -sfn "$APP_DIR/releases/$VERSION" "$APP_DIR/current"

# 10. 重启后端（PM2）
echo ">>> [7/9] 重启后端..."
PM2_SCRIPT="$APP_DIR/current/backend/dist/index.js"
PM2_CWD="$APP_DIR/current/backend"
if pm2 show api > /dev/null 2>&1; then
  CURRENT_SCRIPT=$(pm2 show api 2>/dev/null | grep 'script path' | awk '{print $NF}')
  if echo "$CURRENT_SCRIPT" | grep -q 'current'; then
    pm2 restart api
  else
    echo "    迁移 PM2 路径到 current/..."
    pm2 stop api && pm2 delete api
    pm2 start "$PM2_SCRIPT" --name api --cwd "$PM2_CWD" --max-memory-restart 400M
    pm2 save
  fi
else
  pm2 start "$PM2_SCRIPT" --name api --cwd "$PM2_CWD" --max-memory-restart 400M
  pm2 save
fi

# 11. 重载 Nginx
echo ">>> [8/9] 重载 Nginx..."
sudo nginx -t 2>&1 && sudo systemctl reload nginx

# 12. 健康检查（最多重试 3 次）
echo ">>> [9/9] 健康检查..."
sleep 3
for i in 1 2 3; do
  if curl -sf http://localhost:3000/health > /dev/null 2>&1; then
    echo "    健康检查通过 ✓"
    break
  fi
  if [ $i -eq 3 ]; then
    echo "    ❌ 健康检查失败，自动回滚到: $PREV_VERSION"
    [ -n "$PREV_VERSION" ] && bash "$SCRIPT_DIR/rollback.sh" "$PREV_VERSION" --no-db-prompt
    exit 1
  fi
  echo "    第 $i 次检查失败，等待 3 秒重试..."
  sleep 3
done

# 13. 清理旧版本（保留最近 KEEP_RELEASES 个）
echo ">>> 清理旧版本（保留最近 $KEEP_RELEASES 个）..."
cd "$APP_DIR/releases" && ls -1t | tail -n +$(($KEEP_RELEASES + 1)) | xargs -r rm -rf
cd "$APP_DIR/backups" && ls -1t | tail -n +$(($KEEP_RELEASES + 1)) | xargs -r rm -f

echo "=== 部署完成 $VERSION ==="
pm2 list
