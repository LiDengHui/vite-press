
# 深度clone


```js
function deepClone(obj, hash = new WeakMap()) {
    // 处理原始值和 null
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    // 处理循环引用
    if (hash.has(obj)) {
        return hash.get(obj);
    }

    // 处理 Date 对象
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }

    // 处理 RegExp 对象
    if (obj instanceof RegExp) {
        const flags = [
            obj.global ? 'g' : '',
            obj.ignoreCase ? 'i' : '',
            obj.multiline ? 'm' : '',
            obj.dotAll ? 's' : '',
            obj.unicode ? 'u' : '',
            obj.sticky ? 'y' : '', // 修正 sticky 标志为 'y'
        ].join('');

        const clonedRegExp = new RegExp(obj.source, flags);
        clonedRegExp.lastIndex = obj.lastIndex;
        return clonedRegExp;
    }

    // 处理 Map 对象
    if (obj instanceof Map) {
        const clonedMap = new Map();
        hash.set(obj, clonedMap);
        obj.forEach((value, key) => {
            clonedMap.set(deepClone(key, hash), deepClone(value, hash));
        });
        return clonedMap;
    }

    // 处理 Set 对象
    if (obj instanceof Set) {
        const clonedSet = new Set();
        hash.set(obj, clonedSet);
        obj.forEach(value => {
            clonedSet.add(deepClone(value, hash));
        });
        return clonedSet;
    }

    // 处理数组
    if (Array.isArray(obj)) {
        const clone = [];
        hash.set(obj, clone);
        for (let i = 0; i < obj.length; i++) {
            clone[i] = deepClone(obj[i], hash);
        }
        return clone;
    }

    // 处理普通对象
    const cloneObj = Object.create(Object.getPrototypeOf(obj));
    hash.set(obj, cloneObj);

    // 克隆 Symbol 属性
    const symKeys = Object.getOwnPropertySymbols(obj);
    if (symKeys.length > 0) {
        symKeys.forEach(symKey => {
            cloneObj[symKey] = deepClone(obj[symKey], hash);
        });
    }

    // 克隆普通属性
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            cloneObj[key] = deepClone(obj[key], hash);
        }
    }

    return cloneObj;
}
```

# **深度克隆（Deep Clone）函数详解**

`deepClone` 是一个 JavaScript 函数，用于**递归复制对象及其所有嵌套属性**，支持多种数据类型（如 `Object`、`Array`、`Date`、`RegExp`、`Map`、`Set`），并能正确处理**循环引用**和 **Symbol 属性**。

---

## **函数签名**
```javascript
function deepClone(obj, hash = new WeakMap()) {
    // 实现深度克隆逻辑
}
```
- **`obj`**：要克隆的目标对象（可以是任意类型）。
- **`hash`**（可选）：`WeakMap` 实例，用于检测循环引用（默认新建一个）。

---

## **克隆逻辑详解**

## **1. 处理原始值（Primitive Values）**
```javascript
if (typeof obj !== 'object' || obj === null) {
    return obj; // 直接返回原始值（数字、字符串、布尔、null、undefined）
}
```
- **原始值（非对象）** 直接返回，无需克隆。

---

## **2. 处理循环引用（Circular References）**
```javascript
if (hash.has(obj)) {
    return hash.get(obj); // 如果已克隆过，直接返回缓存
}
```
- 使用 `WeakMap` 存储**已克隆的对象**，避免无限递归。

---

## **3. 处理特殊对象类型**
### **(1) `Date` 对象**
```javascript
if (obj instanceof Date) {
    return new Date(obj.getTime()); // 克隆日期对象
}
```
- 通过 `getTime()` 获取时间戳，并重新构造 `Date`。

### **(2) `RegExp` 对象**
```javascript
if (obj instanceof RegExp) {
    const flags = [
        obj.global ? 'g' : '',
        obj.ignoreCase ? 'i' : '',
        obj.multiline ? 'm' : '',
        obj.dotAll ? 's' : '',
        obj.unicode ? 'u' : '',
        obj.sticky ? 'y' : '',
    ].join('');

    const clonedRegExp = new RegExp(obj.source, flags);
    clonedRegExp.lastIndex = obj.lastIndex; // 保留 lastIndex（如 /g 全局匹配状态）
    return clonedRegExp;
}
```
- 提取正则表达式的 `source` 和 `flags`，并保留 `lastIndex`（影响 `exec()` 匹配位置）。

### **(3) `Map` 对象**
```javascript
if (obj instanceof Map) {
    const clonedMap = new Map();
    hash.set(obj, clonedMap); // 存入 WeakMap，防止循环引用
    obj.forEach((value, key) => {
        clonedMap.set(deepClone(key, hash), deepClone(value, hash)); // 递归克隆键值
    });
    return clonedMap;
}
```
- 递归克隆 `Map` 的键和值。

### **(4) `Set` 对象**
```javascript
if (obj instanceof Set) {
    const clonedSet = new Set();
    hash.set(obj, clonedSet);
    obj.forEach(value => {
        clonedSet.add(deepClone(value, hash)); // 递归克隆 Set 元素
    });
    return clonedSet;
}
```
- 递归克隆 `Set` 的元素。

---
## **4. 处理数组（Array）**
```javascript
if (Array.isArray(obj)) {
    const clone = [];
    hash.set(obj, clone); // 存入 WeakMap，防止循环引用
    for (let i = 0; i < obj.length; i++) {
        clone[i] = deepClone(obj[i], hash); // 递归克隆数组元素
    }
    return clone;
}
```
- 递归克隆数组的每个元素。

---

## **5. 处理普通对象（Plain Object）**
```javascript
const cloneObj = Object.create(Object.getPrototypeOf(obj)); // 保持原型链
hash.set(obj, cloneObj); // 存入 WeakMap，防止循环引用

// 克隆 Symbol 属性
const symKeys = Object.getOwnPropertySymbols(obj);
if (symKeys.length > 0) {
    symKeys.forEach(symKey => {
        cloneObj[symKey] = deepClone(obj[symKey], hash);
    });
}

// 克隆普通属性（仅克隆自有属性，不克隆原型链上的属性）
for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloneObj[key] = deepClone(obj[key], hash);
    }
}

return cloneObj;
```
- **`Object.create(Object.getPrototypeOf(obj))`**：保持原型链。
- **`Object.getOwnPropertySymbols()`**：克隆 `Symbol` 属性。
- **`hasOwnProperty` 检查**：仅克隆**自有属性**，避免复制原型链上的属性。

---

## **总结**
| 数据类型 | 处理方式 |
|----------|----------|
| **原始值** | 直接返回 |
| **`Date`** | `new Date(obj.getTime())` |
| **`RegExp`** | `new RegExp(obj.source, flags)` |
| **`Map`** | 递归克隆键值 |
| **`Set`** | 递归克隆元素 |
| **`Array`** | 递归克隆元素 |
| **`Object`** | 递归克隆属性，保持原型链 |
| **循环引用** | `WeakMap` 缓存 |
| **`Symbol` 属性** | `Object.getOwnPropertySymbols()` |

该函数适用于**深拷贝复杂对象**，包括：
✅ 普通对象、数组  
✅ `Date`、`RegExp`、`Map`、`Set`  
✅ 循环引用  
✅ `Symbol` 属性

**适用场景**：
- 状态管理（如 Redux 的不可变数据）
- 数据持久化（如深拷贝后存 localStorage）
- 避免引用传递导致的副作用
## RegexClone

```js
function cloneReg(target, isDeep) {
    var regFlag = /\w*$/;
    var result = new target.constructor(target.source, regFlag.exec(target));
    if (isDeep) {
        result.lastIndex = 0;
    } else {
        result.lastIndex = target.lastIndex;
    }
    return result;
}

var regex = /yideng/g;

var reg2 = cloneReg(regex, true);

console.log(reg2.test("yideng"));
console.log(reg2.test("yideng"));
console.log(reg2.test("yideng"));
console.log(reg2.test("yideng"));
console.log(reg2.test("yideng"));
```

## Buffer克隆

```js
const allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;
const buf = Buffer.from("laoyuan");

function cloneBuffer(buffer, isDeep) {
    if (!isDeep) {
        return buffer.slice();
    }
    const length = buffer.length,
        result = allocUnsafe
            ? allocUnsafe(length)
            : new buffer.constructor(length);

    return result;
}

const buf2 = cloneBuffer(buf, true);

buf2.write("nodejs");
buf2.write("22");

console.log("buf", buf.toString("utf-8"));
console.log("buf2", buf2.toString("utf-8"));

```