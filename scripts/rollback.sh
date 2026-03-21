#!/bin/bash
# 一键回滚脚本
# 用法：bash ~/app/scripts/rollback.sh [版本号] [--no-db-prompt]
#   无参数：回滚到上一个版本
#   指定版本：bash rollback.sh 20260320_120000
#   --no-db-prompt：跳过数据库回滚询问（由 deploy.sh 自动回滚时使用）

APP_DIR="/home/ecs-assist-user/app"
TARGET_VERSION="$1"
NO_DB_PROMPT=false
[ "$2" = '--no-db-prompt' ] && NO_DB_PROMPT=true
[ "$1" = '--no-db-prompt' ] && NO_DB_PROMPT=true && TARGET_VERSION=''

# 读取 DB 凭据
source "$APP_DIR/backend/.env"

echo "=== 开始回滚 ==="

# 列出可用版本
echo "可用版本："
ls -1t "$APP_DIR/releases/" | nl

# 确定目标版本
if [ -z "$TARGET_VERSION" ]; then
  # 当前版本是 current 软链指向的版本
  CURRENT_VERSION=$(readlink "$APP_DIR/current" | xargs basename)
  # 取时间排序中当前版本之后的第一个（即上一版本）
  TARGET_VERSION=$(ls -1t "$APP_DIR/releases/" | grep -A1 "^${CURRENT_VERSION}$" | tail -1)
  if [ -z "$TARGET_VERSION" ] || [ "$TARGET_VERSION" = "$CURRENT_VERSION" ]; then
    echo "❌ 找不到可回滚的上一版本（当前已是最早版本）"
    exit 1
  fi
fi

# 验证目标版本存在
if [ ! -d "$APP_DIR/releases/$TARGET_VERSION" ]; then
  echo "❌ 版本 $TARGET_VERSION 不存在"
  echo "可用版本：$(ls $APP_DIR/releases/)"
  exit 1
fi

echo "目标版本: $TARGET_VERSION"

# 询问是否回滚数据库（先询问，再停服务）
ROLLBACK_DB=false
if [ "$NO_DB_PROMPT" = false ]; then
  DB_BACKUP="$APP_DIR/backups/db_${TARGET_VERSION}.sql.gz"
  if [ -f "$DB_BACKUP" ]; then
    read -p "是否同时回滚数据库到 $TARGET_VERSION 版本? [y/N] " DB_CONFIRM
    [ "$DB_CONFIRM" = 'y' ] || [ "$DB_CONFIRM" = 'Y' ] && ROLLBACK_DB=true
  else
    echo "（未找到对应数据库备份，仅回滚代码）"
  fi
fi

# 停止后端
echo ">>> 停止后端..."
pm2 stop api 2>/dev/null || true

# 回滚数据库（如需要）
if [ "$ROLLBACK_DB" = true ]; then
  echo ">>> 还原数据库..."
  gunzip -c "$APP_DIR/backups/db_${TARGET_VERSION}.sql.gz" | mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME"
  echo "    数据库已还原 ✓"
fi

# 切换软链
echo ">>> 切换到版本 $TARGET_VERSION..."
ln -sfn "$APP_DIR/releases/$TARGET_VERSION" "$APP_DIR/current"

# 重启后端
echo ">>> 重启后端..."
pm2 restart api 2>/dev/null || pm2 start "$APP_DIR/current/backend/dist/index.js" --name api --cwd "$APP_DIR/current/backend" --max-memory-restart 400M

# 重载 Nginx
sudo nginx -t 2>&1 && sudo systemctl reload nginx

# 健康检查
echo ">>> 健康检查..."
sleep 3
for i in 1 2 3; do
  if curl -sf http://localhost:3000/health > /dev/null 2>&1; then
    echo "=== 回滚成功: $TARGET_VERSION ==="
    pm2 list
    exit 0
  fi
  sleep 2
done

echo "❌ 回滚后健康检查失败，请手动检查: pm2 logs api"
exit 1
