---
title: "CSS :has() 选择器详解"
date: 2025-04-29
tags:
  - CSS
  - 选择器
  - 前端
categories:
  - 技术文档
  - 前端
  - CSS
  - 基础入门
---

# CSS :has() 选择器详解

[[toc]]

`:has()` 被誉为 CSS 历史上最重磅的选择器之一——它终于让 CSS 拥有了“父级选择”的能力，不再依赖 JavaScript 反向查找 DOM 。

---

## 基本语法

```css
/* 选择包含 img 子元素的 a */
a:has(img) {
    border: 2px solid #4a90d9;
}

/* 选择后紧跟着 h2 的 p */
section:has(h2 + p) {
    background: #f0f4f8;
}
```

| 特性 | 说明 |
|------|------|
| 参数 | 接受任何有效的 `<forgiving-selector-list>` |
| 匹配方式 | 匹配“自身包含某个/某些后代”的元素 |
| 别名 | “父选择器”、“家庭选择器” |

---

## 常用场景

### 1. 表单验证视觉反馈

```css
/* 输入框为空时给整个表单项加红框 */
.form-item:has(input:placeholder-shown) {
    border-left: 3px solid #e74c3c;
}

/* 输入内容无效时提示 */
.form-item:has(input:invalid:not(:placeholder-shown)) {
    --status-color: #e74c3c;
}

.form-item:has(input:valid) {
    --status-color: #2ecc71;
}
```

### 2. 根据子元素状态切换布局

```css
/* 如果卡片包含图片，则横向排列 */
.card:has(.card-image) {
    display: flex;
    gap: 1rem;
}

/* 无图片卡片垂直布局 */
.card:not(:has(.card-image)) {
    text-align: center;
}
```

### 3. 与 :not() 组合查找空状态

```css
/* 选择没有内容的容器 */
.todo-list:has(.todo-item):not(:has(.todo-item:not(.completed))) {
    /* 所有任务都已完成 */
    background: #e8f5e9;
}
```

### 4. 多条件组合

```css
/* 包含图片且图片带有 alt 文字的链接 */
a:has(img[alt]) {
    outline: 2px solid #2ecc71;
}

/* 选择后代同时包含 .icon 和 .text 的按钮 */
button:has(.icon):has(.text) {
    gap: 0.5rem;
}
```

---

## 与后代组合选择器的区别

```css
/* 后代组合选择器 → 选 .item（前提是 .item 在 section 内） */
section .item { }

/* :has() → 选 section（前提是 section 内有 .item） */
section:has(.item) { }
```

| 选择器 | 选中的是 | 方向 |
|--------|----------|------|
| `A B` | B | 向下（前代 → 后代） |
| `A:has(B)` | A | 向上（后代 → 前代） |
| `A > B` | 直接子元素 B | 向下 |
| `A:has(> B)` | 包含直接子元素 B 的 A | 向上 |

---

## 性能考虑

`:has()` 的浏览器实现采用了专门的样式回退与重算优化，但仍需注意：

1. **避免深度嵌套** — 过深的 `:has()` 仍会影响渲染性能
2. **先筛选再细化** — 结合类选择器缩小初始匹配范围
3. **浏览器兼容** — 2022年以后的 Chrome、Safari、Edge 均支持；Firefox 121+ 已支持

---

## 奇淫技巧

### 技巧一：纯 CSS 表格行高亮

```css
/* 高亮包含被勾选 checkbox 的整行 */
tr:has(:checked) {
    background: #e3f2fd;
    transition: background 0.2s;
}
```

### 技巧二：实现“当前编辑项”发光效果

```css
/* 输入框聚焦时整个表单项浮动发光 */
.form-item:has(:focus-visible) {
    box-shadow: 0 0 0 3px rgba(74, 144, 217, 0.3);
    transform: translateX(4px);
}
```

### 技巧三：多列布局自适应

```css
/* 根据子元素数量自动切换列数 */
.grid:has(> :nth-child(4)) {
    grid-template-columns: repeat(4, 1fr);
}

.grid:not(:has(> :nth-child(4))) {
    grid-template-columns: repeat(3, 1fr);
}
```

### 技巧四：与 JS 配合实现复杂交互

```js
// 在不支持 :has() 的旧浏览器中降级
if (!CSS.supports('selector(:has(*))')) {
    document.querySelectorAll('.card').forEach(card => {
        if (card.querySelector('img')) card.classList.add('has-image');
    });
}
```

---

## 参考资料

- [MDN :has()](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:has)
- [Can I Use :has()](https://caniuse.com/css-has)
- [CSS Selectors Level 4 规范](https://www.w3.org/TR/selectors-4/#relational)
