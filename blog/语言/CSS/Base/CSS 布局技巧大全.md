---
title: CSS 布局技巧大全
date: 2025-04-29
tags:
  - CSS
  - 布局
categories:
  - 技术文档
  - 前端
  - CSS
  - 布局系统
---

# CSS 布局技巧大全

[[toc]]

本文汇总了 CSS 布局开发中最常用、最高效的实战技巧，涵盖从基础居中到复杂网格的完整方案。

## 水平居中

```css
/* 方法 1: text-align（行内元素） */
.parent {
  text-align: center;
}

/* 方法 2: margin auto（块级元素） */
.child {
  width: fit-content;
  margin-inline: auto;
}

/* 方法 3: Flexbox */
.parent {
  display: flex;
  justify-content: center;
}

/* 方法 4: Grid */
.parent {
  display: grid;
  justify-content: center;
}
```

## 垂直居中

```css
/* 方法 1: Flexbox */
.parent {
  display: flex;
  align-items: center;
}

/* 方法 2: Grid */
.parent {
  display: grid;
  align-items: center;
}

/* 方法 3: 绝对定位 + transform */
.child {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

/* 方法 4: line-height（单行文本） */
.text {
  line-height: 200px; /* 等于容器高度 */
}
```

## 水平垂直居中

```css
/* 方法 1: Flexbox */
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 方法 2: Grid */
.parent {
  display: grid;
  place-items: center;
}

/* 方法 3: Grid + margin */
.parent {
  display: grid;
}
.child {
  margin: auto;
}

/* 方法 4: 绝对定位 */
.child {
  position: absolute;
  inset: 0;
  margin: auto;
  width: fit-content;
  height: fit-content;
}
```

## 等高列

```css
/* 方法 1: Flexbox */
.container {
  display: flex;
}

.item {
  flex: 1;
}

/* 方法 2: Grid */
.container {
  display: grid;
  grid-auto-rows: 1fr;
}

/* 方法 3: 伪元素撑开 */
.item {
  padding-bottom: 1000px;
  margin-bottom: -1000px;
}

.container {
  overflow: hidden;
}
```

## 圣杯布局

```css
.holy-grail {
  display: grid;
  grid-template: 
    "header header header" auto
    "left main right" 1fr
    "footer footer footer" auto
    / 200px 1fr 200px;
  min-height: 100vh;
  gap: 1rem;
}

.header { grid-area: header; }
.left { grid-area: left; }
.main { grid-area: main; }
.right { grid-area: right; }
.footer { grid-area: footer; }
```

## 固定底部

```css
/* 方法 1: Flexbox */
body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}

/* 方法 2: Grid */
body {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}
```

## 左侧固定右侧自适应

```css
/* 方法 1: Flexbox */
.container {
  display: flex;
}

.sidebar {
  width: 250px;
  flex-shrink: 0;
}

.main {
  flex: 1;
  min-width: 0; /* 防止溢出 */
}

/* 方法 2: Grid */
.container {
  display: grid;
  grid-template-columns: 250px 1fr;
}
```

## 顶部固定内容滚动

```css
.layout {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100vh;
}

.header {
  position: sticky;
  top: 0;
}

.content {
  overflow-y: auto;
}
```

## 瀑布流布局

```css
/* 方法 1: CSS Columns */
.masonry {
  columns: 3;
  column-gap: 1rem;
}

.item {
  break-inside: avoid;
  margin-bottom: 1rem;
}

/* 方法 2: Grid（现代浏览器） */
.masonry {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: masonry;
}
```

## 瀑布流布局（兼容性方案）

```css
.masonry-flex {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
}

/* 使用 JavaScript 计算位置 */
```

## 卡片等高 + 底部对齐

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.card {
  display: flex;
  flex-direction: column;
}

.card__content {
  flex: 1;
}

.card__footer {
  margin-top: auto;
}
```

## 文字环绕图片

```css
.article {
  overflow: hidden;
}

.article img {
  float: left;
  margin-right: 1rem;
  margin-bottom: 0.5rem;
  shape-outside: circle(50%);
}
```

## 全宽背景 + 定宽内容

```css
.section {
  /* 全宽背景 */
  background: #f5f5f5;
}

.section__inner {
  /* 定宽内容 */
  width: min(90%, 1200px);
  margin-inline: auto;
  padding: 2rem 0;
}
```

## 侧边栏最小宽度

```css
.layout {
  display: grid;
  grid-template-columns: fit-content(250px) 1fr;
}
```

## 粘性侧边栏 + 滚动内容

```css
.page {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
}

.sidebar {
  position: sticky;
  top: 1rem;
  align-self: start;
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
}
```

## 奇淫技巧

### 技巧一：CSS 变量驱动布局

```css
:root {
  --sidebar-width: 250px;
  --gap: 1rem;
}

.layout {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  gap: var(--gap);
}

@media (max-width: 768px) {
  :root {
    --sidebar-width: 100%;
  }
  
  .layout {
    grid-template-columns: 1fr;
  }
}
```

### 技巧二：容器查询布局

```css
.card-container {
  container-type: inline-size;
}

.card {
  display: flex;
  flex-direction: column;
}

@container (min-width: 400px) {
  .card {
    flex-direction: row;
  }
}

@container (min-width: 700px) {
  .card {
    display: grid;
    grid-template-columns: 200px 1fr;
  }
}
```

### 技巧三：子网格对齐

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.card {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 3;
}
```

### 技巧四：隐式命名区域

```css
.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}

/* 自动创建 grid-area */
.header { grid-area: header; }
```

### 技巧五：内容最小尺寸保护

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

/* 或使用 auto-fit */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
}
```

## 总结

CSS 布局的核心原则：

1. **优先使用 Grid**：二维布局、页面级结构
2. **Flexbox 补充**：一维布局、组件内部对齐
3. **容器查询优先**：组件级响应式
4. **CSS 变量驱动**：动态调整布局参数
5. **min-width: 0**：防止 flex/grid 子元素溢出

## 参考资源

- [MDN: CSS Layout](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/CSS_layout)
- [CSS-Tricks: Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
