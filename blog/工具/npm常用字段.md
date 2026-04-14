# npm常用字段

在 npm 的 `package.json` 文件中，有许多字段用于定义包的元数据、依赖关系、脚本等。以下是常用字段及其作用的详细说明：

## **核心标识字段**

1. **`name`**
    - **作用**：包的唯一标识符（必填）
    - **规则**：小写字母、数字、连字符（`-`）或下划线（`_`），不能有空格
    - **示例**：`"name": "my-package"`

2. **`version`**
    - **作用**：包的当前版本（必填），遵循[语义化版本规范 (SemVer)](https://semver.org/)
    - **格式**：`主版本.次版本.修订号`（如 `1.0.0`）
    - **示例**：`"version": "1.0.0"`

## **信息描述字段**

3. **`description`**
    - **作用**：包的简短描述，用于 npm 搜索和展示
    - **示例**：`"description": "A utility library for JavaScript"`

4. **`keywords`**
    - **作用**：关键词数组，提高包在 npm 的搜索可见性
    - **示例**：`"keywords": ["utils", "tool", "javascript"]`

5. **`author`**
    - **作用**：包作者信息（字符串或对象）
    - **格式**：
      ```json
      "author": "Your Name <email@example.com> (https://your-website.com)"
      或
      "author": {
        "name": "Your Name",
        "email": "email@example.com",
        "url": "https://your-website.com"
      }
      ```

6. **`license`**
    - **作用**：软件许可证（如 `MIT`、`Apache-2.0`）
    - **示例**：`"license": "MIT"`

7. **`homepage`**
    - **作用**：项目主页 URL
    - **示例**：`"homepage": "https://github.com/username/repo"`

8. **`repository`**
    - **作用**：代码仓库地址
    - **格式**：
      ```json
      "repository": {
        "type": "git",
        "url": "https://github.com/username/repo.git"
      }
      ```

9. **`bugs`**
    - **作用**：问题反馈地址（通常是 Issues 页面）
    - **示例**：
      ```json
      "bugs": {
        "url": "https://github.com/username/repo/issues"
      }
      ```

## **入口文件字段**

10. **`main`**
    - **作用**：包的**主入口文件**（CommonJS 环境）
    - **当用户 `require('package')` 时加载的文件**
    - **示例**：`"main": "./dist/index.js"`

11. **`module`**
    - **作用**：ES Module 入口文件（现代打包工具如 Webpack/Rollup 优先使用）
    - **示例**：`"module": "./dist/index.mjs"`

12. **`browser`**
    - **作用**：浏览器环境专属入口文件（覆盖 `main`/`module`）
    - **示例**：
      ```json
      "browser": "./dist/browser.js"
      // 或针对特定文件替换
      "browser": {
        "./lib/node.js": "./lib/browser.js"
      }
      ```

13. **`types` / `typings`**
    - **作用**：TypeScript 类型声明文件入口（`.d.ts`）
    - **示例**：`"types": "./dist/index.d.ts"`

14. **`exports`** (现代替代方案)
    - **作用**：条件化导出入口，支持不同环境（Node.js、浏览器、ESM/CJS）
    - **示例**：
      ```json
      "exports": {
        ".": {
          "import": "./dist/index.mjs",  // ESM
          "require": "./dist/index.cjs", // CommonJS
          "browser": "./dist/browser.js" // 浏览器
        },
        "./features": "./dist/features.js"
      }
      ```

## **依赖管理字段**

15. **`dependencies`**
    - **作用**：生产环境依赖（用户安装包时自动安装）
    - **版本语法**：
        - `^1.2.3`：允许次版本和修订号更新（`1.x.x`）
        - `~1.2.3`：仅允许修订号更新（`1.2.x`）
        - `1.2.3`：精确版本
    - **示例**：
      ```json
      "dependencies": {
        "lodash": "^4.17.21",
        "react": "17.0.2"
      }
      ```

16. **`devDependencies`**
    - **作用**：开发环境依赖（如测试工具、构建工具）
    - **不会被安装到用户环境**
    - **示例**：
      ```json
      "devDependencies": {
        "jest": "^29.0.0",
        "webpack": "^5.0.0"
      }
      ```

17. **`peerDependencies`**
    - **作用**：声明宿主环境必须提供的依赖（常见于插件库，如 `webpack-plugin`）
    - **用户需手动安装**，否则警告（npm v7+ 自动安装）
    - **示例**：
      ```json
      "peerDependencies": {
        "react": ">=16.8.0"
      }
      ```

18. **`optionalDependencies`**
    - **作用**：可选依赖，安装失败不中断流程
    - **示例**：`"optionalDependencies": { "fsevents": "^2.0.0" }`

19. **`bundledDependencies`**
    - **作用**：发布包时需打包进 tarball 的依赖列表（数组格式）
    - **示例**：`"bundledDependencies": ["package-a", "package-b"]`

## **脚本与任务字段**

20. **`scripts`**
    - **作用**：定义可通过 `npm run` 执行的命令
    - **常用脚本**：
        - `"start"`: 启动应用（`npm start`）
        - `"test"`: 运行测试（`npm test`）
        - `"build"`: 构建生产版本
        - `"prepublish"`: 发布包前自动执行
    - **示例**：
      ```json
      "scripts": {
        "start": "node server.js",
        "test": "jest",
        "build": "webpack --mode production"
      }
      ```

## **文件与发布控制**

21. **`files`**
    - **作用**：定义发布到 npm 的文件白名单（默认包含所有文件）
    - **推荐**：明确列出需发布的文件/目录
    - **示例**：`"files": ["dist", "LICENSE", "README.md"]`

22. **`.npmignore`**
    - **作用**：排除不需要发布的文件（类似 `.gitignore`）
    - **优先级**：若未配置 `files`，则使用 `.npmignore`；若两者均无，默认包含所有文件。

23. **`private`**
    - **作用**：设为 `true` 防止包被意外发布到 npm
    - **示例**：`"private": true`

24. **`publishConfig`**
    - **作用**：发布时的覆盖配置（如指定注册表或标签）
    - **示例**：
      ```json
      "publishConfig": {
        "registry": "https://registry.your-company.com",
        "tag": "beta"
      }
      ```

## **环境约束字段**

25. **`engines`**
    - **作用**：指定 Node.js 或 npm 的版本要求
    - **示例**：
      ```json
      "engines": {
        "node": ">=14.0.0",
        "npm": "^7.0.0"
      }
      ```

26. **`os`**
    - **作用**：限制包运行的操作系统
    - **示例**：`"os": ["darwin", "linux"]`（仅 macOS 和 Linux）

27. **`cpu`**
    - **作用**：限制 CPU 架构
    - **示例**：`"cpu": ["x64", "arm64"]`

## **高级功能字段**

28. **`workspaces`** (Monorepo 支持)
    - **作用**：定义多包工作区（Yarn/npm v7+）
    - **示例**：`"workspaces": ["packages/*"]`

29. **`type`**
    - **作用**：指定 `.js` 文件的模块类型（`"module"` 或 `"commonjs"`）
    - **示例**：`"type": "module"`（使用 ES Modules）

30. **`sideEffects`**
    - **作用**：标记包是否有副作用（用于 Tree Shaking 优化）
    - **示例**：`"sideEffects": false` 或 `"sideEffects": ["./src/polyfills.js"]`

## **总结示意图**

```plaintext
package.json
├─ 标识: name, version
├─ 描述: description, keywords, author, license, homepage, repository, bugs
├─ 入口: main, module, browser, types, exports
├─ 依赖: dependencies, devDependencies, peerDependencies, ...
├─ 脚本: scripts
├─ 发布: files, .npmignore, private, publishConfig
├─ 环境: engines, os, cpu
└─ 高级: workspaces, type, sideEffects
```

正确配置这些字段能确保包的行为符合预期，并优化在 npm 生态系统中的可发现性和兼容性。
