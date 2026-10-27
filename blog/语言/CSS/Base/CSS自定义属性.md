---
title: CSS 自定义属性（CSS 变量）
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

# CSS 自定义属性（CSS 变量）

CSS 自定义属性（Custom Properties）允许在 CSS 中定义可复用的变量，是现代 CSS 开发的核心基础设施。

---

## 一、基本语法

### 定义

```css
:root {
    --primary-color: #1890ff;
    --font-size-base: 16px;
    --spacing-unit: 8px;
}
```

### 使用

```css
.btn {
    background: var(--primary-color);
    font-size: var(--font-size-base);
    padding: calc(var(--spacing-unit) * 2);
}
```

### 回退值

```css
/* 变量不存在时使用回退值 */
.btn {
    color: var(--text-color, #333);
}

/* 多层回退 */
.btn {
    color: var(--text-color, var(--fallback-color, #333));
}
```

---

## 二、作用域与继承

CSS 变量遵循层叠规则，可在任意选择器中定义：

```css
:root {
    --color: blue; /* 全局作用域 */
}

.card {
    --color: red; /* 仅在 .card 及其后代有效 */
    color: var(--color);
}

.card .title {
    color: var(--color); /* 继承自 .card，为红色 */
}
```

### 覆盖变量

```css
.btn {
    --btn-bg: #ccc;
    background: var(--btn-bg);
}

.btn.primary {
    --btn-bg: var(--primary-color); /* 覆盖 */
}

.btn.danger {
    --btn-bg: #ff4d4f;
}
```

---

## 三、运算与类型

CSS 变量本质是字符串，需要通过 `calc()` 进行数学运算：

```css
:root {
    --base: 16px;
    --double: calc(var(--base) * 2);    /* 32px */
    --half: calc(var(--base) / 2);      /* 8px */
    --negative: calc(var(--base) * -1); /* -16px */
}
```

### 单位拼接

```css
/* 错误的写法 ❌ */
--size: 20;
width: var(--size)px; /* 无效，会被解析为 "20px" 字符串但无单位 */

/* 正确的写法 ✅ */
--size: 20px;
width: var(--size);

/* 或者使用 calc ✅ */
--size: 20;
width: calc(var(--size) * 1px);
```

---

## 四、与 JS 交互

```javascript
// 读取
const color = getComputedStyle(document.documentElement)
    .getPropertyValue('--primary-color'); // " #1890ff"

// 设置
document.documentElement.style.setProperty('--primary-color', '#ff5722');

// 设置作用域级变量
const card = document.querySelector('.card');
card.style.setProperty('--card-bg', '#f5f5f5');
```

### 响应式主题切换

```javascript
function setTheme(theme) {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    // 或者直接用 CSS 变量
    root.style.setProperty('--bg', theme === 'dark' ? '#1a1a1a' : '#fff');
}
```

---

## 五、奇淫技巧

### 技巧 1：主题系统

```css
:root {
    --bg: #fff;
    --text: #333;
    --border: #ddd;
}

[data-theme="dark"] {
    --bg: #1a1a1a;
    --text: #e0e0e0;
    --border: #444;
}

body {
    background: var(--bg);
    color: var(--text);
    transition: background 0.3s, color 0.3s;
}
```

### 技巧 2：动态调整间距系统

```css
:root {
    --space-unit: 4px;
    --space-1: calc(var(--space-unit) * 1);  /* 4px */
    --space-2: calc(var(--space-unit) * 2);  /* 8px */
    --space-3: calc(var(--space-unit) * 3);  /* 12px */
    --space-4: calc(var(--space-unit) * 4);  /* 16px */
}

/* 高密度模式 */
[data-density="compact"] {
    --space-unit: 2px;
}

/* 宽松模式 */
[data-density="loose"] {
    --space-unit: 8px;
}
```

### 技巧 3：用 CSS 变量实现逻辑（条件样式）

```css
.toggle {
    --is-on: 0;
}
.toggle:checked {
    --is-on: 1;
}

/* 利用 calc 做条件判断 */
.toggle-label::after {
    content: var(--is-on, 'Off');
    opacity: calc(1 - var(--is-on));
}

/* 或者用 translate 切换位置 */
.toggle-track {
    --x: calc(var(--is-on) * 20px);
    transform: translateX(var(--x));
    transition: transform 0.2s;
}
```

### 技巧 4：动态尺寸（容器查询配合）

```css
.card {
    --card-width: 100%;
    width: var(--card-width);
}

/* JS 根据屏幕宽度设置 */
@media (min-width: 768px) {
    .card { --card-width: calc(50% - 20px); }
}
```

### 技巧 5：用 @property 定义类型化变量

```css
/* 注册自定义属性，支持动画 */
@property --progress {
    syntax: '<percentage>';
    inherits: false;
    initial-value: 0%;
}

.progress-ring {
    --progress: 0%;
    background: conic-gradient(
        var(--primary-color) var(--progress),
        transparent var(--progress)
    );
    transition: --progress 0.5s ease;
}
.progress-ring.complete {
    --progress: 100%;
}
```

### 技巧 6：颜色操作（配合 color-mix）

```css
:root {
    --primary: #1890ff;
    --primary-light: color-mix(in srgb, var(--primary), white 30%);
    --primary-dark: color-mix(in srgb, var(--primary), black 20%);
}
```

### 技巧 7：CSS 变量作为 API

```css
/* 组件暴露变量作为配置接口 */
.button {
    --btn-padding-x: 16px;
    --btn-padding-y: 8px;
    --btn-radius: 4px;

    padding: var(--btn-padding-y) var(--btn-padding-x);
    border-radius: var(--btn-radius);
}

/* 外部覆盖 */
.button-lg {
    --btn-padding-x: 24px;
    --btn-padding-y: 12px;
    --btn-radius: 8px;
}
```

### 技巧 8：循环引用检测

```css
/* ❌ 循环引用会导致变量失效 */
.a { --x: var(--y); }
.b { --y: var(--x); }
```

> 💡 **最佳实践**：
> - 全局变量放 `:root`，局部变量放组件选择器
> - 命名空间化：`--btn-padding` 而非 `--padding`
> - 用 `calc()` 构建设计系统（间距、字号层级）
> - 配合 `@property` 让变量支持动画
