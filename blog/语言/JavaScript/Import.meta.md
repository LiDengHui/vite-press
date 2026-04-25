# import.meta 的属性

`import.meta` 是 ES Modules 的一个元数据对象，用于提供当前模块的上下文信息。它不是一个全局对象，而是每个模块作用域内独立存在的对象。

在 Node.js 中，`import.meta` 主要包含以下属性：

## ✅ 1. `import.meta.url`

- **类型**：`string`
- **含义**：当前模块的完整 `file://` 形式的 URL。
- **用途**：可用于获取当前文件路径，替代 CommonJS 中的 `__filename`。

```js
console.log(import.meta.url);
// 输出: file:///Users/xxx/project/module.mjs
```

## ✅ 2. 自定义属性（通过 bundler 或 loader 插入）

某些构建工具（如 **Vite、Rollup、Webpack5+**）会注入额外的 `import.meta` 属性。例如：

### Vite 示例：

```js
import.meta.env; // 包含环境变量，如 import.meta.env.MODE
```

### Webpack 示例（需要配置 `experiments.outputModule: true`）：

```js
import.meta.webpack; // true if the module is bundled by Webpack
```

## ✅ 3. 在浏览器中（仅支持 ES Module）

浏览器支持标准的 `import.meta.url`，但也可用于传递上下文信息。某些 polyfill 或工具也会注入额外字段。

---

## 🚫 `import.meta` 不支持的内容（在标准环境中）：

- `import.meta` **不是可扩展对象**，你不能随意添加属性（在严格模式下）。
- 不支持像 `__dirname`、`__filename` 这样的 CommonJS 属性。

## 🌟 补充：如何使用 `import.meta.url` 获取 `__dirname` 和 `__filename`（如前所示）

```js
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
```

## 🔧 小技巧：在构建工具中调试 `import.meta`

如果你不确定有哪些字段：

```js
console.log(import.meta);
```

有时你会看到：

```json
{
    "url": "file:///xxx/module.mjs"
}
```

在 Vite 项目中：

```json
{
    "url": "...",
    "env": {
        "BASE_URL": "/",
        "MODE": "development",
        "DEV": true,
        "PROD": false
    }
}
```

需要我列出某个特定工具（如 Vite/Webpack）中 `import.meta` 的可用字段吗？
