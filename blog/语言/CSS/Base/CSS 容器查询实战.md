---
title: CSS 容器查询实战
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

# CSS 容器查询实战

容器查询让组件根据父容器尺寸而非视口尺寸做出响应，是组件化时代最重要的 CSS 新特性之一。

---

## 一、基础用法

### 声明容器

```css
.card-container {
    container-type: inline-size; /* 基于宽度的查询 */
}

/* 命名容器 */
.sidebar {
    container-type: inline-size;
    container-name: sidebar;
}
```

### 简写形式

```css
.card-container {
    container: card / inline-size; /* 名称 / 类型 */
}
```

### 容器查询规则

```css
@container (min-width: 400px) {
    .card {
        display: flex;
        gap: 16px;
    }
    .card__image {
        width: 120px;
        flex-shrink: 0;
    }
}

@container (min-width: 600px) {
    .card__title {
        font-size: 1.5rem;
    }
}
```

### 命名容器查询

```css
@container sidebar (min-width: 300px) {
    .nav-item {
        display: flex;
        align-items: center;
        gap: 8px;
    }
}
```

---

## 二、容器查询单位

```css
@container (min-width: 400px) {
    .card {
        padding: 5cqi;  /* 容器内联尺寸的 5% */
        gap: 2cqb;      /* 容器块级尺寸的 2% */
    }
    .card__title {
        font-size: clamp(1rem, 4cqi, 1.5rem);
    }
}
```

| 单位 | 含义 |
|------|------|
| `cqw` | 容器宽度百分比 |
| `cqh` | 容器高度百分比 |
| `cqi` | 容器内联尺寸百分比 |
| `cqb` | 容器块级尺寸百分比 |
| `cqmin` | 容器最小尺寸百分比 |
| `cqmax` | 容器最大尺寸百分比 |

---

## 三、样式查询

```css
@container style(--theme: dark) {
    .card {
        background: #1a1a1a;
        color: #fff;
        border-color: #333;
    }
}

@container style(--layout: compact) {
    .card {
        padding: 8px;
    }
    .card__desc {
        display: none;
    }
}
```

---

## 四、与媒体查询对比

| 特性 | 媒体查询 | 容器查询 |
|------|---------|---------|
| 查询对象 | 视口 | 父容器 |
| 适用场景 | 页面级布局 | 组件级响应 |
| 可复用性 | 低 | 高 |
| 嵌套支持 | 全局 | 局部 |

```css
/* 媒体查询：页面布局 */
@media (min-width: 768px) {
    .page { display: grid; grid-template-columns: 250px 1fr; }
}

/* 容器查询：组件行为 */
@container (min-width: 400px) {
    .card { display: flex; }
}
```

---

## 奇淫技巧

### 技巧 1：卡片组件多尺寸自适应

```css
.card-wrapper {
    container: card / inline-size;
}
.card {
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
}

@container card (min-width: 300px) {
    .card { display: flex; gap: 12px; }
    .card__thumb { width: 80px; height: 80px; flex-shrink: 0; }
}

@container card (min-width: 500px) {
    .card { gap: 20px; padding: 20px; }
    .card__thumb { width: 150px; height: 120px; }
    .card__title { font-size: 1.25rem; }
    .card__desc { display: block; }
}

@container card (min-width: 700px) {
    .card { display: grid; grid-template-columns: 200px 1fr; }
    .card__thumb { width: 100%; height: 100%; }
}
```

### 技巧 2：侧边栏导航自适应

```css
.sidebar {
    container: sidebar / inline-size;
    width: 250px;
    transition: width 0.3s;
}
.sidebar.collapsed {
    width: 60px;
}

.nav-item__text {
    display: none;
}

@container sidebar (min-width: 200px) {
    .nav-item__text { display: inline; }
    .nav-item { justify-content: flex-start; gap: 12px; }
}

@container sidebar (max-width: 100px) {
    .nav-item { justify-content: center; }
    .nav-item__text { display: none; }
}
```

### 技巧 3：样式查询做主题切换

```css
:root {
    --theme: light;
}
[data-theme="dark"] {
    --theme: dark;
}

.card-container {
    container: card / inline-size;
    container-name: card;
    --theme: var(--theme);
}

@container card style(--theme: dark) {
    .card {
        background: #1f1f1f;
        color: #e0e0e0;
        border-color: #333;
    }
}
```

### 技巧 4：查询嵌套容器

```css
.page {
    container: page / inline-size;
}
.sidebar {
    container: sidebar / inline-size;
}

/* 查询 page 容器 */
@container page (min-width: 1200px) {
    .main { display: grid; grid-template-columns: 250px 1fr; }
}

/* 查询 sidebar 容器 */
@container sidebar (min-width: 200px) {
    .nav-link { padding: 12px 16px; }
}
```

### 技巧 5：容器查询 + CSS 变量做设计令牌

```css
.card {
    --card-padding: 12px;
    --card-gap: 8px;
    padding: var(--card-padding);
    gap: var(--card-gap);
}

@container (min-width: 400px) {
    .card {
        --card-padding: 20px;
        --card-gap: 16px;
    }
}
```

### 技巧 6：可复用的响应式表格

```css
.table-wrapper {
    container: table / inline-size;
}

@container table (max-width: 500px) {
    .responsive-table thead { display: none; }
    .responsive-table tr {
        display: block;
        margin-bottom: 12px;
        border: 1px solid #ddd;
    }
    .responsive-table td {
        display: flex;
        justify-content: space-between;
        padding: 8px 12px;
    }
    .responsive-table td::before {
        content: attr(data-label);
        font-weight: 600;
    }
}
```

### 技巧 7：图片画廊自适应

```css
.gallery {
    container: gallery / inline-size;
    display: grid;
    gap: 8px;
}

@container gallery (min-width: 400px) {
    .gallery { grid-template-columns: repeat(2, 1fr); }
}

@container gallery (min-width: 600px) {
    .gallery { grid-template-columns: repeat(3, 1fr); }
}

@container gallery (min-width: 900px) {
    .gallery { grid-template-columns: repeat(4, 1fr); gap: 16px; }
}
```

### 技巧 8：查询单位做流体排版

```css
.card {
    container: card / inline-size;
}

@container card (min-width: 300px) {
    .card__title {
        font-size: clamp(1rem, 3cqi + 0.5rem, 1.5rem);
    }
    .card__body {
        padding: 3cqi;
    }
}
```

### 技巧 9：容器查询做折叠面板

```css
.accordion {
    container: accordion / inline-size;
}

@container accordion (max-width: 400px) {
    .accordion-item {
        border-bottom: 1px solid #eee;
    }
    .accordion-content {
        padding: 12px 0;
    }
}

@container accordion (min-width: 400px) {
    .accordion {
        display: flex;
        gap: 16px;
    }
    .accordion-item {
        flex: 1;
        border: 1px solid #eee;
        border-radius: 8px;
    }
}
```

### 技巧 10：渐进增强策略

```css
/* 基础样式（所有浏览器） */
.card { display: block; padding: 12px; }

/* 容器查询增强 */
@supports (container-type: inline-size) {
    .card-container { container: card / inline-size; }

    @container card (min-width: 400px) {
        .card { display: flex; gap: 16px; }
    }
}
```

> 💡 **容器查询口诀**：组件加 container-type，响应用 @container，尺寸用 cqi/cqb，主题用 style()，兼容用 @supports。
