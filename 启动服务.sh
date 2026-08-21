#!/bin/bash
# 商业街案例研究与设计指导系统 · 启动共享服务（Linux / macOS）
# 用法： chmod +x 启动服务.sh && ./启动服务.sh
cd "$(dirname "$0")"
echo "本机访问 ： http://localhost:8080"
echo "同事访问 ： http://你的内网IP:8080  （需防火墙放行 8080 端口）"
echo "外网访问 ： 运行「启动外网隧道.sh」一键生成 https 外网地址（免路由器配置）"
echo "注意：「意见」栏要所有同事互相可见，必须用本脚本启动 node server.js"
echo "按 Ctrl+C 停止服务"
node server.js
