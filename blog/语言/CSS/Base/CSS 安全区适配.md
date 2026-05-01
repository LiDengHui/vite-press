---
title: CSS 安全区适配
date: 2025-04-29
tags:
  - CSS
  - 安全区
  - 移动端
categories:
  - 技术文档
  - 前端
  - CSS
  - 基础入门
---

# CSS 安全区适配

移动设备的刘海、前置剪辑区、刘海屏等特殊屏幕需要特殊的适配处理，CSS `env()` 函数提供了原生支持。

---

## 一、基础概念

### 安全区变量

```css
/* 顶部安全区 */
padding-top: env(safe-area-inset-top);

/* 底部安全区 */
padding-bottom: env(safe-area-inset-bottom);

/* 左侧安全区 */
padding-left: env(safe-area-inset-left);

/* 右侧安全区 */
padding-right: env(safe-area-inset-right);
```

### viewport-fit

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

| 值 | 说明 |
|----|------|
| `auto` | 默认，内容不会延伸到剪辑区 |
| `cover` | 内容延伸到整个屏幕，需配合 safe-area |

---

## 二、实战适配

### 基础模板

```css
/* 基础布局 */
.page {
    min-height: 100vh;
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
}

/* 底部导航栏 */
.bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding-bottom: env(safe-area-inset-bottom);
    background: #fff;
}

/* 顶部导航栏 */
.top-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding-top: env(safe-area-inset-top);
    background: #fff;
}
```

---

## 奇淫技巧

### 技巧 1：自动适配的安全区 mix

```css
:root {
    --safe-top: env(safe-area-inset-top, 0px);
    --safe-bottom: env(safe-area-inset-bottom, 0px);
    --safe-left: env(safe-area-inset-left, 0px);
    --safe-right: env(safe-area-inset-right, 0px);
}

.page {
    padding: var(--safe-top) var(--safe-right) var(--safe-bottom) var(--safe-left);
}
```

### 技巧 2：底部按钮组适配

```css
.action-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
    background: #fff;
    box-shadow: 0 -2px 8px rgba(0,0,0,0.05);
}
```

### 技巧 3：横屏模式

```css
@media screen and (orientation: landscape) {
    .page {
        padding-left: env(safe-area-inset-left);
        padding-right: env(safe-area-inset-right);
    }
}
```

### 技巧 4：底部悬浮按钮适配

```css
.fab {
    position: fixed;
    right: 16px;
    bottom: calc(16px + env(safe-area-inset-bottom));
}
```

### 技巧 5：全屏模态框适配

```css
.modal {
    position: fixed;
    inset: 0;
    padding: env(safe-area-inset-top) env(safe-area-inset-right)
             env(safe-area-inset-bottom) env(safe-area-inset-left);
    background: rgba(0,0,0,0.5);
}
```

### 技巧 6：刘海屏适配

```css
/* 刘海屏设备需要更大的安全区 */
@supports (padding: max(0px)) {
    .safe-area {
        padding-top: max(12px, env(safe-area-inset-top));
        padding-bottom: max(12px, env(safe-area-inset-bottom));
    }
}
```

### 技巧 7：自定义属性接口

```css
.app {
    --app-safe-top: env(safe-area-inset-top, 0px);
    --app-safe-bottom: env(safe-area-inset-bottom, 0px);
}

.header {
    height: calc(44px + var(--app-safe-top));
    padding-top: var(--app-safe-top);
}
```

### 技巧 8：打孔屏适配

```css
/* 打孔屏设备 */
@supports (padding: env(safe-area-inset-top)) {
    .notch-device {
        padding-top: env(safe-area-inset-top);
    }
}
```

### 技巧 9：底部导航栏高度计算

```css
:root {
    --nav-height: 56px;
    --safe-bottom: env(safe-area-inset-bottom, 0px);
}

.bottom-nav {
    height: calc(var(--nav-height) + var(--safe-bottom));
    padding-bottom: var(--safe-bottom);
}

/* 内容区留出导航栏高度 */
.main-content {
    padding-bottom: calc(var(--nav-height) + var(--safe-bottom) + 16px);
}
```

### 技巧 10：横屏模式下的特殊处理

```css
@media screen and (orientation: landscape) {
    .page {
        padding-left: env(safe-area-inset-left);
        padding-right: env(safe-area-inset-right);
    }
    /* iPhone 刘海屏横屏时，左右会有安全区 */
}
```

> 💡 **适配口诀**：viewport 加 cover，安全区用 env，底部留 padding，横屏单独处理，打孔屏加 max。
