---
title: CSS 文字效果大全
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

# CSS 文字效果大全

[[toc]]

文字不仅是信息载体，更是视觉设计的重要元素。CSS 文字效果能让普通的文本变得生动、富有表现力。

---

## 1. 渐变文字

### 线性渐变文字

```css
.text-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### 彩虹渐变文字

```css
.text-rainbow {
  background: linear-gradient(
    90deg,
    #ff6b6b, #feca57, #48dbfb, #ff9ff3, #54a0ff, #ff6b6b
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: rainbow 3s linear infinite;
}

@keyframes rainbow {
  to { background-position: 200% center; }
}
```

### 动态流动渐变

```css
@property --gradient-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

.text-flow {
  --gradient-angle: 0deg;
  background: linear-gradient(
    var(--gradient-angle),
    #ff6b6b, #feca57, #48dbfb, #ff9ff3
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: flow-rotate 4s linear infinite;
}

@keyframes flow-rotate {
  to { --gradient-angle: 360deg; }
}
```

---

## 2. 文字阴影

### 基础阴影

```css
.text-shadow {
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.text-shadow-glow {
  text-shadow: 0 0 10px rgba(74, 144, 217, 0.5);
}
```

### 多层阴影 3D 效果

```css
.text-3d {
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

### 霓虹灯效果

```css
.text-neon {
  color: #fff;
  text-shadow:
    0 0 5px #fff,
    0 0 10px #fff,
    0 0 20px #4a90d9,
    0 0 40px #4a90d9,
    0 0 80px #4a90d9;
}

.text-neon-pink {
  color: #fff;
  text-shadow:
    0 0 5px #fff,
    0 0 10px #fff,
    0 0 20px #ff00de,
    0 0 40px #ff00de,
    0 0 80px #ff00de;
}
```

---

## 3. 描边文字

### 文字描边

```css
.text-stroke {
  -webkit-text-stroke: 2px #4a90d9;
  -webkit-text-fill-color: transparent;
}

.text-stroke-fill {
  -webkit-text-stroke: 1px #4a90d9;
  -webkit-text-fill-color: white;
}
```

### 多重描边（使用 text-shadow 模拟）

```css
.text-multi-stroke {
  color: white;
  text-shadow:
    2px 2px 0 #4a90d9,
    -2px -2px 0 #4a90d9,
    2px -2px 0 #4a90d9,
    -2px 2px 0 #4a90d9,
    4px 4px 0 #2ecc71;
}
```

---

## 4. 打字机效果

### 基础打字机

```css
.typewriter {
  overflow: hidden;
  border-right: 2px solid #4a90d9;
  white-space: nowrap;
  animation: typing 3s steps(30) forwards, blink 0.75s step-end infinite;
}

@keyframes typing {
  from { width: 0; }
  to { width: 100%; }
}

@keyframes blink {
  50% { border-color: transparent; }
}
```

### 多行打字机

```css
.typewriter-multi {
  overflow: hidden;
}

.typewriter-multi span {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  animation: typing 2s steps(20) forwards;
}

.typewriter-multi span:nth-child(2) {
  animation-delay: 2s;
  width: 0;
}

.typewriter-multi span:nth-child(3) {
  animation-delay: 4s;
  width: 0;
}
```

---

## 5. 文字动画

### 逐字出现

```css
.reveal-text span {
  display: inline-block;
  opacity: 0;
  transform: translateY(20px);
  animation: reveal 0.5s forwards;
}

.reveal-text span:nth-child(1) { animation-delay: 0s; }
.reveal-text span:nth-child(2) { animation-delay: 0.1s; }
.reveal-text span:nth-child(3) { animation-delay: 0.2s; }
/* ... */

@keyframes reveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 文字翻转

```css
.flip-text span {
  display: inline-block;
  transition: transform 0.3s;
}

.flip-text:hover span {
  transform: rotateX(360deg);
}

.flip-text span:nth-child(1) { transition-delay: 0s; }
.flip-text span:nth-child(2) { transition-delay: 0.05s; }
/* ... */
```

### 波浪文字

```css
.wave-text span {
  display: inline-block;
  animation: wave 1s ease-in-out infinite;
}

.wave-text span:nth-child(1) { animation-delay: 0s; }
.wave-text span:nth-child(2) { animation-delay: 0.1s; }
.wave-text span:nth-child(3) { animation-delay: 0.2s; }
/* ... */

@keyframes wave {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```

---

## 6. 特殊效果

### 文字裁剪图片

```css
.text-clip-image {
  background: url('image.jpg');
  background-size: cover;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
}
```

### 镂空文字

```css
.text-knockout {
  background: black;
  color: white;
  mix-blend-mode: multiply;
}

.text-knockout-container {
  background: url('background.jpg');
  background-size: cover;
}
```

### 故障艺术

```css
.glitch {
  position: relative;
  color: white;
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch::before {
  color: #ff00ff;
  animation: glitch-1 2s infinite linear alternate-reverse;
  clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
}

.glitch::after {
  color: #00ffff;
  animation: glitch-2 3s infinite linear alternate-reverse;
  clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
}

@keyframes glitch-1 {
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
  100% { transform: translate(0); }
}

@keyframes glitch-2 {
  0% { transform: translate(0); }
  20% { transform: translate(2px, -2px); }
  40% { transform: translate(2px, 2px); }
  60% { transform: translate(-2px, -2px); }
  80% { transform: translate(-2px, 2px); }
  100% { transform: translate(0); }
}
```

---

## 奇淫技巧

### 技巧一：文字路径排版

```css
.curved-text {
  width: 300px;
  height: 300px;
  /* 使用 SVG <textPath> 实现 */
}
```

### 技巧二：滚动驱动文字

```css
.scroll-text {
  animation: text-scale linear;
  animation-timeline: scroll(root);
}

@keyframes text-scale {
  from { font-size: 1rem; }
  to { font-size: 3rem; }
}
```

### 技巧三：文字遮罩动画

```css
.text-mask-animate {
  background: linear-gradient(
    90deg,
    transparent,
    white,
    transparent
  );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  animation: shine 3s infinite;
}

@keyframes shine {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
```

### 技巧四：响应式文字

```css
.fluid-text {
  font-size: clamp(1.5rem, 5vw + 1rem, 4rem);
}
```

### 技巧五：文字平衡

```css
.balanced-text {
  text-wrap: balance;
  /* 自动平衡多行文字的断行 */
}
```

---

## 参考资料

- [MDN text-shadow](https://developer.mozilla.org/zh-CN/docs/Web/CSS/text-shadow)
- [CSS-Tricks: Text Effects](https://css-tricks.com/creating-playful-effects-with-css-text-shadow/)
- [Typewolf: Typography Inspiration](https://www.typewolf.com/)
