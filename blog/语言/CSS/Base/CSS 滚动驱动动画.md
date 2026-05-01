---
title: CSS 滚动驱动动画 scroll-driven animations
date: 2025-04-29
tags:
  - CSS
  - 动画
  - 滚动
  - 现代特性
categories:
  - 技术文档
  - 前端
  - CSS
  - 现代特性
---

# CSS 滚动驱动动画 scroll-driven animations

[[toc]]

滚动驱动动画让元素动画与滚动容器的滚动位置直接绑定，无需 JavaScript 监听 `scroll` 事件，即可获得丝滑的视差、进度指示、元素入场等效果。

---

## 核心概念

CSS 滚动驱动动画使用 `animation-timeline` 属性替代传统的 `time` 时间线：

```css
.animated {
  animation: fade-in linear;
  animation-timeline: scroll();      /* 绑定到最近滚动容器 */
  animation-range: entry 0% exit 100%; /* 动画作用范围 */
}
```

| 属性 | 说明 |
|------|------|
| `animation-timeline` | 定义动画时间线来源 |
| `animation-range` | 限制动画在滚动范围的哪一段执行 |
| `scroll()` | 函数，引用滚动容器 |
| `view()` | 函数，引用元素在视口内的可见性 |

---

## 时间线类型

### 1. Scroll Timeline（滚动进度）

动画与滚动容器的滚动进度绑定：

```css
/* 绑定到根元素（页面）滚动 */
.progress-bar {
  animation: grow-width linear;
  animation-timeline: scroll(root);
  animation-range: 0% 100%;
}

@keyframes grow-width {
  from { width: 0%; }
  to   { width: 100%; }
}
```

```css
/* 绑定到指定容器的滚动 */
.sidebar {
  overflow-y: auto;
}

.sidebar-content {
  animation: parallax linear;
  animation-timeline: scroll(nearest); /* 或 scroll(self) */
}
```

### 2. View Timeline（视口可见性）

动画与元素在视口内的可见进度绑定：

```css
/* 元素进入视口时触发动画 */
.reveal {
  animation: slide-up ease-out;
  animation-timeline: view();
  animation-range: entry 0% entry 50%; /* 进入视口的前 50% 执行 */
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(50px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

---

## animation-range 详解

`animation-range` 精确控制动画在滚动/视口时间线的哪一段执行：

```css
/* 语法：animation-range: <start> <end> */

/* 视口相关关键字 */
animation-range: entry 0% entry 100%;      /* 完全进入视口期间 */
animation-range: entry 0% cover 50%;       /* 进入 → 覆盖中心 */
animation-range: cover 25% cover 75%;      /* 覆盖中心区域 */
animation-range: exit 0% exit 100%;        /* 离开视口期间 */

/* 简写 */
animation-range: entry;                    /* entry 0% → entry 100% */
animation-range: exit-crossing;            /* 离开交叉区域 */
animation-range: contain;                  /* 完全在视口内 */
```

| 关键字 | 含义 |
|--------|------|
| `entry` | 元素开始进入视口 → 完全进入 |
| `exit` | 元素开始离开视口 → 完全离开 |
| `cover` | 元素顶端进入视口 → 底端离开视口 |
| `contain` | 元素完全在视口内 |
| `entry-crossing` | 进入交叉阶段 |
| `exit-crossing` | 离开交叉阶段 |

---

## 完整实例

### 实例一：阅读进度条

```css
.reading-progress {
  position: fixed;
  top: 0; left: 0;
  height: 4px;
  background: linear-gradient(90deg, #4a90d9, #2ecc71);
  z-index: 9999;

  animation: progress linear;
  animation-timeline: scroll(root block);
}

@keyframes progress {
  from { width: 0%; }
  to   { width: 100%; }
}
```

### 实例二：视差滚动

```css
.parallax-bg {
  animation: parallax linear;
  animation-timeline: scroll(root);
}

.parallax-fg {
  animation: parallax-fast linear;
  animation-timeline: scroll(root);
}

@keyframes parallax {
  to { transform: translateY(100px); }
}

@keyframes parallax-fast {
  to { transform: translateY(-150px); }
}
```

### 实例三：图片画廊逐个揭示

```css
.gallery-item {
  opacity: 0.3;
  transform: scale(0.9);

  animation: reveal linear both;
  animation-timeline: view();
  animation-range: entry 25% cover 50%;
}

@keyframes reveal {
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

### 实例四：横向滚动时间轴

```css
.timeline {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}

.timeline-item {
  scroll-snap-align: center;
  flex-shrink: 0;

  animation: highlight linear;
  animation-timeline: view(inline); /* 横向视口时间线 */
  animation-range: entry 40% exit 60%;
}

@keyframes highlight {
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
}
```

---

## 与 @scroll-timeline 的区别

> 注意：早期 Chrome 使用 `@scroll-timeline` 规则，现已被 `animation-timeline` 属性替代。

```css
/* ❌ 旧语法（已废弃） */
@scroll-timeline progress {
  source: auto;
  orientation: block;
}

/* ✅ 新语法 */
animation-timeline: scroll(root block);
```

---

## 浏览器兼容性

| 浏览器 | 版本 |
|--------|------|
| Chrome / Edge | 115+ ✅ |
| Safari | 18+ ✅ |
| Firefox | 开发中 |

---

## 奇淫技巧

### 技巧一：纯 CSS 滚动文字高亮

```css
.paragraph span {
  animation: word-highlight linear both;
  animation-timeline: view();
  animation-range: entry 50% cover 80%;
}

@keyframes word-highlight {
  to { color: #4a90d9; font-weight: 600; }
}
```

### 技巧二：SVG 路径绘制（滚动触发）

```css
.path-draw {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;

  animation: draw linear;
  animation-timeline: scroll(nearest);
}

@keyframes draw {
  to { stroke-dashoffset: 0; }
}
```

### 技巧三：3D 卡片翻转（滚动控制）

```css
.card-3d {
  transform-style: preserve-3d;
  animation: flip linear;
  animation-timeline: view();
  animation-range: entry 0% contain 100%;
}

@keyframes flip {
  from { transform: rotateY(-90deg); }
  to   { transform: rotateY(0deg); }
}
```

### 技巧四：横向滚动与纵向滚动联动

```css
/* 页面纵向滚动时，控制横向滚动容器 */
.horizontal-scroller {
  display: flex;
  animation: scroll-x linear;
  animation-timeline: scroll(root block);
}

@keyframes scroll-x {
  to { transform: translateX(calc(-100% + 100vw)); }
}
```

### 技巧五：多阶段复杂动画

```css
.complex-reveal {
  animation: multi-stage linear both;
  animation-timeline: view();
  animation-range: entry 0% exit 100%;
}

@keyframes multi-stage {
  0%   { opacity: 0; transform: translateY(100px) rotate(-5deg); }
  30%  { opacity: 1; transform: translateY(0) rotate(0); }     /* 进入完成 */
  70%  { opacity: 1; transform: scale(1); }                    /* 停留阶段 */
  100% { opacity: 0; transform: scale(0.8); }                  /* 离开 */
}
```

---

## 性能优化

1. **使用 `transform` 和 `opacity`** — 避免触发布局/绘制
2. **减少 `animation-timeline` 数量** — 每个时间线都有计算开销
3. **`contain: layout`** — 隔离动画影响范围
4. **渐进增强** — 为不支持浏览器提供静态降级

---

## 参考资料

- [MDN Scroll-driven animations](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-timeline)
- [Chrome for Developers: Scroll-driven animations](https://developer.chrome.com/docs/css-ui/scroll-driven-animations)
- [Can I Use: Scroll-driven Animations](https://caniuse.com/mdn-css_properties_animation-timeline)
