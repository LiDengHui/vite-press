# ESLint插件系统

ESLint 插件系统是 ESLint 的扩展机制，用于添加自定义的 **规则（rules）**、**处理器（processors）**、**配置（configs）**、
**解析器（parser）** 和 **环境（env）** 等。插件本质上是一个包含多个属性的模块，遵循一定格式输出一个对象。

---

## ✅ 一、什么是 ESLint 插件？

* 插件是一个 **npm 模块**，通常命名为：

  ```bash
  eslint-plugin-<name>
  ```

  引用时可省略前缀，直接使用 `<name>`。

* 插件导出的是一个包含扩展功能的对象，它告诉 ESLint：

    * 提供了哪些规则
    * 提供了哪些配置 preset
    * 是否有自定义处理器
    * 是否提供了环境定义
    * 等等

---

## ✅ 二、插件对象结构和属性

一个完整的 ESLint 插件导出对象大致结构如下：

```js
module.exports = {
    rules: {...},
    configs: {...},
    processors: {...},
    environments: {...},
    // 也可以包括以下非标准字段（一些工具读取）：
    meta: {name: "my-plugin", version: "1.0.0"}
};
```

下面是各个属性的详细说明：


### 1. `rules` ✅

自定义的规则集合，键是规则名，值是规则实现对象。

```
rules: {
    "no-foo": {
        meta: { /* 元信息 */
        },
        create(context) {
            return {
                Identifier(node) {
                    if (node.name === 'foo') {
                        context.report({node, message: "'foo' is not allowed"});
                    }
                }
            }
        }
    }
}
```

* 使用时规则名称是：`<plugin>/<rule>`（如 `myplugin/no-foo`）


### 2. `configs` ✅

预定义配置集合，方便用户快速引用插件提供的一组规则、环境等。

```
configs: {
    recommended: {
        rules: {
            "myplugin/no-foo": "error"
        }
    }
}
```

* 用户可通过 `extends: ['plugin:myplugin/recommended']` 使用这些配置。


### 3. `processors` （可选）

用于对非 JS 文件进行处理（如 `.vue`, `.md`）。你可以对文本做分片，然后交由 ESLint 处理每个片段。

```
processors: {
    '.md': {
        preprocess(text, filename){
            return [extractJSFromMarkdown(text)];
        },
        postprocess(messages, filename){
            return messages[0];
        },
        supportsAutofix: true
    }
}
```


### 4. `environments`（可选）

定义新的环境，比如添加全局变量。

```
environments: {
    myenv: {
        globals: {
            myGlobal: "readonly"
        },
        parserOptions: {
            ecmaVersion: 2021
        }
    }
}
```

* 用户通过 `env: { myenv: true }` 启用。


### 5. `meta`（非标准）

不是 ESLint 要求的，但有些工具（比如文档生成工具）会使用。

```
meta: {
    name: 'eslint-plugin-myplugin',
    version: '1.0.0'
}
```


## ✅ 三、插件注册方式（用户角度）

### 安装插件

```bash
npm install eslint-plugin-myplugin --save-dev
```

### 使用插件（.eslintrc）

```json
{
    "plugins": [
        "myplugin"
    ],
    "rules": {
        "myplugin/no-foo": "error"
    },
    "extends": [
        "plugin:myplugin/recommended"
    ]
}
```


## ✅ 四、总结

| 属性名            | 类型     | 作用               |
|----------------|--------|------------------|
| `rules`        | Object | 提供自定义规则实现        |
| `configs`      | Object | 提供可扩展的预设配置       |
| `processors`   | Object | 提供对非 JS 文件的自定义处理 |
| `environments` | Object | 定义新的全局变量和环境设置    |
| `meta`         | Object | 插件元信息（非必需）       |


## 插件模版
