Recoil 状态管理

在大型项目中使用 **Recoil** 管理全局状态是一个非常实用的方案，特别适用于状态分散但组件结构清晰的场景，比如一个具有多个视图、筛选、编辑功能的 **Todo List 应用**。下面我将结合一个中大型的 Todo List 项目示例，从状态设计到操作方法，系统地说明如何使用 Recoil。

---

## ✅ Recoil 核心概念回顾

| 概念                  | 说明                                 |
|---------------------|------------------------------------|
| `atom`              | 原子状态，是全局状态的最小单位。可被多个组件共享。          |
| `selector`          | 派生状态，可以从一个或多个 atom 派生，具有缓存能力，支持读写。 |
| `useRecoilState`    | 读取 + 设置 atom                       |
| `useRecoilValue`    | 只读取 atom 或 selector                |
| `useSetRecoilState` | 只设置 atom                           |
| `RecoilRoot`        | 包裹在应用最外层，提供上下文环境                   |

---

## 🎯 示例场景：Todo List 项目功能模块

功能包括：

1. 添加 / 删除 / 更新 todo
2. 标记完成状态
3. 筛选（全部、完成、未完成）
4. 编辑功能
5. 多视图支持（如日历视图、列表视图）

---

## 🧱 状态设计（atoms）

```ts
// atoms/todoListState.ts
import { atom } from 'recoil';

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
};

export const todoListState = atom<Todo[]>({
  key: 'todoListState',
  default: [],
});

export const todoFilterState = atom<'all' | 'completed' | 'uncompleted'>({
  key: 'todoFilterState',
  default: 'all',
});
```

---

## 🧮 派生状态（selectors）

```ts
// selectors/filteredTodoList.ts
import { selector } from 'recoil';
import { todoListState, todoFilterState } from '../atoms/todoListState';

export const filteredTodoListState = selector({
  key: 'filteredTodoListState',
  get: ({ get }) => {
    const filter = get(todoFilterState);
    const list = get(todoListState);

    switch (filter) {
      case 'completed':
        return list.filter((item) => item.completed);
      case 'uncompleted':
        return list.filter((item) => !item.completed);
      default:
        return list;
    }
  },
});
```

---

## 🧩 使用状态的组件

### 添加 Todo

```tsx
import { useSetRecoilState } from 'recoil';
import { todoListState } from '../atoms/todoListState';
import { v4 as uuidv4 } from 'uuid';

export const AddTodo = () => {
  const setTodoList = useSetRecoilState(todoListState);

  const addTodo = (title: string) => {
    setTodoList((oldList) => [
      ...oldList,
      { id: uuidv4(), title, completed: false, createdAt: Date.now() },
    ]);
  };

  return (
    <input
      onKeyDown={(e) => {
        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
          addTodo(e.currentTarget.value.trim());
          e.currentTarget.value = '';
        }
      }}
      placeholder="Add todo"
    />
  );
};
```

### 显示 Todo 列表

```tsx
import { useRecoilValue } from 'recoil';
import { filteredTodoListState } from '../selectors/filteredTodoList';

export const TodoList = () => {
  const todos = useRecoilValue(filteredTodoListState);

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          {todo.title} {todo.completed ? '(Done)' : ''}
        </li>
      ))}
    </ul>
  );
};
```

### 切换 Filter

```tsx
import { useRecoilState } from 'recoil';
import { todoFilterState } from '../atoms/todoListState';

export const FilterControl = () => {
  const [filter, setFilter] = useRecoilState(todoFilterState);

  return (
    <div>
      <button onClick={() => setFilter('all')} disabled={filter === 'all'}>全部</button>
      <button onClick={() => setFilter('completed')} disabled={filter === 'completed'}>已完成</button>
      <button onClick={() => setFilter('uncompleted')} disabled={filter === 'uncompleted'}>未完成</button>
    </div>
  );
};
```

---

## 📦 项目结构建议

```
src/
├── atoms/                // 所有 atom 状态定义
│   └── todoListState.ts
├── selectors/            // 所有 selector 状态派生逻辑
│   └── filteredTodoList.ts
├── components/           // UI 组件
│   ├── AddTodo.tsx
│   ├── TodoList.tsx
│   └── FilterControl.tsx
├── App.tsx
└── index.tsx
```

---

## 🚀 高级用法（适用于大型项目）

### 1. **使用 `atomFamily` 区分多个 Todo 模块（比如分组）**

```ts
import { atomFamily } from 'recoil';

export const todoListFamily = atomFamily<Todo[], string>({
  key: 'todoListFamily',
  default: [],
});
```

这样就可以用 `useRecoilState(todoListFamily('work'))` 管理不同组的任务。

---

### 2. **异步状态加载（与 selector 结合）**

```ts
export const todoListAsyncState = selector({
  key: 'todoListAsyncState',
  get: async () => {
    const response = await fetch('/api/todos');
    return await response.json();
  },
});
```

---

### 3. **封装自定义 hook 提高可维护性**

```ts
export const useTodoActions = () => {
  const setTodos = useSetRecoilState(todoListState);

  const toggleTodo = (id: string) =>
    setTodos((todos) =>
      todos.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );

  const deleteTodo = (id: string) =>
    setTodos((todos) => todos.filter((t) => t.id !== id));

  return { toggleTodo, deleteTodo };
};
```

---

## ✅ 结语

在大型项目中，使用 Recoil 具有以下优势：

* 状态管理简单直观（尤其在组件粒度状态较多时）
* 支持异步和派生状态，适合复杂计算
* 可以和 React 并发特性天然兼容
* 结合 `atomFamily` 和 `selectorFamily` 支持模块化设计
