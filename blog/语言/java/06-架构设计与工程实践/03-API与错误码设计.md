# API与错误码设计

## 1. 这是什么

API 与错误码设计是后端系统对外提供能力时的接口规范设计。  
它不仅影响调用体验，也影响系统后续维护成本。

一句话理解：

- API 是系统对外的长期契约
- 错误码是失败场景下的结构化协议

## 2. 为什么重要

接口一旦上线，就会形成协作契约。  
如果设计混乱，前后端联调、监控告警、问题排查都会变得更困难。

最常见的坏味道包括：

- 每个接口返回结构不同
- 成功和失败字段不统一
- 错误码没有体系
- 字段含义后续频繁变化

## 3. 先建立直觉：接口设计不是“先能跑起来”

接口设计最容易犯的错是：

- 觉得先返回点东西就行，后面再改

但接口一旦被客户端依赖，后续修改成本会越来越高。  
所以更实用的思路是：

- 把 API 当成长期演进的公共协议来设计

## 4. 核心内容

### 4.1 REST 风格设计

学习阶段先抓最实用的部分：

- 用资源表达对象
- 用 HTTP 方法表达动作
- 让 URL 和语义尽量稳定清晰

例如：

- `GET /users/1`
- `POST /orders`
- `PUT /orders/1`

重点不是死背“REST 纯度”，而是：

- 接口语义清晰、稳定、可预测

### 4.2 统一响应结构

统一响应结构的核心价值是：

- 成功返回和失败返回有固定格式
- 调用方处理逻辑更稳定
- 监控和日志更容易统一

常见字段包括：

- `code`
- `message`
- `data`
- `traceId`

### 4.3 错误码设计为什么不能随意

错误码不仅服务前端提示，还服务这些场景：

- 排障
- 日志检索
- 告警聚合
- 业务统计

所以一个好的错误码体系通常要具备：

- 分层
- 稳定
- 可读
- 可归类

### 4.4 幂等接口设计

某些接口天然需要考虑幂等，例如：

- 下单
- 支付回调
- 重试提交

常见设计方式：

- 请求唯一号
- 幂等 token
- 业务唯一键约束

### 4.5 分页和筛选规范

分页和筛选看似细节，但如果规范混乱，前后端会一直痛苦。

至少要尽量统一：

- 页码参数名
- 页大小参数名
- 排序参数格式
- 过滤条件表达方式

## 5. 学习重点

这一章最重要的是掌握：

- 接口是长期契约，不是一次性输出
- 错误码是结构化失败协议，不只是提示文案
- 统一返回结构能显著降低协作成本
- 幂等接口设计是分布式系统高频刚需
- 分页和筛选规范应该统一而稳定

## 6. 常见问题

### 6.1 每个接口返回结构不同

这会让调用方和维护方都非常痛苦。

### 6.2 错误码无体系、无分层

这样错误码就失去了监控和排障价值。

### 6.3 修改字段含义却不考虑兼容性

这会直接破坏接口契约。

## 7. 动手验证

这一节我用一个纯 Java demo，把统一返回、错误码分层和分页参数建模放到一起。

### 7.1 准备一个可运行示例

新建文件 `ApiDesignDemo.java`，内容如下：

```java
public class ApiDesignDemo {
    enum ErrorCode {
        OK(0, "OK"),
        USER_NOT_FOUND(1001, "user not found"),
        INVALID_PAGE(2001, "invalid page parameter"),
        DUPLICATE_REQUEST(3001, "duplicate request");

        private final int code;
        private final String message;

        ErrorCode(int code, String message) {
            this.code = code;
            this.message = message;
        }

        int code() {
            return code;
        }

        String message() {
            return message;
        }
    }

    static class ApiResponse<T> {
        final int code;
        final String message;
        final T data;
        final String traceId;

        ApiResponse(int code, String message, T data, String traceId) {
            this.code = code;
            this.message = message;
            this.data = data;
            this.traceId = traceId;
        }
    }

    static class PageQuery {
        final int pageNo;
        final int pageSize;

        PageQuery(int pageNo, int pageSize) {
            this.pageNo = pageNo;
            this.pageSize = pageSize;
        }

        boolean valid() {
            return pageNo > 0 && pageSize > 0 && pageSize <= 100;
        }
    }

    static ApiResponse<String> getUser(String userId, PageQuery pageQuery, String requestId) {
        String traceId = "trace-" + requestId;
        if (requestId.startsWith("dup")) {
            return new ApiResponse<>(ErrorCode.DUPLICATE_REQUEST.code(),
                    ErrorCode.DUPLICATE_REQUEST.message(), null, traceId);
        }
        if (!pageQuery.valid()) {
            return new ApiResponse<>(ErrorCode.INVALID_PAGE.code(),
                    ErrorCode.INVALID_PAGE.message(), null, traceId);
        }
        if ("404".equals(userId)) {
            return new ApiResponse<>(ErrorCode.USER_NOT_FOUND.code(),
                    ErrorCode.USER_NOT_FOUND.message(), null, traceId);
        }
        return new ApiResponse<>(ErrorCode.OK.code(), ErrorCode.OK.message(),
                "user-" + userId + "-page-" + pageQuery.pageNo, traceId);
    }

    public static void main(String[] args) {
        ApiResponse<String> ok = getUser("1001", new PageQuery(1, 20), "req-1");
        ApiResponse<String> invalid = getUser("1001", new PageQuery(0, 20), "req-2");
        ApiResponse<String> duplicate = getUser("1001", new PageQuery(1, 20), "dup-1");
        ApiResponse<String> notFound = getUser("404", new PageQuery(1, 20), "req-3");

        System.out.println("okCode=" + ok.code + ",message=" + ok.message
                + ",data=" + ok.data + ",traceId=" + ok.traceId);
        System.out.println("invalidCode=" + invalid.code + ",message=" + invalid.message);
        System.out.println("duplicateCode=" + duplicate.code + ",message=" + duplicate.message);
        System.out.println("notFoundCode=" + notFound.code + ",message=" + notFound.message);
    }
}
```

### 7.2 编译并运行

```bash
javac ApiDesignDemo.java
java ApiDesignDemo
```

### 7.3 你应该观察到什么

输出应包含这些关键信息：

```text
okCode=0,message=OK,data=user-1001-page-1,traceId=trace-req-1
invalidCode=2001,message=invalid page parameter
duplicateCode=3001,message=duplicate request
notFoundCode=1001,message=user not found
```

### 7.4 每一行在验证什么

- `okCode=0,...`：说明成功返回结构和失败返回结构是统一的
- `invalidCode=2001`：说明参数错误有明确错误码归类
- `duplicateCode=3001`：说明幂等场景可以有独立错误码语义
- `notFoundCode=1001`：说明业务类错误也应有稳定编号

## 8. 练习建议

下面这些练习做完，这一章会更扎实：

- 为一个小系统设计统一返回结构
- 设计一套分层错误码规范
- 复盘一个接口兼容性问题
- 统一团队中的分页和筛选参数命名

## 9. 自测问题

- 为什么错误码设计不能随意？
- 一个好的接口规范应具备哪些特征？
- 幂等接口在什么场景特别重要？
- 为什么统一返回结构能降低长期协作成本？

## 10. 自测核对要点

如果你的回答能覆盖下面这些点，说明这一章基本掌握到位了：

- API 是长期契约，设计必须考虑稳定性和兼容性
- 错误码需要分层、稳定、可追踪
- 统一返回结构能提升协作和排障效率
- 幂等接口设计在重复请求和重试场景中非常关键
