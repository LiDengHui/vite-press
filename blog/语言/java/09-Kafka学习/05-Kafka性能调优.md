# Kafka性能调优

## 1. 这是什么

Kafka 性能调优关注吞吐、延迟、稳定性和资源利用之间的平衡。  
它涉及生产端、Broker 端和消费端多个环节。

一句话理解：

- Kafka 调优不是只改 Producer 参数
- 它更像一条“生产 -> 存储 -> 消费”的全链路优化题

## 2. 为什么重要

Kafka 往往承载高峰流量。  
一旦性能配置不合理，就容易出现：

- 消息积压
- 延迟飙升
- 资源耗尽

## 3. 先建立直觉：吞吐和延迟通常要做平衡

一个很重要的学习直觉是：

- 想把吞吐做高，通常会接受更多批量和等待
- 想把延迟做低，通常会接受更频繁的小批次发送

所以调优并不是找“绝对最好参数”，而是：

- 找当前业务目标下更合适的平衡点

## 4. 核心内容

### 4.1 批量发送

批量发送的价值在于：

- 减少请求次数
- 提高吞吐

但批量越大，往往意味着：

- 单次等待更长
- 单批失败影响范围更大

### 4.2 压缩

压缩的核心价值是：

- 降低网络和磁盘压力

但它也会带来：

- CPU 开销

### 4.3 `linger.ms`

`linger.ms` 可以简单理解成：

- Producer 愿意额外等多久，把更多消息攒成一批再发

它直接体现了：

- 延迟和吞吐的权衡

### 4.4 `batch.size`

`batch.size` 控制的是：

- 批量发送缓冲区的容量上限

并不是越大越一定更好。  
要结合：

- 消息体大小
- 发送频率
- 延迟目标

### 4.5 分区数量设计

分区数会影响：

- 并行能力
- 顺序语义
- 再均衡成本
- 资源管理复杂度

所以分区不是越多越好。

### 4.6 消费并发与积压治理

消息积压通常不是单点问题，而是链路问题。  
你要同时看：

- 生产速度
- Broker 承载
- 消费速度
- 下游处理能力

## 5. 学习重点

这一章最重要的是掌握：

- 吞吐和延迟常常要做平衡
- 性能问题不只在 Producer 配置
- 分区数、消费并发、下游能力都要一起看
- 积压治理比“盲目调大参数”更重要

## 6. 常见问题

### 6.1 一味追求更大 batch

这样很可能吞吐上去了，但延迟也被拉高了。

### 6.2 消费端处理慢却只调 Broker 参数

这是典型的“症状没分层分析”。

### 6.3 分区数量设计脱离业务规模

会导致管理复杂度和收益不匹配。

## 7. 动手验证

当前环境没有 Kafka 集群，这里用纯 Java 小 demo 验证“批量发送减少请求次数，但会增加等待”的基本心智。

### 7.1 准备一个可运行示例

新建文件 `KafkaBatchDemo.java`，内容如下：

```java
public class KafkaBatchDemo {
    public static void main(String[] args) {
        int messageCount = 100;

        int noBatchRequests = messageCount;
        int batchSize = 10;
        int batchRequests = (messageCount + batchSize - 1) / batchSize;

        System.out.println("messageCount=" + messageCount);
        System.out.println("noBatchRequests=" + noBatchRequests);
        System.out.println("batchRequests=" + batchRequests);
        System.out.println("requestReduction=" + (noBatchRequests - batchRequests));
    }
}
```

### 7.2 编译并运行

```bash
javac KafkaBatchDemo.java
java KafkaBatchDemo
```

### 7.3 你应该观察到什么

```text
messageCount=100
noBatchRequests=100
batchRequests=10
requestReduction=90
```

### 7.4 每一行在验证什么

- `noBatchRequests=100`：说明不批量时，每条消息都可能对应一次发送动作
- `batchRequests=10`：说明做批量后，请求次数显著下降
- `requestReduction=90`：说明批量发送的吞吐收益本质来自“减少交互次数”

## 8. 练习建议

- 对比不同批量配置的效果
- 设计一个积压排查流程
- 总结 Kafka 调优的常见指标
- 用自己的话解释 `linger.ms` 和 `batch.size` 的差别

## 9. 自测问题

- 为什么 Kafka 调优要同时看吞吐和延迟？
- 消息积压通常会从哪些环节产生？
- 分区数设计为什么会影响整体性能模型？
- 为什么“把批量调大”不等于一定更优？

## 10. 自测核对要点

- Kafka 调优是全链路问题，不是单点参数游戏
- 批量和 linger 会影响吞吐与延迟平衡
- 分区设计、消费能力和下游处理能力都会影响最终表现
- 积压治理需要回到链路瓶颈定位

