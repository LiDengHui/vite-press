---
title: CSS 列表样式进阶
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

# CSS 列表样式进阶

[[toc]]

列表是网页中最基础的语义结构之一。现代 CSS 提供了 `::marker` 伪元素、丰富的 `list-style-type` 值以及 `@counter-style` 规则，让列表样式从单调的圆点进化到高度自定义的视觉元素。

---

## 基础列表样式

### list-style 简写

```css
ul {
  list-style: square inside;  /* 标记形状 + 位置 */
}

ol {
  list-style: decimal-leading-zero outside;
}
```

| 属性 | 说明 |
|------|------|
| `list-style-type` | 标记形状（disc、circle、square、decimal 等） |
| `list-style-position` | inside / outside |
| `list-style-image` | 自定义图片标记 |

### 自定义图片标记

```css
ul.custom {
  list-style-image: url('bullet.svg');
  /* 或使用 background 更灵活 */
}

ul.bg-bullet li {
  list-style: none;
  padding-left: 1.5rem;
  background: url('bullet.svg') no-repeat 0 0.5rem;
  background-size: 0.75rem;
}
```

---

## ::marker 伪元素

### 基础用法

```css
li::marker {
  color: #4a90d9;
  font-size: 1.2em;
}

ul li::marker {
  content: '▸ ';
}

ol li::marker {
  content: counter(list-item) '. ';
  font-weight: bold;
}
```

### 彩色标记

```css
ul.rainbow li:nth-child(1)::marker { color: #ff6b6b; }
ul.rainbow li:nth-child(2)::marker { color: #4ecdc4; }
ul.rainbow li:nth-child(3)::marker { color: #ffe66d; }
ul.rainbow li:nth-child(4)::marker { color: #a8e6cf; }
```

### Emoji 标记

```css
ul.todo li::marker {
  content: '☐ ';
}

ul.todo li.done::marker {
  content: '☑ ';
  color: #2ecc71;
}

ul.todo li.urgent::marker {
  content: '⚠ ';
  color: #e74c3c;
}
```

---

## list-style-type 高级值

### 有序列表

```css
ol.roman     { list-style-type: upper-roman; }   /* I, II, III */
ol.alpha     { list-style-type: lower-alpha; }   /* a, b, c */
ol.greek     { list-style-type: lower-greek; }   /* α, β, γ */
ol.chinese   { list-style-type: cjk-ideographic; } /* 一, 二, 三 */
```

### 无序列表

```css
ul.disc      { list-style-type: disc; }
ul.circle    { list-style-type: circle; }
ul.square    { list-style-type: square; }
ul.none      { list-style-type: none; }
```

### 嵌套列表自动层级

```css
ul.nested {
  list-style-type: disc;
}

ul.nested ul {
  list-style-type: circle;
}

ul.nested ul ul {
  list-style-type: square;
}

/* 或使用计数器 */
ul.counter-nested {
  counter-reset: level1;
  list-style: none;
}

ul.counter-nested > li {
  counter-increment: level1;
}

ul.counter-nested > li::marker {
  content: counter(level1) '. ';
}
```

---

## 描述列表美化

```css
dl.custom {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.5rem 1.5rem;
}

dt {
  font-weight: bold;
  color: #4a90d9;
}

dd {
  margin: 0;
}

/* 移动端单列 */
@media (max-width: 600px) {
  dl.custom {
    grid-template-columns: 1fr;
  }
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| ::marker | 86+ | 11.1+ | 68+ | 86+ |
| list-style-image | 1+ | 1+ | 1+ | 12+ |
| @counter-style | 91+ | 17+ | 33+ | 91+ |

---

## 奇淫技巧

### 技巧一：带动画的列表项

```css
li {
  opacity: 0;
  transform: translateX(-20px);
  animation: slide-in 0.3s forwards;
}

li:nth-child(1) { animation-delay: 0.1s; }
li:nth-child(2) { animation-delay: 0.2s; }
li:nth-child(3) { animation-delay: 0.3s; }

@keyframes slide-in {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

### 技巧二：时间线列表

```css
.timeline {
  list-style: none;
  padding-left: 2rem;
  border-left: 2px solid #ddd;
}

.timeline li {
  position: relative;
  padding-bottom: 2rem;
}

.timeline li::before {
  content: '';
  position: absolute;
  left: -2.4rem;
  top: 0.25rem;
  width: 12px;
  height: 12px;
  background: #4a90d9;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 0 0 2px #4a90d9;
}
```

### 技巧三：进度列表

```css
.progress-list {
  list-style: none;
  counter-reset: step;
}

.progress-list li {
  counter-increment: step;
  position: relative;
  padding-left: 3rem;
  padding-bottom: 2rem;
}

.progress-list li::before {
  content: counter(step);
  position: absolute;
  left: 0;
  top: 0;
  width: 2rem;
  height: 2rem;
  background: #ddd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
}

.progress-list li.active::before {
  background: #4a90d9;
}

.progress-list li.completed::before {
  content: '✓';
  background: #2ecc71;
}
```

### 技巧四：树形列表

```css
.tree {
  list-style: none;
  padding-left: 1.5rem;
}

.tree li {
  position: relative;
  padding-left: 1.5rem;
}

.tree li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 1rem;
  height: 0.8rem;
  border-bottom: 1px solid #ccc;
  border-left: 1px solid #ccc;
}

.tree li:last-child::before {
  border-left: 1px solid #ccc;
}

.tree ul {
  list-style: none;
  padding-left: 1rem;
  border-left: 1px solid #ccc;
  margin-left: 0.5rem;
}
```

### 技巧五：标签云列表

```css
.tag-cloud {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-cloud li {
  background: #f0f0f0;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: calc(0.75rem + var(--weight, 0) * 0.5rem);
}

.tag-cloud li.popular {
  --weight: 3;
}
```

---

## 参考资料

- [MDN ::marker](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::marker)
- [MDN list-style](https://developer.mozilla.org/zh-CN/docs/Web/CSS/list-style)
- [CSS-Tricks: ::marker](https://css-tricks.com/almanac/selectors/m/marker/)
