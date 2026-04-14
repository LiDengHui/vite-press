# JDBC与连接池

## 1. 这是什么

JDBC 是 Java 访问关系型数据库的标准方式。  
连接池则负责复用数据库连接，减少连接创建和销毁的成本。

一句话理解：

- JDBC 解决的是“Java 怎么和数据库说话”
- 连接池解决的是“这条通道怎么别每次都重新造”

## 2. 为什么重要

数据库连接是昂贵资源。  
如果不了解 JDBC 和连接池，就很难解释这些问题：

- 为什么接口慢
- 为什么连接数高
- 为什么数据库被打满
- 为什么偶尔会报连接超时

连接池用得好，系统吞吐和稳定性会提升很多；用不好，则可能把数据库直接拖垮。

## 3. 先建立直觉：慢 SQL 不只影响 SQL，本质上也会影响连接池

很多人把连接池问题和 SQL 问题分开看，其实它们经常是连在一起的。

如果某条 SQL 很慢：

- 它会长时间占着连接不放
- 池里的可用连接就会减少
- 后面的请求会继续排队
- 最终表现成“连接池不够用了”

所以连接池不是独立系统，它和：

- SQL 性能
- 线程并发
- 数据库容量

都强相关。

## 4. 核心内容

### 4.1 JDBC 的基本流程

最常见的 JDBC 访问流程大致是：

1. 获取连接
2. 创建语句对象
3. 执行 SQL
4. 处理结果集
5. 关闭资源

示意代码：

```java
Connection conn = dataSource.getConnection();
PreparedStatement ps = conn.prepareStatement("select * from user where id = ?");
ps.setLong(1, 1L);
ResultSet rs = ps.executeQuery();
```

学习阶段更重要的是建立流程意识，而不是背每个接口方法。

### 4.2 为什么连接创建和关闭很贵

数据库连接不是普通 Java 对象。  
建立连接通常涉及：

- 网络握手
- 认证
- 会话初始化
- 数据库资源占用

所以“每次请求都新建连接再关闭”在高并发下代价很大。

### 4.3 连接池的本质是什么

连接池本质上是：

- 一组可复用连接

常见动作包括：

- 预创建连接
- 借出连接
- 归还连接
- 限制最大连接数
- 超时等待
- 清理失效连接

所以连接池更像：

- 数据库连接资源的调度器

### 4.4 常见连接池参数怎么理解

不同连接池实现参数名会略有差异，但核心思路相近：

- 最小连接数
- 最大连接数
- 获取连接超时时间
- 空闲连接回收时间
- 最大生命周期

学习时重点不是记名称，而是知道参数在控制什么。

### 4.5 为什么连接池大小不能盲目调大

很多人一看到连接不够，就本能地想把池子调大。  
这很危险，因为数据库本身的并发处理能力是有限的。

池子过大可能导致：

- 数据库端连接压力过高
- CPU 更忙于调度而不是执行
- 锁竞争放大
- 整体延迟反而更差

真正要问的是：

- 数据库能承受多少并发连接
- 单个请求平均持有连接多久
- 慢 SQL 有没有先解决

### 4.6 为什么必须正确关闭资源

在 JDBC 里，最常见的坑就是：

- 忘记关闭连接
- 忘记关闭 `PreparedStatement`
- 忘记关闭 `ResultSet`

这会直接导致：

- 连接泄漏
- 连接池被耗尽

工程上推荐：

- 优先使用 `try-with-resources`

## 5. 学习重点

这一章最重要的是掌握这些判断：

- 连接池本质上是资源池，不是简单的性能插件
- 连接数、线程数、数据库容量之间必须一起考虑
- 慢 SQL 会直接放大连接池问题
- 正确关闭资源是 JDBC 使用底线
- 连接池参数必须结合业务流量和数据库能力配置

## 6. 常见问题

### 6.1 不关闭连接或资源

这是连接池问题里最经典的根因之一。

### 6.2 连接池大小凭感觉配置

如果没有压测、指标和数据库容量判断，只靠感觉设连接池，风险很高。

### 6.3 忽视慢 SQL 对连接占用的连锁影响

很多“连接池不够”的根因，其实不是连接池太小，而是 SQL 太慢。

## 7. 动手验证

这一节我给你两层内容：

- 一层是真实 JDBC 示例
- 一层是当前环境可直接运行的“简化连接池模拟”

当前环境没有数据库客户端和 JDBC 驱动，所以 JDBC 示例我写成标准代码模板；连接池行为则用纯 Java demo 做本地验证。

### 7.1 一个标准 JDBC 查询示例

```java
try (
    Connection conn = dataSource.getConnection();
    PreparedStatement ps = conn.prepareStatement("select id, name from user where id = ?");
) {
    ps.setLong(1, 1L);
    try (ResultSet rs = ps.executeQuery()) {
        while (rs.next()) {
            System.out.println(rs.getLong("id"));
            System.out.println(rs.getString("name"));
        }
    }
}
```

这段代码的重点不在“能不能直接跑”，而在于你要看清：

- 获取连接
- 预编译 SQL
- 执行查询
- 正确释放资源

### 7.2 准备一个可运行的连接池行为实验

新建文件 `MockConnectionPoolDemo.java`，内容如下：

```java
import java.util.ArrayDeque;
import java.util.Queue;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.atomic.AtomicInteger;

public class MockConnectionPoolDemo {
    static class MockConnection {
        private final int id;

        MockConnection(int id) {
            this.id = id;
        }

        int getId() {
            return id;
        }
    }

    static class SimpleConnectionPool {
        private final Queue<MockConnection> idle = new ArrayDeque<>();

        SimpleConnectionPool(int size) {
            for (int i = 1; i <= size; i++) {
                idle.offer(new MockConnection(i));
            }
        }

        synchronized MockConnection borrow(long timeoutMillis) throws InterruptedException {
            long end = System.currentTimeMillis() + timeoutMillis;
            while (idle.isEmpty()) {
                long remain = end - System.currentTimeMillis();
                if (remain <= 0) {
                    return null;
                }
                wait(remain);
            }
            return idle.poll();
        }

        synchronized void release(MockConnection connection) {
            idle.offer(connection);
            notifyAll();
        }

        synchronized int idleCount() {
            return idle.size();
        }
    }

    public static void main(String[] args) throws Exception {
        SimpleConnectionPool pool = new SimpleConnectionPool(2);
        CountDownLatch release = new CountDownLatch(1);
        AtomicInteger timeoutCount = new AtomicInteger(0);
        AtomicInteger maxBorrowed = new AtomicInteger(0);
        AtomicInteger currentBorrowed = new AtomicInteger(0);

        Runnable worker = () -> {
            try {
                MockConnection connection = pool.borrow(300);
                if (connection == null) {
                    timeoutCount.incrementAndGet();
                    return;
                }
                int borrowed = currentBorrowed.incrementAndGet();
                maxBorrowed.updateAndGet(old -> Math.max(old, borrowed));
                System.out.println("borrowedConnection=" + connection.getId());
                release.await();
                currentBorrowed.decrementAndGet();
                pool.release(connection);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        };

        Thread t1 = new Thread(worker);
        Thread t2 = new Thread(worker);
        Thread t3 = new Thread(worker);
        t1.start();
        t2.start();
        Thread.sleep(100);
        t3.start();

        t3.join();
        System.out.println("timeoutCount=" + timeoutCount.get());
        System.out.println("maxBorrowed=" + maxBorrowed.get());

        release.countDown();
        t1.join();
        t2.join();
        System.out.println("idleCountAfterRelease=" + pool.idleCount());
    }
}
```

### 7.3 编译并运行

```bash
javac MockConnectionPoolDemo.java
java MockConnectionPoolDemo
```

### 7.4 你应该观察到什么

输出不一定逐字完全一致，但应包含这些关键信息：

```text
borrowedConnection=1
borrowedConnection=2
timeoutCount=1
maxBorrowed=2
idleCountAfterRelease=2
```

### 7.5 每一行在验证什么

- `borrowedConnection=1/2`：说明连接池中的连接被复用了，而不是每次新建
- `timeoutCount=1`：说明当池子耗尽时，请求可能等待超时
- `maxBorrowed=2`：说明同时借出的连接数受池大小限制
- `idleCountAfterRelease=2`：说明连接归还后又回到了池中，可继续复用

## 8. 练习建议

下面这些练习做完，这一章会更扎实：

- 手写一个简单 JDBC 查询示例
- 观察连接池配置变化对吞吐的影响
- 分析一次连接被长期占用的场景
- 总结“线程池大小、数据库连接池大小、数据库最大连接数”之间的关系

## 9. 自测问题

- 为什么连接池可以显著提升数据库访问效率？
- 连接池大小为什么不能盲目调大？
- 慢 SQL 为什么会放大连接池问题？
- JDBC 为什么推荐配合 `try-with-resources` 使用？
- 连接池本质上在管理什么资源？

## 10. 自测核对要点

如果你的回答能覆盖下面这些点，说明这一章基本掌握到位了：

- JDBC 是 Java 访问数据库的标准接口方式
- 连接池本质上是数据库连接资源池
- 连接创建和销毁有真实成本，复用能显著降低开销
- 连接池大小要和数据库容量、线程并发、SQL 时长一起设计
- 资源不关闭会直接导致连接泄漏和池耗尽

