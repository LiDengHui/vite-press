---
title: CSS 盒模型
date: 2025-04-29
tags:
  - CSS
  - 盒模型
  - 前端
categories:
  - 技术文档
  - 前端
  - CSS
  - 基础入门
---

# CSS 盒模型

CSS 中每个元素都是一个盒子。理解盒模型是布局的基石。

---

## 一、盒模型组成

```
┌────────────────────────────────┐
|        margin (外边距)           |
|  ┌────────────────────┐  |
|  |     border (边框)        |  |
|  |  ┌──────────────┐  |  |
|  |  |   padding (内边距) |  |  |
|  |  |  ┌────────┐  |  |  |
|  |  |  | content |  |  |  |
|  |  |  └────────┘  |  |  |
|  |  └──────────────┘  |  |
|  └────────────────────┘  |
└────────────────────────────────┘
```

| 层 | 说明 |
|----|------|
| `content` | 内容区域，显示文本和子元素 |
| `padding` | 内边距，内容到边框的间距 |
| `border` | 边框的厚度、样式、颜色 |
| `margin` | 外边距，盒子与其他盒子的间距 |

---

## 二、box-sizing

决定宽高是怎么计算的。

### `content-box` 标准盒模型（默认）

```css
.box {
    width: 200px;
    padding: 20px;
    border: 5px solid black;
    /* 实际占位 = 200 + 20*2 + 5*2 = 250px */
}
```

### `border-box` 边框盒模型

```css
* { box-sizing: border-box; } /* 强烈推荐的重置样式 */

.box {
    width: 200px;
    padding: 20px;
    border: 5px solid black;
    /* 实际占位 = 200px，内容区 = 200 - 20*2 - 5*2 = 150px */
}
```

> 💡 生产环境必须 `* { box-sizing: border-box; }`，减少布局计算头疼。

---

## 三、margin 外边距

### 简写

```css
/* 四个方向 */
margin: 10px 20px 15px 25px; /* 上 右 下 左 */
margin: 10px 20px;           /* 上下  左右 */
margin: 10px;                /* 四边 */
margin: 10px 20px 15px;      /* 上 左右 下 */
```

### margin 折叠（Margin Collapse）

**垂直方向**相邻块级元素的 margin 会发生重叠，最终取较大值：

```css
.top    { margin-bottom: 20px; }
.bottom { margin-top: 30px; }
/* 实际间距 = 30px，不是 50px */
```

**不会折叠的情况**：
- Flex/Grid 布局下的子元素
- 设置了 `float`、`position: absolute/fixed`
- 添加了 `overflow` 非 `visible`
- 正姊元素（有内容分隔）

### margin 为负值

```css
/* 负 margin 可以让元素向反方向移动 */
.overlap-left {
    margin-left: -50px;
}

/* 常用技巧：两栏布局合并边框 */
.item {
    margin-right: -1px; /* 让边框重叠 */
}
```

### margin: auto 居中

```css
/* 水平居中（块级元素） */
.center-block {
    width: 300px;
    margin: 0 auto;
}

/* 垂直居中（Flex 布局内） */
.flex-center {
    display: flex;
}
.flex-center .child {
    margin: auto; /* 上下左右全部 auto */
}
```

### 联动 margin

```css
/* 一方向使用百分比时，参考是父元素的宽度！ */
.box {
    width: 50%;
    margin-top: 20%; /* 等于父元素宽度的 20% */
}
```

---

## 四、padding 内边距

padding 不支持负值。

### 百分比 padding 实现宽高比例

```css
/* 保持 16:9 的比例容器 */
.video-wrapper {
    width: 100%;
    padding-bottom: 56.25%; /* 9 / 16 = 0.5625 */
    position: relative;
}
.video-wrapper iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
}
```

---

## 五、border 边框

```css
/* 简写 */
border: 1px solid #ccc;

/* 分开写 */
border-width: 1px 2px;
border-style: dashed;
border-color: red;

/* 圆角 */
border-radius: 8px;           /* 全部 */
border-radius: 8px 16px;      /* 左上右下 / 右上左下 */
border-radius: 50%;           /* 圆形 */
border-radius: 9999px;        /* 椭圆/跑道形 */
```

### 形状边框（Border Shape）

```css
/* 三角形 */
.triangle {
    width: 0;
    height: 0;
    border-left: 50px solid transparent;
    border-right: 50px solid transparent;
    border-bottom: 100px solid red;
}

/* 带圆角的箭头 */
.arrow {
    width: 0;
    height: 0;
    border: 20px solid transparent;
    border-left-color: red;
    border-radius: 4px;
}
```

### outline vs border

```css
/* outline 不占用布局空间，不影响盒模型 */
:focus-visible {
    outline: 2px solid blue;
    outline-offset: 2px; /* 轮廓与元素的间距 */
}
```

---

## 六、奇淫技巧

### 技巧 1：一行代码重置全局盒模型

```css
*,
*::before,
*::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}
```

### 技巧 2：用 box-shadow 模拟多重边框

```css
/* 不占用真实尺寸的多层边框 */
.card {
    box-shadow:
        0 0 0 2px red,
        0 0 0 4px white,
        0 0 0 6px blue;
}
```

### 技巧 3：两栏布局 + 中间分隔线

```css
.row {
    display: flex;
}
.col {
    flex: 1;
    padding: 20px;
}
/* 这种写法保证中间只有1条线 */
.col + .col {
    border-left: 1px solid #ddd;
}
```

### 技巧 4：滚动条自适应宽度（无闪动）

```css
/* 方法1：预留滚动条空间 */
html {
    overflow-y: scroll;
}

/* 方法2：CSS 隧道滚动条 */
html {
    scrollbar-gutter: stable;
}
```

### 技巧 5：使用 aspect-ratio 保持比例（现代方案）

```css
/* 不再需要 padding-bottom hack */
.video {
    width: 100%;
    aspect-ratio: 16 / 9;
}
```

### 技巧 6：记住最大宽高组合

```css
.card {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    /* 手机上占满，PC 上最多 600px 居中 */
}
```

### 技巧 7：拆分 border 实现单边圆角

```css
/* 只有左上和右下是圆角 */
.card {
    border-radius: 16px 0;
}

/* 瓦片状 */
.ticket {
    border-radius: 8px;
    /* 用 mask 或 background 实现凲口 */
    clip-path: polygon(
        0 0, calc(100% - 20px) 0, 100% 20px,
        100% 100%, 20px 100%, 0 calc(100% - 20px)
    );
}
```

> 💡 盒模型是 CSS 布局的第一步。记住：**总是使用 `border-box`，避免 `margin` 负值滥用，注意 `margin` 折叠**。
