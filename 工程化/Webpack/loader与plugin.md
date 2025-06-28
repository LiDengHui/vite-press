---
title: loader与plugin的区别
tags:
  - webpack
categories:
  - 技术文档
  - 前端
  - webpack
date: 2020-09-21 22:38:08
---

# 主要区别

## loader

主要用于加载某些资源文件.因为webpack本省只能打包commonjs规范的js文件,对于其他资源例如css, 图片, 或者其他语法集,比如jsx,coffee, 是没有办法加载的,这就需要对应的loader将资源转换,加载进来,从字面的意思可以看出,loader是用与加载的,他的作用是一个一个文件上.

## plugin

用于扩展webpack的功能,它直接作用与webpack, 扩展了它的功能,当然loader也时变相的扩展了webpack.但是它只能用于转化文件这个一个领域,而plugin的功能更加的丰富,而不仅局限于资源加载

# 常用的Plugin与loader

## 常用的Plugin

* CommonsChunkPlugin 创建一个公用的chunk,常用于将第三坊lib抽取公用js, 例如:

```js
entry : {
  vendor: ['jquery', 'other-lib'],
  app:'./entry.js'
}

new CommonsChunkPlugin({
  name: 'vendor',
  filename: 'vendor.js', 
  minChunks:Infinity
})
```

* HotModuelReplacementPlugin 启动热更新

## 常用的loader

loader的功能就是加载资源到webpack

1. css 和 style

css-loader 遍历所有的require的css文件,输出文件内容

style-loader 将css内容输出到页面的style标签中

所以,在webpack.config.js中.css的配置是这样的

```js
{test: /\.css$/, loader: "style!css}

```
style!css 类似一种输出重定向, css-loader的输出会作为 style-loader的输入

如果使用了css预处理. 比如less , 那么只需要在最后加上less的loader

```js
{test:'/\.css$/',loader: "style!css!less"}
```

另一种写法(推荐)

```js
{test:/\.css$/,loaders:["style","css","less"]}
```

# 总结

loader用于加载待打包的资源,
plugin用于扩展webpack

参考:

[webpack 的 loader 和 plugin](https://blog.csdn.net/wp270280522/article/details/51496436)
