@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================================
echo   商业街设计指导系统  ·  一键外网隧道（HTTPS）
echo ============================================================
echo.
echo   本脚本会把本地 8080 服务通过 Cloudflare 隧道暴露到公网，
echo   生成一个 https://xxxx.trycloudflare.com 的外网地址，
echo   发给任何同事（无需连公司内网、无需配置路由器 / 域名）即可访问。
echo.
echo   前提： ① 已安装 Node.js； ② 本机能联网。
echo.

REM 检查 8080 是否已被监听（server.js 是否在跑）
set RUNNING=0
netstat -ano 2^>nul | findstr ":8080" ^>nul && set RUNNING=1
if "%RUNNING%"=="0" (
  echo   未检测到 server.js（8080 端口），先为你启动本地服务...
  start "商业街本地服务" cmd /k "node server.js"
  timeout /t 3 ^>nul
) else (
  echo   检测到 8080 已在监听，复用现有 server.js。
)
echo.
echo   正在启动 Cloudflare 隧道（需联网）...
echo   看到 https://xxxx.trycloudflare.com 后，复制发给同事即可。
echo   关闭此窗口将停止隧道（由本脚本启动的本地服务窗口请手动关闭）。
echo.
tools\gooood-downloader\cloudflared.exe tunnel --url http://localhost:8080
pause
