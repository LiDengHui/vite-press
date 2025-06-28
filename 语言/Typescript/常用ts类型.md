# 常用ts类型

## 联合类型

1. `Exclude<T, U>` - 从类型T中排除类型U的类型
```ts
type T = number|string
type U = Exclude<T, string> // number
```
2. `Extract<T, U>` - 从类型T中提取类型U的类型
```ts
type T = number | string
type U = Extract<T, string> // string
```
3. `NonNullable<T>` - 从类型T中排除null和undefined类型
```ts
type T = string | null | undefined
type U = NonNullable<T> // string
```

## 函数类型工具
1. `Parameters<T>` - 获取函数T的参数类型
```ts
type T = (a: number, b: string) => void
type U = Parameters<T> // [number, string]
```
2. `ReturnType<T>` - 获取函数T的返回类型
```ts
type T = (a: number, b: string) => void
type U = ReturnType<T> // void
```
3. `ConstructorParameters<T>` - 获取构造函数T的参数类型
```ts
type T = new (a: number, b: string) => void
type U = ConstructorParameters<T> // [number, string]
```
4. `InstanceType<T>` - 获取构造函数T的实例类型
```ts
type T = new (a: number, b: string) => void
type U = InstanceType<T> // { a: number; b: string; }
```

## 基础类型扩展

### `Keyof<T>` - 获取类型T的所有键名
```ts

declare type Keyof<T> = T extends any ? keyof T : never;
type T = { a: number; b: string; }
type U = Keyof<T> // "a" | "b"
```
###  `Awaitable<T>` - 表示类型T可能是一个可等待的值
```ts
declare type Awaitable<T> = T | Promise<T>| Awaitable<T>;
type T = Promise<number>
type U = Awaitable<T> // number
```
###  `Arrayable<T>` - 表示类型T可能是一个数组或单个值
```ts
declare type Arrayable<T> = T | T[];
type T = number | number[]
type U = Arrayable<T> // number | number[]
```
### `ElementType<T>` - 获取数组T的元素类型

```ts
declare type ElementType<T> = T extends (infer U)[] ? U : T;
type T = number[]
type U = ElementType<T> // number
```

### `toArray<T>` - 将类型T转换为数组类型
```ts
declare type toArray<T> = T extends any? T[] : never;
type T = number
type U = toArray<T> // number[]

```
### `ArgumentType<T>` - 获取函数T的参数类型
```ts
declare type ArgumentType<T> = T extends (...args: infer U) => any? U : never;
type T = (a: number, b: string) => void
type U = ArgumentType<T> // [number, string]
```
###  `Shift<T>` - 获取元组T的第一个元素类型
```ts
declare type Shift<T> = T extends [any, ...infer U]? U : never;
type T = [number, string]
type U = Shift<T> // [string]
```
### `Pop<T>` - 获取元组T的最后一个元素类型
```ts
declare type Pop<T> = T extends [...infer U, any]? U : never;
type T = [number, string]
type U = Pop<T> // [number]
```
###  `Push<T, U>` - 将类型U添加到元组T的末尾
```ts
declare type Push<T, U> = [...T, U];
type T = [number, string]
type U = Push<T, boolean> // [number, string, boolean]
```
###  `Unshift<T, U>` - 将类型U添加到元组T的开头
```ts
declare type Unshift<T, U> = [U, ...T];
type T = [number, string]
type U = Unshift<T, boolean> // [boolean, number, string]
```
###  `ObjectEntries<T>` - 获取对象T的键值对类型
```ts
declare type ObjectEntries<T> = T extends object? { [K in keyof T]: [K, T[K]] }[keyof T] : never;
type T = { a: number; b: string; }
type U = ObjectEntries<T> // ["a", number] | ["b", string]
```
### `ObjectFromEntries<T>` - 将键值对类型T转换为对象类型
```ts
declare type ObjectFromEntries<T> = T extends [infer K, infer V]? { [K in K]: V } : never;
type T = ["a", number] | ["b", string]
type U = ObjectFromEntries<T> // { a: number; b: string; }  
```
## 进阶扩展

###  `AssertEqual<T, U>` - 检查类型T是否与类型U相等
```ts
declare type AssertEqual<T, U> = T extends U? U extends T? true : false : false;
type T = { a: number; b: string; }
type U = { a: number; b: string; }
```
###  `DeepPartial<T>` - 递归地将类型T的所有属性变为可选
```ts
declare type DeepPartial<T> = T extends object? { [K in keyof T]?: DeepPartial<T[K]> } : T;
type T = { a: number; b: { c: string; }; }
type U = DeepPartial<T> // { a?: number; b?: { c?: string; }; }
```
### `PartialByKeys<T, K>` - 将类型T的指定键K变为可选
```ts
declare type PartialByKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type T = { a: number; b: string; }
type U = PartialByKeys<T, "a"> // { a?: number; b: string; }

```
###  `RequiredByKeys<T, K>` - 将类型T的指定键K变为必选
```ts
declare type RequiredByKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
type T = { a?: number; b: string; }
type U = RequiredByKeys<T, "a"> // { a: number; b: string; }

```

## 高级函数工具

### `FunctionKeysObject<T>` - 提取对象中所有函数类型的属性
```ts
declare type FunctionKeysObject<T> = { [K in keyof T]: T[K] extends Function? K : never }[keyof T];
type T = { a: number; b: () => void; c: string; }
type U = FunctionKeysObject<T> // "b"
```

### `FunctionMapType<T>` - 创建类型函数的函数事件系统

```ts
declare type FunctionMapType<F> = <T extends keyof FunctionKeysObject<F>>(key: T, ...args: F<T> extends ((...args: infer P) => any) ? P : never[]) => void;

interface EventFunctions {
    a(): void

    b(params: { c: string, d: number }): void
}

declare const emit: FunctionMapType<EventFunction> = ()=>any; 

emit('a')
emit('b', {c: 'hello', d: 1})
```
