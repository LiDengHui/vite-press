---
title: CSS 滤镜
date: 2025-04-29
tags:
  - CSS
  - 滤镜
  - 前端
categories:
  - 技术文档
  - 前端
  - CSS
  - 视觉表现
---

# CSS 滤镜

CSS滤镜（Filter）属性提供了强大的视觉效果处理能力，允许对元素（如图片、背景等）应用图形特效。以下是常用滤镜函数及示例：

## 1. **模糊效果 `blur()`**

```css
.blur {
    filter: blur(5px);
}
```

```html
<div class="blur" style="background: url('image.jpg'); width: 200px; height: 200px;"></div>
```

**效果**：元素模糊（5px半径）。

## 2. **亮度调整 `brightness()`**

```css
.bright {
    filter: brightness(150%); /* >100% 更亮 */
}
.dark {
    filter: brightness(50%); /* <100% 更暗 */
}
```

**效果**：增加或降低元素亮度。

## 3. **对比度调整 `contrast()`**

```css
.high-contrast {
    filter: contrast(200%); /* 增强对比度 */
}
.low-contrast {
    filter: contrast(50%); /* 降低对比度 */
}
```

## 4. **阴影效果 `drop-shadow()`**

```css
.shadow {
    filter: drop-shadow(10px 10px 5px rgba(0, 0, 0, 0.7));
}
```

**参数**：`x偏移 y偏移 模糊半径 颜色`（类似 `box-shadow`）。

## 5. **灰度转换 `grayscale()`**

```css
.grayscale {
    filter: grayscale(100%); /* 0%彩色 → 100%黑白 */
}
```

## 6. **色调旋转 `hue-rotate()`**

```css
.hue-rotate {
    filter: hue-rotate(90deg); /* 颜色相位旋转 */
}
```

**效果**：元素整体色相变化（0°~360°）。

## 7. **反相颜色 `invert()`**

```css
.invert {
    filter: invert(100%); /* 完全颜色反转 */
}
```

## 8. **透明度 `opacity()`**

```css
.translucent {
    filter: opacity(30%); /* 类似 opacity 属性 */
}
```

**注意**：与 `opacity` 属性不同，某些浏览器中滤镜性能更优。

## 9. **饱和度 `saturate()`**

```css
.high-saturation {
    filter: saturate(300%); /* 增强色彩鲜艳度 */
}
.desaturate {
    filter: saturate(20%); /* 降低饱和度 */
}
```

## 10. **深褐色调 `sepia()`**

```css
.sepia {
    filter: sepia(100%); /* 复古棕褐色效果 */
}
```

## 组合多个滤镜

```css
.multiple-filters {
    filter: contrast(120%) brightness(110%) drop-shadow(2px 2px 4px black);
}
```

**规则**：多个滤镜空格分隔，按声明顺序依次应用。

## 示例：复古照片效果

```css
.vintage {
    filter: sepia(80%) contrast(110%) brightness(90%) hue-rotate(-10deg);
}
```

```html
<img src="photo.jpg" class="vintage" alt="复古风格" />
```

## 浏览器支持

- 现代浏览器（Chrome, Firefox, Edge, Safari）均支持
- IE 不支持，可加 `-ms-filter` 前缀兼容旧版（部分功能）

---

## 奇淫技巧

### 技巧 1：毛玻璃效果（Backdrop Blur）

```css
.glass {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);  /* 滤镜应用于背景 */
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 16px;
}
```

### 技巧 2：图片悬停变彩色

```css
.photo {
    filter: grayscale(100%);
    transition: filter 0.3s;
}
.photo:hover {
    filter: grayscale(0%) saturate(120%);
}
```

### 技巧 3：暗色模式切换

```css
.dark-mode img {
    filter: brightness(0.8) contrast(1.2);
}
```

### 技巧 4：文字投影滤镜

```css
.neon-text {
    color: #fff;
    filter: drop-shadow(0 0 5px #0ff)
            drop-shadow(0 0 10px #0ff)
            drop-shadow(0 0 20px #00f);
}
```

### 技巧 5：图片亮度遮罩

```css
.overlay {
    position: relative;
}
.overlay::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.3);
    backdrop-filter: blur(2px);
}
```

### 技巧 6：复古照片效果

```css
.vintage-photo {
    filter: sepia(60%) contrast(110%) brightness(90%)
            saturate(85%) hue-rotate(-10deg);
}
```

### 技巧 7：图片加载前占位色

```css
img {
    background: #e0e0e0;
    filter: blur(0px); /* 确保加载前有统一色块 */
}
```

### 技巧 8：用 CSS 滤镜做图片缩略图效果

```css
.thumbnail {
    width: 200px;
    filter: contrast(120%) saturate(110%);
    transition: filter 0.3s;
}
.thumbnail:hover {
    filter: none;
}
```

### 技巧 9：处理图片加载失败

```css
img {
    position: relative;
}
img::after {
    content: attr(alt);
    position: absolute;
    inset: 0;
    background: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    filter: grayscale(100%);
}
```

### 技巧 10：滚动时模糊背景

```css
.hero {
    background-image: url('bg.jpg');
    background-attachment: fixed;
}
.hero.scrolled {
    filter: blur(5px);
    transition: filter 0.3s;
}
```

> 💡 **总结**：
> - `filter` 滤镜应用于元素本身
> - `backdrop-filter` 滤镜应用于元素背后的内容
> - 多个滤镜可以链式组合
> - 滚动时模糊背景很适合做模态框遮罩
