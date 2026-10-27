---
title: CSS 盒模型深入
date: 2025-04-29
tags:
  - CSS
  - 盒模型
  - 前端
categories:
  - 技术文档
  - 前端
  - CSS
  - 基础入门
---

# CSS 盒模型深入

[[toc]]

CSS 盒模型是理解网页布局的基石。每个元素都被视为一个矩形盒子，由内容、内边距、边框和外边距组成。本文深入讲解标准盒模型与替代盒模型、外边距折叠等核心概念。

---

## 盒模型组成

```
+----------------------------------------+
|              margin（外边距）            |
|   +--------------------------------+   |
|   |         border（边框）          |   |
|   |   +------------------------+   |   |
|   |   |    padding（内边距）    |   |   |
|   |   |   +----------------+   |   |   |
|   |   |   |   content      |   |   |   |
|   |   |   |  （内容区域）   |   |   |   |
|   |   |   +----------------+   |   |   |
|   |   +------------------------+   |   |
|   +--------------------------------+   |
+----------------------------------------+
```

### box-sizing

```css
/* 标准盒模型（默认值） */
.content-box {
  box-sizing: content-box;
  width: 300px;        /* 仅内容宽度 */
  padding: 20px;       /* 额外增加 */
  border: 2px solid;   /* 额外增加 */
  /* 实际占用宽度 = 300 + 40 + 4 = 344px */
}

/* 替代盒模型 */
.border-box {
  box-sizing: border-box;
  width: 300px;        /* 包含 padding 和 border */
  padding: 20px;
  border: 2px solid;
  /* 实际占用宽度 = 300px */
  /* 内容宽度 = 300 - 40 - 4 = 256px */
}

/* 全局设置 */
*, *::before, *::after {
  box-sizing: border-box;
}
```

---

## 外边距

### margin 简写

```css
/* 四边统一 */
margin: 10px;

/* 上下 | 左右 */
margin: 10px 20px;

/* 上 | 左右 | 下 */
margin: 10px 20px 15px;

/* 上 | 右 | 下 | 左 */
margin: 10px 20px 15px 25px;

/* 单边设置 */
margin-top: 10px;
margin-right: 20px;
margin-bottom: 15px;
margin-left: 25px;

/* 逻辑属性 */
margin-block: 10px;      /* 块级方向 */
margin-inline: 20px;     /* 行内方向 */
```

### 外边距折叠

```css
/* 相邻兄弟元素 */
.sibling-1 {
  margin-bottom: 20px;
}

.sibling-2 {
  margin-top: 30px;
}
/* 实际间距 = 30px（取大值） */

/* 父子元素 */
.parent {
  margin-top: 20px;
}

.child {
  margin-top: 30px;
}
/* 实际间距 = 30px（取大值，父元素无 padding/border 时） */

/* 防止折叠 */
.prevent-collapse {
  padding-top: 1px;
  /* 或 */
  border-top: 1px solid transparent;
  /* 或 */
  overflow: hidden;
}
```

### 负外边距

```css
/* 向左/向上偏移 */
.pull-left {
  margin-left: -20px;
}

/* 扩大元素 */
.expand {
  margin: -10px;
  padding: 10px;
}

/* 网格偏移 */
.offset {
  margin-left: calc(-50vw + 50%);
}
```

---

## 内边距

### padding 简写

```css
/* 与 margin 语法相同 */
padding: 10px;
padding: 10px 20px;
padding: 10px 20px 15px 25px;

/* 百分比值基于父元素宽度 */
.aspect-box {
  padding-bottom: 56.25%;  /* 16:9 比例 */
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| box-sizing | 10+ | 5.1+ | 29+ | 12+ |
| margin 逻辑属性 | 87+ | 14.1+ | 66+ | 87+ |

---

## 奇淫技巧

### 技巧一：保持宽高比

```css
.aspect-ratio {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;  /* 16:9 */
}

.aspect-ratio > * {
  position: absolute;
  inset: 0;
}

/* 现代语法 */
.modern-ratio {
  aspect-ratio: 16 / 9;
}
```

### 技巧二：居中布局

```css
/* 使用 margin auto */
.center {
  width: 300px;
  margin: 0 auto;
}

/* Flexbox 居中 */
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

### 技巧三：等宽列布局

```css
.equal-columns {
  display: flex;
  gap: 1rem;
}

.equal-columns > * {
  flex: 1;
  min-width: 0;  /* 防止内容溢出 */
}
```

### 技巧四：安全区域适配

```css
.safe-area {
  padding: env(safe-area-inset-top)
           env(safe-area-inset-right)
           env(safe-area-inset-bottom)
           env(safe-area-inset-left);
}
```

### 技巧五：流体间距

```css
.fluid-spacing {
  padding: clamp(1rem, 5vw, 3rem);
}
```

---

## 参考资料

- [MDN: CSS Box Model](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_box_model)
- [CSS-Tricks: Box Sizing](https://css-tricks.com/box-sizing/)
