# Nginx 配置 Brotli 压缩流程说明书

## 前置条件
1. **Nginx 版本 ≥ 1.11.6**（支持动态模块）
2. **操作系统支持**（以 Ubuntu 20.04 为例）
3. **root 或 sudo 权限**

---

## 步骤 1：安装 Brotli 依赖库
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install brotli libbrotli-dev

# CentOS/RHEL
sudo yum install brotli brotli-devel
```

---

## 2.1 下载 ngx_brotli 源码
```bash
cd /usr/local/src
git clone https://github.com/google/ngx_brotli.git
cd ngx_brotli
git submodule update --init  # 初始化子模块
```

## 2.2 获取 Nginx 编译参数
```bash
nginx -V 2>&1 | grep configure  # 复制输出的配置参数（如：--prefix=/etc/nginx）
```

## 2.3 下载匹配的 Nginx 源码
```bash
NGINX_VERSION=$(nginx -v 2>&1 | awk -F '/' '{print $2}')
wget http://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz
tar zxvf nginx-${NGINX_VERSION}.tar.gz
cd nginx-${NGINX_VERSION}
```

## 2.4 编译动态模块
```bash
# 使用步骤 2.2 中的参数 + Brotli 模块
./configure [粘贴原有参数] --add-dynamic-module=/usr/local/src/ngx_brotli

# 示例（根据实际参数调整）：
# ./configure --prefix=/etc/nginx ... --add-dynamic-module=/usr/local/src/ngx_brotli

# 仅编译模块（不覆盖安装）
make modules
```

## 2.5 复制生成的模块文件
```bash
sudo cp objs/*.so /etc/nginx/modules/  # 路径根据 --prefix 确定
```

---

## 3.1 在 `nginx.conf` 中加载模块
```nginx
# 主配置文件 /etc/nginx/nginx.conf
load_module modules/ngx_http_brotli_filter_module.so;
load_module modules/ngx_http_brotli_static_module.so;
```

## 3.2 在 `http` 块中配置 Brotli 参数
```nginx
http {
    brotli              on;      # 启用动态压缩
    brotli_comp_level   6;       # 压缩级别 (1-11)
    brotli_types        text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;
    brotli_min_length   20;      # 最小压缩文件大小
}
```

## 3.3 可选：启用预压缩静态文件（高效但需额外步骤）
```nginx
server {
    location ~ \.(html|css|js|svg)$ {
        brotli_static on;  # 优先发送预压缩文件（如 .br 文件）
    }
}
```
**生成预压缩文件**：
```bash
# 示例：压缩 /var/www/html 下的文件
find /var/www/html -type f \( -name "*.html" -o -name "*.css" -o -name "*.js" \) -exec brotli -k -f {} \;
# 生成同名 .br 文件（需定期更新）
```

---

## 步骤 4：验证并重启 Nginx
```bash
sudo nginx -t           # 检查配置语法
sudo systemctl restart nginx  # 重启服务
```

---

## 5.1 方法 1：使用 `curl` 测试
```bash
curl -H "Accept-Encoding: br" -I http://localhost
```
**成功响应**：
```
content-encoding: br
```

## 5.2 方法 2：浏览器开发者工具
1. 打开网页 → **Network** 标签
2. 检查响应头：
   ```
   content-encoding: br
   ```

## 5.3 方法 3: nginx 添加 Accept-Encoding

```nginx{3}
  location / {
    root   /root/blog/;
    proxy_set_header Accept-Encoding "";
    index  index.html index.htm;
    expires 30d;
    add_header Cache-Control "public, max-age=2592000, immutable";
 }
```
---

## 故障排除
1. **模块加载失败**：
    - 检查 `nginx -t` 报错
    - 确保 `.so` 文件路径与 `load_module` 一致
    - 确认 Nginx 版本与编译版本匹配

2. **未启用压缩**：
    - 检查 `brotli on;` 是否在 `http` 块
    - 确认请求包含 `Accept-Encoding: br`

3. **性能优化**：
    - 调整 `brotli_comp_level`（越高越耗 CPU）
    - 对静态文件使用 `brotli_static` 减少实时压缩开销

---

> **注意**：
> - 动态压缩适用于实时内容（如 API 响应）
> - 预压缩（`brotli_static`）适合静态文件（需额外生成 `.br` 文件）
> - Gzip 与 Brotli 可共存，浏览器自动选择最优压缩