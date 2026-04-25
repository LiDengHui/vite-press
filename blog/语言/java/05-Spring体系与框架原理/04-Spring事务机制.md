# Spring事务机制

## 1. 这是什么

Spring 事务机制是在数据库事务能力之上，提供统一声明式事务管理的一套框架支持。  
它让业务代码可以更方便地控制提交、回滚和传播行为。

一句话理解：

- 事务本质还是数据库事务
- Spring 做的是把事务边界和控制逻辑统一织入业务方法

## 2. 为什么重要

事务是后端业务正确性的核心手段之一。  
如果不理解 Spring 事务机制，就很容易写出这些“看起来有事务、实际没生效”的代码：

- 抛异常却没回滚
- 自调用导致事务失效
- 长耗时逻辑把事务拖得很大
- 不知道传播行为为什么影响结果

## 3. 先建立直觉：Spring 事务不是脱离代理独立存在的

Spring 声明式事务最常见的实现路径是：

- 通过代理拦截方法调用
- 在方法执行前开启事务
- 方法成功后提交
- 方法异常时回滚

所以如果你不理解代理，就很难理解事务为什么有时生效、有时失效。

## 4. 核心内容

### 4.1 声明式事务是什么

声明式事务的核心思想是：

- 你描述事务边界
- 框架负责帮你织入事务控制逻辑

在 Spring 里，最常见的表现形式就是：

```java
@Transactional
```

它的价值在于：

- 把事务逻辑从业务代码中抽离出来

### 4.2 事务传播行为在解决什么

传播行为描述的是：

- 当前方法进入时，如果已经有事务了，该怎么办

例如：

- 加入现有事务
- 新开一个事务
- 强制非事务执行

学习阶段最重要的是先建立语义理解，而不是死背全部枚举。

### 4.3 回滚规则为什么不能想当然

很多人会误以为：

- 只要抛异常就一定回滚

但实际上回滚规则要结合：

- 异常类型
- 配置方式
- 框架默认规则

工程上最重要的结论是：

- 不能只看“报错了没有”
- 还要看这次异常是否真的触发了事务回滚逻辑

### 4.4 为什么自调用会导致事务失效

这和 AOP 一样，是事务里最经典的问题之一。

如果一个方法内部这样调用：

```java
this.innerMethod();
```

那通常不会经过代理对象，而是：

- 当前对象内部直接调用自己

结果就是：

- 事务增强可能根本没织进去

### 4.5 为什么长耗时逻辑不适合放进事务

事务一旦开启，就意味着：

- 锁可能持有更久
- 数据库资源占用更久
- 冲突概率更高

所以像这些操作通常要谨慎：

- 远程调用
- 大文件处理
- 长时间等待

## 5. 学习重点

这一章最重要的是掌握：

- Spring 事务本质上依赖数据库事务能力
- 声明式事务通常通过代理织入
- 传播行为是在描述事务边界如何组合
- 自调用和异常处理方式是两个高频失效点
- 事务范围越大，并发代价通常越高

## 6. 常见问题

### 6.1 自调用导致事务失效

这是最常见、也最容易误判的问题之一。

### 6.2 异常被捕获却没有回滚

如果异常已经被业务代码吞掉或改写，事务层就未必还能按预期感知到失败。

### 6.3 把长耗时逻辑放进事务里

这会放大锁占用时间和数据库压力。

## 7. 动手验证

这一节我用纯 Java 做一个“Spring 风格事务代理”的简化实验，重点演示两个现象：

- 代理入口调用时，异常能触发回滚
- 内部自调用时，事务增强不会自动织入

### 7.1 准备一个可运行示例

新建文件 `SpringTransactionLikeDemo.java`，内容如下：

```java
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

public class SpringTransactionLikeDemo {
    interface OrderService {
        void outerSuccess();

        void outerCallInner();

        void innerFail();
    }

    static class TransactionManager {
        void begin() {
            System.out.println("tx-begin");
        }

        void commit() {
            System.out.println("tx-commit");
        }

        void rollback() {
            System.out.println("tx-rollback");
        }
    }

    static class OrderServiceImpl implements OrderService {
        @Override
        public void outerSuccess() {
            System.out.println("business-outerSuccess");
        }

        @Override
        public void outerCallInner() {
            System.out.println("business-outerCallInner");
            innerFail();
        }

        @Override
        public void innerFail() {
            System.out.println("business-innerFail");
            throw new RuntimeException("db error");
        }
    }

    static class TransactionInvocationHandler implements InvocationHandler {
        private final Object target;
        private final TransactionManager txManager;

        TransactionInvocationHandler(Object target, TransactionManager txManager) {
            this.target = target;
            this.txManager = txManager;
        }

        @Override
        public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
            txManager.begin();
            try {
                Object result = method.invoke(target, args);
                txManager.commit();
                return result;
            } catch (Throwable e) {
                txManager.rollback();
                Throwable cause = e.getCause() != null ? e.getCause() : e;
                throw cause;
            }
        }
    }

    public static void main(String[] args) {
        OrderService target = new OrderServiceImpl();
        OrderService proxy = (OrderService) Proxy.newProxyInstance(
                OrderService.class.getClassLoader(),
                new Class<?>[] {OrderService.class},
                new TransactionInvocationHandler(target, new TransactionManager()));

        proxy.outerSuccess();

        try {
            proxy.innerFail();
        } catch (Exception e) {
            System.out.println("directProxyFail=" + e.getMessage());
        }

        try {
            proxy.outerCallInner();
        } catch (Exception e) {
            System.out.println("selfInvokeFail=" + e.getMessage());
        }
    }
}
```

### 7.2 编译并运行

```bash
javac SpringTransactionLikeDemo.java
java SpringTransactionLikeDemo
```

### 7.3 你应该观察到什么

输出应包含这些关键信息：

```text
tx-begin
business-outerSuccess
tx-commit
tx-begin
business-innerFail
tx-rollback
directProxyFail=db error
tx-begin
business-outerCallInner
business-innerFail
tx-rollback
selfInvokeFail=db error
```

### 7.4 这个 demo 里最值得观察什么

这里最关键的不是“有没有回滚”，而是看调用路径：

- `proxy.innerFail()`：这是通过代理直接进入，事务增强明确生效
- `proxy.outerCallInner()`：只有 `outerCallInner` 是通过代理进入，内部 `innerFail()` 不是再次经过代理，而是目标对象内部直接调用

这正是 Spring 事务里“自调用导致内部事务增强不生效”的根因基础。

## 8. 练习建议

下面这些练习做完，这一章会更扎实：

- 写一个事务成功与回滚示例
- 验证不同传播行为的差异
- 记录几个常见事务失效场景
- 用自己的话解释为什么事务和代理关系紧密

## 9. 自测问题

- `@Transactional` 为什么通常依赖代理？
- 为什么有时抛异常却没有回滚？
- 事务传播行为在什么情况下最有价值？
- 为什么事务里不适合放长耗时逻辑？
- 自调用为什么可能让事务增强失效？

## 10. 自测核对要点

如果你的回答能覆盖下面这些点，说明这一章基本掌握到位了：

- Spring 声明式事务通常通过代理织入
- 回滚是否发生，取决于事务边界和异常传播方式
- 传播行为描述的是事务边界如何组合
- 自调用绕过代理，是事务失效高频原因
- 事务范围需要谨慎控制，避免把慢操作包进去
