# AST 节点类型遍历表

[estree git](https://github.com/estree/estree)

在 JavaScript 的抽象语法树（AST）中，节点类型（`type`）定义了代码结构的分类。不同解析器（如
Acorn、Babel、Esprima）遵循 [ESTree 规范](https://github.com/estree/estree)，但可能有扩展。以下是常见类型分类及示例：

---

## 一、核心类型

| **类型**                | **描述**       | **代码示例**               |
|-----------------------|--------------|------------------------|
| `Program`             | 整个程序的根节点     | `const a = 1;`         |
| `Identifier`          | 标识符（变量名/函数名） | `const `**`a`**` = 1;` |
| `Literal`             | 字面量值         | `const a = `**`1`**`;` |
| `ExpressionStatement` | 表达式语句        | `a = 5;`               |
| `BlockStatement`      | 代码块（`{}` 包裹） | `{ console.log(a); }`  |

---

## 二、声明与作用域

| **类型**                     | **描述**                     | **代码示例**               |
|----------------------------|----------------------------|------------------------|
| `VariableDeclaration`      | 变量声明 (`var`/`let`/`const`) | `const a = 1;`         |
| `FunctionDeclaration`      | 函数声明                       | `function foo() {}`    |
| `ClassDeclaration`         | 类声明                        | `class Foo {}`         |
| `ImportDeclaration`        | ES6 导入                     | `import fs from 'fs';` |
| `ExportDefaultDeclaration` | 默认导出                       | `export default foo;`  |

---

## 三、表达式

| **类型**                    | **描述**                          | **代码示例**              |
|---------------------------|---------------------------------|-----------------------|
| `CallExpression`          | 函数调用                            | `foo()`               |
| `MemberExpression`        | 成员访问 (`obj.prop`/`obj['prop']`) | `obj.prop`            |
| `BinaryExpression`        | 二元运算 (`+`, `>`, `===` 等)        | `a + b`               |
| `UnaryExpression`         | 一元运算 (`!`, `-`, `typeof`)       | `!true`               |
| `ArrowFunctionExpression` | 箭头函数                            | `() => {}`            |
| `TemplateLiteral`         | 模板字符串                           | `` `Hello ${name}` `` |
| `LogicalExpression`       | 逻辑运算 (`&&`/`                    |                       |`)        | `a && b`                 |

---

## 四、控制流

| **类型**            | **描述**        | **代码示例**                  |
|-------------------|---------------|---------------------------|
| `IfStatement`     | `if` 语句       | `if (a) { ... }`          |
| `ForStatement`    | `for` 循环      | `for (let i=0; i<5; i++)` |
| `WhileStatement`  | `while` 循环    | `while (true) { ... }`    |
| `SwitchStatement` | `switch` 语句   | `switch (a) { ... }`      |
| `ReturnStatement` | `return` 语句   | `return a;`               |
| `ThrowStatement`  | `throw` 语句    | `throw new Error();`      |
| `TryStatement`    | `try/catch` 块 | `try { ... } catch(e) {}` |

---

## 五、其他常见类型

| **类型**                 | **描述**             | **代码示例**            |
|------------------------|--------------------|---------------------|
| `ObjectExpression`     | 对象字面量              | `{ name: 'Alice' }` |
| `ArrayExpression`      | 数组字面量              | `[1, 2, 3]`         |
| `AssignmentExpression` | 赋值操作 (`=`, `+=` 等) | `a = 10`            |
| `NewExpression`        | `new` 实例化          | `new Date()`        |
| `ThisExpression`       | `this` 关键字         | `this.name`         |
| `SpreadElement`        | 展开运算符 (`...`)      | `[...arr]`          |

---

## 六、工具与扩展

1. **查看完整类型列表**：
    - 使用 [AST Explorer](https://astexplorer.net/) 实时解析代码。
    - Babel 类型文档：[@babel/types](https://babeljs.io/docs/en/babel-types)
2. **解析器差异**：
    - Babel：支持实验性语法（如装饰器）。
    - Acorn：轻量级，符合 ESTree。
    - TypeScript 解析器：额外支持类型注解节点（如 `TSTypeAnnotation`）。

---

## 示例 AST 片段

```json5
// 代码: const sum = (a, b) => a + b;
{
    type: "Program",
    body: [
        {
            type: "VariableDeclaration",
            declarations: [
                {
                    type: "VariableDeclarator",
                    id: {
                        type: "Identifier",
                        name: "sum"
                    },
                    init: {
                        type: "ArrowFunctionExpression",
                        params: [
                            {
                                type: "Identifier",
                                name: "a"
                            },
                            {
                                type: "Identifier",
                                name: "b"
                            }
                        ],
                        body: {
                            type: "BinaryExpression",
                            operator: "+",
                            left: {
                                type: "Identifier",
                                name: "a"
                            },
                            right: {
                                type: "Identifier",
                                name: "b"
                            }
                        }
                    }
                }
            ]
        }
    ]
}
```
