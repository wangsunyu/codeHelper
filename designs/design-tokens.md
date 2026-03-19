# 设计全局配置（Design Tokens）

> 风格：第三种布局（Minimal Vibrant 简洁现代）+ 第一种颜色（Scandinavian 温暖奶油色 + 鼠尾草绿）
> 版本：v0.1.0 · 2026-03-18
> **非必要不修改**，如需调整请同步更新 Tailwind 配置和所有设计文件。

---

## 颜色系统

### 背景色
| Token | 色值 | Tailwind 自定义类 | 用途 |
|---|---|---|---|
| `bg-page` | `#FAF8F5` | `bg-page` | 页面背景（温暖奶油色） |
| `bg-card` | `#FFFFFF` | `bg-white` | 卡片、Hero 区背景 |
| `bg-surface` | `#F5F3EF` | `bg-surface` | 搜索框、次要按钮、标签页 |
| `bg-muted` | `#F0EDE8` | `bg-muted` | 占位图、禁用区域 |
| `bg-dark` | `#2D2D2D` | `bg-dark` | Footer 背景 |

### 文字色
| Token | 色值 | 用途 |
|---|---|---|
| `text-primary` | `#2D2D2D` | 主标题、正文 |
| `text-secondary` | `#8A8A8A` | 副标题、描述、导航非激活 |
| `text-muted` | `#ADADAD` | 占位符、禁用文字 |
| `text-body` | `#5A5A5A` | 正文内容 |

### 主色调（鼠尾草绿）
| Token | 色值 | 用途 |
|---|---|---|
| `primary` | `#7C9082` | 主按钮、激活导航、图标、评分 |
| `primary-tint` | `#7C908215` | 徽章背景、hover 状态 |

### 边框
| Token | 色值 | 用途 |
|---|---|---|
| `border` | `#E8E4DF` | 卡片边框、导航底线 |
| `border-subtle` | `#F0EDE8` | 表格行分隔线 |

### 语义色
| Token | 色值 | 用途 |
|---|---|---|
| `success` | `#22C55E` | 正向增长指标 |
| `danger` | `#EF4444` | 错误、危险操作 |
| `warning` | `#F59E0B` | 警告状态 |

---

## 字体系统

### 字体族
| Token | 值 | 用途 |
|---|---|---|
| `font-display` | `Fraunces, serif` | 页面标题、区块标题、Logo |
| `font-ui` | `Inter, sans-serif` | 导航、按钮、标签、正文 |
| `font-mono` | `IBM Plex Mono, monospace` | 数据指标、技术内容 |

### 字号
| Token | 值 | 用途 |
|---|---|---|
| `text-hero` | `48px` | Hero 主标题 |
| `text-section` | `28px` | 区块标题 |
| `text-card-lg` | `22px` | 卡片大标题 |
| `text-logo` | `20px` | Logo 文字 |
| `text-body-lg` | `18px` | Hero 副标题 |
| `text-btn` | `15px` | 主要按钮 |
| `text-base` | `14px` | 正文、导航 |
| `text-sm` | `13px` | 辅助文字、标签 |
| `text-badge` | `11px` | 徽章 |

### 字重
| Token | 值 | 用途 |
|---|---|---|
| `font-semibold` | `600` | 数字统计、卡片标题 |
| `font-medium` | `500` | 按钮、激活导航、徽章 |
| `font-normal` | `400` | 正文、非激活导航 |

### 字间距
| Token | 值 | 用途 |
|---|---|---|
| `tracking-hero` | `-1px` | Hero 大标题 |
| `tracking-section` | `-0.5px` | 区块标题、Logo |

---

## 间距系统

### 内边距
| Token | 值 | 用途 |
|---|---|---|
| `p-page` | `40px 80px` | 页面内容区 |
| `p-nav` | `20px 80px` | 导航栏 |
| `p-hero` | `60px 80px` | Hero 区 |
| `p-card` | `24px` | 卡片 |
| `p-card-lg` | `28px` | 大卡片（上传引导） |
| `p-rank-item` | `16px 20px` | 排行榜条目 |
| `p-btn-lg` | `14px 28px` | 大按钮 |
| `p-btn-md` | `12px 20px` | 中按钮 |
| `p-badge` | `6px 12px` | 徽章 |
| `p-tab` | `8px 16px` | 标签页 |
| `p-search` | `10px 16px` | 搜索框 |

### 间隙
| Token | 值 | 用途 |
|---|---|---|
| `gap-nav` | `48px` | 导航元素间距 |
| `gap-section` | `40px` | 页面区块间距 |
| `gap-hero` | `24px` | Hero 内部间距 |
| `gap-card-grid` | `20px` | 卡片网格间距 |
| `gap-card` | `16px` | 卡片内部间距 |
| `gap-rank` | `20px` | 排行榜条目间距 |
| `gap-stats` | `40px` | 统计数据间距 |
| `gap-nav-menu` | `32px` | 导航菜单间距 |

---

## 圆角系统

| Token | 值 | 用途 |
|---|---|---|
| `rounded-card` | `20px` | 卡片 |
| `rounded-btn` | `24px` | 按钮、标签页 |
| `rounded-search` | `28px` | 搜索框（胶囊形） |
| `rounded-badge` | `16px` | 徽章 |
| `rounded-rank` | `16px` | 排行榜条目 |
| `rounded-icon` | `8px` | Logo 图标 |

---

## 布局系统

| Token | 值 | 用途 |
|---|---|---|
| `max-width` | `1440px` | 页面最大宽度 |
| `nav-height` | `76px` | 导航栏高度 |
| `btn-height-lg` | `48px` | 大按钮高度 |
| `btn-height-md` | `40px` | 中按钮高度 |
| `cols-desktop` | `3` | 桌面端卡片列数 |
| `cols-tablet` | `2` | 平板端卡片列数 |
| `cols-mobile` | `1` | 移动端卡片列数 |

---

## 断点系统

| 断点 | 最小宽度 | Tailwind 前缀 | 适用设备 |
|---|---|---|---|
| 默认 | 0px | — | 手机竖屏 |
| `sm` | `640px` | `sm:` | 手机横屏 |
| `md` | `768px` | `md:` | 平板 |
| `lg` | `1024px` | `lg:` | 桌面 |
| `xl` | `1280px` | `xl:` | 宽屏桌面 |

---

## Tailwind 配置映射

```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: '#7C9082',
      'primary-tint': 'rgba(124,144,130,0.08)',
      'bg-page': '#FAF8F5',
      'bg-surface': '#F5F3EF',
      'bg-muted': '#F0EDE8',
      'bg-dark': '#2D2D2D',
      'text-primary': '#2D2D2D',
      'text-secondary': '#8A8A8A',
      'text-muted': '#ADADAD',
      border: '#E8E4DF',
      'border-subtle': '#F0EDE8',
    },
    fontFamily: {
      display: ['Fraunces', 'serif'],
      ui: ['Inter', 'sans-serif'],
      mono: ['IBM Plex Mono', 'monospace'],
    },
    borderRadius: {
      card: '20px',
      btn: '24px',
      search: '28px',
      badge: '16px',
      rank: '16px',
      icon: '8px',
    },
    fontSize: {
      hero: ['48px', { lineHeight: '1.1', letterSpacing: '-1px' }],
      section: ['28px', { lineHeight: '1.2', letterSpacing: '-0.5px' }],
    },
  }
}
```

---

## 修改说明

修改此文件时需要同步：
1. `frontend/tailwind.config.ts` — 更新 Tailwind 主题配置
2. `designs/current/*.pen` — 更新设计文件
3. `designs/versions/DESIGN_VERSIONS.md` — 记录版本变更
