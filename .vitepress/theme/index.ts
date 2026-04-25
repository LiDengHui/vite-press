import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import './style/index.css';
import 'vitepress-markdown-timeline/dist/theme/index.css';

import Layout from './Layout.vue';
import ArticleList from './components/ArticleList.vue';

if (!import.meta.env.SSR) {
    let currentVersion = '';

    const checkVersion = async () => {
        try {
            const res = await fetch(`/version.txt?t=${Date.now()}`);
            const newVersion = await res.text();
            if (!currentVersion) {
                currentVersion = newVersion;
            } else if (currentVersion !== newVersion) {
                if (confirm('发现新版本，是否刷新？')) {
                    location.href = `${location.href.split('?')[0]}?t=${Date.now()}`;
                }
            }
        } catch {
            // 静默忽略网络错误，避免阻塞页面
        }
    };

    setInterval(checkVersion, 60 * 1000);
}

export default {
    extends: DefaultTheme,
    Layout,
    enhanceApp({ app }) {
        app.component('ArticleList', ArticleList);
    }
} satisfies Theme;
