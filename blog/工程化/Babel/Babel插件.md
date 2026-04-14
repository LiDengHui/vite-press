# Babel插件系统

Babel 是一个 JavaScript 编译器，它的插件系统是 Babel 的核心之一，可以让你定制 JavaScript 的编译过程。理解 Babel 插件系统的本质就是理解它是如何把源码的 AST 进行\*\*转换（transform）\*\*的。

---

## 🌱 Babel 插件系统概述

Babel 插件其实就是一个 **函数**，返回一个包含 **`visitor`** 对象的对象，这个对象定义了如何访问（和转换）抽象语法树（AST）中的不同节点。

---

## 📦 Babel 插件结构

### 1. 最基础的结构如下：

```js
module.exports = function myBabelPlugin(babel) {
  return {
    visitor: {
      Identifier(path) {
        console.log(path.node.name);
      }
    }
  };
};
```

* `babel`: 是 Babel 提供的工具对象，通常从中解构 `types` (`babel.types`)，用于生成和判断 AST 节点。
* `visitor`: 是一个对象，定义了每个节点类型（如 `Identifier`, `FunctionDeclaration`）的处理函数。

---

### 2. 插件对象支持的属性

| 属性名                 | 类型       | 说明                     |
|---------------------|----------|------------------------|
| `visitor`           | Object   | 必填。定义 AST 节点类型对应的处理方法。 |
| `name`              | string   | 插件名（推荐）。便于调试和错误提示。     |
| `pre`               | Function | 在插件运行前调用，初始化状态等。       |
| `post`              | Function | 所有节点访问完毕后调用，清理资源等。     |
| `manipulateOptions` | Function | 用于操作 Babel 配置选项。       |

---

## 🧠 Babel 插件运行原理

1. Babel 首先将代码解析成 AST（抽象语法树）；
2. 然后调用插件，依次执行插件中的 `visitor`；
3. 每个 `visitor` 方法接收到的是 `path`，它包含了当前 AST 节点和上下文操作；
4. 插件可以读取、替换、插入节点，控制代码的最终输出。

---

## 👣 AST Visitor 模式

Babel 使用的是**访问者模式（Visitor Pattern）**：

```
visitor: {
  FunctionDeclaration(path) {
    console.log('函数名是：', path.node.id.name);
    path.remove(); // 删除函数声明
  }
}
```

你也可以使用 `enter` / `exit` 钩子来在进入或离开某个节点时做事情：

```
visitor: {
  Identifier: {
    enter(path) {
      console.log('进入标识符', path.node.name);
    },
    exit(path) {
      console.log('离开标识符', path.node.name);
    }
  }
}
```

---

## 🔧 使用 `babel.types` 工具

Babel 的 `types`（简称 `t`） 提供了构造、判断、修改 AST 的方法。

```
const { types: t } = babel;

visitor: {
  BinaryExpression(path) {
    if (t.isIdentifier(path.node.left, { name: "a" })) {
      path.node.left = t.identifier("b");
    }
  }
}
```

---

## 🛠 示例：把所有 `var` 替换为 `let`

```js
module.exports = function (babel) {
  const { types: t } = babel;

  return {
    name: "transform-var-to-let",
    visitor: {
      VariableDeclaration(path) {
        if (path.node.kind === "var") {
          path.node.kind = "let";
        }
      }
    }
  };
};
```

---

## 🧩 插件类型

Babel 插件可以分为几类：

| 类型              | 示例                                      | 说明        |
|-----------------|-----------------------------------------|-----------|
| 转换插件（Transform） | @babel/plugin-transform-arrow-functions | 转换语法、功能   |
| 语法插件（Syntax）    | @babel/plugin-syntax-dynamic-import     | 仅解析语法，不转换 |
| 宏插件（Macro）      | babel-plugin-macros                     | 处理编译期宏逻辑  |
| 开发插件（Custom）    | 你自定义的插件                                 | 只用于项目定制   |

---

## ⚙️ 配置插件

在 `.babelrc` 或 `babel.config.js` 中配置：

```js
// babel.config.js
module.exports = {
  plugins: [
    './my-plugin.js' // 相对路径或 npm 包
  ]
};
```

---

## 🧪 插件调试技巧

* 使用 [AST Explorer](https://astexplorer.net/) 观察 AST 树结构。
* 给插件加 `console.log()` 来追踪节点访问顺序。
* 熟悉 Babel 提供的 `path.replaceWith`, `path.remove`, `path.insertBefore` 等 API。

---

## 🧩 开发一个插件的推荐步骤

1. 用 AST Explorer 研究你要转换的代码结构；
2. 编写一个 Babel 插件，监听对应的节点类型；
3. 使用 Babel 的 API 替换节点；
4. 本地测试或者配合 `babel-cli` 编译测试代码。

---
