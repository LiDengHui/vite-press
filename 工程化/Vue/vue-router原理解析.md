---
title: vue-router原理解析
tags:
  - vue
categories:
  - 技术文档
  - 前端
  - vue
date: 2020-08-12 22:57:59
---

Vue-Router 默认是Hash模式, 使用url的hash来模拟一个完整的url,当url改变的时候,页面不会重新加载, 比如: 使用hash模式的话, 那么访问变成 http://localhost:8080/page/#/这样的访问

但是如果路由使用history的话,那么访问路径变成 如下: http://localhost:8080/page/

注意事项:

如果使用的是history这种模式, 在非首页的情况下刷新页面或直接访问的时候会报404,导致页面丢失

这是因为他是利用H5 History API 来实现的. 通过history.pushState 方法来实现URL的跳转而无需重新加载页面, 但是它的问题在于刷新页面的时候会走后端路由,相当于直接在浏览器里输入这个地址,要对服务器发起http请求,但是这个目标在服务器上又不存在这个路由,所以会返回404

解决方式: 需要服务端的辅助来兜底,避免URL无法匹配到资源的时候能返回页面

Nginx或Node作为服务端的解决方案

1. Nginx配置

```sh
localtion / {
  try_files $uri $uri/ /index.html;
}
```

# Nodejs配置

```js
var history = require("content-height-history");
var connect = require("connect");
var app = connect().use(history()).listen(3000);

// 或者使用express
var express = require("express");
var app = express();
app.use(history());
```

# hash模式

默认是 hash模式, 基于浏览器 hash api,使用window.addEventListener('hashchange', callback)对浏览器地址进行监听, 当调用push时, 把新路由添加到浏览器访问历史的栈顶,使用replace时,把浏览器访问历史的栈顶路由替换成新路由

# History模式

history模式,基于浏览器history api, 使用window.onpopstate 对浏览器地址进行监听,对浏览器history api中pushState(), replaceState() 进行封装,当方法调用,会对浏览器历史栈进行修改, 从而实现URL的跳转而无需重新加载页面,

但是它的问题在于刷新页面的时候会走后端路由,所以需要服务端的辅助来兜底,避免URL无法匹配到资源时能返回页面

# abstract

不涉及和浏览器地址相关的记录, 流程跟hash模式一样, 通过数组维护模拟浏览器的历史堆栈

服务端下使用, 使用一个不依赖于浏览器的浏览历史虚拟管理后端,

# 总结

hash 模式和 history 模式都是通过window.addEventListener()方法监听hashchange和 popState 进行相应路由的操作, 可以通过back、forward、go等方法访问浏览器的历史记录栈,进行各种跳转,而abstract模式是自己维护一个模拟的浏览器历史栈的数组.