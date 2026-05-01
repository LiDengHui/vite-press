---
title: CSS 渐变高级技巧
date: 2025-04-29
tags:
  - CSS
  - 渐变
categories:
  - 技术文档
  - 前端
  - CSS
  - 视觉表现
---

# CSS 渐变高级技巧

[[toc]]

CSS 渐变（Gradient）远不止简单的两种颜色过渡。掌握高级渐变技巧，可以纯 CSS 实现复杂的纹理、图案、光影和动画效果。

---

## 渐变类型回顾

### 线性渐变

```css
.linear {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
}
```

### 径向渐变

```css
.radial {
  background: radial-gradient(circle at 30% 30%, #fff, #333);
}
```

### 圆锥渐变

```css
.conic {
  background: conic-gradient(from 0deg, #ff6b6b, #4ecdc4, #ffe66d, #ff6b6b);
}
```

### 重复渐变

```css
.repeating {
  background: repeating-linear-gradient(
    45deg,
    #ff6b6b,
    #ff6b6b 10px,
    #4ecdc4 10px,
    #4ecdc4 20px
  );
}
```

---

## 多色停靠点

### 精确控制色标位置

```css
.precise-gradient {
  background: linear-gradient(
    90deg,
    #ff6b6b 0%,
    #ff6b6b 20%,
    #4ecdc4 20%,
    #4ecdc4 40%,
    #ffe66d 40%,
    #ffe66d 60%,
    #a8e6cf 60%,
    #a8e6cf 80%,
    #ff8b94 80%
  );
}
```

### 硬切过渡（无渐变）

```css
.hard-stop {
  background: linear-gradient(
    to right,
    #ff6b6b 50%,
    #4ecdc4 50%
  );
}
```

---

## 复杂图案

### 条纹图案

```css
.stripes {
  background: repeating-linear-gradient(
    45deg,
    #606dbc,
    #606dbc 10px,
    #465298 10px,
    #465298 20px
  );
}
```

### 格子图案

```css
.grid-pattern {
  background:
    repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(0,0,0,0.1) 50px, rgba(0,0,0,0.1) 51px),
    repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(0,0,0,0.1) 50px, rgba(0,0,0,0.1) 51px);
}
```

### 波点图案

```css
.polka-dot {
  background:
    radial-gradient(circle, #ff6b6b 20%, transparent 20%),
    radial-gradient(circle, #ff6b6b 20%, transparent 20%) 25px 25px;
  background-color: #ffe66d;
  background-size: 50px 50px;
}
```

### 棋盘图案

```css
.checkerboard {
  background:
    conic-gradient(#eee 25%, white 0 50%, #eee 0 75%, white 0);
  background-size: 40px 40px;
}
```

---

## 光影效果

### 金属光泽

```css
.metallic {
  background: linear-gradient(
    135deg,
    #e0e0e0 0%,
    #f5f5f5 25%,
    #c0c0c0 50%,
    #f5f5f5 75%,
    #e0e0e0 100%
  );
}
```

### 按钮光泽

```css
.shiny-button {
  background: linear-gradient(
    180deg,
    rgba(255,255,255,0.3) 0%,
    transparent 50%,
    rgba(0,0,0,0.1) 100%
  );
}
```

### 霓虹光晕

```css
.neon {
  background: radial-gradient(
    ellipse at center,
    rgba(255,0,255,0.8) 0%,
    rgba(0,255,255,0.4) 40%,
    transparent 70%
  );
}
```

---

## 锥形渐变高级应用

### 色轮

```css
.color-wheel {
  background: conic-gradient(
    red,
    yellow,
    lime,
    cyan,
    blue,
    magenta,
    red
  );
  border-radius: 50%;
}
```

### 饼图

```css
.pie-chart {
  background: conic-gradient(
    #ff6b6b 0% 30%,
    #4ecdc4 30% 60%,
    #ffe66d 60% 85%,
    #a8e6cf 85% 100%
  );
  border-radius: 50%;
}
```

### 锥形条纹

```css
.conic-stripes {
  background: repeating-conic-gradient(
    from 0deg,
    #fff 0deg 10deg,
    #000 10deg 20deg
  );
}
```

---

## 渐变动画

### 动态渐变背景

```css
@keyframes gradient-flow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.flowing-bg {
  background: linear-gradient(
    -45deg,
    #ee7752,
    #e73c7e,
    #23a6d5,
    #23d5ab
  );
  background-size: 400% 400%;
  animation: gradient-flow 15s ease infinite;
}
```

### 渐变边框动画

```css
@keyframes border-rotate {
  0% { --angle: 0deg; }
  100% { --angle: 360deg; }
}

.animated-border {
  background: linear-gradient(var(--angle), #ff6b6b, #4ecdc4, #ffe66d, #ff6b6b);
  animation: border-rotate 3s linear infinite;
}
```

### 呼吸光效

```css
@keyframes breathe {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.breathing-glow {
  background: radial-gradient(circle, rgba(255,107,107,0.8), transparent);
  animation: breathe 3s ease-in-out infinite;
}
```

---

## 与其他特性结合

### 渐变 + mask

```css
.gradient-mask {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  mask-image: radial-gradient(circle, black 50%, transparent 100%);
  -webkit-mask-image: radial-gradient(circle, black 50%, transparent 100%);
}
```

### 渐变 + clip-path

```css
.gradient-clipped {
  background: conic-gradient(from 0deg, #ff6b6b, #4ecdc4, #ffe66d, #ff6b6b);
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}
```

### 渐变 + 混合模式

```css
.gradient-blend {
  background:
    linear-gradient(45deg, #ff6b6b, #4ecdc4),
    url('texture.jpg');
  background-blend-mode: overlay;
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| linear-gradient | 10+ | 5.1+ | 3.6+ | 12+ |
| radial-gradient | 10+ | 5.1+ | 3.6+ | 12+ |
| conic-gradient | 69+ | 12.1+ | 75+ | 79+ |
| repeating-* | 10+ | 5.1+ | 3.6+ | 12+ |
| 多色停靠点 | 10+ | 5.1+ | 3.6+ | 12+ |

---

## 奇淫技巧

### 技巧一：CSS 渐变进度条

```css
.progress-bar {
  height: 20px;
  background: linear-gradient(
    90deg,
    #4ecdc4 var(--progress, 0%),
    #e0e0e0 var(--progress, 0%)
  );
  border-radius: 10px;
}
```

### 技巧二：渐变文字描边

```css
.gradient-stroke {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-stroke: 2px transparent;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}
```

### 技巧三：渐变阴影

```css
.gradient-shadow {
  position: relative;
}

.gradient-shadow::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  filter: blur(20px);
  opacity: 0.5;
}
```

### 技巧四：渐变按钮悬停

```css
.gradient-btn {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  background-size: 200% 200%;
  transition: background-position 0.5s;
}

.gradient-btn:hover {
  background-position: 100% 0;
}
```

### 技巧五：渐变加载动画

```css
.loading-bar {
  height: 4px;
  background: linear-gradient(
    90deg,
    transparent,
    #4ecdc4,
    transparent
  );
  background-size: 200% 100%;
  animation: loading-slide 1.5s infinite;
}

@keyframes loading-slide {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

---

## 参考资料

- [MDN gradient](https://developer.mozilla.org/zh-CN/docs/Web/CSS/gradient)
- [CSS-Tricks: A Complete Guide to CSS Gradients](https://css-tricks.com/a-complete-guide-to-css-gradients/)
- [CSS Patterns Gallery](https://projects.verou.me/css3patterns/)
