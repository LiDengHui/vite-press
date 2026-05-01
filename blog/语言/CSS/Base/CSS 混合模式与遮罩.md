---
title: CSS 混合模式与遮罩
date: 2025-04-29
tags:
  - CSS
  - 混合模式
  - 遮罩
categories:
  - 技术文档
  - 前端
  - CSS
  - 视觉表现
---

# CSS 混合模式与遮罩

混合模式（Blend Modes）和遮罩（Masking）让 CSS 具备图像处理能力，可以实现许多前端工程师以前只能用 Photoshop 做的效果。

---

## 一、mix-blend-mode 元素混合

控制元素与背景的混合方式：

```css
.blend-text {
    mix-blend-mode: difference; /* 白色文字在任意背景上都可见 */
    color: #fff;
}
```

### 常用模式

| 模式 | 效果 |
|------|------|
| `multiply` | 滤色模式，背景变暗，适合文字置于图片上 |
| `screen` | 滤色的反面，背景变亮 |
| `overlay` | 叠加，对比度增强 |
| `darken` | 保留两者中较暗的部分 |
| `lighten` | 保留两者中较亮的部分 |
| `difference` | 相减，适合高对比文字 |
| `exclusion` | 排除，比 difference 柔和 |
| `hue` | 保留底层明度/饱和度，用顶层色相 |
| `color` | 保留底层明度，用顶层色彩 |
| `luminosity` | 保留底层色相，用顶层明度 |

```css
/* 分隔线与图片融合 */
.separator {
    width: 100%;
    height: 100px;
    background: #ff6b6b;
    mix-blend-mode: multiply;
}
```

---

## 二、background-blend-mode 背景混合

多个背景图层之间的混合：

```css
.duotone {
    background:
        linear-gradient(45deg, #ff0055, #ffcc00),
        url('photo.jpg');
    background-blend-mode: overlay;
    background-size: cover;
}

/* 双色效果 */
.duotone-blue {
    background:
        linear-gradient(to right, #002266, #0066cc),
        url('photo.jpg');
    background-blend-mode: screen;
}
```

---

## 三、clip-path 裁剪路径

```css
/* 基本形状 */
.circle { clip-path: circle(50%); }
.ellipse { clip-path: ellipse(50% 30%); }
.inset { clip-path: inset(10% 20% 30% 40% round 20px); }

/* 多边形 */
.triangle {
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}
.pentagon {
    clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
}
.star {
    clip-path: polygon(
        50% 0%, 61% 35%, 98% 35%,
        68% 57%, 79% 91%, 50% 70%,
        21% 91%, 32% 57%, 2% 35%, 39% 35%
    );
}
```

### SVG 路径裁剪

```css
/* 使用 SVG 路径 */
.custom-shape {
    clip-path: url(#myClip);
}

/* 内联 SVG */
.clip-path-inline {
    clip-path: path('M 0 200 Q 100 0 200 200 Q 300 400 400 200');
}
```

### 动画裁剪

```css
.shape-animate {
    clip-path: circle(0% at 50% 50%);
    transition: clip-path 0.5s ease;
}
.shape-animate:hover {
    clip-path: circle(75% at 50% 50%);
}
```

---

## 四、mask 遮罩

```css
/* 用图片做遮罩 */
.masked {
    mask-image: url('mask.png');
    mask-size: cover;
    -webkit-mask-image: url('mask.png');
    -webkit-mask-size: cover;
}

/* 渐变遮罩 */
.fade-mask {
    mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
    -webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
}

/* 文字遮罩（用文字剪出图片） */
.text-mask {
    background: url('texture.jpg');
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}
```

### mask 属性一览

```css
.mask-composite {
    mask-image: url('mask1.svg'), url('mask2.svg');
    mask-mode: alpha, luminance;      /* alpha 或 luminance */
    mask-repeat: no-repeat;
    mask-position: center;
    mask-size: contain;
    mask-composite: add;              /* add, subtract, intersect, exclude */
}
```

---

## 奇淫技巧

### 技巧 1：文字背景剪切

```css
.gradient-text {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    font-weight: 900;
}
```

### 技巧 2：视差滚动 + clip-path 动画

```css
.reveal {
    clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
    transition: clip-path 0.8s cubic-bezier(0.77, 0, 0.175, 1);
}
.reveal.visible {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}
```

### 技巧 3：双色图片效果（无需 JS）

```css
.duotone-effect {
    position: relative;
}
.duotone-effect::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, #ff0055, #ffcc00);
    mix-blend-mode: multiply;
    pointer-events: none;
}
```

### 技巧 4：墨镜效果

```css
.ink-effect {
    background: url('photo.jpg');
    filter: grayscale(100%) contrast(200%);
    mix-blend-mode: multiply;
    background-blend-mode: screen;
}
```

### 技巧 5：圆形进度条

```css
.progress-ring {
    background: conic-gradient(
        #1890ff var(--progress, 0%),
        #e0e0e0 var(--progress, 0%)
    );
    border-radius: 50%;
    mask-image: radial-gradient(transparent 60%, black 61%);
    -webkit-mask-image: radial-gradient(transparent 60%, black 61%);
}
```

### 技巧 6：文字遮罩裁剪（文字洞）

```css
.cutout-text {
    background: url('bg.jpg');
    background-size: cover;
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
    font-size: 120px;
    font-weight: 900;
}
```

### 技巧 7：多边形文字环绕

```css
/* 结合 shape-outside 和 clip-path */
.polygon-wrap {
    width: 300px;
    height: 300px;
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
    shape-outside: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
    float: left;
}
```

### 技巧 8：混合模式实现暗色模式下自动反色

```css
.dark-mode-icon {
    mix-blend-mode: difference;
    color: white;
    position: fixed;
    top: 20px;
    right: 20px;
}
/* 无论背景是什么颜色，图标都保持高对比度 */
```

### 技巧 9：用 SVG filter 做遮罩

```css
.noise-mask {
    filter: url(#noise-filter);
}

/* SVG 内嵌在 HTML 中 */
<svg width="0" height="0">
    <filter id="noise-filter">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
            <feFuncA type="linear" slope="0.3" />
        </feComponentTransfer>
    </filter>
</svg>
```

### 技巧 10：动态混合模式

```css
/* 鼠标移入时切换混合模式 */
.gallery-item {
    transition: mix-blend-mode 0.3s;
}
.gallery-item:hover {
    mix-blend-mode: exclusion;
}
```

> 💡 **混合口诀**：元素混合用 `mix-blend-mode`，背景混合用 `background-blend-mode`，裁剪用 `clip-path`，遮罩用 `mask`，文字剪出用 `background-clip: text`。
