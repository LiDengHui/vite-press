# Webpack Loader系统

Webpack 5 的 Loader 是构建系统的核心部分，用于**转换模块的源代码**。开发一个自定义 Loader，本质上是导出一个函数，接收源代码作为输入，输出转换后的代码。

下面我们详细讲解如何开发一个 Webpack 5 的自定义 loader，并解释相关字段的作用。

---

## 🔧 一、最基本的 Loader 结构

```js
// my-loader.js
module.exports = function (source) {
    // source 是文件内容
    // 必须返回处理后的字符串或 Buffer
    return source;
};
```

Webpack 默认调用这个函数时会传入文件内容作为 `source`。

---

## 📐 二、完整 loader 的结构和可用字段

```js
module.exports = function (source, inputSourceMap, meta) {
    // this 是 loader 上下文对象，包含很多方法和属性
    const callback = this.async(); // 异步处理

    // 执行转换操作
    const result = doSomething(source);

    // 处理完成，返回结果
    callback(null, result, inputSourceMap, meta);
};
```

### 📌 参数说明

| 参数名              | 类型       | 说明                        |         |
|------------------|----------|---------------------------|---------|
| `source`         | \`string | Buffer\`                  | 原始源代码内容 |
| `inputSourceMap` | `object` | 前一个 loader 提供的 source map |         |
| `meta`           | `any`    | 前一个 loader 传递的元信息         |         |

---

## 📚 三、`this` 上的常用 API 和字段

| 属性 / 方法                                 | 类型              | 说明                                   |        |
|-----------------------------------------|-----------------|--------------------------------------|--------|
| `this.resourcePath`                     | `string`        | 当前处理文件的绝对路径                          |        |
| `this.query` / `this.getOptions()`      | `object`        | 通过 loader 配置传入的 options 参数           |        |
| `this.async()`                          | `function`      | 标记为异步 loader，返回 callback             |        |
| `this.callback(err, result, map, meta)` | `function`      | 异步返回结果                               |        |
| `this.emitError(err)`                   | `function`      | 抛出错误，会中断编译                           |        |
| `this.emitWarning(warning)`             | `function`      | 抛出警告，不中断编译                           |        |
| `this.addDependency(file)`              | `function`      | 添加依赖文件，当依赖变化时重新编译                    |        |
| `this.cacheable(flag?)`                 | `function`      | 标记是否可缓存，默认 true                      |        |
| `this.resourceQuery`                    | `string`        | 当前模块请求中的 query 参数，如 `file.js?inline` |        |
| `this.mode`                             | \`"development" | "production"\`                       | 当前构建模式 |

---

## 🧪 四、示例：一个去掉所有 `console.log` 的 loader

```js
// remove-console-loader.js
const {getOptions} = require('loader-utils'); // webpack5 用 schema-utils 更推荐

module.exports = function (source) {
    const options = getOptions(this); // 获取用户配置

    // 简单移除 console.log
    const result = source.replace(/console\.log\(.*?\);?/g, '');

    return result;
};
```

### 在 webpack 配置中使用：

```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: './loaders/remove-console-loader.js',
                    options: {
                        /* 可传入配置 */
                    }
                }
            }
        ]
    }
};
```

---

## 🧵 五、异步 Loader 示例

```js
module.exports = function (source) {
    const callback = this.async(); // 声明异步处理

    setTimeout(() => {
        const result = source.replace(/foo/g, 'bar');
        callback(null, result);
    }, 1000);
};
```

---

## 🧱 六、Loader 的类型

1. **前置 loader（pre）**
2. **普通 loader**
3. **后置 loader（post）**

通过 `enforce: 'pre'` 或 `enforce: 'post'` 来指定执行顺序。

```
{
  test: /\.js$/,
  enforce: 'pre',
  use: 'my-loader'
}
```

---

## 🔗 七、Loader 中返回 SourceMap

```js
module.exports = function (source, inputSourceMap) {
    const callback = this.async();

    const transformed = transformCode(source); // 自定义处理
    const map = generateSourceMap(transformed);

    callback(null, transformed, map);
};
```

---

## 📦 八、开发 loader 的最佳实践

* 使用 `schema-utils` 校验参数
* 明确标记是否可缓存：`this.cacheable(true)`
* 清晰抛出错误 / 警告
* 支持异步处理：`this.async()`
* 明确 source map 支持

---

当多个 Webpack **loader 串联**使用时，它们会按照如下顺序执行：

---

## 🔄 **执行顺序总览**

### 加载顺序（从右到左）：

```js
use: ['loader3', 'loader2', 'loader1']
```

Webpack 实际调用的执行顺序是：

```
loader1(source) → loader2(transformed1) → loader3(transformed2)
```

> 🚨 实际执行是：**最后一个 loader（最右边）最先执行**。

---

## 📊 Loader 执行流程图（示意图）

```plaintext
原始资源文件（如 index.js）
    │
    ▼
 ┌──────────┐
 │ loader1 │  <==== 最后执行（靠近 Webpack 的入口）
 └──────────┘
    │
    ▼
 ┌──────────┐
 │ loader2 │
 └──────────┘
    │
    ▼
 ┌──────────┐
 │ loader3 │  <==== 最先执行（最靠近资源文件）
 └──────────┘
    │
    ▼
 transformedCode
```

---

## 📦 示例配置（webpack.config.js）

```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    'loader3', // 最先调用
                    'loader2',
                    'loader1'  // 最后调用
                ]
            }
        ]
    }
};
```

---

## ⏱ 执行时序示意（伪代码）

假设你有这 3 个 loader：

```js
// loader3.js
module.exports = function (source) {
    console.log('loader3');
    return source + '//loader3\n';
};

// loader2.js
module.exports = function (source) {
    console.log('loader2');
    return source + '//loader2\n';
};

// loader1.js
module.exports = function (source) {
    console.log('loader1');
    return source + '//loader1\n';
};
```

构建时控制台输出为：

```
loader3
loader2
loader1
```

最终 `source` 会被组合成：

```js
原始内容
//loader3
//loader2
//loader1
```

---

## 🔧 特殊情况：`pitch` 方法

每个 loader 可以有一个 `pitch()` 方法，会在**正常 loader 执行前，从左到右执行一次**。如果 pitch 返回值了，就会**跳过后续的
normal 执行流程**。

执行顺序变成这样：

```plaintext
pitch: loader1 → pitch: loader2 → pitch: loader3
                     ↑
                     ｜ 如果 pitch2 返回了值，停止，走 loader2.normal
```

---
