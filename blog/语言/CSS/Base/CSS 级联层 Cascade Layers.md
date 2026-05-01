---
title: CSS 级联层 Cascade Layers
date: 2025-04-29
tags:
  - CSS
categories:
  - 技术文档
  - 前端
  - CSS
  - 基础入门
---

# CSS 级联层 Cascade Layers

[[toc]]

CSS 级联层（`@layer`）允许开发者将样式规则组织成明确的层级，精确控制样式的优先级顺序。这是解决 CSS 特异性战争和样式冲突的革命性特性。

## 为什么需要级联层

### 传统问题

```css
/* 第三方库 */
.btn { background: blue; }

/* 业务代码 */
.btn { background: green; } /* 需要更高的特异性才能覆盖 */

/* 主题覆盖 */
.btn { background: red !important; } /* 无奈使用 !important */
```

### 级联层解决方案

```css
@layer base, components, utilities;

/* 基础层 */
@layer base {
  .btn { background: gray; }
}

/* 组件层 */
@layer components {
  .btn { background: blue; }
}

/* 工具层 */
@layer utilities {
  .btn { background: green; }
}

/* 结果：工具层优先级最高，无需 !important */
```

## 基础语法

### 声明层级

```css
/* 声明层级顺序（后面的优先级更高） */
@layer reset, base, components, utilities;

/* 定义各层 */
@layer reset {
  *, *::before, *::after {
    margin: 0;
    padding: 0;
  }
}

@layer base {
  body {
    font-family: system-ui, sans-serif;
    line-height: 1.5;
  }
}

@layer components {
  .card {
    border: 1px solid #ddd;
    border-radius: 8px;
  }
}

@layer utilities {
  .text-center { text-align: center; }
  .hidden { display: none; }
}
```

### 匿名层

```css
/* 未命名的层 */
@layer {
  .special { color: red; }
}

/* 匿名层之间按定义顺序 */
@layer { .a { color: red; } }
@layer { .a { color: blue; } } /* 优先级更高 */
```

### 嵌套层

```css
@layer framework {
  @layer base {
    .btn { padding: 0.5rem 1rem; }
  }
  
  @layer components {
    .btn-primary { background: blue; }
  }
}

/* 引用嵌套层 */
@layer framework.components {
  .btn-secondary { background: green; }
}
```

## 层级优先级

### 基本规则

```css
@layer a, b, c;

@layer a { .box { color: red; } }
@layer b { .box { color: green; } }
@layer c { .box { color: blue; } }

/* 最终颜色：蓝色（c 层优先级最高） */
```

### 未分层样式

```css
@layer base, components;

@layer base { .box { color: red; } }
@layer components { .box { color: green; } }

/* 未分层样式优先级最高 */
.box { color: blue; }

/* 最终颜色：蓝色 */
```

### !important 反转

```css
@layer a, b;

@layer a {
  .box { color: red !important; }  /* 反转后优先级更高 */
}

@layer b {
  .box { color: blue !important; } /* 反转后优先级更低 */
}

/* 最终颜色：红色 */
```

## 实战架构

### ITCSS + 级联层

```css
@layer reset, base, objects, components, utilities, overrides;

/* 1. 重置 */
@layer reset {
  /* Normalize / Reset */
}

/* 2. 基础 */
@layer base {
  /* HTML 元素默认样式 */
}

/* 3. 对象 */
@layer objects {
  /* OOCSS 对象 */
}

/* 4. 组件 */
@layer components {
  /* UI 组件 */
}

/* 5. 工具类 */
@layer utilities {
  /* 原子类 */
}

/* 6. 覆盖 */
@layer overrides {
  /* 第三方覆盖 */
}
```

### 框架集成

```css
/* 第三方 CSS */
@import url('bootstrap.css') layer(bootstrap);
@import url('tailwind.css') layer(tailwind);

/* 自定义层 */
@layer bootstrap, tailwind, custom;

@layer custom {
  /* 覆盖第三方样式 */
  .btn { border-radius: 12px; }
}
```

### 组件层管理

```css
@layer design-system, app-components, page-specific;

/* 设计系统 */
@layer design-system {
  .ds-button {
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
  }
}

/* 应用组件 */
@layer app-components {
  .app-button {
    /* 继承 ds-button，可覆盖 */
    background: var(--primary-color);
  }
}

/* 页面特定 */
@layer page-specific {
  .page-home .app-button {
    /* 最高优先级 */
    background: linear-gradient(...);
  }
}
```

## 高级用法

### 动态层

```css
/* 使用层管理主题 */
@layer theme-light, theme-dark;

@layer theme-light {
  :root {
    --bg: white;
    --text: black;
  }
}

@layer theme-dark {
  :root {
    --bg: black;
    --text: white;
  }
}

/* 通过切换类激活不同层（需要 JS 配合） */
```

### 条件层

```css
/* 特性查询中的层 */
@supports (container-type: inline-size) {
  @layer container-queries {
    .card {
      container-type: inline-size;
    }
  }
}

/* 媒体查询中的层 */
@media (prefers-color-scheme: dark) {
  @layer dark-mode {
    :root {
      --bg: #1a1a1a;
    }
  }
}
```

### 层与特异性

```css
@layer low, high;

/* 即使特异性低，高层优先级更高 */
@layer low {
  #id .class { color: red; } /* 特异性 1,1,0 */
}

@layer high {
  .class { color: blue; } /* 特异性 0,1,0 */
}

/* 最终颜色：蓝色（high 层优先） */
```

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| `@layer` | 99+ | 15.4+ | 97+ | 99+ |
| `@import layer()` | 99+ | 15.4+ | 97+ | 99+ |
| 嵌套层 | 99+ | 15.4+ | 97+ | 99+ |

## 奇淫技巧

### 技巧一：无 !important 工具类

```css
@layer reset, base, components, utilities;

@layer utilities {
  /* 这些工具类天然优先级最高 */
  .hidden { display: none; }
  .block { display: block; }
  .flex { display: flex; }
  .text-red { color: red; }
  .text-blue { color: blue; }
}

/* 使用 */
<div class="card hidden"> /* 无需 !important */
```

### 技巧二：第三方样式隔离

```css
/* 将第三方样式限制在低优先级层 */
@import url('vendor.css') layer(vendor);

/* 自己的样式在高优先级层 */
@layer vendor, app;

@layer app {
  /* 轻松覆盖第三方样式 */
  .vendor-component {
    border-radius: 8px;
  }
}
```

### 技巧三：加载状态管理

```css
@layer skeleton, content;

@layer skeleton {
  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
}

@layer content {
  .loaded .skeleton {
    /* 内容层优先级更高，自动覆盖骨架屏 */
    background: none;
    animation: none;
  }
}
```

### 技巧四：A/B 测试

```css
@layer variant-a, variant-b;

@layer variant-a {
  .experiment {
    --primary: blue;
    --border-radius: 4px;
  }
}

@layer variant-b {
  .experiment {
    --primary: green;
    --border-radius: 12px;
  }
}

/* 通过 JS 动态调整层顺序 */
```

### 技巧五：层顺序 API

```js
// 获取样式表的层
const layers = document.styleSheets[0].cssRules;

// 程序化控制层
const style = document.createElement('style');
style.textContent = `
  @layer ${layerOrder.join(', ')};
`;
document.head.appendChild(style);
```

## 总结

CSS 级联层为样式优先级管理提供了革命性的解决方案：

1. **核心能力**：显式声明样式优先级层级
2. **主要优势**：消除特异性战争，减少对 `!important` 的依赖
3. **架构模式**：ITCSS、设计系统、第三方集成
4. **关键概念**：层顺序、`!important` 反转、嵌套层
5. **兼容性**：现代浏览器广泛支持

## 参考资源

- [MDN: @layer](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@layer)
- [CSS-Tricks: Cascade Layers](https://css-tricks.com/css-cascade-layers/)
- [W3C: CSS Cascading and Inheritance Level 5](https://www.w3.org/TR/css-cascade-5/)
