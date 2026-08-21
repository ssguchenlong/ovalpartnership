@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================================
echo   商业街案例研究与设计指导系统  ·  启动共享服务
echo ============================================================
echo.
echo   本机访问 ： http://localhost:8080
echo   同事访问 ： http://你的内网IP:8080   （需防火墙放行 8080 端口）
echo   外网访问 ： 运行「启动外网隧道.bat」一键生成 https 外网地址（免路由器配置）
echo.
echo   注意：「意见」栏要所有同事互相可见，必须用本脚本启动，
echo   而不是直接双击 index.html 或用其它静态服务器打开。
echo   首次使用请先安装 Node.js： https://nodejs.org
echo.
echo   按 Ctrl+C 可停止服务。
echo ============================================================
echo.
node server.js
pause
