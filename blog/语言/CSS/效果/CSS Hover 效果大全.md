---
title: CSS Hover 效果大全
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

# CSS Hover 效果大全

[[toc]]

Hover 效果是提升交互体验的第一个突破口。合理的 Hover 反馈能明确告知用户元素可交互，并赋予操作以"生命力"。

---

## 1. 链接 Hover 效果

### 下划线动画

```css
.link-underline {
  text-decoration: none;
  position: relative;
  color: #333;
}

.link-underline::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: #4a90d9;
  transition: width 0.3s ease;
}

.link-underline:hover::after {
  width: 100%;
}
```

### 下划线从中心展开

```css
.link-center::after {
  left: 50%;
  transform: translateX(-50%);
  transition: width 0.3s ease;
}

.link-center:hover::after {
  width: 100%;
}
```

### 删除线变为下划线

```css
.link-strike {
  text-decoration: line-through;
  transition: text-decoration-color 0.3s;
}

.link-strike:hover {
  text-decoration: underline;
  text-decoration-color: #4a90d9;
}
```

---

## 2. 按钮 Hover 效果

### 填充动画

```css
.btn-fill {
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.btn-fill::before {
  content: '';
  position: absolute;
  inset: 0;
  background: #4a90d9;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
  z-index: -1;
}

.btn-fill:hover::before {
  transform: scaleX(1);
  transform-origin: left;
}
```

### 圆形扩散

```css
.btn-ripple {
  position: relative;
  overflow: hidden;
}

.btn-ripple::before {
  content: '';
  position: absolute;
  top: var(--y, 50%);
  left: var(--x, 50%);
  width: 0;
  aspect-ratio: 1;
  background: rgba(255,255,255,0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.5s ease;
}

.btn-ripple:hover::before {
  width: 300%;
}
```

```js
document.querySelector('.btn-ripple').addEventListener('mousemove', (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--x', e.clientX - rect.left + 'px');
  e.currentTarget.style.setProperty('--y', e.clientY - rect.top + 'px');
});
```

### 滑入底部标签

```css
.btn-slide {
  position: relative;
  overflow: hidden;
}

.btn-slide .default,
.btn-slide .hover {
  display: block;
  transition: transform 0.3s ease;
}

.btn-slide .hover {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  transform: translateY(100%);
}

.btn-slide:hover .default { transform: translateY(-100%); }
.btn-slide:hover .hover   { transform: translateY(0); }
```

---

## 3. 图片 Hover 效果

### 缩放与遮罩

```css
.img-zoom {
  overflow: hidden;
}

.img-zoom img {
  transition: transform 0.5s ease;
}

.img-zoom:hover img {
  transform: scale(1.1);
}

.img-zoom::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0);
  transition: background 0.3s;
}

.img-zoom:hover::after {
  background: rgba(0,0,0,0.3);
}
```

### 3D 翻转

```css
.img-flip {
  perspective: 1000px;
}

.img-flip-inner {
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.img-flip:hover .img-flip-inner {
  transform: rotateY(180deg);
}

.img-flip-front,
.img-flip-back {
  backface-visibility: hidden;
}

.img-flip-back {
  position: absolute;
  inset: 0;
  transform: rotateY(180deg);
}
```

### 视差滑动

```css
.img-parallax {
  overflow: hidden;
}

.img-parallax img {
  transition: transform 0.5s ease;
}

.img-parallax:hover img {
  transform: translateY(-10px) scale(1.05);
}
```

---

## 4. 卡片 Hover 效果

### 提升与阴影

```css
.card-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card-lift:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}
```

### 边框渐变

```css
.card-border {
  position: relative;
  background: white;
}

.card-border::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 2px;
  background: linear-gradient(135deg, #4a90d9, #2ecc71);
  -webkit-mask: linear-gradient(#fff 0 0) content-box,
                linear-gradient(#fff 0 0);
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s;
}

.card-border:hover::before {
  opacity: 1;
}
```

### 光杯效果

```css
.card-glass {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  transition: all 0.3s;
}

.card-glass:hover {
  background: rgba(255,255,255,0.2);
  border-color: rgba(255,255,255,0.4);
  box-shadow: 0 0 30px rgba(255,255,255,0.1);
}
```

---

## 5. 文本 Hover 效果

### 颜色渐变突变

```css
.text-gradient-hover {
  background: linear-gradient(90deg, #333, #333);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: background 0.5s;
}

.text-gradient-hover:hover {
  background: linear-gradient(90deg, #4a90d9, #2ecc71);
  -webkit-background-clip: text;
  background-clip: text;
}
```

### 字符逐个跳跃

```css
.text-jump span {
  display: inline-block;
  transition: transform 0.2s ease;
}

.text-jump:hover span {
  animation: jump 0.5s ease forwards;
}

.text-jump span:nth-child(1) { animation-delay: 0s; }
.text-jump span:nth-child(2) { animation-delay: 0.05s; }
/* ... */

@keyframes jump {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```

### 文字隐现

```css
.text-reveal {
  overflow: hidden;
}

.text-reveal span {
  display: inline-block;
  transform: translateY(100%);
  transition: transform 0.4s ease;
}

.text-reveal:hover span {
  transform: translateY(0);
}

.text-reveal:hover span:nth-child(1) { transition-delay: 0s; }
.text-reveal:hover span:nth-child(2) { transition-delay: 0.05s; }
/* ... */
```

---

## 6. 导航 Hover 效果

### 滑块指示器

```css
.nav-pill {
  display: flex;
  gap: 0.5rem;
  position: relative;
}

.nav-pill .pill {
  position: absolute;
  height: 100%;
  background: #4a90d9;
  border-radius: 999px;
  transition: all 0.3s ease;
  z-index: -1;
}

.nav-pill a {
  padding: 0.5rem 1rem;
  position: relative;
  z-index: 1;
}
```

```js
const nav = document.querySelector('.nav-pill');
const pill = nav.querySelector('.pill');
const links = nav.querySelectorAll('a');

function movePill(target) {
  pill.style.width = target.offsetWidth + 'px';
  pill.style.left = target.offsetLeft + 'px';
}

links.forEach(link => {
  link.addEventListener('mouseenter', () => movePill(link));
});
```

### 下拉菜单滑入

```css
.dropdown {
  opacity: 0;
  transform: translateY(-10px);
  pointer-events: none;
  transition: all 0.2s ease;
}

.nav-item:hover .dropdown {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}
```

---

## 奇淫技巧

### 技巧一：利用 `:has()` 实现子元素 hover 联动

```css
/* 当卡片内图片 hover 时，整个卡片提升 */
.card:has(img:hover) {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}
```

### 技巧二：集群 hover 效果

```css
/* 当悬停某个卡片时，其他卡片淡化 */
.card-grid:has(.card:hover) .card:not(:hover) {
  opacity: 0.6;
  transform: scale(0.95);
}

.card {
  transition: all 0.3s;
}
```

### 技巧三：鼠标跟随光效

```css
.glow-card {
  --x: 50%;
  --y: 50%;
  position: relative;
  background: #1a1a2e;
}

.glow-card::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  background: radial-gradient(
    200px circle at var(--x) var(--y),
    rgba(74, 144, 217, 0.4),
    transparent 40%
  );
  z-index: -1;
}
```

### 技巧四：幻灯片 hover 效果

```css
.filmstrip:hover img {
  filter: grayscale(100%);
}

.filmstrip img:hover {
  filter: grayscale(0%);
  transform: scale(1.05);
  z-index: 1;
}
```

### 技巧五：减少动画开销

```css
/* 使用 content-visibility 优化大量卡片 */
.card-grid {
  content-visibility: auto;
  contain-intrinsic-size: 300px;
}
```

---

## 参考资料

- [CSS-Tricks: Hover Effects](https://css-tricks.com/hover/)
- [CodePen: CSS Hover Effects Collection](https://codepen.io/search/pens?q=css+hover+effect)
- [UIverse: Open-Source UI Elements](https://uiverse.io/)
