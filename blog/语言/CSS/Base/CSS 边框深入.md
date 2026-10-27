---
title: CSS 边框深入
date: 2025-04-29
tags:
  - CSS
  - 边框
  - 前端
categories:
  - 技术文档
  - 前端
  - CSS
  - 视觉表现
---

# CSS 边框深入

[[toc]]

边框是 UI 设计的基础元素。CSS 提供了从基础实线边框到复杂的渐变边框、裁剪路径边框等丰富能力，本文全面梳理。

---

## 基础边框

### 简写与拆分

```css
/* 四边统一 */
.border {
  border: 2px solid #3498db;
}

/* 分别设置 */
.separate {
  border-width: 1px 2px 3px 4px;   /* 上 右 下 左 */
  border-style: solid dashed dotted double;
  border-color: red green blue yellow;
}

/* 单边设置 */
.top-border {
  border-top: 3px solid #e74c3c;
}

.left-border {
  border-left: 4px solid #3498db;
}
```

### 边框样式

```css
.solid    { border-style: solid; }    /* 实线 */
.dashed   { border-style: dashed; }   /* 虚线 */
.dotted   { border-style: dotted; }   /* 点线 */
.double   { border-style: double; }   /* 双线 */
.groove   { border-style: groove; }   /* 3D 凹槽 */
.ridge    { border-style: ridge; }    /* 3D 凸槽 */
.inset    { border-style: inset; }    /* 3D 内嵌 */
.outset   { border-style: outset; }   /* 3D 外凸 */
.hidden   { border-style: hidden; }   /* 隐藏（占空间） */
.none     { border-style: none; }     /* 无 */
```

---

## 圆角边框

### border-radius

```css
/* 统一圆角 */
.rounded {
  border-radius: 8px;
}

/* 椭圆角 */
.ellipse {
  border-radius: 50%;
}

/* 分别设置 */
.complex {
  border-radius: 10px 20px 30px 40px / 40px 30px 20px 10px;
}

/* 单边圆角 */
.top-rounded {
  border-radius: 16px 16px 0 0;
}

/* 胶囊形状 */
.pill {
  border-radius: 9999px;
}
```

### 复杂形状

```css
/* 叶子形状 */
.leaf {
  border-radius: 0 50% 0 50%;
}

/* 对话气泡 */
.bubble {
  border-radius: 20px;
  border-bottom-left-radius: 0;
}

/* 超级椭圆 */
.superellipse {
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
}
```

---

## 高级边框技巧

### 渐变边框

```css
/* 方法 1: background + padding */
.gradient-border-1 {
  background: linear-gradient(white, white) padding-box,
              linear-gradient(45deg, #667eea, #764ba2) border-box;
  border: 3px solid transparent;
  border-radius: 12px;
}

/* 方法 2: 伪元素 */
.gradient-border-2 {
  position: relative;
  background: white;
  border-radius: 12px;
}

.gradient-border-2::before {
  content: '';
  position: absolute;
  inset: -3px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  border-radius: 15px;
  z-index: -1;
}

/* 方法 3: border-image */
.gradient-border-3 {
  border: 3px solid;
  border-image: linear-gradient(45deg, #667eea, #764ba2) 1;
}
```

### 动画边框

```css
.animated-border {
  position: relative;
  background: white;
  border-radius: 12px;
}

.animated-border::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3, #ff6b6b);
  background-size: 300% 100%;
  border-radius: 14px;
  z-index: -1;
  animation: border-flow 3s linear infinite;
}

@keyframes border-flow {
  to { background-position: 300% 0; }
}
```

### 虚线动画

```css
.dashed-animated {
  background: linear-gradient(90deg, #3498db 50%, transparent 50%);
  background-size: 20px 100%;
  padding: 2px;
  border-radius: 8px;
  animation: dash-move 1s linear infinite;
}

@keyframes dash-move {
  to { background-position: 20px 0; }
}
```

---

## outline 与 border

### 区别对比

| 特性 | border | outline |
|------|--------|---------|
| 占空间 | 是 | 否 |
| 圆角 | 支持 | 部分支持 |
| 可单独设置边 | 是 | 否 |
| z-index | 元素内部 | 元素上方 |

### outline 用法

```css
/* 基础 */
.focus-ring {
  outline: 2px solid #3498db;
  outline-offset: 2px;
}

/* 键盘聚焦 */
:focus-visible {
  outline: 2px solid #3498db;
  outline-offset: 2px;
}

/* 自定义轮廓 */
.custom-outline {
  outline: 3px dashed #e74c3c;
  outline-offset: 4px;
  border-radius: 8px;
}
```

---

## 裁剪路径边框

```css
/* 多边形边框 */
.polygon-border {
  clip-path: polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%);
  border: 3px solid #3498db;
}

/* 星形 */
.star-border {
  clip-path: polygon(
    50% 0%, 61% 35%, 98% 35%,
    68% 57%, 79% 91%, 50% 70%,
    21% 91%, 32% 57%, 2% 35%,
    39% 35%
  );
  border: 3px solid #e74c3c;
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| border-radius | 4+ | 3.1+ | 3+ | 12+ |
| outline-offset | 4+ | 3.1+ | 3.5+ | 12+ |
| border-image | 16+ | 6+ | 15+ | 12+ |
| :focus-visible | 86+ | 15.4+ | 85+ | 86+ |

---

## 奇淫技巧

### 技巧一：三角形箭头

```css
/* 纯 CSS 三角形 */
.arrow-up {
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #3498db;
}

.arrow-right {
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 10px solid #e74c3c;
}
```

### 技巧二：对话气泡

```css
.bubble {
  position: relative;
  background: #3498db;
  color: white;
  padding: 16px;
  border-radius: 12px;
}

.bubble::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 20px;
  border-width: 10px 10px 0;
  border-style: solid;
  border-color: #3498db transparent transparent;
}
```

### 技巧三：分割边框

```css
/* 中间有间隔的边框 */
.split-border {
  position: relative;
  padding: 20px;
}

.split-border::before,
.split-border::after {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 1px;
  background: linear-gradient(90deg, transparent, #ddd, transparent);
}

.split-border::before { top: 0; }
.split-border::after { bottom: 0; }
```

### 技巧四：角标边框

```css
.corner-badge {
  position: relative;
  border: 2px solid #3498db;
}

.corner-badge::before {
  content: 'NEW';
  position: absolute;
  top: -1px;
  right: -1px;
  background: #e74c3c;
  color: white;
  padding: 2px 8px;
  font-size: 12px;
  clip-path: polygon(0 0, 100% 0, 100% 100%);
}
```

### 技巧五：双层边框

```css
.double-layer {
  position: relative;
  border: 2px solid #3498db;
  padding: 4px;
}

.double-layer::after {
  content: '';
  position: absolute;
  inset: 2px;
  border: 1px dashed #e74c3c;
  pointer-events: none;
}
```

---

## 参考资料

- [MDN: border](https://developer.mozilla.org/zh-CN/docs/Web/CSS/border)
- [MDN: border-radius](https://developer.mozilla.org/zh-CN/docs/Web/CSS/border-radius)
- [CSS-Tricks: border-radius](https://css-tricks.com/almanac/properties/b/border-radius/)
