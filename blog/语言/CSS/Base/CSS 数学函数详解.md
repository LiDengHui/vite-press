---
title: CSS 数学函数详解
date: 2025-04-29
tags:
  - CSS
  - 函数
categories:
  - 技术文档
  - 前端
  - CSS
  - 视觉表现
---

# CSS 数学函数详解

[[toc]]

CSS 数学函数允许在样式值中进行动态计算，是构建现代响应式布局、流体排版和自适应间距系统的核心工具。

---

## calc()

在任意长度、百分比、时间、角度等数值间进行计算。

### 基础用法

```css
.sidebar {
  width: calc(100% - 250px);
}

/* 混合单位 */
.container {
  padding: calc(1rem + 2vw);
}
```

### 复杂计算

```css
/* 嵌套 calc */
.element {
  width: calc(100% / 3 - calc(1rem * 2));
}

/* 结合 CSS 变量 */
:root {
  --gap: 16px;
}

.grid-item {
  width: calc((100% - var(--gap) * 3) / 4);
}
```

### 运算规则

```css
/* 加法/减法：两侧单位可不同 */
width: calc(100% - 20px);

/* 乘法：至少一侧为纯数字 */
width: calc(100% * 2);      /* ✓ */
width: calc(100% * 1px);    /* ✗ */

/* 除法：除数必须为纯数字 */
width: calc(100% / 3);      /* ✓ */
width: calc(100px / 1rem);  /* ✗ */
```

---

## min() 与 max()

从多个值中选择最小或最大值。

### min()

```css
/* 宽度最大不超过 500px */
.responsive {
  width: min(100%, 500px);
}

/* 流体排版：字体在 16px 和 5vw 之间取较小值 */
.fluid-text {
  font-size: min(5vw, 24px);
}

/* 多值比较 */
.box {
  width: min(100%, 800px, 90vw);
}
```

### max()

```css
/* 宽度至少 300px */
.responsive {
  width: max(50%, 300px);
}

/* 字体最小不小于 16px */
.accessible-text {
  font-size: max(16px, 2vw);
}
```

### 组合使用

```css
/* 宽度在 300px 到 800px 之间 */
.clamped {
  width: max(300px, min(800px, 100%));
}
```

---

## clamp()

设置一个区间值：最小值、首选值、最大值。

### 语法

```css
clamp(最小值, 首选值, 最大值)
```

### 流体排版

```css
/* 字体大小在 16px 到 32px 之间平滑过渡 */
.fluid-heading {
  font-size: clamp(1.5rem, 4vw + 1rem, 3rem);
}
```

### 响应式间距

```css
.section {
  padding: clamp(1rem, 5vw, 3rem);
}
```

### 响应式布局

```css
.container {
  width: clamp(320px, 90%, 1200px);
  margin: 0 auto;
}
```

### 典型计算模式

```css
/* 基于视口宽度的流体计算 */
/* clamp(最小值, 斜率 * 100vw + 偏移量, 最大值) */

/* 在 320px 屏幕为 1rem，在 1920px 屏幕为 2rem */
:root {
  --fluid: clamp(1rem, 0.625rem + 1.5625vw, 2rem);
}

/* 计算公式推导：
   斜率 = (最大值 - 最小值) / (最大视口 - 最小视口)
        = (32 - 16) / (1920 - 320) = 16 / 1600 = 0.01
   偏移量 = 最小值 - 斜率 * 最小视口
          = 16 - 0.01 * 320 = 12.8px = 0.8rem
   最终结果：clamp(1rem, 0.8rem + 1vw, 2rem)
*/
```

---

## round()

将数值舍入到指定精度。

```css
/* 舍入到最接近的整数 */
width: round(33.7px, 1px);    /* 34px */

/* 向下取整 */
width: round(down, 33.7px, 1px);  /* 33px */

/* 向上取整 */
width: round(up, 33.2px, 1px);    /* 34px */

/* 舍入到最接近的 10 */
width: round(37px, 10px);     /* 40px */
```

---

## mod() 与 rem()

### mod() — 取模运算

```css
/* 取模 */
width: mod(17px, 5px);   /* 2px */
width: mod(-17px, 5px);  /* -2px */
```

### rem() — 余数运算

```css
/* 余数（结果符号与被除数相同） */
width: rem(17px, 5px);   /* 2px */
width: rem(-17px, 5px);  /* 3px */
```

---

## abs() 与 sign()

### abs() — 绝对值

```css
width: abs(-100px);   /* 100px */
```

### sign() — 符号函数

```css
/* 正数返回 1，负数返回 -1，零返回 0 */
transform: scale(sign(var(--direction)));
```

---

## sin()、cos()、tan()

三角函数，角度单位为 deg、rad、turn 或 grad。

```css
/* 创建圆形布局 */
.item {
  --angle: 0deg;
  --radius: 100px;
  transform: translate(
    calc(cos(var(--angle)) * var(--radius)),
    calc(sin(var(--angle)) * var(--radius))
  );
}

/* 螺旋动画 */
@keyframes spiral {
  from {
    --angle: 0deg;
    transform: translate(
      calc(cos(var(--angle)) * var(--radius)),
      calc(sin(var(--angle)) * var(--radius))
    );
  }
  to {
    --angle: 360deg;
    transform: translate(
      calc(cos(var(--angle)) * var(--radius)),
      calc(sin(var(--angle)) * var(--radius))
    );
  }
}
```

---

## pow()、sqrt()、hypot()

### pow() — 幂运算

```css
/* 平方 */
width: pow(2, 3);   /* 8 */
```

### sqrt() — 平方根

```css
/* 计算对角线长度 */
--diagonal: sqrt(pow(var(--w), 2) + pow(var(--h), 2));
```

### hypot() — 欧几里得距离

```css
/* 等同于 sqrt(x² + y²) */
--distance: hypot(3px, 4px);   /* 5px */
```

---

## exp() 与 log()

```css
/* 自然指数 */
width: exp(1);   /* ≈ 2.718 */

/* 自然对数 */
width: log(10);  /* ≈ 2.303 */
```

---

## 综合实战

### 完美正方形网格

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
  gap: clamp(1rem, 2vw, 2rem);
}
```

### 流体间距系统

```css
:root {
  --space-xs: clamp(0.25rem, 0.15rem + 0.5vw, 0.5rem);
  --space-sm: clamp(0.5rem, 0.3rem + 1vw, 1rem);
  --space-md: clamp(1rem, 0.5rem + 2vw, 2rem);
  --space-lg: clamp(2rem, 1rem + 4vw, 4rem);
  --space-xl: clamp(4rem, 2rem + 8vw, 8rem);
}
```

### 响应式容器

```css
.container {
  width: min(100% - 2rem, 1200px);
  margin-inline: auto;
}
```

---

## 浏览器兼容性

| 函数 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| calc() | 26+ | 7+ | 16+ | 12+ |
| min()/max() | 79+ | 11.1+ | 75+ | 79+ |
| clamp() | 79+ | 13.1+ | 75+ | 79+ |
| round() | 125+ | 15.4+ | 118+ | 125+ |
| mod()/rem() | 125+ | 15.4+ | 118+ | 125+ |
| abs()/sign() | 125+ | 15.4+ | 118+ | 125+ |
| sin()/cos()/tan() | 125+ | 15.4+ | 118+ | 125+ |
| pow()/sqrt()/hypot() | 125+ | 15.4+ | 118+ | 125+ |
| exp()/log() | 125+ | 15.4+ | 118+ | 125+ |

---

## 奇淫技巧

### 技巧一：完美流体排版公式

```css
/* 使用现代 CSS 锁定技术 */
:root {
  --min-fs: 16;
  --max-fs: 24;
  --min-vw: 320;
  --max-vw: 1920;
  
  --fs: clamp(
    calc(var(--min-fs) * 1px),
    calc(var(--min-fs) * 1px + (var(--max-fs) - var(--min-fs)) * ((100vw - var(--min-vw) * 1px) / (var(--max-vw) - var(--min-vw)))),
    calc(var(--max-fs) * 1px)
  );
}
```

### 技巧二：动态圆角

```css
/* 大屏幕上圆角更大 */
.card {
  border-radius: clamp(8px, 2vw, 24px);
}
```

### 技巧三：宽高比保持

```css
/* 使用 aspect-ratio 配合 min/max */
.video-container {
  width: min(100%, 800px);
  aspect-ratio: 16 / 9;
}
```

### 技巧四：文字阴影动态强度

```css
.dynamic-shadow {
  text-shadow: 0 calc(0.1em + 0.5vw) calc(0.2em + 1vw) rgba(0, 0, 0, 0.3);
}
```

### 技巧五：纯 CSS 进度条

```css
.progress-bar {
  --progress: 75;
  width: calc(var(--progress) * 1%);
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.3s;
}
```

---

## 参考资料

- [MDN calc()](https://developer.mozilla.org/zh-CN/docs/Web/CSS/calc)
- [MDN clamp()](https://developer.mozilla.org/zh-CN/docs/Web/CSS/clamp)
- [CSS-Tricks: A Complete Guide to calc()](https://css-tricks.com/a-complete-guide-to-calc-in-css/)
- [Modern Fluid Typography](https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/)
