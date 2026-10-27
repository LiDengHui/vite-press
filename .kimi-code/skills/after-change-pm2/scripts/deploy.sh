#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
cd "$ROOT"

if [[ ! -f ecosystem.config.cjs ]]; then
  echo "错误：未找到 ecosystem.config.cjs（当前目录：$ROOT）"
  exit 1
fi

if ! pnpm exec pm2 -v >/dev/null 2>&1; then
  echo "PM2 未安装，正在本地安装..."
  pnpm add -D pm2
fi

pnpm build

pnpm exec pm2 startOrReload ecosystem.config.cjs --update-env
pnpm exec pm2 save
pnpm exec pm2 status

for _ in $(seq 1 30); do
  if curl -fsS --max-time 2 http://127.0.0.1:8090/ >/dev/null 2>&1; then
    break
  fi
  sleep 2
done

if ! curl -fsS --max-time 5 http://127.0.0.1:8090/ >/dev/null 2>&1; then
  echo "错误：PM2 服务未能在 8090 正常响应。"
  pnpm exec pm2 logs vite-press --lines 100 || true
  exit 3
fi

port_pid="$(lsof -nP -iTCP:8090 -sTCP:LISTEN -t 2>/dev/null | head -1 || true)"
if [[ -z "$port_pid" ]]; then
  echo "错误：8090 没有监听进程。"
  exit 4
fi

port_command="$(ps -p "$port_pid" -o comm= 2>/dev/null || true)"
if [[ "$port_command" != *node* ]]; then
  echo "错误：8090 被非 node 进程占用：$port_command (pid=$port_pid)"
  echo "请先停止 Docker 容器或退出 Docker Desktop。"
  exit 5
fi

fail=0
check() {
  local url="$1"
  if curl -fsS --max-time 5 "$url" >/dev/null 2>&1; then
    echo "OK   $url"
  else
    echo "FAIL $url"
    fail=1
  fi
}

check "http://127.0.0.1:8090/"

for ip in $(ifconfig | awk '/inet /{print $2}' | grep -v '^127\.' | sort -u || true); do
  check "http://${ip}:8090/"
done

if [[ "$fail" -ne 0 ]]; then
  echo "部分地址访问失败，请检查 macOS 防火墙或 Tailscale ACL。"
  exit 6
fi

echo "全部检查通过。"

if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  if [[ -n "$(git status --porcelain)" ]]; then
    echo "提示：工作区有未提交改动，已跳过自动推送；请先提交后再推送。"
  elif git rev-parse --abbrev-ref '@{u}' >/dev/null 2>&1; then
    ahead="$(git rev-list --count '@{u}..HEAD')"
    if [[ "$ahead" -gt 0 ]]; then
      echo "推送 ${ahead} 个提交到远端..."
      git push
    else
      echo "没有需要推送的提交。"
    fi
  else
    echo "当前分支没有 upstream，执行 git push -u origin HEAD..."
    git push -u origin HEAD
  fi
fi
