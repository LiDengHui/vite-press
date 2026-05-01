---
title: CSS 网格深入
date: 2025-04-29
tags:
  - CSS
categories:
  - 技术文档
  - 前端
  - CSS
  - 基础入门
---

# CSS 网格深入

[[toc]]

CSS Grid Layout 是二维布局系统，可以同时处理行和列的排列，是构建复杂页面布局的首选方案。本文深入讲解 Grid 的所有重要属性、模式和最佳实践。

---

## 容器属性

### display

```css
.grid {
  display: grid;         /* 块级网格 */
}

.inline-grid {
  display: inline-grid;  /* 行内网格 */
}
```

### grid-template-columns / rows

```css
/* 固定列宽 */
.fixed {
  grid-template-columns: 200px 200px 200px;
}

/* 等分布局 */
.equal {
  grid-template-columns: 1fr 1fr 1fr;
}

/* 混合布局 */
.mixed {
  grid-template-columns: 200px 1fr 2fr;
}

/* repeat 函数 */
.repeat {
  grid-template-columns: repeat(3, 1fr);
}

/* 自动填充 */
.auto-fill {
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

/* 自动适应 */
.auto-fit {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
```

### grid-template-areas

```css
.layout {
  grid-template-areas:
    "header header header"
    "sidebar content content"
    "footer footer footer";
  grid-template-columns: 200px 1fr 1fr;
  grid-template-rows: auto 1fr auto;
}

.layout header  { grid-area: header; }
.layout aside   { grid-area: sidebar; }
.layout main    { grid-area: content; }
.layout footer  { grid-area: footer; }
```

### gap

```css
.grid {
  gap: 16px;           /* 行列间距 */
  row-gap: 16px;       /* 行间距 */
  column-gap: 24px;    /* 列间距 */
}
```

### justify-items / align-items

```css
/* 水平对齐 */
.justify-start  { justify-items: start; }
.justify-end    { justify-items: end; }
.justify-center { justify-items: center; }
.justify-stretch { justify-items: stretch; }  /* 默认 */

/* 垂直对齐 */
.align-start    { align-items: start; }
.align-end      { align-items: end; }
.align-center   { align-items: center; }
.align-stretch  { align-items: stretch; }  /* 默认 */

/* 简写 */
.place-items: center;  /* align-items + justify-items */
```

### justify-content / align-content

```css
/* 多行/多列的整体对齐 */
.content-center {
  justify-content: center;
  align-content: center;
}

/* 简写 */
.place-content: center center;
```

---

## 项目属性

### grid-column / grid-row

```css
/* 占据列 */
.col-span-2 {
  grid-column: span 2;
}

/* 指定位置 */
.col-1-3 {
  grid-column: 1 / 3;  /* 从第1列到第3列 */
}

/* 占据行 */
.row-span-2 {
  grid-row: span 2;
}

/* 使用 grid-area */
.area {
  grid-area: 1 / 1 / 3 / 3;  /* row-start / col-start / row-end / col-end */
}
```

### justify-self / align-self

```css
.item {
  justify-self: center;  /* 水平方向 */
  align-self: center;    /* 垂直方向 */
  place-self: center;    /* 简写 */
}
```

---

## 高级功能

### minmax()

```css
.responsive-grid {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
```

### fit-content()

```css
.sidebar {
  grid-template-columns: fit-content(300px) 1fr;
}
```

### 隐式网格

```css
.implicit {
  grid-auto-rows: minmax(100px, auto);
  grid-auto-columns: 200px;
  grid-auto-flow: row dense;  /* dense 填充空白 */
}
```

### subgrid

```css
/* Firefox 支持 */
.subgrid {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;
}
```

---

## 常见布局模式

### 12 列网格

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

### 杂志布局

```css
.magazine {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 200px);
  gap: 1rem;
}

.magazine .feature {
  grid-column: span 2;
  grid-row: span 2;
}

.magazine .wide {
  grid-column: span 2;
}
```

### 瀑布流布局

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

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| Grid Layout | 57+ | 10.1+ | 52+ | 16+ |
| subgrid | 117+ | 16+ | 71+ | 117+ |
| gap (grid) | 66+ | 12+ | 61+ | 16+ |

---

## 奇淫技巧

### 技巧一：网格线命名

```css
.named-grid {
  grid-template-columns:
    [sidebar-start] 200px
    [sidebar-end main-start] 1fr
    [main-end];
}

.named-grid .sidebar {
  grid-column: sidebar-start / sidebar-end;
}
```

### 技巧二：重叠布局

```css
.overlap {
  display: grid;
  grid-template-areas: "stack";
}

.overlap > * {
  grid-area: stack;
}

.overlap .bg {
  z-index: 1;
}

.overlap .content {
  z-index: 2;
}
```

### 技巧三：圣杯布局

```css
.holy-grail {
  display: grid;
  grid-template:
    "header header header" auto
    "left center right" 1fr
    "footer footer footer" auto
    / 200px 1fr 200px;
  min-height: 100vh;
}
```

### 技巧四：响应式卡片

```css
.cards {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(min(100%, 300px), 1fr)
  );
  gap: 1rem;
}
```

### 技巧五：棋盘格背景

```css
.checkerboard {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
}

.checkerboard > :nth-child(even) {
  background: #f0f0f0;
}
```

---

## 参考资料

- [MDN: CSS Grid Layout](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_grid_layout)
- [CSS-Tricks: A Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Grid Garden](https://cssgridgarden.com/)
