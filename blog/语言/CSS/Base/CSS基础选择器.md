---
title: CSS 基础选择器
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

# CSS 基础选择器

CSS 选择器用于定位 HTML 元素并应用样式。掌握选择器是写出高效、可维护 CSS 的第一步。

---

## 一、基本选择器

| 选择器 | 示例 | 说明 |
|--------|------|------|
| 通配符 | `*` | 匹配所有元素 |
| 元素/标签 | `div` | 匹配所有 `<div>` |
| 类名 | `.btn` | 匹配 class="btn" |
| ID | `#header` | 匹配 id="header" |

```css
/* 通配符：重置全局样式 */
* { margin: 0; padding: 0; box-sizing: border-box; }

/* 元素 + 类名组合 */
div.active { background: red; }

/* 多类名匹配（同时包含） */
.btn.primary { font-weight: bold; }
```

---

## 二、属性选择器

| 选择器 | 示例 | 说明 |
|--------|------|------|
| `[attr]` | `[disabled]` | 有该属性即可 |
| `[attr="val"]` | `[type="text"]` | 精确匹配 |
| `[attr^="val"]` | `[class^="col-"]` | 以 val 开头 |
| `[attr$="val"]` | `[href$=".pdf"]` | 以 val 结尾 |
| `[attr*="val"]` | `[title*="tips"]` | 包含 val |
| `[attr~="val"]` | `[class~="active"]` | 空格分隔的列表中包含 |
| `[attr\|="val"]` | `[lang\|="zh"]` | 等于 val 或以 val- 开头 |

```css
/* 给所有外部链接加图标 */
a[href^="http"]::after {
    content: "↗";
}

/* 给所有下载链接加图标 */
a[href$=".pdf"]::after,
a[href$=".zip"]::after {
    content: "⬇";
}

/* 给包含 error 的 class 加红色边框 */
[class*="error"] {
    border-color: red;
}
```

---

## 三、组合选择器

| 选择器 | 示例 | 说明 |
|--------|------|------|
| 后代（空格） | `.nav a` | `.nav` 内部所有 `a` |
| 子元素（`>`） | `.nav > a` | 仅直接子级 |
| 相邻兄弟（`+`） | `h2 + p` | 紧跟在 `h2` 后的第一个 `p` |
| 通用兄弟（`~`） | `h2 ~ p` | `h2` 之后的所有同级 `p` |
| 分组（`,`） | `h1, h2, h3` | 同时选中多个 |

```css
/* 直接子级：避免样式意外渗透 */
.menu > li { border-bottom: 1px solid #eee; }

/* 相邻兄弟：给标题后的第一段加首字下沉 */
h1 + p::first-letter {
    font-size: 3em;
    float: left;
}

/* 通用兄弟：选中被勾选的复选框后的所有选项 */
:checked ~ .option { opacity: 0.5; }
```

---

## 四、伪类选择器（状态/位置）

详见 [CSS伪类和伪元素](./CSS伪类和伪元素.md)，此处列出最常用的：

```css
/* 结构伪类 */
li:first-child { }      /* 第一个子元素 */
li:last-child { }       /* 最后一个子元素 */
li:nth-child(2n+1) { }  /* 奇数项 */
li:nth-child(-n+3) { }  /* 前3个 */
li:only-child { }       /* 唯一子元素 */
li:not(.exclude) { }    /* 排除特定类 */

/* 状态伪类 */
input:focus { }
button:hover { }
input:checked { }
input:disabled { }
input:valid { }         /* 表单验证通过 */
input:invalid { }       /* 表单验证失败 */
input:placeholder-shown { } /* 占位符显示时 */

/* 逻辑伪类（CSS4） */
:is(h1, h2, h3) { }     /* 匹配任一 */
:where(h1, h2, h3) { }  /* 同 is，但优先级为0 */
```

---

## 五、伪元素

```css
/* 内容生成 */
::before { content: ""; }   /* 元素内容前 */
::after { content: ""; }    /* 元素内容后 */

/* 文本选区 */
::first-letter { }         /* 首字母 */
::first-line { }           /* 首行 */
::selection { }            /* 鼠标选中的文本 */

/* 表单 */
::placeholder { }          /* 占位符文本 */
::marker { }               /* 列表标记（li 前面的点/数字） */
```

---

## 六、选择器优先级速查

```
内联样式       (1,0,0,0)
ID 选择器      (0,1,0,0)
类/伪类/属性   (0,0,1,0)
元素/伪元素    (0,0,0,1)
* / 组合符     (0,0,0,0)
```

---

## 七、奇淫技巧

### 技巧 1：空内容检测

```css
/* 给空的段落加占位提示 */
p:empty::before {
    content: "暂无内容";
    color: #999;
    font-style: italic;
}
```

### 技巧 2：只选有特定子元素的父元素

```css
/* 只选中包含 img 的 a 标签 */
a:has(> img) {
    display: block;
}

/* 选中后面紧跟 ul 的 li */
li:has(+ li) {
    border-bottom: 1px solid #eee;
}
```

### 技巧 3：数量查询（纯 CSS 控制布局）

```css
/* 只有1个子元素时的样式 */
li:only-child { width: 100%; }

/* 最多4个时的样式 */
li:nth-last-child(-n+4):first-child,
li:nth-last-child(-n+4):first-child ~ li {
    /* 最多4个li时的特殊处理 */
}

/* 至少5个时的样式 */
li:nth-last-child(n+5),
li:nth-last-child(n+5) ~ li {
    font-size: 14px; /* 数量多的时候缩小字号 */
}
```

### 技巧 4：利用属性选择器做状态管理

```css
/* 完全不用 class，靠 aria 属性控制样式 */
[aria-expanded="true"] .icon { transform: rotate(180deg); }
[aria-busy="true"] { cursor: wait; opacity: 0.6; }
[data-theme="dark"] body { background: #1a1a1a; color: #fff; }
```

### 技巧 5：兄弟选择器实现标签页切换（无 JS）

```css
.tab-input { display: none; }

/* 选中第1个 radio 时，显示第1个内容 */
#tab1:checked ~ .content .tab-content:nth-child(1),
#tab2:checked ~ .content .tab-content:nth-child(2) {
    display: block;
}
```

### 技巧 6：精准排除

```css
/* 选中所有 .item，但排除第3个及以后的 */
.item:not(:nth-child(n+3)) {
    background: gold;
}
```

> 💡 **性能提示**：选择器从右向左匹配，最右侧的选择器越具体效率越高。避免深层嵌套（>3层）和通用兄弟选择器（`~`）的滥用。
