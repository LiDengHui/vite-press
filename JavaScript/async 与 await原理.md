---
title: async 与 await原理
tags:
  - async
  - await
categories:
  - 技术文档
  - 前端
  - async
  - await
date: 2020-08-24 23:04:44
---

原代码
```js
let a = 0;

let yideng = async () =>{
	a = a + await 10;
	console.log(a);
}

yideng();

console.log(++a);  
```

babel 编译后代码

```js
"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function() {
    var self = this,
      args = arguments;
    return new Promise(function(resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}

var a = 0;

var yideng = /*#__PURE__*/ (function() {
  var _ref = _asyncToGenerator(
    /*#__PURE__*/ regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch ((_context.prev = _context.next)) {
            case 0:
              _context.t0 = a;
              _context.next = 3;
              return 10;

            case 3:
              _context.t1 = _context.sent;
              a = _context.t0 + _context.t1;
              console.log(a);

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })
  );

  return function yideng() {
    return _ref.apply(this, arguments);
  };
})();

yideng();
console.log(++a);
```
