---
title: CSS 溢出与可见性
date: 2025-04-29
tags:
  - CSS
categories:
  - 技术文档
  - 前端
  - CSS
  - 基础入门
---

# CSS 溢出与可见性

[[toc]]

CSS 溢出（overflow）和可见性（visibility）属性控制元素内容超出容器边界时的行为以及元素的显示状态。深入理解这些属性对于处理布局溢出、创建滚动区域和管理元素显示至关重要。

## 溢出基础

### overflow 属性

`overflow` 控制内容超出元素盒子时的行为：

```css
.box {
  width: 300px;
  height: 200px;
  border: 2px solid #333;
}

/* 可见（默认） */
.overflow-visible {
  overflow: visible;
}

/* 隐藏溢出 */
.overflow-hidden {
  overflow: hidden;
}

/* 滚动 */
.overflow-scroll {
  overflow: scroll;
}

/* 自动（溢出时显示滚动条） */
.overflow-auto {
  overflow: auto;
}
```

### 溢出类型对比

| 值 | 水平溢出 | 垂直溢出 | 滚动条 |
|----|----------|----------|--------|
| `visible` | 可见 | 可见 | 无 |
| `hidden` | 裁剪 | 裁剪 | 无 |
| `scroll` | 滚动 | 滚动 | 始终显示 |
| `auto` | 自动 | 自动 | 溢出时显示 |

### 独立方向控制

```css
/* 水平溢出 */
.overflow-x {
  overflow-x: scroll;
  overflow-y: hidden;
}

/* 垂直溢出 */
.overflow-y {
  overflow-x: hidden;
  overflow-y: auto;
}
```

### clip 值（新特性）

```css
/* CSS Overflow Module Level 3 */
.overflow-clip {
  overflow: clip;
  overflow-clip-margin: 10px;
}
```

- `clip`：类似 `hidden`，但不创建 BFC
- `overflow-clip-margin`：定义裁剪边距

## 可见性控制

### visibility 属性

```css
/* 可见（默认） */
.visible {
  visibility: visible;
}

/* 隐藏但保留空间 */
.hidden {
  visibility: hidden;
}

/* 折叠（表格行/列） */
.collapse {
  visibility: collapse;
}
```

### visibility vs display

```css
/* visibility: hidden - 隐藏但保留布局空间 */
.invisible {
  visibility: hidden;
  /* 元素不可见，但占据空间，可交互（如点击） */
}

/* display: none - 完全移除 */
.removed {
  display: none;
  /* 元素从文档流中移除，不占据空间 */
}

/* opacity: 0 - 透明但可交互 */
.transparent {
  opacity: 0;
  /* 元素透明，占据空间，可交互 */
}
```

| 属性 | 占据空间 | 可交互 | 子元素继承 |
|------|----------|--------|------------|
| `visibility: hidden` | ✅ | ❌ | ✅ |
| `display: none` | ❌ | ❌ | - |
| `opacity: 0` | ✅ | ✅ | ❌ |

### 部分可见性

```css
/* 子元素可覆盖父元素 */
.parent {
  visibility: hidden;
}

.parent .child {
  visibility: visible;
}
```

## 滚动控制

### 滚动行为

```css
/* 平滑滚动 */
.smooth-scroll {
  scroll-behavior: smooth;
}

/* 滚动条样式（WebKit） */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #555;
}
```

### 滚动吸附

```css
/* 容器 */
.snap-container {
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  display: flex;
  gap: 1rem;
}

/* 子元素 */
.snap-item {
  scroll-snap-align: start;
  flex-shrink: 0;
  width: 100%;
}
```

### 滚动条隐藏

```css
/* 隐藏滚动条但保持滚动功能 */
.hide-scrollbar {
  -ms-overflow-style: none;  /* IE/Edge */
  scrollbar-width: none;     /* Firefox */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;             /* Chrome/Safari */
}
```

## 文本溢出处理

### 单行省略

```css
.single-line {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

### 多行省略

```css
/* WebKit 浏览器 */
.multi-line {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 现代语法 */
.modern-clamp {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  line-clamp: 3;
}
```

### 自定义省略样式

```css
.custom-ellipsis {
  position: relative;
  max-height: 4.5em; /* 3行高度 */
  overflow: hidden;
}

.custom-ellipsis::after {
  content: '...';
  position: absolute;
  bottom: 0;
  right: 0;
  background: white;
  padding-left: 1rem;
}
```

## 溢出陷阱

### 陷阱一：overflow 创建 BFC

```css
/* overflow 不为 visible 时创建新的块级格式化上下文 */
.bfc {
  overflow: hidden; /* 创建 BFC */
}

/* BFC 特性：
   - 内部浮动不会影响到外部
   - 外边距不会折叠
   - 不会与浮动元素重叠
*/
```

### 陷阱二：绝对定位与 overflow

```css
.overflow-box {
  position: relative;
  overflow: hidden;
}

.overflow-box .absolute {
  position: absolute;
  top: -10px;
  /* 绝对定位子元素不会被裁剪 */
}
```

**注意**：绝对定位的子元素只有在同时设置父元素 `position: relative/absolute/fixed/sticky` 时，才会被 `overflow: hidden` 裁剪。

### 陷阱三：transform 与 overflow

```css
/* transform 会创建新的包含块 */
.transform-box {
  transform: translateX(0);
  overflow: hidden;
}

/* 子元素的 fixed 定位会相对于 transform 元素 */
.transform-box .fixed {
  position: fixed; /* 实际表现为 absolute */
}
```

## 实用技巧

### 技巧一：响应式表格

```css
.table-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch; /* 平滑滚动（iOS） */
}

.table-wrapper table {
  min-width: 800px; /* 确保表格最小宽度 */
}
```

### 技巧二：模态框遮罩

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  overflow: auto;
}

.modal-content {
  margin: 2rem auto;
  max-width: 600px;
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
}
```

### 技巧三：粘性表头

```css
.table-container {
  overflow: auto;
  max-height: 400px;
}

.table-container thead th {
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
}
```

### 技巧四：水平滚动容器

```css
.horizontal-scroll {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 1rem; /* 为滚动条留空间 */
}

.horizontal-scroll > * {
  flex-shrink: 0;
  scroll-snap-align: start;
  width: 300px;
}
```

### 技巧五：溢出阴影提示

```css
.scroll-hint {
  position: relative;
  overflow: auto;
}

.scroll-hint::before,
.scroll-hint::after {
  content: '';
  position: sticky;
  left: 0;
  right: 0;
  height: 20px;
  pointer-events: none;
}

.scroll-hint::before {
  top: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.1), transparent);
}

.scroll-hint::after {
  bottom: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.1), transparent);
}
```

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| `overflow` | 1+ | 1+ | 1+ | 12+ |
| `overflow-x/y` | 1+ | 3+ | 3.5+ | 12+ |
| `text-overflow` | 1+ | 1.3+ | 7+ | 12+ |
| `line-clamp` | 6+ | 5+ | 68+ | 17+ |
| `scroll-behavior` | 61+ | 14+ | 36+ | 79+ |
| `scroll-snap-type` | 69+ | 11+ | 68+ | 79+ |

## 总结

CSS 溢出与可见性属性是布局控制的核心工具：

1. **`overflow`**：控制内容溢出，创建 BFC
2. **`visibility`**：控制可见性但保留空间
3. **`text-overflow`**：处理文本截断和省略
4. **滚动控制**：`scroll-behavior`、`scroll-snap-type`
5. **BFC**：溢出属性创建新的块级格式化上下文

## 参考资源

- [MDN: overflow](https://developer.mozilla.org/zh-CN/docs/Web/CSS/overflow)
- [MDN: visibility](https://developer.mozilla.org/zh-CN/docs/Web/CSS/visibility)
- [MDN: text-overflow](https://developer.mozilla.org/zh-CN/docs/Web/CSS/text-overflow)
- [CSS-Tricks: Handling Overflow](https://css-tricks.com/almanac/properties/o/overflow/)
