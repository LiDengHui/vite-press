import DefaultTheme from 'vitepress/theme';

// 只需添加以下一行代码，引入时间线样式
import 'vitepress-markdown-timeline/dist/theme/index.css';
import { useRoute } from 'vitepress';

import { NProgress } from 'nprogress-v2/dist/index.js'; // 进度条组件
import 'nprogress-v2/dist/index.css'; // 进度条样式
import { inBrowser } from 'vitepress';
import Layout from './Layout.vue';
export default {
    extends: DefaultTheme,
    Layout,
    enhanceApp({ app, router }) {
        if (inBrowser) {
            NProgress.configure({ showSpinner: false });
            router.onBeforeRouteChange = () => {
                NProgress.start(); // 开始进度条
            };
            router.onAfterRouteChanged = () => {
                console.log('123');
                NProgress.done(); // 停止进度条
            };
        }
    },
    setup() {
        const route = useRoute();
    },
};
