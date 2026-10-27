---
title: CSS 玻璃拟态与新拟态
date: 2025-04-29
tags:
  - CSS
  - 前端
  - 视觉效果
categories:
  - 技术文档
  - 前端
  - CSS
  - 视觉表现
---

# CSS 玻璃拟态与新拟态

[[toc]]

玻璃拟态（Glassmorphism）和新拟态（Neumorphism）是两种流行的现代 UI 设计风格。本文介绍如何使用纯 CSS 实现这两种视觉效果。

---

## 玻璃拟态（Glassmorphism）

### 核心特征

- **半透明背景**：使用 `rgba` 或 `hsla` 颜色
- **背景模糊**：`backdrop-filter: blur()`
- **细微边框**：半透明白色边框增强玻璃感
- **多层阴影**：营造深度感

### 基础实现

```css
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);  /* Safari 兼容 */
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 
    0 4px 30px rgba(0, 0, 0, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.1);
}
```

### 深色玻璃

```css
.glass-dark {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### 渐变玻璃

```css
.glass-gradient {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.05)
  );
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}
```

### 动态背景上的玻璃卡片

```html
<div class="background">
  <div class="glass-card">
    <h2>Glass Card</h2>
    <p>Content goes here...</p>
  </div>
</div>
```

```css
.background {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96e6a1);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.glass-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 40px;
  width: 300px;
  color: white;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.1);
}
```

---

## 新拟态（Neumorphism）

### 核心特征

- **单色背景**：元素与背景使用相同或相近颜色
- **柔和阴影**：双向阴影营造凸起/凹陷效果
- **圆角**：大量使用圆角减少锐利感
- **极简配色**：通常只有一到两种主色

### 凸起效果

```css
.neumorphic-raised {
  background: #e0e5ec;
  border-radius: 20px;
  box-shadow:
    8px 8px 16px #a3b1c6,
    -8px -8px 16px #ffffff;
  padding: 20px;
}
```

### 凹陷效果

```css
.neumorphic-inset {
  background: #e0e5ec;
  border-radius: 20px;
  box-shadow:
    inset 8px 8px 16px #a3b1c6,
    inset -8px -8px 16px #ffffff;
  padding: 20px;
}
```

### 按钮状态

```css
.neu-button {
  background: #e0e5ec;
  border: none;
  border-radius: 12px;
  padding: 16px 32px;
  box-shadow:
    6px 6px 12px #a3b1c6,
    -6px -6px 12px #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.neu-button:hover {
  box-shadow:
    4px 4px 8px #a3b1c6,
    -4px -4px 8px #ffffff;
}

.neu-button:active {
  box-shadow:
    inset 4px 4px 8px #a3b1c6,
    inset -4px -4px 8px #ffffff;
}
```

### 圆形按钮

```css
.neu-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #e0e5ec;
  box-shadow:
    6px 6px 12px #a3b1c6,
    -6px -6px 12px #ffffff;
  display: flex;
  align-items: center;
    justify-content: center;
  border: none;
  cursor: pointer;
}

.neu-circle:active {
  box-shadow:
    inset 4px 4px 8px #a3b1c6,
    inset -4px -4px 8px #ffffff;
}
```

### 输入框

```css
.neu-input {
  background: #e0e5ec;
  border: none;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow:
    inset 4px 4px 8px #a3b1c6,
    inset -4px -4px 8px #ffffff;
  outline: none;
  width: 100%;
  color: #4a5568;
}

.neu-input:focus {
  box-shadow:
    inset 6px 6px 12px #a3b1c6,
    inset -6px -6px 12px #ffffff;
}
```

### 开关组件

```css
.neu-switch {
  position: relative;
  width: 60px;
  height: 30px;
  background: #e0e5ec;
  border-radius: 15px;
  box-shadow:
    inset 3px 3px 6px #a3b1c6,
    inset -3px -3px 6px #ffffff;
  cursor: pointer;
}

.neu-switch::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #e0e5ec;
  box-shadow:
    2px 2px 4px #a3b1c6,
    -2px -2px 4px #ffffff;
  transition: transform 0.3s ease;
}

.neu-switch.active::after {
  transform: translateX(30px);
}
```

---

## 深色主题新拟态

```css
.dark-neu {
  background: #2d3748;
  box-shadow:
    8px 8px 16px #1a202c,
    -8px -8px 16px #4a5568;
}

.dark-neu-inset {
  background: #2d3748;
  box-shadow:
    inset 8px 8px 16px #1a202c,
    inset -8px -8px 16px #4a5568;
}
```

---

## 玻璃 + 新拟态混合

```css
.hybrid-card {
  background: rgba(224, 229, 236, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow:
    8px 8px 16px rgba(163, 177, 198, 0.4),
    -8px -8px 16px rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.3);
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| backdrop-filter | 76+ | 9+ (前缀) | 103+ | 79+ |
| box-shadow | 所有版本 | 所有版本 | 所有版本 | 所有版本 |

---

## 奇淫技巧

### 技巧一：毛玻璃导航栏

```css
.glass-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  z-index: 1000;
}
```

### 技巧二：新拟态加载动画

```css
.neu-loader {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #e0e5ec;
  box-shadow:
    inset 4px 4px 8px #a3b1c6,
    inset -4px -4px 8px #ffffff,
    4px 4px 8px #a3b1c6,
    -4px -4px 8px #ffffff;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(0.95); }
}
```

### 技巧三：玻璃拟态工具提示

```css
.glass-tooltip {
  position: absolute;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  color: white;
  border-radius: 8px;
  font-size: 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s;
}

.trigger:hover .glass-tooltip {
  opacity: 1;
}
```

### 技巧四：新拟态进度条

```css
.neu-progress {
  width: 100%;
  height: 20px;
  background: #e0e5ec;
  border-radius: 10px;
  box-shadow:
    inset 3px 3px 6px #a3b1c6,
    inset -3px -3px 6px #ffffff;
  overflow: hidden;
}

.neu-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 10px;
  box-shadow:
    2px 0 4px rgba(102, 126, 234, 0.4);
}
```

### 技巧五：玻璃卡片悬停效果

```css
.glass-card {
  transition: transform 0.3s, box-shadow 0.3s;
}

.glass-card:hover {
  transform: translateY(-5px);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.2),
    inset 0 0 0 1px rgba(255, 255, 255, 0.2);
}
```

---

## 参考资料

- [Glassmorphism CSS Generator](https://hype4.academy/tools/glassmorphism-generator)
- [Neumorphism CSS Generator](https://neumorphism.io/)
- [MDN backdrop-filter](https://developer.mozilla.org/zh-CN/docs/Web/CSS/backdrop-filter)
