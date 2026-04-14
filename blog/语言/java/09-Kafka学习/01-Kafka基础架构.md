# Kafka基础架构

## 1. 这是什么

Kafka 基础架构描述了 Topic、Partition、Broker、Producer、Consumer 等组件如何协同工作。  
这是理解 Kafka 吞吐和扩展能力的起点。

## 2. 为什么重要

如果不理解基本架构，很多配置和现象都会显得很抽象。  
架构理解越清楚，越容易解释分区、副本、消费组等概念。

## 3. 核心内容

- Topic
- Partition
- Broker
- Producer
- Consumer Group
- Offset

## 4. 学习重点

- 理解 Kafka 的扩展能力主要建立在分区模型上
- 理解消费组是并行消费的重要基础
- 理解 Offset 是消费进度管理核心

## 5. 常见问题

- 把 Topic 和队列简单等同
- 不理解分区为什么影响并发度
- 忽视 Offset 管理带来的消费语义问题

## 6. 练习建议

- 画一张 Kafka 基础架构图
- 说明一个 Topic 多分区的意义
- 总结 Broker、Partition、Consumer Group 的关系

## 7. 自测问题

- Kafka 的高吞吐为什么离不开分区设计
- 消费组解决了什么问题
- Offset 为什么是消费系统的重要概念
