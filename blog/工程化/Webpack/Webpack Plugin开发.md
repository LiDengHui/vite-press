# Webpack Plugin开发

Webpack 插件开发的核心在于理解其**插件架构（Tapable）** 和 **构建生命周期（钩子）**。下面详细解析插件属性对象、常用钩子及其阶段：


## 一、Webpack 插件基本结构

一个 Webpack 插件是一个包含 `apply(compiler)` 方法的 JavaScript 类/函数：

```javascript
class MyPlugin {
    apply(compiler) {
        // 1. 注册钩子回调
        compiler.hooks.someHook.tap('MyPlugin', (params) => {
            // 插件逻辑
        });
    }
}

module.exports = MyPlugin;
```



## 二、插件属性对象详解

### 1. `compiler` 对象

- **作用**：代表完整的 Webpack 配置环境，贯穿整个构建生命周期
- **关键属性**：
    - `options`：完整的 Webpack 配置 (`webpack.config.js`)
    - `inputFileSystem` / `outputFileSystem`：文件系统抽象（内存、磁盘）
    - `hooks`：所有生命周期钩子的集合（核心扩展点）

### 2. `compilation` 对象

- **作用**：代表单次构建过程，包含模块、依赖、资源等详细信息
- **关键属性**：
    - `modules`：所有模块（文件）的 Set 集合
    - `chunks`：代码块（Chunk）信息
    - `assets`：最终生成的资源对象 `{ filename: source }`
    - `hooks`：编译过程钩子（如模块优化、资源生成）


## 三、核心生命周期钩子详解

### 1. Compiler Hooks（全局钩子）

| 钩子名称          | 类型              | 触发时机               | 用途示例              |
|---------------|-----------------|--------------------|-------------------|
| `environment` | SyncHook        | 环境初始化后             | 设置全局变量            |
| `compile`     | SyncHook        | 开始编译前              | 修改 entry 配置       |
| `compilation` | SyncHook        | 创建 compilation 对象后 | 注册 compilation 钩子 |
| `emit`        | AsyncSeriesHook | 生成资源到输出目录**前**     | 修改最终 assets（关键！）  |
| `afterEmit`   | AsyncSeriesHook | 资源已写入磁盘            | 清理临时文件            |
| `done`        | SyncHook        | 构建完成               | 输出构建统计信息          |
| `failed`      | SyncHook        | 构建失败时              | 错误通知              |

### 2. Compilation Hooks（单次编译钩子）

| 钩子名称               | 类型              | 触发时机               | 用途示例          |
|--------------------|-----------------|--------------------|---------------|
| `buildModule`      | SyncHook        | 开始构建模块前            | 修改模块加载器       |
| `succeedModule`    | SyncHook        | 模块构建成功             | 模块分析统计        |
| `finishModules`    | SyncHook        | 所有模块构建完成           | 模块依赖分析        |
| `optimizeChunks`   | SyncBailHook    | 优化 chunks（拆分/合并）   | 自定义 chunk 策略  |
| `processAssets`    | AsyncSeriesHook | 处理 assets **最常用！** | 修改/添加资源文件     |
| `additionalAssets` | AsyncSeriesHook | 添加额外资源             | 插入 license 文件 |


## 四、关键阶段解读

1. **初始化阶段**
    - 钩子：`environment`, `afterEnvironment`
    - 操作：创建 compiler 实例，应用插件

2. **编译准备**
    - 钩子：`entryOption`, `afterPlugins`, `afterResolvers`
    - 操作：解析 entry 配置，初始化插件/解析器

3. **模块构建**
    - 钩子：`make` → `buildModule` → `succeedModule`
    - 过程：递归构建模块 AST → 依赖收集 → Loader 转换

4. **优化阶段**
    - 钩子：`optimize` → `optimizeModules` → `optimizeChunks`
    - 操作：Tree Shaking、代码压缩、拆分 Chunk

5. **资源生成**
    - 核心钩子：`processAssets`（Webpack 5+）
   ```javascript
   compiler.hooks.thisCompilation.tap('Plugin', (compilation) => {
     compilation.hooks.processAssets.tap(
       { name: 'Plugin', stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS },
       (assets) => {
         // 修改 assets 对象（添加/删除/替换文件）
         assets['new-file.txt'] = {
           source: () => 'Hello World',
           size: () => 11
         };
       }
     );
   });
   ```
    - 阶段常量（控制执行顺序）：  
      `PROCESS_ASSETS_STAGE_ADDITIONAL` → 添加额外资源  
      `PROCESS_ASSETS_STAGE_OPTIMIZE` → 优化已存在资源  
      `PROCESS_ASSETS_STAGE_REPORT` → 最终报告

6. **输出阶段**
    - 钩子：`emit`（最后修改机会）→ `afterEmit` → `done`
    - 注意：`emit` 阶段文件**未写入磁盘**，只能修改内存中的 assets


## 五、实战技巧

1. **异步钩子处理**
   ```javascript
   compiler.hooks.emit.tapAsync('Plugin', (compilation, callback) => {
     setTimeout(() => {
       // 异步操作
       callback(); // 必须调用！
     }, 1000);
   });
   ```

2. **修改已有资源**
   ```javascript
   compilation.hooks.processAssets.tap({...}, (assets) => {
     const source = assets['main.js'].source();
     assets['main.js'] = new webpack.sources.RawSource(
       '/* Banner */\n' + source
     );
   });
   ```

3. **错误处理**
   ```javascript
   compiler.hooks.failed.tap('Plugin', (error) => {
     console.error('构建失败:', error);
   });
   ```

4. **自定义钩子**（高级）
   ```javascript
   // 在插件中创建钩子
   class MyPlugin {
     apply(compiler) {
       compiler.hooks.myCustomHook = new SyncHook(['data']);
     }
   }
   // 其他插件中调用
   compiler.hooks.myCustomHook.call({ some: 'data' });
   ```


## 六、常用插件参考

1. **html-webpack-plugin**：使用 `emit` 阶段注入 HTML
2. **clean-webpack-plugin**：使用 `done` 阶段清理目录
3. **webpack-bundle-analyzer**：使用 `done` 阶段分析输出
4. **terser-webpack-plugin**：使用 `optimizeChunks` 阶段压缩代码

> **关键原则**：根据插件目标选择正确的钩子阶段。修改资源用 `processAssets`/`emit`，处理模块用编译阶段钩子，全局操作使用
> compiler 钩子。
