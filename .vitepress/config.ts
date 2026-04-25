import { defineConfig } from 'vitepress';
import type { DefaultTheme, HeadConfig } from 'vitepress';
import type { Plugin } from 'vite';
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
import vueDevTools from 'vite-plugin-vue-devtools';

let base = '';
if (process.env.DEPLOY_TYPE === 'git') {
    base = '/vite-press/';
}

const srcRoot = path.resolve(__dirname, '../blog');
const sidebarExcludePattern = ['components', 'English', 'README', 'README.md', 'cache'];
const maxSidebarScopeDepth = 2;

const plugins: Plugin[] = [];
const isProd = process.env.NODE_ENV === 'production';

if (!isProd) {
    plugins.push(vueDevTools());
}

interface SidebarGeneratorOptions {
    documentRootPath: string;
    scanStartPath?: string;
    resolvePath?: string;
    excludePattern?: string[];
}

function buildSidebarOptions(relDir = ''): SidebarGeneratorOptions[] {
    const currentDir = relDir ? path.resolve(srcRoot, relDir) : srcRoot;
    const options: SidebarGeneratorOptions[] = [];
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
                entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'public' && entry.name !== 'index'
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

function findFirstLink(item: DefaultTheme.SidebarItem): string | undefined {
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

function toNavItems(items: DefaultTheme.SidebarItem[]): DefaultTheme.NavItem[] {
    return items
        .map((item) => {
            if (item.link) {
                return { text: item.text ?? '', link: item.link };
            }

            const navItems = (item.items ?? [])
                .map((child) => {
                    const link = findFirstLink(child);
                    return link ? { text: child.text ?? '', link } : null;
                })
                .filter((child): child is { text: string; link: string } => Boolean(child));

            return navItems.length ? { text: item.text ?? '', items: navItems } : null;
        })
        .filter((item): item is DefaultTheme.NavItem => Boolean(item));
}

const topLevelSidebar = generateSidebar({
    documentRootPath: '/blog',
    excludePattern: sidebarExcludePattern
}) as DefaultTheme.SidebarItem[];

const scopedSidebar = generateSidebar(buildSidebarOptions()) as DefaultTheme.SidebarMulti;

export default withMindMap(
    withMermaid(
        withDrawio(
            defineConfig<DefaultTheme.Config>({
                base,
                srcDir: 'blog',
                head: [['style', { 'data-mathjax': 'true' }, mathjaxStyles]] as HeadConfig[],
                title: '点滴生活',
                description: '记录个人成长',
                metaChunk: true,
                markdown: {
                    cache: false,
                    toc: { level: [1, 2, 3, 4, 5] },
                    config(md) {
                        md.use(mathjax);
                        md.use(timeline);
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
                mermaid: {},
                lastUpdated: true,
                mermaidPlugin: {
                    class: 'mermaid my-class main img'
                },
                themeConfig: {
                    nav: toNavItems(topLevelSidebar),
                    sidebar: scopedSidebar,
                    search: {
                        provider: 'local'
                    },
                    logo: '/favicon.svg',
                    socialLinks: [{ icon: 'github', link: 'https://github.com/LiDengHui' }],
                    footer: {
                        message: 'Released under the MIT License.',
                        copyright: '<a href="https://beian.miit.gov.cn/" target="_blank">陕ICP备2023003969号-1</a>'
                    }
                },
                vite: {
                    build: {
                        chunkSizeWarningLimit: 4096,
                        rollupOptions: {
                            onwarn(warning, warn) {
                                if (
                                    warning.code === 'UNUSED_EXTERNAL_IMPORT' &&
                                    warning.message.includes('markmap-common')
                                ) {
                                    return;
                                }
                                warn(warning);
                            }
                        }
                    },
                    plugins: [
                        ...plugins,
                        visualizer({
                            gzipSize: false,
                            brotliSize: false,
                            emitFile: false,
                            filename: 'test.html',
                            open: false
                        }),
                        vitepressProtectPlugin({
                            disableF12: false,
                            disableCopy: false,
                            disableSelect: false
                        }),
                        ...(process.platform !== 'win32'
                            ? [
                                  viteImagemin({
                                      gifsicle: {
                                          optimizationLevel: 7,
                                          interlaced: false
                                      },
                                      optipng: {
                                          optimizationLevel: 7
                                      },
                                      mozjpeg: {
                                          quality: 20
                                      },
                                      pngquant: {
                                          quality: [0.8, 0.9],
                                          speed: 4
                                      },
                                      svgo: {
                                          plugins: [
                                              {
                                                  name: 'removeViewBox'
                                              },
                                              {
                                                  name: 'removeEmptyAttrs',
                                                  active: false
                                              }
                                          ]
                                      }
                                  })
                              ]
                            : [])
                    ]
                }
            })
        )
    )
);
