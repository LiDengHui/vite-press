---
title: CSS 图片效果大全
date: 2025-04-29
tags:
  - CSS
  - 效果
  - 实战
categories:
  - 技术文档
  - 前端
  - CSS
  - 效果实战
---

# CSS 图片效果大全

[[toc]]

图片是网页中最具表现力的视觉元素。纯 CSS 图片处理不仅性能优异，还能创造出令人惊艳的交互效果。

---

## 1. 基础滤镜

### 常用滤镜组合

```css
.img-grayscale {
  filter: grayscale(100%);
  transition: filter 0.3s;
}

.img-grayscale:hover {
  filter: grayscale(0%);
}

.img-sepia {
  filter: sepia(60%);
}

.img-vintage {
  filter: contrast(110%) brightness(110%) sepia(30%) saturate(130%);
}

.img-dramatic {
  filter: contrast(150%) saturate(120%);
}
```

### 暗角效果

```css
.img-vignette {
  position: relative;
}

.img-vignette::after {
  content: '';
  position: absolute;
  inset: 0;
  box-shadow: inset 0 0 100px rgba(0,0,0,0.5);
  pointer-events: none;
}
```

---

## 2. 悬停效果

### 缩放与遮罩

```css
.img-hover-zoom {
  overflow: hidden;
}

.img-hover-zoom img {
  transition: transform 0.5s ease;
}

.img-hover-zoom:hover img {
  transform: scale(1.1);
}

.img-hover-overlay {
  position: relative;
  overflow: hidden;
}

.img-hover-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0);
  transition: background 0.3s;
}

.img-hover-overlay:hover::after {
  background: rgba(0,0,0,0.3);
}
```

### 图片切换

```css
.img-swap {
  position: relative;
}

.img-swap img:last-child {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.3s;
}

.img-swap:hover img:last-child {
  opacity: 1;
}
```

---

## 3. 画廊布局

### Masonry 瀑布流

```css
.masonry {
  column-count: 3;
  column-gap: 1rem;
}

.masonry img {
  break-inside: avoid;
  margin-bottom: 1rem;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .masonry { column-count: 2; }
}

@media (max-width: 480px) {
  .masonry { column-count: 1; }
}
```

### 均匀网格

```css
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.gallery-grid img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}
```

---

## 4. 图片边框

### 拍立得效果

```css
.polaroid {
  background: white;
  padding: 1rem 1rem 3rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transform: rotate(-2deg);
  transition: transform 0.3s;
}

.polaroid:hover {
  transform: rotate(0deg) scale(1.02);
}
```

### 双边框

```css
.img-double-border {
  position: relative;
  padding: 8px;
  background: white;
  border: 2px solid #333;
}

.img-double-border::after {
  content: '';
  position: absolute;
  inset: 4px;
  border: 1px solid #333;
}
```

---

## 5. 图片遮罩

### 渐变遮罩

```css
.img-gradient-mask {
  mask-image: linear-gradient(to bottom, black 60%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, black 60%, transparent);
}
```

### 形状遮罩

```css
.img-circle-mask {
  border-radius: 50%;
  aspect-ratio: 1;
  object-fit: cover;
}

.img-hexagon {
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}
```

---

## 奇淫技巧

### 技巧一：懒加载占位

```css
.img-lazy {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### 技巧二：图片对比滑块

```css
.comparison {
  position: relative;
  overflow: hidden;
}

.comparison .before {
  position: absolute;
  inset: 0;
  width: 50%;
  overflow: hidden;
}
```

### 技巧三：3D 图片倾斜

```css
.img-3d {
  transform: perspective(1000px) rotateY(15deg);
  transition: transform 0.5s;
}

.img-3d:hover {
  transform: perspective(1000px) rotateY(0deg);
}
```

### 技巧四：图片模糊加载

```css
.img-blur-load {
  filter: blur(20px);
  transition: filter 0.3s;
}

.img-blur-load.loaded {
  filter: blur(0);
}
```

### 技巧五：图片网格悬停

```css
.gallery:has(.item:hover) .item:not(:hover) {
  opacity: 0.5;
  transform: scale(0.95);
}
```

---

## 参考资料

- [CSS-Tricks: Image Effects](https://css-tricks.com/almanac/properties/f/filter/)
- [Unsplash: Image Gallery Inspiration](https://unsplash.com/)
