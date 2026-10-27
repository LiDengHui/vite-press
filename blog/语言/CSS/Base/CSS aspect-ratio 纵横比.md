---
title: CSS aspect-ratio 纵横比
date: 2025-04-29
tags:
  - CSS
  - 纵横比
  - 前端
categories:
  - 技术文档
  - 前端
  - CSS
  - 视觉表现
---

# CSS aspect-ratio 纵横比

[[toc]]

`aspect-ratio` 属性让元素保持固定的宽高比，无需使用 padding-top 技巧或 JavaScript 计算。它是响应式图片、视频容器和卡片布局的利器。

---

## 基础语法

### 直接设置比例

```css
.video-container {
  aspect-ratio: 16 / 9;  /* 16:9 宽屏 */
  width: 100%;
}

.square {
  aspect-ratio: 1;  /* 1:1 正方形 */
}

.portrait {
  aspect-ratio: 3 / 4;  /* 3:4 竖屏 */
}
```

### 与 max-width 配合

```css
.responsive-video {
  width: 100%;
  max-width: 800px;
  aspect-ratio: 16 / 9;
}
```

---

## 常用比例

| 比例 | 适用场景 |
|------|---------|
| `1 / 1` | 头像、正方形图片 |
| `4 / 3` | 传统显示器、幻灯片 |
| `16 / 9` | 视频、宽屏图片 |
| `3 / 2` | 照片打印 |
| `21 / 9` | 超宽屏电影 |
| `9 / 16` | 手机竖屏视频 |
| `2.35 / 1` | 电影宽银幕 |

---

## 实际应用场景

### 响应式视频容器

```css
.video-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
}

.video-wrapper iframe,
.video-wrapper video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
```

### 图片占位符

```css
.image-placeholder {
  aspect-ratio: 4 / 3;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-placeholder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

### 网格卡片统一高度

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.card-image {
  aspect-ratio: 16 / 10;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.card:hover .card-image img {
  transform: scale(1.05);
}
```

---

## 与 object-fit 配合

```css
.cover-image {
  aspect-ratio: 16 / 9;
  width: 100%;
}

.cover-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
```

| object-fit 值 | 效果 |
|-------------|------|
| `cover` | 填满容器，可能裁剪 |
| `contain` | 完整显示，可能有留白 |
| `fill` | 拉伸填满 |
| `none` | 原始尺寸 |
| `scale-down` | 取 contain 或 none 中较小者 |

---

## 降级方案

### 旧浏览器 padding-top 技巧

```css
.video-container {
  position: relative;
  width: 100%;
}

/* 16:9 = 9/16 = 56.25% */
.video-container::before {
  content: '';
  display: block;
  padding-top: 56.25%;
}

.video-container iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

/* 现代浏览器直接使用 aspect-ratio */
@supports (aspect-ratio: 16 / 9) {
  .video-container {
    aspect-ratio: 16 / 9;
  }

  .video-container::before {
    display: none;
  }
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| aspect-ratio | 88+ | 15+ | 89+ | 88+ |

---

## 奇淫技巧

### 技巧一：动态比例变量

```css
:root {
  --ratio: 16 / 9;
}

.dynamic-ratio {
  aspect-ratio: var(--ratio);
}

/* JS 动态调整 */
/* element.style.setProperty('--ratio', '4 / 3'); */
```

### 技巧二：响应式比例

```css
.responsive-ratio {
  aspect-ratio: 16 / 9;
}

@media (max-width: 768px) {
  .responsive-ratio {
    aspect-ratio: 4 / 3;
  }
}

@media (max-width: 480px) {
  .responsive-ratio {
    aspect-ratio: 1;
  }
}
```

### 技巧三：最小高度保障

```css
.hero {
  aspect-ratio: 21 / 9;
  min-height: 300px;
  max-height: 600px;
}
```

### 技巧四：瀑布流统一比例

```css
.masonry-item {
  aspect-ratio: 3 / 4;
  break-inside: avoid;
}

.masonry-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

### 技巧五：加载骨架屏

```css
.skeleton {
  aspect-ratio: 16 / 9;
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

## 参考资料

- [MDN aspect-ratio](https://developer.mozilla.org/zh-CN/docs/Web/CSS/aspect-ratio)
- [web.dev: aspect-ratio](https://web.dev/aspect-ratio/)
