<template>
    <div class="package-list-container">
        <h2 class="list-title">NPM包</h2>
        <div class="package-list">
            <PackageItem
                v-for="(pkg, index) in packages"
                :key="index"
                :title="pkg.title"
                :description="pkg.description"
                :link="pkg.link"
            />
        </div>
    </div>
</template>

<script>
import PackageItem from './PackageItem.vue';

export default {
    components: { PackageItem },
    data() {
        return {
            packages: [
                {
                    title: '@dhlx/resolver',
                    description:
                        'resolver 是一个强大的 TypeScript 工具函数，用于处理异步函数的执行结果，统一进行错误处理和结果包装，让您的异步代码更加简洁和可靠。',
                    link: 'https://www.npmjs.com/package/@dhlx/resolver',
                },
                {
                    title: '@dhlx/delay',
                    description:
                        'delay 函数是一个用于实现延迟功能的实用工具函数。它接受一个以毫秒为单位的时间参数，并返回一个 Promise，在指定的时间过后成功解决',
                    link: 'https://www.npmjs.com/package/@dhlx/delay',
                },
                {
                    title: '@dhlx/async-pool',
                    description:
                        '一个轻量级的 JavaScript 异步任务并发控制工具。它允许你限制同时运行的异步任务数量，确保在同一时间只执行指定数量的任务。',
                    link: 'https://www.npmjs.com/package/@dhlx/async-pool',
                },
                {
                    title: '@dhlx/format-size-units',
                    description:
                        'A utility function to format file sizes from kilobytes (KB) to larger units like megabytes (MB), gigabytes (GB), terabytes (TB), and petabytes (PB).',
                    link: 'https://www.npmjs.com/package/@dhlx/format-size-units',
                },
                {
                    title: '@dhlx/dhlx-cli',
                    description: 'dhlx 脚本',
                    link: 'https://www.npmjs.com/package/@dhlx/dhlx-cli',
                },
                {
                    title: '@dhlx/async-compose',
                    description:
                        'AsyncCompose 是一个轻量的中间件组合器，适用于处理异步操作链。它允许你将多个中间件函数串联在一起，形成类似“洋葱模型”的执行顺序。此工具非常适合在 Koa、Express 等框架之外实现自定义中间件逻辑或其他需要异步控制流的场景。',
                    link: 'https://www.npmjs.com/package/@dhlx/async-compose',
                },
                {
                    title: '@dhlx/virtual-scrolling',
                    description: 'vue3 虚拟滚动',
                    link: 'https://www.npmjs.com/package/@dhlx/virtual-scrolling',
                },
                {
                    title: '@dhlx/event-target',
                    description:
                        'A lightweight TypeScript implementation of the EventTarget interface, supporting event listeners, event bubbling, and propagation control, designed for custom event-driven systems.',
                    link: 'https://www.npmjs.com/package/@dhlx/event-target',
                },
                {
                    title: '@dhlx/signal',
                    description:
                        'A lightweight reactive data library providing Signal and Computed objects for state management and automatic updates, tracking dependencies and simplifying data handling.',
                    link: 'https://www.npmjs.com/package/@dhlx/signal',
                },
                {
                    title: '@dhlx/text-template',
                    description:
                        'The `template` function is a customizable templating engine that takes a string with embedded template expressions, parses it, and returns a function that can render the template with dynamic data.',
                    link: 'https://www.npmjs.com/package/@dhlx/text-template',
                },
                {
                    title: '@dhlx/diff-json',
                    description:
                        'diffJson is a utility for comparing two JSON objects and generating a detailed list of changes (additions, deletions, modifications). It supports nested objects and arrays, and allows you to configure which paths to include or exclude from the comparison.',
                    link: 'https://www.npmjs.com/package/@dhlx/diff-json',
                },
                {
                    title: '@dhlx/red-black-tree',
                    description:
                        '这是一个用 TypeScript 实现的红黑树 (RBTree) 和基于红黑树的树映射 (TreeMap) 的 npm 包。该实现提供了高效的插入、删除、搜索操作，并支持键值对存储。',
                    link: 'https://www.npmjs.com/package/@dhlx/red-black-tree',
                },
                {
                    title: '@dhlx/types',
                    description: 'typescript 工具类型',
                    link: 'https://www.npmjs.com/package/@dhlx/types',
                },
                {
                    title: '@dhlx/uni-vite-static-proxy',
                    description: 'uni-app Enable local static file server with proxy forwarding',
                    link: 'https://www.npmjs.com/package/@dhlx/uni-vite-static-proxy',
                },
                {
                    title: '@dhlx/event-emitter',
                    description: 'A simple event emitter for TypeScript.',
                    link: 'https://www.npmjs.com/package/@dhlx/event-emitter',
                },
                {
                    title: '@dhlx/rwlock-shared',
                    description: 'A simple implementation of a read-write lock with shared read',
                    link: 'https://www.npmjs.com/package/@dhlx/rwlock-shared',
                },
                {
                    title: '@dhlx/cookie',
                    description: '轻量级浏览器 Cookie 操作工具库，提供类型安全的 Cookie 设置、获取和删除功能',
                    link: 'https://www.npmjs.com/package/@dhlx/cookie',
                },
                {
                    title: '@dhlx/vitepress-plugin-drawio',
                    description: 'A VitePress plugin for rendering drawio diagrams.',
                    link: 'https://www.npmjs.com/package/@dhlx/vitepress-plugin-drawio',
                },
            ],
        };
    },
};
</script>

<style scoped>
.package-list-container {
    margin: 0 auto;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.list-title {
    color: #2c3e50;
    margin-bottom: 2rem;
    font-weight: 600;
    font-size: 1.8rem;
    position: relative;
}

.list-title::after {
    content: '';
    display: block;
    width: 120px;
    height: 4px;
    background: #42b983;
    margin: 10px 0;
    border-radius: 2px;
}

.package-list {
    display: flex;
    flex-wrap: wrap;
    gap: 25px;
    justify-content: center;
}
</style>
