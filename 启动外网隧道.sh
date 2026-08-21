#!/bin/bash
# 商业街设计指导系统 · 一键外网隧道（HTTPS，Linux / macOS）
# 前提：已安装 Node.js 与 cloudflared（https://github.com/cloudflare/cloudflared）
cd "$(dirname "$0")"
echo "检查 8080 端口..."
SRV=""
if ! (ss -ltn 2>/dev/null | grep -q ':8080 ' || netstat -ltn 2>/dev/null | grep -q ':8080 '); then
  echo "未检测到 server.js，先启动本地服务..."
  node server.js &
  SRV=$!
  sleep 2
else
  echo "检测到 8080 已在监听，复用现有 server.js。"
fi
echo "启动 Cloudflare 隧道（需联网）..."
echo "看到 https://xxxx.trycloudflare.com 后，复制发给同事即可。"
cloudflared tunnel --url http://localhost:8080
# 若本脚本启动了本地服务，结束时一并关闭
if [ -n "$SRV" ]; then kill "$SRV" 2>/dev/null; fi
