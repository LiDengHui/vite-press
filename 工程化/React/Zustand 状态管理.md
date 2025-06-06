# Zustand 状态管理

在大型 React 项目中，使用 **Zustand** 管理全局状态是一种轻量、灵活且性能优秀的方案。以下是以一个 **Todo List（待办事项）系统** 为例，详细说明如何在大型项目中使用 Zustand 管理全局状态及操作方法。

---

## 🧩 一、状态设计

以 Todo List 为例，全局状态包括：

* 所有待办项 `todos`
* 当前筛选条件 `filter`（如 all / completed / active）
* 异步加载状态 `loading`
* 错误信息 `error`（用于接口错误提示）

---

## 📦 二、安装 Zustand

```bash
pnpm add zustand
```

---

## 🏗️ 三、构建 Store（store/todoStore.ts）

```ts
import { create } from 'zustand'

export type Todo = {
  id: string
  title: string
  completed: boolean
}

type Filter = 'all' | 'completed' | 'active'

interface TodoStore {
  todos: Todo[]
  filter: Filter
  loading: boolean
  error: string | null

  // actions
  fetchTodos: () => Promise<void>
  addTodo: (title: string) => void
  toggleTodo: (id: string) => void
  removeTodo: (id: string) => void
  setFilter: (filter: Filter) => void
}

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  filter: 'all',
  loading: false,
  error: null,

  fetchTodos: async () => {
    set({ loading: true, error: null })
    try {
      // 假设接口请求
      const response = await fetch('/api/todos')
      const data: Todo[] = await response.json()
      set({ todos: data })
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch todos' })
    } finally {
      set({ loading: false })
    }
  },

  addTodo: (title) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title,
      completed: false
    }
    set({ todos: [...get().todos, newTodo] })
  },

  toggleTodo: (id) => {
    set({
      todos: get().todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    })
  },

  removeTodo: (id) => {
    set({ todos: get().todos.filter(todo => todo.id !== id) })
  },

  setFilter: (filter) => set({ filter })
}))
```

---

## 🧪 四、使用状态和操作

```tsx
import { useTodoStore } from '@/store/todoStore'

function TodoList() {
  const { todos, filter, toggleTodo, removeTodo } = useTodoStore()
  
  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed
    if (filter === 'active') return !todo.completed
    return true
  })

  return (
    <ul>
      {filteredTodos.map(todo => (
        <li key={todo.id}>
          <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id)} />
          {todo.title}
          <button onClick={() => removeTodo(todo.id)}>删除</button>
        </li>
      ))}
    </ul>
  )
}
```

---

## ⚙️ 五、Filter 设置与新增 Todo

```tsx
function TodoControls() {
  const { filter, setFilter, addTodo } = useTodoStore()
  const [input, setInput] = useState('')

  return (
    <div>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={() => { addTodo(input); setInput('') }}>添加</button>
      <select value={filter} onChange={e => setFilter(e.target.value as any)}>
        <option value="all">全部</option>
        <option value="active">未完成</option>
        <option value="completed">已完成</option>
      </select>
    </div>
  )
}
```

---

## 🔍 六、项目结构建议（中大型项目）

```
src/
├── store/
│   └── todoStore.ts      # Zustand store
├── components/
│   ├── TodoList.tsx
│   └── TodoControls.tsx
├── pages/
│   └── Home.tsx
```

---

## ✅ 七、进阶建议

1. **Middleware 使用**

    * 如 Zustand 的 `persist` 用于本地持久化，`devtools` 配合 Redux DevTools 调试。

2. **Selectors 优化**

    * 减少组件不必要的重新渲染，例如：

      ```ts
      const todos = useTodoStore(state => state.todos)
      ```

3. **组合多个 Store**

    * 拆分不同模块（如 AuthStore、TodoStore），每个模块一个 store 文件。

4. **异步操作封装**

    * 可将异步 API 封装到 `services/` 中，在 store 内调用，保持 store 的纯粹性。

---

## 🧠 总结

使用 Zustand 管理 Todo List 全局状态的优势：

| 优点         | 表现                       |
|------------|--------------------------|
| 简洁轻量       | 无需引入 reducer / action 概念 |
| 无 Provider | 组件中直接使用，无需 Context 包裹    |
| 高性能        | 支持选择性订阅，避免不必要更新          |
| 可拓展        | 支持中间件、组合多个 store         |
