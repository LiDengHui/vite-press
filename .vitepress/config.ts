import { createContentLoader, defineConfig } from 'vitepress';
import { generateSidebar } from 'vitepress-sidebar';
import { withMermaid } from 'vitepress-plugin-mermaid2';
import withDrawio from '@dhlx/vitepress-plugin-drawio';
import mathjax, { mathjaxStyles } from './mathjax';
import timeline from 'vitepress-markdown-timeline';
import markdownItTaskCheckbox from 'markdown-it-task-checkbox';
import lightbox from 'vitepress-plugin-lightbox';
import viteImagemin from 'vite-plugin-imagemin';
import withMindMap from '@dhlx/vitepress-plugin-mindmap';
import { visualizer } from 'rollup-plugin-visualizer';
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
const srcRoot = path.resolve(__dirname, '../blog');
const sidebarExcludePattern = ['components', 'English', 'README', 'README.md', 'cache'];
const maxSidebarScopeDepth = 2;

const plugins = [];
const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
    plugins.push(vueDevTools());
}

function buildSidebarOptions(relDir = ''): any[] {
    const currentDir = relDir ? path.resolve(srcRoot, relDir) : srcRoot;
    const options: any[] = [];
    const depth = relDir ? relDir.split('/').length : 0;

    if (relDir) {
        options.push({
            documentRootPath: '/blog',
            scanStartPath: relDir,
            resolvePath: `/${relDir}/`,
            excludePattern: sidebarExcludePattern
        });
    }

    const childDirs = fs
        .readdirSync(currentDir, { withFileTypes: true })
        .filter(
            (entry) =>
                entry.isDirectory() &&
                !entry.name.startsWith('.') &&
                entry.name !== 'public' &&
                entry.name !== 'index'
        )
        .map((entry) => path.posix.join(relDir, entry.name));

    if (depth >= maxSidebarScopeDepth) {
        return options;
    }

    for (const childDir of childDirs) {
        options.push(...buildSidebarOptions(childDir));
    }

    return options;
}

function findFirstLink(item: any): string | undefined {
    if (item.link) {
        return item.link;
    }

    for (const child of item.items ?? []) {
        const link = findFirstLink(child);
        if (link) {
            return link;
        }
    }
}

function toNavItems(items: any[]) {
    return items
        .map((item) => {
            if (item.link) {
                return { text: item.text, link: item.link };
            }

            const navItems = (item.items ?? [])
                .map((child: any) => {
                    const link = findFirstLink(child);
                    return link ? { text: child.text, link } : null;
                })
                .filter(Boolean);

            return navItems.length ? { text: item.text, items: navItems } : null;
        })
        .filter(Boolean);
}

const topLevelSidebar = generateSidebar({
    documentRootPath: '/blog',
    excludePattern: sidebarExcludePattern
}) as any[];

const scopedSidebar = generateSidebar(buildSidebarOptions()) as Record<string, any>;

const vitePressConfigs: VitePressConfigs = {
    base,
    srcDir: 'blog',
    head: [['style', { 'data-mathjax': 'true' }, mathjaxStyles]],
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
        nav: toNavItems(topLevelSidebar),
        sidebar: scopedSidebar,
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
                pagesData.sort((a, b) => {
                    const value = b.lastUpdated - a.lastUpdated;
                    if (value === 0) {
                        return b.title.localeCompare(a.title);
                    }
                    return value;
                }),
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
            ...plugins,
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
                gifsicle: {
                    optimizationLevel: 7,
                    interlaced: false,
                },
                optipng: {
                    optimizationLevel: 7,
                },
                mozjpeg: {
                    quality: 20,
                },
                pngquant: {
                    quality: [0.8, 0.9],
                    speed: 4,
                },
                svgo: {
                    plugins: [
                        {
                            name: 'removeViewBox',
                        },
                        {
                            name: 'removeEmptyAttrs',
                            active: false,
                        },
                    ],
                },
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

export default withMindMap(withMermaid(withDrawio(defineConfig(vitePressConfigs))));
