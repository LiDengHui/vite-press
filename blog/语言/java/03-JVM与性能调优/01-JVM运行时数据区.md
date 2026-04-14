# JVM运行时数据区

## 1. 这是什么

JVM 运行时数据区描述了 Java 程序在执行时会使用哪些内存区域。  
这是理解对象分配、线程执行、类加载和 GC 的基础地图。

一句话理解：

- 如果你把 JVM 看成一台运行中的工厂
- 运行时数据区就是这台工厂里的不同工作区

## 2. 为什么重要

很多线上问题都会落到某个具体区域上，例如：

- 堆内存不足导致 `OutOfMemoryError`
- 递归过深导致 `StackOverflowError`
- 元空间不足导致类元数据相关 OOM

只有先把内存分区理清，后面的 JVM 分析、GC 理解和排障才有抓手。

## 3. 先建立直觉：不要把 JVM 内存只理解成“堆和栈”

很多人初学时会把 JVM 内存简单理解成：

- 堆
- 栈

这不算完全错，但远远不够。  
更完整的运行时数据区通常包括：

- 程序计数器
- Java 虚拟机栈
- 本地方法栈
- 堆
- 方法区 / 元空间

另外工程中还常会提到：

- 直接内存

它不是 JVM 规范里最核心的运行时数据区之一，但经常和性能问题一起出现，所以也值得顺手认识。

## 4. 核心内容

### 4.1 线程私有和线程共享怎么区分

先抓住一个最重要的分类：

| 区域 | 是否线程私有 |
| --- | --- |
| 程序计数器 | 是 |
| Java 虚拟机栈 | 是 |
| 本地方法栈 | 是 |
| 堆 | 否，线程共享 |
| 方法区 / 元空间 | 否，线程共享 |

这个分类非常重要，因为它直接影响：

- 多线程之间会不会互相看到
- 出问题时是单线程局部问题，还是全局共享问题

### 4.2 程序计数器

程序计数器可以理解成：

- 当前线程下一条将要执行的字节码指令位置指示器

它的价值在于：

- 线程切换回来时，知道自己执行到哪里了

为什么它是线程私有的：

- 因为每个线程执行位置都不同

你平时几乎不会直接操作它，但它是线程能正常切换和恢复执行的基础。

### 4.3 Java 虚拟机栈

虚拟机栈是线程执行 Java 方法时使用的栈结构。  
每次方法调用，都会创建一个栈帧。

栈帧里常见会保存：

- 局部变量表
- 操作数栈
- 动态链接信息
- 方法返回信息

理解重点：

- 方法调用得越深，栈会越深
- 递归过深可能导致 `StackOverflowError`

### 4.4 本地方法栈

本地方法栈和虚拟机栈很像，但它服务的是：

- Native 方法

也就是：

- 不是直接由 Java 字节码实现的方法
- 而是通过 JNI 等机制调用的本地代码

日常业务开发里你不会频繁直接感知它，但在理解 JVM 与本地能力交互时它很重要。

### 4.5 堆

堆是 JVM 中最常被提及的内存区域。  
它通常用于存放：

- 对象实例
- 数组

这是 GC 最主要关注的区域。

理解重点：

- 堆是线程共享的
- 对象大多在这里分配
- 垃圾回收大多围绕它进行

为什么它最常出问题：

- 因为对象创建频繁
- 生命周期复杂
- 容量配置和回收策略都会影响它

### 4.6 方法区与元空间

方法区可以理解成存放类相关元信息的区域。  
在较新的 HotSpot 实现里，大家更常提“元空间（Metaspace）”。

这里通常会关联这些内容：

- 类的结构信息
- 运行时常量池
- 方法信息
- 字段信息
- 静态变量的类级描述语义

注意一个容易混淆的点：

- “静态变量本身的概念归属”常和类元数据绑定
- 但具体实现细节会和 JVM 版本有关

学习阶段更重要的是记住：

- 它和“类的元数据”强相关
- 大量类加载、动态生成类、类加载器泄漏时，很容易把这里打满

### 4.7 直接内存

直接内存经常在 NIO 场景里出现，例如：

- `ByteBuffer.allocateDirect`

它的特点是：

- 不直接位于 Java 堆中
- 但同样会占用进程内存

所以工程里常会出现这种误区：

- 堆没满，为什么进程还是内存高

答案可能就在直接内存。

## 5. 每个区域最容易关联什么问题

| 区域 | 更容易关联的问题 |
| --- | --- |
| 程序计数器 | 一般业务层面很少直接作为故障焦点 |
| 虚拟机栈 | `StackOverflowError`、线程过多导致栈内存压力 |
| 本地方法栈 | 本地方法调用相关问题 |
| 堆 | Java 堆 OOM、频繁 GC、对象膨胀 |
| 方法区 / 元空间 | `Metaspace` OOM、类加载过多、类加载器泄漏 |
| 直接内存 | NIO 相关内存高、进程内存高但堆不高 |

这张表在排障时特别有用，因为它能帮你快速建立“现象 -> 区域”的映射。

## 6. 学习重点

这一章真正要掌握的是：

- 每个区域主要存什么
- 哪些区域是线程私有，哪些是线程共享
- 常见异常和问题通常落在哪个区域
- 堆不是 JVM 内存的全部
- 元空间和直接内存也可能成为瓶颈

## 7. 常见问题

### 7.1 只背概念，不知道问题会落在哪个区域

这样一到线上就会变成：

- 只知道“JVM 内存有问题”
- 但不知道先看堆、栈、元空间还是直接内存

### 7.2 混淆堆、栈、方法区的职责

这是最常见的基础性误区。

### 7.3 把方法区和堆完全等同

它们都和内存有关，但职责不同：

- 堆更偏对象实例
- 方法区 / 元空间更偏类元信息

## 8. 动手验证

这一节可以直接复制运行，边看边验证。

### 8.1 准备一个可运行示例

新建文件 `JvmRuntimeAreaDemo.java`，内容如下：

```java
import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.List;

public class JvmRuntimeAreaDemo {
    private static int staticCounter = 42;

    public static void main(String[] args) {
        Object obj = new Object();
        int localValue = 123;

        Runtime runtime = Runtime.getRuntime();
        long maxHeapMb = runtime.maxMemory() / 1024 / 1024;
        long totalHeapMb = runtime.totalMemory() / 1024 / 1024;
        long freeHeapMb = runtime.freeMemory() / 1024 / 1024;

        System.out.println("mainThreadName=" + Thread.currentThread().getName());
        System.out.println("localValue=" + localValue);
        System.out.println("objectClass=" + obj.getClass().getName());
        System.out.println("staticCounter=" + staticCounter);
        System.out.println("maxHeapMb=" + maxHeapMb);
        System.out.println("totalHeapMb=" + totalHeapMb);
        System.out.println("freeHeapMb=" + freeHeapMb);

        List<byte[]> heapObjects = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            heapObjects.add(new byte[1024 * 1024]);
        }
        System.out.println("heapObjectsMb=" + heapObjects.size());

        ByteBuffer directBuffer = ByteBuffer.allocateDirect(2 * 1024 * 1024);
        System.out.println("directBufferCapacityMb=" + directBuffer.capacity() / 1024 / 1024);

        try {
            recurse(0);
        } catch (StackOverflowError e) {
            System.out.println("stackOverflowCaptured=true");
        }
    }

    private static void recurse(int depth) {
        if (depth % 5000 == 0) {
            // 让递归更容易被观察，不影响演示目的
        }
        recurse(depth + 1);
    }
}
```

### 8.2 编译并运行

```bash
javac JvmRuntimeAreaDemo.java
java JvmRuntimeAreaDemo
```

如果你担心机器内存波动影响观察，也可以显式指定堆大小：

```bash
java -Xms64m -Xmx64m JvmRuntimeAreaDemo
```

### 8.3 你应该观察到什么

输出不一定逐字完全一致，但应包含这些关键信息：

```text
mainThreadName=main
localValue=123
objectClass=java.lang.Object
staticCounter=42
maxHeapMb=...
totalHeapMb=...
freeHeapMb=...
heapObjectsMb=5
directBufferCapacityMb=2
stackOverflowCaptured=true
```

### 8.4 每一行在验证什么

- `localValue=123`：可结合概念理解为方法执行时的局部变量属于栈帧语义
- `objectClass=java.lang.Object`：说明对象实例由堆中分配管理这一条主线来理解
- `staticCounter=42`：说明类级数据和类元信息概念相关
- `maxHeapMb`、`totalHeapMb`、`freeHeapMb`：说明堆容量是可观察、可配置的
- `heapObjectsMb=5`：说明堆里确实在承载对象和数组分配
- `directBufferCapacityMb=2`：说明直接内存虽然不在堆里，但同样可被程序显式申请
- `stackOverflowCaptured=true`：说明深度递归会打满线程栈，触发栈溢出

### 8.5 再做两个延伸验证

你可以继续做下面两个实验：

1. 用更小的堆运行，例如 `-Xmx16m`
2. 把递归方法改成普通循环

你可以观察：

- 堆容量变化会影响对象分配余量
- 栈溢出问题和递归深度强相关，不是“对象太多”导致的

## 9. 练习建议

下面这些练习做完，这一章会更扎实：

- 画一张 JVM 运行时数据区结构图
- 列出常见异常分别对应哪个区域
- 用自己的话解释“为什么线程栈是私有的，而堆是共享的”
- 对比堆 OOM、元空间 OOM、栈溢出的触发条件

## 10. 自测问题

- JVM 运行时数据区有哪些核心区域？
- 哪些区域是线程共享的，哪些是线程私有的？
- 堆 OOM、栈溢出、元空间问题通常分别和哪些区域有关？
- 为什么直接内存问题可能出现“堆不高但进程内存很高”？

## 11. 自测核对要点

如果你的回答能覆盖下面这些点，说明这一章基本掌握到位了：

- 程序计数器、虚拟机栈、本地方法栈是线程私有的
- 堆和方法区 / 元空间是线程共享的
- 堆主要承载对象实例，GC 重点围绕它展开
- 虚拟机栈与方法调用深度和栈溢出密切相关
- 方法区 / 元空间和类元数据密切相关
- 直接内存虽然不等于堆，但同样会影响进程内存表现

