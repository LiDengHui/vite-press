---
title: 前端与 Node.js 常用 npm 包分类速查
tags:
  - 工程化
  - npm
  - Node.js
categories:
  - 技术文档
  - 前端
date: 2026-10-28 10:00:00
---

# 前端与 Node.js 常用 npm 包分类速查

日常选包最怕两件事：重复造轮子，以及引入一个没人维护的轮子。这篇按“解决什么问题”把常用 npm 包分类整理，每类用表格列出代表包、定位和适用场景，方便按需检索。

> 表中只写包名和定位，不锁版本。真正接入前，建议再核对最近发布时间、TypeScript 类型、ESM 支持、License 和包体积。

## 一、工程化与构建

### 1. 包管理与 Monorepo

| 包/工具 | 定位 | 说明 |
| --- | --- | --- |
| `pnpm` | 包管理器 | 内容寻址存储 + 硬链接，省磁盘；workspace 适合 monorepo |
| `npm` | 包管理器 | Node 自带，workspaces 支持基础多包管理 |
| `yarn` | 包管理器 | 经典 Yarn 与 Berry 两套体系，注意 lockfile 差异 |
| `bun` | 运行时 + 包管理器 | 安装和启动速度快，兼容 npm 生态 |
| `nx` | 任务编排 | 插件生态强，适合大型多包仓库 |
| `turbo` | 任务编排 | 配置轻，缓存和远程缓存好用 |
| `lerna` | 多包发布 | 现在主要复用 Nx 能力，适合存量项目 |
| `@microsoft/rush` | 大型 monorepo | 规则严格，适合超大团队 |
| `@changesets/cli` | 版本与变更日志 | 用 changeset 管理多包版本和 CHANGELOG |
| `syncpack` | 依赖版本对齐 | 检查并修复多包依赖版本不一致 |
| `@manypkg/cli` | workspace 约束检查 | 校验 package.json、依赖关系和包管理器 |
| `concurrently` | 并行跑脚本 | 一条命令同时启动多个 dev server |
| `npm-run-all2` | 串行/并行脚本 | `run-s`、`run-p` 组合 npm scripts |
| `wireit` | 脚本依赖图 | 给 npm scripts 加缓存和依赖关系 |
| `knip` | 未使用文件/依赖检测 | 清理 dead code 和多余依赖 |
| `depcheck` | 依赖检测 | 找出未使用和缺失的依赖 |
| `npm-check-updates` | 依赖升级 | 批量把版本范围升到最新 |

### 2. 打包工具（Bundler）

| 工具 | 定位 | 特点 | 适合 |
| --- | --- | --- | --- |
| `vite` | 开发服务器 + 构建 | ESM 优先，开发启动快；生产构建基于 Rollup，新版可选用 Rolldown | Web 应用、库、SSR |
| `webpack` | 老牌全能打包器 | loader/plugin 生态最全，配置灵活 | 存量项目、复杂构建 |
| `@rspack/core` | Rust 版 webpack | 兼容 webpack 配置和生态，迁移成本低 | 想提速的 webpack 项目 |
| `rollup` | 库打包器 | tree-shaking 干净，输出 ESM/CJS/UMD | 类库、组件库 |
| `rolldown` | Rust 版 Rollup | 目标兼容 Rollup API，同时提升构建速度 | 下一代库/应用构建 |
| `esbuild` | 极速编译器/打包器 | Go 编写，transform 和简单 bundle 很快 | 工具链底层、脚本构建 |
| `@swc/core` | Rust 版 Babel | 转译快，也提供打包能力 | 替代 Babel、Next.js 底层 |
| `parcel` | 零配置打包器 | 开箱即用，自动处理常见资源 | 快速原型、小项目 |
| `tsup` | 库打包器 | 基于 esbuild，内置 d.ts 生成 | TS 类库、CLI |
| `tsdown` | 库打包器 | 基于 Rolldown，定位 tsup 的现代替代 | 新类库项目 |
| `unbuild` | 库打包器 | 基于 Rollup，Nuxt 生态常用 | Vue/Nuxt 类库 |
| `microbundle` | 小库打包器 | 零配置，体积小 | 微型工具库 |
| `bunchee` | 零配置库打包 | 基于 Rollup，自动处理 exports | 轻量类库 |
| `father` | 库打包工具 | Umi 生态，支持 bundle/transform 模式 | Umi 相关类库 |
| `vite-plugin-dts` | 类型声明生成 | 从 Vite 项目产出 `.d.ts` | Vite 类库 |
| `rollup-plugin-visualizer` | 产物体积分析 | 生成可视化 treemap | 构建优化 |
| `vite-plugin-inspect` | 插件调试 | 查看 Vite 插件转换过程 | 排查构建问题 |
| `unplugin-auto-import` | 自动导入 | 自动引入 Vue/React API | 减少样板代码 |
| `unplugin-vue-components` | 组件按需导入 | 自动注册组件和 UI 库 | Vue 项目 |
| `unplugin-icons` | 图标按需引入 | 按需编译图标组件 | 图标较多的项目 |
| `vite-plugin-pwa` | PWA 集成 | 生成 Service Worker 和 manifest | 离线应用 |
| `vite-plugin-compression` | 预压缩 | 产出 gzip/brotli 文件 | 静态部署 |
| `vite-plugin-checker` | 开发期检查 | 并行运行类型、ESLint、Stylelint | 大型项目 |
| `vite-plugin-svg-icons` | SVG sprite | 自动生成雪碧图 | 图标管理 |
| `vite-plugin-imagemin` | 图片压缩 | 构建时压缩图片资源 | 图片较多的站点 |
| `@vitejs/plugin-vue` | Vue 支持 | Vite 官方 Vue 插件 | Vue 项目 |
| `@vitejs/plugin-react` | React 支持 | Vite 官方 React 插件 | React 项目 |
| `@vitejs/plugin-vue-jsx` | Vue JSX | 支持 Vue JSX/TSX | JSX 风格 Vue |
| `@vitejs/plugin-legacy` | 旧浏览器兼容 | 生成 legacy chunk 和 polyfill | 需要兼容旧浏览器 |

### 3. 编译、转译与 CSS 预处理

| 包/工具 | 定位 | 说明 |
| --- | --- | --- |
| `typescript` | 类型系统 | TS 编译器，负责类型检查和声明生成 |
| `@babel/core` | JS 编译器 | 插件化转译，生态成熟 |
| `@babel/preset-env` | Babel 预设 | 按目标浏览器自动选择语法转换 |
| `@babel/preset-typescript` | Babel 预设 | 去掉 TS 类型，不做类型检查 |
| `@babel/plugin-transform-runtime` | Babel 插件 | 复用 helper，减小产物体积 |
| `@babel/runtime` | Babel 运行时 | 配合 transform-runtime 使用 |
| `@swc/core` | Rust 编译器 | 高性能转译，常用于替代 Babel |
| `esbuild` | Go 编译器 | 极速 transform，常用于工具链 |
| `postcss` | CSS 转换框架 | 用插件处理 CSS，生态基础 |
| `autoprefixer` | 自动前缀 | 根据 browserslist 补厂商前缀 |
| `postcss-preset-env` | 现代 CSS 降级 | 把新语法转成兼容写法 |
| `cssnano` | CSS 压缩 | 生产环境压缩 CSS |
| `lightningcss` | Rust CSS 工具 | 解析、转换、压缩一体，速度快 |
| `sass-embedded` | Sass 编译器 | Dart Sass 的嵌入式版本，速度快 |
| `sass` | Sass 编译器 | 经典 Dart Sass 实现 |
| `less` | Less 编译器 | 老牌 CSS 预处理器 |
| `stylus` | Stylus 编译器 | 简洁语法的 CSS 预处理器 |
| `terser` | JS 压缩 | 压缩和混淆 ES6+ 代码 |
| `oxc-minify` | JS 压缩 | Oxc 生态的 Rust 压缩器 |
| `csso` | CSS 压缩 | 轻量 CSS 优化工具 |

### 4. 开发服务器、代理与热更新

| 包/工具 | 定位 | 说明 |
| --- | --- | --- |
| `vite` | 开发服务器 | 内置 HMR、代理、SSR 基础能力 |
| `webpack-dev-server` | 开发服务器 | webpack 的 HMR 和静态服务 |
| `http-proxy-middleware` | 代理中间件 | 自定义开发代理、跨域转发 |
| `vite-plugin-mock` | Mock 服务 | 开发期接口 Mock |
| `msw` | 请求 Mock | Service Worker 级别拦截，测试和开发都能用 |
| `sirv` | 静态文件服务 | 轻量、快速的静态服务器 |
| `serve` | 静态预览 | 一条命令预览构建产物 |
| `http-server` | 静态服务器 | 零配置起本地 HTTP 服务 |
| `live-server` | 热刷新服务器 | 保存后自动刷新页面 |
| `browser-sync` | 多端同步调试 | 多设备同步滚动、刷新 |
| `nodemon` | Node 进程守护 | 文件变化自动重启服务 |
| `tsx` | TS 执行器 | 直接运行 TS，支持 watch |
| `chokidar` | 文件监听 | 跨平台文件变化监听 |
| `vite-plugin-inspect` | 构建调试 | 查看插件转换中间结果 |
| `vite-plugin-checker` | 开发期检查 | 在终端显示类型和 lint 错误 |

### 5. 代码质量与 Git 规范

| 包/工具 | 定位 | 说明 |
| --- | --- | --- |
| `eslint` | JS/TS Lint | 可插拔规则引擎，flat config 已成主流 |
| `@eslint/js` | ESLint 官方规则 | flat config 下的推荐规则集 |
| `typescript-eslint` | TS Lint | TypeScript 语法和类型感知规则 |
| `eslint-plugin-vue` | Vue Lint | Vue 单文件组件规则 |
| `eslint-plugin-react` | React Lint | React 相关规则 |
| `eslint-plugin-react-hooks` | Hooks 规则 | 检查 Hooks 依赖和调用顺序 |
| `eslint-plugin-react-refresh` | 热更新规则 | 检查 React Fast Refresh 约束 |
| `eslint-plugin-import-x` | 导入规则 | 检查导入顺序、路径和重复导入 |
| `eslint-plugin-unicorn` | 风格规则 | 大量实用但偏严格的规则 |
| `@stylistic/eslint-plugin` | 格式规则 | 接管 ESLint 中的代码风格规则 |
| `eslint-config-prettier` | 关闭冲突规则 | 避免 ESLint 和 Prettier 打架 |
| `prettier` | 代码格式化 | 统一代码风格，支持多语言 |
| `prettier-plugin-tailwindcss` | Tailwind 类名排序 | 自动排序 Tailwind class |
| `@ianvs/prettier-plugin-sort-imports` | 导入排序 | 按配置整理 import 顺序 |
| `oxlint` | Rust Lint | 速度极快，可先跑一遍再交给 ESLint |
| `oxfmt` | Rust 格式化 | Oxc 生态的格式化工具 |
| `@biomejs/biome` | Lint + 格式化 | 一体化工具，配置简单 |
| `stylelint` | 样式 Lint | CSS/SCSS/Less 规则检查 |
| `stylelint-config-standard` | Stylelint 规则集 | 标准 CSS 规则 |
| `stylelint-config-recommended-vue` | Vue 样式规则 | 支持 Vue SFC 中的样式 |
| `stylelint-order` | 属性排序 | 约束 CSS 属性书写顺序 |
| `postcss-html` | 样式解析 | 让 Stylelint 解析 HTML/Vue 模板 |
| `husky` | Git Hooks | 管理 pre-commit、commit-msg 等钩子 |
| `lint-staged` | 暂存区检查 | 只对 git add 的文件跑 lint/format |
| `simple-git-hooks` | 轻量 Git Hooks | 比 husky 更轻的方案 |
| `lefthook` | Git Hooks | Go 编写，支持并行执行 |
| `@commitlint/cli` | 提交信息检查 | 约束 commit message 格式 |
| `@commitlint/config-conventional` | Conventional Commits | 常用提交规范配置 |
| `commitizen` | 交互式提交 | 引导生成规范提交信息 |
| `czg` | 交互式提交 | 更现代的 commitizen 替代 |
| `cz-conventional-changelog` | 提交适配器 | commitizen 的 Conventional 适配器 |

### 6. 测试

| 包/工具 | 定位 | 说明 |
| --- | --- | --- |
| `vitest` | 单元测试 | Vite 生态，配置少、速度快 |
| `@vitest/coverage-v8` | 覆盖率 | 基于 V8 的覆盖率统计 |
| `@vitest/ui` | 测试界面 | 可视化查看测试结果 |
| `jest` | 单元测试 | 老牌测试框架，生态成熟 |
| `ts-jest` | Jest TS 支持 | 在 Jest 中运行 TypeScript |
| `babel-jest` | Jest Babel 支持 | 用 Babel 转译测试代码 |
| `@testing-library/react` | React 测试 | 从用户行为角度测试组件 |
| `@testing-library/vue` | Vue 测试 | Vue 组件测试工具 |
| `@testing-library/jest-dom` | DOM 断言 | 增加可读的 DOM 断言 |
| `@testing-library/user-event` | 用户事件 | 模拟真实用户交互 |
| `happy-dom` | DOM 环境 | 比 jsdom 更快的测试 DOM |
| `jsdom` | DOM 环境 | 在 Node 中模拟浏览器 DOM |
| `msw` | 接口 Mock | 拦截 fetch/XHR，开发和测试通用 |
| `nock` | HTTP Mock | 拦截 Node 的 HTTP 请求 |
| `supertest` | 接口测试 | 直接测试 Express/Koa/Fastify 应用 |
| `@playwright/test` | E2E 测试 | 跨浏览器端到端测试，支持录制 |
| `playwright` | 浏览器自动化 | 控制 Chromium/Firefox/WebKit |
| `cypress` | E2E 测试 | 开发者体验好，调试界面强 |
| `puppeteer` | 浏览器自动化 | 控制 Chrome/Chromium |
| `webdriverio` | E2E 测试 | 基于 WebDriver 的自动化 |
| `@faker-js/faker` | 测试数据 | 生成姓名、地址、文本等假数据 |
| `storybook` | 组件工作台 | 组件开发、文档和交互测试 |
| `@storybook/vue3` | Storybook Vue | Vue 3 组件接入 |
| `@storybook/react` | Storybook React | React 组件接入 |
| `@chromatic-com/storybook` | 视觉回归 | Storybook 截图对比 |
| `reg-suit` | 视觉回归 | 图片差异检测 |
| `autocannon` | 压测 | Node 服务 HTTP 压测 |
| `artillery` | 压测 | 场景化负载测试 |
| `lighthouse` | 性能审计 | 页面性能、可访问性评分 |
| `@lhci/cli` | 性能 CI | Lighthouse 持续集成 |

### 7. 类型、校验与运行时

| 包/工具 | 定位 | 说明 |
| --- | --- | --- |
| `typescript` | 类型系统 | 类型检查、声明生成、编辑器提示 |
| `ts-node` | TS 执行器 | 在 Node 中直接运行 TS |
| `tsx` | TS 执行器 | 基于 esbuild，启动快，支持 watch |
| `tsd` | 类型测试 | 断言类型定义是否符合预期 |
| `@types/node` | Node 类型 | Node API 的类型声明 |
| `type-fest` | 类型工具 | 大量实用 TS 工具类型 |
| `zod` | Schema 校验 | TS 优先，运行时校验 + 类型推导 |
| `yup` | Schema 校验 | 表单场景常用，生态成熟 |
| `valibot` | Schema 校验 | 更轻量的模块化校验库 |
| `arktype` | Schema 校验 | 类型语法接近 TS，性能好 |
| `io-ts` | 运行时类型 | fp-ts 生态的编解码库 |
| `superstruct` | Schema 校验 | 轻量、易用的结构校验 |
| `ajv` | JSON Schema | 高性能 JSON Schema 校验 |
| `@sinclair/typebox` | JSON Schema 类型 | 用 TS 定义 JSON Schema |
| `zod-to-json-schema` | Schema 转换 | 把 Zod schema 转成 JSON Schema |
| `ts-pattern` | 模式匹配 | 类型安全的模式匹配 |

### 8. 版本发布与包质量

| 包/工具 | 定位 | 说明 |
| --- | --- | --- |
| `@changesets/cli` | 版本管理 | 多包版本、CHANGELOG、发布一条龙 |
| `semantic-release` | 自动发布 | 根据 commit 自动决定版本和发布 |
| `release-it` | 发布工具 | 交互式发版，支持 changelog 和 GitHub Release |
| `release-please` | 自动发版 | Google 出品，基于 PR 的发布流程 |
| `np` | 发布助手 | 交互式 npm publish，带检查 |
| `standard-version` | 版本与日志 | 基于 Conventional Commits 生成版本和日志 |
| `publint` | 包规范检查 | 检查 package.json 的 exports/main 是否正确 |
| `@arethetypeswrong/cli` | 类型解析检查 | 检查不同模块解析模式下的类型问题 |
| `size-limit` | 体积限制 | 在 CI 中限制产物体积 |
| `bundlewatch` | 体积监控 | 对比 PR 前后的 bundle 体积 |
| `npm-package-json-lint` | package.json 检查 | 约束字段、顺序和规范 |
| `verdaccio` | 私有 registry | 搭建内部 npm 仓库 |

## 二、前端运行时

### 9. 框架与元框架

| 包/工具 | 定位 | 说明 |
| --- | --- | --- |
| `react` / `react-dom` | UI 框架 | 组件化、生态最大 |
| `vue` | UI 框架 | 渐进式，模板和响应式上手快 |
| `svelte` | 编译型框架 | 运行时开销小，写法简洁 |
| `solid-js` | 响应式框架 | 细粒度响应式，性能好 |
| `preact` | 轻量 React 兼容 | 体积小，适合对包体积敏感的场景 |
| `angular` | 全家桶框架 | 依赖注入、路由、表单一体化 |
| `lit` | Web Components | 标准组件，适合跨框架复用 |
| `@builder.io/qwik` | resumable 框架 | 强调服务端渲染和按需水合 |
| `next` | React 元框架 | SSR/SSG/ISR、路由、API Routes |
| `nuxt` | Vue 元框架 | SSR/SSG、文件路由、自动导入 |
| `@remix-run/react` | React 元框架 | 以 Web 标准为中心的数据流 |
| `react-router` | React 路由/框架 | v7 起同时提供路由和框架能力 |
| `@sveltejs/kit` | Svelte 元框架 | 路由、SSR、构建一体化 |
| `astro` | 内容站点框架 | 群岛架构，默认少 JS |
| `alpinejs` | 轻量交互框架 | 适合服务端渲染页面加一点交互 |

### 10. 路由

| 包/工具 | 定位 | 说明 |
| --- | --- | --- |
| `react-router` | React 路由 | 声明式路由、嵌套路由、数据 API |
| `@tanstack/react-router` | React 路由 | 类型安全，搜索参数和路由类型推导强 |
| `vue-router` | Vue 路由 | Vue 官方路由，支持嵌套和守卫 |
| `wouter` | 轻量 React 路由 | 体积小，API 简单 |
| `@solidjs/router` | Solid 路由 | Solid 官方路由方案 |
| `history` | 历史记录管理 | 封装 pushState/popstate |
| `unplugin-vue-router` | 文件路由 | 根据文件结构生成 Vue Router 配置 |
| `vite-plugin-pages` | 文件路由 | React/Vue 的约定式路由 |

### 11. 状态管理

| 包/工具 | 定位 | 说明 |
| --- | --- | --- |
| `@reduxjs/toolkit` | 状态管理 | Redux 官方推荐写法，内置 Immer/Thunk |
| `react-redux` | React 绑定 | 把 Redux store 接入 React |
| `zustand` | 轻量状态管理 | API 简单，选择器订阅，社区主流 |
| `jotai` | 原子化状态 | 自底向上组合，适合细粒度状态 |
| `recoil` | 原子化状态 | React 原子状态方案，维护节奏需关注 |
| `mobx` | 响应式状态 | 面向对象风格，自动追踪依赖 |
| `mobx-react-lite` | React 绑定 | MobX 的轻量 React 绑定 |
| `valtio` | 代理式状态 | 通过 Proxy 实现可变写法 |
| `pinia` | Vue 状态管理 | Vue 官方推荐，TS 支持好 |
| `vuex` | Vue 状态管理 | Vue 2 时代方案，新项目优先 Pinia |
| `pinia-plugin-persistedstate` | Pinia 持久化 | 把 store 持久化到 localStorage |
| `nanostores` | 跨框架状态 | 体积小，可用于 React/Vue/Svelte |
| `xstate` | 状态机 | 用状态图描述复杂流程 |
| `@xstate/react` | XState React 绑定 | 在 React 中使用状态机 |
| `immer` | 不可变更新 | 用可变写法生成不可变数据 |
| `@tanstack/store` | 轻量 store | TanStack 生态的基础状态库 |

### 12. 数据请求与缓存

| 包/工具 | 定位 | 说明 |
| --- | --- | --- |
| `axios` | HTTP 客户端 | 拦截器、取消、上传进度，生态成熟 |
| `ofetch` | HTTP 客户端 | 基于 fetch，Nuxt 生态常用 |
| `ky` | HTTP 客户端 | 基于 fetch，API 小巧 |
| `got` | Node HTTP 客户端 | 功能全，适合服务端请求 |
| `undici` | Node HTTP 客户端 | Node 官方底层 fetch 实现 |
| `node-fetch` | fetch 兼容 | Node 18 之前常用，新项目可用原生 fetch |
| `superagent` | HTTP 客户端 | 老牌请求库，Node/浏览器通用 |
| `@tanstack/react-query` | 服务端状态 | 请求缓存、重试、失效、分页 |
| `@tanstack/vue-query` | 服务端状态 | TanStack Query 的 Vue 绑定 |
| `swr` | 服务端状态 | Vercel 出品，轻量请求缓存 |
| `alova` | 请求策略 | 面向场景的请求库，支持缓存和重试 |
| `@apollo/client` | GraphQL 客户端 | 缓存、查询、变更一体化 |
| `urql` | GraphQL 客户端 | 轻量、可扩展的 GraphQL 客户端 |
| `graphql-request` | GraphQL 请求 | 极简 GraphQL 客户端 |
| `graphql-ws` | GraphQL WebSocket | GraphQL 订阅协议实现 |
| `socket.io-client` | 实时通信 | 自动重连、房间、降级 |
| `ws` | WebSocket | 轻量 WebSocket 客户端/服务端 |
| `eventsource` | SSE | 服务端推送事件客户端 |
| `axios-retry` | 请求重试 | 给 axios 增加重试策略 |

### 13. UI 组件库

| 包/工具 | 定位 | 说明 |
| --- | --- | --- |
| `antd` | React 组件库 | 企业中后台首选，组件全 |
| `@ant-design/icons` | Ant Design 图标 | 与 antd 配套 |
| `@ant-design/pro-components` | 高级业务组件 | ProTable、ProForm 等开箱即用 |
| `@mui/material` | React 组件库 | Material Design 风格，国际化生态好 |
| `@mui/icons-material` | MUI 图标 | Material 图标集 |
| `@chakra-ui/react` | React 组件库 | 原子化样式 + 无障碍支持 |
| `@mantine/core` | React 组件库 | 组件和 hooks 丰富，配置灵活 |
| `@mantine/hooks` | React Hooks | Mantine 配套 hooks |
| `element-plus` | Vue 3 组件库 | 国内中后台常用 |
| `naive-ui` | Vue 3 组件库 | TS 友好，主题定制方便 |
| `vuetify` | Vue 组件库 | Material Design 风格 |
| `@arco-design/web-vue` | Vue 组件库 | 字节系设计语言 |
| `@arco-design/web-react` | React 组件库 | Arco 的 React 版本 |
| `@douyinfe/semi-ui` | React 组件库 | 字节 Semi 设计体系 |
| `@radix-ui/react-*` | Headless 组件 | 无样式、可访问性好，常配 Tailwind |
| `@headlessui/react` | Headless 组件 | Tailwind 官方合作的无样式组件 |
| `react-aria-components` | Headless 组件 | Adobe 出品，无障碍能力强 |
| `@ark-ui/react` | Headless 组件 | 跨框架的无样式组件 |
| `shadcn` | 组件 CLI | 把组件源码复制进项目，按需改造 |
| `@heroui/react` | React 组件库 | 原 NextUI，动效和主题能力好 |
| `daisyui` | Tailwind 插件 | 给 Tailwind 提供主题和组件类 |
| `vant` | 移动端 Vue 组件库 | 有赞出品，移动端场景常用 |
| `antd-mobile` | 移动端 React 组件库 | Ant Design 移动端方案 |
| `@nutui/nutui` | 移动端 Vue 组件库 | 京东风格 |
| `@nutui/nutui-react` | 移动端 React 组件库 | NutUI 的 React 版本 |

### 14. 样式方案

| 包/工具 | 定位 | 说明 |
| --- | --- | --- |
| `tailwindcss` | 原子化 CSS | 用 utility class 组织样式 |
| `@tailwindcss/vite` | Tailwind Vite 插件 | Tailwind v4 的 Vite 集成 |
| `@tailwindcss/postcss` | Tailwind PostCSS 插件 | Tailwind v4 的 PostCSS 集成 |
| `unocss` | 原子化 CSS 引擎 | 按需生成，规则灵活 |
| `sass-embedded` | Sass 编译 | 推荐的新项目 Sass 实现 |
| `less` | Less 编译 | 老项目常见 |
| `stylus` | Stylus 编译 | 简洁语法 |
| `postcss` | CSS 处理 | 插件化 CSS 转换基础 |
| `autoprefixer` | 自动前缀 | 按 browserslist 补前缀 |
| `postcss-preset-env` | 现代 CSS 兼容 | 新语法降级 |
| `cssnano` | CSS 压缩 | 生产环境压缩 |
| `lightningcss` | CSS 工具链 | 解析、转换、压缩一体 |
| `styled-components` | CSS-in-JS | 组件级样式，React 生态常用 |
| `@emotion/react` | CSS-in-JS | 灵活、性能好 |
| `@emotion/styled` | CSS-in-JS | styled 风格 API |
| `@vanilla-extract/css` | 零运行时 CSS | TS 写样式，编译期产出 CSS |
| `@stitches/react` | CSS-in-JS | 变体和主题能力强 |
| `clsx` | 类名拼接 | 轻量条件类名工具 |
| `classnames` | 类名拼接 | 老牌类名工具 |
| `tailwind-merge` | Tailwind 类名合并 | 解决类名冲突 |
| `class-variance-authority` | 变体管理 | 管理组件 variant 和 class |
| `normalize.css` | 样式重置 | 统一浏览器默认样式 |
| `modern-normalize` | 现代样式重置 | 更轻量的 normalize |
| `postcss-pxtorem` | 移动端适配 | px 转 rem |
| `postcss-px-to-viewport-8-plugin` | 移动端适配 | px 转 vw |

### 15. 表单与校验

| 包/工具 | 定位 | 说明 |
| --- | --- | --- |
| `react-hook-form` | React 表单 | 非受控为主，性能好，社区主流 |
| `@hookform/resolvers` | 表单校验适配 | 接入 Zod/Yup/Valibot 等 |
| `formik` | React 表单 | 老牌表单库，写法直观 |
| `@tanstack/react-form` | React 表单 | TanStack 生态，类型推导强 |
| `final-form` | React 表单 | 订阅式表单状态 |
| `react-final-form` | React 表单 | Final Form 的 React 绑定 |
| `vee-validate` | Vue 表单 | Vue 表单校验常用 |
| `vuelidate` | Vue 表单 | 轻量、模型驱动校验 |
| `@formkit/vue` | Vue 表单 | 表单生成和校验一体化 |
| `zod` | Schema 校验 | 与表单库配合，类型推导好 |
| `yup` | Schema 校验 | 表单校验生态成熟 |
| `valibot` | Schema 校验 | 体积小，适合前端 |

### 16. 动画与交互

| 包/工具 | 定位 | 说明 |
| --- | --- | --- |
| `motion` | 动画库 | 原 Framer Motion，声明式动画 |
| `framer-motion` | React 动画 | 组件动画、手势、布局动画 |
| `gsap` | 时间轴动画 | 复杂动画、滚动动画、SVG 动画 |
| `animejs` | 轻量动画 | API 简单，适合小型动效 |
| `@vueuse/motion` | Vue 动画 | 基于 Motion One 的 Vue 方案 |
| `@react-spring/web` | 弹簧动画 | 物理弹簧模型 |
| `lottie-web` | Lottie 动画 | 播放 After Effects 导出的动画 |
| `@lottiefiles/dotlottie-web` | Lottie 播放器 | DotLottie 格式播放 |
| `@formkit/auto-animate` | 自动动画 | 列表增删自动过渡 |
| `swiper` | 轮播 | 功能全，移动端常用 |
| `embla-carousel` | 轮播 | 轻量、无依赖 |
| `keen-slider` | 轮播 | 轻量、手势友好 |
| `react-transition-group` | 过渡动画 | React 进出场动画基础库 |
| `interactjs` | 拖拽交互 | 拖拽、缩放、手势 |
| `@dnd-kit/core` | 拖拽排序 | 现代化 React 拖拽方案 |
| `react-dnd` | 拖拽 | 老牌 React 拖拽库 |
| `sortablejs` | 拖拽排序 | 原生 JS，框架无关 |
| `vue-draggable-plus` | Vue 拖拽 | 基于 Sortable.js 的 Vue 封装 |

### 17. 图标、字体与图片

| 包/工具 | 定位 | 说明 |
| --- | --- | --- |
| `lucide-react` | React 图标 | 风格统一，按需引入 |
| `lucide-vue-next` | Vue 图标 | Lucide 的 Vue 版本 |
| `react-icons` | React 图标集合 | 聚合多个图标库 |
| `@ant-design/icons` | Ant Design 图标 | 中后台常用 |
| `@iconify/vue` | Vue 图标 | 按需加载 Iconify 图标集 |
| `@iconify/react` | React 图标 | 按需加载 Iconify 图标集 |
| `@fortawesome/fontawesome-free` | 图标字体 | Font Awesome 免费图标 |
| `@fortawesome/react-fontawesome` | React 图标 | Font Awesome 的 React 绑定 |
| `unplugin-icons` | 图标按需编译 | 把图标编译成组件 |
| `@fontsource/*` | 自托管字体 | 按字体包引入，避免外部 CDN |
| `webfontloader` | 字体加载 | 控制字体加载和回退 |
| `sharp` | 图片处理 | Node 端高性能图片缩放、裁剪、转码 |
| `jimp` | 图片处理 | 纯 JS 图片处理 |
| `browser-image-compression` | 浏览器图片压缩 | 上传前压缩图片 |
| `compressorjs` | 浏览器图片压缩 | 基于 Canvas 的压缩 |
| `svgo` | SVG 优化 | 清理 SVG 冗余信息 |
| `vite-svg-loader` | SVG 组件化 | 把 SVG 当组件导入 |
| `qrcode` | 二维码生成 | 生成二维码图片/DataURL |
| `qrcode.react` | React 二维码 | 二维码 React 组件 |
| `jsbarcode` | 条形码生成 | 生成多种条形码 |

### 18. 可视化与图表

| 包/工具 | 定位 | 说明 |
| --- | --- | --- |
| `echarts` | 图表库 | 功能全，国内中后台常用 |
| `echarts-for-react` | React 绑定 | ECharts 的 React 封装 |
| `vue-echarts` | Vue 绑定 | ECharts 的 Vue 封装 |
| `d3` | 数据可视化 | 底层能力强，学习曲线陡 |
| `chart.js` | 图表库 | 轻量、易用 |
| `react-chartjs-2` | React 绑定 | Chart.js 的 React 封装 |
| `vue-chartjs` | Vue 绑定 | Chart.js 的 Vue 封装 |
| `recharts` | React 图表 | 声明式组件，适合业务图表 |
| `@nivo/core` | React 图表 | 主题和交互丰富 |
| `@visx/*` | React 可视化 | Airbnb 出品的底层可视化组件 |
| `plotly.js` | 科学图表 | 交互和图表类型丰富 |
| `highcharts` | 商业图表 | 功能强，注意 License |
| `three` | 3D 渲染 | WebGL 3D 基础库 |
| `@react-three/fiber` | React 3D | 用 React 写 Three.js |
| `@react-three/drei` | 3D 工具集 | R3F 常用辅助组件 |
| `babylonjs` | 3D 引擎 | 游戏和 3D 场景 |
| `pixi.js` | 2D 渲染 | 高性能 2D WebGL |
| `konva` | Canvas 2D | 图层、图形、事件模型 |
| `react-konva` | React Canvas | Konva 的 React 绑定 |
| `cytoscape` | 图可视化 | 网络关系图 |
| `mermaid` | 图表即代码 | Markdown 风格绘制流程图 |
| `@antv/g6` | 图可视化 | 关系图、拓扑图 |
| `@antv/x6` | 图编辑 | 流程图、DAG 编辑器 |
| `@xyflow/react` | 节点编辑器 | 原 React Flow，流程图/编排器常用 |

### 19. 富文本与代码编辑器

| 包/工具 | 定位 | 说明 |
| --- | --- | --- |
| `@tiptap/core` | 富文本编辑器 | 基于 ProseMirror，扩展性强 |
| `@tiptap/vue-3` | Vue 绑定 | Tiptap 的 Vue 3 集成 |
| `@tiptap/react` | React 绑定 | Tiptap 的 React 集成 |
| `@tiptap/starter-kit` | Tiptap 预设 | 常用扩展合集 |
| `prosemirror-state` | 编辑器底层 | 文档状态和事务 |
| `prosemirror-view` | 编辑器视图 | DOM 渲染和交互 |
| `prosemirror-model` | 编辑器模型 | 文档结构定义 |
| `slate` | 富文本框架 | 完全可定制的编辑器框架 |
| `slate-react` | Slate React | Slate 的 React 渲染层 |
| `lexical` | 富文本框架 | Meta 出品，性能和可扩展性好 |
| `@lexical/react` | Lexical React | Lexical 的 React 绑定 |
| `quill` | 富文本编辑器 | 开箱即用，轻量 |
| `@wangeditor/editor` | 富文本编辑器 | 国产编辑器，中文场景友好 |
| `@wangeditor/editor-for-vue` | Vue 绑定 | wangEditor 的 Vue 集成 |
| `monaco-editor` | 代码编辑器 | VS Code 同款编辑器 |
| `@monaco-editor/react` | React 绑定 | Monaco 的 React 封装 |
| `codemirror` | 代码编辑器 | 轻量、模块化 |
| `@codemirror/state` | 编辑器状态 | CodeMirror 6 状态层 |
| `@codemirror/view` | 编辑器视图 | CodeMirror 6 视图层 |
| `yjs` | 协同编辑 | CRDT 数据结构，支持多人协作 |
| `y-websocket` | 协同网络层 | Yjs 的 WebSocket 同步 |
| `marked` | Markdown 渲染 | 轻量 Markdown 解析 |
| `markdown-it` | Markdown 渲染 | 插件丰富，VitePress 也基于它 |
| `remark` | Markdown AST | unified 生态的 Markdown 处理 |
| `rehype` | HTML AST | unified 生态的 HTML 处理 |

### 20. 表格与虚拟列表

| 包/工具 | 定位 | 说明 |
| --- | --- | --- |
| `@tanstack/react-table` | React 表格 | Headless，排序、筛选、分页逻辑全 |
| `@tanstack/table-core` | 表格核心 | 框架无关的表格逻辑 |
| `ag-grid-community` | 数据表格 | 功能强，企业级场景常用 |
| `ag-grid-react` | React 表格 | AG Grid 的 React 集成 |
| `handsontable` | 表格编辑器 | 类 Excel 编辑体验，注意 License |
| `@handsontable/react` | React 表格 | Handsontable 的 React 集成 |
| `vxe-table` | Vue 表格 | 国产 Vue 表格方案，功能全 |
| `react-window` | 虚拟列表 | 轻量虚拟滚动 |
| `react-virtuoso` | 虚拟列表 | 支持动态高度和聊天场景 |
| `@tanstack/react-virtual` | 虚拟滚动 | Headless 虚拟化 |
| `vue-virtual-scroller` | Vue 虚拟列表 | Vue 长列表优化 |
| `xlsx` | Excel 读写 | SheetJS，浏览器和 Node 通用 |
| `exceljs` | Excel 读写 | 样式和流式写入能力强 |
| `papaparse` | CSV 解析 | 浏览器端 CSV 解析 |
| `csv-parse` | CSV 解析 | Node 端流式 CSV 解析 |
| `csv-stringify` | CSV 生成 | Node 端 CSV 输出 |

### 21. 工具函数与日期

| 包/工具 | 定位 | 说明 |
| --- | --- | --- |
| `lodash-es` | 工具函数 | 按 ESM 引入，函数全 |
| `lodash` | 工具函数 | 老牌工具库，注意按需引入 |
| `ramda` | 函数式工具 | 柯里化、无副作用 |
| `radash` | 现代工具库 | 类型友好，API 简洁 |
| `es-toolkit` | 现代工具库 | 体积小，兼容 lodash 常用 API |
| `dayjs` | 日期处理 | 体积小，插件化 |
| `date-fns` | 日期处理 | 函数式，tree-shaking 友好 |
| `luxon` | 日期处理 | 时区和国际化能力强 |
| `moment` | 日期处理 | 老项目常见，新项目建议替代 |
| `nanoid` | ID 生成 | 体积小，URL 安全 |
| `uuid` | ID 生成 | RFC 兼容 UUID |
| `ulid` | ID 生成 | 可按时间排序 |
| `qs` | 查询字符串 | 解析和序列化 URL 参数 |
| `query-string` | 查询字符串 | 轻量 URL 参数工具 |
| `mitt` | 事件总线 | 200 字节左右的事件发射器 |
| `eventemitter3` | 事件发射器 | 高性能 EventEmitter |
| `ahooks` | React Hooks | 阿里出品，常用 hooks 集合 |
| `@vueuse/core` | Vue Hooks | Vue 组合式工具集 |
| `react-use` | React Hooks | 常用 React hooks 集合 |
| `usehooks-ts` | React Hooks | TS 优先的 hooks 集合 |
| `p-limit` | 并发控制 | 限制 Promise 并发数 |
| `p-retry` | 重试 | Promise 失败重试 |
| `p-queue` | 任务队列 | Promise 队列和并发控制 |
| `delay` | 延迟 | Promise 版 sleep |
| `ms` | 时间格式化 | 毫秒和可读时间互转 |
| `pretty-bytes` | 字节格式化 | 把字节数转成可读单位 |
| `bytes` | 字节解析 | 字节数和字符串互转 |
| `change-case` | 命名转换 | camelCase、kebab-case 等 |
| `validator` | 字符串校验 | 邮箱、URL、手机号等校验 |
| `dompurify` | XSS 防护 | 清理不可信 HTML |
| `isomorphic-dompurify` | 同构 XSS 防护 | Node 和浏览器通用 |

### 22. 国际化

| 包/工具 | 定位 | 说明 |
| --- | --- | --- |
| `i18next` | 国际化核心 | 插件化，框架无关 |
| `react-i18next` | React 国际化 | i18next 的 React 绑定 |
| `vue-i18n` | Vue 国际化 | Vue 官方国际化方案 |
| `next-intl` | Next.js 国际化 | App Router 友好 |
| `@nuxtjs/i18n` | Nuxt 国际化 | Nuxt 模块化集成 |
| `react-intl` | React 国际化 | FormatJS 生态 |
| `@formatjs/intl` | 国际化底层 | ICU 消息格式化 |
| `intl-messageformat` | 消息格式化 | 处理复数、日期、数字 |
| `@lingui/core` | 国际化框架 | 编译期提取消息 |
| `@lingui/react` | React 国际化 | Lingui 的 React 绑定 |
| `typesafe-i18n` | 类型安全国际化 | 编译期生成类型 |

### 23. 文件、媒体与文档处理

| 包/工具 | 定位 | 说明 |
| --- | --- | --- |
| `file-saver` | 文件下载 | 浏览器端保存 Blob/File |
| `jszip` | ZIP 处理 | 浏览器端创建和读取 zip |
| `adm-zip` | ZIP 处理 | Node 端 zip 读写 |
| `archiver` | 压缩流 | Node 端流式压缩 |
| `tar` | tar 处理 | Node 端 tar 打包/解包 |
| `pdf-lib` | PDF 生成 | 创建和修改 PDF |
| `pdfjs-dist` | PDF 渲染 | 浏览器端解析和渲染 PDF |
| `pdfkit` | PDF 生成 | Node 端生成 PDF |
| `docx` | Word 生成 | 生成 .docx 文件 |
| `mammoth` | Word 解析 | 把 .docx 转成 HTML |
| `html2canvas` | 页面截图 | 把 DOM 转成 Canvas |
| `html-to-image` | DOM 转图片 | 支持 SVG/PNG/JPEG |
| `cropperjs` | 图片裁剪 | 交互式裁剪 |
| `react-easy-crop` | React 裁剪 | 轻量图片裁剪组件 |
| `video.js` | 视频播放 | 可定制的 HTML5 播放器 |
| `hls.js` | HLS 播放 | 浏览器端 HLS 流 |
| `flv.js` | FLV 播放 | 浏览器端 FLV 流 |
| `dashjs` | MPEG-DASH | DASH 流播放 |
| `wavesurfer.js` | 音频波形 | 音频可视化和交互 |
| `howler` | 音频播放 | 跨浏览器音频控制 |
| `@ffmpeg/ffmpeg` | 浏览器转码 | 在浏览器中运行 FFmpeg |

### 24. 地图与地理

| 包/工具 | 定位 | 说明 |
| --- | --- | --- |
| `leaflet` | 地图库 | 轻量、插件多 |
| `react-leaflet` | React 地图 | Leaflet 的 React 绑定 |
| `@vue-leaflet/vue-leaflet` | Vue 地图 | Leaflet 的 Vue 绑定 |
| `mapbox-gl` | 矢量地图 | Mapbox 地图渲染，注意 Token 和 License |
| `maplibre-gl` | 开源矢量地图 | Mapbox GL 的开源分支 |
| `ol` | OpenLayers | 功能全，GIS 场景常用 |
| `@amap/amap-jsapi-loader` | 高德地图 | 加载高德 JS API |
| `@turf/turf` | 地理计算 | 距离、缓冲区、相交等 |
| `supercluster` | 点聚合 | 大数据量地图聚合 |
| `proj4` | 坐标转换 | 不同坐标系转换 |

### 25. 跨端与桌面

| 包/工具 | 定位 | 说明 |
| --- | --- | --- |
| `electron` | 桌面应用 | Chromium + Node 的桌面容器 |
| `electron-builder` | 桌面打包 | 生成安装包和自动更新 |
| `@electron-forge/cli` | Electron 工具链 | 官方脚手架和打包 |
| `electron-vite` | Electron 构建 | Vite 驱动的 Electron 开发 |
| `electron-updater` | 自动更新 | Electron 应用更新 |
| `@tauri-apps/api` | Tauri 前端 API | 与 Rust 后端通信 |
| `@tauri-apps/cli` | Tauri CLI | Tauri 开发和打包 |
| `react-native` | 移动端框架 | 用 React 写原生应用 |
| `expo` | React Native 工具链 | 开发、构建、发布一体化 |
| `@react-navigation/native` | RN 路由 | React Native 导航 |
| `react-native-reanimated` | RN 动画 | 高性能原生动画 |
| `react-native-gesture-handler` | RN 手势 | 原生手势系统 |
| `@capacitor/core` | 跨端容器 | Web 应用打包成原生应用 |
| `@capacitor/cli` | Capacitor CLI | 项目初始化和同步 |
| `cordova` | 跨端容器 | 老牌 WebView 容器 |
| `@dcloudio/uni-app` | 多端框架 | 一套代码编译到小程序/H5/App |
| `@tarojs/taro` | 多端框架 | 京东多端方案 |

### 26. PWA、存储与浏览器能力

| 包/工具 | 定位 | 说明 |
| --- | --- | --- |
| `vite-plugin-pwa` | PWA 构建 | 生成 Service Worker 和 manifest |
| `workbox-window` | Service Worker 管理 | 注册、更新和通信 |
| `workbox-precaching` | 预缓存 | 构建产物预缓存 |
| `workbox-routing` | 请求路由 | 自定义缓存策略 |
| `workbox-strategies` | 缓存策略 | CacheFirst、NetworkFirst 等 |
| `idb` | IndexedDB 封装 | Promise 化，轻量 |
| `localforage` | 本地存储 | IndexedDB/WebSQL/localStorage 统一 API |
| `dexie` | IndexedDB | 查询能力强的 IndexedDB 封装 |
| `@tanstack/react-query-persist-client` | 请求持久化 | 把 Query 缓存持久化 |
| `js-cookie` | Cookie | 浏览器 Cookie 读写 |
| `cookie` | Cookie 解析 | 轻量 Cookie 序列化 |
| `universal-cookie` | Cookie | 浏览器和 Node 通用 |
| `broadcast-channel` | 跨标签通信 | 同源标签页消息广播 |
| `comlink` | Web Worker | 把 Worker 调用变成 Promise |
| `web-vitals` | 性能指标 | 采集 LCP、CLS、INP 等 |

### 27. AI 与大模型集成

| 包/工具 | 定位 | 说明 |
| --- | --- | --- |
| `openai` | OpenAI SDK | 官方 Node/浏览器 SDK |
| `@anthropic-ai/sdk` | Anthropic SDK | Claude API 官方 SDK |
| `ai` | Vercel AI SDK | 流式文本、工具调用、UI 集成 |
| `@ai-sdk/openai` | AI SDK Provider | OpenAI 模型接入 |
| `@ai-sdk/anthropic` | AI SDK Provider | Anthropic 模型接入 |
| `@ai-sdk/react` | AI SDK React | `useChat` 等 React hooks |
| `langchain` | LLM 应用框架 | 链、工具、RAG、Agent |
| `@langchain/core` | LangChain 核心 | 基础抽象和接口 |
| `llamaindex` | RAG 框架 | 文档索引、检索、问答 |
| `@modelcontextprotocol/sdk` | MCP SDK | 实现 MCP Server/Client |
| `ollama` | 本地模型客户端 | 调用本地 Ollama 服务 |
| `@huggingface/inference` | Hugging Face 推理 | 调用托管推理 API |
| `@huggingface/transformers` | 浏览器推理 | 在浏览器/Node 跑 Transformer |
| `tiktoken` | Token 计数 | OpenAI 模型 token 估算 |
| `gpt-tokenizer` | Token 计数 | 纯 JS 的 tokenizer |
| `chromadb` | 向量数据库 | Chroma 客户端 |
| `@pinecone-database/pinecone` | 向量数据库 | Pinecone 客户端 |
| `@qdrant/js-client-rest` | 向量数据库 | Qdrant 客户端 |
| `weaviate-client` | 向量数据库 | Weaviate 客户端 |
| `@upstash/vector` | 向量数据库 | Upstash 托管向量库 |
| `pgvector` | 向量检索 | PostgreSQL 向量扩展客户端 |

## 三、Node.js 服务端

### 28. Web 框架与全栈能力

| 包/工具 | 定位 | 说明 |
| --- | --- | --- |
| `express` | Web 框架 | 生态最大，中间件丰富，适合传统 API |
| `koa` | Web 框架 | 洋葱模型中间件，代码轻量 |
| `@koa/router` | Koa 路由 | Koa 官方风格路由 |
| `fastify` | Web 框架 | Schema 校验、序列化、插件体系，性能好 |
| `@fastify/cors` | Fastify 插件 | 跨域配置 |
| `@fastify/helmet` | Fastify 插件 | 安全响应头 |
| `@fastify/multipart` | Fastify 插件 | 文件上传 |
| `@fastify/swagger` | Fastify 插件 | 生成 OpenAPI 文档 |
| `@nestjs/core` | 企业级框架 | 模块、依赖注入、装饰器，结构化强 |
| `@nestjs/common` | Nest 基础包 | 控制器、服务、管道、守卫等 |
| `@nestjs/platform-express` | Nest 适配器 | 默认 Express 适配 |
| `@nestjs/platform-fastify` | Nest 适配器 | Fastify 适配，性能更好 |
| `@nestjs/config` | Nest 配置 | 环境变量和配置模块 |
| `@nestjs/swagger` | Nest 文档 | 自动生成 Swagger |
| `@nestjs/schedule` | Nest 定时任务 | 声明式 cron/interval |
| `@nestjs/bullmq` | Nest 队列 | BullMQ 集成 |
| `hono` | 轻量 Web 框架 | 跨运行时，适合边缘函数 |
| `@hono/node-server` | Hono Node 适配 | 在 Node 中运行 Hono |
| `elysia` | Bun Web 框架 | Bun 优先，类型推导好 |
| `polka` | 轻量 Web 框架 | 体积小，API 接近 Express |
| `restify` | API 框架 | 面向 REST API 的服务端框架 |
| `h3` | HTTP 框架 | Nuxt/Nitro 底层，轻量事件驱动 |
| `nitro` | 服务端工具链 | 构建和部署全栈应用 |
| `@trpc/server` | RPC 框架 | 端到端类型安全的 API |
| `@apollo/server` | GraphQL 服务 | Apollo GraphQL 服务端 |
| `graphql-yoga` | GraphQL 服务 | 轻量、开箱即用的 GraphQL 服务 |

### 29. 数据库

#### 关系型数据库驱动

| 包/工具 | 数据库 | 说明 |
| --- | --- | --- |
| `pg` | PostgreSQL | Node 端最常用的 PostgreSQL 驱动 |
| `postgres` | PostgreSQL | postgres.js，轻量、SQL 模板字符串写法 |
| `pg-promise` | PostgreSQL | 基于 pg 的 Promise 封装 |
| `slonik` | PostgreSQL | 类型安全、带连接池的 PostgreSQL 客户端 |
| `@neondatabase/serverless` | PostgreSQL | Neon Serverless 驱动 |
| `mysql2` | MySQL/MariaDB | 支持 Promise、预处理语句、流式查询 |
| `better-sqlite3` | SQLite | 同步 API，性能好，适合本地/桌面 |
| `sqlite3` | SQLite | 异步 SQLite 驱动 |
| `@libsql/client` | SQLite/libSQL | Turso、libSQL 客户端 |
| `sql.js` | SQLite | 编译到 WebAssembly 的 SQLite |
| `mssql` | SQL Server | SQL Server 驱动 |
| `tedious` | SQL Server | 纯 JS TDS 协议驱动 |
| `oracledb` | Oracle | Oracle 官方 Node 驱动 |

#### NoSQL、搜索与缓存

| 包/工具 | 类型 | 说明 |
| --- | --- | --- |
| `mongodb` | MongoDB | 官方驱动，控制力强 |
| `mongoose` | MongoDB | Schema、模型、校验、中间件 |
| `redis` | Redis | Redis 官方客户端，支持 RESP3 |
| `ioredis` | Redis | 功能全，支持集群、哨兵、Lua |
| `@elastic/elasticsearch` | 搜索引擎 | Elasticsearch 官方客户端 |
| `@opensearch-project/opensearch` | 搜索引擎 | OpenSearch 官方客户端 |
| `cassandra-driver` | Cassandra | Cassandra 驱动 |
| `neo4j-driver` | 图数据库 | Neo4j 官方驱动 |
| `@aws-sdk/client-dynamodb` | DynamoDB | DynamoDB 底层客户端 |
| `@aws-sdk/lib-dynamodb` | DynamoDB | 文档模型封装，写法更简单 |
| `lru-cache` | 进程内缓存 | 高性能 LRU 缓存 |
| `node-cache` | 进程内缓存 | 简单的 TTL 缓存 |
| `keyv` | 缓存抽象 | 统一多后端缓存接口 |
| `cache-manager` | 缓存管理 | Nest 等框架常用缓存抽象 |

#### ORM、查询构建器与向量库

| 包/工具 | 定位 | 说明 |
| --- | --- | --- |
| `prisma` | ORM CLI | Schema 驱动，迁移、生成客户端 |
| `@prisma/client` | ORM 客户端 | Prisma 运行时客户端 |
| `drizzle-orm` | ORM/Query Builder | SQL 风格、类型推导强、轻量 |
| `drizzle-kit` | Drizzle 工具 | 迁移生成、推送、Studio |
| `typeorm` | ORM | 装饰器风格，支持 Active Record/Data Mapper |
| `sequelize` | ORM | 老牌 ORM，支持多种数据库 |
| `@mikro-orm/core` | ORM | 类型安全，支持 Unit of Work |
| `objection` | ORM | 基于 Knex 的模型层 |
| `bookshelf` | ORM | 基于 Knex 的老牌 ORM |
| `knex` | Query Builder | SQL 查询构建器 + 迁移/种子 |
| `kysely` | Query Builder | 类型安全的 SQL 构建器 |
| `chromadb` | 向量数据库 | Chroma 客户端 |
| `@pinecone-database/pinecone` | 向量数据库 | Pinecone 客户端 |
| `@qdrant/js-client-rest` | 向量数据库 | Qdrant 客户端 |
| `weaviate-client` | 向量数据库 | Weaviate 客户端 |
| `pgvector` | 向量检索 | PostgreSQL 向量扩展客户端 |

### 30. 数据库迁移脚本

| 工具 | 适用生态 | 常用命令 | 说明 |
| --- | --- | --- | --- |
| `prisma` | Prisma + PostgreSQL/MySQL/SQLite/SQL Server/MongoDB | `prisma migrate dev`、`prisma migrate deploy`、`prisma db seed` | Schema 驱动，自动生成 SQL 迁移；开发用 dev，生产用 deploy |
| `drizzle-kit` | Drizzle ORM | `drizzle-kit generate`、`drizzle-kit migrate`、`drizzle-kit push`、`drizzle-kit studio` | 从 TS schema 生成迁移；push 适合原型，migrate 适合生产 |
| `typeorm` | TypeORM | `typeorm migration:generate`、`migration:run`、`migration:revert` | 装饰器实体生成迁移，支持 up/down |
| `sequelize-cli` | Sequelize | `db:migrate`、`db:migrate:undo`、`db:seed:all` | 经典 migrations/seeders 目录结构 |
| `knex` | Knex | `knex migrate:make`、`migrate:latest`、`migrate:rollback`、`seed:run` | SQL 查询构建器自带迁移和种子 |
| `node-pg-migrate` | PostgreSQL | `node-pg-migrate create`、`up`、`down` | 纯 SQL/JS 迁移，适合直接管理 PostgreSQL |
| `umzug` | ORM 无关 | 编程式调用 `up`、`down`、`pending` | 通用迁移执行器，Sequelize 底层也用它 |
| `db-migrate` | 多数据库 | `db-migrate up`、`db-migrate down`、`db-migrate create` | 支持多种数据库驱动 |
| `graphile-migrate` | PostgreSQL | `graphile-migrate migrate`、`commit`、`watch` | 基于 SQL 文件的幂等迁移 |
| `postgrator` | PostgreSQL/MySQL/SQL Server | `postgrator`、`postgrator up` | 按版本号执行 SQL 迁移 |
| `@faker-js/faker` | 种子数据 | 在 seed 脚本中生成假数据 | 只负责造数据，不负责建表 |
| `atlas` | 多数据库 | `atlas migrate diff`、`atlas migrate apply` | 独立 CLI，不是 npm 包；Schema as Code，适合团队审计 |
| `flyway` | 多数据库 | `flyway migrate`、`flyway info` | JVM 工具，不是 npm 包；企业项目常见 |
| `liquibase` | 多数据库 | `liquibase update`、`liquibase rollback` | JVM 工具，不是 npm 包；XML/YAML/SQL changelog |
| `dbmate` | 多数据库 | `dbmate new`、`dbmate up`、`dbmate rollback` | Go 单文件工具，不是 npm 包；轻量好用 |

**迁移方案怎么选**

| 场景 | 推荐 | 原因 |
| --- | --- | --- |
| 新项目，TS 全栈，想少写 SQL | Prisma Migrate 或 Drizzle Kit | Schema 即代码，类型和迁移联动 |
| 已有大量手写 SQL | `node-pg-migrate`、`graphile-migrate`、`dbmate` | SQL 可控，审查直接 |
| 使用 Knex/Sequelize/TypeORM | 对应内置迁移 | 与 ORM 生命周期一致，少引入工具 |
| 多服务、多语言、需要审计 | Atlas、Flyway、Liquibase | 独立于应用，适合 CI/CD 和合规 |
| 只是本地快速试表结构 | `drizzle-kit push` 或 `prisma db push` | 不生成迁移文件，改完即生效，禁止用于生产 |

> 生产环境遵循一个原则：**迁移文件只增不改**。已经上线的迁移脚本不要再修改，否则不同环境的迁移历史会分叉。

### 31. 鉴权与安全

| 包/工具 | 定位 | 说明 |
| --- | --- | --- |
| `jsonwebtoken` | JWT | 签发和校验 JWT，Node 生态经典 |
| `jose` | JWT/JWE/JWK | Web 标准实现，支持边缘运行时 |
| `bcryptjs` | 密码哈希 | 纯 JS，安装无编译依赖 |
| `bcrypt` | 密码哈希 | 原生实现，性能好 |
| `argon2` | 密码哈希 | Argon2 原生绑定 |
| `@node-rs/argon2` | 密码哈希 | Rust 实现，安装和性能更友好 |
| `passport` | 认证框架 | 策略化认证，生态插件多 |
| `passport-jwt` | Passport 策略 | JWT 认证策略 |
| `passport-local` | Passport 策略 | 用户名密码认证 |
| `passport-google-oauth20` | Passport 策略 | Google OAuth 登录 |
| `openid-client` | OIDC | OpenID Connect 客户端 |
| `oauth4webapi` | OAuth/OIDC | 轻量、标准的 OAuth 客户端 |
| `better-auth` | 认证方案 | TS 优先，支持多种登录方式和适配器 |
| `next-auth` | Next.js 认证 | Next.js 常用认证方案 |
| `@auth/core` | 认证核心 | Auth.js 的框架无关核心 |
| `helmet` | 安全响应头 | 设置 CSP、HSTS 等响应头 |
| `cors` | 跨域 | 配置 CORS 响应头 |
| `express-rate-limit` | 限流 | Express 请求限流 |
| `rate-limiter-flexible` | 限流 | 支持 Redis 等多后端的限流 |
| `csrf-csrf` | CSRF 防护 | 现代 CSRF token 方案 |
| `cookie-parser` | Cookie 解析 | 解析请求 Cookie |
| `express-session` | Session | Express 会话中间件 |
| `connect-redis` | Session 存储 | 把 Session 存到 Redis |
| `dompurify` | XSS 防护 | 清理不可信 HTML |
| `validator` | 输入校验 | 常用字符串格式校验 |

### 32. 日志、监控与追踪

| 包/工具 | 定位 | 说明 |
| --- | --- | --- |
| `pino` | 日志 | 结构化 JSON 日志，性能好 |
| `pino-pretty` | 日志美化 | 开发环境格式化输出 |
| `pino-http` | HTTP 日志 | 记录请求耗时和上下文 |
| `winston` | 日志 | 传输器丰富，配置灵活 |
| `winston-daily-rotate-file` | 日志轮转 | 按天/大小切割日志 |
| `log4js` | 日志 | 老牌日志库，支持分级和落盘 |
| `morgan` | HTTP 日志 | Express 请求日志中间件 |
| `consola` | 日志 | 适合 CLI 和开发工具 |
| `debug` | 调试日志 | 按命名空间开启调试输出 |
| `signale` | 日志 | 终端日志样式丰富 |
| `@sentry/node` | 错误监控 | Node 端异常和性能监控 |
| `@sentry/browser` | 错误监控 | 浏览器端异常监控 |
| `@sentry/react` | 错误监控 | React 错误边界和监控 |
| `@sentry/vue` | 错误监控 | Vue 错误监控 |
| `@sentry/nextjs` | 错误监控 | Next.js 一体化接入 |
| `prom-client` | 指标 | 暴露 Prometheus 指标 |
| `@opentelemetry/sdk-node` | 链路追踪 | OpenTelemetry Node SDK |
| `@opentelemetry/auto-instrumentations-node` | 自动埋点 | 自动埋点常见库 |
| `@opentelemetry/exporter-trace-otlp-http` | 链路导出 | OTLP HTTP 导出 |
| `dd-trace` | APM | Datadog 链路追踪 |
| `newrelic` | APM | New Relic Node Agent |
| `elastic-apm-node` | APM | Elastic APM Node Agent |

### 33. 定时任务、队列与消息

| 包/工具 | 定位 | 说明 |
| --- | --- | --- |
| `node-cron` | 定时任务 | cron 表达式，进程内调度 |
| `cron` | 定时任务 | 功能更全的 cron 调度 |
| `croner` | 定时任务 | 轻量、TS 友好 |
| `later` | 定时任务 | 复杂时间规则调度 |
| `toad-scheduler` | 定时任务 | 轻量、可测试的调度器 |
| `bree` | 定时任务 | 基于 Worker 的 job 调度 |
| `agenda` | 定时任务 | MongoDB 持久化任务 |
| `bullmq` | 任务队列 | Redis 队列，支持重试、延迟、并发 |
| `bull` | 任务队列 | BullMQ 的前身，存量项目常见 |
| `bee-queue` | 任务队列 | 轻量 Redis 队列 |
| `@nestjs/bullmq` | Nest 队列 | BullMQ 的 Nest 集成 |
| `@nestjs/schedule` | Nest 定时任务 | 装饰器式 cron/interval |
| `amqplib` | RabbitMQ | AMQP 客户端 |
| `kafkajs` | Kafka | Kafka 客户端 |
| `mqtt` | MQTT | MQTT 客户端 |
| `nats` | NATS | NATS 客户端 |
| `@google-cloud/pubsub` | Pub/Sub | GCP 消息服务 |
| `@aws-sdk/client-sqs` | SQS | AWS 队列服务 |

### 34. 文件上传、对象存储与邮件

| 包/工具 | 定位 | 说明 |
| --- | --- | --- |
| `multer` | 文件上传 | Express 文件上传中间件 |
| `formidable` | 文件上传 | 解析 multipart 表单 |
| `busboy` | 文件上传 | 底层流式 multipart 解析 |
| `@fastify/multipart` | 文件上传 | Fastify 文件上传插件 |
| `@aws-sdk/client-s3` | 对象存储 | S3 及兼容服务客户端 |
| `@aws-sdk/s3-request-presigner` | 对象存储 | 生成预签名上传/下载 URL |
| `minio` | 对象存储 | MinIO 客户端 |
| `ali-oss` | 对象存储 | 阿里云 OSS 客户端 |
| `cos-nodejs-sdk-v5` | 对象存储 | 腾讯云 COS 客户端 |
| `@google-cloud/storage` | 对象存储 | GCS 客户端 |
| `@azure/storage-blob` | 对象存储 | Azure Blob 客户端 |
| `nodemailer` | 邮件发送 | SMTP 邮件发送 |
| `mjml` | 邮件模板 | 响应式邮件 HTML |
| `@react-email/components` | 邮件模板 | 用 React 写邮件 |
| `handlebars` | 模板引擎 | 邮件/页面模板渲染 |
| `sharp` | 图片处理 | 服务端图片缩放、裁剪、转码 |
| `pdfkit` | PDF 生成 | 服务端生成 PDF |
| `exceljs` | Excel 处理 | 服务端读写 Excel |
| `archiver` | 压缩 | 服务端流式打包 zip/tar |

### 35. API 文档与接口契约

| 包/工具 | 定位 | 说明 |
| --- | --- | --- |
| `swagger-ui-express` | Swagger UI | 在 Express 中展示 OpenAPI 文档 |
| `swagger-jsdoc` | 文档生成 | 从 JSDoc 注释生成 OpenAPI |
| `@nestjs/swagger` | Nest 文档 | 装饰器生成 Swagger |
| `@fastify/swagger` | Fastify 文档 | 生成 OpenAPI schema |
| `@fastify/swagger-ui` | Fastify 文档 UI | 展示 Swagger UI |
| `openapi-typescript` | 类型生成 | 从 OpenAPI 生成 TS 类型 |
| `orval` | 客户端生成 | 从 OpenAPI 生成请求客户端和类型 |
| `@asteasolutions/zod-to-openapi` | Schema 转换 | 把 Zod schema 转成 OpenAPI |
| `redoc` | 文档渲染 | 三栏式 API 文档 |
| `@redocly/cli` | 文档工具 | 校验、预览、打包 OpenAPI |
| `graphql` | GraphQL | GraphQL 参考实现 |
| `@apollo/server` | GraphQL 服务 | Apollo Server 4 |
| `graphql-yoga` | GraphQL 服务 | 轻量 GraphQL 服务 |
| `mercurius` | GraphQL 服务 | Fastify 的 GraphQL 适配 |
| `@graphql-codegen/cli` | 代码生成 | 从 schema 生成类型和 hooks |
| `@trpc/server` | RPC 服务 | tRPC 服务端 |
| `@trpc/client` | RPC 客户端 | tRPC 客户端 |
| `@trpc/react-query` | RPC + React Query | tRPC 的 React Query 集成 |
| `@grpc/grpc-js` | gRPC | 纯 JS gRPC 实现 |
| `@grpc/proto-loader` | gRPC | 加载 proto 文件 |
| `protobufjs` | Protobuf | Protocol Buffers 编解码 |
| `ws` | WebSocket | 轻量 WebSocket 服务 |
| `socket.io` | 实时通信 | 房间、广播、自动重连 |
| `@fastify/websocket` | WebSocket | Fastify WebSocket 插件 |

### 36. 环境变量、配置与 CLI

| 包/工具 | 定位 | 说明 |
| --- | --- | --- |
| `dotenv` | 环境变量 | 从 `.env` 加载变量 |
| `dotenv-expand` | 变量展开 | 支持 `${VAR}` 引用 |
| `dotenv-cli` | 环境变量 CLI | 用指定 `.env` 执行命令 |
| `cross-env` | 跨平台变量 | Windows/macOS/Linux 统一设置环境变量 |
| `cosmiconfig` | 配置查找 | 按约定查找配置文件 |
| `convict` | 配置校验 | Schema 化配置和环境变量 |
| `rc` | 配置加载 | 读取 `.rc` 配置文件 |
| `envalid` | 环境变量校验 | 启动时校验环境变量 |
| `@t3-oss/env-core` | 环境变量校验 | Zod 驱动的类型安全 env |
| `@t3-oss/env-nextjs` | Next env | Next.js 专用环境变量校验 |
| `commander` | CLI 框架 | 命令、参数、子命令 |
| `yargs` | CLI 框架 | 参数解析和帮助信息 |
| `cac` | CLI 框架 | 轻量、API 简洁 |
| `meow` | CLI 框架 | 基于 yargs 的轻量封装 |
| `sade` | CLI 框架 | 极简 CLI 工具 |
| `ora` | 终端加载 | spinner 进度提示 |
| `chalk` | 终端颜色 | 终端彩色输出 |
| `picocolors` | 终端颜色 | 更轻量的颜色库 |
| `kleur` | 终端颜色 | 极轻量颜色库 |
| `prompts` | 交互式问答 | 轻量交互提示 |
| `inquirer` | 交互式问答 | 功能全的交互式 CLI |
| `enquirer` | 交互式问答 | 可定制提示 |
| `execa` | 子进程 | Promise 化的 child_process |
| `zx` | 脚本工具 | 用 JS 写 shell 脚本 |
| `shelljs` | Shell 命令 | 跨平台 shell 命令封装 |
| `fs-extra` | 文件操作 | 增强 fs，Promise API |
| `globby` | 文件匹配 | 支持 glob 和忽略规则 |
| `fast-glob` | 文件匹配 | 高性能 glob |
| `chokidar` | 文件监听 | 跨平台 watch |
| `rimraf` | 删除目录 | 跨平台递归删除 |
| `listr2` | 任务列表 | 终端任务进度展示 |
| `plop` | 代码生成 | 交互式生成模板文件 |
| `hygen` | 代码生成 | 基于模板的代码生成器 |

### 37. 进程管理、部署与文档

| 包/工具 | 定位 | 说明 |
| --- | --- | --- |
| `pm2` | 进程管理 | 守护进程、集群、日志、开机自启 |
| `nodemon` | 开发重启 | 文件变化自动重启 Node |
| `serve` | 静态预览 | 预览构建产物 |
| `http-server` | 静态服务 | 零配置 HTTP 服务 |
| `sirv` | 静态服务 | 轻量、快速的静态文件服务 |
| `vercel` | 部署 | Vercel CLI，支持 Serverless |
| `netlify-cli` | 部署 | Netlify 站点和函数部署 |
| `wrangler` | 部署 | Cloudflare Workers/Pages |
| `firebase-tools` | 部署 | Firebase Hosting/Functions |
| `@railway/cli` | 部署 | Railway 部署 |
| `surge` | 静态部署 | 快速发布静态站点 |
| `gh-pages` | GitHub Pages | 把构建产物发布到 gh-pages |
| `dockerode` | 容器管理 | Node 调用 Docker API |
| `vitepress` | 文档站 | Vue 驱动的静态文档 |
| `@docusaurus/core` | 文档站 | React 驱动的文档站 |
| `storybook` | 组件文档 | 组件开发与展示 |
| `typedoc` | API 文档 | 从 TS 注释生成文档 |
| `jsdoc` | API 文档 | 从 JS 注释生成文档 |
| `docsify` | 文档站 | 运行时渲染 Markdown |
| `slidev` | 演示文稿 | 用 Markdown 写幻灯片 |
| `nextra` | 文档站 | Next.js 文档主题 |
| `@astrojs/starlight` | 文档站 | Astro 文档主题 |

## 四、选型组合与检查清单

### 38. 常见场景推荐组合

| 场景 | 推荐组合 | 说明 |
| --- | --- | --- |
| Vue 3 中后台 | Vite + Vue Router + Pinia + Element Plus/Naive UI + VueUse + Axios + Vitest + Playwright | 国内资料多，组件覆盖全 |
| React 中后台 | Vite + React Router + Zustand + TanStack Query + Ant Design/MUI + Tailwind + React Hook Form + Zod + Vitest | 生态最大，按团队熟悉度选 UI 库 |
| 官网/内容站 | VitePress、Astro、Next、Nuxt + Tailwind/UnoCSS | 内容为主时优先静态生成 |
| SSR 应用 | Next/Nuxt + TanStack Query + Zod + Prisma/Drizzle | 注意服务端和客户端状态边界 |
| Node API | Fastify/NestJS + Prisma/Drizzle + PostgreSQL + Zod + Pino + BullMQ + Vitest + PM2 | 结构化选 Nest，轻量高性能选 Fastify |
| 实时应用 | Socket.IO/ws + Redis + BullMQ | Redis 做多实例广播和队列 |
| 类库/组件库 | tsdown/tsup + Vitest + publint + size-limit + Changesets | 类型、体积、发布三件事都要管 |
| CLI 工具 | cac/commander + tsdown/tsup + execa + ora + picocolors | 交互和打包分开选 |
| 桌面应用 | Electron + electron-vite 或 Tauri | Electron 生态成熟，Tauri 体积小 |
| 移动端/H5 | Vue + Vant 或 React + antd-mobile | 组件库按端选择 |
| 文档站 | VitePress + Mermaid + 搜索插件 | 轻量、Markdown 友好 |

### 39. 选包检查清单

| 检查项 | 怎么查 | 关注点 |
| --- | --- | --- |
| 维护状态 | `npm view <pkg> time.modified`、GitHub 最近提交 | 半年以上无更新要谨慎 |
| 版本与兼容 | `npm view <pkg> peerDependencies`、README | 是否支持当前框架/Node 版本 |
| 类型支持 | `npm view <pkg> types`、包内 `.d.ts` | 是否有官方类型，还是需要 `@types/*` |
| 模块格式 | `package.json` 的 `exports`、`main`、`module` | ESM/CJS 是否都能用，是否有子路径导出 |
| 包体积 | bundlephobia、`size-limit` | 是否为了小功能引入大包 |
| 依赖数量 | `npm ls <pkg>`、`npm why <pkg>` | 是否引入大量传递依赖 |
| 安全 | `npm audit`、Snyk、Socket | 是否有已知漏洞和可疑安装脚本 |
| License | 包内 LICENSE、npm 页面 | MIT 之外要确认商用限制 |
| 可替代性 | 对比同类包、抽象接口 | 是否容易被替换，是否值得深度绑定 |
| 社区活跃度 | issues、PR、下载量 | 下载量高不等于维护积极 |

### 40. 常用排查命令

| 命令 | 用途 |
| --- | --- |
| `npm view <pkg> version time.modified` | 查看最新版本和最近发布时间 |
| `npm view <pkg> peerDependencies` | 查看 peer 依赖要求 |
| `npm outdated` | 查看可升级依赖 |
| `npm ls <pkg>` | 查看依赖安装位置和版本 |
| `npm why <pkg>` | 查看某个包被谁引入 |
| `pnpm why <pkg>` | pnpm 下查看依赖来源 |
| `npm audit` | 检查已知安全漏洞 |
| `npm-check-updates` | 批量检查依赖更新 |
| `depcheck` | 找出未使用/缺失依赖 |
| `knip` | 找出未使用文件、导出和依赖 |
| `publint` | 检查包发布配置 |
| `size-limit` | 检查产物体积 |

### 最后几条经验

1. **优先用运行时内置能力**：Node 18+ 的 `fetch`、`node:test`、`AbortSignal.timeout`，浏览器原生的 `structuredClone`、`crypto.randomUUID`，能少装一个包就少装一个。
2. **区分 `dependencies` 和 `devDependencies`**：构建工具、Lint、测试框架放 dev，运行时真正 import 的才放 dependencies。
3. **插件类包注意 peerDependencies**：Vite 插件、ESLint 插件、UI 库通常要求宿主版本匹配，升级时要一起看。
4. **锁定版本和 lockfile**：CI 用 `npm ci`、`pnpm install --frozen-lockfile`，避免“本地能跑，线上装到另一个版本”。
5. **迁移脚本只增不改**：数据库迁移一旦上线就视为不可变历史，修正用新的迁移文件。
6. **不要同时引入功能重叠的包**：比如项目里同时有 `dayjs` 和 `moment`、`axios` 和 `ky`、`lodash` 和 `lodash-es`，先统一再优化。
