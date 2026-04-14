# 状态管理与Checkpoint

## 1. 这是什么

状态管理是 Flink 维护流计算上下文的能力，checkpoint 用于在失败时恢复一致状态。  
这是 Flink 区别于很多简单流式框架的核心优势之一。

## 2. 为什么重要

没有状态，就很难做复杂流计算；没有 checkpoint，就很难保证容错和一致性。  
理解这两者，是真正掌握 Flink 的关键。

## 3. 核心内容

- Keyed State
- Operator State
- State Backend 基本认知
- Checkpoint
- Savepoint
- 状态一致性

## 4. 学习重点

- 理解状态不是临时变量，而是持续计算上下文
- 理解 checkpoint 用于容错恢复
- 理解 savepoint 更偏向可控迁移和升级

## 5. 常见问题

- 不清楚状态会占用多少资源
- checkpoint 开了却不了解恢复语义
- 把 savepoint 和 checkpoint 完全混为一谈

## 6. 练习建议

- 写一个带状态的流式统计示例
- 总结 checkpoint 和 savepoint 的区别
- 结合故障恢复流程理解一致性保障

## 7. 自测问题

- Flink 为什么必须有状态管理
- checkpoint 主要解决什么问题
- savepoint 更适合哪些场景
