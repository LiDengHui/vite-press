# acorn-walk 常用语法树

`acorn-walk` 是 Acorn 的一个子模块，用于**遍历和处理 JavaScript 抽象语法树（AST）**，它提供了一些工具函数，使我们可以方便地处理 AST 节点。

---

# 🌳 常用函数及其作用

## 1. `simple(node, visitors, baseVisitor?, state?)`

> 最常用的函数，用于简单遍历 AST。

### 参数说明：

* `node`：AST 根节点。
* `visitors`：一个对象，键是节点类型（如 `'VariableDeclaration'`），值是对应的回调函数。
* `baseVisitor`（可选）：自定义的基础遍历逻辑，一般用默认的即可。
* `state`（可选）：遍历过程中传递的共享状态对象。

### 示例：

```js
import { parse } from 'acorn';
import { simple } from 'acorn-walk';

const ast = parse('let x = 42');

simple(ast, {
  VariableDeclaration(node) {
    console.log('Found a variable declaration:', node);
  }
});
```

---

### 2. `ancestor(node, visitors, baseVisitor?, state?)`

> 类似 `simple`，但回调函数中可以访问**父节点数组**，适合需要知道上下文信息的场景。

### 回调签名：

```js
(node, state, ancestors)
```

### 示例：

```js
import { ancestor } from 'acorn-walk';

ancestor(ast, {
  Identifier(node, state, ancestors) {
    console.log('Identifier:', node.name);
    console.log('Ancestors:', ancestors.map(a => a.type));
  }
});
```

---

## 3. `full(node, callback, baseVisitor?, state?)`

> 对每个节点调用回调，不区分节点类型，适合做全局扫描或调试。

### 示例：

```js
import { full } from 'acorn-walk';

full(ast, (node) => {
  console.log('Node type:', node.type);
});
```

---

## 4. `fullAncestor(node, callback, baseVisitor?, state?)`

> 结合 `full` 和 `ancestor`，对每个节点都调用回调，并提供 ancestors。

### 示例：

```js
import { fullAncestor } from 'acorn-walk';

fullAncestor(ast, (node, state, ancestors) => {
  console.log('Node:', node.type);
  console.log('Ancestors:', ancestors.map(a => a.type));
});
```

---

## 5. `findNodeAt(node, start, end, test?, baseVisitor?)`

> 找出特定 `start` 和 `end` 范围内符合条件的节点。

### 示例：

```js
import { findNodeAt } from 'acorn-walk';

const result = findNodeAt(ast, 4, 5, 'Identifier');
console.log(result.node.name); // 'x'
```

---

## 6. `findNodeAround(node, pos, test?, baseVisitor?)`

> 找出在某个位置周围（包含）的符合条件的节点。

---

## 7. `findNodeAfter(node, pos, test?, baseVisitor?)`

> 找出在某个位置之后的符合条件的节点。

---

## 8. \`make({

TypeName(node, state, c) { ... }
})\`

> 构造一个自定义 base visitor，可以用于覆盖默认的遍历方式。

---

## ✅ 常见用途

* 静态代码分析（如检测 console.log）
* 构建代码转译工具（如 Babel 插件）
* 实现 Linter 规则
* 编辑器中的语法高亮或跳转功能
---
