// ============================================================================
// 城市 / 地域知识库 (Locale Knowledge Base)
// 每个城市条目：气候、区位、可承载语境、业态研判、人文研判、推荐类比案例、尺度提示。
// 类比案例(analogCases)引用案例库 id；尺度提示(scaleHint)直接回答「本地最适宜尺度」。
// 前端「设计指导大师」在填入城市后渲染「项目所在地研判」，并把类比案例纳入参考。
// 未收录城市走 _fallback，按气候做全国均值参考。
// ============================================================================

const LOCALES = {
  // ---------- 合肥（用户示例城市，详细） ----------
  "合肥": {
    climate: "北亚热带向暖温带过渡，四季分明，夏热冬冷",
    region: "华东 · 安徽",
    contexts: ["城市核心", "滨水", "新城", "历史街区"],
    business: "科创（蔚来/京东方/科大讯飞等）+ 高校密集（中科大等）带来年轻高知客群与稳定消费力；新兴中产快速扩张，亲子、咖啡、夜经济与策展型零售潜力大；文旅相对薄弱，需靠内容运营补足。" ,
    culture: "科教基地气质务实低调；地处江淮，徽文化底蕴深厚（徽派建筑、包公文化、淮军故里的在地认同），与江南文化圈近；市民审美偏克制、重性价比与体验真实感。",
    analogCases: ["chengdu-taikoo-li", "shanghai-xintiandi", "hz-yuniaoji", "sh-qiantan", "suzhou-pingjiang", "cd-luzhouli"],
    scaleHint: "气候温和、四季分明，主街取 10–12m 谱系中值（约 11m），慢巷 5–7m 适配餐饮外摆，外摆进深 ≥2.5m；建议 2–3 层低密肌理、D/H≈1.5。冬季偏冷，主动线须保证连续檐廊/暖廊覆盖；夏热需连廊与行道树阵列遮阴。",
    note: "合肥更宜对标「开放街区 + 文化社区」型（成都太古里、杭州玉鸟集）而非纯奢侈品街；徽文化底蕴可用现代转译（苏州平江路为近邻范式），避免仿古堆砌。"
  },

  // ---------- 北京 ----------
  "北京": {
    climate: "温带季风，夏热冬寒，干燥多风",
    region: "华北",
    contexts: ["城市核心", "历史街区", "使馆区", "新城"],
    business: "高端消费与潮流文化双核，国潮、首店经济强；客单价高但季节波动明显（冬季户外活力下降）。",
    culture: "皇城气象与胡同烟火并存，历史叙事权重高，市民对「北京味儿」敏感。",
    analogCases: ["sanlitun-taikoo-li", "chengdu-taikoo-li", "shanghai-xintiandi", "guangzhou-yongqing-fang"],
    scaleHint: "冬寒需加强围合感与暖廊；主街 10–12m，里巷 5–7m，但院落/口袋广场应加密以承载停留与避风。",
    note: "历史街区须遵循风貌管控，业态与文化叙事强绑定。"
  },

  // ---------- 上海 ----------
  "上海": {
    climate: "北亚热带季风，湿润，梅雨与盛夏闷热",
    region: "华东",
    contexts: ["城市核心", "历史街区", "滨水", "新城"],
    business: "全国消费天花板，首店/旗舰/夜经济极成熟；客群国际化、审美前沿，业态迭代快。",
    culture: "海派中西交融，对精致度与「腔调」要求高；石库门文化是强叙事资产。",
    analogCases: ["shanghai-xintiandi", "sh-qiantan", "sh-longhua", "chengdu-taikoo-li", "suzhou-pingjiang"],
    scaleHint: "湿润闷热 → 连廊/骑楼/行道树遮阴必要；主街 10–12m，慢巷 5–7m，外摆进深 ≥2.5m 适配高密度夜活力。",
    note: "滨水项目可叠加码头+轨道双接驳（参考 ICONSIAM 逻辑）。"
  },

  // ---------- 成都 ----------
  "成都": {
    climate: "亚热带季风，湿润，冬无严寒夏无酷暑",
    region: "西南",
    contexts: ["城市核心", "历史街区", "滨水", "新城"],
    business: "休闲消费之都，外摆文化全国最强，餐饮/茶饮/夜经济极活跃；慢生活客群对停留空间要求高。",
    culture: "闲适包容，市井烟火气重，对「耍」的空间（茶馆/坝坝/里巷）天然接受。",
    analogCases: ["chengdu-taikoo-li", "chengdu-kuanzhai", "cd-luzhouli", "shanghai-xintiandi", "hz-yuniaoji"],
    scaleHint: "气候宜人、外摆为王 → 主街 10–12m，慢巷 4–7m 全尺度外摆；D/H 1–2，2–3 层低密满铺。",
    note: "成都案例即开放街区母本，尺度可直接复用其 7–13m 谱系。"
  },

  // ---------- 深圳 ----------
  "深圳": {
    climate: "南亚热带，长夏无冬，多雨湿热",
    region: "华南",
    contexts: ["城市核心", "滨水", "新城", "综合体"],
    business: "年轻移民城市，消费力高、尝新快；科创/滨海驱动，亲子与户外业态强。",
    culture: "务实高效、无历史包袱，重体验与效率，对现代设计包容度高。",
    analogCases: ["shenzhen-dayun-tiandi", "shenzhen-happy-harbor", "sh-qiantan", "namba-parks"],
    scaleHint: "湿热多雨 → 挑檐/连廊/遮阴必需，主街 10–12m 仍宜，但灰空间覆盖率要高于北方；建筑可适度抬高做底层架空通风。",
    note: "滨水/综合体项目参考欢乐港湾、难波公园的立体与事件逻辑。"
  },

  // ---------- 杭州 ----------
  "杭州": {
    climate: "北亚热带季风，温润，梅雨明显",
    region: "华东",
    contexts: ["城市核心", "滨水", "新城", "文创"],
    business: "文旅+数字新经济双轮，文创、艺术、茶咖与亲子消费强；客群审美高、重自然。",
    culture: "西湖山水美学与宋韵文化，自然叙事权重极高，排斥过度商业化。",
    analogCases: ["hz-yuniaoji", "chengdu-taikoo-li", "suzhou-pingjiang", "sh-longhua"],
    scaleHint: "温润宜居 → 主街 10–12m，慢巷 5–7m，外摆与景观停留并重；低密肌理呼应山水尺度。",
    note: "玉鸟集是社区型文化艺术聚落范本，适合杭州的「去景区化」诉求。"
  },

  // ---------- 广州 ----------
  "广州": {
    climate: "南亚热带，湿热，长夏",
    region: "华南",
    contexts: ["城市核心", "历史街区", "滨水"],
    business: "老城烟火与新生消费并存，餐饮极致强，夜经济（宵夜）全国标杆。",
    culture: "岭南文化、骑楼传统，重实用与市井真实，对「老广味」认同强。",
    analogCases: ["guangzhou-yongqing-fang", "suzhou-pingjiang", "shanghai-xintiandi", "chengdu-taikoo-li"],
    scaleHint: "湿热 + 骑楼传统 → 主街 10–12m 配连续骑楼遮蔽，慢巷 5–7m，外摆进深 ≥2.5m。",
    note: "永庆坊是历史文化街区微改造范式，骑楼与街巷活化可复用。"
  },

  // ---------- 苏州 ----------
  "苏州": {
    climate: "北亚热带季风，温润",
    region: "华东",
    contexts: ["历史街区", "城市核心", "滨水"],
    business: "文旅与在地消费并重，文化休闲、精致餐饮强；客群重文化质感。",
    culture: "江南园林与水乡基因，粉墙黛瓦原真材料是核心资产。",
    analogCases: ["suzhou-pingjiang", "chengdu-taikoo-li", "hz-yuniaoji", "guangzhou-yongqing-fang"],
    scaleHint: "历史街巷宜窄 → 主街 8–10m、慢巷 4–6m、沉浸巷 3–5m，低层为主，D/H 下探至 0.5–1 显亲密。",
    note: "平江路是原真材料+水巷叙事范本，尺度可直接参考其窄巷谱系。"
  },

  // ---------- 重庆 ----------
  "重庆": {
    climate: "亚热带季风，湿热，多雾",
    region: "西南",
    contexts: ["城市核心", "山地", "滨水"],
    business: "立体消费、网红经济强，年轻人活跃；地形即业态亮点。",
    culture: "山水立体城市，8D 地形与市井烟火是独特叙事。",
    analogCases: ["namba-parks", "shenzhen-dayun-tiandi", "chengdu-taikoo-li"],
    scaleHint: "山地立体 → 用垂直动线与平台广场替代平面长街；平台宽度 10–12m，连桥/大楼梯加密。",
    note: "难波公园的「公园+垂直」逻辑最适配重庆地形。"
  },

  // ---------- 西安 ----------
  "西安": {
    climate: "温带季风，夏热冬冷，干燥",
    region: "西北",
    contexts: ["历史街区", "城市核心", "新城"],
    business: "文旅消费强（大唐不夜城范式），国潮与夜游极活跃；年轻客群增长快。",
    culture: "十三朝古都，历史叙事权重极高，唐文化符号接受度强。",
    analogCases: ["guangzhou-yongqing-fang", "chengdu-taikoo-li", "shanghai-xintiandi", "suzhou-pingjiang"],
    scaleHint: "冬冷夏热 → 主街 10–12m 配口袋广场与暖廊；历史街区窄巷 4–7m 承载唐风叙事。",
    note: "历史叙事须转译而非仿古，永庆坊微改造逻辑可迁移。"
  },

  // ---------- 武汉 ----------
  "武汉": {
    climate: "北亚热带季风，夏热冬冷，江湖气盛",
    region: "华中",
    contexts: ["城市核心", "滨水", "新城"],
    business: "高校密集、年轻消费强，宵夜与市集文化活跃；滨水更新机遇大。",
    culture: "江湖市井、码头文化，开放包容、重烟火气。",
    analogCases: ["chengdu-taikoo-li", "shanghai-xintiandi", "shenzhen-happy-harbor", "hz-yuniaoji"],
    scaleHint: "滨水 + 夏热 → 主街 10–12m 配连廊遮阴与江风导向；慢巷 5–7m 承载市集外摆。",
    note: "可叠加码头+轨道双接驳的滨水逻辑（ICONSIAM）。"
  },

  // ---------- 南京 ----------
  "南京": {
    climate: "北亚热带季风，夏热冬冷",
    region: "华东",
    contexts: ["历史街区", "城市核心", "滨水"],
    business: "文教与休闲消费稳，梧桐文化、慢生活审美强；客群重气质。",
    culture: "六朝烟水气，民国风情与梧桐意象是强叙事；审美偏克制典雅。",
    analogCases: ["suzhou-pingjiang", "shanghai-xintiandi", "guangzhou-yongqing-fang", "chengdu-taikoo-li"],
    scaleHint: "梧桐遮阴好 → 主街 10–12m 可适度放宽至树荫覆盖；慢巷 5–7m，低密肌理呼应林荫道。",
    note: "历史风貌区须克制，平江路/永庆坊的转译逻辑可参考。"
  },

  // ---------- 通用兜底 ----------
  "_fallback": {
    climate: "未收录该市的专项气候，按全国均值参考",
    region: "—",
    contexts: ["城市核心", "滨水", "新城", "历史街区"],
    business: "建议补充该市客群与业态数据后再细化；通用经验：先锁主轴业态，用外摆与体验业态制造停留。",
    culture: "建议补充在地文化叙事原型后再细化；通用经验：叙事须落点于地标/门户，拒绝通用雕塑。",
    analogCases: ["chengdu-taikoo-li", "shanghai-xintiandi", "hz-yuniaoji"],
    scaleHint: "通用主街 10–12m / 慢巷 5–7m / 沉浸巷 3–5m，D/H 1–2，2–3 层低密；严寒城市加密暖廊，湿热城市加密遮阴连廊。",
    note: "该市尚未收录专项研判，以上为跨案例通用均值；可在 data/locales.js 增补城市条目以提升精度。"
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { LOCALES };
}
