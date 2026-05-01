---
title: CSS 故障艺术效果
date: 2025-04-29
tags:
  - CSS
categories:
  - 技术文档
  - 前端
  - CSS
  - 交互与动画
---

# CSS 故障艺术效果

[[toc]]

故障艺术（Glitch Art）是一种模仿数字信号故障、数据损坏效果的视觉风格。通过 CSS 可以轻松实现各种故障效果，如 RGB 分离、扫描线、错位、噪点等。

---

## RGB 分离效果

### 基础分离

```css
.glitch-text {
  position: relative;
  color: white;
  font-size: 4rem;
  font-weight: bold;
}

.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch-text::before {
  color: #ff0000;
  clip-path: inset(0 0 50% 0);
  transform: translate(-2px, -2px);
}

.glitch-text::after {
  color: #00ffff;
  clip-path: inset(50% 0 0 0);
  transform: translate(2px, 2px);
}
```

### 动态故障动画

```css
.glitch-animated {
  position: relative;
  color: white;
  font-size: 4rem;
}

.glitch-animated::before,
.glitch-animated::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
}

.glitch-animated::before {
  color: #ff0000;
  animation: glitch-1 0.3s infinite linear alternate-reverse;
}

.glitch-animated::after {
  color: #00ffff;
  animation: glitch-2 0.3s infinite linear alternate-reverse;
}

@keyframes glitch-1 {
  0% { clip-path: inset(20% 0 60% 0); transform: translate(-3px, 0); }
  20% { clip-path: inset(60% 0 10% 0); transform: translate(3px, 0); }
  40% { clip-path: inset(40% 0 40% 0); transform: translate(-3px, 0); }
  60% { clip-path: inset(80% 0 5% 0); transform: translate(3px, 0); }
  80% { clip-path: inset(10% 0 70% 0); transform: translate(-3px, 0); }
  100% { clip-path: inset(30% 0 30% 0); transform: translate(3px, 0); }
}

@keyframes glitch-2 {
  0% { clip-path: inset(60% 0 20% 0); transform: translate(3px, 0); }
  20% { clip-path: inset(10% 0 60% 0); transform: translate(-3px, 0); }
  40% { clip-path: inset(40% 0 40% 0); transform: translate(3px, 0); }
  60% { clip-path: inset(5% 0 80% 0); transform: translate(-3px, 0); }
  80% { clip-path: inset(70% 0 10% 0); transform: translate(3px, 0); }
  100% { clip-path: inset(30% 0 30% 0); transform: translate(-3px, 0); }
}
```

---

## 扫描线效果

### 基础扫描线

```css
.scanlines {
  position: relative;
}

.scanlines::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.3) 2px,
    rgba(0, 0, 0, 0.3) 4px
  );
  pointer-events: none;
}
```

### 动态扫描线

```css
.scanline-active {
  position: relative;
  overflow: hidden;
}

.scanline-active::after {
  content: '';
  position: absolute;
  top: -100%;
  left: 0;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  animation: scan 3s linear infinite;
}

@keyframes scan {
  0% { top: -100%; }
  100% { top: 100%; }
}
```

---

## 噪点效果

### SVG 噪点滤镜

```css
.noise {
  position: relative;
}

.noise::after {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.15;
  pointer-events: none;
  mix-blend-mode: overlay;
}
```

### 动画噪点

```css
.animated-noise {
  position: relative;
}

.animated-noise::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,..."); /* 上面的 SVG */
  opacity: 0.1;
  pointer-events: none;
  animation: noise 0.5s steps(5) infinite;
}

@keyframes noise {
  0%, 100% { transform: translate(0, 0); }
  10% { transform: translate(-5%, -5%); }
  20% { transform: translate(-10%, 5%); }
  30% { transform: translate(5%, -10%); }
  40% { transform: translate(-5%, 15%); }
  50% { transform: translate(-10%, 5%); }
  60% { transform: translate(15%, 0); }
  70% { transform: translate(0, 10%); }
  80% { transform: translate(-15%, 0); }
  90% { transform: translate(10%, 5%); }
}
```

---

## 错位效果

```css
.glitch-shift {
  position: relative;
}

.glitch-shift:hover {
  animation: shift 0.2s infinite;
}

@keyframes shift {
  0% { transform: translate(0); }
  20% { transform: translate(-5px, 3px); }
  40% { transform: translate(5px, -3px); }
  60% { transform: translate(-3px, 5px); }
  80% { transform: translate(3px, -5px); }
  100% { transform: translate(0); }
}
```

---

## 信号干扰效果

```css
.interference {
  position: relative;
}

.interference::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    90deg,
    transparent,
    transparent 50%,
    rgba(255, 0, 0, 0.1) 50%,
    rgba(255, 0, 0, 0.1) 100%
  );
  background-size: 4px 100%;
  animation: interference 0.1s infinite;
  pointer-events: none;
}

@keyframes interference {
  0% { transform: translateX(0); }
  100% { transform: translateX(4px); }
}
```

---

## 完整故障图片效果

```html
<div class="glitch-image">
  <img src="photo.jpg" alt="">
</div>
```

```css
.glitch-image {
  position: relative;
  display: inline-block;
}

.glitch-image img {
  display: block;
}

.glitch-image::before,
.glitch-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url(photo.jpg);
  background-size: cover;
}

.glitch-image::before {
  mix-blend-mode: multiply;
  background-color: #ff0000;
  transform: translate(-5px, 0);
  clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
  animation: glitch-img-1 2s infinite linear alternate;
}

.glitch-image::after {
  mix-blend-mode: multiply;
  background-color: #00ffff;
  transform: translate(5px, 0);
  clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
  animation: glitch-img-2 2s infinite linear alternate;
}

@keyframes glitch-img-1 {
  0% { clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%); }
  25% { clip-path: polygon(0 25%, 100% 25%, 100% 60%, 0 60%); }
  50% { clip-path: polygon(0 50%, 100% 50%, 100% 85%, 0 85%); }
  75% { clip-path: polygon(0 15%, 100% 15%, 100% 50%, 0 50%); }
  100% { clip-path: polygon(0 70%, 100% 70%, 100% 100%, 0 100%); }
}

@keyframes glitch-img-2 {
  0% { clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%); }
  25% { clip-path: polygon(0 10%, 100% 10%, 100% 45%, 0 45%); }
  50% { clip-path: polygon(0 40%, 100% 40%, 100% 75%, 0 75%); }
  75% { clip-path: polygon(0 80%, 100% 80%, 100% 100%, 0 100%); }
  100% { clip-path: polygon(0 20%, 100% 20%, 100% 55%, 0 55%); }
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| clip-path | 55+ | 9.1+ | 3.5+ | 79+ |
| mix-blend-mode | 41+ | 8+ | 32+ | 79+ |
| filter | 53+ | 9.1+ | 35+ | 79+ |

---

## 奇淫技巧

### 技巧一：纯 CSS 故障按钮

```css
.glitch-btn {
  position: relative;
  padding: 16px 32px;
  background: #000;
  color: #fff;
  border: 2px solid #fff;
  font-size: 1.2rem;
  cursor: pointer;
  overflow: hidden;
}

.glitch-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  transition: left 0.5s;
}

.glitch-btn:hover::before {
  left: 100%;
}

.glitch-btn:hover {
  animation: glitch-shake 0.3s infinite;
  text-shadow: 2px 0 #ff0000, -2px 0 #00ffff;
}

@keyframes glitch-shake {
  0%, 100% { transform: translate(0); }
  25% { transform: translate(-2px, 2px); }
  50% { transform: translate(2px, -2px); }
  75% { transform: translate(-2px, -2px); }
}
```

### 技巧二：终端打字效果

```css
.typewriter {
  overflow: hidden;
  border-right: 2px solid #00ff00;
  white-space: nowrap;
  animation: typing 3s steps(40) forwards, blink 0.75s step-end infinite;
}

@keyframes typing {
  from { width: 0; }
  to { width: 100%; }
}

@keyframes blink {
  50% { border-color: transparent; }
}
```

### 技巧三：复古 CRT 显示器效果

```css
.crt {
  position: relative;
  background: #000;
  color: #0f0;
  font-family: 'Courier New', monospace;
}

.crt::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 60%, rgba(0, 0, 0, 0.4) 100%);
  pointer-events: none;
}

.crt::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 255, 0, 0.03) 2px,
    rgba(0, 255, 0, 0.03) 4px
  );
  pointer-events: none;
}
```

### 技巧四：数据损坏进度条

```css
.glitch-progress {
  width: 100%;
  height: 20px;
  background: #111;
  position: relative;
  overflow: hidden;
}

.glitch-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #ff0000, #00ffff);
  width: var(--progress, 0%);
  position: relative;
}

.glitch-progress-bar::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 20px;
  background: inherit;
  animation: glitch-bar 0.1s infinite;
}

@keyframes glitch-bar {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(5px); }
}
```

### 技巧五：VHS 录像带效果

```css
.vhs {
  position: relative;
  filter: contrast(1.2) saturate(0.8);
}

.vhs::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(255, 0, 0, 0.1) 0%,
    transparent 33%,
    transparent 66%,
    rgba(0, 255, 255, 0.1) 100%
  );
  pointer-events: none;
  animation: vhs-track 0.1s infinite;
}

@keyframes vhs-track {
  0% { transform: translateY(0); }
  100% { transform: translateY(4px); }
}
```

---

## 参考资料

- [CSS-Tricks: Glitch Effect](https://css-tricks.com/glitch-effect-text-images-svg/)
- [CodePen: Glitch Art Collection](https://codepen.io/tag/glitch)
- [MDN clip-path](https://developer.mozilla.org/zh-CN/docs/Web/CSS/clip-path)
