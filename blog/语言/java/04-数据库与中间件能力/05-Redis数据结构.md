# Redis数据结构

## 1. 这是什么

Redis 提供了多种高性能内存数据结构，用于承载缓存、计数、排行榜、去重等场景。  
理解数据结构，是用好 Redis 的前提。

一句话理解：

- Redis 不是“只能存字符串的缓存”
- 它更像一组带有不同语义和性能特征的内存结构工具箱

## 2. 为什么重要

Redis 用不好，缓存层会变成新的问题来源。  
选对结构，才能真正发挥它的性能优势和业务价值。

同样一份业务需求：

- 用对结构，代码简单、性能稳定
- 用错结构，数据模型别扭、维护成本高、性能也差

## 3. 先建立直觉：先看业务操作，再选结构

选择 Redis 结构时，最实用的问题不是：

- “这个结构高级不高级”

而是：

- 你主要在做什么操作

例如：

| 业务需求           | 更适合的结构  |
| ------------------ | ------------- |
| 单值缓存、计数器   | `String`      |
| 对象字段缓存       | `Hash`        |
| 消息列表、队列     | `List`        |
| 去重集合           | `Set`         |
| 排行榜、带分值排序 | `ZSet`        |
| 位图统计           | `Bitmap`      |
| 海量基数估算       | `HyperLogLog` |

## 4. 核心内容

### 4.1 String

`String` 是最基础、最常用的结构。

适合：

- 缓存单个值
- 计数器
- 分布式锁 key
- 小型 JSON 字符串

别被名字骗了，它底层不只是“文本字符串”概念。  
很多数值、序列化对象也会用它承载。

### 4.2 Hash

`Hash` 很适合表示：

- 一个对象的多个字段

例如一个用户资料：

- `name`
- `age`
- `status`

它的价值在于：

- 不必整个对象整块覆盖
- 可以单字段读写

### 4.3 List

`List` 适合：

- 头尾追加
- 简单消息队列
- 时间线列表

学习阶段更重要的是知道：

- 它适合有顺序的数据
- 但并不是所有队列都应该无脑用 Redis List 实现

### 4.4 Set

`Set` 适合：

- 去重
- 判断成员是否存在
- 集合运算

典型场景：

- 去重用户 ID
- 共同关注
- 标签集合

### 4.5 ZSet

`ZSet` 是 Redis 非常有代表性的结构之一。  
它的核心特点是：

- 元素唯一
- 每个元素带一个 score
- 可以按 score 排序

所以它特别适合：

- 排行榜
- 延迟任务时间排序
- 按权重或时间排序的集合

### 4.6 Bitmap 和 HyperLogLog 的基础认知

#### Bitmap

适合：

- 布尔位统计
- 签到
- 用户活跃标记

#### HyperLogLog

适合：

- UV 这类“只关心大致去重数量”的场景

它的特点是：

- 节省内存
- 结果是近似值

## 5. 学习重点

这一章最重要的是掌握：

- 结构选择要和业务操作模式匹配
- `String`、`Hash`、`Set`、`ZSet` 是最常见高频结构
- Redis 不是只能当字符串缓存
- 结构选错会直接影响方案质量和后续可维护性

## 6. 常见问题

### 6.1 一个结构解决所有业务

例如把所有对象都序列化成一个大字符串塞进 `String`，后续读写和局部更新都会越来越难受。

### 6.2 不考虑数据规模和访问模式

结构选型不能只看“能不能存”，还要看：

- 读写频率
- 是否要排序
- 是否要去重
- 是否要单字段更新

### 6.3 把复杂业务对象不加设计地直接塞进缓存

这会让缓存层越来越像一个难维护的黑盒。

## 7. 动手验证

这一节适合直接在 `redis-cli` 中操作。  
当前环境没有 `redis-cli`，所以我没有在本机直接执行，但命令都已经按可验证顺序整理好了。

### 7.1 String：缓存与计数

```bash
SET user:1:name Alice
GET user:1:name

SET counter:order 0
INCR counter:order
INCRBY counter:order 5
GET counter:order
```

观察点：

- `String` 既能存值，也能做简单计数

### 7.2 Hash：对象字段存储

```bash
HSET user:1 name Alice age 18 status ACTIVE
HGET user:1 name
HGETALL user:1
HINCRBY user:1 age 1
HGET user:1 age
```

观察点：

- 字段可以单独读取和修改

### 7.3 List：顺序列表

```bash
DEL feed:1
RPUSH feed:1 msg1 msg2 msg3
LRANGE feed:1 0 -1
LPOP feed:1
LRANGE feed:1 0 -1
```

观察点：

- `List` 保持插入顺序
- 头尾操作方便

### 7.4 Set：去重集合

```bash
DEL tag:user:1
SADD tag:user:1 java redis mysql
SADD tag:user:1 java
SMEMBERS tag:user:1
SISMEMBER tag:user:1 redis
SCARD tag:user:1
```

观察点：

- 重复元素不会重复存储

### 7.5 ZSet：排行榜

```bash
DEL rank:game
ZADD rank:game 100 alice 180 bob 160 carol
ZRANGE rank:game 0 -1 WITHSCORES
ZREVRANGE rank:game 0 2 WITHSCORES
ZINCRBY rank:game 30 alice
ZREVRANGE rank:game 0 2 WITHSCORES
```

观察点：

- 元素可以按分数排序
- 分数更新后排名会变化

## 8. 你应该怎么验证结果

做完上面实验后，重点感受这些差异：

- `String` 更适合简单值和计数
- `Hash` 更适合对象字段
- `List` 更适合顺序序列
- `Set` 更适合去重
- `ZSet` 更适合带分值的排序场景

## 9. 练习建议

下面这些练习做完，这一章会更扎实：

- 分别用几种结构实现不同业务示例
- 总结一张 Redis 结构选型表
- 复盘排行榜、去重、计数这些经典场景
- 对比对象序列化成 `String` 和拆成 `Hash` 的使用差异

## 10. 自测问题

- `ZSet` 为什么适合排行榜？
- `Set` 和 `Hash` 分别更适合什么场景？
- Redis 数据结构选择为什么直接影响方案质量？
- 为什么说结构选型要先看操作模式，而不是先看数据长什么样？

## 11. 自测核对要点

如果你的回答能覆盖下面这些点，说明这一章基本掌握到位了：

- `String` 适合单值和计数
- `Hash` 适合对象字段存储
- `List` 适合有顺序的序列
- `Set` 适合去重
- `ZSet` 适合按 score 排序的业务
- Redis 结构选择会直接影响性能、表达力和可维护性
