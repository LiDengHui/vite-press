# AOP与代理机制

## 1. 这是什么

AOP 是面向切面编程，用来把日志、事务、鉴权这类横切逻辑从业务代码中抽离出来。  
在 Spring 中，它通常依赖代理机制实现。

一句话理解：

- AOP 关注的是“把横切逻辑统一抽出来”
- 代理关注的是“怎么在方法调用边界上织入这些逻辑”

## 2. 为什么重要

如果不理解 AOP 和代理，很多 Spring 能力都会显得像“黑魔法”，例如：

- 为什么加了注解就有事务
- 为什么日志切面会自动执行
- 为什么某些方法增强突然失效

理解这一层，才能真正看懂事务、日志切面和方法增强。

## 3. 先建立直觉：AOP 不是替代业务逻辑，而是增强业务调用边界

假设你有一个业务方法：

```java
orderService.createOrder();
```

现在你想统一加这些逻辑：

- 日志
- 事务
- 耗时统计
- 鉴权

如果把这些逻辑全部手写进业务方法里，就会导致：

- 代码重复
- 业务污染
- 修改困难

AOP 的思路是：

- 业务逻辑照常写
- 横切逻辑放到外层统一织入

## 4. 核心内容

### 4.1 切点、通知、切面

学习 AOP 时最常见的三个词：

- 切点（Pointcut）
- 通知（Advice）
- 切面（Aspect）

可以先这样理解：

- 切点：拦哪些方法
- 通知：拦到之后做什么
- 切面：把切点和通知组织在一起

### 4.2 为什么 Spring AOP 常依赖代理

Spring AOP 最常见的实现方式不是改写你的原始业务类，而是：

- 在目标对象外面包一层代理对象

调用流程变成：

```text
调用方 -> 代理对象 -> 横切逻辑 -> 目标对象方法
```

这就是为什么很多增强能力看起来像“自动生效”。

### 4.3 代理对象和目标对象的区别

目标对象：

- 真正执行业务逻辑

代理对象：

- 负责拦截调用
- 在前后加增强逻辑
- 再决定是否调用目标对象

所以：

- 你平时拿到的 Bean，有时其实是代理对象，不是原始对象

### 4.4 JDK 动态代理与 CGLIB

#### JDK 动态代理

特点：

- 基于接口
- 目标对象通常需要有接口

#### CGLIB

特点：

- 基于子类增强
- 更适合没有接口的类代理

学习阶段最重要的不是深抠实现，而是记住：

- Spring 会根据目标对象情况选择不同代理方式

### 4.5 方法增强的基本流程

一个典型的代理增强流程可以理解成：

1. 调用进入代理对象
2. 执行前置增强
3. 调用目标方法
4. 执行后置或异常增强
5. 返回结果给调用方

这个流程在日志、事务、权限控制里都非常常见。

### 4.6 为什么自调用可能导致增强失效

这是 Spring AOP 最经典、最容易踩坑的问题之一。

如果一个类内部这样写：

```java
this.methodB();
```

那么这次调用往往不会经过代理对象，而是：

- 目标对象内部直接调用自己

结果就是：

- 外层 AOP 增强可能不会生效

这也是为什么很多人会遇到：

- `@Transactional` 写了，但方法内部调用时没生效

## 5. 学习重点

这一章最重要的是掌握：

- AOP 解决的是横切逻辑复用问题
- Spring AOP 常通过代理实现增强
- 代理是实现手段，不是目标本身
- 自调用绕过代理，是理解很多“增强失效”问题的关键

## 6. 常见问题

### 6.1 只会写注解，不理解代理链

这样一旦增强失效，就很难判断问题到底出在哪。

### 6.2 自调用导致增强失效却不知道原因

这是最常见、也最具有迷惑性的场景之一。

### 6.3 把 AOP 滥用到所有业务逻辑中

AOP 适合横切关注点，不适合把所有正常业务流程都抽成切面。

## 7. 动手验证

这一节我用一个最小代理 demo，把“外部调用会增强、内部自调用不走代理”直接跑出来。

### 7.1 准备一个可运行示例

新建文件 `SpringAopLikeDemo.java`，内容如下：

```java
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

public class SpringAopLikeDemo {
    interface OrderService {
        void placeOrder();

        void innerCall();
    }

    static class OrderServiceImpl implements OrderService {
        @Override
        public void placeOrder() {
            System.out.println("target-placeOrder");
            innerCall();
        }

        @Override
        public void innerCall() {
            System.out.println("target-innerCall");
        }
    }

    static class LogInvocationHandler implements InvocationHandler {
        private final Object target;

        LogInvocationHandler(Object target) {
            this.target = target;
        }

        @Override
        public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
            System.out.println("before-" + method.getName());
            try {
                return method.invoke(target, args);
            } finally {
                System.out.println("after-" + method.getName());
            }
        }
    }

    public static void main(String[] args) {
        OrderService target = new OrderServiceImpl();
        OrderService proxy = (OrderService) Proxy.newProxyInstance(
                OrderService.class.getClassLoader(),
                new Class<?>[] {OrderService.class},
                new LogInvocationHandler(target));

        System.out.println("proxyClass=" + proxy.getClass().getName());
        proxy.placeOrder();
        proxy.innerCall();
    }
}
```

### 7.2 编译并运行

```bash
javac SpringAopLikeDemo.java
java SpringAopLikeDemo
```

### 7.3 你应该观察到什么

输出应包含这些关键信息：

```text
before-placeOrder
target-placeOrder
target-innerCall
after-placeOrder
before-innerCall
target-innerCall
after-innerCall
```

### 7.4 每一行在验证什么

- `before-placeOrder`、`after-placeOrder`：说明外部通过代理调用时，增强逻辑生效
- `target-placeOrder`：说明最终执行业务的仍然是目标对象
- `target-innerCall` 出现在 `placeOrder` 内部，但没有对应的 `before-innerCall`：说明自调用没有经过代理增强
- 最后单独调用 `proxy.innerCall()` 时出现 `before-innerCall` / `after-innerCall`：说明只有通过代理入口调用，增强才会生效

## 8. 练习建议

下面这些练习做完，这一章会更扎实：

- 写一个日志切面 demo
- 验证代理对象和目标对象的区别
- 对比 JDK 动态代理和类代理的适用条件
- 用自己的话解释为什么自调用会绕过增强

## 9. 自测问题

- Spring AOP 为什么依赖代理？
- AOP 最适合解决哪类问题？
- 为什么方法自调用可能导致增强失效？
- 代理对象和目标对象分别负责什么？

## 10. 自测核对要点

如果你的回答能覆盖下面这些点，说明这一章基本掌握到位了：

- AOP 用于抽离横切逻辑
- 代理是 Spring AOP 的常见实现方式
- 只有通过代理入口调用，增强逻辑才容易生效
- 自调用绕过代理，是很多事务和切面失效问题的根因

