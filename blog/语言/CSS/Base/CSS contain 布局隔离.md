---
title: CSS contain 布局隔离
date: 2025-04-29
tags:
  - CSS
  - 布局
  - contain
  - 性能
categories:
  - 技术文档
  - 前端
  - CSS
  - 布局系统
---

# CSS contain 布局隔离

[[toc]]

`contain` 属性向浏览器声明**元素内部是独立的**，其内部变化不会影响外部元素。这是优化大型页面性能的重要工具，可以显著减少重排（Reflow）和重绘（Repaint）的范围。

---

## 基础语法

### 常用值

```css
.widget {
  contain: layout;      /* 内部布局不影响外部 */
}

.card {
  contain: paint;       /* 内部绘制不影响外部 */
}

.modern {
  contain: layout paint; /* 组合使用 */
}

.strict {
  contain: strict;      /* layout + paint + size 等于最强隔离 */
}

.content {
  contain: content;     /* layout + paint 组合 */
}
```

| 值 | 说明 |
|----|------|
| `none` | 默认，无隔离 |
| `size` | 元素大小不依赖子元素 |
| `layout` | 内部布局不影响外部 |
| `style` | 内部计数器等不影响外部 |
| `paint` | 内部绘制限制在边界框内 |
| `content` | layout + paint + style |
| `strict` | size + layout + paint + style |

---

## 各种隔离类型

### size 隔离

```css
.fixed-size-widget {
  contain: size;
  width: 300px;
  height: 200px;
}
```

> `size` 要求元素必须有确定的宽度和高度，否则可能被视为 0×0。

### layout 隔离

```css
.sidebar {
  contain: layout;
}

.sidebar .item {
  /* 这些变化不会影响 sidebar 外部的布局 */
  position: absolute;
  top: 0;
}
```

### paint 隔离

```css
.overflow-widget {
  contain: paint;
  /* 等效于 overflow: clip 但更高效 */
}
```

### style 隔离

```css
.counter-widget {
  contain: style;
  /* counter-reset/increment 不影响外部 */
  counter-reset: item;
}
```

---

## 实际应用场景

### 社交媒体动态流

```css
.feed-item {
  contain: content;
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid #eee;
}

/* 单个动态项内的图片加载或评论增加不会触发整个动态流重排 */
```

### 单页应用路由

```css
.page-view {
  contain: strict;
}

/* 切换页面时，旧页面的消失不影响新页面的布局计算 */
```

### 第三方小组件

```css
.third-party-widget {
  contain: strict;
  width: 100%;
  height: 400px;
}
```

---

## contain-intrinsic-size

### 未显示内容的大小估算

```css
.virtual-list-item {
  contain: strict;
  contain-intrinsic-size: auto 300px;  /* 未渲染时使用估算大小 */
}
```

### content-visibility 配合

```css
.offscreen-section {
  content-visibility: auto;
  contain-intrinsic-size: auto 500px;
  /* 元素离屏时不渲染，进入视口时自动渲染 */
}
```

---

## content-visibility

### 自动渲染

```css
.article-section {
  content-visibility: auto;
  contain-intrinsic-size: auto 300px;
  /* 元素在视口内时渲染，离屏时跳过渲染 */
}
```

| 值 | 说明 |
|----|------|
| `visible` | 默认，始终渲染 |
| `auto` | 视口外跳过渲染 |
| `hidden` | 始终跳过渲染，由 JS 控制 |

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| contain | 52+ | 15.4+ | 69+ | 79+ |
| contain-intrinsic-size | 83+ | 无 | 107+ | 83+ |
| content-visibility | 85+ | 无 | 103+ | 85+ |

---

## 奇淫技巧

### 技巧一：虚拟列表优化

```css
.virtual-list .item {
  contain: strict;
  contain-intrinsic-size: auto 60px;
  content-visibility: auto;
}

/* 只渲染可见项，页面有 10000 条数据也不卡顿 */
```

### 技巧二：图片懒加载容器

```css
.image-wrapper {
  contain: paint;
  aspect-ratio: 16 / 9;
  background: #f0f0f0;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

### 技巧三：动态内容容器

```css
.live-feed-item {
  contain: content;
  animation: highlight 2s;
}

@keyframes highlight {
  0% { background: #fff3cd; }
  100% { background: transparent; }
}
/* 动画不会触发外部重绘 */
```

### 技巧四：幻灯片切换优化

```css
.slide {
  contain: strict;
  position: absolute;
  inset: 0;
}

.slide.active {
  z-index: 1;
}

.slide:not(.active) {
  content-visibility: hidden;
}
```

### 技巧五：大表格行优化

```css
table tr {
  contain: layout;
}

/* 单行数据变化不影响其他行 */
```

---

## 参考资料

- [MDN contain](https://developer.mozilla.org/zh-CN/docs/Web/CSS/contain)
- [MDN content-visibility](https://developer.mozilla.org/zh-CN/docs/Web/CSS/content-visibility)
- [MDN contain-intrinsic-size](https://developer.mozilla.org/zh-CN/docs/Web/CSS/contain-intrinsic-size)
- [web.dev: content-visibility](https://web.dev/content-visibility/)
