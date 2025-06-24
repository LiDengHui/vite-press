---
title: 原理instanceof
tags:
  - js
categories:
  - 技术文档
  - 前端
  - js
date: 2020-08-08 18:59:45
---

# 原理instanceof

instanceof会检查原型链(__proto__)属性上存不存在类的`prototype`属性

```js
function instanceOf(L, R) {
    let O = R.prototype;
    L  = L.__proto__;
    while(true) {
        if(L === null) {
            return false;
        } else if (L === O) {
            return true;
        } else {
            L = L.__proto__
        }
    }
}

class Car {
    constructor(color) {
        this.color = color;
    }
}

class Cruze extends Car {
    constructor(color) {
        super(color);
    }
}
const cruze = new Cruze("白色");

console.log(cruze); // Cruze { color: '白色' }
console.log(instanceOf(cruze, Cruze)); // true
console.log(instanceOf(cruze, Car)); // true
```
