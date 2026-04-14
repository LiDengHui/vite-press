# JVM诊断工具

## 1. 这是什么

JVM 诊断工具用于观察线程、堆、GC、类加载和方法执行情况。  
它们是分析线上问题和定位性能瓶颈的关键手段。

一句话理解：

- 没有工具，JVM 问题基本只能靠猜
- 有了工具，问题定位才能从“感觉”变成“证据”

## 2. 为什么重要

JVM 问题往往表象很模糊，例如：

- CPU 飙高
- 内存上涨
- 请求变慢
- Full GC 频繁
- 线程卡死

如果没有工具支撑，你通常只能看到“系统不对劲”，却不知道：

- 是线程问题
- 是堆问题
- 是 GC 问题
- 还是类加载或代码热点问题

## 3. 先建立直觉：工具不是越多越好，而是要会对应问题

最实用的思路不是背命令大全，而是记住：

- 线程问题优先看 `jstack`
- 堆对象问题优先看 `jmap`
- GC 行为问题优先看 `jstat`
- 进程和参数信息优先看 `jps` / `jcmd`

也就是形成这条链路：

- 现象 -> 指标 -> 工具 -> 结论

## 4. 核心内容

### 4.1 `jps`

`jps` 主要用来：

- 查看当前机器上的 Java 进程

常见用途：

- 找 PID
- 确认目标进程是否存在

这是很多后续命令的起点。

### 4.2 `jcmd`

`jcmd` 可以理解成：

- 功能很强的统一诊断入口

它能做很多事情，例如：

- 查看 JVM 参数
- 查看系统属性
- 触发诊断命令
- 配合其他信息采集

如果你只想记一个非常通用的入口，`jcmd` 是很值得优先熟悉的。

### 4.3 `jstack`

`jstack` 主要用来看：

- 线程堆栈
- 锁等待关系
- 死锁信息

它特别适合分析：

- CPU 飙高
- 线程阻塞
- 死锁
- 线程池卡死

### 4.4 `jmap`

`jmap` 主要用来看：

- 堆对象分布
- 堆转储
- 类加载器统计

最常见用途：

- 导出 Heap Dump
- 看对象直方图

### 4.5 `jstat`

`jstat` 主要用来看：

- GC 统计
- 堆各区使用情况
- 回收次数和时间

它适合快速回答这些问题：

- 最近 GC 频不频繁
- 新生代 / 老年代压力大不大
- Full GC 有没有明显异常

### 4.6 VisualVM 和 Arthas

这两类工具更偏交互式和增强诊断：

- VisualVM：图形化观察 JVM 状态
- Arthas：线上动态诊断、方法跟踪、类信息查看

学习阶段建议先把 JDK 自带工具链打熟，再去补这些增强工具，会更稳。

## 5. 学习重点

这一章最重要的是掌握：

- 每个工具最擅长回答什么问题
- 工具要和现象对应使用
- 先确认进程，再定位线程、堆和 GC
- 收集数据不是终点，形成结论才是

## 6. 常见问题

### 6.1 会记命令，不知道何时用

这会导致你面对问题时虽然“工具都见过”，但还是下不了手。

### 6.2 只看单个指标，不做整体判断

例如只看堆大不大，却不结合：

- 线程状态
- GC 频率
- 对象分布

就很容易误判。

### 6.3 收集了大量数据却没有形成结论

工具输出只是材料，不是答案。  
真正重要的是把材料串成因果链。

## 7. 动手验证

这一节可以直接操作，而且我已经在当前环境里实际验证过一轮。

### 7.1 准备一个短生命周期目标进程

新建文件 `JvmToolTarget.java`，内容如下：

```java
import java.util.ArrayList;
import java.util.List;

public class JvmToolTarget {
    public static void main(String[] args) throws Exception {
        List<byte[]> list = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            list.add(new byte[1024 * 1024]);
        }
        System.out.println("JvmToolTargetStarted");
        Thread.sleep(15000);
    }
}
```

### 7.2 编译并启动

```bash
javac JvmToolTarget.java
java JvmToolTarget
```

让它运行着，不要立刻关闭终端。

### 7.3 用 `jps` 找 PID

```bash
jps -l
```

在当前环境里，我实际看到了类似：

```text
7136 JvmToolTarget
```

### 7.4 用 `jcmd` 看 JVM 参数

```bash
jcmd 7136 VM.flags
```

我实际看到了包含这类关键信息的输出：

```text
-XX:+UseG1GC
-XX:MaxHeapSize=...
```

这说明：

- `jcmd` 很适合快速看进程的 JVM 参数状态

### 7.5 用 `jstat` 看 GC 使用情况

```bash
jstat -gcutil 7136 250 1
```

我实际看到了类似表头和数值：

```text
S0 S1 E O ... YGC FGC GCT
```

这说明：

- `jstat` 可以快速观察堆区使用率和 GC 统计

### 7.6 用 `jstack` 看线程栈

```bash
jstack 7136
```

在当前环境里，我实际看到了：

```text
Full thread dump
"main" ...
```

这说明：

- `jstack` 已经抓到了线程快照

### 7.7 用 `jmap` 看对象分布

```bash
jmap -histo:live 7136
```

我实际看到了类似：

```text
num  #instances  #bytes  class name
[B
java.lang.String
java.lang.Class
```

这说明：

- `jmap` 能快速给你一份堆里对象分布概览

## 8. 每个工具最适合回答什么问题

| 工具 | 更适合回答的问题 |
| --- | --- |
| `jps` | 目标 Java 进程是谁、PID 是多少 |
| `jcmd` | 这个 JVM 当前带了什么参数、还能执行哪些诊断命令 |
| `jstack` | 线程在干什么、有没有阻塞或死锁 |
| `jstat` | GC 频率高不高、堆各区压力大不大 |
| `jmap` | 堆里到底是什么对象多、要不要进一步导出 heap dump |

## 9. 练习建议

下面这些练习做完，这一章会更扎实：

- 用 `jstack` 看一次线程阻塞状态
- 用 `jmap -histo:live` 看一次对象直方图
- 用 `jstat -gcutil` 连续采样几次观察 GC 变化
- 用 `jcmd <pid> help` 看看还能做哪些诊断动作
- 总结“线程问题、GC 问题、内存问题”分别优先用什么工具

## 10. 自测问题

- `jstack`、`jmap`、`jstat` 分别适合看什么？
- `jcmd` 为什么是一个很值得优先掌握的入口工具？
- 为什么诊断工具必须结合现象一起用？
- 如果系统 CPU 飙高，你通常会先用哪类工具？

## 11. 自测核对要点

如果你的回答能覆盖下面这些点，说明这一章基本掌握到位了：

- `jps` 用来找 Java 进程
- `jcmd` 适合统一查看 JVM 运行信息和执行诊断命令
- `jstack` 关注线程与锁
- `jmap` 关注堆对象分布与 dump
- `jstat` 关注 GC 和堆区统计
- 工具使用要围绕问题现象组织，而不是机械执行命令

