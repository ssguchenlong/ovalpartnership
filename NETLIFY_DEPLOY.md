# 部署到 Netlify（让图片工具 + 意见共享都正常工作）

## ❌ 不要再用 Netlify Drop（拖拽文件夹）
Drop 是**纯静态托管**：它不读取 `netlify.toml`、不运行任何函数、没有后端。
结果就是：
- 案例图片工具走公共 CORS 代理 → 代理大面积失效时显示「获取失败」；
- 意见功能没有共享后端 → 显示「本地模式·仅本机保存」。

## ✅ 改用「完整部署」（带 Serverless 函数）
这样图片工具由服务端抓取（无需 CORS 代理），意见也能同事共享。

### 方式 A：Git 连接（推荐，最省事）
1. 把这个文件夹推到 GitHub / GitLab / Bitbucket 仓库；
2. Netlify 后台 → Add new site → Import an existing project → 连该仓库；
3. Build settings 会自动读到 `netlify.toml`：
   - Build command：留空（无需构建）
   - Publish directory：`.`（根目录，因为有 index.html）
   - Functions directory：`netlify/functions`
4. Deploy。完成后访问分配的 `.netlify.app` 域名即可。

### 方式 B：命令行部署（不用 Git）
在项目根目录执行（需先全局安装 netlify-cli，只需一次）：
```bash
npm i -g netlify-cli
netlify login
netlify deploy --prod --dir=. --functions=netlify/functions
```
`--dir=.` 把整个文件夹作为静态文件，`--functions=netlify/functions` 让图片后台与意见后台两个函数生效。

## 部署后验证
- 打开站点 → 点「功能 → 案例图片下载器」：
  - 右上角状态应显示 **「服务端模式」**（说明连到了函数后端）；
  - 谷德搜索 / 粘贴网址都能正常抓图。
- 打开「意见」：
  - 右上角状态应显示 **「共享模式」**，且不再有「本地模式」橙色警告；
  - 发的意见同事可见。

## 若仍显示「本地模式 / 获取失败」
- 确认用的是完整部署（A 或 B），而**不是** Drop；
- 硬刷新一次（Ctrl+Shift+R / Cmd+Shift+R）清掉旧缓存；
- 函数首次冷启动需 1~2 秒，稍等再试。

## 备注
- 意见共享后端用 Netlify Blobs 持久化（函数内已自动适配 `@netlify/blobs`，Netlify 运行环境自带，无需你额外安装依赖）。
- 仅 `netlify/functions/` 下两个文件是后端代码，其余均为静态资源。
