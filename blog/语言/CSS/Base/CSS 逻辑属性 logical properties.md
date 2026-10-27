---
title: CSS 逻辑属性 logical properties
date: 2025-04-29
tags:
  - CSS
  - 逻辑属性
  - 前端
categories:
  - 技术文档
  - 前端
  - CSS
  - 基础入门
---

# CSS 逻辑属性 logical properties

[[toc]]

逻辑属性（Logical Properties）让 CSS 不再依赖物理方向（上下左右），而是基于**文本流方向**（inline / block）和**书写模式**（writing-mode）进行布局。这使得同一套样式能自动适配 LTR、RTL、竖排等多语言场景。

---

## 核心概念：物理 vs 逻辑

```css
/* 物理属性 —— 固定方向 */
.box {
  width: 300px;
  height: 200px;
  margin-left: 1rem;
  margin-top: 1rem;
  border-left: 3px solid red;
}

/* 逻辑属性 —— 自适应方向 */
.box {
  inline-size: 300px;        /* 文本流方向上的尺寸 */
  block-size: 200px;         /* 垂直于文本流方向的尺寸 */
  margin-inline-start: 1rem; /* 文本起始边 */
  margin-block-start: 1rem;  /* 块级起始边 */
  border-inline-start: 3px solid red;
}
```

| 物理概念 | 逻辑概念 | 含义 |
|---------|---------|------|
| width | inline-size | 文本流方向尺寸 |
| height | block-size | 垂直于文本流尺寸 |
| left / right | inline-start / inline-end | 文本起始 / 结束边 |
| top / bottom | block-start / block-end | 块级起始 / 结束边 |
| horizontal | inline | 与文本同向 |
| vertical | block | 与文本垂直 |

---

## 书写模式与方向

```css
/* 默认：水平 LTR */
body { writing-mode: horizontal-tb; direction: ltr; }

/* 阿拉伯语 / 希伯来语 */
body[dir="rtl"] { direction: rtl; }

/* 中文竖排 */
.vertical-text {
  writing-mode: vertical-rl; /* 从右到左竖排 */
}
```

| writing-mode | inline 方向 | block 方向 |
|-------------|------------|-----------|
| `horizontal-tb` | 水平 | 垂直（上到下） |
| `vertical-rl` | 垂直（上到下） | 水平（右到左） |
| `vertical-lr` | 垂直（上到下） | 水平（左到右） |

---

## 完整映射表

### 尺寸

| 物理 | 逻辑 |
|------|------|
| `width` | `inline-size` |
| `height` | `block-size` |
| `min-width` | `min-inline-size` |
| `max-width` | `max-inline-size` |

### 外边距

| 物理 | 逻辑 |
|------|------|
| `margin-left` | `margin-inline-start` |
| `margin-right` | `margin-inline-end` |
| `margin-top` | `margin-block-start` |
| `margin-bottom` | `margin-block-end` |
| `margin: 0 1rem` | `margin-inline: 1rem` |
| `margin: 1rem 0` | `margin-block: 1rem` |

### 内边距、边框同理

```css
/* 简写 */
padding-inline: 1rem 2rem;   /* start end */
padding-block: 0.5rem;       /* start = end */

border-inline: 1px solid #ccc;
border-block-start: 2px solid #4a90d9;
```

### 定位

| 物理 | 逻辑 |
|------|------|
| `left` | `inset-inline-start` |
| `right` | `inset-inline-end` |
| `top` | `inset-block-start` |
| `bottom` | `inset-block-end` |
| `inset: 0` | 四边同时设置（物理逻辑通用） |

### 浮动与清除

```css
/* 物理 */
float: left;
clear: right;

/* 逻辑 */
float: inline-start;
clear: inline-end;

text-align: start;  /* 替代 left */
text-align: end;    /* 替代 right */
```

### 溢出

```css
overflow-inline: auto;  /* 水平溢出（或竖排时的垂直） */
overflow-block: hidden; /* 垂直溢出（或竖排时的水平） */
```

---

## 实际应用

### 应用一：RTL 自动适配

```css
/* 只需一套样式，自动适配 LTR / RTL */
.card {
  padding-inline: 1.5rem;
  border-inline-start: 4px solid var(--accent);
  text-align: start;
}

/* 图标与文本的间距始终正确 */
.icon-text {
  display: flex;
  gap: 0.5rem;
}

.icon-text .icon {
  margin-inline-end: 0.5rem; /* LTR 时=right，RTL 时=left */
}
```

### 应用二：竖排文本布局

```css
.poem {
  writing-mode: vertical-rl;
  inline-size: 300px;   /* 竖排时 = height */
  block-size: 500px;    /* 竖排时 = width */
  padding-inline: 2rem; /* 竖排时 = padding-top/bottom */
  border-inline-start: 2px solid #333; /* 竖排时 = border-top */
}
```

### 应用三：Flex / Grid 中的逻辑对齐

```css
.container {
  display: flex;
  /* 逻辑对齐替代物理对齐 */
  justify-content: flex-start; /* 已支持逻辑方向 */
}

/* CSS Alignment Level 3 新增 */
.container {
  justify-content: start;  /* 逻辑 start */
  align-items: start;      /* 逻辑 start */
}
```

---

## 浏览器兼容性

| 属性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| inline-size 等基础属性 | 57+ | 14.1+ | 41+ | 79+ |
| inset 简写 | 87+ | 14.1+ | 66+ | 87+ |
| float: inline-start | 123+ | 17.4+ | 55+ | 123+ |

---

## 奇淫技巧

### 技巧一：通用工具类

```css
/* 一套工具类通吃所有语言方向 */
.ms-4 { margin-inline-start: 1rem; }  /* ms = margin-start */
.me-4 { margin-inline-end: 1rem; }    /* me = margin-end */
.ps-4 { padding-inline-start: 1rem; }
.pe-4 { padding-inline-end: 1rem; }

/* 对比物理版本 */
.ml-4 { margin-left: 1rem; }  /* RTL 时失效 */
```

### 技巧二：混合使用物理与逻辑

```css
/* 页面级框架用逻辑属性 */
.page-layout {
  inline-size: 100%;
  padding-inline: max(1rem, 5vw);
}

/* 固定比例的组件保留物理属性 */
.avatar {
  width: 48px;   /* 头像总是正圆 */
  height: 48px;
  border-radius: 50%;
}
```

### 技巧三：自定义属性 + 逻辑值

```css
:root {
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 2rem;
}

.component {
  padding-inline: var(--space-md);
  margin-block-end: var(--space-lg);
}
```

### 技巧四：渐进式迁移策略

```css
/* 用 @supports 平滑迁移 */
.sidebar {
  width: 250px; /* 旧浏览器兜底 */
}

@supports (inline-size: 1px) {
  .sidebar {
    inline-size: 250px;
    width: unset;
  }
}
```

---

## 参考资料

- [MDN CSS Logical Properties](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_logical_properties_and_values)
- [CSS Logical Properties Level 1 规范](https://www.w3.org/TR/css-logical-1/)
- [Can I Use: CSS Logical Properties](https://caniuse.com/css-logical-props)
