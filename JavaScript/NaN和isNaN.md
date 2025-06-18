# NaN和isNaN


在 JavaScript 中，`isNaN` 函数用于检测一个值是否为 `NaN`（Not-a-Number），但它存在一些设计上的问题，容易导致误解和错误。以下是主要问题及解决方案：


## **问题 1：`isNaN` 会先强制类型转换**
`isNaN` 在检查前会**先将参数转换为数值类型**。如果转换失败（结果为 `NaN`），则返回 `true`。这会导致非数值类型（如字符串）被误判：

```javascript
isNaN("123");     // false（字符串 "123" 转成数字 123，不是 NaN）
isNaN("Hello");   // true（字符串转数字失败，得到 NaN）
isNaN("");        // false（空字符串转成 0）
isNaN("    ");    // false（空格字符串转成 0）
isNaN([]);        // false（空数组转成 0）
isNaN([1]);       // false（数组 [1] 转成 1）
isNaN([1, 2]);    // true（数组转数字失败，得到 NaN）
isNaN({});        // true（对象转数字失败）
isNaN(undefined); // true（undefined 转数字失败）
```

**问题本质**：`isNaN` 实际检查的是 **“转换后的值是否是 `NaN`”**，而非 **“原值是否是 `NaN`”**。

---

### **问题 2：无法可靠检测真正的 `NaN`**
由于强制转换，一些明显不是数字的值（如空字符串、空数组）会被转换成 `0`，导致 `isNaN` 返回 `false`，而开发者可能期望返回 `true`。

---

## **解决方案：使用 `Number.isNaN` (ES6+)**
ES6 引入了 `Number.isNaN`，它**不会进行类型转换**，只对真正的 `NaN` 返回 `true`：

```javascript
Number.isNaN(NaN);        // true（唯一正确的情况）
Number.isNaN("Hello");    // false（字符串不是 NaN）
Number.isNaN("");         // false（空字符串不是 NaN）
Number.isNaN([]);         // false（数组不是 NaN）
Number.isNaN(undefined);  // false（undefined 不是 NaN）
```

---

## **如何兼容旧环境？**
在不支持 ES6 的环境中，可通过以下 Polyfill 实现 `Number.isNaN`：

```javascript
if (!Number.isNaN) {
  Number.isNaN = function(value) {
    // 利用 NaN 是 JavaScript 中唯一不等于自身的值这一特性
    return value !== value;
  };
}
```

---

## **总结：使用场景对比**
| **场景**              | `isNaN` (全局) | `Number.isNaN` (推荐) |
|---------------------|--------------|---------------------|
| 检测 `NaN`            | ❌ 不可靠（会转换类型） | ✅ 安全                |
| 检测非数字字符串（如 `"abc"`） | ✅ 返回 `true`  | ❌ 返回 `false`        |
| 检测空字符串 `""`         | ❌ 返回 `false` | ❌ 返回 `false`        |
| 检测数组 `[]`           | ❌ 返回 `false` | ❌ 返回 `false`        |

---

## **最佳实践**
1. **永远避免使用全局 `isNaN`**  
   它的类型转换行为极易导致隐蔽的 Bug。
2. **使用 `Number.isNaN`**  
   精准检测真正的 `NaN` 值。
3. **如果需要检查“是否为有效数字”**：  
   更推荐用 **`typeof value === 'number' && !isNaN(value)`** 或 **`Number.isFinite(value)`**。

```javascript
// 检查是否为有效数字（非 NaN 且可计算）
function isValidNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

// 或
function isValidNumber(value) {
  return Number.isFinite(value); // 排除 Infinity 和 NaN
}
```
