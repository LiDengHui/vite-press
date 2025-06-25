# 浏览器 DNS 优化：`rel="dns-prefetch"` 与 `rel="preconnect"`

## 1. **`rel="dns-prefetch"`（DNS 预解析）**
- **原理**：  
  浏览器在后台提前解析指定域名的 DNS，将域名转换为 IP 地址。当后续实际请求该域名的资源时，直接使用已缓存的 IP，跳过 DNS 查询步骤（通常耗时 **20-120ms**）。

- **使用方式**（在 HTML 的 `<head>` 中添加）：
  ```html
  <link rel="dns-prefetch" href="https://example.com">
  ```

- **适用场景**：  
  用于 **非关键第三方资源**（如广告、分析脚本、CDN 资源），提前解析 DNS 但无需立即建立连接。

- **优势**：
    - 资源消耗极低（仅解析 DNS）。
    - 显著减少跨域资源的 DNS 延迟。
    - 兼容性极佳（支持所有现代浏览器）。


## 2. **`rel="preconnect"`（预连接）**
- **原理**：  
  浏览器提前完成与目标域名的 **完整连接握手**，包括：
    1. **DNS 解析**（同 `dns-prefetch`）。
    2. **TCP 握手**（3 次往返）。
    3. **TLS 协商**（HTTPS 的额外 1-2 次往返）。  
       后续请求可直接复用连接，跳过网络初始化延迟（通常节省 **100-500ms**）。

- **使用方式**：
  ```html
  <link rel="preconnect" href="https://api.example.com" crossorigin>
  ```
  > 注：`crossorigin` 属性用于跨域资源（如字体、CDN）。

- **适用场景**：  
  用于 **关键跨域资源**（如核心 CDN 库、API 域名、Web 字体），需立即建立连接。

- **注意事项**：
    - 占用额外资源（浏览器主动维护连接约 **10-15 秒**）。
    - 过度使用可能导致带宽浪费（建议仅用于 3-4 个关键域名）。

## 对比与最佳实践
| **特性**   | `dns-prefetch` | `preconnect`          |
|----------|----------------|-----------------------|
| **优化范围** | 仅 DNS 解析       | DNS + TCP + TLS（完整连接） |
| **延迟节省** | 20-120ms       | 100-500ms+            |
| **资源消耗** | 极低             | 中（维护 TCP/TLS 连接）      |
| **推荐场景** | 非关键第三方资源       | 关键渲染路径资源（CSS/JS/字体）   |
| **兼容性**  | IE10+、所有现代浏览器  | IE 不支持，现代浏览器均支持       |

## **组合使用示例**
```html
<head>
  <!-- 关键资源：预连接 -->
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  
  <!-- 非关键资源：仅 DNS 预解析 -->
  <link rel="dns-prefetch" href="https://analytics.example.com">
  <link rel="dns-prefetch" href="https://ads.example.com">
</head>
```

#### **最佳实践**
1. **优先 `preconnect` 关键域名**（如 CDN、主 API）。
2. **对次要资源用 `dns-prefetch`**（如分析工具、广告）。
3. **限制预连接数量**（通常不超过 4 个），避免资源竞争。
4. **无需对同域资源使用**（浏览器默认优化同域请求）。
5. **与 `preload` 结合**（对已知 URL 的资源，用 `preload` 直接预加载内容）。

## 底层原理图解
```
普通请求流程：
  [DNS 查询] → [TCP 握手] → [TLS 协商] → 发送请求

dns-prefetch 优化：
  提前完成 [DNS 查询] ────────┐
                           ↓
  [TCP 握手] → [TLS 协商] → 发送请求

preconnect 优化：
  提前完成 [DNS 查询] → [TCP 握手] → [TLS 协商] ─┐
                                               ↓
                                            发送请求
```

> **总结**：
> - `dns-prefetch` 是轻量级 DNS 预热，适用于次要资源。
> - `preconnect` 是完整连接预热，用于核心资源提速。  
    > 合理使用可显著减少 RTT（Round Trip Time），提升页面加载性能。
