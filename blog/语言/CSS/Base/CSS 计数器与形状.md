---
title: CSS 计数器与形状
date: 2025-04-29
tags:
  - CSS
  - 形状
  - 计数器
categories:
  - 技术文档
  - 前端
  - CSS
  - 视觉表现
---

# CSS 计数器与形状

CSS 计数器让编号自动化，CSS 形状让文本环绕不再死板。两者结合可做出精美的排版效果。

---

## 一、CSS 计数器（Counter）

### 基础用法

```css
/* 1. 初始化计数器 */
ol { counter-reset: section; }

/* 2. 递增 */
li::before {
    counter-increment: section;
    content: counter(section) ". ";
}
```

### 多级编号（1.1, 1.2）

```css
ol {
    counter-reset: section;
    list-style: none;
}
li::before {
    counter-increment: section;
    content: counters(section, ".") " ";
}
/* 嵌套时自动 1.1, 1.2 */
```

### 多计数器联动

```css
.chapter {
    counter-reset: chapter figure;
}
.chapter h2::before {
    counter-increment: chapter;
    content: "第 " counter(chapter) " 章 ";
}
figure::before {
    counter-increment: figure;
    content: "图 " counter(chapter) "-" counter(figure) " ";
}
```

### 计数器样式

```css
counter(section, decimal)       /* 1, 2, 3 */
counter(section, decimal-leading-zero) /* 01, 02, 03 */
counter(section, upper-roman)   /* I, II, III */
counter(section, lower-roman)   /* i, ii, iii */
counter(section, upper-alpha)   /* A, B, C */
counter(section, lower-alpha)   /* a, b, c */
counter(section, cjk-ideographic) /* 一, 二, 三 */
counter(section, simp-chinese-informal) /* 一、二、三 */
```

---

## 二、shape-outside 文本环绕

```css
/* 圆形环绕 */
.circle-float {
    float: left;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    shape-outside: circle(50%);
    margin-right: 20px;
}

/* 椭圆环绕 */
.ellipse-float {
    float: left;
    shape-outside: ellipse(100px 150px at 50% 50%);
}

/* 多边形环绕 */
.triangle-float {
    float: left;
    width: 200px;
    height: 200px;
    shape-outside: polygon(0 0, 100% 50%, 0 100%);
    clip-path: polygon(0 0, 100% 50%, 0 100%);
    background: linear-gradient(135deg, #667eea, #764ba2);
}

/* 图片 alpha 通道做形状 */
.masked-shape {
    float: left;
    shape-outside: url('shape.png');   /* 图片透明区域不环绕 */
    shape-image-threshold: 0.5;         /* 透明度阈值 */
}
```

### shape-margin

```css
.float-shape {
    shape-outside: circle(50%);
    shape-margin: 20px; /* 文本与形状边界留 20px */
}
```

---

## 三、@counter-style 自定义计数样式

```css
@counter-style thumbs {
    system: cyclic;
    symbols: "\1F44D" "\1F44E"; /* 👍 👎 */
    suffix: " ";
}

ul.vote {
    list-style: thumbs;
}
```

### 更多自定义示例

```css
@counter-style check {
    system: cyclic;
    symbols: "\2713" "\2717"; /* ✓ ✗ */
    suffix: "  ";
}

@counter-style dice {
    system: numeric;
    symbols: "⚀" "⚁" "⚂" "⚃" "⚄" "⚅";
    suffix: ": ";
}

@counter-style steps {
    system: fixed;
    symbols: "①" "②" "③" "④" "⑤";
    suffix: " ";
}
```

---

## 奇淫技巧

### 技巧 1：自动编号图片和表格

```css
article {
    counter-reset: figure table;
}
figure {
    counter-increment: figure;
}
figure figcaption::before {
    content: "图 " counter(figure) ": ";
}
table caption::before {
    counter-increment: table;
    content: "表 " counter(table) ": ";
}
```

### 技巧 2：斑马纹表格增强版

```css
tr {
    counter-increment: row;
}
tr td:first-child::before {
    content: counter(row);
    display: inline-block;
    width: 24px;
    color: #999;
}
```

### 技巧 3：面包屑导航自动编号

```css
.breadcrumb {
    counter-reset: crumb;
}
.breadcrumb li::before {
    counter-increment: crumb;
    content: counter(crumb) ". ";
    color: #999;
    margin-right: 4px;
}
```

### 技巧 4：浮动几何形状 + 文本环绕

```css
/* 六边形浮动 */
.hexagon {
    float: left;
    width: 150px;
    height: 150px;
    shape-outside: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
    clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
    background: linear-gradient(135deg, #ff6b6b, #feca57);
    margin: 0 20px 20px 0;
}
```

### 技巧 5：计数器实现进度步骤

```css
.steps {
    display: flex;
    counter-reset: step;
}
.step::before {
    counter-increment: step;
    content: counter(step);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #1890ff;
    color: #fff;
}
.step.active::before {
    background: #52c41a;
}
```

### 技巧 6：中文数字编号

```css
ol.chinese {
    counter-reset: item;
    list-style: none;
}
ol.chinese li {
    counter-increment: item;
}
ol.chinese li::before {
    content: "第" counter(item, cjk-ideographic) "条";
    margin-right: 8px;
    color: #1890ff;
}
```

### 技巧 7：使用 margin-box 做不规则环绕

```css
/* 配合 clip-path 的 shape-outside */
.blob {
    float: left;
    width: 300px;
    height: 300px;
    background: url('portrait.jpg');
    clip-path: path('M...');
    shape-outside: path('M...');
    shape-margin: 15px;
}
```

### 技巧 8：复选框列表自动编号

```css
.todo-list {
    counter-reset: task;
    list-style: none;
}
.todo-list li {
    counter-increment: task;
}
.todo-list li::before {
    content: counter(task) ". ";
    color: #999;
}
.todo-list li.done::before {
    content: "\2713 " counter(task) ". ";
    color: #52c41a;
}
```

### 技巧 9：圆形头像 + 文本环绕

```css
.avatar-wrap {
    float: left;
    margin: 0 20px 20px 0;
}
.avatar-wrap img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    shape-outside: circle(60px at 60px 60px);
}
```

### 技巧 10：CSS 生成目录

```css
/* 自动生成文章目录编号 */
article {
    counter-reset: h2 h3;
}
h2 {
    counter-reset: h3;
    counter-increment: h2;
}
h2::before {
    content: counter(h2) ". ";
}
h3 {
    counter-increment: h3;
}
h3::before {
    content: counter(h2) "." counter(h3) " ";
}
```

> 💡 **计数器口诀**：先 reset 再 increment，counters() 做嵌套，@counter-style 做自定义，shape-outside 做环绕。
