---
title: CSS 子网格 subgrid
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

# CSS 子网格 subgrid

[[toc]]

`subgrid` 是 CSS Grid Layout Level 2 的核心特性，它允许**嵌套网格项继承父网格的轨道定义**，从而彻底解决“外层 Grid 与内层 Grid 对不齐”的历史难题。

---

## 核心问题：传统嵌套 Grid 的痛点

```html
<div class="outer-grid">
  <div class="card">
    <h2>标题</h2>
    <p>描述文字...</p>
    <button>操作</button>
  </div>
  <!-- 更多 card -->
</div>
```

```css
.outer-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.card {
  display: grid;
  /* 内层只能重新定义列，无法与外层对齐 */
  grid-template-rows: auto 1fr auto;
}
```

**问题**：每个 `.card` 的 `grid-template-rows` 是独立计算的，导致不同卡片内的标题、描述、按钮**无法跨卡片垂直对齐**。

---

## subgrid 语法

```css
.card {
  display: grid;
  /* 列继承父网格 */
  grid-template-columns: subgrid;
  /* 行继承父网格 */
  grid-template-rows: subgrid;
  /* 或同时继承行列 */
  grid-template: subgrid / subgrid;
}
```

### 完整实例：卡片列表完美对齐

```css
.outer-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  /* 定义共享的 3 行轨道 */
  grid-template-rows: auto 1fr auto;
  gap: 1rem;
}

.card {
  display: grid;
  /* 继承父的 3 列轨道 */
  grid-template-columns: subgrid;
  /* 继承父的 3 行轨道 */
  grid-template-rows: subgrid;
  /* 卡片跨父网格的 1 列 + 3 行 */
  grid-column: span 1;
  grid-row: span 3;
}

.card h2    { grid-row: 1; }
.card p     { grid-row: 2; }
.card button { grid-row: 3; }
```

**效果**：所有卡片的标题行、内容行、按钮行**跨卡片严格对齐**。

---

## 仅继承行 / 仅继承列

```css
/* 只继承列轨道，行自由定义 */
.sidebar-item {
  display: grid;
  grid-template-columns: subgrid;
  grid-template-rows: auto auto; /* 自定义行 */
}

/* 只继承行轨道 */
.horizontal-scroll-item {
  display: grid;
  grid-template-columns: 200px 1fr 100px;
  grid-template-rows: subgrid;
}
```

---

## 与 `gap` 的交互

子网格默认**继承父网格的 gap**。如需覆盖：

```css
.card {
  display: grid;
  grid-template-columns: subgrid;
  grid-template-rows: subgrid;
  /* 单独调整子网格的间距 */
  gap: 0.5rem 0;
}
```

---

## 实际应用场景

### 场景一：数据表格的非 `<table>` 实现

```css
.data-grid {
  display: grid;
  grid-template-columns: 100px 1fr 120px 80px;
}

.data-row {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1; /* 跨整行 */
}
```

### 场景二：复杂表单布局

```css
.form {
  display: grid;
  grid-template-columns: [label] 120px [input] 1fr [hint] 200px;
  grid-auto-rows: auto;
}

.form-row {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;
}

.form-row label { grid-column: label; }
.form-row input { grid-column: input; }
.form-row .hint { grid-column: hint; }
```

### 场景三：媒体对象 + 侧边元信息

```css
.article-list {
  display: grid;
  grid-template-columns: 200px 1fr 150px;
}

.article {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;
}
```

---

## 浏览器兼容

| 浏览器 | 版本 |
|--------|------|
| Firefox | 71+ (2019) ✅ 首个支持 |
| Safari | 16+ ✅ |
| Chrome / Edge | 117+ ✅ |

---

## 奇淫技巧

### 技巧一：跨多级 subgrid 传递

```css
.grandparent {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.parent {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: span 2;
}

.child {
  display: grid;
  grid-template-columns: subgrid; /* 继承自 grandparent */
}
```

### 技巧二：配合 `aspect-ratio` 固定比例

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-rows: 200px;
}

.gallery-item {
  display: grid;
  grid-template-columns: subgrid;
  grid-template-rows: subgrid;
  grid-row: span 2;
}

.gallery-item img {
  width: 100%; height: 100%;
  object-fit: cover;
}
```

### 技巧三：响应式“隐式 subgrid”降级

```css
.card {
  display: grid;
  /* 现代浏览器用 subgrid */
  grid-template-columns: subgrid;
  grid-template-rows: subgrid;
}

@supports not (grid-template-columns: subgrid) {
  .card {
    /* 旧浏览器降级为普通 grid */
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
  }
}
```

### 技巧四：命名线 + subgrid 精确放置

```css
.layout {
  display: grid;
  grid-template-columns: [sidebar] 250px [main] 1fr [aside] 300px;
}

.nested-module {
  display: grid;
  grid-template-columns: subgrid;
  /* 子元素直接引用父命名线 */
}

.nested-module .content {
  grid-column: main; /* 直接使用父网格命名 */
}
```

---

## 参考资料

- [MDN subgrid](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_grid_layout/Subgrid)
- [CSS Grid Level 2 规范](https://www.w3.org/TR/css-grid-2/)
- [Rachel Andrew: Grid Level 2 and subgrid](https://rachelandrew.co.uk/archives/2019/10/16/css-grid-news-and-the-css-grid-level-2-specification/)
