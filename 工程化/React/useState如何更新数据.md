# useState如何更新
在 React 中，`useState` 是用于在函数组件中添加状态管理的 Hook。更新状态需要使用它返回的 **setter 函数**，而不是直接修改状态变量。以下是详细说明和示例：

---

### 基本用法：
```jsx
import React, { useState } from 'react';

function Counter() {
  // 声明状态变量 count 和更新函数 setCount
  const [count, setCount] = useState(0);

  // 正确更新方式：调用 setCount
  const increment = () => {
    setCount(count + 1); // ✅ 直接传递新值
  };

  // 函数式更新（推荐依赖旧值时）
  const incrementSafely = () => {
    setCount(prevCount => prevCount + 1); // ✅ 使用函数确保最新值
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+1（直接更新）</button>
      <button onClick={incrementSafely}>+1（函数式更新）</button>
    </div>
  );
}
```

---

### 关键规则：
1. **永远不要直接修改状态**
   ```jsx
   // ❌ 错误！不会触发重新渲染
   count = 10;
   ```

2. **更新对象/数组时需创建新引用**
   ```jsx
   const [user, setUser] = useState({ name: 'Alice', age: 30 });

   // ✅ 正确：展开原对象创建新对象
   setUser({ ...user, age: 31 });

   // ✅ 数组更新：使用 map/filter/concat 等
   const [list, setList] = useState(['a', 'b']);
   setList([...list, 'c']); // 添加新元素
   ```

3. **异步更新注意**  
   `setCount` 是异步的，调用后状态不会立即改变：
   ```jsx
   console.log(count); // 更新前的旧值
   setCount(42);
   console.log(count); // 仍是旧值！（不是 42）
   ```

---

### 为什么推荐函数式更新？
当新状态依赖旧值时（尤其是多次连续更新），使用 **函数形式** 可避免闭包问题：
```jsx
// ❌ 连续调用可能不会累加（count 始终是快照值）
const badIncrement = () => {
  setCount(count + 1);
  setCount(count + 1); // 实际只增加一次
};

// ✅ 函数式更新确保基于最新状态
const goodIncrement = () => {
  setCount(prev => prev + 1);
  setCount(prev => prev + 1); // 正确增加两次
};
```

---

### 完整对象更新示例：
```jsx
function UserForm() {
  const [form, setForm] = useState({
    name: '',
    email: ''
  });

  const handleChange = (e) => {
    // ✅ 合并更新对象
    setForm({
      ...form,          // 复制旧字段
      [e.target.name]: e.target.value // 覆盖修改的字段
    });
  };

  return (
    <form>
      <input 
        name="name" 
        value={form.name} 
        onChange={handleChange} 
      />
      <input 
        name="email"
        value={form.email} 
        onChange={handleChange} 
      />
    </form>
  );
}
```

---

### 总结：

| 场景                        | 正确做法                          |
|:--------------------------|-----------------------------------|
| 更新基本类型（数字/字符串）            | `setValue(newValue)` 或 `setValue(prev => newValue)` |
| 更新对象                      | `setObj({ ...obj, key: newValue })` |
| 更新数组                      | `setArr([...arr, newItem])` 或 `setArr(arr.filter(...))` |
| 连续多次更新依赖旧值                | **必须** 用函数式 `setValue(prev => prev + 1)` |

遵循这些规则可确保状态更新触发组件重新渲染，并避免常见的 React 状态管理错误。
