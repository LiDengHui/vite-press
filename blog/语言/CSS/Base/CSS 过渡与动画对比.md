---
title: CSS 过渡与动画对比
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

# CSS 过渡与动画对比

[[toc]]

CSS 过渡（Transition）和动画（Animation）都能实现视觉变化效果，但适用场景和实现方式有本质区别。本文深入对比两者的差异，帮助你在正确场景选择正确的工具。

---

## 核心区别

| 特性 | Transition | Animation |
|------|-----------|-----------|
| 触发方式 | 需要状态变化触发 | 自动播放或手动触发 |
| 控制粒度 | 起点 → 终点 | 多关键帧，任意节点 |
| 循环播放 | 不支持 | 支持 infinite |
| 方向控制 | 不支持 reverse | 支持 alternate、reverse |
| 事件回调 | transitionend | animationstart / end / iteration |
| 性能优化 | 简单 | 更灵活（will-change） |
| 代码复杂度 | 简单 | 较复杂 |

---

## 适用场景

### 选择 Transition

```css
/* 悬停效果 */
.btn {
  background: #3498db;
  transition: background 0.3s, transform 0.2s;
}

.btn:hover {
  background: #2980b9;
  transform: translateY(-2px);
}

/* 焦点状态 */
.input {
  border: 2px solid #ddd;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

/* 开关切换 */
.toggle {
  opacity: 0;
  transition: opacity 0.3s;
}

.toggle.active {
  opacity: 1;
}
```

**何时使用：**
- 响应用户交互（hover、focus、click）
- 简单的 A → B 状态变化
- 属性值变化的平滑过渡

### 选择 Animation

```css
/* 加载动画 */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  animation: spin 1s linear infinite;
}

/* 进入动画 */
@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.slide-in {
  animation: slide-in 0.5s ease-out;
}

/* 复杂路径动画 */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.bounce {
  animation: bounce 1s ease-in-out infinite;
}
```

**何时使用：**
- 页面加载时自动播放
- 需要多阶段复杂动画
- 循环播放效果
- 精确的时间控制

---

## 组合使用

### 进入 + 悬停

```css
.card {
  opacity: 0;
  transform: translateY(20px);
  animation: fade-in-up 0.6s ease forwards;
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(0) scale(1.02);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

@keyframes fade-in-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 交错动画

```css
.stagger-item {
  opacity: 0;
  animation: fade-in 0.5s ease forwards;
}

.stagger-item:nth-child(1) { animation-delay: 0s; }
.stagger-item:nth-child(2) { animation-delay: 0.1s; }
.stagger-item:nth-child(3) { animation-delay: 0.2s; }
.stagger-item:nth-child(4) { animation-delay: 0.3s; }

@keyframes fade-in {
  to { opacity: 1; }
}
```

---

## 性能对比

### GPU 加速

```css
/* Transition - 触发时添加 */
.animated {
  transition: transform 0.3s;
}

.animated:hover {
  transform: translateX(10px);
}

/* Animation - 提前声明 */
.animated {
  will-change: transform;
  animation: slide 1s;
}

/* 动画结束后移除 */
.animated.animation-complete {
  will-change: auto;
}
```

### 合成层

```css
/* 强制 GPU 合成 */
.gpu-layer {
  transform: translateZ(0);
  backface-visibility: hidden;
}
```

---

## 事件处理

### Transition 事件

```javascript
element.addEventListener('transitionend', (e) => {
  console.log('动画结束:', e.propertyName);
  element.classList.remove('animating');
});

element.addEventListener('transitionstart', (e) => {
  console.log('动画开始:', e.propertyName);
});
```

### Animation 事件

```javascript
element.addEventListener('animationstart', (e) => {
  console.log('动画开始:', e.animationName);
});

element.addEventListener('animationend', (e) => {
  console.log('动画结束:', e.animationName);
  element.classList.remove('animate-in');
});

element.addEventListener('animationiteration', (e) => {
  console.log('动画迭代:', e.elapsedTime);
});
```

---

## 最佳实践

### 1. 优先使用 transition

```css
/* ✅ 简单交互用 transition */
.btn {
  transition: all 0.3s;
}

/* ❌ 不需要用 animation */
.btn {
  animation: btn-hover 0.3s;  /* 过度设计 */
}
```

### 2. 动画类分离

```css
/* 定义动画 */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 触发类 */
.fade-in {
  animation: fade-in 0.5s ease forwards;
}

/* 通过 JS 添加/移除类 */
/* element.classList.add('fade-in'); */
```

### 3. 减少运动偏好

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

## 奇淫技巧

### 技巧一：纯 CSS 手风琴

```css
.accordion-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.accordion-item:has(input:checked) .accordion-content {
  max-height: 500px;
}
```

### 技巧二：过渡动画组合

```css
.combo {
  transition: transform 0.3s, opacity 0.2s 0.1s;
}

/* 悬停时先位移，后淡入其他元素 */
.combo:hover {
  transform: scale(1.05);
}

.combo:hover .extra {
  opacity: 1;
}
```

### 技巧三：动画暂停控制

```css
.progress-bar {
  animation: progress 2s linear paused;
  animation-delay: calc(var(--progress, 0) * -2s);
}

@keyframes progress {
  to { width: 100%; }
}
```

### 技巧四：无限滚动文字

```css
.marquee {
  overflow: hidden;
  white-space: nowrap;
}

.marquee span {
  display: inline-block;
  animation: marquee 10s linear infinite;
}

@keyframes marquee {
  from { transform: translateX(100%); }
  to { transform: translateX(-100%); }
}
```

### 技巧五：呼吸效果

```css
.breathe {
  animation: breathe 3s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
}
```

---

## 参考资料

- [MDN: transition](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transition)
- [MDN: animation](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation)
- [CSS-Tricks: transition vs animation](https://css-tricks.com/css-animations-vs-web-animations-api/)
