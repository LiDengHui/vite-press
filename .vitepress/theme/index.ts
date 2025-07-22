import DefaultTheme from 'vitepress/theme';
import './style/index.css';
// 只需添加以下一行代码，引入时间线样式
import { Theme } from 'vitepress';

import Layout from './Layout.vue';
import { css } from './fonts/pigeon.ttf';

const root = document.documentElement;
root.style.setProperty(
    '--vp-font-family-base',
    css.family +
        ", 'Inter', ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"
);
export default {
    extends: DefaultTheme,
    Layout,
    setup() {}
} as Theme;
