---
title: CSS 盒模型详解
date: 2025-04-29
tags:
  - CSS
  - 盒模型
categories:
  - 技术文档
  - 前端
  - CSS
  - 基础入门
---

# CSS 盒模型详解

[[toc]]

CSS 盒模型（Box Model）是 CSS 布局的基础。每个 HTML 元素都被视为一个矩形盒子，由内容、内边距、边框和外边距组成。理解盒模型对精确控制元素尺寸和间距至关重要。

---

## 盒模型构成

### 基本组成

```
┌────────────────────────────────────┐
│              margin-top                    │
│  ┌──────────────────────────┐  │
│  │          border-top            │  │
│  │  ┌───────────────┐  │  │
│  │  │     padding-top    │  │  │
│  │  │  ┌─────────┐  │  │  │
│  │  │  │   content    │  │  │  │
│  │  │  └─────────┘  │  │  │
│  │  │    padding-bottom │  │  │
│  │  └───────────────┘  │  │
│  │          border-bottom         │  │
│  └──────────────────────────┘  │
│              margin-bottom                 │
└────────────────────────────────────┘
```

### 属性说明

| 属性 | 说明 | 可控制性 |
|------|------|---------|
| `content` | 内容区域，显示文本和媒体 | 由 width/height 控制 |
| `padding` | 内边距，内容与边框间的空白 | 背景色延伸到此区域 |
| `border` | 边框，包围内边距 | 可设置宽度、样式、颜色 |
| `margin` | 外边距，边框外的空白 | 透明区域 |

---

## 标准盒模型 vs 异性盒模型

### box-sizing

```css
/* 标准盒模型（默认） */
.box-content {
  box-sizing: content-box;
  width: 300px;
  padding: 20px;
  border: 5px solid black;
  /* 实际宽度 = 300 + 20*2 + 5*2 = 350px */
}

/* 异性盒模型 */
.box-border {
  box-sizing: border-box;
  width: 300px;
  padding: 20px;
  border: 5px solid black;
  /* 实际宽度 = 300px，内容宽度 = 300 - 20*2 - 5*2 = 250px */
}
```

### 全局设置

```css
/* 推荐在项目根元素设置 */
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

> 使用 `border-box` 让宽度和高度的计算更直观，是现代开发的标准做法。

---

## margin

### 基础语法

```css
.box {
  margin: 10px;              /* 四边 10px */
  margin: 10px 20px;         /* 上下 10px，左右 20px */
  margin: 10px 20px 30px;    /* 上 10px，左右 20px，下 30px */
  margin: 10px 20px 30px 40px; /* 上 10px，右 20px，下 30px，左 40px */
}
```

### margin 合并（Collapsing Margins）

```css
/* 坦直方向相邻元素的 margin 可能合并 */
.box1 { margin-bottom: 20px; }
.box2 { margin-top: 30px; }
/* 实际间距 = 30px（取较大值），而非 50px */
```

**margin 合并的触发条件：**

- 直属的块级元素之间
- 父元素与第一个/最后一个子元素（父元素无 border、padding、清除浮动）
- 空元素的上下 margin

**避免 margin 合并：**

```css
/* 方法 1：使用 padding 替代 */
.parent {
  padding: 1px 0;  /* 打断 margin 合并 */
}

/* 方法 2：使用 flex 布局 */
.flex-container {
  display: flex;
  flex-direction: column;
}

/* 方法 3：设置 border */
.parent {
  border-top: 1px solid transparent;
}
```

### 负边距

```css
.overlap {
  margin-left: -20px;  /* 元素向左突出 20px */
}

.pull-quote {
  margin-left: -2rem;
  margin-right: -2rem;
}
```

### margin: auto 居中

```css
/* 水平居中（块级元素） */
.center-block {
  width: 300px;
  margin-left: auto;
  margin-right: auto;
}

/* 垂直居中（flex 容器内） */
.flex-center {
  display: flex;
}

.flex-center .item {
  margin: auto;
}
```

---

## padding

### 基础语法

```css
.box {
  padding: 20px;
  padding: 10px 20px 30px 40px;
}
```

### 百分比计算

```css
/* padding 百分比基于父元素的宽度 */
.aspect-box {
  width: 100%;
  padding-bottom: 56.25%;  /* 16:9 比例 */
  position: relative;
}
```

### 逻辑属性

```css
.logical-padding {
  padding-inline: 20px;   /* 内联方向（左右或上下） */
  padding-block: 10px;    /* 块方向 */
}
```

---

## border

### 基础语法

```css
.box {
  border-width: 2px;
  border-style: solid;
  border-color: #333;
  
  /* 简写 */
  border: 2px solid #333;
}
```

### 边框样式

| 样式 | 效果 |
|------|------|
| `solid` | 实线 |
| `dashed` | 虚线 |
| `dotted` | 点线 |
| `double` | 双线 |
| `groove` | 凹槽 |
| `ridge` | 凸起 |
| `inset` | 内陷 |
| `outset` | 外凸 |
| `none` | 无边框 |
| `hidden` | 隐藏（表格边框合并时优先） |

### 圆角边框

```css
.rounded {
  border-radius: 8px;
}

.circle {
  border-radius: 50%;
}

.pill {
  border-radius: 9999px;
}

/* 独立设置 */
.custom-radius {
  border-radius: 10px 20px 30px 40px / 5px 10px 15px 20px;
  /* 水平半径 / 垂直半径 */
}
```

### 轮廓

```css
.outlined {
  outline: 3px solid blue;
  outline-offset: 4px;  /* 轮廓与边框的间距 */
}

/* outline 不占据布局空间，不会影响元素尺寸 */
```

---

## 尺寸计算

### 元素总宽度计算

```
/* 标准盒模型 (content-box) */
总宽度 = width + padding-left + padding-right + border-left + border-right + margin-left + margin-right

/* 异性盒模型 (border-box) */
总宽度 = width + margin-left + margin-right
```

### min/max 限制

```css
.responsive-box {
  width: 100%;
  min-width: 200px;   /* 最小宽度 */
  max-width: 800px;   /* 最大宽度 */
  min-height: 100px;  /* 最小高度 */
}
```

### 占满剩余空间

```css
.fill-available {
  width: -webkit-fill-available;
  width: -moz-available;
  width: stretch;
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| box-sizing | 10+ | 5.1+ | 29+ | 8+ |
| border-radius | 4+ | 5+ | 4+ | 12+ |
| outline-offset | 4+ | 3+ | 3.6+ | 12+ |
| aspect-ratio | 88+ | 15+ | 89+ | 88+ |

---

## 奇淫技巧

### 技巧一：三角形

```css
.triangle {
  width: 0;
  height: 0;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  border-bottom: 100px solid #333;
}
```

### 技巧二：气泡对话框

```css
.bubble {
  position: relative;
  background: #fff;
  border: 2px solid #333;
  border-radius: 8px;
  padding: 1rem;
}

.bubble::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 20px;
  border-width: 10px 10px 0;
  border-style: solid;
  border-color: #333 transparent transparent;
}
```

### 技巧三：一元加强指示器

```css
.indicator {
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-left-color: #333;
}
```

### 技巧四：圆形裁剪

```css
.clip-circle {
  border-radius: 50%;
  overflow: hidden;
}

.clip-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

### 技巧五：外边距折叠工具类

```css
.stack > * + * {
  margin-top: 1.5rem;
}

/* 或者使用 gap */
.stack-flex {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
```

---

## 参考资料

- [MDN 盒模型](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/Building_blocks/The_box_model)
- [MDN box-sizing](https://developer.mozilla.org/zh-CN/docs/Web/CSS/box-sizing)
- [MDN margin](https://developer.mozilla.org/zh-CN/docs/Web/CSS/margin)
- [MDN padding](https://developer.mozilla.org/zh-CN/docs/Web/CSS/padding)
- [MDN border](https://developer.mozilla.org/zh-CN/docs/Web/CSS/border)
