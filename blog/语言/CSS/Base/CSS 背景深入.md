---
title: CSS 背景深入
date: 2025-04-29
tags:
  - CSS
  - 背景
categories:
  - 技术文档
  - 前端
  - CSS
  - 视觉表现
---

# CSS 背景深入

[[toc]]

CSS 背景系统提供了丰富的视觉控制能力，从单一颜色到复杂的多层渐变、图案生成，再到现代背景合成模式。本文全面讲解背景相关的所有重要属性。

---

## 基础属性

### background-color

```css
/* 基础颜色 */
.bg-solid {
  background-color: #3498db;
}

/* 半透明 */
.bg-transparent {
  background-color: rgba(52, 152, 219, 0.5);
  background-color: rgb(52 152 219 / 50%);
}

/* currentColor */
.bg-current {
  color: #3498db;
  background-color: currentColor;
}
```

### background-image

```css
/* 图片背景 */
.bg-image {
  background-image: url('photo.jpg');
}

/* 渐变背景 */
.bg-gradient {
  background-image: linear-gradient(to right, red, blue);
}

/* 多张背景 */
.bg-multi {
  background-image:
    url('overlay.png'),
    url('pattern.png'),
    linear-gradient(to bottom, #667eea, #764ba2);
}
```

---

## 背景定位

### background-position

```css
/* 关键词 */
.pos-keyword {
  background-position: center top;
  background-position: right bottom;
}

/* 数值 */
.pos-value {
  background-position: 50% 50%;
  background-position: 100px 50px;
}

/* 偏移 */
.pos-offset {
  background-position: right 20px bottom 10px;
}
```

### background-size

```css
/* 关键词 */
.size-cover {
  background-size: cover;      /* 覆盖整个区域 */
}

.size-contain {
  background-size: contain;    /* 完整显示 */
}

/* 数值 */
.size-fixed {
  background-size: 100px 50px;
}

.size-percent {
  background-size: 100% 100%;
}

/* 等比缩放 */
.size-auto {
  background-size: auto 100%;
}
```

---

## 背景重复与裁剪

### background-repeat

```css
/* 基础值 */
.repeat { background-repeat: repeat; }
.no-repeat { background-repeat: no-repeat; }
.repeat-x { background-repeat: repeat-x; }
.repeat-y { background-repeat: repeat-y; }

/* 空间填充 */
.repeat-space {
  background-repeat: space;  /* 均匀分布 */
}

.repeat-round {
  background-repeat: round;  /* 等比缩放填充 */
}
```

### background-clip

```css
/* 裁剪到内容框 */
.clip-content {
  background-clip: content-box;
  padding: 20px;
}

/* 裁剪到内边距框（默认） */
.clip-padding {
  background-clip: padding-box;
}

/* 裁剪到边框框 */
.clip-border {
  background-clip: border-box;
}

/* 文字裁剪 */
.clip-text {
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
```

### background-origin

```css
/* 从内容框开始 */
.origin-content {
  background-origin: content-box;
}

/* 从内边距框开始（默认） */
.origin-padding {
  background-origin: padding-box;
}

/* 从边框框开始 */
.origin-border {
  background-origin: border-box;
}
```

---

## 背景附着

### background-attachment

```css
/* 随内容滚动（默认） */
.scroll {
  background-attachment: scroll;
}

/* 固定背景 */
.fixed-bg {
  background-attachment: fixed;
}

/* 局部固定 */
.local-bg {
  background-attachment: local;
}
```

### 视差效果

```css
.parallax {
  background-image: url('bg.jpg');
  background-attachment: fixed;
  background-size: cover;
  background-position: center;
  min-height: 100vh;
}
```

---

## 背景简写

```css
/* 顺序: color image position/size repeat origin clip attachment */
.shorthand {
  background: 
    linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
    url('bg.jpg') center/cover no-repeat fixed;
}

/* 多张背景 */
.multi-bg {
  background:
    url('icon.png') 20px 20px / 50px 50px no-repeat,
    url('pattern.png') center / 200px repeat,
    linear-gradient(135deg, #667eea, #764ba2);
}
```

---

## 高级渐变

### 重复渐变

```css
/* 条纹 */
.stripes {
  background: repeating-linear-gradient(
    45deg,
    #333 0px,
    #333 10px,
    #666 10px,
    #666 20px
  );
}

/* 网格 */
.grid-pattern {
  background:
    repeating-linear-gradient(0deg, transparent, transparent 19px, #ddd 19px, #ddd 20px),
    repeating-linear-gradient(90deg, transparent, transparent 19px, #ddd 19px, #ddd 20px);
}
```

### 锥形渐变

```css
/* 饼图 */
.pie-chart {
  background: conic-gradient(
    #3498db 0deg 90deg,
    #2ecc71 90deg 180deg,
    #e74c3c 180deg 270deg,
    #f39c12 270deg 360deg
  );
  border-radius: 50%;
}

/* 色轮 */
.color-wheel {
  background: conic-gradient(
    from 0deg at 50% 50%,
    red, yellow, green, blue, red
  );
}
```

### 多层渐变混合

```css
.complex-gradient {
  background:
    radial-gradient(circle at 20% 80%, rgba(255,0,0,0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(0,0,255,0.3) 0%, transparent 50%),
    linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| background-clip: text | 1+ | 3+ | 49+ | 12+ |
| conic-gradient() | 69+ | 12.1+ | 83+ | 79+ |
| repeating-conic-gradient() | 69+ | 12.1+ | 83+ | 79+ |
| background-position offset | 25+ | 7+ | 13+ | 12+ |

---

## 奇淫技巧

### 技巧一：纯 CSS 棋盘格

```css
.checkerboard {
  background:
    repeating-conic-gradient(#f0f0f0 0% 25%, white 0% 50%) 
    50% / 40px 40px;
}
```

### 技巧二：点阵背景

```css
.dots {
  background-image: radial-gradient(circle, #ddd 1px, transparent 1px);
  background-size: 20px 20px;
}
```

### 技巧三：对角线图案

```css
.diagonal-lines {
  background: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 10px,
    #e0e0e0 10px,
    #e0e0e0 11px
  );
}
```

### 技巧四：动态渐变背景

```css
.animated-bg {
  background: linear-gradient(
    -45deg,
    #ee7752, #e73c7e, #23a6d5, #23d5ab
  );
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

### 技巧五：玻璃拟态背景

```css
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

---

## 参考资料

- [MDN: background](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background)
- [MDN: CSS Gradients](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_images/Using_CSS_gradients)
- [CSS-Tricks: A Complete Guide to CSS Gradients](https://css-tricks.com/a-complete-guide-to-css-gradients/)
