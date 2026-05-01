---
title: CSS 过渡与动画基础
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

# CSS 过渡与动画基础

[[toc]]

CSS 提供了两种创建动态效果的方式：**过渡（Transition）** 在状态变化时平滑插值，**动画（Animation）** 则支持复杂的关键帧序列。理解两者的适用场景和性能特征，是构建流畅交互的基础。

---

## 过渡 Transition

### 基础语法

```css
.button {
  background: #007bff;
  transition: background 0.3s ease;
}

.button:hover {
  background: #0056b3;
}
```

### 过渡属性

| 属性 | 说明 | 示例 |
|------|------|------|
| `transition-property` | 指定过渡的 CSS 属性 | `all`, `transform`, `opacity` |
| `transition-duration` | 过渡持续时间 | `0.3s`, `500ms` |
| `transition-timing-function` | 时间函数 | `ease`, `linear`, `cubic-bezier()` |
| `transition-delay` | 延迟开始时间 | `0.2s` |

### 简写

```css
/* 顺序：property duration timing-function delay */
.box {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.1s,
              opacity 0.2s ease;
}
```

### 可过渡的属性

```css
/* 可以平滑过渡 */
opacity, transform, color, background-color, width, height,
margin, padding, border-color, box-shadow, filter

/* 不能平滑过渡（会跳变） */
display, visibility, font-family, position, float
```

### 时间函数

```css
/* 预设值 */
.linear     { transition-timing-function: linear; }
.ease       { transition-timing-function: ease; }       /* 默认 */
.ease-in    { transition-timing-function: ease-in; }
.ease-out   { transition-timing-function: ease-out; }
.ease-in-out { transition-timing-function: ease-in-out; }

/* 自定义贝塞尔曲线 */
.custom {
  transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  /* 弹性效果 */
}
```

### 多个属性过渡

```css
.card {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    background-color 0.2s linear;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
  background-color: #f8f9fa;
}
```

---

## 动画 Animation

### @keyframes 定义

```css
@keyframes slide-in {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}
```

### 应用动画

```css
.element {
  animation: slide-in 0.5s ease-out forwards;
}
```

### 动画属性

| 属性 | 说明 | 示例 |
|------|------|------|
| `animation-name` | 关键帧名称 | `slide-in` |
| `animation-duration` | 持续时间 | `1s` |
| `animation-timing-function` | 时间函数 | `ease-in-out` |
| `animation-delay` | 延迟 | `0.5s` |
| `animation-iteration-count` | 播放次数 | `1`, `3`, `infinite` |
| `animation-direction` | 播放方向 | `normal`, `reverse`, `alternate` |
| `animation-fill-mode` | 结束状态 | `forwards`, `backwards`, `both` |
| `animation-play-state` | 播放状态 | `running`, `paused` |

### 简写

```css
/* 顺序：name duration timing-function delay iteration-count direction fill-mode */
.spinner {
  animation: rotate 1s linear infinite;
}

.pulse {
  animation: pulse 2s ease-in-out 0.5s 3 alternate both;
}
```

### animation-fill-mode

```css
/* forwards: 保持最后一帧 */
.fade-in {
  animation: fadeIn 0.5s forwards;
}

/* backwards: 应用第一帧 */
.fade-out {
  animation: fadeOut 0.5s backwards;
}

/* both: 同时应用 forwards 和 backwards */
.slide {
  animation: slideIn 0.5s both;
}
```

---

## 过渡 vs 动画

| 特性 | Transition | Animation |
|------|-----------|-----------|
| 触发方式 | 状态变化（hover、focus 等） | 自动播放或 JS 控制 |
| 复杂度 | 开始态 → 结束态 | 多关键帧序列 |
| 循环 | 不支持 | 支持 infinite |
| 方向 | 双向自动 | 可控制 direction |
| 性能 | 通常更好 | 取决于复杂度 |
| 适用 | 简单交互反馈 | 复杂动态效果 |

---

## 性能优化

### 推荐动画属性

```css
/* GPU 加速，性能最好 */
.gpu-optimized {
  transform: translateX(100px);
  opacity: 0.5;
  filter: blur(5px);
}

/* 触发重排，性能较差 */
.expensive {
  width: 200px;
  height: 200px;
  top: 100px;
  left: 100px;
}
```

### will-change 提示

```css
.animated {
  will-change: transform, opacity;
  transition: transform 0.3s;
}

/* 动画结束后移除 */
.animated:not(:hover) {
  will-change: auto;
}
```

### 减少动画偏好

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| transition | 26+ | 6.1+ | 16+ | 12+ |
| animation | 43+ | 9+ | 16+ | 12+ |
| @keyframes | 43+ | 9+ | 16+ | 12+ |
| transition-behavior | 117+ | 18+ | 128+ | 117+ |

---

## 奇淫技巧

### 技巧一：纯 CSS 手风琴

```css
.accordion-content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s;
}

.accordion-content > div {
  overflow: hidden;
}

.accordion-item:hover .accordion-content {
  grid-template-rows: 1fr;
}
```

### 技巧二：打字机效果

```css
.typewriter {
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid;
  animation: typing 3s steps(40), blink 0.75s step-end infinite;
}

@keyframes typing {
  from { width: 0; }
  to { width: 100%; }
}

@keyframes blink {
  50% { border-color: transparent; }
}
```

### 技巧三：呼吸灯效果

```css
.breathe {
  animation: breathe 3s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% { opacity: 0.4; transform: scale(0.95); }
  50% { opacity: 1; transform: scale(1.05); }
}
```

### 技巧四：悬停延迟触发

```css
/* 鼠标移入立即触发，移出延迟 0.5s */
.dropdown {
  opacity: 0;
  transition: opacity 0.3s;
}

.trigger:hover .dropdown {
  opacity: 1;
  transition: opacity 0.1s;
}

.trigger:not(:hover) .dropdown {
  transition-delay: 0.5s;
}
```

### 技巧五：滚动触发显示

```css
.fade-up {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s, transform 0.6s;
}

.fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}

/* JS 在滚动到视口时添加 visible 类 */
```

---

## 参考资料

- [MDN transition](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transition)
- [MDN animation](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation)
- [MDN @keyframes](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@keyframes)
- [web.dev: Animations](https://web.dev/animations/)
