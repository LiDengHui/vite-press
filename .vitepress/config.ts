import { defineConfig } from 'vitepress';
import { withSidebar } from 'vitepress-sidebar';
import { withMermaid } from 'vitepress-plugin-mermaid';
import mathjax from './mathjax';

type VitePressConfigs = Parameters<typeof defineConfig>[0];

const vitePressConfigs: VitePressConfigs = {
    title: '点滴生活',
    description: '记录个人成长',
    markdown: {
        config: mathjax,
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
};
const x = withSidebar(vitePressConfigs, {
    excludePattern: ['components', 'English'],
});
x.themeConfig.nav = x.themeConfig.sidebar;
// https://vitepress.dev/reference/site-config
export default withMermaid(defineConfig(x));
