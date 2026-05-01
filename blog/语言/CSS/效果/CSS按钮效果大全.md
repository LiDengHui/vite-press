---
title: CSS 按钮效果大全
date: 2025-04-29
tags:
  - CSS
  - 效果
  - 实战
categories:
  - 技术文档
  - 前端
  - CSS
  - 效果实战
---

# CSS 按钮效果大全

[[toc]]

按钮是用户与系统交互的最基本入口。一个好按钮不仅要可点击，还应该能给予即时、温和的反馈。

---

## 1. 基础交互

### 经典状态变化

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  /* 默认状态 */
  background: #4a90d9;
  color: white;
}

.btn:hover {
  background: #357abd;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(74, 144, 217, 0.3);
}

.btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(74, 144, 217, 0.2);
}

.btn:focus-visible {
  outline: 2px solid #4a90d9;
  outline-offset: 2px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
```

### 多级尺寸

```css
.btn-sm  { padding: 0.5rem 1rem;   font-size: 0.875rem; }
.btn-md  { padding: 0.75rem 1.5rem; font-size: 1rem; }
.btn-lg  { padding: 1rem 2rem;      font-size: 1.125rem; }
.btn-xl  { padding: 1.25rem 2.5rem; font-size: 1.25rem; }
```

---

## 2. 变体风格

### 轮廓按钮

```css
.btn-outline {
  background: transparent;
  border: 2px solid currentColor;
  color: #4a90d9;
}

.btn-outline:hover {
  background: #4a90d9;
  color: white;
}
```

### 幽灵按钮

```css
.btn-ghost {
  background: transparent;
  color: #666;
}

.btn-ghost:hover {
  background: #f5f5f5;
  color: #333;
}
```

### 渐变按钮

```css
.btn-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.btn-gradient:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}
```

### 圆形按钮

```css
.btn-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  padding: 0;
  display: grid;
  place-items: center;
}
```

---

## 3. 动态效果

### 填充渐变

```css
.btn-fill-slide {
  position: relative;
  overflow: hidden;
  z-index: 1;
  background: white;
  border: 2px solid #4a90d9;
  color: #4a90d9;
}

.btn-fill-slide::before {
  content: '';
  position: absolute;
  inset: 0;
  background: #4a90d9;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
  z-index: -1;
}

.btn-fill-slide:hover {
  color: white;
}

.btn-fill-slide:hover::before {
  transform: scaleX(1);
  transform-origin: left;
}
```

### 圆形扩散

```css
.btn-ripple {
  position: relative;
  overflow: hidden;
}

.btn-ripple::after {
  content: '';
  position: absolute;
  top: var(--y, 50%);
  left: var(--x, 50%);
  width: 0;
  aspect-ratio: 1;
  background: rgba(255,255,255,0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.5s ease;
}

.btn-ripple:hover::after {
  width: 300%;
}
```

```js
document.querySelector('.btn-ripple').addEventListener('mousemove', (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--x', e.clientX - rect.left + 'px');
  e.currentTarget.style.setProperty('--y', e.clientY - rect.top + 'px');
});
```

### 磁性吸引

```css
.btn-magnetic {
  transition: transform 0.2s ease;
}

/* JS: 计算鼠标距离并设置 translate */
```

---

## 4. 图标按钮

### 图标滑入

```css
.btn-icon-slide {
  display: inline-flex;
  align-items: center;
  gap: 0;
  overflow: hidden;
}

.btn-icon-slide .icon {
  max-width: 0;
  opacity: 0;
  transition: all 0.3s ease;
}

.btn-icon-slide:hover .icon {
  max-width: 24px;
  opacity: 1;
  margin-left: 0.5rem;
}
```

### 旋转图标

```css
.btn-rotate-icon:hover .icon {
  transform: rotate(360deg);
  transition: transform 0.5s ease;
}
```

---

## 5. 微交互

### 加载状态

```css
.btn-loading {
  position: relative;
  color: transparent;
}

.btn-loading::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
```

### 成功状态

```css
.btn-success {
  transition: all 0.3s;
}

.btn-success.done {
  background: #2ecc71;
}

.btn-success.done::after {
  content: '✓';
  margin-left: 0.5rem;
}
```

---

## 奇淫技巧

### 技巧一：单文件多按钮组

```css
.btn-group {
  display: inline-flex;
  border-radius: 8px;
  overflow: hidden;
}

.btn-group .btn {
  border-radius: 0;
  border-right: 1px solid rgba(0,0,0,0.1);
}

.btn-group .btn:first-child { border-radius: 8px 0 0 8px; }
.btn-group .btn:last-child  { border-radius: 0 8px 8px 0; border-right: none; }
```

### 技巧二：无障碍聚焦环

```css
.btn:focus-visible {
  outline: 2px solid #4a90d9;
  outline-offset: 2px;
}

/* 移除默认 focus 轮廓，使用更好的方案 */
.btn:focus:not(:focus-visible) {
  outline: none;
}
```

### 技巧三：按钮微动画

```css
.btn-pulse {
  animation: btn-pulse 2s infinite;
}

@keyframes btn-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(74, 144, 217, 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(74, 144, 217, 0); }
}
```

### 技巧四：利用 CSS 变量控制按钮主题

```css
.btn-theme {
  --btn-bg: #4a90d9;
  --btn-hover: #357abd;
  --btn-text: white;

  background: var(--btn-bg);
  color: var(--btn-text);
}

.btn-theme:hover {
  background: var(--btn-hover);
}

/* 不同主题 */
.btn-danger {
  --btn-bg: #e74c3c;
  --btn-hover: #c0392b;
}

.btn-success {
  --btn-bg: #2ecc71;
  --btn-hover: #27ae60;
}
```

### 技巧五：点击波纹效果（无 JS）

```css
.btn-wave {
  position: relative;
  overflow: hidden;
}

.btn-wave::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255,255,255,0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn-wave:active::before {
  width: 300px;
  height: 300px;
}
```

---

## 参考资料

- [Button Design Patterns](https://www.nngroup.com/articles/button-design/)
- [CSS-Tricks: Button Styles](https://css-tricks.com/a-complete-guide-to-links-and-buttons/)
- [UIverse: Buttons](https://uiverse.io/buttons)
