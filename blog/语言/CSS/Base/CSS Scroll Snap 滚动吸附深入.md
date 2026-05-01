---
title: CSS Scroll Snap 滚动吸附深入
date: 2025-04-29
tags:
  - CSS
  - 滚动
  - Scroll Snap
categories:
  - 技术文档
  - 前端
  - CSS
  - 交互与动画
---

# CSS Scroll Snap 滚动吸附深入

[[toc]]

CSS Scroll Snap 允许在滚动容器中创建吸附点，使元素在滚动停止时自动对齐到指定位置。无需 JavaScript 即可实现滑块、轮播图、全屏滚动等效果。

---

## 基本概念

### 滚动容器（Scroll Container）

```css
.scroll-container {
  overflow: auto;           /* 或 overflow-x: auto */
  scroll-snap-type: y mandatory;  /* 约束方向 + 类型 */
}
```

### 吸附点（Snap Point）

```css
.scroll-item {
  scroll-snap-align: start;  /* 吸附对齐方式 */
}
```

---

## scroll-snap-type

### 方向

```css
/* 水平方向 */
.horizontal-snap {
  scroll-snap-type: x mandatory;
}

/* 垂直方向 */
.vertical-snap {
  scroll-snap-type: y mandatory;
}

/* 双方向 */
.both-snap {
  scroll-snap-type: both mandatory;
}

/* 内联轴（block/inline） */
.block-snap {
  scroll-snap-type: block mandatory;
}
```

### 类型

```css
/* mandatory - 强制吸附，滚动必然停在吸附点 */
.strict-snap {
  scroll-snap-type: x mandatory;
}

/* proximity - 仅在靠近吸附点时吸附 */
.loose-snap {
  scroll-snap-type: x proximity;
}
```

---

## scroll-snap-align

### 对齐值

```css
/* 开始边对齐 */
.item-start {
  scroll-snap-align: start;
}

/* 结束边对齐 */
.item-end {
  scroll-snap-align: end;
}

/* 中心对齐 */
.item-center {
  scroll-snap-align: center;
}

/* 水平和垂直分别设置 */
.item-combined {
  scroll-snap-align: center start;  /* 水平中心，垂直开始 */
}
```

---

## 实战示例

### 水平滑块

```html
<div class="slider">
  <div class="slide">幻灯片 1</div>
  <div class="slide">幻灯片 2</div>
  <div class="slide">幻灯片 3</div>
  <div class="slide">幻灯片 4</div>
</div>
```

```css
.slider {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;  /* 平滑滚动 */
  -webkit-overflow-scrolling: touch;  /* iOS 滑动优化 */
  
  /* 隐藏滚动条 */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.slider::-webkit-scrollbar {
  display: none;
}

.slide {
  flex: 0 0 80%;  /* 每张幻灯片占 80% */
  scroll-snap-align: center;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  aspect-ratio: 16 / 9;
  display: grid;
  place-items: center;
  color: white;
  font-size: 2rem;
}
```

### 全屏滚动

```html
<div class="fullscreen-scroll">
  <section class="page">第一页</section>
  <section class="page">第二页</section>
  <section class="page">第三页</section>
</div>
```

```css
.fullscreen-scroll {
  height: 100vh;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
}

.page {
  height: 100vh;
  scroll-snap-align: start;
  display: grid;
  place-items: center;
  font-size: 3rem;
}

.page:nth-child(1) { background: #667eea; }
.page:nth-child(2) { background: #764ba2; }
.page:nth-child(3) { background: #f093fb; }
```

### 网格布局滚动

```css
.grid-scroll {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 280px;
  gap: 1rem;
  overflow-x: auto;
  scroll-snap-type: x proximity;
  padding: 1rem;
}

.grid-item {
  scroll-snap-align: start;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
```

---

## scroll-snap-stop

### 防止跳过

```css
/* 正常滚动 - 可能跳过吸附点 */
.slide-normal {
  scroll-snap-align: center;
}

/* 强制每个吸附点都停留 */
.slide-stop {
  scroll-snap-align: center;
  scroll-snap-stop: always;
}
```

### 幻灯片应用

```css
.carousel-slide {
  scroll-snap-align: center;
  scroll-snap-stop: always;  /* 确保每次只滚动一张 */
}
```

---

## scroll-padding 与 scroll-margin

### 容器内边距

```css
/* 在滚动容器上设置 */
.header-offset {
  scroll-padding-top: 80px;  /* 为固定头部留出空间 */
  scroll-snap-type: y mandatory;
}
```

### 元素外边距

```css
/* 在吸附元素上设置 */
.snap-item {
  scroll-snap-align: center;
  scroll-margin: 1rem;  /* 与周围元素保持距离 */
}
```

### 实战应用

```css
/* 带固定导航的全屏滚动 */
.app {
  height: 100vh;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  scroll-padding-top: 64px;  /* 导航栏高度 */
}

.section {
  min-height: calc(100vh - 64px);
  scroll-snap-align: start;
}
```

---

## JavaScript 联动

### 监听当前活动元素

```javascript
const container = document.querySelector('.slider');

// 使用 Intersection Observer
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      console.log('当前活动:', entry.target.dataset.index);
      updateIndicators(entry.target.dataset.index);
    }
  });
}, {
  root: container,
  threshold: 0.5
});

document.querySelectorAll('.slide').forEach(slide => {
  observer.observe(slide);
});
```

### 程序化滚动

```javascript
function scrollToSlide(index) {
  const slides = document.querySelectorAll('.slide');
  slides[index].scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'center'
  });
}

// 程序化翻页
const slider = document.querySelector('.slider');

function nextSlide() {
  const current = slider.scrollLeft;
  const slideWidth = slider.querySelector('.slide').offsetWidth;
  const gap = parseInt(getComputedStyle(slider).gap) || 0;
  
  slider.scrollTo({
    left: current + slideWidth + gap,
    behavior: 'smooth'
  });
}
```

### 自动播放

```javascript
let autoPlayInterval;

function startAutoPlay() {
  autoPlayInterval = setInterval(() => {
    nextSlide();
  }, 3000);
}

function stopAutoPlay() {
  clearInterval(autoPlayInterval);
}

// 用户交互时暂停
slider.addEventListener('pointerdown', stopAutoPlay);
slider.addEventListener('pointerup', startAutoPlay);
```

---

## 高级技巧

### 缩略图滚动

```css
.thumbnail-scroll {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}

.thumbnail {
  flex: 0 0 80px;
  scroll-snap-align: center;
  border-radius: 4px;
  cursor: pointer;
}

.thumbnail.is-active {
  border: 2px solid #3498db;
}
```

### 双向滚动

```css
.bidirectional-scroll {
  overflow: auto;
  scroll-snap-type: both mandatory;
  display: grid;
  grid-template-columns: repeat(4, 80vw);
  grid-template-rows: repeat(3, 80vh);
}

.grid-cell {
  scroll-snap-align: center;
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| scroll-snap-type | 69+ | 11+ | 68+ | 79+ |
| scroll-snap-align | 69+ | 11+ | 68+ | 79+ |
| scroll-snap-stop | 75+ | 不支持 | 103+ | 79+ |
| scroll-padding | 69+ | 11+ | 68+ | 79+ |
| scroll-margin | 69+ | 11+ | 68+ | 79+ |

---

## 奇淫技巧

### 技巧一：纯 CSS 幻灯片控制器

```css
.slider-wrapper {
  position: relative;
}

.slider {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
}

.slide {
  flex: 0 0 100%;
  scroll-snap-align: start;
}

/* 使用 anchor 定位控制器 */
.slider-nav {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 1rem;
}

.slider-nav a {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ddd;
  text-indent: -9999px;
}

.slider-nav a:hover,
.slider-nav a:focus {
  background: #3498db;
}
```

```html
<div class="slider-wrapper">
  <div class="slider" id="slider">
    <div class="slide" id="slide-1">1</div>
    <div class="slide" id="slide-2">2</div>
    <div class="slide" id="slide-3">3</div>
  </div>
  <nav class="slider-nav">
    <a href="#slide-1">1</a>
    <a href="#slide-2">2</a>
    <a href="#slide-3">3</a>
  </nav>
</div>
```

### 技巧二：迭代器等宽间距

```css
.slider {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  
  /* 确保第一个和最后一个元素也能完全居中 */
  padding: 0 calc((100% - 80%) / 2);
  scroll-padding-inline: calc((100% - 80%) / 2);
}

.slide {
  flex: 0 0 80%;
  scroll-snap-align: center;
}
```

### 技巧三：滚动引导进度条

```css
.slider-container {
  position: relative;
}

.slider {
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}

.scroll-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  background: #3498db;
  transform-origin: left;
  animation: indicator linear;
  animation-timeline: scroll(self inline);
}

@keyframes indicator {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
```

### 技巧四：滚动方向控制

```css
/* 控制滚动方向，避免误触 */
.vertical-scroll {
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  overscroll-behavior-y: contain;  /* 防止链式滚动 */
}

.horizontal-scroll {
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  overscroll-behavior-x: contain;
  touch-action: pan-x;  /* 只允许水平滑动 */
}
```

### 技巧五：视发中心滑块

```css
.viewport-slider {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  
  /* 每个元素都占满视口 */
  scroll-snap-stop: always;
}

.viewport-slide {
  flex: 0 0 100vw;
  scroll-snap-align: start;
  height: 100vh;
}
```

---

## 参考资料

- [MDN Scroll Snap](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_scroll_snap)
- [CSS-Tricks: Practical CSS Scroll Snapping](https://css-tricks.com/practical-css-scroll-snapping/)
- [web.dev: CSS Scroll Snap](https://web.dev/articles/css-scroll-snap)
