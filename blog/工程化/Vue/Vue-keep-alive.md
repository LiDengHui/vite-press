# Vue Keep-alive

在 Vue 中，组件缓存通常是通过 `keep-alive` 来实现的。`keep-alive` 是 Vue 提供的一个内置组件，它可以缓存已经渲染过的组件实例，使得当组件被切换时，不会销毁组件状态，从而提高性能和用户体验。

## 1. **如何实现组件缓存**

`keep-alive` 只适用于 Vue 动态组件，它会缓存进入 `keep-alive` 的组件，而不是重新销毁和创建它们。下面是如何在 Vue 中使用 `keep-alive` 来缓存组件：

### 1.1 基本用法

将 `keep-alive` 包裹在动态组件外部，只有被 `keep-alive` 包裹的组件才能被缓存。

```vue
<template>
  <div>
    <keep-alive>
      <component :is="currentComponent" />
    </keep-alive>
    <button @click="switchComponent">切换组件</button>
  </div>
</template>

<script>
import FirstComponent from './FirstComponent.vue';
import SecondComponent from './SecondComponent.vue';

export default {
  data() {
    return {
      currentComponent: 'FirstComponent'
    };
  },
  components: {
    FirstComponent,
    SecondComponent
  },
  methods: {
    switchComponent() {
      this.currentComponent = this.currentComponent === 'FirstComponent' ? 'SecondComponent' : 'FirstComponent';
    }
  }
}
</script>
```

在上面的代码中，`currentComponent` 动态控制显示的组件，当点击按钮切换组件时，`keep-alive` 会缓存组件实例，使得组件状态得以保留。

### 1.2 `keep-alive` 的属性

`keep-alive` 有两个常用的属性：

* **`include`**：指定一个字符串、正则表达式或数组，只有匹配的组件会被缓存。
* **`exclude`**：指定一个字符串、正则表达式或数组，匹配的组件将不会被缓存。

```vue
<keep-alive :include="['FirstComponent']">
  <component :is="currentComponent" />
</keep-alive>
```

在这个例子中，只有 `FirstComponent` 会被缓存，`SecondComponent` 会被销毁。

## 2. **与 `keep-alive` 相关的生命周期钩子**

当组件被包裹在 `keep-alive` 中时，组件会经历一些特殊的生命周期钩子。主要有以下几个：

### 2.1 **`activated`**

* `activated` 钩子在组件被激活时触发（即从缓存中恢复）。
* 它的执行时机是组件被从 `keep-alive` 中恢复出来后，这个钩子会比 `created` 和 `mounted` 先触发。

```vue
<script>
export default {
  activated() {
    console.log('组件已激活');
  }
}
</script>
```

### 2.2 **`deactivated`**

* `deactivated` 钩子在组件被缓存时触发（即从视图中移除，但未销毁）。
* 它的执行时机是组件被隐藏或从 DOM 中移除时，但 `keep-alive` 会保留组件的状态。

```vue
<script>
export default {
  deactivated() {
    console.log('组件已被缓存');
  }
}
</script>
```

## 3. **与 `keep-alive` 相关的生命周期钩子总结**

* `created` 和 `mounted`：在组件首次创建并挂载时调用，不会因为 `keep-alive` 的缓存而被跳过。
* `activated`：当组件从 `keep-alive` 中恢复时调用，相当于组件重新显示。
* `deactivated`：当组件被缓存时调用，通常用于释放资源、暂停定时器等操作。

## 4. **性能考虑**

使用 `keep-alive` 时，缓存的组件实例将保持在内存中，因此在某些情况下，过多的缓存可能会导致性能问题。为了优化性能，可以通过 `include` 和 `exclude` 属性来控制哪些组件需要缓存，从而避免不必要的内存占用。

## 5. **使用 `keep-alive` 的最佳实践**

* **缓存页面状态**：在需要缓存页面的场景中非常有用，尤其是在 Tab 页、列表页等切换频繁的场景。
* **减少不必要的缓存**：避免过多的组件被缓存，尽量使用 `include` 或 `exclude` 来有选择地缓存组件。
* **清理资源**：在 `deactivated` 钩子中清理定时器、取消网络请求等资源，以避免内存泄漏。

## 总结

* `keep-alive` 用于缓存组件，避免频繁的销毁和创建，提升性能。
* `activated` 和 `deactivated` 是与 `keep-alive` 相关的生命周期钩子，分别在组件从缓存中恢复和被缓存时触发。
* `include` 和 `exclude` 属性可以控制哪些组件需要被缓存。
* 使用时需要注意性能和资源的管理，避免过度缓存导致性能问题。
