---
title: CSS 弹性盒子深入
date: 2025-04-29
tags:
  - CSS
  - Flexbox
  - 前端
categories:
  - 技术文档
  - 前端
  - CSS
  - 基础入门
---

# CSS 弹性盒子深入

[[toc]]

CSS 弹性盒子（Flexbox）是一维布局模型，专为一行或一列中的项目排列而设计。本文深入讲解 Flexbox 的所有属性、常见模式、陷阱和性能优化。

---

## 容器属性

### display

```css
.flex {
  display: flex;         /* 块级弹性容器 */
}

.inline-flex {
  display: inline-flex;  /* 行内弹性容器 */
}
```

### flex-direction

```css
.row            { flex-direction: row; }            /* 左 → 右（默认） */
.row-reverse    { flex-direction: row-reverse; }    /* 右 → 左 */
.column         { flex-direction: column; }         /* 上 → 下 */
.column-reverse { flex-direction: column-reverse; } /* 下 → 上 */
```

### flex-wrap

```css
.nowrap      { flex-wrap: nowrap; }      /* 不换行（默认） */
.wrap        { flex-wrap: wrap; }        /* 换行 */
.wrap-reverse { flex-wrap: wrap-reverse; } /* 反向换行 */
```

### justify-content（主轴对齐）

```css
.flex-start    { justify-content: flex-start; }    /* 起点对齐（默认） */
.flex-end      { justify-content: flex-end; }      /* 终点对齐 */
.center        { justify-content: center; }        /* 居中对齐 */
.space-between { justify-content: space-between; } /* 两端对齐 */
.space-around  { justify-content: space-around; }  /* 均匀分布（含边缘间距） */
.space-evenly  { justify-content: space-evenly; }  /* 完全均匀分布 */
```

### align-items（交叉轴对齐）

```css
.stretch     { align-items: stretch; }     /* 拉伸（默认） */
.flex-start  { align-items: flex-start; }  /* 起点对齐 */
.flex-end    { align-items: flex-end; }    /* 终点对齐 */
.center      { align-items: center; }      /* 居中对齐 */
.baseline    { align-items: baseline; }    /* 基线对齐 */
```

### align-content（多行对齐）

```css
.stretch       { align-content: stretch; }       /* 拉伸（默认） */
.flex-start    { align-content: flex-start; }    /* 起点 */
.flex-end      { align-content: flex-end; }      /* 终点 */
.center        { align-content: center; }        /* 居中 */
.space-between { align-content: space-between; } /* 两端 */
.space-around  { align-content: space-around; }  /* 均匀 */
.space-evenly  { align-content: space-evenly; }  /* 完全均匀 */
```

### gap

```css
.container {
  display: flex;
  gap: 16px;              /* 行列间距 */
  row-gap: 16px;          /* 行间距 */
  column-gap: 24px;       /* 列间距 */
}
```

---

## 项目属性

### flex-grow

```css
/* 不伸展（默认） */
.item-0 { flex-grow: 0; }

/* 等分剩余空间 */
.item-1 { flex-grow: 1; }

/* 按比例分配 */
.item-2 { flex-grow: 2; }  /* 占 2 份 */
.item-3 { flex-grow: 1; }  /* 占 1 份 */
```

### flex-shrink

```css
/* 允许收缩（默认） */
.shrink-1 { flex-shrink: 1; }

/* 禁止收缩 */
.no-shrink { flex-shrink: 0; }

/* 按比例收缩 */
.shrink-2 { flex-shrink: 2; }  /* 收缩速度是其他的 2 倍 */
```

### flex-basis

```css
/* 自动计算（默认） */
.auto-basis { flex-basis: auto; }

/* 固定大小 */
.fixed-basis { flex-basis: 200px; }

/* 内容大小 */
.content-basis { flex-basis: content; }
```

### flex 简写

```css
/* flex-grow flex-shrink flex-basis */
.flex-1 { flex: 1; }           /* 1 1 0% */
.flex-auto { flex: auto; }     /* 1 1 auto */
.flex-none { flex: none; }     /* 0 0 auto */
.flex-0 { flex: 0 1 auto; }    /* 默认值 */
```

### align-self

```css
.item {
  align-self: auto;        /* 继承容器（默认） */
  align-self: flex-start;  /* 起点对齐 */
  align-self: flex-end;    /* 终点对齐 */
  align-self: center;      /* 居中对齐 */
  align-self: stretch;     /* 拉伸 */
  align-self: baseline;    /* 基线对齐 */
}
```

### order

```css
/* 改变视觉顺序，不影响 DOM */
.first  { order: -1; }
.second { order: 0; }   /* 默认 */
.third  { order: 1; }
```

---

## 常见布局模式

### 等高列

```css
.equal-height {
  display: flex;
}

.equal-height > * {
  flex: 1;
}
```

### 水平垂直居中

```css
/* 方法 1 */
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 方法 2 */
.center-2 {
  display: flex;
}

.center-2 > * {
  margin: auto;
}
```

### 两端对齐

```css
.space-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

### 自动换行网格

```css
.auto-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.auto-grid > * {
  flex: 1 1 300px;  /* 最小 300px，超出换行 */
}
```

### 固定侧边栏

```css
.layout {
  display: flex;
}

.sidebar {
  flex: 0 0 250px;  /* 固定 250px */
}

.main {
  flex: 1;  /* 占据剩余空间 */
}
```

### 底部固定

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

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| Flexbox | 29+ | 9+ | 28+ | 12+ |
| gap (flex) | 84+ | 14.1+ | 63+ | 84+ |

---

## 奇淫技巧

### 技巧一：纯 CSS 选项卡

```css
.tabs {
  display: flex;
  gap: 1px;
}

.tab-content {
  display: none;
}

.tab-radio:checked + .tab-label + .tab-content {
  display: block;
}
```

### 技巧二：响应式导航栏

```css
.navbar {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.navbar .brand {
  flex: 1 1 auto;
}

.navbar .menu {
  display: flex;
  gap: 1rem;
}

@media (max-width: 768px) {
  .navbar .menu {
    flex-basis: 100%;
    justify-content: center;
  }
}
```

### 技巧三：卡片底部对齐

```css
.card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.card {
  display: flex;
  flex-direction: column;
  flex: 1 1 300px;
}

.card .content {
  flex: 1;  /* 推挤底部 */
}
```

### 技巧四：圣杯布局

```css
.holy-grail {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
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
  flex: 0 0 200px;
  order: 1;
}

.holy-grail .sidebar-right {
  flex: 0 0 200px;
  order: 3;
}
```

### 技巧五：flex-grow 实现比例布局

```css
.ratio-1-2 {
  display: flex;
}

.ratio-1-2 > :first-child {
  flex: 1;
}

.ratio-1-2 > :last-child {
  flex: 2;
}
```

---

## 参考资源

- [MDN: Flexbox](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_flexible_box_layout)
- [CSS-Tricks: A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [Flexbox Froggy](https://flexboxfroggy.com/)
