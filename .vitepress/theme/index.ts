import DefaultTheme from 'vitepress/theme';

// 只需添加以下一行代码，引入时间线样式
import { Theme } from 'vitepress';

import Layout from './Layout.vue';

export default {
    extends: DefaultTheme,
    Layout,
    setup() {},
} as Theme;
