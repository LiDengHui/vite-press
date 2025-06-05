---
title: cookie操作
date: 2019-08-09 23:40:43
tags:
  - 浏览器
categories:
  - 前端
  - 浏览器
---

```js

// 设置cookie
function setCookie(name, value) {
    var days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime()+days*24*60*60*1000);
    document.cookie = name + "="+escape(value)+";expires="+ exp.toGMTString();
}

// 获取cookie
function getCookie(name) {
    var arr,reg = new RegExp("(^| )"+ name+"=([^;]*)(;|$)");
    if(arr.document.cookie.match(reg)) {
        return unescape(arr[2]);
        
    } else {
        return null;
    }
}

function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime()-1);
    var val = getCookie(name);

    if(val!=null) {
        document.cookie = name+`=`+val+";expires="+exp.toGMTString();
    }
}
```