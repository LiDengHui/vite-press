# Lock与常见同步器

## 1. 这是什么

除了 `synchronized`，Java 还提供了更灵活的显式锁和同步器。  
这些工具用于解决互斥访问、线程协调、限流控制等问题。

一句话理解：

- 锁更偏向“同一时刻谁能操作共享资源”
- 同步器更偏向“多个线程怎么协调节奏”

## 2. 为什么重要

真实项目中的并发问题，通常不是一个简单互斥就能解决的。  
你经常会遇到这样的需求：

- 一批线程都完成后再继续
- 多个线程到齐后同时出发
- 限制最多只有 N 个线程访问某资源
- 读多写少时降低竞争

这时如果只会 `synchronized`，设计空间会非常受限。

## 3. 先建立直觉：并发工具大致分两类

可以先把本章工具分成两类：

| 类型   | 代表工具                                        | 解决的问题                 |
| ------ | ----------------------------------------------- | -------------------------- |
| 显式锁 | `ReentrantLock`、`ReadWriteLock`、`StampedLock` | 共享资源访问控制           |
| 同步器 | `CountDownLatch`、`CyclicBarrier`、`Semaphore`  | 多线程之间的协作与节奏控制 |

这个分类很重要，因为它能帮你少走很多弯路：

- 不是所有并发问题都该上锁
- 也不是所有“线程配合”都要用 `wait/notify`

## 4. 核心内容

### 4.1 `ReentrantLock`

`ReentrantLock` 是最常用的显式锁之一。  
它和 `synchronized` 一样，都可以做互斥保护，但它更灵活。

常见能力包括：

- 可重入
- 可中断获取锁
- 可尝试获取锁 `tryLock`
- 可选公平锁
- 可以配合 `Condition` 做更细粒度等待唤醒

#### 为什么叫可重入

可重入的意思是：

- 同一个线程已经拿到这把锁后，可以再次进入同一把锁保护的代码

这点和 `synchronized` 一样。

#### 公平锁和非公平锁

- 公平锁：更倾向按等待顺序获得锁
- 非公平锁：允许后来的线程“插队”竞争

一般来说：

- 公平性更强
- 但吞吐不一定更高

默认常用的是非公平锁。

### 4.2 `ReadWriteLock`

读写锁把访问拆成两类：

- 读锁
- 写锁

核心思想是：

- 读和读之间可以并发
- 写和任何操作之间通常互斥

适合：

- 读多写少
- 读操作远多于写操作

如果写操作很多，读写锁未必有优势。

### 4.3 `StampedLock`

`StampedLock` 是更偏性能导向的一类锁，支持：

- 写锁
- 悲观读锁
- 乐观读

它的价值在于：

- 某些读多写少场景下可以进一步降低读开销

但要注意：

- 它不是可重入锁
- 用法也比 `ReentrantReadWriteLock` 更复杂

初学阶段更重要的是先建立概念，而不是强行在业务里使用它。

### 4.4 `CountDownLatch`

`CountDownLatch` 可以理解成倒计时闭锁。

典型用法：

- 主线程等待多个子任务都完成后再继续

核心动作只有两个：

- `countDown()`：计数减一
- `await()`：等待计数归零

它更像：

- “等这一批任务都结束”

### 4.5 `CyclicBarrier`

`CyclicBarrier` 可以理解成循环栅栏。

典型场景：

- 多个线程都到达某个阶段后，再一起进入下一阶段

它和 `CountDownLatch` 的关键区别是：

- `CountDownLatch` 更像“等别人做完”
- `CyclicBarrier` 更像“大家都到了再一起走”

### 4.6 `Semaphore`

`Semaphore` 是信号量，本质上是“许可证计数器”。

典型用法：

- 限制同时访问某资源的线程数
- 实现简单限流
- 控制连接数、并发任务数

你可以把它理解成：

- 一次只发出去 N 张通行证
- 没证的线程就等着

## 5. 学习重点

这一章最重要的不是背 API，而是理解：

- 显式锁比 `synchronized` 更灵活，但也更容易用错
- 读写锁只在合适场景下才有收益
- `CountDownLatch`、`CyclicBarrier`、`Semaphore` 解决的是不同协作问题
- 同步器关注的是线程节奏，不只是资源互斥

## 6. 常见问题

### 6.1 不分场景统一用一种锁

这会让代码要么过度串行化，要么可读性很差。

### 6.2 用读写锁却没有真正读多写少

如果写非常频繁，读写锁的收益会明显下降。

### 6.3 分不清闭锁、栅栏和信号量的职责

这是最常见的概念混淆：

- 闭锁：等别人完成
- 栅栏：大家到齐再一起走
- 信号量：限制同时通过的数量

### 6.4 忘记在 `finally` 中释放锁

`ReentrantLock` 这类显式锁，必须自己负责释放。  
通常写法是：

```java
lock.lock();
try {
    // do work
} finally {
    lock.unlock();
}
```

## 7. 动手验证

这一节可以直接复制运行，边看边验证。

### 7.1 准备一个可运行示例

新建文件 `LockSynchronizerDemo.java`，内容如下：

```java
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.CyclicBarrier;
import java.util.concurrent.Semaphore;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.locks.ReentrantLock;

public class LockSynchronizerDemo {
    public static void main(String[] args) throws Exception {
        ReentrantLock lock = new ReentrantLock(true);
        AtomicInteger counter = new AtomicInteger(0);
        Thread[] incrementThreads = new Thread[4];
        for (int i = 0; i < incrementThreads.length; i++) {
            incrementThreads[i] = new Thread(() -> {
                for (int j = 0; j < 1000; j++) {
                    lock.lock();
                    try {
                        counter.incrementAndGet();
                    } finally {
                        lock.unlock();
                    }
                }
            });
            incrementThreads[i].start();
        }
        for (Thread thread : incrementThreads) {
            thread.join();
        }
        System.out.println("fairLock=" + lock.isFair());
        System.out.println("lockCounter=" + counter.get());

        CountDownLatch latch = new CountDownLatch(3);
        for (int i = 0; i < 3; i++) {
            new Thread(() -> {
                try {
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                } finally {
                    latch.countDown();
                }
            }).start();
        }
        latch.await();
        System.out.println("latchCompleted=true");

        AtomicInteger barrierTrips = new AtomicInteger(0);
        CyclicBarrier barrier = new CyclicBarrier(3, () -> {
            barrierTrips.incrementAndGet();
            System.out.println("barrierAction=true");
        });
        Thread[] barrierThreads = new Thread[3];
        for (int i = 0; i < barrierThreads.length; i++) {
            barrierThreads[i] = new Thread(() -> {
                try {
                    barrier.await();
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            });
            barrierThreads[i].start();
        }
        for (Thread thread : barrierThreads) {
            thread.join();
        }
        System.out.println("barrierTrips=" + barrierTrips.get());

        Semaphore semaphore = new Semaphore(2);
        AtomicInteger inFlight = new AtomicInteger(0);
        AtomicInteger maxInFlight = new AtomicInteger(0);
        Thread[] semaphoreThreads = new Thread[4];
        for (int i = 0; i < semaphoreThreads.length; i++) {
            semaphoreThreads[i] = new Thread(() -> {
                try {
                    semaphore.acquire();
                    int current = inFlight.incrementAndGet();
                    maxInFlight.updateAndGet(old -> Math.max(old, current));
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                } finally {
                    inFlight.decrementAndGet();
                    semaphore.release();
                }
            });
            semaphoreThreads[i].start();
        }
        for (Thread thread : semaphoreThreads) {
            thread.join();
        }
        System.out.println("semaphoreMaxInFlight=" + maxInFlight.get());
    }
}
```

### 7.2 编译并运行

```bash
javac LockSynchronizerDemo.java
java LockSynchronizerDemo
```

如果你在 PowerShell 中操作，也直接执行同样两条命令即可。

### 7.3 你应该观察到什么

输出不一定逐字完全一致，但应包含这些关键信息：

```text
fairLock=true
lockCounter=4000
latchCompleted=true
barrierAction=true
barrierTrips=1
semaphoreMaxInFlight=2
```

### 7.4 每一行在验证什么

- `fairLock=true`：说明这里创建的是公平锁
- `lockCounter=4000`：说明 `ReentrantLock` 可以正确保护临界区更新
- `latchCompleted=true`：说明 `CountDownLatch` 适合等待一批任务结束
- `barrierAction=true`、`barrierTrips=1`：说明 `CyclicBarrier` 适合等待一组线程到齐后同时推进
- `semaphoreMaxInFlight=2`：说明 `Semaphore` 的作用是限制同时通过的线程数量

### 7.5 再做两个延伸验证

你可以继续做下面两个实验：

1. 把 `Semaphore` 的许可证数从 `2` 改成 `1`
2. 把 `ReentrantLock(true)` 改成 `ReentrantLock(false)`

你可以观察：

- 并发度限制会直接变化
- 公平性设置会改变线程竞争行为，但不一定提升吞吐

## 8. 练习建议

下面这些练习做完，这一章会更扎实：

- 用 `ReentrantLock` 实现一个安全计数器
- 用 `CountDownLatch` 协调多个任务完成
- 用 `CyclicBarrier` 模拟分阶段并行计算
- 用 `Semaphore` 实现一个简单限流器
- 总结 `synchronized`、`ReentrantLock`、读写锁和同步器的选型表

## 9. 自测问题

- `ReentrantLock` 和 `synchronized` 有什么不同？
- `CountDownLatch` 和 `CyclicBarrier` 分别适合什么场景？
- `Semaphore` 为什么常用来做并发访问控制？
- 为什么同步器解决的是“线程协作”而不只是“线程互斥”？
- 读写锁在什么场景下更适合使用？

## 10. 自测核对要点

如果你的回答能覆盖下面这些点，说明这一章基本掌握到位了：

- `ReentrantLock` 提供了比 `synchronized` 更灵活的控制能力
- 读写锁适合读多写少场景
- `CountDownLatch` 用来等待一批任务结束
- `CyclicBarrier` 用来等待一组线程到齐后再一起推进
- `Semaphore` 用来限制并发访问数量
