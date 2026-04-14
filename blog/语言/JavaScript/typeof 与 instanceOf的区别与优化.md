# typeof 与 instanceOf的区别与优化
在 JavaScript 中，`typeof` 和 `instanceof` 是两种常用的类型判断机制，但它们的工作原理和应用场景有显著差异。以下是详细对比及类型判断的优化方案：


## **1. `typeof` 运算符**
**作用**：返回操作数的**基本类型**字符串。  
**特点**：
- 适用于原始类型（`string`, `number`, `boolean`, `symbol`, `bigint`）和 `undefined`。
- `null` 返回 `"object"`（历史遗留 Bug）。
- 函数返回 `"function"`。
- 其他对象（数组、日期等）均返回 `"object"`。

```javascript
typeof "hello"      // "string"
typeof 42           // "number"
typeof true         // "boolean"
typeof undefined    // "undefined"
typeof null         // "object" （陷阱！）
typeof function(){} // "function"
typeof []           // "object"
typeof new Date()   // "object"
```



## **2. `instanceof` 运算符**
**作用**：检查构造函数的 `prototype` 是否在对象的**原型链**上。  
**特点**：
- 用于检测对象是否为特定类的实例（包括自定义类）。
- 对原始类型无效（直接返回 `false`）。
- 依赖原型链，可能被跨窗口/框架问题影响（如 iframe）。

```javascript
[] instanceof Array      // true
[] instanceof Object     // true（Array 继承自 Object）
"str" instanceof String  // false（原始类型非对象）

class MyClass {}
const obj = new MyClass();
obj instanceof MyClass   // true
```



## **核心区别**
| **特性**         | `typeof`                      | `instanceof`                  |
|------------------|-------------------------------|-------------------------------|
| **检查目标**     | 基本类型                      | 对象类型                      |
| **返回值**       | 类型字符串（如 `"string"`）   | 布尔值                        |
| **处理 `null`**  | 错误返回 `"object"`           | `null instanceof X` → `false` |
| **原始类型**     | 有效                          | 无效（始终 `false`）          |
| **原型链依赖**   | 无                            | 有（可能被修改影响结果）      |



# **类型判断优化方案**
## (1) 精准判断 `null`
```javascript
const isNull = value => value === null;
```

## (2) 区分数组 vs 普通对象
```javascript
// 方法1：ES6 Array.isArray()
Array.isArray([]); // true

// 方法2：利用 Object.prototype.toString
Object.prototype.toString.call([]); // "[object Array]"
```

## (3) 通用类型检测（推荐）
使用 `Object.prototype.toString` 精准获取类型标签：

```javascript
function getType(value) {
  return Object.prototype.toString.call(value)
    .replace(/^\[object (\S+)\]$/, '$1')
    .toLowerCase();
}

getType([])    // "array"
getType(null)  // "null"
getType(/abc/) // "regexp"
getType(new Map()) // "map"
```

## (4) 安全检测内置类型
```javascript
// 检测 Promise
value instanceof Promise; // 需确保环境一致
Object.prototype.toString.call(value) === "[object Promise]"; // 更安全

// 检测日期
value instanceof Date;
Object.prototype.toString.call(value) === "[object Date]";
```

## (5) 自定义类检测
结合 `instanceof` 与 `Symbol.toStringTag` 实现可靠判断：
```javascript
class MyClass {
  get [Symbol.toStringTag]() {
    return "MyClass";
  }
}
const obj = new MyClass();

obj instanceof MyClass; // true
getType(obj); // "myclass" （通过通用函数）
```

---

## **最佳实践总结**
1. **原始类型** → 用 `typeof`（注意 `null` 陷阱）。
2. **内置对象**（`Array`, `Date` 等）→ 优先用 `Object.prototype.toString` 或 `Array.isArray()`。
3. **自定义类** → 用 `instanceof` + `Symbol.toStringTag` 双保险。
4. **跨框架安全** → 避免 `instanceof`，改用 `Object.prototype.toString`。

通过组合这些方法，可覆盖所有类型判断场景，避免常见陷阱。
