# Object对象方法

在 JavaScript 中，可以通过以下几种方式遍历对象的属性和值：

---

### **1. `for...in` 循环**
遍历对象自身的和继承的可枚举属性（不包含 Symbol 属性）。
```javascript
const obj = { a: 1, b: 2, c: 3 };

for (const key in obj) {
    console.log(key, obj[key]); // 输出：a 1, b 2, c 3
}
```
**注意**：
- 会遍历原型链上的可枚举属性（可用 `obj.hasOwnProperty(key)` 过滤）。
- 不保证顺序（但现代 JS 引擎会按数字升序 + 插入顺序排列）。

---

### **2. `Object.keys(obj)`**
返回对象 **自身可枚举属性** 的数组（不包含 Symbol 属性）。
```javascript
const keys = Object.keys(obj); // ["a", "b", "c"]
keys.forEach(key => {
    console.log(key, obj[key]); // 输出：a 1, b 2, c 3
});
```
**特点**：
- 只遍历对象自身的属性（不包含继承的）。
- 顺序与 `for...in` 一致。

---

### **3. `Object.values(obj)`**
返回对象 **自身可枚举属性值** 的数组（不包含 Symbol 属性）。
```javascript
const values = Object.values(obj); // [1, 2, 3]
values.forEach(value => {
    console.log(value); // 输出：1, 2, 3
});
```

---

### **4. `Object.entries(obj)`**
返回对象 **自身可枚举键值对** 的数组（不包含 Symbol 属性）。
```javascript
const entries = Object.entries(obj); // [["a", 1], ["b", 2], ["c", 3]]
entries.forEach(([key, value]) => {
    console.log(key, value); // 输出：a 1, b 2, c 3
});
```

---

### **5. `Object.getOwnPropertyNames(obj)`**
返回对象 **所有自身属性（包括不可枚举的）** 的数组（不包含 Symbol 属性）。
```javascript
const allKeys = Object.getOwnPropertyNames(obj); // ["a", "b", "c"]
```

---

### **6. `Object.getOwnPropertySymbols(obj)`**
返回对象 **所有 Symbol 属性** 的数组。
```javascript
const sym = Symbol('sym');
const objWithSymbol = { [sym]: 'symbolValue', d: 4 };
const symbols = Object.getOwnPropertySymbols(objWithSymbol); // [Symbol(sym)]
```

---

### **7. `Reflect.ownKeys(obj)`**
返回对象 **所有自身属性（包括不可枚举和 Symbol）** 的数组。
```javascript
const allKeysAndSymbols = Reflect.ownKeys(objWithSymbol); // ["d", Symbol(sym)]
```

---

### **8. 结合 `for...of` 和 `Object.keys()`**
如果希望用 `for...of` 遍历对象：
```javascript
for (const key of Object.keys(obj)) {
    console.log(key, obj[key]); // 输出：a 1, b 2, c 3
}
```

---

### **总结**
| 方法                               | 遍历内容         | 是否包含继承属性 | 是否包含 Symbol | 是否包含不可枚举属性 |
|----------------------------------|--------------|----------|-------------|------------|
| `for...in`                       | 可枚举属性        | ✔️       | ❌           | ❌          |
| `Object.keys()`                  | 自身可枚举属性      | ❌        | ❌           | ❌          |
| `Object.values()`                | 自身可枚举值       | ❌        | ❌           | ❌          |
| `Object.entries()`               | 自身可枚举键值对     | ❌        | ❌           | ❌          |
| `Object.getOwnPropertyNames()`   | 所有自身属性       | ❌        | ❌           | ✔️         |
| `Object.getOwnPropertySymbols()` | 自身 Symbol 属性 | ❌        | ✔️          | ✔️         |
| `Reflect.ownKeys()`              | 所有自身属性       | ❌        | ✔️          | ✔️         |

