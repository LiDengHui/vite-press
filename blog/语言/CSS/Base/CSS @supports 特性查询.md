---
title: CSS @supports 特性查询
date: 2025-04-29
tags:
  - CSS
  - "@supports"
  - 特性查询
  - 现代特性
categories:
  - 技术文档
  - 前端
  - CSS
  - 现代特性
---

# CSS @supports 特性查询

[[toc]]

`@supports` 允许在 CSS 中检测浏览器是否支持某个 CSS 属性或值。它是实现**渐进增强**（Progressive Enhancement）和**优雅降级**（Graceful Degradation）的核心工具。

---

## 基础语法

### 检测属性支持

```css
@supports (display: grid) {
  .layout {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 如果不支持 Grid，回退到 float */
@supports not (display: grid) {
  .layout {
    float: left;
    width: 33.33%;
  }
}
```

### 检测多个条件

```css
/* AND 条件 */
@supports (display: grid) and (gap: 1rem) {
  .card-grid {
    display: grid;
    gap: 1rem;
  }
}

/* OR 条件 */
@supports (backdrop-filter: blur(10px)) or (-webkit-backdrop-filter: blur(10px)) {
  .glass {
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
}

/* 复杂组合 */
@supports ((display: flex) and (gap: 1rem)) or (display: grid) {
  .modern-layout {
    display: grid;
    gap: 1rem;
  }
}
```

---

## 实际应用场景

### 毛玻璃效果降级

```css
.glass-panel {
  background: rgba(255, 255, 255, 0.8);
}

@supports (backdrop-filter: blur(10px)) {
  .glass-panel {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
  }
}
```

### Container Queries 降级

```css
@supports (container-type: inline-size) {
  .card-container {
    container-type: inline-size;
  }

  @container (width > 400px) {
    .card {
      display: flex;
      gap: 1rem;
    }
  }
}

@supports not (container-type: inline-size) {
  /* 回退到媒体查询 */
  @media (min-width: 400px) {
    .card {
      display: flex;
      gap: 1rem;
    }
  }
}
```

### 亚像素渲染降级

```css
.pixel-art {
  image-rendering: auto;
}

@supports (image-rendering: pixelated) {
  .pixel-art {
    image-rendering: pixelated;
  }
}
```

### Scroll-Driven Animations 降级

```css
.parallax-element {
  transform: translateY(0);
}

@supports (animation-timeline: scroll()) {
  .parallax-element {
    animation: parallax linear;
    animation-timeline: scroll();
  }

  @keyframes parallax {
    from { transform: translateY(0); }
    to { transform: translateY(-100px); }
  }
}
```

---

## 检测特殊语法

### 检测选择器支持

```css
@supports selector(:has(a)) {
  .card:has(.badge) {
    border-color: gold;
  }
}
```

### 检测 @supports 本身

```css
/* 在极老浏览器中，如果 @supports 不被支持，内部样式不会生效 */
@supports not (@supports (display: grid)) {
  /* 这段代码几乎不会触发，仅用于演示 */
}
```

---

## 与 JavaScript 结合

### CSS.supports() API

```js
// 检测单个属性
if (CSS.supports('display', 'grid')) {
  document.body.classList.add('supports-grid');
}

// 检测复杂表达式
if (CSS.supports('(display: grid) and (gap: 1rem)')) {
  // 启用高级布局
}

// 检测选择器
if (CSS.supports('selector(:has(a))')) {
  document.body.classList.add('supports-has');
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| @supports | 28+ | 9+ | 22+ | 12+ |
| @supports not | 28+ | 9+ | 22+ | 12+ |
| @supports selector() | 83+ | 14.1+ | 82+ | 83+ |
| CSS.supports() API | 28+ | 9+ | 22+ | 12+ |

---

## 奇淫技巧

### 技巧一：检测暗色模式支持

```css
@media (prefers-color-scheme: dark) {
  @supports (color-scheme: dark) {
    :root {
      color-scheme: dark;
    }
  }
}
```

### 技巧二：检测动画最小化偏好

```css
@supports (prefers-reduced-motion: reduce) {
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
}
```

### 技巧三：检测视图过渡支持

```css
@supports (view-transition-name: header) {
  .page-header {
    view-transition-name: header;
  }

  ::view-transition-old(header) {
    animation: slide-out 0.3s;
  }
}
```

### 技巧四：检测 @property 支持

```css
@supports (@property --x) {
  @property --x {
    syntax: '<length>';
    inherits: false;
    initial-value: 0px;
  }

  .animated-border {
    --x: 0px;
    background: linear-gradient(90deg, #ff6b6b var(--x), #4ecdc4 var(--x));
    animation: move-gradient 2s infinite;
  }
}
```

### 技巧五：检测 OKLCH 颜色支持

```css
.color-demo {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
}

@supports (color: oklch(70% 0.2 200)) {
  .color-demo {
    background: linear-gradient(45deg, oklch(70% 0.2 30), oklch(70% 0.2 200));
  }
}
```

---

## 参考资料

- [MDN @supports](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@supports)
- [MDN CSS.supports()](https://developer.mozilla.org/zh-CN/docs/Web/API/CSS/supports)
- [Can I Use: CSS Supports](https://caniuse.com/css-featurequeries)
