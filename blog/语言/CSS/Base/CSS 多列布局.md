---
title: CSS 多列布局
date: 2025-04-29
tags:
  - CSS
  - 布局
categories:
  - 技术文档
  - 前端
  - CSS
  - 布局系统
---

# CSS 多列布局

[[toc]]

CSS 多列布局（Multi-column Layout）允许内容像报纸一样自动分布在多个列中，是处理长文本内容排版的利器。

---

## 基础属性

### column-count

```css
/* 固定列数 */
.newspaper {
  column-count: 3;
}

/* 自动列数（响应式） */
.responsive {
  column-count: auto;
  column-width: 300px;  /* 每列最小宽度 */
}
```

### column-width

```css
/* 列宽优先 */
.masonry {
  column-width: 250px;
}

/* 浏览器自动计算列数 */
.auto-columns {
  column-width: 300px;
  column-count: auto;
}
```

### columns 简写

```css
/* 列宽 + 列数 */
.columns {
  columns: 300px 3;  /* 每列至少 300px，最多 3 列 */
}

/* 仅列宽 */
.columns-width {
  columns: 300px;
}

/* 仅列数 */
.columns-count {
  columns: 3;
}
```

---

## 列间距与边框

### column-gap

```css
/* 固定间距 */
.gapped {
  column-count: 3;
  column-gap: 40px;
}

/* 使用 gap 简写 */
.modern-gap {
  columns: 3;
  gap: 2rem;
}
```

### column-rule

```css
/* 列间分隔线 */
.with-rule {
  column-count: 3;
  column-gap: 40px;
  column-rule: 1px solid #ddd;
}

/* 分别设置 */
.detailed-rule {
  column-rule-width: 2px;
  column-rule-style: dashed;
  column-rule-color: #3498db;
}
```

---

## 跨列元素

### column-span

```css
.newspaper {
  column-count: 3;
}

.newspaper h2 {
  column-span: all;  /* 横跨所有列 */
  text-align: center;
  margin: 2rem 0;
}

.newspaper img {
  column-span: all;
  width: 100%;
}
```

### 注意事项

```css
/* column-span: all 会中断列流 */
.break {
  column-span: all;
  /* 元素前后都会创建新的列上下文 */
}
```

---

## 实战示例

### 报纸排版

```css
.article {
  columns: 3 300px;
  column-gap: 2rem;
  column-rule: 1px solid #e0e0e0;
  text-align: justify;
  hyphens: auto;
}

.article h1 {
  column-span: all;
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

.article .lead {
  column-span: all;
  font-size: 1.25rem;
  color: #666;
  margin-bottom: 2rem;
}

.article img {
  column-span: all;
  width: 100%;
  margin: 1.5rem 0;
}

.article h2 {
  break-after: avoid;  /* 避免标题后断列 */
}
```

### 瀑布流布局

```css
.masonry {
  column-count: 3;
  column-gap: 1rem;
}

.masonry-item {
  break-inside: avoid;  /* 防止元素被截断 */
  margin-bottom: 1rem;
}

.masonry-item img {
  width: 100%;
  border-radius: 8px;
}

/* 响应式 */
@media (max-width: 768px) {
  .masonry { column-count: 2; }
}

@media (max-width: 480px) {
  .masonry { column-count: 1; }
}
```

### 卡片瀑布流

```css
.card-masonry {
  columns: 4 280px;
  column-gap: 1.5rem;
}

.card {
  break-inside: avoid;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
```

---

## 分页控制

### break-inside

```css
/* 防止元素内部分页 */
.no-break {
  break-inside: avoid;
}

/* 允许分页 */
.allow-break {
  break-inside: auto;
}
```

### break-before / break-after

```css
/* 在元素前强制分页 */
.page-break {
  break-before: page;
}

/* 在元素后避免分页 */
.no-break-after {
  break-after: avoid;
}

/* 在元素前避免分页 */
.keep-together {
  break-before: avoid;
}
```

### orphans / widows

```css
/* 避免段落在列尾只剩一行 */
.paragraph {
  orphans: 3;   /* 列尾至少保留 3 行 */
  widows: 3;    /* 列头至少保留 3 行 */
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| columns | 50+ | 9+ | 52+ | 12+ |
| column-span | 50+ | 9+ | 71+ | 12+ |
| break-inside | 50+ | 10+ | 65+ | 12+ |
| gap (多列) | 66+ | 14+ | 65+ | 79+ |

---

## 奇淫技巧

### 技巧一：等高列效果

```css
.equal-columns {
  columns: 3;
  column-fill: balance;  /* 平衡各列高度 */
}
```

### 技巧二：列首大字

```css
.article p::first-letter {
  float: left;
  font-size: 3.5em;
  line-height: 0.8;
  margin-right: 8px;
  color: #3498db;
}
```

### 技巧三：列间引用

```css
.pull-quote {
  column-span: all;
  text-align: center;
  font-size: 1.5rem;
  font-style: italic;
  color: #666;
  padding: 2rem;
  margin: 2rem 0;
  border-top: 2px solid #ddd;
  border-bottom: 2px solid #ddd;
}
```

### 技巧四：响应式列数

```css
.responsive-text {
  columns: 1;
}

@media (min-width: 640px) {
  .responsive-text { columns: 2; }
}

@media (min-width: 1024px) {
  .responsive-text { columns: 3; }
}

@media (min-width: 1440px) {
  .responsive-text { columns: 4; }
}
```

### 技巧五：目录多列

```css
.toc {
  columns: 2;
  column-gap: 3rem;
  column-rule: 1px solid #e0e0e0;
}

.toc li {
  break-inside: avoid;
  padding: 4px 0;
}
```

---

## 参考资料

- [MDN: CSS 多列布局](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_multicol_layout)
- [CSS-Tricks: A Complete Guide to Multi-Column](https://css-tricks.com/almanac/properties/c/columns/)
- [Can I Use: CSS Multi-column](https://caniuse.com/multicolumn)
