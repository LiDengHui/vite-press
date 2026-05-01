---
title: CSS 计数器与生成内容深入
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

# CSS 计数器与生成内容深入

[[toc]]

CSS 计数器（Counter）和生成内容（Generated Content）允许在纯 CSS 中创建动态编号、引号、列表标记等，无需修改 HTML 结构。

---

## 计数器基础

### 创建与使用

```css
/* 定义计数器 */
ol {
  counter-reset: section;  /* 初始化计数器 */
}

li {
  counter-increment: section;  /* 递增计数器 */
}

li::before {
  content: counter(section) ". ";  /* 显示计数器值 */
}
```

### 起始值与步进

```css
/* 从 5 开始计数 */
.list {
  counter-reset: item 4;  /* 初始值为 4，第一次递增后为 5 */
}

.list li {
  counter-increment: item 2;  /* 每次递增 2 */
}
```

### 多级嵌套计数器

```css
ol {
  counter-reset: chapter;
  list-style: none;
}

ol li {
  counter-increment: chapter;
}

ol li::before {
  content: counter(chapter) ". ";
}

/* 嵌套子列表 */
ol ol {
  counter-reset: section;
}

ol ol li {
  counter-increment: section;
}

ol ol li::before {
  content: counter(chapter) "." counter(section) " ";
}

/* 三级嵌套 */
ol ol ol {
  counter-reset: subsection;
}

ol ol ol li {
  counter-increment: subsection;
}

ol ol ol li::before {
  content: counter(chapter) "." counter(section) "." counter(subsection) " ";
}
```

---

## 计数器样式

### list-style-type 值

```css
.roman::before {
  content: counter(item, upper-roman) ". ";
}

.alpha::before {
  content: counter(item, lower-alpha) ". ";
}

.chinese::before {
  content: counter(item, cjk-ideographic) "、";
}
```

### 自定义样式

```css
.fancy-counter {
  counter-reset: step;
}

.step {
  counter-increment: step;
  position: relative;
  padding-left: 40px;
}

.step::before {
  content: counter(step);
  position: absolute;
  left: 0;
  width: 28px;
  height: 28px;
  background: #3498db;
  color: white;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 14px;
  font-weight: bold;
}
```

---

## 生成内容详解

### content 属性值

```css
/* 纯文本 */
.text::before {
  content: "前缀";
}

/* Unicode 字符 */
.arrow::before {
  content: "\2192";  /* → */
}

/* 属性值 */
.attr::before {
  content: attr(data-label);
}

/* 计数器 */
.count::before {
  content: counter(item);
}

/* 引号 */
.quote::before {
  content: open-quote;
}

.quote::after {
  content: close-quote;
}

/* 组合 */
.combined::before {
  content: "Step " counter(step) ": ";
}
```

### 引号控制

```css
/* 设置引号样式 */
blockquote {
  quotes: "「" "」" "『" "』";
}

blockquote::before {
  content: open-quote;
}

blockquote::after {
  content: close-quote;
}

/* 嵌套引号 */
blockquote q {
  quotes: "『" "』";
}
```

---

## 实战应用

### 自动编号标题

```css
.article {
  counter-reset: h2 h3 h4;
}

.article h2 {
  counter-increment: h2;
  counter-reset: h3;
}

.article h3 {
  counter-increment: h3;
  counter-reset: h4;
}

.article h4 {
  counter-increment: h4;
}

.article h2::before {
  content: counter(h2) ". ";
}

.article h3::before {
  content: counter(h2) "." counter(h3) " ";
}

.article h4::before {
  content: counter(h2) "." counter(h3) "." counter(h4) " ";
}
```

### 面包屑导航

```css
.breadcrumb {
  display: flex;
  gap: 8px;
}

.breadcrumb li:not(:last-child)::after {
  content: " / ";
  margin-left: 8px;
  color: #999;
}
```

### 数据表格行号

```css
.data-table {
  counter-reset: row;
}

.data-table tbody tr {
  counter-increment: row;
}

.data-table tbody tr td:first-child::before {
  content: counter(row);
  color: #999;
  margin-right: 8px;
}
```

### 步骤条

```css
.steps {
  display: flex;
  counter-reset: step;
}

.step {
  flex: 1;
  text-align: center;
  counter-increment: step;
}

.step::before {
  content: counter(step);
  display: block;
  width: 40px;
  height: 40px;
  line-height: 40px;
  margin: 0 auto 8px;
  background: #e0e0e0;
  border-radius: 50%;
}

.step.active::before {
  background: #3498db;
  color: white;
}

.step:not(:last-child)::after {
  content: "";
  display: block;
  height: 2px;
  background: #e0e0e0;
  position: absolute;
  right: -50%;
  top: 20px;
  width: 100%;
}
```

---

## counters() 函数

### 显示完整路径

```css
.toc {
  counter-reset: section;
}

.toc li {
  counter-increment: section;
}

/* 显示所有父级计数器 */
.toc li::before {
  content: counters(section, ".") " ";
}
```

```html
<ol class="toc">
  <li>第一章
    <ol>
      <li>第一节
        <ol>
          <li>第一小节</li>
        </ol>
      </li>
    </ol>
  </li>
</ol>
<!-- 输出: 1.1.1 第一小节 -->
```

---

## 计数器作用域

### 重置范围

```css
/* 计数器在创建它的元素内有效 */
.section {
  counter-reset: item;
}

/* 跨 section 计数 */
.document {
  counter-reset: global-item;
}

.document .item {
  counter-increment: global-item;
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| counter-reset | 2+ | 3.1+ | 1+ | 8+ |
| counter-increment | 2+ | 3.1+ | 1+ | 8+ |
| counter() | 2+ | 3.1+ | 1+ | 8+ |
| counters() | 2+ | 3.1+ | 1+ | 8+ |
| content | 1+ | 1+ | 1+ | 8+ |

---

## 奇淫技巧

### 技巧一：CSS 进度指示器

```css
.checklist {
  counter-reset: checked total;
}

.checklist input[type="checkbox"] {
  counter-increment: total;
}

.checklist input[type="checkbox"]:checked {
  counter-increment: checked total;
}

.checklist::after {
  content: counter(checked) " / " counter(total) " 完成";
  display: block;
  margin-top: 1rem;
  font-weight: bold;
}
```

### 技巧二：自动分页

```css
.document {
  counter-reset: page;
}

.page {
  counter-increment: page;
}

.page::after {
  content: "第 " counter(page) " 页";
  position: absolute;
  bottom: 20px;
  right: 20px;
}
```

### 技巧三：动态 ToC

```css
/* 基于 heading 自动生成目录编号 */
article {
  counter-reset: h2 h3;
}

h2 {
  counter-increment: h2;
  counter-reset: h3;
}

h3 {
  counter-increment: h3;
}

.toc-h2::before {
  content: counter(h2) ". ";
}

.toc-h3::before {
  content: counter(h2) "." counter(h3) " ";
}
```

### 技巧四：CSS 图表图例

```css
.chart-legend {
  counter-reset: legend;
}

.legend-item {
  counter-increment: legend;
}

.legend-item::before {
  content: counter(legend);
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  margin-right: 8px;
  text-align: center;
  line-height: 20px;
  font-size: 12px;
  color: white;
}

.legend-item:nth-child(1)::before { background: #3498db; }
.legend-item:nth-child(2)::before { background: #2ecc71; }
.legend-item:nth-child(3)::before { background: #e74c3c; }
```

### 技巧五：Footnote 脚注

```css
.article {
  counter-reset: footnote;
}

.footnote-ref {
  counter-increment: footnote;
  text-decoration: none;
  color: #3498db;
}

.footnote-ref::after {
  content: "[" counter(footnote) "]";
  font-size: 0.75em;
  vertical-align: super;
}

.footnotes li {
  counter-increment: footnote-display;
}

.footnotes li::marker {
  content: "[" counter(footnote-display) "] ";
}
```

---

## 参考资料

- [MDN: CSS 计数器](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_counter_styles/Using_CSS_counters)
- [MDN: content](https://developer.mozilla.org/zh-CN/docs/Web/CSS/content)
- [CSS-Tricks: CSS Counters](https://css-tricks.com/almanac/properties/c/counter-increment/)
