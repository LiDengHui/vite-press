---
title: CSS 定位详解
date: 2025-04-29
tags:
  - CSS
  - 定位
  - 前端
categories:
  - 技术文档
  - 前端
  - CSS
  - 布局系统
---

# CSS 定位详解

[[toc]]

CSS `position` 属性控制元素在文档流中的位置。理解各种定位模式及其层叠关系，是构建复杂布局的基础。

---

## 基础定位模式

### static（默认）

```css
.box {
  position: static;  /* 默认值，正常文档流 */
}
```

### relative 相对定位

```css
.relative-box {
  position: relative;
  top: 20px;     /* 向下偏移20px */
  left: 30px;    /* 向右偏移30px */
}
```

> 元素仍占据文档流中的空间，偏移不影响其他元素位置。

### absolute 绝对定位

```css
.parent {
  position: relative;  /* 创建定位上下文 */
}

.child {
  position: absolute;
  top: 0;
  right: 0;      /* 定位到父元素右上角 */
}
```

> 脱离文档流，相对于最近的定位祖先元素定位。

### fixed 固定定位

```css
.fixed-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}
```

> 相对于视口定位，滚动时保持不动。

### sticky 粘性定位

```css
.sticky-header {
  position: sticky;
  top: 0;        /* 滚动到顶部时粘住 */
}
```

> 滚动到阈值前表现为 relative，达到阈值后表现为 fixed。

---

## 定位偏移属性

```css
.positioned {
  top: 10px;      /* 距离顶部 */
  right: 20px;    /* 距离右侧 */
  bottom: 30px;   /* 距离底部 */
  left: 40px;     /* 距离左侧 */
  
  /* 简写：inset */
  inset: 10px 20px 30px 40px;  /* 同 margin 简写 */
}
```

---

## 层叠上下文

### z-index

```css
.layer {
  position: relative;
  z-index: 10;
}

.layer-above {
  position: relative;
  z-index: 20;  /* 层叠在 layer 之上 */
}
```

### 创建层叠上下文的方式

```css
/* 以下方式都会创建新的层叠上下文 */
.create-context {
  position: relative;
  z-index: 0;
  /* 或 */
  opacity: 0.99;
  /* 或 */
  transform: translateZ(0);
  /* 或 */
  filter: blur(1px);
  /* 或 */
  perspective: 1000px;
  /* 或 */
  mix-blend-mode: multiply;
  /* 或 */
  isolation: isolate;
}
```

---

## 实际应用场景

### 模态框遮罩

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
}

.modal-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

### 图片角标

```css
.product-card {
  position: relative;
}

.badge {
  position: absolute;
  top: -10px;
  right: -10px;
  background: red;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 50%;
}
```

### 吸顶导航

```css
.sticky-nav {
  position: sticky;
  top: 0;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 100;
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| position | 1+ | 1+ | 1+ | 12+ |
| sticky | 56+ | 13+ | 52+ | 16+ |
| inset | 87+ | 14.1+ | 66+ | 87+ |

---

## 奇淫技巧

### 技巧一：全屏覆盖

```css
.fullscreen {
  position: fixed;
  inset: 0;
}
```

### 技巧二：粘性页脚

```css
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.footer {
  position: sticky;
  top: 100vh;  /* 滚动到底部时显现 */
}
```

### 技巧三：悬浮按钮

```css
.fab {
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #007bff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}
```

---

## 参考资料

- [MDN position](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position)
- [MDN z-index](https://developer.mozilla.org/zh-CN/docs/Web/CSS/z-index)
