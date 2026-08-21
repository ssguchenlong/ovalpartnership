#!/usr/bin/env node
/*
 * 由 data/gooood.candidates.js 生成默认 data/gooood.curated.js
 * 每个案例取前 N 张（按相关度/顺序，[0] 为封面）。
 * 用户可在 gooood_review.html 中重新挑选后覆盖本文件。
 */
"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "data", "gooood.candidates.js");
const OUT = path.join(ROOT, "data", "gooood.curated.js");
const N = 5;

const src = fs.readFileSync(SRC, "utf8");
const m = src.match(/const CASE_GOOOD_CANDIDATES\s*=\s*([\s\S]*?);\s*\n*$/);
if (!m) { console.error("无法解析候选池"); process.exit(1); }
const CAND = eval("(" + m[1] + ")");

const OUT_OBJ = {};
let total = 0;
for (const id of Object.keys(CAND)) {
  const list = CAND[id] || [];
  const picked = list.slice(0, N).map(it => ({
    file: it.url,
    caption: it.caption || id,
    credit: it.credit || "gooood.cn",
    page: it.page || "",
    source: "gooood"
  }));
  if (picked.length) { OUT_OBJ[id] = picked; total += picked.length; }
}

const head = "// gooood 定稿配图（默认版 · 由 tools/gen_gooood_curated.js 从候选池前 " + N + " 张生成）\n"
  + "// 每案例最多 " + N + " 张，[0] 为封面。可在 gooood_review.html 重新挑选后覆盖本文件。\n"
  + "const CASE_GOOOD_CURATED = ";
fs.writeFileSync(OUT, head + JSON.stringify(OUT_OBJ, null, 2) + ";\n", "utf8");
console.log("已生成", OUT);
console.log("案例数:", Object.keys(OUT_OBJ).length, " 总图数:", total);
