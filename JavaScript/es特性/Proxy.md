---
title: JS Proxy
date: 2020-07-20 16:29:13
tags: ["JS", "前端", "语言"]
---

# Proxy

# Proxy可以取消代理

```js
var obj = {
    a: 1
}
  , handles = {
    get(target, key, context) {
        console.log("accessing:", key);
        return target[key];
    },
}
  , {proxy: pobj, revoke: prevoke} = Proxy.revocable(obj, handles)

console.log(pobj.a);
// accessing: a
// 1

prevoke();

pobj.a
// Uncaught TypeError: Cannot perform 'get' on a proxy that has been revoked

``````