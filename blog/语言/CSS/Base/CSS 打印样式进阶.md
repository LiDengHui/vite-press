---
title: CSS 打印样式进阶
date: 2025-04-29
tags:
  - CSS
  - 打印
  - 前端
categories:
  - 技术文档
  - 前端
  - CSS
  - 工程化
---

# CSS 打印样式进阶

[[toc]]

打印样式让网页内容能优雅地输出到纸张。掌握 `@media print`、`@page` 和分页控制，可以创建专业的可打印文档。

---

## @media print 基础

### 打印专用样式

```css
@media print {
  /* 隐藏非必要元素 */
  nav, .sidebar, .ads, .comments {
    display: none !important;
  }

  /* 链接显示 URL */
  a[href]::after {
    content: ' (' attr(href) ')';
    font-size: 0.8em;
    color: #666;
  }

  /* 移除背景色和阴影 */
  * {
    background: transparent !important;
    box-shadow: none !important;
    text-shadow: none !important;
  }
}
```

### 屏幕与打印分离

```css
/* 仅屏幕显示 */
.screen-only {
  display: block;
}

.print-only {
  display: none;
}

@media print {
  .screen-only {
    display: none;
  }

  .print-only {
    display: block;
  }
}
```

---

## @page 规则

### 页面边距

```css
@page {
  margin: 2cm;
}

@page :first {
  margin-top: 3cm;  /* 首页上边距更大 */
}

@page :left {
  margin-left: 2.5cm;
  margin-right: 1.5cm;
}

@page :right {
  margin-left: 1.5cm;
  margin-right: 2.5cm;
}
```

### 页面尺寸与方向

```css
@page {
  size: A4 portrait;   /* A4 纵向 */
}

@page landscape {
  size: A4 landscape;  /* A4 横向 */
}

@page {
  size: 210mm 297mm;   /* 自定义尺寸 */
}
```

### 页眉页脚

```css
@page {
  @top-center {
    content: "文档标题";
    font-size: 10pt;
    color: #666;
  }

  @bottom-center {
    content: "第 " counter(page) " 页 / 共 " counter(pages) " 页";
    font-size: 10pt;
  }
}
```

---

## 分页控制

### break-* 属性

```css
@media print {
  /* 避免表格被分页截断 */
  table {
    break-inside: avoid;
  }

  /* 标题前强制分页 */
  h1 {
    break-before: page;
  }

  /* 章节后分页 */
  .chapter {
    break-after: page;
  }

  /* 图片不被截断 */
  figure, img {
    break-inside: avoid;
  }

  /* 列表项保持完整 */
  li {
    break-inside: avoid;
  }
}
```

### widows / orphans 控制

```css
@media print {
  p {
    widows: 3;   /* 段落末尾至少保留 3 行 */
    orphans: 3;  /* 段落开头至少保留 3 行 */
  }
}
```

---

## 打印优化实践

### 表格打印优化

```css
@media print {
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 10pt;
  }

  th, td {
    border: 1px solid #333;
    padding: 0.5rem;
  }

  thead {
    display: table-header-group;  /* 每页重复表头 */
  }

  tr {
    break-inside: avoid;
  }
}
```

### 代码块打印

```css
@media print {
  pre, code {
    white-space: pre-wrap;
    word-break: break-all;
    font-size: 9pt;
    background: #f5f5f5 !important;
    border: 1px solid #ddd;
    padding: 1rem;
  }

  pre {
    break-inside: avoid;
    page-break-inside: avoid;
  }
}
```

### 链接处理

```css
@media print {
  a {
    text-decoration: none;
    color: #000;
  }

  /* 外部链接显示 URL */
  a[href^="http"]::after {
    content: ' [' attr(href) ']';
    font-size: 0.75em;
    color: #666;
    word-break: break-all;
  }

  /* 内部锚点不显示 */
  a[href^="#"]::after {
    content: none;
  }
}
```

---

## 打印预览技巧

### 浏览器打印按钮

```html
<button onclick="window.print()">打印此页</button>
```

### 特定区域打印

```js
function printElement(elementId) {
  const element = document.getElementById(elementId);
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head><title>打印</title></head>
      <body>${element.innerHTML}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| @media print | 1+ | 1.3+ | 1+ | 12+ |
| @page | 无 | 无 | 19+ | 无 |
| break-inside | 50+ | 10+ | 52+ | 12+ |
| widows / orphans | 25+ | 无 | 无 | 12+ |

> 注：`@page` 的 `@top-center` / `@bottom-center` 等页眉页脚功能目前仅有 Firefox 和 Prince XML 等专用引擎支持良好。

---

## 奇淫技巧

### 技巧一：打印时显示二维码

```css
.qr-code {
  display: none;
}

@media print {
  .qr-code {
    display: block;
    position: fixed;
    bottom: 1cm;
    right: 1cm;
    width: 3cm;
  }
}
```

### 技巧二：打印水印

```css
@media print {
  body::before {
    content: '机密文件';
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-45deg);
    font-size: 72pt;
    color: rgba(0,0,0,0.05);
    pointer-events: none;
    z-index: 9999;
  }
}
```

### 技巧三：打印页码书签

```css
@media print {
  h2 {
    break-before: page;
  }

  h2::before {
    content: target-counter(attr(id url), page);
    margin-right: 1rem;
    color: #666;
  }
}
```

### 技巧四：打印时扩展折叠内容

```css
.collapsible {
  max-height: 0;
  overflow: hidden;
}

@media print {
  .collapsible {
    max-height: none;
    overflow: visible;
  }
}
```

### 技巧五：双栏打印布局

```css
@media print {
  .two-column-print {
    column-count: 2;
    column-gap: 1cm;
    font-size: 10pt;
  }

  .two-column-print h2 {
    column-span: all;
  }
}
```

---

## 参考资料

- [MDN @page](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@page)
- [MDN @media](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@media)
- [CSS-Tricks: I totally forgot about print style sheets](https://css-tricks.com/i-totally-forgot-about-print-style-sheets/)
