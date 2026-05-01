---
title: CSS clip-path 高级技巧
date: 2025-04-29
tags:
  - CSS
  - clip-path
  - 视觉效果
categories:
  - 技术文档
  - 前端
  - CSS
  - 视觉表现
---

# CSS clip-path 高级技巧

[[toc]]

`clip-path` 允许你用任意几何形状裁剪元素，从简单的圆形、多边形到复杂的 SVG 路径和动画，是现代前端构建独特视觉效果的核心工具。

---

## 基本语法

```css
/* 基本几何形状 */
.clip-circle {
  clip-path: circle(50% at 50% 50%);
}

.clip-ellipse {
  clip-path: ellipse(25% 40% at 50% 50%);
}

.clip-inset {
  clip-path: inset(10px 20px 30px 40px round 10px);
}

.clip-polygon {
  clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
}
```

| 函数 | 说明 |
|------|------|
| `circle(r at x y)` | 圆形，r=半径，at=中心点 |
| `ellipse(rx ry at x y)` | 椭圆，rx/ry=半轴 |
| `inset(top right bottom left round rx ry)` | 内边距裁剪，支持圆角 |
| `polygon(x1 y1, x2 y2, ...)` | 多边形，至少3个点 |
| `path('M... L... Z')` | SVG 路径字符串 |
| `url(#svg-clip)` | 引用 SVG `<clipPath>` |

---

## 实用几何形状

### 常见形状快速参考

```css
/* 正三角 */
.triangle-up {
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}

.triangle-right {
  clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
}

/* 五角星 */
.star {
  clip-path: polygon(
    50% 0%, 61% 35%, 98% 35%,
    68% 57%, 79% 91%, 50% 70%,
    21% 91%, 32% 57%, 2% 35%,
    39% 35%
  );
}

/* 六边形 */
.hexagon {
  clip-path: polygon(
    25% 0%, 75% 0%, 100% 50%,
    75% 100%, 25% 100%, 0% 50%
  );
}

/* 形状箭头 */
.arrow {
  clip-path: polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%);
}

/* 对话气泡 */
.bubble {
  clip-path: polygon(
    0% 0%, 100% 0%, 100% 85%,
    60% 85%, 50% 100%, 40% 85%,
    0% 85%
  );
}
```

### CSS 函数生成多边形

```css
/* 使用 CSS 函数生成正 N 边形 */
.pentagon {
  --n: 5;
  clip-path: polygon(
    50% 0%,
    calc(50% + 50% * sin(72deg)) calc(50% - 50% * cos(72deg)),
    calc(50% + 50% * sin(144deg)) calc(50% - 50% * cos(144deg)),
    calc(50% + 50% * sin(216deg)) calc(50% - 50% * cos(216deg)),
    calc(50% + 50% * sin(288deg)) calc(50% - 50% * cos(288deg))
  );
}
```

---

## SVG clipPath 高级用法

### 基础 SVG 裁剪

```html
<svg width="0" height="0">
  <defs>
    <clipPath id="wave-clip" clipPathUnits="objectBoundingBox">
      <path d="M0,0.5 C0.3,0 0.7,1 1,0.5 L1,1 L0,1 Z" />
    </clipPath>
  </defs>
</svg>
```

```css
.wave-bottom {
  clip-path: url(#wave-clip);
}
```

> `clipPathUnits="objectBoundingBox"` 让坐标使用 0-1 的相对值，适配任意尺寸元素。

### 动态 SVG 裁剪（CSS 动画）

```html
<svg width="0" height="0">
  <defs>
    <clipPath id="morph-clip">
      <path id="morph-path" d="M0,0 L100,0 L100,100 L0,100 Z" />
    </clipPath>
  </defs>
</svg>
```

```css
.morphing {
  clip-path: url(#morph-clip);
}

#morph-path {
  animation: morph-shape 4s ease-in-out infinite;
}

@keyframes morph-shape {
  0%, 100% { d: path('M0,0 L100,0 L100,100 L0,100 Z'); }
  50% { d: path('M0,50 Q50,0 100,50 Q50,100 0,50 Z'); }
}
```

### 文字裁剪（Text Clip）

```html
<svg width="0" height="0">
  <defs>
    <clipPath id="text-clip">
      <text x="0" y="200" font-size="200" font-weight="bold" font-family="Arial">
        CSS
      </text>
    </clipPath>
  </defs>
</svg>
```

```css
.text-clip {
  clip-path: url(#text-clip);
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
}
```

---

## 与动画结合

### Reveal 动画

```css
.reveal-circle {
  clip-path: circle(0% at 50% 50%);
  animation: reveal 1s ease-out forwards;
}

@keyframes reveal {
  to { clip-path: circle(100% at 50% 50%); }
}
```

### 滑入剪切

```css
.slide-reveal {
  clip-path: inset(0 100% 0 0);
  animation: slide-in 0.8s cubic-bezier(0.77, 0, 0.175, 1) forwards;
}

@keyframes slide-in {
  to { clip-path: inset(0 0 0 0); }
}
```

### 滚动时渐显

```css
.scroll-reveal {
  animation: clip-grow linear;
  animation-timeline: view();
  animation-range: entry 0% contain 50%;
}

@keyframes clip-grow {
  from { clip-path: inset(50% 50% 50% 50%); }
  to   { clip-path: inset(0% 0% 0% 0%); }
}
```

---

## 实际应用场景

### 场景一：照片集成为多边形网格

```css
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.gallery-item:nth-child(odd) {
  clip-path: polygon(0 0, 100% 0, 85% 100%, 0 100%);
}

.gallery-item:nth-child(even) {
  clip-path: polygon(15% 0, 100% 0, 100% 100%, 0 100%);
}
```

### 场景二：轮播图切换

```css
.carousel-slide {
  clip-path: inset(0 0 0 0);
  transition: clip-path 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.carousel-slide.prev {
  clip-path: inset(0 100% 0 0);
}

.carousel-slide.next {
  clip-path: inset(0 0 0 100%);
}
```

### 场景三：按钮 Hover 效果

```css
.fancy-button {
  position: relative;
  overflow: hidden;
}

.fancy-button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: #4a90d9;
  clip-path: circle(0% at var(--mouse-x, 50%) var(--mouse-y, 50%));
  transition: clip-path 0.5s ease;
}

.fancy-button:hover::before {
  clip-path: circle(150% at var(--mouse-x, 50%) var(--mouse-y, 50%));
}
```

```js
document.querySelector('.fancy-button').addEventListener('mousemove', (e) => {
  const rect = e.target.getBoundingClientRect();
  e.target.style.setProperty('--mouse-x', ((e.clientX - rect.left) / rect.width * 100) + '%');
  e.target.style.setProperty('--mouse-y', ((e.clientY - rect.top) / rect.height * 100) + '%');
});
```

---

## clip-path vs mask vs overflow

| 特性 | clip-path | mask | overflow |
|------|-----------|------|----------|
| 裁剪方式 | 硬裁剪（alpha 通道） | 软裁剪（可渐变） | 矩形边界 |
| 支持渐变 | ❌ 不支持 | ✅ 支持 | ❌ |
| 影响布局 | 不影响 | 不影响 | 影响 |
| 交互 | 裁剪区域外事件被阻止 | 根据透明度决定 | 区域外被隐藏 |
| 配合动画 | ✅ 极佳 | ✅ 良好 | ❌ |

**使用建议**：需要硬边界裁剪时用 `clip-path`，需要渐变/透明效果时用 `mask`。

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| 基本几何函数 | 55+ | 9.1+ | 3.5+ | 79+ |
| `path()` 函数 | 88+ | 9.1+ | 3.5+ | 88+ |
| SVG clipPath 引用 | 55+ | 9.1+ | 3.5+ | 79+ |
| 动画支持 | 55+ | 9.1+ | 49+ | 79+ |

---

## 奇淫技巧

### 技巧一：CSS 变量动态裁剪

```css
@property --radius {
  syntax: '<percentage>';
  inherits: false;
  initial-value: 0%;
}

.morphing-circle {
  --radius: 0%;
  clip-path: circle(var(--radius) at 50% 50%);
  transition: --radius 0.5s ease;
}

.morphing-circle:hover {
  --radius: 100%;
}
```

### 技巧二：与 backdrop-filter 结合

```css
.glass-card {
  clip-path: polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

### 技巧三：双图层叠加

```css
.image-stack {
  position: relative;
}

.image-stack img:first-child {
  clip-path: polygon(0 0, 100% 0, 100% 100%, 30% 100%);
}

.image-stack img:last-child {
  position: absolute;
  top: 0; left: 0;
  clip-path: polygon(30% 0, 100% 0, 70% 100%, 0 100%);
  mix-blend-mode: multiply;
}
```

### 技巧四：鼠标指向变换

```css
.cursor-clip {
  --x: 50%;
  --y: 50%;
  clip-path: circle(20% at var(--x) var(--y));
  transition: clip-path 0.1s;
}

/* 移动鼠标时通过 JS 更新 --x --y */
```

### 技巧五：正确处理小数坐标

```css
/* 使用 calc 精确控制 */
.precise-clip {
  clip-path: polygon(
    calc(100% - 20px) 0,
    100% 20px,
    100% 100%,
    0 100%,
    0 0
  );
}
```

---

## 参考资料

- [MDN clip-path](https://developer.mozilla.org/zh-CN/docs/Web/CSS/clip-path)
- [CSS Masking Module Level 1](https://www.w3.org/TR/css-masking-1/)
- [Clippy 在线生成器](https://bennettfeely.com/clippy/)
- [Can I Use: clip-path](https://caniuse.com/css-clip-path)
