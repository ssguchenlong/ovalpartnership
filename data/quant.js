// ============================================================================
// 量化依据引擎 (Quantified Evidence Engine)
// 每个维度下挂载若干「可量化成功指标」(facts)，每条 fact：
//   metric   指标名称
//   value    推荐值 / 值域（来自跨案例归纳与现场经验）
//   band     适用情形（什么项目、什么区段用这个值）
//   cases    实证来源案例 id（必须能在案例库中找到）
//   conditions 适用条件（同 principles 的 AND 过滤，可空）
//   note     取舍逻辑 / 风险提醒
// 前端「设计指导大师」每个维度渲染「量化依据」块；城市研判时按 locale 综合。
// 数值均来自 data/guidance.js 已归纳的参数与案例标注，可追溯到具体项目。
// ============================================================================

const QUANT = {
  // ---------- 立面设计 ----------
  facade: {
    label: "立面设计",
    facts: [
      { metric: "沿街感知视觉高度", value: "≤ 2 层（三层及以上退台 ≥3m）", band: "开放街区型", cases: ["chengdu-taikoo-li","sh-qiantan","sanlitun-taikoo-li"], conditions: {}, note: "用视线分析验证街巷内实际感知，避免高层压迫低层界面。" },
      { metric: "首层透明率", value: "≥ 70%，严禁连续实墙 >8m", band: "所有商业界面", cases: ["chengdu-taikoo-li","shanghai-xintiandi","ginza"], conditions: {}, note: "首层为结构/设备让位做大面积实墙会直接杀死界面活力。" },
      { metric: "明星立面占比", value: "≤ 20%（集中于转角/端景/入口）", band: "整街界面管控", cases: ["chengdu-taikoo-li","sh-qiantan"], conditions: {}, note: "每栋都想当明星 → 全街无背景、视觉噪音。" },
      { metric: "檐廊 / 挑檐出挑", value: "≥ 2.5m，净高 ≥3.6m", band: "主动线覆盖", cases: ["chengdu-taikoo-li","sh-qiantan","hz-yuniaoji"], conditions: {}, note: "连续檐廊同时解决灰空间、外摆覆盖与气候遮蔽。" },
      { metric: "中式坡屋顶坡度", value: "27°「四分水」（转译用）", band: "历史/文化转译型", cases: ["chengdu-taikoo-li"], conditions: { context: ["历史街区"] }, note: "用现代材料转译神韵，拒绝仿古构件堆砌。" }
    ]
  },
  // ---------- 景观设计 ----------
  landscape: {
    label: "景观设计",
    facts: [
      { metric: "可坐点间距", value: "主动线每 50–80m 一处", band: "停留导向", cases: ["chengdu-taikoo-li","sh-longhua","hz-yuniaoji"], conditions: {}, note: "优先布在阴角与观景点；KPI 是停留时长而非好看。" },
      { metric: "记忆点水景数量", value: "全项目 1 处，且绑定地标/演出", band: "事件容量", cases: ["us-thegrove","shenzhen-happy-harbor","iconsiam"], conditions: {}, note: "水景多而散 → 没有记忆点。" },
      { metric: "行道树", value: "单一树种、阵列连续", band: "街道绿化", cases: ["omotesando","chengdu-taikoo-li"], conditions: {}, note: "阵列化比混植更显秩序；表参道用榉树穹冠补回大尺度。" },
      { metric: "天空环道 / 跑道长度", value: "450m（按真实跑步需求）", band: "综合体屋顶", cases: ["sh-qiantan"], conditions: { typology: ["综合体"] }, note: "前滩 Sky Loop 直接对应周边跑步社群的真实里程需求。" },
      { metric: "长效花境结构", value: "球灌骨架 + 线性中层 + 匍匐下层（三层）", band: "低维护精致景观", cases: ["sh-longhua"], conditions: {}, note: "龙华会三层配置降低养护频次、保证四季观赏。" }
    ]
  },
  // ---------- 人流动线 ----------
  circulation: {
    label: "人流动线",
    facts: [
      { metric: "主动线形态 / 总长", value: "闭环（U/回字/8字），单向 250–350m", band: "街区型", cases: ["chengdu-taikoo-li","sanlitun-taikoo-li"], conditions: {}, note: "尽端式动线制造死角；不闭环则回游性差。" },
      { metric: "快街（展示型业态）宽度", value: "10–12m", band: "目的性消费 / 高流速", cases: ["chengdu-taikoo-li","us-16thstreet","shanghai-xintiandi"], conditions: {}, note: "丹佛近站人行道加宽至 11m 做不对称集散断面。" },
      { metric: "慢街（餐饮文创）宽度", value: "4–7m", band: "漫游 / 外摆", cases: ["chengdu-taikoo-li","shanghai-xintiandi","hz-yuniaoji"], conditions: {}, note: "新天地 D/H 0.5–1 的里弄亲密感来自窄巷。" },
      { metric: "组团节点间距", value: "100–180m（广场落交汇处）", band: "节奏重置", cases: ["chengdu-taikoo-li","covent-garden"], conditions: {}, note: "广场是分流阀不是终点；落动线之外沦为孤岛。" },
      { metric: "扶梯辐射半径 / 间距", value: "半径 30m，间距 ≤60m", band: "含高层的街区", cases: ["namba-parks","siam-paragon"], conditions: { form: ["垂直街区","综合体"] }, note: "只有水平动线没有垂直策略 → 高层坏死。" },
      { metric: "接驳口优先度", value: "地铁/巴士站上盖，做导入广场", band: "TOD/滨水", cases: ["siam-paragon","iconsiam","chengdu-taikoo-li"], conditions: {}, note: "把人流量最大的门让给设备是最常见误区。" }
    ]
  },
  // ---------- 精神堡垒 / 地标 ----------
  landmark: {
    label: "精神堡垒 / 地标",
    facts: [
      { metric: "借景半径", value: "场地内外 1km 内城市/历史地标优先", band: "所有项目", cases: ["chengdu-taikoo-li","sh-longhua"], conditions: {}, note: "借景成功则不必另造；龙华会借 1700 年龙华塔。" },
      { metric: "次级地标间距", value: "150–250m 成链布局", band: "动线覆盖", cases: ["chengdu-taikoo-li","sh-longhua"], conditions: {}, note: "单点地标，动线远端完全无覆盖。" },
      { metric: "门户构成", value: "组合式（保留物+装置+水景/牌坊+灯光）", band: "入口", cases: ["sh-longhua","sz-huaihai"], conditions: {}, note: "孤立高塔与场地无叙事关系是最常见误区。" }
    ]
  },
  // ---------- 标识系统 ----------
  signage: {
    label: "标识系统",
    facts: [
      { metric: "三级导视体系", value: "城市级 / 街区级 / 店铺级（缺一级即断层）", band: "所有项目", cases: ["chengdu-taikoo-li","us-16thstreet"], conditions: {}, note: "先做空间结构兜底，导视只补位。" },
      { metric: "总平图密度", value: "每个广场节点至少 1 处", band: "街区级", cases: ["chengdu-taikoo-li","covent-garden"], conditions: {}, note: "本地图缺失 → 外地人找不到入口。" },
      { metric: "店招四控", value: "尺寸 / 材质 / 色彩 / 亮度 写进租户手册", band: "界面管控", cases: ["sz-huaihai","sh-longhua","chengdu-taikoo-li"], conditions: {}, note: "店招失控是界面资产贬值主因；历史街区加审立面协调。" },
      { metric: "灯光导视层级", value: "低(矮柱灯)/中(路灯)/高(店招灯箱+顶棚灯) 三层", band: "夜间", cases: ["sz-huaihai","us-16thstreet"], conditions: {}, note: "铺装分区、流线纹理都是隐性指路系统。" }
    ]
  },
  // ---------- 尺度与空间序列（核心量化维度） ----------
  scale: {
    label: "尺度与空间序列",
    facts: [
      { metric: "步行主街 / 快街宽度", value: "10–12m（谱系中值 11m）", band: "目的性消费、高流速展示界面", cases: ["chengdu-taikoo-li","us-16thstreet","shanghai-xintiandi","sh-qiantan"], conditions: {}, note: "太古里 7–13m 街宽配两层建筑；丹佛近站加宽至 11m 做不对称集散断面。" },
      { metric: "慢街 / 里巷宽度", value: "4–7m", band: "漫游、餐饮外摆", cases: ["chengdu-taikoo-li","shanghai-xintiandi","hz-yuniaoji"], conditions: {}, note: "新天地 D/H 0.5–1 的里弄亲密感即来自此窄幅。" },
      { metric: "沉浸巷 / 支巷宽度", value: "3–5m", band: "探索型、高密肌理", cases: ["chengdu-kuanzhai","guangzhou-yongqing-fang","suzhou-pingjiang"], conditions: {}, note: "窄到仅容两人侧身，制造「发现感」而非通行效率。" },
      { metric: "D/H 比（街道宽高比）", value: "1–2（芦原义信宜人区间）", band: "主街舒适感", cases: ["chengdu-taikoo-li","shanghai-xintiandi"], conditions: {}, note: "超过 2 立即显疏远，用树木/檐廊/灯柱补偿；里弄可下探至 0.5–1。" },
      { metric: "外摆进深", value: "≥ 2.5m", band: "餐饮界面", cases: ["chengdu-taikoo-li","shanghai-xintiandi","sh-qiantan"], conditions: {}, note: "无外摆的街道注定低利用；鹭洲里内街 18m+ 无外摆是反面教材。" },
      { metric: "独栋街墙长度", value: "30–50m（长边 ≤60m）", band: "街墙节奏", cases: ["chengdu-taikoo-li","sanlitun-taikoo-li"], conditions: {}, note: "过长街墙制造单调与风向死角。" },
      { metric: "组团 / 单向总长", value: "组团 100–180m / 单向总长 250–350m", band: "疲劳点重置", cases: ["chengdu-taikoo-li","covent-garden"], conditions: {}, note: "超限处必须设强节点重置步行疲劳。" },
      { metric: "建筑层数", value: "2–3 层低层高密度满铺", band: "开放街区", cases: ["chengdu-taikoo-li","shanghai-xintiandi","hz-yuniaoji"], conditions: {}, note: "优先于塔楼+大广场，避免界面断裂与人气流失。" }
    ]
  },
  // ---------- 业态组合 ----------
  program: {
    label: "业态组合",
    facts: [
      { metric: "主力业态占比", value: "≥ 40% 聚焦主轴", band: "定位清晰度", cases: ["chengdu-kuanzhai","namba-parks"], conditions: {}, note: "平均用力 → 逛完无记忆点。" },
      { metric: "餐饮外摆进深", value: "≥ 2.5m", band: "夜活力 / 停留锚", cases: ["shanghai-xintiandi","chengdu-taikoo-li","hz-yuniaoji"], conditions: {}, note: "餐饮外摆驱动夜间活力，尤其面向青年/家庭。" },
      { metric: "体验业态占比", value: "20–35% 引流抗周期", band: "抗周期", cases: ["siam-paragon","namba-parks","iconsiam"], conditions: {}, note: "纯零售空心化；用影院/市集/展览引流。" },
      { metric: "首店 / 创新店比例", value: "≥ 30% 制造独特性", band: "差异化的街区", cases: ["sh-qiantan","sanlitun-taikoo-li"], conditions: {}, note: "全标准化品牌 → 失去到访理由。" }
    ]
  },
  // ---------- 材质与细部 ----------
  material: {
    label: "材质与细部",
    facts: [
      { metric: "传统材料占比（历史/在地项目）", value: "≥ 60% 作基调", band: "历史街区 / 文化转译", cases: ["suzhou-pingjiang","guangzhou-yongqing-fang","chengdu-taikoo-li"], conditions: { context: ["历史街区"] }, note: "青砖/小青瓦/夯土/石材原真，配现代玻璃钢对比。" },
      { metric: "首层界面透明率", value: "≥ 70%", band: "所有商业界面", cases: ["chengdu-taikoo-li","ginza","omotesando"], conditions: {}, note: "首层为结构做实墙是高频失误。" },
      { metric: "遮阳出挑（湿热 / 多雨）", value: "≥ 2.5m", band: "热带 / 多雨气候", cases: ["iconsiam","orchard-road"], conditions: { climate: ["热带","亚热带"] }, note: "用挑檐/骑楼/褶皱玻璃应对气候，而非纯装饰。" }
    ]
  },
  // ---------- 灯光与夜间 ----------
  lighting: {
    label: "灯光与夜间",
    facts: [
      { metric: "主色温", value: "2700–3000K（暖）", band: "高端 / 历史 / 市井", cases: ["shanghai-xintiandi","suzhou-pingjiang","high-line"], conditions: {}, note: "避免高色温过度亮化破坏氛围。" },
      { metric: "夜间事件频次", value: "每日 / 季节场次（水秀/灯光秀/点灯）", band: "滨水 / 文旅", cases: ["shenzhen-happy-harbor","iconsiam"], conditions: {}, note: "无夜事件 → 夜间冷清；绑定运营日历制造回访。" },
      { metric: "店招灯四控", value: "尺寸 / 材质 / 色彩 / 亮度", band: "界面管控", cases: ["sz-huaihai","sh-longhua"], conditions: {}, note: "与白天店招管控一体，避免夜间光污染失控。" }
    ]
  },
  // ---------- 文化叙事 ----------
  narrative: {
    label: "文化叙事",
    facts: [
      { metric: "叙事原型", value: "1 个清晰核心", band: "所有项目", cases: ["chengdu-taikoo-li","sh-longhua","shenzhen-dayun-tiandi"], conditions: {}, note: "通用雕塑无叙事；具象堆砌仿古是反面。" },
      { metric: "叙事落点", value: "绑定地标 / 门户 / 轴线", band: "记忆锚定", cases: ["chengdu-taikoo-li","sh-longhua"], conditions: {}, note: "叙事必须落点于空间高潮，而非散点装饰。" }
    ]
  },
  // ---------- 交通接驳 ----------
  transit: {
    label: "交通接驳",
    facts: [
      { metric: "接驳半径", value: "轨道站点 300m 内优先", band: "TOD / 城市核心", cases: ["siam-paragon","iconsiam","chengdu-taikoo-li"], conditions: {}, note: "枢纽即流量入口，应第一优先级投入。" },
      { metric: "导入广场", value: "接驳口必备", band: "所有接驳口", cases: ["chengdu-taikoo-li","siam-paragon"], conditions: {}, note: "放弃上盖指标也要保接驳门户（太古里先例）。" },
      { metric: "近站断面", value: "随客流数据不对称加宽集散", band: "高客流接驳", cases: ["us-16thstreet"], conditions: {}, note: "丹佛按真实客流做不对称断面，而非对称美化。" }
    ]
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { QUANT };
}
