# Redis核心数据结构

## 1. 这是什么

Redis 提供了多种内存数据结构来支撑不同业务场景。
数据结构选型，是 Redis 使用质量的起点。

一句话理解：

- Redis 不是“只能存字符串的缓存”
- 它更像一组带有不同语义和性能特征的内存结构工具箱

## 2. 为什么重要

同样一份业务数据，用不同结构表示，性能、空间和操作复杂度都会不同。
选错结构，后面的扩展和优化都会变难。

例如：

- 排行榜更适合 `ZSet`
- 去重更适合 `Set`
- 对象字段缓存更适合 `Hash`

如果一律都塞进 `String`，短期可能快，长期往往越来越难维护。

## 3. 先建立直觉：先看操作，再选结构

选 Redis 结构时，最实用的问题不是：

- “哪个结构最高级”

而是：

- 你主要要做什么操作

| 业务需求 | 更适合的结构 |
| --- | --- |
| 单值缓存、计数 | `String` |
| 对象字段局部更新 | `Hash` |
| 顺序列表、简单队列 | `List` |
| 去重集合 | `Set` |
| 排行榜、按分值排序 | `ZSet` |
| 位统计 | `Bitmap` |
| 海量 UV 估算 | `HyperLogLog` |

## 4. 核心内容

### 4.1 String

`String` 是最基础、最常用的结构。

适合：

- 缓存单值
- 计数器
- 分布式锁 key
- 小型 JSON 字符串

不要被名字骗了，它不只是“文本字符串”。

### 4.2 Hash

`Hash` 更适合：

- 一个对象的多个字段

例如用户信息：

- `name`
- `age`
- `status`

它的优势是：

- 可以按字段局部读取和更新

### 4.3 List

`List` 适合：

- 保持顺序的数据
- 头尾操作
- 简单消息列表

学习阶段更重要的是知道：

- 它适合“顺序序列”
- 但不是所有队列场景都该无脑用 `List`

### 4.4 Set

`Set` 的核心价值是：

- 元素唯一
- 支持成员判断
- 支持集合运算

典型场景：

- 标签集合
- 去重用户
- 共同关注关系

### 4.5 ZSet

`ZSet` 的核心特点是：

- 元素唯一
- 每个元素带一个 score
- 支持按分值排序

这让它特别适合：

- 排行榜
- 延迟任务排序
- 按时间或权重排序的集合

### 4.6 Bitmap 与 HyperLogLog

#### Bitmap

适合：

- 签到
- 用户活跃标记
- 位级统计

#### HyperLogLog

适合：

- UV 估算
- 海量去重计数

它的核心特点是：

- 节省内存
- 结果是近似值

## 5. 学习重点

这一章最重要的是掌握：

- 结构能力要和业务模型匹配
- `String`、`Hash`、`Set`、`ZSet` 是最高频结构
- Redis 结构选型会直接影响性能和维护性
- Redis 不能被简单理解成“字符串缓存”

## 6. 常见问题

### 6.1 无论什么场景都用 String

这会让后续查询、局部更新、排序和去重都越来越别扭。

### 6.2 不理解 ZSet 在排序场景的优势

结果用 List 或 String 自己维护排序，复杂度会明显升高。

### 6.3 忽视结构带来的空间开销

不同结构不仅语义不同，内存表现也会不同。

## 7. 动手验证

当前环境没有 `redis-cli`，但我已经实际验证了用 Docker 运行 Redis 容器的方式。
先准备一个临时实验环境：

```bash
docker run -d --name redis-lab -p 6380:6379 redis:7-alpine
docker exec redis-lab redis-cli PING
```

如果返回：

```text
PONG
```

说明 Redis 实验环境已经可用。

### 7.1 String：单值与计数

```bash
docker exec redis-lab redis-cli SET demo:key hello
docker exec redis-lab redis-cli GET demo:key
docker exec redis-lab redis-cli INCR counter:order
```

### 7.2 Hash：对象字段

```bash
docker exec redis-lab redis-cli HSET demo:user name Alice age 18
docker exec redis-lab redis-cli HGETALL demo:user
```

### 7.3 ZSet：排行榜

```bash
docker exec redis-lab redis-cli ZADD demo:rank 100 alice 120 bob
docker exec redis-lab redis-cli ZREVRANGE demo:rank 0 -1 WITHSCORES
```

### 7.4 TTL：过期能力

```bash
docker exec redis-lab redis-cli SETEX demo:ttl 5 value
docker exec redis-lab redis-cli TTL demo:ttl
```

### 7.5 当前环境里我实际验证到了这些结果

我已经实际看到过这些关键信息：

```text
PONG
hello
name
Alice
age
18
bob
120
alice
100
5
```

它们分别对应：

- Redis 容器启动成功
- `String` 写入和读取成功
- `Hash` 字段存取成功
- `ZSet` 排行结果按分值排序
- TTL 已成功生效

## 8. 练习建议

- 用不同结构实现排行榜、去重、计数
- 总结每种结构的适用场景
- 对比一个场景下多种结构的利弊
- 试着把一个对象分别用 `String JSON` 和 `Hash` 表达

## 9. 自测问题

- `ZSet` 为什么适合排行榜？
- `Hash` 和 `String` 在对象存储上各有什么特点？
- 什么业务更适合 `Set` 或 `Bitmap`？
- 为什么 Redis 结构选择会直接影响方案质量？

## 10. 自测核对要点

- `String` 适合单值和计数
- `Hash` 适合对象字段
- `List` 适合顺序序列
- `Set` 适合去重
- `ZSet` 适合排序场景
- 结构选型会直接影响性能、表达力和维护性
