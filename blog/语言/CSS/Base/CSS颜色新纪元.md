---
title: CSS 颜色新纪元：oklch、color-mix 与相对颜色
date: 2025-04-29
tags:
  - CSS
  - 颜色
  - 前端
categories:
  - 技术文档
  - 前端
  - CSS
  - 视觉表现
---

# CSS 颜色新纪元：oklch、color-mix 与相对颜色

[[toc]]

CSS 颜色系统在近年发生了根本性的革命：从以 sRGB 为基础的 `hex` / `rgb` / `hsl`，过渡到以人类视觉为基础的 `oklch`。这意味着更好的深色支持、更直观的调色体验。

---

## 为什么需要新颜色空间

| 问题 | sRGB (hex/hsl) | oklch |
|------|----------------|-------|
| 亮度一致性 | 不同色相同亮度下视觉亮度不均 | 经过校正，同亮度下视觉亮度一致 |
| 色彩饱和度 | 高饱和时溢出 / 失真 | 在更大色域内操作 |
| 深色支持 | 差 | 支持 Display P3 / Rec.2020 |
| 渐变过渡 | 颜色追踪诡异 | 渐变自然流畅 |

---

## oklch() 语法

```css
/* oklch(亮度, 色度, 色相) */
.oklch-red   { color: oklch(60% 0.3 25); }
.oklch-green { color: oklch(70% 0.2 145); }
.oklch-blue  { color: oklch(50% 0.25 250); }
```

| 参数 | 范围 | 意义 |
|------|------|------|
| L (Lightness) | `0%` – `100%` | 亮度，人眼感知一致 |
| C (Chroma) | `0` – `0.4` (约) | 色彩强度，0 为灰色 |
| H (Hue) | `0` – `360` | 色相，与 HSL 相似 |

### oklch vs hsl 对比

```css
/* 两者被设计为同级视觉亮度，但 oklch 更稳定 */
.hsl-yellow { color: hsl(60 100% 50%); }   /* 发白 */
.oklch-yellow { color: oklch(85% 0.2 95); } /* 正常黄 */
```

---

## color-mix()

在任意两种颜色间按比例混合，支持指定颜色空间：

```css
/* 红色与蓝色各 50% 混合 */
.mixed {
    color: color-mix(in oklch, red, blue 50%);
}

/* 仅调整亮度：红色与白色 70:30 混合 */
.tint {
    background: color-mix(in oklch, var(--brand), white 70%);
}

/* 定制主题色的不同深度 */
:root {
    --brand: oklch(60% 0.2 250);
    --brand-light: color-mix(in oklch, var(--brand), white 75%);
    --brand-dark:  color-mix(in oklch, var(--brand), black 40%);
}
```

### 实用案例：自动生成配色板

```css
:root {
    --base: oklch(55% 0.18 260);
    /* 通过色度和亮度控制生成系统色 */
    --primary-50:  color-mix(in oklch, var(--base), white 90%);
    --primary-100: color-mix(in oklch, var(--base), white 75%);
    --primary-200: color-mix(in oklch, var(--base), white 50%);
    --primary-500: var(--base);
    --primary-700: color-mix(in oklch, var(--base), black 35%);
    --primary-900: color-mix(in oklch, var(--base), black 65%);
}
```

---

## 相对颜色 (Relative Colors)

使用 `from` 关键字基于现有颜色创建新颜色：

```css
/* 调亮：保持原色相色度，只提高亮度 10% */
.highlight {
    color: oklch(from var(--brand) calc(l + 0.1) c h);
}

/* 调暗并去色 */
.muted {
    color: oklch(from var(--brand) calc(l - 0.05) calc(c * 0.5) h);
}

/* 仅变更色相：形成补色 */
.complement {
    color: oklch(from var(--brand) l c calc(h + 180));
}

/* 完全去色：生成灰度 */
.grayscale {
    color: oklch(from var(--brand) l 0 h);
}
```

| 操作 | 语法示例 |
|------|----------|
| 调亮 | `oklch(from X calc(l + 0.15) c h)` |
| 调暗 | `oklch(from X calc(l - 0.1) c h)` |
| 去色 | `oklch(from X l 0 h)` |
| 反色相 | `oklch(from X l c calc(h + 180))` |
| 低饱和 | `oklch(from X l calc(c * 0.5) h)` |

---

## 其他新颜色函数

### color-contrast()

```css
/* 选择与背景对比度最高的前景色 */
.text {
    color: color-contrast(var(--bg) vs white, black, #333);
}
```

> 注：`color-contrast()` 规范在迭代，部分浏览器可能已使用 `contrast-color()` 替代。

### 广色域 P3 支持

```css
/* 使用 Display-P3 色域定义更鲜艳的红 */
.vivid-red {
    color: color(display-p3 0.95 0.2 0.15);
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | 备注 |
|------|--------|--------|---------|------|
| `oklch()` | 111+ | 15.4+ | 113+ | 完全支持 |
| `color-mix()` | 111+ | 16.2+ | 113+ | 完全支持 |
| 相对颜色 `from` | 111+ | 16.2+ | 128+ | 部分支持 |
| `color()` | 111+ | 15.4+ | 113+ | 广色域支持 |

---

## 奇淫技巧

### 技巧一：通用暗色主题自动生成

```css
:root {
    --hue: 250;
    --base: oklch(60% 0.2 var(--hue));
    /* 自动计算对比色 */
    --text: oklch(from var(--base) calc((0.6 - l) * 1000%) c h);
}
```

### 技巧二：oklch 渐变解决“灰色中心”问题

```css
/* 传统渐变会出现灰色中心 */
.bad { background: linear-gradient(90deg, red, blue); }

/* oklch 渐变更自然 */
.good { background: linear-gradient(in oklch 90deg, red, blue); }
```

### 技巧三：自定义属性 + oklch 动态主题

```css
@property --hue {
    syntax: '<number>';
    initial-value: 200;
    inherits: true;
}

.animated-theme {
    background: oklch(70% 0.2 var(--hue));
    transition: --hue 0.5s;
}

.animated-theme:hover {
    --hue: 320;
}
```

### 技巧四：配色板生成器

```css
/* 只需修改一个变量，整个系统颜色自动更新 */
[data-theme="blue"]   { --primary: oklch(60% 0.2 250); }
[data-theme="green"]  { --primary: oklch(65% 0.18 145); }
[data-theme="orange"] { --primary: oklch(70% 0.2 55); }
```

---

## 参考资料

- [MDN oklch()](https://developer.mozilla.org/zh-CN/docs/Web/CSS/color_value/oklch)
- [MDN color-mix()](https://developer.mozilla.org/zh-CN/docs/Web/CSS/color_value/color-mix)
- [OKLCH 在 CSS 中的使用](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl)
- [Color Spaces 可视化对比](https://css.land/lch/)
