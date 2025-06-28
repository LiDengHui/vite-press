# 什么是JSONP

**JSONP（JSON with Padding）** 是一种解决浏览器**跨域数据请求限制**的变通技术（非官方标准）。它的核心思想是：**利用 `<script>` 标签不受同源策略限制的特性，动态创建 script 标签来加载跨域数据。**

## 工作原理

1.  **前端定义回调函数：**
    *   在你的网页中，定义一个 JavaScript 函数（例如 `handleResponse`）。
    ```javascript
    function handleResponse(data) {
        // 在这里处理从跨域服务器返回的数据
        console.log('Received data:', data);
    }
    ```

2.  **动态创建 Script 标签：**
    *   使用 JavaScript 动态创建一个 `<script>` 标签。
    *   将它的 `src` 属性设置为**目标跨域 API 的 URL**。
    *   关键点：**在 URL 中指定一个查询参数（通常是 `callback`）来告诉服务器你定义的回调函数名是什么。**
    ```javascript
    const script = document.createElement('script');
    script.src = 'https://api.example.com/data?callback=handleResponse'; // 注意 callback 参数
    document.body.appendChild(script);
    ```

3.  **服务器响应特殊格式：**
    *   跨域服务器收到请求后，识别出 `callback` 参数的值（这里是 `handleResponse`）。
    *   服务器**不返回纯 JSON**，而是返回一段**可执行的 JavaScript 代码**。
    *   这段代码的内容是：**调用前端定义的那个回调函数，并把真正的 JSON 数据作为参数传递进去。**
    ```javascript
    handleResponse({
        "name": "Alice",
        "age": 30,
        "city": "New York"
    }); // 服务器实际返回的内容
    ```

4.  **前端执行响应并处理数据：**
    *   浏览器加载并执行这个 `<script>` 标签返回的 JavaScript 代码。
    *   这段代码执行时，就会调用你之前定义的 `handleResponse` 函数。
    *   `handleResponse` 函数接收到服务器返回的 JSON 数据（现在作为函数的参数 `data`），你就可以在自己的页面里自由使用这些数据了。

## 关键特点

*   **绕过同源策略：** 核心是利用 `<script>` 标签可以跨域加载资源的特性。
*   **基于回调 (Callback)：** 必须定义一个全局函数来处理返回的数据。
*   **服务器需支持：** 目标服务器必须设计成能够识别 `callback` 参数并返回包裹在函数调用中的 JSONP 响应。
*   **仅支持 GET 请求：** 因为本质是加载一个脚本资源，所以只能使用 HTTP GET 方法，无法使用 POST、PUT、DELETE 等。

## 为什么需要 JSONP（历史背景）

在 **CORS（Cross-Origin Resource Sharing）** 成为标准并被广泛支持之前，浏览器严格禁止 XMLHttpRequest（XHR）或 Fetch API 向不同源（协议、域名、端口任一不同）的服务器发起请求。JSONP 提供了一种巧妙（但非正式）的变通方案来解决这个限制。

## JSONP 的缺点与风险

1.  **仅支持 GET：** 无法执行 POST 等操作，限制了使用场景。
2.  **安全性风险：**
    *   **XSS（跨站脚本攻击）风险：** 你完全信任服务器返回的脚本代码。如果服务器被黑或者 API 本身恶意，它返回的脚本可以执行任何操作（窃取 Cookie、篡改页面等）。
    *   **缺乏错误处理：** 很难像 XHR/Fetch 那样可靠地检测网络错误或服务器错误（如 404, 500）。如果加载失败，只能通过超时机制猜测。
    *   **CSRF（跨站请求伪造）风险：** 虽然 GET 请求本身也可能导致 CSRF，但 JSONP 更容易被滥用，因为它天然就是跨域的 GET 请求。
3.  **回调函数管理：** 需要管理全局命名空间中的回调函数名，多个并发请求时容易冲突（尽管可以通过生成唯一函数名解决）。
4.  **调试困难：** 错误信息不如 XHR/Fetch 清晰。

## 现代替代方案：CORS

**CORS（跨域资源共享）** 是 W3C 标准，是解决跨域问题的**首选、安全和官方的方式**。它通过在 HTTP 请求和响应中添加特定的头部（如 `Origin`, `Access-Control-Allow-Origin`）来让浏览器和服务器协商是否允许跨域访问。现代浏览器广泛支持 CORS。

*   **支持所有 HTTP 方法（GET, POST, PUT, DELETE 等）。**
*   **更精细的控制（允许的域名、方法、头信息等）。**
*   **内置安全性机制。**
*   **更好的错误处理。**

## 总结

*   **JSONP 是什么？** 一种利用 `<script>` 标签进行跨域 GET 请求的“Hack”技术。
*   **核心原理：** 前端定义回调函数，通过 script.src 告诉服务器函数名；服务器返回调用该函数并包裹 JSON 数据的 JS 代码；浏览器执行代码触发回调处理数据。
*   **主要缺点：** 仅 GET、严重安全隐患（XSS）、错误处理差、调试难。
*   **现代方案：** **优先使用 CORS**。只有在必须支持非常老的浏览器或访问无法配置 CORS 的旧服务时，才考虑 JSONP（并充分意识到其风险）。

简单来说，JSONP 是早期解决跨域问题的一个巧妙但存在安全隐患的变通方法，**现代 Web 开发中应首选 CORS。**
