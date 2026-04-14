# SpringMVC请求处理流程

## 1. 这是什么

Spring MVC 请求处理流程描述了一个 HTTP 请求从进入应用，到被控制器处理并返回响应的全过程。  
这是理解 Web 框架行为和接口问题排查的重要基础。

一句话理解：

- 前端请求并不是直接进 Controller
- 它要先经过一条完整的分发、匹配、绑定、执行、返回链路

## 2. 为什么重要

很多接口问题并不在业务代码，而在这些环节上：

- 请求映射
- 参数绑定
- 拦截链
- 返回值处理
- 异常处理链

理解请求处理流程后，定位问题会高效很多，因为你知道：

- 问题可能出在哪一层

## 3. 先建立直觉：DispatcherServlet 是总调度中心

Spring MVC 最核心的入口是：

- `DispatcherServlet`

你可以先把它理解成：

- 前端请求的总调度员

它不会自己处理所有业务，而是负责协调这些角色：

- 找谁处理请求
- 用什么方式调用
- 参数怎么绑定
- 返回值怎么转成响应
- 异常怎么统一兜底

## 4. 核心内容

### 4.1 HandlerMapping 在做什么

`HandlerMapping` 负责：

- 根据请求路径、方法等信息，找到应该由哪个处理器处理

例如：

- `/users/1` 应该交给哪个 Controller 方法

所以如果路由匹配异常，第一怀疑点不一定是 Controller 代码本身，而可能是：

- 映射阶段就没找到目标处理器

### 4.2 HandlerAdapter 在做什么

找到处理器之后，还需要知道：

- 该怎么调用它

这就是 `HandlerAdapter` 的职责。

它解决的是：

- 不同类型的处理器如何被统一调用

所以它更多是一个“调用适配层”。

### 4.3 参数绑定为什么独立成一层

请求进来时，参数形式可能很多：

- 路径变量
- 查询参数
- 表单参数
- JSON Body
- Header

Controller 方法签名里则是：

- Java 参数对象
- 基本类型
- DTO

这中间需要一层转换和绑定逻辑。  
所以参数绑定失败，不一定是业务代码错了，而可能是：

- 请求数据和方法签名不匹配

### 4.4 返回值处理在解决什么

Controller 方法执行完后，返回的也未必就是最终 HTTP 响应。  
它可能是：

- 字符串视图名
- JSON 对象
- 响应包装体
- 文件流

所以 Spring MVC 还要继续处理：

- 如何把方法返回值转成真正的响应内容

### 4.5 异常处理链为什么重要

请求链路里任何一层出错，都可能需要统一处理，例如：

- 参数绑定失败
- 业务异常
- 运行时异常

如果没有统一异常处理，接口输出会非常混乱。  
这也是全局异常处理器在工程里很重要的原因。

### 4.6 过滤器和拦截器的区别

这是高频面试点，也是高频工程概念混淆点。

可以先粗略这样理解：

- 过滤器：更靠近 Servlet 容器层
- 拦截器：更靠近 Spring MVC 处理链

所以它们虽然都能“拦请求”，但职责层次不同。

## 5. 学习重点

这一章最重要的是掌握：

- 请求不是直接调用 Controller
- `DispatcherServlet` 是总调度入口
- `HandlerMapping` 负责找处理器
- `HandlerAdapter` 负责调用适配
- 参数绑定、返回值处理、异常处理都是独立阶段

## 6. 常见问题

### 6.1 路由匹配异常却只盯着控制器代码

可能在映射阶段就已经错了。

### 6.2 参数绑定失败却不知道发生在哪一层

这通常不是业务逻辑问题，而是请求解析和绑定阶段的问题。

### 6.3 过滤器和拦截器职责混淆

这会导致一些跨层逻辑放错位置。

## 7. 动手验证

这一节我用纯 Java 做一个 mini MVC 流程，把核心链路直接打印出来。

### 7.1 准备一个可运行示例

新建文件 `MiniMvcFlowDemo.java`，内容如下：

```java
import java.util.HashMap;
import java.util.Map;

public class MiniMvcFlowDemo {
    static class Request {
        String path;
        Map<String, String> params = new HashMap<>();

        Request(String path) {
            this.path = path;
        }
    }

    static class Response {
        int status;
        String body;
    }

    interface Handler {
        String handle(Request request);
    }

    static class UserController implements Handler {
        @Override
        public String handle(Request request) {
            String id = request.params.get("id");
            if (id == null) {
                throw new IllegalArgumentException("missing id");
            }
            return "user-" + id;
        }
    }

    static class HandlerMapping {
        Handler getHandler(Request request) {
            System.out.println("2-handlerMapping");
            if ("/user/detail".equals(request.path)) {
                return new UserController();
            }
            return null;
        }
    }

    static class HandlerAdapter {
        String invoke(Handler handler, Request request) {
            System.out.println("4-handlerAdapterInvoke");
            return handler.handle(request);
        }
    }

    static class Interceptor {
        void preHandle() {
            System.out.println("1-interceptorPreHandle");
        }

        void postHandle() {
            System.out.println("5-interceptorPostHandle");
        }
    }

    static class ExceptionResolver {
        Response resolve(Exception e) {
            System.out.println("6-exceptionResolver");
            Response response = new Response();
            response.status = 400;
            response.body = "error:" + e.getMessage();
            return response;
        }
    }

    static class DispatcherServlet {
        private final HandlerMapping mapping = new HandlerMapping();
        private final HandlerAdapter adapter = new HandlerAdapter();
        private final Interceptor interceptor = new Interceptor();
        private final ExceptionResolver exceptionResolver = new ExceptionResolver();

        Response doDispatch(Request request) {
            System.out.println("0-dispatcherServlet");
            interceptor.preHandle();
            try {
                Handler handler = mapping.getHandler(request);
                System.out.println("3-parameterBinding");
                String body = adapter.invoke(handler, request);
                interceptor.postHandle();
                Response response = new Response();
                response.status = 200;
                response.body = body;
                return response;
            } catch (Exception e) {
                return exceptionResolver.resolve(e);
            }
        }
    }

    public static void main(String[] args) {
        DispatcherServlet servlet = new DispatcherServlet();

        Request ok = new Request("/user/detail");
        ok.params.put("id", "1");
        Response okResponse = servlet.doDispatch(ok);
        System.out.println("okStatus=" + okResponse.status);
        System.out.println("okBody=" + okResponse.body);

        Request bad = new Request("/user/detail");
        Response badResponse = servlet.doDispatch(bad);
        System.out.println("badStatus=" + badResponse.status);
        System.out.println("badBody=" + badResponse.body);
    }
}
```

### 7.2 编译并运行

```bash
javac MiniMvcFlowDemo.java
java MiniMvcFlowDemo
```

### 7.3 你应该观察到什么

输出会比较多，但应包含这些关键信息：

```text
0-dispatcherServlet
1-interceptorPreHandle
2-handlerMapping
3-parameterBinding
4-handlerAdapterInvoke
5-interceptorPostHandle
okStatus=200
okBody=user-1
6-exceptionResolver
badStatus=400
badBody=error:missing id
```

### 7.4 每一行在验证什么

- `0-dispatcherServlet`：说明请求入口首先进入总调度器
- `1-interceptorPreHandle`：说明拦截器会在真正业务调用前介入
- `2-handlerMapping`：说明请求要先找到匹配的处理器
- `3-parameterBinding`：说明参数绑定是一个明确阶段
- `4-handlerAdapterInvoke`：说明真正调用 Controller 前还有适配层
- `5-interceptorPostHandle`：说明请求完成后还能执行后置处理
- `6-exceptionResolver`：说明异常不是直接原样往外抛，而是可以被统一解析

## 8. 练习建议

下面这些练习做完，这一章会更扎实：

- 画一张请求处理链路图
- 配一个拦截器和全局异常处理器
- 分析一次参数绑定异常的处理路径
- 用自己的话解释过滤器和拦截器的差异

## 9. 自测问题

- `DispatcherServlet` 在 Spring MVC 中承担什么角色？
- `HandlerMapping` 和 `HandlerAdapter` 分别做什么？
- 参数绑定失败通常发生在哪一层？
- 拦截器和过滤器的差异是什么？
- 为什么说前端请求不是直接调用 Controller？

## 10. 自测核对要点

如果你的回答能覆盖下面这些点，说明这一章基本掌握到位了：

- `DispatcherServlet` 是请求总调度中心
- `HandlerMapping` 负责找处理器
- `HandlerAdapter` 负责统一调用适配
- 参数解析、返回值处理、异常处理都是独立阶段
- 拦截器属于 Spring MVC 链路，过滤器更偏 Servlet 容器层

