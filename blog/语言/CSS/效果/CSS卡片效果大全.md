---
title: CSS 卡片效果大全
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

# CSS 卡片效果大全

[[toc]]

卡片是现代 UI 最常见的内容容器。从平面到立体、从光影到渐变，CSS 能构建出丰富多样的卡片视觉风格。

---

## 1. 新拟态 Neumorphism

### 凸起效果

```css
.neu-raised {
  background: #e0e5ec;
  border-radius: 16px;
  box-shadow:
    8px 8px 16px #a3b1c6,
    -8px -8px 16px #ffffff;
}
```

### 凹陷效果

```css
.neu-inset {
  background: #e0e5ec;
  border-radius: 16px;
  box-shadow:
    inset 6px 6px 12px #a3b1c6,
    inset -6px -6px 12px #ffffff;
}
```

### 凸凹组合（按钮在卡片上）

```css
.neu-card {
  background: #e0e5ec;
  border-radius: 20px;
  padding: 2rem;
  box-shadow:
    10px 10px 20px #a3b1c6,
    -10px -10px 20px #ffffff;
}

.neu-btn {
  background: #e0e5ec;
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  box-shadow:
    6px 6px 12px #a3b1c6,
    -6px -6px 12px #ffffff;
  transition: all 0.2s ease;
}

.neu-btn:active {
  box-shadow:
    inset 4px 4px 8px #a3b1c6,
    inset -4px -4px 8px #ffffff;
}
```

---

## 2. 毛玻璃 Glassmorphism

### 基础毛玻璃

```css
.glass {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

### 彩虹边框毛玻璃

```css
.glass-rainbow {
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(16px);
  border-radius: 24px;
}

.glass-rainbow::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  padding: 2px;
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
  -webkit-mask: linear-gradient(#fff 0 0) content-box,
                linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  z-index: -1;
}
```

### 深色背景毛玻璃

```css
.glass-dark {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}
```

---

## 3. 渐变卡片

### 线性渐变背景

```css
.gradient-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  color: white;
  padding: 2rem;
}
```

### 动态流动渐变

```css
@property --gradient-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

.animated-gradient {
  --gradient-angle: 0deg;
  background: linear-gradient(
    var(--gradient-angle),
    #ff6b6b, #feca57, #48dbfb, #ff9ff3, #ff6b6b
  );
  border-radius: 20px;
  animation: rotate-gradient 4s linear infinite;
}

@keyframes rotate-gradient {
  to { --gradient-angle: 360deg; }
}
```

### 纹理渐变叠加

```css
.texture-gradient {
  background:
    linear-gradient(135deg, rgba(74, 144, 217, 0.9), rgba(46, 204, 113, 0.9)),
    url('noise.svg');
  background-blend-mode: overlay;
}
```

---

## 4. 三维卡片

### 3D 倒角

```css
.card-3d {
  perspective: 1000px;
}

.card-3d-inner {
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.card-3d:hover .card-3d-inner {
  transform: rotateY(15deg) rotateX(10deg);
}

.card-3d-content {
  transform: translateZ(50px);
}
```

### 雪花卡片

```css
.snow-card {
  background: linear-gradient(135deg, #e0e5ec, #ffffff);
  border-radius: 20px;
  box-shadow:
    0 2px 4px rgba(0,0,0,0.05),
    0 8px 16px rgba(0,0,0,0.05),
    0 16px 32px rgba(0,0,0,0.05);
}
```

---

## 5. 边框艺术

### 追光边框

```css
.glow-border {
  position: relative;
  background: #0a0a0a;
  border-radius: 16px;
}

.glow-border::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4, #45b7d1);
  z-index: -1;
  animation: glow-rotate 3s linear infinite;
}

@keyframes glow-rotate {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(360deg); }
}
```

### 断点边框

```css
.dashed-border {
  background: white;
  border-radius: 12px;
  background-image: url("data:image/svg+xml,...");
  /* 或使用 mask */
  mask: linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
  mask-composite: exclude;
}
```

---

## 6. 实用模式

### 信息密度卡片

```css
.info-card {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  gap: 0.75rem;
}

.info-card .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-card .metric {
  font-size: 2rem;
  font-weight: bold;
}

.info-card .trend {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  background: rgba(46, 204, 113, 0.1);
  color: #2ecc71;
  font-size: 0.875rem;
}
```

### 媒体卡片

```css
.media-card {
  display: grid;
  grid-template-rows: auto 1fr;
  border-radius: 16px;
  overflow: hidden;
}

.media-card img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.media-card .content {
  padding: 1.25rem;
}
```

---

## 奇淫技巧

### 技巧一：CSS 变量主题切换

```css
:root {
  --card-bg: #ffffff;
  --card-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.card-theme {
  background: var(--card-bg);
  box-shadow: var(--card-shadow);
  transition: all 0.3s;
}

/* 切换到暗色主题 */
[data-theme="dark"] {
  --card-bg: #1a1a2e;
  --card-shadow: 0 4px 6px rgba(0,0,0,0.3);
}
```

### 技巧二：走马灯标题

```css
.marquee-card .title {
  white-space: nowrap;
  overflow: hidden;
}

.marquee-card:hover .title {
  animation: marquee 3s linear infinite;
}

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
```

### 技巧三：卡片堆叠效果

```css
.card-stack {
  position: relative;
}

.card-stack::before,
.card-stack::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: inherit;
  z-index: -1;
  transition: all 0.3s;
}

.card-stack::before {
  transform: translateY(8px) scale(0.95);
  opacity: 0.6;
}

.card-stack::after {
  transform: translateY(16px) scale(0.9);
  opacity: 0.3;
}

.card-stack:hover::before { transform: translateY(12px) scale(0.95); }
.card-stack:hover::after  { transform: translateY(24px) scale(0.9); }
```

### 技巧四：捡角卡片

```css
.corner-cut {
  clip-path: polygon(
    0 0,
    calc(100% - 20px) 0,
    100% 20px,
    100% 100%,
    20px 100%,
    0 calc(100% - 20px)
  );
}
```

### 技巧五：近似无限滚动

```css
.infinite-scroll {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.infinite-scroll::-webkit-scrollbar {
  display: none;
}

.infinite-scroll .card {
  scroll-snap-align: start;
  flex-shrink: 0;
  width: 280px;
}
```

---

## 参考资料

- [Neumorphism.io](https://neumorphism.io/)
- [Glassmorphism CSS Generator](https://hype4.academy/tools/glassmorphism-generator)
- [UIverse: Card Components](https://uiverse.io/cards)
