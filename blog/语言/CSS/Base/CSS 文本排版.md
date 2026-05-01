---
title: CSS 文本排版
date: 2025-04-29
tags:
  - CSS
  - 排版
  - 文本
categories:
  - 技术文档
  - 前端
  - CSS
  - 视觉表现
---

# CSS 文本排版

文本排版是网页设计的核心。现代 CSS 提供了丰富的排版工具，从字体控制到多列布局，再到可变字体。

---

## 一、基础字体控制

```css
body {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    font-size: 16px;
    line-height: 1.6;
    font-weight: 400;
    font-style: normal;
    font-variant: normal;
    color: #333;
}
```

### 字体栈

```css
/* 跨平台字体栈 */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
             'Helvetica Neue', Arial, 'Noto Sans', sans-serif;

/* 中文优化 */
font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
```

---

## 二、文本样式

```css
.text {
    /* 对齐 */
    text-align: left | right | center | justify;
    text-align-last: center; /* 最后一行对齐 */

    /* 装饰 */
    text-decoration: underline | line-through | overline | none;
    text-decoration-color: red;
    text-decoration-style: wavy | dashed | dotted;
    text-decoration-thickness: 2px;
    text-underline-offset: 4px;

    /* 转换 */
    text-transform: uppercase | lowercase | capitalize;

    /* 缩进 */
    text-indent: 2em;

    /* 阴影 */
    text-shadow: 0 2px 4px rgba(0,0,0,0.1);

    /* 溢出 */
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    /* 换行 */
    word-break: break-all | keep-all;
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;

    /* 间距 */
    letter-spacing: 0.05em;
    word-spacing: 0.1em;

    /* 方向 */
    writing-mode: horizontal-tb | vertical-rl | vertical-lr;
    text-orientation: mixed | upright;
}
```

---

## 三、Web 字体

```css
@font-face {
    font-family: 'CustomFont';
    src: url('font.woff2') format('woff2'),
         url('font.woff') format('woff');
    font-weight: 100 900; /* 可变字体范围 */
    font-style: normal;
    font-display: swap;
}
```

### 可变字体

```css
.variable-font {
    font-family: 'Inter Variable', sans-serif;
    font-variation-settings: 'wght' 700, 'wdth' 100;
    transition: font-variation-settings 0.3s;
}
.variable-font:hover {
    font-variation-settings: 'wght' 900, 'wdth' 125;
}
```

---

## 四、排版细节

### 首字下沉

```css
.drop-cap::first-letter {
    float: left;
    font-size: 3.5em;
    line-height: 0.8;
    padding-right: 8px;
    font-weight: 700;
}
```

### 首行样式

```css
.lead::first-line {
    font-weight: 600;
    font-size: 1.1em;
}
```

### 文本选择

```css
::selection {
    background: #1890ff;
    color: #fff;
}
```

### 引号样式

```css
q {
    quotes: '"' '"' "'" "'";
}
q::before { content: open-quote; }
q::after { content: close-quote; }
```

---

## 五、多列布局

```css
.columns {
    column-count: 3;
    column-width: 300px;
    column-gap: 40px;
    column-rule: 1px solid #ddd;
    break-inside: avoid; /* 防止元素被截断 */
}
```

---

## 六、逻辑属性排版

```css
/* 自动适配 LTR/RTL */
.margin-inline-start: 20px;  /* LTR=左，RTL=右 */
.padding-inline: 16px;       /* 左右 */
.padding-block: 8px;         /* 上下 */
border-inline-start: 2px solid; /* LTR=左边框 */

/* 文本对齐 */
text-align: start;   /* LTR=left, RTL=right */
text-align: end;     /* LTR=right, RTL=left */
```

---

## 奇淫技巧

### 技巧 1：现代文本截断

```css
/* 单行 */
.ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* 多行 */
.line-clamp {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* 纯 CSS 方案（标准属性，逐步支持） */
.line-clamp-std {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
}
```

### 技巧 2：文字描边

```css
.stroke-text {
    -webkit-text-stroke: 2px #1890ff;
    color: transparent;
}
```

### 技巧 3：镂空文字

```css
.cutout {
    background: url('bg.jpg');
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    font-weight: 900;
}
```

### 技巧 4：文字流动动画

```css
.marquee {
    white-space: nowrap;
    overflow: hidden;
}
.marquee span {
    display: inline-block;
    animation: scroll 10s linear infinite;
}
@keyframes scroll {
    from { transform: translateX(100%); }
    to { transform: translateX(-100%); }
}
```

### 技巧 5：竖排文字

```css
.vertical-text {
    writing-mode: vertical-rl;
    text-orientation: upright;
    letter-spacing: 0.3em;
}
```

### 技巧 6：排版比例尺

```css
:root {
    --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
    --text-sm: clamp(0.875rem, 0.8rem + 0.35vw, 1rem);
    --text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
    --text-lg: clamp(1.125rem, 1rem + 0.65vw, 1.5rem);
    --text-xl: clamp(1.5rem, 1.2rem + 1.5vw, 2.5rem);
}
```

### 技巧 7：印刷风格段落

```css
.article p {
    text-indent: 2em;
    hanging-punctuation: first; /* 标点悬挂 */
    orphans: 3;  /* 段落至少保留 3 行 */
    widows: 3;
}
```

### 技巧 8：打字机效果

```css
.typewriter {
    overflow: hidden;
    white-space: nowrap;
    border-right: 2px solid;
    animation: typing 3s steps(30), blink 0.5s step-end infinite alternate;
}
@keyframes typing { from { width: 0; } to { width: 100%; } }
@keyframes blink { 50% { border-color: transparent; } }
```

### 技巧 9：文字渐隐

```css
.fade-text {
    mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
    -webkit-mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
}
```

### 技巧 10：文字波浪下划线

```css
.wavy {
    text-decoration: wavy underline #1890ff 2px;
    text-underline-offset: 4px;
}
```

> 💡 **排版口诀**：字体用 system-ui，行高用 1.6，字距用 em，截断用 line-clamp，竖排用 writing-mode，渐变用 background-clip。
