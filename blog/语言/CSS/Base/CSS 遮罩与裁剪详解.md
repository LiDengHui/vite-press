---
title: CSS 遮罩与裁剪详解
date: 2025-04-29
tags:
  - CSS
  - 遮罩
  - 裁剪
categories:
  - 技术文档
  - 前端
  - CSS
  - 视觉表现
---

# CSS 遮罩与裁剪详解

[[toc]]

遮罩（Masking）和裁剪（Clipping）是 CSS 中用于控制元素可见区域的两大技术。遮罩通过透明度信息隐藏部分元素，裁剪则通过几何路径直接切割显示区域。

---

## 裁剪（clip-path）

### 基础形状函数

```css
/* 圆形裁剪 */
.circle {
  clip-path: circle(50% at 50% 50%);
}

/* 椭圆裁剪 */
.ellipse {
  clip-path: ellipse(100px 50px at center);
}

/* 内嵌矩形 */
.inset {
  clip-path: inset(10px 20px 30px 40px round 10px);
}

/* 多边形 */
.polygon {
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}
```

### SVG 路径裁剪

```css
/* 引用 SVG 路径 */
.svg-clip {
  clip-path: url(#myClipPath);
}
```

```xml
<svg width="0" height="0">
  <defs>
    <clipPath id="myClipPath" clipPathUnits="objectBoundingBox">
      <path d="M0.5,0 L1,0.5 L0.5,1 L0,0.5 Z" />
    </clipPath>
  </defs>
</svg>
```

### 常用裁剪形状

```css
/* 六边形头像 */
.hexagon {
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}

/* 箭头形状 */
.arrow {
  clip-path: polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%);
}

/* 对话气泡 */
.bubble {
  clip-path: polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%);
}
```

### 动画裁剪

```css
.reveal {
  clip-path: inset(0 100% 0 0);
  transition: clip-path 0.5s ease;
}

.reveal:hover {
  clip-path: inset(0 0 0 0);
}
```

---

## 遮罩（mask）

### 基础遮罩

```css
/* 使用图片作为遮罩（透明区域隐藏） */
.mask-image {
  mask-image: url(mask.png);
  -webkit-mask-image: url(mask.png);
  mask-size: cover;
  -webkit-mask-size: cover;
}
```

### 渐变遮罩

```css
/* 线性渐变遮罩 - 渐隐效果 */
.fade-bottom {
  mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
}

/* 径向渐变遮罩 - 圆形渐隐 */
.fade-circle {
  mask-image: radial-gradient(circle, black 40%, transparent 70%);
  -webkit-mask-image: radial-gradient(circle, black 40%, transparent 70%);
}
```

### 遮罩属性详解

```css
.mask {
  /* 遮罩图片 */
  mask-image: url(mask.png);
  -webkit-mask-image: url(mask.png);
  
  /* 遮罩模式（类似 background-repeat） */
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
  
  /* 遮罩位置 */
  mask-position: center;
  -webkit-mask-position: center;
  
  /* 遮罩大小 */
  mask-size: contain;
  -webkit-mask-size: contain;
  
  /* 遮罩合成模式 */
  mask-composite: intersect;
  -webkit-mask-composite: source-in;
}
```

### 多重遮罩

```css
.multiple-masks {
  mask-image:
    linear-gradient(to right, transparent, black 20%, black 80%, transparent),
    linear-gradient(to bottom, black 50%, transparent);
  -webkit-mask-image:
    linear-gradient(to right, transparent, black 20%, black 80%, transparent),
    linear-gradient(to bottom, black 50%, transparent);
  mask-composite: intersect;
  -webkit-mask-composite: source-in;
}
```

---

## 遮罩类型

### mask-mode

```css
/* 根据图片亮度决定遮罩（默认） */
.luminance-mask {
  mask-mode: luminance;
  -webkit-mask-mode: luminance;
}

/* 根据 Alpha 通道决定遮罩 */
.alpha-mask {
  mask-mode: alpha;
  -webkit-mask-mode: alpha;
}
```

---

## 实战案例

### 图片渐变叠加

```css
.gradient-overlay {
  position: relative;
}

.gradient-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  pointer-events: none;
}
```

### 文字遮罩图片

```css
.text-mask {
  font-size: 100px;
  font-weight: bold;
  background: url(image.jpg) center/cover;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### 镂空文字效果

```css
.cutout-text {
  background: url(image.jpg) center/cover;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| clip-path | 55+ | 9.1+ | 3.5+ | 79+ |
| clip-path: path() | 88+ | 不支持 | 3.5+ | 88+ |
| mask-image | 1+ (前缀) | 4+ (前缀) | 53+ | 79+ |
| mask-mode | 120+ | 不支持 | 53+ | 120+ |

---

## 奇淫技巧

### 技巧一：纯 CSS 圆形头像

```css
.avatar {
  clip-path: circle(50%);
}
```

### 技巧二：图片斜切效果

```css
.skewed {
  clip-path: polygon(0 0, 100% 0, 85% 100%, 0% 100%);
}
```

### 技巧三：滚动渐隐

```css
.scroll-fade {
  mask-image: linear-gradient(
    to bottom,
    transparent,
    black 10%,
    black 90%,
    transparent
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent,
    black 10%,
    black 90%,
    transparent
  );
}
```

### 技巧四：图片边缘羽化

```css
.feathered {
  mask-image: radial-gradient(ellipse at center, black 60%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse at center, black 60%, transparent 100%);
}
```

### 技巧五：SVG 路径动画

```css
.animated-clip {
  clip-path: circle(0% at 50% 50%);
  animation: expand 2s forwards;
}

@keyframes expand {
  to {
    clip-path: circle(75% at 50% 50%);
  }
}
```

---

## 参考资料

- [MDN clip-path](https://developer.mozilla.org/zh-CN/docs/Web/CSS/clip-path)
- [MDN mask](https://developer.mozilla.org/zh-CN/docs/Web/CSS/mask)
- [CSS-Tricks: Clipping and Masking in CSS](https://css-tricks.com/clipping-masking-css/)
