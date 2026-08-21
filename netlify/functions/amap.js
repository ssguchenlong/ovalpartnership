"use strict";
/*
 * Netlify Function：高德地图 API 代理（v1.39.4）
 * ============================================================
 * 让「高德地图」子工具在 Netlify（Git 连接 / `netlify deploy --prod`）上也能用——
 * 浏览器未填本地 Key 时，自动经此函数转发到高德；Key 仅存在于服务器环境变量，
 * 永不暴露在浏览器、前端源码或 Git 仓库中（满足「默认内置、不对公众展示」）。
 *
 * 路由（netlify.toml 将 /api/amap 重写到此函数，查询参数原样透传）：
 *   GET /api/amap?cmd=geo|regeo|weather|search|around|route|distance|static&...
 *   OPTIONS /api/amap -> 200 预检
 *
 * 安全：AMAP_API_KEY 来自 Netlify 后台「Environment variables」，
 *       切勿写进 netlify.toml 或任何源码（会随公开仓库泄漏）。
 */

// 读取服务器环境变量中的高德 Key（生产环境在 Netlify 后台设置）
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
    const m = params.get ? params.get("mode") : (params.mode || "");
    const sub = m === "walking" ? "walking" : m === "cycling" ? "bicycling" : "driving";
    return AMAP_BASE.route + "/" + sub;
  }
  return AMAP_BASE[cmd] || AMAP_BASE.geo;
}

function amapBuildUrl(cmd, params, key) {
  const ep = amapEndpoint(cmd, params);
  const q = new URLSearchParams();
  // 透传前端可能用到的参数；缺失/空值跳过
  const pass = ["address", "city", "location", "keywords", "radius", "origins",
    "destination", "type", "extensions", "zoom", "size", "markers", "offset",
    "page", "policy", "mode", "origin"];
  pass.forEach((k) => {
    const v = params.get ? params.get(k) : (params[k] || "");
    if (v !== null && v !== "") q.set(k, v);
  });
  q.set("key", key);
  if (cmd !== "static") q.set("output", "JSON");
  return ep + "?" + q.toString();
}

function json(statusCode, obj) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(obj),
  };
}

exports.handler = async (event) => {
  const method = (event.httpMethod || "GET").toUpperCase();

  if (method === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "",
    };
  }

  const q = event.queryStringParameters || {};
  const cmd = q.cmd || "geo";

  // 未配置服务器 Key：静态图返回空，其余返回 no_key（前端据此提示，不暴露 Key）
  if (!AMAP_KEY) {
    if (cmd === "static") return { statusCode: 204, body: "" };
    return json(200, { status: "0", info: "NO_KEY", amap_proxy: "no_key" });
  }

  const params = new URLSearchParams(q);
  const url = amapBuildUrl(cmd, params, AMAP_KEY);

  try {
    const ctrl = new AbortController();
    const to = setTimeout(() => ctrl.abort(), 12000);
    const resp = await fetch(url, { signal: ctrl.signal });
    clearTimeout(to);

    if (cmd === "static") {
      if (resp.status !== 200) return { statusCode: resp.status || 502, body: "" };
      const buf = Buffer.from(await resp.arrayBuffer());
      return {
        statusCode: 200,
        isBase64Encoded: true,
        headers: {
          "Content-Type": resp.headers.get("content-type") || "image/png",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=3600",
        },
        body: buf.toString("base64"),
      };
    }

    const text = await resp.text();
    try {
      return json(200, JSON.parse(text));
    } catch (e) {
      return json(502, { error: "bad_json", raw: text.slice(0, 500) });
    }
  } catch (e) {
    return json(502, { error: String(e) });
  }
};
