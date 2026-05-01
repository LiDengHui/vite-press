---
title: LESS 基础语法说明书
date: 2025-04-29
tags:
  - CSS
categories:
  - 技术文档
  - 前端
  - CSS
  - 基础入门
---

# LESS 基础语法说明书

## 一、变量（Variables）

存储可复用的值（颜色、尺寸等）

```less
@primary-color: #3498db;
@font-size: 16px;

body {
    color: @primary-color;
    font-size: @font-size;
}
```

## 二、嵌套规则（Nesting）

嵌套选择器，清晰展示层级关系

```less
nav {
    ul {
        margin: 0;
        li {
            display: inline-block;
            a {
                color: red;
                &:hover {
                    // & 表示父选择器
                    text-decoration: underline;
                }
            }
        }
    }
}
```

编译为 CSS：

```css
nav ul {
    margin: 0;
}
nav ul li {
    display: inline-block;
}
nav ul li a {
    color: red;
}
nav ul li a:hover {
    text-decoration: underline;
}
```

## 三、混合（Mixins）

复用样式块（类似函数）

```less
// 定义混合
.bordered(@width: 1px) {
    // 带默认值的参数
    border: @width solid #ddd;
    border-radius: 4px;
}

// 使用混合
.card {
    .bordered(); // 使用默认值
}
.alert {
    .bordered(3px); // 传入参数
}
```

## 四、运算（Operations）

支持数值/颜色的数学运算

```less
@base-padding: 10px;
@dark-color: #222;

.container {
    padding: @base-padding * 2; // 20px
    background-color: @dark-color + #111; // #333
    width: 100% / 3; // 33.3333%
}
```

## 五、函数（Functions）

内置函数处理颜色/字符串等

```less
@color: #ff8800;

.header {
    background-color: lighten(@color, 20%); // 颜色变亮20%
    color: darken(@color, 30%); // 颜色变暗30%
    height: percentage(0.5); // 50%
}
```

## 六、导入（Importing）

模块化拆分代码

```less
// 导入 reset.less 文件
@import 'reset.less';
// 导入 variables.less
@import 'variables'; // 可省略扩展名
```

##

## 七、条件判断

```less
@mode: dark;

.section {
    & when (@mode = dark) {
        background: black;
    }
    & when (@mode = light) {
        background: white;
    }
}
```

## 八、循环生成样式

```less
.generate-columns(4); // 调用循环

.generate-columns(@n, @i: 1) when (@i <= @n) {
    .col-@{i} {
        width: (@i * 100% / @n);
    }
    .generate-columns(@n, (@i + 1)); // 递归调用
}
```

输出：

```css
.col-1 {
    width: 25%;
}
.col-2 {
    width: 50%;
}
.col-3 {
    width: 75%;
}
.col-4 {
    width: 100%;
}
```

---

## 九、注释

```less
/* 这是会编译到CSS的注释 */
// 这是单行注释（不会编译到CSS）
```

---

## 使用流程

1. 创建 `.less` 文件（如 `styles.less`）
2. 编译为 CSS：

    ```bash
    # 安装LESS编译器
    npm install less -g

    # 编译文件
    lessc styles.less styles.css
    ```

3. HTML 引入生成的 CSS 文件

> 提示：主流构建工具（Webpack/Vite）可通过 `less-loader` 自动编译

---

## 奇淫技巧

### 技巧 1：循环生成格子系统

```less
.generate-grid(@columns: 12) {
    .col-loop(@i: 1) when (@i <= @columns) {
        .col-@{i} {
            width: percentage(@i / @columns);
        }
        .col-loop(@i + 1);
    }
    .col-loop();
}
.generate-grid(12);
```

### 技巧 2：主题切换

```less
@theme: light;

.get-theme() when (@theme = light) {
    @bg: #fff;
    @text: #333;
}
.get-theme() when (@theme = dark) {
    @bg: #1a1a1a;
    @text: #f0f0f0;
}

.get-theme();
body {
    background: @bg;
    color: @text;
}
```

### 技巧 3：响应式 Mixins

```less
.responsive(@breakpoint, @rules) {
    @media (min-width: @breakpoint) {
        @rules();
    }
}

.card {
    width: 100%;
    .responsive(768px, {
        width: 50%;
    });
    .responsive(1200px, {
        width: 33.33%;
    });
}
```

### 技巧 4：角度计算

```less
.triangle(@size, @color) {
    width: 0; height: 0;
    border-left: @size solid transparent;
    border-right: @size solid transparent;
    border-bottom: @size * 1.732 solid @color;
}
```

### 技巧 5：阴影 Mixin

```less
.box-shadow(@x: 0, @y: 2px, @blur: 4px, @color: rgba(0,0,0,0.1)) {
    box-shadow: @x @y @blur @color;
}
```

### 技巧 6：文字截断

```less
.ellipsis() {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
```

### 技巧 7：Flex 居中

```less
.flex-center() {
    display: flex;
    justify-content: center;
    align-items: center;
}
```

### 技巧 8：清除浮动

```less
.clearfix() {
    &::after {
        content: '';
        display: table;
        clear: both;
    }
}
```

### 技巧 9：渐变文字

```less
.gradient-text(@from, @to) {
    background: linear-gradient(to right, @from, @to);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
```

### 技巧 10：毛玻璃

```less
.glass(@blur: 10px, @opacity: 0.2) {
    background: rgba(255,255,255,@opacity);
    backdrop-filter: blur(@blur);
    -webkit-backdrop-filter: blur(@blur);
}
```

> 💡 **Less 口诀**：变量用 `@`，混合用 `.`，循环用 `递归`，条件用 `when`。
