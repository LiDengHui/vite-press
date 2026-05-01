---
title: CSS 浮动与清除浮动
date: 2025-04-29
tags:
  - CSS
  - 浮动
categories:
  - 技术文档
  - 前端
  - CSS
  - 布局系统
---

# CSS 浮动与清除浮动

[[toc]]

`float` 曾是网页多列布局的核心工具。虽然 Flexbox 和 Grid 已取代其布局地位，但理解浮动仍是掌握 CSS 布局演化史的关键，且在文字环绕、图片排版等场景依然不可替代。

---

## 浮动的本质

### 基础语法

```css
.float-left {
  float: left;   /* 元素向左浮动 */
}

.float-right {
  float: right;  /* 元素向右浮动 */
}

.float-none {
  float: none;   /* 取消浮动（默认值） */
}
```

### 浮动的行为特征

1. **脱离正常文档流**，但**仍占据空间**
2. 浮动元素会**向左或向右移动**，直到碰到容器边缘或另一个浮动元素
3. **行内元素会环绕浮动元素**——这是文字环绕图片的核心机制
4. 浮动元素的**外边距不会折叠**

### 文字环绕效果

```css
.float-figure {
  float: left;
  margin: 0 1rem 1rem 0;
  max-width: 300px;
}

.float-figure img {
  width: 100%;
  border-radius: 8px;
}
```

```html
<figure class="float-figure">
  <img src="photo.jpg" alt="风景">
  <figcaption>图片说明</figcaption>
</figure>
<p>这段文字会自动环绕在图片右侧。float 最核心的用途就是实现这种图文混排效果...</p>
```

---

## 清除浮动

### 为什么需要清除浮动

当容器内所有子元素都浮动时，容器会**高度塌陷**（失去高度），因为浮动元素脱离了正常文档流。

```html
<div class="container">
  <div class="float-left">左浮动</div>
  <div class="float-right">右浮动</div>
</div>
<!-- container 高度为 0！ -->
```

### 方法一：clear 属性

```css
.clear-left  { clear: left; }   /* 左侧不允许浮动 */
.clear-right { clear: right; }  /* 右侧不允许浮动 */
.clear-both  { clear: both; }   /* 两侧都不允许浮动 */
```

```html
<div class="container">
  <div class="float-left">左浮动</div>
  <div class="float-right">右浮动</div>
  <div class="clear-both"></div>  <!-- 空 div 清除浮动 -->
</div>
```

### 方法二：伪元素清除法（推荐）

```css
.clearfix::after {
  content: '';
  display: block;
  clear: both;
}
```

```html
<div class="container clearfix">
  <div class="float-left">左浮动</div>
  <div class="float-right">右浮动</div>
</div>
```

### 方法三：BFC 触发法

```css
.bfc-container {
  overflow: hidden;      /* 最常见 */
  /* 或 */
  display: flow-root;    /* 现代推荐 */
  /* 或 */
  display: inline-block;
}
```

### 方法四：display: flow-root（现代最佳）

```css
.modern-container {
  display: flow-root;  /* 创建新的 BFC，无副作用 */
}
```

| 方法 | 优点 | 缺点 |
|------|------|------|
| 空 div + clear | 简单直观 | 增加无意义 DOM |
| ::after 伪元素 | 不增加 DOM | 需额外 CSS |
| overflow: hidden | 简单 | 可能裁剪内容 |
| display: flow-root | 无副作用 | 兼容性（IE 不支持）|

---

## 浮动布局实战

### 经典两列布局

```css
.sidebar {
  float: left;
  width: 250px;
}

.main {
  margin-left: 270px;  /* 250px + 20px gap */
}
```

### 三列布局

```css
.left   { float: left;  width: 200px; }
.right  { float: right; width: 200px; }
.center { margin: 0 220px; }  /* 两侧留出空间 */
```

### 等高列（伪等高）

```css
.row {
  overflow: hidden;
}

.col {
  float: left;
  width: 33.33%;
  padding-bottom: 9999px;
  margin-bottom: -9999px;
}
```

---

## 浮动 vs 现代布局

### 何时还用 float？

| 场景 | 推荐方案 |
|------|---------|
| 文字环绕图片 | **float** |
| 多列等高布局 | Flexbox / Grid |
| 网格系统 | Grid |
| 水平导航 | Flexbox |
| 卡片列表 | Flexbox / Grid |

### 迁移指南

```css
/* 旧：float 网格 */
.grid-old .item {
  float: left;
  width: 25%;
}

/* 新：Grid */
.grid-new {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

/* 旧：float 导航 */
.nav-old li {
  float: left;
}

/* 新：Flexbox */
.nav-new {
  display: flex;
  gap: 1rem;
}
```

---

## 浏览器兼容性

| 属性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| float | 1+ | 1+ | 1+ | 12+ |
| clear | 1+ | 1+ | 1+ | 12+ |
| display: flow-root | 58+ | 13+ | 53+ | 79+ |

---

## 奇淫技巧

### 技巧一：图片不规则环绕

```css
.shape-float {
  float: left;
  shape-outside: circle(50%);  /* 配合 shape-outside */
  border-radius: 50%;
  margin: 0 1rem 1rem 0;
}
```

### 技巧二：浮动元素垂直居中

```css
.float-center {
  float: left;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}
```

### 技巧三：清除特定方向浮动

```css
/* 只清除左浮动，保留右浮动 */
.partial-clear {
  clear: left;
}
```

### 技巧四：inline-block 替代 float

```css
/* 解决 float 间隙问题 */
.inline-grid {
  font-size: 0;  /* 消除空白字符间隙 */
}

.inline-grid .item {
  display: inline-block;
  width: 25%;
  font-size: 1rem;  /* 恢复字体大小 */
  vertical-align: top;
}
```

### 技巧五：float 实现首字下沉

```css
.drop-cap::first-letter {
  float: left;
  font-size: 3rem;
  line-height: 1;
  margin-right: 0.5rem;
  margin-top: 0.25rem;
}
```

---

## 参考资料

- [MDN float](https://developer.mozilla.org/zh-CN/docs/Web/CSS/float)
- [MDN clear](https://developer.mozilla.org/zh-CN/docs/Web/CSS/clear)
- [CSS-Tricks: All About Floats](https://css-tricks.com/all-about-floats/)
