# Channel与Pipeline

## 1. 这是什么

如果你刚接触 Netty，最容易先被两个词反复刷屏：

- `Channel`
- `Pipeline`

很多资料会说：

- `Channel` 表示连接和 I/O 通道
- `Pipeline` 表示处理链

这句话没错，但太短了，初学者通常还是会继续懵：

- 一个连接为什么还要抽象成 `Channel`？
- `Pipeline` 和 `Handler` 到底是什么关系？
- 为什么 Netty 总强调“责任链”？
- 入站、出站到底是相对谁来说的？

这篇就把这几个概念用更容易落地的方式讲清楚。

如果先只记一句话，可以记成：

> **Channel 代表“这条连接本身”，Pipeline 代表“这条连接上的处理流程”。**

也就是说：

- `Channel` 更像“路”
- `Pipeline` 更像“路上的工序”

---

## 2. 为什么重要

Netty 写着写着，绝大多数代码都会落到这两个概念上：

- 新连接建立后，你会拿到 `Channel`
- 收到消息后，消息会沿着 `Pipeline` 流动
- 你会在 `Handler` 里处理入站和出站事件
- 你会通过 `Channel` 写回响应

如果这层没理解清楚，后面通常会出现这些问题：

- 把所有逻辑塞进一个大 `Handler`
- 不知道编解码器该放在哪
- 不理解入站事件和出站事件为什么顺序不同
- 不清楚 `Channel`、`Pipeline`、`HandlerContext` 的层次关系
- 写回消息时不知道为什么有时从当前节点开始，有时从尾部开始

所以这一章其实是在回答：

> **Netty 是怎样把“一个连接上的所有事件处理”组织成一条可插拔流水线的。**

---

## 3. 先用一个工厂流水线类比理解

你可以把一条 Netty 连接想成“工厂里的一条生产线”。

### 这条类比里各自对应什么

- `Channel`：这条生产线本身
- `Pipeline`：这条生产线上的全部工位顺序
- `Handler`：某一个具体工位
- 入站事件：原材料进入生产线
- 出站事件：成品从生产线发出去

例如一条典型链路可能是：

1. 先做日志记录
2. 再做拆包
3. 再做解码
4. 再做鉴权
5. 再做业务处理
6. 最后做编码并回写

这就是 `Pipeline` 的思路。

所以 Netty 的优势不只是“能处理网络”，更是：

- 把处理过程拆成了一节一节可组合的工序

这会让系统更清晰、可复用、可维护。

---

## 4. Channel 到底是什么

`Channel` 可以先粗略理解成：

- 一条连接在 Netty 世界里的抽象对象
- 一个 I/O 通道对象

它不是简单的“Socket 壳子”，而是承载了这条连接大量上下文能力的核心对象。

### 4.1 你通常会拿它做什么

你会通过 `Channel`：

- 发送数据
- 关闭连接
- 判断连接状态
- 绑定属性
- 获取远端地址
- 获取对应的 `Pipeline`
- 获取对应的 `EventLoop`

比如：

```java
Channel channel = ctx.channel();
channel.writeAndFlush("hello");
```

这说明：

- 业务最终不是“直接向某个 IP 写字节”
- 而是在操作一个连接抽象对象

---

## 5. 一个连接通常对应一个 Channel

这个直觉非常重要。

在服务端场景里：

- 一个客户端连接进来
- 通常会对应一个 `Channel`

所以如果有 5000 个客户端在线：

- 往往就会有 5000 个 `Channel`

这意味着每条连接都可以维护自己的：

- 状态
- 属性
- 处理链

例如你可以给某个连接挂上用户信息：

```java
AttributeKey<Long> USER_ID = AttributeKey.valueOf("userId");
channel.attr(USER_ID).set(1001L);
```

这样后续在这条连接上的处理器里，都可以读到这条连接对应的用户上下文。

这也是为什么 `Channel` 不只是“收发字节”，而是“连接上下文载体”。

---

## 6. Pipeline 到底是什么

`ChannelPipeline` 可以理解成：

- 一条连接上的事件处理链
- 多个 `Handler` 按顺序串起来形成的责任链

简单说就是：

> **消息来了，不会一下子直接跳到业务代码，而是会沿着 Pipeline 一步步往前走。**

例如：

```text
LoggingHandler
   ↓
LengthFieldBasedFrameDecoder
   ↓
StringDecoder
   ↓
AuthHandler
   ↓
BusinessHandler
   ↓
StringEncoder
```

当一段网络数据进来时，可能会这样走：

1. 先记录日志
2. 再按长度字段切出完整消息
3. 再把字节解码成字符串或对象
4. 再校验登录态
5. 再执行业务逻辑
6. 最后把响应编码后发回去

你会发现，这种设计天然比“一个大方法包办所有事情”更清楚。

---

## 7. Handler 是什么

`Handler` 就是 Pipeline 里的一个处理节点。

你可以把它理解成：

- 专门负责某一类动作的处理器

常见职责包括：

- 连接建立时做初始化
- 收到消息时解析和处理
- 写回前做编码
- 发生异常时做日志和关闭
- 做心跳、鉴权、限流、统计

### 7.1 为什么要拆多个 Handler

因为不同逻辑应该分层：

- 拆包归拆包
- 解码归解码
- 鉴权归鉴权
- 业务归业务
- 编码归编码

这样做的好处很明显：

- 每个 Handler 职责单一
- 可单独替换
- 可复用
- 更容易调试
- 更适合多人协作

---

## 8. 入站和出站到底是什么

这是 Netty 初学者非常容易混的点。

### 8.1 入站（Inbound）

入站事件，指的是：

- 从网络进入应用程序的事件

常见入站事件包括：

- 连接建立
- 收到数据
- 读完成
- 连接关闭
- 异常触发

最常见的方法例如：

- `channelActive`
- `channelRead`
- `channelInactive`
- `exceptionCaught`

### 8.2 出站（Outbound）

出站事件，指的是：

- 应用程序发往网络的动作

常见出站动作包括：

- `write`
- `flush`
- `connect`
- `close`

所以你可以简单记：

- **入站：外面进来**
- **出站：里面出去**

---

## 9. 为什么入站和出站顺序不一样

`Pipeline` 不是“所有事件都统一从头走到尾”。

在 Netty 里通常是：

- 入站事件：从前往后传播
- 出站事件：从后往前传播

### 为什么这样设计

因为这样可以让：

- 解码器更自然地放前面
- 编码器更自然地放后面
- 业务处理处在中间位置

例如这条链：

```text
[入站1] LoggingInboundHandler
[入站2] FrameDecoder
[入站3] MessageDecoder
[入站4] BusinessHandler
[出站1] MessageEncoder
[出站2] LoggingOutboundHandler
```

收到请求时：

- 会先经过前面的入站处理器，再到业务处理器

业务处理完写回响应时：

- 会沿出站方向走到编码器，再最终写到网络

这样“请求处理”和“响应发送”的流向就都更符合直觉。

---

## 10. 最小示例：组装一个 Pipeline

下面这个例子适合建立结构感：

```java
ServerBootstrap bootstrap = new ServerBootstrap();
bootstrap.group(bossGroup, workerGroup)
        .channel(NioServerSocketChannel.class)
        .childHandler(new ChannelInitializer<SocketChannel>() {
            @Override
            protected void initChannel(SocketChannel ch) {
                ChannelPipeline p = ch.pipeline();
                p.addLast(new LoggingHandler(LogLevel.INFO));
                p.addLast(new LengthFieldBasedFrameDecoder(1024, 0, 4, 0, 4));
                p.addLast(new StringDecoder(StandardCharsets.UTF_8));
                p.addLast(new StringEncoder(StandardCharsets.UTF_8));
                p.addLast(new SimpleChannelInboundHandler<String>() {
                    @Override
                    protected void channelRead0(ChannelHandlerContext ctx, String msg) {
                        System.out.println("收到消息: " + msg);
                        ctx.writeAndFlush("server reply: " + msg);
                    }
                });
            }
        });
```

你要重点看明白这些点：

- `ch.pipeline()` 说明每个 `Channel` 都有自己的处理链
- `addLast(...)` 表示把处理器按顺序挂进去
- 解码器、编码器、业务处理器是分层摆放的
- `ctx.writeAndFlush(...)` 会触发出站链路

---

## 11. Channel、Pipeline、Handler 三者关系

这是最应该建立的一张脑图：

```text
一个客户端连接
   ↓
一个 Channel
   ↓
一个 ChannelPipeline
   ↓
多个 Handler 按顺序组成责任链
```

可以再说得更细一点：

- `Channel`：连接对象
- `Pipeline`：连接上的总流程
- `Handler`：流程里的某个处理节点

所以不要把它们看成同一层概念。

最常见的误解是：

- 把 `Pipeline` 当成某种“全局处理器容器”

其实它更准确地说是：

- **某条连接自己的事件处理链**

---

## 12. 为什么不要把所有逻辑塞进一个 Handler

这是 Netty 入门时非常高频的错误写法。

很多人会写出这样的超级处理器：

- 收到原始字节
- 自己拆包
- 自己解码
- 自己鉴权
- 自己路由
- 自己执行业务
- 自己编码回包
- 自己处理异常

短期看似乎“能跑”，长期问题会很明显：

- 代码臃肿
- 职责混乱
- 改协议风险高
- 业务和协议强耦合
- 调试困难

更推荐的拆法通常是：

1. 帧解码器：解决消息边界
2. 消息解码器：字节转对象
3. 鉴权处理器：校验身份
4. 业务处理器：执行业务逻辑
5. 消息编码器：对象转字节
6. 异常/日志处理器：统一收口

这样你的 Pipeline 才真正体现出工程价值。

---

## 13. HandlerContext 是什么，为什么经常看到 ctx

在 Handler 里你经常看到：

```java
ChannelHandlerContext ctx
```

它可以理解成：

- 当前这个 Handler 在 Pipeline 里的上下文

你可以通过它：

- 获取 `Channel`
- 获取 `Pipeline`
- 往下传播事件
- 写出响应

例如：

```java
ctx.fireChannelRead(msg);
ctx.writeAndFlush(response);
```

### 为什么不用什么都直接找 Channel

因为 `ctx` 更强调：

- “我现在处在处理链的哪个位置”

这对事件传播很重要。

例如：

- `ctx.writeAndFlush()` 通常会从当前节点附近开始走出站链
- `channel.writeAndFlush()` 则更偏向从整个 Pipeline 的尾部触发

入门阶段你先记住：

- `ctx` 是当前处理节点上下文
- `channel` 是整条连接对象

就够用了。

---

## 14. 动手建议

建议你至少做 3 个小实验。

### 14.1 写一个 3 层 Handler 的 Pipeline

例如：

- 日志 Handler
- 解码 Handler
- 业务 Handler

目标：

- 观察消息到来时的处理顺序

### 14.2 再补一个编码器

目标：

- 观察出站时为什么会反向经过某些处理器

### 14.3 故意把所有逻辑写进一个 Handler

然后再拆成多个 Handler 对比。

目标：

- 体会分层后的可维护性差异

---

## 15. 最容易踩的坑

### 15.1 把所有逻辑塞进一个 Handler

这是最常见、也最影响后期维护的坑。

### 15.2 不区分入站和出站

结果常见表现是：

- 编码器放错位置
- 事件传播顺序看不懂
- 写回逻辑和读取逻辑混乱

### 15.3 不清楚 Channel 和 Pipeline 的层级

会误以为：

- `Pipeline` 是全局共享的

实际上通常是：

- 每个 `Channel` 有自己的 `Pipeline`

### 15.4 在 I/O 线程里做耗时业务

即使 Pipeline 设计得再漂亮，如果你在 Handler 里直接做：

- 大量计算
- 慢 SQL
- 外部 HTTP 调用

依然会拖慢这条连接甚至整个 EventLoop。

### 15.5 异常处理没统一收口

这样很容易导致：

- 某些异常直接吞掉
- 某些连接泄漏不关闭
- 排障日志不完整

---

## 16. 自测问题

- `Channel` 和 `Pipeline` 分别解决什么问题？
- 为什么说 `Pipeline` 体现了责任链模式？
- 入站事件和出站事件的传播方向为什么不同？
- 为什么通常不建议把编解码和业务逻辑写在同一个 Handler 里？
- `ctx` 和 `channel` 在使用上的直觉区别是什么？

---

## 17. 这一章你至少要带走什么

如果你看完这一章只记住 5 件事，就记下面这 5 件：

1. **一个连接通常对应一个 Channel**
2. **一个 Channel 通常拥有一条自己的 Pipeline**
3. **Pipeline 本质上是多个 Handler 组成的责任链**
4. **入站和出站是两个方向不同的事件流**
5. **把编解码、鉴权、业务、异常处理拆层，Pipeline 才真正有价值**

把这几个点吃透后，你再看 Netty 的源码、编解码器、心跳处理、协议设计，就不会再觉得它们是零散概念了。