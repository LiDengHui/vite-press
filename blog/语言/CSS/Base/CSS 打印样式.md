---
title: CSS 打印样式
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

# CSS 打印样式

[[toc]]

CSS 打印样式控制网页在打印或导出为 PDF 时的外观。通过 `@media print` 可以创建专门的打印版本，去除不必要的元素、调整布局、优化色彩。

---

## 基础设置

### @media print

```css
@media print {
  /* 打印专用样式 */
  body {
    font-size: 12pt;
    line-height: 1.5;
    color: #000;
    background: #fff;
  }
}
```

### 页面设置

```css
@page {
  margin: 2cm;
  size: A4;  /* A4, letter, landscape 等 */
}

/* 第一页特殊设置 */
@page :first {
  margin-top: 3cm;
}

/* 左右页不同边距 */
@page :left {
  margin-left: 3cm;
  margin-right: 2cm;
}

@page :right {
  margin-left: 2cm;
  margin-right: 3cm;
}
```

---

## 隐藏非打印元素

```css
@media print {
  /* 隐藏导航、侧边栏、广告等 */
  .nav,
  .sidebar,
  .ads,
  .comments,
  .share-buttons,
  .no-print {
    display: none !important;
  }
}
```

---

## 打印优化

### 链接处理

```css
@media print {
  /* 显示链接 URL */
  a[href]::after {
    content: " (" attr(href) ")";
    font-size: 0.8em;
    color: #666;
  }

  /* 排除内部锚点链接 */
  a[href^="#"]::after,
  a[href^="javascript:"]::after {
    content: "";
  }
}
```

### 图片优化

```css
@media print {
  img {
    max-width: 100% !important;
    page-break-inside: avoid;
  }

  /* 禁用背景图（默认不打印） */
  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
```

### 分页控制

```css
@media print {
  /* 避免表格被截断 */
  table {
    page-break-inside: avoid;
  }

  /* 标题后分页 */
  h1, h2, h3 {
    page-break-after: avoid;
  }

  /* 避免孤儿行 */
  p, li {
    orphans: 3;
    widows: 3;
  }

  /* 强制分页 */
  .page-break {
    page-break-before: always;
  }

  /* 避免元素被截断 */
  .keep-together {
    page-break-inside: avoid;
  }
}
```

---

## 打印专用元素

```css
/* 仅打印时显示 */
.print-only {
  display: none;
}

@media print {
  .print-only {
    display: block;
  }

  .screen-only {
    display: none;
  }
}
```

---

## 页面伪元素

```css
@page {
  /* 页眉 */
  @top-center {
    content: string(doctitle);
    font-size: 9pt;
  }

  /* 页脚页码 */
  @bottom-center {
    content: counter(page) " / " counter(pages);
    font-size: 9pt;
  }
}

/* 定义文档标题字符串 */
.title {
  string-set: doctitle content();
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| @media print | 1+ | 1.3+ | 1+ | 12+ |
| @page | 36+ | 13+ | 19+ | 79+ |
| page-break-* | 1+ | 1.3+ | 1+ | 12+ |
| orphans/widows | 25+ | 1.3+ | 1+ | 12+ |

---

## 奇淫技巧

### 技巧一：打印按钮

```css
.print-button {
  padding: 10px 20px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

@media print {
  .print-button {
    display: none;
  }
}
```

```html
<button class="print-button" onclick="window.print()">打印</button>
```

### 技巧二：二维码名片

```css
@media print {
  .qr-code {
    display: block;
    position: fixed;
    bottom: 1cm;
    right: 1cm;
    width: 3cm;
    height: 3cm;
  }
}

@media screen {
  .qr-code {
    display: none;
  }
}
```

### 技巧三：打印网格背景

```css
@media print {
  .grid-paper {
    background-image: 
      linear-gradient(#e0e0e0 1px, transparent 1px),
      linear-gradient(90deg, #e0e0e0 1px, transparent 1px);
    background-size: 20px 20px;
  }
}
```

### 技巧四：发票样式

```css
@media print {
  .invoice {
    width: 100%;
    max-width: none;
    box-shadow: none;
    border: 1px solid #000;
  }

  .invoice-header {
    border-bottom: 2px solid #000;
    padding-bottom: 1rem;
    margin-bottom: 1rem;
  }

  .invoice-table {
    width: 100%;
    border-collapse: collapse;
  }

  .invoice-table th,
  .invoice-table td {
    border: 1px solid #000;
    padding: 8px;
  }
}
```

### 技巧五：打印预览优化

```css
@media print {
  /* 确保白色背景打印 */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* 移除阴影 */
  * {
    box-shadow: none !important;
    text-shadow: none !important;
  }

  /* 简化边框 */
  .card {
    border: 1px solid #000;
  }
}
```

---

## 参考资料

- [MDN: @media print](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@media)
- [MDN: @page](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@page)
- [CSS-Tricks: Print Styles](https://css-tricks.com/css-tricks-finally-gets-a-print-stylesheet/)
