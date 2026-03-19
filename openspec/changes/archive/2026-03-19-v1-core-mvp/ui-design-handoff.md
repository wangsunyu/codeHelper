# V1 Core MVP UI 设计交接

## 目的

本文档用于把已经完成并保存到磁盘的 V1 Core MVP 设计稿交接给 ClaudeCode，用于后续前端页面与组件开发。

设计稿状态：

- 8 个页面 `.pen` 文件已在 Pencil 中重新绘制并由用户手动保存
- 8 个页面截图已导出为 PNG，可作为实现时的快速视觉参考
- 所有页面遵循 `designs/design-tokens.md`

## 设计资产清单

### Pencil 源文件

- `designs/current/homepage.pen`
- `designs/current/skills-list.pen`
- `designs/current/skills-detail.pen`
- `designs/current/skills-publish.pen`
- `designs/current/login.pen`
- `designs/current/register.pen`
- `designs/current/favorites.pen`
- `designs/current/rankings.pen`

### 页面截图

- `designs/screenshots/homepage.png`
- `designs/screenshots/skills-list.png`
- `designs/screenshots/skills-detail.png`
- `designs/screenshots/skills-publish.png`
- `designs/screenshots/login.png`
- `designs/screenshots/register.png`
- `designs/screenshots/favorites.png`
- `designs/screenshots/rankings.png`

## 全局设计约束

- 设计 Token 以 `designs/design-tokens.md` 为准
- 整体风格为温暖奶油底色 + 深墨文字 + 白色卡片 + 柔和圆角
- 业务页统一采用顶部导航栏
- 所有主按钮保持深色实底、圆角胶囊或圆角矩形
- 卡片与榜单容器保持较轻边框和浅阴影，不使用强烈霓虹或高饱和效果

## 页面交接说明

### 1. 首页 `/`

- 文件：`designs/current/homepage.pen`
- 截图：`designs/screenshots/homepage.png`
- 重点模块：顶部导航、Hero 搜索区、热门资源卡片、排行榜预览、平台统计、Footer
- 开发建议：拆成 `Navbar`、`HeroSearch`、`ResourceCard`、`RankingPreview`、`StatsStrip`、`Footer`

### 2. Skills 列表页 `/skills`

- 文件：`designs/current/skills-list.pen`
- 截图：`designs/screenshots/skills-list.png`
- 重点模块：页面标题、分类 Tab、3 列资源卡片、分页
- 开发建议：卡片样式可与收藏页共用同一 `SkillCard` 组件，分页做成独立组件

### 3. Skills 详情页 `/skills/:id`

- 文件：`designs/current/skills-detail.pen`
- 截图：`designs/screenshots/skills-detail.png`
- 重点模块：面包屑、主信息区、文件信息、作者卡片、下载/收藏操作区
- 开发建议：布局拆成 `DetailMain` + `DetailSidebar`，按钮状态预留登录态判断

### 4. 发布 Skills 页 `/skills/publish`

- 文件：`designs/current/skills-publish.pen`
- 截图：`designs/screenshots/skills-publish.png`
- 重点模块：上传拖拽区、标题/分类/描述表单、限制说明、提交按钮
- 开发建议：上传区单独封装为 `UploadDropzone`，与表单字段分离

### 5. 登录页 `/login`

- 文件：`designs/current/login.pen`
- 截图：`designs/screenshots/login.png`
- 重点模块：左侧简化品牌介绍、右侧登录卡片、轻背景层次
- 开发建议：页面采用双栏，但移动端应折叠为单卡竖排；右侧卡片优先保证可读性

### 6. 注册页 `/register`

- 文件：`designs/current/register.pen`
- 截图：`designs/screenshots/register.png`
- 重点模块：左侧品牌面板、右侧注册卡片、精简文案版本
- 开发建议：不要照搬早期探索稿，直接以当前最终截图为准；左侧文案控制简短，避免在窄屏溢出

### 7. 我的收藏页 `/favorites`

- 文件：`designs/current/favorites.pen`
- 截图：`designs/screenshots/favorites.png`
- 重点模块：已登录导航、标题与数量、3 列收藏卡片、空状态提示区
- 开发建议：收藏卡片与 Skills 列表页共用资源卡片组件；空状态建议保留单独组件

### 8. 排行榜页 `/rankings`

- 文件：`designs/current/rankings.pen`
- 截图：`designs/screenshots/rankings.png`
- 重点模块：标题、分类 Tab、排行榜列表、Top 3 高亮、下载按钮
- 开发建议：榜单条目做成 `RankingRow`，Top 3 使用独立状态映射颜色与边框

## 组件复用建议

- `Navbar`
- `PrimaryButton`
- `SecondaryTab`
- `SkillCard`
- `EmptyState`
- `AuthCard`
- `RankingRow`

建议优先从这 7 类组件抽象，再拼装页面。

## 本次设计执行记录

### 执行方式

- 按 `docs/tasks/design-v1-pages.md` 逐页执行
- 每个页面在 Pencil 中重绘
- 每完成一页由用户手动保存 `.pen`
- 保存后再导出对应 PNG 到 `designs/screenshots/`

### 特殊说明

- 原有部分 `.pen` 文件在 Pencil 中不可直接作为可靠基线，因此本次采用重绘方式完成最终可交付稿
- 登录页和注册页经历了多轮布局调整，当前磁盘中的文件为最终确认版本
- `favorites` 与 `rankings` 为本次后半段新增完成页面，截图也已导出完毕

## 给 ClaudeCode 的实现建议

- 先读 `designs/design-tokens.md`
- 以 PNG 截图确认视觉结果，以 `.pen` 文件确认布局结构
- 优先实现桌面端 1440px 版本，再补响应式
- 登录页、注册页、收藏页、排行榜页已经具备较清晰的组件边界，适合并行开发
- 如果实现过程中需要取舍，优先保留层级、留白、圆角、颜色关系，不要过度追求像素级动画或装饰细节
