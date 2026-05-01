---
title: CSS 字体图标与图标系统
date: 2025-04-29
tags:
  - CSS
  - 字体
  - 排版
categories:
  - 技术文档
  - 前端
  - CSS
  - 视觉表现
---

# CSS 字体图标与图标系统

[[toc]]

图标是 UI 设计的重要组成部分。CSS 可以通过字体图标（Icon Fonts）、CSS 绘制、SVG 和图片等多种方式实现图标系统。本文深入讲解各种方案的优劣势、实现方式和最佳实践。

## 图标实现方案对比

| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| 字体图标 | 缩放无失真、可改变颜色 | 只单色、无法复杂效果 | 简单线性图标 |
| CSS 绘制 | 无额外请求、纯 CSS | 复杂图标困难 | 简单几何图形 |
| SVG | 缩放无失真、可动画、多色 | 文件稍大 | 复杂图标、需要动画 |
| 图片 | 支持复杂效果 | 缩放失真、多倍图 | 复杂效果图标 |

## 字体图标

### 基础使用

```html
<!-- Font Awesome 示例 -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<i class="fas fa-home"></i>
<i class="fas fa-user"></i>
<i class="fas fa-cog"></i>
```

```css
/* 自定义字体图标 */
@font-face {
  font-family: 'MyIcons';
  src: url('my-icons.woff2') format('woff2');
  font-display: swap;
}

.icon {
  font-family: 'MyIcons';
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-home::before { content: '\e900'; }
.icon-user::before { content: '\e901'; }
.icon-settings::before { content: '\e902'; }
```

### 样式控制

```css
/* 颜色 */
.icon-primary { color: #3498db; }
.icon-success { color: #2ecc71; }
.icon-danger  { color: #e74c3c; }

/* 大小 */
.icon-sm { font-size: 0.875rem; }
.icon-md { font-size: 1.25rem; }
.icon-lg { font-size: 1.5rem; }
.icon-xl { font-size: 2rem; }

/* 旋转 */
.icon-rotate-90  { transform: rotate(90deg); }
.icon-rotate-180 { transform: rotate(180deg); }
.icon-rotate-270 { transform: rotate(270deg); }

/* 动画 */
.icon-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### 字体图标的问题

```css
/* 无法正确读屏的问题 */
.icon::before {
  content: '\e900';
  /* 读屏软件可能会读取为 "e900" */
}

/* 解决方案 */
.icon[aria-label]::before {
  content: attr(aria-label);
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

## CSS 绘制图标

### 基础形状

```css
/* 箭头 */
.arrow-right {
  display: inline-block;
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 8px solid currentColor;
}

/* 勾号 */
.checkmark {
  display: inline-block;
  width: 6px;
  height: 12px;
  border: solid currentColor;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* 加号 */
.plus {
  position: relative;
  display: inline-block;
  width: 16px;
  height: 16px;
}

.plus::before,
.plus::after {
  content: '';
  position: absolute;
  background: currentColor;
}

.plus::before {
  top: 7px;
  left: 0;
  width: 16px;
  height: 2px;
}

.plus::after {
  top: 0;
  left: 7px;
  width: 2px;
  height: 16px;
}
```

### 复杂图标

```css
/* 搜索图标 */
.search-icon {
  position: relative;
  display: inline-block;
  width: 16px;
  height: 16px;
}

.search-icon::before {
  content: '';
  position: absolute;
  width: 10px;
  height: 10px;
  border: 2px solid currentColor;
  border-radius: 50%;
}

.search-icon::after {
  content: '';
  position: absolute;
  top: 10px;
  left: 12px;
  width: 2px;
  height: 6px;
  background: currentColor;
  transform: rotate(45deg);
}
```

## SVG 图标

### 内联 SVG

```html
<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
</svg>
```

```css
.icon {
  width: 1em;
  height: 1em;
  vertical-align: middle;
  fill: currentColor;
}

.icon-stroke {
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
}
```

### SVG Sprite

```html
<svg style="display: none;">
  <defs>
    <symbol id="icon-home" viewBox="0 0 24 24">
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
    </symbol>
    <symbol id="icon-user" viewBox="0 0 24 24">
      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
    </symbol>
  </defs>
</svg>

<svg class="icon"><use href="#icon-home"/></svg>
<svg class="icon"><use href="#icon-user"/></svg>
```

### CSS Mask 图标

```css
/* 使用 mask 实现图标 */
.mask-icon {
  width: 24px;
  height: 24px;
  background: currentColor;
  mask: url('icon.svg') no-repeat center;
  mask-size: contain;
  -webkit-mask: url('icon.svg') no-repeat center;
  -webkit-mask-size: contain;
}
```

## 图标系统设计

### 设计原则

1. **一致性**：所有图标保持同一视觉风格
2. **缩放性**：在不同尺寸下保持清晰
3. **可访问性**：添加适当的 ARIA 标记
4. **性能**：优先考虑缓存和复用

### 可访问性

```html
<!-- 装饰性图标 -->
<i class="icon-home" aria-hidden="true"></i>

<!-- 有功能的图标 -->
<button aria-label="关闭">
  <i class="icon-close" aria-hidden="true"></i>
</button>

<!-- 带文本的图标 -->
<a href="/profile">
  <i class="icon-user" aria-hidden="true"></i>
  用户中心
</a>
```

### CSS 变量主题

```css
:root {
  --icon-size-sm: 0.875rem;
  --icon-size-md: 1.25rem;
  --icon-size-lg: 1.5rem;
  --icon-color: currentColor;
}

.icon {
  width: var(--icon-size-md);
  height: var(--icon-size-md);
  color: var(--icon-color);
}

.icon-primary { color: var(--color-primary); }
.icon-secondary { color: var(--color-secondary); }
```

## 实战案例

### 按钮图标

```css
.btn-icon {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
}

.btn-icon .icon {
  width: 1em;
  height: 1em;
}
```

### 状态图标

```css
/* 加载状态 */
.loading .icon {
  animation: spin 1s linear infinite;
}

/* 禁用状态 */
.disabled .icon {
  opacity: 0.5;
}

/* 激活状态 */
.active .icon {
  color: var(--color-primary);
}
```

### 响应式图标

```css
.responsive-icon {
  width: clamp(1rem, 3vw, 2rem);
  height: clamp(1rem, 3vw, 2rem);
}
```

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| @font-face | 4+ | 3.1+ | 3.5+ | 12+ |
| SVG 内联 | 1+ | 3+ | 1.5+ | 12+ |
| SVG use | 1+ | 3+ | 1.5+ | 12+ |
| mask-image | 120+ | 15.4+ | 53+ | 120+ |

## 奇淫技巧

### 技巧一：纯 CSS 复选框

```css
.custom-checkbox {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
}

.custom-checkbox:checked {
  background: #3498db;
  border-color: #3498db;
}

.custom-checkbox:checked::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 1px;
  width: 6px;
  height: 12px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
```

### 技巧二：图标动画

```css
.icon-pulse {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.icon-bounce {
  animation: bounce 1s ease infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-25%); }
}
```

### 技巧三：图标数字动画

```css
.icon-counter {
  position: relative;
}

.icon-counter::after {
  content: attr(data-count);
  position: absolute;
  top: -8px;
  right: -8px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  background: #e74c3c;
  color: white;
  font-size: 11px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### 技巧四：图标组合

```css
.icon-stack {
  position: relative;
  display: inline-block;
  width: 2em;
  height: 2em;
  line-height: 2em;
  vertical-align: middle;
}

.icon-stack-1x,
.icon-stack-2x {
  position: absolute;
  left: 0;
  width: 100%;
  text-align: center;
}

.icon-stack-1x { font-size: 1em; }
.icon-stack-2x { font-size: 2em; }
```

### 技巧五：SVG 渐变图标

```html
<svg class="icon" viewBox="0 0 24 24">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ff6b6b"/>
      <stop offset="100%" style="stop-color:#4ecdc4"/>
    </linearGradient>
  </defs>
  <path fill="url(#grad)" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
</svg>
```

## 总结

CSS 图标系统的选择需根据具体场景决定：

1. **字体图标**：简单线性图标，需要可缩放和改色
2. **CSS 绘制**：简单几何图形，无额外请求
3. **SVG**：复杂图标、需要动画或多色
4. **混合方案**：根据需求组合使用

## 参考资源

- [MDN: @font-face](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@font-face)
- [MDN: SVG](https://developer.mozilla.org/zh-CN/docs/Web/SVG)
- [CSS-Tricks: SVG vs Icon Fonts](https://css-tricks.com/icon-fonts-vs-svg/)
