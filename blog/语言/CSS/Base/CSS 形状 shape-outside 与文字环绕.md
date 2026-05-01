---
title: CSS 形状 shape-outside 与文字环绕
date: 2025-04-29
tags:
  - CSS
  - shape-outside
  - 视觉效果
  - 形状
categories:
  - 技术文档
  - 前端
  - CSS
  - 视觉表现
---

# CSS 形状 shape-outside 与文字环绕

[[toc]]

`shape-outside` 让浮动元素不再局限于矩形，文本可以环绕任意几何形状流动，是实现杂志级排版效果的核心工具。

---

## 基本语法

```css
.float-shape {
  float: left;
  width: 200px;
  height: 200px;
  shape-outside: circle(50% at 50% 50%);
  /* 必须设置宽高，否则 shape 无法计算 */
}
```

| 函数 | 说明 |
|------|------|
| `circle(r at x y)` | 圆形 |
| `ellipse(rx ry at x y)` | 椭圆 |
| `polygon(x1 y1, x2 y2, ...)` | 多边形 |
| `inset(top right bottom left round r)` | 内边距形 |
| `url(#svg-shape)` | 引用 SVG 路径 |
| `margin-box` / `border-box` / `padding-box` / `content-box` | 盒模型边界 |

---

## 常用形状

### 圆形与椭圆环绕

```css
.avatar-float {
  float: left;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  shape-outside: circle(50%);
  margin-right: 1.5rem;
}
```

### 多边形环绕

```css
.diamond-float {
  float: left;
  width: 200px;
  height: 200px;
  shape-outside: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  margin-right: 1rem;
}
```

### 斜角卡片环绕

```css
.angled-float {
  float: right;
  width: 250px;
  height: 300px;
  shape-outside: polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%);
  clip-path: polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%);
  margin-left: 1.5rem;
}
```

---

## shape-margin 与 shape-image-threshold

### shape-margin

在形状周围添加"气垫"，让文字与形状保持间距：

```css
.float-circle {
  float: left;
  shape-outside: circle(40%);
  shape-margin: 1rem; /* 文字与圆保持 1rem 距离 */
}
```

### shape-image-threshold

使用透明图片的 alpha 通道定义形状边界：

```html
<img src="cloud.png" class="float-cloud" alt="">
```

```css
.float-cloud {
  float: left;
  shape-outside: url('cloud.png');
  shape-image-threshold: 0.5; /* alpha > 0.5 的区域才构成形状 */
  shape-margin: 10px;
}
```

---

## 与 clip-path 联动

```css
.image-shape {
  float: left;
  width: 200px;
  height: 200px;
  /* 形状与视觉一致 */
  shape-outside: polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%);
  clip-path: polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%);
}
```

---

## 实际应用场景

### 场景一：杂志风格首字下沉 + 环绕

```css
.drop-cap {
  float: left;
  font-size: 4rem;
  line-height: 1;
  padding: 0.5rem;
  margin-right: 0.5rem;
  shape-outside: circle(50%);
  background: #4a90d9;
  color: white;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: grid;
  place-items: center;
}
```

### 场景二：不规则图片画廊文字穿插

```css
.gallery-item:nth-child(odd) {
  float: left;
  shape-outside: polygon(0 0, 90% 0, 100% 100%, 0 100%);
  clip-path: polygon(0 0, 90% 0, 100% 100%, 0 100%);
  margin-right: 1rem;
}

.gallery-item:nth-child(even) {
  float: right;
  shape-outside: polygon(10% 0, 100% 0, 100% 100%, 0 100%);
  clip-path: polygon(10% 0, 100% 0, 100% 100%, 0 100%);
  margin-left: 1rem;
}
```

### 场景三：左右交替的图文混排

```css
.article figure {
  width: 40%;
  margin: 0;
}

.article figure.left {
  float: left;
  margin-right: 2rem;
  shape-outside: margin-box;
  border-radius: 0 20px 20px 0;
  overflow: hidden;
}

.article figure.right {
  float: right;
  margin-left: 2rem;
  shape-outside: margin-box;
  border-radius: 20px 0 0 20px;
  overflow: hidden;
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| shape-outside | 37+ | 10.1+ | 62+ | 79+ |
| shape-margin | 37+ | 10.1+ | 62+ | 79+ |
| shape-image-threshold | 37+ | 10.1+ | 62+ | 79+ |

---

## 奇淫技巧

### 技巧一：CSS 变量动态形状

```css
.shape-float {
  --shape: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  shape-outside: var(--shape);
  clip-path: var(--shape);
  transition: --shape 0.5s;
}

.shape-float:hover {
  --shape: polygon(10% 0, 100% 10%, 90% 100%, 0 90%);
}
```

### 技巧二：与滚动动画联动

```css
.scrolled-shape {
  float: left;
  shape-outside: polygon(0 0, 100% 0, 100% var(--fill, 0%), 0 var(--fill, 0%));
  animation: fill-up linear;
  animation-timeline: view();
}

@keyframes fill-up {
  to { --fill: 100%; }
}
```

### 技巧三：多列环绕布局

```css
.masonry-shape {
  column-count: 2;
}

.masonry-shape img {
  float: left;
  width: 100%;
  shape-outside: polygon(0 0, 100% 0, 80% 100%, 0 100%);
  margin-bottom: 1rem;
}
```

---

## 参考资料

- [MDN shape-outside](https://developer.mozilla.org/zh-CN/docs/Web/CSS/shape-outside)
- [CSS Shapes Module Level 1](https://www.w3.org/TR/css-shapes/)
- [Can I Use: shape-outside](https://caniuse.com/css-shapes)
