# 手动实现Call、Apply、bind


在 JavaScript 中，`call`、`apply` 和 `bind` 都是用于改变函数执行时 `this` 指向的方法。下面我将手写实现这三个方法的核心逻辑：

### 1. 实现 `call` 方法
```javascript
Function.prototype.myCall = function(context, ...args) {
    // 如果 context 为 null 或 undefined，默认指向全局对象（浏览器中为 window）
    context = context || window;
    // 给 context 添加一个唯一属性，值为当前函数（this 指向调用 myCall 的函数）
    const fnKey = Symbol();
    context[fnKey] = this;
    // 执行函数并保存结果
    const result = context[fnKey](...args);
    // 删除临时属性
    delete context[fnKey];
    return result;
};
```

### 2. 实现 `apply` 方法
```javascript

Function.prototype.myCall = function (ctx, ...args) {
    ctx = ctx === null || ctx === undefined ? globalThis : Object(ctx);

    var key = Symbol('temp');

    Object.defineProperty(ctx, key, {
        enumerable: false,
        value: this,
        configurable: true
    });

    var result = ctx[key](...args);
    delete ctx[key];
    return result;
};

function method(a, b) {
    console.log(this, a, b);
}

method.myCall(null, 1, 2);
```

### 3. 实现 `bind` 方法
```javascript
Function.prototype.myBind = function(context, ...bindArgs) {
    const originalFunc = this;
    // 返回绑定函数
    return function boundFn(...callArgs) {
        // 判断是否通过 new 调用（构造函数场景）
        if (new.target) {
            // new 调用时忽略传入的 context，this 指向新创建的对象
            return new originalFunc(...bindArgs, ...callArgs);
        } else {
            // 普通调用：使用 context 作为 this
            return originalFunc.call(context, ...bindArgs, ...callArgs);
        }
    };
};
```

### 关键点解析：
1. **`call` 和 `apply`**：
    - 核心逻辑：**将函数临时添加到目标对象上执行**
    - 区别：`call` 接受参数列表，`apply` 接受参数数组
    - 使用 `Symbol()` 避免属性名冲突
    - 处理 `context` 为 `null` 的情况（默认指向全局对象）

2. **`bind`**：
    - 核心逻辑：**返回一个新函数并闭包保存绑定参数**
    - 特殊处理 `new` 调用：当使用 `new` 运算符时，忽略绑定的 `this` 值
    - 合并预绑定参数 `bindArgs` 和调用时参数 `callArgs`

### 使用示例：
```javascript
// 测试 myCall
function greet(greeting) {
    console.log(`${greeting}, ${this.name}!`);
}
const person = { name: "John" };
greet.myCall(person, "Hello"); // 输出: "Hello, John!"

// 测试 myBind
const boundGreet = greet.myBind(person, "Hi");
boundGreet(); // 输出: "Hi, John!"

// 测试 new 调用
function Person(name) {
    this.name = name;
}
const BoundPerson = Person.myBind(null, "Alice");
const p = new BoundPerson();
console.log(p.name); // 输出: "Alice"（证明 new 调用生效）
```

### 注意事项：
1. 严格模式下 `context` 为 `null` 时 `this` 指向 `null`
2. `bind` 返回的函数作为构造函数时，原型链需保持正确（上述实现已处理）
3. 使用 `Symbol()` 避免属性污染目标对象

这些实现覆盖了原生方法的核心行为，但实际原生方法的实现更复杂（涉及底层优化和边界情况处理）。理解核心原理有助于深入掌握 JavaScript 的函数执行机制。