---
title: CSS 选择器深入
date: 2025-04-29
tags:
  - CSS
  - 选择器
  - 前端
categories:
  - 技术文档
  - 前端
  - CSS
  - 基础入门
---

# CSS 选择器深入

[[toc]]

CSS 选择器是样式应用的基石。深入理解选择器的工作原理和组合方式，能显著提升样式编写效率和代码可维护性。

---

## 基本选择器

### 元素选择器

```css
p { color: #333; }
h1 { font-size: 2rem; }
```

### 类选择器

```css
.card { background: white; }
.btn-primary { background: #3498db; }
```

### ID 选择器

```css
#header { position: fixed; }
#main { max-width: 1200px; }
```

### 通配符选择器

```css
* { box-sizing: border-box; }
```

### 属性选择器

```css
/* 存在属性 */
[disabled] { opacity: 0.5; }

/* 精确匹配 */
[type="text"] { border: 1px solid #ddd; }

/* 包含值 */
[class~="active"] { font-weight: bold; }

/* 以值开头 */
[href^="https"] { color: green; }

/* 以值结尾 */
[src$=".png"] { border: none; }

/* 包含子串 */
[class*="col-"] { float: left; }

/* 以值开头（带连字符） */
[lang|="zh"] { font-family: serif; }

/* 大小写敏感控制 */
[type="TEXT" s] { /* 区分大小写 */ }
[type="TEXT" i] { /* 不区分大小写 */ }
```

---

## 组合选择器

### 后代选择器

```css
nav a { color: #333; }
```

### 子选择器

```css
ul > li { list-style: disc; }
```

### 相邻兄弟选择器

```css
h2 + p { margin-top: 0; }
```

### 通用兄弟选择器

```css
h2 ~ p { color: #666; }
```

### 选择器列表

```css
h1, h2, h3 { font-weight: 600; }
```

---

## 伪类选择器

### 链接伪类

```css
a:link { color: blue; }
a:visited { color: purple; }
a:hover { text-decoration: underline; }
a:active { color: red; }
```

### 表单状态

```css
input:focus { border-color: #3498db; }
input:disabled { background: #f5f5f5; }
input:checked + label { font-weight: bold; }
input:valid { border-color: green; }
input:invalid { border-color: red; }
```

### 位置伪类

```css
/* 第一个子元素 */
li:first-child { margin-top: 0; }

/* 最后一个子元素 */
li:last-child { margin-bottom: 0; }

/* 唯一子元素 */
li:only-child { font-weight: bold; }

/* 第 N 个子元素 */
li:nth-child(3) { background: #f5f5f5; }
li:nth-child(odd) { background: #f9f9f9; }
li:nth-child(even) { background: #fff; }
li:nth-child(3n+1) { clear: left; }

/* 倒数第 N 个子元素 */
li:nth-last-child(2) { color: #999; }

/* 第 N 个同类型元素 */
p:nth-of-type(2) { font-style: italic; }

/* 唯一同类型元素 */
img:only-of-type { display: block; }
```

### 内容伪类

```css
/* 空元素 */
div:empty { display: none; }

/* 包含特定子元素 */
section:has(h2) { border-top: 2px solid #333; }

/* 包含特定子元素（CSS Nesting） */
.card:has(.badge) { position: relative; }
```

### 用户交互

```css
/* 焦点 */
button:focus-visible { outline: 2px solid #3498db; }

/* 目标元素 */
section:target { background: #fff3cd; }

/* 选择文本 */
::selection { background: #3498db; color: white; }
```

---

## 伪元素

### ::before / ::after

```css
.quote::before { content: '"'; }
.quote::after { content: '"'; }
```

### ::first-line / ::first-letter

```css
p::first-line { font-weight: bold; }
p::first-letter { font-size: 3em; float: left; }
```

### ::placeholder

```css
input::placeholder { color: #999; }
```

### ::marker

```css
li::marker { color: #3498db; }
```

### ::backdrop

```css
dialog::backdrop { background: rgba(0,0,0,0.5); }
```

---

## 逻辑伪类

### :is() - 匹配任意

```css
/* 简写 */
:is(h1, h2, h3) span { color: red; }

/* 等价于 */
h1 span, h2 span, h3 span { color: red; }

/* 降低特异性 */
:where(h1, h2, h3) { font-weight: 600; }
```

### :where() - 零特异性

```css
/* 特异性为 0 */
:where(.btn) { padding: 10px; }

/* 可被轻易覆盖 */
.btn-primary { padding: 12px; }
```

### :not() - 否定

```css
/* 排除特定元素 */
button:not(:disabled) { cursor: pointer; }

/* 排除多个 */
input:not([type="submit"]):not([type="button"]) { border: 1px solid #ddd; }

/* 嵌套使用 */
li:not(:is(:first-child, :last-child)) { margin: 4px 0; }
```

### :has() - 父选择器

```css
/* 包含特定子元素 */
.card:has(img) { display: flex; }

/* 包含特定后代 */
section:has(> h2) { padding-top: 2rem; }

/* 兄弟关系 */
.item:has(+ .item.active) { border-left: 2px solid #3498db; }

/* 复杂条件 */
form:has(input:invalid) button[type="submit"] { opacity: 0.5; }
```

---

## 特异性计算

### 计算规则

```
(内联样式, ID, 类/属性/伪类, 元素/伪元素)
```

```css
/* 0,0,1,0 */
.btn { }

/* 0,1,0,0 */
#header { }

/* 0,0,2,1 */
nav .menu li { }

/* 1,0,0,0 (最高) */
style="color: red"
```

### 实战技巧

```css
/* 避免使用 !important */
.btn { background: blue; }
.btn.primary { background: #3498db; } /* 更具体，无需 !important */

/* 使用 CSS 变量覆盖 */
.component {
  --bg: white;
  background: var(--bg);
}

.component.dark {
  --bg: #1a1a1a;
}
```

---

## 性能优化

### 避免过深嵌套

```css
/* ❌ 避免 */
.container .wrapper .content .article .title { }

/* ✅ 推荐 */
.article-title { }
```

### 选择器右至左解析

```css
/* 浏览器从右向左匹配 */
.container div { } /* 先匹配所有 div，再过滤 */

/* 更高效的写法 */
.container > div { } /* 直接子元素 */
```

---

## 浏览器兼容性

| 选择器 | Chrome | Safari | Firefox | Edge |
|--------|--------|--------|---------|------|
| :is() | 88+ | 14+ | 78+ | 88+ |
| :where() | 88+ | 14+ | 78+ | 88+ |
| :has() | 105+ | 15.4+ | 121+ | 105+ |
| :not() 多选择器 | 88+ | 9+ | 84+ | 88+ |

---

## 奇淫技巧

### 技巧一：纯 CSS 手风琴

```css
.accordion-item:has(input:checked) .content {
  max-height: 500px;
}

.accordion-item .content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s;
}
```

### 技巧二：网格计数

```css
.grid:has(> :nth-child(4)) {
  grid-template-columns: repeat(2, 1fr);
}

.grid:has(> :nth-child(7)) {
  grid-template-columns: repeat(3, 1fr);
}
```

### 技巧三：焦点陷阱

```css
/* 仅当子元素有焦点时显示 */
.dropdown:focus-within .menu {
  display: block;
}
```

### 技巧四：空状态

```css
.list:empty::before {
  content: '暂无数据';
  color: #999;
}
```

### 技巧五：交错动画

```css
.list-item {
  animation: slide-in 0.3s ease backwards;
}

.list-item:nth-child(1) { animation-delay: 0s; }
.list-item:nth-child(2) { animation-delay: 0.1s; }
.list-item:nth-child(3) { animation-delay: 0.2s; }
```

---

## 参考资料

- [MDN: CSS 选择器](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_selectors)
- [CSS-Tricks: Specificity](https://css-tricks.com/specifics-on-css-specificity/)
- [Can I Use: CSS Selectors](https://caniuse.com/css-has)
