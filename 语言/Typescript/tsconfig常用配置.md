# TypeScript 配置文件 (`tsconfig.json`) 配置说明书


## **一、核心配置结构**
```json5
{
  "compilerOptions": {
    // 编译器选项 (详见第二部分)
  },
  "include": ["src"],       // 包含的文件/目录
  "exclude": ["node_modules"], // 排除的文件/目录
  "files": ["core.ts"],      // 显式包含的单个文件
  "extends": "./base.json",  // 继承其他配置
  "references": [{           // 项目引用
    "path": "../shared"
  }]
}
```


## **二、核心编译器选项 (`compilerOptions`)**

| 选项                               | 类型       | 默认值                       | 说明                    | 示例值                            |
|----------------------------------|----------|---------------------------|-----------------------|--------------------------------|
| **target**                       | string   | `ES3`                     | 编译目标 JS 版本            | `ES5`, `ES2020`, `ESNext`      |
| **module**                       | string   | `CommonJS` (target=ES3/5) | 模块系统                  | `CommonJS`, `ES2015`, `ESNext` |
| **strict**                       | boolean  | `false`                   | 启用所有严格检查              | `true`                         |
| **noImplicitAny**                | boolean  | `false`                   | 禁止隐式 any 类型           | `true`                         |
| **strictNullChecks**             | boolean  | `false`                   | 严格的 null/undefined 检查 | `true`                         |
| **outDir**                       | string   | -                         | 输出目录                  | `"dist"`                       |
| **rootDir**                      | string   | -                         | 源文件根目录                | `"src"`                        |
| **baseUrl**                      | string   | -                         | 模块解析基础路径              | `"./src"`                      |
| **paths**                        | object   | -                         | 路径别名映射                | `{ "@/*": ["src/*"] }`         |
| **esModuleInterop**              | boolean  | `false`                   | 改进 CommonJS/ES 模块互操作  | `true`                         |
| **skipLibCheck**                 | boolean  | `false`                   | 跳过声明文件类型检查            | `true`                         |
| **declaration**                  | boolean  | `false`                   | 生成 `.d.ts` 声明文件       | `true`                         |
| **sourceMap**                    | boolean  | `false`                   | 生成 sourcemap 文件       | `true`                         |
| **allowJs**                      | boolean  | `false`                   | 允许编译 JS 文件            | `true`                         |
| **jsx**                          | string   | `"preserve"`              | JSX 处理方式              | `"react"`, `"react-jsx"`       |
| **moduleResolution**             | string   | `classic` (module≠ES6)    | 模块解析策略                | `"node"`, `"classic"`          |
| **types**                        | string[] | -                         | 包含的类型声明               | `["jest", "node"]`             |
| **allowSyntheticDefaultImports** | boolean  | `false`                   | 允许合成默认导入              | `true`                         |
| **resolveJsonModule**            | boolean  | `false`                   | 允许导入 JSON 文件          | `true`                         |


## **三、文件控制选项**
| 选项          | 说明                 | 示例                                 |
|-------------|--------------------|------------------------------------|
| **include** | 包含的文件/目录 (Glob 模式) | `["src/**/*"]`                     |
| **exclude** | 排除的文件/目录           | `["node_modules", "**/*.spec.ts"]` |
| **files**   | 显式包含的单个文件          | `["core.ts", "app.ts"]`            |


## **四、扩展与项目引用**
```json5
{
  "extends": "./tsconfig.base.json", // 继承基础配置
  "references": [                   // 依赖的工程引用
    { "path": "../shared" },
    { "path": "../lib" }
  ]
}
```


## **五、常用配置模板**

1. **Node.js 项目**
    ```json
    {
      "compilerOptions": {
        "target": "ES2020",
        "module": "CommonJS",
        "outDir": "dist",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true
      },
      "include": ["src"]
    }
    ```
2. **React 项目**

    ```json
    {
      "compilerOptions": {
        "target": "ES5",
        "module": "ESNext",
        "jsx": "react-jsx",
        "strict": true,
        "baseUrl": "src",
        "paths": { "@/*": ["*"] },
        "resolveJsonModule": true
      }
    }
    ```

3. **库开发 (支持类型声明)**
    ```json
    {
      "compilerOptions": {
        "declaration": true,
        "declarationDir": "types",
        "sourceMap": true,
        "rootDir": "src",
        "outDir": "lib"
      }
    }
    ```


## **六、关键注意事项**
1. **优先级规则**：`files` > `include` > `exclude`
2. **路径别名**：需配合模块加载器 (Webpack/Vite) 使用
3. **严格模式**：推荐始终开启 `"strict": true`
4. **增量编译**：使用 `tsc --incremental` 或 `"incremental": true`
5. **工程引用**：大型项目使用 `references` 拆分模块

> 完整配置参考：[TypeScript 官方文档](https://www.typescriptlang.org/tsconfig)
