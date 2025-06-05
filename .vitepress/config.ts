import { defineConfig } from 'vitepress';
import {withSidebar} from "vitepress-sidebar";
import { withMermaid } from 'vitepress-plugin-mermaid';
const vitePressConfigs = {
    title: '点滴生活',
    description: '记录个人成长',
    mermaid: {
        // refer https://mermaid.js.org/config/setup/modules/mermaidAPI.html#mermaidapi-configuration-defaults for options
    },
    // optionally set additional config for plugin itself with MermaidPluginConfig
    mermaidPlugin: {
        class: "mermaid my-class", // set additional css classes for parent container
    },
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: 'Home', link: '/' },
            { text: 'JS', link: '/js' },
            { text: 'Examples', link: '/markdown-examples' },
        ],

        socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }],
        footer: {
            message: 'Released under the MIT License.',
            copyright: '<a href="https://beian.miit.gov.cn/" target="_blank">陕ICP备2023003969号-1</a>',
        },
    },
}
// https://vitepress.dev/reference/site-config
export default withMermaid(defineConfig(
    withSidebar(vitePressConfigs, {

    })
));
