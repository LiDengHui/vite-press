<template>
    <Layout />
    <Top />
</template>

<script setup lang="ts">
import DefaultTheme from 'vitepress/theme';
import Top from './Top.vue';
import { onMounted } from 'vue';
import { useData, useRoute, useRouter } from 'vitepress';
import mediumZoom from 'medium-zoom';
import giscusTalk from 'vitepress-plugin-comment-with-giscus';
import { NProgress } from 'nprogress-v2';

const route = useRoute();
const { Layout } = DefaultTheme;
const router = useRouter();
const data = useData();

let timer: ReturnType<typeof setTimeout> | null = null;

const routerChange = () => {
    mediumZoom('[data-zoomable]', {
        background: 'transparent'
    });

    if (timer) {
        clearTimeout(timer);
    }
    timer = setTimeout(() => {
        const sidebar = document.querySelector('.VPSidebar');
        if (!sidebar) return;
        const activeItem = sidebar.querySelector('.VPSidebarItem .is-active');
        if (activeItem) {
            activeItem.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
    }, 100);
};

onMounted(() => {
    routerChange();
});

NProgress.configure({ showSpinner: false });

router.onBeforeRouteChange = () => {
    NProgress.start();
};

router.onAfterRouteChange = () => {
    NProgress.done();
    routerChange();
};

giscusTalk(
    {
        repo: 'LiDengHui/vite-press',
        repoId: 'R_kgDOJVNT_g',
        category: 'General',
        categoryId: 'DIC_kwDOJVNT_s4CrRbn',
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
        loading: 'lazy'
    },
    {
        frontmatter: data.frontmatter,
        route
    },
    true
);
</script>

<style>
.medium-zoom-overlay {
    backdrop-filter: blur(5rem);
}

.medium-zoom-overlay,
.medium-zoom-image--opened {
    z-index: 999;
}
</style>
