---
title: CSS 背景高级技巧
date: 2025-04-29
tags:
  - CSS
  - 背景
  - 前端
  - 技巧
categories:
  - 技术文档
  - 前端
  - CSS
  - 视觉表现
---

# CSS 背景高级技巧

[[toc]]

CSS `background` 远不止设置一张图片或纯色。掌握高级背景技巧，可以创造出纹理、渐变遮罩、动态视差等丰富视觉效果。

---

## 多重背景

### 叠加多个背景

```css
.hero {
  background:
    linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,0,0,0.3)),
    url('texture.png'),
    url('photo.jpg');
  background-size: cover, 100px 100px, cover;
  background-position: center, 0 0, center;
  background-repeat: no-repeat, repeat, no-repeat;
}
```

**规则**：第一个背景在最上层，后续依次叠加。

### 混合模式背景

```css
.blend-bg {
  background:
    linear-gradient(45deg, #ff6b6b, #4ecdc4),
    url('pattern.png');
  background-blend-mode: multiply;
}
```

| 混合模式 | 效果 |
|---------|------|
| `multiply` | 正片叠底，变暗 |
| `screen` | 滤色，变亮 |
| `overlay` | 叠加，增强对比 |
| `soft-light` | 柔光，柔和效果 |
| `difference` | 差值，反色效果 |

---

## background-clip 高级用法

### 文字裁剪背景

```css
.text-clip {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-size: 4rem;
  font-weight: bold;
}
```

### 内边距框裁剪

```css
.padding-clip {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-clip: padding-box;
  border: 10px dashed rgba(255,255,255,0.3);
  padding: 2rem;
}
```

### 内容框裁剪

```css
.content-clip {
  background: url('image.jpg') center/cover;
  background-clip: content-box;
  padding: 20px;
  border: 5px solid #ddd;
}
```

---

## 动态背景效果

### 渐变动画背景

```css
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animated-bg {
  background: linear-gradient(
    -45deg,
    #ee7752,
    #e73c7e,
    #23a6d5,
    #23d5ab
  );
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
}
```

### 网格背景

```css
.grid-bg {
  background-image:
    linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}
```

### 点阵背景

```css
.dot-bg {
  background-image: radial-gradient(circle, #ddd 1px, transparent 1px);
  background-size: 20px 20px;
}
```

### 对角线背景

```css
.diagonal-bg {
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(0,0,0,0.03) 10px,
    rgba(0,0,0,0.03) 20px
  );
}
```

---

## 高级遮罩技巧

### 渐变遮罩

```css
.fade-mask {
  background: url('photo.jpg') center/cover;
  mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
}
```

### 形状遮罩

```css
.circle-mask {
  background: url('photo.jpg') center/cover;
  mask-image: radial-gradient(circle, black 60%, transparent 100%);
  -webkit-mask-image: radial-gradient(circle, black 60%, transparent 100%);
}
```

### 文字遮罩

```css
.text-mask {
  background: url('texture.jpg');
  background-size: cover;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-size: 6rem;
  font-weight: 900;
}
```

---

## CSS 图案生成

### 棋盘格

```css
.checkerboard {
  background-image:
    linear-gradient(45deg, #ccc 25%, transparent 25%),
    linear-gradient(-45deg, #ccc 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #ccc 75%),
    linear-gradient(-45deg, transparent 75%, #ccc 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}
```

### 条纹背景

```css
.stripes {
  background: repeating-linear-gradient(
    45deg,
    #606dbc,
    #606dbc 10px,
    #465298 10px,
    #465298 20px
  );
}
```

### 波点背景

```css
.polka {
  background:
    radial-gradient(#f6f6f6 20%, transparent 20%),
    radial-gradient(#f6f6f6 20%, transparent 20%);
  background-color: #e8e8e8;
  background-position: 0 0, 25px 25px;
  background-size: 50px 50px;
}
```

---

## 视差背景

### 固定背景视差

```css
.parallax-section {
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  min-height: 500px;
}
```

### 多层视差

```css
.parallax-layer {
  position: relative;
  overflow: hidden;
}

.parallax-layer::before {
  content: '';
  position: absolute;
  top: -10%;
  left: -10%;
  width: 120%;
  height: 120%;
  background: url('bg.jpg') center/cover;
  will-change: transform;
}
```

```js
// 配合 JS 实现滚动视差
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  document.querySelector('.parallax-layer::before').style.transform =
    `translateY(${scrolled * 0.5}px)`;
});
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| 多重背景 | 1+ | 1.3+ | 3.6+ | 9+ |
| background-blend-mode | 35+ | 7.1+ | 30+ | 79+ |
| background-clip: text | 4+ (前缀) | 4+ (前缀) | 4+ (前缀) | 12+ |
| mask-image | 1+ (前缀) | 4+ (前缀) | 53+ | 12+ (前缀) |
| background-attachment: fixed | 1+ | 支持 | 支持 | 支持 |

---

## 奇淫技巧

### 技巧一：边框渐变背景

```css
.gradient-border {
  background:
    linear-gradient(white, white) padding-box,
    linear-gradient(45deg, #ff6b6b, #4ecdc4) border-box;
  border: 3px solid transparent;
  border-radius: 12px;
}
```

### 技巧二：图片暗角效果

```css
.vignette {
  background:
    radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.8) 100%),
    url('photo.jpg') center/cover;
}
```

### 技巧三：毛玻璃效果

```css
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

### 技巧四：重复锥形渐变图案

```css
.conic-pattern {
  background: repeating-conic-gradient(
    from 0deg,
    #fff 0deg 10deg,
    #000 10deg 20deg
  );
}
```

### 技巧五：CSS 噪点纹理

```css
.noise {
  background:
    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)' opacity='0.1'/%3E%3C/svg%3E"),
    linear-gradient(135deg, #667eea, #764ba2);
}
```

---

## 参考资料

- [MDN background](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background)
- [CSS-Tricks: Almanac: Background](https://css-tricks.com/almanac/properties/b/background/)
- [CSS Patterns Gallery](https://projects.verou.me/css3patterns/)
