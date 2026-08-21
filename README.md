# 商业街案例研究与设计指导系统

为商业街空间设计沉淀方法论的工具：自动/手动汇集全球标杆案例，跨案例提炼成功要素，并提供交互式「设计指导大师」。

## 文件结构
- `index.html` — 主程序（单文件网页应用，直接用浏览器打开）
- `data/cases.js` — 案例库（24 个标杆，11 维标注，可扩展）
- `data/principles.js` — 设计法则库（53 条跨案例提炼，含适用条件与来源案例）
- `collector.py` — 联网采集脚本（调用带搜索的大模型 API 生成新案例 JSON）

## 四大模块
1. **案例库** — 按区域/区位/形态/业态/客群/气候筛选，卡片点击查看 11 维设计标注（★世界级 / ★★突出 / ★合格）。
2. **对比分析** — 勾选 2–8 个案例横向对比，自动提炼共性成功要素。
3. **设计指导大师** — 输入项目参数（区位/气候/业态/客群/形态），系统匹配相似标杆并推送适配的设计法则，每条可追溯到来源案例。
4. **导入案例** — 上传 `collector.py` 生成的 JSON，持久化到本地浏览器；亦可导出当前库。

## 运行方式
**方式一（推荐）**：在目录下启动本地服务器，避免个别浏览器对 `file://` 的限制：
```
python -m http.server 8080
```
浏览器打开 `http://localhost:8080/`。

**方式二**：直接双击 `index.html` 用浏览器打开（多数浏览器可用；若 localStorage 被禁用，导入功能可能不持久）。

## 联网采集（持续扩充案例）
`collector.py` 用标准库实现，默认对接 Perplexity（自带联网搜索），亦兼容任意 OpenAI 兼容端点。
```
export COLLECTOR_API_KEY="你的API密钥"
# 可选：export COLLECTOR_BASE_URL=...   export COLLECTOR_MODEL=sonar-pro
python collector.py "上海张园" "东京中城" --out data/new_cases.json
```
生成的 JSON 在网页「导入案例」中上传即可。若模型无实时联网，返回基于训练知识的整理结果，请人工校核。

## 维度说明（11 维）
立面设计 / 景观设计 / 人流动线 / 精神堡垒·地标 / 标识系统 / 尺度与空间序列 / 业态组合 / 材质与细部 / 灯光与夜间 / 文化叙事 / 交通接驳。

## 扩展数据
- 手工加案例：编辑 `data/cases.js` 的 `CASES` 数组，按现有结构新增（维度键须与 `principles.js` 的 `DIMENSIONS` 一致）。
- 提炼新法则：在 `data/principles.js` 的 `PRINCIPLES` 数组新增，指明 `dimension`、`text`、`conditions`（适用条件）、`source`（来源案例 id）。
