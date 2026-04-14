# Spring工程实践能力

## 1. 这是什么

Spring 工程实践能力，指的是在真实项目中把校验、异常、日志、配置、安全等能力规范化落地。  
这部分通常比“会写接口”更能体现成熟度。

一句话理解：

- 能写接口只是起点
- 能把接口写得统一、可维护、可排障，才是真正的工程能力

## 2. 为什么重要

一个项目能不能长期维护，往往取决于这些工程细节是否统一。  
没有统一规范，系统会越来越难改、越来越难排查。

常见问题包括：

- 每个接口返回格式都不一样
- 异常处理分散在业务代码里
- 日志没有 TraceId
- 参数校验随意
- 配置项到处散落

## 3. 先建立直觉：工程规范本身也是系统设计

很多人会把这些事情看成“边角料”：

- 校验
- 返回体
- 全局异常
- 日志规范

但在真实项目里，这些能力决定了：

- 问题好不好排
- 团队协作顺不顺
- 系统行为是否稳定一致

所以它们不是附属品，而是系统设计的一部分。

## 4. 核心内容

### 4.1 参数校验

参数校验的价值不是“多一道手续”，而是：

- 把非法输入尽量挡在入口

如果入口校验做得差：

- 业务代码就要到处判断
- 错误边界会越来越模糊

### 4.2 统一返回结构

统一返回结构的核心价值是：

- 前后端约定稳定
- 排障更容易
- 错误处理更统一

常见会包含：

- 状态码
- 消息
- 数据体
- TraceId

### 4.3 全局异常处理

如果每个 Controller 都自己 try-catch，代码会很快变乱。  
更推荐的思路是：

- 业务层抛语义清晰的异常
- Web 层统一转换成稳定响应

这就是全局异常处理的价值。

### 4.4 日志链路与 TraceId

TraceId 很重要，因为：

- 一次请求会经过很多层
- 如果日志里没有统一标识，排查非常痛苦

有了 TraceId，你就能把：

- 网关
- 服务层
- DAO
- MQ 消费

这些日志串起来看。

### 4.5 配置管理

配置管理的目标不是“把配置放到文件里”这么简单，而是：

- 可分环境
- 可读
- 可维护
- 不乱写死

所以工程里要尽量避免：

- 把常量直接写进业务代码

### 4.6 Spring Security 基础认知

学习阶段不一定要一下子深入完整安全框架，但要建立一个意识：

- 安全能力不能只靠补丁式加法

至少要知道这些问题一直存在：

- 认证
- 授权
- 会话 / Token
- 接口暴露面

## 5. 学习重点

这一章最重要的是掌握：

- 工程规范是系统质量的一部分
- 统一异常和统一返回结构能显著降低维护成本
- TraceId 是排障关键基础设施
- 校验应该尽量前置
- 配置和安全都需要系统化设计

## 6. 常见问题

### 6.1 每个接口返回格式都不一样

这会让：

- 前端处理复杂
- 文档维护困难
- 排障不统一

### 6.2 异常处理分散在业务代码里

这样会导致业务逻辑和错误处理缠在一起。

### 6.3 缺少请求链路标识导致难以排查

这在分布式系统里尤其痛苦。

## 7. 动手验证

这一节我用纯 Java 做一个简化工程实践 demo，把统一返回、参数校验、全局异常和 TraceId 串起来。

### 7.1 准备一个可运行示例

新建文件 `SpringEngineeringDemo.java`，内容如下：

```java
import java.util.UUID;

public class SpringEngineeringDemo {
    static class ApiResponse<T> {
        int code;
        String message;
        String traceId;
        T data;

        static <T> ApiResponse<T> success(T data, String traceId) {
            ApiResponse<T> response = new ApiResponse<>();
            response.code = 0;
            response.message = "OK";
            response.traceId = traceId;
            response.data = data;
            return response;
        }

        static <T> ApiResponse<T> fail(int code, String message, String traceId) {
            ApiResponse<T> response = new ApiResponse<>();
            response.code = code;
            response.message = message;
            response.traceId = traceId;
            return response;
        }
    }

    static class BizException extends RuntimeException {
        private final int code;

        BizException(int code, String message) {
            super(message);
            this.code = code;
        }

        int getCode() {
            return code;
        }
    }

    static class UserController {
        String getUserName(String userId) {
            if (userId == null || userId.isBlank()) {
                throw new BizException(4001, "userId is blank");
            }
            if ("404".equals(userId)) {
                throw new BizException(4040, "user not found");
            }
            return "user-" + userId;
        }
    }

    static class GlobalExceptionHandler {
        ApiResponse<?> handle(Throwable e, String traceId) {
            if (e instanceof BizException biz) {
                return ApiResponse.fail(biz.getCode(), biz.getMessage(), traceId);
            }
            return ApiResponse.fail(5000, "internal error", traceId);
        }
    }

    public static void main(String[] args) {
        UserController controller = new UserController();
        GlobalExceptionHandler exceptionHandler = new GlobalExceptionHandler();

        handleRequest("1001", controller, exceptionHandler);
        handleRequest("", controller, exceptionHandler);
        handleRequest("404", controller, exceptionHandler);
    }

    private static void handleRequest(
            String userId,
            UserController controller,
            GlobalExceptionHandler exceptionHandler
    ) {
        String traceId = UUID.randomUUID().toString();
        System.out.println("traceId=" + traceId + ",requestUserId=" + userId);
        try {
            String name = controller.getUserName(userId);
            ApiResponse<String> response = ApiResponse.success(name, traceId);
            System.out.println("responseCode=" + response.code + ",message=" + response.message
                    + ",data=" + response.data + ",traceId=" + response.traceId);
        } catch (Throwable e) {
            ApiResponse<?> response = exceptionHandler.handle(e, traceId);
            System.out.println("responseCode=" + response.code + ",message=" + response.message
                    + ",traceId=" + response.traceId);
        }
    }
}
```

### 7.2 编译并运行

```bash
javac SpringEngineeringDemo.java
java SpringEngineeringDemo
```

### 7.3 你应该观察到什么

输出中会包含三次请求结果，但应重点看到这些特征：

```text
traceId=...
responseCode=0,message=OK,data=user-1001,traceId=...
responseCode=4001,message=userId is blank,traceId=...
responseCode=4040,message=user not found,traceId=...
```

### 7.4 每一行在验证什么

- `traceId=...`：说明每次请求都带有独立链路标识
- 成功请求统一输出 `responseCode=0,message=OK,...`：说明返回结构已统一
- 参数为空和用户不存在都被统一映射成标准错误响应：说明异常处理从业务代码中抽离出来了
- 同一个 `traceId` 出现在请求日志和响应日志中：说明排障时可以串联整条请求链路

## 8. 练习建议

下面这些练习做完，这一章会更扎实：

- 搭一套统一返回和全局异常处理方案
- 在日志里加入 TraceId
- 设计一个简单的鉴权或权限控制示例
- 总结哪些配置应该外置，哪些不该硬编码

## 9. 自测问题

- 为什么统一异常和统一返回结构很重要？
- TraceId 对排障有什么价值？
- 参数校验为什么应该尽量前置？
- 工程规范为什么本质上也是系统设计的一部分？

## 10. 自测核对要点

如果你的回答能覆盖下面这些点，说明这一章基本掌握到位了：

- 统一返回结构能降低调用方和维护方的复杂度
- 全局异常处理能把错误处理从业务逻辑里抽离出来
- TraceId 是跨层排障的重要基础设施
- 参数校验、配置管理、安全意识都属于工程实践能力的一部分

