"use strict";
/*
 * Netlify Function：案例图片下载器后端（v1.36.0）
 * ============================================================
 * 与 tools/downloader.js 共用同一套抓取/解析逻辑（零外部依赖，仅 Node 内置模块）。
 * 部署到 Netlify（connect Git 仓库 / `netlify deploy --prod`）后，本函数让「图片下载器」
 * 在静态托管上也能完整运行（服务端抓取绕开浏览器 CORS 与站点反爬）。
 *
 * 路由（由 netlify.toml 将 /api/tool/* 重写到此函数）：
 *   GET  /api/tool/ping       -> {mode:"function"}
 *   GET  /api/tool/search?q=  -> {results:[...]}
 *   GET  /api/tool/project?url= -> {title,images,image_count,...}
 *   GET  /api/tool/img?url=    -> 图片二进制（预览代理）
 *   GET  /api/tool/dl-img?url= -> 图片二进制（存到我的电脑）
 *   POST /api/tool/download    -> 批量下载到服务器（无状态函数不支持落盘，返回指引）
 *   GET  /api/tool/job?id=     -> 任务状态（函数模式无后台任务）
 *   POST /api/tool/cancel      -> 取消（函数模式无后台任务）
 */
// 关键：用静态字面量 require，确保 Netlify 函数打包器能追踪并包含该文件。
// （动态 require(path.join(...)) 在 Netlify 打包时无法被静态分析，会导致运行时找不到模块）
const downloader = require("../../tools/downloader.js");

function json(statusCode, obj) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(obj),
  };
}

function bin(mime, buf, name) {
  const headers = {
    "Content-Type": mime,
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-store",
  };
  if (name) headers["Content-Disposition"] = 'attachment; filename="' + encodeURIComponent(name) + '"';
  return {
    statusCode: 200,
    headers,
    body: buf.toString("base64"),
    isBase64Encoded: true,
  };
}

exports.handler = async (event) => {
  try {
    const seg = (event.pathParameters && event.pathParameters.splat) || "";
    const method = (event.httpMethod || "GET").toUpperCase();
    const q = event.queryStringParameters || {};

    if (seg === "ping" && method === "GET") return json(200, { mode: "function" });

    if (seg === "search" && method === "GET") {
      const d = await downloader.search(q.q || "");
      return json(200, d);
    }

    if (seg === "project" && method === "GET") {
      const d = await downloader.getProject(q.url || "");
      return json(200, d);
    }

    if (seg === "img" && method === "GET") {
      const r = await downloader.proxyImage(q.url || "");
      if (r.code === 200) return bin(r.mime, r.data);
      return json(r.code || 502, { error: r.error });
    }

    if (seg === "dl-img" && method === "GET") {
      const r = await downloader.streamImage(q.url || "");
      if (r.code === 200) return bin(r.mime, r.data, r.name);
      return json(r.code || 502, { error: r.error });
    }

    // 无状态函数不支持「存到服务器」批量落盘与后台任务轮询
    if (seg === "download" && method === "POST") {
      return json(200, { error: "此平台为无状态函数，不支持「存到服务器」批量落盘；请使用「存到我的电脑」。" });
    }
    if (seg === "job" && method === "GET") return json(200, { status: "done", total: 0, done: 0 });
    if (seg === "cancel" && method === "POST") return json(200, { ok: true });

    return json(404, { error: "not_found" });
  } catch (e) {
    return json(500, { error: e.message || "internal_error" });
  }
};
