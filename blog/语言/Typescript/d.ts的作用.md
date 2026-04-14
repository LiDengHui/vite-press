# d.ts的作用

## 背景简介
在前端项目开发中，引入无内置 TypeScript 类型声明的第三方库时，TypeScript 编译器会报错。可在项目的 shims-vue.d.ts 中通过 declare 声明此模块来解决报错。同时引出几个问题：
-为什么在 .shims-vue.d.ts 文件中写一个 declare 声明就能解决报错？
- .d.ts 文件明明显示引入，为什么就生效了？
- 任意 xxx.d.ts 文件声明为什么都能发挥作用吗？

## .d.ts 文件的作用
.d.ts 文件是 TypeScript 世界中的“翻译器”，不负责运行代码，而是描述代码的结构、类型接口、模块，使 TypeScript 编译器正常进行类型检查、提示、自动补全等功能。具体作用如下：
### 为 JavaScript 代码或第三方库补充类型
引入没有类型定义的库时，TS 编译器会报错，可写一个 .d.ts 文件手动声明其类型。例如：
```ts
// types/jquery.d.ts
declare var $: any;
```

### 为非代码资源声明模块（如 SVG、CSS、JSON 等）
在项目中引入非代码资源时，TypeScript 默认无法识别，需要 .d.ts 文件告知类型。例如：
```ts
// types/shims-svg.d.ts
declare module '*.svg' {
  const content: string;
  export default content;
}
```

### 定义全局变量或类型
对于构建时注入的变量，可在 .d.ts 文件中声明，以便在任何文件中使用并获得类型提示。例如：
```ts
// types/global.d.ts
declare const VITE_APP_VERSION: string;
```

### 定义环境变量、全局命名空间等复杂类型结构
例如：
```ts
interface Window {
  myGlobalAPI: () => void;
}

declare namespace MyLib {
  type Options = {
    debug: boolean;
  };
}
```

### 补充已有模块的类型信息（模块扩展）
可以给已有模块添加自定义类型，无需修改原始库代码。例如：
```ts
// types/vue-router.d.ts
import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    auth?: boolean;
  }
}
```

## 为什么写一个 declare 就能解决报错？
TypeScript 是强类型语言，编译时会为每个变量、函数、模块、类型标识符“找到定义”。引入无类型声明第三方模块时，编译器会报错。当写上 `declare module 'xxx'` 时，是手动告知 TypeScript 该模块存在，不用担忧类型问题，编译器不再报错，默认将其当作 any 类型处理，这是使用 .d.ts 的基础场景：模块声明补全。

## 为什么 .d.ts 文件不引入也能生效？
这与 TypeScript 的文件识别机制有关。TypeScript 编译项目时，先加载项目根目录下的 tsconfig.json，根据其中配置项决定包含、排除的文件，使用的类型库，以及模块路径的解析方式。.d.ts 文件能自动生效的情况如下：
### 在 tsconfig.json 的 include 范围内
只要 .d.ts 文件路径在 include 的匹配范围内，TS 编译器就会自动加载它。例如：
```json
{
  "include": ["src", "types"]
}
```
将 shims-vue.d.ts 放在 src/ 或 types/ 下，它就会自动生效。

### 被编译器当作“全局声明”文件识别
.d.ts 文件中若无 import/export，会被 TypeScript 当作“全局类型声明文件”，自动合并进全局作用域，文件内容对所有文件可见。例如：
```ts
// types/global.d.ts
declare const __APP_VERSION__: string;
```
可在任意 .ts 文件中直接使用 __APP_VERSION__，无需引入。

### 被放置在默认类型目录下（如 @types）
TypeScript 默认会去 node_modules/@types 中找类型定义（社区维护的 DefinitelyTyped 类型库）。将声明文件放进此路径，可模拟 npm 包类型的形式存在。

## 任意 xxx.d.ts 文件都能生效吗？
并非如此。只有在 tsconfig.json 中的 include 中被包含，编译器才会自动加载。但以下情况，即使在 include 中声明也不会被加载：
| 失败原因 | 解释 |
| ---- | ---- |
| 使用了模块语法（如 import/export）导致该文件不再是全局声明 | 编译器不会自动把它合并为全局作用域 |
| 语法错误 | 编译器会跳过整个文件 |
