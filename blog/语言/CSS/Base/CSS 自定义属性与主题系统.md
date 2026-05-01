---
title: CSS 自定义属性与主题系统
date: 2025-04-29
tags:
  - CSS
  - 自定义属性
categories:
  - 技术文档
  - 前端
  - CSS
  - 基础入门
---

# CSS 自定义属性与主题系统

[[toc]]

CSS 自定义属性（CSS Variables / Custom Properties）是 CSS 中最具革命性的特性之一。它允许在 CSS 中定义可复用的值，并在运行时动态更新，是构建现代设计系统和主题切换的基石。

## 基础语法

### 定义与使用

```css
/* 定义变量 */
:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --text-color: #333;
  --bg-color: #fff;
  --font-size-base: 16px;
  --spacing-unit: 8px;
}

/* 使用变量 */
.btn-primary {
  background: var(--primary-color);
  color: white;
  font-size: var(--font-size-base);
  padding: calc(var(--spacing-unit) * 2);
}
```

### 作用域与继承

```css
/* 全局变量 */
:root {
  --global-color: blue;
}

/* 局部变量 - 仅在此元素及子元素生效 */
.card {
  --card-bg: #f5f5f5;
  --card-padding: 1.5rem;
  
  background: var(--card-bg);
  padding: var(--card-padding);
}

/* 子元素继承父元素变量 */
.card .title {
  /* 可以使用 --card-bg */
}
```

### 默认值

```css
.element {
  /* 使用默认值 */
  color: var(--text-color, #333);
  font-size: var(--font-size, 1rem);
  
  /* 多层回退 */
  background: var(--custom-bg, var(--theme-bg, white));
}
```

## 动态更新

### 通过 JavaScript

```js
// 获取变量
const primaryColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--primary-color');

// 设置变量
document.documentElement.style.setProperty('--primary-color', '#e74c3c');

// 在特定元素上设置
const card = document.querySelector('.card');
card.style.setProperty('--card-bg', '#e8f4f8');
```

### 通过类名切换

```html
<html class="theme-dark">
```

```css
:root {
  --bg: #fff;
  --text: #333;
}

.theme-dark {
  --bg: #1a1a1a;
  --text: #f0f0f0;
}

body {
  background: var(--bg);
  color: var(--text);
  transition: background 0.3s, color 0.3s;
}
```

## 主题系统设计

### 颜色系统

```css
:root {
  /* 品牌色 */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-900: #1e3a8a;
  
  /* 功能色 */
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
  
  /* 中性色 */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-500: #6b7280;
  --color-gray-900: #111827;
  
  /* 语义化映射 */
  --color-text: var(--color-gray-900);
  --color-text-secondary: var(--color-gray-500);
  --color-bg: var(--color-gray-50);
  --color-border: var(--color-gray-100);
}

/* 暗色模式 */
[data-theme="dark"] {
  --color-text: var(--color-gray-50);
  --color-text-secondary: var(--color-gray-500);
  --color-bg: var(--color-gray-900);
  --color-border: var(--color-gray-800);
}
```

### 字体系统

```css
:root {
  /* 字体族 */
  --font-sans: system-ui, -apple-system, sans-serif;
  --font-serif: Georgia, serif;
  --font-mono: 'Fira Code', monospace;
  
  /* 字体大小 */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  
  /* 行高 */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
}
```

### 间距系统

```css
:root {
  --space-unit: 0.25rem;  /* 4px 基准 */
  
  --space-1: calc(var(--space-unit) * 1);   /* 4px */
  --space-2: calc(var(--space-unit) * 2);   /* 8px */
  --space-3: calc(var(--space-unit) * 3);   /* 12px */
  --space-4: calc(var(--space-unit) * 4);   /* 16px */
  --space-6: calc(var(--space-unit) * 6);   /* 24px */
  --space-8: calc(var(--space-unit) * 8);   /* 32px */
  --space-12: calc(var(--space-unit) * 12); /* 48px */
  --space-16: calc(var(--space-unit) * 16); /* 64px */
}
```

### 尺寸系统

```css
:root {
  /* 边框圆角 */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-full: 9999px;
  
  /* 阴影 */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
  --shadow-xl: 0 20px 25px rgba(0,0,0,0.15);
  
  /* z-index */
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
}
```

## 主题切换实现

### 纯 CSS 方案

```css
/* 利用 :has() 和 checkbox */
.theme-toggle {
  display: none;
}

body:has(.theme-toggle:checked) {
  --bg: #1a1a1a;
  --text: #f0f0f0;
}
```

### CSS + JavaScript 方案

```js
class ThemeManager {
  constructor() {
    this.root = document.documentElement;
    this.currentTheme = localStorage.getItem('theme') || 'light';
    this.init();
  }
  
  init() {
    this.applyTheme(this.currentTheme);
  }
  
  applyTheme(theme) {
    this.root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
  
  toggle() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
    this.currentTheme = newTheme;
  }
  
  // 跟随系统
  followSystem() {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const applySystem = () => this.applyTheme(mq.matches ? 'dark' : 'light');
    
    applySystem();
    mq.addEventListener('change', applySystem);
  }
}

const theme = new ThemeManager();
```

### 平滑过渡

```css
:root {
  --transition-duration: 0.3s;
  --transition-timing: ease;
}

body {
  background: var(--bg);
  color: var(--text);
  transition: 
    background var(--transition-duration) var(--transition-timing),
    color var(--transition-duration) var(--transition-timing);
}

/* 使用通用过渡属性 */
.theme-transition {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-duration: var(--transition-duration);
  transition-timing-function: var(--transition-timing);
}
```

## 高级技巧

### 动态计算

```css
:root {
  --base-size: 1rem;
  --scale-ratio: 1.25;
  
  --text-sm: calc(var(--base-size) / var(--scale-ratio));
  --text-lg: calc(var(--base-size) * var(--scale-ratio));
  --text-xl: calc(var(--base-size) * var(--scale-ratio) * var(--scale-ratio));
}
```

### 组件级变量

```css
.btn {
  --btn-padding: 0.5rem 1rem;
  --btn-bg: var(--color-primary-500);
  --btn-color: white;
  --btn-radius: var(--radius-md);
  
  padding: var(--btn-padding);
  background: var(--btn-bg);
  color: var(--btn-color);
  border-radius: var(--btn-radius);
}

.btn-large {
  --btn-padding: 0.75rem 1.5rem;
}

.btn-outline {
  --btn-bg: transparent;
  --btn-color: var(--color-primary-500);
  border: 1px solid var(--color-primary-500);
}
```

### 响应式变量

```css
:root {
  --container-width: 100%;
  --grid-columns: 1;
}

@media (min-width: 768px) {
  :root {
    --container-width: 720px;
    --grid-columns: 2;
  }
}

@media (min-width: 1024px) {
  :root {
    --container-width: 960px;
    --grid-columns: 3;
  }
}
```

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| 自定义属性 | 49+ | 9.1+ | 31+ | 15+ |
| var() | 49+ | 9.1+ | 31+ | 15+ |
| @property | 85+ | 16.4+ | 128+ | 85+ |

## 奇淫技巧

### 技巧一：纯 CSS 触发器

```css
@property --progress {
  syntax: '<number>';
  inherits: false;
  initial-value: 0;
}

.progress-bar {
  --progress: 0;
  width: calc(var(--progress) * 1%);
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  transition: --progress 0.5s;
}

.progress-bar:hover {
  --progress: 100;
}
```

### 技巧二：动态颜色混合

```css
:root {
  --blend-ratio: 0%;
}

.gradient-text {
  background: linear-gradient(
    90deg,
    var(--color-1) var(--blend-ratio),
    var(--color-2)
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
```

### 技巧三：渐变动画

```css
@property --angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

.animated-gradient {
  background: conic-gradient(from var(--angle), #ff6b6b, #4ecdc4, #45b7d1, #ff6b6b);
  animation: rotate 3s linear infinite;
}

@keyframes rotate {
  to { --angle: 360deg; }
}
```

### 技巧四：工具类生成

```css
/* 使用变量快速创建工具类 */
.m-1 { margin: var(--space-1); }
.m-2 { margin: var(--space-2); }
.m-3 { margin: var(--space-3); }
.m-4 { margin: var(--space-4); }

.p-1 { padding: var(--space-1); }
.p-2 { padding: var(--space-2); }
.p-3 { padding: var(--space-3); }
.p-4 { padding: var(--space-4); }

.text-primary { color: var(--color-primary-500); }
.text-secondary { color: var(--color-secondary); }
.bg-primary { background: var(--color-primary-500); }
```

### 技巧五：盒子跟随鼠标

```js
document.addEventListener('mousemove', (e) => {
  document.documentElement.style.setProperty('--mouse-x', e.clientX + 'px');
  document.documentElement.style.setProperty('--mouse-y', e.clientY + 'px');
});
```

```css
.cursor-box {
  position: fixed;
  left: var(--mouse-x);
  top: var(--mouse-y);
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background: var(--primary-color);
  border-radius: 50%;
  pointer-events: none;
  transition: left 0.1s, top 0.1s;
}
```

## 总结

CSS 自定义属性是现代 CSS 开发的核心工具：

1. **基础能力**：定义、使用、作用域、继承
2. **动态更新**：JavaScript 控制、类名切换、平滑过渡
3. **设计系统**：颜色、字体、间距、尺寸系统
4. **主题切换**：暗色模式、跟随系统、存储偏好
5. **高级技巧**：动态计算、响应式变量、@property 动画

## 参考资源

- [MDN: 使用 CSS 自定义属性](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_custom_properties)
- [MDN: @property](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@property)
- [CSS-Tricks: A Complete Guide to Custom Properties](https://css-tricks.com/a-complete-guide-to-custom-properties/)
