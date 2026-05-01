---
title: CSS 字体加载与排版
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

# CSS 字体加载与排版

[[toc]]

字体是网页视觉呈现的基石。现代 CSS 提供了 `@font-face`、`font-display`、`font-variation-settings` 等工具，让开发者能精细控制字体加载策略和排版细节。

---

## @font-face 基础

### 基本语法

```css
@font-face {
  font-family: 'MyFont';
  src: url('myfont.woff2') format('woff2'),
       url('myfont.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

### 多字重支持

```css
@font-face {
  font-family: 'MyFont';
  src: url('myfont-regular.woff2') format('woff2');
  font-weight: 400;
}

@font-face {
  font-family: 'MyFont';
  src: url('myfont-bold.woff2') format('woff2');
  font-weight: 700;
}
```

---

## 字体加载策略

### font-display

```css
@font-face {
  font-family: 'MyFont';
  src: url('myfont.woff2') format('woff2');
  font-display: swap;  /* 推荐 */
}
```

| 值 | 效果 |
|----|------|
| `auto` | 浏览器默认行为 |
| `block` | 短暂阻塞，然后显示备用字体 |
| `swap` | 立即显示备用字体，加载完成后替换 |
| `fallback` | 短暂阻塞，然后显示备用，加载完成前不替换 |
| `optional` | 短暂阻塞，加载完成前不替换 |

### 系统字体栈

```css
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, sans-serif;
}
```

---

## 可变字体

### font-variation-settings

```css
.variable-font {
  font-family: 'Inter Variable', sans-serif;
  font-variation-settings: 'wght' 700, 'slnt' -10;
}
```

### 动态调整

```css
.weight-animation {
  font-family: 'Inter Variable', sans-serif;
  animation: weight-change 2s infinite alternate;
}

@keyframes weight-change {
  from { font-variation-settings: 'wght' 400; }
  to { font-variation-settings: 'wght' 700; }
}
```

---

## 排版细节

### 字体平滑

```css
.smooth-text {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### 字间距与行高

```css
.readable-text {
  font-size: 16px;
  line-height: 1.6;
  letter-spacing: 0.01em;
  word-spacing: 0.05em;
}
```

### 文本渲染优化

```css
.optimized-text {
  text-rendering: optimizeLegibility;
  /* 或 optimizeSpeed */
}
```

---

## 字体子集化

### unicode-range

```css
@font-face {
  font-family: 'MyFont';
  src: url('myfont-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153;
}

@font-face {
  font-family: 'MyFont';
  src: url('myfont-cjk.woff2') format('woff2');
  unicode-range: U+4E00-9FFF;
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| @font-face | 4+ | 3.1+ | 3.5+ | 12+ |
| font-display | 60+ | 11.1+ | 58+ | 79+ |
| font-variation-settings | 62+ | 11+ | 62+ | 17+ |
| unicode-range | 36+ | 9+ | 36+ | 79+ |

---

## 奇淫技巧

### 技巧一：字体预加载

```html
<link rel="preload" href="myfont.woff2" as="font" type="font/woff2" crossorigin>
```

### 技巧二：FOUT 优化

```css
/* 避免无样式文字闪烁 */
@font-face {
  font-family: 'MyFont';
  src: url('myfont.woff2') format('woff2');
  font-display: optional;
}
```

### 技巧三：响应式字体大小

```css
:root {
  font-size: clamp(14px, 0.5vw + 12px, 18px);
}
```

### 技巧四：排版比例

```css
.type-scale {
  --ratio: 1.25;
  font-size: calc(1rem * var(--ratio));
}
```

### 技巧五：首字下沉

```css
.drop-cap::first-letter {
  float: left;
  font-size: 3.5em;
  line-height: 0.8;
  margin-right: 0.1em;
  margin-top: 0.1em;
}
```

---

## 参考资料

- [MDN @font-face](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@font-face)
- [MDN font-display](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@font-face/font-display)
- [web.dev: Optimize WebFont loading](https://web.dev/optimize-webfont-loading/)
