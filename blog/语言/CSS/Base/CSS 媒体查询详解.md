---
title: CSS 媒体查询详解
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

# CSS 媒体查询详解

[[toc]]

媒体查询（Media Queries）让 CSS 根据设备特性（宽度、高度、视口方向、颜色方案等）应用不同的样式，是响应式设计的核心。

---

## 基础语法

### 基本结构

```css
@media 媒体类型 and (特性) {
  /* 样式 */
}
```

### 常用媒体类型

| 值 | 说明 |
|----|------|
| `all` | 所有设备（默认） |
| `screen` | 显示屏 |
| `print` | 打印机 |
| `speech` | 屏幕阅读器 |

---

## 宽度查询

### 常用断点

```css
/* 移动端 */
@media (max-width: 480px) { }

/* 平板 */
@media (min-width: 481px) and (max-width: 768px) { }

/* 桌面 */
@media (min-width: 769px) and (max-width: 1024px) { }

/* 大屏 */
@media (min-width: 1025px) { }
```

### 宽度范围

```css
@media (width >= 768px) { }       /* 现代语法 */
@media (width < 1200px) { }       /* 现代语法 */
@media (768px <= width <= 1200px) { } /* 范围查询 */
```

---

## 方向查询

```css
/* 横屏 */
@media (orientation: landscape) { }

/* 竖屏 */
@media (orientation: portrait) { }
```

---

## 显示特性

### 显示比例

```css
@media (min-resolution: 2dppx) {
  /* 高 DPI 屏幕 */
  .logo {
    background-image: url('logo@2x.png');
  }
}
```

### 颜色模式

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #1a1a1a;
    --text: #f5f5f5;
  }
}

@media (prefers-color-scheme: light) {
  :root {
    --bg: #fff;
    --text: #1a1a1a;
  }
}
```

### 减少动画

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 逻辑操作符

```css
/* 且（and） */
@media screen and (min-width: 768px) and (max-width: 1024px) { }

/* 或（,） */
@media (max-width: 480px), (min-width: 1200px) { }

/* 非（not） */
@media not print { }

/* 仅（only） */
@media only screen and (min-width: 768px) { }
```

---

## 模式匹配

```css
@media (hover: hover) {
  /* 支持悬停的设备 */
  .button:hover { background: #333; }
}

@media (hover: none) {
  /* 触摸设备 */
  .button:active { background: #333; }
}

@media (pointer: fine) {
  /* 高精度指针（鼠标） */
}

@media (pointer: coarse) {
  /* 粗糙指针（触摸屏） */
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| 媒体查询 | 1+ | 3+ | 3.5+ | 9+ |
| 现代范围语法 | 104+ | 16+ | 63+ | 79+ |
| prefers-color-scheme | 76+ | 12.1+ | 67+ | 79+ |
| prefers-reduced-motion | 74+ | 10.1+ | 63+ | 79+ |

---

## 奇淫技巧

### 技巧一：移动端首先

```css
/* 移动端样式 */
.card { width: 100%; }

/* 桌面端样式 */
@media (min-width: 768px) {
  .card { width: 50%; }
}
```

### 技巧二：容器查询作为补充

```css
/* 媒体查询处理整体布局 */
@media (min-width: 768px) {
  .layout { display: flex; }
}

/* 容器查询处理组件级别 */
.sidebar {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .sidebar .nav { flex-direction: row; }
}
```

### 技巧三：深色模式切换

```css
:root {
  color-scheme: light dark;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #1a1a1a;
    --text: #f5f5f5;
  }
}
```

### 技巧四：打印优化

```css
@media print {
  .no-print { display: none; }
  a[href]::after { content: ' (' attr(href) ')'; }
}
```

---

## 参考资料

- [MDN 媒体查询](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_media_queries)
- [web.dev: Responsive design](https://web.dev/responsive-web-design-basics/)
