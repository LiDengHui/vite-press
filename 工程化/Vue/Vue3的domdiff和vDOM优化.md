# Vue3的domdiff和vDOM优化

# 编译模版的静态标记

```html
<div id="app">
  <p>周一呢</p>
  <p>明天就周二了</p>
  <div>{{week}}</div>  
</div>
```

vue2 会被解析成一下代码

```js
function render() {
    with (this) {
        return _c(
            'div',
            {
                attrs: {
                    id: 'app',
                },
            },
            [
                _c('p', [_v('周一呢')]),
                _c('p', [v('明天就周二了')]),
                _c('div', [_v(_s(week))]),
            ]
        )
    }
}
```
可以看出,两个p标签是完全静态的,以至于后续渲染中,其实没有任何变化, 但是在vue2.x中依然会使用_c新建成一个vdom.在diff的时候依然需要去比较,这就造成了一定量的性能消耗

在vue3中

```js
import {
    createVNode as _createVNode,
    toDisplayString as _toDisplayString,
} from 'vue'

export function render(_ctx, _cache) {
    return (
        _openBlock(),
        _createVNode('div', { id: 'app' }, [
            _createVNode('p', null, '周一呢'),
            _createVNode('p', null, '明天就周二了'),
            _createVNode(
                'div',
                null,
                _toDisplayString(_ctx.week),
                1 /* TEXT */
            ),
        ])
    )
}

```
只有当_createVNode 的第四个参数不为空的时候,这时才会被遍历, 而静态节点就不会被遍历到

同时发现了在vue3最后一个非静态的节点编译后: 出现了 /* TEXT */, 这是为了标记当前内容的类型以便进行diff, 如果不同的标记,只需要去比较对比相同的类型,这就不会去浪费时间对其他类型进行遍历

```ts
export const enum PatchFlags {
    TEXT = 1, // 表示具有动态textContent的元素
    CLASS = 1 << 1, // 表示具有动态Class元素
    STYLE = 1 << 2, // 表示动态样式 (静态如 style="color:red", 也会提升至动态)
    PROPS = 1 << 3, // 表示具有非类/样式动态道具元素
    FULL_PROPS = 1 << 4, // 表示带有动态键的道具的元素, 与上面的三种
    HYDRARE_EVENTS = 1 << 5, // 表示带有事件监听器的元素
    STABLE_FRAGMENT = 1 << 6, // 表示其子顺序不变的片段
    KEYED_FRAGMENT = 1 << 7, // 表示带有key的元素片段
    UNKEYED_FRAGMENT = 1 << 8, // 表示没有Key的元素片段
    NEED_PATCH = 1 << 9, // 表示只需要非属性补丁的元素, 例如 ref或 hooks
    DYNAMIC_SLOTS = 1 << 10, // 表示具有动态插槽的元素
}
```

如果存在两种类型, 那么只需要对这两个值对应的pathflag进行位或运算

如 TEXT 和 PROPS

```js
TEXT: 1, PROPS: 1<<3 = 8, 
// 那么对1和8进行1|8 就能得到9;
```

# 事件存储

绑定事件会存储在缓存中
```html
<div id="app">
  <button @click="handleClick">周五拉</button>
</div> 
```
经过转换

```js
import {
    createVNode as _createVNode,
    toDisplayString as _toDisplayString,
} from 'vue'

export function render(_ctx, _cache) {
    return (
        _openBlock(),
        _createVNode('div', { id: 'app' }, [
            _createVNode(
                'button',
                {
                    onClick:
                        _cache[1] ||
                        (_cache[1] = ($event, ...args) =>
                            _ctx.handleClick($event, ...args)),
                },
                '周五啦'
            ),
        ])
    )
}

```
在代码中可以看出在绑定点击事件的时候, 会生成并缓存了一个内联函数cache中,变成了一个静态的节点

# 静态提升

```html
<template>
    <div id="app">
        <p>周一了</p>
        <p>周二了</p>
        <div>{{ week }}</div>
        <div :class="{ red: isRed }">周三呢</div>
    </div>
</template>
```

转换成

```js
import {
    createVNode as _createVNode,
    toDisplayString as _toDisplayString,
} from 'vue'

const _hoisted_1 = { id: 'app' }
const _hoisted_2 = /*#__PURE__*/ _createVNode(
    'p',
    null,
    '周一了',
    -1 /* HOISTED */
)
const _hoisted_3 = /*#__PURE__*/ _createVNode(
    'p',
    null,
    '周二了',
    -1 /* HOISTED */
)

export function render(_ctx, _cache) {
    return (
        _openBlock(),
        _createVNode('div', _hoisted_1, [
            _hoisted_2,
            _hoisted_3,
            _createVNode(
                'div',
                null,
                _toDisplayString(_ctx.week),
                1 /* TEXT */
            ),
            _createVNode(
                'div',
                {
                    class: { red: _ctx.isRed },
                },
                '周三呢',
                2 /* CLASS */
            ),
        ])
    )
}

```

在这里可以看出将一些静态的节点放在了render函数的外部,这样就避免了每次render都会生成一次静态节点

# 全家桶修改

vite的使用放弃了vue2.x使用的webpack

1. 开发服务器启动后不需要进行打包操作
2. 可以自定义开发服务器 `const {createServe} = require('vite')`
3. 热模块替换的性能和模块数量无关, 替换变快, 即时热模块替换
4. 生产环境和rollup捆绑
   
# 其他

1. 提供了treeShaking,在打包的时候自动去除没有用到的vue模块
2. 更好的ts支持,类型定义提示,tsx支持,class组件支持
