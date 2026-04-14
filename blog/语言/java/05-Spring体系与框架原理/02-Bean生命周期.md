# Bean生命周期

## 1. 这是什么

Bean 生命周期描述了一个对象从注册到实例化、初始化、使用、销毁的全过程。  
它是理解 Spring 容器行为的关键。

一句话理解：

- Bean 不是 `new` 出来就结束了
- 在 Spring 里，它还要经过定义、装配、初始化、增强和销毁这些阶段

## 2. 为什么重要

很多 Spring 问题最终都会落到生命周期上，例如：

- 扩展点为什么能生效
- 初始化顺序为什么和预期不同
- 循环依赖为什么会出问题
- 代理为什么出现在初始化前后

理解生命周期后，很多“框架为什么这么做”的问题都会清楚。

## 3. 先建立直觉：BeanDefinition 不是对象本身

这是理解生命周期的第一步。

在容器里，先有的通常不是对象，而是：

- BeanDefinition

它更像：

- Bean 的配置说明书

里面会描述：

- 类是什么
- 名字是什么
- 依赖关系是什么
- 初始化和销毁钩子是什么

只有后面真正实例化时，才会变成对象本身。

## 4. 核心内容

### 4.1 一个 Bean 从注册到可用的大致流程

可以先用一个工程上够用的顺序理解：

1. 注册 BeanDefinition
2. 实例化 Bean
3. 属性填充 / 依赖注入
4. 执行初始化回调
5. 执行 BeanPostProcessor 前后处理
6. Bean 进入可用状态
7. 容器关闭时执行销毁逻辑

### 4.2 实例化和初始化的区别

这两个概念特别容易混。

#### 实例化

- 把对象创建出来

#### 初始化

- 对对象做进一步准备，使其进入“真正可用”的状态

所以：

- 实例化不等于初始化

这是理解生命周期问题的关键。

### 4.3 属性填充 / 依赖注入

对象创建出来之后，Spring 还要把依赖注入进去，例如：

- 构造器注入
- Setter 注入
- 字段注入

这一阶段的重点是：

- Bean 不只是存在，还要把它需要的依赖准备完整

### 4.4 初始化回调

初始化阶段常见会发生这些事情：

- `@PostConstruct`
- `InitializingBean`
- 自定义 `init-method`

本质上都是在对象“依赖已经准备好之后”做初始化增强。

### 4.5 BeanPostProcessor 为什么重要

`BeanPostProcessor` 是 Spring 里非常重要的扩展点。  
它可以在 Bean 初始化前后做统一处理。

这也是很多能力的基础，例如：

- AOP 代理增强
- 自定义注解处理
- 自动包装 Bean

所以它的意义不是“多一个回调”，而是：

- 给容器统一增强 Bean 的机会

### 4.6 销毁阶段

当容器关闭时，Bean 如果定义了销毁逻辑，就会进入销毁阶段。  
常见用途：

- 释放资源
- 关闭连接
- 停止后台线程

如果资源型 Bean 没有正确销毁，就容易留下隐患。

## 5. 学习重点

这一章最重要的是掌握：

- BeanDefinition 是对象定义，不是对象本身
- 实例化和初始化不是一回事
- 属性填充之后，Bean 才逐步进入可用状态
- `BeanPostProcessor` 是非常关键的统一扩展点
- 生命周期理解好了，很多 Spring 扩展能力才真正连得起来

## 6. 常见问题

### 6.1 不区分注册阶段和初始化阶段

这会导致你很难看清：

- 某个扩展点是在对象创建前生效
- 还是在初始化后生效

### 6.2 忽略后置处理器的作用

很多“Spring 神奇能力”背后，其实都和后置处理器有关。

### 6.3 遇到循环依赖只记结论，不理解机制

如果不理解生命周期阶段，就只能记住零散结论，而不知道为什么。

## 7. 动手验证

这一节我用一个纯 Java 的简化容器，把生命周期顺序直接打印出来。

### 7.1 准备一个可运行示例

新建文件 `BeanLifecycleDemo.java`，内容如下：

```java
import java.util.ArrayList;
import java.util.List;

public class BeanLifecycleDemo {
    interface BeanPostProcessor {
        Object postProcessBeforeInitialization(String beanName, Object bean);

        Object postProcessAfterInitialization(String beanName, Object bean);
    }

    interface InitializingBean {
        void afterPropertiesSet();
    }

    interface DisposableBean {
        void destroy();
    }

    static class DemoBean implements InitializingBean, DisposableBean {
        DemoBean() {
            System.out.println("1-instantiate");
        }

        void injectDependency() {
            System.out.println("2-populateProperties");
        }

        @Override
        public void afterPropertiesSet() {
            System.out.println("4-initializingBean");
        }

        @Override
        public void destroy() {
            System.out.println("7-destroy");
        }
    }

    static class LoggingPostProcessor implements BeanPostProcessor {
        @Override
        public Object postProcessBeforeInitialization(String beanName, Object bean) {
            System.out.println("3-beforeInitPostProcessor");
            return bean;
        }

        @Override
        public Object postProcessAfterInitialization(String beanName, Object bean) {
            System.out.println("5-afterInitPostProcessor");
            return bean;
        }
    }

    static class SimpleBeanFactory {
        private final List<BeanPostProcessor> postProcessors = new ArrayList<>();
        private DemoBean bean;

        void addPostProcessor(BeanPostProcessor processor) {
            postProcessors.add(processor);
        }

        DemoBean createBean() {
            System.out.println("0-registerBeanDefinition");
            bean = new DemoBean();
            bean.injectDependency();
            for (BeanPostProcessor processor : postProcessors) {
                processor.postProcessBeforeInitialization("demoBean", bean);
            }
            bean.afterPropertiesSet();
            for (BeanPostProcessor processor : postProcessors) {
                processor.postProcessAfterInitialization("demoBean", bean);
            }
            System.out.println("6-beanReady");
            return bean;
        }

        void close() {
            if (bean != null) {
                bean.destroy();
            }
        }
    }

    public static void main(String[] args) {
        SimpleBeanFactory factory = new SimpleBeanFactory();
        factory.addPostProcessor(new LoggingPostProcessor());
        factory.createBean();
        factory.close();
    }
}
```

### 7.2 编译并运行

```bash
javac BeanLifecycleDemo.java
java BeanLifecycleDemo
```

### 7.3 你应该观察到什么

输出应包含这些关键信息：

```text
0-registerBeanDefinition
1-instantiate
2-populateProperties
3-beforeInitPostProcessor
4-initializingBean
5-afterInitPostProcessor
6-beanReady
7-destroy
```

### 7.4 每一行在验证什么

- `0-registerBeanDefinition`：说明先有定义，再有对象
- `1-instantiate`：说明 Bean 已被实例化
- `2-populateProperties`：说明依赖注入发生在初始化前
- `3-beforeInitPostProcessor`：说明后置处理器可以在初始化前介入
- `4-initializingBean`：说明初始化回调在依赖注入之后触发
- `5-afterInitPostProcessor`：说明后置处理器也可以在初始化后增强 Bean
- `6-beanReady`：说明 Bean 已进入可用状态
- `7-destroy`：说明容器关闭时可触发销毁逻辑

## 8. 练习建议

下面这些练习做完，这一章会更扎实：

- 画一张 Bean 生命周期流程图
- 写一个简单的 BeanPostProcessor 示例
- 观察初始化回调触发顺序
- 用自己的话解释“实例化”和“初始化”的区别

## 9. 自测问题

- Bean 从注册到可用大致经过哪些阶段？
- BeanPostProcessor 为什么重要？
- 实例化和初始化有什么区别？
- 为什么说 BeanDefinition 不是 Bean 本身？

## 10. 自测核对要点

如果你的回答能覆盖下面这些点，说明这一章基本掌握到位了：

- Bean 生命周期是一个从定义到销毁的完整过程
- 实例化和初始化语义不同
- 依赖注入通常发生在初始化前
- BeanPostProcessor 是 Spring 统一扩展能力的重要入口
- 销毁阶段对于资源释放同样关键

