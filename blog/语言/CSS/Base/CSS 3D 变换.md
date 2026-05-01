---
title: CSS 3D 变换
date: 2025-04-29
tags:
  - CSS
  - 变换
  - 3D
categories:
  - 技术文档
  - 前端
  - CSS
  - 交互与动画
---

# CSS 3D 变换

[[toc]]

CSS 3D 变换让平面元素具有空间感。通过 `perspective`、`transform-style` 和 `rotateX/Y/Z` 等属性，可以创建翻转卡片、旋转木马、视差滚动等富有立体感的效果。

---

## 基础 3D 属性

### perspective 透视

```css
.container {
  perspective: 1000px;  /* 视距越小，3D 效果越强烈 */
}

.card {
  transform: rotateY(45deg);  /* 在 perspective 容器内渲柔3D效果 */
}
```

| 值 | 效果 |
|----|------|
| `none` | 无透视 |
| `<length>` | 视距，通常 500-1500px |

### perspective-origin

```css
.container {
  perspective: 1000px;
  perspective-origin: center center;  /* 默认 */
}

.container.top-view {
  perspective-origin: center top;  /* 从上方视角看 */
}
```

### transform-style

```css
.scene {
  transform-style: preserve-3d;  /* 子元素在 3D 空间中 */
}

.scene.flat {
  transform-style: flat;  /* 子元素被压平到 2D 层 */
}
```

### backface-visibility

```css
.card {
  backface-visibility: hidden;  /* 背面不可见 */
}
```

---

## 3D 变换函数

### 旋转

```css
.rotate-x {
  transform: rotateX(45deg);  /* 绕 X 轴旋转 */
}

.rotate-y {
  transform: rotateY(45deg);  /* 绕 Y 轴旋转 */
}

.rotate-z {
  transform: rotateZ(45deg);  /* 绕 Z 轴旋转（同 rotate()） */
}

.rotate-3d {
  transform: rotate3d(1, 1, 1, 45deg);  /* 绕 (1,1,1) 向量旋转 */
}
```

### 移动

```css
.translate-z {
  transform: translateZ(100px);  /* 朝观察者方向移动 */
}

.translate-3d {
  transform: translate3d(50px, 50px, 100px);
}
```

### 缩放

```css
.scale-z {
  transform: scaleZ(2);  /* Z 轴方向缩放 */
}

.scale-3d {
  transform: scale3d(1.5, 1.5, 1.5);
}
```

---

## 经典效果

### 翻转卡片

```css
.flip-card {
  perspective: 1000px;
  width: 300px;
  height: 200px;
}

.flip-card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.flip-card-front {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.flip-card-back {
  background: linear-gradient(135deg, #f093fb, #f5576c);
  color: white;
  transform: rotateY(180deg);
}
```

```html
<div class="flip-card">
  <div class="flip-card-inner">
    <div class="flip-card-front">正面</div>
    <div class="flip-card-back">背面</div>
  </div>
</div>
```

### 3D 旋转木马

```css
.carousel {
  perspective: 1000px;
  width: 200px;
  height: 200px;
  position: relative;
}

.carousel-inner {
  width: 100%;
  height: 100%;
  position: absolute;
  transform-style: preserve-3d;
  animation: rotate-carousel 20s infinite linear;
}

.carousel-item {
  position: absolute;
  width: 200px;
  height: 200px;
  left: 0;
  top: 0;
}

.carousel-item:nth-child(1) { transform: rotateY(0deg) translateZ(250px); }
.carousel-item:nth-child(2) { transform: rotateY(60deg) translateZ(250px); }
.carousel-item:nth-child(3) { transform: rotateY(120deg) translateZ(250px); }
.carousel-item:nth-child(4) { transform: rotateY(180deg) translateZ(250px); }
.carousel-item:nth-child(5) { transform: rotateY(240deg) translateZ(250px); }
.carousel-item:nth-child(6) { transform: rotateY(300deg) translateZ(250px); }

@keyframes rotate-carousel {
  from { transform: rotateY(0deg); }
  to { transform: rotateY(360deg); }
}
```

### 3D 立方体

```css
.cube {
  width: 200px;
  height: 200px;
  position: relative;
  transform-style: preserve-3d;
  animation: rotate-cube 10s infinite linear;
}

.cube-face {
  position: absolute;
  width: 200px;
  height: 200px;
  opacity: 0.9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  border: 2px solid rgba(255,255,255,0.5);
}

.cube-face.front  { transform: translateZ(100px); background: #ff6b6b; }
.cube-face.back   { transform: rotateY(180deg) translateZ(100px); background: #4ecdc4; }
.cube-face.right  { transform: rotateY(90deg) translateZ(100px); background: #45b7d1; }
.cube-face.left   { transform: rotateY(-90deg) translateZ(100px); background: #f9ca24; }
.cube-face.top    { transform: rotateX(90deg) translateZ(100px); background: #6c5ce7; }
.cube-face.bottom { transform: rotateX(-90deg) translateZ(100px); background: #a29bfe; }

@keyframes rotate-cube {
  from { transform: rotateX(0deg) rotateY(0deg); }
  to   { transform: rotateX(360deg) rotateY(360deg); }
}
```

---

## 鼠标跟随 3D 效果

```css
.tilt-card {
  perspective: 1000px;
  transform-style: preserve-3d;
}

.tilt-card:hover {
  transform: rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg));
}
```

```js
const card = document.querySelector('.tilt-card');

card.addEventListener('mousemove', (e) => {
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const rotateX = (y - centerY) / 10;
  const rotateY = (centerX - x) / 10;

  card.style.setProperty('--rotate-x', `${rotateX}deg`);
  card.style.setProperty('--rotate-y', `${rotateY}deg`);
});
```

---

## 浏览器兼容性

| 属性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| perspective | 36+ | 9+ | 16+ | 12+ |
| transform-style | 36+ | 9+ | 16+ | 12+ |
| backface-visibility | 36+ | 9+ | 16+ | 12+ |
| rotate3d | 36+ | 9+ | 16+ | 12+ |
| translate3d | 36+ | 9+ | 16+ | 12+ |

---

## 奇淫技巧

### 技巧一：视差滚动

```css
.parallax-3d {
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

.parallax-layer-back {
  transform: translateZ(-1px) scale(2);
}

.parallax-layer-base {
  transform: translateZ(0);
}
```

### 技巧二：电影幕布

```css
.curtain {
  perspective: 1000px;
  overflow: hidden;
}

.curtain-panel {
  width: 50%;
  height: 100vh;
  background: linear-gradient(90deg, #8b0000, #dc143c);
  position: absolute;
  top: 0;
  transition: transform 1s ease-in-out;
}

.curtain-panel.left {
  left: 0;
  transform-origin: left;
}

.curtain-panel.right {
  right: 0;
  transform-origin: right;
}

.curtain:hover .curtain-panel.left {
  transform: rotateY(-90deg);
}

.curtain:hover .curtain-panel.right {
  transform: rotateY(90deg);
}
```

### 技巧三：旋转文字效果

```css
.spin-text {
  perspective: 500px;
}

.spin-text span {
  display: inline-block;
  animation: spin-char 2s infinite;
}

.spin-text span:nth-child(1) { animation-delay: 0s; }
.spin-text span:nth-child(2) { animation-delay: 0.1s; }
.spin-text span:nth-child(3) { animation-delay: 0.2s; }

@keyframes spin-char {
  0%, 100% { transform: rotateX(0deg); }
  50% { transform: rotateX(360deg); }
}
```

### 技巧四：卡片展开效果

```css
.card-deck {
  perspective: 1000px;
}

.card-deck .card {
  transform-origin: bottom center;
  transition: transform 0.3s;
}

.card-deck:hover .card:nth-child(1) { transform: rotateY(-20deg) translateZ(50px); }
.card-deck:hover .card:nth-child(2) { transform: rotateY(-10deg) translateZ(50px); }
.card-deck:hover .card:nth-child(3) { transform: rotateY(0deg) translateZ(50px); }
.card-deck:hover .card:nth-child(4) { transform: rotateY(10deg) translateZ(50px); }
.card-deck:hover .card:nth-child(5) { transform: rotateY(20deg) translateZ(50px); }
```

### 技巧五：3D 按钮

```css
.btn-3d {
  background: #4a90d9;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  transform: translateZ(0);
  transition: transform 0.1s;
  box-shadow: 0 4px 0 #2c5aa0;
}

.btn-3d:active {
  transform: translateY(4px) translateZ(0);
  box-shadow: 0 0 0 #2c5aa0;
}
```

---

## 参考资料

- [MDN perspective](https://developer.mozilla.org/zh-CN/docs/Web/CSS/perspective)
- [MDN transform-style](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform-style)
- [MDN backface-visibility](https://developer.mozilla.org/zh-CN/docs/Web/CSS/backface-visibility)
- [CSS-Tricks: Guide to CSS 3D Transforms](https://css-tricks.com/css-3d-transforms/)
