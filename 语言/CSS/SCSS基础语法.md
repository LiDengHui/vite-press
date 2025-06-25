# Sass 基础语法使用说明书

---

## **1. 变量 (Variables)**
存储可复用的值（颜色、字体、尺寸等），使用 `$` 定义：
```scss
$primary-color: #3498db;
$font-stack: "Helvetica", sans-serif;

body {
  color: $primary-color;
  font-family: $font-stack;
}
```

---

## **2. 嵌套 (Nesting)**
嵌套选择器，保持结构清晰：
```scss
nav {
  ul {
    margin: 0;
    li {
      display: inline-block;
      a {
        color: red;
        &:hover {  // & 表示父选择器
          text-decoration: underline;
        }
      }
    }
  }
}
```
编译为：
```css
nav ul { margin: 0; }
nav ul li { display: inline-block; }
nav ul li a { color: red; }
nav ul li a:hover { text-decoration: underline; }
```

---

## **3. 混合 (Mixins)**
定义可复用的样式块，支持参数：
```scss
@mixin flex-center($direction: row) {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: $direction;
}

.container {
  @include flex-center(column); // 调用混合
}
```

---

## **4. 继承 (Extend)**
共享样式，减少重复代码：
```scss
%button-base {  // 占位符选择器（不直接编译）
  padding: 10px 20px;
  border-radius: 4px;
}

.primary-btn {
  @extend %button-base;
  background: blue;
}

.secondary-btn {
  @extend %button-base;
  background: gray;
}
```

---

## **5. 函数 (Functions)**
计算并返回值，使用 `@function`：
```scss
@function double($n) {
  @return $n * 2;
}

.sidebar {
  width: double(100px); // 200px
}
```

---

## **6. 条件与循环 (Control Directives)**
**条件语句 `@if`：**
```scss
$theme: "dark";

body {
  @if $theme == "dark" {
    background: black;
  } @else {
    background: white;
  }
}
```

**循环 `@for`：**
```scss
@for $i from 1 through 3 {
  .item-#{$i} {  // 插值语法 #{$var}
    width: 100px * $i;
  }
}
```
编译结果：
```css
.item-1 { width: 100px; }
.item-2 { width: 200px; }
.item-3 { width: 300px; }
```

**循环 `@each`：**
```scss
$colors: (red, green, blue);

@each $color in $colors {
  .bg-#{$color} {
    background: $color;
  }
}
```

---

## **7. 导入 use (Import 废弃)**
拆分模块，按需导入（文件命名以 `_` 开头，如 `_variables.scss`）：
```scss
// main.scss
// 不推荐使用 @import 导入
@import "variables"; // 无需下划线和扩展名
@import "mixins";

// 推荐使用@use
@use "variables" as *; // 无需下划线和扩展名
@use "mixins";
.container {
  color: $primary-color;
  @include mixins.flex-center;
} 
```

---

## **8. 运算 (Operations)**
支持数学运算：
```scss
$base-padding: 10px;

.container {
  padding: $base-padding * 2; // 20px
  width: 100% / 3; // 33.333%
}
```

---

## **9. 注释 (Comments)**
- 单行注释：`// 不会编译到CSS`
- 多行注释：`/* 会编译到CSS */`

---

## 安装与使用
1. **安装Sass**：
   ```bash
   npm install sass -g
   ```

2. **编译Sass**：
   ```bash
   sass input.scss output.css
   ```

3. **监听文件变化**：
   ```bash
   sass --watch input.scss:output.css
   ```

---

## 最佳实践
1. 使用变量管理设计系统（颜色、间距等）。
2. 拆分代码为多个文件（`_variables.scss`、`_mixins.scss`）。
3. 嵌套不超过3层，避免过度嵌套。
4. 优先使用 `Mixins` 处理带参数的样式，`Extend` 处理静态样式。

> 示例结构：
> ```
> styles/
> ├── main.scss
> ├── _variables.scss
> ├── _mixins.scss
> └── components/
>     └── _buttons.scss
> ```

掌握这些基础语法后，可显著提升CSS开发效率与可维护性！

# 其他
SCSS 最新的模块系统（基于 `@use` 和 `@forward`）已彻底取代旧版 `@import`，核心目标是解决命名冲突、提升代码可维护性，并通过显式命名空间实现安全的模块化开发。以下是关键实践总结：

---

## ⚙️ 一、**`@use` 模块化导入（替代 `@import`）**
1. **基础语法**
   ```scss
   @use 'path/to/module' as namespace; // 带命名空间
   @use 'module' as *;                // 全局暴露（谨慎使用）
   ```
    - 导入的变量/混合需通过命名空间访问：`namespace.$color`
    - `as *` 会将模块内容直接注入全局作用域（类似旧版 `@import`，但仍有独立作用域）。

2. **优势**
    - **避免命名冲突**：每个模块有独立命名空间。
    - **按需加载**：仅导入实际使用的成员。
    - **私有成员控制**：以 `_` 开头的变量/混合不会被导出（如 `$_private-var`）。

---

## 🌐 二、**全局变量配置（跨模块共享）**
通过构建工具全局注入变量文件，避免重复导入：
1. **Vite 示例**（`vite.config.ts`）
   ```ts
   css: {
     preprocessorOptions: {
       scss: {
         additionalData: '@use "src/styles/variables.scss" as *;'
       }
     }
   }
   ```

2. **Webpack 示例**（需 `sass-resources-loader`）
   ```js
   {
     loader: 'sass-resources-loader',
     options: { resources: './src/globals/vars.scss' }
   }
   ```

> ✅ **适用场景**：主题色、间距、断点等全局变量。

---

## 🗂️ 三、**模块化工程实践**
1. **文件结构规范**
   ```bash
   src/styles/
   ├── base/          
   │   ├── _reset.scss      # 重置样式
   │   └── _variables.scss  # 全局变量
   ├── utils/          
   │   ├── _mixins.scss     # 混合宏
   │   └── _functions.scss  
   └── components/     
       ├── Button.module.scss # 组件样式（CSS Modules）
       └── Card.scss
   ```

2. **组件内导入示例**
   ```scss
   // Button.module.scss
   @use 'src/styles/base/variables' as vars;
   @use 'src/styles/utils/mixins' as mx;
   
   .button {
     color: vars.$primary;
     @include mx.shadow(2px);
   }
   ```



## ⚖️ 四、`@use` vs `@import` 核心区别
| **特性**         | **`@use`**                          | **`@import`**                     |
|------------------|-------------------------------------|------------------------------------|
| **作用域**       | 模块独立命名空间                    | 全局作用域（易冲突）              |
| **私有成员**     | 支持（`_`前缀）                    | 不支持                            |
| **重复导入**     | 仅加载一次（防冗余）                | 多次加载                          |
| **性能**         | 编译更快（依赖树清晰）              | 较慢（全局扫描） |

---

## ⚠️ 五、注意事项
1. **弃用警告**：继续使用 `@import` 会触发编译器警告，需逐步迁移。
2. **构建工具依赖**：`@use` 需 Dart Sass（Node Sass 不支持）。
3. **慎用 `as *`**：过度使用可能导致全局污染，建议仅在工具类/变量文件中使用。

---

## 💎 总结
- **新项目**：直接采用 `@use` + 全局注入配置，结合 CSS Modules 实现组件级隔离。
- **旧项目迁移**：逐步替换 `@import` 为 `@use`，优先从工具文件（变量、混合）入手。
- **工程化建议**：通过 Vite/Webpack 统一管理全局依赖，结合目录分层提升可维护性。

> 更深入的技术细节可参考：[Sass 官方模块文档](https://sass-lang.com/documentation/at-rules/use) 或 [Vite SCSS 配置指南](https://vitejs.dev/config/shared-options.html#css-preprocessoroptions)。
