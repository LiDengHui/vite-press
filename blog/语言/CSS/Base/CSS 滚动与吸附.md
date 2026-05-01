---
title: CSS 滚动与吸附
date: 2025-04-29
tags:
  - CSS
  - 滚动
categories:
  - 技术文档
  - 前端
  - CSS
  - 交互与动画
---

# CSS 滚动与吸附

现代 CSS 提供了强大的滚动控制能力，无需 JS 即可实现丝滑的滚动体验。

---

## 一、scroll-behavior

控制滚动动画方式：

```css
html {
    scroll-behavior: smooth; /* 锚点跳转平滑滚动 */
}

/* 对特定容器生效 */
.sidebar {
    scroll-behavior: smooth;
    overflow-y: auto;
}
```

### JS 触发平滑滚动

```javascript
// 平滑滚动到元素
el.scrollIntoView({ behavior: 'smooth', block: 'center' });

// 平滑滚动到指定位置
window.scrollTo({ top: 500, behavior: 'smooth' });
```

---

## 二、scroll-snap 滚动吸附

让滚动在特定位置自动吸附，实现轮播/分页效果：

```css
.carousel {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory; /* x 轴强制吸附 */
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
}

.carousel > .slide {
    flex: 0 0 100%;
    scroll-snap-align: start; /* 吸附到 slide 起始边 */
}
```

### 吸附类型

```css
scroll-snap-type: x mandatory;   /* 强制吸附，必须停在吸附点 */
scroll-snap-type: x proximity;   /* 临近吸附，接近时吸附 */
scroll-snap-type: y mandatory;   /* y 轴 */
scroll-snap-type: both mandatory;/* x+y */
```

### 吸附对齐方式

```css
scroll-snap-align: start;   /* 元素起始边对齐容器起始边 */
scroll-snap-align: center;  /* 元素中心对齐容器中心 */
scroll-snap-align: end;     /* 元素结束边对齐容器结束边 */

/* 配合 */
scroll-snap-stop: always;   /* 每次滚动只停一个吸附点 */
```

---

## 三、overscroll-behavior 滚动链控制

```css
/* 阻止滚动穿透（内部滚动到底后继续滚动外部） */
.modal {
    overflow-y: auto;
    overscroll-behavior: contain; /* 不传播滚动到父级 */
}

/* 完全阻止回弹效果 */
.no-bounce {
    overscroll-behavior: none;
}
```

| 值 | 说明 |
|----|------|
| `auto` | 默认，滚动传递 |
| `contain` | 内部滚动不传递到父级 |
| `none` | 同时阻止回弹（bounce）效果 |

---

## 四、scroll-margin / scroll-padding

```css
/* 吸附时留出的边距 */
.slide {
    scroll-margin: 20px; /* 吸附时四周留 20px */
}

/* 容器级别的 padding */
.container {
    scroll-padding: 60px 0; /* 顶部留出 60px（如固定导航） */
}
```

---

## 五、scrollbar 样式（非标准但广泛支持）

```css
/* WebKit 浏览器 */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}
::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}
::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}

/* Firefox */
html {
    scrollbar-width: thin;
    scrollbar-color: #c1c1c1 #f1f1f1;
}
```

---

## 六、纯 CSS 轮播实现

```html
<div class="slider">
    <div class="slides">
        <div id="s1" class="slide">Slide 1</div>
        <div id="s2" class="slide">Slide 2</div>
        <div id="s3" class="slide">Slide 3</div>
    </div>
    <a href="#s1">1</a>
    <a href="#s2">2</a>
    <a href="#s3">3</a>
</div>
```

```css
.slides {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    scrollbar-width: none; /* 隐藏滚动条 */
}
.slides::-webkit-scrollbar { display: none; }

.slide {
    flex: 0 0 100%;
    scroll-snap-align: start;
}
```

---

## 奇淫技巧

### 技巧 1：CSS 锚点平滑滚动 + 高亮

```css
/* 点击目录跳转到对应章节，并高亮 */
:target {
    background: yellow;
    transition: background 0.5s;
}
:target::before {
    content: '';
    display: block;
    height: 60px; /* 留出固定导航高度 */
    margin-top: -60px;
}
```

### 技巧 2：无限滚动视觉欺骗

```css
/* 最后一页和第一页视觉上无缝衔接 */
.carousel {
    scroll-snap-type: x mandatory;
}
/* 配合复制首尾 slide 实现 JS 无限滚动 */
```

### 技巧 3：横向滚动吸附标签页

```css
.tabs {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding: 0 20px;
}
.tab {
    flex: 0 0 auto;
    scroll-snap-align: start;
}
```

### 技巧 4：滚动进度条（纯 CSS）

```css
/* 页面顶部进度条 */
body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(to right, #1890ff var(--scroll), transparent 0);
    z-index: 9999;
}

/* JS 更新变量 */
window.addEventListener('scroll', () => {
    const scroll = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    document.documentElement.style.setProperty('--scroll', scroll + '%');
});
```

### 技巧 5：粘性侧边栏 + 吸附

```css
.layout {
    display: grid;
    grid-template-columns: 200px 1fr;
}
.toc {
    position: sticky;
    top: 60px;
    max-height: calc(100vh - 80px);
    overflow-y: auto;
    overscroll-behavior: contain;
}
```

### 技巧 6：滚动触发动画（Scroll-driven Animations）

```css
/* Chrome 115+ 支持 */
@keyframes fade-in {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}

.card {
    animation: fade-in linear both;
    animation-timeline: view();
    animation-range: entry 10% cover 40%;
}
```

### 技巧 7：固定表头 + 横向滚动

```css
.table-wrapper {
    overflow: auto;
    max-height: 400px;
}
table {
    border-collapse: separate;
    border-spacing: 0;
}
thead th {
    position: sticky;
    top: 0;
    background: #fff;
    z-index: 1;
}
thead th:first-child {
    position: sticky;
    left: 0;
    z-index: 2;
}
```

### 技巧 8：隐藏滚动条但保留滚动

```css
.no-scrollbar {
    -ms-overflow-style: none;  /* IE/Edge */
    scrollbar-width: none;      /* Firefox */
}
.no-scrollbar::-webkit-scrollbar {
    display: none;              /* Chrome/Safari */
}
```

### 技巧 9：滚动联动视差

```css
.parallax {
    transform: translateY(calc(var(--scroll) * 0.5));
    will-change: transform;
}
/* JS: document.documentElement.style.setProperty('--scroll', window.scrollY + 'px'); */
```

### 技巧 10：吸附分页指示器

```css
.indicators {
    display: flex;
    gap: 8px;
}
.indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ccc;
    transition: 0.3s;
}
/* 当前 slide 通过 :target 高亮对应指示器 */
#s1:target ~ .indicators .i1,
#s2:target ~ .indicators .i2 {
    background: #1890ff;
    width: 24px;
    border-radius: 4px;
}
```

> 💡 **滚动口诀**：平滑用 `scroll-behavior`，轮播用 `scroll-snap`，穿透用 `overscroll-behavior`，进度用 Scroll-driven Animations。
