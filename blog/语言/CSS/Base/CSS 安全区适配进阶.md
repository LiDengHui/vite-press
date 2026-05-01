---
title: CSS 安全区适配进阶
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

# CSS 安全区适配进阶

[[toc]]

刘海屏、灵动岛、圆角屏等现代设备形态，要求网页内容避开系统 UI 区域（如状态栏、Home 指示条）。CSS 安全区（Safe Area）机制让网页能自适应这些特殊区域。

---

## 安全区环境变量

### env() 与 constant()

```css
.safe-area {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

| 环境变量 | 说明 |
|---------|------|
| `safe-area-inset-top` | 顶部安全区高度（状态栏） |
| `safe-area-inset-bottom` | 底部安全区高度（Home 指示条） |
| `safe-area-inset-left` | 左侧安全区宽度 |
| `safe-area-inset-right` | 右侧安全区宽度 |

> `constant()` 是 iOS 11.0-11.2 的语法，现代浏览器统一使用 `env()`。

### 完整适配代码

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

---

## viewport-fit

### cover 模式

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

| 值 | 效果 |
|----|------|
| `auto` | 默认，网页限制在安全区内 |
| `cover` | 网页扩展至整个屏幕，需手动处理安全区 |

### 配合 cover 使用

```css
/* 使用 cover 后，安全区变量才有非零值 */
.fullscreen-page {
  position: fixed;
  inset: 0;
  padding: env(safe-area-inset-top) env(safe-area-inset-right)
           env(safe-area-inset-bottom) env(safe-area-inset-left);
}
```

---

## 底部固定栏适配

### 安全区底部固定

```css
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding-bottom: calc(1rem + env(safe-area-inset-bottom));
  background: white;
}
```

### 底部内容区域

```css
.main-content {
  padding-bottom: calc(60px + env(safe-area-inset-bottom));
  /* 60px 是底部栏高度，加上安全区 */
}
```

---

## 横屏安全区

### 横屏游戏/视频界面

```css
.landscape-game {
  position: fixed;
  inset: 0;
  padding:
    env(safe-area-inset-top)
    env(safe-area-inset-right)
    env(safe-area-inset-bottom)
    env(safe-area-inset-left);
}

/* 控制按钮避开刘海 */
.game-controls {
  padding-left: max(1rem, env(safe-area-inset-left));
  padding-right: max(1rem, env(safe-area-inset-right));
}
```

---

## 与 max() 配合

### 最小内边距

```css
.safe-header {
  padding-top: max(1rem, env(safe-area-inset-top));
}

.safe-footer {
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
}
```

### 底部按钮安全距离

```css
.fab-button {
  position: fixed;
  right: max(1rem, env(safe-area-inset-right));
  bottom: max(1rem, env(safe-area-inset-bottom));
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| env() | 69+ | 11.1+ | 65+ | 79+ |
| viewport-fit | 69+ | 11.1+ | 65+ | 79+ |
| max() | 79+ | 11.1+ | 75+ | 79+ |

---

## 奇淫技巧

### 技巧一：CSS 变量降级

```css
:root {
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
}

/* 旧浏览器回退 */
.header {
  padding-top: 20px;
  padding-top: var(--safe-top, 20px);
}
```

### 技巧二：全屏视频/图片

```css
.fullscreen-media {
  position: fixed;
  inset: 0;
  object-fit: cover;
  width: 100vw;
  height: 100vh;
}

/* 控制栏在安全区内 */
.media-controls {
  position: absolute;
  bottom: env(safe-area-inset-bottom);
  left: env(safe-area-inset-left);
  right: env(safe-area-inset-right);
}
```

### 技巧三：横屏方向检测

```css
@media (orientation: landscape) {
  .safe-layout {
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
  }
}
```

### 技巧四：底部提示条适配

```css
.toast {
  position: fixed;
  bottom: calc(1rem + env(safe-area-inset-bottom));
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
}
```

### 技巧五：安全区背景延伸

```css
.app-shell {
  background: linear-gradient(
    to bottom,
    var(--brand-color) env(safe-area-inset-top),
    white env(safe-area-inset-top)
  );
}
```

---

## 参考资料

- [MDN env()](https://developer.mozilla.org/zh-CN/docs/Web/CSS/env)
- [Apple: Designing Websites for iPhone X](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)
- [CSS-Tricks: The Notch and CSS](https://css-tricks.com/the-notch-and-css/)
