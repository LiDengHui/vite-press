# Array常用方法
以下是 JavaScript 中常用的数组方法及示例说明：

---

### 1. **`push()`** - 末尾添加元素
```javascript
let arr = [1, 2];
arr.push(3); // 添加元素到末尾
console.log(arr); // [1, 2, 3]
```

---

### 2. **`pop()`** - 移除末尾元素
```javascript
let arr = [1, 2, 3];
arr.pop(); // 移除最后一个元素
console.log(arr); // [1, 2]
```

---

### 3. **`shift()`** - 移除开头元素
```javascript
let arr = [1, 2, 3];
arr.shift(); // 移除第一个元素
console.log(arr); // [2, 3]
```

---

### 4. **`unshift()`** - 开头添加元素
```javascript
let arr = [2, 3];
arr.unshift(1); // 开头添加元素
console.log(arr); // [1, 2, 3]
```

---

### 5. **`concat()`** - 合并数组
```javascript
let arr1 = [1, 2];
let arr2 = [3, 4];
let newArr = arr1.concat(arr2); // 合并数组
console.log(newArr); // [1, 2, 3, 4]
```

---

### 6. **`join()`** - 数组转字符串
```javascript
let arr = ["a", "b", "c"];
let str = arr.join("-"); // 用指定符号连接
console.log(str); // "a-b-c"
```

---

### 7. **`slice()`** - 截取子数组
```javascript
let arr = [1, 2, 3, 4];
let subArr = arr.slice(1, 3); // 截取索引 [1, 3) 的元素
console.log(subArr); // [2, 3]
```

---

### 8. **`splice()`** - 删除/替换元素
```javascript
let arr = [1, 2, 3, 4];
arr.splice(1, 2, "a", "b"); // 从索引1开始删除2个元素，并插入新元素
console.log(arr); // [1, "a", "b", 4]
```

---

### 9. **`indexOf()`** - 查找元素索引
```javascript
let arr = [10, 20, 30];
console.log(arr.indexOf(20)); // 1 (存在)
console.log(arr.indexOf(40)); // -1 (不存在)
```

---

### 10. **`includes()`** - 检查元素是否存在
```javascript
let arr = [10, 20, 30];
console.log(arr.includes(20)); // true
console.log(arr.includes(40)); // false
```

---

### 11. **`forEach()`** - 遍历数组
```javascript
let arr = ["a", "b", "c"];
arr.forEach((item, index) => {
  console.log(index + ": " + item);
});
// 输出: 
// 0: a
// 1: b
// 2: c
```

---

### 12. **`map()`** - 映射新数组
```javascript
let nums = [1, 2, 3];
let doubled = nums.map(num => num * 2);
console.log(doubled); // [2, 4, 6]
```

---

### 13. **`filter()`** - 过滤元素
```javascript
let nums = [1, 2, 3, 4, 5];
let even = nums.filter(num => num % 2 === 0);
console.log(even); // [2, 4]
```

---

### 14. **`reduce()`** - 累积计算
```javascript
let nums = [1, 2, 3, 4];
let sum = nums.reduce((total, num) => total + num, 0);
console.log(sum); // 10
```

---

### 15. **`find()`** - 查找首个匹配元素
```javascript
let users = [{id:1}, {id:2}, {id:3}];
let user = users.find(u => u.id === 2);
console.log(user); // {id: 2}
```

---

### 16. **`some()`** - 检查是否至少一个元素满足条件
```javascript
let nums = [1, 3, 5];
console.log(nums.some(num => num % 2 === 0)); // false (无偶数)
```

---

### 17. **`every()`** - 检查所有元素是否满足条件
```javascript
let nums = [2, 4, 6];
console.log(nums.every(num => num % 2 === 0)); // true (全是偶数)
```

---

### 18. **`sort()`** - 排序
```javascript
let arr = [3, 1, 4, 2];
arr.sort((a, b) => a - b); // 升序
console.log(arr); // [1, 2, 3, 4]
```

---

### 19. **`reverse()`** - 反转数组
```javascript
let arr = [1, 2, 3];
arr.reverse();
console.log(arr); // [3, 2, 1]
```

---

### 20. **`flat()`** - 扁平化嵌套数组
```javascript
let arr = [1, [2, [3]]];
console.log(arr.flat(2)); // [1, 2, 3] (参数为展开深度)
```

---

### 21. **`Array.isArray()`** - 检查是否为数组
```javascript
console.log(Array.isArray([1, 2])); // true
console.log(Array.isArray("123")); // false
```

---

### 总结：
| 方法              | 作用      | 是否修改原数组 |
|-----------------|---------|---------|
| `push/pop`      | 末尾增/删   | ✅       |
| `shift/unshift` | 开头增/删   | ✅       |
| `splice`        | 删除/替换元素 | ✅       |
| `sort/reverse`  | 排序/反转   | ✅       |
| `concat`        | 合并数组    | ❌       |
| `slice`         | 截取子数组   | ❌       |
| `map/filter`    | 映射/过滤   | ❌       |
| `forEach`       | 遍历      | ❌       |
| `reduce`        | 累积计算    | ❌       |

这些方法覆盖了数组操作的常见场景，合理使用可极大提升开发效率！

## 静态方法
以下是 JavaScript 中 `Array` 对象的所有静态方法及其作用和示例：

### 1. **`Array.isArray()`**
判断一个值是否为数组
```javascript
console.log(Array.isArray([1, 2]));       // true
console.log(Array.isArray({}));           // false
console.log(Array.isArray("array"));      // false
console.log(Array.isArray(Array.prototype)); // true (原型也是数组)
```

### 2. **`Array.from()`**
将类数组对象或可迭代对象转换为真正的数组
```javascript
// 字符串转数组
console.log(Array.from("hello"));  // ['h','e','l','l','o']

// Set转数组
const set = new Set([1, 2, 3]);
console.log(Array.from(set));      // [1, 2, 3]

// 带映射函数
console.log(Array.from([1, 2, 3], x => x * 2)); // [2, 4, 6]

// 生成数字序列
console.log(Array.from({length: 5}, (_, i) => i)); // [0, 1, 2, 3, 4]
```

### 3. **`Array.of()`**
创建包含任意类型参数的新数组（解决构造函数歧义）
```javascript
console.log(Array.of(7));       // [7] 
console.log(Array.of(1, 2, 3)); // [1, 2, 3]
console.log(Array.of());        // []

// 对比构造函数歧义
console.log(new Array(3));      // [empty × 3] (稀疏数组)
console.log(Array.of(3));       // [3] (包含数字3)
```

### 4. **`Array.fromAsync()`** (ES2024 新增)
从异步可迭代对象创建数组
```javascript
async function* asyncGenerator() {
  yield 1;
  yield 2;
  yield 3;
}

(async () => {
  const arr = await Array.fromAsync(asyncGenerator());
  console.log(arr); // [1, 2, 3]
})();

// 处理异步数据源
const asyncSet = new Set([Promise.resolve(10), Promise.resolve(20)]);
Array.fromAsync(asyncSet).then(console.log); // [10, 20]
```

### 5. **`Array()` 构造函数**
创建数组对象（静态调用效果等同于 `new Array()`）
```javascript
const arr1 = Array(3);     // 创建长度为3的空数组: [empty × 3]
const arr2 = Array(1, 2);  // 创建包含元素的数组: [1, 2]

// 与Array.of的区别
console.log(Array(3));    // [empty × 3]
console.log(Array.of(3)); // [3]
```

### 静态方法总结表

| 方法 | 作用 | 使用场景 | 示例 |
|------|------|----------|------|
| **`Array.isArray()`** | 检测是否为数组 | 类型检查 | `Array.isArray([]) // true` |
| **`Array.from()`** | 转换类数组对象 | DOM操作/迭代器转换 | `Array.from(document.querySelectorAll('div'))` |
| **`Array.of()`** | 创建包含参数的新数组 | 避免构造函数歧义 | `Array.of(5) // [5]` |
| **`Array.fromAsync()`** | 从异步源创建数组 | 处理异步数据流 | `await Array.fromAsync(asyncGenerator)` |
| **`Array()`** | 创建数组对象 | 数组初始化 | `Array(1, 2, 3) // [1,2,3]` |

### 关键区别：
- **`Array.isArray()`** 是唯一用于类型检测的方法
- **`Array.from()`** 用于转换现有对象
- **`Array.of()`** 解决 `new Array()` 的数字参数歧义问题
- **`Array.fromAsync()`** 是异步版本的 `from`（ES2024+）
- **`Array()`** 构造函数直接调用时行为与 `new Array()` 相同

> **最佳实践**：
> - 优先使用 `Array.from()` 代替 `[...arrayLike]`（更安全）
> - 优先使用 `Array.of()` 代替 `new Array()`（避免歧义）
> - 使用 `Array.isArray()` 代替 `instanceof Array`（更可靠）
