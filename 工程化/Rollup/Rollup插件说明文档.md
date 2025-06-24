# Rollup(vite)插件说明文档


## 概述

Rollup是一个现代JavaScript模块打包器，专注于ES模块打包。插件系统是Rollup的核心功能之一，允许开发者扩展Rollup的功能。本文将详细解释如何开发Rollup插件，包括各个钩子函数的作用和使用方法。

## 插件基本结构

一个Rollup插件是一个JavaScript对象，包含以下属性：

```javascript
export default function myPlugin(options = {}) {
  return {
    name: 'my-plugin', // 插件名称（必需）
    
    // 构建阶段钩子
    options(options) { /* ... */ },
    buildStart() { /* ... */ },
    
    // 模块解析钩子
    resolveId(source, importer, options) { /* ... */ },
    
    // 加载钩子
    load(id) { /* ... */ },
    
    // 转换钩子
    transform(code, id) { /* ... */ },
    
    // 输出生成钩子
    renderChunk(code, chunk, options) { /* ... */ },
    generateBundle(options, bundle, isWrite) { /* ... */ },
    
    // 构建结束钩子
    buildEnd(error) { /* ... */ },
    writeBundle(options, bundle) { /* ... */ }
  };
}
```

## 核心钩子函数详解

### 1. `name` 属性
- **作用**：插件名称，用于错误信息和警告
- **必需**：是
- **示例**：
  ```javascript
  name: 'my-rollup-plugin'
  ```

### 2. `options` 钩子
- **调用时机**：在解析Rollup配置后调用
- **作用**：替换或修改Rollup配置对象
- **参数**：
    - `options`: Rollup配置对象
- **返回值**：`null`（不做修改）或新的配置对象
- **示例**：
  ```javascript
  options(options) {
    // 修改输入选项
    return {
      ...options,
      plugins: [someOtherPlugin(), ...options.plugins]
    };
  }
  ```

### 3. `buildStart` 钩子
- **调用时机**：每次构建开始时
- **作用**：执行初始化操作
- **参数**：
    - `options`: Rollup输入选项
- **示例**：
  ```javascript
  buildStart(options) {
    console.log('构建开始，输入选项:', options);
    this.data = fetchInitialData();
  }
  ```

### 4. `resolveId` 钩子
- **调用时机**：Rollup解析模块路径时
- **作用**：自定义模块解析逻辑
- **参数**：
    - `source`: 导入的源字符串（如 './module.js'）
    - `importer`: 导入该模块的模块ID
    - `options`: 解析选项
- **返回值**：
    - `null`: 使用默认解析
    - `string`: 解析后的路径
    - `false`: 标记为外部模块
    - `{id, external}`
- **示例**：
  ```javascript
  resolveId(source, importer) {
    if (source === 'virtual-module') {
      return '\0virtual-module'; // 添加虚拟模块前缀
    }
    return null; // 使用默认解析
  }
  ```

### 5. `load` 钩子
- **调用时机**：在加载模块内容时
- **作用**：自定义模块加载逻辑
- **参数**：
    - `id`: 模块ID
- **返回值**：
    - `null`: 使用默认加载
    - `string`: 模块源代码
    - `{code, map, ast}`
- **示例**：
  ```javascript
  load(id) {
    if (id === '\0virtual-module') {
      return 'export default "虚拟模块内容"';
    }
    return null;
  }
  ```

### 6. `transform` 钩子
- **调用时机**：在加载模块后、解析前
- **作用**：转换模块源代码
- **参数**：
    - `code`: 源代码字符串
    - `id`: 模块ID
- **返回值**：
    - `null`: 不做转换
    - `string`: 转换后的代码
    - `{code, map, ast}`
- **示例**：
  ```javascript
  transform(code, id) {
    if (id.endsWith('.custom')) {
      return code.replace(/foo/g, 'bar');
    }
    return null;
  }
  ```

### 7. `renderChunk` 钩子
- **调用时机**：在生成每个chunk后
- **作用**：转换单个chunk的输出
- **参数**：
    - `code`: chunk代码
    - `chunk`: chunk元信息
    - `options`: 输出选项
- **返回值**：
    - `null`: 不做修改
    - `string`: 修改后的代码
    - `{code, map}`
- **示例**：
  ```javascript
  renderChunk(code) {
    // 移除所有console.log
    return code.replace(/console\.log\(.*?\);?/g, '');
  }
  ```

### 8. `generateBundle` 钩子
- **调用时机**：在bundle生成后、写入前
- **作用**：修改或添加输出文件
- **参数**：
    - `options`: 输出选项
    - `bundle`: 输出文件对象
    - `isWrite`: 是否写入磁盘
- **示例**：
  ```javascript
  generateBundle(options, bundle) {
    // 添加LICENSE文件
    this.emitFile({
      type: 'asset',
      fileName: 'LICENSE',
      source: 'MIT License...'
    });
  }
  ```

### 9. `buildEnd` 钩子
- **调用时机**：构建结束（成功或失败）
- **作用**：清理资源
- **参数**：
    - `error`: 构建错误对象（成功时为null）
- **示例**：
  ```javascript
  buildEnd(error) {
    if (error) {
      console.error('构建失败:', error);
    }
    // 关闭数据库连接等清理操作
  }
  ```

### 10. `writeBundle` 钩子
- **调用时机**：在bundle写入磁盘后
- **作用**：后处理操作
- **参数**：
    - `options`: 输出选项
    - `bundle`: 输出文件对象
- **示例**：
  ```javascript
  writeBundle(options, bundle) {
    // 上传到CDN
    Object.keys(bundle).forEach(fileName => {
      uploadToCDN(fileName, bundle[fileName]);
    });
  }
  ```

## 插件上下文

在钩子函数内部，`this`提供以下实用方法：

- `this.error(error: string | Error)`：抛出构建错误
- `this.warn(warning: string | RollupWarning)`：发出警告
- `this.info(info: string)`：输出信息
- `this.debug(message: string)`：输出调试信息
- `this.resolve(source: string, importer?: string)`：解析模块ID
- `this.load(id: string)`：加载模块内容
- `this.getModuleInfo(moduleId: string)`：获取模块信息
- `this.emitFile(emittedFile: EmittedFile)`：添加输出文件
- `this.addWatchFile(id: string)`：添加监听文件

## 完整插件示例：JSON压缩器

```javascript
export default function jsonMinifier() {
  return {
    name: 'json-minifier',
    
    transform(code, id) {
      // 只处理JSON文件
      if (!id.endsWith('.json')) return null;
      
      try {
        // 解析JSON并重新序列化以去除空白
        const parsed = JSON.parse(code);
        const minified = JSON.stringify(parsed);
        
        return {
          code: `export default ${minified};`,
          map: null // 没有源映射
        };
      } catch (err) {
        this.error(`JSON解析错误: ${err.message}`);
        return null;
      }
    }
  };
}
```

## 最佳实践

1. **命名规范**：使用清晰的插件名称，推荐前缀如 `rollup-plugin-`
2. **错误处理**：使用 `this.error()` 而非 `throw` 报告错误
3. **源映射**：尽可能生成和传递源映射
4. **异步支持**：返回Promise支持异步操作
5. **缓存**：利用Rollup的模块缓存提高性能
6. **文档**：为插件提供详细的使用文档
7. **测试**：编写全面的单元测试

## 调试插件

1. 使用 `--plugin` 参数：
   ```bash
   rollup -c --plugin my-plugin
   ```

2. 在插件中添加调试输出：
   ```javascript
   transform(code, id) {
     console.log(`转换模块: ${id}`);
     // ...
   }
   ```

3. 使用 `this.debug()` 方法：
   ```javascript
   this.debug(`处理文件: ${id}`);
   ```

4. 启用Rollup调试日志：
   ```bash
   DEBUG=rollup rollup -c
   ```

## 总结

Rollup插件开发主要围绕其钩子函数展开，理解每个钩子的调用时机和作用是开发高效插件的关键。通过实现不同的钩子函数，开发者可以扩展Rollup的功能，实现各种定制化需求。从模块解析到最终输出，Rollup提供了完整的构建生命周期钩子，使插件开发既灵活又强大。
