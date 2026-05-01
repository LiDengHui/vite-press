---
title: CSS 滚动条样式与自定义
date: 2025-04-29
tags:
  - CSS
  - 滚动条
  - 滚动
categories:
  - 技术文档
  - 前端
  - CSS
  - 交互与动画
---

# CSS 滚动条样式与自定义

[[toc]]

默认滚动条在不同浏览器和操作系统下外观差异较大。CSS 提供了标准化的滚动条自定义能力，结合 `-webkit-scrollbar` 伪元素和现代 `scrollbar-color` / `scrollbar-width` 属性，可以创建与品牌一致的滚动体验。

---

## 现代标准属性

### scrollbar-width

```css
/* 细滚动条 */
.thin-scroll {
  scrollbar-width: thin;  /* thin | auto | none */
}

/* 隐藏滚动条（仍可滚动） */
.hidden-scroll {
  scrollbar-width: none;
}

/* 默认 */
.auto-scroll {
  scrollbar-width: auto;
}
```

### scrollbar-color

```css
/* 滑块颜色 | 轨道颜色 */
.colored-scroll {
  scrollbar-color: #3498db #f0f0f0;
}

/* 跟随系统主题 */
.dark-scroll {
  scrollbar-color: #666 #1a1a1a;
}

/* auto = 使用系统默认 */
.default-scroll {
  scrollbar-color: auto;
}
```

### 完整示例

```css
.custom-scroll {
  overflow: auto;
  scrollbar-width: thin;
  scrollbar-color: #999 transparent;
}

.custom-scroll:hover {
  scrollbar-color: #666 transparent;
}
```

---

## WebKit 滚动条伪元素

### 基础结构

```css
/* 整个滚动条 */
::-webkit-scrollbar {
  width: 8px;    /* 垂直滚动条宽度 */
  height: 8px;   /* 水平滚动条高度 */
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 滚动条角落 */
::-webkit-scrollbar-corner {
  background: transparent;
}

/* 滚动条按钮（两端箭头） */
::-webkit-scrollbar-button {
  display: none;  /* 通常隐藏 */
}
```

### 分状态样式

```css
/* 滑块不同状态 */
::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
  border: 2px solid transparent;  /* 创建内边距效果 */
  background-clip: content-box;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
  background-clip: content-box;
}

::-webkit-scrollbar-thumb:active {
  background: #888;
  background-clip: content-box;
}

/* 轨道不同状态 */
::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-track:hover {
  background: #f1f1f1;
}
```

### 水平滚动条

```css
.horizontal-scroll::-webkit-scrollbar {
  height: 6px;
}

.horizontal-scroll::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}
```

---

## 高级自定义

### 双层滑块效果

```css
/* 创建滑块内边距 */
.scroll-container::-webkit-scrollbar-thumb {
  border: 3px solid transparent;
  background-clip: padding-box;
  border-radius: 8px;
  background-color: rgba(0,0,0,0.3);
}

.scroll-container::-webkit-scrollbar-track {
  background: transparent;
}

.scroll-container::-webkit-scrollbar {
  width: 14px;
}
```

### 自定义颜色主题

```css
/* 亮色主题 */
.light-theme {
  scrollbar-color: #c1c1c1 transparent;
}

.light-theme::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.light-theme::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 暗色主题 */
.dark-theme {
  scrollbar-color: #555 #1a1a1a;
}

.dark-theme::-webkit-scrollbar {
  width: 10px;
}

.dark-theme::-webkit-scrollbar-track {
  background: #1a1a1a;
}

.dark-theme::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 5px;
}

.dark-theme::-webkit-scrollbar-thumb:hover {
  background: #777;
}
```

### 仅悬停显示

```css
.scroll-hover {
  scrollbar-width: none;
  transition: scrollbar-width 0.3s;
}

.scroll-hover:hover {
  scrollbar-width: thin;
}

/* WebKit 版本 */
.scroll-hover::-webkit-scrollbar {
  width: 0;
  transition: width 0.3s;
}

.scroll-hover:hover::-webkit-scrollbar {
  width: 8px;
}
```

---

## 平滑滚动

### scroll-behavior

```css
/* 全局平滑滚动 */
html {
  scroll-behavior: smooth;
}

/* 容器内平滑滚动 */
.scroll-smooth {
  scroll-behavior: smooth;
  overflow-y: auto;
}

/* 只在用户未手动滚动时生效 */
@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}
```

### overscroll-behavior

```css
/* 防止滚动链式传播 */
.modal {
  overscroll-behavior: contain;
  overflow-y: auto;
}

/* 完全禁用 overscroll 效果 */
.no-overscroll {
  overscroll-behavior: none;
}
```

---

## 滚动吸附

```css
/* 水平滑块 */
.slider {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;  /* iOS 平滑滚动 */
  scrollbar-width: none;  /* 隐藏滚动条 */
}

.slider::-webkit-scrollbar {
  display: none;
}

.slide {
  flex: 0 0 80%;
  scroll-snap-align: center;
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| scrollbar-width | 121+ | 不支持 | 64+ | 121+ |
| scrollbar-color | 121+ | 不支持 | 64+ | 121+ |
| -webkit-scrollbar | 4+ | 4+ | 不支持 | 79+ |
| scroll-behavior | 61+ | 14+ | 36+ | 79+ |
| overscroll-behavior | 63+ | 16+ | 59+ | 79+ |

---

## 奇淫技巧

### 技巧一：Mac 风格滚动条

```css
.mac-scroll::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.mac-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.mac-scroll::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.2);
  border-radius: 4px;
}

.mac-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(0,0,0,0.4);
}

.mac-scroll::-webkit-scrollbar-corner {
  background: transparent;
}
```

### 技巧二：渐变滚动指示器

```css
.scroll-indicator {
  position: relative;
  overflow-y: auto;
  max-height: 400px;
}

.scroll-indicator::before,
.scroll-indicator::after {
  content: '';
  position: sticky;
  left: 0;
  right: 0;
  height: 20px;
  pointer-events: none;
  z-index: 1;
}

.scroll-indicator::before {
  top: 0;
  background: linear-gradient(to bottom, white, transparent);
}

.scroll-indicator::after {
  bottom: 0;
  background: linear-gradient(to top, white, transparent);
}
```

### 技巧三：自定义滚动进度条

```css
.progress-scroll {
  position: relative;
  overflow-y: auto;
}

.progress-scroll::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(to right, #3498db var(--scroll, 0%), transparent 0);
  z-index: 9999;
}
```

```javascript
document.querySelector('.progress-scroll').addEventListener('scroll', (e) => {
  const el = e.target;
  const scrollPercent = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
  el.style.setProperty('--scroll', scrollPercent + '%');
});
```

### 技巧四：双滚动条同步

```css
.sync-scroll {
  display: flex;
  overflow: hidden;
}

.sync-scroll .fixed-column {
  overflow-y: hidden;
  flex-shrink: 0;
}

.sync-scroll .scrollable-area {
  overflow-y: auto;
  flex: 1;
}
```

```javascript
const fixed = document.querySelector('.fixed-column');
const scrollable = document.querySelector('.scrollable-area');

scrollable.addEventListener('scroll', () => {
  fixed.scrollTop = scrollable.scrollTop;
});
```

### 技巧五：隐藏滚动条但保持功能

```css
/* 方法 1: scrollbar-width */
.hide-scrollbar {
  scrollbar-width: none;
}

/* 方法 2: WebKit */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

/* 方法 3: 马赛克方法 */
.mask-scrollbar {
  overflow: hidden;
  padding-right: 20px;  /* 隐藏滚动条占位 */
  margin-right: -20px;
}
```

---

## 参考资料

- [MDN: scrollbar-width](https://developer.mozilla.org/zh-CN/docs/Web/CSS/scrollbar-width)
- [MDN: scrollbar-color](https://developer.mozilla.org/zh-CN/docs/Web/CSS/scrollbar-color)
- [CSS-Tricks: Scrollbar CSS](https://css-tricks.com/almanac/properties/s/scrollbar/)
- [webkit-scrollbar 文档](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariCSSRef/Articles/StandardCSSProperties.html)
