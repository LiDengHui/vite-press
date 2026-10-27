#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
cd "$ROOT"

if [[ ! -f docker-compose.yml ]]; then
  echo "错误：未找到 docker-compose.yml（当前目录：$ROOT）"
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  echo "Docker daemon 未运行，正在启动 Docker Desktop..."
  open -a Docker || true
  for _ in $(seq 1 60); do
    docker info >/dev/null 2>&1 && break
    sleep 2
  done
fi

if ! docker info >/dev/null 2>&1; then
  echo "错误：Docker daemon 仍未就绪。"
  echo "请手动启动 Docker Desktop；如果出现 macOS 管理员授权窗口，请本人输入密码。"
  exit 3
fi

python3 - <<'PY'
import json
import subprocess
import sys

out = subprocess.check_output(
    ["docker", "compose", "config", "--format", "json"],
    text=True,
)
cfg = json.loads(out)
ports = cfg.get("services", {}).get("vite-press", {}).get("ports", [])
if not ports:
    print("错误：docker-compose.yml 中没有找到 vite-press 的 ports")
    sys.exit(4)

bad = [p for p in ports if p.get("host_ip") != "0.0.0.0"]
if bad:
    print("错误：以下端口没有显式绑定 0.0.0.0：")
    for p in bad:
        print(
            f'  host_ip={p.get("host_ip")!r} '
            f'published={p.get("published")} target={p.get("target")}'
        )
    print('请把它们改成 "0.0.0.0:<host>:<container>"。')
    sys.exit(4)

print("端口绑定检查通过：")
for p in ports:
    print(
        f'  {p.get("host_ip")}:{p.get("published")} '
        f'-> {p.get("target")}/{p.get("protocol", "tcp")}'
    )
PY

docker compose up -d --build

status=""
for _ in $(seq 1 120); do
  status="$(docker inspect -f '{{.State.Health.Status}}' vite-press 2>/dev/null || true)"
  [[ "$status" == "healthy" ]] && break
  sleep 5
done

if [[ "$status" != "healthy" ]]; then
  echo "错误：vite-press 未通过健康检查（当前状态：${status:-unknown}）"
  docker compose logs --tail=200 vite-press || true
  exit 5
fi

echo "容器健康检查通过。"
docker compose ps
echo "端口映射："
docker port vite-press

HTTP_PORT="${VITE_PRESS_PORT:-8090}"
HTTPS_PORT="${VITE_PRESS_SSL_PORT:-8443}"

fail=0
check() {
  local url="$1"
  shift
  if curl -fsSI --max-time 5 "$@" "$url" >/dev/null 2>&1; then
    echo "OK   $url"
  else
    echo "FAIL $url"
    fail=1
  fi
}

check "http://127.0.0.1:${HTTP_PORT}/"
check "https://127.0.0.1:${HTTPS_PORT}/" -k

for ip in $(ifconfig | awk '/inet /{print $2}' | grep -v '^127\.' | sort -u || true); do
  check "http://${ip}:${HTTP_PORT}/"
  check "https://${ip}:${HTTPS_PORT}/" -k
done

if [[ "$fail" -ne 0 ]]; then
  echo "部分地址访问失败，请检查 macOS 防火墙、Tailscale ACL 或 nginx 日志。"
  exit 6
fi

echo "全部检查通过。"
