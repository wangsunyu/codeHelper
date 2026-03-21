SERVER := ecs-assist-user@39.103.65.215
PROD_REMOTE := prod

# 添加生产服务器为 git remote（首次执行一次即可）
setup-remote:
	git remote remove $(PROD_REMOTE) 2>/dev/null || true
	git remote add $(PROD_REMOTE) $(SERVER):~/app
	@echo "已添加 remote: $(PROD_REMOTE)"

# 部署最新代码到生产环境（push 代码 → 服务器自动 build + 重启）
deploy:
	git push $(PROD_REMOTE) main

# 回滚到上一个版本（无参数）或指定版本（VERSION=20260320_120000）
rollback:
	ssh $(SERVER) 'bash ~/app/scripts/rollback.sh $(VERSION)'

# 查看线上日志
logs:
	ssh $(SERVER) 'pm2 logs api --lines 50 --nostream'

# 查看服务状态
status:
	ssh $(SERVER) 'pm2 list && free -h && df -h /'

# 列出所有可回滚版本
versions:
	ssh $(SERVER) 'ls -1t ~/app/releases/ | nl'

.PHONY: deploy rollback logs status versions
