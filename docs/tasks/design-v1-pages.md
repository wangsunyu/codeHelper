# 任务：V1 MVP 全页面 UI 设计

> 执行者：Codex
> 状态：待执行
> 日期：2026-03-19

---

## 任务目标

使用 Pencil（MCP 工具）按照项目既定设计风格，将 V1 Core MVP 的所有页面设计完成，每个页面保存为独立的 `.pen` 文件。

---

## 需求来源

- 需求文档：`docs/requirements/10-v1-core-mvp.md`
- 设计 Token：`designs/design-tokens.md`（**必读，所有设计必须严格遵守**）

---

## 设计风格速查

> 详细规范见 `designs/design-tokens.md`，以下为关键参数。

| 项目 | 值 |
|------|----|
| 页面背景 | `#FAF8F5`（温暖奶油色） |
| 卡片背景 | `#FFFFFF` |
| 主色调 | `#7C9082`（鼠尾草绿） |
| 主文字 | `#2D2D2D` |
| 次要文字 | `#8A8A8A` |
| 边框 | `#E8E4DF` |
| 标题字体 | Fraunces（衬线） |
| 正文/UI 字体 | Inter |
| 卡片圆角 | `20px` |
| 按钮圆角 | `24px` |
| 搜索框圆角 | `28px`（胶囊形） |
| 页面最大宽度 | `1440px` |
| 导航栏高度 | `76px` |

**整体风格：Minimal Vibrant 简洁现代 + Scandinavian 温暖奶油色**

---

## 需要设计的页面（共 8 个）

### 1. 首页 `/`
文件名：`homepage.pen`

内容区块（从上到下）：
- 导航栏：Logo + 导航菜单（首页/Skills/排行榜）+ 登录/注册按钮
- Hero 区：平台介绍大标题 + 副标题 + 搜索框（胶囊形）
- 热门 Skills：区块标题 + 3列卡片网格（8张卡片）
- 排行榜预览：区块标题 + Top 5 列表（含排名序号、标题、下载数）
- 平台统计：3个数字指标（总 Skills 数 / 总下载数 / 总用户数）
- Footer：深色背景 `#2D2D2D`，版权信息

### 2. Skills 列表页 `/skills`
文件名：`skills-list.pen`

内容区块：
- 导航栏（同首页）
- 页面标题 + 分类筛选 Tab（全部 / productivity / coding / writing / other）
- 卡片网格（3列，含分页控件）
- 每张卡片：标题、分类徽章、描述摘要、作者、下载数、收藏数、下载按钮

### 3. Skills 详情页 `/skills/:id`
文件名：`skills-detail.pen`

内容区块：
- 导航栏
- 面包屑导航（首页 > Skills > 当前标题）
- 左侧主区：标题、分类徽章、描述、文件信息（文件名/大小/类型）
- 右侧侧边栏：作者信息卡片、下载按钮（大）、收藏按钮、下载数/收藏数统计
- 发布时间

### 4. 发布 Skills 页 `/skills/publish`
文件名：`skills-publish.pen`

内容区块：
- 导航栏
- 页面标题
- 文件上传区（虚线边框拖拽区，含上传图标和提示文字）
- 表单：标题输入框、分类下拉选择、描述文本域
- 提交按钮（主色调）
- 文件限制说明（支持格式、大小限制）

### 5. 登录页 `/login`
文件名：`login.pen`

内容区块：
- 居中卡片布局（页面背景 + 白色卡片）
- Logo + 平台名称
- 邮箱输入框
- 密码输入框
- 登录按钮（主色调，全宽）
- 跳转注册链接

### 6. 注册页 `/register`
文件名：`register.pen`

内容区块：
- 居中卡片布局
- Logo + 平台名称
- 用户名输入框
- 邮箱输入框
- 密码输入框
- 确认密码输入框
- 注册按钮（主色调，全宽）
- 跳转登录链接

### 7. 我的收藏页 `/favorites`
文件名：`favorites.pen`

内容区块：
- 导航栏（已登录状态，显示用户名）
- 页面标题"我的收藏"+ 收藏数量
- 卡片网格（3列，与 Skills 列表卡片样式一致）
- 空状态：无收藏时显示插图 + 引导文字 + 去浏览按钮

### 8. 排行榜页 `/rankings`
文件名：`rankings.pen`

内容区块：
- 导航栏
- 页面标题
- 分类 Tab（全部 / productivity / coding / writing / other）
- 排行榜列表：序号（Top 3 用金/银/铜色高亮）、Skills 标题、作者、分类徽章、下载数
- 每条目有下载按钮

---

## 执行步骤

1. **读取设计规范**：先完整阅读 `designs/design-tokens.md`
2. **获取 Pencil 指南**：调用 `get_guidelines(topic="web-app")` 获取设计规则
3. **获取风格指南**：调用 `get_style_guide` 获取视觉灵感
4. **逐页设计**：按顺序设计每个页面，每页创建独立 `.pen` 文件
5. **截图验证**：每页设计完成后调用 `get_screenshot` 截图确认视觉效果
6. **导出截图**：调用 `export_nodes` 将截图保存到 `designs/screenshots/`
7. **提示用户保存**：每个 `.pen` 文件设计完成后，告知用户手动 Cmd+S 保存到 `designs/current/`

---

## 文件保存规则（重要）

**Pencil 无法自动保存 `.pen` 文件到磁盘，必须由用户手动保存。**

每完成一个页面设计后：
1. 告知用户：「请保存文件，文件名：`xxx.pen`，路径：`designs/current/`」
2. 等待用户确认保存完成
3. 用 `ls designs/current/` 验证文件存在后再继续下一个页面

---

## 输出文件清单

```
designs/current/
├── homepage.pen
├── skills-list.pen
├── skills-detail.pen
├── skills-publish.pen
├── login.pen
├── register.pen
├── favorites.pen
└── rankings.pen

designs/screenshots/
├── homepage.png
├── skills-list.png
├── skills-detail.png
├── skills-publish.png
├── login.png
├── register.png
├── favorites.png
└── rankings.png
```

---

## 完成标准

- [ ] 8 个页面全部设计完成
- [ ] 所有 `.pen` 文件已保存到 `designs/current/`
- [ ] 所有截图已导出到 `designs/screenshots/`
- [ ] 设计风格与 `designs/design-tokens.md` 保持一致
- [ ] 导航栏在所有页面保持一致
- [ ] 更新 `designs/versions/DESIGN_VERSIONS.md` 版本记录
