---
title: CSS 隔离 isolation
date: 2025-04-29
tags:
  - CSS
  - 前端
  - 隔离
categories:
  - 技术文档
  - 前端
  - CSS
  - 基础入门
---

# CSS 隔离 isolation

[[toc]]

CSS `isolation` 属性控制元素是否创建新的层叠上下文（Stacking Context）。它主要与混合模式（`mix-blend-mode`）、滤镜（`filter`）等效果配合使用，确保元素的视觉效果不会泄露到父元素或兄弟元素。

## 基础概念

### 什么是隔离

```css
/* 默认值 - 不创建新的层叠上下文 */
.auto {
  isolation: auto;
}

/* 强制创建新的层叠上下文 */
.isolate {
  isolation: isolate;
}
```

**`隔离`的工作原理：**

- `auto`：元素可能会被父层的混合模式或滤镜效果影响
- `isolate`：创建新的层叠上下文，元素及其子元素的混合效果不会与外部交互

## 常见使用场景

### 混合模式隔离

```css
/* 问题：混合模式泄露到父层 */
.container {
  background: white;
}

.blend-item {
  mix-blend-mode: multiply;
  /* 会与 container 的背景混合 */
}

/* 解决：隔离容器 */
.container {
  isolation: isolate;
  background: white;
}

.blend-item {
  mix-blend-mode: multiply;
  /* 只在 container 内部混合 */
}
```

### 图片混合效果

```css
.image-effect {
  position: relative;
  isolation: isolate;
}

.image-effect img {
  width: 100%;
}

.image-effect::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  mix-blend-mode: overlay;
}
```

### 滤镜隔离

```css
.filter-container {
  isolation: isolate;
}

.filter-item {
  filter: blur(10px);
  /* 模糊效果不会影响到容器外部 */
}
```

## 创建层叠上下文的其他方式

除了 `isolation: isolate`，以下属性也会创建新的层叠上下文：

```css
/* z-index 不为 auto 的定位元素 */
.stacking-1 {
  position: relative;
  z-index: 0;
}

/* opacity < 1 */
.stacking-2 {
  opacity: 0.99;
}

/* transform */
.stacking-3 {
  transform: translateZ(0);
}

/* filter */
.stacking-4 {
  filter: blur(1px);
}

/* mix-blend-mode 不为 normal */
.stacking-5 {
  mix-blend-mode: multiply;
}

/* clip-path */
.stacking-6 {
  clip-path: inset(0);
}

/* mask / mask-image */
.stacking-7 {
  mask-image: url(mask.png);
}

/* perspective */
.stacking-8 {
  perspective: 1000px;
}

/* contain: layout/paint */
.stacking-9 {
  contain: layout;
}
```

**关键区别：**
- 以上属性创建层叠上下文的同时会带来额外的视觉效果
- `isolation: isolate` 仅创建层叠上下文，不引入其他视觉效果

## 实战案例

### 模态框遮罩

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal-content {
  position: relative;
  isolation: isolate;
  background: white;
  padding: 2rem;
  border-radius: 12px;
}

/* 确保模态框内的混合模式不影响到遮罩层 */
.modal-content .blend-effect {
  mix-blend-mode: overlay;
}
```

### 图标系统

```css
.icon-system {
  isolation: isolate;
}

.icon {
  background: var(--icon-bg);
  mix-blend-mode: screen;
}

/* 图标只与自身背景混合 */
```

### 文字效果

```css
.text-effect {
  position: relative;
  isolation: isolate;
  font-size: 4rem;
  font-weight: bold;
}

.text-effect::before {
  content: attr(data-text);
  position: absolute;
  top: 2px;
  left: 2px;
  color: rgba(0, 0, 0, 0.2);
  mix-blend-mode: multiply;
}
```

### 图层管理

```css
.layer-manager {
  isolation: isolate;
}

.layer {
  position: absolute;
}

.layer-1 { z-index: 1; }
.layer-2 { z-index: 2; }
.layer-3 { z-index: 3; }

/* 所有图层的 z-index 在同一层叠上下文中 */
```

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| `isolation` | 41+ | 8+ | 36+ | 79+ |

## 奇淫技巧

### 技巧一：快速创建 BFC

```css
/* 比 overflow: hidden 更干净的 BFC 创建方式 */
.bfc {
  isolation: isolate;
}

/* 特点：
   - 不影响溢出内容
   - 不影响滚动条
   - 仅创建新的层叠上下文
*/
```

### 技巧二：图片叠加

```css
.image-stack {
  position: relative;
  isolation: isolate;
  width: 400px;
  height: 300px;
}

.image-stack img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-stack img:nth-child(2) {
  mix-blend-mode: screen;
  opacity: 0.7;
}
```

### 技巧三：文字反色

```css
.invert-text {
  position: relative;
  isolation: isolate;
  background: white;
  color: black;
}

.invert-text::after {
  content: '';
  position: absolute;
  inset: 0;
  background: black;
  mix-blend-mode: difference;
  pointer-events: none;
}
```

### 技巧四：创意文字效果

```css
.creative-text {
  isolation: isolate;
  font-size: 5rem;
  font-weight: 900;
  background: url('texture.jpg');
  background-size: cover;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.creative-text::after {
  content: attr(data-text);
  position: absolute;
  inset: 0;
  color: rgba(0, 0, 0, 0.1);
  mix-blend-mode: overlay;
  pointer-events: none;
}
```

### 技巧五：渐变图层

```css
.gradient-overlay {
  position: relative;
  isolation: isolate;
}

.gradient-overlay::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  mix-blend-mode: color;
}
```

## 总结

`isolation` 属性是控制视觉效果边界的精确工具：

1. **核心用法**：创建独立的层叠上下文，防止混合效果泄露
2. **主要场景**：混合模式、滤镜、复杂叠加效果
3. **优势**：比其他创建 BFC 的方式更干净，不引入额外样式
4. **兼容性**：现代浏览器都已支持

## 参考资源

- [MDN: isolation](https://developer.mozilla.org/zh-CN/docs/Web/CSS/isolation)
- [MDN: Stacking Context](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_positioned_layout/Understanding_z-index/Stacking_context)
- [CSS-Tricks: isolation](https://css-tricks.com/almanac/properties/i/isolation/)
