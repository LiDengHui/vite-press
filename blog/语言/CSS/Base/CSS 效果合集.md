---
title: CSS 效果合集
date: 2025-04-29
tags:
  - CSS
categories:
  - 技术文档
  - 前端
  - CSS
  - 基础入门
---

# CSS 效果合集

[[toc]]

本文收集了一系列实用的 CSS 视觉效果，从基础到高级，可直接复制使用。

## 文本效果

### 渐变文字

```css
.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: bold;
}
```

### 文字描边

```css
.stroke-text {
  -webkit-text-stroke: 2px #333;
  color: transparent;
}

/* 双层描边 */
.double-stroke {
  -webkit-text-stroke: 3px #333;
  text-shadow: 3px 3px 0 #666;
}
```

### 文字阴影

```css
/* 霓虹效果 */
.neon-text {
  color: #fff;
  text-shadow:
    0 0 5px #fff,
    0 0 10px #fff,
    0 0 20px #ff00de,
    0 0 40px #ff00de,
    0 0 80px #ff00de;
}

/* 3D 效果 */
.three-d-text {
  color: #333;
  text-shadow:
    1px 1px 0 #ccc,
    2px 2px 0 #ccc,
    3px 3px 0 #ccc,
    4px 4px 0 #ccc,
    5px 5px 0 #ccc;
}
```

### 打字机效果

```css
.typewriter {
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid;
  animation: typing 3s steps(20), blink 0.5s step-end infinite alternate;
}

@keyframes typing {
  from { width: 0; }
  to { width: 100%; }
}

@keyframes blink {
  50% { border-color: transparent; }
}
```

## 背景效果

### 动态渐变背景

```css
.animated-gradient {
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

### 网格背景

```css
.grid-bg {
  background-image:
    linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}
```

### 点阵背景

```css
.dot-bg {
  background-image: radial-gradient(circle, #ccc 1px, transparent 1px);
  background-size: 20px 20px;
}
```

## 卡片效果

### 悬停上浮

```css
.hover-lift {
  transition: transform 0.3s, box-shadow 0.3s;
}

.hover-lift:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}
```

### 玻璃拟态

```css
.glass {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
}
```

### 新拟态

```css
.neumorphism {
  background: #e0e5ec;
  border-radius: 20px;
  box-shadow:
    9px 9px 16px rgba(163,177,198,0.6),
    -9px -9px 16px rgba(255,255,255,0.5);
}

.neumorphism-inset {
  background: #e0e5ec;
  border-radius: 20px;
  box-shadow:
    inset 6px 6px 10px rgba(163,177,198,0.7),
    inset -6px -6px 10px rgba(255,255,255,0.8);
}
```

## 按钮效果

### 渐变边框

```css
.gradient-border {
  position: relative;
  background: white;
  border-radius: 8px;
}

.gradient-border::before {
  content: "";
  position: absolute;
  inset: -2px;
  border-radius: 10px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  z-index: -1;
}
```

### 涟漪效果

```css
.ripple {
  position: relative;
  overflow: hidden;
}

.ripple::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, rgba(255,255,255,0.4) 10%, transparent 10.01%);
  background-repeat: no-repeat;
  background-position: 50%;
  transform: scale(10);
  opacity: 0;
  transition: transform 0.5s, opacity 0.5s;
}

.ripple:active::after {
  transform: scale(0);
  opacity: 0.3;
  transition: 0s;
}
```

### 发光按钮

```css
.glow-btn {
  position: relative;
  background: #333;
  color: white;
  border: none;
  padding: 1rem 2rem;
}

.glow-btn::before {
  content: "";
  position: absolute;
  inset: -2px;
  background: linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000);
  background-size: 400%;
  z-index: -1;
  filter: blur(5px);
  animation: glow 20s linear infinite;
}

@keyframes glow {
  0% { background-position: 0 0; }
  50% { background-position: 400% 0; }
  100% { background-position: 0 0; }
}
```

## 加载动画

### 旋转加载器

```css
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### 脉冲加载器

```css
.pulse {
  width: 40px;
  height: 40px;
  background: #3498db;
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(0); opacity: 1; }
  50% { transform: scale(1); opacity: 0.5; }
}
```

### 骨架屏

```css
.skeleton {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

## 图片效果

### 悬停缩放

```css
.zoom-img {
  overflow: hidden;
}

.zoom-img img {
  transition: transform 0.5s;
}

.zoom-img:hover img {
  transform: scale(1.1);
}
```

### 图片遮罩

```css
.mask-image {
  -webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
}
```

### 图片滤镜

```css
.filter-image {
  filter: grayscale(100%);
  transition: filter 0.5s;
}

.filter-image:hover {
  filter: grayscale(0%);
}
```

## 形状效果

### 对话气泡

```css
.bubble {
  position: relative;
  background: #f0f0f0;
  padding: 1rem;
  border-radius: 10px;
}

.bubble::after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 20px;
  border-width: 10px 10px 0;
  border-style: solid;
  border-color: #f0f0f0 transparent;
}
```

### 箭头

```css
.arrow {
  width: 0;
  height: 0;
}

.arrow-up { border-left: 10px solid transparent; border-right: 10px solid transparent; border-bottom: 10px solid #333; }
.arrow-down { border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 10px solid #333; }
.arrow-left { border-top: 10px solid transparent; border-bottom: 10px solid transparent; border-right: 10px solid #333; }
.arrow-right { border-top: 10px solid transparent; border-bottom: 10px solid transparent; border-left: 10px solid #333; }
```

### 三角形

```css
.triangle {
  width: 0;
  height: 0;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  border-bottom: 100px solid #3498db;
}
```

## 滚动效果

### 平滑滚动

```css
html {
  scroll-behavior: smooth;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
```

### 滚动吸附

```css
.scroll-snap {
  scroll-snap-type: y mandatory;
  overflow-y: scroll;
  height: 100vh;
}

.scroll-snap > section {
  scroll-snap-align: start;
  height: 100vh;
}
```

## 其他效果

### 裁剪路径

```css
.clip-circle {
  clip-path: circle(50%);
}

.clip-polygon {
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}

.clip-wave {
  clip-path: polygon(
    0% 0%,
    100% 0%,
    100% 85%,
    50% 100%,
    0% 85%
  );
}
```

### 混合模式

```css
.blend-multiply {
  mix-blend-mode: multiply;
}

.blend-screen {
  mix-blend-mode: screen;
}

.blend-overlay {
  mix-blend-mode: overlay;
}
```

### 隔离

```css
.isolate {
  isolation: isolate;
}
```

## 奇淫技巧

### 技巧一：纯 CSS 切换

```css
.toggle {
  appearance: none;
  width: 50px;
  height: 26px;
  background: #ccc;
  border-radius: 13px;
  position: relative;
  cursor: pointer;
  transition: background 0.3s;
}

.toggle::after {
  content: "";
  position: absolute;
  width: 22px;
  height: 22px;
  background: white;
  border-radius: 50%;
  top: 2px;
  left: 2px;
  transition: transform 0.3s;
}

.toggle:checked {
  background: #4cd964;
}

.toggle:checked::after {
  transform: translateX(24px);
}
```

### 技巧二：CSS 计数器分页

```css
.pagination {
  counter-reset: page;
}

.pagination a::before {
  counter-increment: page;
  content: counter(page);
}
```

### 技巧三：内容为空提示

```css
.empty-state:empty::before {
  content: "暂无数据";
  color: #999;
  font-style: italic;
}
```

### 技巧四：自适应正方形

```css
.square {
  aspect-ratio: 1;
}

/* 或 */
.square-old {
  width: 100%;
  padding-bottom: 100%;
  position: relative;
}

.square-old > * {
  position: absolute;
  inset: 0;
}
```

### 技巧五：文本截断

```css
/* 单行 */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 多行 */
.line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

## 总结

本文收集的 CSS 效果涵盖：

1. **文本效果**：渐变、描边、阴影、打字机
2. **背景效果**：动态渐变、网格、点阵
3. **卡片效果**：悬停上浮、玻璃拟态、新拟态
4. **按钮效果**：渐变边框、涟漪、发光
5. **加载动画**：旋转、脉冲、骨架屏
6. **图片效果**：缩放、遮罩、滤镜
7. **形状效果**：气泡、箭头、三角形
8. **滚动效果**：平滑滚动、滚动吸附
9. **其他效果**：裁剪路径、混合模式、隔离

## 参考资源

- [CSS-Tricks: Almanac](https://css-tricks.com/almanac/)
- [CodePen: CSS Effects](https://codepen.io/tag/css-effects/)
- [UIverse: Open-Source UI Elements](https://uiverse.io/)
