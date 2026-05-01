---
title: CSS 可访问性
date: 2025-04-29
tags:
  - CSS
  - 可访问性
categories:
  - 技术文档
  - 前端
  - CSS
  - 基础入门
---

# CSS 可访问性

[[toc]]

可访问性（Accessibility，简称 A11y）确保所有用户都能使用网页，包括视障、听障、运动障碍和认知障碍用户。CSS 在可访问性中扮演重要角色，从颜色对比度到动画控制，再到焦点管理。

---

## 颜色对比度

### WCAG 对比度标准

| 级别 | 正常文本 | 大文本（18px+ 或 14px+粗体） |
|------|---------|---------------------------|
| AA | 4.5:1 | 3:1 |
| AAA | 7:1 | 4.5:1 |

### 工具检测

```css
/* 使用 CSS 自定义属性管理颜色，方便调整 */
:root {
  --text-primary: #1a1a1a;
  --text-secondary: #666;
  --bg-primary: #fff;
  --bg-secondary: #f5f5f5;
}

/* 确保对比度符合 WCAG AA */
.text-primary {
  color: var(--text-primary);
  background: var(--bg-primary);
}
```

### 避免仅依赖颜色传递信息

```css
/* 不好：仅用颜色表示错误 */
.error { color: red; }

/* 好：颜色 + 图标 + 文字 */
.error {
  color: #d32f2f;
  border-left: 3px solid #d32f2f;
  padding-left: 1rem;
}

.error::before {
  content: '⚠️ ';
}
```

---

## 减少动画偏好

### prefers-reduced-motion

```css
/* 尊重用户的减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* 更精细的控制 */
.animated-card {
  transition: transform 0.3s;
}

@media (prefers-reduced-motion: no-preference) {
  .animated-card:hover {
    transform: scale(1.05);
  }
}
```

---

## 焦点管理

### :focus-visible

```css
/* 仅对键盘导航显示焦点环 */
button:focus-visible {
  outline: 2px solid #4a90d9;
  outline-offset: 2px;
}

/* 鼠标点击时不显示 */
button:focus:not(:focus-visible) {
  outline: none;
}
```

### :focus-within

```css
/* 子元素获得焦点时父元素样式变化 */
.search-box:focus-within {
  box-shadow: 0 0 0 3px rgba(74, 144, 217, 0.3);
}
```

### 焦点顺序

```css
/* 确保逻辑焦点顺序 */
.skip-link {
  position: absolute;
  top: -100%;
  left: 0;
  background: #000;
  color: #fff;
  padding: 0.5rem 1rem;
  z-index: 9999;
}

.skip-link:focus {
  top: 0;
}
```

---

## 暗色模式

### prefers-color-scheme

```css
:root {
  --bg: #fff;
  --text: #1a1a1a;
  --border: #e0e0e0;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #1a1a1a;
    --text: #f5f5f5;
    --border: #333;
  }
}

body {
  background: var(--bg);
  color: var(--text);
}
```

---

## 高对比度模式

### forced-colors

```css
@media (forced-colors: active) {
  /* 系统强制高对比度模式 */
  .button {
    border: 2px solid ButtonText;
  }

  .icon {
    forced-color-adjust: none;  /* 保持自定义颜色 */
  }
}
```

---

## 屏幕阅读器支持

### 隐藏内容但保留给屏幕阅读器

```css
.visually-hidden {
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

### 隐藏装饰性内容

```css
.decorative {
  aria-hidden: true;  /* HTML 属性 */
}

/* 或使用 CSS 隐藏 */
.sr-only {
  display: none;  /* 从可访问树中移除 */
}
```

---

## 触摸目标大小

```css
/* 确保触摸目标至少 44x44px */
.touch-target {
  min-width: 44px;
  min-height: 44px;
}

/* 更宽松的标准（iOS 推荐） */
.touch-target-ios {
  min-width: 48px;
  min-height: 48px;
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| prefers-reduced-motion | 74+ | 10.1+ | 63+ | 79+ |
| prefers-color-scheme | 76+ | 12.1+ | 67+ | 79+ |
| focus-visible | 86+ | 15.4+ | 85+ | 86+ |
| focus-within | 60+ | 10.1+ | 52+ | 79+ |
| forced-colors | 89+ | 无 | 无 | 89+ |

---

## 奇淫技巧

### 技巧一：CSS 检测屏幕阅读器

```css
@media speech {
  /* 屏幕阅读器特定的样式 */
  .visual-only {
    display: none;
  }
}
```

### 技巧二：打印友好样式

```css
@media print {
  /* 确保打印时有足够的对比度 */
  * {
    background: white !important;
    color: black !important;
  }

  a {
    text-decoration: underline;
  }

  a::after {
    content: ' (' attr(href) ')';
    font-size: 0.8em;
  }
}
```

### 技巧三：焦点可见性增强

```css
/* 全局焦点样式 */
:focus-visible {
  outline: 3px solid #005fcc;
  outline-offset: 2px;
}

/* 自定义组件焦点 */
.custom-button:focus-visible {
  box-shadow: 0 0 0 3px rgba(0, 95, 204, 0.5);
}
```

### 技巧四：减少动态内容干扰

```css
/* 自动播放的内容 */
.auto-play {
  animation: pulse 2s infinite;
}

@media (prefers-reduced-motion: reduce) {
  .auto-play {
    animation: none;
  }

  /* 提供静态替代 */
  .auto-play::after {
    content: '⚡';
  }
}
```

### 技巧五：语义化焦点环

```css
/* 不同元素使用不同颜色的焦点环 */
a:focus-visible {
  outline-color: #0066cc;
}

button:focus-visible {
  outline-color: #28a745;
}

input:focus-visible {
  outline-color: #ffc107;
}
```

---

## 参考资料

- [MDN 可访问性](https://developer.mozilla.org/zh-CN/docs/Web/Accessibility)
- [WCAG 2.1 指南](https://www.w3.org/WAI/WCAG21/quickref/)
- [web.dev 可访问性](https://web.dev/accessibility/)
