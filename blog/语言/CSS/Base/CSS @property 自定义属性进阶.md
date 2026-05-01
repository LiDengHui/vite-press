---
title: CSS @property 自定义属性进阶
date: 2025-04-29
tags:
  - CSS
  - 自定义属性
  - "@property"
  - 现代特性
categories:
  - 技术文档
  - 前端
  - CSS
  - 现代特性
---

# CSS @property 自定义属性进阶

[[toc]]

`@property` 是 CSS Houdini 的一部分，它让你能为 CSS 自定义属性（CSS Variables）**声明类型**、**初始值**和**继承行为**。这解锁了传统变量无法过渡的痛点，如颜色渐变、角度动画、数字变化等。

---

## 基本语法

```css
@property --my-color {
  syntax: '<color>';        /* 变量类型 */
  inherits: false;          /* 是否继承 */
  initial-value: #000000;   /* 初始值 */
}
```

### 类型语法（syntax）

| 类型 | 说明 | 示例 |
|------|------|------|
| `<color>` | 颜色 | `#ff0000`, `rgb(0,0,0)`, `oklch(...)` |
| `<length>` | 长度 | `10px`, `2rem`, `50%` |
| `<percentage>` | 百分比 | `50%` |
| `<number>` | 数字 | `0`, `1.5`, `-10` |
| `<angle>` | 角度 | `45deg`, `0.5turn`, `1rad` |
| `<time>` | 时间 | `0.5s`, `200ms` |
| `<transform-function>` | 变换函数 | `rotate(45deg)` |
| `<custom-ident>` | 自定义标识符 | `auto`, `start`, `grid` |
| `<image>` | 图像 | `url(...)`, `linear-gradient(...)` |
| `*` | 任意值 | 通配符 |

### 复合类型

```css
@property --border-radius {
  syntax: '<length> | <percentage>';  /* 长度或百分比 */
  inherits: false;
  initial-value: 0px;
}

@property --gradient-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}
```

---

## 解锁过渡动画

### 案例一：颜色渐变

传统变量无法过渡是因为浏览器不知道值是颜色：

```css
/* ❌ 无效 —— 突变 */
.element {
  --color: red;
  background: var(--color);
  transition: --color 1s; /* 不起作用 */
}
.element:hover { --color: blue; }
```

```css
/* ✅ 正确 —— 声明类型后可过渡 */
@property --color {
  syntax: '<color>';
  inherits: false;
  initial-value: red;
}

.element {
  --color: red;
  background: var(--color);
  transition: --color 1s ease;
}

.element:hover {
  --color: blue;
}
```

### 案例二：渐变角度动画

```css
@property --gradient-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

.animated-gradient {
  background: linear-gradient(var(--gradient-angle), #ff6b6b, #4ecdc4);
  animation: rotate-gradient 3s linear infinite;
}

@keyframes rotate-gradient {
  to { --gradient-angle: 360deg; }
}
```

### 案例三：数字计数器

```css
@property --num {
  syntax: '<integer>';
  inherits: false;
  initial-value: 0;
}

.counter {
  --num: 0;
  animation: count-up 2s ease-out forwards;
}

.counter::after {
  content: counter(num);
  counter-reset: num var(--num);
}

@keyframes count-up {
  to { --num: 100; }
}
```

### 案例四：宽度过渡

```css
@property --width {
  syntax: '<percentage>';
  inherits: false;
  initial-value: 0%;
}

.progress-bar {
  --width: 0%;
  width: var(--width);
  transition: --width 0.5s ease;
}

.progress-bar[data-value="75"] {
  --width: 75%;
}
```

---

## 与其他 CSS 特性联动

### 与 oklch 颜色系统

```css
@property --hue {
  syntax: '<number>';
  inherits: true;
  initial-value: 200;
}

:root {
  --brand: oklch(60% 0.2 var(--hue));
}

.theme-toggle:hover {
  --hue: 320;
  transition: --hue 0.5s;
}
```

### 与滚动驱动动画

```css
@property --scroll-progress {
  syntax: '<number>';
  inherits: false;
  initial-value: 0;
}

.scroll-indicator {
  --scroll-progress: 0;
  background: conic-gradient(
    #4a90d9 calc(var(--scroll-progress) * 1%),
    transparent 0
  );
  animation: track-scroll linear;
  animation-timeline: scroll(root);
}

@keyframes track-scroll {
  to { --scroll-progress: 100; }
}
```

---

## 浏览器兼容性

| 浏览器 | 版本 |
|--------|------|
| Chrome / Edge | 85+ ✅ |
| Safari | 16+ ✅ |
| Firefox | 128+ ✅ |

---

## 奇淫技巧

### 技巧一：自定义进度环

```css
@property --progress {
  syntax: '<percentage>';
  inherits: false;
  initial-value: 0%;
}

.ring {
  --progress: 0%;
  background: conic-gradient(
    #4a90d9 var(--progress),
    #e0e0e0 var(--progress)
  );
  border-radius: 50%;
  transition: --progress 0.3s ease;
}

.ring:hover {
  --progress: 75%;
}
```

### 技巧二：定时变色背景

```css
@property --time-hue {
  syntax: '<number>';
  inherits: false;
  initial-value: 0;
}

.time-bg {
  --time-hue: 0;
  background: hsl(var(--time-hue) 70% 50%);
  animation: day-cycle 24s linear infinite;
}

@keyframes day-cycle {
  0%   { --time-hue: 220; } /* 凌晨 */
  25%  { --time-hue: 45; }  /* 上午 */
  50%  { --time-hue: 200; } /* 中午 */
  75%  { --time-hue: 280; } /* 傍晚 */
  100% { --time-hue: 220; }
}
```

### 技巧三：定义全局动态变量系统

```css
/* 在 :root 层级定义，供整个应用使用 */
@property --theme-primary {
  syntax: '<color>';
  inherits: true;
  initial-value: #4a90d9;
}

@property --theme-spacing-unit {
  syntax: '<length>';
  inherits: true;
  initial-value: 8px;
}

:root {
  --theme-primary: #4a90d9;
  --theme-spacing-unit: 8px;
}

.component {
  color: var(--theme-primary);
  padding: calc(var(--theme-spacing-unit) * 2);
  transition: --theme-primary 0.3s;
}
```

### 技巧四：实现“液态”边框角度

```css
@property --radius {
  syntax: '<percentage>';
  inherits: false;
  initial-value: 0%;
}

.morphing-card {
  --radius: 10%;
  border-radius: var(--radius);
  transition: --radius 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.morphing-card:hover {
  --radius: 50%;
}
```

### 技巧五：检测支持并降级

```js
if (CSS.supports('property', '--x')) {
  console.log('支持 @property');
} else {
  // 降级：使用 JS 动画或静态样式
}
```

---

## 参考资料

- [MDN @property](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@property)
- [CSS Properties and Values API Level 1](https://www.w3.org/TR/css-properties-values-api-1/)
- [Can I Use: @property](https://caniuse.com/mdn-css_at-rules_property)
