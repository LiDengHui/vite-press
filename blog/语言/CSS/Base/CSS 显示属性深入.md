---
title: CSS 显示属性深入
date: 2025-04-29
tags:
  - CSS
  - 前端
  - 显示
categories:
  - 技术文档
  - 前端
  - CSS
  - 布局系统
---

# CSS 显示属性深入

[[toc]]

`display` 是 CSS 中最重要且最常用的属性之一，它控制元素的显示类型和布局行为。从传统的块级/行内到现代的 Flexbox 和 Grid，`display` 属性经历了重大演变。本文深入讲解 `display` 的所有取值和实际应用场景。

## 基础显示类型

### 块级与行内

```css
/* 块级元素 */
.block {
  display: block;
  /* 独占一行，可设置宽高 */
}

/* 行内元素 */
.inline {
  display: inline;
  /* 不独占行，宽高由内容决定 */
}

/* 行内块级 */
.inline-block {
  display: inline-block;
  /* 行内显示，但可设置宽高 */
}
```

### 显示类型对比

| 类型 | 换行 | 可设宽高 | margin/padding | 典型元素 |
|------|------|----------|----------------|----------|
| `block` | ✅ | ✅ | 四向生效 | div, p, h1 |
| `inline` | ❌ | ❌ | 水平生效 | span, a, strong |
| `inline-block` | ❌ | ✅ | 四向生效 | input, button |

### none

```css
.hidden {
  display: none;
  /* 完全移除，不占据空间，不可交互 */
}
```

**与 `visibility: hidden` 对比：**
- `display: none`：不占据空间，不可交互
- `visibility: hidden`：占据空间，不可交互（但子元素可设置 `visibility: visible`）
- `opacity: 0`：占据空间，可交互

## 现代显示类型

### Flexbox

```css
.flex {
  display: flex;
  /* 一维布局：行或列 */
}

.inline-flex {
  display: inline-flex;
  /* 行内 flex 容器 */
}
```

### Grid

```css
.grid {
  display: grid;
  /* 二维布局：行和列 */
}

.inline-grid {
  display: inline-grid;
  /* 行内 grid 容器 */
}
```

### 双值语法

```css
/* 旧语法（单值） */
.display-flex {
  display: flex;  /* 等同于 block flex */
}

/* 新语法（双值） */
.display-block-flex {
  display: block flex;
  /* 外部表现：block，内部表现：flex */
}

.display-inline-flex {
  display: inline flex;
}

.display-block-grid {
  display: block grid;
}
```

## 表格相关

```css
/* 表格 */
.table        { display: table; }
.inline-table { display: inline-table; }

/* 表格部件 */
.table-caption  { display: table-caption; }
.table-cell     { display: table-cell; }
.table-column   { display: table-column; }
.table-colgroup { display: table-column-group; }
.table-footer   { display: table-footer-group; }
.table-header   { display: table-header-group; }
.table-row      { display: table-row; }
.table-rowgroup { display: table-row-group; }
```

## 列表相关

```css
.list-item {
  display: list-item;
  /* 类似 li，可配合 list-style 使用 */
}
```

## 特殊显示类型

### contents

```css
/* 移除元素本身，但保留子元素 */
.wrapper {
  display: contents;
}

/* 使用场景：不影响 grid/flex 子元素 */
.grid > .wrapper {
  display: contents;
}

.grid > .wrapper > * {
  /* 直接成为 grid 项 */
}
```

**注意：** 使用 `display: contents` 的元素不会被渲染，但子元素会正常显示。

### flow-root

```css
/* 创建新的块级格式化上下文（BFC） */
.clearfix {
  display: flow-root;
}

/* 等同于但更现代： */
.clearfix-old {
  overflow: hidden;  /* 创建 BFC */
}
```

**BFC 特性：**
- 内部浮动不会影响到外部
- 外边距不折叠
- 不会与浮动元素重叠

## 显示类型切换

### 响应式切换

```css
/* 移动端隐藏，桌面端显示 */
.responsive {
  display: none;
}

@media (min-width: 768px) {
  .responsive {
    display: block;
  }
}
```

### 交互切换

```css
/* 手风琴效果 */
.accordion-content {
  display: none;
}

.accordion-item.active .accordion-content {
  display: block;
}

/* 或使用 checkbox hack */
.toggle:checked + .content {
  display: block;
}
```

## 显示与动画

### display 无法动画

```css
/* ❌ 不生效 */
.fade {
  display: none;
  transition: display 0.3s;
}

/* ✅ 使用 opacity + visibility */
.fade {
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s;
}

.fade.show {
  opacity: 1;
  visibility: visible;
}
```

### 现代过渡方案

```css
/* CSS Transitions Level 2（新规范） */
.discrete-fade {
  display: none;
  transition: display 0.3s allow-discrete;
}

.discrete-fade.show {
  display: block;
}
```

## 浏览器兼容性

| 值 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| `block/inline/none` | 1+ | 1+ | 1+ | 12+ |
| `inline-block` | 1+ | 1.2+ | 3+ | 12+ |
| `flex` | 29+ | 9+ | 28+ | 12+ |
| `grid` | 57+ | 10.1+ | 52+ | 16+ |
| `contents` | 37+ | 11.1+ | 37+ | 79+ |
| `flow-root` | 58+ | 13+ | 53+ | 79+ |
| 双值语法 | 115+ | 15+ | 70+ | 115+ |

## 奇淫技巧

### 技巧一：纯 CSS 手风琴

```css
.accordion-item {
  display: grid;
  grid-template-rows: auto 0fr;
  transition: grid-template-rows 0.3s;
}

.accordion-item.active {
  grid-template-rows: auto 1fr;
}

.accordion-content {
  overflow: hidden;
}
```

### 技巧二：contents 修复 grid 嵌套

```css
/* 问题：嵌套破坏 grid */
.grid > div > .item {
  /* 不是 grid 的直接子元素 */
}

/* 解决 */
.grid > div {
  display: contents;
}

.grid > div > .item {
  /* 现在直接参与 grid 布局 */
}
```

### 技巧三：表格布局的妙用

```css
/* 等高列 */
.equal-height {
  display: table;
  width: 100%;
}

.equal-height > * {
  display: table-cell;
  width: 33.33%;
}
```

### 技巧四：inline-block 间隙修复

```css
/* 问题：inline-block 元素间有间隙 */
.nav {
  font-size: 0;  /* 消除文本间隙 */
}

.nav > a {
  display: inline-block;
  font-size: 1rem;  /* 恢复字体大小 */
}
```

### 技巧五：hidden 属性样式化

```css
/* 自定义 [hidden] 行为 */
[hidden] {
  display: none !important;
}

/* 或 */
[hidden] {
  display: revert !important;
}
```

## 总结

`display` 属性是 CSS 布局的基石：

1. **基础类型**：`block`、`inline`、`inline-block`
2. **现代布局**：`flex`、`grid`、`inline-flex`、`inline-grid`
3. **特殊类型**：`contents`、`flow-root`、`none`
4. **双值语法**：明确区分外部和内部显示类型
5. **兼容性注意**：`display` 本身无法动画，需配合 `opacity`/`visibility`

## 参考资源

- [MDN: display](https://developer.mozilla.org/zh-CN/docs/Web/CSS/display)
- [CSS-Tricks: display](https://css-tricks.com/almanac/properties/d/display/)
