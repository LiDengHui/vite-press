# type与interface的区别

[[toc]]

在 TypeScript 中，`type` 和 `interface` 都用于定义类型，但它们在设计目的和使用场景上存在一些关键区别。以下是两者的主要对比：

## **1. 基本定义**

- **`interface`**  
  专门用于**描述对象形状**（Object Shape），包括属性、方法、索引签名等。
  ```typescript
  interface User {
    id: number;
    name: string;
    sayHello(): void;
  }
  ```

- **`type`**  
  是**类型别名**，可为任意类型命名（包括原始类型、联合类型、元组等）。
  ```typescript
  type ID = number | string;          // 联合类型
  type Point = [number, number];      // 元组
  type Callback = () => void;         // 函数类型
  ```

## **2. 扩展性**

- **`interface`**  
  支持**声明合并**（Declaration Merging）：同名的 `interface` 会自动合并。
  ```typescript
  interface Car { brand: string; }
  interface Car { model: string; } // 合并为 { brand: string; model: string; }
  ```

- **`type`**  
  不支持声明合并，重复定义会报错。
  ```typescript
  type Car = { brand: string };
  type Car = { model: string }; // ❌ 错误: 重复标识符
  ```

## **3. 继承方式**

- **`interface`**  
  使用 `extends` 继承：
  ```typescript
  interface Animal { name: string; }
  interface Dog extends Animal { breed: string; }
  ```

- **`type`**  
  使用交叉类型 `&` 实现类似继承：
  ```typescript
  type Animal = { name: string };
  type Dog = Animal & { breed: string };
  ```

## **4. 实现（`implements`）**

- **`class` 可实现 `interface` 或 `type`**  
  两者均可被类实现（只要类型兼容）。
  ```typescript
  interface IUser { name: string; }
  type TUser = { name: string };

  class UserA implements IUser { name = "Alice"; }
  class UserB implements TUser { name = "Bob"; }
  ```

## **5. 兼容类型范围**

- **`interface`**  
  仅能描述**对象类型**（Object Types）。

- **`type`**  
  可描述任意类型：
  ```typescript
  type A = string;                   // 原始类型
  type B = "yes" | "no";             // 字面量联合类型
  type C = ReturnType<() => number>; // 工具类型
  ```

## **6. 性能差异（极端场景）**

- **`interface`**  
  在复杂类型检查中（如深层嵌套）可能略微更快（但实际差异极小）。

- **`type`**  
  某些工具类型（如 `Union Types`）可能导致递归检查变慢，但通常可忽略。

## **7. 错误提示友好度**

- 使用 `interface` 时，错误信息会直接显示接口名（如 `User`），更易读。
- 使用 `type` 时，复杂类型可能直接展开显示结构。

## **使用建议**

| 场景                            | 推荐                       |
|-------------------------------|--------------------------|
| 定义对象类型（如 API 响应）              | **`interface`**（更符合设计初衷） |
| 需要声明合并（扩展第三方库）                | **`interface`**          |
| 联合类型、元组、函数类型等                 | **`type`**               |
| 复杂工具类型（如 `Conditional Types`） | **`type`**               |

## **总结**

| 特性                | `interface` | `type`      |
|-------------------|-------------|-------------|
| 对象类型              | ✅ 推荐        | ✅           |
| 非对象类型（联合、元组等）     | ❌           | ✅           |
| 声明合并              | ✅           | ❌           |
| 类实现（`implements`） | ✅           | ✅           |
| 扩展性               | `extends`   | `&`（交叉类型）   |
| 错误提示友好度           | 优           | 中（复杂类型可能较差） |

**优先选择 `interface` 描述对象结构，用 `type` 处理其他类型场景。** 两者在大部分情况下可互换，团队可根据规范统一风格。
