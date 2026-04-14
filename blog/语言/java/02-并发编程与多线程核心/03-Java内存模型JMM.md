# Java内存模型JMM

## 1. 这是什么

JMM 是 Java 用来描述线程之间如何共享变量、保证可见性和有序性的内存模型。  
它不是物理内存结构，而是一套并发语义规范。

一句话理解：

- JMM 不告诉你内存芯片怎么长
- 它告诉你“多线程下，哪些读写结果是合法的，哪些保证是成立的”

## 2. 为什么重要

如果不理解 JMM，很多并发现象只能靠背答案，例如：

- 为什么一个线程明明改了值，另一个线程却看不到
- 为什么代码顺序写得很正常，运行结果却不符合直觉
- 为什么 `volatile`、`synchronized`、锁、线程启动和结束都能建立可见性关系

理解了 JMM，你才能真正看懂：

- 可见性
- 有序性
- happens-before
- 指令重排序
- 内存屏障

## 3. 先建立直觉：JMM 到底在解决什么

多线程共享变量时，最容易出现三个问题：

| 问题 | 含义 |
| --- | --- |
| 原子性 | 一个操作会不会被拆开 |
| 可见性 | 一个线程的修改，另一个线程是否能及时看到 |
| 有序性 | 执行结果是否符合我们推理时依赖的先后顺序 |

JMM 重点关注的是：

- 可见性
- 有序性
- 在多线程推理里什么顺序可以被认为“先发生”

## 4. 核心内容

### 4.1 主内存和工作内存怎么理解

JMM 里常见的抽象是：

- 主内存：共享变量的“公共可见位置”
- 工作内存：线程对共享变量进行读写时使用的本地副本抽象

注意：

- 这里的“工作内存”不是你在 JVM 参数里能直接看到的一块真实命名内存
- 它是为了描述并发读写语义而做的抽象模型

理解重点：

- 线程操作共享变量时，不一定总是直接对主内存现场读写
- 这也是“一个线程改了值，另一个线程没马上看到”的语义来源

### 4.2 原子性、可见性、有序性分别是什么

#### 原子性

一个操作要么完整执行，要么不执行到一半被别人插进来。

#### 可见性

一个线程修改共享变量后，其他线程能及时看到这个修改。

#### 有序性

程序执行结果是否符合并发语义允许的先后顺序。

最关键的是：

- 单线程看上去“顺序正确”
- 多线程下未必就有你以为的顺序保证

### 4.3 指令重排序为什么会存在

为了提升性能，编译器和处理器可能会对指令顺序做优化调整。  
只要在单线程语义下不改变结果，这种调整通常是允许的。

问题在于：

- 单线程没问题
- 多线程共享变量时，另一个线程可能观察到不符合直觉的顺序

所以：

- 并发程序不能只按“源码从上到下”来推理
- 必须看 JMM 是否建立了足够的顺序保证

### 4.4 happens-before 是什么

happens-before 可以理解成：

- 一种并发推理规则
- 用来判断一个操作的结果，对另一个操作是否必须可见、顺序是否必须成立

它不是“时间上一定先发生”，而是“语义上你可以把它当成先发生”。

这是 JMM 里最重要的规则之一。

### 4.5 常见 happens-before 规则

最常用、最值得掌握的几个规则：

- 程序次序规则：单线程内，前面的操作 happens-before 后面的操作
- `volatile` 变量规则：对一个 `volatile` 变量的写，happens-before 后续对它的读
- 锁规则：解锁 happens-before 后续同一把锁的加锁
- 线程启动规则：`Thread.start()` 之前的操作，对新线程可见
- 线程终止规则：线程中的操作，在其他线程成功 `join()` 后对其可见

这几条已经足够支撑你分析大量并发代码。

### 4.6 `volatile` 为什么能建立可见性

`volatile` 的核心作用是：

- 写入后强制把结果对其他线程可见
- 读时强制读取最新结果
- 限制某些关键重排序

所以常见模式是：

```java
data = 42;
ready = true; // ready 是 volatile
```

另一个线程：

```java
while (!ready) {}
System.out.println(data);
```

如果 `ready` 是 `volatile`，那么当线程看到 `ready == true` 时，也能看到之前对 `data` 的写入结果。

### 4.7 `synchronized` 为什么也能建立可见性

很多人以为 `synchronized` 只负责互斥，其实它还建立了内存语义：

- 线程退出同步块时，会把修改刷新出去
- 线程进入同步块时，会读取可见的最新值

所以：

- `synchronized` 同时解决互斥和可见性问题

### 4.8 内存屏障是做什么的

内存屏障可以先理解成：

- 一种约束读写顺序和可见性的底层机制

你写 Java 时通常不会直接手动发内存屏障指令，  
但很多并发工具背后都会依赖它，例如：

- `volatile`
- 锁
- 原子类

工程上更重要的是理解“为什么会有这个机制”，而不是死记具体屏障类型。

## 5. 学习重点

这一章最重要的不是背概念，而是建立正确推理方式：

- 线程共享变量时，不要只看源码顺序
- 先判断有没有 happens-before 关系
- `volatile`、锁、线程启动和结束，都会建立关键可见性保证
- JMM 是并发语义规范，不是硬件结构图

## 6. 常见问题

### 6.1 只背 happens-before 条目，不理解应用

真正有用的是：

- 看代码时能判断哪里建立了可见性和顺序保证

### 6.2 把 JMM 当作 JVM 某个具体实现细节

JMM 更像语言层面的并发语义规则，而不是某个 HotSpot 私有技巧。

### 6.3 对可见性问题缺少实际感知

很多人直到线上遇到“线程一直不退出”“读到旧值”才意识到可见性问题真的存在。

### 6.4 把 `volatile` 当作万能并发工具

它很重要，但不负责复合操作原子性，也不负责替代锁。

## 7. 动手验证

这一节可以直接复制运行，边看边验证。

### 7.1 准备一个可运行示例

新建文件 `JmmDemo.java`，内容如下：

```java
public class JmmDemo {
    private static int startRuleValue = 0;
    private static int joinRuleValue = 0;
    private static int data = 0;
    private static volatile boolean ready = false;
    private static int syncValue = 0;
    private static boolean syncReady = false;

    public static void main(String[] args) throws Exception {
        startRuleValue = 7;
        Thread startReader = new Thread(() ->
                System.out.println("startRuleObserved=" + startRuleValue));
        startReader.start();
        startReader.join();

        Thread worker = new Thread(() -> joinRuleValue = 99);
        worker.start();
        worker.join();
        System.out.println("joinRuleObserved=" + joinRuleValue);

        Thread volatileReader = new Thread(() -> {
            while (!ready) {
                // spin
            }
            System.out.println("volatileObservedData=" + data);
        });
        volatileReader.start();
        Thread.sleep(100);
        data = 42;
        ready = true;
        volatileReader.join();

        final Object lock = new Object();
        Thread syncWriter = new Thread(() -> {
            synchronized (lock) {
                syncValue = 100;
                syncReady = true;
            }
        });
        Thread syncReader = new Thread(() -> {
            while (true) {
                synchronized (lock) {
                    if (syncReady) {
                        System.out.println("synchronizedObservedValue=" + syncValue);
                        return;
                    }
                }
            }
        });
        syncReader.start();
        syncWriter.start();
        syncWriter.join();
        syncReader.join();
    }
}
```

### 7.2 编译并运行

```bash
javac JmmDemo.java
java JmmDemo
```

如果你在 PowerShell 中操作，也直接执行同样两条命令即可。

### 7.3 你应该观察到什么

输出不一定逐字完全一致，但应包含这些关键信息：

```text
startRuleObserved=7
joinRuleObserved=99
volatileObservedData=42
synchronizedObservedValue=100
```

### 7.4 每一行在验证什么

- `startRuleObserved=7`：说明 `Thread.start()` 之前的写入，对新线程可见
- `joinRuleObserved=99`：说明线程结束前的写入，在 `join()` 之后对其他线程可见
- `volatileObservedData=42`：说明 `volatile` 写读之间建立了关键可见性与顺序保证
- `synchronizedObservedValue=100`：说明锁的释放与获取之间也能建立可见性关系

### 7.5 再做两个延伸验证

你可以继续做下面两个实验：

1. 去掉 `ready` 上的 `volatile`
2. 把 `syncReader` / `syncWriter` 的同步块去掉

你可以观察：

- 可见性和顺序保证会变得不再可靠
- 结果可能正确，也可能异常，这正是并发 bug 难定位的地方

## 8. 练习建议

下面这些练习做完，这一章会更扎实：

- 画一张主内存与工作内存的抽象示意图
- 把 `volatile`、锁、`start`、`join` 分别对应到 happens-before 规则上
- 写一个共享标志位实验，观察有无 `volatile` 的差异
- 用自己的话解释为什么单线程正确不代表并发正确

## 9. 自测问题

- JMM 主要解决哪些并发问题？
- happens-before 为什么重要？
- 指令重排序为什么可能导致错误结果？
- `volatile` 为什么既影响可见性，也影响有序性？
- 为什么锁也能带来可见性保证？

## 10. 自测核对要点

如果你的回答能覆盖下面这些点，说明这一章基本掌握到位了：

- JMM 是并发语义规范，不是物理内存布局
- 它重点处理可见性、有序性以及并发推理规则
- happens-before 是分析并发正确性的核心工具
- `volatile`、锁、`start()`、`join()` 都会建立关键可见性保证
- 指令重排序本身不是 bug，但在缺少同步约束时会让并发结果失去可预测性

