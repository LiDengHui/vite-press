---
title: CSS 裁剪路径与形状
date: 2025-04-29
tags:
  - CSS
  - 裁剪
  - 形状
categories:
  - 技术文档
  - 前端
  - CSS
  - 视觉表现
---

# CSS 裁剪路径与形状

[[toc]]

CSS `clip-path` 和 `shape-outside` 允许创建任意形状，突破传统矩形的限制，实现更具创意的排版和视觉效果。

---

## clip-path 基础

### 基本形状函数

```css
/* 圆形 */
.circle {
  clip-path: circle(50% at 50% 50%);
}

/* 椭圆 */
.ellipse {
  clip-path: ellipse(40% 50% at 50% 50%);
}

/* 内插矩形（圆角矩形） */
.inset {
  clip-path: inset(10% 20% 30% 40% round 10px);
}

/* 多边形 */
.polygon {
  clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
}
```

### 常用多边形

```css
/* 三角形 */
.triangle {
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}

/* 五边形 */
.pentagon {
  clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
}

/* 六边形 */
.hexagon {
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
}

/* 星形 */
.star {
  clip-path: polygon(
    50% 0%, 61% 35%, 98% 35%,
    68% 57%, 79% 91%, 50% 70%,
    21% 91%, 32% 57%, 2% 35%, 39% 35%
  );
}

/* 菱形 */
.diamond {
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}

/* 箭头 */
.arrow {
  clip-path: polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%);
}
```

---

## 高级裁剪

### SVG 路径

```css
/* 使用 SVG 路径 */
.svg-path {
  clip-path: path('M0,0 L100,0 L100,100 Z');
}

/* 引用外部 SVG */
.svg-clip {
  clip-path: url('#myClipPath');
}
```

```html
<svg width="0" height="0">
  <defs>
    <clipPath id="myClipPath" clipPathUnits="objectBoundingBox">
      <circle cx="0.5" cy="0.5" r="0.5" />
    </clipPath>
  </defs>
</svg>
```

### 动画裁剪

```css
.morphing {
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  animation: morph 3s ease-in-out infinite;
}

@keyframes morph {
  0%, 100% {
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  }
  50% {
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
  }
}
```

---

## 形状环绕

### shape-outside

```css
/* 圆形环绕 */
.circle-wrap {
  float: left;
  width: 200px;
  height: 200px;
  shape-outside: circle(50%);
  clip-path: circle(50%);
}

/* 椭圆环绕 */
.ellipse-wrap {
  float: left;
  width: 300px;
  height: 200px;
  shape-outside: ellipse(50% 50%);
  clip-path: ellipse(50% 50%);
}

/* 多边形环绕 */
.polygon-wrap {
  float: left;
  width: 200px;
  height: 200px;
  shape-outside: polygon(0 0, 100% 0, 100% 100%);
  clip-path: polygon(0 0, 100% 0, 100% 100%);
}
```

### shape-margin 与 shape-image-threshold

```css
.shape-text {
  float: left;
  width: 200px;
  height: 200px;
  shape-outside: circle(50%);
  shape-margin: 20px;  /* 形状与文字间距 */
}

/* 基于图片透明度的形状 */
.image-shape {
  float: left;
  width: 300px;
  height: 300px;
  shape-outside: url('shape.png');
  shape-image-threshold: 0.5;  /* 透明度阈值 */
}
```

---

## 实战应用

### 圆形头像

```css
.avatar {
  width: 100px;
  height: 100px;
  clip-path: circle(50%);
  object-fit: cover;
}

/* 带边框的圆形头像 */
.avatar-bordered {
  position: relative;
  width: 100px;
  height: 100px;
}

.avatar-bordered img {
  width: 100%;
  height: 100%;
  clip-path: circle(50%);
  object-fit: cover;
}

.avatar-bordered::after {
  content: '';
  position: absolute;
  inset: 0;
  border: 3px solid #3498db;
  border-radius: 50%;
  pointer-events: none;
}
```

### 不规则卡片

```css
.irregular-card {
  position: relative;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  clip-path: polygon(
    0 20px, 20px 0,
    calc(100% - 20px) 0, 100% 20px,
    100% calc(100% - 20px), calc(100% - 20px) 100%,
    20px 100%, 0 calc(100% - 20px)
  );
}
```

### 文字环绕图片

```css
.float-shape {
  float: left;
  width: 200px;
  height: 200px;
  shape-outside: url('leaf.png');
  shape-margin: 15px;
}

.article {
  max-width: 600px;
}

.article p {
  text-align: justify;
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| clip-path | 55+ | 9.1+ | 3.5+ | 79+ |
| clip-path: path() | 88+ | 13.1+ | 88+ | 88+ |
| shape-outside | 37+ | 10.1+ | 62+ | 79+ |
| shape-image-threshold | 37+ | 10.1+ | 62+ | 79+ |

---

## 奇淫技巧

### 技巧一：波浪裁剪

```css
.wave {
  clip-path: polygon(
    0% 0%,
    100% 0%,
    100% calc(100% - 50px),
    75% 100%,
    50% calc(100% - 50px),
    25% 100%,
    0% calc(100% - 50px)
  );
}
```

### 技巧二：斜角卡片

```css
.diagonal-card {
  clip-path: polygon(
    0 0,
    100% 0,
    100% calc(100% - 40px),
    calc(100% - 40px) 100%,
    0 100%
  );
}
```

### 技巧三：图片遮罩文字

```css
.text-mask {
  font-size: 5rem;
  font-weight: bold;
  background: url('photo.jpg') center/cover;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  clip-path: none;  /* 确保文字完整显示 */
}
```

### 技巧四：滚动视差形状

```css
.parallax-shape {
  clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
  background-attachment: fixed;
}
```

### 技巧五：鼠标跟随裁剪

```css
.cursor-clip {
  clip-path: circle(80px at var(--x, 50%) var(--y, 50%));
  transition: clip-path 0.1s;
}
```

```javascript
document.querySelector('.cursor-clip').addEventListener('mousemove', (e) => {
  const rect = e.target.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  e.target.style.setProperty('--x', `${x}%`);
  e.target.style.setProperty('--y', `${y}%`);
});
```

---

## 参考资料

- [MDN: clip-path](https://developer.mozilla.org/zh-CN/docs/Web/CSS/clip-path)
- [MDN: shape-outside](https://developer.mozilla.org/zh-CN/docs/Web/CSS/shape-outside)
- [CSS-Tricks: clip-path](https://css-tricks.com/almanac/properties/c/clip-path/)
- [CSS Shapes Editor](https://chrome.google.com/webstore/detail/css-shapes-editor/)
