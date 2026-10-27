<template>
    <Layout>
        <template #aside-outline-before>
            <ArticleTags />
        </template>
    </Layout>
    <Top />
</template>

<script setup lang="ts">
import DefaultTheme from 'vitepress/theme';
import ArticleTags from './components/ArticleTags.vue';
import Top from './Top.vue';
import { onMounted } from 'vue';
import { useRouter } from 'vitepress';
import mediumZoom from 'medium-zoom';
import { NProgress } from 'nprogress-v2';

const { Layout } = DefaultTheme;
const router = useRouter();

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
