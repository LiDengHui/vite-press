<script setup>
import DefaultTheme from 'vitepress/theme';
import { onMounted } from 'vue';
import { onContentUpdated, useData, useRoute, useRouter } from 'vitepress';
import mediumZoom from 'medium-zoom';
import giscusTalk from 'vitepress-plugin-comment-with-giscus/lib/giscus.js';
const route = useRoute();
const { Layout } = DefaultTheme;
const router = useRouter();
import { Markmap } from 'markmap-view';

// 引入自定义样式文件
// 渲染思维导图
function renderMindmap() {
    const mindmaps = document.querySelectorAll('.markmap-svg');
    for (const mindmap of mindmaps) {
        const dataJson = mindmap.getAttribute('data-json');
        if (mindmap instanceof SVGElement && dataJson) {
            if (mindmap.children.length > 0) continue;
            const mp = Markmap.create(
                mindmap,
                {
                    autoFit: true,
                    pan: false,
                    zoom: false,
                },
                JSON.parse(dataJson),
            );
            // 重新设置 SVG 的高度
            setTimeout(() => {
                const width = mp.state.rect.x2 - mp.state.rect.x1; // SVG 的实际宽度
                const height = mp.state.rect.y2 - mp.state.rect.y1; // SVG 的实际高度
                const aspectRatio = height / width; // 高宽比
                // 定义一个子方法用于重新设置 mindmap 的高度
                function setMindmapHeight(mindmap, aspectRatio) {
                    const realHeight = mindmap.clientWidth * aspectRatio + 30;
                    mindmap.style.height = `${realHeight}px`;
                    mp.fit();
                }
                // 注册 window 的窗口大小变动事件
                window.addEventListener('resize', () => {
                    setMindmapHeight(mindmap, aspectRatio);
                });
                // 初始设置时调用子方法
                setMindmapHeight(mindmap, aspectRatio);
            }, 0);
        }
    }
}

// Setup medium zoom with the desired options
const setupMediumZoom = () => {
    mediumZoom('[data-zoomable]', {
        background: 'transparent',
    });
};

// Apply medium zoom on load
onMounted(setupMediumZoom);
onContentUpdated(() => {
    renderMindmap();
});
// Subscribe to route changes to re-apply medium zoom effect
router.onAfterRouteChanged = setupMediumZoom;

// Get frontmatter and route
const { frontmatter } = useData();

// giscus配置
giscusTalk(
    {
        repo: 'LiDengHui/vite-press', //仓库
        repoId: 'R_kgDOJVNT_g', //仓库ID
        category: 'General', // 讨论分类
        categoryId: 'DIC_kwDOJVNT_s4CrRbn', //讨论分类ID
        mapping: 'title',
        inputPosition: 'bottom',
        homePageShowComment: true,
        lang: 'zh-CN',
    },
    {
        frontmatter,
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
