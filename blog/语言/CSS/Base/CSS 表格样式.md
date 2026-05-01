---
title: CSS 表格样式
date: 2025-04-29
tags:
  - CSS
categories:
  - 技术文档
  - 前端
  - CSS
  - 基础入门
---

# CSS 表格样式

[[toc]]

HTML 表格是展示结构化数据的基础。CSS 提供了丰富的表格样式控制，从边框合并到响应式滚动，再到斑马纹和悬停效果，让数据表格既美观又易读。

---

## 基础表格样式

### 边框合并

```css
table {
  border-collapse: collapse;  /* 合并相邻边框 */
  width: 100%;
}

td, th {
  border: 1px solid #ddd;
  padding: 0.75rem;
  text-align: left;
}

/* 分离边框模式 */
table.separate {
  border-collapse: separate;
  border-spacing: 0.5rem;  /* 单元格间距 */
}
```

### 固定表格布局

```css
table.fixed {
  table-layout: fixed;  /* 列宽固定，不随内容变化 */
  width: 100%;
}

table.fixed th:first-child {
  width: 30%;
}

table.fixed th:last-child {
  width: 20%;
}
```

| 属性值 | 说明 |
|--------|------|
| `auto` | 默认，列宽根据内容自动调整 |
| `fixed` | 列宽固定，第一行决定宽度，渲染更快 |

---

## 视觉增强

### 斑马纹

```css
tbody tr:nth-child(even) {
  background: #f8f9fa;
}
```

### 悬停高亮

```css
tbody tr:hover {
  background: #e8f4fd;
  transition: background 0.2s;
}
```

### 空单元格处理

```css
table {
  empty-cells: hide;  /* 隐藏空单元格的边框 */
}
```

### 表头样式

```css
thead {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
}
```

---

## 响应式表格

### 水平滚动

```css
.table-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.table-wrapper table {
  min-width: 600px;
}
```

### 卡片式转换

```css
@media (max-width: 600px) {
  .card-table thead {
    display: none;
  }

  .card-table tr {
    display: block;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
  }

  .card-table td {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border: none;
    border-bottom: 1px solid #eee;
  }

  .card-table td:last-child {
    border-bottom: none;
  }

  .card-table td::before {
    content: attr(data-label);
    font-weight: bold;
    color: #666;
  }
}
```

```html
<table class="card-table">
  <tr>
    <td data-label="姓名">张三</td>
    <td data-label="年龄">28</td>
    <td data-label="城市">北京</td>
  </tr>
</table>
```

### 粘性表头

```css
.sticky-header thead {
  position: sticky;
  top: 0;
  z-index: 10;
}

.sticky-header th {
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```

---

## 高级表格特性

### 列样式（col / colgroup）

```html
<table>
  <colgroup>
    <col style="width: 20%; background: #f8f9fa;">
    <col style="width: 40%;">
    <col style="width: 40%;">
  </colgroup>
  <thead>...</thead>
  <tbody>...</tbody>
</table>
```

### 打印优化

```css
@media print {
  table {
    break-inside: avoid;
  }

  thead {
    display: table-header-group;  /* 每页重复表头 */
  }

  tr {
    break-inside: avoid;
  }
}
```

---

## 浏览器兼容性

| 属性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| border-collapse | 1+ | 1+ | 1+ | 12+ |
| border-spacing | 1+ | 1+ | 1+ | 12+ |
| table-layout | 14+ | 1.2+ | 1+ | 12+ |
| empty-cells | 1+ | 1.2+ | 1+ | 12+ |
| position: sticky (thead) | 56+ | 6.1+ | 59+ | 16+ |

---

## 奇淫技巧

### 技巧一：表格行展开/折叠

```css
table tr.details {
  display: none;
}

table tr:hover + tr.details,
table tr.details:hover {
  display: table-row;
}
```

### 技巧二：进度条表格

```css
.progress-cell {
  position: relative;
}

.progress-cell::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: #4a90d9;
  opacity: 0.2;
  width: var(--progress, 0%);
}
```

### 技巧三：排序指示器

```css
th.sortable::after {
  content: '↕';
  margin-left: 0.5rem;
  opacity: 0.3;
}

th.sort-asc::after {
  content: '↑';
  opacity: 1;
  color: #4a90d9;
}

th.sort-desc::after {
  content: '↓';
  opacity: 1;
  color: #4a90d9;
}
```

### 技巧四：表格嵌套边框

```css
.nested-table {
  border-collapse: separate;
  border-spacing: 0;
}

.nested-table td {
  border: 1px solid #ddd;
}

.nested-table tr:first-child td:first-child {
  border-top-left-radius: 8px;
}

.nested-table tr:first-child td:last-child {
  border-top-right-radius: 8px;
}

.nested-table tr:last-child td:first-child {
  border-bottom-left-radius: 8px;
}

.nested-table tr:last-child td:last-child {
  border-bottom-right-radius: 8px;
}
```

### 技巧五：表格加载骨架屏

```css
.skeleton-table td {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

## 参考资料

- [MDN Table](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/table)
- [CSS-Tricks: A Complete Guide to the Table Element](https://css-tricks.com/complete-guide-table-element/)
- [Responsive Tables](https://adrianroselli.com/2017/11/a-responsive-accessible-table.html)
