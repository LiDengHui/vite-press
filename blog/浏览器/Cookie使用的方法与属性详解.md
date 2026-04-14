# Cookie 使用的方法与属性详解

在 Web 开发中，**Cookies** 是存储在用户浏览器中的小型文本数据，用于跟踪会话状态、用户偏好等。主要通过 JavaScript 的 `document.cookie` API 操作。以下是核心方法和属性详解：

---

### **一、设置 Cookie**
通过 `document.cookie` 赋值创建或更新 Cookie：
```javascript
// 基础设置（会话级 Cookie，关闭浏览器失效）
document.cookie = "username=JohnDoe";

// 设置带过期时间（UTC 格式）
const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
document.cookie = `theme=dark; expires=${expires}`;

// 设置路径和域名
document.cookie = "lang=en; path=/; domain=example.com";

// 安全设置（仅 HTTPS 传输 + 防跨站请求）
document.cookie = "session=abc123; secure; samesite=strict";
```

---

### **二、读取 Cookie**
通过 `document.cookie` 获取所有 Cookie（返回字符串）：
```javascript
const allCookies = document.cookie; 
// 输出： "username=JohnDoe; theme=dark; lang=en"

// 解析为对象
const parseCookies = () => {
  return Object.fromEntries(
    document.cookie.split('; ').map(c => c.split('='))
};
console.log(parseCookies().theme); // 输出 "dark"
```

---

### **三、删除 Cookie**
设置过期时间为过去的时间：
```javascript
document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
```

---

### **四、Cookie 属性**
设置时可附加以下属性（大小写不敏感）：
| **属性**    | **作用**                                                                 |
|-------------|--------------------------------------------------------------------------|
| `expires`   | 过期时间（UTC 字符串），如未设置则为会话 Cookie                          |
| `max-age`   | 替代 `expires`，设置存活秒数（优先级更高）                               |
| `path`      | 生效路径（默认为当前路径）                                               |
| `domain`    | 生效域名（默认为当前域名，**不能跨域**）                                 |
| `secure`    | 仅通过 HTTPS 传输                                                        |
| `samesite`  | 防跨站请求（`strict`/`lax`/`none`，默认为 `lax`）                       |
| `httponly`  | **仅服务端可读**（增强安全性，防止 XSS 攻击，JavaScript 无法设置此属性） |

---

### **五、封装工具函数**
```javascript
// 设置 Cookie
const setCookie = (name, value, options = {}) => {
  const { maxAge, expires, path, domain, secure, sameSite } = options;
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  if (maxAge) cookie += `; max-age=${maxAge}`;
  if (expires) cookie += `; expires=${expires.toUTCString()}`;
  if (path) cookie += `; path=${path}`;
  if (domain) cookie += `; domain=${domain}`;
  if (secure) cookie += '; secure';
  if (sameSite) cookie += `; samesite=${sameSite}`;
  document.cookie = cookie;
};

// 获取 Cookie
const getCookie = (name) => {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`))
    ?.split('=')[1];
};

// 删除 Cookie
const deleteCookie = (name, path, domain) => {
  setCookie(name, '', { 
    expires: new Date(0), 
    path, 
    domain 
  });
};
```

---

### **六、重要注意事项**
1. **大小限制**：单个 Cookie ≤ 4KB，每个域名下 Cookie 总数有限（通常 20~50 个）。
2. **编码**：建议使用 `encodeURIComponent()` 处理特殊字符（如 `;`、`,`、空格）。
3. **安全性**：
    - 敏感信息应设置 `HttpOnly`（防 XSS）和 `Secure`（仅 HTTPS）。
    - 避免存储密码等机密数据。
4. **替代方案**：现代应用常用 `Web Storage`（localStorage/sessionStorage）或 `IndexedDB` 存储客户端数据。

---

### **七、服务端操作**
服务端通过 HTTP 响应头设置 Cookie：
```http
Set-Cookie: sessionId=abc; Expires=Wed, 21 Oct 2025 07:28:00 GMT; HttpOnly; Secure
```

---

通过合理使用 Cookie 属性和遵循安全实践，可以有效管理用户状态，提升应用体验。
