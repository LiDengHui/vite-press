# IO与NIO

## 1. 这是什么

I/O 负责数据的输入输出。传统 I/O 以流为核心，NIO 则引入了 `Buffer`、`Channel`、`Selector` 等模型。  
它们共同构成了 Java 处理文件与网络数据的基础能力。

一句话理解：

- 传统 I/O 更像“数据自己流过来”
- NIO 更像“你拿着缓冲区和通道主动搬运数据”

## 2. 为什么重要

无论是：

- 读写文件
- 上传下载
- Socket 通信
- 日志落盘
- 高并发网络服务

都离不开 I/O 模型。  
理解 I/O 和 NIO，能帮助你更好地理解：

- 为什么有字节流和字符流
- 为什么要关注字符编码
- 为什么缓冲能提升性能
- 为什么高性能网络框架常常基于 NIO

## 3. 先建立直觉：I/O 到底在处理什么

所有 I/O 本质上都在做同一件事：

- 把数据从一个地方搬到另一个地方

例如：

- 从磁盘搬到内存
- 从内存搬到文件
- 从网络连接搬到应用程序

差别主要在于：

- 数据单位是什么
- API 抽象是什么
- 是否需要缓冲
- 是否阻塞等待
- 是否支持一个线程同时管理多个连接

## 4. 核心内容

### 4.1 字节流和字符流的区别

#### 字节流

字节流以字节为单位处理数据，典型类有：

- `InputStream`
- `OutputStream`

适合：

- 图片
- 音频
- 视频
- 压缩包
- 任何二进制数据

#### 字符流

字符流以字符为单位处理文本，典型类有：

- `Reader`
- `Writer`

适合：

- 文本文件
- 配置文件
- 日志
- JSON、XML、CSV 等文本内容

最重要的理解是：

- 字符流本质上还是基于字节流
- 只是额外帮你处理了字符编码转换

### 4.2 为什么文本处理必须关心编码

如果你在处理文本时不明确编码，就容易出现乱码。  
因为“字符”最终还是要编码成“字节”才能存储和传输。

所以：

- 处理文本时尽量显式指定 `UTF-8`
- 不要依赖系统默认编码

### 4.3 传统 I/O 为什么叫“面向流”

传统 I/O 的核心抽象是流：

- 输入流：数据从外部流向程序
- 输出流：数据从程序流向外部

它更强调：

- 顺序读取
- 顺序写入
- API 直观，适合大多数文件处理场景

### 4.4 缓冲为什么重要

无论传统 I/O 还是 NIO，缓冲思想都很重要。  
因为如果每读一个字节、每写一个字节都直接打到底层系统调用，代价会很高。

缓冲的价值是：

- 减少系统调用次数
- 提高吞吐
- 降低频繁小块读写带来的损耗

传统 I/O 里常见的缓冲类：

- `BufferedInputStream`
- `BufferedOutputStream`
- `BufferedReader`
- `BufferedWriter`

### 4.5 NIO 的三个核心角色

#### `Buffer`

`Buffer` 是数据缓冲区。  
你可以把它理解成一块可读可写的内存。

#### `Channel`

`Channel` 是数据通道。  
它负责在文件、Socket、内存之间搬运数据。

#### `Selector`

`Selector` 是多路复用器。  
它让一个线程可以监控多个 Channel 的事件状态，例如：

- 可读
- 可写
- 连接建立

这也是 NIO 在高并发网络场景下很重要的原因之一。

### 4.6 `Buffer` 最容易混淆的几个状态

学习 `Buffer`，一定要理解这几个指标：

- `capacity`：总容量
- `position`：当前读写位置
- `limit`：当前可操作边界

最关键的方法是：

- `flip()`：从写模式切换到读模式
- `clear()`：清空状态，准备重新写入

一个非常实用的记忆方式：

- 先往 `Buffer` 里写数据
- 写完后 `flip()`
- 再从 `Buffer` 里读数据
- 读完后 `clear()`

### 4.7 阻塞和非阻塞怎么理解

#### 阻塞 I/O

阻塞 I/O 的特点是：

- 当前线程发起读写后，如果数据还没准备好，就会等待

优点：

- 直观
- 编程模型简单

缺点：

- 一个线程常常只能专注处理一个等待中的 I/O 操作

#### 非阻塞 I/O

非阻塞 I/O 的特点是：

- 当前线程不会一直傻等
- 没准备好就先返回，稍后再检查

优点：

- 更适合高并发连接管理

缺点：

- 编程模型更复杂

### 4.8 为什么 NIO 更适合高并发网络场景

不是因为“它一定更快”，而是因为它更适合某类问题：

- 大量连接
- 单连接读写不一定持续活跃
- 希望减少线程数量

在这种情况下：

- `Selector` 可以让一个线程管理多个连接状态
- 不必一个连接绑定一个阻塞线程

这也是很多网络框架采用 Reactor / 事件循环模型的基础。

### 4.9 传统 I/O 和 NIO 怎么选

更适合传统 I/O 的场景：

- 普通文件读写
- 简单脚本工具
- 小型数据处理任务
- 代码更重视直观性

更适合 NIO 的场景：

- 高并发网络程序
- 对 `Channel` / `Buffer` / `Selector` 模型有明确需求
- 希望建立对现代网络框架底层机制的认知

## 5. 学习重点

这一章最应该真正掌握的是：

- 字节流处理二进制，字符流处理文本
- 文本处理一定要明确编码
- 缓冲的核心价值是减少底层交互成本
- NIO 的关键不是 API 名字，而是 `Buffer` 和 `Channel` 的协作关系
- `flip()` 和 `clear()` 是理解 `Buffer` 的关键
- `Selector` 的价值在于多路复用，不在于“更高级”

## 6. 常见问题

### 6.1 不区分字符编码直接处理文本

这会导致：

- 本地正常，换台机器乱码
- 线上和开发环境结果不一致

### 6.2 只会用流式 API，不理解缓冲和通道

代码能写出来，但碰到：

- 性能问题
- 网络模型问题
- 框架底层问题

就很难继续往下理解。

### 6.3 误以为 NIO 一定全面优于传统 I/O

这不准确。  
很多普通文件读写任务，用传统 I/O 完全够用，而且更直接。

### 6.4 忘记 `flip()` 导致读不到数据

这是 NIO 初学者最常见的问题之一。  
因为你写完数据后，如果不切换到读模式，`Buffer` 状态就不对。

## 7. 动手验证

这一节可以直接复制运行，边看边验证。

### 7.1 准备一个可运行示例

新建文件 `IoNioDemo.java`，内容如下：

```java
import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;

public class IoNioDemo {
    public static void main(String[] args) throws Exception {
        Path ioFile = Files.createTempFile("io-demo", ".txt");
        try (FileOutputStream out = new FileOutputStream(ioFile.toFile())) {
            out.write("hello-io".getBytes(StandardCharsets.UTF_8));
        }

        ByteArrayOutputStream ioBuffer = new ByteArrayOutputStream();
        try (FileInputStream in = new FileInputStream(ioFile.toFile())) {
            byte[] chunk = new byte[4];
            int len;
            while ((len = in.read(chunk)) != -1) {
                ioBuffer.write(chunk, 0, len);
            }
        }
        System.out.println("ioByteLength=" + ioBuffer.toByteArray().length);

        try (Reader reader = new InputStreamReader(
                new FileInputStream(ioFile.toFile()), StandardCharsets.UTF_8)) {
            char[] chars = new char[32];
            int len = reader.read(chars);
            System.out.println("ioText=" + new String(chars, 0, len));
        }

        Path nioFile = Files.createTempFile("nio-demo", ".txt");
        try (FileChannel writeChannel = FileChannel.open(
                nioFile,
                StandardOpenOption.CREATE,
                StandardOpenOption.WRITE,
                StandardOpenOption.TRUNCATE_EXISTING)) {
            ByteBuffer writeBuffer = StandardCharsets.UTF_8.encode("hello-nio");
            writeChannel.write(writeBuffer);
        }

        try (FileChannel readChannel = FileChannel.open(nioFile, StandardOpenOption.READ)) {
            ByteBuffer buffer = ByteBuffer.allocate(32);
            int bytesRead = readChannel.read(buffer);
            System.out.println("nioBytesRead=" + bytesRead);
            System.out.println("bufferPositionAfterRead=" + buffer.position());
            System.out.println("bufferLimitAfterRead=" + buffer.limit());

            buffer.flip();
            System.out.println("bufferPositionAfterFlip=" + buffer.position());
            System.out.println("bufferLimitAfterFlip=" + buffer.limit());

            String text = StandardCharsets.UTF_8.decode(buffer).toString();
            System.out.println("nioText=" + text);

            buffer.clear();
            System.out.println("bufferPositionAfterClear=" + buffer.position());
            System.out.println("bufferLimitAfterClear=" + buffer.limit());
        }
    }
}
```

### 7.2 编译并运行

```bash
javac IoNioDemo.java
java IoNioDemo
```

如果你在 PowerShell 中操作，也直接执行同样两条命令即可。

### 7.3 你应该观察到什么

输出不一定逐字完全一致，但应包含这些关键信息：

```text
ioByteLength=8
ioText=hello-io
nioBytesRead=9
bufferPositionAfterRead=9
bufferLimitAfterRead=32
bufferPositionAfterFlip=0
bufferLimitAfterFlip=9
nioText=hello-nio
bufferPositionAfterClear=0
bufferLimitAfterClear=32
```

### 7.4 每一行在验证什么

- `ioByteLength=8`：说明传统 I/O 处理的是字节序列
- `ioText=hello-io`：说明字符流能按指定编码还原文本
- `nioBytesRead=9`：说明 `Channel` 已把数据读入 `Buffer`
- `bufferPositionAfterRead=9`、`bufferLimitAfterRead=32`：说明读入后缓冲区还处于写模式状态
- `bufferPositionAfterFlip=0`、`bufferLimitAfterFlip=9`：说明 `flip()` 把缓冲区切换到了读模式
- `nioText=hello-nio`：说明 `Buffer` 中的数据可以被解码读取
- `bufferPositionAfterClear=0`、`bufferLimitAfterClear=32`：说明 `clear()` 把缓冲区重置为可再次写入状态

### 7.5 再做两个延伸验证

你可以继续做下面两个实验：

1. 删除 `buffer.flip()` 再运行
2. 把 `InputStreamReader(..., StandardCharsets.UTF_8)` 改成别的编码

你可以观察：

- 不执行 `flip()` 时，读取到的内容会不对或为空
- 编码不一致时，文本读取结果会异常或乱码

## 8. 练习建议

下面这些练习做完，这一章会更扎实：

- 分别用字节流和字符流写一个文本读写 demo
- 用缓冲流改造一个逐字节读写的低效例子
- 自己手动画出 `ByteBuffer` 在 `write -> flip -> read -> clear` 过程中的状态变化
- 用 `FileChannel` 和 `ByteBuffer` 写一个小型文件复制 demo
- 总结流、通道、缓冲区、多路复用器四者的职责差异

## 9. 自测问题

- 字节流和字符流有什么区别？
- 为什么处理文本时必须关心字符编码？
- `Buffer`、`Channel`、`Selector` 分别承担什么职责？
- 为什么 `flip()` 是 NIO 学习中的关键一步？
- NIO 为什么比传统 I/O 更适合高并发网络场景？

## 10. 自测核对要点

如果你的回答能覆盖下面这些点，说明这一章基本掌握到位了：

- 传统 I/O 以流为核心，NIO 以 `Buffer` 和 `Channel` 为核心
- 字节流适合二进制，字符流适合文本
- 文本读写必须明确编码
- `Buffer` 的 `position`、`limit`、`capacity` 和 `flip()` / `clear()` 是理解 NIO 的关键
- `Selector` 的价值在于一个线程管理多个 Channel 事件
- 传统 I/O 和 NIO 没有绝对高低，关键看场景

