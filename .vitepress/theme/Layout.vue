<script setup>
import DefaultTheme from 'vitepress/theme';
import { onMounted } from 'vue';
import { useData, useRoute, useRouter } from 'vitepress';
import mediumZoom from 'medium-zoom';
import giscusTalk from 'vitepress-plugin-comment-with-giscus';
const route = useRoute();
const { Layout } = DefaultTheme;
const router = useRouter();
import 'vitepress-markdown-timeline/dist/theme/index.css';
import { NProgress } from 'nprogress-v2'; // 进度条组件
// 引入自定义样式文件
// 渲染思维导图

// Setup medium zoom with the desired options
const setupMediumZoom = () => {
    mediumZoom('[data-zoomable]', {
        background: 'transparent',
    });
};

// Apply medium zoom on load
onMounted(setupMediumZoom);

NProgress.configure({ showSpinner: false });
router.onBeforeRouteChange = () => {
    NProgress.start(); // 开始进度条
};
router.onAfterRouteChange = () => {
    NProgress.done(); // 停止进度条
    setupMediumZoom();
};
// Subscribe to route changes to re-apply medium zoom effect

// Get frontmatter and route
const data = useData();

// // giscus配置
giscusTalk(
    {
        repo: 'LiDengHui/vite-press', //仓库
        repoId: 'R_kgDOJVNT_g', //仓库ID
        category: 'General', // 讨论分类
        categoryId: 'DIC_kwDOJVNT_s4CrRbn', //讨论分类ID
        mapping: 'title',
        inputPosition: 'top',
        homePageShowComment: true,
        lang: 'zh-CN',
        crossOrigin: 'anonymous',
        reactionsEnabled: '1',
        emitMetadata: '0',
        theme: 'light',
        darkTheme: 'transparent_dark',
        themeURL: '',
        loading: 'lazy',
    },
    {
        frontmatter: data.frontmatter,
        route,
    },
    //默认值为true，表示已启用，此参数可以忽略；
    //如果为false，则表示未启用
    //您可以使用“comment:true”序言在页面上单独启用它
    true,
);
</script>

<template>
    <Layout />
</template>

<style>
.medium-zoom-overlay {
    backdrop-filter: blur(5rem);
}

.medium-zoom-overlay,
.medium-zoom-image--opened {
    z-index: 999;
}
</style>
