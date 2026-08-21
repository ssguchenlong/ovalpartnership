"use strict";
/*
 * Netlify Function：意见反馈共享后端（v1.36.2）
 * ============================================================
 * 让「意见」在 Netlify（Git 连接 / `netlify deploy --prod`）上也能共享——
 * 同事发的意见互相可见，消除「本地模式·仅本机保存」提示。
 *
 * 存储：优先用 Netlify Blobs（serverless KV，持久化、跨调用共享）；
 *       若运行环境没有 @netlify/blobs（例如纯本地调试），降级为 /tmp 文件（非共享，仅防崩）。
 *
 * 路由（netlify.toml 将 /api/feedback 重写到此函数）：
 *   GET    /api/feedback        -> {posts:[...]}
 *   POST   /api/feedback        -> 新增意见/回复 {post} 或 {reply}（body.action==="delete" 时为删除兜底）
 *   DELETE /api/feedback?id=&reply= -> {ok:true}
 *   OPTIONS /api/feedback       -> 200 预检
 */

// 惰性引入 Blobs（本地无该包时不影响加载）
let store = null;
try {
  const blobs = require("@netlify/blobs");
  const getStore = blobs.getStore || (blobs.default && blobs.default.getStore);
  if (typeof getStore === "function") store = getStore("ctc_feedback");
} catch (e) {
  store = null;
}

const fs = require("fs");
const os = require("os");
const FALLBACK_FILE = (process.env.NETLIFY_BLOBS || process.env.AWS_LAMBDA_FUNCTION_NAME)
  ? "/tmp/ctc_feedback.json"
  : (os.tmpdir() + "/ctc_feedback.json");

function genId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}
function cleanStr(s, n) {
  s = String(s == null ? "" : s).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").trim();
  if (s.length > n) s = s.slice(0, n);
  return s;
}

// ---------- 反馈：记录发表者 IP 与网络属地（v1.39.0） ----------
function getClientIp(event) {
  const h = event.headers || {};
  const xff = h["x-forwarded-for"] || h["x-nf-client-connection-ip"];
  if (xff) { const first = String(xff).split(",")[0].trim(); if (first) return first; }
  if (h["x-real-ip"]) return String(h["x-real-ip"]).trim();
  return "";
}
// 尽力而为的属地解析：内网 IP 返回 null；公网 IP 依次尝试服务，超时/失败不阻断发帖
async function resolveRegion(ip) {
  if (!ip) return null;
  const v = String(ip).replace(/^::ffff:/, "").split(":")[0];
  if (/^(127\.|10\.|192\.168\.|169\.254\.)/.test(v) || /^172\.(1[6-9]|2\d|3[01])\./.test(v) || v === "::1") return null;
  const enc = encodeURIComponent(ip);
  const providers = [
    { url: "https://ipapi.co/" + enc + "/json/?lang=zh", pick: (j) => [j.country_name, j.region, j.city] },
    { url: "http://ip-api.com/json/" + enc + "?fields=country,regionName,city&lang=zh-CN", pick: (j) => [j.country, j.regionName, j.city] },
  ];
  for (const p of providers) {
    try {
      const ctrl = new AbortController();
      const to = setTimeout(() => ctrl.abort(), 1500);
      const r = await fetch(p.url, { signal: ctrl.signal });
      clearTimeout(to);
      if (!r.ok) continue;
      const j = await r.json();
      if (!j || j.error || j.message) continue;
      const parts = p.pick(j).filter((x) => x && String(x).trim());
      if (parts.length) return parts.join(" ");
    } catch (e) { /* 忽略，试下一个 */ }
  }
  return null;
}

async function loadPosts() {
  if (store) {
    try {
      const v = await store.getJSON("posts", { defaultValue: [] });
      return Array.isArray(v) ? v : [];
    } catch (e) { /* fall through */ }
  }
  try {
    return JSON.parse(fs.readFileSync(FALLBACK_FILE, "utf8")) || [];
  } catch (e) {
    return [];
  }
}

async function savePosts(posts) {
  if (store) {
    try { await store.setJSON("posts", posts); return true; } catch (e) { /* fall through */ }
  }
  try { fs.writeFileSync(FALLBACK_FILE, JSON.stringify(posts)); return true; } catch (e) { return false; }
}

function delFeedback(posts, id, reply) {
  if (reply) {
    const post = posts.find((p) => p.id === id);
    if (post && post.replies) post.replies = post.replies.filter((r) => r.id !== reply);
  } else {
    const i = posts.findIndex((p) => p.id === id);
    if (i >= 0) posts.splice(i, 1);
  }
  return posts;
}

function json(statusCode, obj, extra) {
  return {
    statusCode,
    headers: Object.assign({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "no-store",
    }, extra || {}),
    body: JSON.stringify(obj),
  };
}

exports.handler = async (event) => {
  try {
    const method = (event.httpMethod || "GET").toUpperCase();
    const q = event.queryStringParameters || {};

    if (method === "OPTIONS") {
      return { statusCode: 204, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS", "Access-Control-Allow-Headers": "Content-Type" }, body: "" };
    }

    if (method === "GET") {
      const posts = await loadPosts();
      return json(200, { posts });
    }

    if (method === "DELETE") {
      let posts = await loadPosts();
      posts = delFeedback(posts, q.id, q.reply);
      await savePosts(posts);
      return json(200, { ok: true });
    }

    if (method === "POST") {
      let body;
      try { body = JSON.parse(event.body || "{}"); } catch (e) { return json(400, { error: "bad_json" }); }
      const author = cleanStr(body.author, 24);
      const text = cleanStr(body.text, 2000);
      const parent = cleanStr(body.parent, 40);

      if (body && body.action === "delete") {
        let posts = await loadPosts();
        posts = delFeedback(posts, body.id, body.reply);
        await savePosts(posts);
        return json(200, { ok: true });
      }

      if (!text) return json(400, { error: "empty_text" });

      const clientIp = getClientIp(event);
      let region = null;
      try { region = await resolveRegion(clientIp); } catch (e) { /* 忽略定位失败 */ }

      let posts = await loadPosts();
      if (parent) {
        const post = posts.find((p) => p.id === parent);
        if (!post) return json(404, { error: "parent_not_found" });
        post.replies = post.replies || [];
        const r = { id: genId(), author, text, ts: Date.now(), ip: clientIp, region };
        post.replies.push(r);
        await savePosts(posts);
        return json(200, { reply: r });
      } else {
        const p = { id: genId(), author, text, ts: Date.now(), replies: [], ip: clientIp, region };
        posts.push(p);
        await savePosts(posts);
        return json(200, { post: p });
      }
    }

    return json(405, { error: "method_not_allowed" });
  } catch (e) {
    return json(500, { error: e.message || "internal_error" });
  }
};
