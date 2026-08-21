#!/usr/bin/env node
/*
 * 商业街案例研究与设计指导系统 —— 轻量服务器
 * ------------------------------------------------------------
 * 零依赖（仅使用 Node 内置 http / fs / path 模块）。
 *
 * 作用：
 *   1. 静态托管本目录下的 index.html 与 data/ images/ tools/ 等资源；
 *   2. 提供共享意见接口，使「意见」栏目的留言在公司内网 / 外网对所有同事可见：
 *        GET  /api/feedback        -> { posts: [...] }
 *        POST /api/feedback        -> 新增一条意见（body: {author,text}）
 *        POST /api/feedback        -> 回复某条意见（body: {author,text,parent:"帖子id"}）
 *        DELETE /api/feedback?id=&reply=  -> 删除
 *      数据持久化在 data/feedback.json。
 *   3. 内置「案例图片下载器」（v1.35.0 起，纯 Node 实现，无需 Python）：
 *        GET  /tool/downloader   -> 下载器界面（tools/downloader.html）
 *        GET  /api/tool/search?q=            -> 搜索 gooood.cn
 *        GET  /api/tool/project?url=         -> 解析任意网页提取大图
 *        POST /api/tool/download             -> 启动批量下载任务（存到服务器）
 *        GET  /api/tool/job?id=              -> 查询任务进度
 *        POST /api/tool/cancel               -> 取消任务
 *        GET  /api/tool/dl-img?url=          -> 单图中转下载（存到我的电脑）
 *
 * 运行： node server.js            （默认 0.0.0.0:8080，全网可访问）
 *        PORT=9000 node server.js  （自定义端口）
 *        HOST=127.0.0.1 node server.js  （仅本机，放到 nginx 反向代理之后时常用）
 *
 * 接口路径兼容两种部署：
 *   - 域名根部署（推荐，如 https://design.oval.com/）：接口即 /api/feedback；
 *   - 反向代理子路径部署（如 https://portal.com/apps/design/）：接口自动识别为
 *     /apps/design/api/feedback（前端按页面路径推导，后端按路径后缀匹配）。
 *
 * 外网访问三种方式（任选）：
 *   ① 公司服务器有公网 IP + 域名：在路由器/防火墙放行端口，或直接用 nginx 反代 + HTTPS；
 *   ② 不想动路由器：用 cloudflared 隧道（见 启动外网隧道.bat）一键拿到 https 外网地址；
 *   ③ 纯内网分享：同事用 http://<本机内网IP>:8080 访问即可。
 *
 * 注意：若直接用浏览器打开 index.html（file://）或用其它不带本接口的
 *       静态服务器访问，「意见」会自动降级为浏览器本地存储（仅本机可见）。
 * ------------------------------------------------------------
 */
const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const downloader = require("./tools/downloader.js");

// ---------- 加载本地 .env（零依赖，仅本机/服务器本地用；不读则依赖真实环境变量） ----------
// 用途：把敏感密钥（如高德地图 AMAP_API_KEY）放在 .env 中，避免硬编码进源码 / 提交到仓库。
// 注意：.env 必须加入 .gitignore，切勿提交。生产部署（Netlify 等）改用平台环境变量。
(function loadDotEnv() {
  try {
    const envPath = path.join(__dirname, ".env");
    if (!fs.existsSync(envPath)) return;
    const txt = fs.readFileSync(envPath, "utf8");
    txt.split(/\r?\n/).forEach((line) => {
      const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (!m) return;                       // 跳过空行与注释（# 开头）
      if (line.trim().startsWith("#")) return;
      const k = m[1];
      let v = m[2].replace(/^["']|["']$/g, ""); // 去包裹引号
      if (process.env[k] === undefined) process.env[k] = v;
    });
  } catch (e) { /* .env 解析失败不影响启动 */ }
})();

const ROOT = __dirname;
const FEEDBACK_FILE = path.join(ROOT, "data", "feedback.json");
const PORT = parseInt(process.env.PORT, 10) || 8080;
const HOST = process.env.HOST || "0.0.0.0";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".map": "application/json; charset=utf-8",
  ".bat": "text/plain; charset=utf-8",
  ".exe": "application/octet-stream",
};

function genId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}
function cleanStr(s, max) {
  return String(s == null ? "" : s).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").slice(0, max);
}

// ---------- 反馈：记录发表者 IP 与网络属地（v1.39.0） ----------
function getClientIp(req) {
  const h = req.headers || {};
  const xff = h["x-forwarded-for"];
  if (xff) { const first = String(xff).split(",")[0].trim(); if (first) return first; }
  if (h["x-real-ip"]) return String(h["x-real-ip"]).trim();
  return (req.socket && req.socket.remoteAddress) || "";
}
function isPrivateIp(ip) {
  if (!ip) return true;
  const v = String(ip).replace(/^::ffff:/, "").split(":")[0];
  if (v === "127.0.0.1" || v === "::1" || v === "localhost") return true;
  if (v.startsWith("10.")) return true;
  if (v.startsWith("192.168.")) return true;
  if (v.startsWith("169.254.")) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(v)) return true;
  return false;
}
// 单次对外网络定位，超时/失败即放弃（绝不影响发帖），返回 "国家 省 市" 或 null
function geoFetch(url, pick) {
  return new Promise((resolve) => {
    let done = false;
    const finish = (v) => { if (!done) { done = true; resolve(v); } };
    const mod = url.startsWith("https") ? https : http;
    const r = mod.get(url, (resp) => {
      if (resp.statusCode && resp.statusCode >= 300) { finish(null); return; }
      let buf = "";
      resp.on("data", (c) => { buf += c; if (buf.length > 20000) r.destroy(); });
      resp.on("end", () => {
        try {
          const j = JSON.parse(buf);
          if (!j || j.error || j.message) { finish(null); return; }
          const parts = pick(j).filter((x) => x && String(x).trim());
          finish(parts.length ? parts.join(" ") : null);
        } catch (e) { finish(null); }
      });
    });
    r.on("error", () => finish(null));
    r.setTimeout(1500, () => { r.destroy(); finish(null); });
  });
}
// 尽力而为的属地解析：内网 IP 直接返回 null；公网 IP 依次尝试多个服务，任一成功即返回
async function resolveRegion(ip) {
  if (!ip || isPrivateIp(ip)) return null;
  const enc = encodeURIComponent(ip);
  const providers = [
    { url: "https://ipapi.co/" + enc + "/json/?lang=zh", pick: (j) => [j.country_name, j.region, j.city] },
    { url: "http://ip-api.com/json/" + enc + "?fields=country,regionName,city&lang=zh-CN", pick: (j) => [j.country, j.regionName, j.city] },
  ];
  for (const p of providers) {
    const r = await geoFetch(p.url, p.pick);
    if (r) return r;
  }
  return null;
}

// ---------- 反馈数据读写（串行化，避免并发写冲突） ----------
let writeChain = Promise.resolve();
function withWrite(fn) {
  writeChain = writeChain.then(fn, fn);
  return writeChain;
}
function readFeedback() {
  try {
    const raw = fs.readFileSync(FEEDBACK_FILE, "utf8");
    const j = JSON.parse(raw);
    if (j && Array.isArray(j.posts)) return j;
  } catch (e) { /* 文件不存在或损坏 → 返回空 */ }
  return { posts: [] };
}
function writeFeedbackSync(data) {
  fs.mkdirSync(path.dirname(FEEDBACK_FILE), { recursive: true });
  fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(data, null, 2), "utf8");
}
function deleteFeedback(id, reply) {
  if (!id) return false;
  const data = readFeedback();
  if (reply) {
    const post = data.posts.find((p) => p.id === id);
    if (!post || !post.replies) return false;
    const before = post.replies.length;
    post.replies = post.replies.filter((r) => r.id !== reply);
    if (post.replies.length === before) return false;
    writeFeedbackSync(data);
    return true;
  } else {
    const before = data.posts.length;
    data.posts = data.posts.filter((p) => p.id !== id);
    if (data.posts.length === before) return false;
    writeFeedbackSync(data);
    return true;
  }
}

// ---------- HTTP 辅助 ----------
function sendJSON(res, code, obj, cors) {
  const headers = { "Content-Type": "application/json; charset=utf-8" };
  if (cors) {
    headers["Access-Control-Allow-Origin"] = "*";
    headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS";
    headers["Access-Control-Allow-Headers"] = "Content-Type";
  }
  res.writeHead(code, headers);
  res.end(JSON.stringify(obj));
}
function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (c) => {
      size += c.length;
      if (size > limit) { reject(new Error("PAYLOAD_TOO_LARGE")); req.destroy(); return; }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

// ---------- 静态文件托管 ----------
function serveStatic(req, res, urlPath) {
  let rel = decodeURIComponent(urlPath.split("?")[0]);
  if (rel === "/" || rel === "") rel = "/index.html";
  // 防目录穿越：解析后必须仍在 ROOT 内
  const filePath = path.normalize(path.join(ROOT, rel));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403); res.end("Forbidden"); return;
  }
  fs.stat(filePath, (err, st) => {
    if (err || !st.isFile()) {
      // SPA 兜底：未知路径回退到 index.html（不影响 /api）
      const idx = path.join(ROOT, "index.html");
      fs.readFile(idx, (e2, buf) => {
        if (e2) { res.writeHead(404); res.end("Not Found"); return; }
        res.writeHead(200, { "Content-Type": MIME[".html"] });
        res.end(buf);
      });
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    fs.readFile(filePath, (e3, buf) => {
      if (e3) { res.writeHead(500); res.end("Server Error"); return; }
      res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
      res.end(buf);
    });
  });
}

// ---------- 高德地图 API 代理（v1.40.0 起内置，同源 /api/amap） ----------
// 读取服务器环境变量 AMAP_API_KEY；前端亦支持用浏览器本地密钥直连高德（JSONP），二者任一可用即可。
const AMAP_KEY = process.env.AMAP_API_KEY || "";
const AMAP_BASE = {
  geo: "https://restapi.amap.com/v3/geocode/geo",
  regeo: "https://restapi.amap.com/v3/geocode/regeo",
  weather: "https://restapi.amap.com/v3/weather/weatherInfo",
  search: "https://restapi.amap.com/v3/place/text",
  around: "https://restapi.amap.com/v3/place/around",
  route: "https://restapi.amap.com/v3/direction",
  distance: "https://restapi.amap.com/v3/distance",
  static: "https://restapi.amap.com/v3/staticmap",
};
function amapEndpoint(cmd, params) {
  if (cmd === "route") {
    const m = params.get("mode");
    const sub = m === "walking" ? "walking" : m === "cycling" ? "bicycling" : m === "transit" ? "transit/integrated" : "driving";
    return AMAP_BASE.route + "/" + sub;
  }
  return AMAP_BASE[cmd] || AMAP_BASE.geo;
}
function amapBuildUrl(cmd, params, key) {
  const ep = amapEndpoint(cmd, params);
  const q = new URLSearchParams();
  const pass = ["address", "city", "location", "keywords", "radius", "origin", "origins", "destination", "type", "extensions", "zoom", "size", "markers", "offset", "page", "policy"];
  pass.forEach(k => { const v = params.get(k); if (v !== null && v !== "") q.set(k, v); });
  q.set("key", key);
  if (cmd !== "static") q.set("output", "JSON");
  return ep + "?" + q.toString();
}
function handleAmap(req, res, u) {
  const cmd = u.searchParams.get("cmd") || "geo";
  if (!AMAP_KEY) {
    if (cmd === "static") { res.writeHead(204); res.end(); return; }
    sendJSON(res, 200, { status: "0", info: "NO_KEY", amap_proxy: "no_key" });
    return;
  }
  const url = amapBuildUrl(cmd, u.searchParams, AMAP_KEY);
  const r = https.get(url, resp => {
    if (cmd === "static") {
      if (resp.statusCode !== 200) { res.writeHead(resp.statusCode || 502); res.end(); return; }
      res.writeHead(200, { "Content-Type": resp.headers["content-type"] || "image/png", "Cache-Control": "public, max-age=3600" });
      resp.pipe(res);
      return;
    }
    let buf = "";
    resp.setEncoding("utf8");
    resp.on("data", d => { buf += d; });
    resp.on("end", () => {
      try { sendJSON(res, 200, JSON.parse(buf)); }
      catch (e) { sendJSON(res, 502, { error: "bad_json", raw: buf.slice(0, 500) }); }
    });
  });
  r.on("error", e => { sendJSON(res, 502, { error: String(e) }); });
  r.setTimeout(12000, () => { r.destroy(new Error("amap_timeout")); });
}

// ---------- 请求处理 ----------
const server = http.createServer((req, res) => {
  const urlPath = req.url || "/";
  const u = new URL(req.url, "http://localhost");
  const apiPath = urlPath.split("?")[0];
  // 接口按路径「后缀」匹配，兼容域名根部署与反向代理子路径部署
  const isFeedbackApi = apiPath.endsWith("/api/feedback");

  // ---------- 案例图片下载器（v1.35.0 起内置，同源 /api/tool/*） ----------
  if (apiPath.endsWith("/tool/downloader") && (req.method === "GET" || req.method === "HEAD")) {
    // 下载器界面页：直接读 tools/downloader.html 返回（不用 302，兼容反代子路径部署）
    fs.readFile(path.join(ROOT, "tools", "downloader.html"), (e, buf) => {
      if (e) { res.writeHead(404); res.end("Not Found"); return; }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(buf);
    });
    return;
  }

  if (apiPath.endsWith("/api/tool/search") && req.method === "GET") {
    const q = u.searchParams.get("q") || "";
    downloader.search(q).then(r => sendJSON(res, 200, r));
    return;
  }

  if (apiPath.endsWith("/api/tool/project") && req.method === "GET") {
    const target = u.searchParams.get("url") || "";
    downloader.getProject(target).then(r => sendJSON(res, 200, r));
    return;
  }

  if (apiPath.endsWith("/api/tool/download") && req.method === "POST") {
    readBody(req, 512 * 1024).then(raw => {
      let body;
      try { body = JSON.parse(raw); } catch { sendJSON(res, 400, { error: "bad_json" }); return; }
      sendJSON(res, 200, downloader.startJob({
        url: String(body.url || ""),
        title: String(body.title || ""),
        save_dir: String(body.save_dir || ""),
        images: Array.isArray(body.images) ? body.images.map(String) : [],
      }));
    }).catch(() => sendJSON(res, 400, { error: "bad_request" }));
    return;
  }

  if (apiPath.endsWith("/api/tool/job") && req.method === "GET") {
    sendJSON(res, 200, downloader.getJob(u.searchParams.get("id") || ""));
    return;
  }

  if (apiPath.endsWith("/api/tool/cancel") && req.method === "POST") {
    readBody(req, 8 * 1024).then(raw => {
      let id = "";
      try { const b = JSON.parse(raw) || {}; id = String(b.id || b.job_id || ""); } catch { /* ignore */ }
      sendJSON(res, 200, downloader.cancelJob(id));
    }).catch(() => sendJSON(res, 400, { error: "bad_request" }));
    return;
  }

  // "存到我的电脑"：服务端中转图片二进制，浏览器直接保存
  if (apiPath.endsWith("/api/tool/dl-img") && req.method === "GET") {
    const imgUrl = u.searchParams.get("url") || "";
    downloader.streamImage(imgUrl, res).then(r => {
      if (r.code === 200) {
        res.writeHead(200, {
          "Content-Type": r.mime,
          "Content-Length": r.data.length,
          "Content-Disposition": 'attachment; filename="' + encodeURIComponent(r.name) + '"',
          "Cache-Control": "no-store",
        });
        res.end(r.data);
      } else {
        sendJSON(res, r.code || 502, { error: r.error });
      }
    }).catch(() => sendJSON(res, 502, { error: "download_failed" }));
    return;
  }

  // 后端探测：下载器页面据此判断运行模式（服务端 / 无后端）
  if (apiPath.endsWith("/api/tool/ping") && req.method === "GET") {
    sendJSON(res, 200, { mode: "server" });
    return;
  }

  // 预览图代理：同站内联返回远程图片，绕过防盗链/跨域，保证界面能显示
  if (apiPath.endsWith("/api/tool/img") && req.method === "GET") {
    const imgUrl = u.searchParams.get("url") || "";
    downloader.proxyImage(imgUrl).then(r => {
      if (r.code === 200) {
        res.writeHead(200, { "Content-Type": r.mime, "Cache-Control": "public, max-age=3600" });
        res.end(r.data);
      } else {
        sendJSON(res, r.code || 502, { error: r.error });
      }
    }).catch(() => sendJSON(res, 502, { error: "image_failed" }));
    return;
  }

  // ---------- 高德地图 API 代理（v1.40.0 起内置，同源 /api/amap） ----------
  if (apiPath.endsWith("/api/amap") && req.method === "GET") {
    handleAmap(req, res, u);
    return;
  }

  // API：preflight
  if (req.method === "OPTIONS" && isFeedbackApi) {
    sendJSON(res, 204, {}, true);
    return;
  }

  // API：反馈接口
  if (isFeedbackApi) {
    if (req.method === "GET") {
      const data = withWrite(() => readFeedback());
      data.then((d) => sendJSON(res, 200, { posts: d.posts }, true)).catch(() => sendJSON(res, 500, { error: "read_failed" }, true));
      return;
    }
    if (req.method === "DELETE") {
      const u = new URL(req.url, "http://localhost");
      const id = u.searchParams.get("id");
      const reply = u.searchParams.get("reply");
      withWrite(() => deleteFeedback(id, reply))
        .then((ok) => sendJSON(res, ok ? 200 : 404, { ok }, true))
        .catch(() => sendJSON(res, 500, { error: "delete_failed" }, true));
      return;
    }
    if (req.method === "POST") {
      readBody(req, 64 * 1024).then(async (raw) => {
        let body;
        try { body = JSON.parse(raw); } catch (e) { sendJSON(res, 400, { error: "bad_json" }, true); return; }
        // 删除（兜底：部分环境不支持 DELETE 方法时可用）
        if (body && body.action === "delete") {
          withWrite(() => deleteFeedback(body.id, body.reply))
            .then((ok) => sendJSON(res, ok ? 200 : 404, { ok }, true))
            .catch(() => sendJSON(res, 500, { error: "delete_failed" }, true));
          return;
        }
        const author = cleanStr(body.author, 24);
        const text = cleanStr(body.text, 2000);
        const parent = cleanStr(body.parent, 40);
        if (!text) { sendJSON(res, 400, { error: "empty_text" }, true); return; }
        // 记录发表者 IP 与网络属地（尽力而为，失败不影响发帖）
        const clientIp = getClientIp(req);
        let region = null;
        try { region = await resolveRegion(clientIp); } catch (e) { /* 忽略定位失败 */ }
        const created = withWrite(() => {
          const data = readFeedback();
          if (parent) {
            const post = data.posts.find((p) => p.id === parent);
            if (!post) { return { _error: "parent_not_found" }; }
            post.replies = post.replies || [];
            const r = { id: genId(), author, text, ts: Date.now(), ip: clientIp, region };
            post.replies.push(r);
            writeFeedbackSync(data);
            return { reply: r };
          } else {
            const p = { id: genId(), author, text, ts: Date.now(), replies: [], ip: clientIp, region };
            data.posts.push(p);
            writeFeedbackSync(data);
            return { post: p };
          }
        });
        created.then((r) => {
          if (r && r._error) { sendJSON(res, 404, { error: r._error }, true); return; }
          sendJSON(res, 200, r, true);
        }).catch(() => sendJSON(res, 500, { error: "write_failed" }, true));
      }).catch((e) => {
        sendJSON(res, e.message === "PAYLOAD_TOO_LARGE" ? 413 : 400, { error: "bad_request" }, true);
      });
      return;
    }
    sendJSON(res, 405, { error: "method_not_allowed" }, true);
    return;
  }

  // 静态资源
  if (req.method === "GET" || req.method === "HEAD") {
    serveStatic(req, res, urlPath);
    return;
  }
  res.writeHead(405); res.end("Method Not Allowed");
});

server.listen(PORT, HOST, () => {
  const shown = HOST === "0.0.0.0" ? "(全部网卡 / 内网 + 外网均可访问)" : HOST;
  console.log("商业街设计指导系统已启动：");
  console.log("  本机访问  http://localhost:" + PORT);
  console.log("  同事/外网  http://" + shown + ":" + PORT + "  （外网需路由器/防火墙放行端口，或走反向代理 / cloudflared 隧道）");
  console.log("  意见数据  " + path.relative(ROOT, FEEDBACK_FILE));
  console.log("  图片下载器已内置  http://localhost:" + PORT + "/tool/downloader  （纯 Node，无需 Python，同事访问同一地址即可使用）");
});
