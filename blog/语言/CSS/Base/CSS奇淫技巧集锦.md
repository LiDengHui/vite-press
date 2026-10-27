---
title: CSS 奇淫技巧集锦
date: 2025-04-29
tags:
  - CSS
  - 前端
  - 技巧
categories:
  - 技术文档
  - 前端
  - CSS
  - 基础入门
---

# CSS 奇淫技巧集锦

CSS 不只是排版工具，更是图形引擎。本文汇总了开发中最实用的 CSS "黑魔法"，帮助你用最少代码实现最酷效果。

---

## 一、居中方案大全

```css
/* === 方法1：Flex 居中（最推荐）=== */
.flex-center {
    display: flex;
    justify-content: center;   /* 水平 */
    align-items: center;       /* 垂直 */
}

/* === 方法2：Grid 居中（最简洁）=== */
.grid-center {
    display: grid;
    place-items: center;
}

/* === 方法3：绝对定位 + transform === */
.abs-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

/* === 方法4：绝对定位 + margin auto === */
.auto-center {
    position: absolute;
    inset: 0;
    margin: auto;
    width: fit-content;
    height: fit-content;
}

/* === 方法5：text-align + line-height（单行文字）=== */
.text-center {
    text-align: center;
    line-height: 200px;  /* 等于容器高度 */
}

/* === 方法6：table-cell === */
.table-center {
    display: table-cell;
    text-align: center;
    vertical-align: middle;
}
```

---

## 二、形状绘制

### 三角形

```css
.triangle-up {
    width: 0;
    height: 0;
    border-left: 50px solid transparent;
    border-right: 50px solid transparent;
    border-bottom: 100px solid red;
}

/* 现代方案：clip-path */
.triangle {
    width: 100px;
    height: 100px;
    background: red;
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}
```

### 对话框箭头

```css
.bubble {
    position: relative;
    background: #fff;
    border: 1px solid #ccc;
    padding: 16px;
    border-radius: 8px;
}
.bubble::after {
    content: '';
    position: absolute;
    bottom: -7px;
    left: 20px;
    width: 12px;
    height: 12px;
    background: #fff;
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    transform: rotate(45deg);
}
```

### 圆形进度条

```css
@property --progress {
    syntax: '<percentage>';
    inherits: false;
    initial-value: 0%;
}

.progress {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: conic-gradient(
        #1890ff var(--progress),
        #e0e0e0 var(--progress)
    );
    transition: --progress 0.3s;
}
.progress:hover {
    --progress: 75%;
}
```

---

## 三、文字特效

### 渐变文字

```css
.gradient-text {
    background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
```

### 文字镂空

```css
.outline-text {
    color: transparent;
    -webkit-text-stroke: 2px #1890ff;
}
```

### 文字发光

```css
.glow-text {
    color: #fff;
    text-shadow:
        0 0 10px #1890ff,
        0 0 20px #1890ff,
        0 0 40px #1890ff;
}
```

### 打字机效果

```css
.typewriter {
    overflow: hidden;
    white-space: nowrap;
    border-right: 2px solid;
    animation:
        typing 3s steps(30) forwards,
        blink 0.75s step-end infinite;
}

@keyframes typing { from { width: 0; } to { width: 100%; } }
@keyframes blink { 50% { border-color: transparent; } }
```

---

## 四、视觉效果

### 毛玻璃

```css
.glass {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px) saturate(180%);
    -webkit-backdrop-filter: blur(10px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.3);
}
```

### 背景渐变动画

```css
.animated-bg {
    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
}

@keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}
```

### 图片遮罩文字

```css
.text-mask {
    background: url('image.jpg') center/cover;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 5rem;
    font-weight: 900;
}
```

---

## 五、布局技巧

### 粘性页脚

```css
html { height: 100%; }
body {
    min-height: 100%;
    display: flex;
    flex-direction: column;
}
main { flex: 1; }
footer { flex-shrink: 0; }
```

### 图片保持比例（旧浏览器兼容）

```css
/* padding-bottom hack（aspect-ratio 出来之前的方案） */
.ratio-16-9 {
    position: relative;
    width: 100%;
    padding-bottom: 56.25%; /* 9/16 */
}
.ratio-16-9 > * {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
}
```

### 禁止换行 + 省略号

```css
.ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* 多行省略 */
.line-clamp {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
```

### 等分布局（不借助 Grid/Flex）

```css
.equal-columns {
    display: table;
    width: 100%;
}
.equal-columns > * {
    display: table-cell;
    width: 1%;
}
```

---

## 六、交互增强

### 自定义滚动条

```css
/* Webkit 浏览器 */
::-webkit-scrollbar {
    width: 8px;
}
::-webkit-scrollbar-track {
    background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
    background: #555;
}

/* Firefox */
* {
    scrollbar-width: thin;
    scrollbar-color: #888 #f1f1f1;
}
```

### 自定义复选框/单选框

```css
input[type="checkbox"] {
    appearance: none;
    width: 20px;
    height: 20px;
    border: 2px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    transition: all 0.2s;
}
input[type="checkbox"]:checked {
    background: #1890ff;
    border-color: #1890ff;
}
input[type="checkbox"]:checked::after {
    content: '✓';
    color: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 14px;
}
```

### 平滑滚动

```css
html {
    scroll-behavior: smooth;
}
```

### 禁止选中 + 长按菜单

```css
.no-select {
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
}
```

---

## 七、一行代码优化

```css
/* 清除浮动 */
.clearfix::after { content: ''; display: table; clear: both; }

/* 图片下方空隙 */
img { display: block; }

/* 文字不换行 */
.nowrap { white-space: nowrap; }

/* 点击高亮去除 */
* { -webkit-tap-highlight-color: transparent; }

/* 表单自动填充背景色 */
input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px white inset;
}

/* 禁止图片拖拽 */
img { -webkit-user-drag: none; }

/* 打印背景色 */
@media print { * { -webkit-print-color-adjust: exact; } }

/* 隐藏元素但保留占位 */
.invisible { visibility: hidden; }

/* 隐藏元素不保留占位 */
.hidden { display: none; }

/* 隐藏元素但可访问 */
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
}
```

---

## 八、高级技巧

### 硬件加速

```css
.gpu-layer {
    transform: translateZ(0);
    will-change: transform;
    backface-visibility: hidden;
}
```

### 滚动吸附轮播

```css
.carousel {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
}
.carousel > * {
    flex: 0 0 100%;
    scroll-snap-align: start;
}
/* 隐藏滚动条 */
.carousel::-webkit-scrollbar { display: none; }
```

### 伪元素实现 tooltip

```css
[title] {
    position: relative;
}
[title]::after {
    content: attr(title);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    padding: 4px 8px;
    background: #333;
    color: #fff;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s;
}
[title]:hover::after {
    opacity: 1;
}
```

### 对比度检测

```css
/* 根据背景色自动切换文字颜色 */
.smart-text {
    background: var(--bg);
    color: color-contrast(var(--bg) vs black, white);
}
```

### CSS 计数器

```css
ol.toc {
    counter-reset: chapter;
}
ol.toc > li {
    counter-increment: chapter;
}
ol.toc > li::before {
    content: "第 " counter(chapter) " 章";
    font-weight: bold;
    margin-right: 8px;
}
```

### 图片懒加载占位

```css
/* 图片加载前显示骨架色 */
img {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}
```

---

> 💡 **提示**：奇淫技巧虽好，但不要滥用。优先保证代码可读性和可维护性，复杂效果尽量用组件化方案实现。
