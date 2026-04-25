# 并发关键字与CAS

## 1. 这是什么

`synchronized`、`volatile` 和 CAS 是 Java 并发里最基础也最核心的三类机制。  
它们分别对应互斥、可见性和无锁更新等关键问题。

一句话理解：

- `synchronized` 重点解决“同一时刻谁能进来”
- `volatile` 重点解决“线程能不能看到最新值”
- CAS 重点解决“更新时如果值没变，我就原子地改掉它”

## 2. 为什么重要

很多线程安全问题，最终都绕不开这三个概念。  
如果不理解它们的边界，就很容易出现这种错觉：

- 我用了 `volatile`，所以线程安全了
- 我用了 CAS，所以性能一定更好
- 我用了 `synchronized`，所以所有并发问题都结束了

实际上，这三种机制关注的问题层次不同：

- 原子性
- 可见性
- 有序性
- 互斥访问

它们不是互相替代关系。

## 3. 先建立直觉：并发问题到底分哪几类

在并发编程里，最常见的三个核心问题是：

| 问题   | 含义                                     |
| ------ | ---------------------------------------- |
| 原子性 | 一个操作会不会被拆开，中间被别人插进来   |
| 可见性 | 一个线程改了值，另一个线程能不能及时看到 |
| 有序性 | 代码执行顺序在并发语义上是否符合预期     |

这张表是理解本章的关键，因为：

- `volatile` 主要解决可见性和部分有序性
- `synchronized` 解决互斥，也能建立可见性保证
- CAS 解决的是基于比较交换的原子更新

## 4. 核心内容

### 4.1 `synchronized` 在解决什么

`synchronized` 最直接的能力是：

- 同一时刻只允许一个线程进入受保护的临界区

这叫互斥。

但它不仅仅是“加锁”这么简单，还会带来：

- 进入同步块前，从主内存读取共享变量的最新值
- 退出同步块时，把修改刷新出去

所以它同时也能帮助建立可见性语义。

常见用法有三种：

- 修饰实例方法
- 修饰静态方法
- 修饰代码块

注意：

- 锁住的到底是谁，取决于你同步的对象是什么

### 4.2 `volatile` 在解决什么

`volatile` 的核心价值是：

- 保证一个线程写入的值，其他线程能及时看到
- 禁止特定场景下的指令重排序

适合的典型场景：

- 状态位
- 开关变量
- 配置刷新标记
- 单次写入、多次读取的轻量共享变量

### 4.3 `volatile` 不能解决什么

它最容易被误用在这里：

```java
volatile int count = 0;
count++;
```

问题在于：

- `count++` 不是一个原子操作
- 它至少包含“读 -> 加 1 -> 写回”三个步骤

即使 `count` 是 `volatile`：

- 每一步对别的线程可见
- 但整组动作仍然可能被其他线程插入

所以：

- `volatile` 不能保证复合操作原子性

### 4.4 CAS 是什么

CAS 是 Compare-And-Swap，比较并交换。

它的思想可以概括为：

1. 先拿到当前值
2. 判断当前值是否还是我预期的旧值
3. 如果是，就原子地改成新值
4. 如果不是，说明有人抢先改了，那就重试

这是一种典型的乐观并发思路：

- 先假设冲突不大
- 冲突发生时再重试

### 4.5 CAS 常见落地方式

Java 里最常见的 CAS 使用入口是原子类，例如：

- `AtomicInteger`
- `AtomicLong`
- `AtomicReference`

示意：

```java
AtomicInteger count = new AtomicInteger(0);
count.incrementAndGet();
count.compareAndSet(1, 2);
```

### 4.6 CAS 的优点和代价

优点：

- 不一定需要传统阻塞锁
- 在低冲突场景下效率往往较好

代价：

- 自旋重试会消耗 CPU
- 高冲突场景下可能退化
- 只能解决适合原子更新的问题
- 会遇到 ABA 等进阶问题

### 4.7 什么是 ABA 问题

ABA 问题可以先这样理解：

- 某个线程看到值是 `A`
- 它准备把 `A` 改成 `B`
- 这期间别的线程把 `A` 改成了 `C`，又改回了 `A`
- 当前线程再做 CAS 时，会以为“值没变过”

但实际上，中间已经发生过变化。

这就是为什么有些场景里需要：

- 版本号
- 时间戳
- `AtomicStampedReference`

来辅助判断。

## 5. 学习重点

这一章最重要的不是记术语，而是下面几个判断：

- 互斥、可见性、原子性不是同一件事
- `volatile` 适合状态可见，不适合复合更新
- `synchronized` 不只是互斥，还提供可见性保证
- CAS 不是“零成本无敌方案”，它只是另一种并发控制思路
- 原子类背后大量依赖 CAS

## 6. 常见问题

### 6.1 用 `volatile` 解决所有并发问题

这是最常见误区。  
`volatile` 很重要，但它不是万能锁。

### 6.2 把 CAS 当作“完全没有代价”的方案

CAS 没有传统阻塞，不代表没有代价。  
高冲突下自旋会持续占用 CPU。

### 6.3 不理解 `synchronized` 的实际作用范围

很多 bug 不是因为没加锁，而是：

- 锁对象不一致
- 临界区划错
- 共享变量不在锁保护范围内

## 7. 动手验证

这一节可以直接复制运行，边看边验证。

### 7.1 准备一个可运行示例

新建文件 `KeywordCasDemo.java`，内容如下：

```java
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.atomic.AtomicInteger;

public class KeywordCasDemo {
    private static volatile boolean running = true;
    private static volatile int volatileCount = 0;
    private static int syncCount = 0;

    private static synchronized void syncIncrement() {
        syncCount++;
    }

    public static void main(String[] args) throws Exception {
        Thread visibilityThread = new Thread(() -> {
            while (running) {
                // busy wait
            }
        });
        visibilityThread.start();
        Thread.sleep(100);
        running = false;
        visibilityThread.join(1000);
        System.out.println("volatileVisibilityWorked=" + !visibilityThread.isAlive());

        CountDownLatch ready = new CountDownLatch(2);
        CountDownLatch go = new CountDownLatch(1);
        Thread t1 = new Thread(() -> {
            try {
                int local = volatileCount;
                ready.countDown();
                go.await();
                volatileCount = local + 1;
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });
        Thread t2 = new Thread(() -> {
            try {
                int local = volatileCount;
                ready.countDown();
                go.await();
                volatileCount = local + 1;
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });
        t1.start();
        t2.start();
        ready.await();
        go.countDown();
        t1.join();
        t2.join();
        System.out.println("volatileCountAfterTwoIncrements=" + volatileCount);

        Thread s1 = new Thread(KeywordCasDemo::syncIncrement);
        Thread s2 = new Thread(KeywordCasDemo::syncIncrement);
        s1.start();
        s2.start();
        s1.join();
        s2.join();
        System.out.println("syncCountAfterTwoIncrements=" + syncCount);

        AtomicInteger atomic = new AtomicInteger(0);
        boolean firstCas = atomic.compareAndSet(0, 1);
        boolean secondCas = atomic.compareAndSet(0, 2);
        System.out.println("firstCasSuccess=" + firstCas);
        System.out.println("secondCasSuccess=" + secondCas);
        System.out.println("atomicValue=" + atomic.get());
    }
}
```

### 7.2 编译并运行

```bash
javac KeywordCasDemo.java
java KeywordCasDemo
```

如果你在 PowerShell 中操作，也直接执行同样两条命令即可。

### 7.3 你应该观察到什么

输出不一定逐字完全一致，但应包含这些关键信息：

```text
volatileVisibilityWorked=true
volatileCountAfterTwoIncrements=1
syncCountAfterTwoIncrements=2
firstCasSuccess=true
secondCasSuccess=false
atomicValue=1
```

### 7.4 每一行在验证什么

- `volatileVisibilityWorked=true`：说明 `volatile` 确实能让其他线程看见最新状态
- `volatileCountAfterTwoIncrements=1`：说明 `volatile` 不能保证复合操作原子性
- `syncCountAfterTwoIncrements=2`：说明 `synchronized` 能保证互斥更新
- `firstCasSuccess=true`、`secondCasSuccess=false`：说明 CAS 的语义是“只有旧值仍匹配时才更新成功”
- `atomicValue=1`：说明 CAS 成功后共享值已经原子更新

### 7.5 再做两个延伸验证

你可以继续做下面两个实验：

1. 把 `volatile` 去掉，再多运行几次可见性示例
2. 把 `syncIncrement` 改成普通 `syncCount++`

你可以观察：

- 可见性问题会变得不可预测
- 没有互斥保护时，复合更新会更容易出错

## 8. 练习建议

下面这些练习做完，这一章会更扎实：

- 写一个错误计数器和正确计数器对比实验
- 分别用 `synchronized` 和原子类实现累加
- 观察高冲突下 CAS 重试的表现
- 用 `AtomicStampedReference` 了解 ABA 问题的处理思路

## 9. 自测问题

- `volatile` 能解决什么问题，不能解决什么问题？
- CAS 和锁的核心差异是什么？
- 为什么 `synchronized` 不仅仅是“加锁”这么简单？
- 在什么场景下更适合使用原子类而不是粗粒度锁？
- ABA 问题为什么会出现？

## 10. 自测核对要点

如果你的回答能覆盖下面这些点，说明这一章基本掌握到位了：

- `volatile` 主要解决可见性和部分有序性，不解决复合操作原子性
- `synchronized` 既提供互斥，也建立可见性保证
- CAS 是基于比较交换的原子更新机制
- 原子类大量依赖 CAS
- CAS 适合低冲突场景，高冲突下自旋重试会带来成本
