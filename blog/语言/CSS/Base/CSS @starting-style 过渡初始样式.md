---
title: CSS @starting-style 过渡初始样式
date: 2025-04-29
tags:
  - CSS
  - 过渡
  - 动画
  - 现代特性
categories:
  - 技术文档
  - 前端
  - CSS
  - 现代特性
---

# CSS @starting-style 过渡初始样式

[[toc]]

`@starting-style` 是 CSS Transitions Level 2 新增的规则，解决了一个长期困扰开发者的问题：**元素从 `display: none` 切换到 `display: block` 时无法触发过渡效果**。它允许定义元素初次进入文档树时的起始样式，从而实现出现/消失动画。

---

## 问题背景

### 传统过渡的局限

```css
.modal {
  display: none;
  opacity: 0;
  transition: opacity 0.3s;
}

.modal.open {
  display: block;
  opacity: 1;
  /* 从 display:none 切换到 display:block 时，过渡不会触发！ */
}
```

### 传统解决方案的局限

```css
/* 方案 1：使用 visibility + opacity */
.modal {
  visibility: hidden;
  opacity: 0;
  transition: visibility 0.3s, opacity 0.3s;
}

.modal.open {
  visibility: visible;
  opacity: 1;
}
/* 缺点：元素仍占据页面空间 */

/* 方案 2：使用 max-height */
.modal {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s;
}
/* 缺点：难以精确控制，内容高度变化时会出问题 */
```

---

## @starting-style 解决方案

### 基础用法

```css
.modal {
  display: none;
  opacity: 0;
  transform: scale(0.9);
  transition: opacity 0.3s, transform 0.3s, display 0.3s;

  @starting-style {
    opacity: 0;
    transform: scale(0.9);
  }
}

.modal.open {
  display: block;
  opacity: 1;
  transform: scale(1);
}
```

### 详细工作流程

1. 元素从 `display: none` 变为 `display: block`
2. 浏览器应用 `@starting-style` 中的样式作为**起始状态**
3. 元素过渡到最终状态

---

## 实际应用场景

### 弹窗打开动画

```css
.dialog {
  display: none;
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
  transition: 
    display 0.3s allow-discrete,
    opacity 0.3s,
    transform 0.3s;

  @starting-style {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
}

.dialog[open] {
  display: block;
  opacity: 1;
  transform: translateY(0) scale(1);
}
```

### Popover 显示动画

```html
<button popovertarget="menu">菜单</button>
<div id="menu" popover>
  <a href="#">首页</a>
  <a href="#">关于</a>
</div>
```

```css
[popover] {
  opacity: 0;
  transform: translateY(-10px);
  transition: 
    display 0.2s allow-discrete,
    opacity 0.2s,
    transform 0.2s;

  @starting-style {
    opacity: 0;
    transform: translateY(-10px);
  }
}

[popover]:popover-open {
  opacity: 1;
  transform: translateY(0);
}
```

### 消息提示条

```css
.toast {
  display: none;
  opacity: 0;
  transform: translateX(100%);
  transition: 
    display 0.3s allow-discrete,
    opacity 0.3s,
    transform 0.3s;

  @starting-style {
    opacity: 0;
    transform: translateX(100%);
  }
}

.toast.show {
  display: block;
  opacity: 1;
  transform: translateX(0);
}
```

### 下拉菜单

```css
.dropdown-menu {
  display: none;
  opacity: 0;
  transform-origin: top;
  transform: scaleY(0.8);
  transition: 
    display 0.2s allow-discrete,
    opacity 0.2s,
    transform 0.2s;

  @starting-style {
    opacity: 0;
    transform: scaleY(0.8);
  }
}

.dropdown:hover .dropdown-menu {
  display: block;
  opacity: 1;
  transform: scaleY(1);
}
```

---

## 与 allow-discrete 配合

### display 过渡关键字

```css
.animated-element {
  display: none;
  opacity: 0;
  /* 必须指定 allow-discrete 才能过渡 display */
  transition: display 0.3s allow-discrete, opacity 0.3s;

  @starting-style {
    opacity: 0;
  }
}

.animated-element.visible {
  display: block;
  opacity: 1;
}
```

### 多属性过渡

```css
.card-enter {
  display: none;
  opacity: 0;
  transform: translateY(30px) rotateX(10deg);
  filter: blur(4px);
  transition: 
    display 0.4s allow-discrete,
    opacity 0.4s,
    transform 0.4s,
    filter 0.4s;

  @starting-style {
    opacity: 0;
    transform: translateY(30px) rotateX(10deg);
    filter: blur(4px);
  }
}

.card-enter.show {
  display: block;
  opacity: 1;
  transform: translateY(0) rotateX(0);
  filter: blur(0);
}
```

---

## 消失动画

### 使用 transition-behavior

```css
.modal {
  display: block;
  opacity: 1;
  transition: 
    display 0.3s allow-discrete,
    opacity 0.3s;

  @starting-style {
    opacity: 0;
  }
}

.modal.hidden {
  display: none;
  opacity: 0;
}

/* 或使用 transition-behavior 全局配置 */
.animated {
  transition-behavior: allow-discrete;
  transition: display 0.3s, opacity 0.3s;
}
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| @starting-style | 117+ | 无 | 无 | 117+ |
| transition-behavior | 117+ | 无 | 无 | 117+ |
| allow-discrete | 117+ | 无 | 无 | 117+ |

> 注：目前仅 Chrome/Edge 117+ 支持。生产环境建议搭配 `@supports` 检测。

### 降级方案

```css
/* 检测支持 */
@supports (@starting-style {
  div { opacity: 0; }
}) {
  .modal {
    transition: display 0.3s allow-discrete, opacity 0.3s;

    @starting-style {
      opacity: 0;
    }
  }
}

/* 不支持时回退 */
@supports not (@starting-style {
  div { opacity: 0; }
}) {
  .modal {
    transition: opacity 0.3s;
  }

  .modal[open] {
    animation: fade-in 0.3s;
  }
}
```

---

## 奇淫技巧

### 技巧一：模态框增强动画

```css
dialog {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
  transition: 
    display 0.3s allow-discrete,
    overlay 0.3s allow-discrete,
    opacity 0.3s,
    transform 0.3s;

  @starting-style {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
}

dialog[open] {
  opacity: 1;
  transform: scale(1) translateY(0);
}

/* 遮罩层也可以过渡 */
dialog::backdrop {
  background: rgba(0,0,0,0);
  transition: background 0.3s;
}

dialog[open]::backdrop {
  background: rgba(0,0,0,0.5);
}
```

### 技巧二：循环显示的列表项

```css
.list-item {
  display: none;
  opacity: 0;
  transform: translateX(-20px);
  transition: 
    display 0.2s allow-discrete,
    opacity 0.2s,
    transform 0.2s;

  @starting-style {
    opacity: 0;
    transform: translateX(-20px);
  }
}

.list-item.visible {
  display: block;
  opacity: 1;
  transform: translateX(0);
}

/* 循环显示时逐个延迟 */
.list-item.visible:nth-child(1) { transition-delay: 0s; }
.list-item.visible:nth-child(2) { transition-delay: 0.1s; }
.list-item.visible:nth-child(3) { transition-delay: 0.2s; }
```

### 技巧三：表单验证错误显示

```css
.error-message {
  display: none;
  opacity: 0;
  max-height: 0;
  transition: 
    display 0.2s allow-discrete,
    opacity 0.2s,
    max-height 0.2s;

  @starting-style {
    opacity: 0;
    max-height: 0;
  }
}

.error-message.show {
  display: block;
  opacity: 1;
  max-height: 100px;
}
```

### 技巧四：可收折面板

```css
.collapsible {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition: 
    display 0.3s allow-discrete,
    grid-template-rows 0.3s,
    opacity 0.3s;

  @starting-style {
    grid-template-rows: 0fr;
    opacity: 0;
  }
}

.collapsible.open {
  grid-template-rows: 1fr;
  opacity: 1;
}

.collapsible > .content {
  overflow: hidden;
}
```

### 技巧五：退出动画协调

```css
.page-transition {
  display: block;
  opacity: 1;
  transition: 
    display 0.5s allow-discrete,
    opacity 0.5s;

  @starting-style {
    opacity: 0;
  }
}

.page-transition.exit {
  display: none;
  opacity: 0;
  /* 退出时自动过渡，无需 @starting-style */
}
```

---

## 参考资料

- [MDN @starting-style](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@starting-style)
- [MDN transition-behavior](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transition-behavior)
- [Chrome Developers: Four new CSS features](https://developer.chrome.com/blog/entry-exit-animations)
