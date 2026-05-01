---
title: CSS 性能优化
date: 2025-04-29
tags:
  - CSS
  - 性能
categories:
  - 技术文档
  - 前端
  - CSS
  - 基础入门
---

# CSS 性能优化

CSS 性能直接影响首屏渲染时间和交互流畅度。了解浏览器渲染管线，才能写出高效的样式。

---

## 一、浏览器渲染管线

```
DOM + CSSOM → 渲染树 → 布局（Layout）→ 绘制（Paint）→ 合成（Composite）
```

| 阶段 | 触发原因 | 代价 |
|------|---------|------|
| **Layout** | 改变几何属性（width/height/top） | 高（重排） |
| **Paint** | 改变外观属性（color/bg/shadow） | 中（重绘） |
| **Composite** | 改变合成属性（transform/opacity） | 低 |

### 优化原则

> **只触发 Composite，避免 Layout 和 Paint**

---

## 二、触发层级对照表

| 属性 | Layout | Paint | Composite |
|------|--------|-------|-----------|
| `width`, `height` | ✅ | ✅ | ✅ |
| `top`, `left` | ✅ | ✅ | ✅ |
| `margin`, `padding` | ✅ | ✅ | ✅ |
| `font-size` | ✅ | ✅ | ✅ |
| `color` | ❌ | ✅ | ✅ |
| `background-color` | ❌ | ✅ | ✅ |
| `visibility` | ❌ | ✅ | ✅ |
| `transform` | ❌ | ❌ | ✅ |
| `opacity` | ❌ | ❌ | ✅ |
| `filter` | ❌ | ❌ | ✅ |

---

## 三、关键优化策略

### 1. 使用 transform 代替 top/left 做动画

```css
/* ❌ 触发 Layout */
.box {
    position: absolute;
    left: 0;
    animation: move 1s infinite;
}
@keyframes move {
    to { left: 100px; }
}

/* ✅ 只触发 Composite，使用 GPU 加速 */
.box {
    transform: translateX(0);
    animation: move 1s infinite;
}
@keyframes move {
    to { transform: translateX(100px); }
}
```

### 2. 使用 opacity 代替 visibility/display 做淡入淡出

```css
/* ✅ opacity 可由 GPU 直接处理 */
.fade {
    opacity: 0;
    transition: opacity 0.3s;
    will-change: opacity; /* 提示浏览器提前优化 */
}
.fade.show { opacity: 1; }
```

### 3. 避免强制同步布局（Forced Synchronous Layout）

```javascript
// ❌ 读 → 写 → 读 → 写，导致多次 Layout
const box = document.querySelector('.box');
box.style.width = '100px';           // 写
console.log(box.offsetHeight);       // 读 → 强制同步布局！
box.style.height = '200px';          // 写
console.log(box.offsetWidth);        // 读 → 再次强制布局！

// ✅ 批量读，批量写（使用 requestAnimationFrame 或 FastDOM）
const width = box.offsetWidth;       // 读
const height = box.offsetHeight;     // 读
requestAnimationFrame(() => {
    box.style.width = '100px';       // 写
    box.style.height = '200px';      // 写
});
```

### 4. 减少选择器复杂度

```css
/* ❌ 从右向左匹配，开销大 */
.nav ul li a span { }

/* ✅ 扁平化，给关键元素加 class */
.nav-link-text { }
```

### 5. 谨慎使用 @import

```css
/* ❌ 串行加载，阻塞渲染 */
@import url('other.css');

/* ✅ 改用 link 标签，并行加载 */
/* <link rel="stylesheet" href="other.css"> */
```

---

## 四、will-change 的正确使用

```css
/* 在动画开始前声明，动画结束后移除 */
.slider {
    will-change: transform;
}

/* 不要滥用！每个 GPU 层都消耗内存 */
/* ❌ 错误：给所有元素都加 */
* { will-change: all; }

/* ✅ 正确：仅在需要时动态添加 */
.element:hover {
    will-change: transform, opacity;
}
```

---

## 五、content-visibility 延迟渲染

```css
/* 视口外的元素延迟渲染，极大提升长列表性能 */
.card {
    content-visibility: auto;
    contain-intrinsic-size: 0 300px; /* 预估高度，防止滚动跳动 */
}
```

---

## 六、CSS Containment 隔离

```css
/* 告诉浏览器：这个元素的变化不影响外部 */
.widget {
    contain: layout paint style;
}

/* 值说明 */
contain: layout;   /* 内部布局不影响外部 */
contain: paint;    /* 内部绘制不溢出外部 */
contain: size;     /* 尺寸不依赖子元素 */
contain: style;    /* counter/quote 不继承外部 */
contain: strict;   /* = layout paint size */
contain: content;  /* = layout paint style */
```

---

## 七、字体加载优化

```css
/* 使用 font-display 控制字体加载行为 */
@font-face {
    font-family: 'CustomFont';
    src: url('font.woff2') format('woff2');
    font-display: swap; /* 先显示备用字体，加载完成后切换 */
}

/* 可选值：
   auto     - 浏览器默认
   block    - 短暂 invisible（FOIT）
   swap     - 立即显示备用（FOUT）
   fallback - 短暂 block，然后 swap
   optional - 极短 block，不交换
*/
```

---

## 八、减少重绘面积

```css
/* 使用 overflow: hidden 或 transform 创建独立图层 */
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    /* 独立图层，只重绘遮罩区域 */
    transform: translateZ(0);
}
```

---

## 奇淫技巧

### 技巧 1：硬件加速触发

```css
/* 强制创建 GPU 层 */
.gpu-layer {
    transform: translateZ(0);
    /* 或 */
    backface-visibility: hidden;
}
```

### 技巧 2：滚动性能优化

```css
/* 启用原生滚动优化 */
.scroll-container {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch; /* iOS 惯性滚动 */
    overscroll-behavior: contain;      /* 阻止滚动链 */
}
```

### 技巧 3：图片懒加载占位

```css
.img-placeholder {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}
```

### 技巧 4：CSS 变量做主题切换（零重排）

```css
:root {
    --bg: #fff;
    --text: #333;
}
[data-theme="dark"] {
    --bg: #1a1a1a;
    --text: #e0e0e0;
}
body {
    background: var(--bg);
    color: var(--text);
}
/* 只改变变量值，不涉及 Layout */
```

### 技巧 5：使用 :is() 和 :where() 压缩选择器

```css
/* 压缩前 */
h1 span, h2 span, h3 span, h4 span { }

/* 压缩后 */
:is(h1, h2, h3, h4) span { }

/* :where() 优先级为 0，不会增加权重 */
:where(h1, h2, h3) span { }
```

### 技巧 6：CSS 计数器替代 JS

```css
/* 自动编号，无需 JS */
ol { counter-reset: section; }
li::before {
    counter-increment: section;
    content: counters(section, ".") " ";
}
```

### 技巧 7：使用 clip-path 替代 overflow hidden

```css
/* 创建复杂裁剪形状，不触发 Layout */
.avatar {
    clip-path: circle(50%);
}
.avatar:hover {
    clip-path: inset(10% round 20px);
    transition: clip-path 0.3s;
}
```

### 技巧 8：减少 CSS 文件体积

```css
/* 使用 CSS 变量的 shorthand */
:root {
    --m: 8px;
    --p: 16px;
}
.compact { margin: var(--m); padding: var(--p); }

/* 使用 unset/inherit 减少重复 */
button {
    all: unset;
    cursor: pointer;
}
```

### 技巧 9：@layer 控制优先级

```css
/* 低优先级层先加载，高优先级层后覆盖 */
@layer reset, base, components, utilities;

@layer reset { * { margin: 0; } }
@layer utilities { .m-0 { margin: 0 !important; } }
```

### 技巧 10：打印样式精简

```css
@media print {
    *, *::before, *::after {
        background: transparent !important;
        color: #000 !important;
        box-shadow: none !important;
        text-shadow: none !important;
    }
    a[href]::after { content: " (" attr(href) ")"; }
}
```

> 💡 **性能口诀**：动画用 transform，显隐用 opacity，布局用 Flex/Grid，长列表用 content-visibility，变化隔离用 contain。
