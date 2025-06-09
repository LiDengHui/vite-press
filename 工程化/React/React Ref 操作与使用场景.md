# React Ref 操作与使用场景

在 React 中，`forwardRef` 主要用于解决特定场景下的引用传递问题。以下是需要使用 `forwardRef` 的主要情况：

### 1. **需要向函数子组件传递 ref**
当父组件需要直接访问函数式子组件的 DOM 节点或子组件实例时（因为函数组件默认不支持 `ref` 属性）

```jsx
// 子组件（使用 forwardRef）
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="fancy-btn">
    {props.children}
  </button>
));

// 父组件
function App() {
  const buttonRef = useRef(null);

  useEffect(() => {
    // 直接访问子组件的 DOM 元素
    buttonRef.current.style.backgroundColor = "blue";
  }, []);

  return <FancyButton ref={buttonRef}>点击我</FancyButton>;
}
```

### 2. **在高阶组件（HOC）中透传 ref**
当使用高阶组件包装组件时，需要确保 ref 能传递到内部的原始组件

```jsx
// 高阶组件（使用 forwardRef 透传）
function withTheme(Component) {
  class ThemedComponent extends React.Component {
    // ...主题相关逻辑
    
    render() {
      const { forwardedRef, ...rest } = this.props;
      return <Component ref={forwardedRef} {...rest} />;
    }
  }

  return React.forwardRef((props, ref) => (
    <ThemedComponent {...props} forwardedRef={ref} />
  ));
}

// 原始组件
class Button extends React.Component {
  // ...
}

// 包装后的组件
const ThemedButton = withTheme(Button);

// 父组件使用
function App() {
  const buttonRef = useRef(null);

  // 可以访问到原始 Button 组件实例
  useEffect(() => {
    console.log(buttonRef.current); // Button 实例
  }, []);

  return <ThemedButton ref={buttonRef}>提交</ThemedButton>;
}
```

### 3. **需要暴露子组件方法给父组件**
当父组件需要直接调用子组件的方法时（特别是函数组件）

```jsx
// 子组件（暴露 focus 方法）
const InputField = React.forwardRef((props, ref) => {
  const inputRef = useRef(null);
  
  // 向父组件暴露方法
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    getValue: () => inputRef.current.value
  }));

  return <input ref={inputRef} {...props} />;
});

// 父组件
function Form() {
  const inputRef = useRef(null);

  const handleFocus = () => {
    // 直接调用子组件暴露的方法
    inputRef.current.focus();
    console.log("当前值:", inputRef.current.getValue());
  };

  return (
    <div>
      <InputField ref={inputRef} />
      <button onClick={handleFocus}>聚焦输入框</button>
    </div>
  );
}
```

### 4. **第三方组件库需要支持 ref**
当开发可复用的组件库时，需要允许用户直接访问内部 DOM 元素

```jsx
// 自定义模态框组件
const Modal = React.forwardRef(({ children }, ref) => {
  const dialogRef = useRef(null);

  // 暴露打开/关闭方法
  useImperativeHandle(ref, () => ({
    open: () => dialogRef.current.showModal(),
    close: () => dialogRef.current.close()
  }));

  return (
    <dialog ref={dialogRef}>
      <div className="modal-content">{children}</div>
    </dialog>
  );
});

// 使用组件
function App() {
  const modalRef = useRef(null);

  return (
    <div>
      <button onClick={() => modalRef.current.open()}>打开模态框</button>
      <Modal ref={modalRef}>
        <h2>标题</h2>
        <p>内容...</p>
        <button onClick={() => modalRef.current.close()}>关闭</button>
      </Modal>
    </div>
  );
}
```

### 何时不需要使用 forwardRef？
- 当父组件只需要访问**类组件**的实例时（类组件本身就支持 ref）
- 当使用普通 DOM 元素（如 div、input）时
- 当可以通过 props 回调实现相同功能时（优先考虑数据流）

### 最佳实践
1. **避免过度使用**：优先通过 props 和状态提升管理组件交互
2. **明确文档**：在组件库中暴露哪些方法和属性
3. **结合 useImperativeHandle**：控制暴露给父组件的接口
4. **类型安全**：在 TypeScript 中明确定义 ref 的类型

```tsx
// TypeScript 示例
type FancyButtonHandle = {
  focus: () => void;
  animate: () => void;
};

const FancyButton = forwardRef<FancyButtonHandle, ButtonProps>(
  (props, ref) => {
    // ...
  }
);
```

总之，`forwardRef` 主要在需要"穿透"组件边界直接访问子组件的 DOM 节点或特定方法时使用，特别是在函数组件和高阶组件场景下。
