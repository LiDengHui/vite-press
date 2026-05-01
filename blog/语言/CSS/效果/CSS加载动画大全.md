---
title: CSS 加载动画大全
date: 2025-04-29
tags:
  - CSS
  - 效果
  - 动画
  - 实战
categories:
  - 技术文档
  - 前端
  - CSS
  - 效果实战
---

# CSS 加载动画大全

[[toc]]

加载动画是用户体验的关键细节。纯 CSS 实现不仅性能更好，还能避免 JS 阻塞导致的卡顿。

---

## 1. 经典旋转器（Spinner）

### 基础环形

```css
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e0e0e0;
  border-top-color: #4a90d9;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### 双环反向

```css
.spinner-double {
  width: 40px;
  height: 40px;
  border: 3px solid transparent;
  border-top-color: #4a90d9;
  border-bottom-color: #4a90d9;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
```

### 渐隐圆点环

```css
.spinner-dots {
  width: 40px;
  height: 40px;
  position: relative;
}

.spinner-dots::before,
.spinner-dots::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #4a90d9;
}

.spinner-dots::before {
  animation: spin 1s linear infinite;
}

.spinner-dots::after {
  animation: spin 1.5s linear infinite reverse;
}
```

---

## 2. 弹跳圆点（Bouncing Dots）

### 三点弹跳

```css
.bouncing-dots {
  display: flex;
  gap: 6px;
}

.bouncing-dots span {
  width: 10px;
  height: 10px;
  background: #4a90d9;
  border-radius: 50%;
  animation: bounce 0.6s ease-in-out infinite alternate;
}

.bouncing-dots span:nth-child(2) { animation-delay: 0.15s; }
.bouncing-dots span:nth-child(3) { animation-delay: 0.3s; }

@keyframes bounce {
  from { transform: translateY(0); }
  to { transform: translateY(-12px); }
}
```

### 波浪式弹跳

```css
.wave-dots {
  display: flex;
  gap: 4px;
}

.wave-dots span {
  width: 6px;
  height: 20px;
  background: #4a90d9;
  border-radius: 3px;
  animation: wave 0.6s ease-in-out infinite alternate;
}

.wave-dots span:nth-child(1) { animation-delay: 0s; }
.wave-dots span:nth-child(2) { animation-delay: 0.1s; }
.wave-dots span:nth-child(3) { animation-delay: 0.2s; }
.wave-dots span:nth-child(4) { animation-delay: 0.3s; }
.wave-dots span:nth-child(5) { animation-delay: 0.4s; }

@keyframes wave {
  from { transform: scaleY(0.3); opacity: 0.3; }
  to { transform: scaleY(1); opacity: 1; }
}
```

---

## 3. 骨架屏（Skeleton）

### 基础 shimmer 效果

```css
.skeleton {
  background: #f0f0f0;
  position: relative;
  overflow: hidden;
}

.skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255,255,255,0.5),
    transparent
  );
  transform: translateX(-100%);
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  100% { transform: translateX(100%); }
}
```

### 骨架屏布局

```html
<div class="skeleton-card">
  <div class="skeleton avatar"></div>
  <div class="skeleton title"></div>
  <div class="skeleton line"></div>
  <div class="skeleton line short"></div>
</div>
```

```css
.skeleton-card {
  padding: 1rem;
}

.skeleton-card .skeleton {
  border-radius: 4px;
  margin-bottom: 0.75rem;
}

.skeleton-card .avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.skeleton-card .title {
  width: 60%;
  height: 16px;
}

.skeleton-card .line {
  width: 100%;
  height: 12px;
}

.skeleton-card .line.short {
  width: 40%;
}
```

---

## 4. 脉冲效果

### 同心圆脉冲

```css
.pulse-ring {
  width: 40px;
  height: 40px;
  position: relative;
}

.pulse-ring::before,
.pulse-ring::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: #4a90d9;
  animation: pulse-ring 1.5s ease-out infinite;
}

.pulse-ring::after {
  animation-delay: 0.75s;
}

@keyframes pulse-ring {
  0% { transform: scale(0.5); opacity: 1; }
  100% { transform: scale(1.5); opacity: 0; }
}
```

---

## 5. 进度指示器

### 渐变进度条

```css
.progress-bar {
  width: 100%;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar::after {
  content: '';
  display: block;
  height: 100%;
  width: 30%;
  background: linear-gradient(90deg, #4a90d9, #2ecc71);
  border-radius: 2px;
  animation: progress-slide 1.5s ease-in-out infinite;
}

@keyframes progress-slide {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(350%); }
}
```

### 不确定进度（Indeterminate）

```css
.progress-indeterminate {
  width: 100%;
  height: 3px;
  background: #e0e0e0;
  position: relative;
  overflow: hidden;
}

.progress-indeterminate::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  height: 100%;
  width: 50%;
  background: #4a90d9;
  animation: indeterminate 1.5s ease-in-out infinite;
}

@keyframes indeterminate {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
  100% { transform: translateX(200%); }
}
```

---

## 6. 文字加载

### 逐字闪烁

```css
.loading-text {
  font-family: monospace;
}

.loading-text span {
  animation: blink 1s ease-in-out infinite;
}

.loading-text span:nth-child(1) { animation-delay: 0s; }
.loading-text span:nth-child(2) { animation-delay: 0.1s; }
.loading-text span:nth-child(3) { animation-delay: 0.2s; }
.loading-text span:nth-child(4) { animation-delay: 0.3s; }
.loading-text span:nth-child(5) { animation-delay: 0.4s; }
.loading-text span:nth-child(6) { animation-delay: 0.5s; }
.loading-text span:nth-child(7) { animation-delay: 0.6s; }

@keyframes blink {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}
```

### 省略号动画

```css
.loading-dots::after {
  content: '';
  animation: ellipsis 1.5s steps(4) infinite;
}

@keyframes ellipsis {
  0% { content: ''; }
  25% { content: '.'; }
  50% { content: '..'; }
  75% { content: '...'; }
}
```

---

## 奇淫技巧

### 技巧一：减少重绘的 spinner

```css
/* 使用 will-change 优化 GPU 加速 */
.optimized-spinner {
  will-change: transform;
  transform: translateZ(0); /* 强制 GPU 层 */
}
```

### 技巧二： prefers-reduced-motion 适配

```css
@media (prefers-reduced-motion: reduce) {
  .spinner,
  .bouncing-dots span,
  .skeleton::after {
    animation-duration: 0.01ms !important;
  }
}
```

### 技巧三：利用 currentColor 适配主题

```css
.theme-spinner {
  border-color: currentColor;
  border-top-color: transparent;
  opacity: 0.3;
}

/* 父元素设置颜色即可 */
.dark .theme-spinner { color: white; }
.light .theme-spinner { color: #333; }
```

### 技巧四：单元素多重 spinner

```css
/* 一个 div 实现双环 spinner */
.dual-spinner {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid #e0e0e0;
  border-top-color: #4a90d9;
  animation: spin 1s linear infinite;
  position: relative;
}

.dual-spinner::before {
  content: '';
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 3px solid transparent;
  border-bottom-color: #2ecc71;
  animation: spin 1.5s linear infinite reverse;
}
```

### 技巧五：利用 conic-gradient 实现无动画 loading

```css
/* 不需要 animation 的静态 loading 指示 */
.static-spinner {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    #4a90d9 0%,
    transparent 60%
  );
  /* 配合少量旋转即可 */
  animation: spin 1s linear infinite;
}
```

---

## 参考资料

- [CSS-Tricks: Single Element Loaders](https://css-tricks.com/single-element-loaders/)
- [Loaders.css](https://github.com/ConnorAtherton/loaders.css)
- [CSS Loader Generator](https://loading.io/css/)
