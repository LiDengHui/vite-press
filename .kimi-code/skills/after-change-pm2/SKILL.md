---
name: after-change-pm2
description: 本项目任何文件修改完成后的固定收尾流程：本地构建 VitePress，重启 PM2 静态预览服务，验证 0.0.0.0:8090 访问，并推送已提交代码。
type: prompt
whenToUse: 当用户要求修改、新增、修复或整理本 VitePress 项目，或用户要求启动/部署本项目时；每次改动完成后都必须执行。
---

# 修改完成后的 PM2 启动流程

本项目的硬性规则：**只要本轮修改过项目文件，结束前必须重新构建并重启本地 PM2 服务。** 不要只改文件就结束。

本项目已从 Docker 切换为本地 PM2；Docker 文件保留作备用，但日常开发不要启动 Docker Desktop，否则又会占用大量内存。

优先执行技能自带脚本，它会完成构建、重启、访问验证和推送：

```bash
bash "${KIMI_SKILL_DIR}/scripts/deploy.sh"
```

脚本失败时按下面的步骤手动处理，不能跳过验证直接汇报成功。

## 1. 构建

```bash
pnpm build
```

构建输出在 `.vitepress/dist`，`vitepress preview` 直接托管该目录。

## 2. 启动或重启 PM2

PM2 配置在项目根目录 `ecosystem.config.cjs`：

- 应用名：`vite-press`
- 命令：`vitepress preview --port 8090`
- 监听：`0.0.0.0:8090`
- 内存上限：`600M`
- 日志：`.pm2-logs/out.log`、`.pm2-logs/error.log`

```bash
pnpm exec pm2 startOrReload ecosystem.config.cjs --update-env
pnpm exec pm2 save
pnpm exec pm2 status
```

如果 PM2 未安装：

```bash
pnpm add -D pm2
```

如果 8090 被 Docker 占用，先确认是否还需要 Docker：

```bash
docker compose down
```

然后退出 Docker Desktop，释放虚拟机内存。

## 3. 验证访问

```bash
curl -fsSI --max-time 5 http://127.0.0.1:8090/
```

再验证本机局域网和 Tailscale 地址：

```bash
ipconfig getifaddr en0
ipconfig getifaddr en1
ifconfig | grep 'inet 100\.64\.'
```

示例：

```bash
curl -fsSI --max-time 5 http://192.168.0.111:8090/
curl -fsSI --max-time 5 http://100.64.0.3:8090/
```

PM2 只提供 HTTP 8090；之前的 Docker Nginx 8443 不再存在。需要 HTTPS 时单独加反向代理。

失败时查看日志：

```bash
pnpm exec pm2 logs vite-press --lines 100
```

## 4. 推送代码

构建和访问验证通过后，检查工作区并推送已提交代码：

```bash
git status --porcelain
```

- 输出不为空：不要自动提交，提示用户先提交，本轮跳过推送。
- 工作区干净：检查 `git rev-list --count '@{u}..HEAD'`，大于 0 则 `git push`。
- 没有 upstream：`git push -u origin HEAD`。

推送失败时不要声称部署完成。

## 5. 完成标准

只有同时满足以下条件才算完成：

- [ ] `pnpm build` 成功
- [ ] `vite-press` 在 PM2 中为 `online`
- [ ] 8090 由 node 监听，且绑定所有网卡
- [ ] `http://127.0.0.1:8090/` 返回 200
- [ ] 至少一个局域网或 Tailscale 地址返回 200
- [ ] 工作区干净且已推送；或者明确说明因未提交改动而跳过推送

汇报时列出 PM2 状态、内存占用、访问地址和推送结果。
