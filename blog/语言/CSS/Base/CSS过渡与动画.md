---
title: CSS 过渡与动画
date: 2025-04-29
tags:
  - CSS
  - 过渡
  - 动画
categories:
  - 技术文档
  - 前端
  - CSS
  - 交互与动画
---

# CSS 过渡与动画

CSS 过渡（Transition）和动画（Animation）让网页从静态变为动态，提升交互体验。

---

## 一、Transition 过渡

元素从一种样式平滑过渡到另一种样式。

### 基本语法

```css
.element {
    transition: property duration timing-function delay;
    /* 示例 */
    transition: all 0.3s ease-in-out;
    transition: transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
}
```

| 属性 | 说明 |
|------|------|
| `transition-property` | 哪些属性参与过渡（`all` 表示全部） |
| `transition-duration` | 持续时间，如 `0.3s`、`300ms` |
| `transition-timing-function` | 时间函数，控制速度曲线 |
| `transition-delay` | 延迟执行时间 |

### 时间函数

```css
linear      /* 匀速 */
ease        /* 快-慢-快（默认） */
ease-in     /* 慢开始 */
ease-out    /* 慢结束 */
ease-in-out /* 慢开始，慢结束 */

/* 贝塞尔曲线 */
cubic-bezier(0.68, -0.55, 0.27, 1.55) /* 弹性效果 */
```

[在线贝塞尔曲线工具](https://cubic-bezier.com)

### 多属性过渡

```css
.btn {
    transition:
        background-color 0.2s ease,
        transform 0.1s linear,
        box-shadow 0.3s ease-out;
}
```

### 可过渡的属性

```css
/* 可以过渡 */
opacity, transform, color, background-color, width, height,
top, left, margin, padding, border-radius, box-shadow, filter

/* 不能过渡 */
display, visibility, font-family, position, float
```

> ⚠️ **性能提示**：优先过渡 `transform` 和 `opacity`，它们会触发 GPU 合成，不引起重排/重绘。

---

## 二、Animation 动画

通过 `@keyframes` 定义关键帧，实现更复杂的动画。

### 基本语法

```css
@keyframes slideIn {
    from {
        transform: translateX(-100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.element {
    animation: slideIn 0.5s ease-out forwards;
}
```

### 关键帧进阶

```css
@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}
```

### 动画属性

```css
.element {
    animation-name: bounce;           /* 关键帧名称 */
    animation-duration: 1s;           /* 持续时间 */
    animation-timing-function: ease;  /* 时间函数 */
    animation-delay: 0.5s;            /* 延迟 */
    animation-iteration-count: 3;     /* 播放次数（infinite 无限） */
    animation-direction: alternate;   /* 播放方向：normal/reverse/alternate/alternate-reverse */
    animation-fill-mode: forwards;    /* 结束后状态：none/forwards/backwards/both */
    animation-play-state: paused;     /* 播放状态：running/paused */
}
```

### 简写

```css
animation: bounce 1s ease 0.5s 3 alternate forwards;
/* 名称 时长 函数 延迟 次数 方向 填充模式 */
```

---

## 三、Transition vs Animation 选择

| 场景 | 推荐 |
|------|------|
| 鼠标悬停效果 | Transition |
| 页面加载动画 | Animation |
| 无限循环效果 | Animation |
| 状态切换（如展开/收起）| Transition |
| 复杂路径动画 | Animation |
| 滚动触发动画 | Animation + JS |

---

## 四、奇淫技巧

### 技巧 1：硬件加速

```css
/* 让浏览器使用 GPU 渲染，更流畅 */
.smooth {
    transform: translateZ(0);
    will-change: transform;
}

/* 动画结束后移除 will-change 节省内存 */
.animated {
    will-change: transform, opacity;
    animation: fadeIn 0.3s ease;
}
.animated:hover {
    will-change: auto;
}
```

### 技巧 2：纯 CSS 打字机效果

```css
.typewriter {
    overflow: hidden;
    white-space: nowrap;
    border-right: 2px solid;
    animation: typing 3s steps(20) forwards, blink 0.75s step-end infinite;
}

@keyframes typing {
    from { width: 0; }
    to { width: 100%; }
}

@keyframes blink {
    50% { border-color: transparent; }
}
```

### 技巧 3：骨架屏 shimmer 效果

```css
.skeleton {
    background: linear-gradient(
        90deg,
        #f0f0f0 25%,
        #e0e0e0 50%,
        #f0f0f0 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}
```

### 技巧 4：弹性按钮点击

```css
.btn:active {
    transform: scale(0.95);
    transition: transform 0.1s;
}
```

### 技巧 5：交错动画（Stagger）

```css
/* 纯 CSS 实现交错 */
.list-item {
    opacity: 0;
    animation: fadeInUp 0.5s ease forwards;
}

.list-item:nth-child(1) { animation-delay: 0.1s; }
.list-item:nth-child(2) { animation-delay: 0.2s; }
.list-item:nth-child(3) { animation-delay: 0.3s; }
.list-item:nth-child(4) { animation-delay: 0.4s; }

/* 或者用 CSS 自定义属性 */
.list-item {
    animation-delay: calc(var(--index) * 0.1s);
}
```

### 技巧 6：呼吸灯

```css
.breathing {
    animation: breathe 3s ease-in-out infinite;
}

@keyframes breathe {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.05); }
}
```

### 技巧 7：平滑高度过渡（auto → 固定值）

```css
/* CSS 无法直接过渡 height: auto，用 grid-template-rows 曲线救国 */
.accordion-content {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.3s ease;
}
.accordion-content.open {
    grid-template-rows: 1fr;
}
.accordion-content > .inner {
    overflow: hidden;
}
```

### 技巧 8：文字渐变 + 流光

```css
.gradient-text {
    background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #ff6b6b);
    background-size: 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: flow 3s linear infinite;
}

@keyframes flow {
    0% { background-position: 0% center; }
    100% { background-position: 200% center; }
}
```

### 技巧 9：滚动视差（纯 CSS）

```css
.parallax {
    background-attachment: fixed;
    background-position: center;
    background-size: cover;
}
```

### 技巧 10：视图进入动画

```css
/* 元素进入视口时触发动画 */
.fade-in {
    animation: fadeInUp 0.6s ease forwards;
    animation-timeline: view();          /* CSS Scroll-driven Animations */
    animation-range: entry 0% cover 40%;
}
```

> 💡 **性能原则**：永远优先动画 `transform` 和 `opacity`。避免动画 `width`、`height`、`top`、`left`，它们会触发重排（Reflow）。
