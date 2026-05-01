---
title: CSS 颜色空间与 HDR
date: 2025-04-29
tags:
  - CSS
  - 颜色
  - 颜色空间
  - HDR
  - 现代特性
categories:
  - 技术文档
  - 前端
  - CSS
  - 现代特性
---

# CSS 颜色空间与 HDR

[[toc]]

CSS 颜色模块 Level 4/5 引入了丰富的颜色空间支持，从 sRGB 到 Display P3 再到 Rec.2020，配合 HDR（高动态范围）技术，让网页可以呈现更鲜艳、更真实的色彩。

---

## 颜色空间概述

### 常见颜色空间对比

| 颜色空间 | 色域范围 | 使用场景 | 声明方式 |
|---------|---------|---------|---------|
| sRGB | 最小 | 网页标准 | `rgb()`, `#hex` |
| Display P3 | 中 | Apple 设备 | `color(display-p3 ...)` |
| Rec.2020 | 大 | 超高清视频 | `color(rec2020 ...)` |
| CIE Lab | 感知均匀 | 颜色插值 | `lab()`, `lch()` |
| OKLab | 改进版 Lab | 现代推荐 | `oklab()`, `oklch()` |

---

## 现代颜色函数

### oklch() - 推荐用法

```css
/* 亮度、色度、色相 */
.primary {
  color: oklch(60% 0.2 250);
}

/* 带透明度 */
.semi-transparent {
  color: oklch(60% 0.2 250 / 0.5);
}

/* 色相变化 */
.gradient-oklch {
  background: linear-gradient(
    in oklch longer hue,
    oklch(70% 0.2 0),
    oklch(70% 0.2 360)
  );
}
```

### lab() / lch()

```css
.lab-color {
  color: lab(50% 20 -30);
}

.lch-color {
  color: lch(50% 40 250);
}
```

### color()

```css
/* Display P3 */
.p3-red {
  color: color(display-p3 1 0 0);
}

/* Rec.2020 */
.rec2020-green {
  color: color(rec2020 0 1 0);
}

/* sRGB */
.srgb-blue {
  color: color(srgb 0 0 1);
}
```

### 相对颜色语法

```css
/* 基于主色创建变体 */
:root {
  --primary: oklch(60% 0.2 250);
}

.primary-light {
  color: oklch(from var(--primary) calc(l + 20%) c h);
}

.primary-dark {
  color: oklch(from var(--primary) calc(l - 20%) c h);
}

.primary-fade {
  color: oklch(from var(--primary) l c h / 50%);
}

/* 颜色混合 */
.mixed {
  color: color-mix(in oklch, red, blue 50%);
}
```

---

## HDR 颜色

### 高亮颜色

```css
/* 使用 color() 配合 HDR 色域 */
.hdr-red {
  color: color(display-p3 1.2 0 0);  /* 超出发光值 */
}

/* 使用 oklch 高亮度 */
.hdr-white {
  color: oklch(120% 0 0);  /* 超出 100% 亮度 */
}
```

### 媒体查询检测 HDR

```css
/* 检测设备是否支持 HDR */
@media (dynamic-range: high) {
  .hero {
    background: linear-gradient(
      in oklch,
      oklch(80% 0.3 250),
      oklch(60% 0.4 280)
    );
  }
}

/* 仅支持标准动态范围 */
@media (dynamic-range: standard) {
  .hero {
    background: linear-gradient(
      in srgb,
      rgb(100, 150, 255),
      rgb(80, 100, 220)
    );
  }
}
```

---

## 颜色插值

### 在指定颜色空间中渐变

```css
/* sRGB 渐变（默认） */
.gradient-srgb {
  background: linear-gradient(red, blue);
}

/* OKLab 渐变（更自然） */
.gradient-oklab {
  background: linear-gradient(in oklab, red, blue);
}

/* OKLCH 色相渐变 */
.gradient-hue {
  background: linear-gradient(
    in oklch longer hue,
    hsl(0 100% 50%),
    hsl(360 100% 50%)
  );
}
```

### 对比

```css
/* sRGB 渐变：中间变灰 */
.rgb-gradient {
  background: linear-gradient(in srgb, red, blue);
}

/* OKLab 渐变：中间保持亮度 */
.oklab-gradient {
  background: linear-gradient(in oklab, red, blue);
}

/* 色相渐变模式 */
.hue-gradient {
  background: linear-gradient(
    in oklch increasing hue,
    hsl(0 100% 50%),
    hsl(100 100% 50%)
  );
}
```

---

## 宽色域图像

```css
/* 使用 P3 色域图片 */
.wide-gamut-img {
  image-rendering: high-quality;
}

/* 检测色域支持 */
@media (color-gamut: p3) {
  .hero-banner {
    background-image: url(hero-p3.jpg);
  }
}

@media (color-gamut: srgb) {
  .hero-banner {
    background-image: url(hero-srgb.jpg);
  }
}
```

---

## 系统颜色

```css
/* 跟随系统主题 */
.system-colors {
  color: CanvasText;
  background: Canvas;
  border: 1px solid ButtonBorder;
}

/* 使用 AccentColor */
.accent {
  color: AccentColor;
}

/* 链接颜色 */
.link {
  color: LinkText;
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| oklch() | 111+ | 15+ | 113+ | 111+ |
| lab() | 111+ | 15+ | 113+ | 111+ |
| color() | 111+ | 15+ | 113+ | 111+ |
| color-mix() | 111+ | 16.2+ | 113+ | 111+ |
| 相对颜色 | 111+ | 16.2+ | 128+ | 111+ |
| dynamic-range | 104+ | 不支持 | 不支持 | 104+ |

---

## 奇淫技巧

### 技巧一：CSS 变量 + 相对颜色构建主题系统

```css
:root {
  --hue: 250;
  --primary: oklch(60% 0.2 var(--hue));
}

.theme-blue { --hue: 250; }
.theme-green { --hue: 150; }
.theme-red { --hue: 25; }

.btn {
  background: var(--primary);
}

.btn:hover {
  background: oklch(from var(--primary) calc(l + 10%) c h);
}
```

### 技巧二：感知均匀的透明度渐变

```css
.fade-out {
  background: linear-gradient(
    in oklab to right,
    oklch(50% 0.2 250 / 1),
    oklch(50% 0.2 250 / 0)
  );
}
```

### 技巧三：色相旋转动画

```css
.rainbow-text {
  animation: hue-rotate 5s linear infinite;
}

@keyframes hue-rotate {
  from { color: oklch(60% 0.2 0); }
  to { color: oklch(60% 0.2 360); }
}
```

### 技巧四：条件宽色域支持

```css
@supports (color: oklch(0% 0 0)) {
  .modern {
    --primary: oklch(60% 0.2 250);
  }
}

@supports not (color: oklch(0% 0 0)) {
  .modern {
    --primary: #6366f1;
  }
}
```

### 技巧五：自动暗色模式

```css
:root {
  --bg: oklch(95% 0 0);
  --text: oklch(20% 0 0);
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: oklch(20% 0 0);
    --text: oklch(95% 0 0);
  }
}
```

---

## 参考资料

- [MDN: CSS Color Module](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)
- [OKLCH Color Picker](https://oklch.com/)
- [web.dev: High Definition CSS Color Guide](https://web.dev/articles/high-definition-css-color-guide)
