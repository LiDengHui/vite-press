# TypeScript 使用手册


## **1. TypeScript 简介**
**核心价值**：
- **静态类型检查**：编译时捕获类型错误（如 `string` 误用为 `number`）。
- **类型推导**：自动推断变量类型（如 `let age = 30` → `age: number`）。
- **ES6+ 支持**：支持类、模块、箭头函数等现代语法。
- **工具增强**：编辑器智能提示、重构支持。

```typescript
// 示例：类型错误检测
let price: number = 100;
price = "200"; // 🚨 编译错误：不能将类型 'string' 分配给类型 'number'
```


## **2. 环境搭建**
**安装**：
```bash
npm install -g typescript  # 全局安装 TS 编译器
tsc --init                 # 生成 tsconfig.json
```

**编译**：
```bash
tsc app.ts                 # 编译单个文件
tsc                        # 编译所有文件（需 tsconfig.json）
```


## **3. 基础类型**
**内置类型**：
```typescript
let isDone: boolean = true;
let count: number = 42;
let name: string = "Alice";
let list: number[] = [1, 2, 3];      // 数组
let tuple: [string, number] = ["a", 1]; // 元组
let anything: any = "可以任意赋值";    // 慎用！
let nothing: void = undefined;       // 常用于无返回值的函数
```

**特殊类型**：
```typescript
let u: undefined = undefined;       // 仅能赋值为 undefined
let n: null = null;                 // 仅能赋值为 null
let random: unknown = "Hello";      // 比 any 更安全的顶层类型
if (typeof random === "string") {
  console.log(random.length);       // 需类型收窄后才能操作
}
```


## **4. 接口（Interface）**
**定义对象结构**：
```typescript
interface User {
  id: number;
  name: string;
  email?: string;    // 可选属性
  readonly role: "admin" | "user"; // 只读属性 + 字面量联合类型
}

const alice: User = {
  id: 1,
  name: "Alice",
  role: "admin",     // ✅ 合法
};
alice.role = "user"; // 🚨 错误：只读属性不可修改
```

**函数类型**：
```typescript
interface SearchFunc {
  (source: string, keyword: string): boolean; // 定义函数签名
}

const search: SearchFunc = (src, kw) => src.includes(kw);
```

## **5. 类（Class）**
**基础语法**：
```typescript
class Animal {
  private _age: number; // 私有属性（仅类内访问）
  constructor(public name: string, age: number) { // 参数属性简写
    this._age = age;
  }

  public move(distance: number = 0) {
    console.log(`${this.name} moved ${distance}m`);
  }
}

class Dog extends Animal {
  bark() {
    console.log("Woof!");
  }
}

const dog = new Dog("Buddy", 3);
dog.bark();    // ✅ "Woof!"
dog.move(10);  // ✅ "Buddy moved 10m"
```


## **6. 泛型（Generics）**
**复用类型逻辑**：
```typescript
function identity<T>(arg: T): T { // T 是类型变量
  return arg;
}
const output = identity<string>("hello"); // 显式指定 T 为 string
const inferred = identity(42);           // 自动推导 T 为 number

// 泛型约束
interface Lengthwise {
  length: number;
}
function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); // ✅ 因为 T 被约束为有 length 属性
  return arg;
}
```


## **7. 高级类型**
**联合类型（Union）**：
```typescript
type Status = "pending" | "success" | "error"; // 字面量联合
type ID = number | string;                    // 类型联合

function printId(id: ID) {
  if (typeof id === "string") {
    console.log(id.toUpperCase()); // 类型收窄
  } else {
    console.log(id.toFixed(2));
  }
}
```

**交叉类型（Intersection）**：
```typescript
interface Employee {
  id: number;
  role: string;
}
interface Contact {
  email: string;
}
type EmployeeContact = Employee & Contact; // 合并类型

const emp: EmployeeContact = {
  id: 1,
  role: "dev",
  email: "dev@example.com",
};
```

**类型别名（Type Alias）**：
```typescript
type Point = {
  x: number;
  y: number;
};
type Callback = (data: string) => void; // 函数类型别名
```

## **8. 模块系统**
**导出/导入**：
```typescript
// math.ts
export const PI = 3.14;
export function circleArea(radius: number): number {
  return PI * radius ** 2;
}

// app.ts
import { PI, circleArea } from "./math";
console.log(circleArea(10)); // 314
```

**默认导出**：
```typescript
// logger.ts
export default class Logger {
  log(message: string) {
    console.log(message);
  }
}

// app.ts
import MyLogger from "./logger"; // 名称自由定义
const logger = new MyLogger();
```

## **9. 配置文件 `tsconfig.json`**
**关键配置项**：
```json
{
  "compilerOptions": {
    "target": "ES2020",        // 编译目标 JS 版本
    "module": "ESNext",        // 模块系统 (CommonJS/ES6)
    "strict": true,             // 启用所有严格检查
    "outDir": "./dist",         // 输出目录
    "esModuleInterop": true,    // 改进 CommonJS/ES6 互操作
    "skipLibCheck": true        // 跳过库类型检查（提升性能）
  },
  "include": ["src/**/*.ts"],  // 包含文件
  "exclude": ["node_modules"]   // 排除文件
}
```

---

## **10. 与 JavaScript 互操作**
**使用 `.d.ts` 类型声明**：
```typescript
// 为 JS 库提供类型（如 lodash）
declare module "lodash" {
  export function chunk<T>(array: T[], size: number): T[][];
}
```

**渐进式迁移**：
1. 将 `.js` 重命名为 `.ts`，逐步修复类型错误。
2. 使用 `// @ts-ignore` 临时忽略错误（慎用）。

---

## **最佳实践**
1. **避免 `any`**：优先用 `unknown` + 类型收窄。
2. **启用严格模式**：`tsconfig.json` 中设置 `"strict": true`。
3. **类型即文档**：为函数/接口添加 JSDoc 注释：
   ```typescript
   /** 计算用户折扣后的价格 */
   function applyDiscount(price: number, discount: number): number {
     return price * (1 - discount);
   }
   ```
4. **使用工具链**：
    - **ESLint**：代码规范检查
    - **Prettier**：代码格式化
    - **ts-node**：直接运行 TS 文件


##  **延伸学习**：
> - [官方 Handbook](https://www.typescriptlang.org/docs/handbook)
> - [TypeScript Playground](https://www.typescriptlang.org/play)（在线实验）
> - 高级主题：装饰器、条件类型、映射类型

通过类型系统提升代码健壮性，享受开发效率与维护性的双重提升！ 🚀
