<<< @/工程化/vue/signal/app.vue


```ts
// src/index.ts (简化示意)
function computed<T>(getter: (previousValue?: T) => T): () => T {
  // 1. 创建计算属性对象
  const computedObject: Computed<T> = {
    currentValue: undefined,  // 初始无缓存值
    subs: undefined,          // 初始没有订阅者依赖它
    subsTail: undefined,
    deps: undefined,          // 初始不知道依赖谁
    depsTail: undefined,
    flags: SubscriberFlags.Computed | SubscriberFlags.Dirty, // 标记为 Computed 和 Dirty
    getter: getter,           // 存储计算逻辑
  };

  // 2. 返回绑定了计算属性对象的 getter 函数
  return computedGetter.bind(computedObject) as () => T;
}

```