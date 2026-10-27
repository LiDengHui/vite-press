---
title: CSS 定位
date: 2025-04-29
tags:
  - CSS
  - 定位
  - 前端
categories:
  - 技术文档
  - 前端
  - CSS
  - 布局系统
---

# CSS 定位

CSS `position` 属性定义了元素的定位方式，是脱离常规流或固定位置的核心机制。

---

## 一、五种定位模式

| 值 | 行为 | 脱离文档流 | 参考点 |
|----|------|-----------|--------|
| `static` | 默认，正常流 | ❌ | 无 |
| `relative` | 相对定位 | ❌ | 自身原位置 |
| `absolute` | 绝对定位 | ✅ | 最近的非 static 祖先 |
| `fixed` | 固定定位 | ✅ | 视口（viewport） |
| `sticky` | 粘性定位 | 滚动前❌ 滚动后✅ | 最近的滚动祖先 + 阈值 |

---

## 二、static — 默认值

```css
/* 所有元素默认状态 */
div { position: static; }
```

- 元素按正常文档流排列
- `top`/`right`/`bottom`/`left`/`z-index` **无效**

---

## 三、relative — 相对定位

```css
.box {
    position: relative;
    top: 20px;
    left: 30px;
}
```

- **不脱离文档流**，原位置仍被保留
- 偏移基于元素原本位置
- 常作为 `absolute` 子元素的定位容器

### 使用场景

```css
/* 微调位置而不影响布局 */
.badge {
    position: relative;
    top: -5px;
}

/* 给 absolute 子元素创建包含块 */
.card {
    position: relative;
}
.card .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
}
```

---

## 四、absolute — 绝对定位

```css
.popup {
    position: absolute;
    top: 100%;
    left: 0;
}
```

- **脱离文档流**，不占据空间
- 包含块（Containing Block）：最近的 `position ≠ static` 的祖先元素
- 若没有符合条件的祖先，则包含块为初始包含块（`<html>`）

### 包含块详解

```css
/* 父级创建包含块 */
.parent {
    position: relative;   /* 或 absolute/fixed/sticky */
    transform: translate(0); /* transform 也会创建包含块 */
    filter: blur(0);         /* filter 也会 */
    perspective: 100px;      /* perspective 也会 */
}

.child {
    position: absolute;
    top: 0;
    left: 0;
    /* 相对于 .parent 定位 */
}
```

### 填充父容器

```css
.full {
    position: absolute;
    inset: 0; /* top:0 right:0 bottom:0 left:0 */
}
```

---

## 五、fixed — 固定定位

```css
.to-top {
    position: fixed;
    bottom: 20px;
    right: 20px;
}
```

- **脱离文档流**
- 相对于 **视口（viewport）** 定位，不随滚动移动
- `transform`/`perspective`/`filter` 祖先会创建新的包含块，导致 fixed 失效为 absolute 行为

---

## 六、sticky — 粘性定位

```css
.nav {
    position: sticky;
    top: 0;
}
```

- 滚动前像 `relative`，滚动到阈值后像 `fixed`
- **必须设置一个方向阈值**（`top`/`bottom`/`left`/`right` 至少一个）
- 父容器高度必须大于 sticky 元素本身，否则不会"粘"

### 多层 sticky 叠加效果

```css
.header     { position: sticky; top: 0; z-index: 3; }
.sub-header { position: sticky; top: 60px; z-index: 2; }
.filter-bar { position: sticky; top: 120px; z-index: 1; }
```

---

## 七、z-index 与层叠

z-index **只对定位元素有效**（`position` 不为 `static`）：

```css
.modal {
    position: fixed;
    z-index: 1000;
}
```

> 详见 [层叠系统](./层叠系统.md)

---

## 八、奇淫技巧

### 技巧 1：居中方案大全

```css
/* === 方案1：Flex 居中（最推荐）=== */
.center-flex {
    display: flex;
    justify-content: center;
    align-items: center;
}

/* === 方案2：Grid 居中 === */
.center-grid {
    display: grid;
    place-items: center;
}

/* === 方案3：绝对定位 + transform === */
.center-absolute {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

/* === 方案4：绝对定位 + margin auto（需要宽高）=== */
.center-margin {
    position: absolute;
    inset: 0;
    margin: auto;
    width: fit-content;
    height: fit-content;
}

/* === 方案5：table-cell === */
.center-table {
    display: table-cell;
    text-align: center;
    vertical-align: middle;
}
```

### 技巧 2：完美三角形

```css
/* 不使用 border hack，用 clip-path */
.triangle {
    width: 100px;
    height: 100px;
    background: red;
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}

/* 对话框箭头 */
.bubble {
    position: relative;
    background: #fff;
    border: 1px solid #ccc;
}
.bubble::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 20px;
    width: 10px;
    height: 10px;
    background: #fff;
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    transform: rotate(45deg);
}
```

### 技巧 3：滚动吸附（纯 CSS 轮播）

```css
.carousel {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
}
.carousel > * {
    flex: 0 0 100%;
    scroll-snap-align: start;
}
```

### 技巧 4：粘性页脚

```css
html { height: 100%; }
body {
    min-height: 100%;
    display: flex;
    flex-direction: column;
}
main { flex: 1; } /* 主内容区自动撑满 */
footer { flex-shrink: 0; }
```

### 技巧 5：backdrop-filter 毛玻璃

```css
.glass {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px) saturate(180%);
    -webkit-backdrop-filter: blur(10px) saturate(180%);
}
```

### 技巧 6：遮罩层 + 内容锁定

```css
body:has(.modal.open) {
    overflow: hidden; /* 打开弹窗时禁止背景滚动 */
}

.overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
}
```

### 技巧 7：宽高比容器（旧浏览器兼容）

```css
/* 如果不能用 aspect-ratio */
.ratio-box {
    position: relative;
    width: 100%;
    padding-bottom: 56.25%; /* 16:9 */
}
.ratio-box > * {
    position: absolute;
    inset: 0;
}
```

> 💡 **定位口诀**：`relative` 当参考，`absolute` 找爸爸，`fixed` 钉视口，`sticky` 贴门槛。
