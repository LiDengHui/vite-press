---
title: CSS 书写模式 writing-mode
date: 2025-04-29
tags:
  - CSS
  - writing-mode
categories:
  - 技术文档
  - 前端
  - CSS
  - 基础入门
---

# CSS 书写模式 writing-mode

[[toc]]

`writing-mode` 控制文本的排列方向，是构建多语言网站、竖排文字、混合排版的核心属性。

---

## 基础语法

### 四种书写模式

```css
.horizontal-tb {
  writing-mode: horizontal-tb;  /* 水平、从上到下（默认） */
}

.vertical-rl {
  writing-mode: vertical-rl;    /* 垂直、从右到左 */
}

.vertical-lr {
  writing-mode: vertical-lr;    /* 垂直、从左到右 */
}

.sideways-rl {
  writing-mode: sideways-rl;    /*  sideways（实验性） */
}
```

| 模式 | 流向 | 常见语言 |
|------|------|---------|
| `horizontal-tb` | 水平、自上而下 | 中文、英文、阿拉伯语 |
| `vertical-rl` | 垂直、自右而左 | 传统中文、日文、韩文 |
| `vertical-lr` | 垂直、自左而右 | 蒙古语 |
| `sideways-rl` | 字符侧躺、右到左 | 实验性 |

---

## 竖排中文

### 基础竖排

```css
.vertical-text {
  writing-mode: vertical-rl;
  height: 300px;
  line-height: 2;
}
```

```html
<div class="vertical-text">
  <h2>春江花月夜</h2>
  <p>春江潮水连海平，海上明月共潮生。</p>
  <p>滟滟随波千万里，何处春江无月明。</p>
</div>
```

### 标题横排、正文竖排

```css
.vertical-article {
  writing-mode: vertical-rl;
}

.vertical-article h1 {
  writing-mode: horizontal-tb;  /* 标题保持横排 */
  text-orientation: mixed;
}
```

---

## text-orientation 控制字符方向

```css
.vertical-text {
  writing-mode: vertical-rl;
}

/* 混合模式：CJK 字符直立，拉丁字符侧躺 */
.mixed {
  text-orientation: mixed;
}

/* 所有字符直立 */
.upright {
  text-orientation: upright;
}

/* 所有字符侧躺 */
.sideways {
  text-orientation: sideways;
}
```

| 值 | CJK 字符 | 拉丁字符 |
|----|---------|---------|
| `mixed` | 直立 | 顺时针旋转 90° |
| `upright` | 直立 | 直立 |
| `sideways` | 侧躺 | 侧躺 |

---

## 逻辑属性配合

### 与逻辑属性结合

```css
.vertical-card {
  writing-mode: vertical-rl;
  padding-inline: 1rem;    /* 在 vertical-rl 中 = padding-top/bottom */
  padding-block: 2rem;     /* 在 vertical-rl 中 = padding-right/left */
  border-inline-start: 3px solid #4a90d9;
  margin-block-end: 1rem;
}
```

### 与 Flexbox 结合

```css
.vertical-flex {
  writing-mode: vertical-rl;
  display: flex;
  flex-direction: column;  /* 在 vertical 模式下表示垂直堆叠 */
  gap: 1rem;
}
```

---

## 混合排版

### 横竖混排

```css
.mixed-layout {
  writing-mode: horizontal-tb;
}

.mixed-layout .vertical-aside {
  writing-mode: vertical-rl;
  float: right;
  width: 3em;
  height: 400px;
}
```

### 文字方向切换

```css
.bilingual {
  /* 中文竖排 */
  writing-mode: vertical-rl;
}

.bilingual .english {
  /* 英文部分横排 */
  writing-mode: horizontal-tb;
  display: inline-block;
}
```

---

## 浏览器兼容性

| 属性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| writing-mode | 48+ | 9+ | 41+ | 12+ |
| text-orientation | 48+ | 9+ | 41+ | 79+ |

---

## 奇淫技巧

### 技巧一：竖排文字选中效果

```css
.vertical-text::selection {
  background: #4a90d9;
  color: white;
}
```

### 技巧二：竖排滚动条位置

```css
.vertical-scroll {
  writing-mode: vertical-rl;
  overflow-y: auto;
  /* 滚动条在左侧（RTL 效果） */
  scrollbar-width: thin;
}
```

### 技巧三：竖排文字省略号

```css
.vertical-ellipsis {
  writing-mode: vertical-rl;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 200px;
}
```

### 技巧四：利用 writing-mode 实现垂直居中

```css
.vertical-center {
  writing-mode: vertical-rl;
  text-align: center;
  height: 300px;
}

.vertical-center .content {
  writing-mode: horizontal-tb;
  display: inline-block;
}
```

### 技巧五：竖排数字处理

```css
.vertical-numbers {
  writing-mode: vertical-rl;
  text-orientation: upright;  /* 数字保持直立 */
  font-feature-settings: 'tnum';  /* 等宽数字 */
}
```

---

## 参考资料

- [MDN writing-mode](https://developer.mozilla.org/zh-CN/docs/Web/CSS/writing-mode)
- [MDN text-orientation](https://developer.mozilla.org/zh-CN/docs/Web/CSS/text-orientation)
- [W3C CSS Writing Modes Level 4](https://www.w3.org/TR/css-writing-modes-4/)
