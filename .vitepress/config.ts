import { defineConfig } from 'vitepress';
import { withSidebar } from 'vitepress-sidebar';
import { withMermaid } from 'vitepress-plugin-mermaid';
import mathjax from './mathjax';
import timeline from 'vitepress-markdown-timeline';
import markdownItTaskCheckbox from 'markdown-it-task-checkbox';
import lightbox from 'vitepress-plugin-lightbox';

type VitePressConfigs = Parameters<typeof defineConfig>[0];

let base = '';
if (process.env.DEPLOY_TYPE === 'git') {
    base = '/vite-press/';
}

import { Transformer } from 'markmap-lib';

const transformer = new Transformer();

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

const vitePressConfigs: VitePressConfigs = {
    base,
    title: '点滴生活',
    description: '记录个人成长',
    markdown: {
        config(md) {
            md.use(mathjax);
            md.use(timeline);
            md.use(lightbox, {
                selector: 'img',
            });
            md.use(markdownItTaskCheckbox);
            const temp = md.renderer.rules.fence.bind(md.renderer.rules);
            md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
                const token = tokens[idx];
                if (token.info === 'mindmap') {
                    try {
                        const { root, _ } = transformer.transform(token.content.trim());
                        return `<svg class="markmap-svg" data-json='${escapeHtml(JSON.stringify(root))}'></svg>`;
                    } catch (ex) {
                        return `<pre>${ex}</pre>`;
                    }
                }
                return temp(tokens, idx, options, env, slf);
            };
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
        class: 'mermaid my-class main img', // set additional css classes for parent container
    },
    themeConfig: {
        search: {
            provider: 'local',
        },
        logo: 'favicon.svg',
        // https://vitepress.dev/reference/default-theme-config
        socialLinks: [{ icon: 'github', link: 'https://github.com/LiDengHui' }],
        footer: {
            message: 'Released under the MIT License.',
            copyright: '<a href="https://beian.miit.gov.cn/" target="_blank">陕ICP备2023003969号-1</a>',
        },
    },
    vite: {
        plugins: [
            // vitepressProtectPlugin({
            //     disableF12: false, // 禁用F12开发者模式
            //     disableCopy: false, // 禁用文本复制
            //     disableSelect: false, // 禁用文本选择
            // }),
        ],
    },
};
const x = withSidebar(vitePressConfigs, {
    excludePattern: ['components', 'English', 'README', 'README.md', 'cache'],
});
x.themeConfig.nav = x.themeConfig.sidebar;
// https://vitepress.dev/reference/site-config
export default withMermaid(defineConfig(x));
