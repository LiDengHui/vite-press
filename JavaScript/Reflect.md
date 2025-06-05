---
title: Reflect
tags:
  - js
categories:
  - 技术文档
  - 前端
  - js
date: 2020-09-10 21:52:52
---

# 为什么会出现Reflect

1. Reflect 有不是用于Object的方法,例如 Reflect.apply, 作用于函数.如果是 Object.apply(myFunction) 这样调用,看起来比较奇怪
2. 使用一个对象来包含这些方法,可以让js其余部分保持简洁,这比通过构造函数和原型对象来使用反射更好一些
3. typeof、instanceof 和 delete 已经作为反射运算存在了,如果增加新的字段,对于开发者会比较麻烦,向后兼容性不好,使保留子数目暴增

# Reflect.apply(target, thisArgument, [,argumentsList])

Reflect.apply 和 Function#apply 很像, 他接收一个函数, 使用一个上下文对象和参数数组来调用该函数. 从这一点来说, 可以认为 Function#call 和 Function#apply 是过时的版本, 不过是更合理的说法.可以这样使用该方法.

```js
var ages = [11, 33, 12, 54, 18, 96];

// Function.prototype 方式：
var youngest = Math.min.apply(Math, ages);
var oldest = Math.max.apply(Math, ages);
var type = Object.prototype.toString.call(youngest);

// Reflect 方式：
var youngest = Reflect.apply(Math.min, Math, ages);
var oldest = Reflect.apply(Math.max, Math, ages);
var type = Reflect.apply(Object.prototype.toString, youngest);

```
Reflect.apply 相比 Function#apply 真正的好处在于其防御性: 任何代码都可以简单的修改函数 call 和 apply 方法,这使你应为崩溃的代码的可怕的变通方法而卡住. 这在一般情况喜爱并不是大问题, 但下面的代码可能真的存在

```js
function totalNumbers() {
  return Array.prototype.reduce.call(arguments, function (total, next) {
    return total + next;
  }, 0);
}
totalNumbers.apply = function () {
  throw new Error('Aha got you!');
}

totalNumbers.apply(null, [1, 2, 3, 4]); // throws Error('Aha got you!');

// ES5 唯一能够 防御这种情况的方法很可怕：
Function.prototype.apply.call(totalNumbers, null, [1, 2, 3, 4]) === 10;

// 也可以这样做，仍然不是很简洁：
Function.apply.call(totalNumbers, null, [1, 2, 3, 4]) === 10;

// Reflect.apply 前来救援！
Reflect.apply(totalNumbers, null, [1, 2, 3, 4]) === 10;
```

# Reflect.construct(target, argumentsList, [,...constructorToCreateThis])

和 Refect.apply 类似, 这个方法用于一组参数来调用构造函数.这对于类也适用, 并且能够正确设置对象,从而让构造函数匹配原型的 this 对象.在 ES5 中,你是适用 Object.create(Construcor.prototype)的方法,然后将对象传给 Constructor.call 或 Constructor.apply. Refect.construct 的不同之处在于,并非传入对象, 只需要传入构造函数,然后 Refect.construct 会处理这些细节

```js
class Greeting {

    constructor(name) {
        this.name = name;
    }

    greet() {
      return `Hello ${name}`;
    }

}

// ES5 方式的工厂方法：
function greetingFactory(name) {
    var instance = Object.create(Greeting.prototype);
    Greeting.call(instance, name);
    return instance;
}

// ES6 方式的工厂方法：
function greetingFactory(name) {
    return Reflect.construct(Greeting, [name], Greeting);
}

// 或者，省略第三个参数，会缺省使用第一个参数。
function greetingFactory(name) {
  return Reflect.construct(Greeting, [name]);
}

// 超级简单的 ES6 一行工厂函数！
const greetingFactory = (name) => Reflect.construct(Greeting, [name]);

```

# Reflect.defineProperty(target, propertyKey, attributes)

Reflect.defineProperty 和 Object.defineProperty 很想,用于定义属性的元数据(metadata).这个方法更适合,因为 Object.* 隐含着表示方法作用于对象字面量(其实是双抽象字面量构造函数), 而 Reflect.defineProperty 只表示现在做的反射有关,更具语义化
特别需要注意的是, 和 Object.defineProperty 一样,对于非法的 target, Reflect.defineProperty 会抛出 TypeError 异常, 例如 Number 或 String 类型(Reflect.defineProperty(1, 'foo')). 这是好事, 对于错误类型抛出异常而不是安静的失败,可以提醒你出现了问题

```js
function MyDate() {
  /*…*/
}

// 奇怪的老方式，因为这里使用 Object.defineProperty 为 Function 定义属性
// （为什么没有 Function.defineProperty ？）
Object.defineProperty(MyDate, 'now', {
  value: () => currentms
});

// 新方式，并不奇怪，因为 Reflect 做的是反射.
Reflect.defineProperty(MyDate, 'now', {
  value: () => currentms
});
```

# Reflect,getOwnPropertyDescriptor(target, propertyKey)

这个接口,可以视为 Object.getOwnPropertyDescriptor的替代,用于获取属性的描述元数据

主要的区别在于 Object.getOwnPropertyDescriptor(1,"foo")只会静静的的失败,返回 undefined
而 Reflect.getOwnPropertyDescriptor(1, "foo") 会抛出 TypeError 

```js
var myObject = {};
Object.defineProperty(myObject, 'hidden', {
  value: true,
  enumerable: false,
});
var theDescriptor = Reflect.getOwnPropertyDescriptor(myObject, 'hidden');
assert.deepEqual(theDescriptor, { value: true, enumerable: true });

// 老方式：
var theDescriptor = Object.getOwnPropertyDescriptor(myObject, 'hidden');
assert.deepEqual(theDescriptor, { value: true, enumerable: true });

assert(Object.getOwnPropertyDescriptor(1, 'foo') === undefined)
Reflect.getOwnPropertyDescriptor(1, 'foo'); // 抛出 TypeError

```

# Reflect.deleteProperty(target, propertyKey)

Reflect.deleteProperty 会删除对象上的属性, 在 ES6 之前,你可能会写 delete obj.foo, 现在就可以用 Reflect.deleteProperty(obj, "foo")

相同点: 都调用内部 target[[Delete]](propertyKey)方法.删除数据

不同点: delete 操作符还可以"用于"非对象的引用(例如,变量), 所以这个接口会做对操作对象进行更多的检查,也更可能的抛出异常

```js
var myObj = { foo: 'bar' };
delete myObj.foo;
assert(myObj.hasOwnProperty('foo') === false);

myObj = { foo: 'bar' };
Reflect.deleteProperty(myObj, 'foo');
assert(myObj.hasOwnProperty('foo') === false);

```

# Reflect.getPrototypeOf(target)

关于替换,废弃 Object 方法的主题的继续

新的 Reflect.getPrototypeOf 对于非法的 target,会抛出 TypeError, 例如 Number, String 字面量, null 或 undefined.; 而 Object.getPrototypeOf 强制要求 target 是对象, 所以 "a" 会变成 Object("a")

```js
var myObj = new FancyThing();
assert(Reflect.getPrototypeOf(myObj) === FancyThing.prototype);

// 老方式
assert(Object.getPrototypeOf(myObj) === FancyThing.prototype);

Object.getPrototypeOf(1); // undefined
Reflect.getPrototypeOf(1); // TypeError
```

# Reflect.setPrototypeOf(target, proto)

Object.setPrototypeOf 对于非对象会抛出异常,但会尝试将传入的参数转为对象, 不过如果内部[[SetPrototype]] 方法失败,会抛出 TypeError, 成功则返回参数 target

Reflect.setPrototypeOf 则更基本一些,如果接收了一个非对象,则抛出 TypeError. 但如果 不是这样, 则会返回 [[SetPrototype]]的结果

```js
var myObj = new FancyThing();
assert(Reflect.setPrototypeOf(myObj, OtherThing.prototype) === true);
assert(Reflect.getPrototypeOf(myObj) === OtherThing.prototype);

// 老方式
assert(Object.setPrototypeOf(myObj, OtherThing.prototype) === myObj);
assert(Object.getPrototypeOf(myObj) === FancyThing.prototype);

Object.setPrototypeOf(1); // TypeError
Reflect.setPrototypeOf(1); // TypeError

var myFrozenObj = new FancyThing();
Object.freeze(myFrozenObj);

Object.setPrototypeOf(myFrozenObj); // TypeError
assert(Reflect.setPrototypeOf(myFrozenObj) === false);
```

# Reflect.isExtensible(target)

在 ES6 之前, 如果传入了非对象, Object.isExtensible 会抛出异常 TypeError
在 ES6 之后, 传入了非对象, Object.isExtensible 会返回 false

而 Reflect.isExtensible 是使用了 ES6 之前 Object.isExtensible 的实现

```js
var myObject = {};
var myNonExtensibleObject = Object.preventExtensions({});

assert(Reflect.isExtensible(myObject) === true);
assert(Reflect.isExtensible(myNonExtensibleObject) === false);
Reflect.isExtensible(1); // 抛出 TypeError
Reflect.isExtensible(false);  // 抛出 TypeError

// 使用 Object.isExtensible
assert(Object.isExtensible(myObject) === true);
assert(Object.isExtensible(myNonExtensibleObject) === false);

// ES5 Object.isExtensible 语义
Object.isExtensible(1); // 在老的浏览器抛出 TypeError
Object.isExtensible(false);  // 在老的浏览器抛出 TypeError

// ES6 Object.isExtensible 语义
assert(Object.isExtensible(1) === false); // 只在新的浏览器上通过
assert(Object.isExtensible(false) === false); // 只在新的浏览器上通过

```

# Reflect.preventExtensions(target)

和 isExtensible 一样

ES5 和 Reflect 的实现一样,传入非对象抛出异常

ES6 Object.preventExtensions只是返回 true 或 false

```js
ar myObject = {};
var myObjectWhichCantPreventExtensions = magicalVoodooProxyCode({});

assert(Reflect.preventExtensions(myObject) === true);
assert(Reflect.preventExtensions(myObjectWhichCantPreventExtensions) === false);
Reflect.preventExtensions(1); // 抛出 TypeError
Reflect.preventExtensions(false);  // 抛出 TypeError

// 使用 Object.isExtensible
assert(Object.isExtensible(myObject) === true);
Object.isExtensible(myObjectWhichCantPreventExtensions); // 抛出 TypeError

// ES5 Object.isExtensible 语义
Object.isExtensible(1); // 抛出 TypeError
Object.isExtensible(false);  // 抛出 TypeError

// ES6 Object.isExtensible 语义
assert(Object.isExtensible(1) === false);
assert(Object.isExtensible(false) === false);
```

# Reflect.get(target, propertyKey [, receiver])

用来调用 target[propertyKey].如果 target 不是一个对象, 函数报错,
而 1['foo'] 这样的代码只会静静的返回 undefined, 而 Reflect.get(1, 'foo') 会抛出 TypeError

Reflect.get 参数,在 target[propertyKey] 是一个 getter 函数时,会作为 this 参数应用

```js
var myObject = {
  foo: 1,
  bar: 2,
  get baz() {
    return this.foo + this.bar;
  },
}

assert(Reflect.get(myObject, 'foo') === 1);
assert(Reflect.get(myObject, 'bar') === 2);
assert(Reflect.get(myObject, 'baz') === 3);
assert(Reflect.get(myObject, 'baz', myObject) === 3);

var myReceiverObject = {
  foo: 4,
  bar: 4,
};
assert(Reflect.get(myObject, 'baz', myReceiverObject) === 8);

// 非对象报错：
Reflect.get(1, 'foo'); // throws TypeError
Reflect.get(false, 'foo'); // throws TypeError

// 老方式并不会报错：
assert(1['foo'] === undefined);
assert(false['foo'] === undefined);

```
# Reflect.set(target, propertyKey,V [, receiver ]

和 Reflect.get 一样, 在 target[propertyKey]是 setter 函数时 将 receiver参数作为 this 使用

```js
var myObject = {
  foo: 1,
  set bar(value) {
    return this.foo = value;
  },
}

assert(myObject.foo === 1);
assert(Reflect.set(myObject, 'foo', 2));
assert(myObject.foo === 2);
assert(Reflect.set(myObject, 'bar', 3));
assert(myObject.foo === 3);
assert(Reflect.set(myObject, 'bar', myObject) === 4);
assert(myObject.foo === 4);

var myReceiverObject = {
  foo: 0,
};
assert(Reflect.set(myObject, 'bar', 1, myReceiverObject));
assert(myObject.foo === 4);
assert(myReceiverObject.foo === 1);

// 非对象报错：
Reflect.set(1, 'foo', {}); // 抛出 TypeError
Reflect.set(false, 'foo', {}); // 抛出 TypeError

// 老方式不报错：
1['foo'] = {};
false['foo'] = {};
assert(1['foo'] === undefined);
assert(false['foo'] === undefined);
```

# Reflect.has(target, propertyKey)

和 in 操作符一样 都调用[[HasProperty]]方法,并在 target 不是对象的时候报错

```js
myObject = {
  foo: 1,
};
Object.setPrototypeOf(myObject, {
  get bar() {
    return 2;
  },
  baz: 3,
});

// 没有 Reflect.has
assert(('foo' in myObject) === true);
assert(('bar' in myObject) === true);
assert(('baz' in myObject) === true);
assert(('bing' in myObject) === false);

// 使用 Reflect.has:
assert(Reflect.has(myObject, 'foo') === true);
assert(Reflect.has(myObject, 'bar') === true);
assert(Reflect.has(myObject, 'baz') === true);
assert(Reflect.has(myObject, 'bing') === false);
```

# Reflect.ownKeys(target)

Reflect.ownKeys 实现了[[OwnPropertyKeys]], 而后者是 Object.getOwnPropertyNames 和 Object.getOwnPropertySymbols 的结合

```js
var myObject = {
  foo: 1,
  bar: 2,
  [Symbol.for('baz')]: 3,
  [Symbol.for('bing')]: 4,
};

assert.deepEqual(Object.getOwnPropertyNames(myObject), ['foo', 'bar']);
assert.deepEqual(Object.getOwnPropertySymbols(myObject), [Symbol.for('baz'), Symbol.for('bing')]);

// 不使用 Reflect.ownKeys：
var keys = Object.getOwnPropertyNames(myObject).concat(Object.getOwnPropertySymbols(myObject));
assert.deepEqual(keys, ['foo', 'bar', Symbol.for('baz'), Symbol.for('bing')]);

// 使用 Reflect.ownKeys：
assert.deepEqual(Reflect.ownKeys(myObject), ['foo', 'bar', Symbol.for('baz'), Symbol.for('bing')]);
```