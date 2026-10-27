---
title: CSS 变换基础
date: 2025-04-29
tags:
  - CSS
  - 变换
  - 前端
categories:
  - 技术文档
  - 前端
  - CSS
  - 交互与动画
---

# CSS 变换基础

[[toc]]

`transform` 属性允许对元素进行旋转、缩放、移动、倾斜等 2D 或 3D 变换。它是 CSS 动画和交互效果的核心，且通常由 GPU 加速，性能优异。

---

## 基础变换函数

### 位移 translate

```css
.move-right {
  transform: translateX(100px);   /* 水平移动 */
}

.move-down {
  transform: translateY(-50px);   /* 垂直移动（负值向上） */
}

.move-both {
  transform: translate(100px, 50px);  /* 同时移动 */
}

/* 百分比基于元素自身尺寸 */
.center {
  transform: translate(-50%, -50%);
}
```

### 缩放 scale

```css
.zoom-in {
  transform: scale(1.5);      /* 放大 1.5 倍 */
}

.zoom-out {
  transform: scale(0.8);      /* 缩小到 80% */
}

.scale-x {
  transform: scaleX(2);       /* 仅水平放大 */
}

.scale-both {
  transform: scale(1.2, 0.8); /* 水平 1.2，垂直 0.8 */
}
```

### 旋转 rotate

```css
.rotate-90 {
  transform: rotate(90deg);       /* 顺时针 90 度 */
}

.rotate-neg {
  transform: rotate(-45deg);      /* 逆时针 45 度 */
}

.rotate-rad {
  transform: rotate(3.14159rad);  /* 弧度 */
}

.rotate-turn {
  transform: rotate(0.5turn);     /* 半圈（180度） */
}
```

### 倾斜 skew

```css
.skew-x {
  transform: skewX(20deg);    /* 水平倾斜 */
}

.skew-y {
  transform: skewY(-10deg);   /* 垂直倾斜 */
}

.skew-both {
  transform: skew(20deg, 10deg);
}
```

---

## 变换原点

```css
/* 默认中心点 */
.default-origin {
  transform-origin: center center;  /* 或 50% 50% */
}

/* 左上角 */
.top-left {
  transform-origin: left top;
}

/* 右下角 */
.bottom-right {
  transform-origin: right bottom;
}

/* 精确像素 */
.custom-origin {
  transform-origin: 20px 40px;
}
```

---

## 多重变换

```css
/* 顺序从右到左应用 */
.combined {
  transform: translateX(100px) rotate(45deg) scale(1.5);
  /* 先缩放，再旋转，最后位移 */
}

/* 常用组合：居中 + 缩放 */
.hover-zoom {
  transition: transform 0.3s;
  transform-origin: center;
}

.hover-zoom:hover {
  transform: translate(-50%, -50%) scale(1.1);
}
```

---

## 3D 变换

### 透视 perspective

```css
.parent-3d {
  perspective: 1000px;  /* 透视距离，越小透视越强 */
}

.child-3d {
  transform: rotateY(45deg);
}
```

### 3D 变换函数

```css
.rotate-3d {
  transform: rotateX(45deg);     /* 绕 X 轴旋转 */
  transform: rotateY(45deg);     /* 绕 Y 轴旋转 */
  transform: rotateZ(45deg);     /* 绕 Z 轴旋转（等同于 2D rotate） */
  transform: rotate3d(1, 1, 0, 45deg);  /* 自定义轴 */
}

.translate-3d {
  transform: translateZ(100px);  /*  Z 轴位移 */
}

.scale-3d {
  transform: scaleZ(2);
}
```

### 背面可见性

```css
.flip-card {
  transform-style: preserve-3d;
}

.flip-card:hover {
  transform: rotateY(180deg);
}

.flip-card .back {
  backface-visibility: hidden;  /* 背面不可见 */
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| transform | 36+ | 9+ | 16+ | 12+ |
| transform-origin | 36+ | 9+ | 16+ | 12+ |
| perspective | 36+ | 9+ | 16+ | 12+ |
| transform-style | 36+ | 9+ | 16+ | 12+ |
| backface-visibility | 36+ | 9+ | 16+ | 12+ |

---

## 奇淫技巧

### 技巧一：完美居中

```css
.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

### 技巧二：悬停放大

```css
.zoom {
  transition: transform 0.3s;
}

.zoom:hover {
  transform: scale(1.05);
}
```

### 技巧三：翻转卡片

```css
.card {
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.card:hover {
  transform: rotateY(180deg);
}
```

### 技巧四：3D 按钮

```css
.btn-3d {
  transform: perspective(500px) rotateX(10deg);
  transition: transform 0.3s;
}

.btn-3d:hover {
  transform: perspective(500px) rotateX(0deg);
}
```

### 技巧五：视差效果

```css
.parallax {
  transform: translateZ(-100px) scale(2);
}
```

---

## 参考资料

- [MDN transform](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform)
- [MDN transform-origin](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform-origin)
- [CSS-Tricks: transform](https://css-tricks.com/almanac/properties/t/transform/)
