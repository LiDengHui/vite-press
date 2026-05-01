---
title: CSS 函数速查
date: 2025-04-29
tags:
  - CSS
  - 函数
categories:
  - 技术文档
  - 前端
  - CSS
  - 视觉表现
---

# CSS 函数速查

CSS 函数是现代样式语言的核心工具，涵盖颜色、数学、滤镜、字体、网格等多个领域。

---

## 一、颜色函数

```css
/* RGB */
color: rgb(255, 128, 0);
color: rgba(255, 128, 0, 0.5);

/* HSL */
color: hsl(30, 100%, 50%);
color: hsla(30, 100%, 50%, 0.5);

/* 现代颜色 */
color: color(srgb 1 0.5 0);
color: oklch(70% 0.2 45);
color: lab(70% 30 50);

/* 颜色混合 */
color: color-mix(in srgb, red 30%, blue 70%);

/* 颜色透明度 */
color: color(from #1890ff srgb r g b / 0.5);

/* 相对颜色 */
color: hsl(from var(--primary) h s calc(l + 10%));
```

---

## 二、数学函数

```css
/* 计算 */
width: calc(100% - 40px);
width: calc(var(--base) * 2 + 10px);

/* 最大值/最小值/中间值 */
width: max(50%, 300px);     /* 取较大值 */
width: min(100%, 800px);    /* 取较小值 */
width: clamp(200px, 50%, 600px); /* 限制范围 */

/* 绝对值 */
transform: translateX(abs(-50px)); /* 50px */

/* 四舍五入 */
width: round(33.3%, 1px);

/* 取模 */
left: mod(350px, 100px); /* 50px */

/* 符号函数 */
transform: scale(sign(-5)); /* -1 */
```

---

## 三、滤镜函数

```css
/* 模糊 */
filter: blur(5px);

/* 亮度 */
filter: brightness(1.2);  /* 120% */

/* 对比度 */
filter: contrast(150%);

/* 灰度 */
filter: grayscale(100%);

/* 色相旋转 */
filter: hue-rotate(90deg);

/* 反色 */
filter: invert(100%);

/* 透明度 */
filter: opacity(50%);

/* 饱和度 */
filter: saturate(200%);

/* 棕褐色 */
filter: sepia(100%);

/* 阴影 */
filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));

/* 组合 */
filter: blur(2px) brightness(1.1) contrast(1.2);
```

---

## 四、变换函数

```css
/* 平移 */
transform: translate(50px, 100px);
transform: translateX(50px);
transform: translateY(100px);
transform: translateZ(50px);
transform: translate3d(50px, 100px, 50px);

/* 缩放 */
transform: scale(1.5);
transform: scaleX(1.2);
transform: scale3d(1, 1.2, 1);

/* 旋转 */
transform: rotate(45deg);
transform: rotateX(45deg);
transform: rotateY(45deg);
transform: rotateZ(45deg);
transform: rotate3d(1, 1, 0, 45deg);

/* 倾斜 */
transform: skew(10deg, 5deg);
transform: skewX(10deg);

/* 矩阵 */
transform: matrix(a, b, c, d, e, f);
transform: matrix3d(...);

/* 透视 */
transform: perspective(500px);
```

---

## 五、背景函数

```css
/* 渐变 */
background: linear-gradient(45deg, red, blue);
background: linear-gradient(to right, red 0%, blue 100%);
background: radial-gradient(circle, red, blue);
background: conic-gradient(from 90deg, red, yellow, green, blue);
background: repeating-linear-gradient(45deg, #ccc 0 10px, #fff 10px 20px);

/* 图片 */
background-image: url('img.jpg');
background-image: image-set(
    url('img.avif') type('image/avif'),
    url('img.webp') type('image/webp')
);

/* 交叉淡化 */
background-image: cross-fade(50% url('a.jpg'), url('b.jpg'));
```

---

## 六、字体函数

```css
/* 变体 */
font-variation-settings: 'wght' 700, 'wdth' 100;

/* 字体回退 */
font-family: system-ui, -apple-system, sans-serif;

/* 本地字体 */
@font-face {
    font-family: 'Custom';
    src: local('Arial'), url('custom.woff2');
}
```

---

## 七、网格函数

```css
/* 重复 */
grid-template-columns: repeat(3, 1fr);
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));

/* 最小/最大 */
grid-template-columns: minmax(200px, 1fr);

/* 自适应 */
grid-template-columns: fit-content(300px);

/* 子网格 */
grid-template-columns: subgrid;
```

---

## 八、形状函数

```css
/* 圆 */
clip-path: circle(50% at 50% 50%);

/* 椭圆 */
clip-path: ellipse(50% 30% at 50% 50%);

/* 内嵌 */
clip-path: inset(10% 20% 30% 40% round 20px);

/* 多边形 */
clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);

/* 路径 */
clip-path: path('M 0 0 L 100 0 L 50 100 Z');

/* 形状 */
shape-outside: circle(50%);
shape-outside: ellipse(50% 30%);
shape-outside: polygon(0 0, 100% 0, 50% 100%);
```

---

## 九、其他实用函数

```css
/* 元素查询 */
@container (width > 400px) { }

/* 媒体查询 */
@media (width >= 768px) { }

/* 计数器 */
content: counter(item);
content: counters(section, ".");

/* 引用 */
content: open-quote;
content: close-quote;

/* 属性值 */
content: attr(data-label);
content: attr(href url);

/* 环境变量 */
padding: env(safe-area-inset-top);

/* URL */
mask-image: url('mask.svg');

/* 字符串拼接 */
content: "第 " counter(page) " 页";
```

---

## 奇淫技巧

### 技巧 1：用 calc 做响应式间距

```css
:root {
    --space: calc(8px + 1vw);
}
.gap { gap: var(--space); }
```

### 技巧 2：clamp 做流体排版

```css
h1 { font-size: clamp(1.5rem, 5vw, 3rem); }
```

### 技巧 3：min/max 做弹性布局

```css
.sidebar { width: max(200px, 25%); }
.main { width: min(800px, 100%); }
```

### 技巧 4：conic-gradient 做饼图

```css
.pie {
    width: 100px; height: 100px;
    border-radius: 50%;
    background: conic-gradient(
        #ff6b6b 0% 33%,
        #4ecdc4 33% 66%,
        #45b7d1 66% 100%
    );
}
```

### 技巧 5：repeating-linear-gradient 做条纹

```css
.stripe {
    background: repeating-linear-gradient(
        45deg,
        #f0f0f0 0 10px,
        #fff 10px 20px
    );
}
```

### 技巧 6：image-set 响应式图片

```css
.banner {
    background-image: image-set(
        url('banner.avif') type('image/avif'),
        url('banner.webp') type('image/webp'),
        url('banner.jpg') type('image/jpeg')
    );
}
```

### 技巧 7：attr 做动态内容

```css
[data-tooltip]::after {
    content: attr(data-tooltip);
}
```

### 技巧 8：env 做安全区适配

```css
.safe-area {
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
}
```

### 技巧 9：color-mix 做主题色派生

```css
:root {
    --primary: #1890ff;
    --primary-light: color-mix(in srgb, var(--primary), white 30%);
    --primary-dark: color-mix(in srgb, var(--primary), black 20%);
}
```

### 技巧 10：linear-gradient 做透明遮罩

```css
.fade-bottom {
    mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
    -webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
}
```

> 💡 **函数口诀**：颜色用 oklch，计算用 calc，范围用 clamp，渐变用 conic，图片用 image-set，安全区用 env。
