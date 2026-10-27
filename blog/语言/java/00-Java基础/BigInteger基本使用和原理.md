---
tags:
  - Java
  - Java基础
  - 后端
  - BigInteger
  - 数据类型
---

# BigInteger 的基本使用与原理

## 1. 这是什么

在 Java 里，`int` 和 `long` 都有固定范围：

- `int` 大约是 ±21 亿
- `long` 大约是 ±9.22e18

这个范围对很多业务代码已经够用了，但一旦遇到下面这些场景，就会不够：

- 超大整数计算
- 高精度计数
- 大数取模
- 密码学运算
- 算法题里的超范围整数

这时候就需要 `BigInteger`。

你先记一句最核心的话：

> **`BigInteger` 用来表示“超出基本整数类型范围的任意精度整数”，代价是性能和内存都比 `int` / `long` 更重。**

它解决的是：

- 数值范围不够

但它不是：

- 所有整数计算都应该默认使用的类型

---

## 2. 为什么重要

初学者常见的误区是：

- 以为 `long` 已经很大了，几乎不会溢出
- 知道有 `BigInteger`，但只会拿来 `new BigInteger("123")`
- 以为它和 `int` 一样直接用 `+ - * /`
- 不理解为什么有时性能会明显变差

如果这些点不搞清楚，就容易出现：

- 明明数值逻辑没问题，却在范围上溢出
- 频繁创建大数对象导致性能变差
- 用错构造方式或比较方式
- 把 `BigInteger` 当成“更大的 long”来机械使用

所以这一篇的重点不是死记 API，
而是建立完整认识：

- 什么时候该用
- 怎么正确用
- 它内部大概是怎么实现的
- 哪些坑最容易踩

---

## 3. 先建立最核心的直觉

### 3.1 为什么 `long` 不够

例如：

```java
long a = 9_223_372_036_854_775_807L; // Long.MAX_VALUE
long b = a + 1;
System.out.println(b);
```

这里不会报错，
但结果已经溢出了。

也就是说，基本整数类型的问题不是：

- 你一眼看得出不够用

而是：

- **它可能悄悄溢出，结果还继续参与后续计算。**

### 3.2 `BigInteger` 的思路是什么

它不是把整数范围简单扩到更大一点，
而是直接换了存储思路：

- 不再依赖单个 32 位或 64 位整数存放全部值
- 而是用多个“块”组合出一个更大的整数

所以你可以把它理解成：

- **“多个整数块拼起来表示一个超大整数”的对象模型**

这就是它能表示任意精度整数的根本原因。

---

## 4. `BigInteger` 怎么创建

最常见的创建方式有 3 类。

## 4.1 通过字符串创建

这是最常用、也最稳妥的方式。

```java
import java.math.BigInteger;

BigInteger a = new BigInteger("123456789012345678901234567890");
BigInteger b = new BigInteger("-999999999999999999999999999999");
```

为什么推荐字符串？

因为：

- 不会先经过 `int` / `long` 的范围限制
- 表意最直接
- 特别适合超大常量

### 什么时候必须用字符串

当这个数已经超过 `long` 范围时，就必须这样写：

```java
BigInteger huge = new BigInteger("9223372036854775808");
```

如果你先写成 `long` 再转，就已经来不及了。

---

## 4.2 通过 `valueOf(long)` 创建

当数值还在 `long` 范围内时，推荐使用：

```java
BigInteger x = BigInteger.valueOf(123L);
BigInteger y = BigInteger.valueOf(-456L);
```

相比 `new BigInteger("123")`，它的优点是：

- 写法简洁
- 不容易因为字符串写错格式
- 对小整数可能有内部常量复用优化

一般规则可以记成：

- 已经是 `long` 范围内的值：优先 `valueOf`
- 超出 `long` 范围的字面量：用字符串构造

---

## 4.3 通过字节数组创建

这个方式一般不是业务入门首选，
更多出现在：

- 编码转换
- 二进制协议
- 密码学场景

```java
byte[] bytes = {0x12, 0x34, 0x56};
BigInteger num = new BigInteger(bytes);
```

这里要特别注意：

- `byte[]` 会按**补码**语义解释
- 最高位可能影响正负号

所以它适合“明确知道自己在做二进制转换”的场景，
不适合初学者日常随便用。

---

## 5. 常用常量

`BigInteger` 内置了几个很常用的常量：

```java
BigInteger zero = BigInteger.ZERO;
BigInteger one = BigInteger.ONE;
BigInteger ten = BigInteger.TEN;
```

这些常量的意义不只是方便，
还避免了重复创建对象。

例如写阶乘时：

```java
BigInteger result = BigInteger.ONE;
```

会比：

```java
BigInteger result = new BigInteger("1");
```

更自然也更常见。

---

## 6. 常用运算方法

`BigInteger` 不是基本类型，
所以不能直接写：

```java
a + b
a * b
```

而是必须调用方法。

### 6.1 加减乘除

```java
BigInteger a = new BigInteger("100");
BigInteger b = new BigInteger("25");

BigInteger sum = a.add(b);        // 125
BigInteger diff = a.subtract(b);  // 75
BigInteger product = a.multiply(b); // 2500
BigInteger quotient = a.divide(b);  // 4
BigInteger remainder = a.remainder(b); // 0
```

这里一定要建立一个习惯：

> **所有运算都会返回新对象，原对象本身不会被修改。**

比如：

```java
BigInteger a = BigInteger.TEN;
a.add(BigInteger.ONE);
System.out.println(a); // 仍然是 10
```

因为 `a.add(...)` 只是返回了一个新对象，
你没有接住它。

正确写法是：

```java
a = a.add(BigInteger.ONE);
```

---

### 6.2 幂、绝对值、取反

```java
BigInteger a = new BigInteger("12");

BigInteger power = a.pow(3);   // 1728
BigInteger abs = a.abs();
BigInteger neg = a.negate();
```

这些方法在算法和数学运算里非常常见。

---

### 6.3 最大公约数

```java
BigInteger a = new BigInteger("100");
BigInteger b = new BigInteger("25");

BigInteger gcd = a.gcd(b); // 25
```

`gcd` 在下面这些场景特别常见：

- 分数约分
- 数论题
- 密码学基础计算

---

### 6.4 比较大小

不能用：

```java
a > b
a == b
```

而应该用：

```java
int cmp = a.compareTo(b);
boolean same = a.equals(b);
```

规则是：

- `compareTo`：比较大小
- `equals`：比较值是否完全相等

例如：

```java
BigInteger a = new BigInteger("100");
BigInteger b = new BigInteger("25");

System.out.println(a.compareTo(b) > 0); // true
System.out.println(a.equals(b));         // false
```

### 为什么不能用 `==`

因为 `BigInteger` 是对象，
`==` 比较的是：

- 是否是同一个对象引用

而不是：

- 数值内容是否相同

例如：

```java
BigInteger x = new BigInteger("100");
BigInteger y = new BigInteger("100");

System.out.println(x == y);      // false
System.out.println(x.equals(y)); // true
```

这是非常高频的坑。

---

## 7. 进制转换与类型转换

### 7.1 转字符串

```java
BigInteger num = new BigInteger("255");

String dec = num.toString();    // "255"
String hex = num.toString(16);  // "ff"
String bin = num.toString(2);   // "11111111"
```

这在下面这些场景很常见：

- 打印结果
- 序列化
- 进制转换

---

### 7.2 转回基本类型

```java
BigInteger num = BigInteger.valueOf(123456789L);

long l = num.longValue();
int i = num.intValue();
```

但这里必须注意：

- 如果 `BigInteger` 的值超出目标类型范围
- 转换后会发生截断或溢出风险

也就是说：

> **从大整数转回基本类型，不代表一定安全。**

如果你明确想做“安全转换”，
就要先判断范围。

例如：

```java
BigInteger num = new BigInteger("999999999999999999999");
System.out.println(num.longValue());
```

这个结果通常已经不是你原本想要的那个数了。

---

## 8. 一个完整示例：计算 100!

阶乘是 `BigInteger` 的经典入门例子，
因为结果很快就会超出 `long` 范围。

```java
import java.math.BigInteger;

public class BigIntegerDemo {
    public static void main(String[] args) {
        BigInteger factorial = BigInteger.ONE;

        for (int i = 1; i <= 100; i++) {
            factorial = factorial.multiply(BigInteger.valueOf(i));
        }

        System.out.println(factorial);
        System.out.println("位数: " + factorial.toString().length());
    }
}
```

这里要注意两个点：

1. `main` 方法必须完整写成 `public static void main(String[] args)`
2. 每一步乘法后都要把结果重新赋值给 `factorial`

这个例子很适合帮你建立直觉：

- `BigInteger` 不是“会自动改自己”
- 它的运算结果要显式接住

---

## 9. 典型应用场景

### 9.1 算法题 / 数学计算

例如：

- 大整数加法
- 大数乘法
- 阶乘
- 组合数
- 高精度取模

这类场景最常见。

### 9.2 密码学

例如：

- RSA
- 大素数生成
- 模幂运算
- 模逆元

因为密码学里经常涉及非常大的整数。

### 9.3 金融或计数类极端场景

这里要稍微谨慎理解。

- **超大整数计数**：适合 `BigInteger`
- **金额小数精度**：通常更常用 `BigDecimal`

也就是说：

- `BigInteger` 更适合“整数型高精度”
- `BigDecimal` 更适合“带小数的高精度”

这一点不要混淆。

---

## 10. 内部原理：为什么它能表示任意大整数

你不用一开始就钻进 JDK 源码细节，
但至少要知道它的大方向。

### 10.1 核心存储思路

`BigInteger` 的内部通常可以粗略理解为两部分：

- 符号位：记录正数、负数还是 0
- 数值数组：用多个 `int` 块保存大整数的“绝对值”

也就是类似这种思路：

- `signum`：记录符号
- `mag`：记录 magnitude（数值大小）

这意味着它并不是把一个超大整数塞进单个变量，
而是拆成很多块来存。

所以从根上说，它和 `int` / `long` 的思路完全不同。

---

### 10.2 为什么这套设计能扩展

因为数组长度本身可以扩展。

- 数字位数越多
- 内部数组就可以更长

所以它的上限不再是“64 位到头”，
而更接近：

- **只要 JVM 内存还能承受，就可以继续表示更大的整数。**

这就是“任意精度”的真正含义。

注意这里的“任意”不是数学意义上的无限，
而是：

- 不受基本类型固定位宽限制
- 实际受内存和性能约束

---

## 11. 运算为什么会比较慢

既然 `BigInteger` 这么强，为什么不能默认全用它？

因为它的代价很明显。

### 11.1 运算不是 CPU 一条指令就能搞定

像 `int + int`，底层往往是很直接的机器级整数运算。

但 `BigInteger` 不一样，
它要做的是：

- 遍历多个整数块
- 处理进位或借位
- 可能分配新数组
- 构造新对象

这就意味着它天然更重。

### 11.2 数字越大，成本越高

对于 `BigInteger` 来说，
运算成本通常和“数字有多长”强相关。

例如：

- 加减法通常要逐块处理
- 乘法更复杂
- 除法更重

所以：

> **`BigInteger` 不是“更大的 long”，而是“更通用但更昂贵的大整数对象”。**

---

## 12. JDK 在内部做了哪些优化

入门阶段你不用死记算法名，
但知道方向会很有帮助。

### 12.1 加减法

本质上类似“手工竖式”的机器化版本：

- 一位一位处理
- 带上进位或借位

### 12.2 乘法

小数值时会用较直接的方法，
更大的数值会切换到更高效的分治算法。

常见会提到：

- 普通乘法
- Karatsuba
- Toom-Cook
- 更高级的大数乘法优化

你不用死背复杂度，
记住结论就行：

- **JDK 会根据数据规模选择更合适的算法，而不是永远用最原始的方法。**

### 12.3 模运算优化

在密码学和大数取模场景里，
JDK 也会使用更适合模运算的优化策略。

这也是为什么 `BigInteger` 不只是“能算大数”，
而且能支撑很多实际工程与算法场景。

---

## 13. 不可变性：为什么它每次都返回新对象

`BigInteger` 是不可变对象。

这意味着：

- 创建后内容不会被原地修改
- 每次运算都会返回新对象

### 13.1 好处是什么

好处包括：

- 线程安全性更好
- 更适合缓存和复用
- 不容易因为共享引用被偷偷改值

### 13.2 代价是什么

代价包括：

- 会创建更多对象
- 大量循环运算时会增加分配压力

所以你要同时记住两件事：

- 不可变对象更安全
- 不可变对象也更容易产生临时对象

---

## 14. 常见问题与易错点

### 14.1 用 `==` 比较大小或相等

错误示例：

```java
BigInteger a = new BigInteger("10");
BigInteger b = new BigInteger("10");

if (a == b) {
    System.out.println("相等");
}
```

这里比较的是引用，不是值。

正确做法：

```java
if (a.equals(b)) {
    System.out.println("相等");
}
```

或者：

```java
if (a.compareTo(b) == 0) {
    System.out.println("相等");
}
```

---

### 14.2 想当然地用 `+ - * /`

`BigInteger` 不是基本类型，
所以不能这么写。

必须调用方法：

- `add`
- `subtract`
- `multiply`
- `divide`

---

### 14.3 忘记接住返回值

错误示例：

```java
BigInteger total = BigInteger.ZERO;
total.add(BigInteger.ONE);
System.out.println(total); // 还是 0
```

正确示例：

```java
total = total.add(BigInteger.ONE);
```

---

### 14.4 把金额精度问题交给 `BigInteger`

如果你处理的是：

- `12.34`
- `999.99`
- 税率、折扣、小数金额

更常见的正确类型是：

- `BigDecimal`

`BigInteger` 只处理整数。

---

### 14.5 从超大值强转回 `int` / `long`

如果没有检查范围，
结果很可能已经失真。

所以只要看到：

- `intValue()`
- `longValue()`

你就要下意识问自己一句：

- 这个值真的还在目标类型范围内吗？

---

## 15. 学这一章最该抓住的 5 个点

1. **`BigInteger` 用来表示任意精度整数，解决的是范围问题**
2. **它是对象，不是基本类型，所以运算靠方法，不靠运算符**
3. **它是不可变对象，每次运算都会返回新对象**
4. **它适合大整数与数论场景，但性能和内存都比基本类型更重**
5. **比较用 `compareTo` / `equals`，不要用 `==`**

只要这 5 个点抓住，
你对 `BigInteger` 的基本使用就已经比较稳了。

---

## 16. 奇淫技巧

### 16.1 循环累乘、累加时先养成“重新赋值”肌肉记忆

看到下面这种写法要形成条件反射：

```java
result = result.multiply(BigInteger.valueOf(i));
```

而不是：

```java
result.multiply(BigInteger.valueOf(i));
```

这是 `BigInteger` 初学者最容易漏掉的点之一。

### 16.2 小整数优先用常量和 `valueOf`

例如：

- `BigInteger.ZERO`
- `BigInteger.ONE`
- `BigInteger.TEN`
- `BigInteger.valueOf(123)`

这样代码更自然，也能减少无意义的对象创建。

### 16.3 一看到“可能爆 long”就立刻切换思路

像下面这些题型或业务特征，几乎要本能想到 `BigInteger`：

- 阶乘
- 斐波那契大项
- 超长整数相乘
- 超大组合数
- 大数模运算

别等结果已经错了再回头补。

---

## 17. 练习建议

- 写一个程序计算 `100!`、`500!`、`1000!` 的位数
- 写一个大整数加法器，输入两个超长字符串输出和
- 比较 `long` 溢出和 `BigInteger` 正确计算的区别
- 再补学一篇 `BigDecimal`，明确“整数高精度”和“小数高精度”的分工

---

## 18. 自测问题

- `BigInteger` 解决的核心问题是什么？
- 为什么它不能直接用 `+ - * /`？
- 为什么 `BigInteger` 运算后通常要重新赋值？
- 比较两个 `BigInteger` 应该用什么方法？
- 为什么说它适合大整数，但不应该默认替代 `long`？

---

## 19. 自测核对要点

- `BigInteger` 的核心价值是表示超出基本类型范围的整数
- 它内部通过“符号 + 多个整数块”的方式表示大数
- 它是不可变对象，因此运算会返回新对象
- 它适合算法、密码学和大整数计算，不适合无脑替代基本类型
- 只要涉及大数比较、累乘、进制转换和范围溢出问题，`BigInteger` 都是高频工具
