---
title: CSS 架构方法论
date: 2025-04-29
tags:
  - CSS
  - 工程化
  - 架构
categories:
  - 技术文档
  - 前端
  - CSS
  - 工程化
---

# CSS 架构方法论

[[toc]]

随着项目规模增长，CSS 的维护成本和命名冲突问题日益突出。本文介绍 BEM、OOCSS、ITCSS 等主流 CSS 架构方法论，帮助你构建可维护、可扩展的样式系统。

---

## BEM

### 核心概念

**B**lock（块）**E**lement（元素）**M**odifier（修饰符）

### 命名规范

```css
/* Block - 独立的组件 */
.card { }

/* Element - 块的子元素 */
.card__title { }
.card__image { }
.card__content { }

/* Modifier - 状态或变体 */
.card--featured { }
.card--small { }
.card__title--highlighted { }
```

### 完整示例

```html
<article class="card card--featured">
  <img class="card__image" src="photo.jpg" alt="">
  <div class="card__content">
    <h2 class="card__title card__title--highlighted">标题</h2>
    <p class="card__text">内容描述...</p>
    <button class="card__button card__button--primary">按钮</button>
  </div>
</article>
```

```css
.card {
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card--featured {
  border: 2px solid gold;
}

.card__image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px 8px 0 0;
}

.card__content {
  padding: 20px;
}

.card__title {
  font-size: 1.5rem;
  margin-bottom: 12px;
}

.card__title--highlighted {
  color: #e74c3c;
}

.card__button {
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.card__button--primary {
  background: #3498db;
  color: white;
}
```

### BEM 的优点

- **清晰的层级关系**：通过命名就能理解结构
- **低特异性**：几乎都是类选择器
- **可复用性**：块可以独立存在
- **避免嵌套**：不需要深层选择器

---

## OOCSS

### 核心原则

**Object Oriented CSS** - 面向对象的 CSS

1. **结构与皮肤分离**
2. **容器与内容分离**

### 结构与皮肤分离

```css
/* 皮肤（可复用的视觉效果） */
.btn-skin {
  border-radius: 4px;
  border: 1px solid transparent;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-danger {
  background: #e74c3c;
  color: white;
}

.btn-outline {
  background: transparent;
  border-color: currentColor;
}
```

```html
<button class="btn-skin btn-primary">主要按钮</button>
<button class="btn-skin btn-danger">危险按钮</button>
<button class="btn-skin btn-outline btn-primary">轮廓按钮</button>
```

### 容器与内容分离

```css
/* ❌ 不好：内容与容器耦合 */
.sidebar .title {
  font-size: 18px;
}

/* ✅ 好：内容独立于容器 */
.title {
  font-size: 18px;
}

.sidebar {
  width: 300px;
  padding: 20px;
}
```

### 实用工具类

```css
/* 间距工具 */
.m-0 { margin: 0; }
.m-1 { margin: 4px; }
.m-2 { margin: 8px; }
.p-1 { padding: 4px; }
.p-2 { padding: 8px; }

/* 布局工具 */
.flex { display: flex; }
.grid { display: grid; }
.block { display: block; }

/* 文字工具 */
.text-center { text-align: center; }
.font-bold { font-weight: bold; }
.text-large { font-size: 1.25rem; }
```

---

## ITCSS

### 倒三角架构

**Inverted Triangle CSS** - 按特异性递增组织样式

```
Settings    ← 变量、配置（不输出 CSS）
Tools       ← mixins、函数（不输出 CSS）
Generic     ← 重置、normalize
Elements    ← 裸元素样式（h1, a, button）
Objects     ← OOCSS 布局类
Components  ← 具体 UI 组件
Utilities   ← 工具类（!important）
Trumps      ← 覆盖层
```

### 目录结构

```
css/
├── settings/
│   ├── _colors.scss
│   ├── _typography.scss
│   └── _spacing.scss
├── tools/
│   ├── _mixins.scss
│   └── _functions.scss
├── generic/
│   ├── _reset.scss
│   └── _normalize.scss
├── elements/
│   ├── _headings.scss
│   ├── _links.scss
│   └── _forms.scss
├── objects/
│   ├── _layout.scss
│   ├── _media.scss
│   └── _list-bare.scss
├── components/
│   ├── _button.scss
│   ├── _card.scss
│   └── _modal.scss
├── utilities/
│   ├── _spacing.scss
│   ├── _text.scss
│   └── _display.scss
└── main.scss
```

### 导入顺序

```scss
// main.scss
@import 'settings/colors';
@import 'settings/typography';
@import 'settings/spacing';

@import 'tools/mixins';
@import 'tools/functions';

@import 'generic/reset';
@import 'generic/normalize';

@import 'elements/headings';
@import 'elements/links';
@import 'elements/forms';

@import 'objects/layout';
@import 'objects/media';
@import 'objects/list-bare';

@import 'components/button';
@import 'components/card';
@import 'components/modal';

@import 'utilities/spacing';
@import 'utilities/text';
@import 'utilities/display';
```

---

## CUBE CSS

### 核心理念

**C**omposition + **U**tility + **B**lock + **E**xception

```css
/* Composition - 布局组合 */
.cluster {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.sidebar-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
}

/* Utility - 工具类 */
.text-center { text-align: center; }
.mt-auto { margin-top: auto; }
.w-full { width: 100%; }

/* Block - BEM 组件 */
.product-card { }
.product-card__title { }
.product-card__price { }

/* Exception - 特殊处理 */
[data-state="loading"] {
  opacity: 0.5;
  pointer-events: none;
}
```

---

## SMACSS

### 分类体系

**Scalable and Modular Architecture for CSS**

```css
/* Base - 元素基础样式 */
body {
  font-family: system-ui, sans-serif;
  line-height: 1.6;
}

a {
  color: #3498db;
}

/* Layout - 布局规则 */
.l-header { }
.l-sidebar { }
.l-main { }
.l-footer { }

/* Module - 可复用模块 */
.media { }
.media__img { }
.media__body { }

/* State - 状态 */
.is-active { }
.is-hidden { }
.is-collapsed { }

/* Theme - 主题 */
.theme-dark { }
.theme-light { }
```

---

## 现代组合方案

### Tailwind 风格原子类

```html
<div class="
  flex items-center justify-center
  min-h-screen bg-gray-100
  p-4 rounded-lg shadow-md
">
  <button class="
    px-6 py-3
    bg-blue-500 hover:bg-blue-600
    text-white font-semibold
    rounded-md transition-colors
  ">
    点击我
  </button>
</div>
```

### 结合 BEM + Utility

```html
<!-- 组件使用 BEM -->
<nav class="nav">
  <ul class="nav__list">
    <li class="nav__item">
      <a class="nav__link is-active" href="#">首页</a>
    </li>
  </ul>
</nav>

<!-- 布局使用 Utility -->
<div class="flex gap-4 items-center">
  <img class="w-12 h-12 rounded-full" src="avatar.jpg" alt="">
  <div>
    <p class="font-bold">用户名</p>
    <p class="text-gray-500">管理员</p>
  </div>
</div>
```

---

## 命名约定对比

| 方法论 | 块/组件 | 元素 | 修饰符 | 工具类 |
|--------|---------|------|--------|--------|
| BEM | `.card` | `.card__title` | `.card--large` | - |
| SMACSS | `.card` | `.card-title` | `.is-large` | `.l-grid` |
| OOCSS | `.card` | `.card-title` | `.card-large` | `.float-left` |
| CUBE | `.card` | `.card__title` | `[data-size="large"]` | `.text-center` |

---

## 最佳实践

### 文件组织

```css
/* 按功能分块 */
/* ====================
   基础设置
   ==================== */

/* ====================
   布局
   ==================== */

/* ====================
   组件
   ==================== */

/* ====================
   工具
   ==================== */

/* ====================
   主题/覆盖
   ==================== */
```

### 选择器深度控制

```css
/* ❌ 避免深层嵌套 */
.header .nav .nav-item .nav-link span { }

/* ✅ 最大 3 层 */
.nav__link span { }
```

### 状态管理

```html
<button class="btn btn--primary is-loading" disabled>
  加载中...
</button>
```

```css
.btn.is-loading {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn.is-loading::after {
  content: '';
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-left: 8px;
}
```

---

## 奇淫技巧

### 技巧一：CSS 变量驱动主题

```css
:root {
  --color-primary: #3498db;
  --color-danger: #e74c3c;
  --spacing-unit: 8px;
}

.btn {
  padding: calc(var(--spacing-unit) * 2) calc(var(--spacing-unit) * 3);
}

.btn--primary {
  background: var(--color-primary);
}
```

### 技巧二：data 属性作为修饰符

```css
.btn[data-variant="primary"] { background: blue; }
.btn[data-variant="danger"] { background: red; }
.btn[data-size="small"] { padding: 4px 8px; }
.btn[data-size="large"] { padding: 16px 32px; }
```

### 技巧三：容器查询替代修饰符

```css
.card {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: flex;
    gap: 1rem;
  }
}
```

### 技巧四：命名空间避免冲突

```css
/* 项目名称作为前缀 */
.myapp-button { }
.myapp-card { }
.myapp-modal { }
```

### 技巧五：层叠层管理优先级

```css
@layer reset, base, components, utilities;

@layer components {
  .card { }
}

@layer utilities {
  .hidden { display: none; } /* utilities 在最后一层，不需要 !important */
}
```

---

## 参考资料

- [BEM Official](https://en.bem.info/)
- [OOCSS by Nicole Sullivan](https://github.com/stubbornella/oocss/wiki)
- [ITCSS by Harry Roberts](https://itcss.io/)
- [CUBE CSS by Andy Bell](https://cube.fyi/)
- [SMACSS by Jonathan Snook](http://smacss.com/)
