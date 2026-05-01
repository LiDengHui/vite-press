---
title: CSS 计数器进阶
date: 2025-04-29
tags:
  - CSS
  - 计数器
categories:
  - 技术文档
  - 前端
  - CSS
  - 视觉表现
---

# CSS 计数器进阶

[[toc]]

CSS 计数器（Counter）允许纯 CSS 实现自动编号，无需 JavaScript。从简单的列表序号到复杂的多级编号系统，计数器都能优雅胜任。

---

## 基础语法

### 核心属性

```css
counter-reset: my-counter;      /* 初始化计数器 */
counter-increment: my-counter;  /* 递增计数器 */
content: counter(my-counter);   /* 显示计数器值 */
```

### 简单列表编号

```css
.custom-list {
  counter-reset: item;
  list-style: none;
  padding-left: 0;
}

.custom-list li {
  counter-increment: item;
  padding-left: 2rem;
  position: relative;
}

.custom-list li::before {
  content: counter(item) '.';
  position: absolute;
  left: 0;
  color: #4a90d9;
  font-weight: bold;
}
```

---

## 多级编号

### 嵌套章节编号

```css
/* 初始化顶级计数器 */
.article {
  counter-reset: chapter;
}

/* 一级标题 */
h2 {
  counter-increment: chapter;
  counter-reset: section;
}

h2::before {
  content: counter(chapter) '. ';
  color: #4a90d9;
}

/* 二级标题 */
h3 {
  counter-increment: section;
  counter-reset: subsection;
}

h3::before {
  content: counter(chapter) '.' counter(section) ' ';
  color: #666;
}

/* 三级标题 */
h4 {
  counter-increment: subsection;
}

h4::before {
  content: counter(chapter) '.' counter(section) '.' counter(subsection) ' ';
  color: #999;
}
```

---

## counter() 格式化

### 不同计数样式

```css
.roman-list {
  counter-reset: item;
}

.roman-list li::before {
  content: counter(item, upper-roman) '. ';
}

.alpha-list {
  counter-reset: item;
}

.alpha-list li::before {
  content: counter(item, lower-alpha) ') ';
}

.chinese-list {
  counter-reset: item;
}

.chinese-list li::before {
  content: counter(item, cjk-ideographic) '、';
}
```

| 样式名 | 示例 |
|--------|------|
| `decimal` | 1, 2, 3 |
| `decimal-leading-zero` | 01, 02, 03 |
| `lower-roman` | i, ii, iii |
| `upper-roman` | I, II, III |
| `lower-alpha` | a, b, c |
| `upper-alpha` | A, B, C |
| `lower-greek` | α, β, γ |
| `cjk-ideographic` | 一, 二, 三 |
| `simp-chinese-formal` | 壹, 贰, 叁 |

---

## @counter-style 自定义计数

### 自定义列表标记

```css
@counter-style thumbs {
  system: cyclic;
  symbols: "\1F44D" "\1F44E" "\1F44C";
  suffix: " ";
}

.thumbs-list {
  list-style: thumbs;
}
```

### 自定义编号规则

```css
@counter-style circled-nums {
  system: fixed;
  symbols: "①" "②" "③" "④" "⑤" "⑥" "⑦" "⑧" "⑨" "⑩";
  suffix: " ";
}

.circled-list {
  list-style: circled-nums;
}
```

### 中文数字计数

```css
@counter-style chinese-nums {
  system: additive;
  range: 1 9999;
  additive-symbols: 
    9000 "九千", 8000 "八千", 7000 "七千", 6000 "六千",
    5000 "五千", 4000 "四千", 3000 "三千", 2000 "二千",
    1000 "一千", 900 "九百", 800 "八百", 700 "七百",
    600 "六百", 500 "五百", 400 "四百", 300 "三百",
    200 "二百", 100 "一百", 90 "九十", 80 "八十",
    70 "七十", 60 "六十", 50 "五十", 40 "四十",
    30 "三十", 20 "二十", 10 "十", 9 "九",
    8 "八", 7 "七", 6 "六", 5 "五",
    4 "四", 3 "三", 2 "二", 1 "一";
}
```

---

## 与 ::marker 结合

```css
.custom-marker {
  counter-reset: item;
  list-style: none;
}

.custom-marker li {
  counter-increment: item;
}

.custom-marker li::marker {
  content: "Step " counter(item, decimal-leading-zero) ": ";
  color: #4a90d9;
  font-weight: bold;
}
```

---

## 复杂应用场景

### 带前缀的章节编号

```css
.article {
  counter-reset: chapter section figure table;
}

h2 {
  counter-increment: chapter;
  counter-reset: section figure table;
}

h2::before {
  content: "第" counter(chapter, cjk-ideographic) "章 ";
}

figure {
  counter-increment: figure;
}

figure figcaption::before {
  content: "图 " counter(chapter) "-" counter(figure) " ";
}

table {
  counter-increment: table;
}

table caption::before {
  content: "表 " counter(chapter) "-" counter(table) " ";
}
```

### 面包屑导航

```css
.breadcrumb {
  display: flex;
  list-style: none;
  padding: 0;
}

.breadcrumb li {
  counter-increment: crumb;
}

.breadcrumb li::before {
  content: counter(crumb) " > ";
  margin-right: 0.5rem;
  color: #999;
}

.breadcrumb li:first-child::before {
  content: none;
}
```

### 带缩进的目录树

```css
.tree {
  counter-reset: level1;
  list-style: none;
  padding-left: 0;
}

.tree li {
  counter-increment: level1;
  padding-left: 2rem;
  position: relative;
}

.tree li::before {
  content: counter(level1) ".";
  position: absolute;
  left: 0;
}

.tree ul {
  counter-reset: level2;
  list-style: none;
}

.tree ul li {
  counter-increment: level2;
}

.tree ul li::before {
  content: counter(level1) "." counter(level2) ".";
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| counter-reset | 1+ | 3+ | 1+ | 8+ |
| counter-increment | 1+ | 3+ | 1+ | 8+ |
| counter() | 1+ | 3+ | 1+ | 8+ |
| @counter-style | 91+ | 17+ | 33+ | 91+ |
| ::marker | 86+ | 11.1+ | 68+ | 86+ |

---

## 奇淫技巧

### 技巧一：倒计时样式

```css
.countdown {
  counter-reset: count 10;
  animation: countdown 10s linear forwards;
}

.countdown::after {
  content: counter(count);
}

@keyframes countdown {
  0%   { counter-reset: count 10; }
  10%  { counter-reset: count 9; }
  20%  { counter-reset: count 8; }
  /* ... */
  100% { counter-reset: count 0; }
}
```

### 技巧二：自动生成脚注编号

```css
.article {
  counter-reset: footnote;
}

.footnote-ref {
  counter-increment: footnote;
  vertical-align: super;
  font-size: 0.75em;
}

.footnote-ref::after {
  content: "[" counter(footnote) "]";
}

.footnotes li {
  counter-increment: footnote-display;
}

.footnotes li::marker {
  content: "[" counter(footnote-display) "] ";
}
```

### 技巧三：复选框选中计数

```css
.todo-list {
  counter-reset: checked 0 total 0;
}

.todo-list li {
  counter-increment: total;
}

.todo-list input:checked {
  counter-increment: checked;
}

.todo-list::after {
  content: "完成: " counter(checked) " / " counter(total);
  display: block;
  margin-top: 1rem;
  font-weight: bold;
}
```

> 注：CSS 计数器不能真正响应 checkbox 状态变化计数，此示例仅供概念展示。实际需配合少量 JS。

### 技巧四：步骤条进度

```css
.steps {
  counter-reset: step;
  display: flex;
}

.step {
  counter-increment: step;
  flex: 1;
  text-align: center;
  position: relative;
}

.step::before {
  content: counter(step);
  display: inline-block;
  width: 2rem;
  height: 2rem;
  line-height: 2rem;
  border-radius: 50%;
  background: #ddd;
}

.step.active::before {
  background: #4a90d9;
  color: white;
}

.step.completed::before {
  content: "✓";
  background: #2ecc71;
  color: white;
}
```

### 技巧五：表格行自动编号

```css
.data-table {
  counter-reset: row;
}

.data-table tbody tr {
  counter-increment: row;
}

.data-table tbody tr td:first-child::before {
  content: counter(row, decimal-leading-zero) ". ";
  color: #999;
}
```

---

## 参考资料

- [MDN CSS 计数器](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_counter_styles/Using_CSS_counters)
- [MDN @counter-style](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@counter-style)
- [CSS-Tricks: counter-increment](https://css-tricks.com/almanac/properties/c/counter-increment/)
