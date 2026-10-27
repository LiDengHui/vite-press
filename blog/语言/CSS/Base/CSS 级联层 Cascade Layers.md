---
title: CSS 级联层 Cascade Layers
date: 2025-04-29
tags:
  - CSS
  - "@layer"
  - 层叠层
  - 级联层
  - 现代特性
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

/* 未分层的普通样式优先级最高 */
.box { color: blue; }

/* 最终颜色：蓝色 */
```

> 这条“未分层最高”只适用于普通声明；一旦加上 `!important`，关系就反过来：层内的 `!important` 高于未分层的 `!important`。

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

## 进阶：层在级联算法中的位置

层不是“更高级的选择器”，而是插在**来源与重要性**之后、**特异性**之前的一道排序规则。浏览器处理冲突的顺序是：

1. 相关性（选择器是否匹配、媒体查询是否成立）
2. 来源与重要性（浏览器 / 用户 / 作者，普通 / `!important`）
3. 层叠层（普通声明后层优先，`!important` 反转）
4. 特异性
5. `@scope` 作用域距离
6. 源码顺序

把层代进去，完整的优先级从低到高是：

| 顺序 | 声明 | 说明 |
| ---: | --- | --- |
| 1 | 浏览器默认样式：最早层 → 最晚层 → 未分层 | 最低 |
| 2 | 用户样式：最早层 → 最晚层 → 未分层 | 浏览器扩展、用户样式表 |
| 3 | 作者普通样式：最早层 → 最晚层 → 未分层 → 行内 `style` | 未分层普通样式高于所有普通层 |
| 4 | CSS 动画（`@keyframes`） | 高于所有普通声明 |
| 5 | 作者 `!important`：未分层 → 最晚层 → 最早层 → 行内 `!important` | 层顺序反转，行内最高 |
| 6 | 用户 `!important` | |
| 7 | 浏览器 `!important` | |
| 8 | CSS 过渡（`transition`） | 最高，连 `!important` 也能压过 |

> 记忆口诀：**普通声明“层内低于层外、后层高于前层”；`!important` 完全反转“层内高于层外、前层高于后层”；行内在作者来源里最高；动画压普通，过渡压一切。**

同一层内部才比较特异性、`@scope` 距离和源码顺序。所以“层”不能替代特异性计算，它只是先把声明分桶。

### 层顺序在首次出现时确定

```css
/* 推荐：先声明顺序，再写规则 */
@layer reset, base, components, utilities;

@layer base { /* ... */ }
@layer utilities { /* ... */ }
```

```css
/* 顺序由“首次出现”决定 */
@layer b;
@layer a;

/* 此时顺序已经是 b → a，再写 a → b 也不会重排 */
@layer a, b;

@layer a { .box { color: red; } }
@layer b { .box { color: blue; } }

/* 最终颜色：红色（a 在 b 之后） */
```

只声明、不写规则也是合法的，常用来提前锁定顺序：

```css
@layer vendor, app; /* 只声明顺序 */
```

### 匿名层的排序

```css
@layer a;

@layer {
  .box { color: orange; } /* 匿名层：按出现位置参与排序 */
}

@layer b;

/* 顺序：a → 匿名层 → b */
```

- 每个 `@layer { ... }` 都是一个独立的匿名层。
- 匿名层无法在别处追加规则，也无法用名字引用。
- 匿名层同样低于所有未分层普通样式。

### 嵌套层的比较规则

```css
@layer framework, app;

@layer framework {
  @layer base, components;

  @layer base {
    .btn { padding: 0.5rem 1rem; }
  }

  @layer components {
    .btn { background: blue; }
  }
}

/* 点号写法等价于嵌套，引用的是同一个子层 */
@layer framework.components {
  .btn-primary { background: green; }
}

@layer app {
  .btn { background: purple; }
}
```

关键点：

- 顶层比较时，`framework` 整体只占一个位置；`framework.base → framework.components` 只在 `framework` 内部比较。
- 子层的全名是 `framework.base`、`framework.components`，不能只写 `@layer components` 去引用。
- 上例中 `app` 在 `framework` 之后声明，所以 `app` 里的 `.btn` 会覆盖 `framework.components` 里的 `.btn`，哪怕选择器特异性更低。
- 写在 `@layer framework { ... }` 块里的规则都属于 `framework`；只有层块之外的规则才是“未分层”。

### revert-layer：回退到上一层

```css
@layer base, theme;

@layer base {
  .button { color: navy; }
}

@layer theme {
  .button { color: white; }
  .button.ghost { color: revert-layer; } /* 回退到 base 的 navy */
}
```

- `revert-layer`：回退到当前来源中**上一层**的值；如果没有更早的层，继续回退到用户 / 浏览器来源。
- `revert`：直接回退到上一个**来源**，会跳过作者来源里的所有层。
- 在层外使用 `revert-layer` 时，它会忽略 HTML 表现性属性（如 `width`、`height` 属性），直接回退到用户 / 浏览器样式。
- 常见用法：组件层里“取消主题色”，让基础层或浏览器默认样式接管。
- `all: revert-layer` 可以批量回退某个元素的全部属性；但 `all` 不会重置 `direction`、`unicode-bidi` 和自定义属性。

### @import 与层

```css
/* 必须写在其他规则之前，@charset 和 @layer 语句除外 */
@import url('reset.css') layer(reset);
@import url('bootstrap.css') layer(vendor);
@import url('legacy.css') layer; /* 不带括号：放入匿名层 */

@layer reset, vendor, app;

@layer app {
  .btn { border-radius: 12px; }
}
```

```css
/* ❌ 错误：@import 不能写在 @layer 块里 */
@layer vendor {
  @import url('bootstrap.css');
}

/* ✅ 正确：导入时就指定层 */
@import url('bootstrap.css') layer(vendor);
```

`@import` 是串行加载，生产环境更推荐用构建工具合并样式；`<link>` 目前没有标准的 `layer` 属性，网上把 `<link layer="...">` 当通用方案的示例不可靠。

### 用 CSSOM 查看层

```js
const sheet = document.styleSheets[0];

for (const rule of sheet.cssRules) {
  if (rule instanceof CSSLayerStatementRule) {
    console.log('层声明顺序：', rule.nameList);
  }

  if (rule instanceof CSSLayerBlockRule) {
    console.log('层内容：', rule.name || '(匿名层)', rule.cssRules.length);
  }
}
```

- `CSSLayerStatementRule.nameList`：对应 `@layer a, b;` 的层名数组。
- `CSSLayerBlockRule.name`：对应 `@layer a { ... }`，匿名层为空字符串。
- DevTools 的 Styles 面板会在规则旁标出所属层；不要把它和 Layers 面板（层叠上下文 / 合成层）混淆。

### 常见坑

1. **未分层样式压过所有普通层**：把第三方样式导入层后，自己的样式也要放进层里，否则“未分层”会直接赢。
2. **`!important` 反转层顺序**：越早声明的层，`!important` 优先级越高；行内 `!important` 仍然是作者来源最高。
3. **层不改变同层内的特异性**：同一层里 `#id` 依然压过 `.class`，需要时配合 `:where()` 降权。
4. **行内样式在层外**：普通行内样式压过所有普通层；要覆盖它必须用 `!important`，而行内 `!important` 又是作者来源中最高的。
5. **动画和过渡不受层控制**：动画高于普通声明，过渡高于 `!important`；同名的 `@keyframes` 只取优先级最高的那一组。
6. **先声明顺序再写规则**：依赖“首次出现”隐式排序，重构时很容易被无意间改变。
7. **层不跨 Shadow DOM / iframe**：每个文档、每个 Shadow Root 都有独立的层顺序。

### 框架实例：Tailwind CSS v4

Tailwind CSS v4 直接用自己的输出示范了层顺序：

```css
@layer theme, base, components, utilities;

@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);
@import "tailwindcss/utilities.css" layer(utilities);
```

- `utilities` 是最后一层，所以工具类天然压过 `base` 和 `components`，不需要靠特异性或 `!important`。
- 未分层的自定义 CSS 仍然压过 `utilities` 层，这既方便覆盖，也可能让工具类“失效”；需要稳定覆盖时，把自定义规则放进 `components` 或 `utilities` 层。

### 迁移清单

1. 在入口 CSS 顶部写出 `@layer` 顺序声明。
2. 把 reset、第三方库放进最低层（如 `reset`、`vendor`）。
3. 业务样式按 `base → components → utilities` 分层。
4. 盘点现有 `!important`，优先用层顺序解决，而不是继续加权重。
5. 保留少量未分层样式作为最终兜底，或单独设一个 `overrides` 层。
6. 检查所有 `@import` 是否在规则之前，层名是否拼写一致。

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

### 用层组织主题

层只负责覆盖顺序，不是可以开关的“主题包”。主题切换仍然靠选择器换变量：

```css
@layer tokens, theme;

@layer tokens {
  :root {
    --bg: white;
    --text: black;
  }
}

@layer theme {
  :root[data-theme='dark'] {
    --bg: #1a1a1a;
    --text: white;
  }
}
```

```js
document.documentElement.dataset.theme = 'dark';
```

> 层一旦声明就会一直参与级联，不能通过切换类“激活”某一层；切换的始终是选择器命中的那组变量。

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

> `@layer` 放在条件规则里时，只有条件成立时该层才参与排序；条件来回切换会让层顺序变得难以预测。推荐先在顶层用 `@layer` 语句锁定顺序，再把条件写在层内部。

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

同一层内部，特异性照常生效：

```css
@layer components {
  #submit { color: red; }  /* 特异性更高，胜出 */
  .btn { color: blue; }
}
```

层只决定“跨层谁赢”，不会把同层内的选择器拉平。

### 层内写媒体查询

```css
@layer responsive {
  @media (max-width: 768px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
}
```

`@layer` 也可以包住 `@media`、`@supports`、`@container` 等条件规则；层归属按声明所在的层块计算，不看嵌套了几层条件。

### 层与 @scope 组合

```css
@layer components {
  @scope (.card) {
    :scope {
      border-radius: 8px;
    }

    img {
      border-radius: 8px 8px 0 0;
    }
  }
}
```

层负责跨组件的覆盖顺序，`@scope` 负责组件内部的匹配边界，两者解决的是不同问题。`@scope` 的详细用法见 [CSS 作用域 @scope](./CSS%20作用域%20@scope.md)。

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| `@layer` | 99+ | 15.4+ | 97+ | 99+ |
| `@import layer()` | 99+ | 15.4+ | 97+ | 99+ |
| 嵌套层 | 99+ | 15.4+ | 97+ | 99+ |
| `revert-layer` | 99+ | 15.4+ | 97+ | 99+ |
| `CSSLayerBlockRule` / `CSSLayerStatementRule` | 99+ | 15.4+ | 97+ | 99+ |

> `<link rel="stylesheet" layer="...">` 并不是已标准化的通用能力，需要给外部样式表分层时优先使用 `@import url(...) layer(...)`，或在构建阶段把规则包进 `@layer`。

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
```

```html
<!-- 无需 !important -->
<div class="card hidden"></div>
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
@layer base, variant;

@layer base {
  .experiment {
    --primary: blue;
    --border-radius: 4px;
  }
}

@layer variant {
  .experiment[data-variant='b'] {
    --primary: green;
    --border-radius: 12px;
  }
}
```

```js
document.querySelector('.experiment').dataset.variant = 'b';
```

> 不要靠“动态调整层顺序”做 A/B；层顺序在首次出现时就固定了。用属性 / 类选择器切换变量，层只负责让 `variant` 稳定覆盖 `base`。

### 技巧五：读取层顺序而不是运行时重排

```js
function getLayerOrder(sheet) {
  const names = [];

  for (const rule of sheet.cssRules) {
    if (rule instanceof CSSLayerStatementRule) {
      names.push(...rule.nameList);
    }
  }

  return names;
}

console.log(getLayerOrder(document.styleSheets[0]));
// ['reset', 'base', 'components', 'utilities']
```

> 不要试图用 JS 在样式表末尾插入 `@layer a, b;` 来重排已有层——层的顺序在首次出现时就固定了，后补声明不会移动它们。主题切换应该通过切换 `data-theme` / class，在固定层内换变量。

### 技巧六：运行时新增层

```js
const style = document.createElement('style');
style.textContent = `
  @layer dynamic {
    .modal { animation: fade-in 0.3s; }
  }
`;
document.head.append(style);
```

> 如果 `dynamic` 是全新的层名，它会被追加到已有层之后，优先级最高；如果层名已存在，规则只是追加进去，顺序不变。运行时可以“加层”，但不能“重排层”。

### 技巧七：临时 debug 层

```css
/* 在入口顺序末尾追加 debug 层 */
@layer reset, base, components, debug;

@layer debug {
  * {
    outline: 1px solid red;
  }
}
```

> 只适合临时排查，提交前删除；长期保留会污染样式优先级。

## 总结

CSS 级联层为样式优先级管理提供了革命性的解决方案：

1. **核心能力**：显式声明样式优先级层级，层优先于特异性
2. **主要优势**：消除特异性战争，减少对 `!important` 的依赖
3. **完整顺序**：普通声明“后层优先、未分层最高”；`!important` 反转；行内最高；过渡压一切
4. **架构模式**：ITCSS、设计系统、第三方集成、Tailwind v4
5. **关键概念**：层顺序首次确定、嵌套层、匿名层、`revert-layer`
6. **兼容性**：现代浏览器广泛支持

## 参考资源

- [MDN: @layer](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@layer)
- [MDN: CSS 层叠](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_cascade/Cascade)
- [CSS-Tricks: Cascade Layers](https://css-tricks.com/css-cascade-layers/)
- [W3C: CSS Cascading and Inheritance Level 5](https://www.w3.org/TR/css-cascade-5/)
