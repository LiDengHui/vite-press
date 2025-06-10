import { defineConfig } from 'vitepress';
import { withSidebar } from 'vitepress-sidebar';
import { withMermaid } from 'vitepress-plugin-mermaid';
import mathjax from './mathjax';
import timeline from 'vitepress-markdown-timeline';
import markdownItTaskCheckbox from 'markdown-it-task-checkbox';
type VitePressConfigs = Parameters<typeof defineConfig>[0];
import vitepressProtectPlugin from 'vitepress-protect-plugin';

let base = '';
if (process.env.DEPLOY_TYPE === 'git') {
    base = '/vite-press/';
}
const vitePressConfigs: VitePressConfigs = {
    base,
    title: '点滴生活',
    description: '记录个人成长',
    markdown: {
        config(md) {
            md.use(mathjax);
            md.use(timeline);
            md.use(markdownItTaskCheckbox);
        },
        image: {
            lazyLoading: true,
        },
    },
    mermaid: {
        // refer https://mermaid.js.org/config/setup/modules/mermaidAPI.html#mermaidapi-configuration-defaults for options
    },

    lastUpdated: true,
    // optionally set additional config for plugin itself with MermaidPluginConfig
    mermaidPlugin: {
        class: 'mermaid my-class', // set additional css classes for parent container
    },
    themeConfig: {
        search: {
            provider: 'local',
        },
        // https://vitepress.dev/reference/default-theme-config
        socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }],
        footer: {
            message: 'Released under the MIT License.',
            copyright: '<a href="https://beian.miit.gov.cn/" target="_blank">陕ICP备2023003969号-1</a>',
        },
    },
    vite: {
        plugins: [
            vitepressProtectPlugin({
                disableF12: true, // 禁用F12开发者模式
                disableCopy: false, // 禁用文本复制
                disableSelect: false, // 禁用文本选择
            }),
        ],
    },
};
const x = withSidebar(vitePressConfigs, {
    excludePattern: ['components', 'English', 'README'],
});
x.themeConfig.nav = x.themeConfig.sidebar;
// https://vitepress.dev/reference/site-config
export default withMermaid(defineConfig(x));
