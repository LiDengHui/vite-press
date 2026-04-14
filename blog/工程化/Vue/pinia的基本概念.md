# pinia的基本概念
 

**Pinia** 是 Vue 3 的官方状态管理库，它是 Vuex 的替代品，专为 Vue 3 设计，并使用了 Vue 3 中的 Composition API。Pinia 具有更简洁的 API、现代化的特性以及更好的 TypeScript 支持，旨在提供一个更易用、更灵活的状态管理方案。

Pinia 的基本概念可以分为以下几个部分：

## 1. **Store（仓库）**

在 Pinia 中，状态是通过 **store** 来管理的。store 就是一个容器，用于存储应用的状态、以及改变状态的方法。与 Vuex 不同，Pinia 的 store 是基于 **Composition API** 的概念来设计的，使用更简洁的语法和更现代化的架构。

### 1.1 **定义 store**

Pinia 使用 `defineStore` 来定义一个 store：

```javascript
import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0
  }),
  getters: {
    doubleCount: (state) => state.count * 2
  },
  actions: {
    increment() {
      this.count++;
    }
  }
});
```

在上面的代码中：

* `state`: 存储数据（类似 Vuex 中的 `state`）。
* `getters`: 派生数据（类似 Vuex 中的 `getters`）。
* `actions`: 改变状态的方法（类似 Vuex 中的 `mutations` 和 `actions`，但 Pinia 把它们合并成 `actions`）。

### 1.2 **使用 store**

在组件中使用 Pinia store 时，可以通过 `useCounterStore()` 获取 store，并访问它的状态和方法：

```vue
<template>
  <div>
    <p>{{ counter.count }}</p>
    <button @click="counter.increment">Increment</button>
    <p>{{ counter.doubleCount }}</p>
  </div>
</template>

<script setup>
import { useCounterStore } from './stores/counter';

const counter = useCounterStore();
</script>
```

## 2. **State（状态）**

Pinia 中的 **state** 存储了应用的状态数据。通过 `defineStore` 创建 store 时，你可以在 `state` 中定义初始状态，它是一个函数，返回一个对象。

```javascript
state: () => ({
  count: 0
})
```

Pinia 的 `state` 是响应式的，这意味着它会随着组件的渲染而更新。

## 3. **Getters（计算属性）**

**Getters** 是派生状态的方式，类似于 Vue 组件中的计算属性。通过 `getters`，你可以根据 `state` 的值计算出其他的数据。

```javascript
getters: {
  doubleCount: (state) => state.count * 2
}
```

在组件中使用 `getters` 时，它们会像计算属性一样自动缓存，并且当 `state` 改变时，`getters` 会重新计算。

## 4. **Actions（方法）**

Pinia 中的 **actions** 用于定义修改状态的逻辑。与 Vuex 不同，Pinia 把 `mutations` 和 `actions` 合并成了一个 `actions`。你可以在 `actions` 中编写同步和异步操作。

```javascript
actions: {
  increment() {
    this.count++;
  },
  async fetchData() {
    const data = await fetchDataFromAPI();
    this.count = data.count;
  }
}
```

### 4.1 **同步与异步 Actions**

* **同步操作**：直接修改状态。
* **异步操作**：可以使用 `async`/`await` 来处理异步请求，并在请求完成后通过 `this` 来更新状态。

## 5. **Store 模块化**

Pinia 允许你将 store 分割成多个模块，类似于 Vuex 中的模块化管理。每个模块都可以有自己的 `state`、`getters` 和 `actions`，并且可以单独导入使用。

```javascript
import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0
  }),
  actions: {
    increment() {
      this.count++;
    }
  }
});
```

多个 store 之间可以相互独立并共享全局状态。

## 6. **Store Persisted State（持久化状态）**

Pinia 提供了插件可以让 store 的状态持久化，这意味着你可以将某些状态保存在本地存储中，避免页面刷新后丢失数据。常用的持久化插件有 `pinia-plugin-persistedstate`。

```javascript
import { defineStore } from 'pinia';
import piniaPersistedstate from 'pinia-plugin-persistedstate';

const store = defineStore('counter', {
  state: () => ({
    count: 0
  }),
  actions: {
    increment() {
      this.count++;
    }
  }
});

store.$persist = true; // 使状态持久化
```

## 7. **Pinia 的优点**

### 7.1 **基于 Composition API**

Pinia 充分利用了 Vue 3 的 Composition API，提供了更清晰、灵活的 API 设计。你不需要再在 store 中使用 Vuex 的 `mapState`、`mapGetters` 等辅助函数，直接通过 `useStore` 获取 store，并可以通过 `ref` 和 `reactive` 来访问和操作数据。

### 7.2 **简洁的 API**

Pinia 的 API 比 Vuex 更加简洁、直观，它取消了 Vuex 中复杂的 `mutations` 和 `getters` 的定义方式。所有状态修改都可以通过 `actions` 进行，逻辑更加简单。

### 7.3 **类型推导**

Pinia 提供了很好的 TypeScript 支持，自动推导 store 中的类型，不需要手动编写类型声明，这使得它在 TypeScript 项目中非常好用。

### 7.4 **支持开发工具**

Pinia 兼容 Vue Devtools，可以直接在 Devtools 中查看和调试 store 的状态、方法和 getters，极大提高开发效率。

### 7.5 **插件机制**

Pinia 提供了插件机制，方便扩展其功能，例如持久化状态、批量更新等。

## 8. **Pinia 和 Vuex 的对比**

* **Pinia** 使用 Composition API，API 更加简洁和现代，提供了更好的 TypeScript 支持。
* **Vuex** 是基于 Options API 的，使用起来比 Pinia 更复杂，且在 Vue 3 中推荐使用 Pinia 代替 Vuex。
* **Pinia** 提供了内置的插件机制和更高效的开发体验，适合现代化的 Vue 3 应用。

## 总结

Pinia 是 Vue 3 的官方状态管理库，基于 Vue 3 的 Composition API 进行设计，提供了更简洁、现代的 API 和更好的 TypeScript 支持。通过 `defineStore` 定义 store，使用 `state` 存储数据，`getters` 计算派生状态，`actions` 处理同步和异步逻辑。它支持模块化、持久化存储，并与 Vue Devtools 完美集成，是 Vue 3 推荐的状态管理方案。
