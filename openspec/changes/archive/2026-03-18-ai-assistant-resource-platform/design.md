## Context

当前需要构建一个全新的AI助手资源分享平台，用于MCP配置和Skills技能包的社区共享。该平台需要支持用户注册登录、资源上传下载、评论互动、排行榜展示等功能。

部署环境：
- 云服务器配置：2核CPU，2G内存，50G SSD
- 个人小型云服务器，资源有限
- 需要在有限资源下保证系统稳定运行

技术约束：
- 需要支持文件上传和存储
- 需要实现用户认证和授权机制
- 需要考虑文件安全性（病毒扫描、恶意代码检测）
- 需要支持高并发下载
- 需要实现访问控制（部分功能需要登录，下载无需登录）
- 内存资源受限，需要选择轻量级技术栈

## Goals / Non-Goals

**Goals:**
- 构建一个完整的Web应用，包含前端和后端
- 实现用户认证系统（用户名密码方式）
- 实现MCP和Skills的完整生命周期管理（上传、下载、更新、删除）
- 提供社区互动功能（评论、收藏、排行榜）
- 提供内容分享平台（经验文章、工具推荐）
- 确保系统安全性和文件安全性

**Non-Goals:**
- 不实现OAuth第三方登录（首期仅支持用户名密码）
- 不实现实时聊天功能
- 不实现付费下载或会员系统
- 不实现移动端原生应用（仅Web响应式设计）

## Decisions

### 1. 技术栈选择

**决策**: 使用轻量级现代Web技术栈（针对2核2G环境优化）
- 前端: React + TypeScript + Tailwind CSS
- 后端: Node.js + Express + TypeScript
- 数据库: MySQL 8.0（关系型数据）+ Redis（缓存和会话）
- 文件存储: 本地文件系统（初期）或对象存储（扩展期）

**理由**:
- TypeScript提供类型安全，减少运行时错误
- React生态成熟，组件化开发效率高
- **MySQL 8.0在小内存环境下表现更好**，默认配置更适合2G内存服务器
- MySQL内存占用约300-500MB，而PostgreSQL需要500MB-1GB
- MySQL 8.0支持JSON、窗口函数等现代特性，功能已足够
- Redis提供高性能缓存和会话管理（配置为100MB内存限制）

**内存分配规划（2G总内存）**:
```
系统预留:        ~300MB
Nginx:          ~50MB
Node.js后端:    ~400MB
前端静态服务:    ~50MB
Redis:          ~100MB (maxmemory=100m)
MySQL:          ~500MB (innodb_buffer_pool_size=512M)
其他/缓冲:      ~600MB
```

**替代方案及为何不选**:
- PostgreSQL: 功能更强大，但在2G内存环境下需要大量调优，容易触发swap导致性能下降
- MongoDB: 文档型数据库，但本项目的数据关系较复杂，关系型数据库更适合
- SQLite: 过于轻量，不支持并发写入，不适合Web应用

### 2. 认证机制

**决策**: 使用JWT（JSON Web Token）进行会话管理
- 用户登录后返回JWT token
- Token存储在HTTP-only cookie中
- 使用refresh token机制延长会话

**理由**:
- JWT无状态，易于扩展
- HTTP-only cookie防止XSS攻击
- Refresh token机制平衡安全性和用户体验

**替代方案**:
- Session-based认证: 需要服务器端存储会话，扩展性较差
- OAuth2: 过于复杂，首期不需要第三方登录

### 3. 文件存储策略

**决策**: 初期使用本地文件系统，后期可迁移到对象存储
- 文件上传后存储到服务器本地目录（/data/uploads/）
- 数据库存储文件元数据和相对路径
- 实现文件版本管理
- 预留对象存储接口，便于后期迁移

**理由**:
- 本地文件系统简单直接，无额外成本
- 50G SSD足够初期使用（预估可存储1000-2000个资源文件）
- 避免对象存储的额外费用和复杂性
- 设计良好的抽象层，后期可无缝迁移到S3/OSS

**文件存储结构**:
```
/data/uploads/
  ├── mcp/
  │   ├── 2024/01/
  │   │   ├── uuid1.json
  │   │   └── uuid2.json
  └── skills/
      ├── 2024/01/
      │   ├── uuid3.zip
      │   └── uuid4.zip
```

**替代方案**:
- 对象存储（S3/OSS）: 成本较高，初期不必要，但扩展性更好
- 数据库BLOB: 性能差，不适合大文件
- NFS网络存储: 增加复杂度，小型项目不需要

### 4. 文件安全策略

**决策**: 实现多层安全检查
- 文件类型白名单验证
- 文件大小限制（MCP: 10MB, Skills: 50MB）
- 病毒扫描（使用ClamAV或云服务）
- 内容安全检查（检测恶意代码模式）

**理由**:
- 多层防护提高安全性
- 白名单方式比黑名单更安全
- 病毒扫描是必要的安全措施

### 5. 排行榜实现

**决策**: 使用Redis Sorted Set实现排行榜
- 下载计数实时更新到Redis
- 定期同步到MySQL持久化
- 支持多时间维度（日、周、月、总榜）

**理由**:
- Redis Sorted Set天然支持排行榜场景
- 高性能，支持实时更新
- 定期持久化保证数据安全

**替代方案**:
- 纯数据库查询: 性能较差，不适合高频访问
- 定时任务计算: 实时性差

### 6. API设计

**决策**: 使用RESTful API设计
- 资源导向的URL设计
- 标准HTTP方法（GET, POST, PUT, DELETE）
- 统一的响应格式（JSON）
- API版本控制（/api/v1/）

**理由**:
- RESTful设计简单直观
- 易于理解和维护
- 广泛的工具和库支持

### 7. MySQL配置优化（针对2G内存）

**决策**: 使用针对小内存环境优化的MySQL配置

**配置参数**:
```ini
[mysqld]
# 核心内存配置
innodb_buffer_pool_size = 512M        # 最重要的参数，设置为可用内存的60%
innodb_log_file_size = 64M
innodb_log_buffer_size = 8M

# 连接配置
max_connections = 50                   # 限制最大连接数
max_connect_errors = 100

# 查询缓存
query_cache_type = 1
query_cache_size = 32M
query_cache_limit = 2M

# 临时表
tmp_table_size = 32M
max_heap_table_size = 32M

# 其他优化
table_open_cache = 400
thread_cache_size = 8
```

**理由**:
- innodb_buffer_pool_size是最关键参数，直接影响性能
- 限制max_connections防止内存耗尽
- 适度的查询缓存提升读性能
- 这些配置在2G内存下经过验证，稳定可靠

### 8. 全文搜索方案

**决策**: 使用MySQL全文索引（ngram解析器）

**实现方式**:
```sql
-- 创建全文索引（支持中文）
ALTER TABLE resources
ADD FULLTEXT INDEX idx_fulltext (name, description)
WITH PARSER ngram;

-- 搜索查询
SELECT * FROM resources
WHERE MATCH(name, description) AGAINST('AI助手' IN BOOLEAN MODE)
ORDER BY download_count DESC
LIMIT 20;
```

**理由**:
- MySQL 5.7+的ngram解析器支持中文分词
- 无需额外的搜索服务，降低系统复杂度
- 对于中小规模数据（<10万条）性能足够
- 节省内存资源（Elasticsearch需要额外500MB+内存）

**替代方案**:
- Elasticsearch: 功能强大但内存占用大（500MB+），2G环境下不适合
- 简单LIKE查询: 性能差，但可作为降级方案
- 第三方搜索服务: 增加依赖和成本

### 9. 数据库连接池配置

**决策**: 使用连接池限制数据库连接数

**Node.js配置示例**:
```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'app_user',
  password: 'secure_password',
  database: 'ai_platform',
  connectionLimit: 10,        // 最大连接数
  queueLimit: 0,              // 无限队列
  waitForConnections: true,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});
```

**理由**:
- 限制连接数防止数据库过载
- 连接复用提升性能
- 10个连接足够支持中等并发（100-200 QPS）

## Risks / Trade-offs

### 1. 内存资源限制
**风险**: 2G内存在高负载下可能不足，导致系统变慢或崩溃
**缓解**:
- 严格限制各服务的内存使用（MySQL 512M, Redis 100M, Node.js 400M）
- 配置4G swap作为安全缓冲
- 使用PM2限制Node.js进程内存（--max-old-space-size=400）
- 实施内存监控和告警
- 必要时考虑升级到4G内存

### 2. 文件存储空间限制
**风险**: 50G SSD可能在用户增长后不足
**缓解**:
- 实施文件大小限制（MCP: 10MB, Skills: 50MB）
- 定期清理无效或过期文件
- 监控磁盘使用率，达到80%时告警
- 预留迁移到对象存储的方案

### 3. 恶意文件上传
**风险**: 用户可能上传恶意文件或病毒
**缓解**:
- 实施严格的文件类型检查
- 集成轻量级病毒扫描（ClamAV可能占用较多内存，考虑云服务API）
- 实施用户举报机制
- 管理员审核机制

### 4. 下载带宽限制
**风险**: 热门资源的高频下载可能导致带宽耗尽
**缓解**:
- 实施下载限流机制（单IP限制）
- 考虑使用CDN（但会增加成本）
- 监控带宽使用情况

### 5. 数据库性能
**风险**: 随着数据量增长，查询性能可能下降
**缓解**:
- 合理设计数据库索引
- 使用Redis缓存热点数据
- 实施分页查询，避免大结果集
- 定期优化慢查询

### 6. 用户隐私和数据安全
**风险**: 用户数据泄露或被攻击
**缓解**:
- 密码使用bcrypt加密存储
- 实施HTTPS加密传输
- 定期安全审计
- 实施访问日志和异常监控

### 7. 单点故障
**风险**: 单服务器部署，任何故障都会导致服务中断
**缓解**:
- 实施自动备份（数据库每日备份，文件每周备份）
- 准备快速恢复方案
- 使用PM2实现进程自动重启
- 监控服务健康状态

## Migration Plan

### 部署步骤（针对2核2G云服务器）

**1. 系统准备**
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 配置swap（4G）
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# 安装必要软件
sudo apt install -y nginx mysql-server redis-server nodejs npm
```

**2. 数据库配置**
```bash
# 配置MySQL
sudo mysql_secure_installation

# 创建数据库和用户
mysql -u root -p <<EOF
CREATE DATABASE ai_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON ai_platform.* TO 'app_user'@'localhost';
FLUSH PRIVILEGES;
EOF

# 应用优化配置
sudo cp /path/to/my.cnf /etc/mysql/mysql.conf.d/custom.cnf
sudo systemctl restart mysql
```

**3. Redis配置**
```bash
# 编辑Redis配置
sudo nano /etc/redis/redis.conf
# 设置: maxmemory 100mb
# 设置: maxmemory-policy allkeys-lru

sudo systemctl restart redis
```

**4. 应用部署**
```bash
# 创建应用目录
sudo mkdir -p /var/www/ai-platform
sudo chown $USER:$USER /var/www/ai-platform

# 创建文件存储目录
sudo mkdir -p /data/uploads/{mcp,skills}
sudo chown www-data:www-data /data/uploads -R

# 部署后端
cd /var/www/ai-platform/backend
npm install --production
npm run build

# 使用PM2管理进程
npm install -g pm2
pm2 start dist/index.js --name api --max-memory-restart 400M
pm2 startup
pm2 save

# 部署前端
cd /var/www/ai-platform/frontend
npm install
npm run build
```

**5. Nginx配置**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /var/www/ai-platform/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # API代理
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 文件下载
    location /downloads/ {
        alias /data/uploads/;
        internal;
    }
}
```

**6. HTTPS配置**
```bash
# 使用Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

**7. 初始化数据**
```bash
# 运行数据库迁移
cd /var/www/ai-platform/backend
npm run migrate

# 创建管理员账号
npm run seed:admin
```

**8. 监控配置**
```bash
# 安装监控工具
npm install -g pm2-logrotate
pm2 install pm2-logrotate

# 配置日志轮转
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 回滚策略
- 使用Git标签管理版本，便于快速回滚代码
- 数据库迁移使用可逆的migration脚本
- PM2支持快速重启和回滚
- 每日自动备份数据库和文件
- 准备数据库恢复脚本

### 性能监控
```bash
# 监控内存使用
free -h
watch -n 5 'free -h'

# 监控MySQL
mysqladmin -u root -p status
mysqladmin -u root -p processlist

# 监控Redis
redis-cli info memory

# 监控PM2进程
pm2 monit
pm2 logs
```

## Open Questions

1. 是否需要实施内容审核机制？如果需要，是人工审核还是自动审核？
2. 是否需要支持资源的版本回退功能？
3. 是否需要实施API限流机制？具体的限流策略是什么？
4. 是否需要支持多语言界面？
5. 病毒扫描使用本地ClamAV（占用内存）还是云服务API（增加成本）？
6. 当存储空间接近50G时，是否迁移到对象存储？预算是多少？
7. 如果用户量快速增长，是否考虑升级服务器配置？升级路径是什么？
