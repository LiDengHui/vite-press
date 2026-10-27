---
title: JavaScript 奇怪行为与它和其他语言不一样的地方
date: 2026-05-02 08:32:28
tags:
  - JavaScript
  - 语言特性
  - 语言
  - 基础语法
---

# JavaScript 奇怪行为与它和其他语言不一样的地方

[[toc]]

JavaScript 是一门非常特别的语言。它看起来语法不算复杂，但真正写起来，经常会遇到一些“这也行？”、“为什么会这样？”的行为。

这些现象并不一定是缺陷，很多是历史包袱、兼容性设计、动态语言特征和浏览器环境共同作用的结果。理解这些“奇怪的地方”，能帮你少踩坑，也更容易理解为什么很多团队会给 JavaScript 配上 TypeScript、ESLint 和严格模式。

---

## 一、弱类型和隐式类型转换特别激进

很多语言在类型不匹配时会直接报错，比如 Java、Rust、Go 往往不会允许你随便把字符串和数字混着算。

但 JavaScript 很“宽容”，它会尽量帮你转。

```js
console.log(1 + '2')     // '12'
console.log('5' - 1)     // 4
console.log(true + 1)    // 2
console.log(null + 1)    // 1
console.log(undefined + 1) // NaN
```

### 为什么奇怪？

因为 `+` 在 JavaScript 里既可能是加法，也可能是字符串拼接；而 `-`、`*`、`/` 往往会尝试把两边都转成数字。

这和很多强类型语言完全不同：

- 在 Java / Go / Rust 里，`1 + "2"` 这种通常要么报错，要么必须显式转换。
- 在 JavaScript 里，它会默默给你一个结果。

### 实战建议

- 不要依赖隐式转换写业务逻辑。
- 输入一律先做显式转换：`Number()`、`String()`、`Boolean()`。
- ESLint 里最好开启更严格的规则。

---

## 二、`==` 和 `===` 是两个世界

JavaScript 最经典的“怪”之一，就是它有两个相等运算符。

```js
console.log(0 == false)        // true
console.log('' == 0)           // true
console.log(null == undefined) // true
console.log([] == false)       // true
console.log([] == 0)           // true
```

但：

```js
console.log(0 === false)        // false
console.log('' === 0)           // false
console.log(null === undefined) // false
```

### 区别是什么？

- `==`：允许类型转换后再比较。
- `===`：不做类型转换，类型和值都要一样。

### 为什么和其他语言不一样？

很多语言根本没有这种“双重相等”设计，或者即使有，也不会有这么复杂的转换规则。

JavaScript 的 `==` 最大问题不是“功能弱”，而是**规则太多，且不直觉**。

### 实战建议

除非你非常明确知道自己在利用什么规则，否则：

```js
永远优先使用 === 和 !==
```

---

## 三、`null` 居然被 `typeof` 识别成 `object`

```js
console.log(typeof null) // 'object'
```

这几乎是每个 JavaScript 学习者都会震惊一次的地方。

### 为什么会这样？

这是 JavaScript 早期实现留下来的历史问题，后来为了兼容旧代码就一直保留了。

### 为什么离谱？

按语义看：

- `null` 表示“空值”
- 它显然不是对象
- 但 `typeof null` 却是 `'object'`

这和大多数现代语言的直觉都不一致。

### 正确判断方式

```js
value === null
```

而不是：

```js
typeof value === 'object'
```

---

## 四、数组也是对象

```js
const arr = [1, 2, 3]
console.log(typeof arr) // 'object'
```

在很多语言里，数组虽然底层也可能是对象结构，但语义层面通常是单独的集合类型。

JavaScript 则更彻底：数组本质上就是一种特殊对象。

所以你可以这样干：

```js
const arr = [1, 2]
arr.name = 'demo'
console.log(arr.name) // 'demo'
```

### 为什么这点重要？

因为它会影响：

- 遍历方式
- 拷贝方式
- 相等比较
- JSON 序列化
- 原型链行为

### 正确判断数组

```js
Array.isArray(value)
```

不要用：

```js
typeof value === 'array' // 不存在
```

---

## 五、函数可以像普通值一样传来传去

这件事在今天看起来很自然，但在很多传统语言里，函数并不是一直都被当成“一等公民”。

JavaScript 从很早开始就支持：

- 把函数赋值给变量
- 把函数作为参数传递
- 把函数作为返回值
- 在运行时动态创建行为

```js
function sayHi() {
  return 'hi'
}

function run(fn) {
  console.log(fn())
}

run(sayHi)
```

### 为什么这让 JavaScript 显得很特别？

这直接催生了：

- 回调函数
- 高阶函数
- 中间件模式
- 函数式编程风格
- Promise / async 生态

在浏览器和 Node.js 世界里，这种能力几乎塑造了整个编程模型。

---

## 六、`this` 不是定义时绑定，而是调用时决定

这是 JavaScript 和很多语言差异极大的地方。

在 Java、C# 这类面向对象语言里，方法通常稳定地绑定在对象实例上；但 JavaScript 的 `this` 经常取决于“你是怎么调用它的”。

```js
const obj = {
  name: 'A',
  say() {
    console.log(this.name)
  }
}

obj.say() // A

const fn = obj.say
fn() // 浏览器里常见是 undefined（严格模式）或 window.name
```

### 关键点

`this` 看调用方式：

- `obj.fn()` → `this` 指向 `obj`
- `fn()` → 普通函数调用，`this` 不再是原对象
- `new Fn()` → `this` 指向新实例
- `call/apply/bind` → 可手动指定
- 箭头函数 → 没有自己的 `this`，只捕获外层

### 为什么其他语言开发者容易踩坑？

因为很多人会下意识觉得“方法属于对象，所以拿出来还是那个对象的方法”，但 JavaScript 不是这么工作的。

---

## 七、原型链继承，不是传统类继承起家

虽然现在 JavaScript 也有 `class` 语法，但它的底层依然是原型链。

```js
function Person(name) {
  this.name = name
}

Person.prototype.sayHi = function () {
  console.log('hi', this.name)
}

const p = new Person('Tom')
p.sayHi()
```

### 和其他语言的差异

很多语言的继承模型是：

- 类定义好结构
- 对象由类实例化出来
- 继承发生在类和类之间

JavaScript 更偏向：

- 对象直接链接到另一个对象
- 行为复用靠原型链查找
- `class` 本质是语法糖

### 影响

理解这点后，你会更容易明白：

- `__proto__`
- `prototype`
- `instanceof`
- 方法查找机制
- 为什么对象能动态加属性

---

## 八、变量提升和函数提升容易反直觉

```js
console.log(a) // undefined
var a = 1
```

这段代码不会报“变量未定义”，而是输出 `undefined`。

因为 `var` 声明会被提升。

但如果换成：

```js
console.log(b)
let b = 1
```

就会报错，因为 `let` 和 `const` 存在暂时性死区（TDZ）。

### 为什么这很特别？

很多语言里，变量的可见性和声明顺序更线性、更符合直觉；JavaScript 则由于历史原因，同时保留了：

- `var`
- `let`
- `const`
- 函数声明提升
- 函数表达式不完全一样

这导致同样叫“声明变量”，行为却并不一致。

### 实战建议

- 新代码只用 `let` / `const`
- 能用 `const` 就优先 `const`
- 不要再主动写 `var`

---

## 九、闭包无处不在，而且特别实用

闭包不是 JavaScript 独有，但 JavaScript 对闭包的依赖程度非常高。

```js
function createCounter() {
  let count = 0
  return function () {
    count++
    return count
  }
}

const counter = createCounter()
console.log(counter()) // 1
console.log(counter()) // 2
```

### 为什么 JavaScript 特别依赖闭包？

因为它常常用于：

- 封装私有状态
- 回调保留上下文
- 函数工厂
- 柯里化
- React Hooks 心智模型理解
- 模块作用域模拟

在别的语言里，私有字段、类、模块系统可能更强，闭包未必会如此高频地进入日常业务代码。

---

## 十、对象可以随时长出新属性

```js
const user = { name: 'Tom' }
user.age = 18
user.sayHi = function () {
  console.log('hi')
}
```

这在动态语言里很常见，但对很多静态类型语言开发者来说会觉得“不安全”。

### 好处

- 灵活
- 适合快速建模
- 写小脚本很爽

### 坏处

- 属性名容易拼错
- 数据结构不稳定
- 团队协作成本高
- IDE 和编译期保障弱

这也是 TypeScript 大受欢迎的重要原因之一：它给这种动态对象补上了结构约束。

---

## 十一、数字只有一种主力类型：`number`

JavaScript 很长时间里，普通数字基本都属于 `number`，底层是双精度浮点数。

```js
console.log(0.1 + 0.2) // 0.30000000000000004
```

### 为什么奇怪？

很多人以为这是 JavaScript 特有 bug，其实浮点误差不是它独有；但 JavaScript 的问题在于：

- 大多数整数和小数都放在同一个 `number` 里
- 没有像很多语言那样明显区分 `int`、`float`、`double`
- 新手更容易忽略数值边界

### 还会遇到

```js
console.log(Number.MAX_SAFE_INTEGER)
console.log(1 / 0)   // Infinity
console.log(0 / 0)   // NaN
console.log(NaN === NaN) // false
```

### 实战建议

- 金额别直接用浮点算
- 大整数考虑 `BigInt`
- 判断 NaN 用 `Number.isNaN()`

---

## 十二、异步模型和事件循环是语言体验的一部分

很多语言的异步更多是库层能力，但 JavaScript 的异步几乎是语言和宿主环境共同定义的核心体验。

```js
console.log('start')

setTimeout(() => {
  console.log('timeout')
}, 0)

Promise.resolve().then(() => {
  console.log('promise')
})

console.log('end')
```

输出：

```js
start
end
promise
timeout
```

### 为什么这让人迷惑？

因为“写在前面”不一定“先执行”。

你必须理解：

- 调用栈
- 宏任务
- 微任务
- 事件循环
- 浏览器 / Node.js 宿主行为

这比很多同步优先的语言更绕，也更依赖运行时模型。

---

## 十三、`undefined` 和 `null` 同时存在

很多语言只有一种“空”，但 JavaScript 有两种常见空值语义：

- `undefined`：通常表示“没有定义”或“没传值”
- `null`：通常表示“明确地置空”

```js
let a
console.log(a) // undefined

const b = null
console.log(b) // null
```

### 为什么会让人混乱？

因为它们既相似，又不完全一样：

```js
console.log(null == undefined)  // true
console.log(null === undefined) // false
```

### 实战建议

团队最好统一语义：

- 未赋值用 `undefined`
- 主动表示空对象/空结果用 `null`

否则接口层和业务层很容易混乱。

---

## 十四、`NaN` 居然不等于自己

```js
console.log(NaN === NaN) // false
```

这是另一个非常违反直觉的点。

### 为什么？

`NaN` 表示“不是一个有效数字结果”，它不是具体某个值，所以规范里规定它和任何值都不相等，包括它自己。

### 正确判断方法

```js
Number.isNaN(value)
```

不要写：

```js
value === NaN // 永远不成立
```

---

## 十五、空数组、空对象的真假值也容易误导

```js
console.log(Boolean([])) // true
console.log(Boolean({})) // true
console.log(Boolean('')) // false
console.log(Boolean(0))  // false
```

### 为什么容易误解？

很多人会从其他语言经验出发，以为“空集合就是 false”。

但在 JavaScript：

- 空数组是 truthy
- 空对象是 truthy
- 只有少数值是 falsy

常见 falsy 值包括：

- `false`
- `0`
- `-0`
- `0n`
- `''`
- `null`
- `undefined`
- `NaN`

### 实战建议

不要写太“聪明”的真假判断，尤其是接口返回值判断时。

---

## 十六、奇淫技巧

下面这些技巧，不是让你炫技，而是帮助你在理解 JavaScript 特性的前提下，写出更稳的代码。

### 1. 用 `Object.is()` 处理极端比较

```js
console.log(Object.is(NaN, NaN)) // true
console.log(Object.is(+0, -0))   // false
```

当你需要比 `===` 更精确的比较语义时，`Object.is()` 很有用。

适合场景：

- 判断 `NaN`
- 区分 `+0` 和 `-0`
- 做状态变更的底层比较

### 2. 用 `??` 代替 `||` 做默认值兜底

```js
const count = 0
console.log(count || 10) // 10
console.log(count ?? 10) // 0
```

`||` 会把 `0`、`''`、`false` 都当成“要兜底”，这在很多业务里是错的。

更稳妥的写法是：

```js
const value = input ?? defaultValue
```

它只会在 `null` 或 `undefined` 时兜底。

### 3. 用 `Array.isArray()`、`Number.isNaN()`、`value === null` 做精确判断

不要试图用一个 `typeof` 解决所有判断问题。

推荐组合：

```js
Array.isArray(v)
Number.isNaN(v)
v === null
typeof v === 'undefined'
```

这比写一堆宽泛判断安全得多。

### 4. 对外部输入先归一化，再做逻辑判断

比如 URL 参数、表单输入、后端返回值，经常都是字符串或可空值。最好先统一处理：

```js
const page = Number(rawPage)
if (!Number.isInteger(page) || page < 1) {
  throw new Error('page 参数非法')
}
```

这样可以把 JavaScript 那些“自动帮你转”的不确定性挡在入口外。

---

## 十七、如何理解这些“奇怪”现象

可以用一句话概括：

> JavaScript 不是“纯粹从语言设计美感出发”构建出来的，它是“历史兼容性 + 动态特性 + 宿主环境需求”共同塑造的语言。

所以它既有非常灵活的一面，也有非常诡异的一面。

如果你把它当成 Java、Go、Rust 那样的语言去期待，容易困惑；如果你理解了它的历史和设计目标，就会发现很多行为虽然奇怪，但并不是完全无规律。

---

## 十八、总结

JavaScript 和其他语言最不一样的地方，主要集中在这几类：

- 类型转换非常激进
- 相等比较规则复杂
- `this` 由调用方式决定
- 原型链模型不同于传统类继承
- 异步和事件循环深度影响代码执行顺序
- 对象结构动态可变
- 一些历史遗留行为长期保留

学 JavaScript，不能只记 API，更要建立“运行规则”的心智模型。

你一旦真正理解这些奇怪行为，很多面试题、源码实现、框架设计甚至线上 bug，都会 suddenly make sense。
