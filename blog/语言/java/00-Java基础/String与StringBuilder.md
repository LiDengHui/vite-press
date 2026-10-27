---
tags:
  - Java
  - Java基础
  - 后端
  - String
  - 数据类型
---

# String 与 StringBuilder 的区别

## 1. 这是什么

在 Java 里，`String`、`StringBuilder`、`StringBuffer` 都和字符串处理有关，
但它们不是一回事。

如果只先记最核心的一句话，可以记成：

- `String`：**不可变字符串**
- `StringBuilder`：**可变字符串，适合频繁修改和拼接**
- `StringBuffer`：**线程安全版的可变字符串**

很多初学者第一次学到这里，会觉得这不就是“一个能改，一个不能改”吗？

这句话没错，但还不够。

因为真正影响你写代码质量和性能的，不只是“能不能改”，而是：

- 为什么 `String` 要设计成不可变
- 为什么循环拼接字符串时性能会差很多
- 为什么 `StringBuilder` 更适合大量拼接
- 为什么 `StringBuffer` 现在没那么常用

这篇就把这些问题一口气讲清楚。

---

## 2. 为什么重要

字符串是业务代码里最常见的数据之一。

你几乎每天都会写到：

- 日志拼接
- SQL 拼接
- URL 拼接
- 文本处理
- JSON 构造
- 模板组装

如果对 `String` 和 `StringBuilder` 的区别理解不清，最常见的问题有这些：

- 在循环里用 `+` 拼接，性能很差
- 以为 `String` 改了，其实原对象根本没变
- 多线程场景误用 `StringBuilder`
- 比较两个 `StringBuilder` 内容时直接用 `equals`

这些问题都不是“冷门面试题”，
而是日常开发里真会踩到的坑。

---

## 3. 先建立整体直觉

### 3.1 把它们想成三种不同的“文本容器”

你可以先这样理解：

- `String`：一张写好后不能擦改的纸
- `StringBuilder`：一块可以反复追加、删除、改写的白板
- `StringBuffer`：一块带锁的白板，多线程一起写时更安全，但会慢一些

这个比喻非常重要。

因为它直接决定了你写代码时的思维方式：

- 如果文本内容基本不改，用 `String`
- 如果要不断拼接、插入、删除，用 `StringBuilder`
- 如果多个线程要共享并修改同一段文本，再考虑 `StringBuffer`

---

### 3.2 真正的核心不是语法，而是“对象是否会被反复创建”

很多人表面上知道：

- `String` 不可变
- `StringBuilder` 可变

但没有进一步意识到这意味着什么。

意味着：

- `String` 每次“修改”，其实都是创建新对象
- `StringBuilder` 大多数修改，是在原来的可变缓冲区上操作

而这正是性能差异的根源。

---

## 4. `String`：不可变字符串到底是什么意思

### 4.1 不可变，不代表“变量不能重新赋值”

先看一个例子：

```java
String s = "hello";
s = s + " world";
System.out.println(s);
```

很多初学者看到这里会疑惑：

- 这不是改了吗？为什么还说 `String` 不可变？

关键在于：

- **变的是变量 `s` 指向的对象，不是原来的那个字符串对象本身。**

也就是说，上面的过程更准确地说是：

1. 先有一个 `"hello"` 字符串对象
2. 执行 `s + " world"` 时，创建一个新的字符串对象 `"hello world"`
3. 让变量 `s` 重新指向这个新对象

原来的 `"hello"` 并没有被原地修改。

---

### 4.2 为什么 Java 要把 `String` 设计成不可变

这不是随便定的，而是有明确好处。

#### 好处 1：线程安全

因为内容不会变，所以多个线程读取同一个 `String` 对象通常是安全的。

#### 好处 2：可以放进字符串常量池复用

例如：

```java
String a = "java";
String b = "java";
```

这两个变量通常可以共享同一个字符串常量池对象。

如果字符串是可变的，这种复用会非常危险。

#### 好处 3：适合作为哈希键

像 `HashMap<String, Object>` 这种用法之所以稳定，
一个重要原因就是字符串内容不会被偷偷改掉。

如果 key 可变，哈希结构会很容易出问题。

---

## 5. `StringBuilder`：为什么它更适合频繁拼接

`StringBuilder` 的核心价值不是“看起来 API 多一点”，
而是：

- **它内部维护的是一个可扩展的字符缓冲区，可以在原地追加或修改内容。**

例如：

```java
StringBuilder sb = new StringBuilder();
sb.append("hello");
sb.append(" ");
sb.append("world");
System.out.println(sb.toString());
```

它的执行思路不是：

- 每次 append 都创建一个全新的完整字符串对象

而是：

- 尽量在同一个缓冲区里追加字符
- 空间不够时才扩容

所以它特别适合：

- 循环拼接
- 动态构造文本
- 反复插入、删除、替换

---

## 6. 先看最典型的性能差异场景

### 6.1 用 `String` 在循环里拼接

```java
String result = "";
for (int i = 0; i < 5; i++) {
    result += i;
}
System.out.println(result);
```

这段代码表面上很简单，
但底层会不断创建新字符串。

粗略理解一下过程：

- 第一次：`"" + 0` -> 新对象 `"0"`
- 第二次：`"0" + 1` -> 新对象 `"01"`
- 第三次：`"01" + 2` -> 新对象 `"012"`
- ……

也就是说，拼接次数一多，中间对象会非常多。

这会带来两类成本：

- 频繁分配新对象
- 增加 GC 压力

---

### 6.2 用 `StringBuilder` 在循环里拼接

```java
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 5; i++) {
    sb.append(i);
}
String result = sb.toString();
System.out.println(result);
```

这段代码的思路是：

- 循环过程中不断往同一个可变缓冲区追加
- 最后一次性转成 `String`

这才是大量拼接的标准做法。

---

## 7. `StringBuilder` 常用方法

如果你把它当成“字符串编辑器”，很多 API 就很好理解了。

### 7.1 `append`：追加

```java
StringBuilder sb = new StringBuilder("Java");
sb.append(" 入门");
System.out.println(sb); // Java 入门
```

这是最常用的方法。

---

### 7.2 `insert`：插入

```java
StringBuilder sb = new StringBuilder("Jva");
sb.insert(1, "a");
System.out.println(sb); // Java
```

适合在指定位置补内容。

---

### 7.3 `delete`：删除

```java
StringBuilder sb = new StringBuilder("Hello Java");
sb.delete(5, 10);
System.out.println(sb); // Hello
```

注意区间通常是：

- 包含起始下标
- 不包含结束下标

这和很多 Java API 的区间规则一致。

---

### 7.4 `replace`：替换

```java
StringBuilder sb = new StringBuilder("Hello Java");
sb.replace(6, 10, "World");
System.out.println(sb); // Hello World
```

---

### 7.5 `reverse`：反转

```java
StringBuilder sb = new StringBuilder("abc");
sb.reverse();
System.out.println(sb); // cba
```

这个在某些算法题和字符串处理题里很实用。

---

### 7.6 `toString`：转回不可变字符串

```java
StringBuilder sb = new StringBuilder();
sb.append("A").append("B").append("C");
String result = sb.toString();
```

通常使用流程是：

1. 用 `StringBuilder` 构造内容
2. 最后通过 `toString()` 得到最终 `String`

---

## 8. 内存和扩容直觉

### 8.1 `StringBuilder` 不是无限大，它也会扩容

虽然它比 `String` 更适合拼接，
但不代表它内部不用分配内存。

`StringBuilder` 本质上还是维护一段字符数组缓冲区。

当你追加的内容超过当前容量时，它会：

- 创建更大的缓冲区
- 把旧内容复制过去
- 再继续追加

所以它不是“完全零成本”，
只是和不停创建完整新字符串相比，通常更高效。

---

### 8.2 为什么可以提前指定容量

例如：

```java
StringBuilder sb = new StringBuilder(1000);
```

这表示一开始就准备较大的缓冲区。

适合什么场景？

- 你大概知道最终字符串会很长
- 比如批量拼 SQL、导出 CSV、拼接大段日志文本

这样可以减少中途扩容次数。

这属于一个很实用的工程优化点。

---

## 9. `StringBuffer` 又是什么

`StringBuffer` 和 `StringBuilder` 的 API 非常像，
区别的核心在于：

- `StringBuffer` 的很多方法带同步机制
- 因此线程更安全
- 但单线程性能一般不如 `StringBuilder`

可以先粗略记成：

- 单线程频繁拼接：优先 `StringBuilder`
- 多线程共享同一个可变字符串对象：再考虑 `StringBuffer`

但注意，真实项目里很多时候更推荐的做法是：

- 不共享可变对象
- 而不是一上来就靠 `StringBuffer` 加锁兜底

所以 `StringBuffer` 你要知道，但不用把它当主角。

---

## 10. `equals()` 和 `hashCode()` 的区别为什么重要

### 10.1 `String` 比较的是内容

```java
String a = new String("java");
String b = new String("java");

System.out.println(a.equals(b)); // true
```

因为 `String` 重写了 `equals()`，语义是“内容相等”。

---

### 10.2 `StringBuilder` 默认不是按内容比较

```java
StringBuilder a = new StringBuilder("java");
StringBuilder b = new StringBuilder("java");

System.out.println(a.equals(b)); // false
```

很多人第一次看到这个结果会愣住。

原因是：

- `StringBuilder` 没有像 `String` 那样把 `equals()` 重写成“按内容比较”
- 所以这里更接近比较对象引用身份

如果你真的想比较内容，常见做法是：

```java
System.out.println(a.toString().equals(b.toString()));
```

这是一个很典型的易错点。

---

## 11. 什么时候用 `String`，什么时候用 `StringBuilder`

这部分最容易考，也最容易在实际开发中用到。

### 11.1 适合用 `String` 的场景

- 文本内容创建后基本不再变化
- 常量、配置值、枚举说明、字段值
- 少量简单拼接，且更重视可读性
- 需要作为 `Map` key 或频繁做内容比较

例如：

```java
String status = "SUCCESS";
String message = "订单创建成功";
```

这种场景没必要上来就 `StringBuilder`。

---

### 11.2 适合用 `StringBuilder` 的场景

- 在循环中反复拼接字符串
- 需要频繁插入、删除、替换
- 动态构造大文本
- 关注性能和中间对象数量

例如拼接 SQL：

```java
StringBuilder sql = new StringBuilder();
sql.append("select * from user where 1=1 ");
if (name != null) {
    sql.append("and name = ? ");
}
if (age != null) {
    sql.append("and age = ? ");
}
System.out.println(sql);
```

这个场景就非常典型。

---

## 12. 编译器会不会帮你优化 `+`

会，但你不能因此放松警惕。

### 12.1 简单拼接时，编译器通常会做优化

例如：

```java
String s = "hello" + " world";
```

这种简单场景，编译器往往会帮你处理。

甚至一些普通的 `+` 拼接，在编译或运行层也可能转换成更高效的形式。

### 12.2 但在循环里不要赌这种优化

你真正应该记住的是：

> **只要是在循环里大量拼接字符串，直接用 `StringBuilder`。**

这是最稳妥、最清晰的经验法则。

不要一边知道循环拼接是高危点，
一边还心存侥幸想着“JVM 也许会优化”。

工程里要的是稳定的可预期行为。

---

## 13. 一个完整例子：日志文本构造

假设你要把一个用户请求对象拼成日志。

### 写法一：直接用 `String`

```java
String log = "用户ID=" + userId + ", "
        + "订单ID=" + orderId + ", "
        + "状态=" + status;
System.out.println(log);
```

如果只是一次性、少量拼接，这么写完全可以，
可读性也不错。

### 写法二：条件很多时改用 `StringBuilder`

```java
StringBuilder log = new StringBuilder();
log.append("用户ID=").append(userId);

if (orderId != null) {
    log.append(", 订单ID=").append(orderId);
}

if (status != null) {
    log.append(", 状态=").append(status);
}

System.out.println(log.toString());
```

一旦存在：

- 多分支
- 多字段
- 条件拼接

`StringBuilder` 往往更合适。

---

## 14. 常见误区与易错点

### 14.1 以为 `String` 变量变了，就说明原字符串对象被改了

不是。

变的是引用指向，
不是原对象内容。

---

### 14.2 在循环里用 `+` 拼接长字符串

这是最经典、最高频的坑之一。

数据量一大，性能问题会非常明显。

---

### 14.3 误以为 `StringBuilder` 天生线程安全

不是。

- `StringBuilder`：不保证线程安全
- `StringBuffer`：有同步，线程更安全

如果多个线程共享同一个 `StringBuilder` 实例并同时修改，结果可能混乱。

---

### 14.4 用 `equals()` 比较两个 `StringBuilder` 的内容

这往往得不到你想要的结果。

正确思路通常是：

```java
a.toString().equals(b.toString())
```

---

### 14.5 一上来什么都用 `StringBuilder`

也没必要。

如果只是简单常量文本或少量拼接，
直接用 `String` 代码往往更直观。

不要把“知道性能优化”变成“到处过度优化”。

---

## 15. 奇淫技巧

### 15.1 循环拼接一律先想到 `StringBuilder`

这是最值得养成的肌肉记忆。

只要你看到：

- `for`
- `while`
- 批量拼接

就先问自己一句：

- 这里是不是该换成 `StringBuilder`？

### 15.2 大概知道长度时，直接给初始容量

```java
StringBuilder sb = new StringBuilder(1024);
```

在大量文本拼接场景里，这比默认小容量一路扩容更稳。

### 15.3 多次 `append` 可以链式调用

```java
StringBuilder sb = new StringBuilder();
sb.append("name=").append(name)
  .append(", age=").append(age)
  .append(", city=").append(city);
```

这样写既紧凑又清晰，非常适合构造输出文本。

### 15.4 最后一步再 `toString()`

如果你已经决定用 `StringBuilder`，
通常就不要中途频繁转成 `String`。

更自然的流程是：

- 先持续 append
- 最后统一 `toString()` 一次

---

## 16. 一句话总结

`String` 适合表示稳定不变的文本，`StringBuilder` 适合高频修改和拼接的文本；真正要抓住的核心，不是死记“一个可变一个不可变”，而是理解它们背后的对象创建成本、性能差异和适用场景。