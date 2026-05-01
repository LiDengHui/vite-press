---
title: CSS SVG 与 CSS 联动
date: 2025-04-29
tags:
  - CSS
  - SVG
categories:
  - 技术文档
  - 前端
  - CSS
  - 视觉表现
---

# CSS SVG 与 CSS 联动

[[toc]]

SVG（Scalable Vector Graphics）作为矢量图形标准，与 CSS 的联动能够创造出丰富的交互式图形效果。本文深入探讨 SVG 与 CSS 的各种联动方式。

---

## 内联 SVG 样式

### 基础样式

```html
<svg class="icon" viewBox="0 0 24 24">
  <circle cx="12" cy="12" r="10" fill="currentColor" />
</svg>
```

```css
.icon {
  width: 24px;
  height: 24px;
  color: #3498db;  /* 会应用到 fill="currentColor" */
  transition: color 0.3s;
}

.icon:hover {
  color: #e74c3c;
}
```

### 控制 SVG 内部元素

```html
<svg class="logo" viewBox="0 0 100 100">
  <rect class="logo-bg" x="10" y="10" width="80" height="80" rx="10" />
  <text class="logo-text" x="50" y="55" text-anchor="middle">A</text>
</svg>
```

```css
.logo {
  width: 100px;
  height: 100px;
}

.logo-bg {
  fill: #3498db;
  transition: fill 0.3s;
}

.logo-text {
  fill: white;
  font-size: 40px;
  font-family: Arial, sans-serif;
}

.logo:hover .logo-bg {
  fill: #2ecc71;
}
```

---

## SVG 动画

### CSS 变换

```css
.rotating-icon {
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* SVG 内部路径动画 */
.path-animation {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: draw 2s ease forwards;
}

@keyframes draw {
  to { stroke-dashoffset: 0; }
}
```

### 路径绘制动画

```html
<svg viewBox="0 0 100 100">
  <path class="draw-path" 
        d="M10,50 Q25,25 50,50 T90,50" 
        fill="none" 
        stroke="#3498db" 
        stroke-width="3" />
</svg>
```

```css
.draw-path {
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
  animation: draw 3s ease-in-out infinite alternate;
}

@keyframes draw {
  to { stroke-dashoffset: 0; }
}
```

---

## SVG 裁剪与遮罩

### clip-path 引用 SVG

```html
<svg width="0" height="0">
  <defs>
    <clipPath id="circle-clip" clipPathUnits="objectBoundingBox">
      <circle cx="0.5" cy="0.5" r="0.5" />
    </clipPath>
  </defs>
</svg>

<img class="clipped" src="photo.jpg" alt="">
```

```css
.clipped {
  clip-path: url(#circle-clip);
  width: 300px;
  height: 300px;
  object-fit: cover;
}
```

### mask 引用 SVG

```html
<svg width="0" height="0">
  <defs>
    <mask id="gradient-mask">
      <rect x="0" y="0" width="1" height="1" fill="url(#grad)" />
      <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="white" />
        <stop offset="1" stop-color="black" />
      </linearGradient>
    </mask>
  </defs>
</svg>
```

```css
.masked {
  mask: url(#gradient-mask);
  -webkit-mask: url(#gradient-mask);
}
```

---

## SVG 滤镜

### CSS filter 与 SVG filter

```html
<svg width="0" height="0">
  <defs>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
</svg>
```

```css
.glow-text {
  filter: url(#glow);
  font-size: 48px;
  color: #3498db;
}
```

### 复杂滤镜效果

```html
<svg width="0" height="0">
  <defs>
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" />
      <feColorMatrix type="saturate" values="0" />
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.3" />
      </feComponentTransfer>
    </filter>
  </defs>
</svg>
```

```css
.noise-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  filter: url(#noise);
  pointer-events: none;
}
```

---

## SVG 渐变与模式

### 线性渐变

```html
<svg width="400" height="200">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#ff6b6b;" />
      <stop offset="100%" style="stop-color:#4ecdc4;" />
    </linearGradient>
  </defs>
  <rect width="400" height="200" fill="url(#grad1)" />
</svg>
```

### CSS 控制 SVG 渐变

```css
.gradient-stop-1 {
  stop-color: #ff6b6b;
  transition: stop-color 0.3s;
}

.gradient-stop-2 {
  stop-color: #4ecdc4;
  transition: stop-color 0.3s;
}

svg:hover .gradient-stop-1 {
  stop-color: #667eea;
}

svg:hover .gradient-stop-2 {
  stop-color: #764ba2;
}
```

---

## SVG 图标系统

### Sprite 图标

```html
<svg style="display: none;">
  <defs>
    <symbol id="icon-home" viewBox="0 0 24 24">
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3"/>
    </symbol>
    <symbol id="icon-user" viewBox="0 0 24 24">
      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
    </symbol>
  </defs>
</svg>

<!-- 使用 -->
<svg class="icon"><use href="#icon-home"></use></svg>
<svg class="icon"><use href="#icon-user"></use></svg>
```

```css
.icon {
  width: 24px;
  height: 24px;
  fill: currentColor;
}

.icon:hover {
  color: #3498db;
}
```

---

## SVG 交互

### 悬停效果

```css
.interactive-svg {
  cursor: pointer;
}

.interactive-svg .shape {
  fill: #3498db;
  transition: fill 0.3s, transform 0.3s;
  transform-origin: center;
}

.interactive-svg:hover .shape {
  fill: #e74c3c;
  transform: scale(1.1);
}

.interactive-svg .label {
  opacity: 0;
  transition: opacity 0.3s;
}

.interactive-svg:hover .label {
  opacity: 1;
}
```

### 点击动画

```css
.clickable-shape {
  cursor: pointer;
  transform-origin: center;
}

.clickable-shape:active {
  animation: click-bounce 0.3s ease;
}

@keyframes click-bounce {
  0% { transform: scale(1); }
  50% { transform: scale(0.9); }
  100% { transform: scale(1); }
}
```

---

## 响应式 SVG

### 容器查询

```css
.chart {
  container-type: inline-size;
}

.chart svg {
  width: 100%;
  height: auto;
}

@container (min-width: 600px) {
  .chart .bar-label {
    font-size: 14px;
  }
}

@container (max-width: 599px) {
  .chart .bar-label {
    font-size: 10px;
  }
}
```

---

## 奇淫技巧

### 技巧一：纯 CSS SVG 加载动画

```css
.loading-spinner {
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

.loading-spinner circle {
  stroke: #3498db;
  stroke-linecap: round;
  stroke-dasharray: 80;
  stroke-dashoffset: 60;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes spin {
  100% { transform: rotate(360deg); }
}

@keyframes dash {
  0% { stroke-dashoffset: 80; }
  50% { stroke-dashoffset: 20; }
  100% { stroke-dashoffset: 80; }
}
```

### 技巧二：动态进度条

```html
<svg class="progress-ring" width="120" height="120">
  <circle class="progress-ring-bg" cx="60" cy="60" r="54" />
  <circle class="progress-ring-fill" cx="60" cy="60" r="54" />
</svg>
```

```css
.progress-ring {
  transform: rotate(-90deg);
}

.progress-ring-bg {
  fill: none;
  stroke: #e0e0e0;
  stroke-width: 8;
}

.progress-ring-fill {
  fill: none;
  stroke: #3498db;
  stroke-width: 8;
  stroke-linecap: round;
  stroke-dasharray: 339.292;  /* 2 * PI * 54 */
  stroke-dashoffset: calc(339.292 * (1 - var(--progress, 0) / 100));
  transition: stroke-dashoffset 0.5s ease;
}
```

### 技巧三：SVG 文字路径

```html
<svg viewBox="0 0 500 200">
  <path id="curve" d="M10,100 Q250,10 490,100" fill="transparent" />
  <text>
    <textPath href="#curve" startOffset="50%" text-anchor="middle">
      沿曲线排列的文字
    </textPath>
  </text>
</svg>
```

```css
textPath {
  fill: #3498db;
  font-size: 24px;
  animation: slide-text 10s linear infinite;
}

@keyframes slide-text {
  from { startOffset: 0%; }
  to { startOffset: 100%; }
}
```

### 技巧四：漩染模式

```css
.svg-blend {
  mix-blend-mode: multiply;
}

.svg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
```

### 技巧五：SVG 样式继承

```css
/* 使用 CSS 变量控制 SVG */
:root {
  --brand-color: #3498db;
}

.brand-icon {
  fill: var(--brand-color);
  transition: fill 0.3s;
}

.brand-icon:hover {
  --brand-color: #e74c3c;
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| SVG CSS 样式 | 所有版本 | 所有版本 | 所有版本 | 所有版本 |
| CSS filter | 18+ | 6+ | 35+ | 12+ |
| clip-path | 55+ | 9.1+ | 3.5+ | 79+ |
| mask | 1+ (前缀) | 4+ (前缀) | 53+ | 79+ |

---

## 参考资料

- [MDN SVG](https://developer.mozilla.org/zh-CN/docs/Web/SVG)
- [CSS-Tricks: Using SVG](https://css-tricks.com/using-svg/)
- [SVG 规范](https://www.w3.org/TR/SVG11/)
