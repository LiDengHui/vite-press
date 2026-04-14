# SpringBoot自动配置

## 1. 这是什么

Spring Boot 自动配置用于根据类路径、配置项和条件判断，自动装配一批常用组件。  
它让应用具备“约定优于配置”的开发体验。

一句话理解：

- 自动配置不是魔法
- 它本质上是“满足条件就注册 Bean，不满足就跳过”

## 2. 为什么重要

自动配置是 Spring Boot 高效率开发的核心原因之一。  
理解它之后，你不再只是“会用 Boot”，而是真正能判断：

- 为什么某个配置会生效
- 为什么某个 Bean 没被注册
- 为什么引入一个 Starter 后能力就自动出现了

## 3. 先建立直觉：自动配置 = 条件判断 + Bean 注册

很多人第一次学 Spring Boot 时，会把自动配置理解成：

- “启动类一跑，框架自动帮你干了一切”

这不够准确。  
更实用的理解是：

- 框架先看类路径上有没有某些类
- 再看配置项是否满足条件
- 再看容器里是否已经存在某个 Bean
- 最后决定要不要注册一组默认 Bean

## 4. 核心内容

### 4.1 自动装配入口

Spring Boot 启动时会沿着自动装配入口去收集配置类。  
学习阶段更重要的是抓住主线：

- 启动时会导入一批候选自动配置类
- 每个自动配置类内部都有条件判断

所以：

- 自动配置不是“全部都生效”
- 而是“候选很多，最后按条件筛选”

### 4.2 自动配置类在做什么

自动配置类通常做两件事：

- 判断条件
- 注册 Bean

例如一个数据源自动配置类，可能会判断：

- 类路径上有没有数据源相关类
- 配置文件里有没有数据源地址
- 容器里是否已经有用户自定义数据源 Bean

满足时才会帮你创建默认 Bean。

### 4.3 条件装配为什么重要

条件装配是 Spring Boot 自动配置的核心。  
常见判断维度包括：

- 类路径条件
- 配置项条件
- Bean 是否存在
- 环境条件

这也是为什么你看到很多自动配置类里会有：

- `@ConditionalOnClass`
- `@ConditionalOnMissingBean`
- `@ConditionalOnProperty`

### 4.4 Starter 在解决什么问题

Starter 的核心价值是：

- 把依赖和自动配置打包协同起来

也就是说，Starter 不只是：

- 帮你引入 jar

它更重要的价值是：

- 让“依赖 + 配置 + 默认 Bean 注册”形成整体体验

### 4.5 配置绑定为什么关键

自动配置不仅要决定“生不生效”，还要决定：

- 生成出来的 Bean 怎么带参数

这就会涉及配置绑定，例如把配置文件里的：

- 地址
- 端口
- 用户名
- 超时时间

绑定到配置对象上，再传入 Bean 构造逻辑。

## 5. 学习重点

这一章最重要的是掌握：

- 自动配置不是黑魔法，而是条件判断 + Bean 注册
- Starter 解决的是依赖和装配协同问题
- 配置项不是装饰，它会直接参与 Bean 生成
- 容器中已有自定义 Bean 时，默认自动配置可能会退让

## 6. 常见问题

### 6.1 配置生效时不知道为什么

本质上是没建立“候选自动配置 -> 条件判断 -> Bean 注册”这条链路。

### 6.2 配置失效时只会试错

真正应该问的是：

- 哪个条件没满足？

### 6.3 不理解 Starter 的组织方式

这样就容易把 Starter 误解成“只是个依赖打包”。

## 7. 动手验证

这一节我用纯 Java 做一个极简自动配置模拟，帮助你把“条件判断 + 默认装配 + 用户覆盖”直接看明白。

### 7.1 准备一个可运行示例

新建文件 `BootAutoConfigLikeDemo.java`，内容如下：

```java
import java.util.HashMap;
import java.util.Map;

public class BootAutoConfigLikeDemo {
    static class AppContext {
        private final Map<Class<?>, Object> beans = new HashMap<>();

        <T> void registerBean(Class<T> type, T bean) {
            beans.put(type, bean);
        }

        boolean containsBean(Class<?> type) {
            return beans.containsKey(type);
        }

        <T> T getBean(Class<T> type) {
            return type.cast(beans.get(type));
        }
    }

    static class CacheProperties {
        private boolean enabled;
        private String provider;

        CacheProperties(boolean enabled, String provider) {
            this.enabled = enabled;
            this.provider = provider;
        }

        boolean isEnabled() {
            return enabled;
        }

        String getProvider() {
            return provider;
        }
    }

    interface CacheService {
        String provider();
    }

    static class RedisCacheService implements CacheService {
        @Override
        public String provider() {
            return "redis";
        }
    }

    static class LocalCacheService implements CacheService {
        @Override
        public String provider() {
            return "local";
        }
    }

    static class CacheAutoConfiguration {
        void configure(AppContext context, CacheProperties properties, boolean redisClassPresent) {
            if (!properties.isEnabled()) {
                System.out.println("autoConfigSkipped=propertyDisabled");
                return;
            }
            if (!redisClassPresent) {
                System.out.println("autoConfigSkipped=classMissing");
                return;
            }
            if (context.containsBean(CacheService.class)) {
                System.out.println("autoConfigSkipped=userBeanPresent");
                return;
            }
            context.registerBean(CacheService.class, new RedisCacheService());
            System.out.println("autoConfigRegistered=RedisCacheService");
        }
    }

    public static void main(String[] args) {
        CacheAutoConfiguration autoConfiguration = new CacheAutoConfiguration();

        AppContext ctx1 = new AppContext();
        autoConfiguration.configure(ctx1, new CacheProperties(true, "redis"), true);
        System.out.println("ctx1Provider=" + ctx1.getBean(CacheService.class).provider());

        AppContext ctx2 = new AppContext();
        autoConfiguration.configure(ctx2, new CacheProperties(false, "redis"), true);

        AppContext ctx3 = new AppContext();
        ctx3.registerBean(CacheService.class, new LocalCacheService());
        autoConfiguration.configure(ctx3, new CacheProperties(true, "redis"), true);
        System.out.println("ctx3Provider=" + ctx3.getBean(CacheService.class).provider());
    }
}
```

### 7.2 编译并运行

```bash
javac BootAutoConfigLikeDemo.java
java BootAutoConfigLikeDemo
```

### 7.3 你应该观察到什么

输出应包含这些关键信息：

```text
autoConfigRegistered=RedisCacheService
ctx1Provider=redis
autoConfigSkipped=propertyDisabled
autoConfigSkipped=userBeanPresent
ctx3Provider=local
```

### 7.4 每一行在验证什么

- `autoConfigRegistered=RedisCacheService`：说明满足条件时，自动配置会注册默认 Bean
- `ctx1Provider=redis`：说明默认自动配置结果已生效
- `autoConfigSkipped=propertyDisabled`：说明配置项能直接决定自动配置是否开启
- `autoConfigSkipped=userBeanPresent`：说明用户自定义 Bean 存在时，默认配置会退让
- `ctx3Provider=local`：说明最终生效的是用户覆盖实现，而不是默认实现

## 8. 练习建议

下面这些练习做完，这一章会更扎实：

- 跟一次 Spring Boot 启动自动配置链路
- 阅读一个常见 Starter 的自动配置类
- 总结自动配置常见条件注解的作用
- 用自己的话解释“为什么某个自动配置没生效”

## 9. 自测问题

- Spring Boot 为什么能做到开箱即用？
- 自动配置类通常通过什么条件决定是否生效？
- Starter 的核心价值是什么？
- 为什么用户自定义 Bean 常常会覆盖默认自动配置？

## 10. 自测核对要点

如果你的回答能覆盖下面这些点，说明这一章基本掌握到位了：

- 自动配置的核心是条件判断与默认 Bean 注册
- Starter 的价值在于依赖与自动配置协同
- 配置项和类路径条件都会影响自动配置结果
- 用户自定义 Bean 往往优先于默认自动配置

