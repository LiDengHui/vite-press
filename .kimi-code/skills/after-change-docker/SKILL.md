---
name: after-change-docker
description: 本项目任何文件修改完成后的固定收尾流程：重建并启动 Docker，确认端口显式绑定 0.0.0.0，并验证本机、局域网和 Tailscale 访问。
type: prompt
whenToUse: 当用户要求修改、新增、修复或整理本 VitePress 项目，或用户要求启动/部署本项目时；每次改动完成后都必须执行。
---

# 修改完成后的 Docker 启动流程

本项目的硬性规则：**只要本轮修改过项目文件，结束前必须重建并启动 Docker，且发布端口显式绑定 `0.0.0.0`。** 不要只改文件就结束。

优先执行技能自带脚本，它会完成检查、构建、健康检查和访问验证：

```bash
bash "${KIMI_SKILL_DIR}/scripts/deploy.sh"
```

脚本失败时按下面的步骤手动处理，不能跳过验证直接汇报成功。

## 1. 确认端口绑定为 0.0.0.0

`docker-compose.yml` 中 `vite-press` 的 `ports` 必须是：

```yaml
ports:
  - "0.0.0.0:${VITE_PRESS_PORT:-8090}:80"
  - "0.0.0.0:${VITE_PRESS_SSL_PORT:-8443}:443"
```

如果缺少 `0.0.0.0`，先修正再继续。检查解析结果：

```bash
docker compose config --format json
```

两个端口的 `host_ip` 都应为 `0.0.0.0`。不要使用只绑定 `127.0.0.1` 的写法，否则局域网和 Tailscale 都访问不到。

## 2. 确保 Docker daemon 已启动

```bash
docker info
```

失败时启动 Docker Desktop 并等待：

```bash
open -a Docker
```

最多等待 120 秒，期间每 2～5 秒重试 `docker info`。

如果 macOS 弹出管理员授权窗口：

- 让用户本人在系统弹窗中输入密码。
- **不要索取、记录、保存或在命令中复用任何密码。**
- 不要把密码写进脚本、配置文件或提交记录。
- 授权完成后重新检查 `docker info`。

## 3. 重建并启动

```bash
docker compose up -d --build
```

注意：

- 必须带 `--build`，否则修改后的文档不会进入新镜像。
- 本项目文档和图片较多，首次构建或网络较慢时可能超过 10 分钟；不要因为耗时长就跳过或谎报完成。
- 如果构建确实失败，保留错误输出并继续排查，不要把旧容器当成新构建结果。

## 4. 等待健康检查

```bash
docker inspect -f '{{.State.Health.Status}}' vite-press
```

循环等待直到输出 `healthy`，建议最多等待 10 分钟。超时或状态为 `unhealthy` 时：

```bash
docker compose logs --tail=200 vite-press
```

把日志中的关键错误汇报出来，并明确说明部署未完成。

## 5. 验证访问

先确认实际发布端口：

```bash
docker port vite-press
```

应包含：

```text
80/tcp -> 0.0.0.0:8090
443/tcp -> 0.0.0.0:8443
```

至少验证以下地址返回 HTTP 200：

```bash
curl -fsSI --max-time 5 http://127.0.0.1:8090/
curl -fsSI --max-time 5 http://192.168.0.111:8090/   # 示例：本机局域网 IP
curl -fsSI --max-time 5 http://100.64.0.3:8090/     # 示例：Tailscale IP（存在时）
curl -kfsSI --max-time 5 https://100.64.0.3:8443/   # 自签证书需要 -k
```

IP 获取方式：

```bash
ipconfig getifaddr en0
ipconfig getifaddr en1
ifconfig | grep 'inet 100\.64\.'
```

存在多个 IPv4 地址时逐个验证；如果某个地址不通，先确认它确实是本机地址，再检查 macOS 防火墙和 Tailscale ACL。

## 6. 推送代码

部署和访问验证通过后，检查工作区并推送已提交代码：

```bash
git status --porcelain
```

- 如果输出不为空：说明还有未提交改动，**不要自动提交**，提示用户先提交；本轮不执行推送。
- 如果工作区干净：检查是否有未推送提交。

```bash
git rev-list --count '@{u}..HEAD'
```

- 大于 `0`：执行 `git push`。
- 没有 upstream：执行 `git push -u origin HEAD`。
- 等于 `0`：说明没有需要推送的提交。

推送失败时不要声称部署完成，需把错误明确汇报。

## 7. 完成标准

只有同时满足以下条件才算完成：

- [ ] `docker-compose.yml` 的发布端口绑定 `0.0.0.0`
- [ ] Docker daemon 正常运行
- [ ] `docker compose up -d --build` 成功
- [ ] `vite-press` 容器状态为 `healthy`
- [ ] `docker port` 显示 `0.0.0.0:8090` 和 `0.0.0.0:8443`
- [ ] 本机地址返回 200
- [ ] 至少一个局域网或 Tailscale 地址返回 200
- [ ] 工作区干净且已提交代码推送到远端；或者明确说明因未提交改动而跳过推送

汇报时列出容器状态、端口映射、验证过的 URL 和推送结果。
