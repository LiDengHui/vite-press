---
title: Vue3 beta 新优势
tags:
  - vue
categories:
  - 技术文档
  - 前端
  - vue
date: 2020-09-21 23:11:06
---

# optionsAPI --> compositionAPi

composititionAPI 字面意思就是组合API, 它是为了实现基于函数逻辑复用机制而产生的

举个简单的例子

## 声明变量
```js
const { reactive } = Vue

const App = {
    template: `
        <div>
            {{message}}
        </div>
    `,
    setup() {
        const state = reactive({ message: 'HelloWorld!!!' })
        return {
            ...state,
        }
    },
}

Vue.createApp().mount(App, '#app')
```
## 双向绑定

```js
const { reactive } = Vue

const App = {
    template: `
        <div>
            <input type="text" v-model="state.value"/>
        </div>
    `,
    setup() {
        const state = reactive({ value: 'Hello Vue' })
        return {
            state,
        }
    },
}

Vue.createApp().mount(App, '#app')

```
* setup
  * 被诟病的地方,内容要写在这个地方,setup实际上是一个组件的入口, 它运在组件被实例化的时候, props 属性被定义后,实际上等价于vue2版本的beforeCreate 和Created这两个生命周期
* reactive
  * 创建一个响应式的状态,几乎等价于vue2.x中的Vue.observable()API, 为了避免于rxjs中的observable混淆进行了重命名


## 观察属性

```js
import { reactive, watchEffect } from 'vue'

const state = reactive({
    count: 0,
})

watchEffect(() => {
    document.body.innerHtml = `count is ${state.count}`
})

return {
    ...state,
}

```
* watchEffect 和 2.x 中的watch选项类似,但是它不需要把被依赖的数据源和副作用回调分开. 组合式API同样提供了一个watch函数,其行为和2.x的选项完全一致.

## ref

vue3 允许用户创建单个响应对象

```js
const App = {
    template: `
        <div>
            {{value}}
        </div>
    `,

    setup() {
        const value = ref(0)
        return { value }
    },
}

Vue.createApp().mount(App, '#app')

```

## 计算属性

```js
setup() {
    const state = reactive({
        count: 0,
        double: computed(() => state.count*2)
    })
    function increment() {
        state.count++;
    }

    return {
        state,
        increment
    }
}
```

## 生命周期的变更

| vue2          | vue3            |
| ------------- | --------------- |
| beforeCreate  | setup           |
| created       | setup           |
| beforeMount   | onBeforeMount   |
| mounted       | onMounted       |
| beforeUpdate  | onBeforeUpdate  |
| updated       | onUpdated       |
| beforeDestory | onBeforeUnmount |
| destroyed     | onUnmounted     |
| errorCaptured | onErrorCaptured |

生命周期使用举例

```js
import { onMounted } from 'vue'

export default {
    setup() {
        onMounted(() => {
            console.log(`component is mounted`)
        })
    },
}

```

# preformance 优化

1. 重构了虚拟DOM,保持了兼容性, 使dom 脱离模版渲染,提升性能
2. 优化了模版编译过程,增加patchFlag,遍历节点的时候,会跳过静态节点
3. 高效的组件初始化
4. 组件upload的过程性能提升1.3~2倍
5. SSR速读提升2~3被


参考:

<每日前端APP> 连接暂无

