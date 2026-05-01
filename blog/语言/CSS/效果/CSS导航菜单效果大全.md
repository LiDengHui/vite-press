---
title: CSS 导航菜单效果大全
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

# CSS 导航菜单效果大全

[[toc]]

导航是用户探索网站的地图。一个设计精良的导航不仅传递信息，还能塑造品牌认知。

---

## 1. 基础水平导航

### 简约下划线指示

```css
.nav-simple {
  display: flex;
  gap: 2rem;
}

.nav-simple a {
  position: relative;
  padding: 0.5rem 0;
  color: #333;
  text-decoration: none;
}

.nav-simple a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #4a90d9;
  transition: width 0.3s ease;
}

.nav-simple a:hover::after,
.nav-simple a.active::after {
  width: 100%;
}
```

### 药丸形切换

```css
.nav-pill {
  display: inline-flex;
  background: #f0f0f0;
  border-radius: 999px;
  padding: 0.25rem;
}

.nav-pill a {
  padding: 0.5rem 1.25rem;
  border-radius: 999px;
  transition: all 0.3s;
}

.nav-pill a:hover,
.nav-pill a.active {
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
```

---

## 2. 下拉菜单

### 纯 CSS 下拉

```css
.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 200px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);

  opacity: 0;
  transform: translateY(-10px);
  pointer-events: none;
  transition: all 0.2s ease;
}

.dropdown:hover .dropdown-menu,
.dropdown:focus-within .dropdown-menu {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.dropdown-menu a {
  display: block;
  padding: 0.75rem 1rem;
  transition: background 0.2s;
}

.dropdown-menu a:hover {
  background: #f5f5f5;
}
```

### 级联菜单

```css
.dropdown-cascade .submenu {
  position: absolute;
  top: 0;
  left: 100%;
  opacity: 0;
  transform: translateX(-10px);
  pointer-events: none;
  transition: all 0.2s;
}

.dropdown-cascade li:hover > .submenu {
  opacity: 1;
  transform: translateX(0);
  pointer-events: auto;
}
```

---

## 3. 汉堡菜单

### 三线变叉动画

```css
.hamburger {
  width: 24px;
  height: 20px;
  position: relative;
  cursor: pointer;
}

.hamburger span {
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  background: #333;
  transition: all 0.3s ease;
}

.hamburger span:nth-child(1) { top: 0; }
.hamburger span:nth-child(2) { top: 50%; transform: translateY(-50%); }
.hamburger span:nth-child(3) { bottom: 0; }

/* 激活状态 */
.hamburger.active span:nth-child(1) {
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  bottom: 50%;
  transform: translateY(50%) rotate(-45deg);
}
```

### 全屏菜单

```css
.fullscreen-menu {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.95);
  display: grid;
  place-items: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s;
}

.fullscreen-menu.open {
  opacity: 1;
  pointer-events: auto;
}

.fullscreen-menu a {
  color: white;
  font-size: 2rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.4s;
}

.fullscreen-menu.open a {
  opacity: 1;
  transform: translateY(0);
}

.fullscreen-menu.open a:nth-child(1) { transition-delay: 0.1s; }
.fullscreen-menu.open a:nth-child(2) { transition-delay: 0.15s; }
.fullscreen-menu.open a:nth-child(3) { transition-delay: 0.2s; }
.fullscreen-menu.open a:nth-child(4) { transition-delay: 0.25s; }
```

---

## 4. 侧边栏导航

### 抽屉式侧边栏

```css
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background: #1a1a2e;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

.sidebar.open {
  transform: translateX(0);
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
}

.sidebar.open ~ .sidebar-overlay {
  opacity: 1;
  pointer-events: auto;
}
```

### 图标+标签侧边栏

```css
.sidebar-icon {
  width: 72px;
  background: #0f0f0f;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0;
  gap: 0.5rem;
}

.sidebar-icon a {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  color: #666;
  transition: all 0.2s;
  position: relative;
}

.sidebar-icon a:hover,
.sidebar-icon a.active {
  background: rgba(255,255,255,0.1);
  color: white;
}

/* Tooltip */
.sidebar-icon a::after {
  content: attr(data-label);
  position: absolute;
  left: calc(100% + 12px);
  background: #333;
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
}

.sidebar-icon a:hover::after {
  opacity: 1;
}
```

---

## 5. 面包屑导航

### 箭头分隔符

```css
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.breadcrumb a {
  color: #666;
  text-decoration: none;
}

.breadcrumb a:hover {
  color: #4a90d9;
}

.breadcrumb a:not(:last-child)::after {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  border-top: 1px solid currentColor;
  border-right: 1px solid currentColor;
  transform: rotate(45deg);
  margin-left: 0.5rem;
}

.breadcrumb a:last-child {
  color: #333;
  font-weight: 500;
}
```

---

## 奇淫技巧

### 技巧一：纯 CSS 手风琴菜单

```css
.accordion details {
  border-bottom: 1px solid #eee;
}

.accordion summary {
  padding: 1rem;
  cursor: pointer;
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.accordion summary::after {
  content: '+';
  transition: transform 0.3s;
}

.accordion details[open] summary::after {
  transform: rotate(45deg);
}

.accordion details > div {
  padding: 0 1rem 1rem;
  animation: slide-down 0.3s ease;
}

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
}
```

### 技巧二：粘性导航滚动隐藏/显示

```css
.sticky-nav {
  position: sticky;
  top: 0;
  transition: transform 0.3s;
}

.sticky-nav.hidden {
  transform: translateY(-100%);
}
```

```js
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const current = window.pageYOffset;
  nav.classList.toggle('hidden', current > lastScroll && current > 100);
  lastScroll = current;
});
```

### 技巧三：滚动进度导航高亮

```css
/* 配合 Intersection Observer */
.nav-link {
  position: relative;
}

.nav-link.active {
  color: #4a90d9;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #4a90d9;
}
```

### 技巧四：磁性导航项

```css
.magnetic-nav a {
  display: inline-block;
  transition: transform 0.2s ease;
}

/* JS 计算鼠标距离 */
.magnetic-nav a:hover {
  transform: translate(var(--dx, 0), var(--dy, 0));
}
```

### 技巧五：视差导航背景

```css
.nav-parallax {
  position: relative;
  overflow: hidden;
}

.nav-parallax::before {
  content: '';
  position: absolute;
  inset: -20%;
  background: url('pattern.svg');
  opacity: 0.1;
  transition: transform 0.3s;
}

.nav-parallax:hover::before {
  transform: translateY(-10px);
}
```

---

## 参考资料

- [Navigation Patterns](https://www.nngroup.com/articles/keyboard-accessibility/)
- [CSS-Tricks: Navigation](https://css-tricks.com/snippets/css/navigation/)
- [Accessible Mega Menu](https://www.w3.org/WAI/tutorials/menus/)
