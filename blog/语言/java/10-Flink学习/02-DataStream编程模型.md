# DataStream编程模型

## 1. 这是什么

DataStream 是 Flink 中处理流数据的核心 API 模型。  
它强调从数据源到转换再到输出的连续处理链路。

## 2. 为什么重要

掌握 DataStream，才能真正理解 Flink 的编程方式和算子思维。  
这也是从传统批处理思维切换到流处理思维的关键。

## 3. 核心内容

- Source
- Transformation
- Sink
- map、flatMap、filter
- keyBy
- process 基础认知

## 4. 学习重点

- 理解流任务是持续运行的
- 理解 keyBy 如何影响后续状态和聚合
- 理解算子链是流处理逻辑的主干

## 5. 常见问题

- 用批处理思维看待流作业
- 忽视 keyBy 对数据分布的影响
- 不清楚 Source 和 Sink 的语义边界

## 6. 练习建议

- 写一个简单的实时统计 demo
- 对比 map、flatMap、process 的使用场景
- 总结常见流式算子职责

## 7. 自测问题

- DataStream 模型的基本链路是什么
- keyBy 为什么是很多状态算子的前提
- Flink 的流式处理和传统批处理思维有什么差异
