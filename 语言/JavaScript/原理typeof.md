---
title: 原理typeof
tags:
  - js
categories:
  - 技术文档
  - 前端
  - js
date: 2020-08-08 19:31:51
---

# typeof

typeof基本判断


| 类型         | 结果          | 描述                                              |
|------------|-------------|-------------------------------------------------|
| Undefined  | "undefined" |                                                 |
| Null       | "object"    | 最初实现中，object标签为0，Null的标签为0x00, 所以null被误认为object |
| Boolean    | "boolean"   |
| Number     | "number"    |
| BigInt     | "bigint"    |
| String     | "string"    |
| Symbol     | "symbol"    |
| 宿主对象       | 取决于具体实现     |
| Function对象 | "function"  | 除 Function 外的所有构造函数的类型都是 'object, Number        |
| 其他任何对象     | "object"    |

## 运算优先级


## 异常

在 let 和 const 声明之前，对一个变量使用 typeof 会抛出 ReferenceError，块作用域变量在块的头部处于 `暂存死区`

```
typeof undeclaredVariable === 'undefined';

typeof newLetVariable; // ReferenceError
typeof newConstVariable; // ReferenceError
typeof newClass; // ReferenceError

let newLetVariable;
const newConstVariable = 'hello';
class newClass{};

```

## 例外

所有浏览器都存在 `typeof document.all === undefined`
