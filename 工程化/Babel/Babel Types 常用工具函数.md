# Babel Types 常用工具函数

Babel Types 是 Babel 工具链中用于操作 AST（抽象语法树）的核心工具库，主要用于创建、检查和修改 AST 节点。以下是一些常用工具函数及其说明：


## **1. 节点类型检查（`isXxx`）**
用于判断节点类型：
```javascript
t.isIdentifier(node);         // 检查是否为标识符
t.isCallExpression(node);     // 检查是否为函数调用
t.isLiteral(node);            // 检查是否为字面量（字符串、数字等）
t.isFunctionDeclaration(node);// 检查是否为函数声明
t.isBinaryExpression(node);   // 检查是否为二元表达式（如 a + b）
```


## **2. 创建节点（`t.xxx()`）**
用于创建 AST 节点：
```javascript
// 创建标识符
const id = t.identifier("myVar");

// 创建字符串字面量
const str = t.stringLiteral("hello");

// 创建函数调用
const callExpr = t.callExpression(
  t.identifier("console.log"), 
  [t.stringLiteral("world")]
);

// 创建变量声明
const varDecl = t.variableDeclaration("const", [
  t.variableDeclarator(id, t.numericLiteral(42))
]);
```


## **3. 节点属性访问**
检查或提取节点属性：
```javascript
t.isLiteral(node) && node.value;   // 获取字面量的值
t.isIdentifier(node) && node.name; // 获取标识符名称
```


## **4. 工具函数**
### **克隆节点**
```javascript
const clonedNode = t.cloneNode(originalNode); // 浅拷贝
const deepClonedNode = t.cloneDeep(originalNode); // 深拷贝
```

### **检查节点等效性**
```javascript
t.isNodesEquivalent(nodeA, nodeB); // 检查两个节点结构是否相同
```

### **断言节点类型**
```javascript
t.assertIdentifier(node); // 如果非 Identifier，抛出错误
```


## **5. 模板工具**
快速生成复杂节点：
```javascript
// 生成表达式语句：`console.log("test")`
const ast = t.template.ast(`console.log("test")`);

// 生成表达式节点
const expr = t.template.expression.ast(`a + b`);
```


## **6. 常见操作示例**
### **替换标识符**
```javascript
path.replaceWith(t.identifier("newName")); // 将当前节点替换为新标识符
```

###**创建二元表达式**
```javascript
const sum = t.binaryExpression("+", t.identifier("a"), t.identifier("b"));
// 等价于 AST 节点：a + b
```

###**生成函数声明**
```javascript
const func = t.functionDeclaration(
  t.identifier("sum"),
  [t.identifier("a"), t.identifier("b")],
  t.blockStatement([
    t.returnStatement(
      t.binaryExpression("+", t.identifier("a"), t.identifier("b"))
    )
  ])
);
// 生成：function sum(a, b) { return a + b; }
```



##**7. 实际应用场景**
在 Babel 插件中，这些函数通常结合 `@babel/core` 的 `traverse` 使用：
```javascript
const { traverse } = require("@babel/core");

traverse(ast, {
  Identifier(path) {
    if (path.node.name === "oldName") {
      path.replaceWith(t.identifier("newName")); // 替换标识符
    }
  },
  Literal(path) {
    if (t.isStringLiteral(path.node)) {
      console.log("Found string:", path.node.value);
    }
  }
});
```


##**关键文档参考**
- 完整节点类型列表：[Babel Types 文档](https://babeljs.io/docs/en/babel-types)
- AST 节点规范：[AST Explorer](https://astexplorer.net/)（实时查看代码的 AST 结构）

通过组合这些函数，可以精确地操作 AST 实现代码转换、语法分析等高级功能。
