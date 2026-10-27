---
title: CSS 变量与自定义属性基础
date: 2025-04-29
tags:
  - CSS
  - 自定义属性
  - 前端
categories:
  - 技术文档
  - 前端
  - CSS
  - 基础入门
---

# CSS 变量与自定义属性基础

[[toc]]

CSS 自定义属性（Custom Properties），通常称为 CSS 变量，允许在样式表中定义可复用的值。它们以 `--` 开头，通过 `var()` 函数引用，是现代 CSS 开发中减少重复、提高可维护性的核心工具。

---

## 基本语法

### 定义变量

```css
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --font-size-base: 16px;
  --spacing-unit: 8px;
}
```

### 使用变量

```css
.button {
  background-color: var(--primary-color);
  font-size: var(--font-size-base);
  padding: calc(var(--spacing-unit) * 2);
}
```

### 后备值

```css
.button {
  /* 如果 --primary-color 未定义，使用蓝色 */
  color: var(--primary-color, blue);
  
  /* 多级后备 */
  font-size: var(--font-size, var(--base-size, 16px));
}
```

---

## 作用域与继承

### 全局变量

```css
:root {
  --global-color: #333;
}
```

### 局部变量

```css
.card {
  --card-padding: 24px;
  padding: var(--card-padding);
}

/* .card 内部的元素可以访问 --card-padding */
.card .title {
  margin-bottom: var(--card-padding);
}

/* .card 外部的元素无法访问 */
.page .title {
  /* --card-padding 在这里未定义 */
}
```

### 动态作用域

```css
.theme-dark {
  --bg-color: #1a1a1a;
  --text-color: #f5f5f5;
}

.theme-light {
  --bg-color: #ffffff;
  --text-color: #1a1a1a;
}

/* 根据父元素类名动态应用 */
.theme-dark .content,
.theme-light .content {
  background: var(--bg-color);
  color: var(--text-color);
}
```

---

## 变量类型与计算

### 带单位的变量

```css
:root {
  --size: 100;  /* 纯数字 */
}

/* 错误：不能直接拼接 */
/* width: var(--size)px; */

/* 正确：使用 calc() */
.box {
  width: calc(var(--size) * 1px);
  height: calc(var(--size) * 1%);
}
```

### 颜色计算

```css
:root {
  --primary: #007bff;
}

/* 使用 color-mix 混合颜色 */
.mixed {
  background: color-mix(in srgb, var(--primary) 50%, white);
}

/* 使用相对颜色调整透明度 */
.semi-transparent {
  color: rgb(from var(--primary) r g b / 0.5);
}
```

---

## JavaScript 操作

### 读取变量

```js
const root = getComputedStyle(document.documentElement);
const primary = root.getPropertyValue('--primary-color').trim();
console.log(primary); // #007bff
```

### 设置变量

```js
// 设置全局变量
document.documentElement.style.setProperty('--primary-color', '#ff0000');

// 设置元素级变量
element.style.setProperty('--local-color', '#00ff00');
```

### 监听变化

```js
// 使用 MutationObserver 监听 style 属性变化
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === 'style') {
      const newColor = getComputedStyle(mutation.target)
        .getPropertyValue('--primary-color');
      console.log('颜色变化为:', newColor);
    }
  });
});

observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['style']
});
```

---

## 实际应用场景

### 主题切换

```css
:root {
  --bg: #ffffff;
  --text: #1a1a1a;
  --border: #e0e0e0;
}

[data-theme="dark"] {
  --bg: #1a1a1a;
  --text: #f5f5f5;
  --border: #444444;
}

body {
  background: var(--bg);
  color: var(--text);
}
```

```js
// 切换主题
document.documentElement.setAttribute('data-theme', 'dark');
```

### 响应式间距系统

```css
:root {
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 2rem;
  --space-xl: 4rem;
}

@media (min-width: 768px) {
  :root {
    --space-md: 1.5rem;
    --space-lg: 3rem;
  }
}
```

### 组件化设计

```css
.btn {
  --btn-bg: var(--primary-color);
  --btn-color: white;
  --btn-padding: 0.75rem 1.5rem;
  
  background: var(--btn-bg);
  color: var(--btn-color);
  padding: var(--btn-padding);
}

.btn-secondary {
  --btn-bg: transparent;
  --btn-color: var(--primary-color);
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| 自定义属性 | 49+ | 9.1+ | 31+ | 15+ |
| var() | 49+ | 9.1+ | 31+ | 15+ |
| @property | 85+ | 16.4+ | 128+ | 85+ |

---

## 奇淫技巧

### 技巧一：动态调整根字体大小

```css
:root {
  font-size: clamp(14px, 0.5vw + 12px, 18px);
}
```

### 技巧二：CSS 开关

```css
.toggle {
  --is-active: 0;
}

.toggle.active {
  --is-active: 1;
}

.toggle .indicator {
  transform: translateX(calc(var(--is-active) * 100%));
}
```

### 技巧三：动态阴影颜色

```css
.card {
  --shadow-color: 220 3% 15%;
  box-shadow:
    0 1px 2px hsl(var(--shadow-color) / 0.1),
    0 4px 8px hsl(var(--shadow-color) / 0.1),
    0 8px 16px hsl(var(--shadow-color) / 0.1);
}
```

### 技巧四：渐变色变量

```css
:root {
  --gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.hero {
  background: var(--gradient);
}
```

### 技巧五：条件样式

```css
/* 根据变量值显示/隐藏 */
.component {
  --visible: 1;
  opacity: var(--visible);
  pointer-events: var(--visible, none);
}
```

---

## 参考资资料

- [MDN 自定义属性](https://developer.mozilla.org/zh-CN/docs/Web/CSS/--*)
- [MDN var()](https://developer.mozilla.org/zh-CN/docs/Web/CSS/var)
- [CSS-Tricks: A Complete Guide to Custom Properties](https://css-tricks.com/a-complete-guide-to-custom-properties/)
