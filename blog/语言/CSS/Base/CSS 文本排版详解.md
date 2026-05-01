---
title: CSS 文本排版详解
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

# CSS 文本排版详解

[[toc]]

文本排版是网页设计的核心。本文系统讲解 CSS 中与文字和段落排版相关的所有重要属性，从基础对齐到高级换行控制。

---

## 文本对齐

### text-align

```css
.text-left   { text-align: left; }      /* 左对齐（默认） */
.text-right  { text-align: right; }     /* 右对齐 */
.text-center { text-align: center; }    /* 居中 */
.text-justify{ text-align: justify; }   /* 两端对齐 */
```

### text-align-last

控制最后一行（或强制换行后）的对齐方式：

```css
.paragraph {
  text-align: justify;
  text-align-last: center;  /* 最后一行居中 */
}
```

### text-indent

首行缩进：

```css
.article p {
  text-indent: 2em;  /* 两个字符宽度的缩进 */
}

/* 悬挂缩进 */
.hanging {
  text-indent: -2em;
  padding-left: 2em;
}
```

---

## 文本转换

### text-transform

```css
.uppercase  { text-transform: uppercase; }   /* 全大写 */
.lowercase  { text-transform: lowercase; }   /* 全小写 */
.capitalize { text-transform: capitalize; }  /* 首字母大写 */
```

---

## 空白与换行控制

### white-space

```css
.nowrap {
  white-space: nowrap;        /* 不换行 */
}

.pre {
  white-space: pre;           /* 保留空白和换行 */
}

.pre-wrap {
  white-space: pre-wrap;      /* 保留空白，正常换行 */
}

.pre-line {
  white-space: pre-line;      /* 合并空白，保留换行 */
}

/* 常用组合 */
.code-block {
  white-space: pre;
  overflow-x: auto;
}
```

### word-break

```css
/* 严格按字符换行（CJK 文本常用） */
.break-all {
  word-break: break-all;
}

/* 仅在单词边界换行（英文常用） */
.keep-all {
  word-break: keep-all;
}
```

### overflow-wrap / word-wrap

```css
/* 允许长单词/URL 在任意点换行 */
.break-word {
  overflow-wrap: break-word;
  /* 或 word-wrap: break-word; （旧语法） */
}

/* 仅在单词边界换行，必要时断开 */
.anywhere {
  overflow-wrap: anywhere;
}
```

### line-break

```css
/* 控制 CJK 文本的换行行为 */
.cjk-loose {
  line-break: loose;   /* 最宽松 */
}

.cjk-normal {
  line-break: normal;  /* 正常 */
}

.cjk-strict {
  line-break: strict;  /* 严格（禁止某些标点出现在行首） */
}
```

### hyphens

```css
/* 自动添加连字符（需设置 lang 属性） */
.hyphenated {
  hyphens: auto;
  -webkit-hyphens: auto;
}
```

---

## 文本装饰

### text-decoration

```css
/* 下划线 */
.underline {
  text-decoration: underline;
  text-decoration-color: #007bff;
  text-decoration-style: wavy;  /* solid | double | dotted | dashed | wavy */
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;   /* 下划线与文字间距 */
}

/* 删除线 */
.strikethrough {
  text-decoration: line-through;
}

/* 上划线 */
.overline {
  text-decoration: overline;
}

/* 组合 */
.fancy-link {
  text-decoration: underline wavy red 2px;
}
```

---

## 文本阴影

### text-shadow

```css
/* 基础阴影 */
.shadow {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

/* 多层阴影 */
.neon {
  text-shadow:
    0 0 5px #fff,
    0 0 10px #fff,
    0 0 20px #ff00de,
    0 0 40px #ff00de;
}

/* 文字描边效果 */
.stroke {
  text-shadow:
    -1px -1px 0 #000,
    1px -1px 0 #000,
    -1px 1px 0 #000,
    1px 1px 0 #000;
}
```

---

## 字母与单词间距

### letter-spacing

```css
.loose {
  letter-spacing: 0.05em;   /* 增加字间距 */
}

.tight {
  letter-spacing: -0.02em;  /* 紧凑字间距 */
}
```

### word-spacing

```css
.wide-words {
  word-spacing: 0.5em;
}
```

---

## 行高与垂直对齐

### line-height

```css
/* 无单位数值（推荐，继承时计算为乘积） */
.body {
  line-height: 1.6;
}

/* 固定值 */
.fixed {
  line-height: 24px;
}

/* 百分比 */
.percent {
  line-height: 150%;
}
```

### vertical-align

```css
/* 用于行内元素 */
.sub { vertical-align: sub; }
.sup { vertical-align: super; }
.top { vertical-align: top; }
.middle { vertical-align: middle; }
.bottom { vertical-align: bottom; }

/* 数值 */
.shift {
  vertical-align: -2px;
}
```

---

## 文本方向与书写模式

### direction

```css
.rtl {
  direction: rtl;  /* 从右到左 */
}
```

### unicode-bidi

```css
/* 处理双向文本 */
.mixed {
  direction: rtl;
  unicode-bidi: embed;
}
```

---

## 文本选择

### user-select

```css
.no-select {
  user-select: none;
  -webkit-user-select: none;
}

.all-select {
  user-select: all;  /* 单击全选 */
}
```

---

## 高级文本效果

### text-fill-color 与 text-stroke

```css
/* WebKit 特性 */
.outlined-text {
  -webkit-text-fill-color: transparent;
  -webkit-text-stroke: 2px #007bff;
}

.gradient-text {
  -webkit-text-fill-color: transparent;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  background-clip: text;
}
```

### tab-size

```css
pre {
  tab-size: 2;  /* 制表符宽度 */
}
```

---

## 实用排版组合

### 文章正文排版

```css
.article {
  font-size: 18px;
  line-height: 1.8;
  color: #333;
  max-width: 65ch;        /* 最佳阅读宽度 */
  text-align: justify;
  text-align-last: left;
  hyphens: auto;
  word-break: normal;
  overflow-wrap: break-word;
}

.article p {
  margin-bottom: 1.5em;
  text-indent: 2em;
}
```

### 代码块样式

```css
code {
  font-family: 'Fira Code', monospace;
  font-size: 0.9em;
  background: #f4f4f4;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  white-space: pre-wrap;
  word-break: break-all;
}
```

---

## 奇淫技巧

### 技巧一：文字渐变

```css
.gradient-text {
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### 技巧二：文字截断显示省略号

```css
/* 单行 */
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 多行 */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

### 技巧三：文字描边

```css
.stroke-text {
  -webkit-text-stroke: 2px #333;
  -webkit-text-fill-color: transparent;
}
```

### 技巧四：悬挂标点

```css
/* 使用 text-indent 实现首行突出效果 */
.pull-quote {
  text-indent: -0.5em;
  font-size: 1.5em;
  font-style: italic;
}
```

### 技巧五：完美垂直居中（单行）

```css
.centered {
  height: 60px;
  line-height: 60px;  /* 等于高度 */
  text-align: center;
}
```

---

## 浏览器兼容性

| 属性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| text-align-last | 47+ | 待查 | 49+ | 12+ |
| text-decoration-* | 57+ | 12.1+ | 36+ | 79+ |
| hyphens | 55+ | 17+ | 43+ | 79+ |
| line-break | 58+ | 11+ | 67+ | 79+ |
| text-stroke | 4+ | 待查 | 待查 | 待查 |
| background-clip: text | 4+ | 待查 | 49+ | 待查 |

---

## 参考资料

- [MDN text-align](https://developer.mozilla.org/zh-CN/docs/Web/CSS/text-align)
- [MDN white-space](https://developer.mozilla.org/zh-CN/docs/Web/CSS/white-space)
- [MDN word-break](https://developer.mozilla.org/zh-CN/docs/Web/CSS/word-break)
- [CSS-Tricks: Text Design](https://css-tricks.com/almanac/properties/t/text-decoration/)
