---
title: CSS 定位深入
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

# CSS 定位深入

[[toc]]

CSS 定位（Positioning）允许元素脱离正常文档流，精确控制其在页面中的位置。本文深入讲解所有定位模式、层叠上下文和实际应用场景。

---

## 基础定位模式

### static（默认）

```css
.static {
  position: static;  /* 默认值，正常文档流 */
}
```

### relative

```css
.relative {
  position: relative;
  top: 10px;     /* 相对于原位置向下偏移 */
  left: 20px;    /* 相对于原位置向右偏移 */
}
```

**特点：**
- 保留原位置空间
- 偏移不影响其他元素
- 作为绝对定位子元素的参考点

### absolute

```css
.absolute {
  position: absolute;
  top: 0;
  left: 0;
}

/* 相对父容器定位 */
.parent {
  position: relative;
}

.parent .child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

**特点：**
- 脱离文档流
- 相对于最近的定位祖先
- 不保留原位置空间

### fixed

```css
.fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}
```

**特点：**
- 相对于视口定位
- 滚动时保持固定
- 脱离文档流

### sticky

```css
.sticky {
  position: sticky;
  top: 0;  /* 滚动到顶部时固定 */
}
```

**特点：**
- 相对定位 + 固定定位的混合
- 在阈值内表现为 relative
- 超出阈值后表现为 fixed

---

## z-index 与层叠上下文

### z-index 基础

```css
.layer-1 { z-index: 1; }
.layer-2 { z-index: 2; }
.layer-3 { z-index: 3; }
```

### 创建层叠上下文

```css
/* 以下属性会创建新的层叠上下文 */
.new-context {
  position: relative;
  z-index: 0;
}

.new-context-2 {
  opacity: 0.99;
}

.new-context-3 {
  transform: translateZ(0);
}

.new-context-4 {
  filter: blur(1px);
}

.new-context-5 {
  isolation: isolate;
}
```

### 层叠顺序

1. `z-index` 为负的定位元素
2. 普通流中的块级元素
3. 浮动元素
4. 普通流中的行内元素
5. `z-index: auto` 的定位元素
6. `z-index >= 0` 的定位元素

---

## 定位技巧

### 垂直水平居中

```css
/* 方法 1: transform */
.center-1 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 方法 2: margin auto */
.center-2 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}

/* 方法 3: inset (现代语法) */
.center-3 {
  position: absolute;
  inset: 0;
  margin: auto;
}
```

### 固定定位适配

```css
.fixed-safe {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding-bottom: env(safe-area-inset-bottom);
}
```

### Sticky 表头

```css
.sticky-table {
  overflow: auto;
  max-height: 400px;
}

.sticky-table thead th {
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| position | 1+ | 1+ | 1+ | 12+ |
| sticky | 56+ | 13+ | 32+ | 16+ |
| inset | 87+ | 14.1+ | 66+ | 87+ |

---

## 奇淫技巧

### 技巧一：纯 CSS 模态框

```css
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  position: relative;
  background: white;
  padding: 2rem;
  border-radius: 12px;
}
```

### 技巧二：粘性侧边栏

```css
.layout {
  display: flex;
}

.sidebar {
  position: sticky;
  top: 20px;
  align-self: flex-start;
  width: 250px;
}
```

### 技巧三：定位工具提示

```css
.tooltip {
  position: relative;
}

.tooltip::after {
  content: attr(data-tip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.5rem;
  background: #333;
  color: white;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
}

.tooltip:hover::after {
  opacity: 1;
}
```

### 技巧四：全屏覆盖层

```css
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  z-index: 9999;
}
```

### 技巧五：定位配合 clip-path

```css
.corner-ribbon {
  position: absolute;
  top: 0;
  right: 0;
  width: 150px;
  height: 150px;
  overflow: hidden;
}

.corner-ribbon span {
  position: absolute;
  top: 30px;
  right: -30px;
  width: 200px;
  background: #e74c3c;
  color: white;
  text-align: center;
  transform: rotate(45deg);
}
```

---

## 参考资料

- [MDN: position](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position)
- [MDN: z-index](https://developer.mozilla.org/zh-CN/docs/Web/CSS/z-index)
- [CSS-Tricks: position](https://css-tricks.com/almanac/properties/p/position/)
