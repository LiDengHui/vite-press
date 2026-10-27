---
title: CSS 鼠标与交互样式
date: 2025-04-29
tags:
  - CSS
  - 交互
  - 前端
categories:
  - 技术文档
  - 前端
  - CSS
  - 交互与动画
---

# CSS 鼠标与交互样式

[[toc]]

CSS 不仅控制视觉呈现，还控制用户如何与元素交互。`cursor`、`pointer-events`、`user-select` 等属性让开发者能精确控制鼠标行为和文本选择体验。

---

## 光标样式

### 基础光标

```css
.btn-primary {
  cursor: pointer;       /* 手型，可点击 */
}

.loading {
  cursor: wait;          /* 加载中 */
}

.disabled {
  cursor: not-allowed;   /* 禁用 */
}

.resizable {
  cursor: col-resize;    /* 列宽调整 */
}
```

| 光标值 | 效果 |
|--------|------|
| `default` | 默认箭头 |
| `pointer` | 手型 |
| `text` | 文本选择 I 形 |
| `move` | 移动十字 |
| `grab` / `grabbing` | 抓取/抓取中 |
| `zoom-in` / `zoom-out` | 放大/缩小 |
| `crosshair` | 十字准星 |
| `help` | 帮助问号 |

### 自定义光标

```css
.custom-cursor {
  cursor: url('cursor.png'), url('cursor.cur'), auto;
  /* 提供多个回退 */
}

/* 热点位置 */
.hotspot-cursor {
  cursor: url('cursor.png') 16 16, auto;
  /* 16x16 是点击热点 */
}
```

> 建议使用 32x32 或更小的 PNG，并始终提供 `auto` 回退。

---

## 指针事件控制

### pointer-events

```css
/* 完全禁用鼠标事件 */
.invisible-to-mouse {
  pointer-events: none;
}

/* 仅响应点击 */
.click-only {
  pointer-events: auto;
}

/* SVG 路径点击穿透 */
svg .bg {
  pointer-events: none;
}

svg .interactive {
  pointer-events: all;
}
```

| 值 | 效果 |
|----|------|
| `auto` | 默认行为 |
| `none` | 忽略所有指针事件 |
| `visiblePainted` | SVG 填充/描边可见部分响应 |
| `all` | SVG 整个边界框响应 |

### 点击穿透应用

```css
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
}

.overlay .content {
  pointer-events: auto;  /* 内容区可交互 */
}

.overlay .bg {
  pointer-events: none;  /* 背景点击穿透到下层层 */
}
```

---

## 文本选择控制

### user-select

```css
.no-select {
  user-select: none;       /* 禁止选择 */
  -webkit-user-select: none;
}

.all-select {
  user-select: all;        /* 单击全选 */
}

.text-select {
  user-select: text;       /* 仅文本可选 */
}

.auto-select {
  user-select: auto;       /* 默认行为 */
}
```

### 双击禁止缩放

```css
.no-zoom {
  touch-action: manipulation;  /* 禁止双击缩放，保留单指滚动 */
}
```

---

## 触摸行为

### touch-action

```css
.pan-y {
  touch-action: pan-y;        /* 仅允许垂直滚动 */
}

.pinch-zoom {
  touch-action: pinch-zoom;   /* 允许捏合缩放 */
}

.none {
  touch-action: none;         /* 禁用所有触摸手势 */
}
```

| 值 | 效果 |
|----|------|
| `auto` | 默认 |
| `none` | 禁用所有手势 |
| `pan-x` / `pan-y` | 仅水平/垂直平移 |
| `pinch-zoom` | 允许捏合缩放 |
| `manipulation` | 禁用双击缩放，保留滚动 |

---

## 拖拽样式

### 拖拽光标

```css
[draggable="true"] {
  cursor: grab;
}

[draggable="true"]:active {
  cursor: grabbing;
}

.drag-over {
  border: 2px dashed #4a90d9;
  background: #f0f7ff;
}
```

### 拖拽时的 ghost 样式

```css
.dragging {
  opacity: 0.5;
}
```

---

## 浏览器兼容性

| 属性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| cursor | 1+ | 1+ | 1+ | 12+ |
| pointer-events | 1+ | 4+ | 1.5+ | 12+ |
| user-select | 1+ | 3+ | 1+ | 12+ |
| touch-action | 36+ | 9+ | 52+ | 12+ |

---

## 奇淫技巧

### 技巧一：放大镜光标

```css
.magnifier:hover {
  cursor: zoom-in;
}

.magnifier.zoomed {
  cursor: zoom-out;
}
```

### 技巧二：拖动手柄光标

```css
.resize-handle {
  cursor: col-resize;
}

.resize-handle-row {
  cursor: row-resize;
}

.resize-handle-nesw {
  cursor: nesw-resize;
}
```

### 技巧三：禁止选中但保留光标

```css
.read-only {
  user-select: none;
  cursor: default;
}

.read-only::selection {
  background: transparent;  /* 选中文本无高亮 */
}
```

### 技巧四：点击穿透叠加层

```css
.tooltip-wrapper {
  position: relative;
}

.tooltip-wrapper .tooltip {
  position: absolute;
  pointer-events: none;  /* 提示不阻挡下方点击 */
}
```

### 技巧五：长按菜单禁用

```css
.no-context-menu {
  -webkit-touch-callout: none;  /* iOS 长按菜单 */
  user-select: none;
}
```

---

## 参考资料

- [MDN cursor](https://developer.mozilla.org/zh-CN/docs/Web/CSS/cursor)
- [MDN pointer-events](https://developer.mozilla.org/zh-CN/docs/Web/CSS/pointer-events)
- [MDN user-select](https://developer.mozilla.org/zh-CN/docs/Web/CSS/user-select)
- [MDN touch-action](https://developer.mozilla.org/zh-CN/docs/Web/CSS/touch-action)
