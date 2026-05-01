---
title: CSS 混合模式与滤镜
date: 2025-04-29
tags:
  - CSS
  - 滤镜
  - 混合模式
categories:
  - 技术文档
  - 前端
  - CSS
  - 视觉表现
---

# CSS 混合模式与滤镜

[[toc]]

CSS 混合模式（Blend Modes）和滤镜（Filters）允许对元素进行复杂的视觉处理，从简单的图片修饰到复杂的色彩混合效果，无需借助图像编辑软件。

---

## 混合模式

### mix-blend-mode

混合模式控制元素与其背后内容的颜色混合方式。

```css
/* 基础混合 */
.blend-multiply {
  mix-blend-mode: multiply;  /* 正片叠底 */
}

.blend-screen {
  mix-blend-mode: screen;    /* 滤色 */
}

.blend-overlay {
  mix-blend-mode: overlay;   /* 叠加 */
}
```

### 混合模式列表

| 模式 | 效果描述 | 适用场景 |
|------|----------|----------|
| `normal` | 正常显示（默认） | - |
| `multiply` | 正片叠底，变暗 | 文字叠加图片 |
| `screen` | 滤色，变亮 | 光效叠加 |
| `overlay` | 叠加，增强对比 | 色彩调整 |
| `darken` | 取暗色 | 去白底 |
| `lighten` | 取亮色 | 去黑底 |
| `color-dodge` | 颜色减淡 | 高光效果 |
| `color-burn` | 颜色加深 | 阴影效果 |
| `hard-light` | 强光 | 强对比 |
| `soft-light` | 柔光 | 柔和对比 |
| `difference` | 差值 | 反色效果 |
| `exclusion` | 排除 | 柔和反色 |
| `hue` | 色相 | 保留底层明度/饱和度 |
| `saturation` | 饱和度 | 保留底层色相/明度 |
| `color` | 颜色 | 保留底层明度 |
| `luminosity` | 明度 | 保留底层色相/饱和度 |

### 文字叠加效果

```css
.text-overlay {
  position: relative;
}

.text-overlay img {
  width: 100%;
}

.text-overlay h2 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 4rem;
  color: white;
  mix-blend-mode: overlay;
}
```

### 背景混合

```css
/* 背景图片与背景色的混合 */
.blend-bg {
  background-image: url('photo.jpg');
  background-color: #3498db;
  background-blend-mode: multiply;
}

/* 多背景混合 */
.multi-blend {
  background:
    url('texture.png'),
    url('photo.jpg'),
    linear-gradient(135deg, #667eea, #764ba2);
  background-blend-mode: overlay, multiply, normal;
}
```

---

## CSS 滤镜

### filter 基础

```css
/* 基础滤镜 */
.brightness { filter: brightness(1.2); }
.contrast   { filter: contrast(1.5); }
.saturate   { filter: saturate(2); }
.hue-rotate { filter: hue-rotate(90deg); }
.blur       { filter: blur(5px); }
.grayscale  { filter: grayscale(1); }
.sepia      { filter: sepia(1); }
.invert     { filter: invert(1); }
.opacity    { filter: opacity(0.5); }

/* 组合滤镜 */
.combo-filter {
  filter: contrast(1.2) brightness(1.1) saturate(1.3);
}
```

### 高级滤镜

```css
/* 阴影滤镜（与 box-shadow 不同） */
.drop-shadow {
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
}

/* 投影滤镜支持透明图片 */
.logo-shadow {
  filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.5));
}

/* 背景模糊 */
.backdrop-blur {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
```

### drop-shadow vs box-shadow

| 特性 | filter: drop-shadow() | box-shadow |
|------|----------------------|------------|
| 透明图片 | ✅ 支持 | ❌ 不支持 |
| 伪元素 | ✅ 支持 | ✅ 支持 |
| 多重阴影 | ✅ 支持 | ✅ 支持 |
| 性能 | 较差 | 较好 |

---

## 实战应用

### 图片悬停效果

```css
.gallery img {
  filter: grayscale(1) brightness(0.8);
  transition: filter 0.3s;
}

.gallery img:hover {
  filter: grayscale(0) brightness(1);
}
```

### 暗色模式切换

```css
.dark-mode-toggle {
  display: none;
}

.dark-mode-toggle:checked ~ .page {
  filter: invert(1) hue-rotate(180deg);
}

/* 修复图片反转 */
.dark-mode-toggle:checked ~ .page img,
.dark-mode-toggle:checked ~ .page video {
  filter: invert(1) hue-rotate(180deg);
}
```

### 毛玻璃效果

```css
.glass-panel {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px) saturate(1.2);
  -webkit-backdrop-filter: blur(10px) saturate(1.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
}
```

### 图片色彩统一

```css
.color-theme img {
  filter: sepia(0.3) saturate(1.5) hue-rotate(-10deg);
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| mix-blend-mode | 41+ | 8+ | 32+ | 79+ |
| background-blend-mode | 35+ | 8+ | 30+ | 79+ |
| filter | 53+ | 9.1+ | 35+ | 79+ |
| backdrop-filter | 76+ | 9+ | 103+ | 79+ |

---

## 奇淫技巧

### 技巧一：纯 CSS 图片对比滑块

```css
.comparison {
  position: relative;
  width: 600px;
  height: 400px;
}

.comparison img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.comparison .after {
  clip-path: inset(0 50% 0 0);
  filter: contrast(1.2) saturate(1.3);
}
```

### 技巧二：文字镂空效果

```css
.text-cutout {
  background: url('bg.jpg') center/cover;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
}
```

### 技巧三：双重曝光效果

```css
.double-exposure {
  position: relative;
  width: 400px;
  height: 400px;
}

.double-exposure img:first-child {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.double-exposure img:last-child {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  mix-blend-mode: screen;
  filter: grayscale(1) contrast(1.5);
}
```

### 技巧四：霓虹发光效果

```css
.neon-text {
  color: #fff;
  text-shadow:
    0 0 5px #fff,
    0 0 10px #fff,
    0 0 20px #ff00de,
    0 0 40px #ff00de,
    0 0 80px #ff00de;
  filter: drop-shadow(0 0 10px #ff00de);
}
```

### 技巧五：老照片效果

```css
.vintage-photo {
  filter: sepia(0.6) contrast(1.2) brightness(0.9) saturate(0.8);
  position: relative;
}

.vintage-photo::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 50%, rgba(139, 69, 19, 0.3) 100%);
  pointer-events: none;
}
```

---

## 参考资料

- [MDN: mix-blend-mode](https://developer.mozilla.org/zh-CN/docs/Web/CSS/mix-blend-mode)
- [MDN: filter](https://developer.mozilla.org/zh-CN/docs/Web/CSS/filter)
- [MDN: backdrop-filter](https://developer.mozilla.org/zh-CN/docs/Web/CSS/backdrop-filter)
- [CSS-Tricks: blend-modes](https://css-tricks.com/basics-css-blend-modes/)
