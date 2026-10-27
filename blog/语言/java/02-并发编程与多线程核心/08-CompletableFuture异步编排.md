---
tags:
  - Java
  - 并发编程
  - 后端
  - CompletableFuture
  - 异步
---

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

## 4. 先用业务动作理解：做完一件事自动触发下一件

如果你对 API 名字不熟，先别急着背。

把它想成一个很常见的业务链路：

1. 先查用户信息
2. 查到用户后，再查这个用户的订单
3. 用户标签服务和优惠券服务彼此独立，可以并行查
4. 所有数据都回来后，再组装成页面结果
5. 如果其中某个远程调用失败，要决定是报错、降级，还是给默认值

这就是异步编排最典型的 5 种关系。

### 4.1 串行触发：前一步做完，再自动开始下一步

例如：

- 先根据 userId 查用户
- 拿到用户后，再根据用户等级查权益

这类场景的重点不是“异步”两个字，而是：

- 第二步依赖第一步的结果
- 第一件事做完后，要自动触发下一件事

这就是 `thenApply` 或 `thenCompose` 最常出现的地方。

### 4.2 并行执行：几件互不依赖的事一起做

例如：

- 查用户基础信息
- 查账户余额
- 查优惠券列表

这三件事彼此独立，就不应该傻等一个一个做。  
更合理的方式是同时发起，然后最后再汇总。

这就是 `thenCombine`、`allOf` 常见的使用场景。

### 4.3 失败兜底：别让一处异常把整条链打断

例如：

- 用户信息必须查到，否则整页失败
- 但“猜你喜欢”推荐接口失败了，可以给空列表

这说明异步编排不只是“把事情并起来”，还包括：

- 哪些步骤必须成功
- 哪些步骤允许降级
- 降级后最终返回什么

所以 `exceptionally`、`handle`、`whenComplete` 这些 API 不是边角料，而是业务链路能不能落地的关键。

## 5. 核心内容

### 5.1 `runAsync` 和 `supplyAsync`

#### `runAsync`

适合：

- 只关心异步执行
- 不需要返回值

#### `supplyAsync`

适合：

- 异步执行后需要返回结果

最常见的业务代码里，通常更常用的是 `supplyAsync`。

### 5.2 `thenApply`

`thenApply` 适合：

- 对上一步结果做同步转换

可以理解成：

- “拿到结果后，立刻再加工一下”
- “前一步做完，自动进入一个不用再次发异步请求的加工步骤”

例如：

- 查到用户名后，把它转成大写
- 查到商品价格后，换算成展示文案

```java
CompletableFuture<String> upper = future.thenApply(String::toUpperCase);
```

如果这一步只是内存里的格式转换、字段映射、DTO 组装，通常优先想到 `thenApply`。

### 5.3 `thenCompose`

`thenCompose` 适合：

- 上一步结果出来后，要继续发起一个新的异步任务

它解决的是：

- “异步依赖异步”
- “第一件事做完后，自动触发第二个远程调用”

可以把它理解成：

- 把两层 `CompletableFuture` 展平成一层

最典型的业务例子：

- 先查用户
- 查到用户后，再查该用户的订单

这时第二步不是普通字符串加工，而是又发起了一个异步 IO 操作，所以更适合 `thenCompose`。

### 5.4 `thenCombine`

`thenCombine` 适合：

- 两个彼此独立的异步任务都完成后，再把结果合并

它解决的是：

- “并行任务汇聚”
- “两边都做完，再拼成一个结果”

典型例子：

- 一边查用户信息
- 一边查用户账户余额
- 两边都回来后，拼成用户主页对象

如果两个任务互不依赖，就不要写成串行等待，直接并行后再合并通常更合理。

### 5.5 `allOf` 和 `anyOf`

#### `allOf`

- 所有任务都完成后继续

#### `anyOf`

- 任意一个任务先完成就继续

这两个工具很适合做：

- 批量并发等待
- 聚合响应
- 竞速请求

### 5.6 异常处理为什么不能忽略

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

把它翻译成业务语言更容易理解：

- 用户核心资料查询失败：通常直接失败，不兜底
- 推荐列表查询失败：可以降级成空列表
- 优惠券查询失败：可以记日志后返回“暂无优惠券”

所以异常处理不是“补个 try-catch”，而是在定义：

- 哪些步骤必须成功
- 哪些步骤允许自动恢复
- 恢复后给调用方什么结果

### 5.7 为什么要重视自定义线程池

如果不显式指定线程池，很多异步任务会落到公共线程池。  
这在简单 demo 里没问题，但在生产环境里容易带来：

- 任务互相影响
- 线程资源不可控
- 高峰期竞争放大

工程上更推荐：

- 为关键异步任务使用明确命名、容量可控的专用线程池

## 6. 一个完整业务链路怎么写

下面用“用户详情页聚合”举一个更接近业务的例子。

需求：

1. 先查用户基础信息
2. 用户查到后，自动去查订单摘要
3. 同时并行去查账户余额
4. 订单和余额都回来后，组装成返回对象
5. 如果余额服务失败，就降级成 0

```java
CompletableFuture<User> userFuture = CompletableFuture.supplyAsync(
        () -> userService.queryUser(userId), pool);

CompletableFuture<OrderSummary> orderFuture = userFuture.thenCompose(
        user -> CompletableFuture.supplyAsync(() -> orderService.querySummary(user.getId()), pool));

CompletableFuture<BigDecimal> balanceFuture = CompletableFuture.supplyAsync(
        () -> accountService.queryBalance(userId), pool)
        .exceptionally(ex -> BigDecimal.ZERO);

CompletableFuture<UserDetailView> resultFuture = orderFuture.thenCombine(
        balanceFuture,
        (orderSummary, balance) -> new UserDetailView(orderSummary, balance));
```

这个例子里最关键的不是代码长什么样，而是你要看出关系：

- `userFuture -> orderFuture`：这是“前一步做完自动触发下一步”
- `orderFuture` 和 `balanceFuture`：后半段存在并行
- `balanceFuture.exceptionally(...)`：这是局部降级，不让非核心链路拖垮整个结果

如果你能把一个业务需求先画成这种关系图，再去选 API，代码就不会乱。

## 7. 学习重点

这一章最重要的是分清这些语义：

- `thenApply`：同步转换
- `thenCompose`：串联新的异步任务
- `thenCombine`：汇聚两个独立异步结果
- 异步编排不等于最后全靠 `join()` 强行同步
- 异步链也需要线程池设计和异常处理

## 8. 常见问题

### 8.1 只会 `.join()`，把异步写成同步

如果每一步都立刻 `join()`，你其实是在：

- 失去链式编排的意义
- 让本来可以并行的事情重新串行化

### 8.2 不处理异常导致链路中断

异步失败如果不显式恢复或记录，最后通常只会留下一个不易读的包装异常。

### 8.3 在高负载下滥用公共线程池

公共线程池不是“无限容量后台工人”。  
关键异步任务最好有自己的资源边界。

## 9. 动手验证

这一节可以直接复制运行，边看边验证。

### 9.1 准备一个可运行示例

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

### 9.2 编译并运行

```bash
javac CompletableFutureDemo.java
java CompletableFutureDemo
```

如果你在 PowerShell 中操作，也直接执行同样两条命令即可。

### 9.3 你应该观察到什么

输出不一定逐字完全一致，但应包含这些关键信息：

```text
thenApplyResult=ALICE
thenComposeResult=profile-of-Alice
thenCombineResult=Alice-VIP
allOfResult=Alice|ORDER-1
exceptionFallback=fallback
customPoolUsed=true
```

### 9.4 每一行在验证什么

- `thenApplyResult=ALICE`：说明 `thenApply` 适合对已有结果做同步转换
- `thenComposeResult=profile-of-Alice`：说明 `thenCompose` 适合“结果出来后再发起新的异步任务”
- `thenCombineResult=Alice-VIP`：说明 `thenCombine` 适合汇聚两个独立异步结果
- `allOfResult=Alice|ORDER-1`：说明 `allOf` 适合等待多个任务完成后统一收集结果
- `exceptionFallback=fallback`：说明异步链路中的异常可以显式兜底恢复
- `customPoolUsed=true`：说明异步任务已落到自定义线程池，而不是依赖默认公共池

### 9.5 再做两个延伸验证

你可以继续做下面两个实验：

1. 把 `thenCompose` 改成 `thenApply`
2. 去掉自定义线程池参数，让任务落到公共池

你可以观察：

- `thenCompose` 和 `thenApply` 在“异步套异步”场景下语义明显不同
- 不显式配置线程池时，线程资源的归属会变得不透明

## 10. 练习建议

下面这些练习做完，这一章会更扎实：

- 写一个多接口并行聚合 demo
- 分别用 `thenApply`、`thenCompose`、`thenCombine` 对同一业务场景做建模
- 为异步任务配置专用线程池并观察线程名
- 给异步链路增加异常恢复和日志记录

## 11. 自测问题

- `Future` 和 `CompletableFuture` 的核心差别是什么？
- `thenCompose` 和 `thenCombine` 分别适合什么场景？
- 为什么异步编排仍然需要考虑线程池容量？
- 为什么不能把所有异步任务都丢到公共线程池？
- `exceptionally`、`handle`、`whenComplete` 的关注点有什么不同？

## 12. 自测核对要点

如果你的回答能覆盖下面这些点，说明这一章基本掌握到位了：

- `CompletableFuture` 的核心价值在于链式编排和组合能力
- `thenApply`、`thenCompose`、`thenCombine` 解决的是不同任务关系
- 异步链路中的异常必须显式处理
- 自定义线程池有助于资源隔离和可观测性
- 异步编排不是逃避容量设计，而是更需要容量设计
