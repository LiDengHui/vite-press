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
        &:hover {  // & 表示父选择器
          text-decoration: underline;
        }
      }
    }
  }
}
```
编译为 CSS：
```css
nav ul { margin: 0; }
nav ul li { display: inline-block; }
nav ul li a { color: red; }
nav ul li a:hover { text-decoration: underline; }
```


## 三、混合（Mixins）
复用样式块（类似函数）
```less
// 定义混合
.bordered(@width: 1px) {  // 带默认值的参数
  border: @width solid #ddd;
  border-radius: 4px;
}

// 使用混合
.card {
  .bordered();      // 使用默认值
}
.alert {
  .bordered(3px);   // 传入参数
}
```


## 四、运算（Operations）
支持数值/颜色的数学运算
```less
@base-padding: 10px;
@dark-color: #222;

.container {
  padding: @base-padding * 2;        // 20px
  background-color: @dark-color + #111; // #333
  width: 100% / 3;                   // 33.3333%
}
```


## 五、函数（Functions）
内置函数处理颜色/字符串等
```less
@color: #ff8800;

.header {
  background-color: lighten(@color, 20%); // 颜色变亮20%
  color: darken(@color, 30%);            // 颜色变暗30%
  height: percentage(0.5);               // 50%
}
```


## 六、导入（Importing）
模块化拆分代码
```less
// 导入 reset.less 文件
@import "reset.less"; 
// 导入 variables.less
@import "variables";  // 可省略扩展名
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
.col-1 { width: 25%; }
.col-2 { width: 50%; }
.col-3 { width: 75%; }
.col-4 { width: 100%; }
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
