---
title: CSS 容器样式查询 @container style
date: 2025-04-29
tags:
  - CSS
  - contain
  - 性能
  - 现代特性
categories:
  - 技术文档
  - 前端
  - CSS
  - 现代特性
---

# CSS 容器样式查询 @container style

[[toc]]

容器查询（Container Queries）已让组件能根据父容器尺寸响应。而 **样式查询（Style Queries）** 更进一步——组件可根据父容器的**计算样式值**（如 `background-color`、`--theme` 等）做出响应，实现真正的"上下文感知"组件。

---

## 与尺寸查询的区别

```css
/* 尺寸查询：根据容器宽高 */
@container (width > 400px) { }

/* 样式查询：根据容器计算样式 */
@container style(--theme: dark) { }
@container style(background-color: black) { }
```

| 类型 | 查询目标 | 应用场景 |
|------|---------|---------|
| 尺寸查询 | 容器 `width` / `height` | 响应式布局 |
| 样式查询 | 容器 CSS 属性值 | 主题适配、状态响应 |

---

## 基础语法

### 查询自定义属性

```css
/* 父容器声明变量 */
.card-container {
  container-type: inline-size;
  --theme: dark;
  --density: compact;
}

/* 子组件根据变量响应 */
.card {
  padding: 1rem;
  background: white;
  color: #333;
}

@container style(--theme: dark) {
  .card {
    background: #1a1a1a;
    color: #e0e0e0;
    border-color: #444;
  }
}

@container style(--density: compact) {
  .card {
    padding: 0.5rem;
    font-size: 0.875rem;
  }
}
```

### 查询原生 CSS 属性

```css
@container style(background-color: black) {
  .child {
    color: white; /* 父容器黑底时子元素自动变白字 */
  }
}

@container style(display: flex) {
  .child {
    /* 父容器是 flex 时的特殊处理 */
    flex-shrink: 0;
  }
}
```

---

## 组合查询

### 样式 + 尺寸联合查询

```css
@container (width > 600px) and style(--theme: dark) {
  .hero {
    background: linear-gradient(135deg, #1a1a2e, #16213e);
    font-size: 2rem;
  }
}
```

### 多条件样式查询

```css
@container style(--theme: dark) and style(--accent: blue) {
  .button {
    background: #4a90d9;
    box-shadow: 0 0 20px rgba(74, 144, 217, 0.3);
  }
}
```

---

## 实战应用

### 应用一：主题感知组件

```css
/* 设计系统：组件自动适应父容器主题 */
.theme-section {
  container-type: inline-size;
  container-name: theme-section;
}

.theme-section.dark {
  --theme: dark;
  background: #0f0f0f;
  color: #fff;
}

.theme-section.light {
  --theme: light;
  background: #fff;
  color: #333;
}

/* 按钮组件 */
.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  border: 1px solid currentColor;
}

@container theme-section style(--theme: dark) {
  .btn {
    background: rgba(255,255,255,0.1);
    color: #fff;
    border-color: rgba(255,255,255,0.2);
  }
  .btn:hover {
    background: rgba(255,255,255,0.2);
  }
}

@container theme-section style(--theme: light) {
  .btn {
    background: #4a90d9;
    color: #fff;
    border-color: transparent;
  }
}
```

### 应用二：密度感知表格

```css
.table-container {
  container-type: inline-size;
  --density: normal;
}

.table-container.compact {
  --density: compact;
}

table {
  width: 100%;
  border-collapse: collapse;
}

td, th {
  padding: 1rem;
  border-bottom: 1px solid #ddd;
}

@container style(--density: compact) {
  td, th {
    padding: 0.5rem;
    font-size: 0.875rem;
  }
}
```

### 应用三：状态驱动卡片

```css
.card-list {
  container-type: inline-size;
}

.card-list[data-view="grid"] {
  --view-mode: grid;
}

.card-list[data-view="list"] {
  --view-mode: list;
}

@container style(--view-mode: grid) {
  .card {
    display: flex;
    flex-direction: column;
    aspect-ratio: 1;
  }
}

@container style(--view-mode: list) {
  .card {
    display: flex;
    flex-direction: row;
    gap: 1rem;
  }
  .card img {
    width: 120px;
    height: 120px;
    object-fit: cover;
  }
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Edge | Safari | Firefox |
|------|--------|------|--------|---------|
| `@container style()` | 111+ | 111+ | 18.2+ | 开发中 |
| 原生属性查询 | 111+ | 111+ | 18.2+ | 开发中 |

---

## 奇淫技巧

### 技巧一：自动对比色

```css
.section {
  container-type: inline-size;
}

/* 父容器背景深时子元素自动变白 */
@container style(background-color: rgb(0 0 0)) or style(background-color: #000) {
  .auto-contrast {
    color: white;
  }
}
```

### 技巧二：上下文徽章系统

```css
.badge-container {
  container-type: inline-size;
  --priority: low;
}

.badge-container.urgent { --priority: high; }

@container style(--priority: high) {
  .badge {
    background: #e74c3c;
    animation: pulse 1s infinite;
  }
}

@container style(--priority: low) {
  .badge {
    background: #95a5a6;
  }
}
```

### 技巧三：与 JS 配合动态切换

```js
// 通过修改父容器自定义属性触发样式查询
section.style.setProperty('--theme', 'dark');
section.style.setProperty('--density', 'compact');
```

### 技巧四：嵌套容器查询

```css
.outer {
  container-type: inline-size;
  --mode: preview;
}

.inner {
  container-type: inline-size;
  --state: idle;
}

/* 外层控制整体布局 */
@container style(--mode: preview) {
  .item { opacity: 0.7; }
}

/* 内层控制自身状态 */
@container style(--state: active) {
  .item { transform: scale(1.05); }
}
```

---

## 注意事项

1. **必须声明 `container-type`** — 否则 `@container` 不会匹配
2. **只能查询直接容器的样式** — 不能跨级查询祖先
3. **自定义属性值必须精确匹配** — 不支持部分匹配或范围查询
4. **计算样式需已确定** — 依赖布局完成后的最终值

---

## 参考资料

- [MDN @container](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@container)
- [CSS Containment Module Level 3](https://www.w3.org/TR/css-contain-3/)
- [Can I Use: CSS Container Style Queries](https://caniuse.com/css-container-queries-style)
