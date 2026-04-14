# SQL优化

## 1. 这是什么

SQL 优化是通过改写语句、调整索引和分析执行路径，让数据库以更低成本完成查询。  
它是后端性能优化里最直接、最高收益的一环。

一句话理解：

- SQL 优化不是“把语句写短一点”
- 而是让数据库走更便宜的执行路径

## 2. 为什么重要

很多系统慢，不是 Java 代码慢，而是 SQL 跑得慢。  
SQL 优化能力越强，系统整体性能就越稳定。

而且 SQL 问题还有一个特点：

- 上游业务代码看起来可能都正常
- 但数据库一慢，整条链路都会被拖住

## 3. 先建立直觉：优化 SQL 先不要急着改语句

正确顺序通常是：

1. 先看 SQL 在干什么
2. 再看数据量和过滤条件
3. 再看执行计划
4. 最后再改写 SQL 或补索引

如果跳过分析，直接“经验优化”，很容易出现：

- 索引加了但没用上
- SQL 改复杂了但没更快
- 只优化了个别数据量场景

## 4. 核心内容

### 4.1 慢 SQL 的常见成因

最常见的几类原因：

- 没走索引
- 索引设计不合理
- 扫描行数太多
- 排序和分页代价过高
- 回表成本过高
- `join` 顺序或条件不合理

真正的重点不是背这张清单，而是学会从执行计划里验证。

### 4.2 为什么 `EXPLAIN` 是起点

`EXPLAIN` 的价值是：

- 它告诉你数据库实际上怎么执行

优化 SQL 之前，至少先回答这些问题：

- 用了哪个索引
- 扫了多少行
- 有没有临时表
- 有没有文件排序
- 有没有回表风险

### 4.3 哪些写法容易导致全表扫描

常见高风险场景包括：

- 索引列上做函数计算
- 隐式类型转换
- 联合索引顺序不匹配
- 条件选择性太差
- 用法破坏最左前缀

所以问题不一定是“没索引”，也可能是：

- 索引有，但 SQL 写法让它很难用上

### 4.4 排序与分页为什么是高风险点

排序如果没有合适索引支撑，就容易出现：

- `Using filesort`

分页如果使用大偏移量：

```sql
LIMIT 100000, 20
```

数据库往往仍然需要先跳过大量前置记录。  
这类分页在数据量大时会非常吃力。

### 4.5 大偏移量分页怎么优化

常见更稳的思路有两类：

- 基于上次游标值翻页
- 先用索引拿主键，再回表取数据

也就是说，你要尽量避免让数据库“白白跳过很多行”。

### 4.6 优化不是只加索引

SQL 优化常常是多手段一起做：

- 改查询条件
- 改返回列
- 改分页方式
- 改排序路径
- 加或调索引

只想着“慢了就加索引”，很容易越加越乱。

## 5. 学习重点

这一章最重要的是掌握这些判断：

- SQL 优化必须以执行计划为依据
- 优化要同时看过滤、排序、分页和返回列
- 全表扫描、临时表、文件排序通常值得重点关注
- 大偏移量分页是高频风险点
- 最终目标是降低扫描和回表成本

## 6. 常见问题

### 6.1 不分析数据分布，只看表面语句

同一条 SQL，在不同数据量、不同选择性下，执行表现可能完全不同。

### 6.2 一味依赖索引，不调整 SQL 写法

索引不是万能补丁。  
SQL 写法不配合，再好的索引也可能用不好。

### 6.3 对大偏移量分页没有风险意识

这是很多后台列表类接口的典型性能坑。

## 7. 动手验证

这一节整理成可直接在 MySQL 环境里操作的实验步骤。  
当前环境没有 `mysql` 客户端，所以我没有在本机直接执行，但脚本已经按验证顺序整理好了。

### 7.1 准备测试表

```sql
DROP TABLE IF EXISTS user_order_demo;

CREATE TABLE user_order_demo (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    created_at DATETIME NOT NULL,
    remark VARCHAR(255) DEFAULT NULL,
    KEY idx_user_status_created (user_id, status, created_at),
    KEY idx_created_at (created_at)
);
```

### 7.2 观察普通查询

```sql
EXPLAIN
SELECT *
FROM user_order_demo
WHERE user_id = 1001
  AND status = 'PAID'
ORDER BY created_at DESC
LIMIT 20;
```

重点看：

- `key`
- `rows`
- `Extra`

### 7.3 观察“只取必要列”带来的变化

```sql
EXPLAIN
SELECT user_id, status, created_at
FROM user_order_demo
WHERE user_id = 1001
  AND status = 'PAID'
ORDER BY created_at DESC
LIMIT 20;
```

重点观察：

- 是否更容易出现覆盖索引收益
- `Extra` 是否更友好

### 7.4 观察函数导致索引失效的风险

```sql
EXPLAIN
SELECT *
FROM user_order_demo
WHERE DATE(created_at) = '2026-01-01';
```

你可以再对比：

```sql
EXPLAIN
SELECT *
FROM user_order_demo
WHERE created_at >= '2026-01-01 00:00:00'
  AND created_at < '2026-01-02 00:00:00';
```

这个对比很适合观察：

- 同样是按日期筛选，写法不同，索引利用可能完全不同

### 7.5 观察大偏移量分页风险

```sql
EXPLAIN
SELECT id, user_id, status, created_at
FROM user_order_demo
ORDER BY created_at DESC
LIMIT 100000, 20;
```

再对比一种“基于游标”的写法：

```sql
EXPLAIN
SELECT id, user_id, status, created_at
FROM user_order_demo
WHERE created_at < '2026-01-10 10:00:00'
ORDER BY created_at DESC
LIMIT 20;
```

重点观察：

- 扫描行数是否明显不同

## 8. 你应该怎么验证结果

完成上面实验后，重点观察这些信息：

- `key` 是否命中预期索引
- `rows` 预估扫描量是否下降
- `Extra` 是否出现 `Using filesort`
- 是否出现 `Using temporary`
- 返回列变化是否降低回表成本

## 9. 练习建议

下面这些练习做完，这一章会更扎实：

- 分析几条典型慢 SQL
- 对比优化前后的执行计划
- 总结排序、分页、范围查询的常见优化策略
- 总结“索引问题”和“SQL 写法问题”的判断边界

## 10. 自测问题

- 为什么 SQL 优化要以执行计划为依据？
- 哪些情况容易导致全表扫描？
- 大偏移量分页为什么容易性能变差？
- 为什么只取必要列有时会更快？
- SQL 优化为什么不能只靠“多加索引”？

## 11. 自测核对要点

如果你的回答能覆盖下面这些点，说明这一章基本掌握到位了：

- SQL 优化的核心是降低数据库执行成本
- `EXPLAIN` 是优化分析的起点
- 索引命中、扫描行数、排序与回表成本都要一起看
- 大偏移量分页和不合理排序是高频慢 SQL 来源
- 优化要结合 SQL 写法、索引设计和数据分布综合判断

