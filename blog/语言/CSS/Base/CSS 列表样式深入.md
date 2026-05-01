---
title: CSS 列表样式深入
date: 2025-04-29
tags:
  - CSS
  - 列表
categories:
  - 技术文档
  - 前端
  - CSS
  - 视觉表现
---

# CSS 列表样式深入

[[toc]]

列表是网页内容的基本构成单元。CSS 提供了丰富的列表样式控制，本文系统讲解从基础列表到自定义列表设计的所有技术。

---

## 基础列表

### list-style-type

```css
/* 有序列表 */
.decimal      { list-style-type: decimal; }      /* 1. 2. 3. */
.decimal-leading-zero { list-style-type: decimal-leading-zero; } /* 01. 02. */
.lower-roman  { list-style-type: lower-roman; }  /* i. ii. iii. */
.upper-roman  { list-style-type: upper-roman; }  /* I. II. III. */
.lower-alpha  { list-style-type: lower-alpha; }  /* a. b. c. */
.upper-alpha  { list-style-type: upper-alpha; }  /* A. B. C. */
.lower-greek  { list-style-type: lower-greek; }  /* α. β. γ. */

/* 无序列表 */
.disc         { list-style-type: disc; }         /* • */
.circle       { list-style-type: circle; }       /* ○ */
.square       { list-style-type: square; }       /* ■ */

/* 其他 */
.none         { list-style-type: none; }         /* 无 */
```

### 嵌套列表

```css
/* 嵌套列表层级 */
ol {
  list-style-type: decimal;
}

ol ol {
  list-style-type: lower-alpha;
}

ol ol ol {
  list-style-type: lower-roman;
}

/* CSS Counters 实现更复杂的嵌套编号 */
nested-list {
  counter-reset: item;
}

.nested-list li {
  counter-increment: item;
}

.nested-list li::marker {
  content: counters(item, '.') '. ';
  font-weight: bold;
  color: #3498db;
}
```

---

## 标记位置

### list-style-position

```css
/* 标记在列表项内部（默认） */
.inside {
  list-style-position: inside;
}

/* 标记在列表项外部 */
.outside {
  list-style-position: outside;
}

/* 实际效果对比 */
.inside-demo {
  list-style-position: inside;
  padding-left: 0;
}

.outside-demo {
  list-style-position: outside;
  padding-left: 2rem;
}
```

### 占位对比

| position | 标记位置 | 文本对齐 |
|----------|----------|----------|
| inside   | 在 padding 内 | 标记与文本同起 |
| outside  | 在 padding 外 | 文本整齐对齐 |

---

## 自定义标记

### ::marker 伪元素

```css
/* 基础样式 */
.custom-marker li::marker {
  color: #3498db;
  font-size: 1.2em;
}

/* 自定义符号 */
.custom-marker li::marker {
  content: '✔ ';
  color: #2ecc71;
}

.custom-marker li.important::marker {
  content: '⚠ ';
  color: #e74c3c;
}
```

### 完全自定义列表

```css
/* 无序列表 - 图标 */
.icon-list {
  list-style: none;
  padding: 0;
}

.icon-list li {
  position: relative;
  padding-left: 2rem;
  margin-bottom: 0.5rem;
}

.icon-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.3em;
  width: 1rem;
  height: 1rem;
  background: url('check.svg') no-repeat center/contain;
}

/* 有序列表 - 编号 */
.numbered-list {
  counter-reset: item;
  list-style: none;
  padding: 0;
}

.numbered-list li {
  counter-increment: item;
  position: relative;
  padding-left: 2.5rem;
  margin-bottom: 1rem;
}

.numbered-list li::before {
  content: counter(item);
  position: absolute;
  left: 0;
  top: 0;
  width: 1.8rem;
  height: 1.8rem;
  background: #3498db;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: bold;
}
```

---

## 进度列表

```css
/* 步骤列表 */
.step-list {
  list-style: none;
  padding: 0;
  counter-reset: step;
}

.step-list li {
  counter-increment: step;
  position: relative;
  padding-left: 3rem;
  padding-bottom: 2rem;
  border-left: 2px solid #e0e0e0;
}

.step-list li:last-child {
  border-left: none;
  padding-bottom: 0;
}

.step-list li::before {
  content: counter(step);
  position: absolute;
  left: -1rem;
  top: 0;
  width: 2rem;
  height: 2rem;
  background: #3498db;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.step-list li.completed::before {
  background: #2ecc71;
  content: '✓';
}

.step-list li.active::before {
  background: #f39c12;
  box-shadow: 0 0 0 4px rgba(243, 156, 18, 0.3);
}
```

---

## 时间线列表

```css
.timeline {
  list-style: none;
  padding: 0;
  position: relative;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e0e0e0;
}

.timeline li {
  position: relative;
  padding-left: 3rem;
  padding-bottom: 2rem;
}

.timeline li::before {
  content: '';
  position: absolute;
  left: 14px;
  top: 4px;
  width: 12px;
  height: 12px;
  background: #3498db;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 2px #3498db;
}

.timeline li.highlight::before {
  background: #e74c3c;
  box-shadow: 0 0 0 2px #e74c3c;
}

.timeline .date {
  font-size: 0.875rem;
  color: #999;
  margin-bottom: 0.25rem;
}

.timeline .title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}
```

---

## 推荐列表模式

### 分类列表

```css
/* 纯 CSS 分类展开 */
.category-list {
  list-style: none;
  padding: 0;
}

.category-list li {
  margin-bottom: 0.5rem;
}

.category-list summary {
  cursor: pointer;
  padding: 0.75rem 1rem;
  background: #f5f5f5;
  border-radius: 8px;
  font-weight: 500;
}

.category-list summary:hover {
  background: #e8e8e8;
}

.category-list ul {
  list-style: none;
  padding-left: 1.5rem;
  margin-top: 0.5rem;
}

.category-list ul li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}
```

### 标签列表

```css
.tag-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-list li {
  padding: 0.25rem 0.75rem;
  background: #f0f0f0;
  border-radius: 9999px;
  font-size: 0.875rem;
  transition: background 0.2s;
}

.tag-list li:hover {
  background: #e0e0e0;
}

.tag-list li.active {
  background: #3498db;
  color: white;
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| ::marker | 86+ | 11.1+ | 68+ | 86+ |
| list-style-type 自定义 | 79+ | 不支持 | 33+ | 79+ |
| counters() | 1+ | 3.1+ | 1+ | 12+ |

---

## 奇淫技巧

### 技巧一：纯 CSS 手风琴列表

```css
.accordion-list {
  list-style: none;
  padding: 0;
}

.accordion-list li {
  border-bottom: 1px solid #e0e0e0;
}

.accordion-list summary {
  cursor: pointer;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.accordion-list summary::after {
  content: '+';
  font-size: 1.2rem;
  transition: transform 0.3s;
}

.accordion-list details[open] summary::after {
  content: '−';
}

.accordion-list .content {
  padding: 0 1rem 1rem;
}
```

### 技巧二：待办事项列表

```css
.todo-list {
  list-style: none;
  padding: 0;
}

.todo-list li {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-bottom: 1px solid #f0f0f0;
}

.todo-list input[type="checkbox"] {
  appearance: none;
  width: 1.2rem;
  height: 1.2rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.todo-list input[type="checkbox"]:checked {
  background: #2ecc71;
  border-color: #2ecc71;
}

.todo-list input[type="checkbox"]:checked + span {
  text-decoration: line-through;
  color: #999;
}
```

### 技巧三：编号列表不重复

```css
/* 使用 counter-set 重置计数器 */
.reset-list {
  list-style: none;
  padding: 0;
}

.reset-list > li {
  counter-increment: main;
}

.reset-list > li::before {
  content: counter(main) '. ';
  font-weight: bold;
  color: #3498db;
}

.reset-list ol {
  counter-reset: sub;
  list-style: none;
  padding-left: 2rem;
}

.reset-list ol li {
  counter-increment: sub;
}

.reset-list ol li::before {
  content: counter(main) '.' counter(sub) ' ';
  color: #666;
}
```

### 技巧四：图片列表

```css
.image-list {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.image-list li {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
}

.image-list img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  transition: transform 0.3s;
}

.image-list li:hover img {
  transform: scale(1.05);
}

.image-list .caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  color: white;
}
```

### 技巧五：排序列表标记

```css
/* 升序/降序标记 */
.sorted-list {
  list-style: none;
  padding: 0;
}

.sorted-list li {
  position: relative;
  padding-left: 2rem;
}

.sorted-list li::before {
  content: attr(data-rank);
  position: absolute;
  left: 0;
  width: 1.5rem;
  height: 1.5rem;
  background: #f0f0f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
}

.sorted-list li:first-child::before {
  background: #f1c40f;
  color: #333;
}

.sorted-list li:nth-child(2)::before {
  background: #bdc3c7;
  color: #333;
}

.sorted-list li:nth-child(3)::before {
  background: #cd7f32;
  color: white;
}
```

---

## 参考资料

- [MDN: list-style](https://developer.mozilla.org/zh-CN/docs/Web/CSS/list-style)
- [MDN: ::marker](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::marker)
- [CSS-Tricks: List Style Recipes](https://css-tricks.com/list-style-recipes/)
