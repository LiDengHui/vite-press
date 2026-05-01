---
title: CSS 选择器详解
date: 2025-04-29
tags:
  - CSS
  - 选择器
categories:
  - 技术文档
  - 前端
  - CSS
  - 基础入门
---

# CSS 选择器详解

[[toc]]

CSS 选择器是定义样式应用范围的基础。从简单的元素选择到复杂的组合、伪类和伪元素，掌握选择器能极大提高样式的精确性和代码的可维护性。

---

## 基础选择器

### 元素选择器

```css
p { color: #333; }        /* 所有段落 */
div { padding: 1rem; }    /* 所有 div */
```

### 类选择器

```css
.button { background: blue; }    /* class="button" 的元素 */
.card.large { font-size: 1.2rem; } /* 同时拥有 card 和 large */
```

### ID 选择器

```css
#header { height: 60px; }  /* id="header" 的元素 */
```

### 通配符选择器

```css
* { margin: 0; padding: 0; }  /* 所有元素 */
```

---

## 组合选择器

### 后代选择器

```css
nav a { color: blue; }      /* nav 内的所有 a */
nav > a { font-weight: bold; } /* nav 的直接子元素 a */
```

### 相邻兄弟选择器

```css
h2 + p { margin-top: 0; }    /* 紧跟在 h2 后面的 p */
h2 ~ p { color: #666; }      /* h2 后面所有的 p */
```

### 组合选择器

```css
h1, h2, h3 { font-family: serif; }  /* 同时选中多个 */
```

---

## 属性选择器

```css
/* 存在属性 */
[disabled] { opacity: 0.5; }

/* 精确匹配 */
[type="text"] { border: 1px solid #ccc; }

/* 存在某个值 */
[class~="active"] { color: red; }  /* class 中包含 active */

/* 以某值开头 */
[href^="https"] { color: green; }

/* 以某值结尾 */
[href$=".pdf"] { color: orange; }

/* 包含某值 */
[href*="example"] { text-decoration: underline; }

/* 属性值列表 */
[data-status|="active"] { /* data-status="active" 或 "active-new" */ }
```

---

## 伪类选择器

### 链接状态

```css
a:link { color: blue; }       /* 未访问链接 */
a:visited { color: purple; }  /* 已访问链接 */
a:hover { text-decoration: underline; }  /* 悬停 */
a:active { color: red; }       /* 激活 */
a:focus { outline: 2px solid; } /* 聚焦 */
```

### 结构性伪类

```css
/* 第一个子元素 */
li:first-child { border-top: none; }

/* 最后一个子元素 */
li:last-child { border-bottom: none; }

/* 唯一的子元素 */
li:only-child { font-weight: bold; }

/* 第 n 个子元素 */
li:nth-child(3) { background: #f0f0f0; }        /* 第3个 */
li:nth-child(2n) { background: #fafafa; }       /* 偶数个 */
li:nth-child(odd) { background: #fff; }         /* 奇数个 */
li:nth-child(3n+1) { margin-left: 0; }           /* 每3个中的第1个 */

/* 从后向前 */
li:nth-last-child(2) { color: red; }             /* 倒数第2个 */
```

### 类型伪类

```css
/* 第一个某类型的子元素 */
p:first-of-type { font-size: 1.2rem; }

/* 最后一个某类型的子元素 */
img:last-of-type { border: 2px solid; }

/* 唯一的某类型子元素 */
input:only-of-type { width: 100%; }

/* 第 n 个某类型 */
p:nth-of-type(2) { text-indent: 2em; }
```

### 表单状态

```css
input:focus { border-color: blue; }
input:disabled { background: #eee; }
input:enabled { background: white; }
input:checked { accent-color: blue; }
input:required { border-color: red; }
input:valid { border-color: green; }
input:invalid { border-color: red; }
input:placeholder-shown { color: #999; }
input:in-range { border-color: green; }
input:out-of-range { border-color: red; }
input:read-only { background: #f5f5f5; }
input:read-write { background: white; }
```

### 逻辑伪类

```css
/* 非选中 */
.item:not(.active) { opacity: 0.6; }

/* 复合非 */
.item:not(:first-child):not(:last-child) { margin: 0 1rem; }

/* 从前往后匹配 */
:is(h1, h2, h3) { font-family: serif; }

/* 从后往前匹配 */
:where(.card, .panel) { padding: 1rem; }

/* 目标元素 */
:target { background: yellow; }

/* 空元素 */
:empty { display: none; }

/* 根元素 */
:root { --primary: blue; }
```

### 语言相关

```css
/* 第一个子元素且是某类型 */
li:first-child:is(p) { margin-top: 0; }

/* 使用区域语法 */
:lang(en) { font-family: 'Times New Roman', serif; }
:lang(zh) { font-family: 'SimSun', serif; }
```

---

## 伪元素选择器

```css
/* 在元素内容前 */
.quote::before { content: '"'; }

/* 在元素内容后 */
.quote::after { content: '"'; }

/* 首字 */
p::first-letter { font-size: 2em; }

/* 首行 */
p::first-line { font-weight: bold; }

/* 选中文本 */
::selection { background: #b3d4fc; }

/* 输入占位符 */
::placeholder { color: #999; }

/* 列表标记 */
::marker { color: red; }

/* 滚动条 */
::-webkit-scrollbar { width: 8px; }
```

---

## 选择器特异性

| 选择器 | 特异性 | 说明 |
|--------|--------|------|
| `*` | 0 | 通配符 |
| `div` | 1 | 元素选择器 |
| `.class` | 10 | 类选择器 |
| `#id` | 100 | ID 选择器 |
| `[attr]` | 10 | 属性选择器 |
| `:hover` | 10 | 伪类 |
| `::before` | 1 | 伪元素 |
| `!important` | 无穷大 | 强制覆盖 |

```css
/* 特异性计算示例 */
#nav .menu li a:hover { }  /* 100 + 10 + 1 + 1 + 10 = 122 */
```

---

## 浏览器兼容性

| 选择器 | Chrome | Safari | Firefox | Edge |
|--------|--------|--------|---------|------|
| :is() | 88+ | 14+ | 78+ | 88+ |
| :where() | 88+ | 14+ | 78+ | 88+ |
| :has() | 105+ | 15.4+ | 121+ | 105+ |
| :not() 复合 | 88+ | 9+ | 84+ | 88+ |
| ::marker | 86+ | 11.1+ | 68+ | 86+ |

---

## 奇淫技巧

### 技巧一：指定数量子元素的样式

```css
/* 恰好 4 个子元素 */
.container:has(> :nth-child(4):last-child) {
  grid-template-columns: repeat(4, 1fr);
}
```

### 技巧二：空状态样式

```css
/* 表单组内无子元素时隐藏 */
.form-group:empty { display: none; }

/* 输入框有值时标签上移 */
.input-wrapper:has(input:not(:placeholder-shown)) label {
  transform: translateY(-100%);
}
```

### 技巧三：排除第一个和最后一个的间距

```css
/* 方法 1：使用 gap */
.flex-container {
  display: flex;
  gap: 1rem;
}

/* 方法 2：使用 :not */
.item:not(:first-child) { margin-left: 1rem; }
```

### 技巧四：相交子元素

```css
/* 相邻的列表项之间添加分隔线 */
li + li {
  border-top: 1px solid #eee;
}
```

### 技巧五：根据属性动态样式

```css
/* 根据数据属性设置颜色 */
[data-status="success"] { color: green; }
[data-status="error"] { color: red; }
[data-status="warning"] { color: orange; }
```

---

## 参考资料

- [MDN 选择器](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_selectors)
- [MDN 特异性](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Specificity)
- [MDN 伪类](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Pseudo-classes)
- [MDN 伪元素](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Pseudo-elements)
