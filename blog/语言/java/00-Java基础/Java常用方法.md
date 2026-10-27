---
tags:
  - Java
  - Java基础
  - 后端
---

# Java 常用方法

这篇不追求把所有 API 都列全，
而是把日常 Java 开发里最容易碰到、最值得先掌握的一批“常用方法”讲清楚。

很多初学者学“常用方法”时有两个典型问题：

- 只背方法名，不知道实际场景
- 把别的语言/平台的方法表抄进 Java，结果越看越乱

所以这一篇的目标是：

- 先帮你建立“哪些方法最常用”的整体认识
- 再用实际代码说明它们怎么用
- 最后告诉你哪些地方最容易写错

---

## 1. 这是什么

所谓“Java 常用方法”，不是指把 JDK 全部方法都背下来，
而是指：

- 在日常写业务代码、工具代码、算法练习时，反复会遇到的方法

这类方法往往集中在：

- `Math`
- `Object`
- `Objects`
- `Runtime`
- `String`
- 集合辅助方法

其中这一篇重点先讲最容易高频使用、也最容易混淆的四组：

- `Math`：数学运算
- `Runtime`：JVM 运行时信息与进程操作
- `Object`：所有对象的基础方法
- `Objects`：空值安全与对象工具方法

---

## 2. 为什么重要

很多人写 Java 代码时效率低，不是因为不会复杂框架，
而是因为基础工具方法不熟：

- 该判空时不会用 `Objects.equals`
- 该比较大小时写出一堆 if/else
- 该看 JVM 内存时不知道从哪里拿
- 该重写 `toString` / `equals` 时思路不清楚

结果就会出现：

- 代码啰嗦
- 空指针多
- 可读性差
- 排查问题慢

这些方法看起来零散，
但它们其实贯穿了几乎所有 Java 项目。

---

## 3. 先建立整体直觉

你可以把这几个类理解成不同层级的“工具箱”：

- `Math`：做数学计算
- `Runtime`：看 JVM 现在运行得怎么样
- `Object`：每个对象天生都带的方法
- `Objects`：专门帮你更安全、更简洁地处理对象

如果再说得直白一点：

- 要算数，想 `Math`
- 要看内存/CPU/启动进程，想 `Runtime`
- 要打印对象、比较对象、克隆对象，先想 `Object`
- 要判空、防 NPE、做安全比较，优先想 `Objects`

只要这个分工感建立起来，后面方法就不容易混。

---

## 4. `Math`：最常见的数学工具方法

`Math` 是一个纯工具类，绝大多数方法都是静态方法，
也就是说你不用 new，直接 `Math.xxx(...)` 就行。

### 4.1 最常见的 8 个方法

```java
System.out.println(Math.abs(-10));      // 10
System.out.println(Math.max(3, 8));     // 8
System.out.println(Math.min(3, 8));     // 3
System.out.println(Math.round(3.6));    // 4
System.out.println(Math.floor(3.9));    // 3.0
System.out.println(Math.ceil(3.1));     // 4.0
System.out.println(Math.sqrt(16));      // 4.0
System.out.println(Math.pow(2, 5));     // 32.0
```

这些方法基本覆盖了最常见的数学处理需求：

- 绝对值：`abs`
- 最大最小值：`max` / `min`
- 四舍五入：`round`
- 向下取整：`floor`
- 向上取整：`ceil`
- 平方根：`sqrt`
- 幂运算：`pow`

---

### 4.2 三角函数和对数函数

如果你在做图形、算法、统计或工程计算，也会遇到：

```java
System.out.println(Math.sin(0));
System.out.println(Math.cos(0));
System.out.println(Math.tan(0));
System.out.println(Math.log(Math.E));
System.out.println(Math.log10(1000));
System.out.println(Math.exp(1));
```

但这里先记一个关键点：

- Java `Math` 的三角函数使用的是**弧度**，不是角度

例如：

```java
double degree = 60;
double radian = Math.toRadians(degree);
System.out.println(Math.sin(radian));
```

如果你直接把 60 传给 `sin`，
得到的不是你以为的“60 度的正弦”。

---

### 4.3 `Math` 里最容易搞错的点

#### `round`、`floor`、`ceil` 不是一回事

```java
System.out.println(Math.round(3.5)); // 4
System.out.println(Math.floor(3.5)); // 3.0
System.out.println(Math.ceil(3.5));  // 4.0
```

- `round`：四舍五入
- `floor`：往下取整
- `ceil`：往上取整

尤其在金额、分页、坐标、区间计算里，差别非常大。

#### `pow` 返回的是 `double`

```java
double x = Math.pow(2, 31);
```

它不是整数类型。

如果你做的是严格整数运算，
尤其在大数或精度敏感场景里，不能想当然地把 `Math.pow` 当成“整数幂”。

---

## 5. `Runtime`：看 JVM 运行时状态

`Runtime` 可以让你拿到当前 JVM 的运行时信息，
典型用途包括：

- 查看处理器数量
- 查看 JVM 内存情况
- 执行外部命令
- 主动退出 JVM

获取方式：

```java
Runtime runtime = Runtime.getRuntime();
```

---

### 5.1 查看处理器与内存

```java
Runtime runtime = Runtime.getRuntime();

System.out.println("CPU 核心数: " + runtime.availableProcessors());
System.out.println("最大内存: " + runtime.maxMemory());
System.out.println("已分配内存: " + runtime.totalMemory());
System.out.println("空闲内存: " + runtime.freeMemory());
```

你可以把这几个值先粗略理解成：

- `availableProcessors()`：当前 JVM 可用处理器数量
- `maxMemory()`：JVM 最多能申请到的内存上限
- `totalMemory()`：JVM 当前已经向系统申请到的内存
- `freeMemory()`：当前已申请内存中还没用掉的部分

### 一个非常容易误解的点

很多人会把 `freeMemory()` 误解成“系统空闲内存”，
其实不是。

它表示的是：

- **JVM 当前这块已拿到的内存里，还有多少空着**

不是整个操作系统还剩多少内存。

---

### 5.2 执行外部命令

```java
Runtime runtime = Runtime.getRuntime();
Process process = runtime.exec("java -version");
```

这能力很强，但也很容易踩坑。

因为实际工程里你还要处理：

- 标准输出
- 错误输出
- 阻塞等待
- 命令兼容性
- 安全风险

所以入门阶段你知道它能做什么就行，
真正写生产代码时，一般还会配合 `ProcessBuilder`，
通常比直接 `exec` 更清晰可控。

---

### 5.3 退出 JVM

```java
Runtime.getRuntime().exit(0);
```

常见含义：

- `0`：正常退出
- 非 `0`：异常退出

但业务项目里通常不要随手调用，
除非你非常明确地在写：

- 命令行工具
- 启停脚本
- 某些特定的独立程序

在 Web 项目或服务端程序里乱用，会非常危险。

---

## 6. `Object`：所有对象的基础能力

Java 里所有类默认都继承自 `Object`。

也就是说，你写的每个对象，天然都会有一批基础方法，最典型的是：

- `toString()`
- `equals(Object obj)`
- `hashCode()`
- `getClass()`
- `clone()`

---

### 6.1 `toString()`：对象打印时最常用的方法

例如：

```java
public class User {
    private String name;
    private int age;

    public User(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public String toString() {
        return "User{name='" + name + "', age=" + age + "}";
    }
}
```

这样打印对象时：

```java
User user = new User("张三", 18);
System.out.println(user);
```

输出会更可读。

如果不重写，默认通常是：

- 类名 + `@` + 十六进制哈希值

对排查问题帮助很有限。

---

### 6.2 `equals()`：定义“两个对象什么情况下算相等”

默认情况下，`Object.equals()` 比较的是：

- 是否是同一个对象引用

也就是类似：

```java
a == b
```

但很多业务对象，我们更关心的是“内容是否相等”。

例如用户对象：

```java
public class User {
    private String name;
    private int age;

    public User(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        User user = (User) obj;
        return age == user.age && java.util.Objects.equals(name, user.name);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(name, age);
    }
}
```

这里有一个必须一起记住的规则：

> **重写 `equals()` 时，通常也必须同步重写 `hashCode()`。**

否则对象放进 `HashSet`、`HashMap` 时行为可能不符合预期。

---

### 6.3 `clone()` 不要想得太简单

很多入门材料会写：

- `clone()` 用来克隆对象

这句话没错，但不完整。

因为它牵涉到：

- 浅拷贝
- 深拷贝
- `Cloneable` 接口
- 可见性和异常处理

对于初学者，更重要的是先知道：

- `clone()` 不是“复制对象”的唯一方案
- 实际业务里很多团队更倾向用拷贝构造器、工厂方法或序列化方案来做对象复制

也就是说，`clone()` 你要认识，但不要把它想得过于简单。

---

## 7. `Objects`：更安全的对象工具类

`Objects` 是实际开发里非常高频、非常实用的一组工具方法。

如果你现在只想先记住最有用的几项，优先记下面这些：

- `Objects.equals(a, b)`
- `Objects.isNull(obj)`
- `Objects.nonNull(obj)`
- `Objects.requireNonNull(obj)`
- `Objects.toString(obj)`
- `Objects.hash(...)`

---

### 7.1 `Objects.equals(a, b)`：空值安全比较

```java
String a = null;
String b = "hello";

System.out.println(Objects.equals(a, b)); // false
System.out.println(Objects.equals(null, null)); // true
```

它最大的价值是：

- 即使 `a` 是 `null`，也不会直接抛空指针异常

和下面这句相比：

```java
a.equals(b)
```

安全性高很多。

所以只要有可能出现 `null`，
优先考虑：

```java
Objects.equals(a, b)
```

---

### 7.2 `Objects.requireNonNull(obj)`：快速失败

```java
public void save(User user) {
    Objects.requireNonNull(user, "user 不能为空");
    // 后续逻辑
}
```

这行代码的含义是：

- 如果 `user` 为 `null`
- 立刻抛出空指针异常，并带上说明信息

它特别适合：

- 构造方法参数校验
- Service 层入参校验
- 不允许为空的关键依赖检查

这类写法比后面在业务逻辑里“绕半天再 NPE”更容易定位问题。

---

### 7.3 `Objects.toString(obj)`

```java
Object obj = null;
System.out.println(Objects.toString(obj));        // "null"
System.out.println(Objects.toString(obj, "默认值")); // "默认值"
```

这个方法适合在日志打印、调试输出时快速兜底。

---

## 8. 一张更实用的常用方法速查表

| 分类 | 常用方法 | 主要用途 |
| --- | --- | --- |
| `Math` | `abs`、`max`、`min`、`round`、`floor`、`ceil`、`sqrt`、`pow` | 数学计算 |
| `Runtime` | `availableProcessors`、`maxMemory`、`totalMemory`、`freeMemory`、`exec`、`exit` | JVM 运行信息与进程操作 |
| `Object` | `toString`、`equals`、`hashCode`、`getClass`、`clone` | 对象基础能力 |
| `Objects` | `equals`、`isNull`、`nonNull`、`requireNonNull`、`toString`、`hash` | 判空、安全比较、辅助构造 |

这张表你不用一次全背，
但至少要形成一种“看到场景先联想到哪一类方法”的感觉。

---

## 9. 一个综合示例：把这些方法串起来看

```java
import java.util.Objects;

public class CommonMethodDemo {
    public static void main(String[] args) {
        int score = -88;
        System.out.println("绝对值: " + Math.abs(score));
        System.out.println("平方根: " + Math.sqrt(16));
        System.out.println("向上取整: " + Math.ceil(3.14));

        Runtime runtime = Runtime.getRuntime();
        System.out.println("CPU核心数: " + runtime.availableProcessors());
        System.out.println("JVM最大内存: " + runtime.maxMemory());

        String a = null;
        String b = "hello";
        System.out.println("安全比较: " + Objects.equals(a, b));
        System.out.println("是否为空: " + Objects.isNull(a));

        User user = new User("张三", 20);
        System.out.println(user.toString());
    }

    static class User {
        private final String name;
        private final int age;

        public User(String name, int age) {
            this.name = name;
            this.age = age;
        }

        @Override
        public String toString() {
            return "User{name='" + name + "', age=" + age + "}";
        }
    }
}
```

这个例子不是为了炫 API，
而是让你看到：

- 这些“常用方法”在真实代码里经常一起出现
- 它们分别解决的是不同层面的基础问题

---

## 10. 常见误区与易错点

### 10.1 把别的语言方法表直接搬到 Java

你原文件里那种：

- `sign`
- `trunc`
- `mix`
- `exp2`
- `log2`

这类写法很像别的语言、图形着色器或数学库风格，
但并不是 Java `Math` 最典型、最标准的入门方法集合。

学习 Java 时一定要注意：

- 不同语言的标准库命名和覆盖范围并不一样

不要混着记。

---

### 10.2 以为 `freeMemory()` 是系统剩余内存

不是。

它只是 JVM 当前已申请内存里的空闲部分。

如果你要看整个机器的资源使用，
那是另外一个层面的问题。

---

### 10.3 只重写 `equals()`，不重写 `hashCode()`

这是集合类里最经典的坑之一。

只要对象要进入：

- `HashSet`
- `HashMap`

就一定要高度重视这个规则。

---

### 10.4 `clone()` 以为一定是深拷贝

不是。

默认语义更接近“对象字段值复制”，
如果字段里还有引用对象，那通常只是浅层复制引用。

所以不要把 `clone()` 想成“万无一失的完整复制”。

---

### 10.5 只会死记方法，不会结合场景

比如：

- 需要空值安全比较，就该想到 `Objects.equals`
- 需要非空断言，就该想到 `Objects.requireNonNull`
- 需要看 JVM 可用 CPU，就该想到 `Runtime.getRuntime().availableProcessors()`

学习这些方法，关键不是背表，
而是建立“场景 → 工具”的映射。

---

## 11. 奇淫技巧

### 11.1 判空比较优先写成 `Objects.equals(a, b)`

尤其是字符串、包装类、业务对象比较时，
这能显著减少空指针风险。

### 11.2 打日志时优先重写 `toString()`

很多排查效率低，不是因为日志少，
而是因为日志打印出来全是对象地址。

只要是高频业务对象，尽早把 `toString()` 写好，收益很大。

### 11.3 看并发配置前先打印 `availableProcessors()`

线程池大小、并发任务数、压测参数等，
很多时候都和可用处理器数量有关。

在写工具程序或排查性能问题时，这个值非常有参考意义。

### 11.4 参数校验可以先用 `requireNonNull` 卡死非法输入

这样问题会暴露得更早，
比让空指针在后面某个深层方法里炸掉更好排查。

---

## 12. 一句话总结

Java 常用方法真正重要的不是“背下来多少个”，而是你能不能在合适的场景里，迅速想到 `Math`、`Runtime`、`Object`、`Objects` 这些基础工具，并且知道它们分别解决什么问题。