# src 和 href 的区别是什么？

## 定义

href 是 Hypertext Reference 的简写， 表示超文本引用， 指向网络资源所在位置

常见场景：


```html
<a href="http://www.baidu.com"></a> 
<link type="text/css" rel="stylesheet" href="common.css">
```
src 是 source 的简写，目的是要把文件下载到html页面中去

常见的场景

```html
<img src="img/girl.jpg"> 
<iframe src="top.html"> 
<script src="show.js">
```

## 作用的结果

1. href用于在当前文档和引用资源之间确认联系
2. src用于替换当前内容

## 浏览器解析方式

1. 当浏览器遇到href会并行下载资源并且不会停止对当前文档的处理。（同时也是为什么建议使用link方式加载css，而不是@import方式）
2. 当浏览器解析src，会暂停其他资源的下载和处理，直接到该资源加载或执行完毕（这也是script标签为什么方在底部而不是头部的原因）