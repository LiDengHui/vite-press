// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme';

// 只需添加以下一行代码，引入时间线样式
import 'vitepress-markdown-timeline/dist/theme/index.css';
import giscusTalk from 'vitepress-plugin-comment-with-giscus';
import mediumZoom from 'medium-zoom';
import { onMounted, watch, nextTick } from 'vue';
import { useRoute, useData } from 'vitepress';

import { NProgress } from 'nprogress-v2/dist/index.js'; // 进度条组件
import 'nprogress-v2/dist/index.css'; // 进度条样式
import { inBrowser } from 'vitepress';
export default {
    extends: DefaultTheme,
    enhanceApp({ app, router }) {
        if (inBrowser) {
            NProgress.configure({ showSpinner: false });
            router.onBeforeRouteChange = () => {
                NProgress.start(); // 开始进度条
            };
            router.onAfterRouteChanged = () => {
                NProgress.done(); // 停止进度条
            };
        }
    },
    setup() {
        const route = useRoute();
        const initZoom = () => {
            // mediumZoom('[data-zoomable]', { background: 'var(--vp-c-bg)' }); // 默认
            mediumZoom('.main img', { background: 'var(--vp-c-bg)' }); // 不显式添加{data-zoomable}的情况下为所有图像启用此功能
        };
        onMounted(() => {
            initZoom();
        });
        watch(
            () => route.path,
            () => nextTick(() => initZoom()),
        );

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
    },
};
