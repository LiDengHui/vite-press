---
title: JS IN CSS
date: 2020-10-17 22:55:02
tags:
  - CSS
  - 前端
  - JavaScript
categories:
  - 技术文档
  - 前端
  - CSS
  - 基础入门
---

# 先要了解 `CSS IN JS`

现代一般都使用webpack来将CSS 编译打包进JS,配置如下

`webpack.config.js`

```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true
                        }
                    }
                ]
            }
        ]
    }
};
```

CSS 不能算是编程语言,只是网页样式的一种描述方法,为了能让CSS也能适用软件工程方法,我们想出了各种解决办法, `Less`, `SASS`, `PostCSS`, `CSS in JS`

CSS Moudles 不一样 功能单纯, 只是加入了局部作用域和模块依赖,可以保证某个组件的样式,不会影响到其他组件

`index.css`

```css
:root {
    --color: red;
}

:global(.title) {
    color: green;
}
.test {
    width: 500px;
    height: 500px;
    background: var(--color);
}
.bb {
    color: 12;
}
```

如果要脱离module进入 全局样式需要适用:global语法 指明这些样式适用于全局

`index.js`

```js
import index from './index.css';
console.log(index);
// {test: "_346xYzrQcc1jTx0FqWrEBf", bb: "_2OaN2P3RC7-bMTTq9-XUm-"}
```

JS 只会打印出是CSS Module 的 Map对象, 对象的键为class或id名称, 值为[hash:base64]

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
    </head>
    <body>
        <div class="_346xYzrQcc1jTx0FqWrEBf">
            <div class="title">123</div>
        </div>
        <script src="./dist/main.js"></script>
    </body>
</html>
```

使用的时候直接使用修改后的hash值,调用从而避免全局污染,

## 原理

CSS的规则都是全局的,任何一个组件的样式规则,都对整个页面有效

产生局部作用域的唯一方法就是适用一个独一无二的class名字,不会与其他选择器重名

## 参考资料

[CSS Modules 用法教程](http://www.ruanyifeng.com/blog/2016/06/css_modules.html)

# 再了解 `JS IN CSS`

---

## 奇淫技巧

### 技巧 1：CSS Modules 组合动态类名

```js
import styles from './button.module.css';

function Button({ primary, large, children }) {
    const className = [
        styles.btn,
        primary ? styles.primary : styles.secondary,
        large ? styles.large : ''
    ].join(' ');
    return <button className={className}>{children}</button>;
}
```

### 技巧 2：样式对象

```js
const dynamicStyle = {
    backgroundColor: isActive ? '#3498db' : '#ccc',
    transform: `scale(${isActive ? 1.1 : 1})`,
    transition: 'all 0.3s'
};
<div style={dynamicStyle}>Content</div>
```

### 技巧 3：CSS-in-JS 库快速对比

| 库 | 特点 | 适用 |
|-----|------|------|
| styled-components | 模板字符串 | React |
| Emotion | 性能优 | React |
| JSS | 独立 | 通用 |
| Linaria | 零运行时 | React |

### 技巧 4：动态主题切换

```js
const theme = {
    light: { bg: '#fff', text: '#333' },
    dark:  { bg: '#1a1a1a', text: '#f0f0f0' }
};
// 通过 Provider 传递，组件内通过 useContext 获取
```

### 技巧 5：条件样式

```js
const getStyle = (status) => ({
    pending: { color: '#999', border: '1px dashed' },
    success: { color: '#27ae60', border: '1px solid' },
    error:   { color: '#e74c3c', border: '2px solid' }
}[status]);
```
