---
title: CSS 溢出处理进阶
date: 2025-04-29
tags:
  - CSS
categories:
  - 技术文档
  - 前端
  - CSS
  - 基础入门
---

# CSS 溢出处理进阶

[[toc]]

`overflow` 控制元素内容超出容器时的行为。从简单的滚动条到现代的滚动吸附、弹性滚动，溢出处理是构建可用界面的核心技能。

---

## 基础溢出属性

### overflow 简写与拆分

```css
.scroll-box {
  overflow: auto;      /* 内容溢出时显示滚动条 */
}

.scroll-x {
  overflow-x: auto;    /* 仅水平滚动 */
  overflow-y: hidden;  /* 垂直方向隐藏 */
}

.scroll-y {
  overflow-x: hidden;
  overflow-y: auto;
}
```

| 值 | 效果 |
|----|------|
| `visible` | 默认，内容溢出可见 |
| `hidden` | 溢出内容裁剪 |
| `scroll` | 始终显示滚动条 |
| `auto` | 溢出时自动显示滚动条 |
| `clip` | 严格裁剪，无滚动（现代浏览器） |

---

## 文本溢出处理

### 单行省略

```css
.single-line {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

### 多行省略（-webkit-line-clamp）

```css
.multi-line {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

### 现代 line-clamp

```css
.modern-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* CSS Overflow Module Level 4 */
.future-clamp {
  line-clamp: 3;
}
```

### 自定义省略样式

```css
.custom-ellipsis {
  position: relative;
  max-height: 4.5em;  /* 3行高度 */
  overflow: hidden;
}

.custom-ellipsis::after {
  content: '... 阅读更多';
  position: absolute;
  bottom: 0;
  right: 0;
  background: white;
  padding-left: 2rem;
  background: linear-gradient(to right, transparent, white 2rem);
}
```

---

## 滚动行为控制

### 平滑滚动

```css
html {
  scroll-behavior: smooth;  /* 锚点跳转平滑滚动 */
}

/* 或 JS 触发 */
element.scrollIntoView({ behavior: 'smooth' });
```

### overscroll-behavior

```css
.modal {
  overflow-y: auto;
  overscroll-behavior: contain;  /* 滚动到边界时不触发父元素滚动 */
}

/* 完全禁用弹性滚动 */
.no-overscroll {
  overscroll-behavior: none;
}
```

| 值 | 效果 |
|----|------|
| `auto` | 默认，允许过度滚动 |
| `contain` | 阻止链式滚动，但保留弹性效果 |
| `none` | 完全禁止过度滚动 |

### scroll-margin / scroll-padding

```css
/* 锚点定位时预留空间 */
[id] {
  scroll-margin-top: 80px;  /* 为固定导航栏预留空间 */
}

html {
  scroll-padding-top: 80px;  /* 全局预留 */
}
```

---

## 滚动容器样式

### 自定义滚动条（Webkit）

```css
.custom-scroll::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.custom-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 角落 */
.custom-scroll::-webkit-scrollbar-corner {
  background: transparent;
}
```

### Firefox 滚动条

```css
.firefox-scroll {
  scrollbar-width: thin;        /* thin | none | auto */
  scrollbar-color: #c1c1c1 #f1f1f1;  /* thumb track */
}
```

---

## 滚动吸附

```css
.snap-container {
  overflow-x: auto;
  scroll-snap-type: x mandatory;  /* x 轴强制吸附 */
  display: flex;
  gap: 1rem;
}

.snap-item {
  flex: 0 0 100%;
  scroll-snap-align: start;  /* 吸附到元素起始位置 */
}

/* 更精细的控制 */
.snap-item-center {
  scroll-snap-align: center;
  scroll-snap-stop: always;  /* 不允许跳过 */
}
```

---

## 浏览器兼容性

| 属性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| overflow | 1+ | 1+ | 1+ | 12+ |
| text-overflow | 1+ | 1.3+ | 7+ | 12+ |
| -webkit-line-clamp | 6+ | 5+ | 68+ | 17+ |
| overscroll-behavior | 63+ | 16+ | 59+ | 79+ |
| scroll-margin | 69+ | 14.1+ | 68+ | 79+ |
| scroll-snap-type | 69+ | 11+ | 68+ | 79+ |
| scrollbar-color | 121+ | 无 | 64+ | 121+ |
| scrollbar-width | 121+ | 无 | 64+ | 121+ |

---

## 奇淫技巧

### 技巧一：跑马灯文字

```css
.marquee {
  white-space: nowrap;
  overflow: hidden;
}

.marquee span {
  display: inline-block;
  animation: marquee 10s linear infinite;
}

@keyframes marquee {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}
```

### 技巧二：溢出渐变遮罩

```css
.fade-overflow {
  position: relative;
  max-height: 200px;
  overflow: hidden;
}

.fade-overflow::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: linear-gradient(to bottom, transparent, white);
  pointer-events: none;
}
```

### 技巧三：横向滚动隐藏滚动条

```css
.hide-scrollbar {
  overflow-x: auto;
  scrollbar-width: none;  /* Firefox */
  -ms-overflow-style: none;  /* IE/Edge */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;  /* Webkit */
}
```

### 技巧四：双轴滚动锁定

```css
.two-axis {
  overflow: auto;
  overscroll-behavior: contain;
}

/* 锁定一个方向 */
.lock-y {
  overflow-y: hidden;
  overflow-x: auto;
}
```

### 技巧五：滚动驱动动画

```css
.scroll-reveal {
  animation: reveal linear;
  animation-timeline: view();
  animation-range: entry 0% cover 50%;
}

@keyframes reveal {
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

## 参考资料

- [MDN overflow](https://developer.mozilla.org/zh-CN/docs/Web/CSS/overflow)
- [MDN text-overflow](https://developer.mozilla.org/zh-CN/docs/Web/CSS/text-overflow)
- [CSS-Tricks: CSS Overflow](https://css-tricks.com/almanac/properties/o/overflow/)
