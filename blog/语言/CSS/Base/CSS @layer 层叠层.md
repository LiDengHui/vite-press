---
title: CSS @layer 层叠层
date: 2025-04-29
tags:
  - CSS
  - "@layer"
  - 层叠层
  - 现代特性
categories:
  - 技术文档
  - 前端
  - CSS
  - 现代特性
---

# CSS @layer 层叠层

[[toc]]

CSS 层叠层（Cascade Layers）允许开发者将样式分组为不同的**优先级层**。在同一层内，特异性（Specificity）决定优先级；跨层时，层的声明顺序决定优先级——**层的优先级始终高于特异性**。

---

## 基础语法

### 定义层

```css
@layer base {
  /* 基础样式 */
  body {
    margin: 0;
    font-family: system-ui, sans-serif;
  }
}

@layer components {
  /* 组件样式 */
  .btn {
    padding: 0.5rem 1rem;
    border-radius: 4px;
  }
}

@layer utilities {
  /* 工具类 */
  .text-center {
    text-align: center;
  }
}
```

### 层的优先级

```css
/* 层的宣告顺序决定优先级：后声明的层优先级更高 */
@layer base, components, utilities;

@layer base {
  .title { color: blue; }    /* 优先级最低 */
}

@layer utilities {
  .title { color: red; }     /* 优先级最高 */
}
```

### 匿式层（Anonymous Layer）

```css
/* 未命名的层，在显式层之后 */
@layer {
  .special { font-weight: bold; }
}
```

---

## 层与特异性

### 特异性在同层内生效

```css
@layer components {
  /* 特异性相同，后者覆盖前者 */
  .btn { background: blue; }
  .btn { background: green; }  /* 生效 */

  /* 特异性高者优先 */
  #submit-btn { background: red; }  /* 生效（特异性更高） */
}
```

### 层优先级压制特异性

```css
@layer base {
  #nav a { color: blue; }  /* 特异性很高 */
}

@layer components {
  .nav-link { color: red; }  /* 特异性低，但层优先级更高 */
}

/* 最终 .nav-link 的 color: red 生效 */
```

### !important 在层中的行为

```css
@layer base {
  .btn { color: blue !important; }
}

@layer components {
  .btn { color: red; }
}

/* !important 在层内仍然生效，但跨层时趋势反转 */
```

---

## 实际应用

### 框架样式管理

```css
@layer reset, base, components, utilities, overrides;

@layer reset {
  /* 重置浏览器默认样式 */
  * { margin: 0; padding: 0; box-sizing: border-box; }
}

@layer base {
  /* 项目基础样式 */
  body { font-family: system-ui, sans-serif; line-height: 1.6; }
}

@layer components {
  /* 组件样式 */
  .card { border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
}

@layer utilities {
  /* 工具类 */
  .hidden { display: none; }
  .flex { display: flex; }
}

@layer overrides {
  /* 临时覆盖，优先级最高 */
}
```

### 外部库样式隔离

```css
@layer third-party, my-app;

/* 将第三方库放入低优先级层 */
@import url('bootstrap.css') layer(third-party);
@import url('tailwind.css') layer(third-party);

@layer my-app {
  /* 自己的样式优先级更高 */
  .btn { /* 覆盖 Bootstrap 按钮样式 */ }
}
```

---

## @import 带 layer

```css
@import url('reset.css') layer(reset);
@import url('theme.css') layer(theme);
@import url('components.css') layer(components);

/* 声明层的优先级顺序 */
@layer reset, theme, components;
```

---

## 浏览器兼容性

| 特性 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| @layer | 99+ | 15.4+ | 97+ | 99+ |
| @import layer() | 99+ | 15.4+ | 97+ | 99+ |

---

## 奇淫技巧

### 技巧一：运行时动态添加层

```js
// 通过 JS 动态将样式放入层
const style = document.createElement('style');
style.textContent = `
  @layer dynamic {
    .modal { animation: fade-in 0.3s; }
  }
`;
document.head.appendChild(style);
```

### 技巧二：层内嵌套层

```css
@layer framework {
  @layer base, components;

  @layer base {
    /* 框架基础 */
  }

  @layer components {
    /* 框架组件 */
  }
}

@layer app {
  /* 应用层，优先级高于 framework */
}
```

### 技巧三：层与 @scope 结合

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

### 技巧四：层内媒体查询

```css
@layer responsive {
  @media (max-width: 768px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
}
```

### 技巧五：层优先级调试

```css
/* 检查层的实际优先级 */
@layer debug {
  * {
    outline: 1px solid red;
  }
}

/* 将 debug 层放在最后，确保生效 */
@layer reset, base, components, debug;
```

---

## 参考资料

- [MDN @layer](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@layer)
- [MDN Cascade Layers](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_cascade/Cascade)
- [CSS-Tricks: A Complete Guide to CSS Cascade Layers](https://css-tricks.com/css-cascade-layers/)
