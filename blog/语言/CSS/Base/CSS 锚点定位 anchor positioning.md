---
title: CSS 锚点定位 Anchor Positioning
date: 2025-04-29
tags:
  - CSS
  - 定位
  - 锚点定位
  - 现代特性
categories:
  - 技术文档
  - 前端
  - CSS
  - 现代特性
---

# CSS 锚点定位 Anchor Positioning

[[toc]]

CSS 锚点定位（Anchor Positioning）允许元素相对于另一个元素（锚点）进行定位，无需 JavaScript 计算位置。这是构建工具提示、下拉菜单、弹出框等浮动 UI 的理想解决方案。

## 基础概念

### 什么是锚点定位

```html
<!-- 锚点元素 -->
<button class="anchor" popovertarget="tooltip">悬停我</button>

<!-- 定位元素 -->
<div class="tooltip" popover id="tooltip">
  这是工具提示内容
</div>
```

```css
/* 定义锚点 */
.anchor {
  anchor-name: --my-anchor;
}

/* 相对于锚点定位 */
.tooltip {
  position: absolute;
  position-anchor: --my-anchor;
  inset-area: top;  /* 定位到锚点上方 */
}
```

### 核心属性

| 属性 | 描述 |
|------|------|
| `anchor-name` | 定义锚点名称 |
| `position-anchor` | 引用锚点 |
| `position-area` / `inset-area` | 定位区域 |
| `anchor()` | 基于锚点的定位函数 |
| `anchor-size()` | 基于锚点尺寸的计算 |

## 定位语法

### 使用 inset-area

```css
/* 基本方位 */
.tooltip {
  position-anchor: --button;
  inset-area: top;        /* 锚点上方 */
  inset-area: bottom;     /* 锚点下方 */
  inset-area: left;       /* 锚点左侧 */
  inset-area: right;      /* 锚点右侧 */
}

/* 角落定位 */
.tooltip {
  inset-area: top left;   /* 左上 */
  inset-area: top right;  /* 右上 */
  inset-area: bottom left;  /* 左下 */
  inset-area: bottom right; /* 右下 */
}

/* 居中 */
.tooltip {
  inset-area: center;     /* 完全居中 */
  inset-area: top center; /* 顶部居中 */
}

/* span 关键字 */
.tooltip {
  inset-area: top span-all;  /* 横跨整个顶部 */
}
```

### 使用 anchor() 函数

```css
/* 基本用法 */
.tooltip {
  position-anchor: --button;
  left: anchor(right);    /* 左边缘对齐锚点右边缘 */
  top: anchor(bottom);    /* 顶部对齐锚点底部 */
}

/* 带偏移 */
.tooltip {
  left: anchor(right 10px);  /* 锚点右边缘 + 10px */
  top: anchor(bottom 10px);  /* 锚点底部 + 10px */
}

/* 居中对齐 */
.tooltip {
  left: anchor(center);
  top: anchor(bottom 10px);
  transform: translateX(-50%);
}

/* 使用 anchor-size */
.tooltip {
  width: anchor-size(width);     /* 与锚点同宽 */
  width: anchor-size(width 50%); /* 锚点宽度的 50% */
  min-width: anchor-size(width);
}
```

## 实战案例

### 工具提示

```html
<button class="btn" id="tip-btn">?</button>
<div class="tooltip" anchor="tip-btn">
  这是帮助信息
</div>
```

```css
.btn {
  anchor-name: --tip-btn;
}

.tooltip {
  position: absolute;
  position-anchor: --tip-btn;
  inset-area: top;
  
  background: #333;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  white-space: nowrap;
  
  /* 箭头 */
  &::before {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: #333;
  }
}
```

### 下拉菜单

```html
<div class="dropdown">
  <button class="dropdown-trigger">选项</button>
  <div class="dropdown-menu">
    <a href="#">选项 1</a>
    <a href="#">选项 2</a>
    <a href="#">选项 3</a>
  </div>
</div>
```

```css
.dropdown-trigger {
  anchor-name: --dropdown;
}

.dropdown-menu {
  position: absolute;
  position-anchor: --dropdown;
  inset-area: bottom span-right;
  
  min-width: anchor-size(width);
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
```

### 弹出确认框

```css
.confirm-popover {
  position: absolute;
  position-anchor: --trigger;
  inset-area: top;
  
  width: anchor-size(width 120%);
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}
```

### 右键菜单

```js
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  
  const menu = document.querySelector('.context-menu');
  menu.style.setProperty('--anchor-x', e.clientX + 'px');
  menu.style.setProperty('--anchor-y', e.clientY + 'px');
  menu.showPopover();
});
```

```css
.context-menu {
  position: absolute;
  left: var(--anchor-x);
  top: var(--anchor-y);
  
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.5rem 0;
  min-width: 150px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
```

## 与 Popover API 结合

```html
<button popovertarget="menu" class="menu-btn">
  打开菜单
</button>

<div popover id="menu" class="popover-menu">
  <a href="#">首页</a>
  <a href="#">关于</a>
  <a href="#">设置</a>
</div>
```

```css
.menu-btn {
  anchor-name: --menu-btn;
}

.popover-menu {
  position: absolute;
  position-anchor: --menu-btn;
  inset-area: bottom;
  
  margin: 0;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.popover-menu:popover-open {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
```

## 定位策略

### 自动翻转

```css
.tooltip {
  position-anchor: --button;
  inset-area: top;
  
  /* 当上方空间不足时，自动翻转到底部 */
  position-try-fallbacks: --bottom;
}

@position-try --bottom {
  inset-area: bottom;
}
```

### 多位置回退

```css
.tooltip {
  position-anchor: --button;
  inset-area: top;
  
  position-try-fallbacks: --bottom, --left, --right;
}

@position-try --bottom {
  inset-area: bottom;
}

@position-try --left {
  inset-area: left;
}

@position-try --right {
  inset-area: right;
}
```

### 自定义回退

```css
.tooltip {
  position-anchor: --button;
  left: anchor(right 10px);
  top: anchor(top);
  
  position-try-fallbacks: --custom-fallback;
}

@position-try --custom-fallback {
  left: anchor(left);
  top: anchor(bottom 10px);
}
```

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| Anchor Positioning | 125+ | 18.2+ | 实验性 | 125+ |
| position-try-fallbacks | 125+ | 18.2+ | 实验性 | 125+ |
| @position-try | 125+ | 18.2+ | 实验性 | 125+ |

## 渐进增强

```css
/* 基础样式 */
.tooltip {
  position: absolute;
  /* 回退定位 */
}

/* 支持锚点定位时 */
@supports (anchor-name: --test) {
  .tooltip {
    position-anchor: --button;
    inset-area: top;
  }
}

/* 不支持时的 JavaScript 回退 */
```

```js
if (!CSS.supports('anchor-name', '--test')) {
  // 使用 JS 计算位置
  function positionTooltip(tooltip, anchor) {
    const rect = anchor.getBoundingClientRect();
    tooltip.style.left = rect.left + 'px';
    tooltip.style.top = (rect.top - tooltip.offsetHeight) + 'px';
  }
}
```

## 奇淫技巧

### 技巧一：自动居中工具提示

```css
.tooltip {
  position-anchor: --button;
  left: anchor(center);
  top: anchor(bottom 8px);
  transform: translateX(-50%);
  
  /* 当空间不足时自动翻转 */
  position-try-fallbacks: --top-center;
}

@position-try --top-center {
  left: anchor(center);
  bottom: anchor(top 8px);
  top: auto;
  transform: translateX(-50%);
}
```

### 技巧二：等宽下拉菜单

```css
.dropdown-menu {
  position-anchor: --trigger;
  inset-area: bottom span-right;
  
  /* 与触发按钮同宽 */
  width: anchor-size(width);
  min-width: anchor-size(width);
}
```

### 技巧三：侧边栏吸附

```css
.sidebar {
  position: fixed;
  left: anchor(--main-content right);
  top: anchor(--header bottom);
  bottom: anchor(--footer top);
  
  width: 250px;
}
```

### 技巧四：多锚点定位

```css
/* 元素在两个锚点之间 */
.connector {
  position: absolute;
  left: anchor(--start right);
  right: anchor(--end left);
  top: anchor(--start center);
  height: 2px;
  background: #3498db;
}
```

### 技巧五：响应式面板

```css
.panel {
  position: absolute;
  position-anchor: --trigger;
  
  /* 默认在右侧 */
  inset-area: right;
  
  /* 空间不足时回退 */
  position-try-fallbacks: --left, --bottom, --top;
}

@position-try --left {
  inset-area: left;
}

@position-try --bottom {
  inset-area: bottom;
}

@position-try --top {
  inset-area: top;
}
```

## 总结

CSS 锚点定位是构建现代浮动 UI 的革命性特性：

1. **核心能力**：纯 CSS 实现元素间相对定位
2. **主要场景**：工具提示、下拉菜单、弹出框、右键菜单
3. **关键特性**：`inset-area`、`anchor()`、自动翻转回退
4. **与 Popover 结合**：创建完整的浮动 UI 系统
5. **兼容性**：Chrome 125+、Safari 18.2+，需要渐进增强

## 参考资源

- [MDN: CSS Anchor Positioning](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_anchor_positioning)
- [Chrome Developers: Anchor Positioning](https://developer.chrome.com/docs/css-ui/anchor-positioning-api)
- [CSS-Tricks: Anchor Positioning](https://css-tricks.com/css-anchor-positioning-guide/)
