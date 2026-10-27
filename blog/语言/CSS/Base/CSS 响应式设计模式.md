---
title: CSS 响应式设计模式
date: 2025-04-29
tags:
  - CSS
  - 响应式
  - 前端
  - 设计模式
categories:
  - 技术文档
  - 前端
  - CSS
  - 布局系统
---

# CSS 响应式设计模式

[[toc]]

响应式设计是构建现代网站的基石。本文系统梳理了主流的响应式布局模式、断点策略和现代 CSS 技术，帮助你应对从手机到超宽屏的各种设备。

---

## 断点策略

### 设备无关断点

```css
/* 基于内容而非设备的断点 */
/* 当布局需要改变时设置断点 */

/* 小屏手机 */
@media (min-width: 20rem) { }   /* 320px */

/* 大屏手机 */
@media (min-width: 23.4375rem) { }  /* 375px */

/* 平板竖屏 */
@media (min-width: 48rem) { }   /* 768px */

/* 平板横屏/小桌面 */
@media (min-width: 64rem) { }   /* 1024px */

/* 桌面 */
@media (min-width: 80rem) { }   /* 1280px */

/* 大屏桌面 */
@media (min-width: 90rem) { }   /* 1440px */

/* 超宽屏 */
@media (min-width: 120rem) { }  /* 1920px */
```

### 移动优先 vs 桌面优先

```css
/* ✅ 移动优先：从最小屏幕开始 */
.card {
  width: 100%;  /* 移动端默认 */
}

@media (min-width: 48rem) {
  .card {
    width: 50%;  /* 平板 */
  }
}

@media (min-width: 64rem) {
  .card {
    width: 33.333%;  /* 桌面 */
  }
}

/* ❌ 桌面优先：从最大屏幕开始 */
.card {
  width: 33.333%;  /* 桌面默认 */
}

@media (max-width: 64rem) {
  .card {
    width: 50%;  /* 平板 */
  }
}

@media (max-width: 48rem) {
  .card {
    width: 100%;  /* 移动端 */
  }
}
```

---

## 流体布局模式

### 等宽网格

```css
.equal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  gap: 1.5rem;
}
```

### 圣杯布局

```css
.holy-grail {
  display: grid;
  grid-template-areas:
    "header header header"
    "nav main aside"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.holy-grail > header { grid-area: header; }
.holy-grail > nav    { grid-area: nav; }
.holy-grail > main   { grid-area: main; }
.holy-grail > aside  { grid-area: aside; }
.holy-grail > footer { grid-area: footer; }

@media (max-width: 64rem) {
  .holy-grail {
    grid-template-areas:
      "header"
      "nav"
      "main"
      "aside"
      "footer";
    grid-template-columns: 1fr;
  }
}
```

### 侧边栏 + 主内容

```css
.sidebar-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (max-width: 64rem) {
  .sidebar-layout {
    grid-template-columns: 1fr;
  }
}
```

### 卡片网格

```css
.card-grid {
  display: grid;
  gap: 1.5rem;
  /* 自动填充，最小 280px，最大 1fr */
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
}
```

---

## 容器查询布局

### 卡片自适应

```css
.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card {
    display: flex;
    gap: 1rem;
  }
  
  .card__image {
    width: 40%;
    flex-shrink: 0;
  }
}

@container card (min-width: 600px) {
  .card {
    flex-direction: row;
  }
  
  .card__title {
    font-size: 1.5rem;
  }
}
```

### 多容器查询

```css
.widget {
  container-type: inline-size;
}

@container (min-width: 300px) {
  .widget__stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
}

@container (min-width: 500px) {
  .widget__stats {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

---

## 流体排版

### clamp 实现

```css
:root {
  --fs-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --fs-sm: clamp(0.875rem, 0.8rem + 0.375vw, 1rem);
  --fs-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  --fs-md: clamp(1.25rem, 1rem + 1.25vw, 1.5rem);
  --fs-lg: clamp(1.5rem, 1.2rem + 1.5vw, 2rem);
  --fs-xl: clamp(2rem, 1.5rem + 2.5vw, 3rem);
  --fs-2xl: clamp(2.5rem, 1.8rem + 3.5vw, 4rem);
}
```

### 流体间距

```css
:root {
  --space-xs: clamp(0.25rem, 0.15rem + 0.5vw, 0.5rem);
  --space-sm: clamp(0.5rem, 0.3rem + 1vw, 1rem);
  --space-md: clamp(1rem, 0.5rem + 2vw, 2rem);
  --space-lg: clamp(2rem, 1rem + 4vw, 4rem);
  --space-xl: clamp(4rem, 2rem + 8vw, 8rem);
}
```

---

## 图片响应式

### 容器自适应图片

```css
.responsive-image {
  container-type: inline-size;
}

.responsive-image img {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

@container (min-width: 600px) {
  .responsive-image img {
    aspect-ratio: 21 / 9;
  }
}
```

### 不同屏幕加载不同图片

```html
<picture>
  <source media="(min-width: 1200px)" srcset="hero-large.jpg">
  <source media="(min-width: 768px)" srcset="hero-medium.jpg">
  <img src="hero-small.jpg" alt="Hero image">
</picture>
```

---

## 导航响应式

### 汉堡菜单切换

```css
.nav {
  display: flex;
  gap: 2rem;
}

.nav__toggle {
  display: none;
}

@media (max-width: 48rem) {
  .nav {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    padding: 1rem;
  }
  
  .nav.is-open {
    display: flex;
  }
  
  .nav__toggle {
    display: block;
  }
}
```

### 响应式导航模式

```css
/* 小屏：汉堡菜单 */
/* 中屏：顶部横向 */
/* 大屏：顶部 + 下拉 */

.nav {
  display: flex;
  gap: clamp(1rem, 2vw, 3rem);
}

.nav__link {
  font-size: var(--fs-sm);
  padding: 0.5rem 0;
}

@media (max-width: 48rem) {
  .nav {
    flex-direction: column;
    gap: 0;
  }
  
  .nav__link {
    padding: 1rem;
    border-bottom: 1px solid #eee;
  }
}
```

---

## 表格响应式

### 横向滚动

```css
.table-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.table-wrapper table {
  min-width: 600px;
  width: 100%;
}
```

### 卡片式表格

```css
@media (max-width: 48rem) {
  .responsive-table thead {
    display: none;
  }
  
  .responsive-table tbody tr {
    display: block;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
  }
  
  .responsive-table td {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border: none;
  }
  
  .responsive-table td::before {
    content: attr(data-label);
    font-weight: bold;
  }
}
```

---

## 视口单位

### 安全区域适配

```css
.safe-area {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

### 视口单位最佳实践

```css
.fullscreen-hero {
  /* 考虑地址栏动态高度 */
  height: 100svh;  /* 小视口高度 */
  min-height: 100svh;
}

.fixed-header {
  height: 100lvh;  /* 大视口高度 */
}
```

---

## 暗色模式

```css
:root {
  --bg: #ffffff;
  --text: #1a1a1a;
  --border: #e0e0e0;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #1a1a1a;
    --text: #f5f5f5;
    --border: #444444;
  }
}

/* 手动切换 */
[data-theme="dark"] {
  --bg: #1a1a1a;
  --text: #f5f5f5;
  --border: #444444;
}

[data-theme="light"] {
  --bg: #ffffff;
  --text: #1a1a1a;
  --border: #e0e0e0;
}
```

---

## 打印样式

```css
@media print {
  /* 隐藏不必要元素 */
  .no-print,
  nav,
  .sidebar,
  .ads {
    display: none !important;
  }
  
  /* 确保背景打印 */
  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  
  /* 分页控制 */
  .page-break {
    page-break-before: always;
  }
  
  /* 链接显示 URL */
  a[href]::after {
    content: ' (' attr(href) ')';
    font-size: 0.8em;
  }
}
```

---

## 奇淫技巧

### 技巧一：完美居中组合

```css
.perfect-center {
  display: grid;
  place-items: center;
  min-height: 100svh;
}
```

### 技巧二：流体容器

```css
.fluid-container {
  width: min(100% - 2rem, 1200px);
  margin-inline: auto;
}
```

### 技巧三：响应式纵横比

```css
.aspect-video {
  aspect-ratio: 16 / 9;
}

@media (max-width: 48rem) {
  .aspect-video {
    aspect-ratio: 4 / 3;
  }
}
```

### 技巧四：内容感知换行

```css
.word-break {
  overflow-wrap: break-word;
  hyphens: auto;
}
```

### 技巧五：滚动吸附轮播

```css
.carousel {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.carousel::-webkit-scrollbar {
  display: none;
}

.carousel__item {
  flex: 0 0 80%;
  scroll-snap-align: start;
}

@media (min-width: 48rem) {
  .carousel__item {
    flex: 0 0 40%;
  }
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| Container Queries | 105+ | 16+ | 110+ | 105+ |
| clamp() | 79+ | 13.1+ | 75+ | 79+ |
| aspect-ratio | 88+ | 14+ | 89+ | 88+ |
| env() | 69+ | 11.1+ | 65+ | 79+ |
| prefers-color-scheme | 76+ | 12.1+ | 67+ | 79+ |

---

## 参考资料

- [MDN 响应式设计](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [MDN Container Queries](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_containment/Container_queries)
- [Every Layout](https://every-layout.dev/)
- [Responsive Patterns](https://bradfrost.github.io/this-is-responsive/patterns.html)
