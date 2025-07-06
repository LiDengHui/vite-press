##  JavaScript 属性描述符(Property Descriptors)详解

属性描述符是 JavaScript 中用于定义或修改对象属性行为的元数据对象，它提供了对属性更精细的控制能力。

## 属性描述符的意义

1. **精细化控制属性行为**：超越简单的值存储，控制属性的可写性、可枚举性等
2. **数据封装**：可以创建"私有"属性（虽然不是真正的私有）
3. **元编程能力**：可以在运行时动态修改属性行为
4. **兼容性处理**：用于实现 getter/setter，兼容旧代码
5. **框架/库开发基础**：Vue.js 等框架的响应式系统基于属性描述符实现

## 属性描述符的两种类型

## 1. 数据描述符（Data Descriptor）

```javascript
{
  value: any,         // 属性值
  writable: boolean,   // 是否可修改
  enumerable: boolean, // 是否可枚举
  configurable: boolean // 是否可配置/删除
}
```

## 2. 存取描述符（Accessor Descriptor）

```javascript
{
  get: function() {},  // 获取属性值函数
  set: function() {},  // 设置属性值函数
  enumerable: boolean, // 是否可枚举
  configurable: boolean // 是否可配置/删除
}
```

## 各参数具体作用

## 通用参数（两种描述符共有）

| 参数 | 类型 | 默认值 | 作用 |
|------|------|--------|------|
| `enumerable` | boolean | `false` | 控制属性是否出现在 `for...in` 循环和 `Object.keys()` 中 |
| `configurable` | boolean | `false` | 控制属性描述符能否被修改，属性能否被删除 |

## 数据描述符特有参数

| 参数 | 类型 | 默认值 | 作用 |
|------|------|--------|------|
| `value` | any | `undefined` | 属性的值 |
| `writable` | boolean | `false` | 控制属性值是否可以被赋值运算符(`=`)改变 |

## 存取描述符特有参数

| 参数    | 类型       | 默认值         | 作用                    |
|-------|----------|-------------|-----------------------|
| `get` | Function | `undefined` | 获取属性值时调用的函数，返回值将作为属性值 |
| `set` | Function | `undefined` | 设置属性值时调用的函数，接收新值作为参数  |

## 实际应用示例

## 1. 创建不可变属性

```javascript
const obj = {};
Object.defineProperty(obj, 'constant', {
  value: 42,
  writable: false,
  enumerable: true,
  configurable: false
});

obj.constant = 100; // 静默失败（严格模式会报错）
console.log(obj.constant); // 42
```

## 2. 创建私有效果属性

```javascript
const obj = {};
let _private = 0;

Object.defineProperty(obj, 'value', {
  get() {
    return _private;
  },
  set(newVal) {
    if (newVal > 0) _private = newVal;
  },
  enumerable: true
});
```

## 3. 动态计算属性

```javascript
const circle = {
  radius: 5
};

Object.defineProperty(circle, 'area', {
  get() {
    return Math.PI * this.radius * this.radius;
  },
  enumerable: true
});

console.log(circle.area); // 78.53981633974483
```

## 重要注意事项

1. **默认值与普通属性的区别**：
    - 通过赋值创建的属性：`enumerable`、`configurable`、`writable` 默认为 `true`
    - 通过 `defineProperty` 创建的属性：这些属性默认为 `false`

2. **configurable 的限制**：
    - 一旦设为 `false`，就不能再改为 `true`
    - 不能修改属性类型（数据属性和存取属性之间转换）

3. **性能考虑**：
    - 存取描述符比数据描述符有更高的性能开销
    - 频繁访问的属性建议使用数据描述符

属性描述符是 JavaScript 对象系统的强大特性，合理使用可以实现高度定制的对象行为，是高级 JavaScript 编程的重要工具。