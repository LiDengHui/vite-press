# Kafka基础架构

## 1. 这是什么

Kafka 基础架构描述了 Topic、Partition、Broker、Producer、Consumer 等组件如何协同工作。  
这是理解 Kafka 吞吐和扩展能力的起点。

一句话理解：

- Kafka 不是“一个超大队列”
- 它更像“按分区切开的分布式日志系统”

## 2. 为什么重要

如果不理解基本架构，很多配置和现象都会显得很抽象，例如：

- 为什么分区数会影响并发度
- 为什么消费组能扩展消费能力
- 为什么 Offset 是消费进度管理核心

## 3. 先建立直觉：Kafka 的高吞吐首先来自“分区日志”

Kafka 的吞吐能力不是凭空来的，而是建立在几个关键设计上：

- Topic 被切成多个 Partition
- 每个 Partition 本质上是有序追加日志
- 多个 Partition 可以并行读写

所以：

- 单个 Partition 强调局部顺序
- 多个 Partition 一起提供扩展能力

## 4. 核心内容

### 4.1 Topic

Topic 可以理解成：

- 一类消息的逻辑分类

例如：

- `order-created`
- `payment-success`

### 4.2 Partition

Partition 是 Kafka 的核心扩展单元。  
可以先这样理解：

- 一个 Topic 可以分成多个 Partition
- 每个 Partition 内部消息有顺序
- 多个 Partition 可以并行处理

### 4.3 Broker

Broker 是 Kafka 集群中的节点。  
它负责：

- 存储分区数据
- 接收生产者请求
- 服务消费者读取

### 4.4 Producer

Producer 负责：

- 发送消息到 Kafka

它除了“发消息”，还需要关心：

- 发到哪个 Topic
- 发到哪个 Partition
- 发送确认策略

### 4.5 Consumer Group

Consumer Group 是 Kafka 并行消费能力的关键。  
核心价值是：

- 同一消费组内共同消费一个 Topic
- 每个 Partition 同一时刻只会分配给组内一个消费者实例

所以消费组解决的是：

- 消费扩展与负载分担

### 4.6 Offset

Offset 可以理解成：

- 消费进度位置

它不是“消息 ID”，更像是：

- 这个分区日志已经读到哪里了

## 5. 学习重点

这一章最重要的是掌握：

- Kafka 的扩展能力主要建立在分区模型上
- 消费组是并行消费的重要基础
- Offset 是消费进度管理核心
- Topic、Partition、Broker 是不同层次的概念

## 6. 常见问题

### 6.1 把 Topic 和队列简单等同

Kafka 更接近日志流模型，而不是传统单队列心智模型。

### 6.2 不理解分区为什么影响并发度

分区数量往往决定了消费组的并行上限。

### 6.3 忽视 Offset 管理带来的消费语义问题

Offset 不是细枝末节，它直接影响：

- 是否重复消费
- 是否漏消费

## 7. 动手验证

当前环境没有 Kafka CLI 和可用镜像，所以这里用纯 Java 小 demo 验证 Topic / Partition / Offset 的核心概念。

### 7.1 准备一个可运行示例

新建文件 `KafkaArchitectureDemo.java`，内容如下：

```java
import java.util.ArrayList;
import java.util.List;

public class KafkaArchitectureDemo {
    static class Record {
        final String key;
        final String value;
        final int partition;
        final long offset;

        Record(String key, String value, int partition, long offset) {
            this.key = key;
            this.value = value;
            this.partition = partition;
            this.offset = offset;
        }
    }

    public static void main(String[] args) {
        int partitions = 3;
        List<List<Record>> topic = new ArrayList<>();
        for (int i = 0; i < partitions; i++) {
            topic.add(new ArrayList<>());
        }

        send(topic, "order-1", "created");
        send(topic, "order-2", "created");
        send(topic, "order-1", "paid");

        for (int p = 0; p < topic.size(); p++) {
            List<Record> records = topic.get(p);
            System.out.println("partition=" + p + ",recordCount=" + records.size());
            for (Record record : records) {
                System.out.println("key=" + record.key + ",value=" + record.value
                        + ",partition=" + record.partition + ",offset=" + record.offset);
            }
        }
    }

    private static void send(List<List<Record>> topic, String key, String value) {
        int partition = Math.abs(key.hashCode()) % topic.size();
        List<Record> records = topic.get(partition);
        long offset = records.size();
        records.add(new Record(key, value, partition, offset));
    }
}
```

### 7.2 编译并运行

```bash
javac KafkaArchitectureDemo.java
java KafkaArchitectureDemo
```

### 7.3 你应该观察到什么

输出不一定完全一致，但应包含这些关键信息：

```text
partition=...
key=order-1,value=created,...offset=0
key=order-1,value=paid,...offset=1
```

### 7.4 每一行在验证什么

- 相同 key 的消息会落到同一个分区：说明分区键会影响路由
- 同一分区里的 offset 递增：说明 Partition 本质上是有序追加日志
- 不同分区各自维护自己的 offset：说明 Offset 是“分区维度的消费进度”

## 8. 练习建议

- 画一张 Kafka 基础架构图
- 说明一个 Topic 多分区的意义
- 总结 Broker、Partition、Consumer Group 的关系
- 用自己的话解释为什么 Kafka 更像日志系统而不是普通队列

## 9. 自测问题

- Kafka 的高吞吐为什么离不开分区设计？
- 消费组解决了什么问题？
- Offset 为什么是消费系统的重要概念？
- 为什么说单个 Partition 内有序，不等于全局有序？

## 10. 自测核对要点

- Topic 是逻辑分类，Partition 是扩展单元，Broker 是承载节点
- 分区提供并行能力
- Consumer Group 提供消费扩展和负载均衡
- Offset 是分区维度的消费进度位置
