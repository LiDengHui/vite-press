/// <reference types="vite-plugin-font/src/font" />

import DefaultTheme from 'vitepress/theme';
import './style/index.css';
// 只需添加以下一行代码，引入时间线样式
import { Theme } from 'vitepress';

import Layout from './Layout.vue';

import { css } from './fonts/方正楷体简体.ttf';
import ArticleList from './components/ArticleList.vue';

if (!import.meta.env.SSR) {
    const root = document.documentElement;
    root.style.setProperty(
        '--vp-font-family-base',
        css.family +
            ", 'Inter', ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"
    );

    // 刷新检测
    let currentVersion = '';

    const checkVersion = async () => {
        const res = await fetch('/version.txt?t=' + Date.now());
        const newVersion = await res.text();
        if (!currentVersion) currentVersion = newVersion;
        else if (currentVersion !== newVersion) {
            if (confirm('发现新版本，是否刷新？')) {
                // 3. 双保险：添加时间戳参数
                location.href = location.href.split('?')[0] + '?t=' + Date.now();
            }
        }
    };

    // 每 5 分钟检查一次
    setInterval(checkVersion, 1 * 60 * 1000);
}

export default {
    extends: DefaultTheme,
    Layout,
    enhanceApp(ctx) {
        ctx.app.component('ArticleList', ArticleList);
    },
    setup() {}
} as Theme;
