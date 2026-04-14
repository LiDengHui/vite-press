# package.json中的sideEffects属性的作用

在 `package.json` 文件中，`sideEffects` 字段用于**优化 Tree Shaking（树摇）** 过程，帮助打包工具（如 Webpack、Rollup）更高效地移除未使用的代码（Dead Code Elimination）。它的核心作用是**标记模块是否具有“副作用”**。

---

### 什么是“副作用”？
在 JavaScript 中，“副作用”指的是：**模块在被导入（import）时会执行一些与导出无关的操作**，例如：
- 修改全局变量（`window`、`document`）
- 自动初始化（如注册 Web Components）
- 执行 `polyfill`
- 注入 CSS 样式
- 日志输出等

**纯模块（无副作用）**：仅导出内容，导入时不会执行额外操作（例如工具函数库）。

---

### `sideEffects` 的配置方式
#### 1. 标记整个包为无副作用
```json
{
  "sideEffects": false
}
```
- 含义：**包内所有文件都是“纯”的**，没有副作用。
- 打包工具会**安全移除未使用的导出**（即使从未被导入）。
- 适用于：工具库（如 Lodash、React 组件库）。

#### 2. 标记部分文件有副作用
```json
{
  "sideEffects": [
    "**/*.css",
    "src/polyfill.js"
  ]
}
```
- 含义：**只有指定文件有副作用**，其他文件都是“纯”的。
- 打包工具会**保留这些文件的副作用代码**，即使未被显式使用。
- 适用于：包含 CSS 文件、polyfill 或初始化脚本的项目。

---

### 为什么需要 `sideEffects`？
#### 场景示例
假设你的库有一个 CSS 文件：
```javascript
// src/styles.css
import './styles.css';

// src/utils.js
export const add = (a, b) => a + b;
```
如果用户只导入了 `utils.js`：
```javascript
import { add } from 'your-lib'; // 未导入 CSS
```
若未配置 `sideEffects`：
- 打包工具可能认为 `styles.css` 未被使用，将其移除 → **样式丢失**！

#### 解决方案
在 `package.json` 中标记 CSS 为副作用：
```json
{
  "sideEffects": ["**/*.css"]
}
```
此时打包工具会保留 `styles.css`，即使它未被显式导入。

---

### 关键注意事项
1. **对 CSS/Less/Sass 文件必须标记**  
   这些文件通常通过副作用生效（如 `import 'style.css'`），需显式声明。

2. **纯 ES 模块库建议设为 `false`**  
   工具库（如 Lodash-es）可声明 `"sideEffects": false`，确保 Tree Shaking 生效。

3. **CommonJS 模块通常无效**  
   Tree Shaking 主要针对 ES 模块（ESM），CommonJS 模块无法被优化。

4. **Webpack 4+ 和 Rollup 支持**  
   主流打包工具均依赖此字段优化。

---

### 示例配置
```json
{
  "name": "your-package",
  "sideEffects": [
    "**/*.css",
    "**/*.scss",
    "./src/init.js" // 初始化全局逻辑的文件
  ],
  "module": "dist/index.esm.js", // ESM 入口
  "main": "dist/index.cjs.js"    // CommonJS 入口
}
```

---

### 总结
| 场景             | 推荐配置                    | 效果                               |
|----------------|-------------------------|----------------------------------|
| 纯工具库（无副作用文件）   | `"sideEffects": false`  | 最大化 Tree Shaking，移除所有未使用代码。      |
| 包含 CSS/初始化脚本的库 | `"sideEffects": [文件列表]` | 保留副作用文件（如 CSS），同时优化其他代码。         |
| 未明确声明          | （不设置）                   | 打包工具保守处理，可能保留未使用的副作用代码，导致产物体积增大。 |

通过合理配置 `sideEffects`，能显著提升 Tree Shaking 效率，减小最终打包体积！
