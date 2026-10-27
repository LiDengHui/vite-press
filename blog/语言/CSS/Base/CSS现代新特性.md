---
title: CSS 现代新特性
date: 2025-04-29
tags:
  - CSS
  - 前端
  - 现代特性
categories:
  - 技术文档
  - 前端
  - CSS
  - 基础入门
---

# CSS 现代新特性

CSS 近年来发展迅猛，大量新特性大幅提升了开发效率和表现力。本文汇总最值得关注的新特性。

---

## 一、容器查询（Container Queries）

见 [响应式与媒体查询](./响应式与媒体查询.md#容器查询)。

---

## 二、逻辑属性（Logical Properties）

用抽象方向替代物理方向，天然支持 LTR/RTL 切换：

```css
/* 物理属性 */
margin-left: 20px;
padding-top: 10px;

/* 逻辑属性 */
margin-inline-start: 20px;   /* 行首方向 */
padding-block-start: 10px;   /* 块首方向 */

/* 简写 */
margin-inline: 10px 20px;    /* 行首 行尾 */
margin-block: 15px;          /* 块首 块尾 */
padding-inline: 8px;
padding-block: 12px;
```

### 边框圆角逻辑版

```css
border-start-start-radius: 8px;     /* 块首-行首 */
border-start-end-radius: 8px;       /* 块首-行尾 */
border-end-start-radius: 8px;       /* 块尾-行首 */
border-end-end-radius: 8px;         /* 块尾-行尾 */
```

---

## 三、CSS 嵌套（Nesting）

```css
.card {
    padding: 16px;
    border: 1px solid #ddd;

    &:hover {
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    & .title {
        font-size: 18px;
        font-weight: bold;

        /* 深层嵌套 */
        & span {
            color: #666;
        }
    }

    /* @规则嵌套 */
    @media (min-width: 768px) {
        padding: 24px;
    }
}
```

> 浏览器原生支持，不再需要预处理器（Sass/Less）做嵌套。

---

## 四、@layer（层叠层）

控制样式优先级顺序，解决第三方库覆盖问题：

```css
/* 定义层顺序：越靠后优先级越高 */
@layer reset, base, components, utilities;

@layer reset {
    * { margin: 0; padding: 0; }
}

@layer base {
    body { font-size: 16px; line-height: 1.5; }
}

@layer components {
    .btn { padding: 8px 16px; }
}

@layer utilities {
    .text-center { text-align: center; }
}
```

### 调整层优先级

层顺序在**首次出现**时固定，之后再写 `@layer` 语句不会重排：

```css
/* ❌ 不会提升 components：上面已经锁定了顺序 */
@layer components, utilities;

/* ✅ 只在入口文件首次声明时有效：一开始就按需要的顺序写 */
@layer reset, base, utilities, components;
```

如果只想追加一个最高优先级的覆盖层，可以新声明一个从未出现过的层名，它会自动排到已有层之后：

```css
@layer overrides;

@layer overrides {
    .text-red { color: red; }
}
```

> 用 `!important` 提升层内规则并不可靠：它会把规则送进“重要声明”的排序，层顺序反而发生反转。优先在设计入口就排好层顺序。

---

## 五、color-mix()

混合两种颜色：

```css
:root {
    --primary: #1890ff;
    --primary-80: color-mix(in srgb, var(--primary), transparent 20%);
    --primary-50: color-mix(in srgb, var(--primary), white 50%);
}
```

---

## 六、:has() — 父选择器

```css
/* 选中包含 img 的 a */
a:has(> img) { display: block; }

/* 选中前面有 checked 复选框的标签 */
label:has(+ input:checked) { color: blue; }

/* 选中包含至少5个子元素的容器 */
.container:has(> :nth-child(5)) { gap: 8px; }
```

---

## 七、@scope

限制样式作用域：

```css
@scope (.card) {
    :scope { padding: 16px; }
    .title { font-size: 18px; }
    /* .title 只匹配 .card 内部的 .title */
}
```

---

## 八、CSS 三角函数与数学

```css
.circle {
    /* 计算圆周上的点 */
    --angle: 45deg;
    --r: 100px;
    --x: calc(var(--r) * cos(var(--angle)));
    --y: calc(var(--r) * sin(var(--angle)));
    transform: translate(var(--x), var(--y));
}
```

---

## 九、scroll-driven animations

用滚动位置驱动动画，无需 JS：

```css
.progress-bar {
    position: fixed;
    top: 0;
    left: 0;
    height: 4px;
    background: red;
    width: 100%;

    transform: scaleX(0);
    transform-origin: left;
    animation: progress linear;
    animation-timeline: scroll();  /* 绑定滚动 */
}

@keyframes progress {
    to { transform: scaleX(1); }
}
```

### 视图进入动画

```css
.card {
    animation: fadeIn linear both;
    animation-timeline: view();
    animation-range: entry 25% cover 50%;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}
```

---

## 十、CSS 嵌套与 @scope 配合

```css
@scope (.article) to (.ad) {
    /* 样式只作用于 .article 内部，但不渗透到 .ad 内部 */
    p { line-height: 1.8; }
    a { color: blue; }
}
```

---

## 十一、奇淫技巧

### 技巧 1：clamp() 实现流体排版

```css
/* 字体随视口平滑变化，有最小和最大限制 */
h1 { font-size: clamp(1.5rem, 5vw, 3rem); }
h2 { font-size: clamp(1.25rem, 4vw, 2rem); }
p  { font-size: clamp(0.875rem, 2vw, 1rem); }
```

### 技巧 2：@layer 解决 CSS 优先级战争

```css
/* 第三方库引入的样式 */
@layer vendor;
@import url('bootstrap.css') layer(vendor);

/* 自己的样式自动覆盖第三方 */
@layer custom;
@layer custom {
    .btn { /* 覆盖 Bootstrap */ }
}
```

### 技巧 3：CSS 原生嵌套写 BEM

```css
/* 不再需要 Sass */
.block {
    &__element { color: red; }
    &--modifier { font-weight: bold; }
}
```

### 技巧 4：:has() 实现兄弟状态联动

```css
/* 选中表单有错误时的提交按钮 */
form:has(.error) .submit-btn {
    opacity: 0.5;
    pointer-events: none;
}

/* 实现 Tabs 切换（无 JS） */
.tab-group:has(#tab1:checked) .panel-1,
.tab-group:has(#tab2:checked) .panel-2 {
    display: block;
}
```

### 技巧 5：CSS 计数器增强

```css
ol {
    counter-reset: section;
}
li {
    counter-increment: section;
}
li::marker {
    content: counter(section) ". ";
    font-weight: bold;
    color: #1890ff;
}

/* 多级嵌套计数 */
ol ol {
    counter-reset: subsection;
}
ol ol li {
    counter-increment: subsection;
}
ol ol li::marker {
    content: counter(section) "." counter(subsection) " ";
}
```

### 技巧 6：text-wrap 优化排版

```css
/* 标题避免孤字 */
h1, h2 {
    text-wrap: balance;     /* 平衡换行 */
}

p {
    text-wrap: pretty;      /* 避免最后一行只有一个字 */
}
```

### 技巧 7：content-visibility 性能优化

```css
.long-list-item {
    content-visibility: auto;
    contain-intrinsic-size: auto 300px; /* 预估高度，防止跳动 */
}
```

### 技巧 8：accent-color 自定义表单控件颜色

```css
:root {
    accent-color: #1890ff;  /* 影响 checkbox、radio、range、progress */
}
```

### 技巧 9：field-sizing 自适应输入框

```css
textarea {
    field-sizing: content;  /* 高度随内容自动增长 */
    min-height: 80px;
}
```

### 技巧 10：CSS 锚点定位（Anchor Positioning）

```css
.anchor {
    anchor-name: --tooltip;
}

.tooltip {
    position-anchor: --tooltip;
    position-area: bottom center;
    position-try: --bottom, --top;  /* 空间不足时自动翻转 */
}

@position-try --bottom {
    position-area: bottom center;
}
@position-try --top {
    position-area: top center;
}
```

> 💡 现代 CSS 越来越强大，很多以前需要 JS 或预处理器的功能现在都能原生实现。保持关注新特性，能大幅提升开发效率。
