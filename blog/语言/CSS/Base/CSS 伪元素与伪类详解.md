---
title: CSS 伪元素与伪类详解
date: 2025-04-29
tags:
  - CSS
  - 伪类
  - 伪元素
categories:
  - 技术文档
  - 前端
  - CSS
  - 基础入门
---

# CSS 伪元素与伪类详解

[[toc]]

伪元素和伪类是 CSS 选择器中最强大的工具之一。它们允许在不修改 HTML 结构的情况下，为元素添加样式或选择特定状态的元素。

---

## 伪类（Pseudo-classes）

### 链接状态伪类

```css
/* 未访问的链接 */
a:link { color: blue; }

/* 已访问的链接 */
a:visited { color: purple; }

/* 鼠标悬停 */
a:hover { color: red; }

/* 激活状态（点击时） */
a:active { color: green; }

/* 获得焦点 */
a:focus { outline: 2px solid blue; }
```

### 表单状态伪类

```css
/* 输入框占位符样式 */
::placeholder { color: #999; }

/* 必填字段 */
input:required { border-color: red; }

/* 可选字段 */
input:optional { border-color: gray; }

/* 有效输入 */
input:valid { border-color: green; }

/* 无效输入 */
input:invalid { border-color: red; }

/* 超出范围 */
input:out-of-range { background: #ffcccc; }

/* 在范围内 */
input:in-range { background: #ccffcc; }

/* 禁用状态 */
input:disabled { opacity: 0.5; }

/* 启用状态 */
input:enabled { opacity: 1; }

/* 只读 */
input:read-only { background: #f5f5f5; }

/* 可写 */
input:read-write { background: white; }

/* 选中状态 */
input:checked + label { font-weight: bold; }

/* 不确定状态 */
input:indeterminate { opacity: 0.7; }
```

### 结构伪类

```css
/* 第一个子元素 */
li:first-child { margin-top: 0; }

/* 最后一个子元素 */
li:last-child { margin-bottom: 0; }

/* 唯一子元素 */
li:only-child { font-weight: bold; }

/* 第 n 个子元素 */
li:nth-child(3) { color: red; }           /* 第 3 个 */
li:nth-child(2n) { background: #f0f0f0; } /* 偶数个 */
li:nth-child(2n+1) { background: white; } /* 奇数个 */
li:nth-child(-n+3) { font-weight: bold; } /* 前 3 个 */

/* 从后往前数 */
li:nth-last-child(2) { color: blue; }     /* 倒数第 2 个 */

/* 第一个同类型 */
p:first-of-type { font-size: 1.2em; }

/* 最后一个同类型 */
p:last-of-type { margin-bottom: 0; }

/* 唯一同类型 */
img:only-of-type { border: 2px solid gold; }

/* 第 n 个同类型 */
p:nth-of-type(2) { color: green; }
p:nth-last-of-type(1) { font-style: italic; }

/* 没有子元素 */
div:empty { display: none; }
```

### 逻辑伪类

```css
/* 否定伪类 */
li:not(.active) { opacity: 0.5; }

/* 排除多个 */
button:not(.primary):not(.danger) { background: gray; }

/* 根元素 */
:root {
  --primary: #007bff;
}

/* 作用域根元素 */
:scope { background: white; }

/* 全屏元素 */
video:fullscreen { width: 100vw; height: 100vh; }

/* 模态对话框 */
dialog:modal { backdrop-filter: blur(5px); }

/* 打开状态的 details */
details:open { border-color: blue; }
```

### 用户交互伪类

```css
/* 鼠标悬停在元素上 */
.card:hover { transform: translateY(-5px); }

/* 元素被点击时 */
.button:active { transform: scale(0.95); }

/* 元素获得焦点 */
input:focus { border-color: blue; }

/* 焦点在元素或其子元素内 */
.form-group:focus-within { border-color: blue; }

/* 元素及其后代都没有焦点 */
.form-group:focus-visible { outline: 2px solid blue; }

/* 目标元素（URL hash 指向） */
section:target { background: yellow; }

/* 鼠标悬浮在元素上时，改变子元素 */
.parent:hover .child { opacity: 1; }
```

---

## 伪元素（Pseudo-elements）

### ::before 与 ::after

```css
/* 在元素内容前插入 */
.quote::before {
  content: '"';
  font-size: 2em;
  color: #ccc;
}

/* 在元素内容后插入 */
.quote::after {
  content: '"';
  font-size: 2em;
  color: #ccc;
}

/* 装饰性元素 */
.button::before {
  content: '';
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 8px;
  background: url(icon.svg);
}
```

### ::first-letter

```css
/* 首字下沉效果 */
.article::first-letter {
  float: left;
  font-size: 3.5em;
  line-height: 0.8;
  margin-right: 0.1em;
  font-weight: bold;
  color: #007bff;
}
```

### ::first-line

```css
/* 首行样式 */
.paragraph::first-line {
  font-weight: bold;
  text-transform: uppercase;
}
```

### ::selection

```css
/* 选中文本的样式 */
::selection {
  background: #007bff;
  color: white;
}

/* 特定元素的选择样式 */
.highlight::selection {
  background: yellow;
  color: black;
}
```

### ::marker

```css
/* 列表标记样式 */
li::marker {
  color: #007bff;
  font-size: 1.2em;
  content: '→ ';
}

/* 有序列表 */
ol li::marker {
  content: counter(list-item) '. ';
  font-weight: bold;
}
```

### ::placeholder

```css
/* 占位符文本样式 */
input::placeholder {
  color: #999;
  font-style: italic;
  opacity: 0.7;
}
```

### ::backdrop

```css
/* 模态框/全屏的背景 */
dialog::backdrop {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
}
```

### ::file-selector-button

```css
/* 文件选择按钮样式 */
input[type="file"]::file-selector-button {
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
```

### ::cue

```css
/* WebVTT 字幕样式 */
video::cue {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 16px;
}
```

### ::part 与 ::slotted

```css
/* Shadow DOM 外部样式 ::part */
my-component::part(button) {
  background: blue;
}

/* ::slotted 用于 slot 内容 */
::slotted(img) {
  border-radius: 8px;
}
```

---

## 高级组合技巧

### 纯 CSS 工具提示

```css
.tooltip {
  position: relative;
}

.tooltip::before {
  content: attr(data-tip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 12px;
  background: #333;
  color: white;
  font-size: 14px;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
}

.tooltip::after {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: #333;
  opacity: 0;
  transition: opacity 0.2s;
}

.tooltip:hover::before,
.tooltip:hover::after {
  opacity: 1;
}
```

### 纯 CSS 复选框

```css
.custom-checkbox {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
}

.custom-checkbox:checked {
  background: #007bff;
  border-color: #007bff;
}

.custom-checkbox:checked::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 1px;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
```

### 斑马纹表格

```css
tr:nth-child(even) {
  background: #f8f9fa;
}

tr:hover {
  background: #e9ecef;
}
```

### 面包屑导航

```css
.breadcrumb li:not(:last-child)::after {
  content: ' / ';
  color: #999;
  margin: 0 8px;
}
```

---

## 奇淫技巧

### 技巧一：::first-letter 实现首字下沉

```css
.drop-cap::first-letter {
  float: left;
  font-size: 4rem;
  line-height: 0.8;
  margin: 0.1em 0.1em 0 0;
  font-weight: bold;
  color: #e74c3c;
}
```

### 技巧二：使用 attr() 动态内容

```css
/* 在链接后显示 URL */
a[href]::after {
  content: ' (' attr(href) ')';
  font-size: 0.8em;
  color: #666;
}

/* 打印时显示完整链接 */
@media print {
  a[href]::after {
    content: ' [' attr(href) ']';
  }
}
```

### 技巧三：清除浮动

```css
.clearfix::after {
  content: '';
  display: table;
  clear: both;
}
```

### 技巧四：计数器实现自动编号

```css
.footnotes {
  counter-reset: footnote;
}

.footnote::before {
  counter-increment: footnote;
  content: '[' counter(footnote) '] ';
  color: #007bff;
}
```

### 技巧五：自定义滚动条（WebKit）

```css
/* 滚动条整体 */
::-webkit-scrollbar {
  width: 8px;
}

/* 轨道 */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* 滑块 */
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

/* 滑块悬停 */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
```

### 技巧六：文本选中反色

```css
::selection {
  background: #ff6b6b;
  color: white;
}

::-moz-selection {
  background: #ff6b6b;
  color: white;
}
```

### 技巧七：禁用图片拖拽

```css
img {
  -webkit-user-drag: none;
  user-select: none;
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| ::before/::after | 所有版本 | 所有版本 | 所有版本 | 所有版本 |
| ::selection | 1+ | 1.1+ | 1+ | 所有版本 |
| ::marker | 86+ | 11.1+ | 68+ | 86+ |
| ::backdrop | 32+ | 15.4+ | 47+ | 79+ |
| :is() / :where() | 88+ | 14+ | 78+ | 88+ |
| :has() | 105+ | 15.4+ | 121+ | 105+ |

---

## 参考资料

- [MDN 伪类](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Pseudo-classes)
- [MDN 伪元素](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Pseudo-elements)
- [CSS-Tricks: A Whole Bunch of Amazing Stuff](https://css-tricks.com/pseudo-element-roundup/)
