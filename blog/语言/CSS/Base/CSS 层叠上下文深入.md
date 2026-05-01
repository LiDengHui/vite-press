---
title: CSS 层叠上下文深入
date: 2025-04-29
tags:
  - CSS
  - 层叠上下文
categories:
  - 技术文档
  - 前端
  - CSS
  - 布局系统
---

# CSS 层叠上下文深入

[[toc]]

层叠上下文（Stacking Context）是 CSS 中决定元素在 Z 轴上显示顺序的核心机制。理解层叠上下文对于解决 z-index 不生效、元素被遮挡等常见问题至关重要。

---

## 什么是层叠上下文

层叠上下文是 HTML 元素在三维空间中的一个概念，它决定了元素在 Z 轴上的渲染顺序。在同一个层叠上下文中，z-index 值决定了元素的层叠顺序。

### 创建层叠上下文的方法

```css
/* 1. z-index 不为 auto 的定位元素 */
.context1 {
  position: relative;
  z-index: 1;
}

/* 2. transform 不为 none */
.context2 {
  transform: translateX(0);
}

/* 3. opacity 小于 1 */
.context3 {
  opacity: 0.99;
}

/* 4. filter 不为 none */
.context4 {
  filter: blur(1px);
}

/* 5. mix-blend-mode 不为 normal */
.context5 {
  mix-blend-mode: multiply;
}

/* 6. clip-path 不为 none */
.context6 {
  clip-path: inset(0);
}

/* 7. mask 不为 none */
.context7 {
  mask: url(#mask);
}

/* 8. isolation: isolate */
.context8 {
  isolation: isolate;
}

/* 9. will-change 指定 transform 或 opacity */
.context9 {
  will-change: transform;
}

/* 10. contain: layout 或 paint */
.context10 {
  contain: layout;
}

/* 11. backdrop-filter 不为 none */
.context11 {
  backdrop-filter: blur(10px);
}

/* 12. flex/grid 子元素且 z-index 不为 auto */
.flex-item {
  z-index: 1;
}
```

---

## 层叠顺序规则

### 标准层叠顺序（从后到前）

```
1. 根元素（<html>）背景与边框
2. 负 z-index 的子层叠上下文
3. 常规流非定位元素
4. 浮动元素
5. 常规流内联元素
6. position: relative/absolute 且 z-index: auto
7. position: fixed/sticky
8. 正 z-index 的子层叠上下文
```

### 代码示例

```html
<div class="parent">
  <div class="negative">z-index: -1</div>
  <div class="static">常规流</div>
  <div class="float">浮动</div>
  <span class="inline">内联</span>
  <div class="positioned">定位</div>
  <div class="positive">z-index: 1</div>
</div>
```

```css
.parent {
  position: relative;
}

.negative {
  position: absolute;
  z-index: -1;
  background: red;
}

.positioned {
  position: absolute;
  background: blue;
}

.positive {
  position: absolute;
  z-index: 1;
  background: green;
}

.float {
  float: left;
  background: yellow;
}
```

---

## z-index 不生效的常见原因

### 原因一：没有定位

```css
/* ❌ z-index 不生效 */
.no-position {
  z-index: 9999;
}

/* ✅ 需要定位 */
.has-position {
  position: relative;
  z-index: 1;
}
```

### 原因二：父级层叠上下文限制

```css
.parent {
  position: relative;
  z-index: 1;
  background: white;
}

.child {
  position: absolute;
  z-index: 999;  /* 只能在 parent 内部比较 */
}
```

```css
/* 另一个层叠上下文 */
.another {
  position: relative;
  z-index: 2;  /* 整体在 parent 之上 */
}
```

### 原因三：opacity/transform 创建新上下文

```css
/* ❌ 意外的层叠上下文 */
.element {
  opacity: 0.99;
  z-index: 10;  /* 只在此上下文中有效 */
}

/* ✅ 显式创建 */
.element {
  position: relative;
  z-index: 10;
  opacity: 0.99;
}
```

---

## 层叠上下文嵌套

### 嵌套层级

```html
<div class="level-1">
  <div class="level-2">
    <div class="level-3"></div>
  </div>
</div>
```

```css
.level-1 {
  position: relative;
  z-index: 1;
}

.level-2 {
  position: relative;
  z-index: 2;
}

.level-3 {
  position: absolute;
  z-index: 999;  /* 只在 level-2 内部有效 */
}
```

### 跨层级比较

```css
/* 同级层叠上下文比较 */
.context-a {
  position: relative;
  z-index: 1;
}

.context-b {
  position: relative;
  z-index: 2;  /* 整体在 a 之上 */
}

.context-a .child {
  z-index: 9999;  /* 再大也无法超过 context-b */
}
```

---

## 实际应用场景

### 模态框层叠管理

```css
/* 基础层 */
.page { z-index: 0; }

/* 导航栏 */
.navbar {
  position: fixed;
  z-index: 100;
}

/* 下拉菜单 */
.dropdown {
  position: absolute;
  z-index: 200;
}

/* 遮罩层 */
.overlay {
  position: fixed;
  z-index: 1000;
}

/* 模态框 */
.modal {
  position: fixed;
  z-index: 1001;
}

/* 提示框 */
.tooltip {
  position: absolute;
  z-index: 1100;
}
```

### 隔离组件

```css
.component {
  isolation: isolate;  /* 创建新的层叠上下文 */
}

.component .modal {
  z-index: 10;  /* 不影响全局 */
}
```

---

## 调试技巧

### Chrome DevTools Layers 面板

```
1. F12 打开 DevTools
2. 切换到 "Layers" 面板
3. 查看所有层叠上下文
4. 3D 视图可视化层叠关系
```

### 层叠顺序检测

```css
/* 临时添加边框查看层级 */
* {
  outline: 1px solid rgba(255, 0, 0, 0.1);
}

/* 给不同层级不同颜色 */
.z-1 { outline: 2px solid red; }
.z-2 { outline: 2px solid blue; }
.z-3 { outline: 2px solid green; }
```

---

## 奇淫技巧

### 技巧一：全局 z-index 系统

```css
:root {
  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-fixed: 300;
  --z-backdrop: 400;
  --z-modal: 500;
  --z-tooltip: 600;
  --z-toast: 700;
}
```

### 技巧二：使用 CSS 变量管理 z-index

```css
.card {
  --card-z: 1;
  position: relative;
  z-index: var(--card-z);
}

.card:hover {
  --card-z: 10;
}

.card.active {
  --card-z: 100;
}
```

### 技巧三：isolation 解决混合模式问题

```css
/* 避免子元素影响父元素的混合模式 */
.blend-container {
  mix-blend-mode: multiply;
}

.blend-container .child {
  isolation: isolate;  /* 子元素不参与混合 */
}
```

### 技巧四：CSS Grid 层叠控制

```css
.grid-layout {
  display: grid;
  grid-template-areas: "stack";
}

.grid-layout > * {
  grid-area: stack;
}

.grid-layout .bg { z-index: 1; }
.grid-layout .content { z-index: 2; }
.grid-layout .overlay { z-index: 3; }
```

### 技巧五：负 z-index 实现背景效果

```css
.card {
  position: relative;
  background: white;
}

.card::before {
  content: '';
  position: absolute;
  inset: -10px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  z-index: -1;
  border-radius: 16px;
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| z-index | 所有版本 | 所有版本 | 所有版本 | 所有版本 |
| isolation | 41+ | 8+ | 36+ | 79+ |
| backdrop-filter | 76+ | 9+ | 103+ | 79+ |
| contain | 52+ | 15.4+ | 69+ | 79+ |

---

## 参考资料

- [MDN 层叠上下文](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_positioned_layout/Understanding_z-index/Stacking_context)
- [MDN z-index](https://developer.mozilla.org/zh-CN/docs/Web/CSS/z-index)
- [Philip Walton: What No One Told You About Z-Index](https://philipwalton.com/articles/what-no-one-told-you-about-z-index/)
