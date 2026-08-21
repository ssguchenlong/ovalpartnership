#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
collector.py — 商业街案例联网采集脚本
=====================================
为「商业街案例研究与设计指导系统」自动生成结构化案例 JSON。
调用支持联网搜索的大模型 API（默认 Perplexity sonar，亦兼容 OpenAI 兼容端点），
输入一个或多个商业街名称，输出与 data/cases.js / data/principles.js 同构的 JSON。

用法
----
  export COLLECTOR_API_KEY="你的API密钥"
  python collector.py "上海张园" "东京中城"
  python collector.py "West Hollywood" --out data/new_cases.json

配置（环境变量，均可选；不填则用下方默认值）
------------------------------------------------
  COLLECTOR_API_KEY   必填。API 密钥。
  COLLECTOR_BASE_URL  兼容 OpenAI 的端点，默认 https://api.perplexity.ai
  COLLECTOR_MODEL     模型名，默认 sonar-pro（Perplexity 自带联网搜索）
                     若用 OpenAI，可设模型为 gpt-4o-search-preview 等带搜索的模型。
  COLLECTOR_TIMEOUT   请求超时秒数，默认 120。

说明
----
  * 纯标准库实现，无需 pip install。
  * 输出的 JSON 可直接在网页「导入案例」中上传；或手动并入 data/cases.js 的 CASES 数组。
  * 若模型不支持实时联网，则返回基于其训练知识的整理结果，请人工校核。
"""

import os
import sys
import json
import urllib.request
import urllib.error

# ----------------------------- 配置 -----------------------------
API_KEY = os.environ.get("COLLECTOR_API_KEY", "")
BASE_URL = os.environ.get("COLLECTOR_BASE_URL", "https://api.perplexity.ai").rstrip("/")
MODEL = os.environ.get("COLLECTOR_MODEL", "sonar-pro")
TIMEOUT = int(os.environ.get("COLLECTOR_TIMEOUT", "120"))

DIM_KEYS = [
    "facade", "landscape", "circulation", "landmark", "signage",
    "scale", "program", "material", "lighting", "narrative", "transit",
]
DIM_LABELS = {
    "facade": "立面设计", "landscape": "景观设计", "circulation": "人流动线",
    "landmark": "精神堡垒/地标", "signage": "标识系统", "scale": "尺度与空间序列",
    "program": "业态组合", "material": "材质与细部", "lighting": "灯光与夜间",
    "narrative": "文化叙事", "transit": "交通接驳",
}

SYSTEM_PROMPT = f"""你是一名资深商业街区建筑设计师与研究分析师。
任务：针对用户给出的商业街/商业街区项目，联网检索并整理为严格的结构化 JSON。
必须使用中文输出 note 字段。

JSON 字段规范（务必严格遵循，不要增减字段）：
{{
  "id": "英文短标识(小写连字符，如 shanghai-zhangyuan)",
  "name": "中文名",
  "nameEn": "英文名",
  "city": "城市",
  "country": "国家",
  "region": "亚洲/欧洲/美洲/其他",
  "firm": "主要设计机构",
  "year": 开业或建成年份(整数，未知用 0),
  "typology": "项目类型(如 开放式街区/综合体/滨水商业)",
  "gfa": "规模/面积描述(字符串)",
  "climate": "温带/亚热带/热带/地中海/其他",
  "context": "区位语境(可多选，用斜杠分隔，如 城市核心/历史街区/TOD/滨水/文旅/生态/旧改/高端/新城/公园)",
  "program": "业态侧重(斜杠分隔, 如 零售/餐饮/休闲/文旅/高端/家庭)",
  "clientele": "客群(斜杠分隔, 如 高端/青年/游客/在地/家庭)",
  "form": "地块形态(院落街区/线性街/综合体/广场型/环形街)",
  "tags": ["3-6个关键词"],
  "success": ["3-6个成功要素短词"],
  "summary": "一句话总结(40字内)",
  "dims": {{
    "facade":     {{"star": 1-3, "note": "该维度设计要点与出彩处(中文,60-120字)"}},
    "landscape":  {{"star": 1-3, "note": "..."}},
    "circulation":{{"star": 1-3, "note": "..."}},
    "landmark":   {{"star": 1-3, "note": "..."}},
    "signage":    {{"star": 1-3, "note": "..."}},
    "scale":      {{"star": 1-3, "note": "..."}},
    "program":    {{"star": 1-3, "note": "..."}},
    "material":   {{"star": 1-3, "note": "..."}},
    "lighting":   {{"star": 1-3, "note": "..."}},
    "narrative":  {{"star": 1-3, "note": "..."}},
    "transit":    {{"star": 1-3, "note": "..."}}
  }}
}}
维度说明：star 取值 3=世界级标杆(该维度最佳参考) / 2=突出 / 1=合格。
11 个维度分别为：{', '.join(f'{k}({v})' for k,v in DIM_LABELS.items())}。
只输出一个 JSON 对象，不要任何解释、前言或代码块标记。"""

USER_TEMPLATE = (
    "请研究商业街项目「{name}」，联网核实其建筑设计、景观、动线、地标、标识、"
    "尺度、业态、材质、灯光、文化叙事与交通接驳等要点，按系统要求输出结构化 JSON。"
)


def _strip_fences(text: str) -> str:
    t = text.strip()
    if t.startswith("```"):
        # 去除 ```json / ``` 围栏
        t = t.split("\n", 1)[1] if "\n" in t else t[3:]
        if t.rstrip().endswith("```"):
            t = t.rstrip()[:-3]
    return t.strip()


def collect(name: str) -> dict:
    if not API_KEY:
        raise RuntimeError("未配置 COLLECTOR_API_KEY，请先 export 你的 API 密钥。")
    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": USER_TEMPLATE.format(name=name)},
        ],
        "temperature": 0.2,
    }
    req = urllib.request.Request(
        f"{BASE_URL}/chat/completions",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    content = data["choices"][0]["message"]["content"]
    obj = json.loads(_strip_fences(content))
    _validate(obj, name)
    return obj


def _validate(obj: dict, name: str):
    for f in ("id", "name", "city", "country", "dims"):
        if f not in obj:
            raise ValueError(f"返回结果缺少字段 {f}")
    if not isinstance(obj["dims"], dict):
        raise ValueError("dims 必须是对象")
    for k in DIM_KEYS:
        d = obj["dims"].get(k)
        if not isinstance(d, dict) or "star" not in d or "note" not in d:
            raise ValueError(f"维度 {k} 缺少 star/note")
        try:
            obj["dims"][k]["star"] = int(d["star"])
        except Exception:
            obj["dims"][k]["star"] = 1
    if "tags" not in obj or not isinstance(obj["tags"], list):
        obj["tags"] = obj.get("tags") or []
    if "success" not in obj or not isinstance(obj["success"], list):
        obj["success"] = obj.get("success") or []
    return obj


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    out_arg = None
    for a in sys.argv[1:]:
        if a.startswith("--out="):
            out_arg = a.split("=", 1)[1]
    if not args:
        print(__doc__)
        sys.exit(1)

    results = []
    for name in args:
        print(f"[采集] {name} ...", flush=True)
        try:
            obj = collect(name)
            results.append(obj)
            print(f"  ✓ 完成：{obj.get('name')}（{obj.get('city')}），"
                  f"标签 {obj.get('tags')}")
        except Exception as e:
            print(f"  ✗ 失败：{e}", file=sys.stderr)

    if not results:
        print("没有成功采集到任何案例。", file=sys.stderr)
        sys.exit(1)

    text = json.dumps(results, ensure_ascii=False, indent=2)
    if out_arg:
        with open(out_arg, "w", encoding="utf-8") as f:
            f.write(text)
        print(f"\n已写入 {out_arg}（{len(results)} 个案例）。")
    else:
        print("\n----- 采集结果 JSON -----")
        print(text)
        print("\n提示：将以上 JSON 保存为文件，在网页「导入案例」中上传即可。")


if __name__ == "__main__":
    main()
