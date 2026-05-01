---
title: CSS 字体深入
date: 2025-04-29
tags:
  - CSS
  - 字体
  - 排版
categories:
  - 技术文档
  - 前端
  - CSS
  - 视觉表现
---

# CSS 字体深入

[[toc]]

字体是网页设计的核心组成部分，好的字体排版能显著提升用户体验。本文深入讲解 CSS 中字体相关的所有重要属性和技术。

---

## 基础字体属性

### font-family

```css
/* 系统字体栈 */
.system-font {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
}

/* 衬线字体 */
.serif {
  font-family: Georgia, 'Times New Roman', serif;
}

/* 等宽字体 */
.mono {
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace;
}

/* 自定义字体 */
.custom {
  font-family: 'MyFont', sans-serif;
}
```

### @font-face

```css
/* 基础声明 */
@font-face {
  font-family: 'MyFont';
  src: url('myfont.woff2') format('woff2'),
       url('myfont.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap;  /* 优化加载策略 */
}

/* 多字重支持 */
@font-face {
  font-family: 'MyFont';
  src: url('myfont-bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

/* 斜体变体 */
@font-face {
  font-family: 'MyFont';
  src: url('myfont-italic.woff2') format('woff2');
  font-weight: 400;
  font-style: italic;
  font-display: swap;
}
```

### 字体加载策略

```css
/* font-display 选项 */
@font-face {
  font-family: 'MyFont';
  src: url('myfont.woff2') format('woff2');
  font-display: auto;     /* 浏览器默认 */
  font-display: block;    /* 阻塞期，文字不可见 */
  font-display: swap;     /* 立即显示回退字体 */
  font-display: fallback; /* 短时间阻塞 */
  font-display: optional; /* 极短时间阻塞，可能不加载 */
}
```

---

## 字体大小

### 单位对比

```css
/* 绝对单位 */
.fixed { font-size: 16px; }

/* 相对单位 */
.relative { font-size: 1rem; }      /* 根元素字体大小 */
.em-based { font-size: 1.5em; }     /* 父元素字体大小 */
.percentage { font-size: 100%; }    /* 父元素字体大小 */

/* 视口单位 */
.viewport { font-size: 2vw; }

/* 流体字体 */
.fluid { font-size: clamp(1rem, 2.5vw, 2rem); }
```

### 现代字体大小系统

```css
:root {
  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --text-sm: clamp(0.875rem, 0.8rem + 0.35vw, 1rem);
  --text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  --text-lg: clamp(1.125rem, 1rem + 0.65vw, 1.25rem);
  --text-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
  --text-2xl: clamp(1.5rem, 1.3rem + 1vw, 2rem);
  --text-3xl: clamp(1.875rem, 1.6rem + 1.4vw, 2.5rem);
  --text-4xl: clamp(2.25rem, 1.9rem + 1.75vw, 3rem);
}
```

---

## 行高与间距

### line-height

```css
/* 无单位倍数 */
.unitless { line-height: 1.5; }

/* 百分比 */
.percentage { line-height: 150%; }

/* 固定值 */
.fixed { line-height: 24px; }

/* 推荐：使用无单位值 */
body { line-height: 1.6; }
```

### 字间距

```css
/* 字母间距 */
.wide { letter-spacing: 0.05em; }
.tight { letter-spacing: -0.02em; }

/* 单词间距 */
.word-spacing { word-spacing: 0.25em; }
```

---

## 字体特性

### font-feature-settings

```css
/* 启用连字 */
.ligatures {
  font-feature-settings: "liga" 1, "calt" 1;
}

/* 禁用连字 */
.no-ligatures {
  font-feature-settings: "liga" 0;
}

/* 小型大写字母 */
.small-caps {
  font-feature-settings: "smcp" 1;
}

/* 旧式数字 */
.old-style-nums {
  font-feature-settings: "onum" 1;
}

/* 等宽数字 */
.tabular-nums {
  font-feature-settings: "tnum" 1;
}
```

### font-variant

```css
/* 小型大写字母 */
.small-caps {
  font-variant: small-caps;
}

/* 数字变体 */
.numeric {
  font-variant-numeric: tabular-nums;
  font-variant-numeric: oldstyle-nums;
  font-variant-numeric: lining-nums;
  font-variant-numeric: proportional-nums;
}
```

---

## 可变字体

### 基础使用

```css
@font-face {
  font-family: 'Inter';
  src: url('Inter-Variable.woff2') format('woff2');
  font-weight: 100 900;  /* 定义可变范围 */
  font-display: swap;
}

.variable-font {
  font-family: 'Inter', sans-serif;
  font-weight: 450;  /* 任意值 */
  font-variation-settings: 'wght' 450, 'slnt' -10;
}
```

### 常用轴

```css
/* 字重轴 (wght) */
.bold { font-variation-settings: 'wght' 700; }

/* 字宽轴 (wdth) */
.wide { font-variation-settings: 'wdth' 120; }

/* 倾斜轴 (slnt) */
.slanted { font-variation-settings: 'slnt' -12; }

/* 光学尺寸 (opsz) */
.optical { font-variation-settings: 'opsz' 48; }
```

---

## 字体子集化

### Unicode 范围

```css
@font-face {
  font-family: 'MyFont';
  src: url('myfont-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F;
}

@font-face {
  font-family: 'MyFont';
  src: url('myfont-chinese.woff2') format('woff2');
  unicode-range: U+4E00-9FFF;
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| @font-face | 4+ | 3.1+ | 3.5+ | 12+ |
| font-display | 60+ | 11.1+ | 58+ | 79+ |
| font-variation-settings | 62+ | 11+ | 62+ | 79+ |
| unicode-range | 36+ | 9+ | 44+ | 79+ |

---

## 奇淫技巧

### 技巧一：系统字体回退

```css
/* 跨平台最优字体栈 */
body {
  font-family:
    -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
}
```

### 技巧二：字体平滑

```css
/* macOS/iOS */
.smooth {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### 技巧三：防止 FOUT/FOIT

```css
/* 使用 font-display: swap */
@font-face {
  font-family: 'MyFont';
  src: url('myfont.woff2') format('woff2');
  font-display: swap;
}

/* 或使用 JS 预加载 */
<link rel="preload" href="myfont.woff2" as="font" type="font/woff2" crossorigin>
```

### 技巧四：可变字体动画

```css
.variable-hover {
  font-variation-settings: 'wght' 400;
  transition: font-variation-settings 0.3s;
}

.variable-hover:hover {
  font-variation-settings: 'wght' 700;
}
```

### 技巧五：字体比例尺

```css
/* 黄金比例字体 */
:root {
  --phi: 1.618;
  --base: 1rem;
  --text-sm: calc(var(--base) / var(--phi));
  --text-base: var(--base);
  --text-lg: calc(var(--base) * var(--phi));
  --text-xl: calc(var(--base) * var(--phi) * var(--phi));
  --text-2xl: calc(var(--base) * var(--phi) * var(--phi) * var(--phi));
}
```

---

## 参考资料

- [MDN: CSS Fonts](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_fonts)
- [Variable Fonts Guide](https://variablefonts.io/)
- [Google Fonts: Optimization](https://developers.google.com/fonts/docs/optimization)
