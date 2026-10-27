# syntax=docker/dockerfile:1

# ============================================================
# VitePress 博客镜像
#   阶段 1 build：Node 内安装依赖并执行 vitepress build
#   阶段 2 serve：nginx 托管 .vitepress/dist 静态文件
#
# 构建与运行见根目录 docker-compose.yml，一键部署：pnpm deploy:docker
# ============================================================

# ---------- 阶段 1：构建 ----------
FROM node:22-bookworm-slim AS build

ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH

# vitepress 的 lastUpdated 会调用 git，官方 slim 镜像里没有，必须自己装
RUN apt-get update \
 && apt-get install -y --no-install-recommends git \
 && rm -rf /var/lib/apt/lists/*

# 与 package.json 的 packageManager 字段保持一致
RUN npm install -g pnpm@9.15.4

WORKDIR /app

# 先只拷依赖清单，让 pnpm install 这层可被缓存：只改文章时不会重装依赖
COPY package.json pnpm-lock.yaml .npmrc ./

RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile

COPY . .

# NODE_ENV 只在这一步设置：设为 production 会跳过 devDependencies，
# 而 vitepress 本身就在 devDependencies 中，所以不能用全局 ENV。
#
# --max-old-space-size：容器里 node 默认堆上限只有 ~2GB，
# 这个站有 570 篇文档 + 1200 多张图，打包阶段会超过 2GB 而 OOM 崩溃（exit 134），
# 必须显式调高（Docker 给了 7.75GB，这里用 4GB 留出余量）。
RUN NODE_ENV=production NODE_OPTIONS=--max-old-space-size=4096 pnpm run build

# ---------- 阶段 2：运行 ----------
# 对齐线上：Debian 系 nginx（不是官方 nginx 镜像）+ brotli 动态模块，
# 站点目录 /root/blog/ 与线上一致。
FROM debian:bookworm-slim

RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      nginx \
      libnginx-mod-http-brotli-filter \
      libnginx-mod-http-brotli-static \
      openssl \
      curl \
 && rm -rf /var/lib/apt/lists/*

# 线上这台自己加了 /etc/nginx/modules.conf，Debian 的包没有这个文件；
# 配置里是非通配 include，文件不存在 nginx 会直接启动失败，所以建个空的。
RUN : > /etc/nginx/modules.conf

# 自签证书，路径与文件名都按线上写，方便 443 那段配置原样保留
RUN mkdir -p /root/ssl \
 && openssl req -x509 -nodes -newkey rsa:2048 -days 3650 \
      -keyout /root/ssl/pinia.work.key \
      -out /root/ssl/pinia.work_bundle.crt \
      -subj "/CN=pinia.work"

COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/50x.html /usr/share/nginx/html/50x.html
COPY --from=build /app/.vitepress/dist /root/blog/

# 日志仍然落到配置里写的那两个文件，但指到容器标准输出，这样 docker logs 能看
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
 && ln -sf /dev/stderr /var/log/nginx/error.log

EXPOSE 80 443

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -fsS http://127.0.0.1/ >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
