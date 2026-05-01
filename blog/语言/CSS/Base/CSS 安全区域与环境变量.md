---
title: CSS 安全区域与环境变量
date: 2025-04-29
tags:
  - CSS
  - 安全区
  - 移动端
  - 自定义属性
  - 现代特性
categories:
  - 技术文档
  - 前端
  - CSS
  - 现代特性
---

# CSS 安全区域与环境变量

[[toc]]

现代移动设备引入刘海屏、圆角屏、底部手势条等特殊显示区域。CSS 环境变量（`env()`）提供了一种安全、标准的方式来处理这些设备的非矩形屏幕，确保内容不会被硬件特性遮挡。

## 环境变量基础

### env() 函数

```css
/* 基本语法 */
.safe-area {
  padding-top: env(safe-area-inset-top);
  padding-right: env(safe-area-inset-right);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
}

/* 带默认值 */
.safe-area-fallback {
  padding-top: env(safe-area-inset-top, 20px);
}
```

### 内置安全区域变量

| 变量 | 描述 | 典型值 |
|------|------|--------|
| `safe-area-inset-top` | 顶部安全区域 | iPhone X+: 44px |
| `safe-area-inset-right` | 右侧安全区域 | 横屏时有效 |
| `safe-area-inset-bottom` | 底部安全区域 | iPhone X+: 34px |
| `safe-area-inset-left` | 左侧安全区域 | 横屏时有效 |

### 使用 viewport-fit

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

```css
/* cover: 内容延伸至安全区域外 */
/* contain: 内容限制在安全区域内（默认） */

.fullscreen {
  position: fixed;
  inset: 0;
  padding: env(safe-area-inset-top) env(safe-area-inset-right)
           env(safe-area-inset-bottom) env(safe-area-inset-left);
}
```

## 实战应用

### 固定导航栏

```css
.fixed-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  padding-top: env(safe-area-inset-top);
  background: #fff;
  z-index: 100;
}

/* 内容区域避开导航 */
.page-content {
  padding-top: calc(44px + env(safe-area-inset-top));
}
```

### 底部 Tab 栏

```css
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  padding-bottom: env(safe-area-inset-bottom);
  background: #fff;
  border-top: 1px solid #e5e5e5;
}

/* 内容区域避开底部 */
.page-content {
  padding-bottom: calc(50px + env(safe-area-inset-bottom));
}
```

### 全屏图片/视频

```css
.fullscreen-media {
  position: fixed;
  inset: 0;
}

.fullscreen-media img,
.fullscreen-media video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

### 模态框安全适配

```css
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: env(safe-area-inset-top) env(safe-area-inset-right)
           env(safe-area-inset-bottom) env(safe-area-inset-left);
}

.modal-content {
  max-height: 100%;
  overflow-y: auto;
}
```

## 环境变量高级用法

### 自定义环境变量

```css
/* 通过 @property 定义（实验性） */
@property --theme-color {
  syntax: '<color>';
  initial-value: #3498db;
  inherits: true;
}

/* 实际环境变量通常由浏览器/系统提供 */
```

### 与 CSS 变量结合

```css
:root {
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
  --nav-height: 44px;
  --tab-height: 50px;
}

.page {
  padding-top: calc(var(--nav-height) + var(--safe-top));
  padding-bottom: calc(var(--tab-height) + var(--safe-bottom));
}
```

### 横屏适配

```css
/* 横屏时侧边的安全区域 */
@media (orientation: landscape) {
  .safe-layout {
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
  }
}
```

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| `env()` | 69+ | 11.1+ | 65+ | 79+ |
| `viewport-fit` | 69+ | 11.1+ | 65+ | 79+ |
| `safe-area-inset-*` | 69+ | 11.1+ | 65+ | 79+ |

## 奇淫技巧

### 技巧一：安全区域工具类

```css
/* 快捷类 */
.safe-top    { padding-top: env(safe-area-inset-top); }
.safe-right  { padding-right: env(safe-area-inset-right); }
.safe-bottom { padding-bottom: env(safe-area-inset-bottom); }
.safe-left   { padding-left: env(safe-area-inset-left); }
.safe-all {
  padding: env(safe-area-inset-top) env(safe-area-inset-right)
           env(safe-area-inset-bottom) env(safe-area-inset-left);
}
```

### 技巧二：动态计算工具栏高度

```css
:root {
  --toolbar-height: calc(44px + env(safe-area-inset-top));
}

.toolbar {
  height: var(--toolbar-height);
  padding-top: env(safe-area-inset-top);
}

/* 支持 constant() 旧语法回退 */
.legacy-support {
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
}
```

### 技巧三：沉浸式设计

```css
/* 状态栏文字颜色控制 */
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

/* 配合 CSS */
.immersive {
  background: linear-gradient(
    to bottom,
    rgba(0,0,0,0.3) 0%,
    transparent env(safe-area-inset-top)
  );
}
```

### 技巧四：安全区域检测

```javascript
// JS 获取安全区域值
function getSafeAreaInsets() {
  const div = document.createElement('div');
  div.style.paddingTop = 'env(safe-area-inset-top)';
  document.body.appendChild(div);
  
  const computed = getComputedStyle(div);
  const top = parseInt(computed.paddingTop) || 0;
  
  document.body.removeChild(div);
  return { top };
}
```

### 技巧五：防抖动键盘适配

```css
/* 处理虚拟键盘弹出时的布局 */
.keyboard-aware {
  min-height: 100vh;
  min-height: 100dvh; /* 动态视口高度 */
  padding-bottom: env(safe-area-inset-bottom);
}
```

## 参考资源

- [MDN: env()](https://developer.mozilla.org/zh-CN/docs/Web/CSS/env)
- [WebKit: CSS Design for iPhone X](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)
- [CSS-Tricks: The Notch and CSS](https://css-tricks.com/the-notch-and-css/)
