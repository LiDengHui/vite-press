# Redux 状态管理

在大型项目中使用 Redux 管理全局状态（以 Todo List 为例），可以帮助你实现 **可预测、可调试和可维护** 的状态管理，特别是在多人协作或复杂交互的场景中。以下是一个结构化的讲解，适合用于大型项目：

---

## 🧩 一、项目结构建议（大型项目）

```bash
src/
├── app/
│   └── store.ts              # Redux store 配置
├── features/
│   └── todos/
│       ├── todosSlice.ts     # todos 状态逻辑（reducer + actions）
│       ├── todosAPI.ts       # 处理异步操作，如fetchTodos
│       └── components/       # UI 组件
├── hooks/
│   └── useAppDispatch.ts     # 自定义 dispatch hook
├── types/
│   └── todo.ts               # Todo 类型定义
└── index.tsx
```

---

## 📦 二、初始化 Redux Store

```ts
// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import todosReducer from '../features/todos/todosSlice';

export const store = configureStore({
    reducer: {
        todos: todosReducer
    }
});

// 为组件提供类型支持
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

## 🧠 三、定义状态 Slice（reducer + actions）

```ts
// src/features/todos/todosSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Todo } from '../../types/todo';
import { fetchTodosFromAPI } from './todosAPI';

interface TodosState {
    items: Todo[];
    loading: boolean;
    error: string | null;
}

const initialState: TodosState = {
    items: [],
    loading: false,
    error: null
};

// 异步 action 示例
export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
    return await fetchTodosFromAPI();
});

const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        addTodo(state, action: PayloadAction<Todo>) {
            state.items.push(action.payload);
        },
        toggleTodo(state, action: PayloadAction<number>) {
            const todo = state.items.find((t) => t.id === action.payload);
            if (todo) {
                todo.completed = !todo.completed;
            }
        },
        deleteTodo(state, action: PayloadAction<number>) {
            state.items = state.items.filter((t) => t.id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodos.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTodos.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchTodos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Error fetching todos';
            });
    }
});

export const { addTodo, toggleTodo, deleteTodo } = todosSlice.actions;
export default todosSlice.reducer;
```

---

## 🧑‍💻 四、定义类型（可复用）

```ts
// src/types/todo.ts
export interface Todo {
    id: number;
    text: string;
    completed: boolean;
}
```

---

## 🔄 五、调用 Redux：React 中使用状态

```tsx
// src/features/todos/components/TodoList.tsx
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../app/store';
import { toggleTodo, deleteTodo } from '../todosSlice';

export default function TodoList() {
    const todos = useSelector((state: RootState) => state.todos.items);
    const dispatch = useDispatch();

    return (
        <ul>
            {todos.map((todo) => (
                <li key={todo.id}>
                    <span
                        style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
                        onClick={() => dispatch(toggleTodo(todo.id))}
                    >
                        {todo.text}
                    </span>
                    <button onClick={() => dispatch(deleteTodo(todo.id))}>Delete</button>
                </li>
            ))}
        </ul>
    );
}
```

---

## 🔄 六、异步操作（fetch 远程 todos）

```tsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodos } from '../todosSlice';
import { RootState } from '../../../app/store';

export function TodoFetcher() {
    const dispatch = useDispatch();
    const loading = useSelector((state: RootState) => state.todos.loading);

    useEffect(() => {
        dispatch(fetchTodos());
    }, [dispatch]);

    return loading ? <div>Loading...</div> : null;
}
```

---

## ✅ 七、总结：大型项目中使用 Redux 的关键点

| 项目实践点            | 描述                                                    |
| --------------------- | ------------------------------------------------------- |
| 模块化 Slice          | 每个领域（todos、users、auth）都使用独立 slice 管理     |
| 使用 createAsyncThunk | 管理异步数据请求，并自动处理 loading/error 状态         |
| 类型安全              | 配合 TypeScript 定义 `RootState`、`Todo` 类型，减少出错 |
| 统一 hooks            | 自定义 `useAppDispatch` / `useAppSelector` 简化使用     |
| 代码分层              | `slice.ts` 处理状态，`API.ts` 管理请求，组件只负责 UI   |

---
