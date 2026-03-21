## Why

登录后立即调用需要认证的接口（如 POST /skills）返回 UNAUTHORIZED，refresh 接口也报"缺少刷新令牌"。根本原因是后端设置 cookie 时未指定 `path: '/'`，导致 cookie 作用域被限定在登录请求路径 `/api/v1/auth/` 下，其他路径的请求无法携带 cookie。

## What Changes

- `backend/src/controllers/auth.controller.ts`：`COOKIE_OPTS` 增加 `path: '/'`，使 access_token 和 refresh_token 对所有路径生效
- `backend/src/controllers/auth.controller.ts`：`clearCookie` 调用同步加上 `{ path: '/' }`，确保登出时能正确清除 cookie

## Root Cause

`res.cookie()` 不指定 `path` 时，Express 默认使用当前请求路径作为 cookie 的作用域。登录请求路径为 `/api/v1/auth/login`，cookie 被限定在 `/api/v1/auth/` 下。浏览器向 `/api/v1/skills` 发请求时不会携带该 cookie，后端读不到 token，返回 401 UNAUTHORIZED。

## Fix

```ts
// before
const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
};

// after
const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

// clearCookie also needs path
res.clearCookie('access_token', { path: '/' });
res.clearCookie('refresh_token', { path: '/' });
```

## Impact

- 修复登录后所有需要认证的接口（skills、favorites 等）均无法使用的问题
- 修复登出后 cookie 无法被清除的潜在问题
