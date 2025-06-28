# var与let的区别

在 JavaScript 中，`var` 和 `let` 都是用于声明变量，但它们之间存在几个**关键区别**，这些区别影响着变量的作用域、提升行为以及重复声明：

## 🧠 1. 作用域
* **`var`：函数作用域**
    * 在函数内部声明的变量，在整个函数内部都有效。
    * 在函数外部声明的变量，成为全局变量。
    * **不受块级作用域约束**（如 `if`, `for`, `while` 等代码块）。在块内声明的 `var` 变量会"泄漏"到包含它的函数作用域或全局作用域中。
  ```javascript
  function exampleVar() {
    if (true) {
      var x = 10; // 变量 x 的作用域是整个 exampleVar 函数
    }
    console.log(x); // 输出 10 ✅，因为 x 在 if 块外依然可见
  }
  ```

* **`let`：块级作用域**
    * 变量仅在声明它的代码块（`{}`）内有效（包括 `if`, `for`, `while`, `switch`, 以及单独的 `{}` 块）。
    * 解决了 `var` 的变量泄漏问题，使变量生命周期更精确、更可预测。
  ```javascript
  function exampleLet() {
    if (true) {
      let y = 20; // 变量 y 的作用域仅限于这个 if 块
      console.log(y); // 输出 20 ✅
    }
    console.log(y); // ❌ ReferenceError: y is not defined (y 在 if 块外不可见)
  }
  ```

## 📦 2. 变量提升
* **`var`：声明被提升，初始化不提升**
    * 变量的**声明**会被提升到其作用域（函数或全局）的顶部。
    * 变量的**初始化**（赋值）留在原地。
    * 在声明之前访问变量会得到 `undefined`。
  ```javascript
  console.log(a); // 输出 undefined ✅ (声明被提升，但值未初始化)
  var a = 5;
  console.log(a); // 输出 5 ✅
  ```

* **`let`：存在"暂时性死区"**
    * 声明也会被提升到其**块级作用域**的顶部。
    * 但在声明语句执行之前，变量处于"暂时性死区"。在 TDZ 中访问变量会导致 **`ReferenceError`**。
    * 强制你在使用前声明变量，避免意外行为。
  ```javascript
  console.log(b); // ❌ ReferenceError: Cannot access 'b' before initialization (处于 TDZ)
  let b = 10;
  console.log(b); // 输出 10 ✅
  ```

## 🔁 3. 重复声明
* **`var`：允许在相同作用域内重复声明**
    * 不会报错，后面的声明会覆盖前面的（可能导致难以追踪的错误）。
  ```javascript
  var c = 1;
  var c = 2; // ✅ 允许重复声明
  console.log(c); // 输出 2
  ```

* **`let`：不允许在相同作用域内重复声明**
    * 在同一个块级作用域内重复声明同一个变量名会导致 **`SyntaxError`**。
    * 有助于防止命名冲突和意外覆盖。
  ```javascript
  let d = 3;
  let d = 4; // ❌ SyntaxError: Identifier 'd' has already been declared
  ```

## 🧩 4. 全局作用域下的行为
* **`var`：在全局作用域声明时，会成为全局对象（浏览器中是 `window`）的属性。**
  ```javascript
  var globalVar = "I'm global";
  console.log(window.globalVar); // 在浏览器中输出 "I'm global" ✅
  ```

* **`let`：在全局作用域声明时，不会成为全局对象（`window`）的属性。**
  ```javascript
  let globalLet = "I'm also global, but not attached";
  console.log(window.globalLet); // 在浏览器中输出 undefined ✅
  ```

## 📌 总结与最佳实践

| 特性       | `var`        | `let`                  |
|----------|--------------|------------------------|
| **作用域**  | 函数作用域        | **块级作用域** ✅            |
| **提升**   | 声明提升，初始化不提升  | 提升但存在**TDZ** ✅         |
| **重复声明** | 允许 ✅         | **禁止** ✅ (SyntaxError) |
| **全局属性** | 成为`window`属性 | **不成为`window`属性** ✅    |
| **现代实践** | ⚠️ 遗留，避免使用   | ✅ 推荐用于可变量声明            |

* **优先使用 `let` (和 `const`)：** `let` 的块级作用域和禁止重复声明特性显著提高了代码的可读性、可维护性和可靠性，避免了 `var` 常见的陷阱（如变量泄漏出循环、意外覆盖）。
* **理解 `var`：** 主要用于理解旧代码或特定历史背景，在新项目中应避免使用。
* **使用 `const`：** 对于值不会改变的变量，应优先使用 `const` 声明常量，这能提供额外的安全保障并表明意图。

简单来说：**`let` 解决了 `var` 的主要设计缺陷，是现代 JavaScript 中声明变量的标准方式。** 请尽量使用 `let` 和 `const` 替代 `var`。
