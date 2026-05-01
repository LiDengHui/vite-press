---
title: CSS 滚动驱动动画深入
date: 2025-04-29
tags:
  - CSS
  - 动画
  - 滚动
  - 现代特性
categories:
  - 技术文档
  - 前端
  - CSS
  - 现代特性
---

# CSS 滚动驱动动画深入

[[toc]]

CSS 滚动驱动动画（Scroll-driven Animations）允许将元素动画的进度与滚动容器的滚动位置绑定，无需 JavaScript 即可实现视差滚动、滚动进度指示器、文字揭示等效果。

---

## 核心概念

### 动画时间线

```css
/* 将动画绑定到滚动进度 */
.animated {
  animation: fade-in linear;
  animation-timeline: scroll();  /* 绑定到最近祖先的滚动 */
}

/* 绑定到特定容器的滚动 */
.animated {
  animation-timeline: view();
}
```

### 时间线范围

```css
/* 控制动画在滚动范围内的哪些阶段播放 */
.animated {
  animation: scale-up linear both;
  animation-timeline: view();
  animation-range: entry 0% exit 100%;  /* 从进入视口到离开视口 */
}
```

---

## 滚动时间线

### 块级滚动时间线

```css
/* 垂直滚动 */
.scroller {
  overflow-y: auto;
  height: 400px;
}

.scroller .item {
  animation: slide-in linear;
  animation-timeline: scroll(block nearest);
}

@keyframes slide-in {
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
```

### 行内滚动时间线

```css
/* 水平滚动 */
.horizontal-scroll {
  overflow-x: auto;
  display: flex;
  gap: 1rem;
}

.horizontal-scroll .card {
  animation: scale-up linear;
  animation-timeline: scroll(inline nearest);
}

@keyframes scale-up {
  from { transform: scale(0.8); }
  to { transform: scale(1); }
}
```

### 根滚动时间线

```css
/* 绑定到页面整体滚动 */
.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  animation: grow linear;
  animation-timeline: scroll(root block);
}

@keyframes grow {
  from { width: 0%; }
  to { width: 100%; }
}
```

---

## 视图时间线

### 基础视图动画

```css
.reveal {
  animation: fade-in-up linear both;
  animation-timeline: view();
  animation-range: entry 25% cover 50%;
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 视差效果

```css
.parallax-bg {
  animation: parallax linear;
  animation-timeline: view();
}

@keyframes parallax {
  from { transform: translateY(-20%); }
  to { transform: translateY(20%); }
}
```

### 图片揭示

```css
.reveal-image {
  clip-path: inset(0 100% 0 0);
  animation: reveal linear both;
  animation-timeline: view();
  animation-range: entry 20% cover 40%;
}

@keyframes reveal {
  to { clip-path: inset(0 0 0 0); }
}
```

---

## 动画范围详解

### 范围关键字

```css
/* entry - 元素进入视口 */
animation-range: entry 0% entry 100%;

/* exit - 元素离开视口 */
animation-range: exit 0% exit 100%;

/* cover - 元素完全在视口内 */
animation-range: cover 0% cover 100%;

/* contain - 元素在视口内且不溢出 */
animation-range: contain 0% contain 100%;

/* entry-crossing - 元素开始进入视口到完全进入 */
animation-range: entry-crossing 0% entry-crossing 100%;

/* exit-crossing - 元素开始离开视口到完全离开 */
animation-range: exit-crossing 0% exit-crossing 100%;
```

### 简写形式

```css
/* 覆盖整个滚动范围 */
animation-range: normal;  /* 等同于 entry 0% cover 100% */

/* 从 entry 25% 到 cover 75% */
animation-range: entry 25% cover 75%;

/* 使用 cover 关键字 */
animation-range: cover 0% cover 100%;
```

---

## 滚动吸附配合

```css
.scroll-snap-container {
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  height: 100vh;
}

.scroll-snap-container > section {
  scroll-snap-align: start;
  height: 100vh;
  
  animation: scale-in linear both;
  animation-timeline: view();
  animation-range: entry 0% contain 100%;
}

@keyframes scale-in {
  from { transform: scale(0.8); opacity: 0.5; }
  to { transform: scale(1); opacity: 1; }
}
```

---

## 复杂示例

### 滚动文字揭示

```css
.text-reveal {
  background: linear-gradient(
    90deg,
    #333 50%,
    #ddd 50%
  );
  background-size: 200% 100%;
  background-position: 100% 0;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  
  animation: text-reveal linear both;
  animation-timeline: view();
  animation-range: entry 20% contain 80%;
}

@keyframes text-reveal {
  to { background-position: 0 0; }
}
```

### 进度指示圆环

```css
.progress-ring {
  --progress: 0;
  animation: fill-ring linear;
  animation-timeline: scroll(root block);
}

.progress-ring circle {
  stroke-dasharray: 283;  /* 2 * PI * 45 */
  stroke-dashoffset: calc(283 - (283 * var(--progress) / 100));
}

@keyframes fill-ring {
  to { --progress: 100; }
}
```

### 视差层

```css
.parallax-container {
  position: relative;
  height: 200vh;
}

.parallax-layer {
  position: sticky;
  top: 0;
  height: 100vh;
}

.parallax-layer.bg {
  animation: bg-parallax linear;
  animation-timeline: scroll(root block);
}

.parallax-layer.fg {
  animation: fg-parallax linear;
  animation-timeline: scroll(root block);
}

@keyframes bg-parallax {
  from { transform: translateY(0); }
  to { transform: translateY(-100px); }
}

@keyframes fg-parallax {
  from { transform: translateY(0); }
  to { transform: translateY(50px); }
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| animation-timeline | 115+ | 不支持 | 110+ | 115+ |
| scroll() | 115+ | 不支持 | 110+ | 115+ |
| view() | 115+ | 不支持 | 110+ | 115+ |
| animation-range | 115+ | 不支持 | 110+ | 115+ |

---

## 降级方案

```css
/* 渐进增强 */
@supports (animation-timeline: scroll()) {
  .animated {
    animation: fade-in linear;
    animation-timeline: scroll();
  }
}

/* 基础样式 */
.animated {
  opacity: 1;  /* 不支持时的默认状态 */
}

/* 使用 Intersection Observer 作为 JS 降级 */
@supports not (animation-timeline: scroll()) {
  .animated {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.3s, transform 0.3s;
  }
  
  .animated.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## 奇淫技巧

### 技巧一：纯 CSS 阅读进度条

```css
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transform-origin: left;
  animation: progress linear;
  animation-timeline: scroll(root block);
}

@keyframes progress {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
```

### 技巧二：章节标题高亮

```css
.section-title {
  animation: highlight linear both;
  animation-timeline: view();
  animation-range: entry 40% cover 60%;
}

@keyframes highlight {
  0%, 100% {
    color: #999;
    transform: scale(0.95);
  }
  50% {
    color: #333;
    transform: scale(1);
  }
}
```

### 技巧三：图片画廊滚动缩放

```css
.gallery-item {
  animation: gallery-zoom linear both;
  animation-timeline: view();
  animation-range: entry 0% cover 50%;
}

@keyframes gallery-zoom {
  from {
    transform: scale(0.7);
    filter: brightness(0.5);
  }
  to {
    transform: scale(1);
    filter: brightness(1);
  }
}
```

### 技巧四：时间线滚动展示

```css
.timeline-item {
  opacity: 0;
  transform: translateX(-50px);
  animation: timeline-reveal linear both;
  animation-timeline: view();
  animation-range: entry 25% contain 50%;
}

.timeline-item:nth-child(even) {
  transform: translateX(50px);
}

@keyframes timeline-reveal {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

### 技巧五：粘性标题颜色变化

```css
.sticky-header {
  position: sticky;
  top: 0;
  background: white;
  animation: header-shrink linear both;
  animation-timeline: scroll(root block);
  animation-range: 0% 200px;
}

@keyframes header-shrink {
  from {
    padding: 2rem;
    font-size: 2rem;
  }
  to {
    padding: 1rem;
    font-size: 1.25rem;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
}
```

---

## 参考资料

- [MDN Scroll-driven Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations)
- [web.dev: Animate elements on scroll with Scroll-driven animations](https://web.dev/articles/scroll-driven-animations)
- [CSS-Tricks: Scroll-Driven Animations](https://css-tricks.com/scroll-driven-animations/)
