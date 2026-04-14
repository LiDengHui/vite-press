# React 性能优化的方法

React 组件性能优化是提升应用流畅度的关键，以下是常见优化方法及具体示例：

---

### 1. **避免不必要的渲染**
#### 方法：使用 `React.memo` 包裹组件
**原理**：对 props 进行浅比较，阻止无变化的重新渲染  
**示例**：
```jsx
const User = React.memo(({ name }) => {
  console.log("User渲染"); // 仅当name变化时触发
  return <div>{name}</div>;
});

// 父组件
function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>点击 {count}</button>
      <User name="固定值" /> {/* 不会因count变化而渲染 */}
    </>
  );
}
```

---

### 2. **精准控制依赖项**
#### 方法：`useCallback` + `useMemo`
**原理**：缓存函数和计算结果，避免子组件因引用变化而重渲  
**示例**：
```jsx
const Parent = () => {
  const [count, setCount] = useState(0);
  
  // 缓存函数
  const handleClick = useCallback(() => {
    console.log("提交数据");
  }, []); // 空依赖：函数永不改变

  // 缓存计算结果
  const user = useMemo(() => ({
    name: "John",
    age: count > 10 ? 30 : 20 // 仅当count>10时重新计算
  }), [count > 10]); // 依赖为布尔值

  return (
    <>
      <Child onClick={handleClick} user={user} />
    </>
  );
};

const Child = React.memo(({ onClick, user }) => { ... });
```

---

### 3. **虚拟化长列表**
#### 方法：使用 `react-window` 库
**原理**：只渲染可视区域内的元素  
**示例**：
```jsx
import { FixedSizeList as List } from 'react-window';

const Row = ({ index, style }) => (
  <div style={style}>行 {index}</div>
);

const LongList = () => (
  <List
    height={500}
    itemCount={1000}
    itemSize={35} // 每行高度
    width={300}
  >
    {Row}
  </List>
);
```

---

### 4. **代码分割（懒加载）**
#### 方法：`React.lazy` + `Suspense`
**原理**：按需加载组件，减少初始包体积  
**示例**：
```jsx
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <HeavyComponent /> {/* 使用时才加载 */}
    </Suspense>
  );
}
```

---

### 5. **优化状态更新范围**
#### 方法：状态下沉 + 局部状态
**原理**：避免全局状态触发大范围更新  
**示例**：
```jsx
// 优化前：状态在父组件
const Parent = () => {
  const [value, setValue] = useState("");
  return (
    <div>
      <input value={value} onChange={e => setValue(e.target.value)} />
      {/* 多个子组件 */}
    </div>
  );
};

// 优化后：状态隔离到输入组件
const OptimizedInput = () => {
  const [value, setValue] = useState(""); // 状态局部化
  return <input value={value} onChange={e => setValue(e.target.value)} />;
};
```

---

### 6. **避免内联对象/函数**
**问题**：每次渲染创建新对象，导致子组件重渲  
**优化对比**：
```jsx
// ❌ 错误：每次渲染创建新对象
<Child style={{ color: 'red' }} onClick={() => {}} />

// ✅ 正确：使用useMemo/useCallback
const style = useMemo(() => ({ color: 'red' }), []);
const onClick = useCallback(() => {}, []);
<Child style={style} onClick={onClick} />
```

---

### 7. **使用 Key 优化列表**
**原理**：帮助 React 识别元素变化，减少 DOM 操作  
**示例**：
```jsx
{items.map(item => (
  <li key={item.id}> {/* 唯一且稳定的key */}
    {item.name}
  </li>
))}
```

---

### 8. **防抖/节流高频操作**
**示例**：使用 `lodash.throttle` 优化滚动事件
```jsx
import throttle from 'lodash.throttle';

const ScrollComponent = () => {
  const handleScroll = useCallback(throttle(() => {
    console.log("滚动处理");
  }, 200), []);

  return <div onScroll={handleScroll}>...</div>;
};
```

---

### 9. **使用 Profiler 定位瓶颈**
**方法**：React DevTools 的 Profiler 工具  
**操作**：
1. 录制组件渲染过程
2. 分析耗时严重的组件
3. 针对性地优化（如：拆分复杂组件）

---

### 10. **谨慎使用 Context**
**优化方案**：
- 拆分多个 Context 避免无关更新
- 在 Context Provider 使用 `useMemo`
```jsx
const UserContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  
  // 缓存Provider值
  const contextValue = useMemo(() => ({ user, setUser }), [user]);

  return (
    <UserContext.Provider value={contextValue}>
      <Child />
    </UserContext.Provider>
  );
}
```

---

### 总结场景选择：
| **场景** | **推荐优化**                  |
|--------|---------------------------|
| 纯展示组件  | `React.memo`              |
| 高频事件   | 节流/防抖 + `useCallback`     |
| 大型列表   | 虚拟滚动（react-window）        |
| 复杂计算   | `useMemo`                 |
| 异步加载模块 | `React.lazy` + `Suspense` |
| 深层状态传递 | 拆分 Context + `useMemo`    |

通过组合使用这些策略，可显著提升 React 应用性能。优先使用性能分析工具定位问题，避免过度优化。
