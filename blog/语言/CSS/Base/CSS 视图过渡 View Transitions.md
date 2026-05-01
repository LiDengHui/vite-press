---
title: CSS 视图过渡 View Transitions
date: 2025-04-29
tags:
  - CSS
  - 过渡
  - 动画
  - View Transitions
  - 现代特性
categories:
  - 技术文档
  - 前端
  - CSS
  - 现代特性
---

# CSS 视图过渡 View Transitions

[[toc]]

CSS View Transitions API 允许在 DOM 状态变化时创建平滑的动画过渡效果。这是现代 Web 开发中最令人兴奋的新特性之一，可以实现类似原生应用的页面切换体验。

## 基础概念

### 视图过渡流程

```
开始状态 → 捕获快照 → 创建过渡图层 → 动画过渡 → 结束状态
```

### 基本用法

```js
// 触发视图过渡
document.startViewTransition(() => {
  // 更新 DOM
  updateDOM();
});
```

```css
/* 过渡动画样式 */
::view-transition-old(root) {
  animation: fade-out 0.5s ease;
}

::view-transition-new(root) {
  animation: fade-in 0.5s ease;
}

@keyframes fade-out {
  to { opacity: 0; }
}

@keyframes fade-in {
  from { opacity: 0; }
}
```

## 伪元素结构

### 视图过渡树

```
::view-transition
  ├── ::view-transition-group(root)
  │     ├── ::view-transition-image-pair(root)
  │     │     ├── ::view-transition-old(root)
  │     │     └── ::view-transition-new(root)
  │
  ├── ::view-transition-group(element-name)
  │     ├── ::view-transition-image-pair(element-name)
  │     │     ├── ::view-transition-old(element-name)
  │     │     └── ::view-transition-new(element-name)
```

### 命名过渡元素

```html
<div class="card" style="view-transition-name: card-1">
  <h2>卡片标题</h2>
</div>
```

```css
/* 为特定元素创建过渡 */
.card {
  view-transition-name: card;
}

::view-transition-group(card) {
  animation-duration: 0.5s;
}
```

## 实战案例

### 页面切换过渡

```js
// 页面导航
async function navigate(url) {
  const transition = document.startViewTransition(async () => {
    const response = await fetch(url);
    const html = await response.text();
    
    // 更新页面内容
    document.body.innerHTML = html;
  });
  
  await transition.finished;
}
```

```css
/* 页面过渡动画 */
::view-transition-old(root) {
  animation: slide-out 0.5s ease;
}

::view-transition-new(root) {
  animation: slide-in 0.5s ease;
}

@keyframes slide-out {
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}

@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
}
```

### 列表项过渡

```html
<ul class="list">
  <li style="view-transition-name: item-1">项目 1</li>
  <li style="view-transition-name: item-2">项目 2</li>
  <li style="view-transition-name: item-3">项目 3</li>
</ul>
```

```js
function addItem(text) {
  const transition = document.startViewTransition(() => {
    const li = document.createElement('li');
    li.textContent = text;
    li.style.viewTransitionName = `item-${Date.now()}`;
    list.appendChild(li);
  });
}

function removeItem(item) {
  const transition = document.startViewTransition(() => {
    item.remove();
  });
}
```

```css
/* 列表项动画 */
::view-transition-group(item-1),
::view-transition-group(item-2),
::view-transition-group(item-3) {
  animation-duration: 0.3s;
}

::view-transition-new(item-*):only-child {
  animation: scale-in 0.3s ease;
}

::view-transition-old(item-*):only-child {
  animation: scale-out 0.3s ease;
}

@keyframes scale-in {
  from {
    transform: scale(0);
    opacity: 0;
  }
}

@keyframes scale-out {
  to {
    transform: scale(0);
    opacity: 0;
  }
}
```

### 图片画廊

```js
function showImage(src) {
  const transition = document.startViewTransition(() => {
    mainImage.src = src;
  });
  
  transition.ready.then(() => {
    // 过渡准备就绪
  });
  
  transition.finished.then(() => {
    // 过渡完成
  });
}
```

```css
/* 图片过渡 */
::view-transition-group(main-image) {
  animation-duration: 0.5s;
}

::view-transition-old(main-image) {
  animation: image-out 0.5s ease;
}

::view-transition-new(main-image) {
  animation: image-in 0.5s ease;
}

@keyframes image-out {
  to {
    transform: scale(1.1);
    opacity: 0;
    filter: blur(10px);
  }
}

@keyframes image-in {
  from {
    transform: scale(0.9);
    opacity: 0;
    filter: blur(10px);
  }
}
```

## 高级用法

### 自定义过渡时机

```js
const transition = document.startViewTransition(() => {
  updateDOM();
});

// 等待过渡准备
await transition.ready;

// 执行自定义逻辑
console.log('过渡开始');

// 等待过渡完成
await transition.finished;

console.log('过渡结束');
```

### 条件过渡

```js
function conditionalTransition(callback) {
  if (!document.startViewTransition) {
    // 不支持时的回退
    callback();
    return;
  }
  
  // 检查用户偏好
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    callback();
    return;
  }
  
  return document.startViewTransition(callback);
}
```

### 多元素过渡

```css
/* 多个元素的协调过渡 */
.header {
  view-transition-name: header;
}

.sidebar {
  view-transition-name: sidebar;
}

.content {
  view-transition-name: content;
}

/* 不同元素的独立动画 */
::view-transition-group(header) {
  animation-duration: 0.3s;
}

::view-transition-group(sidebar) {
  animation-duration: 0.5s;
}

::view-transition-group(content) {
  animation-duration: 0.4s;
}
```

## 样式控制

### 过渡容器

```css
::view-transition {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
}

::view-transition-group(*) {
  animation-timing-function: ease-in-out;
}
```

### 快照样式

```css
/* 旧状态快照 */
::view-transition-old(*) {
  object-fit: cover;
}

/* 新状态快照 */
::view-transition-new(*) {
  object-fit: cover;
}
```

### 背景处理

```css
/* 过渡期间的背景 */
::view-transition-image-pair(*) {
  isolation: isolate;
}

/* 防止闪烁 */
::view-transition-old(root),
::view-transition-new(root) {
  animation-fill-mode: both;
}
```

## 性能优化

### 避免重排

```js
// ❌ 避免频繁更新
document.startViewTransition(() => {
  element.style.width = '100px';
  element.style.height = '100px';
  element.style.background = 'red';
});

// ✅ 批量更新
document.startViewTransition(() => {
  element.style.cssText = `
    width: 100px;
    height: 100px;
    background: red;
  `;
});
```

### 限制过渡元素

```css
/* 只过渡必要的元素 */
.animated {
  view-transition-name: animated;
}

.static {
  /* 不设置 view-transition-name */
}
```

### 硬件加速

```css
::view-transition-group(*) {
  will-change: transform, opacity;
}
```

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| View Transitions API | 111+ | ❌ | ❌ | 111+ |
| view-transition-name | 111+ | ❌ | ❌ | 111+ |

## 渐进增强

```js
// 支持检测
if (!document.startViewTransition) {
  // 降级方案
  updateDOM();
  return;
}

// 使用过渡
document.startViewTransition(() => {
  updateDOM();
});
```

```css
/* CSS 降级 */
@supports not (view-transition-name: test) {
  .fallback-animation {
    animation: simple-fade 0.3s ease;
  }
}
```

## 奇淫技巧

### 技巧一：共享元素过渡

```js
function expandCard(card) {
  // 设置共享元素名称
card.style.viewTransitionName = 'expanded-card';
  
  document.startViewTransition(() => {
    card.classList.add('expanded');
  });
}
```

```css
.expanded {
  position: fixed;
  inset: 2rem;
  z-index: 100;
}

::view-transition-group(expanded-card) {
  animation-duration: 0.5s;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 技巧二：页面主题切换

```js
function toggleTheme() {
  document.startViewTransition(() => {
    document.documentElement.classList.toggle('dark');
  });
}
```

```css
::view-transition-old(root) {
  animation: theme-out 0.5s ease;
}

::view-transition-new(root) {
  animation: theme-in 0.5s ease;
}

@keyframes theme-out {
  to {
    clip-path: circle(0% at 50% 50%);
  }
}

@keyframes theme-in {
  from {
    clip-path: circle(0% at 50% 50%);
  }
}
```

### 技巧三：网格重排动画

```js
function reorderGrid() {
  document.startViewTransition(() => {
    const items = [...grid.children];
    items.sort(() => Math.random() - 0.5);
    items.forEach(item => grid.appendChild(item));
  });
}
```

```css
.grid-item {
  view-transition-name: attr(data-id);
}

::view-transition-group(*) {
  animation-duration: 0.5s;
}
```

### 技巧四：模态框过渡

```js
function openModal() {
  document.startViewTransition(() => {
    modal.showModal();
  });
}

function closeModal() {
  document.startViewTransition(() => {
    modal.close();
  });
}
```

```css
::view-transition-old(modal) {
  animation: modal-out 0.3s ease;
}

::view-transition-new(modal) {
  animation: modal-in 0.3s ease;
}

@keyframes modal-in {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
}

@keyframes modal-out {
  to {
    transform: scale(0.8);
    opacity: 0;
  }
}
```

### 技巧五：无限滚动加载

```js
function loadMore() {
  document.startViewTransition(() => {
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < 10; i++) {
      const item = createItem();
      item.style.viewTransitionName = `item-${Date.now()}-${i}`;
      fragment.appendChild(item);
    }
    
    list.appendChild(fragment);
  });
}
```

## 总结

CSS View Transitions API 为 Web 带来了原生级的页面过渡体验：

1. **核心能力**：在 DOM 变化时自动创建平滑过渡动画
2. **使用方式**：通过 `document.startViewTransition()` 触发
3. **样式控制**：使用 `::view-transition-*` 伪元素自定义动画
4. **性能注意**：限制过渡元素数量，避免频繁更新
5. **兼容性**：目前仅 Chrome/Edge 支持，需要渐进增强

## 参考资源

- [MDN: View Transitions API](https://developer.mozilla.org/zh-CN/docs/Web/API/View_Transitions_API)
- [Chrome Developers: View Transitions](https://developer.chrome.com/docs/web-platform/view-transitions/)
- [CSS-Tricks: View Transitions](https://css-tricks.com/almanac/properties/v/view-transition-name/)
