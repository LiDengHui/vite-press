---
title: CSS Flexbox 布局详解
date: 2025-04-29
tags:
  - CSS
  - 布局
  - Flexbox
categories:
  - 技术文档
  - 前端
  - CSS
  - 布局系统
---

# CSS Flexbox 布局详解

[[toc]]

Flexbox（弹性盒子布局）是 CSS 中一维布局的核心方案。它擅长处理单行或单列内的元素对齐、分布和伸缩，与 Grid 的二维布局形成完美互补。

---

## 基础概念

### 弹性容器与项目

```css
.container {
  display: flex;        /* 块级弹性容器 */
  /* 或 */
  display: inline-flex; /* 行内弹性容器 */
}
```

### 主轴与交叉轴

- **主轴（Main Axis）**：由 `flex-direction` 决定，元素沿主轴排列
- **交叉轴（Cross Axis）**：垂直于主轴

---

## flex-direction

```css
.container {
  flex-direction: row;            /* 默认，水平从左到右 */
  flex-direction: row-reverse;    /* 水平从右到左 */
  flex-direction: column;         /* 垂直从上到下 */
  flex-direction: column-reverse; /* 垂直从下到上 */
}
```

---

## flex-wrap

```css
.container {
  flex-wrap: nowrap;       /* 默认，不换行 */
  flex-wrap: wrap;         /* 换行 */
  flex-wrap: wrap-reverse; /* 反向换行 */
}
```

### 简写

```css
.container {
  flex-flow: row wrap;     /* flex-direction + flex-wrap */
}
```

---

## 主轴对齐 justify-content

```css
.container {
  justify-content: flex-start;    /* 默认，左对齐 */
  justify-content: flex-end;      /* 右对齐 */
  justify-content: center;        /* 居中 */
  justify-content: space-between; /* 两端对齐 */
  justify-content: space-around;  /* 均匀分布，两侧有间距 */
  justify-content: space-evenly;  /* 完全均匀分布 */
}
```

---

## 交叉轴对齐 align-items

```css
.container {
  align-items: stretch;       /* 默认，拉伸填满 */
  align-items: flex-start;    /* 顶部对齐 */
  align-items: flex-end;      /* 底部对齐 */
  align-items: center;        /* 垂直居中 */
  align-items: baseline;      /* 基线对齐 */
}
```

---

## 多行对齐 align-content

```css
.container {
  align-content: stretch;       /* 默认 */
  align-content: flex-start;    /* 顶部对齐 */
  align-content: flex-end;      /* 底部对齐 */
  align-content: center;        /* 居中 */
  align-content: space-between; /* 两端对齐 */
  align-content: space-around;  /* 均匀分布 */
}
```

---

## 项目属性

### flex-grow

```css
.item {
  flex-grow: 0;  /* 默认，不伸缩 */
  flex-grow: 1;  /* 等分剩余空间 */
  flex-grow: 2;  /* 占2份 */
}
```

### flex-shrink

```css
.item {
  flex-shrink: 1;  /* 默认，空间不足时收缩 */
  flex-shrink: 0;  /* 不收缩 */
}
```

### flex-basis

```css
.item {
  flex-basis: auto;   /* 默认，基于内容宽度 */
  flex-basis: 200px;  /* 基础宽度 */
  flex-basis: 50%;    /* 基础百分比 */
}
```

### flex 简写

```css
.item {
  flex: 1;              /* flex-grow: 1, flex-shrink: 1, flex-basis: 0% */
  flex: 0 1 auto;       /* 默认值 */
  flex: 1 1 200px;      /* 完整写法 */
  flex: none;           /* 0 0 auto，不伸缩 */
}
```

---

## 项目对齐

### align-self

```css
.item {
  align-self: auto;        /* 继承容器 */
  align-self: center;      /* 单独居中 */
  align-self: flex-start;  /* 单独顶部对齐 */
  align-self: flex-end;    /* 单独底部对齐 */
}
```

### order

```css
.item-first { order: -1; }
.item-last { order: 99; }
```

> `order` 仅影响视觉顺序，不改变 DOM 顺序和阅读顺序。

---

## gap 间距

```css
.container {
  gap: 1rem;              /* 行列间距 */
  row-gap: 1rem;          /* 行间距 */
  column-gap: 2rem;       /* 列间距 */
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| display: flex | 29+ | 9+ | 28+ | 12+ |
| gap | 84+ | 14.1+ | 63+ | 84+ |
| flex-wrap | 29+ | 9+ | 28+ | 12+ |

---

## 奇淫技巧

### 技巧一：完美居中

```css
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
```

### 技巧二：底部固定

```css
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.page main {
  flex: 1;  /* 主内容区填满剩余空间 */
}
```

### 技巧三：等分导航

```css
.nav {
  display: flex;
}

.nav a {
  flex: 1;
  text-align: center;
  padding: 1rem;
}
```

### 技巧四：左侧固定右侧自适应

```css
.layout {
  display: flex;
}

.layout .sidebar {
  flex: 0 0 250px;  /* 固定250px */
}

.layout .main {
  flex: 1;          /* 填满剩余 */
}
```

### 技巧五：移动端底部栏

```css
.bottom-bar {
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
}

.bottom-bar a {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
}
```

### 技巧六：自动换行卡片

```css
.card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.card-list .card {
  flex: 1 1 300px;  /* 基础300px，可伸缩 */
}
```

---

## 参考资料

- [MDN Flexbox](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_flexible_box_layout)
- [CSS-Tricks: A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
