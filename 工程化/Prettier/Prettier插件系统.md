
# Prettier插件系统

在 Prettier 中编写插件时，插件 **输出的是一个对象**，这个对象结构决定了 Prettier 如何使用你的插件。下面我将详细描述这个对象的各个属性和它们的作用。

---

## 🔧 Prettier 插件导出对象结构详解

```js
module.exports = {
  languages,     // 声明支持的语言类型（如 JS, CSS, Markdown）
  parsers,       // 提供语法解析器，将源代码转换为 AST
  printers,      // 提供打印器，将 AST 转换为字符串
  options,       // 自定义 Prettier 配置项（非必选）
  defaultOptions // 设置插件默认选项值（非必选）
};
```

---

### 1. `languages`：语言支持声明

这是一个数组，告诉 Prettier 插件支持哪些语言（如 JavaScript、TypeScript、Markdown）。

#### 示例：

```js
languages: [
  {
    name: "JavaScript",
    parsers: ["babel"],   // 对应 parsers 中的 key
    extensions: [".js"],  // 哪些扩展名会被使用这个 parser 处理
    linguistLanguageId: 183, // 可选，用于 GitHub 语言高亮
  }
]
```

---

### 2. `parsers`：语法解析器定义（核心）

负责将代码（字符串）解析为 AST（抽象语法树）。

#### 格式：

```
parsers: {
  [parserName]: {
    parse: (text, parsers, options) => AST, // 必须，实现解析逻辑
    astFormat: "your-ast-format-name",      // AST 类型标识（供 printer 使用）
    locStart: (node) => number,             // 获取 node 起始位置（用于 range 格式化）
    locEnd: (node) => number                // 获取 node 结束位置
  }
}
```

#### 常见场景：

* 通常我们会基于 Prettier 官方的 parser 扩展，比如 `parser-babel`，然后在 `parse()` 中对 AST 做处理。

---

### 3. `printers`：AST 转代码的逻辑

将 AST 转换为格式化后的代码字符串。

```
printers: {
  [astFormatName]: {
    print: (path, options, print) => string, // 必须，将 AST 转成字符串
    embed: optionalFn,                       // 可选，嵌套其他语言（如 html 内的 script）
    preprocess: optionalFn                   // 可选，对 AST 预处理（常用于转义）
  }
}
```

> **注意**：如果你只想修改 AST 而不是打印行为，可复用 Prettier 内置的 printer，不需要自己实现。

---

### 4. `options`：自定义格式化选项（可选）

用于定义你插件新增的 Prettier 选项，比如：

```js
options: {
  removeConsole: {
    type: "boolean",
    category: "Console Options",
    default: true,
    description: "Whether to remove console.log statements."
  }
}
```

Prettier 将自动识别这些配置项并添加到 CLI、配置文件中。

---

### 5. `defaultOptions`：默认配置值（可选）

为插件指定默认配置项（通常配合 `options` 使用）：

```js
defaultOptions: {
  removeConsole: true
}
```

---

## ✅ 示例：完整导出对象（只处理 console.log）

```js
const { parsers: babelParsers } = require("prettier/parser-babel");
const traverse = require("@babel/traverse").default;
const { types: t } = require("@babel/core");

function removeConsoleLogs(ast) {
  traverse(ast, {
    ExpressionStatement(path) {
      const expr = path.node.expression;
      if (
        t.isCallExpression(expr) &&
        t.isMemberExpression(expr.callee) &&
        expr.callee.object.name === "console" &&
        expr.callee.property.name === "log"
      ) {
        path.remove();
      }
    }
  });
  return ast;
}

module.exports = {
  languages: [
    {
      name: "JavaScript",
      parsers: ["babel"],
      extensions: [".js", ".jsx"]
    }
  ],
  parsers: {
    babel: {
      ...babelParsers.babel,
      parse(text, parsers, options) {
        const ast = babelParsers.babel.parse(text, parsers, options);
        return removeConsoleLogs(ast);
      },
      astFormat: "estree", // 复用 Prettier 内置的打印器
      locStart: babelParsers.babel.locStart,
      locEnd: babelParsers.babel.locEnd
    }
  }
};
```

---

## 🔍 总结（各字段作用速查表）

| 属性名              | 类型       | 作用说明            |
|------------------|----------|-----------------|
| `languages`      | `Array`  | 声明支持的语言类型与文件扩展名 |
| `parsers`        | `Object` | 将源代码字符串解析成 AST  |
| `printers`       | `Object` | 将 AST 转回代码字符串   |
| `options`        | `Object` | 定义插件可配置项        |
| `defaultOptions` | `Object` | 插件配置项的默认值       |

---

如需帮助你实现一个完整的插件结构并发布到 npm，我也可以提供项目模板。需要的话请说一声。
