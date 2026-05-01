---
title: CSS 现代特性速查
date: 2025-04-29
tags:
  - CSS
categories:
  - 技术文档
  - 前端
  - CSS
  - 基础入门
---

# CSS 现代特性速查

[[toc]]

本文汇总 CSS 现代开发中最重要的新特性，按类别组织，方便快速查阅。

## 布局

### Grid 布局

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 1fr auto;
  gap: 1rem;
  
  /* 高级特性 */
  grid-template-areas: 
    "header header header"
    "sidebar main main"
    "footer footer footer";
  place-items: center;
  place-content: center;
}

.item {
  grid-column: span 2;
  grid-row: 1 / -1;
}
```

### Subgrid

```css
.child {
  display: grid;
  grid-template-columns: subgrid;
  grid-template-rows: subgrid;
  grid-column: span 3;
}
```

### Flexbox 增强

```css
.container {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  
  /* 新属性 */
  justify-content: safe center;  /* 安全对齐 */
  row-gap: 1rem;
  column-gap: 2rem;
}
```

### 容器查询

```css
.container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card { flex-direction: row; }
}
```

## 选择器

### 现代伪类

```css
/* 结构性 */
:where(.a, .b) { }        /* 零特异性 */
:is(.a, .b) { }           /* 计算特异性 */
:has(> .child) { }        /* 父选择器 */
:not(.a, .b) { }          /* 多个排除 */

/* 表单 */
:input-placeholder-shown { }
:user-invalid { }
:indeterminate { }

/* 范围 */
:in-range { }
:out-of-range { }

/* 语言 */
:lang(zh) { }
:dir(rtl) { }
```

### 现代伪元素

```css
::marker { }              /* 列表标记 */
::placeholder { }         /* 占位符 */
::selection { }           /* 选中文本 */
::backdrop { }            /* 对话框遮罩 */
::file-selector-button { } /* 文件按钮 */
::target-text { }         /* 滚动目标文本 */
::spelling-error { }      /* 拼写错误 */
::grammar-error { }       /* 语法错误 */
```

## 颜色

### 现代颜色函数

```css
/* OKLCH - 感知均匀 */
.oklch {
  color: oklch(70% 0.2 250);
}

/* OKLab */
.oklab {
  color: oklab(70% -0.1 0.2);
}

/* 相对颜色 */
.relative {
  color: hsl(from var(--primary) h s calc(l + 10%));
}

/* 颜色混合 */
.mixed {
  color: color-mix(in oklch, red 50%, blue);
}

/* 对比色 */
.contrast {
  color: color-contrast(var(--bg) vs white, black);
}
```

### 颜色空间

```css
/* Display P3 */
.p3 {
  color: color(display-p3 1 0.5 0);
}

/* Rec2020 */
.rec2020 {
  color: color(rec2020 1 0.5 0);
}

/* 带色域回退 */
.fallback {
  color: rgb(255, 128, 0);
  color: color(display-p3 1 0.5 0);
}
```

## 尺寸与数学

### 数学函数

```css
.element {
  width: clamp(300px, 50%, 800px);
  height: min(50vh, 400px);
  margin: max(1rem, 2vw);
  font-size: clamp(1rem, 2.5vw, 2rem);
  
  /* 新函数 */
  aspect-ratio: 16 / 9;
  width: round(up, 50%, 100px);  /* 向上取整 */
  width: mod(500px, 100px);      /* 取模 */
  width: rem(500px, 100px);      /* 取余 */
}
```

### 容器查询单位

```css
.element {
  width: 50cqw;    /* 容器查询宽度 */
  height: 50cqh;   /* 容器查询高度 */
  font-size: 5cqmin; /* 容器较小边 */
}
```

## 逻辑属性

```css
.element {
  /* 替代物理属性 */
  inline-size: 300px;        /* width */
  block-size: 200px;         /* height */
  margin-inline: 1rem;       /* margin-left/right */
  margin-block: 0.5rem;      /* margin-top/bottom */
  padding-inline-start: 1rem; /* padding-left */
  border-inline-end: 1px solid; /* border-right */
  
  inset-inline: 0;           /* left/right */
  inset-block: 0;            /* top/bottom */
}
```

## 自定义属性

```css
/* 基础用法 */
:root {
  --primary: #3498db;
  --space: 1rem;
}

.element {
  color: var(--primary);
  padding: var(--space);
}

/* @property 类型化 */
@property --progress {
  syntax: '<number>';
  inherits: false;
  initial-value: 0;
}

/* 作用域 */
.component {
  --local: red;
}
```

## 嵌套

```css
.card {
  padding: 1rem;
  
  /* 嵌套选择器 */
  &:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
  
  /* 嵌套媒体查询 */
  @media (min-width: 768px) {
    padding: 2rem;
  }
  
  /* 嵌套容器查询 */
  @container (min-width: 400px) {
    flex-direction: row;
  }
  
  .title {
    font-size: 1.25rem;
  }
}
```

## 作用域

```css
@scope (.card) {
  :scope { padding: 1rem; }
  .title { font-size: 1.25rem; }
  
  /* 限定在 card 内部 */
  img { border-radius: 8px; }
}

@scope (.card) to (.content) {
  /* 作用到 .content 之前 */
  .title { margin-bottom: 0.5rem; }
}
```

## 级联层

```css
@layer reset, base, components, utilities;

@layer reset {
  * { margin: 0; padding: 0; }
}

@layer base {
  body { font-family: system-ui; }
}

@layer components {
  .btn { padding: 0.5rem 1rem; }
}

@layer utilities {
  .hidden { display: none; }
}
```

## 视图过渡

```js
// 触发视图过渡
document.startViewTransition(() => {
  updateDOM();
});
```

```css
/* 过渡样式 */
::view-transition-old(root) {
  animation: fade-out 0.3s;
}

::view-transition-new(root) {
  animation: fade-in 0.3s;
}
```

## 弹出框与对话框

```html
<!-- 对话框 -->
<dialog id="modal">
  <p>内容</p>
  <button onclick="modal.close()">关闭</button>
</dialog>

<!-- 弹出框 -->
<button popovertarget="tooltip">悬停</button>
<div popover id="tooltip">提示内容</div>
```

```css
dialog::backdrop {
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
}

[popover]:popover-open {
  animation: popover-in 0.2s;
}
```

## 锚点定位

```css
.trigger {
  anchor-name: --trigger;
}

.popup {
  position: absolute;
  position-anchor: --trigger;
  inset-area: bottom;
  
  position-try-fallbacks: --top, --left;
}

@position-try --top {
  inset-area: top;
}
```

## 滚动驱动动画

```css
.element {
  animation: scroll-anim linear;
  animation-timeline: scroll();
  animation-range: 0% 100%;
}

@keyframes scroll-anim {
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 视口进入 */
.element {
  animation: appear linear;
  animation-timeline: view();
  animation-range: entry 25% cover 50%;
}
```

## Scroll Snap

```css
.carousel {
  scroll-snap-type: x mandatory;
  overflow-x: auto;
  display: flex;
}

.carousel-item {
  scroll-snap-align: start;
  flex-shrink: 0;
  width: 100%;
}
```

## 隔离

```css
.blend-container {
  isolation: isolate;  /* 创建新层叠上下文 */
}
```

## 混合模式

```css
.blend {
  mix-blend-mode: multiply;  /* 正片叠底 */
  mix-blend-mode: screen;    /* 滤色 */
  mix-blend-mode: overlay;   /* 叠加 */
}

.blend-bg {
  background-blend-mode: multiply;
}
```

## 裁剪与遮罩

```css
/* 裁剪路径 */
.clipped {
  clip-path: circle(50%);
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  clip-path: inset(10% 20% 30% 40% round 10px);
}

/* 遮罩 */
.masked {
  mask: url(mask.svg);
  mask-size: cover;
  -webkit-mask: url(mask.svg);
  -webkit-mask-size: cover;
}
```

## 滤镜

```css
.filtered {
  filter: blur(5px);
  filter: brightness(1.2);
  filter: contrast(1.5);
  filter: grayscale(1);
  filter: sepia(0.5);
  filter: hue-rotate(90deg);
  filter: saturate(2);
  filter: invert(1);
  filter: opacity(0.5);
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
  
  /* 组合 */
  filter: brightness(1.2) contrast(1.1) saturate(1.2);
}
```

## 变换

```css
.transformed {
  transform: translate(50%, 50%);
  transform: rotate(45deg);
  transform: scale(1.5);
  transform: skew(10deg, 5deg);
  
  /* 3D */
  transform: perspective(1000px) rotateY(45deg);
  transform: translate3d(0, 0, 100px);
  transform-style: preserve-3d;
  backface-visibility: hidden;
}
```

## 动画

```css
.animated {
  animation: slide-in 0.5s ease-out forwards;
  animation-delay: 0.2s;
  animation-fill-mode: both;
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 离散过渡 */
.element {
  display: none;
  opacity: 0;
  transition: opacity 0.3s, display 0.3s allow-discrete;
}

.element.show {
  display: block;
  opacity: 1;
}

@starting-style {
  .element.show {
    opacity: 0;
  }
}
```

## Houdini

```css
/* 自定义属性 */
@property --angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

/* Paint API */
.paint-worklet {
  background: paint(circle-pattern);
}

/* Layout API */
.custom-layout {
  display: layout(masonry);
}
```

## 环境变量

```css
/* 安全区域 */
.safe-area {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

## 字体

```css
@font-face {
  font-family: 'CustomFont';
  src: url('font.woff2') format('woff2');
  font-display: swap;
  font-weight: 100 900;
  font-style: normal italic;
}

/* 可变字体 */
.variable-font {
  font-variation-settings: 'wght' 700, 'wdth' 100;
}
```

## 文本

```css
.text {
  text-wrap: balance;        /* 均衡换行 */
  text-wrap: pretty;         /* 美观换行 */
  
  hyphens: auto;             /* 自动断字 */
  hyphenate-limit-chars: 6 3 2;
  
  line-clamp: 3;             /* 行数限制 */
  -webkit-line-clamp: 3;
  
  text-overflow: ellipsis;   /* 省略号 */
  overflow: hidden;
  white-space: nowrap;
}
```

## 背景

```css
.bg {
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  background: radial-gradient(circle at 30% 30%, #fff, #000);
  background: conic-gradient(from 45deg, red, yellow, green, blue);
  
  /* 多背景 */
  background: 
    linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
    url('bg.jpg');
    
  /* 背景合成 */
  background-blend-mode: multiply;
}
```

## 边框

```css
.border {
  border: 1px solid #ddd;
  border-radius: 8px;
  
  /* 逻辑圆角 */
  border-start-start-radius: 8px;
  border-end-end-radius: 8px;
  
  /* 渐变边框 */
  border-image: linear-gradient(45deg, #ff6b6b, #4ecdc4) 1;
}
```

## 阴影

```css
.shadow {
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5);  /* 焦点环 */
  
  /* 多层阴影 */
  box-shadow: 
    0 1px 2px rgba(0,0,0,0.05),
    0 4px 8px rgba(0,0,0,0.1);
    
  /* 内阴影 */
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
  
  /* 文字阴影 */
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
```

## 打印

```css
@media print {
  .no-print { display: none; }
  
  a::after {
    content: " (" attr(href) ")";
  }
  
  @page {
    margin: 2cm;
    size: A4;
  }
  
  @page :first {
    margin-top: 3cm;
  }
}
```

## 奇淫技巧

### 技巧一：纯 CSS 计数器

```css
ol {
  counter-reset: item;
}

li::before {
  counter-increment: item;
  content: counter(item, decimal-leading-zero) ". ";
}
```

### 技巧二：CSS 绘制三角形

```css
.triangle {
  width: 0;
  height: 0;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  border-bottom: 100px solid #3498db;
}
```

### 技巧三：自适应正方形

```css
.square {
  aspect-ratio: 1;
  width: 100%;
}
```

### 技巧四：文字渐变

```css
.gradient-text {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
```

### 技巧五：硬件加速

```css
.gpu {
  transform: translateZ(0);
  will-change: transform;
}
```

## 总结

本文速查涵盖了 CSS 现代开发的核心特性：

1. **布局**：Grid、Flexbox、容器查询
2. **选择器**：:has()、:where()、:is()
3. **颜色**：OKLCH、颜色混合、相对颜色
4. **尺寸**：clamp()、数学函数、容器单位
5. **逻辑属性**：替代物理方向
6. **自定义属性**：变量系统、@property
7. **嵌套与作用域**：代码组织
8. **级联层**：优先级管理
9. **交互**：视图过渡、弹出框、锚点定位
10. **动画**：滚动驱动、离散过渡

## 参考资源

- [MDN CSS Reference](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference)
- [Can I Use](https://caniuse.com/)
- [CSS-Tricks Almanac](https://css-tricks.com/almanac/)
