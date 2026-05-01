---
title: CSS 滚动条样式
date: 2025-04-29
tags:
  - CSS
  - 滚动条
  - 滚动
categories:
  - 技术文档
  - 前端
  - CSS
  - 交互与动画
---

# CSS 滚动条样式

[[toc]]

原生滚动条样式简陋且跨浏览器不一致。CSS 提供了 `-webkit-scrollbar` 伪元素和标准化的 `scrollbar-*` 属性，让滚动条可以融入整体设计风格。

---

## Webkit 滚动条伪元素

### 完整结构

```css
/* 滚动条整体 */
::-webkit-scrollbar {
  width: 10px;    /* 垂直滚动条宽度 */
  height: 10px;   /* 水平滚动条高度 */
}

/* 轨道 */
::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 5px;
}

/* 滑块 */
::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 滑块激活状态 */
::-webkit-scrollbar-thumb:active {
  background: #888;
}

/* 两端按钮 */
::-webkit-scrollbar-button {
  display: none;  /* 通常隐藏 */
}

/* 交汇处 */
::-webkit-scrollbar-corner {
  background: transparent;
}

/* 轨道单独部分 */
::-webkit-scrollbar-track-piece {
  background: transparent;
}
```

### 特定容器滚动条

```css
.custom-scroll::-webkit-scrollbar {
  width: 6px;
}

.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.2);
  border-radius: 3px;
}

.custom-scroll:hover::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.4);
}
```

---

## 标准 scrollbar-* 属性

### Firefox 支持

```css
.firefox-scroll {
  scrollbar-width: thin;        /* thin | none | auto */
  scrollbar-color: #888 #f1f1f1; /* thumb track */
}

.firefox-scroll:hover {
  scrollbar-color: #666 #f1f1f1;
}
```

### 现代浏览器统一写法

```css
.unified-scroll {
  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 transparent;

  /* Webkit */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
}
```

---

## 隐藏滚动条

### 完全隐藏

```css
.hide-scrollbar {
  scrollbar-width: none;        /* Firefox */
  -ms-overflow-style: none;     /* IE/Edge */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;                /* Webkit */
}
```

### 仅隐藏水平/垂直

```css
.hide-x {
  overflow-x: auto;
  scrollbar-width: none;
}

.hide-x::-webkit-scrollbar:horizontal {
  display: none;
}
```

---

## scrollbar-gutter

### 预留滚动条空间

```css
.gutter-stable {
  scrollbar-gutter: stable;  /* 始终预留滚动条空间 */
}

.gutter-both {
  scrollbar-gutter: stable both-edges;  /* 两侧都预留 */
}
```

| 值 | 效果 |
|----|------|
| `auto` | 默认，不预留 |
| `stable` | 预留空间，避免布局抖动 |
| `stable both-edges` | 两侧对称预留 |

---

## 滚动条主题

### 暗色主题

```css
.dark-scroll::-webkit-scrollbar {
  width: 8px;
}

.dark-scroll::-webkit-scrollbar-track {
  background: #1a1a1a;
}

.dark-scroll::-webkit-scrollbar-thumb {
  background: #444;
  border-radius: 4px;
}

.dark-scroll::-webkit-scrollbar-thumb:hover {
  background: #666;
}
```

### 彩色主题

```css
.accent-scroll::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #ff6b6b, #4ecdc4);
  border-radius: 4px;
}
```

### 极简风格

```css
.minimal-scroll::-webkit-scrollbar {
  width: 4px;
}

.minimal-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.minimal-scroll::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.15);
  border-radius: 2px;
}
```

---

## 浏览器兼容性

| 属性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| -webkit-scrollbar | 1+ | 1+ | 无 | 12+ |
| scrollbar-width | 121+ | 无 | 64+ | 121+ |
| scrollbar-color | 121+ | 无 | 64+ | 121+ |
| scrollbar-gutter | 94+ | 无 | 97+ | 94+ |

---

## 奇淫技巧

### 技巧一：悬浮显示滚动条

```css
.auto-hide-scroll {
  scrollbar-width: none;
}

.auto-hide-scroll::-webkit-scrollbar {
  width: 0;
  transition: width 0.3s;
}

.auto-hide-scroll:hover {
  scrollbar-width: thin;
}

.auto-hide-scroll:hover::-webkit-scrollbar {
  width: 6px;
}
```

### 技巧二：圆角容器内滚动条

```css
.rounded-scroll {
  border-radius: 12px;
  overflow: auto;
}

.rounded-scroll::-webkit-scrollbar-track {
  border-radius: 12px;
  margin: 4px;
}

.rounded-scroll::-webkit-scrollbar-thumb {
  border-radius: 12px;
  border: 2px solid transparent;
  background-clip: padding-box;
}
```

### 技巧三：自定义滚动条按钮

```css
.custom-buttons::-webkit-scrollbar-button:start:decrement,
.custom-buttons::-webkit-scrollbar-button:end:increment {
  display: block;
  height: 12px;
  background: #f1f1f1;
}

.custom-buttons::-webkit-scrollbar-button:start:decrement {
  border-radius: 5px 5px 0 0;
}
```

### 技巧四：滚动条宽度动画

```css
.animated-scroll::-webkit-scrollbar {
  width: 0;
  transition: width 0.3s ease;
}

.animated-scroll:hover::-webkit-scrollbar {
  width: 10px;
}
```

### 技巧五：双滚动条样式

```css
/* 外层滚动条 */
.outer::-webkit-scrollbar {
  width: 12px;
}

.outer::-webkit-scrollbar-thumb {
  background: #ccc;
}

/* 内层滚动条更细 */
.inner::-webkit-scrollbar {
  width: 6px;
}

.inner::-webkit-scrollbar-thumb {
  background: #ddd;
}
```

---

## 参考资料

- [MDN scrollbar](https://developer.mozilla.org/zh-CN/docs/Web/CSS/scrollbar)
- [CSS-Tricks: Custom Scrollbars in WebKit](https://css-tricks.com/custom-scrollbars-in-webkit/)
- [W3C CSS Scrollbar Styling Module Level 1](https://www.w3.org/TR/css-scrollbars-1/)
