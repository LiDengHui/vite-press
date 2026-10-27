---
title: CSS 变换进阶
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

# CSS 变换进阶

[[toc]]

CSS `transform` 属性允许对元素进行旋转、缩放、平移和倾斜等 2D/3D 变换。本文深入讲解变换的高级用法、性能优化和实战技巧。

---

## 3D 变换基础

### 3D 场景设置

```css
.scene {
  perspective: 1000px;  /* 透视距离 */
  perspective-origin: 50% 50%;  /* 视点位置 */
}

.card {
  transform-style: preserve-3d;  /* 保持 3D 变换 */
  transition: transform 0.6s;
}

.card:hover {
  transform: rotateY(180deg);
}
```

### 3D 变换函数

```css
.translate3d {
  transform: translate3d(10px, 20px, 30px);
}

.scale3d {
  transform: scale3d(1.2, 1.2, 1);
}

.rotate3d {
  transform: rotate3d(1, 1, 0, 45deg);  /* x, y, z, angle */
}

/* 矩阵变换 */
.matrix3d {
  transform: matrix3d(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  );
}
```

---

## 高级变换技巧

### 变换原点

```css
/* 默认中心点 */
.origin-center {
  transform-origin: 50% 50%;
}

/* 左上角 */
.origin-top-left {
  transform-origin: 0 0;
}

/* 右下角 */
.origin-bottom-right {
  transform-origin: 100% 100%;
}

/* 自定义偏移 */
.origin-offset {
  transform-origin: 20px 30px;
}
```

### 多重变换组合

```css
/* 组合变换（从右到左应用） */
.combo-transform {
  transform: translateX(100px) rotate(45deg) scale(1.5);
}

/* 3D 翻转卡片 */
.flip-card {
  transform: rotateY(180deg) translateZ(1px);
}

/* 视差效果 */
.parallax {
  transform: translateZ(-100px) scale(2);
}
```

---

## 实战案例

### 3D 翻转卡片

```css
.flip-container {
  perspective: 1000px;
  width: 300px;
  height: 200px;
}

.flip-card {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.flip-container:hover .flip-card {
  transform: rotateY(180deg);
}

.flip-front,
.flip-back {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;  /* 隐藏背面 */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.flip-front {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.flip-back {
  background: linear-gradient(135deg, #f093fb, #f5576c);
  color: white;
  transform: rotateY(180deg);
}
```

### 3D 立方体

```css
.cube {
  position: relative;
  width: 200px;
  height: 200px;
  transform-style: preserve-3d;
  animation: rotate-cube 8s linear infinite;
}

.cube-face {
  position: absolute;
  width: 200px;
  height: 200px;
  opacity: 0.8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  border: 2px solid rgba(255,255,255,0.3);
}

.front  { transform: translateZ(100px); background: rgba(255,0,0,0.5); }
.back   { transform: translateZ(-100px) rotateY(180deg); background: rgba(0,255,0,0.5); }
.right  { transform: translateX(100px) rotateY(90deg); background: rgba(0,0,255,0.5); }
.left   { transform: translateX(-100px) rotateY(-90deg); background: rgba(255,255,0,0.5); }
.top    { transform: translateY(-100px) rotateX(90deg); background: rgba(255,0,255,0.5); }
.bottom { transform: translateY(100px) rotateX(-90deg); background: rgba(0,255,255,0.5); }

@keyframes rotate-cube {
  from { transform: rotateX(-20deg) rotateY(0deg); }
  to { transform: rotateX(-20deg) rotateY(360deg); }
}
```

---

## 性能优化

### GPU 加速

```css
/* 强制 GPU 合成 */
.gpu-accelerated {
  transform: translateZ(0);
  will-change: transform;
}

/* 动画完成后移除 will-change */
.animation-done {
  will-change: auto;
}
```

### 减少重绘

```css
/* 优先使用 transform 而非 top/left */
/* ❌ 避免 */
.bad-animation {
  position: absolute;
  left: 0;
  animation: slide-left 1s;
}

@keyframes slide-left {
  to { left: 100px; }
}

/* ✅ 推荐 */
.good-animation {
  transform: translateX(0);
  animation: slide-transform 1s;
}

@keyframes slide-transform {
  to { transform: translateX(100px); }
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| transform | 36+ | 9+ | 16+ | 12+ |
| transform-style: preserve-3d | 36+ | 9+ | 16+ | 12+ |
| perspective | 36+ | 9+ | 16+ | 12+ |
| backface-visibility | 36+ | 9+ | 16+ | 12+ |

---

## 奇淫技巧

### 技巧一：3D 文字效果

```css
.text-3d {
  color: #fff;
  text-shadow:
    1px 1px 0 #ccc,
    2px 2px 0 #c9c9c9,
    3px 3px 0 #bbb,
    4px 4px 0 #b9b9b9,
    5px 5px 0 #aaa,
    6px 6px 1px rgba(0,0,0,0.1),
    0 0 5px rgba(0,0,0,0.1),
    1px 1px 3px rgba(0,0,0,0.3),
    3px 3px 5px rgba(0,0,0,0.2),
    5px 5px 10px rgba(0,0,0,0.25);
}
```

### 技巧二：悬停放大卡片

```css
.hover-zoom {
  transition: transform 0.3s ease;
}

.hover-zoom:hover {
  transform: scale(1.05);
}

/* 限制缩放范围 */
.hover-zoom-limited {
  transition: transform 0.3s ease;
  transform-origin: center;
}

.hover-zoom-limited:hover {
  transform: scale(1.05) translateZ(0);
}
```

### 技巧三：倾斜卡片效果

```css
.tilt-card {
  transform: perspective(1000px) rotateX(5deg) rotateY(-5deg);
  transition: transform 0.3s;
}

.tilt-card:hover {
  transform: perspective(1000px) rotateX(0) rotateY(0) scale(1.02);
}
```

### 技巧四：视差滚动

```css
.parallax-container {
  perspective: 1px;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
}

.parallax-layer {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.parallax-back {
  transform: translateZ(-1px) scale(2);
}

.parallax-front {
  transform: translateZ(0);
}
```

### 技巧五：鼠标跟随 3D 效果

```css
.card-3d {
  transform-style: preserve-3d;
  transition: transform 0.1s;
}
```

```javascript
document.querySelector('.card-3d').addEventListener('mousemove', (e) => {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  const rotateX = (y - centerY) / 10;
  const rotateY = (centerX - x) / 10;
  
  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

document.querySelector('.card-3d').addEventListener('mouseleave', (e) => {
  e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
});
```

---

## 参考资料

- [MDN: transform](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform)
- [MDN: transform-style](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform-style)
- [CSS-Tricks: transform](https://css-tricks.com/almanac/properties/t/transform/)
