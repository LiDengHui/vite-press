---
title: CSS 现代布局模式
date: 2025-04-29
tags:
  - CSS
  - 布局
categories:
  - 技术文档
  - 前端
  - CSS
  - 布局系统
---

# CSS 现代布局模式

[[toc]]

CSS 现代布局模式（Modern Layout Patterns）利用 Flexbox、Grid、Container Queries 等新特性，构建健壮、可维护的响应式布局。本文系统梳理当前主流的现代布局方案。

---

## Flexbox 布局模式

### 圣杯布局（Holy Grail）

```css
.holy-grail {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.holy-grail header,
.holy-grail footer {
  flex-shrink: 0;
}

.holy-grail main {
  display: flex;
  flex: 1;
}

.holy-grail .content {
  flex: 1;
  order: 2;
}

.holy-grail .sidebar-left {
  width: 200px;
  order: 1;
}

.holy-grail .sidebar-right {
  width: 200px;
  order: 3;
}
```

### 等高列

```css
.equal-height {
  display: flex;
}

.equal-height > * {
  flex: 1;
}
```

### 底部固定（Sticky Footer）

```css
.sticky-footer {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.sticky-footer main {
  flex: 1;
}
```

---

## Grid 布局模式

### 12 列网格系统

```css
.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1rem;
}

.col-1 { grid-column: span 1; }
.col-2 { grid-column: span 2; }
.col-3 { grid-column: span 3; }
.col-4 { grid-column: span 4; }
.col-6 { grid-column: span 6; }
.col-12 { grid-column: span 12; }
```

### 瀑布流布局（Masonry）

```css
.masonry {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: 10px;
  gap: 1rem;
}

.masonry-item {
  grid-row: span calc(var(--height) / 10);
}
```

### 棋盘布局

```css
.checkerboard {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
}

.checkerboard > *:nth-child(8n+1),
.checkerboard > *:nth-child(8n+3),
.checkerboard > *:nth-child(8n+6),
.checkerboard > *:nth-child(8n+8) {
  background: #f5f5f5;
}
```

---

## 容器查询布局

### 基于容器大小的布局

```css
.card-container {
  container-type: inline-size;
}

.card {
  display: flex;
  flex-direction: column;
}

@container (min-width: 400px) {
  .card {
    flex-direction: row;
  }
  
  .card img {
    width: 40%;
  }
}

@container (min-width: 600px) {
  .card {
    flex-direction: row;
  }
  
  .card img {
    width: 30%;
  }
  
  .card .description {
    font-size: 1.1rem;
  }
}
```

### 命名容器

```css
.sidebar {
  container-type: inline-size;
  container-name: sidebar;
}

.main-content {
  container-type: inline-size;
  container-name: main;
}

@container main (min-width: 500px) {
  .widget {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

---

## 现代响应式模式

### 流式排版

```css
:root {
  --fluid-min: 16px;
  --fluid-max: 24px;
  --fluid-min-vw: 320px;
  --fluid-max-vw: 1200px;
  
  --fluid-size: clamp(
    var(--fluid-min),
    calc(var(--fluid-min) + (var(--fluid-max) - var(--fluid-min)) * 
      ((100vw - var(--fluid-min-vw)) / (var(--fluid-max-vw) - var(--fluid-min-vw))),
    var(--fluid-max)
  );
}

body {
  font-size: var(--fluid-size);
}
```

### 流式间距

```css
:root {
  --space-xs: clamp(0.5rem, 0.5rem + 0.5vw, 1rem);
  --space-sm: clamp(0.75rem, 0.75rem + 0.75vw, 1.5rem);
  --space-md: clamp(1rem, 1rem + 1vw, 2rem);
  --space-lg: clamp(1.5rem, 1.5rem + 1.5vw, 3rem);
  --space-xl: clamp(2rem, 2rem + 2vw, 4rem);
}
```

### 流式网格

```css
.fluid-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(clamp(250px, 30%, 400px), 1fr)
  );
  gap: clamp(1rem, 2vw, 2rem);
}
```

---

## 视口单位布局

### 100vh 问题与解决方案

```css
/* 传统方式（移动端有地址栏问题） */
.full-height {
  height: 100vh;
}

/* 现代解决方案 */
.full-height-modern {
  height: 100vh;
  height: 100dvh;  /* 动态视口高度 */
  height: 100svh;  /* 小视口高度 */
  height: 100lvh;  /* 大视口高度 */
}
```

### 安全区域适配

```css
.safe-area {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| Flexbox | 29+ | 9+ | 28+ | 12+ |
| Grid | 57+ | 10.1+ | 52+ | 16+ |
| Container Queries | 105+ | 16+ | 110+ | 105+ |
| dvh/svh/lvh | 108+ | 15.4+ | 101+ | 108+ |

---

## 奇淫技巧

### 技巧一：CSS Grid 自动换行

```css
.auto-wrap {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}
```

### 技巧二：Flexbox 换行布局

```css
.flex-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.flex-wrap > * {
  flex: 1 1 300px;
}
```

### 技巧三：CSS Subgrid（Firefox 支持）

```css
.grid-parent {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
}

.grid-child {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;
}
```

### 技巧四： aspect-ratio 保持比例

```css
.aspect-card {
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.square {
  aspect-ratio: 1 / 1;
}
```

### 技巧五：CSS 三角函数布局

```css
/* Chrome 111+ */
.circular-layout {
  --radius: 100px;
  --count: 6;
  --angle: calc(360deg / var(--count));
}

.circular-layout > * {
  position: absolute;
  transform: translate(
    calc(cos(var(--angle) * var(--i)) * var(--radius)),
    calc(sin(var(--angle) * var(--i)) * var(--radius))
  );
}
```

---

## 参考资料

- [MDN: CSS Grid Layout](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_grid_layout)
- [MDN: CSS Flexbox](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_flexible_box_layout)
- [web.dev: Container Queries](https://web.dev/articles/cq-layout)
- [Every Layout](https://every-layout.dev/)
