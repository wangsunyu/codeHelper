# 接口对接审查报告

**日期：** 2026-03-21
**审查范围：** 前后端全量接口对接、错误处理、拦截器逻辑
**审查结论：** 共发现 8 个 Bug，全部已修复

---

## Bug 列表

### 🔴 严重

#### Bug 1 — `favorite_count` 永远不增加
**文件：** `backend/src/models/favorite.model.ts`
**函数：** `add()`
**原因：** `INSERT IGNORE` 先插入行，随后的 `UPDATE ... NOT EXISTS` 检查发现行已存在，条件永远为 false，`favorite_count` 从不递增。
**修复：** 改为检查 `result.affectedRows > 0`，仅在实际插入新行时执行 count 更新。

```ts
// 修复前
await pool.query('INSERT IGNORE INTO favorites ...');
await pool.query('UPDATE skills SET favorite_count = favorite_count + 1 WHERE id = ? AND NOT EXISTS (...)');

// 修复后
const [result] = await pool.query('INSERT IGNORE INTO favorites ...');
if (result.affectedRows > 0) {
  await pool.query('UPDATE skills SET favorite_count = favorite_count + 1 WHERE id = ?');
}
```

---

#### Bug 2 — 登录失败拦截器死锁，按钮永久卡在"登录中"
**文件：** `frontend/src/services/api.ts`
**现象：** 密码错误时，后端正确返回 `{"success":false,"error":"邮箱或密码错误"}`，但前端登录按钮永久显示"登录中"，错误信息不显示。
**原因：** 401 拦截器拦截了 `/auth/login` 的 401 响应，尝试调用 `/auth/refresh`。refresh 因无 cookie 也返回 401，又被拦截器入队等待 `isRefreshing=false`。但 `isRefreshing` 只在外层 finally 中复位，而外层 try 正在 `await` refresh——**循环等待，死锁**。`isSubmitting` 永远不恢复，错误永远不展示。
**修复：** 排除所有 `/auth/` 路径不走 refresh 拦截逻辑。

```ts
// 修复前
if (err.response?.status === 401 && !original._retry) {

// 修复后
if (err.response?.status === 401 && !original._retry && !original.url?.startsWith('/auth/')) {
```

---

### 🟠 高危

#### Bug 3 — `handleDelete` 无 try/catch，失败时 unhandled rejection
**文件：** `frontend/src/pages/SkillDetailPage.tsx`
**原因：** `await skillService.remove(skill.id)` 无任何错误捕获，删除失败（403/500）时抛出未处理异常，UI 无任何反馈。
**修复：** 包裹 try/catch，错误写入 `actionError` 状态并展示给用户。

#### Bug 4 — `handleFavorite` 无 catch，错误静默丢失
**文件：** `frontend/src/pages/SkillDetailPage.tsx`
**原因：** try/finally 结构缺少 catch，收藏/取消收藏 API 失败时 `finally` 恢复 loading 状态，但错误被吞掉，用户完全不知道操作失败。
**修复：** 补充 catch 块，将错误写入 `actionError` 状态。

#### Bug 5 — `useFavorite.toggle` 无 catch，错误静默丢失
**文件：** `frontend/src/hooks/useFavorite.ts`
**原因：** 同 Bug 4，try/finally 无 catch。
**修复：** 补充 catch，新增 `error` 字段加入返回值，调用方可按需展示。

---

### 🟡 中等

#### Bug 6 — 收藏状态无法正确初始化，始终显示"收藏到我的清单"
**文件：** `frontend/src/pages/SkillDetailPage.tsx` + 后端
**原因：** `isFavorited` 初始值硬编码为 false，后端 `checkExists` 函数已实现但从未暴露为接口。已登录用户访问自己收藏过的 Skill 详情页，按钮始终显示未收藏状态。
**修复：**
- 后端新增 `GET /api/v1/favorites/:skillId/status` 接口
- 前端新增 `favoriteService.check()`
- 在 `SkillDetailPage` 的 useEffect 中查询并初始化 `isFavorited`

#### Bug 7 — 收藏列表只显示前 3 条
**文件：** `frontend/src/pages/FavoritesPage.tsx`
**原因：** `skills.slice(0, 3).map(...)` 截断渲染，超过 3 条收藏的用户无法看到完整列表。
**修复：** 改为 `skills.map(...)`。

#### Bug 8 — 下载数显示双 "k" 后缀
**文件：** `frontend/src/pages/SkillDetailPage.tsx`
**原因：** 模板中 `{formatDownloadMetric(skill.download_count)}k`，而 `formatDownloadMetric` 已对 ≥1000 的值返回带 "k" 的字符串，导致渲染 "1.2kk"。
**修复：** 删除模板末尾多余的 `k`。

---

### 🔵 类型问题

#### Bug 9（附带修复）— 登录响应缺少 `avatar_url` 和 `created_at`
**文件：** `backend/src/services/auth.service.ts`
**原因：** `login()` 返回 `{ id, username, email }`，但前端 `IUser` 类型还要求 `avatar_url` 和 `created_at`，导致这两个字段为 `undefined` 而非预期的 `null`/字符串。
**修复：** 在返回对象中补全 `avatar_url` 和 `created_at`。

---

## 修复文件汇总

| 文件 | 修改内容 |
|------|---------|
| `backend/src/models/favorite.model.ts` | 修复 `add()` 中 `favorite_count` 不更新的逻辑 |
| `backend/src/services/auth.service.ts` | `login()` 返回补全 `avatar_url`、`created_at` |
| `backend/src/controllers/favorite.controller.ts` | 新增 `check()` controller |
| `backend/src/routes/favorite.routes.ts` | 新增 `GET /:skillId/status` 路由 |
| `frontend/src/services/api.ts` | 拦截器排除 `/auth/*` 路径 |
| `frontend/src/services/favorite.ts` | 新增 `check()` 方法 |
| `frontend/src/pages/SkillDetailPage.tsx` | 修复 handleDelete/handleFavorite 错误处理；修复双 k；初始化 isFavorited |
| `frontend/src/pages/FavoritesPage.tsx` | 移除 `slice(0, 3)` |
| `frontend/src/hooks/useFavorite.ts` | 补充 catch，新增 `error` 返回值 |

---

## 未修复 / 已知遗留问题

| 问题 | 说明 |
|------|------|
| refresh 失败后不跳转 /login | 当 access token 和 refresh token 同时失效时，受保护接口会报错但不自动跳转登录页。现有 ProtectedRoute 只在初始加载时检查登录状态，运行中过期无法捕获。需引入全局事件机制（如自定义事件或 Zustand）才能跨组件触发跳转，暂未实施。 |
