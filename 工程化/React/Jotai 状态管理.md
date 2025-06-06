# Jotai 状态管理
在大型项目中使用 [**Jotai**](https://jotai.org/) 管理状态的优势是：**原子化、组合性强、灵活易维护**。以下我们以一个典型的 `Todo List` 为例，逐步说明如何在大型项目中使用 Jotai 管理全局状态，并给出组织结构和操作方法。

---

## 🧠 一、Jotai 优势与适用场景（简述）

在大型项目中，Jotai 适用于以下场景：

* 状态高度模块化（例如：多个列表页、多种筛选条件、分页、用户偏好等）
* 多个组件共享状态，但不想用 Redux 那样繁重的样板代码
* 需要异步、派生状态（Derived state）管理
* 希望按需加载或懒加载部分状态模块

---

## 🗂️ 二、项目结构组织建议（模块化）

```bash
src/
  ├── atoms/
  │   ├── todos.ts            # 所有 todo 的 atoms 和相关状态
  │   └── filters.ts          # 筛选条件状态
  ├── hooks/
  │   └── useTodoActions.ts   # 封装逻辑操作
  ├── components/
  │   ├── TodoList.tsx
  │   └── TodoItem.tsx
  └── App.tsx
```

---

## 🧩 三、定义状态 atoms（todos.ts）

```ts
// atoms/todos.ts
import { atom } from 'jotai'

export type Todo = {
  id: number
  text: string
  completed: boolean
}

// 全部 todos 列表
export const todosAtom = atom<Todo[]>([])

// 派生：未完成 todos
export const incompleteTodosAtom = atom((get) =>
  get(todosAtom).filter((t) => !t.completed)
)
```

---

## 🎛️ 四、定义筛选状态（filters.ts）

```ts
// atoms/filters.ts
import { atom } from 'jotai'

export type Filter = 'all' | 'completed' | 'incomplete'

export const filterAtom = atom<Filter>('all')
```

---

## 🧮 五、组合派生状态：根据筛选显示 todo（组合 atom）

```ts
// atoms/todos.ts 中追加
import { filterAtom } from './filters'

export const filteredTodosAtom = atom((get) => {
  const todos = get(todosAtom)
  const filter = get(filterAtom)
  switch (filter) {
    case 'completed':
      return todos.filter((t) => t.completed)
    case 'incomplete':
      return todos.filter((t) => !t.completed)
    default:
      return todos
  }
})
```

---

## 🧰 六、封装操作逻辑（hooks/useTodoActions.ts）

```ts
import { useAtom } from 'jotai'
import { todosAtom } from '@/atoms/todos'

let idCounter = 1

export const useTodoActions = () => {
  const [todos, setTodos] = useAtom(todosAtom)

  const addTodo = (text: string) => {
    setTodos([...todos, { id: idCounter++, text, completed: false }])
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(t => t.id !== id))
  }

  return { addTodo, toggleTodo, deleteTodo }
}
```

---

## 🧱 七、组件使用示例

### `TodoList.tsx`

```tsx
import { useAtomValue } from 'jotai'
import { filteredTodosAtom } from '@/atoms/todos'
import { TodoItem } from './TodoItem'

export const TodoList = () => {
  const todos = useAtomValue(filteredTodosAtom)
  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  )
}
```

### `TodoItem.tsx`

```tsx
import { Todo } from '@/atoms/todos'
import { useTodoActions } from '@/hooks/useTodoActions'

export const TodoItem = ({ todo }: { todo: Todo }) => {
  const { toggleTodo, deleteTodo } = useTodoActions()

  return (
    <li>
      <span
        style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
        onClick={() => toggleTodo(todo.id)}
      >
        {todo.text}
      </span>
      <button onClick={() => deleteTodo(todo.id)}>🗑</button>
    </li>
  )
}
```

---

## ⚙️ 八、扩展：异步状态、服务调用（示例）

```ts
// 异步获取 todos 示例
import { atom } from 'jotai'
import { atomWithQuery } from 'jotai-tanstack-query' // 或者 atomWithPromise

export const todosAsyncAtom = atomWithQuery(() => ({
  queryKey: ['todos'],
  queryFn: async () => {
    const res = await fetch('/api/todos')
    return res.json()
  },
}))
```

---

## ✅ 总结：大型项目中使用 Jotai 的技巧

| 技巧                       | 描述                               |
| ------------------------ | -------------------------------- |
| 模块化拆分 atoms              | 每个功能拆分单独文件，避免一个大文件               |
| 使用 `atomFamily` 管理子项     | 例如每个 todo 独立状态管理                 |
| 封装操作逻辑成 hooks            | 类似 `useTodoActions`，保持 UI 简洁     |
| 使用 `atomWithStorage` 持久化 | 支持本地存储                           |
| 异步状态用 `atomWithQuery`    | 搭配 tanstack-query/React Query 使用 |
| 使用 `Devtools` 调试状态       | `jotai-devtools` 插件帮助调试          |

---
