---
title: CSS Grid 布局详解
date: 2025-04-29
tags:
  - CSS
  - 布局
  - Grid
categories:
  - 技术文档
  - 前端
  - CSS
  - 布局系统
---

# CSS Grid 布局详解

[[toc]]

CSS Grid 布局（网格布局）是 CSS 中最强大的二维布局系统。它可以同时处理行和列，轻松实现复杂的网页布局，是 Flexbox 的重要补充。

---

## 基础概念

### 网格容器与项目

```css
.container {
  display: grid;           /* 块级网格 */
  /* 或 */
  display: inline-grid;    /* 行内网格 */
}
```

### 定义网格轨道

```css
.container {
  display: grid;
  grid-template-columns: 200px 200px 200px;  /* 三列等宽 */
  grid-template-rows: 100px 200px;            /* 两行不同高 */
}
```

### fr 单位

```css
.container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;  /* 中间列是其他的2倍 */
}

.container-equal {
  grid-template-columns: repeat(3, 1fr);  /* 三等分 */
}
```

---

## 网格轨道

### repeat() 函数

```css
.container {
  grid-template-columns: repeat(4, 1fr);        /* 4列等分 */
  grid-template-columns: repeat(3, 100px 1fr);  /* 重复模式 */
}
```

### minmax() 函数

```css
.container {
  grid-template-columns: 200px minmax(200px, 1fr);
  /* 第一列固定200px，第二列最小200px，剩余空间占满 */
}
```

### auto-fit 与 auto-fill

```css
.container {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  /* 自动填充，项目少时拉伸 */
}

.container-fill {
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  /* 自动填充，保持列宽 */
}
```

### 轨道列表

```css
.container {
  grid-template-columns: 
    [sidebar-start] 200px 
    [sidebar-end content-start] 1fr 
    [content-end];
}
```

---

## 网格间距

```css
.container {
  gap: 1rem;                    /* 行和列间距 */
  column-gap: 1rem;             /* 列间距 */
  row-gap: 2rem;                /* 行间距 */
}
```

---

## 网格项目定位

### 基于线的定位

```css
.item {
  grid-column-start: 1;
  grid-column-end: 3;     /* 跨越第1到第3条线 */
  grid-row-start: 1;
  grid-row-end: 2;
}

/* 简写 */
.item {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
}

/* 跨越所有列 */
.item-full {
  grid-column: 1 / -1;
}
```

### span 关键字

```css
.item {
  grid-column: span 2;    /* 跨越2列 */
  grid-row: span 3;       /* 跨越3行 */
}
```

### 基于区域定位

```css
.container {
  grid-template-areas:
    "header header header"
    "sidebar content content"
    "footer footer footer";
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.content { grid-area: content; }
.footer { grid-area: footer; }
```

---

## 对齐控制

### justify-items / align-items

```css
.container {
  justify-items: center;    /* 水平居中 */
  align-items: center;      /* 垂直居中 */
  place-items: center;      /* 简写：同时设置水平和垂直 */
}
```

### justify-content / align-content

```css
.container {
  justify-content: space-between;  /* 水平分布 */
  align-content: center;           /* 垂直分布 */
  place-content: center;           /* 简写 */
}
```

### 项目自身对齐

```css
.item {
  justify-self: end;       /* 项目自身水平对齐 */
  align-self: start;       /* 项目自身垂直对齐 */
  place-self: center;      /* 简写 */
}
```

---

## 隐式网格

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 100px;        /* 隐式行高 */
  grid-auto-flow: row;          /* 自动填充方向 */
}

/* 密集填充 */
.container-dense {
  grid-auto-flow: row dense;    /* 尝试填充空洞 */
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| display: grid | 57+ | 10.1+ | 52+ | 16+ |
| gap | 66+ | 11+ | 63+ | 16+ |
| subgrid | 117+ | 16+ | 71+ | 117+ |
| masonry | 实验性 | 实验性 | 实验性 | 实验性 |

---

## 奇淫技巧

### 技巧一：圣杯布局

```css
.holy-grail {
  display: grid;
  grid-template: auto 1fr auto / auto 1fr auto;
  min-height: 100vh;
}

.holy-grail > header { grid-column: 1 / 4; }
.holy-grail > aside { grid-column: 1 / 2; }
.holy-grail > main { grid-column: 2 / 3; }
.holy-grail > article { grid-column: 3 / 4; }
.holy-grail > footer { grid-column: 1 / 4; }
```

### 技巧二：棋盘格布局

```css
.chessboard {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  aspect-ratio: 1;
}

.chessboard > *:nth-child(16n+1),
.chessboard > *:nth-child(16n+3),
.chessboard > *:nth-child(16n+5),
.chessboard > *:nth-child(16n+7),
.chessboard > *:nth-child(16n+10),
.chessboard > *:nth-child(16n+12),
.chessboard > *:nth-child(16n+14),
.chessboard > *:nth-child(16n+16) {
  background: #000;
}
```

### 技巧三：瀑布流模拟

```css
.masonry {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 10px;
  gap: 1rem;
}

.masonry > *:nth-child(4n+1) { grid-row: span 15; }
.masonry > *:nth-child(4n+2) { grid-row: span 20; }
.masonry > *:nth-child(4n+3) { grid-row: span 18; }
.masonry > *:nth-child(4n+4) { grid-row: span 12; }
```

### 技巧四：重叠网格

```css
.overlap {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.overlap > .image {
  grid-column: 1 / -1;
  grid-row: 1 / 2;
}

.overlap > .content {
  grid-column: 2 / 3;
  grid-row: 1 / 2;
  z-index: 1;
  background: rgba(255,255,255,0.9);
  padding: 2rem;
}
```

### 技巧五：自动编号网格

```css
.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  counter-reset: grid-item;
}

.auto-grid > * {
  counter-increment: grid-item;
}

.auto-grid > *::before {
  content: counter(grid-item);
  font-size: 2rem;
  font-weight: bold;
}
```

---

## 参考资料

- [MDN Grid Layout](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_grid_layout)
- [CSS-Tricks: A Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)
