---
title: CSS 面试题精选
date: 2025-04-29
tags:
  - CSS
  - 前端
  - 面试题
categories:
  - 技术文档
  - 前端
  - CSS
  - 基础入门
---

# CSS 面试题精选

[[toc]]

本文整理了前端面试中最常见的 CSS 问题，涵盖基础概念、布局、性能、浏览器渲染和现代特性等方面。

## 基础概念

### Q1: 什么是 CSS 盒模型？标准模型和怪异模型有什么区别？

**回答：**
CSS 盒模型定义了元素如何计算宽度和高度。

```css
/* 标准模型 */
.standard {
  box-sizing: content-box;
  width: 100px;      /* 内容宽度 */
  padding: 10px;     /* 添加到外部 */
  border: 1px solid; /* 添加到外部 */
  /* 总宽度 = 100 + 20 + 2 = 122px */
}

/* 怪异模型 */
.border-box {
  box-sizing: border-box;
  width: 100px;      /* 总宽度 */
  padding: 10px;     /* 包含在内 */
  border: 1px solid; /* 包含在内 */
  /* 内容宽度 = 100 - 20 - 2 = 78px */
}
```

**推荐：** 使用 `box-sizing: border-box` 统一处理，更直观易控制。

```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

### Q2: 什么是 BFC？如何创建？有什么用处？

**回答：**
BFC（Block Formatting Context）是独立的渲染区域，内部元素不会影响外部。

**创建方式：**
```css
.bfc {
  display: flow-root;    /* 最新推荐 */
  display: inline-block;
  overflow: hidden;
  float: left;
  position: absolute/fixed;
  display: flex/grid;
}
```

**应用场景：**
1. 解决 margin 塌陷
2. 清除浮动
3. 防止文字环绕浮动元素

```css
.parent {
  display: flow-root;  /* 包含浮动子元素 */
}

.sibling {
  display: flow-root;  /* 避免 margin 塌陷 */
}
```

### Q3: 解释清除浮动的多种方式

**回答：**
```css
/* 方式 1: 空元素 */
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}

/* 方式 2: 使用 overflow */
.container {
  overflow: hidden;  /* 或 auto */
}

/* 方式 3: 使用 BFC */
.container {
  display: flow-root;
}

/* 方式 4: 使用 flex/grid */
.container {
  display: flex;
  flex-wrap: wrap;
}
```

### Q4: 什么是重绘（Repaint）和重排（Reflow）？如何优化？

**回答：**
- **重排（Reflow）**：计算元素位置和尺寸，成本高
- **重绘（Repaint）**：更新视觉表现（颜色、背景等），成本较低

**触发重排的属性：**
宽度、高度、margin、padding、border、定位、display 等

**触发重绘的属性：**
color、background、visibility、box-shadow 等

**优化策略：**
1. 使用 `transform` 和 `opacity` 做动画（不触发重排）
2. 使用 `will-change` 提前告诉浏览器
3. 批量更新 DOM（使用 DocumentFragment）
4. 使用 `requestAnimationFrame`
5. 避免读写交错（读取 offsetWidth 后立即写入导致强制同步）

### Q5: 解释 CSS 层叠上下文

**回答：**
层叠上下文决定元素在 Z 轴上的显示顺序。

**创建方式：**
1. 根元素（html）
2. position 为 absolute/relative/fixed/sticky 且 z-index 不为 auto
3. position 为 fixed/sticky（手机浏览器）
4. opacity < 1
5. transform、filter、perspective　不为 none
6. isolation: isolate
7. mix-blend-mode 不为 normal
8. will-change
9. contain: layout/paint
10. flex/grid 子元素且 z-index 不为 auto

**层级顺序：**
1. 形成层叠上下文的元素
2. z-index 为负数
3. 流程中非定位元素
4. 流程中定位元素（z-index 为 auto）
5. z-index 为正数

### Q6: 什么是特异性？如何计算？

**回答：**
特异性是选择器的权重，格式为 `(a, b, c)`：

- **a**: 行内样式（0 或 1）
- **b**: ID 选择器数量
- **c**: 类选择器、属性选择器、伪类数量
- **元素选择器和伪元素**: 计入 c 但特异性更低

```css
/* (0, 0, 1) */
p { }

/* (0, 1, 0) */
.class { }

/* (0, 1, 1) */
.class p { }

/* (1, 0, 0) */
#id { }

/* (1, 0, 0, 0) - 行内样式 */
style="..."
```

**特异性相同时：**
后面的规则覆盖前面的（源中的后定义）。

## 布局

### Q7: Flexbox 和 Grid 的区别？什么时候用哪个？

**回答：**

| 特性 | Flexbox | Grid |
|------|---------|------|
| 维度 | 单维（行或列） | 二维（行和列） |
| 内容 | 内容驱动 | 容器驱动 |
| 对齐 | 针对单行/列 | 针对整个网格 |
| 应用 | 组件内部布局 | 页面级布局 |

**使用场景：**
- **Flexbox**：导航栏、按钮组、卡片内部布局、居中对齐
- **Grid**：整体页面布局、图片画廊、复杂的二维排列

**组合使用：**
```css
.page {
  display: grid;
  grid-template-columns: 250px 1fr;
}

.card {
  display: flex;
  flex-direction: column;
}
```

### Q8: 如何实现水平垂直居中

**回答：**
```css
/* 方法 1: Flexbox */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 方法 2: Grid */
.container {
  display: grid;
  place-items: center;
}

/* 方法 3: 绝对定位 + transform */
.container {
  position: relative;
}
.element {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 方法 4: 绝对定位 + margin auto */
.container {
  display: grid;
}
.element {
  margin: auto;
}
```

### Q9: 如何解决浮动导致的父元素高度塌陷

**回答：**
```css
/* 方法 1: 清除浮动 */
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}

/* 方法 2: 创建 BFC */
.parent {
  display: flow-root;
}

/* 方法 3: 使用 flex */
.parent {
  display: flex;
  flex-wrap: wrap;
}
```

### Q10: 如何实现两栏布局，一栏固定宽度，另一栏自适应

**回答：**
```css
/* 方法 1: Flexbox */
.container {
  display: flex;
}

.sidebar {
  width: 200px;
  flex-shrink: 0;
}

.main {
  flex: 1;
}

/* 方法 2: Grid */
.container {
  display: grid;
  grid-template-columns: 200px 1fr;
}

/* 方法 3: calc */
.container {
  display: flex;
}

.sidebar {
  width: 200px;
}

.main {
  width: calc(100% - 200px);
}
```

## 性能

### Q11: 如何优化 CSS 加载性能

**回答：**
1. **关键 CSS 内联**：将首屏必需样式放在 `<style>` 中
2. **异步加载**：非关键 CSS 使用 `preload` 后异步加载
3. **提供关键帧提示**：使用 `font-display: swap`
4. **使用属性优化**：`contain`、`content-visibility`
5. **流媒体**：优先加载首屏内容

```html
<!-- 关键 CSS -->
<style>
  /* 首屏样式 */
</style>

<!-- 异步加载 -->
<link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
```

### Q12: 什么是 CRP（Critical Rendering Path）？如何优化？

**回答：**
CRP 是浏览器将 HTML、CSS 和 JavaScript 转换为像素的过程。

**步骤：**
1. 构建 DOM 树
2. 构建 CSSOM 树
3. 合并为渲染树
4. 布局（Layout）
5. 绘制（Paint）
6. 合成（Composite）

**优化策略：**
1. 减少关键资源数量
2. 压缩资源
3. 优化 CSS 选择器
4. 避免阻塞式 JavaScript
5. 使用媒体查询提供关键帧

## 现代特性

### Q13: 解释 CSS 容器查询

**回答：**
容器查询允许根据元素容器的尺寸而非视口尺寸应用样式。

```css
.container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card {
    flex-direction: row;
  }
}
```

**与媒体查询的区别：**
- 媒体查询：基于视口尺寸
- 容器查询：基于容器尺寸

### Q14: 解释 CSS 级联层

**回答：**
级联层允许明确声明样式的优先级顺序。

```css
@layer reset, base, components, utilities;

@layer reset {
  * { margin: 0; padding: 0; }
}

@layer components {
  .btn { padding: 0.5rem 1rem; }
}

@layer utilities {
  .hidden { display: none; }
}
```

**优势：**
1. 消除特异性战争
2. 减少 !important 使用
3. 更好的代码组织

**关键点：**

- 层顺序在首次出现时固定，后声明的层优先级更高；同一层内部才比较特异性。
- 未分层的普通样式高于所有普通层；加上 `!important` 后关系反转，层内的 `!important` 更高。
- 普通行内样式压过所有普通层，行内 `!important` 则是作者来源中最高的。
- `revert-layer` 回退到上一层，`revert` 回退到上一个来源。
- 动画高于普通声明，过渡高于 `!important`，它们不受层控制。

### Q15: 解释 :has() 选择器

**回答：**
`:has()` 是 CSS 父选择器，允许根据子元素的状态选择父元素。

```css
/* 当包含图片时的卡片 */
.card:has(img) {
  grid-template-columns: 200px 1fr;
}

/* 当包含无效表单时 */
form:has(:user-invalid) {
  border-color: red;
}

/* 与弟弟选择符结合 */
.item:has(+ .active) {
  border-right: none;
}
```

**注意：**
- 性能较差，不要用于大规模列表
- 不支持反向选择（选择弟弟时兄弟不能是 :has() 的父级）

## 可访问性

### Q16: 如何确保页面可访问

**回答：**
1. **颜色对比度**：确保足够的对比（WCAG AA: 4.5:1）
2. **焦点管理**：确保所有交互元素可聚焦
3. **减少动画**：尊重 `prefers-reduced-motion`
4. **正确的 HTML 语义**：使用正确的标签和 ARIA 属性
5. **键盘可操作**：确保所有功能可用键盘访问

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

## 奇淫技巧

### 技巧一：一行代码计算特异性

```css
/* 使用 :where() 降低特异性 */
:where(.card, .panel, .modal) .title {
  /* 特异性 (0, 1, 0) 而非 (0, 0, 2) */
  font-size: 1.25rem;
}
```

### 技巧二：使用 CSS 变量实现响应式

```css
:root {
  --breakpoint: 768px;
}

@container (min-width: var(--breakpoint)) {
  /* CSS 容器查询不支持在 @container 中使用 CSS 变量 */
}

/* 正确做法 */
@container (min-width: 768px) {
  .component {
    --is-large: ;
  }
}

.component {
  flex-direction: var(--is-large, column) row;
}
```

### 技巧三：使用 空白属性实现条件逻辑

```css
/* 当 --theme 存在时应用暗色模式 */
.component {
  background: var(--theme) #fff;
}

.component {
  background: var(--theme, #1a1a1a);
}

/* 更高级的条件 */
.component {
  --is-dark: var(--theme);
  background: var(--is-dark, #1a1a1a);
}
```

## 总结

CSS 面试核心知识点：

1. **基础**：盒模型、BFC、特异性、层叠上下文
2. **布局**：Flexbox、Grid、定位、浮动
3. **性能**：重排重绘、CRP、动画优化
4. **现代特性**：容器查询、级联层、:has()、视图过渡
5. **可访问性**：对比度、聚焦、减少动画
6. **工程化**：命名规范、架构设计、性能优化

## 参考资源

- [MDN CSS Reference](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference)
- [Frontend Masters: CSS Interview Questions](https://frontendmasters.com/)
- [CSS-Tricks: Complete Guide Series](https://css-tricks.com/guides/)
