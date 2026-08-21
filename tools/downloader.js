#!/usr/bin/env node
/*
 * 案例图片下载器 —— 纯 Node.js 后端模块（v1.35.0）
 * ============================================================
 * 从原 gooood_grabber.py 移植，零外部依赖（仅 Node 内置模块）。
 * 由 server.js require() 后挂载到 /api/tool/* 路由。
 *
 * 功能：
 *   1. 搜索 gooood.cn 案例项目
 *   2. 解析任意网页（gooood 文章页 / ArchDaily / 开发商页面等）提取大图
 *   3. "存到我的电脑"：图片经服务端中转后由浏览器直接保存
 *   4. "下载到服务器"：后台批量下载，按项目分类存放
 *
 * 核心设计：
 *   - 同源（与主应用共用 8080 端口），无需额外进程 / 端口
 *   - 无 Python 依赖，部署到公司服务器只需 Node.js
 *   - 所有同事访问同一 URL 即可使用
 * ============================================================
 */
"use strict";

const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { URL } = require("url");
const crypto = require("crypto");

// ---- 常量 ----
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
const GOOOD = "https://www.gooood.cn";
const DEFAULT_SAVE_DIR = path.join(os.homedir(), "Downloads", "case-images");
const MAX_RESULTS = 20;
const DL_MIN_INTERVAL = 2000;       // 两次下载最小间隔（ms）
const DL_TIMEOUT = 25000;            // 单张下载超时（ms）
const DL_403_COOLDOWN = 600000;      // 403 冷却 10 分钟
const DL_MAX_ATTEMPTS = 3;
const MIN_DIM = 700;                 // 小图阈值（像素）

const SIZE_SUFFIX = /-\d+x\d+(?=\.(?:jpe?g|png|webp|gif|avif|bmp)$)/i;
const BAD_PATH = /\/(?:jobs?|category|tag|search|about|wp-|feed)\//i;

// ---- 限速器 ----
let _lastReq = 0;
function rateLimit() {
  return new Promise(resolve => {
    const now = Date.now();
    const interval = DL_MIN_INTERVAL * (1 + 0.25 * Math.random());
    const wait = _lastReq + interval - now;
    if (wait > 0) setTimeout(() => { _lastReq = Date.now(); resolve(); }, wait);
    else { _lastReq = Date.now(); resolve(); }
  });
}

// ---- 403 风控状态 ----
let _g403 = { until: 0, strikes: 0 };

// ---- HTTP 抓取 ----
function fetchRaw(url, referer) {
  return new Promise((resolve, reject) => {
    let parsed;
    try { parsed = new URL(url); } catch { return reject(new Error("bad_url")); }
    const lib = parsed.protocol === "http:" ? http : https;
    const options = {
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === "http:" ? 80 : 443),
      path: parsed.pathname + parsed.search,
      method: "GET",
      headers: {
        "User-Agent": UA,
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      },
    };
    if (referer) options.headers["Referer"] = referer;

    const req = lib.request(options, res => {
      // 重定向跟随
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
        const loc = res.headers.location;
        const redirectUrl = loc.startsWith("http") ? loc : new URL(loc, url).href;
        res.resume(); // 释放当前响应
        fetchRaw(redirectUrl, referer).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode === 403) {
        res.resume();
        const err = new Error("HTTP 403");
        err.code = 403;
        reject(err);
        return;
      }
      if (res.statusCode >= 400) {
        res.resume();
        reject(new Error("HTTP " + res.statusCode));
        return;
      }
      const chunks = [];
      res.on("data", c => chunks.push(c));
      res.on("end", () => resolve({ data: Buffer.concat(chunks), statusCode: res.statusCode, headers: res.headers }));
    });
    req.on("error", reject);
    req.setTimeout(DL_TIMEOUT, () => { req.destroy(new Error("timeout")); });
    req.end();
  });
}

async function fetchText(url, referer) {
  const { data } = await fetchRaw(url, referer);
  return data.toString("utf8");
}

// ---- URL 工具 ----
function absUrl(href, base) {
  if (!href) return "";
  if (href.startsWith("//")) return "https:" + href;
  let b = base || GOOOD;
  if (href.startsWith("/")) { if (b.endsWith("/")) b = b.slice(0, -1); return b + href; }
  if (href.startsWith("http://") || href.startsWith("https://")) return href;
  if (!b.endsWith("/")) b = b + "/";
  return b + href;
}

function originalUrl(url) {
  return url.replace(SIZE_SUFFIX, "");
}

function extFromUrl(url, contentType) {
  const p = new URL(url).pathname;
  const m = p.match(/\.(jpe?g|png|webp|gif|avif|bmp)$/i);
  if (m) return "." + m[1].toLowerCase().replace("jpeg", "jpg");
  if (contentType && contentType.includes("png")) return ".png";
  if (contentType && contentType.includes("webp")) return ".webp";
  if (contentType && contentType.includes("gif")) return ".gif";
  return ".jpg";
}

// ---- 图片尺寸检测（从二进制头） ----
function imageDimensions(buf) {
  try {
    // PNG
    if (buf.length > 24 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) {
      const w = buf.readUInt32BE(16);
      const h = buf.readUInt32BE(20);
      if (w > 0 && w < 50000 && h > 0 && h < 50000) return [w, h];
    }
    // GIF
    if (buf.length > 10 && (buf.slice(0, 6).toString("ascii") === "GIF87a" || buf.slice(0, 6).toString("ascii") === "GIF89a")) {
      const w = buf.readUInt16LE(6);
      const h = buf.readUInt16LE(8);
      if (w > 0 && w < 50000 && h > 0 && h < 50000) return [w, h];
    }
    // JPEG
    if (buf.length > 9 && buf[0] === 0xFF && buf[1] === 0xD8) {
      let i = 2;
      while (i + 9 < buf.length) {
        if (buf[i] !== 0xFF) { i++; continue; }
        const marker = buf[i + 1];
        if (marker === 0xD8 || marker === 0x01 || (marker >= 0xD0 && marker <= 0xD7)) { i += 2; continue; }
        const segLen = buf.readUInt16BE(i + 2);
        if (marker >= 0xC0 && marker <= 0xCF && marker !== 0xC4 && marker !== 0xC8 && marker !== 0xCC) {
          const h = buf.readUInt16BE(i + 5);
          const w = buf.readUInt16BE(i + 7);
          if (w > 0 && w < 50000 && h > 0 && h < 50000) return [w, h];
          return null;
        }
        i += 2 + segLen;
      }
    }
  } catch { /* ignore */ }
  return null;
}

// ---- 搜索解析（gooood.cn） ----
function parseSearch(html) {
  const results = [];
  const seen = new Set();
  // 匹配 <article class="result-card">...</article>
  const cardRe = /<article[^>]*class="[^"]*result-card[^"]*"[^>]*>([\s\S]*?)<\/article>/gi;
  let m;
  while ((m = cardRe.exec(html)) && results.length < MAX_RESULTS) {
    const block = m[1];
    const href = (block.match(/<a[^>]*href="([^"]+)"/i) || [])[1] || "";
    const url = absUrl(href.trim());
    if (!url || BAD_PATH.test(url) || seen.has(url)) continue;
    seen.add(url);
    const title = ((block.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i) || [])[1] || "").replace(/<[^>]+>/g, "").trim();
    const subtitle = ((block.match(/<p[^>]*class="[^"]*result-subtitle[^"]*"[^>]*>([\s\S]*?)<\/p>/i) || [])[1] || "").replace(/<[^>]+>/g, "").trim();
    const meta = ((block.match(/<p[^>]*class="[^"]*card-meta[^"]*"[^>]*>([\s\S]*?)<\/p>/i) || [])[1] || "").replace(/<[^>]+>/g, "").trim();
    let thumb = (block.match(/<img[^>]*(?:data-src|src)="([^"]+)"/i) || [])[1] || "";
    thumb = absUrl(thumb.trim());
    results.push({ title, subtitle, meta, thumb, url });
  }
  return results;
}

async function searchGooood(query) {
  const url = GOOOD + "/search?q=" + encodeURIComponent(query);
  const html = await fetchText(url);
  if (!html.includes("result-card")) {
    if (html.includes("验证") || html.toLowerCase().includes("captcha")) {
      throw new Error("谷德网要求验证（可能请求过于频繁），请稍后再试");
    }
    throw new Error("未找到任何结果，请尝试更换关键词");
  }
  return parseSearch(html);
}

// ---- 文章页解析（gooood + 通用） ----
function cleanTitle(raw) {
  let t = (raw || "").trim();
  t = t.replace(/\s*[|\-–—·]\s*谷德设计网.*$/i, "");
  t = t.replace(/\s*[|\-–—]\s*ArchDaily.*$/i, "");
  return t.replace(/\s+/g, " ");
}

// 从 <img> 属性中挑选最佳图片地址（兼容懒加载 / srcset / 多套属性）
function pickImgSrc(attrs) {
  let s = (attrs.match(/(?:data-src|data-original|data-lazy-src|data-lazy)\s*=\s*"([^"]+)"/i) || [])[1];
  if (!s) s = (attrs.match(/(?:data-src|data-original|data-lazy-src|data-lazy)\s*=\s*'([^']+)'/i) || [])[1];
  if (!s && /srcset/i.test(attrs)) {
    const ss = (attrs.match(/(?:srcset|data-srcset)\s*=\s*"([^"]+)"/i) || [])[1] || "";
    s = ss.split(",").map(x => x.trim().split(/\s+/)[0]).filter(Boolean)[0] || "";
  }
  if (!s) s = (attrs.match(/\bsrc\s*=\s*"([^"]+)"/i) || [])[1];
  if (!s) s = (attrs.match(/\bsrc\s*=\s*'([^']+)'/i) || [])[1];
  return s || "";
}

// 从 JSON-LD 中抽取图片 URL
function collectFromJsonLd(html) {
  const out = [];
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    try {
      const obj = JSON.parse(m[1].replace(/<!\[CDATA\[|\]\]>/g, ""));
      const walk = v => {
        if (!v) return;
        if (typeof v === "string") { if (/^https?:\/\//.test(v)) out.push(v); }
        else if (Array.isArray(v)) v.forEach(walk);
        else if (typeof v === "object") {
          ["image", "images", "contentUrl", "url", "thumbnailUrl"].forEach(k => { if (v[k] !== undefined) walk(v[k]); });
        }
      };
      walk(obj);
    } catch { /* ignore */ }
  }
  return out;
}

function parseArticle(html, pageUrl) {
  // 标题
  let title = "";
  let m = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i);
  if (!m) m = html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i);
  if (m) title = cleanTitle(m[1]);
  if (!title) { m = html.match(/<title[^>]*>(.*?)<\/title>/is); if (m) title = cleanTitle(m[1]); }
  if (!title) title = "未命名项目";

  const parsed = new URL(pageUrl);
  const host = parsed.hostname;

  const imgUrls = [];
  const dimsMap = {}; // originalUrl -> [w,h]
  const seen = new Set();

  function maybePush(u, w, h) {
    if (!u || !u.startsWith("http")) return;
    if (seen.has(u)) return;
    // 按站点过滤明显非内容图
    if (u.includes("oss.gooood.cn")) { /* 谷德图床，全部保留 */ }
    else if (host.includes("gooood")) {
      if (!/\.(jpe?g|png|webp|gif)/i.test(u) || /avatar|logo|icon/.test(u)) return;
    }     else {
      if (!/\.(jpe?g|png|webp|gif|avif|bmp|ashx|aspx|php|jsp|do|img)/i.test(u)) return;
      if (/avatar|logo|icon|emoji|spacer|pixel|gravatar|ad-|banner-ad|share|social|facebook|twitter|linkedin|whatsapp|gmail|wechat|doubleclick|tracking|mega-menu/i.test(u)) return;
    }
    seen.add(u);
    imgUrls.push(u);
    if (w > 0 && h > 0) {
      const key = originalUrl(u);
      const old = dimsMap[key];
      if (!old || w * h > old[0] * old[1]) dimsMap[key] = [w, h];
    }
  }

  // 1) <img> 标签
  const imgRe = /<img\s+([^>]*)>/gi;
  let im;
  while ((im = imgRe.exec(html))) {
    const attrs = im[1];
    const src = pickImgSrc(attrs);
    if (!src) continue;
    const abs = absUrl(src.trim(), pageUrl);
    // 尝试从属性获取尺寸
    let w = 0, h = 0;
    const wMatch = attrs.match(/\bwidth\s*=\s*["']?(\d+)/i);
    const hMatch = attrs.match(/\bheight\s*=\s*["']?(\d+)/i);
    if (wMatch) w = parseInt(wMatch[1]) || 0;
    if (hMatch) h = parseInt(hMatch[1]) || 0;
    maybePush(abs, w, h);
  }

  // 2) <picture><source srcset> 响应式图
  const picRe = /<picture[^>]*>([\s\S]*?)<\/picture>/gi;
  let pm;
  while ((pm = picRe.exec(html))) {
    const srcRe = /<source[^>]*(?:srcset|data-srcset)\s*=\s*"([^"]+)"/gi;
    let sm;
    while ((sm = srcRe.exec(pm[1]))) {
      sm[1].split(",").map(x => x.trim().split(/\s+/)[0]).filter(Boolean).forEach(u => maybePush(absUrl(u, pageUrl), 0, 0));
    }
  }

  // 3) JSON-LD 结构化数据中的图片
  collectFromJsonLd(html).forEach(u => maybePush(absUrl(u, pageUrl), 0, 0));

  // 4) 内联 style="background-image:url(...)" 背景图
  const bgRe = /background-image\s*:\s*url\(\s*['"]?([^'"\)]+)['"]?\s*\)/gi;
  let bm;
  while ((bm = bgRe.exec(html))) {
    maybePush(absUrl(bm[1].trim(), pageUrl), 0, 0);
  }

  // 去重 + 还原原图
  const hasVariant = new Set();
  for (const s of imgUrls) {
    if (SIZE_SUFFIX.test(s)) hasVariant.add(originalUrl(s));
  }
  const originals = [];
  const oseen = new Set();
  for (const s of imgUrls) {
    const o = originalUrl(s);
    if (oseen.has(o)) continue;
    oseen.add(o);
    const wh = dimsMap[o];
    const item = { url: o, w: wh ? wh[0] : 0, h: wh ? wh[1] : 0 };
    if (wh && !hasVariant.has(o)) {
      item.exact = true;
      item.small = Math.max(wh[0], wh[1]) < MIN_DIM;
    } else {
      item.exact = false;
      item.small = false;
    }
    originals.push(item);
  }

  return { title, images: originals };
}

async function getProject(url) {
  const html = await fetchText(url, GOOOD);
  const { title, images } = parseArticle(html, url);
  return {
    url,
    title,
    image_count: images.length,
    small_count: images.filter(x => x.small).length,
    images,
    source: host => host.includes("gooood") ? "gooood" : "generic",
  };
}

// ---- 下载任务管理 ----
const JOBS = {};

function sanitizeFolderName(name) {
  let n = (name || "").replace(" / ", " - ").replace(/\//g, "-");
  n = n.replace(/[<>:"\\|?*\x00-\x1f]/g, "");
  n = n.replace(/\s{2,}/g, " ").trim().replace(/[. ]+$/, "");
  if (n.length > 60) n = n.slice(0, 60).trim().replace(/[. ]+$/, "");
  return n || "未命名项目";
}

async function downloadOne(url, destNoExt, job) {
  const candidates = [originalUrl(url)];
  if (originalUrl(url) !== url) candidates.push(url);

  for (const cand of candidates) {
    for (let attempt = 0; attempt < DL_MAX_ATTEMPTS; attempt++) {
      // 403 冷却等待
      while (_g403.until > Date.now()) {
        if (job.cancel) throw new Error("已取消");
        const remaining = _g403.until - Date.now();
        job.waiting = true;
        job.current = "CDN 限流保护中，等待 " + Math.ceil(remaining / 1000) + " 秒后自动继续…";
        await sleep(Math.min(remaining, 5000));
      }
      if (job.cancel) throw new Error("已取消");

      await rateLimit();
      try {
        const { data } = await fetchRaw(cand, GOOOD);
        if (data.length < 200) throw new Error("内容过小");
        _g403.strikes = 0;

        const dims = imageDimensions(data);
        if (dims && Math.max(dims[0], dims[1]) < MIN_DIM) {
          throw { smallImage: true, w: dims[0], h: dims[1] };
        }

        const ext = extFromUrl(cand);
        const fname = destNoExt + ext;
        fs.writeFileSync(fname, data);
        return { name: path.basename(fname), size: data.length };
      } catch (e) {
        if (e.smallImage) throw e;
        if (e.code === 403) {
          _g403.strikes++;
          if (_g403.strikes >= 2) {
            throw { blocked: true, msg: "CDN 持续限流，已中止。建议等待 20-30 分钟后再试。" };
          }
          _g403.until = Date.now() + DL_403_COOLDOWN;
          continue;
        }
        // 其他错误：换地址或重试
        if (attempt >= DL_MAX_ATTEMPTS - 1) throw e;
        await sleep(800 * (attempt + 1));
      }
    }
  }
  throw new Error("下载失败");
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function runDownloadJob(jobId, url, title, saveDir, images) {
  const job = JOBS[jobId];
  const folder = path.join(saveDir, sanitizeFolderName(title));
  try { fs.mkdirSync(folder, { recursive: true }); } catch { /* ignore */ }
  job.folder = folder;
  job.total = images.length;
  job.current = "正在准备…";

  const results = [];
  const t0 = Date.now();

  for (let i = 0; i < images.length; i++) {
    if (job.cancel) {
      results.push({ name: String(i + 1).padStart(3, "0"), ok: false, src: images[i], error: "已取消" });
      continue;
    }
    const fname = String(i + 1).padStart(3, "0");
    try {
      const { name, size } = await downloadOne(images[i], path.join(folder, fname), job);
      job.done = i + 1;
      job.waiting = false;
      job.current = name + "（" + Math.round(size / 1024) + " KB）";
      results.push({ name, size, ok: true, src: images[i] });
    } catch (e) {
      job.done = i + 1;
      job.waiting = false;
      if (e.smallImage) {
        job.current = "小图 " + e.w + "×" + e.h + "，已跳过";
        job.skip_count = (job.skip_count || 0) + 1;
        results.push({ name: fname, ok: false, skipped: true, src: images[i], error: "小图 " + e.w + "×" + e.h });
      } else if (e.blocked) {
        job.cancel = true;
        job.stop_reason = "blocked";
        job.current = e.msg;
        results.push({ name: fname, ok: false, src: images[i], error: e.msg.slice(0, 120) });
      } else {
        job.current = fname + "…失败";
        results.push({ name: fname, ok: false, src: images[i], error: (e.message || "").slice(0, 120) });
      }
    }
  }

  const okCount = results.filter(r => r.ok).length;
  const skipCount = results.filter(r => r.skipped).length;
  const failCount = results.length - okCount - skipCount;

  // 写下载记录
  try {
    const manifest = {
      "项目": title,
      "来源页": url,
      "下载时间": new Date().toLocaleString("zh-CN"),
      "图片数量": results.length,
      "成功": okCount,
      "跳过小图": skipCount,
      "失败": failCount,
      "文件列表": results.filter(r => r.ok).map(r => r.name),
    };
    fs.writeFileSync(path.join(folder, "_下载记录.json"), JSON.stringify(manifest, null, 2), "utf8");
  } catch { /* ignore */ }

  job.status = job.cancel ? (job.stop_reason === "blocked" ? "blocked" : "cancelled") : "done";
  job.done = okCount;
  job.ok_count = okCount;
  job.skip_count = skipCount;
  job.fail_count = failCount;
  job.elapsed = Math.round((Date.now() - t0) / 1000 * 10) / 10;
  job.results = results;
}

// ---- 公开 API ----
module.exports = {
  search: async (query) => {
    if (!query || !query.trim()) return { error: "缺少关键词" };
    try {
      const results = await searchGooood(query.trim());
      return { results };
    } catch (e) {
      return { results: [], error: e.message };
    }
  },

  getProject: async (url) => {
    if (!url || !url.startsWith("http")) return { error: "无效的项目地址" };
    try {
      const html = await fetchText(url, GOOOD);
      const { title, images } = parseArticle(html, url);
      return {
        url,
        title,
        image_count: images.length,
        small_count: images.filter(x => x.small).length,
        images,
        source: new URL(url).hostname.includes("gooood") ? "gooood" : "generic",
      };
    } catch (e) {
      return { error: "获取项目失败：" + e.message };
    }
  },

  startJob: (params) => {
    const { url, title, save_dir, images } = params;
    if (!url || !url.startsWith("http") || !images || !images.length) {
      return { error: "参数不完整" };
    }
    const dir = (save_dir && save_dir.trim()) || DEFAULT_SAVE_DIR;
    try { fs.mkdirSync(path.resolve(dir), { recursive: true }); } catch (e) {
      return { error: "保存路径不可用（" + e.message + "），请重新选择或修改" };
    }
    // 同时只允许一个任务
    for (const id in JOBS) {
      if (JOBS[id].status === "running") {
        return { error: "已有下载任务进行中，请等待完成后再试" };
      }
    }
    const jid = crypto.randomBytes(6).toString("hex");
    JOBS[jid] = {
      status: "running", total: images.length, done: 0, current: "",
      elapsed: null, ok_count: 0, fail_count: 0, skip_count: 0,
      folder: "", results: [], waiting: false, cancel: false,
    };
    runDownloadJob(jid, url, title || "未命名项目", path.resolve(dir), images.filter(u => u.startsWith("http")));
    return { job_id: jid, total: images.length };
  },

  getJob: (jid) => {
    const job = JOBS[jid];
    if (!job) return { error: "任务不存在" };
    const { status, total, done, current, elapsed, ok_count, fail_count, skip_count, folder, results, waiting, stop_reason } = job;
    return { status, total, done, current, elapsed, ok_count, fail_count, skip_count, folder, results, waiting, stop_reason };
  },

  cancelJob: (jid) => {
    const job = JOBS[jid];
    if (job && job.status === "running") {
      job.cancel = true;
      job.current = "正在停止…";
      return { ok: true };
    }
    return { ok: false, error: "任务不存在或已完成" };
  },

  // "存到我的电脑"：流式返回图片二进制
  streamImage: async (url, res) => {
    if (!url || !url.startsWith("http")) {
      return { error: "无效的图片地址", code: 400 };
    }
    if (_g403.until > Date.now()) {
      return { error: "CDN 限流中，请稍后再试", code: 503 };
    }
    await rateLimit();
    try {
      const { data, headers } = await fetchRaw(url, GOOOD);
      if (data.length < 200) return { error: "内容过小，可能不是有效图片", code: 400 };
      _g403.strikes = 0;
      const dims = imageDimensions(data);
      if (dims && Math.max(dims[0], dims[1]) < MIN_DIM) {
        return { error: "小图 " + dims[0] + "×" + dims[1] + "，已跳过", code: 400 };
      }
      const o = originalUrl(url);
      let name = o.split("/").pop().split("?")[0] || "image.jpg";
      if (!name.includes(".")) name += ".jpg";
      const ct = headers["content-type"] || "";
      const ext = extFromUrl(o, ct);
      const mime = ext === ".png" ? "image/png" : ext === ".gif" ? "image/gif" : ext === ".webp" ? "image/webp" : "image/jpeg";
      return { data, name, mime, code: 200 };
    } catch (e) {
      if (e.code === 403) {
        _g403.strikes++;
        if (_g403.strikes >= 2) return { error: "CDN 持续限流，请 20-30 分钟后再试", code: 503 };
        _g403.until = Date.now() + DL_403_COOLDOWN;
        return { error: "CDN 限流中，已进入冷却，请稍后再试", code: 503 };
      }
      return { error: "下载失败：" + (e.message || ""), code: 502 };
    }
  },

  // "预览"：同站内联代理图片（不走下载限速，保证界面能显示远程图片，绕过防盗链/跨域限制）
  proxyImage: async (url) => {
    if (!url || !url.startsWith("http")) return { error: "无效的图片地址", code: 400 };
    if (_g403.until > Date.now()) return { error: "CDN 限流中，请稍后再试", code: 503 };
    try {
      const parsed = new URL(url);
      // 以图片自身站点作为 Referer，规避多数 CDN 的防盗链校验
      const referer = parsed.origin + "/";
      const { data, headers } = await fetchRaw(url, referer);
      if (data.length < 200) return { error: "内容过小，可能不是有效图片", code: 400 };
      const ct = headers["content-type"] || "";
      const ext = extFromUrl(url, ct);
      const mime = ext === ".png" ? "image/png"
        : ext === ".gif" ? "image/gif"
        : ext === ".webp" ? "image/webp"
        : ext === ".avif" ? "image/avif"
        : "image/jpeg";
      return { data, mime, code: 200 };
    } catch (e) {
      if (e.code === 403) {
        _g403.strikes++;
        if (_g403.strikes >= 2) return { error: "CDN 持续限流，请 20-30 分钟后再试", code: 503 };
        _g403.until = Date.now() + DL_403_COOLDOWN;
        return { error: "CDN 限流中，已进入冷却，请稍后再试", code: 503 };
      }
      return { error: "图片获取失败：" + (e.message || ""), code: 502 };
    }
  },

  DEFAULT_SAVE_DIR,
};
