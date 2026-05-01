---
title: Grid 布局
date: 2025-04-29
tags:
  - CSS
  - 布局
  - Grid
categories:
  - 技术文档
  - 前端
  - CSS
  - 布局系统
---

# Grid 布局

CSS Grid 布局（网格布局）是 CSS 最强大的二维布局系统，同时控制行和列，远超 Flex 的一维能力。

---

## 一、开启 Grid

```css
.container {
    display: grid;           /* 块级网格 */
    display: inline-grid;    /* 行内网格 */
}
```

---

## 二、容器属性

### 定义列和行

```css
.container {
    /* 固定宽度 */
    grid-template-columns: 200px 200px 200px;
    grid-template-rows: 100px 100px;

    /* 比例分配 */
    grid-template-columns: 1fr 2fr 1fr;

    /* 混合 */
    grid-template-columns: 200px 1fr 2fr;

    /* 最小/最大自适应 */
    grid-template-columns: minmax(200px, 1fr) 1fr 1fr;

    /* 重复 */
    grid-template-columns: repeat(3, 1fr);
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));

    /* 自动填充（自适应容器宽度） */
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
```

### 间距

```css
.container {
    gap: 20px;                    /* 行和列间距一样 */
    row-gap: 20px;                /* 行间距 */
    column-gap: 10px;             /* 列间距 */
}
```

### 对齐

```css
.container {
    /* 水平对齐 */
    justify-content: start | end | center | stretch | space-between | space-around | space-evenly;

    /* 垂直对齐 */
    align-content: start | end | center | stretch | space-between | space-around | space-evenly;

    /* 单元格内部水平对齐 */
    justify-items: start | end | center | stretch;

    /* 单元格内部垂直对齐 */
    align-items: start | end | center | stretch;

    /* 简写 */
    place-items: center;          /* align-items + justify-items */
    place-content: center;        /* align-content + justify-content */
}
```

### 网格流方向

```css
.container {
    grid-auto-flow: row;          /* 默认：按行填充 */
    grid-auto-flow: column;       /* 按列填充 */
    grid-auto-flow: row dense;    /* 密集模式：填充空隙 */
}
```

---

## 三、项目属性

```css
.item {
    /* 起始行/列线 */
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 1;
    grid-row-end: 2;

    /* 简写 */
    grid-column: 1 / 3;           /* 从第1列线到第3列线，跨两列 */
    grid-row: 1 / 2;              /* 在第1行 */

    /* 跨越所有行/列 */
    grid-column: 1 / -1;          /* 从头到尾 */
    grid-row: span 2;             /* 跨两行 */

    /* 缓存区大小 */
    grid-area: 1 / 1 / 3 / 4;     /* 行起 / 列起 / 行终 / 列终 */
}
```

### 自定义对齐

```css
.item {
    justify-self: center;         /* 单元格内水平居中 */
    align-self: end;              /* 单元格内底部对齐 */
    place-self: center;           /* 简写 */
}
```

---

## 四、命名网格线

```css
.container {
    grid-template-columns: [sidebar-start] 200px [sidebar-end main-start] 1fr [main-end];
    grid-template-rows: [header-start] 60px [header-end content-start] 1fr [content-end footer-start] 40px [footer-end];
}

.header  { grid-area: header-start / sidebar-start / header-end / main-end; }
.sidebar { grid-area: content-start / sidebar-start / footer-start / sidebar-end; }
.main    { grid-area: content-start / main-start / footer-start / main-end; }
.footer  { grid-area: footer-start / sidebar-start / footer-end / main-end; }
```

---

## 五、常见布局模式

### 圣杯布局

```css
.container {
    display: grid;
    grid-template:
        "header header header" 60px
        "sidebar main main" 1fr
        "footer footer footer" 40px
        / 200px 1fr 1fr;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
```

### 响应式卡片网格

```css
.container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
}
```

### 两栏布局（左固右自适应）

```css
.layout {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 20px;
}
```

### 居中

```css
.center {
    display: grid;
    place-items: center;
    min-height: 100vh;
}
```

---

## 六、奇淫技巧

### 技巧 1：自动填充 vs 自动适应

```css
/* auto-fill：空单元格留着（最后一行可能有空位） */
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));

/* auto-fit：空单元格被收缩（最后一行元素撑满） */
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
```

### 技巧 2：子网格

```css
.parent {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
}
.child {
    display: grid;    /* Grid 元素也可以是 Grid 容器 */
    place-items: center;
}
```

### 技巧 3：实现水平垂直居中的最短代码

```css
.center {
    display: grid;
    place-items: center;
    min-height: 100vh;
}
```

### 技巧 4：实现 masonry 瀑布流

```css
.masonry {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    grid-auto-rows: 10px; /* 基础行高 */
}

.masonry-item {
    grid-row: span calc(var(--item-height) / 10);
}
```

### 技巧 5：区域命名实现复杂页面

```css
.layout {
    display: grid;
    grid-template-areas:
        "h h h"
        "l m r"
        "f f f";
    grid-template-columns: 200px 1fr 200px;
    grid-template-rows: auto 1fr auto;
}
/* 响应式变化 */
@media (max-width: 768px) {
    .layout {
        grid-template-areas:
            "h"
            "m"
            "l"
            "r"
            "f";
        grid-template-columns: 1fr;
    }
}
```

### 技巧 6：让最后一项占满剩余空间

```css
.list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
}
/* 如果最后一行只有一个，让它占满 */
.list > *:last-child:nth-child(3n - 2) {
    grid-column: span 3;
}
```

> 💡 **Grid vs Flex 选择**：
> - **Grid**：二维布局、整体页面骨架、对齐要求高
> - **Flex**：一维布局、组件内部、内容排列
