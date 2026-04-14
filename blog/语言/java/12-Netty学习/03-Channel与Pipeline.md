# Channel与Pipeline

## 1. 这是什么

Channel 表示连接和 I/O 通道，Pipeline 表示事件处理链。  
它们是 Netty 把连接管理和业务处理组织起来的核心结构。

## 2. 为什么重要

理解 Channel 和 Pipeline，就能看懂网络事件如何进入程序，又如何在多级 handler 之间流转。  
这是 Netty 编程模型最关键的一部分。

## 3. 核心内容

- Channel
- ChannelHandler
- ChannelPipeline
- 入站事件和出站事件
- handler 链式处理

## 4. 学习重点

- 理解 Pipeline 是职责链模式的体现
- 理解入站和出站事件方向不同
- 理解 handler 拆分能提升可维护性

## 5. 常见问题

- 把所有逻辑塞进一个 handler
- 不区分入站和出站处理
- 不清楚 Channel 和 Pipeline 的层次关系

## 6. 练习建议

- 写一个包含多个 handler 的 pipeline 示例
- 画一张入站与出站事件流转图
- 总结职责链在 Netty 中的体现

## 7. 自测问题

- Pipeline 为什么是 Netty 处理链核心
- 入站和出站事件处理有什么区别
- 为什么 handler 拆分通常更合理
