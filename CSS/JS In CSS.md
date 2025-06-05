---
title: JS IN CSS
tags:
  - CSS
categories:
  - 技术文档
  - 前端
  - CSS
date: 2020-10-17 22:55:02
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
                            modules: true,
                        },
                    },
                ],
            },
        ],
    },
}
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
import index from './index.css'
console.log(index) 
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


