---
title: CSS Nesting 嵌套语法
date: 2025-04-29
tags:
  - CSS
  - Nesting
  - 嵌套
categories:
  - 技术文档
  - 前端
  - CSS
  - 基础入门
---

# CSS Nesting 嵌套语法

[[toc]]

CSS Nesting 允许在一个选择器内部嵌套其他选择器，使样式更加结构化、可读性更强。这是 CSS 原生支持的特性，无需预处理器。

---

## 基本语法

### 简单嵌套

```css
.card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  
  .title {
    font-size: 1.5rem;
    margin-bottom: 12px;
  }
  
  .content {
    color: #666;
    line-height: 1.6;
  }
}
```

### 等效于

```css
.card {
  background: white;
  border-radius: 8px;
  padding: 20px;
}

.card .title {
  font-size: 1.5rem;
  margin-bottom: 12px;
}

.card .content {
  color: #666;
  line-height: 1.6;
}
```

---

## 嵌套规则

### 元素选择器必需用 & 连接

```css
/* ❌ 错误：元素选择器不能直接嵌套 */
.card {
  p {
    color: red;
  }
}

/* ✅ 正确：使用 & 连接 */
.card {
  & p {
    color: red;
  }
}
```

### 类/伪类/伪元素可以直接嵌套

```css
.button {
  background: #3498db;
  
  /* 类选择器 - 无需 & */
  &.primary {
    background: #2ecc71;
  }
  
  /* 伪类 - 无需 & */
  &:hover {
    background: #2980b9;
  }
  
  /* 伪元素 - 无需 & */
  &::before {
    content: '';
  }
}
```

### & 与不用 & 的区别

```css
.component {
  /* 不用 & → .component .active */
  .active {
    color: green;
  }
  
  /* 用 & → .component.active */
  &.active {
    border: 2px solid green;
  }
  
  /* 用 & → .component:hover */
  &:hover {
    background: #f5f5f5;
  }
}
```

---

## 多层嵌套

```css
.nav {
  display: flex;
  gap: 20px;
  
  .item {
    position: relative;
    
    .link {
      padding: 10px 16px;
      color: #333;
      
      &:hover {
        color: #3498db;
      }
      
      &.is-active {
        color: #3498db;
        font-weight: bold;
      }
    }
    
    .submenu {
      position: absolute;
      top: 100%;
      display: none;
      
      .sub-item {
        padding: 8px 16px;
      }
    }
    
    &:hover .submenu {
      display: block;
    }
  }
}
```

---

## @media 嵌套

```css
.card {
  padding: 20px;
  
  .title {
    font-size: 1.5rem;
  }
  
  /* 嵌套媒体查询 */
  @media (min-width: 768px) {
    padding: 40px;
    
    .title {
      font-size: 2rem;
    }
  }
  
  @media (min-width: 1024px) {
    display: flex;
    gap: 30px;
    
    .image {
      width: 40%;
    }
    
    .content {
      width: 60%;
    }
  }
}
```

---

## @supports 嵌套

```css
.card {
  border: 1px solid #ddd;
  
  @supports (backdrop-filter: blur(10px)) {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
  
  @supports not (backdrop-filter: blur(10px)) {
    background: white;
  }
}
```

---

## 复杂选择器嵌套

### 选择器列表

```css
.button,
.link {
  padding: 10px 20px;
  
  &:hover {
    opacity: 0.8;
  }
  
  &:focus-visible {
    outline: 2px solid #3498db;
  }
}
```

### :is() 与 :where() 嵌套

```css
.card {
  :is(h1, h2, h3) {
    margin-top: 0;
  }
  
  :where(p, ul, ol) {
    margin-bottom: 1em;
  }
}
```

### 属性选择器嵌套

```css
input {
  &[type="text"],
  &[type="email"] {
    border: 1px solid #ddd;
    padding: 10px;
  }
  
  &[type="submit"] {
    background: #3498db;
    color: white;
    cursor: pointer;
  }
}
```

---

## 嵌套与 CSS 变量

```css
.component {
  --padding: 20px;
  --color: #333;
  
  padding: var(--padding);
  color: var(--color);
  
  .header {
    --color: #000;
    color: var(--color);
    font-size: 1.5rem;
  }
  
  .body {
    color: var(--color);  /* 继承父级变量 */
  }
  
  @media (min-width: 768px) {
    --padding: 40px;
  }
}
```

---

## 嵌套与 @layer

```css
@layer base {
  body {
    font-family: system-ui, sans-serif;
    
    h1, h2, h3 {
      font-weight: 600;
    }
  }
}

@layer components {
  .card {
    background: white;
    
    .title {
      font-size: 1.5rem;
    }
    
    @media (min-width: 768px) {
      .title {
        font-size: 2rem;
      }
    }
  }
}
```

---

## 浏览器兼容性

| 浏览器 | 版本 | 备注 |
|--------|------|------|
| Chrome | 120+ | 完全支持 |
| Safari | 17.2+ | 完全支持 |
| Firefox | 117+ | 完全支持 |
| Edge | 120+ | 完全支持 |

---

## 降级方案

### 使用 PostCSS 预处理

```bash
npm install postcss-nesting
```

```js
// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-nesting')
  ]
}
```

### 使用 Sass/Less 作为降级

```scss
// Sass 语法相似但更灵活
.component {
  padding: 20px;
  
  p {  // Sass 允许
    color: red;
  }
  
  &:hover {
    background: #f5f5f5;
  }
}
```

---

## 奇淫技巧

### 技巧一：BEM + Nesting

```css
.card {
  background: white;
  border-radius: 8px;
  
  /* 元素 */
  &__image {
    width: 100%;
    border-radius: 8px 8px 0 0;
  }
  
  &__title {
    font-size: 1.5rem;
    padding: 0 20px;
  }
  
  &__content {
    padding: 20px;
    color: #666;
  }
  
  /* 修饰符 */
  &--featured {
    border: 2px solid gold;
  }
  
  &--compact {
    padding: 12px;
    
    & .card__title {
      font-size: 1rem;
    }
  }
}
```

### 技巧二：条件导航

```css
.nav {
  display: flex;
  
  .link {
    padding: 10px 16px;
    color: #333;
    
    &:hover {
      color: #3498db;
    }
    
    &.is-active {
      color: #3498db;
      font-weight: bold;
      
      &::after {
        content: '';
        display: block;
        height: 2px;
        background: currentColor;
      }
    }
  }
}
```

### 技巧三：表单状态管理

```css
.form-group {
  margin-bottom: 16px;
  
  .label {
    display: block;
    margin-bottom: 8px;
  }
  
  .input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    
    &:focus {
      border-color: #3498db;
      outline: none;
    }
    
    &:invalid:not(:placeholder-shown) {
      border-color: #e74c3c;
    }
    
    &:valid:not(:placeholder-shown) {
      border-color: #2ecc71;
    }
  }
  
  .error {
    display: none;
    color: #e74c3c;
    font-size: 0.875rem;
    margin-top: 4px;
  }
  
  &:has(.input:invalid:not(:placeholder-shown)) .error {
    display: block;
  }
}
```

### 技巧四：级联动画

```css
.menu {
  .item {
    opacity: 0;
    transform: translateY(10px);
    
    @media (prefers-reduced-motion: no-preference) {
      animation: fade-in 0.3s ease forwards;
      
      &:nth-child(1) { animation-delay: 0s; }
      &:nth-child(2) { animation-delay: 0.1s; }
      &:nth-child(3) { animation-delay: 0.2s; }
      &:nth-child(4) { animation-delay: 0.3s; }
    }
  }
}

@keyframes fade-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 技巧五：主题切换

```css
:root {
  --bg: #fff;
  --text: #333;
}

[data-theme="dark"] {
  --bg: #1a1a1a;
  --text: #f5f5f5;
}

body {
  background: var(--bg);
  color: var(--text);
  
  .card {
    background: var(--bg);
    border: 1px solid var(--text);
    
    .title {
      color: var(--text);
    }
  }
}
```

---

## 参考资料

- [MDN CSS Nesting](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting)
- [CSS Nesting Module Level 1](https://drafts.csswg.org/css-nesting/)
- [Can I Use: CSS Nesting](https://caniuse.com/css-nesting)
