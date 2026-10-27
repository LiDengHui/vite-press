---
title: CSS 浮动深入
date: 2025-04-29
tags:
  - CSS
  - 浮动
  - 前端
categories:
  - 技术文档
  - 前端
  - CSS
  - 布局系统
---

# CSS 浮动深入

[[toc]]

CSS 浮动（Float）是经典的布局技术，虽然现代布局（Flexbox、Grid）已逐渐取代它，但理解浮动原理对于阅读旧代码、处理图文混排等场景仍然重要。本文深入讲解浮动的工作原理、清除技术和现代替代方案。

---

## 浮动基础

### 什么是浮动

```css
.float-left {
  float: left;   /* 向左浮动 */
}

.float-right {
  float: right;  /* 向右浮动 */
}

.no-float {
  float: none;   /* 不浮动（默认值） */
}
```

**浮动规则：**
- 元素脱离正常文档流
- 向左或向右移动，直到碰到包含块边缘或另一个浮动元素
- 其他内容（文本）会环绕浮动元素
- 浮动元素仍占据空间（不同于绝对定位）

### 图文混排

```css
.article img {
  float: left;
  margin: 0 1rem 1rem 0;
}

.article p {
  /* 文本自动环绕图片 */
}
```

---

## 清除浮动

### 为什么需要清除

当父元素只包含浮动子元素时，父元素高度会塌陷为 0。

```html
<div class="parent">
  <div class="float-left">浮动元素</div>
</div>
<!-- parent 高度为 0 -->
```

### 清除方法

```css
/* 方法 1: 空元素 */
.clear {
  clear: both;
}

/* 方法 2: 伪元素 */
.clearfix::after {
  content: '';
  display: table;
  clear: both;
}

/* 方法 3: overflow */
.overflow-clear {
  overflow: hidden;  /* 或 auto */
}

/* 方法 4: display: flow-root（现代方案） */
.modern-clear {
  display: flow-root;
}
```

### clear 属性

```css
.clear-left  { clear: left; }   /* 清除左浮动 */
.clear-right { clear: right; }  /* 清除右浮动 */
.clear-both  { clear: both; }   /* 清除两侧浮动 */
```

---

## 现代替代方案

### 使用 Flexbox

```css
/* 替代浮动布局 */
.flex-layout {
  display: flex;
  gap: 1rem;
}

.flex-layout > * {
  flex: 1;
}
```

### 使用 Grid

```css
/* 替代浮动网格 */
.grid-layout {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
```

### 使用 shape-outside

```css
/* 更灵活的图文环绕 */
.shaped {
  float: left;
  shape-outside: circle(50%);
  width: 200px;
  height: 200px;
  border-radius: 50%;
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| float | 1+ | 1+ | 1+ | 12+ |
| display: flow-root | 58+ | 13+ | 53+ | 79+ |
| shape-outside | 37+ | 10.1+ | 62+ | 79+ |

---

## 奇淫技巧

### 技巧一：多列等高

```css
.equal-height {
  overflow: hidden;
}

.equal-height > * {
  float: left;
  width: 33.33%;
  padding-bottom: 9999px;
  margin-bottom: -9999px;
}
```

### 技巧二：圣杯布局（浮动版）

```css
.holy-grail {
  overflow: hidden;
}

.holy-grail .main {
  float: left;
  width: 100%;
}

.holy-grail .sidebar {
  float: left;
  width: 200px;
  margin-left: -100%;
}

.holy-grail .extra {
  float: left;
  width: 200px;
  margin-left: -200px;
}
```

### 技巧三：图片画廊

```css
.gallery {
  overflow: hidden;
}

.gallery-item {
  float: left;
  width: calc(33.33% - 1rem);
  margin: 0.5rem;
}
```

### 技巧四：文字环绕形状

```css
.circle-text {
  float: left;
  shape-outside: polygon(
    0 0, 100% 0, 100% 100%, 0 100%,
    0 80%, 20% 60%, 20% 40%, 0 20%
  );
  width: 200px;
  height: 200px;
}
```

### 技巧五：杂志排版

```css
.magazine {
  column-count: 2;
  column-gap: 2rem;
}

.magazine img {
  float: left;
  margin: 0 1rem 1rem 0;
  shape-outside: margin-box;
}
```

---

## 参考资料

- [MDN: float](https://developer.mozilla.org/zh-CN/docs/Web/CSS/float)
- [MDN: clear](https://developer.mozilla.org/zh-CN/docs/Web/CSS/clear)
- [CSS-Tricks: All About Floats](https://css-tricks.com/all-about-floats/)
