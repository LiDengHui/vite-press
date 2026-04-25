# SQL优化与执行计划

## 1. 这是什么

SQL 优化是通过调整查询写法、索引设计和访问路径，让数据库更高效地完成查询。  
执行计划则是分析优化效果的重要依据。

一句话理解：

- SQL 优化不是“改写得更短”
- 而是让数据库少扫数据、少回表、少排序、少做无用功

## 2. 为什么重要

接口慢往往不是 Java 代码慢，而是 SQL 跑得慢。  
会看执行计划，是从“感觉优化”走向“证据优化”的关键一步。

## 3. 先建立直觉：先看执行计划，再谈优化

最常见的优化误区是：

- 先重写 SQL
- 再猜它会不会变快

正确顺序通常是：

1. 看 SQL 干了什么
2. 看数据量和条件
3. 看 `EXPLAIN`
4. 再决定改 SQL、改索引，还是改分页方式

## 4. 核心内容

### 4.1 `EXPLAIN`

`EXPLAIN` 的核心价值是：

- 它能让你看到数据库打算怎么执行

最值得先关注的通常有：

- `type`
- `key`
- `rows`
- `Extra`

### 4.2 索引命中情况

如果你建了索引，但 `EXPLAIN` 里没有用上，就要继续问：

- 是索引没设计好
- 还是 SQL 写法破坏了索引利用

### 4.3 扫描行数

`rows` 能帮助你粗略判断：

- 这条 SQL 大概要扫多少数据

这通常比“代码看起来复杂不复杂”更有参考价值。

### 4.4 排序与临时表

这些关键词要特别敏感：

- `Using filesort`
- `Using temporary`

它们不一定一定错，但经常是性能风险信号。

### 4.5 分页优化

大分页是高频慢 SQL 来源之一。  
例如：

```sql
LIMIT 100000, 20
```

数据库往往仍然要先跳过大量前置数据。  
更稳的方向通常是：

- 基于游标分页
- 先定位主键，再回表

### 4.6 典型慢 SQL 成因

最常见的慢 SQL 根因包括：

- 没走索引
- 索引顺序不匹配
- 回表过多
- 排序代价高
- 大偏移量分页
- 返回字段过多

## 5. 学习重点

这一章最重要的是掌握：

- SQL 优化必须依赖执行计划
- 要同时看过滤、排序、分页和返回列
- 大分页和无效排序是高频风险点
- 优化目标是减少扫描和无效 I/O

## 6. 常见问题

### 6.1 只凭经验重写 SQL

没有执行计划，优化就容易变成试错。

### 6.2 忽视 `EXPLAIN` 给出的扫描成本

结果往往是“语句看起来更优雅了，但数据库并没有更省力”。

### 6.3 大分页场景仍直接使用 `offset`

这是后台列表型系统中非常常见的隐性风险。

## 7. 动手验证

当前环境没有 `mysql` 客户端，所以这里整理成可直接复制到 MySQL 环境执行的实验步骤。

### 7.1 准备测试表

```sql
DROP TABLE IF EXISTS sql_opt_demo;

CREATE TABLE sql_opt_demo (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at DATETIME NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    KEY idx_user_status_created (user_id, status, created_at),
    KEY idx_created_at (created_at)
);
```

### 7.2 观察排序与索引命中

```sql
EXPLAIN
SELECT user_id, status, created_at
FROM sql_opt_demo
WHERE user_id = 1
  AND status = 'PAID'
ORDER BY created_at DESC
LIMIT 20;
```

重点看：

- `key`
- `rows`
- `Extra`

### 7.3 观察函数导致的风险

```sql
EXPLAIN
SELECT *
FROM sql_opt_demo
WHERE DATE(created_at) = '2026-01-01';
```

再对比：

```sql
EXPLAIN
SELECT *
FROM sql_opt_demo
WHERE created_at >= '2026-01-01 00:00:00'
  AND created_at < '2026-01-02 00:00:00';
```

### 7.4 观察大分页问题

```sql
EXPLAIN
SELECT id, created_at
FROM sql_opt_demo
ORDER BY created_at DESC
LIMIT 100000, 20;
```

再对比“基于游标”的方式：

```sql
EXPLAIN
SELECT id, created_at
FROM sql_opt_demo
WHERE created_at < '2026-01-10 12:00:00'
ORDER BY created_at DESC
LIMIT 20;
```

## 8. 练习建议

- 拿几条真实 SQL 做执行计划分析
- 对比优化前后的执行路径
- 总结几类常见分页优化方式
- 总结 `rows`、`key`、`Extra` 各自最值得关注什么

## 9. 自测问题

- 为什么 SQL 优化必须依赖执行计划？
- 哪些现象通常提示 SQL 可能存在性能问题？
- 为什么大分页经常会拖慢查询？
- `Using filesort` 和 `Using temporary` 为什么值得警惕？

## 10. 自测核对要点

- SQL 优化的核心是让数据库少做无效工作
- `EXPLAIN` 是最重要的优化分析起点
- 扫描行数、索引命中、排序和回表成本都必须一起看
- 大偏移量分页和不合理排序是高频慢查询来源
