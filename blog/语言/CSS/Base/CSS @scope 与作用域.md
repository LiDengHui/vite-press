---
title: CSS @scope 与作用域
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

# CSS @scope 与作用域

[[toc]]

CSS `@scope` 规则允许在 DOM 树的特定区域内局部化样式，避免选择器影响到不相关的元素。这是解决全局样式冲突和类命名空间问题的现代方案。

---

## 基本语法

### 简单作用域

```css
@scope (.card) {
  /* 只在 .card 内部生效 */
  .title {
    font-size: 1.5rem;
    color: #333;
  }
  
  .description {
    color: #666;
  }
  
  img {
    border-radius: 8px;
  }
}
```

```html
<div class="card">
  <h2 class="title">卡片标题</h2>
  <p class="description">卡片描述</p>
  <img src="photo.jpg" alt="">
</div>

<!-- 这里的 .title 不受上面的 @scope 影响 -->
<div class="other">
  <h2 class="title">其他标题</h2>
</div>
```

### 起止范围

```css
@scope (.article) to (.comments) {
  /* 只在 .article 内部生效，但排除 .comments 及其后代 */
  p {
    line-height: 1.8;
  }
  
  h2 {
    font-size: 2rem;
  }
}
```

```html
<article class="article">
  <h2>文章标题</h2>
  <p>文章正文...</p>
  
  <section class="comments">
    <p>这个段落不受 @scope 影响</p>
  </section>
</article>
```

---

## 起止范围详解

### 细节作用域

```css
@scope (.card) to (.card__footer) {
  .link {
    color: blue;
  }
  
  .button {
    background: #3498db;
  }
}
```

```html
<div class="card">
  <div class="card__header">
    <a class="link" href="#">这是蓝色</a>
  </div>
  <div class="card__body">
    <button class="button">蓝色按钮</button>
  </div>
  <div class="card__footer">
    <a class="link" href="#">这个不是蓝色</a>
  </div>
</div>
```

### 多个起止点

```css
@scope (.content) to (.sidebar, .ads) {
  /* 在 .content 内部，但不在 .sidebar 或 .ads 内 */
  img {
    max-width: 100%;
  }
}
```

---

## 与 :scope 伪类

### 选择作用域根元素

```css
@scope (.tabs) {
  /* 选择 .tabs 本身 */
  :scope {
    display: flex;
    gap: 0;
  }
  
  /* 选择 .tabs 内的 .tab */
  .tab {
    padding: 12px 24px;
    cursor: pointer;
  }
  
  /* 选择 .tabs 内的活动 .tab */
  .tab.is-active {
    border-bottom: 2px solid #3498db;
  }
}
```

### 与子组合器结合

```css
@scope (.tab-panel) {
  :scope {
    container-type: inline-size;
    container-name: panel;
  }
  
  .panel-content {
    padding: 20px;
  }
  
  @container panel (min-width: 600px) {
    .panel-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
  }
}
```

---

## 层叠与特异性

### 优先级规则

```css
/* 全局样式 */
.title {
  color: black;
}

@scope (.card) {
  /* 作用域内样式 */
  .title {
    color: blue;  /* 作用域内优先级更高 */
  }
}

/* 外部的 .title 仍然是黑色 */
```

### 特异性计算

```css
/* 全局选择器 */
.card .title {   /* 特异性: 0,2,0 */
  color: red;
}

@scope (.card) {
  .title {       /* 特异性: 0,1,0 但在作用域内 */
    color: blue;  /* 优先级更高 */
  }
}
```

---

## 实战应用

### 组件封装

```css
/* button.component.css */
@scope (.btn) {
  :scope {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
  }
  
  .icon {
    width: 20px;
    height: 20px;
  }
  
  .label {
    font-weight: 500;
  }
  
  &[data-variant="primary"] {
    background: #3498db;
    color: white;
  }
  
  &[data-variant="danger"] {
    background: #e74c3c;
    color: white;
  }
}
```

### 文档样式隔离

```css
/* 在 Markdown 内容中应用特殊样式 */
@scope (.markdown-body) {
  h1, h2, h3 {
    margin-top: 2em;
    margin-bottom: 0.5em;
  }
  
  p {
    line-height: 1.8;
    margin-bottom: 1em;
  }
  
  code {
    background: #f4f4f4;
    padding: 2px 6px;
    border-radius: 4px;
  }
  
  pre {
    background: #2d2d2d;
    color: #f8f8f2;
    padding: 16px;
    border-radius: 8px;
    overflow-x: auto;
  }
}
```

### 表单组件

```css
@scope (.form-group) {
  :scope {
    margin-bottom: 16px;
  }
  
  .label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
  }
  
  .input {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
  }
  
  .input:focus {
    border-color: #3498db;
    outline: none;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  }
  
  .error {
    color: #e74c3c;
    font-size: 0.875rem;
    margin-top: 4px;
  }
  
  &:has(.input:invalid) .error {
    display: block;
  }
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| @scope | 118+ | 17.4+ | 128+ | 118+ |
| :scope | 27+ | 7+ | 21+ | 79+ |

---

## 降级方案

```css
/* 使用 :where 降低特异性 */
@supports not (at-rule: @scope) {
  .card .title {
    font-size: 1.5rem;
  }
  
  .card .description {
    color: #666;
  }
}

/* 或使用 CSS 变量 */
.card {
  --title-size: 1.5rem;
}

.card .title {
  font-size: var(--title-size);
}
```

---

## 奇淫技巧

### 技巧一：组件作用域级变量

```css
@scope (.theme-card) {
  :scope {
    --card-bg: #f8f9fa;
    --card-border: #e9ecef;
    --card-radius: 12px;
    
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: var(--card-radius);
    padding: 24px;
  }
  
  .title {
    color: var(--card-title-color, #212529);
  }
}

@scope (.theme-card.dark) {
  :scope {
    --card-bg: #2d3748;
    --card-border: #4a5568;
    --card-title-color: #f7fafc;
  }
}
```

### 技巧二：作用域内动画

```css
@scope (.toast) {
  :scope {
    animation: slide-in 0.3s ease;
  }
  
  @keyframes slide-in {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .close-btn {
    animation: none;  /* 取消父级动画 */
  }
}
```

### 技巧三：作用域内层叠上下文

```css
@scope (.dropdown) {
  :scope {
    position: relative;
    z-index: 1;
  }
  
  .menu {
    position: absolute;
    z-index: 10;  /* 只在 .dropdown 内部有效 */
  }
}
```

### 技巧四：与 @layer 结合

```css
@layer components {
  @scope (.card) {
    :scope {
      background: white;
    }
    
    .title {
      font-size: 1.5rem;
    }
  }
}

@layer overrides {
  @scope (.card.featured) {
    :scope {
      background: gold;
    }
  }
}
```

### 技巧五：多重作用域

```css
@scope (.page-header) {
  .nav-link {
    color: white;
    padding: 8px 16px;
  }
}

@scope (.page-footer) {
  .nav-link {
    color: #666;
    padding: 4px 8px;
  }
}
```

---

## 参考资料

- [MDN @scope](https://developer.mozilla.org/en-US/docs/Web/CSS/@scope)
- [CSS-Tricks: CSS @scope](https://css-tricks.com/css-at-scope/)
- [W3C CSS Scoping](https://drafts.csswg.org/css-cascade-6/#scope-atrule)
