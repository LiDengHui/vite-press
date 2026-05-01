---
title: CSS 工具类系统
date: 2025-04-29
tags:
  - CSS
  - 工程化
categories:
  - 技术文档
  - 前端
  - CSS
  - 工程化
---

# CSS 工具类系统

工具类（Utility Classes）通过原子化的类名直接控制单一属性，配合组件类实现快速开发。

---

## 一、间距工具

```css
/* margin */
.m-0  { margin: 0; }
.m-4  { margin: 4px; }
.m-8  { margin: 8px; }
.m-16 { margin: 16px; }
.m-24 { margin: 24px; }
.m-32 { margin: 32px; }

.mt-8  { margin-top: 8px; }
.mr-8  { margin-right: 8px; }
.mb-8  { margin-bottom: 8px; }
.ml-8  { margin-left: 8px; }
.mx-8  { margin-left: 8px; margin-right: 8px; }
.my-8  { margin-top: 8px; margin-bottom: 8px; }

/* padding */
.p-0  { padding: 0; }
.p-4  { padding: 4px; }
.p-8  { padding: 8px; }
.p-16 { padding: 16px; }
.p-24 { padding: 24px; }

.pt-8  { padding-top: 8px; }
.pr-8  { padding-right: 8px; }
.pb-8  { padding-bottom: 8px; }
.pl-8  { padding-left: 8px; }
.px-8  { padding-left: 8px; padding-right: 8px; }
.py-8  { padding-top: 8px; padding-bottom: 8px; }

/* 自动 margin */
.ml-auto { margin-left: auto; }
.mr-auto { margin-right: auto; }
.mx-auto { margin-left: auto; margin-right: auto; }
```

---

## 二、布局工具

```css
/* display */
.block        { display: block; }
.inline       { display: inline; }
.inline-block { display: inline-block; }
.flex         { display: flex; }
.inline-flex  { display: inline-flex; }
.grid         { display: grid; }
.hidden       { display: none; }

/* flex */
.flex-row     { flex-direction: row; }
.flex-col     { flex-direction: column; }
.flex-wrap    { flex-wrap: wrap; }
.flex-nowrap  { flex-wrap: nowrap; }

.justify-start   { justify-content: flex-start; }
.justify-center  { justify-content: center; }
.justify-end     { justify-content: flex-end; }
.justify-between { justify-content: space-between; }
.justify-around  { justify-content: space-around; }

.items-start    { align-items: flex-start; }
.items-center   { align-items: center; }
.items-end      { align-items: flex-end; }
.items-stretch  { align-items: stretch; }

.flex-1 { flex: 1 1 0%; }
.flex-none { flex: none; }

/* grid */
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.col-span-2  { grid-column: span 2 / span 2; }
.gap-8  { gap: 8px; }
.gap-16 { gap: 16px; }
```

---

## 三、尺寸工具

```css
/* width */
.w-full  { width: 100%; }
.w-screen { width: 100vw; }
.w-auto  { width: auto; }
.w-0     { width: 0; }
.w-1\/2  { width: 50%; }
.w-1\/3  { width: 33.333%; }
.w-1\/4  { width: 25%; }

/* height */
.h-full  { height: 100%; }
.h-screen { height: 100vh; }
.h-auto  { height: auto; }

/* min/max */
.min-h-screen { min-height: 100vh; }
.max-w-full   { max-width: 100%; }
.max-w-1200   { max-width: 1200px; }
```

---

## 四、文本工具

```css
/* 字号 */
.text-xs   { font-size: 12px; }
.text-sm   { font-size: 14px; }
.text-base { font-size: 16px; }
.text-lg   { font-size: 18px; }
.text-xl   { font-size: 20px; }
.text-2xl  { font-size: 24px; }

/* 字重 */
.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-bold   { font-weight: 700; }

/* 对齐 */
.text-left   { text-align: left; }
.text-center { text-align: center; }
.text-right  { text-align: right; }

/* 颜色 */
.text-primary { color: #1890ff; }
.text-success { color: #52c41a; }
.text-warning { color: #faad14; }
.text-danger  { color: #ff4d4f; }
.text-muted   { color: #999; }

/* 截断 */
.truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
```

---

## 五、视觉工具

```css
/* 背景 */
.bg-white   { background: #fff; }
.bg-gray    { background: #f5f5f5; }
.bg-primary { background: #1890ff; }

/* 边框 */
.border        { border: 1px solid #d9d9d9; }
.border-t      { border-top: 1px solid #d9d9d9; }
.rounded       { border-radius: 4px; }
.rounded-lg    { border-radius: 8px; }
.rounded-full  { border-radius: 9999px; }

/* 阴影 */
.shadow-sm   { box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
.shadow      { box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.shadow-lg   { box-shadow: 0 8px 24px rgba(0,0,0,0.15); }

/* 不透明度 */
.opacity-0   { opacity: 0; }
.opacity-50  { opacity: 0.5; }
.opacity-100 { opacity: 1; }

/* 圆角 */
.rounded-none { border-radius: 0; }
.rounded-sm   { border-radius: 2px; }
.rounded      { border-radius: 4px; }
.rounded-md   { border-radius: 6px; }
.rounded-lg   { border-radius: 8px; }
.rounded-xl   { border-radius: 12px; }
.rounded-full { border-radius: 9999px; }
```

---

## 六、交互工具

```css
/* 光标 */
.cursor-pointer { cursor: pointer; }
.cursor-default { cursor: default; }
.cursor-not-allowed { cursor: not-allowed; }

/* 选择 */
.select-none { user-select: none; }
.select-text { user-select: text; }

/* 指针事件 */
.pointer-events-none { pointer-events: none; }
.pointer-events-auto { pointer-events: auto; }

/* 过渡 */
.transition { transition: all 0.2s ease; }
.transition-colors { transition: color 0.2s, background 0.2s, border-color 0.2s; }
```

---

## 七、定位工具

```css
.relative { position: relative; }
.absolute { position: absolute; }
.fixed    { position: fixed; }
.sticky   { position: sticky; }

.inset-0  { inset: 0; }
.top-0    { top: 0; }
.right-0  { right: 0; }
.bottom-0 { bottom: 0; }
.left-0   { left: 0; }

.z-0   { z-index: 0; }
.z-10  { z-index: 10; }
.z-50  { z-index: 50; }
.z-auto { z-index: auto; }
```

---

## 八、响应式前缀

```css
/* 基础 */
.hidden { display: none; }
.block  { display: block; }

/* 断点 */
@media (min-width: 640px) {
    .sm\:hidden { display: none; }
    .sm\:block  { display: block; }
    .sm\:flex   { display: flex; }
}
@media (min-width: 768px) {
    .md\:hidden { display: none; }
    .md\:block  { display: block; }
    .md\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (min-width: 1024px) {
    .lg\:hidden { display: none; }
    .lg\:block  { display: block; }
    .lg\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
```

---

## 奇淫技巧

### 技巧 1：工具类 + 组件类组合

```html
<!-- 工具类快速原型 -->
<button class="px-16 py-8 bg-primary text-white rounded font-medium hover:bg-blue-600">
    提交
</button>

<!-- 提取为组件类 -->
<style>
.btn {
    @apply px-16 py-8 bg-primary text-white rounded font-medium;
}
.btn:hover { @apply bg-blue-600; }
</style>
```

### 技巧 2：CSS 变量驱动的工具类

```css
:root {
    --space-unit: 4px;
    --color-primary: #1890ff;
}
.gap-1 { gap: calc(var(--space-unit) * 1); }
.gap-2 { gap: calc(var(--space-unit) * 2); }
.gap-4 { gap: calc(var(--space-unit) * 4); }
```

### 技巧 3：条件类名策略

```css
/* 用属性选择器做状态 */
[data-state="loading"] .spinner { display: block; }
[data-state="error"] .error-msg { display: block; }
[data-state="success"] .success-msg { display: block; }
```

### 技巧 4：工具类的 `!important` 策略

```css
/* utilities 层加 !important 确保覆盖 */
@layer utilities {
    .text-center { text-align: center !important; }
    .hidden { display: none !important; }
}
```

### 技巧 5：容器查询工具类

```css
@container (min-width: 400px) {
    .\@md\:flex { display: flex; }
    .\@md\:hidden { display: none; }
}
```

### 技巧 6：逻辑属性工具类

```css
.ms-8 { margin-inline-start: 8px; }
.me-8 { margin-inline-end: 8px; }
.ps-8 { padding-inline-start: 8px; }
.pe-8 { padding-inline-end: 8px; }
```

### 技巧 7：深色模式工具类

```css
@media (prefers-color-scheme: dark) {
    .dark\:bg-dark { background: #1a1a1a; }
    .dark\:text-light { color: #f0f0f0; }
}
```

### 技巧 8：动态工具类生成（CSS-in-JS）

```js
// 根据设计 token 自动生成
const spacing = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64];
spacing.forEach(s => {
    // 生成 .m-${s} { margin: ${s}px; }
    // 生成 .p-${s} { padding: ${s}px; }
});
```

### 技巧 9：堆叠 z-index 系统

```css
.z-dropdown { z-index: 1000; }
.z-sticky   { z-index: 1020; }
.z-fixed    { z-index: 1030; }
.z-modal-backdrop { z-index: 1040; }
.z-modal    { z-index: 1050; }
.z-popover  { z-index: 1060; }
.z-tooltip  { z-index: 1070; }
```

### 技巧 10：宽高比工具类

```css
.aspect-video { aspect-ratio: 16 / 9; }
.aspect-square { aspect-ratio: 1 / 1; }
.aspect-4-3 { aspect-ratio: 4 / 3; }
```

> 💡 **工具类口诀**：间距 m/p，布局 flex/grid，尺寸 w/h，文本 text，视觉 bg/border/shadow，定位 absolute/fixed/sticky，响应 sm/md/lg。
