# IoC与依赖注入

## 1. 这是什么

IoC 是控制反转，依赖注入是它最常见的落地方式。  
它的核心思想是：对象不再由业务代码手动创建和组装，而由容器统一管理。

一句话理解：

- 以前是对象自己找依赖
- 现在是容器把依赖准备好后再交给对象

## 2. 为什么重要

Spring 的很多能力都建立在 IoC 之上。  
如果不理解 IoC，就很难真正看懂：

- Bean 管理
- 自动装配
- 配置扩展
- 测试替换依赖

IoC 的价值不只是“少写 `new`”，而是：

- 让对象关系可管理
- 让依赖更清晰
- 让系统更容易测试和扩展

## 3. 先建立直觉：什么叫“控制权转移”

先看传统写法：

```java
UserService service = new UserService(new UserRepository());
```

这里的控制权在业务代码自己手里：

- 你决定何时 `new`
- 你决定注入谁

IoC 之后的核心变化是：

- 对象创建、依赖装配的控制权转移给容器

业务代码拿到的是：

- 已经装配好的对象

所以 IoC 最关键的词不是“注解”，而是：

- 控制权反转

## 4. 核心内容

### 4.1 什么是依赖注入

依赖注入可以简单理解成：

- 一个对象需要的依赖，不由它自己创建
- 而是从外部注入进来

依赖注入是 IoC 最常见的实现方式之一。

### 4.2 三种常见注入方式

#### 构造器注入

依赖在对象创建时就必须传入。

优点：

- 依赖关系明确
- 更适合不可变依赖
- 更利于测试

#### Setter 注入

通过 setter 方法在对象创建后注入依赖。

适合：

- 某些可选依赖

#### 字段注入

直接往字段里塞依赖。

虽然在 Spring 中很常见，但从工程实践上通常不如构造器注入清晰。

### 4.3 为什么容器统一管理对象很重要

容器统一管理对象之后，你可以得到这些收益：

- 依赖关系集中管理
- 生命周期统一控制
- 更容易替换实现
- 更容易做扩展点增强

这也是为什么：

- Spring 可以统一管理 Bean
- 再在 Bean 外层加 AOP、事务、生命周期扩展

### 4.4 为什么 IoC 能提升可测试性

如果对象内部自己写死依赖：

- 单元测试就很难替换成 mock 或 stub

而依赖注入后：

- 你可以直接传入假的实现
- 测试会更聚焦、更稳定

## 5. 学习重点

这一章最重要的是掌握这些判断：

- IoC 的本质是控制权转移
- 依赖注入是实现 IoC 的常见方式
- 容器管理对象不是为了炫技，而是为了统一装配和扩展
- 构造器注入通常比字段注入更清晰

## 6. 常见问题

### 6.1 把 `@Autowired` 当作 IoC 本身

`@Autowired` 只是某种注入手段的表现形式，不是 IoC 的本质。

### 6.2 不区分容器管理对象和手动创建对象

自己 `new` 出来的对象，通常不会自动拥有容器提供的那些能力。

### 6.3 依赖关系混乱导致注入困难

如果类之间耦合太深、依赖太多，IoC 也只能把问题显现出来，不能替你自动把设计变好。

## 7. 动手验证

这一节我用纯 Java 写一个最小 IoC 容器，帮助你直接观察“依赖由容器装配，而不是业务自己 new”。

### 7.1 准备一个可运行示例

新建文件 `SimpleIoCDemo.java`，内容如下：

```java
import java.lang.reflect.Constructor;
import java.util.HashMap;
import java.util.Map;

public class SimpleIoCDemo {
    interface UserRepository {
        String findNameById(long id);
    }

    static class MemoryUserRepository implements UserRepository {
        @Override
        public String findNameById(long id) {
            return "user-" + id;
        }
    }

    static class UserService {
        private final UserRepository userRepository;

        UserService(UserRepository userRepository) {
            this.userRepository = userRepository;
        }

        String queryUser(long id) {
            return userRepository.findNameById(id);
        }
    }

    static class SimpleContainer {
        private final Map<Class<?>, Class<?>> mappings = new HashMap<>();
        private final Map<Class<?>, Object> singletons = new HashMap<>();

        <T> void register(Class<T> type, Class<? extends T> impl) {
            mappings.put(type, impl);
        }

        <T> T getBean(Class<T> type) {
            if (singletons.containsKey(type)) {
                return type.cast(singletons.get(type));
            }

            Class<?> impl = mappings.getOrDefault(type, type);
            try {
                Constructor<?> constructor = impl.getDeclaredConstructors()[0];
                Class<?>[] parameterTypes = constructor.getParameterTypes();
                Object[] args = new Object[parameterTypes.length];
                for (int i = 0; i < parameterTypes.length; i++) {
                    args[i] = getBean(parameterTypes[i]);
                }
                Object bean = constructor.newInstance(args);
                singletons.put(type, bean);
                return type.cast(bean);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
    }

    public static void main(String[] args) {
        UserService manual = new UserService(new MemoryUserRepository());
        System.out.println("manualResult=" + manual.queryUser(1));

        SimpleContainer container = new SimpleContainer();
        container.register(UserRepository.class, MemoryUserRepository.class);
        container.register(UserService.class, UserService.class);

        UserService fromContainer = container.getBean(UserService.class);
        UserService again = container.getBean(UserService.class);

        System.out.println("containerResult=" + fromContainer.queryUser(2));
        System.out.println("sameSingleton=" + (fromContainer == again));
        System.out.println("dependencyInjected=" + (fromContainer.queryUser(3).equals("user-3")));
    }
}
```

### 7.2 编译并运行

```bash
javac SimpleIoCDemo.java
java SimpleIoCDemo
```

### 7.3 你应该观察到什么

输出应包含这些关键信息：

```text
manualResult=user-1
containerResult=user-2
sameSingleton=true
dependencyInjected=true
```

### 7.4 每一行在验证什么

- `manualResult=user-1`：说明传统写法里依赖由业务代码手动装配
- `containerResult=user-2`：说明容器可以负责依赖装配并交付对象
- `sameSingleton=true`：说明容器能统一管理对象实例
- `dependencyInjected=true`：说明 `UserService` 本身不需要自己创建 `UserRepository`

## 8. 练习建议

下面这些练习做完，这一章会更扎实：

- 自己写一个简单 IoC 容器 demo
- 分别用手动装配和依赖注入实现同一逻辑
- 把 `UserRepository` 替换成测试桩实现，体会依赖注入对测试的帮助
- 总结构造器注入和字段注入的差异

## 9. 自测问题

- 什么是控制反转？
- 为什么依赖注入能降低耦合？
- 构造器注入相比字段注入有什么优点？
- 为什么说 IoC 的重点是控制权转移，而不是注解本身？

## 10. 自测核对要点

如果你的回答能覆盖下面这些点，说明这一章基本掌握到位了：

- IoC 的核心是对象控制权从业务代码转移给容器
- 依赖注入是 IoC 的典型落地方式
- 构造器注入通常更清晰、更利于测试
- 容器统一管理对象，为生命周期、扩展和代理提供了基础

