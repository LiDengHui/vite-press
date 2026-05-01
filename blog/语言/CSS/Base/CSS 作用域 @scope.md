---
title: CSS 作用域 @scope
date: 2025-04-29
tags:
  - CSS
  - "@scope"
  - 作用域
  - 现代特性
categories:
  - 技术文档
  - 前端
  - CSS
  - 现代特性
---

# CSS 作用域 @scope

[[toc]]

`@scope` 是 CSS Cascading and Inheritance Level 6 引入的规则，允许你将样式**限定在 DOM 的特定子树范围内**，从根本上解决全局命名冲突问题，无需依赖 BEM、CSS Modules 等工具。

---

## 核心痛点：全局 CSS 的困境

```css
/* 传统方式：命名空间前缀 */
.card__title { }
.card__title--large { }
.card__title--dark { }

/* 或使用高特异性选择器 */
.card .title { }
.section .card .title { }
```

**问题**：选择器越来越长、特异性军备竞赛、维护成本上升。

---

## @scope 基础语法

### 基础作用域

```css
@scope (.card) {
  :scope {           /* 等同于 .card */
    background: white;
    border-radius: 8px;
  }

  .title {          /* 只匹配 .card 内部的 .title */
    font-size: 1.25rem;
  }

  .button {         /* 只匹配 .card 内部的 .button */
    background: #4a90d9;
  }
}
```

### 限定作用域边界

```css
/* 样式只作用于 .section 内部，但排除 .dark-section 内部 */
@scope (.section) to (.dark-section) {
  .text {
    color: #333;    /* 不应用于 .dark-section 内的 .text */
  }
}
```

| 语法 | 含义 |
|------|------|
| `@scope (scope-root)` | 定义作用域根元素 |
| `@scope (root) to (limit)` | 定义作用域根 + 排除边界 |
| `:scope` | 引用作用域根元素 |

---

## 与原生嵌套规则结合

```css
@scope (.media-card) {
  :scope {
    display: flex;
    gap: 1rem;
  }

  & .thumbnail {
    width: 120px;
    aspect-ratio: 1;
    border-radius: 8px;
  }

  & .content {
    flex: 1;
  }

  & .title {
    margin: 0 0 0.5rem;
  }
}
```

---

## 实际应用场景

### 场景一：组件级作用域

```css
@scope (.button) {
  :scope {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }

  &:hover {
    filter: brightness(1.1);
  }

  .icon {            /* 只匹配 .button 内部的 .icon */
    width: 1em;
    height: 1em;
  }
}
```

### 场景二：主题作用域

```css
@scope (.theme-dark) {
  :scope {
    background: #0f0f0f;
    color: #e0e0e0;
  }

  a {
    color: #4a90d9;
  }

  .button {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
  }
}

@scope (.theme-light) {
  :scope {
    background: #ffffff;
    color: #333333;
  }

  a {
    color: #2563eb;
  }

  .button {
    background: #2563eb;
    color: white;
  }
}
```

### 场景三：排除第三方内容

```css
/* 给文章正文加样式，但不影响内嵌的代码块或广告 */
@scope (.article-content) to (.code-block, .ad-unit) {
  p {
    line-height: 1.8;
    margin-bottom: 1rem;
  }

  img {
    border-radius: 8px;
    max-width: 100%;
  }
}
```

---

## 作用域与特异性

`@scope` 内部的选择器**特异性计算方式不变**，但浏览器会优先应用**作用域更具体**的规则：

```css
@scope (.card) {
  .title { color: blue; }    /* 特异性：0,1,0 */
}

.title { color: red; }        /* 特异性：0,1,0 */
```

当 `.title` 同时满足 `.card .title` 和 `.title` 时，**作用域内的规则获胜**（作用域 proximity 优先）。

---

## 浏览器兼容性

| 浏览器 | 版本 |
|--------|------|
| Chrome / Edge | 118+ ✅ |
| Safari | 17.4+ ✅ |
| Firefox | 128+ ✅ |

---

## 奇淫技巧

### 技巧一：动态作用域切换

```css
/* 用属性选择器实现作用域切换 */
@scope ([data-component="alert"]) {
  :scope {
    padding: 1rem;
    border-radius: 6px;
  }

  &[data-variant="success"] {
    background: #d4edda;
    color: #155724;
  }

  &[data-variant="error"] {
    background: #f8d7da;
    color: #721c24;
  }
}
```

### 技巧二：作用域内全局重置

```css
@scope (.rich-text) {
  /* 只重置作用域内的元素 */
  h1, h2, h3, p, ul, ol {
    margin: 0;
    padding: 0;
  }

  h1 { font-size: 2rem; margin-bottom: 1rem; }
  h2 { font-size: 1.5rem; margin-bottom: 0.75rem; }
  p  { line-height: 1.7; margin-bottom: 1rem; }
}
```

### 技巧三：层叠层 + 作用域组合

```css
@layer components {
  @scope (.card) {
    :scope { /* 组件基础样式 */ }
  }
}

@layer overrides {
  @scope (.card.featured) {
    :scope { /* 特定变体覆盖 */ }
  }
}
```

### 技巧四：作用域内伪类链式处理

```css
@scope (.tabs) {
  .tab {
    padding: 0.75rem 1rem;
    border-bottom: 2px solid transparent;
  }

  .tab:is(:hover, :focus-visible) {
    border-color: #ccc;
  }

  .tab[aria-selected="true"] {
    border-color: #4a90d9;
    color: #4a90d9;
  }
}
```

---

## 参考资料

- [MDN @scope](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@scope)
- [CSS Cascading and Inheritance Level 6](https://drafts.csswg.org/css-cascade-6/#scope-atrule)
- [Can I Use: @scope](https://caniuse.com/css-cascade-scope)
