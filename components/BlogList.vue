<script setup>
import BlogItem from './BlogItem.vue';

const list = [
    {
        title: 'FLIP动画实现演示',
        description:
            'FLIP动画是一种高性能的Web动画技术，它通过记录元素的初始和最终位置，然后应用反向变换来创建流畅的动画效果。这种技术特别适合处理布局变化时的元素动画。',
        img: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        link: 'https://lidenghui.github.io/flip-demo/',
        tags: ['flip', '动画'],
    },
    {
        title: 'History API 单页应用功能说明',
        description: '这个示例展示了如何使用History API创建单页应用(SPA)，主要特点包括：',
        img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        link: 'https://lidenghui.github.io/history-api/',
        tags: ['浏览器', '路由'],
    },
    {
        title: 'Rust + WebAssembly 图像处理示例',
        description:
            '本示例演示如何使用Rust开发WebAssembly模块，实现浏览器端的图像处理功能。项目包含灰度转换、颜色反转、棕褐色调等常见滤镜，并支持在Web Worker中异步执行。：',
        img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        link: 'https://lidenghui.github.io/rust-wasm-image-processor/',
        tags: ['计算'],
    },
];
</script>

<template>
    <h2>Demo展示</h2>
    <div class="blog-list">
        <blog-item v-for="item in list" :key="item.title" :item="item"></blog-item>
    </div>
</template>

<style scoped>
.blog-list {
    margin-top: 30px;
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    justify-content: center;
}
</style>
