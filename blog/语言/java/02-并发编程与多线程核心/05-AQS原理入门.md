# AQS原理入门

## 1. 这是什么

AQS 是 Java 并发包中非常重要的同步框架，很多锁和同步器都建立在它之上。  
它的核心作用是管理同步状态和等待队列。

一句话理解：

- AQS 不是某一把具体的锁
- 它更像一个“同步器脚手架”

## 2. 为什么重要

如果想真正理解这些并发工具为什么能工作，AQS 是绕不开的一层：

- `ReentrantLock`
- `Semaphore`
- `CountDownLatch`
- `ReentrantReadWriteLock`

学会 AQS，你才能把“会用”提升到“看得懂实现思路”。

## 3. 先建立直觉：AQS 到底在统一什么

很多并发工具表面看起来功能不一样：

- 有的控制互斥
- 有的控制共享访问
- 有的负责等待一批线程完成

但它们内部都面临类似问题：

- 当前能不能获取资源
- 获取失败后线程去哪等
- 什么时候该唤醒等待线程
- 用什么状态表示当前同步条件

AQS 就是在统一处理这些共性问题。

## 4. 核心内容

### 4.1 `state` 是什么

AQS 里最核心的字段之一是 `state`。  
你可以把它理解成：

- 同步状态的数字化表示

不同同步器会用它表达不同含义，例如：

- 锁是否被占用
- 当前重入次数
- 信号量还剩多少许可证
- 闭锁是否已经打开

所以：

- AQS 不规定 `state` 一定表示什么
- 它只提供原子管理这个状态的机制

### 4.2 独占模式和共享模式

AQS 支持两种核心模式：

#### 独占模式

同一时刻只允许一个线程成功获取资源。

典型代表：

- `ReentrantLock`

#### 共享模式

允许多个线程按某种共享规则同时获取资源。

典型代表：

- `Semaphore`
- `CountDownLatch`

理解这个区别非常重要，因为它决定了：

- 获取成功后的传播行为
- 释放资源后唤醒谁

### 4.3 等待队列在做什么

当线程获取同步状态失败时，AQS 不会让线程凭空消失。  
它会把线程包装成节点，放进一个 CLH 风格的双向等待队列中。

可以先把它想象成：

- 一个排队区
- 拿不到资源的线程先进去等
- 条件满足时再被唤醒尝试获取

所以等待队列本质上解决的是：

- 竞争失败线程如何有序等待和唤醒

### 4.4 获取与释放流程怎么理解

先用最抽象的方式理解：

#### 获取

1. 先尝试直接获取同步状态
2. 如果成功，立即返回
3. 如果失败，加入等待队列
4. 被唤醒后再重试

#### 释放

1. 修改 `state`
2. 判断是否需要唤醒后继节点
3. 通知等待线程继续竞争

这就是很多锁和同步器行为的共同骨架。

### 4.5 为什么说 AQS 不直接实现业务锁

AQS 本身不会告诉你：

- 锁什么时候算获取成功
- 释放时状态怎么变化
- 共享和独占具体怎么判断

这些都交给子类实现，例如重写：

- `tryAcquire`
- `tryRelease`
- `tryAcquireShared`
- `tryReleaseShared`

这也是它能复用成多种同步器的根本原因。

### 4.6 失败重试和阻塞唤醒

AQS 的核心思路不是“失败就结束”，而是：

- 尝试
- 失败入队
- 被唤醒
- 继续尝试

这也是为什么你在源码里会看到：

- 自旋
- `park`
- `unpark`

这些动作组合在一起。

### 4.7 学 AQS 时最容易踩的坑

很多人第一次看 AQS 容易陷入两个极端：

- 只背源码细节，最后记不住
- 只记“它有个队列和 state”，但不知道怎么落到同步器上

更好的学习顺序是：

1. 先理解 `state`
2. 再理解独占 / 共享
3. 再理解获取失败入队
4. 最后结合具体同步器去看源码

## 5. 学习重点

这一章最重要的是掌握这几个判断：

- AQS 是同步框架，不是具体锁
- `state` 是同步状态核心
- 队列承载的是竞争失败线程
- 独占模式和共享模式是两套重要语义
- 很多同步器之所以能复用，是因为底层骨架一致

## 6. 常见问题

### 6.1 把 AQS 当成一堆源码细节去背

这样很快就会迷失在节点状态、CAS 细节和模板方法里。  
先看骨架，再看细节，学习效率会高很多。

### 6.2 看不清独占和共享的设计差异

如果这一步没搞懂，后面看 `CountDownLatch` 和 `Semaphore` 就会一直觉得混乱。

### 6.3 不知道同步器为什么能复用统一框架

核心原因就在于：

- 大部分同步器都能抽象成“状态 + 竞争 + 排队 + 唤醒”

## 7. 动手验证

这一节可以直接复制运行，边看边验证。

### 7.1 准备一个可运行示例

新建文件 `AqsDemo.java`，内容如下：

```java
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.locks.AbstractQueuedSynchronizer;

public class AqsDemo {
    static class SimpleMutex {
        private static class Sync extends AbstractQueuedSynchronizer {
            @Override
            protected boolean tryAcquire(int arg) {
                if (compareAndSetState(0, 1)) {
                    setExclusiveOwnerThread(Thread.currentThread());
                    return true;
                }
                return false;
            }

            @Override
            protected boolean tryRelease(int arg) {
                if (getState() == 0) {
                    throw new IllegalMonitorStateException();
                }
                setExclusiveOwnerThread(null);
                setState(0);
                return true;
            }

            boolean isLocked() {
                return getState() == 1;
            }
        }

        private final Sync sync = new Sync();

        void lock() {
            sync.acquire(1);
        }

        boolean tryLock() {
            return sync.tryAcquire(1);
        }

        void unlock() {
            sync.release(1);
        }

        boolean isLocked() {
            return sync.isLocked();
        }
    }

    static class OneShotLatch {
        private static class Sync extends AbstractQueuedSynchronizer {
            @Override
            protected int tryAcquireShared(int arg) {
                return getState() == 1 ? 1 : -1;
            }

            @Override
            protected boolean tryReleaseShared(int arg) {
                setState(1);
                return true;
            }
        }

        private final Sync sync = new Sync();

        void await() throws InterruptedException {
            sync.acquireSharedInterruptibly(1);
        }

        void signal() {
            sync.releaseShared(1);
        }
    }

    public static void main(String[] args) throws Exception {
        SimpleMutex mutex = new SimpleMutex();
        AtomicInteger counter = new AtomicInteger(0);
        Thread[] threads = new Thread[4];
        for (int i = 0; i < threads.length; i++) {
            threads[i] = new Thread(() -> {
                for (int j = 0; j < 1000; j++) {
                    mutex.lock();
                    try {
                        counter.incrementAndGet();
                    } finally {
                        mutex.unlock();
                    }
                }
            });
            threads[i].start();
        }
        for (Thread thread : threads) {
            thread.join();
        }
        System.out.println("exclusiveCounter=" + counter.get());

        mutex.lock();
        Thread tryLockThread = new Thread(() ->
                System.out.println("tryLockWhileHeld=" + mutex.tryLock()));
        tryLockThread.start();
        tryLockThread.join();
        mutex.unlock();
        System.out.println("mutexLockedAfterUnlock=" + mutex.isLocked());

        OneShotLatch latch = new OneShotLatch();
        Thread waiter = new Thread(() -> {
            try {
                latch.await();
                System.out.println("sharedLatchPassed=true");
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });
        waiter.start();
        Thread.sleep(100);
        latch.signal();
        waiter.join();
    }
}
```

### 7.2 编译并运行

```bash
javac AqsDemo.java
java AqsDemo
```

如果你在 PowerShell 中操作，也直接执行同样两条命令即可。

### 7.3 你应该观察到什么

输出不一定逐字完全一致，但应包含这些关键信息：

```text
exclusiveCounter=4000
tryLockWhileHeld=false
mutexLockedAfterUnlock=false
sharedLatchPassed=true
```

### 7.4 每一行在验证什么

- `exclusiveCounter=4000`：说明基于 AQS 的独占同步器可以正确保护临界区
- `tryLockWhileHeld=false`：说明独占状态被占用时，其他线程无法直接获取
- `mutexLockedAfterUnlock=false`：说明释放成功后同步状态恢复
- `sharedLatchPassed=true`：说明基于 AQS 的共享模式同步器可以实现“等待条件满足再放行”

### 7.5 再做两个延伸验证

你可以继续做下面两个实验：

1. 去掉 `SimpleMutex` 中的 `mutex.unlock()`
2. 不调用 `latch.signal()`

你可以观察：

- 独占同步器不释放时，后续线程会一直等待
- 共享模式条件不满足时，等待线程不会通过

## 8. 练习建议

下面这些练习做完，这一章会更扎实：

- 先从 `ReentrantLock` 反推 AQS 的独占结构
- 阅读一次 `CountDownLatch` 的共享获取和释放流程
- 自己画一张 `state + 等待队列 + 唤醒` 的示意图
- 用“同步状态 + 模板方法”角度重新理解常见同步器

## 9. 自测问题

- AQS 的核心职责是什么？
- `state` 在 AQS 中扮演什么角色？
- 独占模式和共享模式的核心差异是什么？
- 为什么很多同步器都能构建在 AQS 之上？
- 等待队列在 AQS 中承担什么职责？

## 10. 自测核对要点

如果你的回答能覆盖下面这些点，说明这一章基本掌握到位了：

- AQS 是同步器框架，不直接等于某个具体锁
- `state` 是同步状态核心
- 获取失败线程会进入等待队列
- AQS 同时支持独占和共享两种同步模式
- 很多并发工具之所以可复用，是因为底层都能抽象成“状态 + 队列 + 唤醒”

