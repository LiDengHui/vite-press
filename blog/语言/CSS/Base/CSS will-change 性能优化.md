---
title: CSS will-change 性能优化
date: 2025-04-29
tags:
  - CSS
  - 性能
  - will-change
categories:
  - 技术文档
  - 前端
  - CSS
  - 基础入门
---

# CSS will-change 性能优化

[[toc]]

`will-change` 是一个性能优化属性，提前告知浏览器**某些属性即将发生变化**，让浏览器能在变化发生前做好优化准备。正确使用可以显著提升动画和交互的流畅度。

---

## 基础语法

### 常用值

```css
.animated-box {
  will-change: transform, opacity;  /* 提前优化 transform 和 opacity */
  transition: transform 0.3s, opacity 0.3s;
}

.animated-box:hover {
  transform: scale(1.1);
  opacity: 0.8;
}
```

| 值 | 说明 |
|----|------|
| `auto` | 默认，无特殊优化 |
| `scroll-position` | 即将滚动，预先渲染 |
| `contents` | 内容即将变化 |
| `<custom-ident>` | 具体属性名（transform, opacity 等） |

### 多属性优化

```css
.optimized {
  will-change: transform, opacity, filter;
}
```

---

## 常见使用场景

### 悬停动画

```css
.card {
  will-change: transform;
  transition: transform 0.3s;
}

.card:hover {
  transform: translateY(-10px);
}
```

### 无限滚动

```css
.marquee {
  will-change: transform;
  animation: scroll 10s linear infinite;
}

@keyframes scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
}
```

### 滚动联动效果

```css
.parallax-layer {
  will-change: transform;
  /* JS 控制 transform 时使用 */
}
```

### 拖拽交互

```css
.draggable {
  will-change: transform;
  /* 拖拽过程中优化 */
}
```

---

## 使用规范

### 避免过度使用

```css
/* 错误：全局使用 */
* {
  will-change: transform;  /* 性能反而下降！ */
}

/* 正确：针对性使用 */
.animated-element {
  will-change: transform;
}
```

### 动态添加/移除

```css
.element {
  transition: transform 0.3s;
}

.element:hover {
  will-change: transform;  /* 即将变化时添加 */
  transform: scale(1.05);
}

.element:not(:hover) {
  will-change: auto;  /* 变化结束后移除 */
}
```

### JS 控制

```js
// 动画开始前
function startAnimation(element) {
  element.style.willChange = 'transform, opacity';
}

// 动画结束后
function endAnimation(element) {
  element.style.willChange = 'auto';
}
```

---

## 性能影响

### GPU 加速

```css
.gpu-layer {
  will-change: transform;
  /* 浏览器可能创建独立的合成层（compositor layer） */
}
```

### 内存占用

> 每个 `will-change` 可能会创建额外的合成层，占用更多内存。动画结束后应及时移除。

```css
/* 动画类 */
.animated {
  will-change: transform;
}

.animated.animation-ended {
  will-change: auto;
}
```

---

## 与 transform 配合

### 强制 GPU 渲染

```css
.gpu-element {
  transform: translateZ(0);  /* 旧方法，创建 GPU 层 */
  will-change: transform;     /* 现代方法 */
}
```

### 推荐属性

```css
/* 推荐使用 will-change 的属性 */
.recommended {
  will-change: transform;     /* 最优 */
}

.recommended {
  will-change: opacity;       /* 优 */
}

.recommended {
  will-change: filter;        /* 可行，但开销较大 */
}
```

> 避免对 `width`、`height`、`top`、`left` 等触发重排的属性使用 `will-change`。

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| will-change | 36+ | 9.1+ | 36+ | 79+ |

---

## 奇淫技巧

### 技巧一：动画队列优化

```css
.animation-queue > * {
  will-change: transform, opacity;
}

.animation-queue > *.animating {
  animation: slide-in 0.3s forwards;
}

.animation-queue > *.done {
  will-change: auto;
}
```

### 技巧二：视差滚动优化

```css
.parallax-container {
  will-change: transform;
}

/* JS 中使用 requestAnimationFrame 更新 */
function updateParallax() {
  const scrollY = window.scrollY;
  container.style.transform = `translateY(${scrollY * 0.5}px)`;
  requestAnimationFrame(updateParallax);
}
```

### 技巧三：虚拟滚动列表

```css
.virtual-scroll-item {
  will-change: transform;
  contain: strict;
}
```

### 技巧四：图片懒加载动画

```css
.lazy-image {
  will-change: opacity, transform;
  opacity: 0;
  transform: scale(0.95);
  transition: opacity 0.5s, transform 0.5s;
}

.lazy-image.loaded {
  opacity: 1;
  transform: scale(1);
}
```

### 技巧五：动画结束自动清理

```js
const element = document.querySelector('.animated');

element.addEventListener('transitionend', (e) => {
  if (e.propertyName === 'transform') {
    element.style.willChange = 'auto';
  }
});
```

---

## 参考资料

- [MDN will-change](https://developer.mozilla.org/zh-CN/docs/Web/CSS/will-change)
- [web.dev: will-change](https://web.dev/articles/animations-guide#will-change)
- [CSS-Tricks: will-change](https://css-tricks.com/almanac/properties/w/will-change/)
