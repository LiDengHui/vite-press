# CompletableFuture异步编排

## 1. 这是什么

`CompletableFuture` 是 Java 提供的异步编排工具，用于描述任务之间的串联、组合和异常处理。  
它让异步逻辑的表达能力明显强于传统 `Future`。

一句话理解：

- `Future` 更像“异步结果占位符”
- `CompletableFuture` 更像“可继续拼接、组合、恢复的异步流程图”

## 2. 为什么重要

在这些场景里，`CompletableFuture` 非常常见：

- 聚合查询
- 并行调用多个远程接口
- 串联多个异步步骤
- 异步任务链异常恢复

掌握它，能明显提升异步代码的表达力和可维护性。

## 3. 先建立直觉：异步编排和“开个线程”有什么区别

很多人第一次写异步代码时，做法是：

- 开线程
- 等结果
- 再开线程

这虽然能跑，但没有真正表达出：

- 哪些任务是串行依赖
- 哪些任务可以并行
- 哪一步失败后如何兜底

`CompletableFuture` 的价值就是把这些关系显式写出来。

## 4. 核心内容

### 4.1 `runAsync` 和 `supplyAsync`

#### `runAsync`

适合：

- 只关心异步执行
- 不需要返回值

#### `supplyAsync`

适合：

- 异步执行后需要返回结果

最常见的业务代码里，通常更常用的是 `supplyAsync`。

### 4.2 `thenApply`

`thenApply` 适合：

- 对上一步结果做同步转换

可以理解成：

- “拿到结果后，立刻再加工一下”

例如：

```java
CompletableFuture<String> upper = future.thenApply(String::toUpperCase);
```

### 4.3 `thenCompose`

`thenCompose` 适合：

- 上一步结果出来后，要继续发起一个新的异步任务

它解决的是：

- “异步依赖异步”

可以把它理解成：

- 把两层 `CompletableFuture` 展平成一层

### 4.4 `thenCombine`

`thenCombine` 适合：

- 两个彼此独立的异步任务都完成后，再把结果合并

它解决的是：

- “并行任务汇聚”

### 4.5 `allOf` 和 `anyOf`

#### `allOf`

- 所有任务都完成后继续

#### `anyOf`

- 任意一个任务先完成就继续

这两个工具很适合做：

- 批量并发等待
- 聚合响应
- 竞速请求

### 4.6 异常处理为什么不能忽略

如果异步链路里某一步失败了，而你又没有处理：

- 整条链可能中断
- 最终 `join()` 时才集中爆炸
- 问题定位也会变难

常用处理方式包括：

- `exceptionally`
- `handle`
- `whenComplete`

它们关注点不同：

- `exceptionally`：出错后给一个兜底结果
- `handle`：不管成功失败都做转换
- `whenComplete`：不改结果，更多用于记录日志或收尾

### 4.7 为什么要重视自定义线程池

如果不显式指定线程池，很多异步任务会落到公共线程池。  
这在简单 demo 里没问题，但在生产环境里容易带来：

- 任务互相影响
- 线程资源不可控
- 高峰期竞争放大

工程上更推荐：

- 为关键异步任务使用明确命名、容量可控的专用线程池

## 5. 学习重点

这一章最重要的是分清这些语义：

- `thenApply`：同步转换
- `thenCompose`：串联新的异步任务
- `thenCombine`：汇聚两个独立异步结果
- 异步编排不等于最后全靠 `join()` 强行同步
- 异步链也需要线程池设计和异常处理

## 6. 常见问题

### 6.1 只会 `.join()`，把异步写成同步

如果每一步都立刻 `join()`，你其实是在：

- 失去链式编排的意义
- 让本来可以并行的事情重新串行化

### 6.2 不处理异常导致链路中断

异步失败如果不显式恢复或记录，最后通常只会留下一个不易读的包装异常。

### 6.3 在高负载下滥用公共线程池

公共线程池不是“无限容量后台工人”。  
关键异步任务最好有自己的资源边界。

## 7. 动手验证

这一节可以直接复制运行，边看边验证。

### 7.1 准备一个可运行示例

新建文件 `CompletableFutureDemo.java`，内容如下：

```java
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;

public class CompletableFutureDemo {
    public static void main(String[] args) throws Exception {
        AtomicInteger threadId = new AtomicInteger(0);
        AtomicReference<String> firstThreadName = new AtomicReference<>("");
        ThreadFactory factory = task -> {
            Thread thread = new Thread(task);
            thread.setName("cf-demo-" + threadId.incrementAndGet());
            return thread;
        };
        ExecutorService pool = Executors.newFixedThreadPool(4, factory);

        try {
            CompletableFuture<String> userFuture = CompletableFuture.supplyAsync(() -> {
                firstThreadName.set(Thread.currentThread().getName());
                sleep(100);
                return "Alice";
            }, pool);

            CompletableFuture<String> thenApplyFuture =
                    userFuture.thenApply(String::toUpperCase);

            CompletableFuture<String> thenComposeFuture =
                    userFuture.thenCompose(name ->
                            CompletableFuture.supplyAsync(() -> "profile-of-" + name, pool));

            CompletableFuture<String> vipFuture =
                    CompletableFuture.supplyAsync(() -> "VIP", pool);
            CompletableFuture<String> thenCombineFuture =
                    userFuture.thenCombine(vipFuture, (name, tag) -> name + "-" + tag);

            CompletableFuture<String> orderFuture =
                    CompletableFuture.supplyAsync(() -> "ORDER-1", pool);
            CompletableFuture<Void> allFuture =
                    CompletableFuture.allOf(userFuture, orderFuture);
            allFuture.join();
            String allOfResult = userFuture.join() + "|" + orderFuture.join();

            CompletableFuture<String> exceptionFuture =
                    CompletableFuture.<String>supplyAsync(() -> {
                        throw new IllegalStateException("remote failed");
                    }, pool).exceptionally(ex -> "fallback");

            System.out.println("thenApplyResult=" + thenApplyFuture.join());
            System.out.println("thenComposeResult=" + thenComposeFuture.join());
            System.out.println("thenCombineResult=" + thenCombineFuture.join());
            System.out.println("allOfResult=" + allOfResult);
            System.out.println("exceptionFallback=" + exceptionFuture.join());
            System.out.println("customPoolUsed=" + firstThreadName.get().startsWith("cf-demo-"));
        } finally {
            pool.shutdown();
            pool.awaitTermination(5, TimeUnit.SECONDS);
        }
    }

    private static void sleep(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
```

### 7.2 编译并运行

```bash
javac CompletableFutureDemo.java
java CompletableFutureDemo
```

如果你在 PowerShell 中操作，也直接执行同样两条命令即可。

### 7.3 你应该观察到什么

输出不一定逐字完全一致，但应包含这些关键信息：

```text
thenApplyResult=ALICE
thenComposeResult=profile-of-Alice
thenCombineResult=Alice-VIP
allOfResult=Alice|ORDER-1
exceptionFallback=fallback
customPoolUsed=true
```

### 7.4 每一行在验证什么

- `thenApplyResult=ALICE`：说明 `thenApply` 适合对已有结果做同步转换
- `thenComposeResult=profile-of-Alice`：说明 `thenCompose` 适合“结果出来后再发起新的异步任务”
- `thenCombineResult=Alice-VIP`：说明 `thenCombine` 适合汇聚两个独立异步结果
- `allOfResult=Alice|ORDER-1`：说明 `allOf` 适合等待多个任务完成后统一收集结果
- `exceptionFallback=fallback`：说明异步链路中的异常可以显式兜底恢复
- `customPoolUsed=true`：说明异步任务已落到自定义线程池，而不是依赖默认公共池

### 7.5 再做两个延伸验证

你可以继续做下面两个实验：

1. 把 `thenCompose` 改成 `thenApply`
2. 去掉自定义线程池参数，让任务落到公共池

你可以观察：

- `thenCompose` 和 `thenApply` 在“异步套异步”场景下语义明显不同
- 不显式配置线程池时，线程资源的归属会变得不透明

## 8. 练习建议

下面这些练习做完，这一章会更扎实：

- 写一个多接口并行聚合 demo
- 分别用 `thenApply`、`thenCompose`、`thenCombine` 对同一业务场景做建模
- 为异步任务配置专用线程池并观察线程名
- 给异步链路增加异常恢复和日志记录

## 9. 自测问题

- `Future` 和 `CompletableFuture` 的核心差别是什么？
- `thenCompose` 和 `thenCombine` 分别适合什么场景？
- 为什么异步编排仍然需要考虑线程池容量？
- 为什么不能把所有异步任务都丢到公共线程池？
- `exceptionally`、`handle`、`whenComplete` 的关注点有什么不同？

## 10. 自测核对要点

如果你的回答能覆盖下面这些点，说明这一章基本掌握到位了：

- `CompletableFuture` 的核心价值在于链式编排和组合能力
- `thenApply`、`thenCompose`、`thenCombine` 解决的是不同任务关系
- 异步链路中的异常必须显式处理
- 自定义线程池有助于资源隔离和可观测性
- 异步编排不是逃避容量设计，而是更需要容量设计
