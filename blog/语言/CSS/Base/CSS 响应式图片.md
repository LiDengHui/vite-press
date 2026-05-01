---
title: CSS 响应式图片
date: 2025-04-29
tags:
  - CSS
  - 响应式
categories:
  - 技术文档
  - 前端
  - CSS
  - 布局系统
---

# CSS 响应式图片

[[toc]]

响应式图片让网页在不同设备和屏幕密度下加载合适的图片资源，平衡视觉效果与性能。结合 HTML `srcset`、`sizes` 和 CSS `object-fit`，可以构建高效的图片系统。

---

## 基础概念

### 像素密度

| 密度 | 描述 | 常见设备 |
|------|------|---------|
| 1x | 标准密度 | 桌面显示器 |
| 2x | 视网膜屏 | iPhone、MacBook Retina |
| 3x | 超高密度 | iPhone Plus/Pro |

---

## HTML srcset

### 基于像素密度

```html
<img
  src="image-400.jpg"
  srcset="image-400.jpg 1x, image-800.jpg 2x, image-1200.jpg 3x"
  alt="描述"
/>
```

### 基于视口宽度

```html
<img
  src="image-800.jpg"
  srcset="image-400.jpg 400w, image-800.jpg 800w, image-1200.jpg 1200w"
  sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw"
  alt="描述"
/>
```

### sizes 语法

```html
<!-- 不同断点下的图片显示宽度 -->
<img
  srcset="small.jpg 400w, medium.jpg 800w, large.jpg 1200w"
  sizes="
    (max-width: 480px) 100vw,
    (max-width: 768px) 50vw,
    33vw
  "
/>
```

---

## picture 元素

### 艺术指导

```html
<picture>
  <source
    media="(max-width: 600px)"
    srcset="mobile.jpg"
  />
  <source
    media="(max-width: 1000px)"
    srcset="tablet.jpg"
  />
  <img src="desktop.jpg" alt="描述" />
</picture>
```

### 格式回退

```html
<picture>
  <source srcset="image.avif" type="image/avif" />
  <source srcset="image.webp" type="image/webp" />
  <img src="image.jpg" alt="描述" />
</picture>
```

---

## CSS object-fit

### 图片填充模式

```css
.responsive-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.contain-img {
  object-fit: contain;
}

.fill-img {
  object-fit: fill;
}
```

| 值 | 效果 |
|----|------|
| `cover` | 填满容器，可能裁剪 |
| `contain` | 完整显示，可能有留白 |
| `fill` | 拉伸填满 |
| `none` | 原始尺寸 |
| `scale-down` | 取 contain 或 none 较小者 |

### object-position

```css
.focus-top {
  object-fit: cover;
  object-position: top center;
}

.focus-face {
  object-fit: cover;
  object-position: 50% 30%;
}
```

---

## 懒加载

### loading 属性

```html
<img src="image.jpg" loading="lazy" alt="描述" />
```

### 优先级提示

```html
<!-- 首屏关键图片 -->
<img src="hero.jpg" loading="eager" fetchpriority="high" />

<!-- 非关键图片 -->
<img src="below-fold.jpg" loading="lazy" fetchpriority="low" />
```

---

## 背景图片响应式

### 使用 image-set

```css
.hero {
  background-image: image-set(
    url("hero-small.webp") 1x,
    url("hero-large.webp") 2x
  );
}
```

### 媒体查询

```css
.hero {
  background-image: url("hero-mobile.jpg");
}

@media (min-width: 768px) {
  .hero {
    background-image: url("hero-desktop.jpg");
  }
}
```

---

## 性能优化

### 预加载关键图片

```html
<link rel="preload" as="image" href="hero.jpg" />
```

### 容器查询图片

```css
.card {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card img {
    content: url("large.jpg");
  }
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| srcset | 34+ | 9+ | 38+ | 13+ |
| sizes | 34+ | 9+ | 38+ | 13+ |
| picture | 38+ | 9.1+ | 38+ | 13+ |
| loading=lazy | 76+ | 15.4+ | 75+ | 79+ |
| object-fit | 31+ | 7.1+ | 36+ | 16+ |
| image-set | 113+ | 17+ | 113+ | 113+ |

---

## 奇淫技巧

### 技巧一：模糊占位图

```html
<img
  src="placeholder.jpg"
  data-src="real.jpg"
  class="lazyload"
  alt="描述"
/>
```

```css
.lazyload {
  filter: blur(10px);
  transition: filter 0.3s;
}

.lazyload.loaded {
  filter: blur(0);
}
```

### 技巧二：SVG 占位符

```html
<img
  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23f0f0f0' width='400' height='300'/%3E%3C/svg%3E"
  data-src="real.jpg"
  class="lazyload"
/>
```

### 技巧三：响应式画廊

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.gallery img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}
```

### 技巧四：图片遮罩

```css
.masked-image {
  -webkit-mask-image: linear-gradient(to bottom, black 60%, transparent);
  mask-image: linear-gradient(to bottom, black 60%, transparent);
}
```

### 技巧五：图片对比滑块

```css
.comparison {
  position: relative;
  overflow: hidden;
}

.comparison .before {
  position: absolute;
  inset: 0;
  clip-path: inset(0 50% 0 0);
}
```

---

## 参考资料

- [MDN Responsive images](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [web.dev: Optimize LCP](https://web.dev/optimize-lcp/)
