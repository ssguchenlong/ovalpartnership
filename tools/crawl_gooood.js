#!/usr/bin/env node
/*
 * gooood 案例配图爬取批处理（v1）
 * --------------------------------------------------------------------------
 * 遍历 data/cases.js 的所有案例，对每个案例：
 *   1) 用多组关键词在 gooood.cn 搜索（中文名 / 英文名 / 关键 token）
 *   2) 对命中的项目页按「标题相关度」打分，取前 N 个
 *   3) 抓取这些项目页的大图（>=700px 边），聚合去重
 *   4) 写入 data/gooood.candidates.js（CASE_GOOOD_CANDIDATES）
 * 仅处理 gooood 能搜到的案例；搜不到的跳过并记录。
 *
 * 用法：node tools/crawl_gooood.js
 * 产出：data/gooood.candidates.js
 */
"use strict";
const fs = require("fs");
const path = require("path");
const dl = require("./downloader.js");

const ROOT = path.resolve(__dirname, "..");
const CASES_PATH = path.join(ROOT, "data", "cases.js");
const OUT_PATH = path.join(ROOT, "data", "gooood.candidates.js");

// 读取案例列表（轻量 parse：提取 id / name / nameEn）
function readCases() {
  const src = fs.readFileSync(CASES_PATH, "utf8");
  const re = /id:\s*"([^"]+)"[\s\S]*?name:\s*"([^"]+)"[\s\S]*?nameEn:\s*"([^"]+)"/g;
  const out = [];
  let m;
  while ((m = re.exec(src))) {
    out.push({ id: m[1], name: m[2], nameEn: m[3] });
  }
  return out;
}

// 为每个案例构造搜索关键词（多组，逐步放宽）
function buildQueries(c) {
  const q = [];
  q.push(c.name);                       // 全中文名
  if (c.nameEn) q.push(c.nameEn);       // 全英文名
  // 拆分中文名的关键 token（去掉括号/英文/标点，取 2-4 字片段）
  const cn = c.name.replace(/[（(].*?[)）]/g, "").replace(/[A-Za-z0-9\s]/g, "");
  const pieces = cn.split(/[·\s\/]/).filter(Boolean);
  pieces.forEach(p => { if (p.length >= 2) q.push(p); });
  // 英文去停用词片段
  if (c.nameEn) {
    const en = c.nameEn.replace(/\(.*?\)/g, "").replace(/[^A-Za-z\s-]/g, "");
    en.split(/\s+/).filter(w => w.length >= 4 && !/road|street|avenue|district/i.test(w))
      .forEach(w => q.push(w));
  }
  // 去重并保持顺序
  return [...new Set(q)].slice(0, 8);
}

// 标题相关度打分
function scoreTitle(title, c) {
  let s = 0;
  const t = (title || "").toLowerCase();
  const cname = c.name.toLowerCase();
  const ceny = (c.nameEn || "").toLowerCase();
  // 强信号：标题含英文名核心词
  if (c.nameEn) {
    const core = c.nameEn.replace(/\(.*?\)/g, "").replace(/[^A-Za-z\s]/g, "").trim().split(/\s+/)[0];
    if (core && t.includes(core.toLowerCase())) s += 4;
  }
  if (t.includes(cname)) s += 5;
  // token 命中
  const cn = c.name.replace(/[（(].*?[)）]/g, "").replace(/[A-Za-z0-9\s·]/g, "");
  cn.split(/[·\s\/]/).filter(Boolean).forEach(p => { if (p.length >= 2 && t.includes(p.toLowerCase())) s += 2; });
  // 城市名命中（弱）
  return s;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function crawlCase(c) {
  const queries = buildQueries(c);
  const projectSeen = new Set();
  const projects = []; // {url, title, score}
  // 多关键词搜索并聚合命中的项目页
  for (const q of queries) {
    let res;
    try { res = await dl.search(q); }
    catch (e) { res = { results: [], error: e.message }; }
    if (res.error || !res.results || !res.results.length) { await sleep(300); continue; }
    for (const r of res.results) {
      if (!r.url || projectSeen.has(r.url)) continue;
      const sc = scoreTitle(r.title, c);
      if (sc <= 0) continue; // 不相关
      projectSeen.add(r.url);
      projects.push({ url: r.url, title: r.title, score: sc });
    }
    await sleep(400);
  }
  projects.sort((a, b) => b.score - a.score);
  // 取前 6 个最相关项目页抓图
  const top = projects.slice(0, 6);

  const images = [];
  const imgSeen = new Set();
  const CAP = 40; // 每案例候选上限，避免过多
  for (const p of top) {
    let pj;
    try { pj = await dl.getProject(p.url); }
    catch (e) { await sleep(300); continue; }
    // 保留「非已知小图」的全部图片（gooood 全尺寸主图常不带尺寸属性，w=0 仍可能是大图）
    const big = (pj.images || []).filter(im => !im.small);
    for (const im of big) {
      if (imgSeen.has(im.url)) continue;
      imgSeen.add(im.url);
      images.push({
        url: im.url,
        w: im.w, h: im.h,
        from: p.title,
        fromUrl: p.url,
        score: p.score,
      });
      if (images.length >= CAP) break;
    }
    if (images.length >= CAP) break;
    await sleep(400);
  }
  return { projects: top.length, images };
}

(async () => {
  const cases = readCases();
  console.log("案例总数:", cases.length);
  const OUT = {};
  const log = { found: [], missing: [], errors: [] };
  for (let i = 0; i < cases.length; i++) {
    const c = cases[i];
    process.stdout.write(`[${i + 1}/${cases.length}] ${c.name} ... `);
    try {
      const { projects, images } = await crawlCase(c);
      if (images.length) {
        OUT[c.id] = images.map(im => ({
          url: im.url, w: im.w, h: im.h,
          caption: `${c.name} · via gooood`,
          credit: `gooood.cn · ${im.from}`,
          page: im.fromUrl, source: "gooood"
        }));
        log.found.push(`${c.id}(${images.length}图/${projects}页)`);
        console.log(`✓ ${images.length} 图 / ${projects} 项目页`);
      } else {
        log.missing.push(c.id);
        console.log(`× 无匹配`);
      }
    } catch (e) {
      log.errors.push(`${c.id}:${e.message}`);
      console.log(`! 错误 ${e.message}`);
    }
    await sleep(500);
  }

  // 写出候选池
  const head = `// ============================================================================
// gooood 候选配图池 / Case Image Candidates from gooood.cn
// - 由 tools/crawl_gooood.js 自动生成
// - 每个案例聚合 gooood 上命中的项目页大图（>=700px），供用户在校对窗口挑选
// - 格式：{ 案例id: [ {url, w, h, caption, credit, page, source} ] }
// - 仅供挑选；最终定稿请写入 data/gooood.curated.js
// ============================================================================
const CASE_GOOOD_CANDIDATES = `;
  const body = JSON.stringify(OUT, null, 2);
  fs.writeFileSync(OUT_PATH, head + body + ";\n", "utf8");

  console.log("\n================ 汇总 ================");
  console.log("gooood 命中案例数:", log.found.length, "/", cases.length);
  console.log("未命中:", log.missing.length ? log.missing.join(", ") : "无");
  if (log.errors.length) console.log("错误:", log.errors.join(" | "));
  console.log("候选池已写出:", OUT_PATH);
})();
