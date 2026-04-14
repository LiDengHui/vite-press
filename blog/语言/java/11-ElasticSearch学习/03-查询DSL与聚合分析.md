# 查询DSL与聚合分析

## 1. 这是什么

查询 DSL 是 ElasticSearch 描述搜索条件的结构化方式，聚合用于做统计、分组和分析。  
它们共同构成了 ES 最常用的业务能力。

## 2. 为什么重要

ES 不只是搜索引擎，也是分析引擎。  
学会查询和聚合，才能把搜索、筛选、统计和报表结合起来。

## 3. 核心内容

- match、term、range
- bool query
- filter 与 score
- sort 与分页
- terms aggregation、metric aggregation

## 4. 学习重点

- 理解 query 和 filter 的差异
- 理解相关性评分和精确过滤的边界
- 理解聚合会带来额外计算成本

## 5. 常见问题

- 把所有条件都放 query
- 不清楚 match 和 term 的适用差异
- 聚合用多了却不评估性能代价

## 6. 练习建议

- 为商品列表实现搜索 + 筛选 + 排序
- 写几个常见聚合统计例子
- 对比 filter 和 query 的查询效果

## 7. 自测问题

- match 和 term 分别适合什么查询
- filter 为什么通常更适合精确条件
- 聚合为什么既强大又昂贵
