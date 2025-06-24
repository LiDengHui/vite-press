# 装饰器(decorator)

装饰器是一种特殊的声明, 可以附加在类、方法、访问器、属性、参数声明上

装饰器使用`@expression`的形式,其中expression必须能够演算为运行时调用的函数,其中包含装饰声明信息.

装饰器类型及其执行顺序为

1. 类装饰器---优先级 4 (对象实例化, 静态)
2. 方法装饰器---优先级 2 (对象实例化, 静态)
3. 访问器或属性装饰器---优先级 3 (对象实例化, 静态)
4. 参数装饰器---优先级1 (对象实例化, 静态)

注意,如果装饰器应用与类构造函数的参数,那么不同的装饰器的优先级为:

1. 参数装饰器
2. 方法装饰器
3. 访问器或参数装饰器
4. 构造器参数装饰器
5. 类装饰器

```ts
// 这是一个装饰器工厂——有助于将用户参数传给装饰器声明
function f() {
  console.log("f(): evaluated");
  return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("f(): called");
  }
}

function g() {
  console.log("g(): evaluated");
  return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("g(): called");
  }
}

class C {
  @f()
  @g()
  method() {}
}

// f(): evaluated
// g(): evaluated
// g(): called
// f(): called
```

`f`和`g`返回了另一个函数(装饰器函数). `f`和`g`称为装饰器工厂

> `装饰器工厂`帮助用户传递可供装饰器利用的参数

我们可以看到装饰器的,`演算规则`为**由顶向上**,执行顺序**由底向上**

## 装饰器的签名

```ts
interface TypedPropertyDescriptor<T> {
    enumerable?: boolean;
    configurable?: boolean;
    writable?: boolean;
    value?: T;
    get?: () => T;
    set?: (value: T) => void;
}

declare type ClassDecorator = <TFunction extends Function>(target: TFunction) => TFunction | void;
declare type PropertyDecorator = (target: Object, propertyKey: string | symbol) => void;
declare type MethodDecorator = <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;
declare type ParameterDecorator = (target: Object, propertyKey: string | symbol, parameterIndex: number) => void;
```

## 方法装饰器

可以从上面的签名中,看到它有三个参数

1. target: 当前对象的原型,也就是说,假设Employee是对象,那么target就是Employee.prototype
2. propertyKey: 方法的名称
3. descriptor: 方法的属性描述符,即Object.getOwnPropertyDescriptor(Employ.prototype, propertyKey)


```ts
export function logMethod(
  target: Object,
  propertyName: string,
  propertyDescriptor: PropertyDescriptor): PropertyDescriptor {
  // target === Employee.prototype
  // propertyName === "greet"
  // propertyDesciptor === Object.getOwnPropertyDescriptor(Employee.prototype, "greet")
  const method = propertyDesciptor.value;

  propertyDesciptor.value = function (...args: any[]) {
    // 将 greet 的参数列表转换为字符串
    const params = args.map(a => JSON.stringify(a)).join();
    // 调用 greet() 并获取其返回值
    const result = method.apply(this, args);
    // 转换结尾为字符串
    const r = JSON.stringify(result);
    // 在终端显示函数调用细节
    console.log(`Call: ${propertyName}(${params}) => ${r}`);
    // 返回调用函数的结果
    return result;
  }
  return propertyDesciptor;
};

class Employee {
    constructor(private firstName: string, private lastName: string
    ) {}

    @logMethod
    greet(message: string): string {
        return `${this.firstName} ${this.lastName} says: ${message}`;
    }
}

const emp = new Employee('Mohan Ram', 'Ratnakumar');
emp.greet('hello');
```
javascript 编译后是什么样

```js
var __decorate =
    (this && this.__decorate) ||
    function (decorators, target, key, desc) {
        // 函数参数长度
        var c = arguments.length;

        /**
         * 处理结果
         * 如果仅仅传入了装饰器数组和目标，那么应该是个类装饰器。
         * 否则，如果描述符（第 4 个参数）为 null，就根据已知值准备属性描述符，
         * 反之则使用同一描述符。
         */

        var r =
            c < 3
                ? target
                : desc === null
                ? (desc = Object.getOwnPropertyDescriptor(target, key))
                : desc;

        // 声明存储装饰器的变量
        var d;

        // 如果原生反射可用，使用原生反射触发装饰器
        if (
            typeof Reflect === "object" &&
            typeof Reflect.decorate === "function"
        ) {
            r = Reflect.decorate(decorators, target, key, desc);
        } else {
            // 自右向左迭代装饰器
            for (var i = decorators.length - 1; i >= 0; i--) {
                // 如果装饰器合法，将其赋值给 d
                if ((d = decorators[i])) {
                    /**
                     * 如果仅仅传入了装饰器数组和目标，那么应该是类装饰器，
                     * 传入目标调用装饰器。
                     * 否则，如果 4 个参数俱全，那么应该是方法装饰器，
                     * 据此进行调用。
                     * 反之则使用同一描述符。
                     * 如果传入了 3 个参数，那么应该是属性装饰器，可进行相应的调用。
                     * 如果以上条件皆不满足，返回处理的结果。
                     */
                    r =
                        (c < 3
                            ? d(r)
                            : c > 3
                            ? d(target, key, r)
                            : d(target, key)) || r;
                }
            }
        }

        /**
         * 由于只有方法装饰器需要根据应用装饰器的结果修正其属性，
         * 所以最后返回处理好的 r
         */
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };

var Employee = /** @class */ (function () {
    function Employee(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }
    Employee.prototype.greet = function (message) {
        return this.firstName + " " + this.lastName + " says: " + message;
    };

    // typescript 调用 `__decorate` 辅助函数，
    // 以便在对象原型上应用装饰器
    __decorate([logMethod], Employee.prototype, "greet");
    return Employee;
})();
var emp = new Employee("Mohan Ram", "Ratnakumar");
emp.greet("hello");

```

让我们开始分析`Employee`函数---构造器初始化`name`和`greet`方法,将其传入原型.

```js
 __decorate([logMethod], Employee.prototype, "greet");
```

这是 TypeScript 自动生成的通用方法，它根据装饰器类型和相应参数处理装饰器函数调用。

该函数有助于内省方法调用，并为开发者铺平了处理类似`日志`、`记忆化`、`应用配置`等横切关注点的道路。

在这个例子中，我们仅仅打印了函数调用及其参数、响应。

注意，阅读 `__decorate` 方法中的详细注释可以理解其内部机制。


## 属性装饰器

属性装饰器有两个参数

1. target: 当前对象原型, 也就说,假设Employee是对象,那么target就是Employee.prototype
2. propertyKey: 属性名称

```ts
function logParameter(target: Object, propertyName: string) {
    // 属性值
    let _val = this[propertyName];

    // 属性读取访问器
    const getter = () => {
        console.log(`Get: ${propertyName} => ${_val}`);
        return _val;
    };

    // 属性写入访问器
    const setter = newVal => {
        console.log(`Set: ${propertyName} => ${newVal}`);
        _val = newVal;
    };

    // 删除属性
    if (delete this[propertyName]) {
        // 创建新属性及其读取访问器、写入访问器
        Object.defineProperty(target, propertyName, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true
        });
    }
}

class Employee {
    @logParameter
    name: string;
}

const emp = new Employee();
emp.name = 'Mohan Ram';
console.log(emp.name);
// Set: name => Mohan Ram
// Get: name => Mohan Ram
// Mohan Ram
```
上面的代码中, 我们在装饰器中内省属性的可访问性, 下面是编译后的代码

```js
var Employee = /** @class */ (function () {
    function Employee() {
    }
    __decorate([
        logParameter
    ], Employee.prototype, "name");
    return Employee;
}());
var emp = new Employee();
emp.name = 'Mohan Ram'; // Set: name => Mohan Ram
console.log(emp.name); // Get: name => Mohan Ram
```

## 参数装饰器

参数装饰器函数有三个参数: 

1. target: 当前对象的原型,也就是说,假设Employee是对象, 那么 target就是Employee.prototype
2. propertyKey: 参数名称
3. index: 参数数组中的位置



```ts
function logParameter(target: Object, propertyName: string, index: number) {
    // 为相应方法生成元数据键，以储存被装饰的参数的位置
    const metadataKey = `log_${propertyName}_parameters`;
    if (Array.isArray(target[metadataKey])) {
        target[metadataKey].push(index);
    }
    else {
        target[metadataKey] = [index];
    }
}

class Employee {
    greet(@logParameter message: string): string {
        return `hello ${message}`;
    }
}
const emp = new Employee();
emp.greet('hello');
```

上面的代码中,我们收集了所有被装饰的方法的索引或位置, 作为元数据加入对象的原型.后面是编译后的代码

```js
// 返回接受参数索引和装饰器的函数
var __param = (this && this.__param) || function (paramIndex, decorator) {
  // 该函数返回装饰器
  return function (target, key) { decorator(target, key, paramIndex); }
};

var Employee = /** @class */ (function () {
    function Employee() {}
    Employee.prototype.greet = function (message) {
        return "hello " + message;
    };
    __decorate([
        __param(0, logParameter)
    ], Employee.prototype, "greet");
    return Employee;
}());
var emp = new Employee();
emp.greet('hello');
```

类似之前见过的__decorate函数,__param 函数返回一个封装参数装饰器的装饰器

如我们所见,调用参数装饰器时, 会忽略其返回值.这就意味着,调用`__param`函数时, 其返回值不会用来覆盖参数值

这就是`参数装饰器`不反回的原因

## 访问器装饰器

访问器不过是类声明中属性的读取访问器和写入访问器

访问器装饰器应用于访问器的`属性描述符`,可用于`观测`、`修改`、`替换`访问器的定义

```js
function enumerable(value: boolean) {
    return function (
      target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log('decorator - sets the enumeration part of the accessor');
        descriptor.enumerable = value;
    };
}

class Employee {
    private _salary: number;
    private _name: string;

    @enumerable(false)
    get salary() { return `Rs. ${this._salary}`; }

    set salary(salary: any) { this._salary = +salary; }

    @enumerable(true)
    get name() {
        return `Sir/Madam, ${this._name}`;
    }

    set name(name: string) {
        this._name = name;
    }

}

const emp = new Employee();
emp.salary = 1000;
for (let prop in emp) {
    console.log(`enumerable property = ${prop}`);
}
// salary 属性不在清单上，因为我们将其设为假
// output:
// decorator - sets the enumeration part of the accessor
// decorator - sets the enumeration part of the accessor
// enumerable property = _salary
// enumerable property = name
```

上面的例子中,我们定义了两个访问器`name`和`salary`,并通过装饰器设置是否将其列入清单,据此决定对象的行为.`name`将入清单,而`salary`不会

下面是编译的代码

```js
function enumerable(value) {
    return function (target, propertyKey, descriptor) {
        console.log('decorator - sets the enumeration part of the accessor');
        descriptor.enumerable = value;
    };
}

var Employee = /** @class */ (function () {
    function Employee() {
    }
    Object.defineProperty(Employee.prototype, "salary", {
        get: function () { return "Rs. " + this._salary; },
        set: function (salary) { this._salary = +salary; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Employee.prototype, "name", {
        get: function () {
            return "Sir/Madam, " + this._name;
        },
        set: function (name) {
            this._name = name;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        enumerable(false)
    ], Employee.prototype, "salary", null);
    __decorate([
        enumerable(true)
    ], Employee.prototype, "name", null);
    return Employee;
}());
var emp = new Employee();
emp.salary = 1000;
for (var prop in emp) {
    console.log("enumerable property = " + prop);
}
```

##  类装饰器

类装饰器应用于类的构造器,可用于观测、修改、替换类的定义

```ts
export function logClass(target: Function) {
    // 保存一份原构造器的引用
    const original = target;

    // 生成类的实例的辅助函数
    function construct(constructor, args) {
        const c: any = function () {
            return constructor.apply(this, args);
        }
        c.prototype = constructor.prototype;
        return new c();
    }

    // 新构造器行为
    const f: any = function (...args) {
        console.log(`New: ${original['name']} is created`);
        return construct(original, args);
    }

    // 复制 prototype 属性，保持 intanceof 操作符可用
    f.prototype = original.prototype;

    // 返回新构造器（将覆盖原构造器）
    return f;
}

@logClass
class Employee {}

let emp = new Employee();
console.log('emp instanceof Employee');
console.log(emp instanceof Employee); // true
```
上面的装饰器声明了一个名为original的变量,将其值设为装饰的类构造器.

接着声明了一个名为construct的辅助函数,该函数用于创建类的实例.

接下来创建了一个名为f的变量,该变量用于用作新的构造器,该函数调用原构造器,同时在控制台打印了实例话的类名

这正是我们给原构造器加入的额外的行为的地方
原来构造器的原型复制到了f,以确保创建一个Employee新实例的时候,instanceof操作符的效果符合预期

新构造器一旦就绪,我们便返回它, 以完成类构造器的实现

新构造器就绪后,每次创建实例时会在控制台打印类名

编译后的代码如下

```js
var Employee = /** @class */ (function () {
    function Employee() {
    }
    Employee = __decorate([
        logClass
    ], Employee);
    return Employee;
}());
var emp = new Employee();
console.log('emp instanceof Employee');
console.log(emp instanceof Employee);
```

在编译后的代码中,我们注意到两处不同:

1. 传给__decorate的参数有两个, 装饰器数组和构造器函数
2. TypeScript编译器使用__decorate的返回值以覆盖原构造器

这正是类装饰器必须返回一个构造函数的原因所在

## 装饰器工厂

由于每种装饰器都有它自身的调用签名,我们可以使用装饰器工厂来泛化装饰器调用

```ts
import { logClass } from './class-decorator';
import { logMethod } from './method-decorator';
import { logProperty } from './property-decorator';
import { logParameter } from './parameter-decorator';

// 装饰器工厂，根据传入的参数调用相应的装饰器
export function log(...args) {
    switch (args.length) {
        case 3: // 可能是方法装饰器或参数装饰器
            // 如果第三个参数是数字，那么它是索引，所以这是参数装饰器
            if typeof args[2] === "number") {
                return logParameter.apply(this, args);
            }
            return logMethod.apply(this, args);
        case 2: // 属性装饰器 
            return logProperty.apply(this, args);
        case 1: // 类装饰器
            return logClass.apply(this, args);
        default: // 参数数目不合法
            throw new Error('Not a valid decorator');
    }
}

@log
class Employee {
    @log
    private name: string;

    constructor(name: string) {
        this.name = name;
    }

    @log
    greet(@log message: string): string {
        return `${this.name} says: ${message}`;
    }
}
```

## 元信息反射API

元信息反射API(例如 Reflect)能够用来以标准的方式组织元信息.

[反射]的意思是代码可以侦测同一系统中的其他代码(或其自身).

反射在组合/依赖注入、运行时类型断言、测试等使用场景下很有用.

```ts
import "reflect-metadata";

// 参数装饰器使用反射 api 存储被装饰参数的索引
export function logParameter(target: Object, propertyName: string, index: number) {
    // 获取目标对象的元信息
    const indices = Reflect.getMetadata(`log_${propertyName}_parameters`, target, propertyName) || [];
    indices.push(index);
    // 定义目标对象的元信息
    Reflect.defineMetadata(`log_${propertyName}_parameters`, indices, target, propertyName);
}

// 属性装饰器使用反射 api 获取属性的运行时类型
export function logProperty(target: Object, propertyName: string): void {
    // 获取对象属性的设计类型
    var t = Reflect.getMetadata("design:type", target, propertyName);
    console.log(`${propertyName} type: ${t.name}`); // name type: String
}


class Employee {
    @logProperty
    private name: string;
    
    constructor(name: string) {
        this.name = name;
    }

    greet(@logParameter message: string): string {
        return `${this.name} says: ${message}`;
    }
}
```

上面的代码用到了`reflect-metadata`这个库.其中我们使用了反射元信息的设计键(例如`design:type`).目前只有三个:

1. 类型元信息: `design:type`,
2. 参数类型元信息: `design:paramtypes`
3. 返回类型元信息: `design:returntype`,

有了反射.我们就能够在运行时得到一下信息: 

1. 实体名
2. 实体类型
3. 实体实现的接口
4. 实体构造器参数的名称和类型

## 总结

1. 装饰器 不过是在设计时帮助内省代码,注解及修改类和属性的函数
2. Yehuda Katz 提议在ECMAScript2016标准中加入装饰器特征[tc39/proposal-decorators](https://github.com/tc39/proposal-decorators)
3. 我们可以通过装饰器工厂将用户提供的参数传给装饰器
4. 有4种装饰器: 类装饰器、方法装饰器、属性/访问器装饰器、参数装饰器
5. 元信息反射API有助于以标准化的方式在对象中加入元信息,以及在运行时获取设计类型信息

## 备注

本文源于:<https://juejin.im/post/6844903876605280269>

代码" "<https://github.com/mohanramphp/typescript-decorators>