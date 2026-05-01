---
title: CSS 函数详解
date: 2025-04-29
tags:
  - CSS
  - 函数
categories:
  - 技术文档
  - 前端
  - CSS
  - 视觉表现
---

# CSS 函数详解

[[toc]]

CSS 函数是构建动态、响应式和交互式样式的核心工具。本文全面梳理 CSS 中所有重要函数的用法、语法和实战场景。

---

## 数学函数

### calc()

```css
/* 混合单位计算 */
.container {
  width: calc(100% - 2rem);
  height: calc(100vh - 60px);
}

/* 嵌套 calc */
.nested {
  width: calc(calc(100% / 3) - 1rem);
}

/* 使用 CSS 变量 */
.dynamic {
  width: calc(100% - var(--sidebar-width));
}
```

### min() / max()

```css
/* 取最小值 */
.responsive {
  width: min(100%, 800px);  /* 不超过 800px */
}

/* 取最大值 */
.min-size {
  width: max(50%, 300px);  /* 至少 300px */
}

/* 组合使用 */
.clamp-like {
  width: max(300px, min(50%, 800px));
}
```

### clamp()

```css
/* 最小值、首选值、最大值 */
.fluid-text {
  font-size: clamp(1rem, 2.5vw, 2rem);
}

/* 响应式间距 */
.spacing {
  padding: clamp(1rem, 3vw, 3rem);
}
```

### abs() / sign()

```css
/* 绝对值（Firefox 支持） */
.distance {
  margin-left: abs(var(--offset));
}

/* 符号函数 */
.direction {
  transform: translateX(calc(sign(var(--direction)) * 10px));
}
```

### mod() / rem() / round()

```css
/* 取模 */
.grid-item {
  width: calc(100% / mod(var(--items), 3));
}

/* 四舍五入 */
.rounded {
  width: round(up, 33.333%, 1px);
}
```

---

## 颜色函数

### rgb() / rgba()

```css
/* 现代语法（CSS Color Module Level 4） */
.modern-rgb {
  color: rgb(255 128 0);
  color: rgb(255 128 0 / 0.5);
}

/* 传统语法 */
.legacy-rgb {
  color: rgb(255, 128, 0);
  color: rgba(255, 128, 0, 0.5);
}
```

### hsl() / hsla()

```css
.modern-hsl {
  color: hsl(200 100% 50%);
  color: hsl(200 100% 50% / 0.8);
}
```

### oklch() / oklab()

```css
.oklch-color {
  color: oklch(60% 0.2 250);
  color: oklch(60% 0.2 250 / 0.5);
}

.oklab-color {
  color: oklab(60% 0.1 -0.2);
}
```

### color()

```css
.wide-gamut {
  color: color(display-p3 1 0.5 0);
  color: color(rec2020 1 0 0);
  color: color(srgb 0.5 0.5 1);
}
```

### color-mix()

```css
.mixed {
  color: color-mix(in oklch, red, blue 50%);
  background: color-mix(in srgb, #3498db 70%, white);
}
```

### light-dark()

```css
/* 根据系统主题自动切换 */
.themed {
  color: light-dark(#333, #f5f5f5);
  background: light-dark(#fff, #1a1a1a);
}
```

---

## 字符串与属性函数

### attr()

```css
/* 读取 HTML 属性值 */
.tooltip::after {
  content: attr(data-tooltip);
}

/* 指定回退值 */
.tooltip::after {
  content: attr(data-tooltip, "默认提示");
}

/* 指定类型（实验性） */
.counter::after {
  content: attr(data-count type(<number>), 0);
}
```

### url()

```css
/* 图片 */
.bg-image {
  background-image: url("image.png");
}

/* CSS 变量中的 URL */
:root {
  --bg-url: url("image.png");
}

/* 滤镜引用 SVG */
.filtered {
  filter: url("#blur-filter");
}

/* @font-face */
@font-face {
  src: url("font.woff2");
}
```

---

## 变换函数

### 2D 变换

```css
.translate {
  transform: translate(50px, 100px);
  transform: translateX(50px);
  transform: translateY(100px);
}

.scale {
  transform: scale(1.5);
  transform: scaleX(1.2);
  transform: scaleY(0.8);
}

.rotate {
  transform: rotate(45deg);
  transform: rotate(0.25turn);
}

.skew {
  transform: skew(10deg, 5deg);
}

.matrix {
  transform: matrix(1, 0, 0, 1, 50, 100);
}
```

### 3D 变换

```css
.translate3d {
  transform: translate3d(50px, 100px, 200px);
}

.scale3d {
  transform: scale3d(1.5, 1.5, 1);
}

.rotate3d {
  transform: rotate3d(1, 1, 1, 45deg);
  transform: rotateX(45deg);
  transform: rotateY(45deg);
  transform: rotateZ(45deg);
}

.perspective {
  perspective: 1000px;
  transform: perspective(1000px) rotateY(45deg);
}
```

---

## 渐变函数

### linear-gradient()

```css
.simple {
  background: linear-gradient(red, blue);
}

.with-angle {
  background: linear-gradient(135deg, red, blue);
}

.with-stops {
  background: linear-gradient(
    to right,
    red 0%,
    orange 25%,
    yellow 50%,
    green 75%,
    blue 100%
  );
}

.in-oklab {
  background: linear-gradient(in oklab, red, blue);
}
```

### radial-gradient()

```css
.circle {
  background: radial-gradient(circle, red, blue);
}

.ellipse {
  background: radial-gradient(ellipse at top, red, blue);
}

.sized {
  background: radial-gradient(
    circle closest-side at 30% 40%,
    red,
    blue
  );
}
```

### conic-gradient()

```css
.pie-chart {
  background: conic-gradient(
    red 0deg 90deg,
    blue 90deg 180deg,
    green 180deg 270deg,
    yellow 270deg 360deg
  );
}

.rainbow {
  background: conic-gradient(
    from 0deg at 50% 50%,
    red, yellow, green, blue, red
  );
}
```

### repeating-gradient

```css
.stripes {
  background: repeating-linear-gradient(
    45deg,
    #333 0px,
    #333 10px,
    #666 10px,
    #666 20px
  );
}
```

---

## 形状函数

### circle()

```css
.clipped-circle {
  clip-path: circle(50% at 50% 50%);
  clip-path: circle(100px at center);
}
```

### ellipse()

```css
.clipped-ellipse {
  clip-path: ellipse(50% 25% at 50% 50%);
}
```

### polygon()

```css
.clipped-polygon {
  clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
}

.star {
  clip-path: polygon(
    50% 0%, 61% 35%, 98% 35%,
    68% 57%, 79% 91%, 50% 70%,
    21% 91%, 32% 57%, 2% 35%,
    39% 35%
  );
}
```

### inset()

```css
.clipped-inset {
  clip-path: inset(10px 20px 30px 40px round 10px);
}
```

### path()

```css
.custom-shape {
  clip-path: path('M10,10 L90,10 L90,90 L10,90 Z');
}
```

---

## 滤镜函数

```css
.filter-effects {
  filter: blur(5px);
  filter: brightness(1.5);
  filter: contrast(2);
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
  filter: grayscale(1);
  filter: hue-rotate(90deg);
  filter: invert(1);
  filter: opacity(0.5);
  filter: saturate(2);
  filter: sepia(1);
}

/* 组合滤镜 */
.combined {
  filter: brightness(1.2) contrast(1.1) saturate(1.3);
}
```

---

## 计数器函数

```css
/* counter() */
.item::before {
  content: counter(section) ". ";
}

/* counters() - 嵌套路径 */
.nested::before {
  content: counters(section, ".") " ";
}

/* counter-style */
@counter-style thumbs {
  system: cyclic;
  symbols: "\1F44D";
  suffix: " ";
}

.custom-list {
  list-style: thumbs;
}
```

---

## 其他实用函数

### env()

```css
/* 安全区域 */
.safe-area {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}
```

### var()

```css
:root {
  --primary: #3498db;
}

.element {
  color: var(--primary);
  color: var(--undefined, #333);  /* 回退值 */
}
```

### element()

```css
/* 使用其他元素作为背景（Firefox 支持） */
.reflected {
  background: -moz-element(#source) no-repeat;
}
```

---

## 浏览器兼容性

| 函数 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| calc() | 26+ | 7+ | 16+ | 12+ |
| min/max/clamp | 79+ | 13.1+ | 75+ | 79+ |
| oklch() | 111+ | 15+ | 113+ | 111+ |
| color-mix() | 111+ | 16.2+ | 113+ | 111+ |
| light-dark() | 123+ | 17.5+ | 120+ | 123+ |
| conic-gradient() | 69+ | 12.1+ | 83+ | 79+ |
| clip-path | 55+ | 9.1+ | 3.5+ | 79+ |

---

## 奇淫技巧

### 技巧一：纯 CSS 进度条

```css
.progress-bar {
  --progress: 75;
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
}

.progress-bar::after {
  content: '';
  display: block;
  width: calc(var(--progress) * 1%);
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 4px;
  transition: width 0.3s;
}
```

### 技巧二：动态边框半径

```css
.blob {
  border-radius: 
    calc(50% + var(--x, 0) * 1px)
    calc(50% - var(--x, 0) * 1px)
    calc(50% + var(--x, 0) * 1px)
    calc(50% - var(--x, 0) * 1px) /
    calc(50% + var(--y, 0) * 1px)
    calc(50% + var(--y, 0) * 1px)
    calc(50% - var(--y, 0) * 1px)
    calc(50% - var(--y, 0) * 1px);
  animation: morph 8s ease-in-out infinite;
}

@keyframes morph {
  0%, 100% { --x: 0; --y: 0; }
  25% { --x: 20; --y: 10; }
  50% { --x: -10; --y: 20; }
  75% { --x: 15; --y: -15; }
}
```

### 技巧三：CSS 三角函数（Chrome 111+）

```css
.cosine-wave {
  --angle: 0;
  transform: translateY(calc(sin(var(--angle)) * 50px));
  animation: wave 2s linear infinite;
}

@keyframes wave {
  from { --angle: 0deg; }
  to { --angle: 360deg; }
}
```

### 技巧四：条件宽度

```css
/* 基于内容长度自适应 */
.tag {
  width: fit-content;
  max-width: min(100%, 200px);
}
```

### 技巧五：动态阴影

```css
.dynamic-shadow {
  box-shadow: 
    calc(clamp(-10px, var(--x), 10px))
    calc(clamp(-10px, var(--y), 10px))
    20px
    rgba(0,0,0,0.3);
}
```

---

## 参考资料

- [MDN: CSS 函数](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Functions)
- [CSS-Tricks: A Complete Guide to calc()](https://css-tricks.com/a-complete-guide-to-calc-in-css/)
- [web.dev: CSS Functions](https://web.dev/learn/css/functions)
