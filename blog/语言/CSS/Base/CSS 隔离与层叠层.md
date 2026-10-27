---
title: CSS 隔离与层叠层
date: 2025-04-29
tags:
  - CSS
  - 层叠层
  - 前端
  - 层叠上下文
categories:
  - 技术文档
  - 前端
  - CSS
  - 基础入门
---

# CSS 隔离与层叠层

现代 CSS 提供了 `@layer` 和 `contain` 等机制，让样式冲突不再靠 `!important` 解决，让渲染性能不再靠玄学优化。

---

## 一、@layer 层叠层

### 基本用法

```css
@layer reset, base, components, utilities;

@layer reset {
    * { margin: 0; padding: 0; }
}

@layer base {
    body { font-family: system-ui; }
}

@layer components {
    .btn { padding: 8px 16px; }
}

@layer utilities {
    .text-center { text-align: center; } /* 不需要 !important */
}
```

> 层叠顺序由 `@layer` 声明顺序决定，后声明的层优先级更高，**不受选择器权重影响**。不过未分层的普通样式仍会压过所有层，所以业务样式最好也统一进层。

### 嵌套层

```css
@layer framework {
    @layer base, components;
    @layer base { /* ... */ }
    @layer components { /* ... */ }
}

@layer app {
    @layer overrides { /* 覆盖 framework */ }
}
```

### 匿名层

```css
@layer { /* 匿名层，优先级由出现位置决定 */ }
```

### 未分层样式

```css
/* 未放在任何 @layer 中的样式优先级最高 */
body { background: red; } /* 覆盖 @layer base 中的 body */
```

---

## 二、CSS Containment

### 基本用法

```css
.widget {
    contain: layout paint;
}
```

### 五种 contain 值

| 值 | 作用 | 效果 |
|----|------|------|
| `layout` | 布局隔离 | 内部布局变化不影响外部 |
| `paint` | 绘制隔离 | 内部绘制不溢出到外部 |
| `size` | 尺寸隔离 | 元素尺寸不依赖子元素 |
| `style` | 样式隔离 | counter/quote 不继承到外部 |
| `strict` | 全部 | = layout paint size |
| `content` | 内容隔离 | = layout paint style |

### 实际应用

```css
/* 大型表格行优化 */
.table-row {
    contain: layout style;
}

/* 弹窗内容隔离 */
.modal-content {
    contain: strict;
}

/* 动画元素隔离 */
.animated {
    contain: layout paint;
}
```

---

## 三、content-visibility

```css
/* 视口外的内容延迟渲染 */
.long-section {
    content-visibility: auto;
    contain-intrinsic-size: 0 500px; /* 预估高度防止滚动跳动 */
}

/* 强制渲染（用于打印） */
@media print {
    .long-section {
        content-visibility: visible;
    }
}
```

| 值 | 说明 |
|----|------|
| `visible` | 正常渲染 |
| `hidden` | 不渲染，保留空间 |
| `auto` | 视口外不渲染，进入视口时渲染 |

---

## 四、CSS 作用域（@scope）

```css
@scope (.card) to (.card-content) {
    /* 只在 .card 内生效，但 .card-content 及其子元素除外 */
    h2 { font-size: 1.2rem; }
    p { color: #666; }
}
```

```css
/* 另一种写法：限定边界 */
@scope (.article) {
    /* .article 内的样式 */
    h1 { font-size: 2rem; }
    /* :scope 指代 .article 本身 */
    :scope { padding: 20px; }
}
```

---

## 奇淫技巧

### 技巧 1：用 @layer 解决第三方样式冲突

```css
/* 先声明层顺序 */
@layer vendor, app;

/* 导入时指定层：第三方样式进入低优先级层 */
@import url('bootstrap.css') layer(vendor);
@import url('ant-design.css') layer(vendor);

/* 自定义覆盖，无需更高权重 */
@layer app {
    .btn { /* 覆盖第三方样式 */ }
}
```

> `@import` 不能写在 `@layer { ... }` 块里，必须在导入时用 `layer()` 指定。

### 技巧 2：给外部样式表指定层

```css
/* 外部样式表在 CSS 里用 @import 分层 */
@import url('reset.css') layer(reset);
@import url('base.css') layer(base);
@import url('app.css') layer(app);
```

> `<link>` 没有标准的 `layer` 属性；网上 `<link layer="...">` 的写法并不可靠。必须用 `<link>` 时，在目标文件内部把规则包进 `@layer`。

### 技巧 3：contain 做微前端样式隔离

```css
.micro-app {
    contain: layout style paint;
    /* 子应用样式不会泄漏到父应用 */
}
```

### 技巧 4：content-visibility 加速长列表

```css
.feed-item {
    content-visibility: auto;
    contain-intrinsic-size: 0 200px;
}
```

### 技巧 5：@layer + !important 层内优先级

```css
@layer base {
    .btn { color: blue; }
    .btn { color: red !important; } /* 同一层内 important 优先级更高 */
}
```

### 技巧 6：嵌套 @layer 组织大型设计系统

```css
@layer design-system {
    @layer tokens, reset, base, components, patterns;
}

@layer app {
    @layer overrides, themes;
}
```

### 技巧 7：contain + resize observer 做虚拟列表

```css
.virtual-list-item {
    contain: strict;
    contain-intrinsic-size: 0 60px;
}
```

### 技巧 8：@scope 替代深层后代选择器

```css
/* 替代 .card .card h2 这种重复 */
@scope (.card) {
    h2 { }
    /* 不会穿透嵌套的 .card */
}
```

### 技巧 9：用 @layer 管理打印样式

```css
@layer screen { /* 屏幕样式 */ }
@layer print {  /* 打印样式 */ }

@media print {
    @layer print { /* 打印时激活 */ }
}
```

### 技巧 10：contain-intrinsic-size 防止布局偏移（CLS）

```css
.lazy-image-container {
    content-visibility: auto;
    contain-intrinsic-size: 300px 200px; /* 预估图片尺寸 */
}
```

> 💡 **隔离口诀**：冲突用 @layer，性能用 contain，长列表用 content-visibility，作用域用 @scope。
