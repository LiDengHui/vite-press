---
title: CSS 媒体查询深入
date: 2025-04-29
tags:
  - CSS
  - 媒体查询
  - 响应式
categories:
  - 技术文档
  - 前端
  - CSS
  - 基础入门
---

# CSS 媒体查询深入

[[toc]]

CSS 媒体查询（Media Queries）允许根据设备特征（屏幕尺寸、分辨率、方向等）应用不同的样式。本文件深入讲解媒体查询的所有重要特性、新语法和实战技巧。

---

## 基础语法

### 常用媒体特性

```css
/* 视口宽度 */
@media (min-width: 768px) { }
@media (max-width: 1024px) { }
@media (width: 100vw) { }

/* 视口高度 */
@media (min-height: 600px) { }

/* 设备方向 */
@media (orientation: portrait) { }   /* 竖屏 */
@media (orientation: landscape) { }  /* 横屏 */

/* 宽高比 */
@media (aspect-ratio: 16/9) { }
@media (min-aspect-ratio: 1/1) { }
```

### 逻辑运算符

```css
/* 与 */
@media (min-width: 768px) and (max-width: 1024px) { }

/* 或 */
@media (min-width: 768px), (min-height: 800px) { }

/* 非 */
@media not (min-width: 768px) { }

/* 仅屏幕 */
@media only screen and (min-width: 768px) { }
```

---

## 高级媒体特性

### 分辨率

```css
/* DPR（设备像素比） */
@media (-webkit-min-device-pixel-ratio: 2) { }
@media (min-resolution: 192dpi) { }
@media (min-resolution: 2dppx) { }
```

### 显示模式

```css
/* 深色模式 */
@media (prefers-color-scheme: dark) { }
@media (prefers-color-scheme: light) { }

/* 减少动画 */
@media (prefers-reduced-motion: reduce) { }

/* 减少透明度 */
@media (prefers-reduced-transparency: reduce) { }

/* 高对比度 */
@media (prefers-contrast: high) { }

/* 反色 */
@media (inverted-colors: inverted) { }
```

### 交互方式

```css
/* 悬停能力 */
@media (hover: hover) { }      /* 支持悬停 */
@media (hover: none) { }       /* 不支持悬停（触摸设备） */

/* 指针精度 */
@media (pointer: fine) { }     /* 精确指针（鼠标） */
@media (pointer: coarse) { }   /* 粗略指针（触摸） */

/* 输入方式 */
@media (any-pointer: fine) { }
```

### 容器查询

```css
/* 容器定义 */
.container {
  container-type: inline-size;
  container-name: card;
}

/* 容器查询 */
@container card (min-width: 400px) {
  .card {
    display: flex;
  }
}

/* 尺寸样式查询 */
@container style(--theme: dark) {
  .card {
    background: #333;
  }
}
```

---

## 响应式断点策略

### 移动优先

```css
/* 基础样式（移动端） */
.component {
  padding: 1rem;
}

/* 平板 */
@media (min-width: 768px) {
  .component {
    padding: 2rem;
  }
}

/* 桌面 */
@media (min-width: 1024px) {
  .component {
    padding: 3rem;
  }
}
```

### 常见断点

```css
/* 手机 */
@media (max-width: 639px) { }

/* 平板 */
@media (min-width: 640px) and (max-width: 1023px) { }

/* 桌面 */
@media (min-width: 1024px) and (max-width: 1279px) { }

/* 大屏 */
@media (min-width: 1280px) { }
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| 基础媒体查询 | 4+ | 4+ | 3.5+ | 9+ |
| prefers-color-scheme | 76+ | 12.1+ | 67+ | 79+ |
| prefers-reduced-motion | 74+ | 10.1+ | 63+ | 79+ |
| 容器查询 | 105+ | 16+ | 110+ | 105+ |

---

## 奇淫技巧

### 技巧一：CSS 变量响应式

```css
:root {
  --spacing: 1rem;
}

@media (min-width: 768px) {
  :root {
    --spacing: 2rem;
  }
}

.component {
  padding: var(--spacing);
}
```

### 技巧二：悬停区分

```css
/* 桌面端显示悬停效果 */
@media (hover: hover) {
  .btn:hover {
    background: #2980b9;
  }
}

/* 触摸设备使用 active */
@media (hover: none) {
  .btn:active {
    background: #2980b9;
  }
}
```

### 技巧三：打印样式

```css
@media print {
  .no-print {
    display: none;
  }
  
  a[href]::after {
    content: " (" attr(href) ")";
  }
}
```

### 技巧四：深色模式自动适配

```css
:root {
  --bg: #fff;
  --text: #333;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #1a1a1a;
    --text: #e0e0e0;
  }
}

body {
  background: var(--bg);
  color: var(--text);
}
```

### 技巧五：减少动画适配

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 参考资料

- [MDN: Media Queries](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_media_queries)
- [MDN: CSS Container Queries](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_container_queries)
- [CSS-Tricks: A Complete Guide to CSS Media Queries](https://css-tricks.com/a-complete-guide-to-css-media-queries/)
