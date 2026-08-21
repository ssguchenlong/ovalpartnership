// ============================================================================
// 经验总结 / 设计法则库 (Distilled Design Principles)
// 每条法则: { id, dimension(维度键), text(指引), conditions(适用条件), source(来源案例id) }
// conditions 字段省略或为 [] 表示通用。匹配规则：profile 的值需落在对应条件数组中（AND）。
// 指导大师据此从案例库中匹配相似案例 + 推送适应当前项目的法则。
// ============================================================================

const DIMENSIONS = [
  { key: "facade",     label: "立面设计" },
  { key: "landscape",  label: "景观设计" },
  { key: "circulation",label: "人流动线" },
  { key: "landmark",   label: "精神堡垒 / 地标" },
  { key: "signage",    label: "标识系统" },
  { key: "scale",      label: "尺度与空间序列" },
  { key: "program",    label: "业态组合" },
  { key: "material",   label: "材质与细部" },
  { key: "lighting",   label: "灯光与夜间" },
  { key: "narrative",  label: "文化叙事" },
  { key: "transit",    label: "交通接驳" }
];

const PRINCIPLES = [
  // ---------------- 立面设计 facade ----------------
  { id: "fa-01", dimension: "facade", text: "低层高密度里巷中，用‘画框式’克制立面把视觉焦点让位给店面：建筑高度控制在 18m 内，街巷宽 7–13m，DH 比 1–2 最宜步行。", conditions: { form: ["院落街区", "线性街"] }, source: ["chengdu-taikoo-li", "sanlitun-taikoo-li"] },
  { id: "fa-02", dimension: "facade", text: "高端林荫大道让每栋旗舰由顶级建筑师操刀独特立面，建筑本身即为招牌与城市名片，整体控高不超树冠。", conditions: { context: ["高端"] }, source: ["omotesando", "ginza"] },
  { id: "fa-03", dimension: "facade", text: "历史街区采用‘修旧如旧’外皮 + 现代玻璃/钢内芯，以材质对比强化新旧对话，细节不过度雕饰。", conditions: { context: ["历史街区"] }, source: ["shanghai-xintiandi", "guangzhou-yongqing-fang", "chengdu-kuanzhai"] },
  { id: "fa-04", dimension: "facade", text: "热带气候用遮阳顶棚、褶皱玻璃、绿皮立面解决烈日与暴雨；立面可成为倒映水景的‘风帆’或‘水灯’。", conditions: { climate: ["热带"] }, source: ["iconsiam", "clarke-quay", "orchard-road"] },
  { id: "fa-05", dimension: "facade", text: "以城市设计导则统一店招与材质，维护街道整体品质与历史身份，避免各自为政破坏序列。", conditions: { form: ["线性街"] }, source: ["regent-street", "champs-elysees"] },
  { id: "fa-06", dimension: "facade", text: "巨构综合体用曲面/褶皱/退台等标志性立面语言塑天际线，把体量锚固于城市与水岸。", conditions: { form: ["综合体"] }, source: ["iconsiam", "namba-parks", "shenzhen-happy-harbor"] },

  // ---------------- 景观设计 landscape ----------------
  { id: "ls-01", dimension: "landscape", text: "成熟乔木冠层（榉树/梧桐/棕榈）是街道灵魂，主动控高‘让绿’，林荫塑造仪式感与舒适步行。", conditions: { form: ["线性街"] }, source: ["omotesando", "champs-elysees", "la-rambla"] },
  { id: "ls-02", dimension: "landscape", text: "公园/生态项目引入水系、立体绿化、活态动物，把‘逛商场’变成‘逛公园’，弱化建筑刚性。", conditions: { context: ["生态", "公园", "滨水"] }, source: ["shenzhen-dayun-tiandi", "namba-parks", "suzhou-pingjiang"] },
  { id: "ls-03", dimension: "landscape", text: "滨水项目以连续步道与河景把巨构锚固于城市，水岸是最大景观资产。", conditions: { context: ["滨水"] }, source: ["iconsiam", "shenzhen-happy-harbor", "clarke-quay"] },
  { id: "ls-04", dimension: "landscape", text: "历史街区以院落天井、水巷、盆景等原真小尺度景观取胜，而非大尺度造景。", conditions: { context: ["历史街区"] }, source: ["chengdu-kuanzhai", "suzhou-pingjiang", "shanghai-xintiandi"] },
  { id: "ls-05", dimension: "landscape", text: "基础设施/旧改再生可用自生植物演替，低维护高诗意，让遗迹‘长成’景观。", conditions: { context: ["旧改"] }, source: ["high-line"] },
  { id: "ls-06", dimension: "landscape", text: "公共座椅、外摆、浅水与绿植边界是停留与活力的基础，应沿主动线连续布置。", conditions: {}, source: ["chengdu-taikoo-li", "covent-garden", "la-rambla"] },

  // ---------------- 人流动线 circulation ----------------
  { id: "ci-01", dimension: "circulation", text: "院落/街区用回字形环路主动线，方向感明确、回游性强；节点处放大为广场聚集人流。", conditions: { form: ["院落街区"] }, source: ["chengdu-taikoo-li", "sanlitun-taikoo-li"] },
  { id: "ci-02", dimension: "circulation", text: "用‘快里/慢里’或不同区段的业态与空间节奏分层，呼应本地生活方式与消费梯度。", conditions: { context: ["城市核心", "历史街区"] }, source: ["chengdu-taikoo-li", "chengdu-kuanzhai", "shenzhen-dayun-tiandi"] },
  { id: "ci-03", dimension: "circulation", text: "TOD/综合体用坡道、天桥、地下与二层连廊编织立体回游网络，与轨道无缝缝合。", conditions: { context: ["TOD", "综合体"], form: ["综合体"] }, source: ["namba-parks", "roppongi-hills", "orchard-road"] },
  { id: "ci-04", dimension: "circulation", text: "线性街道把中央步行带与车行分离，制造高活力、安全的步行体验。", conditions: { form: ["线性街"] }, source: ["la-rambla", "clarke-quay", "orchard-road"] },
  { id: "ci-05", dimension: "circulation", text: "历史街区打通内部 passages/courtyards，新增垂直路线打破主轴单一性，提升渗透与多首层。", conditions: { context: ["历史街区"] }, source: ["covent-garden", "shanghai-xintiandi"] },
  { id: "ci-06", dimension: "circulation", text: "生态/公园项目不设围墙、不建界限，以环湖或自然流动路径让商业与自然随意切换。", conditions: { context: ["生态", "公园"] }, source: ["shenzhen-dayun-tiandi", "shenzhen-happy-harbor"] },

  // ---------------- 精神堡垒 / 地标 landmark ----------------
  { id: "lm-01", dimension: "landmark", text: "历史/文化项目用古刹、市场建筑、历史院落作中央精神核心，中轴延伸形成活力广场。", conditions: { context: ["历史街区"] }, source: ["chengdu-taikoo-li", "covent-garden", "chengdu-kuanzhai"] },
  { id: "lm-02", dimension: "landmark", text: "综合体/滨水项目以摩天轮、塔楼、曲面巨构作强视觉地标与天际线锚点。", conditions: { form: ["综合体"], context: ["滨水"] }, source: ["shenzhen-happy-harbor", "namba-parks", "iconsiam"] },
  { id: "lm-03", dimension: "landmark", text: "高端街区让每栋旗舰的独特立面即精神堡垒，建筑署名成为身份。", conditions: { context: ["高端"] }, source: ["omotesando"] },
  { id: "lm-04", dimension: "landmark", text: "以中央广场、湖畔舞台、喷泉广场作聚集与活动锚点，承接节庆与日常。", conditions: { context: ["文旅", "滨水"] }, source: ["shenzhen-dayun-tiandi", "rodeo-drive", "clarke-quay"] },
  { id: "lm-05", dimension: "landmark", text: "轴线街道以尽端凯旋门/穹顶收束视线，塑造仪式性与记忆点。", conditions: { form: ["线性街"] }, source: ["champs-elysees", "galleria-ve"] },

  // ---------------- 标识系统 signage ----------------
  { id: "sg-01", dimension: "signage", text: "高端与历史街区克制店招，让品牌旗舰与历史建筑本身为标识，导向靠空间秩序。", conditions: { context: ["高端", "历史街区"] }, source: ["omotesando", "champs-elysees", "chengdu-kuanzhai"] },
  { id: "sg-02", dimension: "signage", text: "以城市设计导则规范店招尺寸与位置，维护街道整体感（尤其线性主街）。", conditions: { form: ["线性街"] }, source: ["regent-street", "champs-elysees"] },
  { id: "sg-03", dimension: "signage", text: "公园/生态项目让标识隐于景观，自然化弱导向，避免破坏氛围。", conditions: { context: ["生态", "公园"] }, source: ["shenzhen-dayun-tiandi", "namba-parks"] },
  { id: "sg-04", dimension: "signage", text: "复杂立体/集群项目靠系统化清晰导视（含连桥、站内）支撑可步行性。", conditions: { form: ["综合体"], context: ["TOD"] }, source: ["roppongi-hills", "orchard-road", "siam-paragon"] },
  { id: "sg-05", dimension: "signage", text: "用 Big Screen、节日橱窗等动态事件标识强化场所品牌与季节回访。", conditions: { context: ["城市核心"] }, source: ["covent-garden", "fifth-avenue"] },

  // ---------------- 尺度与空间序列 scale ----------------
  { id: "sc-01", dimension: "scale", text: "街宽与建筑高 DH 比控制在 1–2，最宜步行与停留；低层高密度营造惬意氛围。", conditions: { form: ["院落街区", "线性街"] }, source: ["chengdu-taikoo-li", "chengdu-kuanzhai", "suzhou-pingjiang"] },
  { id: "sc-02", dimension: "scale", text: "林荫大道主动压低建筑高度成就整体氛围，让绿量成为主角而非单体张扬。", conditions: { form: ["线性街"] }, source: ["omotesando"] },
  { id: "sc-03", dimension: "scale", text: "用尺度对比（宏阔广场→窄巷收束）制造探索感与停留，避免单一长直街道的单调。", conditions: { context: ["历史街区"], form: ["广场型"] }, source: ["covent-garden", "galleria-ve", "chengdu-taikoo-li"] },
  { id: "sc-04", dimension: "scale", text: "超大体量综合体用滨河公园、分层中庭、节点广场切分为可步行片段，化解压迫感。", conditions: { form: ["综合体"] }, source: ["iconsiam", "roppongi-hills", "siam-paragon"] },

  // ---------------- 业态组合 program ----------------
  { id: "pr-01", dimension: "program", text: "不同巷/区做差异化业态定位（如闲/慢/品或运动/潮流/湖滨），形成梯度与节奏。", conditions: { form: ["院落街区"] }, source: ["chengdu-kuanzhai", "chengdu-taikoo-li", "shenzhen-dayun-tiandi"] },
  { id: "pr-02", dimension: "program", text: "历史/核心区混合零售+餐饮+文化+居住，平衡游客与在地，避免单一奢侈的疏离。", conditions: { context: ["历史街区", "城市核心"] }, source: ["covent-garden", "roppongi-hills"] },
  { id: "pr-03", dimension: "program", text: "以公园/文化/事件而非单纯商业组织业态，打造‘目的地’逻辑。", conditions: { context: ["生态", "文旅", "滨水"] }, source: ["namba-parks", "iconsiam", "shenzhen-dayun-tiandi"] },
  { id: "pr-04", dimension: "program", text: "以餐饮外摆与社交空间驱动停留与夜活力，尤其面向青年与家庭客群。", conditions: { clientele: ["青年", "家庭"] }, source: ["shanghai-xintiandi", "clarke-quay", "shenzhen-dayun-tiandi"] },
  { id: "pr-05", dimension: "program", text: "全业态覆盖（大众到奢侈）提升家庭友好与抗周期能力，体验业态（影院/市集）引流。", conditions: { clientele: ["家庭"] }, source: ["siam-paragon", "namba-parks"] },

  // ---------------- 材质与细部 material ----------------
  { id: "mt-01", dimension: "material", text: "历史街区用瓦/木/石/砖等原真传统材料 + 玻璃钢，细节不过度雕饰，现代感靠材料对比获得。", conditions: { context: ["历史街区"] }, source: ["chengdu-taikoo-li", "shanghai-xintiandi", "guangzhou-yongqing-fang"] },
  { id: "mt-02", dimension: "material", text: "高端项目以玻璃、清水混凝土、亚克力、金属各展其长，工艺极致，建筑即艺术。", conditions: { context: ["高端"] }, source: ["omotesando", "galleria-ve"] },
  { id: "mt-03", dimension: "material", text: "热带用遮阳顶棚、褶皱玻璃、绿皮等气候适应性材料，并注重遮阳与室内舒适。", conditions: { climate: ["热带"] }, source: ["iconsiam", "clarke-quay", "orchard-road"] },
  { id: "mt-04", dimension: "material", text: "旧改/基础设施再生以温柔转译工业遗迹（铁、混凝土、耐候钢、木），保留记忆。", conditions: { context: ["旧改"] }, source: ["high-line", "clarke-quay"] },

  // ---------------- 灯光与夜间 lighting ----------------
  { id: "li-01", dimension: "lighting", text: "滨水/文旅项目用摩天轮、水秀、灯光秀构建夜经济矩阵，显著延长停留与消费。", conditions: { context: ["滨水", "文旅"] }, source: ["shenzhen-happy-harbor", "iconsiam", "shenzhen-dayun-tiandi"] },
  { id: "li-02", dimension: "lighting", text: "高端街道以橱窗与建筑泛光营造优雅静奢夜，克制而高级。", conditions: { context: ["高端"] }, source: ["omotesando", "ginza", "fifth-avenue", "champs-elysees"] },
  { id: "li-03", dimension: "lighting", text: "历史街区以红灯笼、暖黄巷灯、庭院光营造夜韵与市井氛围。", conditions: { context: ["历史街区"] }, source: ["shanghai-xintiandi", "chengdu-kuanzhai", "suzhou-pingjiang"] },
  { id: "li-04", dimension: "lighting", text: "生态/公园项目用低色温步道与植物洗光营造静谧夜，避免过度亮化。", conditions: { context: ["生态", "公园"] }, source: ["high-line", "shenzhen-dayun-tiandi"] },

  // ---------------- 文化叙事 narrative ----------------
  { id: "na-01", dimension: "narrative", text: "把城市性格、非遗、方言转译为可消费的空间叙事（如粤剧、慢生活、水巷），建立在地认同。", conditions: { context: ["历史街区", "文旅"] }, source: ["guangzhou-yongqing-fang", "chengdu-kuanzhai", "suzhou-pingjiang"] },
  { id: "na-02", dimension: "narrative", text: "以轴线、门户、地标承载国家与城市仪式叙事，定义街道的‘门面’身份。", conditions: { context: ["城市核心"] }, source: ["champs-elysees", "fifth-avenue"] },
  { id: "na-03", dimension: "narrative", text: "以‘效法自然/城市绿洲’理念定义项目灵魂，用自然哲学对抗城市刚性。", conditions: { context: ["生态", "公园", "滨水"] }, source: ["shenzhen-dayun-tiandi", "namba-parks", "iconsiam"] },
  { id: "na-04", dimension: "narrative", text: "高端项目以设计力与建筑师署名叙事，把街区变成露天建筑博物馆。", conditions: { context: ["高端"] }, source: ["omotesando"] },

  // ---------------- 交通接驳 transit ----------------
  { id: "tr-01", dimension: "transit", text: "TOD 把交通枢纽转化为目的地：轨道直达 + 立体动线，交通枢纽即流量入口。", conditions: { context: ["TOD"] }, source: ["namba-parks", "orchard-road", "siam-paragon", "roppongi-hills"] },
  { id: "tr-02", dimension: "transit", text: "滨水项目以码头与轨道双接驳，登船/登岸的‘电影感’入口强化目的地体验。", conditions: { context: ["滨水"] }, source: ["iconsiam", "clarke-quay"] },
  { id: "tr-03", dimension: "transit", text: "历史街区用巷道与多入口提升轨道渗透性，把步行网络与城市无缝衔接。", conditions: { context: ["历史街区"] }, source: ["covent-garden", "la-rambla"] },
  { id: "tr-04", dimension: "transit", text: "依托赛事/演艺巨量客流，同时以日常业态服务在地居民，平衡脉冲与常驻。", conditions: { context: ["新城", "生态"] }, source: ["shenzhen-dayun-tiandi"] },

  // ============ 以下由 Kimi 资料补入（42 条量化原则，案例 id 已对齐本库） ============
  // ---------------- 立面设计 facade ----------------
  { id: "k-fa-01", dimension: "facade", text: "首层通透性直接决定街道活力：连续、透明、可进入的底层界面是所有成功案例的底线。上层可以个性，首层必须开放。", conditions: {}, source: ["dk-stroget", "sanlitun-taikoo-li", "us-thegrove", "nl-lijnbaan"] },
  { id: "k-fa-02", dimension: "facade", text: "人行视角几乎感知不到退后的第三层。用退台把街巷视觉高度压到两层，是低密度街区避免压抑感的标准动作。", conditions: { form: ["院落街区", "线性街"] }, source: ["chengdu-taikoo-li", "omotesando", "nl-lijnbaan"] },
  { id: "k-fa-03", dimension: "facade", text: "太古里用钢结构玻璃做川西坡屋顶神韵，玉鸟集用仿夯土与金属转译良渚——简约里的一丝余韵才是文化转译，仿古构件堆砌是反面。", conditions: { context: ["历史街区"] }, source: ["chengdu-taikoo-li", "hz-yuniaoji", "sh-longhua", "shanghai-xintiandi"] },
  { id: "k-fa-04", dimension: "facade", text: "石区奢品/木区年轻、南区彩色/北区沉稳——让人看见材质就知道有什么品牌，立面分区天然降低寻路成本。", conditions: { form: ["院落街区"] }, source: ["sh-qiantan", "sanlitun-taikoo-li"] },
  { id: "k-fa-05", dimension: "facade", text: "连续檐篷、骑楼、挑檐让商业在雨雪烈日下依然可用；拱形连廊还能隐藏消防卷帘——装饰与规范一次解决。", conditions: { climate: ["亚热带", "热带", "地中海"] }, source: ["nl-lijnbaan", "shenzhen-dayun-tiandi", "sh-qiantan", "hz-yuniaoji"] },
  { id: "k-fa-06", dimension: "facade", text: "一条街只需要少数几个明星立面做记忆点，其余建筑必须甘当背景。表参道大师旗舰与 Hills 低层连续体量的关系即是范本。", conditions: {}, source: ["omotesando", "chengdu-taikoo-li"] },
  { id: "k-fa-07", dimension: "facade", text: "从 1953 年 Lijnbaan 到新天地，成功街区都对店招尺寸/材质/色彩实施模数化管控。商户个性让位于界面秩序，整体溢价反而更高。", conditions: { form: ["线性街", "院落街区"] }, source: ["nl-lijnbaan", "shanghai-xintiandi", "sz-huaihai"] },

  // ---------------- 景观设计 landscape ----------------
  { id: "k-ls-01", dimension: "landscape", text: "成都太古里景观约等于没有——铺装、几株银杏、散置艺术品。详略得当：街巷是主角，景观是留白。", conditions: {}, source: ["chengdu-taikoo-li", "dk-stroget", "omotesando"] },
  { id: "k-ls-02", dimension: "landscape", text: "草坪要能躺、跑道要能跑、喷泉要有演出时刻表。景观的使用率比观赏率更接近坪效。", conditions: { context: ["文旅", "生态", "公园", "滨水"] }, source: ["us-thegrove", "shenzhen-dayun-tiandi", "sh-qiantan"] },
  { id: "k-ls-03", dimension: "landscape", text: "漫广场镜水池倒映大慈寺、The Grove 音乐喷泉——成功街区通常只有一个有记忆点的水，且都与地标或演出绑定。", conditions: {}, source: ["chengdu-taikoo-li", "us-thegrove", "sh-longhua"] },
  { id: "k-ls-04", dimension: "landscape", text: "主草坪从第一天就按节庆主会场设计：电力、吊点、集散、草坪轮休都要预留。景观图纸上没有运营，开业后就没有活动。", conditions: { context: ["文旅", "生态", "公园", "滨水"] }, source: ["us-thegrove", "sh-longhua", "shenzhen-dayun-tiandi"] },
  { id: "k-ls-05", dimension: "landscape", text: "Gehl 的忠告：先让人能坐下来。可坐的边缘、花坛沿、台阶、装置基座——停留密度决定消费密度。", conditions: {}, source: ["dk-stroget", "us-thegrove", "nl-lijnbaan"] },
  { id: "k-ls-06", dimension: "landscape", text: "滑梯、玻璃桥、旋转座椅把人流拉向高层与深处——网红装置的 KPI 不是拍照量，是它把多少人送到了原本不去的楼层。", conditions: { form: ["院落街区", "综合体"] }, source: ["cd-luzhouli", "sh-qiantan"] },
  { id: "k-ls-07", dimension: "landscape", text: "表参道只用榉树，连续行道树塑造街道身份。树种做减法，阵列做乘法。", conditions: { form: ["线性街"] }, source: ["omotesando", "dk-stroget"] },

  // ---------------- 人流动线 circulation ----------------
  { id: "k-ci-01", dimension: "circulation", text: "快里/慢里、主街/里表参道、快街/慢街——所有成熟街区都有展示型快速环与探索型慢速巷两层动线，分别服务目的性消费与漫游消费。", conditions: { form: ["院落街区", "线性街"] }, source: ["chengdu-taikoo-li", "omotesando", "hz-yuniaoji", "sanlitun-taikoo-li"] },
  { id: "k-ci-02", dimension: "circulation", text: "太古里实测模数：独栋街墙 30-50m、组团 100-180m、单向街区总长 250-350m。超过 350m 必须设强节点重置步行意愿。", conditions: { form: ["院落街区"] }, source: ["chengdu-taikoo-li", "us-thegrove"] },
  { id: "k-ci-03", dimension: "circulation", text: "西广场(前导)→窄巷(抑)→东广场(扬/高潮)：先收后放，窄巷进入大广场的豁然开朗是动线设计的情绪节拍器。", conditions: { form: ["院落街区", "线性街"] }, source: ["chengdu-taikoo-li", "shanghai-xintiandi", "hz-yuniaoji"] },
  { id: "k-ci-04", dimension: "circulation", text: "广场必须落在动线交汇处并指向下一程：太古里三广场全部位于主动线交汇点，鹭洲里外三广场引流、内三广场聚客。", conditions: {}, source: ["chengdu-taikoo-li", "cd-luzhouli", "dk-stroget"] },
  { id: "k-ci-05", dimension: "circulation", text: "鹭洲里定量范本：扶梯服务半径约 30m、两部扶梯间距不超过 60m、垂直电梯外置。垂直交通密度决定高楼层存活率。", conditions: { form: ["院落街区", "综合体"] }, source: ["cd-luzhouli", "sh-qiantan", "sh-longhua"] },
  { id: "k-ci-06", dimension: "circulation", text: "成都太古里放弃近万㎡上盖指标做地铁广场、三里屯西区接入地铁、丹佛近站断面不对称加宽——接驳口的投入回报高于任何立面。", conditions: {}, source: ["chengdu-taikoo-li", "sanlitun-taikoo-li", "us-16thstreet"] },
  { id: "k-ci-07", dimension: "circulation", text: "丹佛 16 街：中央步行 7m + 巴士道 3m×2 + 人行道 6m，三色铺装分区；近站处随客流数据改为不对称断面。断面设计的输入是行为数据。", conditions: { form: ["线性街"] }, source: ["us-16thstreet", "shenzhen-dayun-tiandi"] },

  // ---------------- 精神堡垒 / 地标 landmark ----------------
  { id: "k-lm-01", dimension: "landmark", text: "大慈寺、龙华塔、石库门、州议会大厦——最强精神堡垒都是借来的真实历史或城市地标。设计的第一动作是盘点场地可借之势。", conditions: {}, source: ["chengdu-taikoo-li", "sh-longhua", "shanghai-xintiandi", "us-16thstreet"] },
  { id: "k-lm-02", dimension: "landmark", text: "西广场用广东会馆+欣庐+人形雕塑+水池完成门户意象；淮海街用牌坊+彩灯。入口需要可拍照的组合，而非孤立标识塔。", conditions: { form: ["院落街区", "线性街"] }, source: ["chengdu-taikoo-li", "sz-huaihai", "cd-luzhouli"] },
  { id: "k-lm-03", dimension: "landmark", text: "东广场以苹果旗舰对撞川西建筑收束视廊；端景建筑/装置让每条视廊都有句号，人在街区里才不会迷失方向。", conditions: {}, source: ["chengdu-taikoo-li", "omotesando", "us-16thstreet"] },
  { id: "k-lm-04", dimension: "landmark", text: "魔法森林、喷泉秀、复古电车——能坐、能玩、能等的装置才产生停留与传播；纯观赏雕塑的传播半衰期极短。", conditions: {}, source: ["sh-longhua", "us-thegrove", "cd-luzhouli"] },
  { id: "k-lm-05", dimension: "landmark", text: "Strøget 的广场珍珠链、玉鸟集的多广场地标群：把地标预算分散成序列，覆盖全动线，避免单点地标辐射半径衰减。", conditions: { form: ["线性街", "院落街区"] }, source: ["dk-stroget", "hz-yuniaoji", "us-thegrove"] },
  { id: "k-lm-06", dimension: "landmark", text: "The Grove 喷泉每半小时一场、漫广场节庆变庙会主会场——精神堡垒 + 事件日历才是完整设计，否则只是静止的构筑物。", conditions: { context: ["文旅", "城市核心"] }, source: ["us-thegrove", "chengdu-taikoo-li", "shenzhen-dayun-tiandi"] },

  // ---------------- 标识系统 signage ----------------
  { id: "k-sg-01", dimension: "signage", text: "清晰主环 + 节点广场 + 视线端景让人不依赖标识。太古里刻意的探索感是把双刃剑：惊喜与迷失之间，靠广场节点和旗舰立面兜底。", conditions: {}, source: ["chengdu-taikoo-li", "dk-stroget", "omotesando"] },
  { id: "k-sg-02", dimension: "signage", text: "城市级(精神堡垒/门户)、街区级(总平图/路口指引)、店铺级(店招/门牌)。三级缺一级，寻路体验就断层。", conditions: {}, source: ["chengdu-taikoo-li", "sz-huaihai", "sh-longhua"] },
  { id: "k-sg-03", dimension: "signage", text: "丹佛三色花岗岩分区、龙华会流线铺装嵌入 IP 元素、淮海街三层灯光——脚下与头顶的引导比立杆标识更优雅也更有效。", conditions: {}, source: ["us-16thstreet", "sh-longhua", "sz-huaihai"] },
  { id: "k-sg-04", dimension: "signage", text: "新天地严格管控历史立面店招、Lijnbaan 模数化店招、淮海街统一亚克力材质——管控越严，街区整体品牌溢价越高。", conditions: { form: ["线性街", "院落街区"] }, source: ["shanghai-xintiandi", "nl-lijnbaan", "sz-huaihai"] },
  { id: "k-sg-05", dimension: "signage", text: "淮海街透明亚克力的虚实光影 + 枯山水秩序、品牌色贯穿全套视觉——导视是街区 VI 在三维空间的落点，不是市政采购品。", conditions: { context: ["城市核心"] }, source: ["sz-huaihai", "sh-qiantan"] },
  { id: "k-sg-06", dimension: "signage", text: "街区式商业方向感天然弱于盒子 mall：需要品牌落位策略把人流引向深处，导视系统按运营调铺持续更新，图纸交付不是终点。", conditions: { form: ["院落街区"] }, source: ["chengdu-taikoo-li", "sanlitun-taikoo-li"] },

  // ---------------- 尺度与空间序列 scale ----------------
  { id: "k-sc-01", dimension: "scale", text: "芦原义信《街道的美学》：街宽与檐口高度比 1-2 最舒适。太古里 7-13m 街宽配两层建筑全部落在此区间；鹭洲里 18m 内街已显疏远。", conditions: { form: ["院落街区", "线性街"] }, source: ["chengdu-taikoo-li", "dk-stroget", "cd-luzhouli"] },
  { id: "k-sc-02", dimension: "scale", text: "主街 10-12m(展示)、次街 7-10m(漫游)、里巷 4-7m(亲密)、最小 3-5m(沉浸)。谱系内的突变(收放)制造空间节奏。", conditions: { form: ["院落街区", "线性街"] }, source: ["chengdu-taikoo-li", "shanghai-xintiandi", "hz-yuniaoji"] },
  { id: "k-sc-03", dimension: "scale", text: "2-3 层满铺肌理比塔楼 + 大广场更聚人气：界面连续、视线可达、租金坪效更高。太古里系全部是 2-3 层。", conditions: { form: ["院落街区"] }, source: ["chengdu-taikoo-li", "sanlitun-taikoo-li", "nl-lijnbaan", "shanghai-xintiandi"] },
  { id: "k-sc-04", dimension: "scale", text: "新天地外摆位是坪效最高的店铺；鹭洲里无外摆导致室外空间利用率低。外摆进深 ≥2.5m 才可用，设计阶段就要预留。", conditions: { form: ["院落街区", "线性街"] }, source: ["shanghai-xintiandi", "cd-luzhouli", "dk-stroget", "shenzhen-dayun-tiandi"] },
  { id: "k-sc-05", dimension: "scale", text: "里弄 D/H 0.5-1 在有强内容(历史/业态密度)时反而成立——挤出来的亲密感。但前提是界面内容与业态密度撑得住。", conditions: { context: ["历史街区"] }, source: ["shanghai-xintiandi", "hz-yuniaoji", "omotesando"] },
  { id: "k-sc-06", dimension: "scale", text: "丹佛：中央步行 7m、人行道 6m、近站 11m——每个数字对应一类客流行为。尺度不是审美判断，是行为预测。", conditions: { form: ["线性街"] }, source: ["us-16thstreet", "cd-luzhouli"] }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { PRINCIPLES, DIMENSIONS };
}
