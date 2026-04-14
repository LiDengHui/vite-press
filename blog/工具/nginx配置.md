# nginx 配置 

以下是针对Nginx配置的分类详解，涵盖性能优化、请求转发、请求代理、安全检测等核心功能，并补充其他关键配置内容：

---

## **一、性能优化配置**
1. **工作进程优化**
   ```nginx
   worker_processes auto;  # 自动匹配CPU核心数
   worker_rlimit_nofile 100000;  # 每个worker能打开的文件描述符上限
   events {
       worker_connections 4096;  # 单个worker最大连接数
       use epoll;  # Linux高性能事件模型（Linux 2.6+）
       multi_accept on;  # 一次接受多个连接
   }
   ```

2. **连接与传输优化**
   ```nginx
   http {
       sendfile on;  # 零拷贝传输静态文件
       tcp_nopush on;  # 数据包累积到一定大小再发送（需启用sendfile）
       tcp_nodelay on;  # 禁用Nagle算法，降低延迟
       keepalive_timeout 30;  # 长连接超时时间（秒）
       keepalive_requests 1000;  # 单个长连接最大请求数
   }
   ```

3. **缓冲与超时控制**
   ```nginx
   client_body_buffer_size 10K;
   client_header_buffer_size 1k;
   client_max_body_size 20m;  # 最大上传文件大小
   client_body_timeout 12;
   client_header_timeout 12;
   ```

4. **Gzip压缩**
   ```nginx
   gzip on;
   gzip_min_length 1k;  # 最小压缩文件大小
   gzip_comp_level 5;   # 压缩级别（1-9）
   gzip_types text/plain application/xml text/css application/javascript;
   gzip_vary on;
   ```

5. **静态资源缓存**
   ```nginx
   location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
       expires 365d;  # 客户端缓存时间
       add_header Cache-Control "public, no-transform";
   }
   ```


## **二、请求转发（反向代理）**
1. **基础代理配置**
   ```nginx
   location /app/ {
       proxy_pass http://backend_server;  # 转发到后端服务器
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
   }
   ```

2. **负载均衡**
   ```nginx
   upstream backend_server {
       least_conn;  # 负载均衡策略（最少连接）
       server 10.0.0.1:8080 weight=3;  # 权重
       server 10.0.0.2:8080;
       server backup.example.com:8080 backup;  # 备用服务器
       keepalive 32;  # 长连接池大小
   }
   ```

3. **路径重写**
   ```nginx
   location /api/ {
       rewrite ^/api/(.*)$ /$1 break;  # 移除URI中的/api前缀
       proxy_pass http://api_backend;
   }
   ```


## **三、请求代理（正向代理）**
```nginx
server {
    listen 3128;
    resolver 8.8.8.8;  # DNS解析服务器
    location / {
        proxy_pass http://$http_host$request_uri;  # 透传原始请求
        proxy_buffers 256 4k;  # 缓冲区优化
    }
}
```


## **四、安全检测与防护**
1. **HTTPS强制跳转**
   ```nginx
   server {
       listen 80;
       server_name example.com;
       return 301 https://$host$request_uri;  # HTTP重定向到HTTPS
   }
   ```

2. **SSL安全配置**
   ```nginx
   server {
       listen 443 ssl;
       ssl_certificate /path/to/fullchain.pem;
       ssl_certificate_key /path/to/privkey.pem;
       ssl_protocols TLSv1.2 TLSv1.3;
       ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
       ssl_prefer_server_ciphers on;
       ssl_session_cache shared:SSL:10m;
       ssl_session_timeout 10m;
   }
   ```

3. **WAF基础防护**
   ```nginx
   # 阻止常见扫描器
   if ($http_user_agent ~* (nmap|nikto|sqlmap)) {
       return 403;
   }
   # 限制请求方法
   limit_except GET POST { deny all; }
   ```

4. **访问控制**
   ```nginx
   location /admin {
       allow 192.168.1.0/24;  # 允许内网访问
       deny all;               # 拒绝其他IP
       auth_basic "Restricted";  # 基础认证
       auth_basic_user_file /etc/nginx/.htpasswd;
   }
   ```

---

## **五、补充关键配置**
1. **日志管理**
   ```nginx
   log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                  '$status $body_bytes_sent "$http_referer" '
                  '"$http_user_agent" "$http_x_forwarded_for"';
   access_log /var/log/nginx/access.log main buffer=32k flush=5m;
   ```

2. **限流防刷**
   ```nginx
   limit_req_zone $binary_remote_addr zone=req_per_ip:10m rate=10r/s;
   location /login {
       limit_req zone=req_per_ip burst=20 nodelay;  # 每秒10请求，峰值20
   }
   ```

3. **WebSocket代理**
   ```nginx
   location /ws/ {
       proxy_pass http://websocket_backend;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection "upgrade";
   }
   ```

4. **错误页面自定义**
   ```nginx
   error_page 404 /404.html;
   error_page 500 502 503 504 /50x.html;
   location = /50x.html {
       root /usr/share/nginx/html;
   }
   ```

5. **跨域配置**
   ```nginx
   location /api {
       add_header 'Access-Control-Allow-Origin' 'https://trusted.com';
       add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
       add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,Content-Type';
   }
   ```

---

## **六、高级技巧**
- **动态模块加载**：通过 `load_module modules/ngx_http_modsecurity_module.so;` 集成ModSecurity WAF。
- **Lua脚本扩展**：使用OpenResty支持自定义逻辑（如鉴权、流量分析）。
- **HTTP/2优化**：在SSL配置后添加 `http2` 参数提升性能（例：`listen 443 ssl http2;`）。
- **分片缓存**：用 `proxy_cache_path` 切片存储大文件缓存。

---

**最佳实践建议**：
1. 使用 `nginx -t` 测试配置后再重载（`nginx -s reload`）。
2. 通过 `access_log off;` 关闭静态资源日志提升性能。
3. 定期更新Nginx版本修复安全漏洞。

> 以上配置需根据实际场景调整，完整示例可参考 [Nginx官方文档](https://nginx.org/en/docs/)。
