---
title: CSS 子网格深入
date: 2025-04-29
tags:
  - CSS
  - subgrid
  - 现代特性
categories:
  - 技术文档
  - 前端
  - CSS
  - 现代特性
---

# CSS 子网格深入

[[toc]]

CSS Subgrid 是 CSS Grid Layout Level 2 的核心特性，允许网格项目继承父网格的行和/或列轨道，解决了复杂布局中子元素对齐的难题。本文深入讲解子网格的工作原理、语法和实战应用。

## 为什么需要子网格

### 问题场景

```html
<div class="card-grid">
  <article class="card">
    <h2>标题1</h2>
    <p>短描述</p>
    <footer>底部</footer>
  </article>
  <article class="card">
    <h2>这是一个更长的标题</h2>
    <p>这是一段更长的描述文字</p>
    <footer>底部</footer>
  </article>
</div>
```

```css
/* 问题：子元素无法对齐 */
.card {
  display: grid;
  grid-template-rows: auto auto auto;
}
```

### 子网格解决

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 1fr auto;
  gap: 1rem;
}

.card {
  display: grid;
  grid-template-rows: subgrid;  /* 继承父网格的行 */
  grid-row: span 3;             /* 占据 3 行 */
}
```

## 基础语法

### 行子网格

```css
.parent {
  display: grid;
  grid-template-rows: auto 1fr auto;
}

.child {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 3;  /* 必须指定跨越的行数 */
}
```

### 列子网格

```css
.parent {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
}

.child {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: span 3;
}
```

### 行列双子网格

```css
.child {
  display: grid;
  grid-template-rows: subgrid;
  grid-template-columns: subgrid;
  grid-row: span 3;
  grid-column: span 3;
}
```

## 实战案例

### 卡片对齐

```html
<div class="product-grid">
  <article class="product-card">
    <img src="product1.jpg" alt="">
    <h3>产品名称</h3>
    <p class="desc">产品描述</p>
    <p class="price">$99</p>
    <button>购买</button>
  </article>
  <!-- 更多卡片 -->
</div>
```

```css
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.product-card {
  display: grid;
  grid-template-rows: auto auto 1fr auto auto;
  gap: 0.5rem;
}

/* 如果支持 subgrid */
@supports (grid-template-rows: subgrid) {
  .product-grid {
    grid-template-rows: auto auto 1fr auto auto;
  }
  
  .product-card {
    grid-template-rows: subgrid;
    grid-row: span 5;
    gap: 0;  /* 使用父网格的间距 */
  }
}
```

### 报表表格

```css
.report {
  display: grid;
  grid-template-columns: 150px 1fr 1fr 100px;
  grid-template-rows: repeat(5, auto);
}

.report-section {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;
  grid-template-rows: subgrid;
}

.report-row {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;
}
```

### 形式对齐

```css
.form {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
}

.form-group {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;
}
```

## 渐进增强

### @supports 检测

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

/* 基础方案 */
.card {
  display: flex;
  flex-direction: column;
}

.card .content {
  flex: 1;
}

/* 如果支持 subgrid */
@supports (grid-template-rows: subgrid) {
  .card-grid {
    grid-template-rows: auto 1fr auto;
  }
  
  .card {
    display: grid;
    grid-template-rows: subgrid;
    grid-row: span 3;
  }
  
  .card .content {
    /* 不需要 flex: 1 */
  }
}
```

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| subgrid | 117+ | 16+ | 71+ | 117+ |

## 奇淫技巧

### 技巧一：深度嵌套

```css
.level-1 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.level-2 {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: span 4;
}

.level-3 {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: span 2;
}
```

### 技巧二：跨行卡片

```css
.featured {
  grid-row: span 2;
  grid-column: span 2;
}

.featured .inner {
  display: grid;
  grid-template-rows: subgrid;
  grid-template-columns: subgrid;
}
```

### 技巧三：动态内容对齐

```css
.dynamic-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: masonry;  /* 实验性 */
}

.dynamic-grid > * {
  grid-template-rows: subgrid;
}
```

## 总结

CSS Subgrid 是解决复杂对齐问题的强大工具：

1. **核心价值**：让子元素继承父网格的轨道
2. **主要场景**：卡片对齐、表格布局、表单排版
3. **渐进增强**：使用 `@supports` 提供回退方案
4. **兼容性**：Firefox 早期支持，Chrome/Edge 117+，Safari 16+

## 参考资源

- [MDN: Subgrid](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_grid_layout/Subgrid)
- [CSS-Tricks: Subgrid](https://css-tricks.com/grid-level-2-and-subgrid/)
