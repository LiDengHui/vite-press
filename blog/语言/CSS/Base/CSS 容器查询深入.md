---
title: CSS 容器查询深入
date: 2025-04-29
tags:
  - CSS
  - 容器查询
  - 响应式
  - 现代特性
categories:
  - 技术文档
  - 前端
  - CSS
  - 现代特性
---

# CSS 容器查询深入

[[toc]]

CSS 容器查询（Container Queries）允许根据元素容器的尺寸而非视口尺寸来应用样式，是构建真正可复用组件的关键技术。

## 基础概念

### 与媒体查询的对比

```css
/* 媒体查询 - 基于视口 */
@media (min-width: 768px) {
  .card { flex-direction: row; }
}

/* 容器查询 - 基于容器 */
@container (min-width: 400px) {
  .card { flex-direction: row; }
}
```

**核心区别：**
- 媒体查询：基于视口/设备尺寸
- 容器查询：基于元素容器尺寸

### 定义容器

```css
/* 声明容器 */
.card-container {
  container-type: inline-size;  /* 行内轴尺寸 */
}

/* 完整容器尺寸 */
.full-container {
  container-type: size;         /* 行内 + 块轴尺寸 */
}

/* 带名称的容器 */
.named-container {
  container-type: inline-size;
  container-name: card;         /* 容器名称 */
}

/* 简写 */
.shorthand {
  container: card / inline-size;  /* 名称 + 类型 */
}
```

## 容器查询语法

### 基本用法

```css
/* 对最近的容器进行查询 */
@container (min-width: 400px) {
  .card {
    flex-direction: row;
  }
}

/* 对特定名称的容器进行查询 */
@container card (min-width: 400px) {
  .card {
    flex-direction: row;
  }
}

/* 多条件 */
@container (min-width: 400px) and (max-width: 800px) {
  .card {
    grid-template-columns: 1fr 2fr;
  }
}
```

### 查询条件

```css
@container (width > 400px) {
  /* 宽度大于 400px */
}

@container (aspect-ratio > 1) {
  /* 比例大于 1:1（横屏） */
}

@container (orientation: landscape) {
  /* 横向 */
}

@container (block-size > 300px) {
  /* 块轴高度大于 300px */
}
```

## 实战案例

### 可复用卡片组件

```html
<!-- 独立的容器 -->
<div class="card-container">
  <article class="card">
    <img src="image.jpg" alt="">
    <div class="content">
      <h2>标题</h2>
      <p>描述</p>
    </div>
  </article>
</div>

<!-- 侧边栏中的卡片 -->
<aside class="sidebar">
  <div class="card-container">
    <article class="card">
      <img src="image.jpg" alt="">
      <div class="content">
        <h2>标题</h2>
        <p>描述</p>
      </div>
    </article>
  </div>
</aside>
```

```css
/* 声明容器 */
.card-container {
  container-type: inline-size;
  container-name: card;
}

/* 基础样式 */
.card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

/* 容器宽度 > 400px */
@container card (min-width: 400px) {
  .card {
    flex-direction: row;
  }
  
  .card img {
    width: 150px;
    height: auto;
  }
}

/* 容器宽度 > 700px */
@container card (min-width: 700px) {
  .card {
    flex-direction: row;
    align-items: center;
  }
  
  .card img {
    width: 200px;
  }
  
  .card h2 {
    font-size: 1.5rem;
  }
}
```

### 动态标题

```css
.headline-container {
  container-type: inline-size;
}

.headline {
  font-size: 1.25rem;
}

@container (min-width: 500px) {
  .headline {
    font-size: 2rem;
  }
}

@container (min-width: 800px) {
  .headline {
    font-size: 3rem;
  }
}
```

### 表格响应式

```css
.table-container {
  container-type: inline-size;
}

.data-table {
  width: 100%;
}

/* 容器宽度 < 600px 时切换为卡片视图 */
@container (max-width: 600px) {
  .data-table thead {
    display: none;
  }
  
  .data-table tr {
    display: block;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
  }
  
  .data-table td {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem;
  }
  
  .data-table td::before {
    content: attr(data-label);
    font-weight: bold;
  }
}
```

### 网格元素

```css
.grid-item {
  container-type: inline-size;
}

.grid-item .content {
  font-size: 0.875rem;
}

@container (min-width: 200px) {
  .grid-item .content {
    font-size: 1rem;
  }
}

@container (min-width: 300px) {
  .grid-item .content {
    font-size: 1.25rem;
  }
}
```

## 高级用法

### 容器查询单位

```css
/* cqw: 容器查询宽度（0.01） */
/* cqh: 容器查询高度 */
/* cqi: 容器行内轴尺寸 */
/* cqb: 容器块轴尺寸 */
/* cqmin: 容器两轴较小值 */
/* cqmax: 容器两轴较大值 */

.element {
  padding: 5cqw;           /* 基于容器宽度的 5% */
  font-size: 3cqw;         /* 响应式字体 */
  width: 50cqmin;          /* 容器较小边的 50% */
}
```

### 多层嵌套

```css
.outer {
  container-type: inline-size;
  container-name: outer;
}

.inner {
  container-type: inline-size;
  container-name: inner;
}

/* 查询外层容器 */
@container outer (min-width: 800px) {
  .component {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 柨询内层容器 */
@container inner (min-width: 400px) {
  .component {
    font-size: 1.25rem;
  }
}
```

### 与 :has() 结合

```css
/* 当容器包含图片时 */
@container (min-width: 500px) {
  .card:has(img) {
    grid-template-columns: 200px 1fr;
  }
}
```

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| container-type | 105+ | 16+ | 110+ | 105+ |
| @container | 105+ | 16+ | 110+ | 105+ |
| 容器查询单位 | 105+ | 16+ | 110+ | 105+ |
| container-name | 105+ | 16+ | 110+ | 105+ |

## 渐进增强

```css
/* 基础样式（移动端） */
.card {
  flex-direction: column;
}

/* 容器查询增强 */
@container (min-width: 400px) {
  .card {
    flex-direction: row;
  }
}

/* 作为回退：媒体查询 */
@supports not (container-type: inline-size) {
  @media (min-width: 768px) {
    .card {
      flex-direction: row;
    }
  }
}
```

## 奇淫技巧

### 技巧一：自适应布局系统

```css
.layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.layout > * {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .widget {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
}
```

### 技巧二：文本大小自动调整

```css
.responsive-text {
  container-type: inline-size;
  font-size: clamp(1rem, 2cqw + 0.5rem, 2rem);
}
```

### 技巧三：比例容器

```css
.ratio-box {
  container-type: size;
  aspect-ratio: 16/9;
}

@container (aspect-ratio > 1) {
  .ratio-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
```

### 技巧四：状态管理

```css
.component {
  container-type: inline-size;
}

@container (max-width: 300px) {
  .component {
    --state: compact;
  }
}

@container (min-width: 301px) and (max-width: 600px) {
  .component {
    --state: medium;
  }
}

@container (min-width: 601px) {
  .component {
    --state: full;
  }
}
```

### 技巧五：组件库模式

```css
/* 在组件库中使用 */
.my-component {
  container-type: inline-size;
}

@container (min-width: 0px) {
  /* 总是生效，确保样式被应用 */
  .my-component {
    display: flex;
  }
}
```

## 总结

CSS 容器查询彻底改变了响应式设计的方式：

1. **核心价值**：组件自适应其容器，而非视口
2. **主要优势**：真正可复用的组件、嵌套布局控制
3. **关键概念**：`container-type`、`container-name`、`@container`
4. **高级特性**：容器查询单位（cqw/cqh等）
5. **兼容性**：现代浏览器良好支持

## 参考资源

- [MDN: CSS 容器查询](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_containment/Container_queries)
- [CSS-Tricks: A Primer on CSS Container Queries](https://css-tricks.com/a-primer-on-css-container-queries/)
