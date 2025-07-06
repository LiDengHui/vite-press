# JavaScript Proxy 详解

Proxy（代理）是 ES6 引入的一种元编程特性，它允许你创建一个对象的代理，从而可以拦截和自定义对象的基本操作。

## Proxy 的作用

1. **拦截和自定义对象操作**：可以拦截对象属性的读取、赋值、枚举等操作
2. **实现数据验证**：在属性赋值前进行验证
3. **创建虚拟属性**：动态计算或返回不存在的属性
4. **实现观察者模式**：监控对象的变化
5. **实现数据绑定**：自动更新相关数据
6. **保护敏感数据**：限制对某些属性的访问
7. **性能优化**：延迟加载或缓存计算结果

## 基本语法

```javascript
const proxy = new Proxy(target, handler);
```

- `target`：要代理的目标对象（可以是任何类型的对象）
- `handler`：包含拦截器（traps）的对象，定义代理的行为

## Handler 对象中的拦截器（Traps）

以下是所有可用的拦截器及其作用：

## 1. 基本操作拦截器

| 拦截器 | 触发时机 | 示例 |
|--------|----------|------|
| `get` | 读取属性值 | `proxy.property` |
| `set` | 设置属性值 | `proxy.property = value` |
| `has` | `in` 操作符 | `'property' in proxy` |
| `deleteProperty` | `delete` 操作符 | `delete proxy.property` |

## 2. 函数调用相关

| 拦截器         | 触发时机      | 示例                   |
|-------------|-----------|----------------------|
| `apply`     | 函数调用      | `proxy(...args)`     |
| `construct` | `new` 操作符 | `new proxy(...args)` |

## 3. 对象元信息相关

| 拦截器                        | 触发时机                                | 示例                                             |
|----------------------------|-------------------------------------|------------------------------------------------|
| `getPrototypeOf`           | `Object.getPrototypeOf()`           | `Object.getPrototypeOf(proxy)`                 |
| `setPrototypeOf`           | `Object.setPrototypeOf()`           | `Object.setPrototypeOf(proxy, proto)`          |
| `isExtensible`             | `Object.isExtensible()`             | `Object.isExtensible(proxy)`                   |
| `preventExtensions`        | `Object.preventExtensions()`        | `Object.preventExtensions(proxy)`              |
| `getOwnPropertyDescriptor` | `Object.getOwnPropertyDescriptor()` | `Object.getOwnPropertyDescriptor(proxy, prop)` |
| `defineProperty`           | `Object.defineProperty()`           | `Object.defineProperty(proxy, prop, desc)`     |

## 4. 枚举相关

| 拦截器       | 触发时机                                              | 示例                   |
|-----------|---------------------------------------------------|----------------------|
| `ownKeys` | `Object.keys()`, `Object.getOwnPropertyNames()` 等 | `Object.keys(proxy)` |

## 详细参数说明

## get(target, property, receiver)

- `target`：目标对象
- `property`：被获取的属性名（可以是 Symbol）
- `receiver`：Proxy 或继承 Proxy 的对象
- **必须返回**：属性的值

```javascript
const handler = {
  get(target, prop, receiver) {
      // target: 被代理的目标对象
      // property: 被访问的属性名
      // receiver: 最初接收属性访问的对象（通常是Proxy实例或其派生对象）
    if (prop === 'fullName') {
      return `${target.firstName} ${target.lastName}`;
    }
    return Reflect.get(...arguments);
  }
};

```

## set(target, property, value, receiver)

- `target`：目标对象
- `property`：被设置的属性名
- `value`：新属性值
- `receiver`：最初被调用的对象
- **必须返回**：布尔值，表示设置是否成功

```javascript
const handler = {
  set(target, prop, value) {
    if (prop === 'age' && typeof value !== 'number') {
      throw new TypeError('Age must be a number');
    }
    target[prop] = value;
    return true; // 表示设置成功
  }
};
```

## apply(target, thisArg, argumentsList)

- `target`：目标函数
- `thisArg`：调用时的 this 值
- `argumentsList`：调用时的参数数组
- **必须返回**：函数调用的结果

```javascript
const handler = {
  apply(target, thisArg, args) {
    console.log(`Function called with args: ${args}`);
    return target(...args) * 2;
  }
};
```

## construct(target, argumentsList, newTarget)

- `target`：目标构造函数
- `argumentsList`：构造函数的参数数组
- `newTarget`：最初被调用的构造函数
- **必须返回**：一个对象（通常是构造函数的实例）

```javascript
const handler = {
  construct(target, args, newTarget) {
    console.log(`Constructed with args: ${args}`);
    return new target(...args);
  }
};
```

## 实际应用示例

## 1. 数据验证

```javascript
const validator = {
  set(target, key, value) {
    if (key === 'age') {
      if (typeof value !== 'number' || value <= 0) {
        throw new TypeError('Age must be a positive number');
      }
    }
    target[key] = value;
    return true;
  }
};

const person = new Proxy({}, validator);
person.age = 25; // 正常
person.age = '25'; // 抛出错误
```

## 2. 自动填充默认值

```javascript
const withDefaults = (defaults) => new Proxy({}, {
  get(target, key) {
    return target[key] || defaults[key];
  }
});

const config = withDefaults({
  theme: 'light',
  fontSize: 14
});

console.log(config.theme); // 'light'
```

## 3. 负数组索引支持

```javascript
const negativeArray = (arr) => new Proxy(arr, {
  get(target, prop, receiver) {
    const index = parseInt(prop);
    if (index < 0) {
      prop = target.length + index;
    }
    return Reflect.get(target, prop, receiver);
  }
});

const arr = negativeArray([1, 2, 3]);
console.log(arr[-1]); // 3
```

## 注意事项

1. **性能影响**：Proxy 会带来一定的性能开销，不适合高性能关键路径
2. **目标对象透明**：Proxy 不会改变目标对象本身
3. **不可撤销**：标准 Proxy 一旦创建就不能撤销（但可以使用 `Proxy.revocable` 创建可撤销代理）
4. **拦截器必须**：不是所有拦截器都必须实现，未实现的拦截器会直接操作目标对象
5. **严格相等**：`proxy === target` 返回 false

Proxy 是 JavaScript 中非常强大的元编程工具，合理使用可以实现许多高级模式，但也应该谨慎使用，避免过度复杂化代码。


