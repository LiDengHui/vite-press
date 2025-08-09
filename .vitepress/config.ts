import { createContentLoader, defineConfig } from 'vitepress';
import { withSidebar } from 'vitepress-sidebar';
import { withMermaid } from 'vitepress-plugin-mermaid2';
import withDrawio from '@dhlx/vitepress-plugin-drawio';
import mathjax from './mathjax';
import timeline from 'vitepress-markdown-timeline';
import markdownItTaskCheckbox from 'markdown-it-task-checkbox';
import lightbox from 'vitepress-plugin-lightbox';
import viteImagemin from 'vite-plugin-imagemin';
import withMindMap from '@dhlx/vitepress-plugin-mindmap';
import { visualizer } from 'rollup-plugin-visualizer';
import Font from 'vite-plugin-font';
import vitepressProtectPlugin from 'vitepress-protect-plugin';
import * as path from 'node:path';
import * as fs from 'node:fs';

type VitePressConfigs = Parameters<typeof defineConfig>[0];
import vueDevTools from 'vite-plugin-vue-devtools';

let base = '';
if (process.env.DEPLOY_TYPE === 'git') {
    base = '/vite-press/';
}
const pagesData: any[] = [];

const vitePressConfigs: VitePressConfigs = {
    base,
    title: '点滴生活',
    description: '记录个人成长',
    metaChunk: true,
    markdown: {
        cache: false,
        toc: { level: [1, 2, 3, 4, 5] },
        config(md) {
            md.use((a, option) => {
                mathjax(a, option);
            });
            md.use((a, option) => {
                timeline(a, option);
            });
            md.use(lightbox, {
                selector: 'img'
            });

            md.use(markdownItTaskCheckbox);
        },
        image: {
            lazyLoading: true
        },
        languageAlias: {
            svg: 'html'
        }
    },
    mermaid: {
        // refer https://mermaid.js.org/config/setup/modules/mermaidAPI.html#mermaidapi-configuration-defaults for options
    },

    lastUpdated: true,
    // optionally set additional config for plugin itself with MermaidPluginConfig

    mermaidPlugin: {
        class: 'mermaid my-class main img' // set additional css classes for parent container
    },
    themeConfig: {
        search: {
            provider: 'local'
        },
        logo: '/favicon.svg',
        // https://vitepress.dev/reference/default-theme-config
        socialLinks: [{ icon: 'github', link: 'https://github.com/LiDengHui' }],
        footer: {
            message: 'Released under the MIT License.',
            copyright: '<a href="https://beian.miit.gov.cn/" target="_blank">陕ICP备2023003969号-1</a>'
        }
    },
    buildEnd: async ({ outDir }) => {
        const outFile = path.resolve(__dirname, 'pages.data.json');
        fs.writeFileSync(
            outFile,
            JSON.stringify(
                pagesData.sort((a, b) => b.lastUpdated - a.lastUpdated),
                null,
                2
            ),
            'utf-8'
        );
    },
    async transformPageData(pageData, { siteConfig }) {
        if (pageData.title) {
            pagesData.push({
                title: pageData.title,
                url: pageData.relativePath.replace(/\.md$/, '.html'),
                lastUpdated: pageData.lastUpdated
            });
        }
    },
    vite: {
        build: {
            chunkSizeWarningLimit: 2048
        },

        plugins: [
            vueDevTools(),
            Font.vite({
                scanFiles: ['/index.md']
            }),
            visualizer({
                gzipSize: false,
                brotliSize: false,
                emitFile: false,
                filename: 'test.html', //分析图生成的文件名
                open: false //如果存在本地服务端口，将在打包后自动展示
            }),
            vitepressProtectPlugin({
                disableF12: false, // 禁用F12开发者模式
                disableCopy: false, // 禁用文本复制
                disableSelect: false // 禁用文本选择
            }),
            // 图片压缩插件（支持 JPG/PNG/SVG/GIF）
            viteImagemin({
                gifsicle: { optimizationLevel: 3 },
                mozjpeg: { quality: 80 },
                optipng: { optimizationLevel: 5 },
                svgo: {
                    plugins: [{ name: 'removeViewBox' }, { name: 'removeEmptyAttrs', active: false }]
                }
            })

            // 文件 Gzip/Brotli 压缩（压缩 JS/CSS/HTML）
            // viteCompression({
            //     // filter: /\.(js|css|html|drawio)$/i, // 仅压缩 JS/CSS/HTML
            //     // deleteOriginFile: false,
            //     algorithm: 'brotliCompress'
            // })
        ]
    }
};
const x = withSidebar(vitePressConfigs, {
    excludePattern: ['components', 'English', 'README', 'README.md', 'cache']
});
x.themeConfig.nav = x.themeConfig.sidebar;

export default withMindMap(withMermaid(withDrawio(defineConfig(x))));
