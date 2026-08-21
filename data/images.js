// ============================================================================
// 案例配图清单 / Case Image Manifest (multi-image)
// ----------------------------------------------------------------------------
// 图片来源说明：
//   - 「via Wikimedia Commons」= CC 协议真实实拍照片（附摄影师署名 + 协议）
//   - 「AI 概念示意 · 请手动提供实拍」= 该案例暂无可用 CC 实拍，保留占位图
//   - 图片为本地相对路径，把整个文件夹（含 images/）一起发给同事即可离线查看
//   - images[0] 为封面图（quality score 最高），其余为补充图
// ============================================================================

const CASE_IMAGES = {
  "bj-trb-hutong": [
    { file:"images/bj-trb-hutong/01.jpg", caption:"Zhizhu Temple (20241214142214)", credit:"N509FZ · CC BY-SA 4.0 · via Wikimedia Commons" }
  ],
  "boston-newbury": [
    { file:"images/boston-newbury/01.jpg", caption:"-354--356 Newbury Street (12225383694)", credit:"Boston Transit Commission · Public domain · via Wikimedia Commons" },
    { file:"images/boston-newbury/02.jpg", caption:"2010 NewburySt Boston 1201", credit:"M2545 · CC0 · via Wikimedia Commons" },
    { file:"images/boston-newbury/03.jpg", caption:"2010 NewburySt Boston 1203", credit:"M2545 · CC0 · via Wikimedia Commons" },
    { file:"images/boston-newbury/04.jpg", caption:"2010 NewburySt Boston 1204", credit:"M2545 · CC0 · via Wikimedia Commons" },
    { file:"images/boston-newbury/05.jpg", caption:"2010 NewburySt Boston 1206", credit:"M2545 · CC0 · via Wikimedia Commons" }
  ],
  "cd-chongdeli": [
    { file:"images/cd-chongdeli/01.png", caption:"成都崇德里", credit:"AI 概念示意 · 请手动提供实拍（暂无可用 CC 实拍）" }
  ],
  "cd-luzhouli": [
    { file:"images/cd-luzhouli/01.png", caption:"成都建发鹭洲里", credit:"AI 概念示意 · 请手动提供实拍（暂无可用 CC 实拍）" }
  ],
  "champs-elysees": [
    { file:"images/champs-elysees/01.jpg", caption:"Avenue des Champs Elysée @ Paris (34318302056)", credit:"Guilhem Vellut from Paris, France · CC BY 2.0 · via Wikimedia Commons" },
    { file:"images/champs-elysees/02.jpg", caption:"Avenue des Champs Elysées (48044217132)", credit:"besopha · CC BY 2.0 · via Wikimedia Commons" },
    { file:"images/champs-elysees/03.jpg", caption:"Avenue des Champs-Élysées September 17, 2010", credit:"Jean-Marie Hullot from France · CC BY-SA 2.0 · via Wikimedia Commons" },
    { file:"images/champs-elysees/04.jpg", caption:"Avenue des Champs Elisees.501 - Paris", credit:"Fernando Losada Rodríguez · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/champs-elysees/05.jpg", caption:"Boutique Orange, Champs Elysées, Paris", credit:"Yann Forget · CC BY-SA 4.0 · via Wikimedia Commons" }
  ],
  "chengdu-kuanzhai": [
    { file:"images/chengdu-kuanzhai/01.jpg", caption:"Shops - Kuanzhai Alleys - Chengdu, China - DSC05305", credit:"Daderot · CC0 · via Wikimedia Commons" }
  ],
  "chengdu-taikoo-li": [
    { file:"images/chengdu-taikoo-li/01.png?v=2", caption:"001_at-a-glance-sino-ocean-taikoo-li-chengdu-retail-1", credit:"via www.swireproperties.com" },
    { file:"images/chengdu-taikoo-li/02.png?v=2", caption:"002_at-a-glance-sino-ocean-taikoo-li-chengdu-retail-2", credit:"via www.swireproperties.com" },
    { file:"images/chengdu-taikoo-li/03.png?v=2", caption:"003_at-a-glance-sino-ocean-taikoo-li-chengdu-retail-1", credit:"via www.swireproperties.com" },
    { file:"images/chengdu-taikoo-li/04.png?v=2", caption:"004_upper-house-chengdu_thumbnail", credit:"via www.swireproperties.com" },
    { file:"images/chengdu-taikoo-li/05.png?v=2", caption:"005_taikoo-li-chengdu-mixed", credit:"via www.swireproperties.com" },
    { file:"images/chengdu-taikoo-li/06.png?v=2", caption:"006_chengdu-1", credit:"via www.swireproperties.com" }
  ],
  "clarke-quay": [
    { file:"images/clarke-quay/01.jpg", caption:"Singapore Central Business District viewed from Clarke Quay 1", credit:"Zairon · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/clarke-quay/02.jpg", caption:"Singapore Central Business District viewed from Clarke Quay 2", credit:"Zairon · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/clarke-quay/03.jpg", caption:"Singapore Central Business District viewed from Clarke Quay 3", credit:"Zairon · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/clarke-quay/04.jpg", caption:"Singapore Central Business District viewed from Clarke Quay 5", credit:"Zairon · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/clarke-quay/05.jpg", caption:"Singapore Central Business District viewed from Clarke Quay 6", credit:"Zairon · CC BY-SA 4.0 · via Wikimedia Commons" }
  ],
  "covent-garden": [
    { file:"images/covent-garden/01.jpg", caption:"2024--15 September--London Covent Garden Market Building", credit:"LittleRoamingChief · CC BY 2.0 · via Wikimedia Commons" },
    { file:"images/covent-garden/02.jpg", caption:"City of Westminster , Covent Garden - geograph.org.uk - 5979824", credit:"Lewis Clarke · CC BY-SA 2.0 · via Wikimedia Commons" },
    { file:"images/covent-garden/03.jpg", caption:"'Heartbeat' in Covent Garden - geograph.org.uk - 4631415", credit:"Peter Trimming · CC BY-SA 2.0 · via Wikimedia Commons" },
    { file:"images/covent-garden/04.jpg", caption:"'Heartbeat' in Covent Garden - geograph.org.uk - 4631431", credit:"Peter Trimming · CC BY-SA 2.0 · via Wikimedia Commons" },
    { file:"images/covent-garden/05.jpg", caption:"'Heartbeat' in Covent Garden - geograph.org.uk - 4631437", credit:"Peter Trimming · CC BY-SA 2.0 · via Wikimedia Commons" }
  ],
  "cq-shibati": [
    { file:"images/cq-shibati/01.jpg", caption:"Eighteen Stairs 20260507", credit:"Suicasmo · CC0 · via Wikimedia Commons" },
    { file:"images/cq-shibati/02.jpg", caption:"Guanyin Cliff 观音岩（十八梯）, Chongqing, 2023 (53547150488)", credit:"JL Cogburn · CC BY-SA 2.0 · via Wikimedia Commons" },
    { file:"images/cq-shibati/03.jpg", caption:"Guanyin Cliff 观音岩（十八梯）, Chongqing, 2023 (53547291994)", credit:"JL Cogburn · CC BY-SA 2.0 · via Wikimedia Commons" },
    { file:"images/cq-shibati/04.jpg", caption:"Guanyin Cliff 观音岩（十八梯）, Chongqing, 2023 (53547400005)", credit:"JL Cogburn · CC BY-SA 2.0 · via Wikimedia Commons" },
    { file:"images/cq-shibati/05.jpg", caption:"原十八梯布局图", credit:"Daredemodaisuki 114514 · CC BY-SA 4.0 · via Wikimedia Commons" }
  ],
  "dk-stroget": [
    { file:"images/dk-stroget/01.jpg", caption:"20200327 KBH Stroeget GL Torv 50A3882 (49719494618)", credit:"News Oresund · CC BY 2.0 · via Wikimedia Commons" },
    { file:"images/dk-stroget/02.jpg", caption:"Strøget (maj)", credit:"RhinoMind · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/dk-stroget/03.jpg", caption:"Aarhus Strøget", credit:"Kenny Arne Lang Antonsen · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/dk-stroget/04.jpg", caption:"Aarhus, Strøget 2019", credit:"Kenny Arne Lang Antonsen · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/dk-stroget/05.jpg", caption:"Aarhus. Strøget 2019", credit:"Kenny Arne Lang Antonsen · CC BY-SA 4.0 · via Wikimedia Commons" }
  ],
  "fifth-avenue": [
    { file:"images/fifth-avenue/01.jpg", caption:"57th St 5th Av td (2018-08-16) 02 - 5th Avenue Bus Lane", credit:"Tdorante10 · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/fifth-avenue/02.jpg", caption:"59th St 5th Av td (2018-08-27) 20 - Fifth Avenue Bus Lane", credit:"Tdorante10 · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/fifth-avenue/03.jpg", caption:"5th Avenue and Bryant Park station 1", credit:"Daniel Schwen · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/fifth-avenue/04.jpg", caption:"5th Avenue and Bryant Park station 2", credit:"Daniel Schwen · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/fifth-avenue/05.jpg", caption:"59th St 5th Av td (2018-08-27) 09 - Grand Army Plaza", credit:"Tdorante10 · CC BY-SA 4.0 · via Wikimedia Commons" }
  ],
  "fz-sanfangqixiang": [
    { file:"images/fz-sanfangqixiang/01.jpg", caption:"Fuzhou Three Lanes and Seven Alleys Mainstreet", credit:"Lennartbj · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/fz-sanfangqixiang/02.jpg", caption:"20251101 三坊七巷 南后街叶氏民居 02", credit:"FradonStar · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/fz-sanfangqixiang/03.jpg", caption:"Fuzhou Sanfangqixiang 2019.03.13 11-15-28", credit:"Zhangzhugang · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/fz-sanfangqixiang/04.jpg", caption:"Fuzhou Sanfangqixiang 2019.03.13 11-16-06", credit:"Zhangzhugang · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/fz-sanfangqixiang/05.jpg", caption:"Fuzhou Sanfangqixiang 2019.03.13 11-20-47", credit:"Zhangzhugang · CC BY-SA 4.0 · via Wikimedia Commons" }
  ],
  "galleria-ve": [
    { file:"images/galleria-ve/01.jpg", caption:"Galleria Vittorio Emanuele II (45296173451)", credit:"Daniel from Glasgow, United Kingdom · CC BY 2.0 · via Wikimedia Commons" },
    { file:"images/galleria-ve/02.jpg", caption:"Galleria Vittorio Emanuele dal duomo", credit:"Clide06 · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/galleria-ve/03.jpg", caption:"Galleria Vittorio Emanuele II e piazza duomo", credit:"Giacomo Marzullo · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/galleria-ve/04.jpg", caption:"Milano - Galleria Vittorio Emanuele II - 2023-10-29 4281", credit:"C messier · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/galleria-ve/05.jpg", caption:"Milano - Galleria Vittorio Emanuele II - 4", credit:"Antonina Dattola · CC BY-SA 4.0 · via Wikimedia Commons" }
  ],
  "ginza": [
    { file:"images/ginza/01.jpg", caption:"Cartier Shop Ginza (10903589784)", credit:"Yoshikazu TAKADA from Tokyo, Japan · CC BY 2.0 · via Wikimedia Commons" },
    { file:"images/ginza/02.jpg", caption:"Elementary schoolkids in Ginza", credit:"Akira Takiguchi · CC BY 2.0 · via Wikimedia Commons" },
    { file:"images/ginza/03.jpg", caption:"Cemetery 2, Ginza, Tokyo, Japanjpg", credit:"gruntzooki · CC BY-SA 2.0 · via Wikimedia Commons" },
    { file:"images/ginza/04.jpg", caption:"Cemetery 3, Ginza, Tokyo, Japanjpg", credit:"gruntzooki · CC BY-SA 2.0 · via Wikimedia Commons" },
    { file:"images/ginza/05.jpg", caption:"Cemetery 4, Ginza, Tokyo, Japanjpg", credit:"gruntzooki · CC BY-SA 2.0 · via Wikimedia Commons" }
  ],
  "guangzhou-yongqing-fang": [
    { file:"images/guangzhou-yongqing-fang/01.jpg", caption:"Yongqing Dajie 2026", credit:"Tombus20032000 · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/guangzhou-yongqing-fang/02.jpg", caption:"Yongqingfang 1", credit:"钉钉 · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/guangzhou-yongqing-fang/03.jpg", caption:"Yongqingfang 2", credit:"钉钉 · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/guangzhou-yongqing-fang/04.jpg", caption:"Yongqingfang", credit:"钉钉 · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/guangzhou-yongqing-fang/05.jpg", caption:"广州永庆坊", credit:"钉钉 · CC BY-SA 4.0 · via Wikimedia Commons" }
  ],
  "high-line": [
    { file:"images/high-line/01.jpg", caption:"View of Statue of Liberty down 10th Avenue from the High Line (6240475187)", credit:"Tony Hisgett from Birmingham, UK · CC BY 2.0 · via Wikimedia Commons" },
    { file:"images/high-line/02.jpg", caption:"High Line (New York City) 2014", credit:"Marco Nürnberger from Nuremberg, Germany · CC BY 2.0 · via Wikimedia Commons" },
    { file:"images/high-line/03.jpg", caption:"High Line, New York 2012 62", credit:"Photograph by Mike Peel (www.mikepeel.net). · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/high-line/04.jpg", caption:"High Line, New York 2012 63", credit:"Photograph by Mike Peel (www.mikepeel.net). · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/high-line/05.jpg", caption:"Urban forestry seen from and on the High Line in New York (9239)", credit:"Lance Cheung/USDA · Public domain · via Wikimedia Commons" }
  ],
  "hoi-an": [
    { file:"images/hoi-an/01.jpg", caption:"2024-11-20 A restaurant in Hoi An Old Town at night 1", credit:"Alexkom000 · CC BY 4.0 · via Wikimedia Commons" },
    { file:"images/hoi-an/02.jpg", caption:"2024-11-20 A restaurant in Hoi An Old Town at night 2", credit:"Alexkom000 · CC BY 4.0 · via Wikimedia Commons" },
    { file:"images/hoi-an/03.jpg", caption:"2024-12-20 Hoi An Old Town at night 1", credit:"Alexkom000 · CC BY 4.0 · via Wikimedia Commons" },
    { file:"images/hoi-an/04.jpg", caption:"2024-12-20 Hoi An Old Town at night 2", credit:"Alexkom000 · CC BY 4.0 · via Wikimedia Commons" },
    { file:"images/hoi-an/05.jpg", caption:"2024-12-20 Hoi An Old Town at night 3", credit:"Alexkom000 · CC BY 4.0 · via Wikimedia Commons" }
  ],
  "hz-yuniaoji": [
    { file:"images/hz-yuniaoji/01.png", caption:"杭州玉鸟集", credit:"AI 概念示意 · 请手动提供实拍（暂无可用 CC 实拍）" }
  ],
  "iconsiam": [
    { file:"images/iconsiam/01.jpg", caption:"Iconsiam at Night (II)", credit:"This Photo was taken by Supanut Arunoprayote. Feel free to use any of my images · CC BY 4.0 · via Wikimedia Commons" },
    { file:"images/iconsiam/02.jpg", caption:"ICONSIAM AT NIGHT", credit:"Amiiiza · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/iconsiam/03.jpg", caption:"ไอคอนสยาม Grand Openning day Iconsiam of Thailand 15 Copyrights of Trisorn Triboon", credit:"Tris T7 · CC BY 4.0 · via Wikimedia Commons" },
    { file:"images/iconsiam/04.jpg", caption:"ไอคอนสยาม Grand Openning day Iconsiam of Thailand 2 Copyrights of Trisorn Triboon", credit:"Tris T7 · CC BY 4.0 · via Wikimedia Commons" },
    { file:"images/iconsiam/05.jpg", caption:"ไอคอนสยาม Grand Openning day Iconsiam of Thailand 26 Copyrights of Trisorn Triboon", credit:"Tris T7 · CC BY 4.0 · via Wikimedia Commons" }
  ],
  "istanbul-istiklal": [
    { file:"images/istanbul-istiklal/01.jpg", caption:"Istanbul - İstiklal Caddesi", credit:"Jorge Franganillo · CC BY 2.0 · via Wikimedia Commons" },
    { file:"images/istanbul-istiklal/02.jpg", caption:"İstiklal Avenue - Istiklal Street - İstiklâl Caddesi - Istanbul, Turkey (10583233815)", credit:"David Berkowitz from New York, NY, USA · CC BY 2.0 · via Wikimedia Commons" },
    { file:"images/istanbul-istiklal/03.jpg", caption:"İstiklal Avenue - Istiklal Street - İstiklâl Caddesi - Istanbul, Turkey (10583288925)", credit:"David Berkowitz from New York, NY, USA · CC BY 2.0 · via Wikimedia Commons" },
    { file:"images/istanbul-istiklal/04.jpg", caption:"İstiklal Avenue - Istiklal Street - İstiklâl Caddesi - Istanbul, Turkey (10583289166)", credit:"David Berkowitz from New York, NY, USA · CC BY 2.0 · via Wikimedia Commons" },
    { file:"images/istanbul-istiklal/05.jpg", caption:"İstiklal Avenue - Istiklal Street - İstiklâl Caddesi - Istanbul, Turkey (10583294235)", credit:"David Berkowitz from New York, NY, USA · CC BY 2.0 · via Wikimedia Commons" }
  ],
  "jiaxing-nanhu": [
    { file:"images/jiaxing-nanhu/01.png", caption:"嘉兴南湖天地", credit:"AI 概念示意 · 请手动提供实拍（暂无可用 CC 实拍）" }
  ],
  "kyoto-gion": [
    { file:"images/kyoto-gion/01.jpg", caption:"A view of Gion corner in Geisha district, Kyoto, Japan", credit:"Joli Rumi · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/kyoto-gion/02.jpg", caption:"GIO - Traditional wooden houses along a stone-paved street in Gion, Kyoto, Japan, 2015", credit:"Unknown · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/kyoto-gion/03.jpg", caption:"Gion street (house)", credit:"Ari Helminen · CC BY 2.0 · via Wikimedia Commons" },
    { file:"images/kyoto-gion/04.jpg", caption:"20111023 Gion2", credit:"Rainer Haeßner · CC BY-SA 3.0 · via Wikimedia Commons" },
    { file:"images/kyoto-gion/05.jpg", caption:"GIO - Women in yukata walking in Gion, Kyoto, Japan, 2015", credit:"Unknown · CC BY-SA 4.0 · via Wikimedia Commons" }
  ],
  "kyoto-nishiki": [
    { file:"images/kyoto-nishiki/01.jpg", caption:"20260428 Nishiki Markt 10 Kyoto, Japan anagoria", credit:"Anagoria · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/kyoto-nishiki/02.jpg", caption:"20260428 Nishiki Markt 11 Kyoto, Japan anagoria", credit:"Anagoria · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/kyoto-nishiki/03.jpg", caption:"20260428 Nishiki Markt 12 Kyoto, Japan anagoria", credit:"Anagoria · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/kyoto-nishiki/04.jpg", caption:"20260428 Nishiki Markt 13 Kyoto, Japan anagoria", credit:"Anagoria · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/kyoto-nishiki/05.jpg", caption:"20260428 Nishiki Markt 14 Kyoto, Japan anagoria", credit:"Anagoria · CC BY-SA 4.0 · via Wikimedia Commons" }
  ],
  "la-rambla": [
    { file:"images/la-rambla/01.jpg", caption:"Artist La Rambla 4", credit:"böhringer friedrich · CC BY-SA 2.5 · via Wikimedia Commons" },
    { file:"images/la-rambla/02.jpg", caption:"023 Barcelona des de l'edifici Colom, amb el Raval, la Rambla i el Gòtic", credit:"Enric · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/la-rambla/03.jpg", caption:"024 Barcelona des de l'edifici Colom, amb la Rambla i el Gòtic", credit:"Enric · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/la-rambla/04.jpg", caption:"080 El pla de la Boqueria i la Rambla (Barcelona)", credit:"Enric · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/la-rambla/05.jpg", caption:"091 Edifici a la Rambla, 84 (Barcelona)", credit:"Enric · CC BY-SA 4.0 · via Wikimedia Commons" }
  ],
  "macau-m8": [
    { file:"images/macau-m8/01.jpg", caption:"M8 Macau 27-12-2024(1)", credit:"LN9267 · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/macau-m8/02.jpg", caption:"M8 Macau 27-12-2024(2)", credit:"LN9267 · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/macau-m8/03.jpg", caption:"M8 Macau 27-12-2024(3)", credit:"LN9267 · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/macau-m8/04.jpg", caption:"M8 Macau 27-12-2024(4)", credit:"LN9267 · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/macau-m8/05.jpg", caption:"M8 Macau 27-12-2024(5)", credit:"LN9267 · CC BY-SA 4.0 · via Wikimedia Commons" }
  ],
  "namba-parks": [
    { file:"images/namba-parks/01.jpg", caption:"Kaldi Namba City", credit:"Mr.ちゅらさん · CC BY-SA 3.0 · via Wikimedia Commons" },
    { file:"images/namba-parks/02.jpg", caption:"Nankai namba station05s3200", credit:"663highland · CC BY 2.5 · via Wikimedia Commons" },
    { file:"images/namba-parks/03.jpg", caption:"Plaza Namba City", credit:"Mr.ちゅらさん · CC BY-SA 3.0 · via Wikimedia Commons" },
    { file:"images/namba-parks/04.jpg", caption:"Buysell Namba City", credit:"Mr.ちゅらさん · CC BY-SA 3.0 · via Wikimedia Commons" },
    { file:"images/namba-parks/05.jpg", caption:"Misugi Namba City", credit:"Mr.ちゅらさん · CC BY-SA 3.0 · via Wikimedia Commons" }
  ],
  "nj-laomendong": [
    { file:"images/nj-laomendong/01.jpg", caption:"Laomendong Gate, 202207", credit:"A Chinese user · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/nj-laomendong/02.jpg", caption:"Laomendong 2", credit:"钉钉 · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/nj-laomendong/03.jpg", caption:"Laomendong 3", credit:"钉钉 · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/nj-laomendong/04.jpg", caption:"Laomendong 4", credit:"钉钉 · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/nj-laomendong/05.jpg", caption:"Laomendong 5", credit:"钉钉 · CC BY-SA 4.0 · via Wikimedia Commons" }
  ],
  "nl-lijnbaan": [
    { file:"images/nl-lijnbaan/01.jpg", caption:"KPN shop Lijnbaan, Rotterdam-Centrum, Rotterdam (2021) 01", credit:"Donald Trung Quoc Don (Chữ Hán: 徵國單) - Wikimedia Commons - © CC BY-SA 4.0 Intern · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/nl-lijnbaan/02.jpg", caption:"Bloemperken en winkelende mensen op de Korte Lijnbaan met het stadhuis eracher 1961", credit:"Anna (A.M.E.) de Ruijter · CC0 · via Wikimedia Commons" },
    { file:"images/nl-lijnbaan/03.jpg", caption:"Lijnbaan, Rotterdam (32410127087)", credit:"Daniel from Glasgow, United Kingdom · CC BY 2.0 · via Wikimedia Commons" },
    { file:"images/nl-lijnbaan/04.jpg", caption:"Lijnbaan, Rotterdam (32410128627)", credit:"Daniel from Glasgow, United Kingdom · CC BY 2.0 · via Wikimedia Commons" },
    { file:"images/nl-lijnbaan/05.jpg", caption:"Lijnbaan, Rotterdam (46628913134)", credit:"Daniel from Glasgow, United Kingdom · CC BY 2.0 · via Wikimedia Commons" }
  ],
  "omotesando": [
    { file:"images/omotesando/02.jpg", caption:"Gallery in Omotesando", credit:"Syced · CC0 · via Wikimedia Commons" },
    { file:"images/omotesando/03.jpg", caption:"\"Tours\" French restaurant in Omotesando", credit:"Syced · CC0 · via Wikimedia Commons" },
    { file:"images/omotesando/04.jpg", caption:"Construction in Omotesando near 団地", credit:"Syced · CC0 · via Wikimedia Commons" },
    { file:"images/omotesando/05.jpg", caption:"L'Occitane en Provence, shop in Omotesando", credit:"Syced · CC0 · via Wikimedia Commons" }
  ],
  "orchard-road": [
    { file:"images/orchard-road/02.jpg", caption:"Singapore-Orchard Road-Mandarin Hotel-1973-74-WUS08142", credit:"Rainer Halama · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/orchard-road/03.jpg", caption:"Singapore-Orchard Road-Mandarin Hotel-1973-74-WUS08171", credit:"Rainer Halama · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/orchard-road/04.jpg", caption:"Aviewoforchardroad", credit:"TriNitrobrick · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/orchard-road/05.jpg", caption:"Haze on Orchard Road September 2015", credit:"Nick-D · CC BY-SA 4.0 · via Wikimedia Commons" }
  ],
  "regent-street": [
    { file:"images/regent-street/02.jpg", caption:"283a, 281-287, 273, 275, 275a and 281a Regent Street, London, August 2023", credit:"No Swan So Fine · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/regent-street/03.jpg", caption:"288-300 Regent Street, London, August 2023", credit:"No Swan So Fine · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/regent-street/04.jpg", caption:"302-312, Regent Street, August 2021 (2)", credit:"No Swan So Fine · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/regent-street/05.jpg", caption:"302-312, Regent Street, August 2021", credit:"No Swan So Fine · CC BY-SA 4.0 · via Wikimedia Commons" }
  ],
  "rodeo-drive": [
    { file:"images/rodeo-drive/02.jpg", caption:"Via Rodeo Drive", credit:"Prayitno from Los Angeles, USA · CC BY 2.0 · via Wikimedia Commons" },
    { file:"images/rodeo-drive/03.jpg", caption:"Beverly Hills, Los Angeles - CA - Cartello Rodeo", credit:"Sidvics · CC BY-SA 3.0 · via Wikimedia Commons" },
    { file:"images/rodeo-drive/04.jpg", caption:"Rodeo Drive 2", credit:"Misaochan · CC BY-SA 3.0 · via Wikimedia Commons" },
    { file:"images/rodeo-drive/05.jpg", caption:"Rodeo & Rodeo Dr. Beberly Hills, CA (Sebastian Stepper)", credit:"Sebastianstepper · CC BY-SA 3.0 · via Wikimedia Commons" }
  ],
  "roppongi-hills": [
    { file:"images/roppongi-hills/02.jpg", caption:"Big red ball stuck in Roppongi Hills", credit:"Syced · CC0 · via Wikimedia Commons" },
    { file:"images/roppongi-hills/03.jpg", caption:"\"Trick\" New Movie Premiere @ Roppongi Hills (11421051974)", credit:"Guilhem Vellut from Annecy, France · CC BY 2.0 · via Wikimedia Commons" },
    { file:"images/roppongi-hills/04.jpg", caption:"Roppongi Hills (11421227243)", credit:"Guilhem Vellut from Annecy, France · CC BY 2.0 · via Wikimedia Commons" },
    { file:"images/roppongi-hills/05.jpg", caption:"Roppongi Art Night 2014", credit:"Nicolas1981 · CC BY-SA 3.0 · via Wikimedia Commons" }
  ],
  "sanlitun-taikoo-li": [
    { file:"images/sanlitun-taikoo-li/01.png?v=2", caption:"001_20230425spltls-tune--16x9", credit:"via www.swireproperties.com" },
    { file:"images/sanlitun-taikoo-li/02.png?v=2", caption:"002_20211203_tls-west", credit:"via www.swireproperties.com" },
    { file:"images/sanlitun-taikoo-li/03.png?v=2", caption:"003_20230425spltls-tune--16x9", credit:"via www.swireproperties.com" },
    { file:"images/sanlitun-taikoo-li/04.png?v=2", caption:"004_taikoo-li-chengdu-mixed", credit:"via www.swireproperties.com" },
    { file:"images/sanlitun-taikoo-li/05.png?v=2", caption:"005_tlq_936px_thumbnail", credit:"via www.swireproperties.com" },
    { file:"images/sanlitun-taikoo-li/06.png?v=2", caption:"006_2023051", credit:"via www.swireproperties.com" }
  ],
  "seoul-bukchon": [
    { file:"images/seoul-bukchon/02.jpg", caption:"Bukchon Hanok Village 01", credit:"Bgag · CC0 · via Wikimedia Commons" },
    { file:"images/seoul-bukchon/03.jpg", caption:"Bukchon Hanok Village 03", credit:"Bgag · CC0 · via Wikimedia Commons" },
    { file:"images/seoul-bukchon/04.jpg", caption:"Bukchon Hanok Village 04", credit:"Bgag · CC0 · via Wikimedia Commons" },
    { file:"images/seoul-bukchon/05.jpg", caption:"Bukchon Hanok Village 05", credit:"Bgag · CC0 · via Wikimedia Commons" }
  ],
  "seoul-ikseondong": [
    { file:"images/seoul-ikseondong/02.jpg", caption:"Ikseon-dong 익선동 October 1 2020 10", credit:"S h y numis · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/seoul-ikseondong/03.jpg", caption:"Ikseon-dong 익선동 October 1 2020 11", credit:"S h y numis · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/seoul-ikseondong/04.jpg", caption:"Ikseon-dong 익선동 October 1 2020 2", credit:"S h y numis · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/seoul-ikseondong/05.jpg", caption:"Ikseon-dong 익선동 October 1 2020 3", credit:"S h y numis · CC BY-SA 4.0 · via Wikimedia Commons" }
  ],
  "sh-columbia-circle": [
    { file:"images/sh-columbia-circle/01.png", caption:"上生·新所", credit:"AI 概念示意 · 请手动提供实拍（暂无可用 CC 实拍）" }
  ],
  "sh-dream-center": [
    { file:"images/sh-dream-center/01.png", caption:"上海梦中心", credit:"AI 概念示意 · 请手动提供实拍（暂无可用 CC 实拍）" }
  ],
  "sh-longhua": [
    { file:"images/sh-longhua/02.jpg", caption:"20191113 Longhua Temple front gate-1", credit:"Balon Greyjoy · CC0 · via Wikimedia Commons" },
    { file:"images/sh-longhua/03.jpg", caption:"20191113 Longhua Temple lantern-1", credit:"Balon Greyjoy · CC0 · via Wikimedia Commons" },
    { file:"images/sh-longhua/04.jpg", caption:"20191113 Longhua Temple lantern-2", credit:"Balon Greyjoy · CC0 · via Wikimedia Commons" },
    { file:"images/sh-longhua/05.jpg", caption:"20191113 Longhua Temple lantern-3", credit:"Balon Greyjoy · CC0 · via Wikimedia Commons" }
  ],
  "sh-qiantan": [
    { file:"images/sh-qiantan/02.jpg", caption:"Taikoo Li Qiantan", credit:"钉钉 · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/sh-qiantan/03.jpg", caption:"Taikoo Li Qiantan１", credit:"钉钉 · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/sh-qiantan/04.jpg", caption:"前滩太古里 1", credit:"钉钉 · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/sh-qiantan/05.jpg", caption:"前滩太古里商场内部", credit:"钉钉 · CC BY-SA 4.0 · via Wikimedia Commons" }
  ],
  "sh-sinan-mansions": [
    { file:"images/sh-sinan-mansions/02.jpg", caption:"Sinan Mansions Shanghai", credit:"Livelikerw · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/sh-sinan-mansions/03.jpg", caption:"思南路48号住宅", credit:"Antigng · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/sh-sinan-mansions/04.jpg", caption:"Sinan Mansions, Shanghai", credit:"钉钉 · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/sh-sinan-mansions/05.jpg", caption:"思南路46号·住宅·上海", credit:"Legolas1024 · CC BY-SA 3.0 · via Wikimedia Commons" }
  ],
  "sh-tianzifang": [
    { file:"images/sh-tianzifang/02.jpg", caption:"Tianzifang 2", credit:"钉钉 · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/sh-tianzifang/03.jpg", caption:"Tianzifang 3", credit:"钉钉 · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/sh-tianzifang/04.jpg", caption:"Passage in Tianzifang Area", credit:"そらみみ · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/sh-tianzifang/05.jpg", caption:"Tianzifang 21641-Shanghai (33029166756)", credit:"xiquinhosilva · CC BY 2.0 · via Wikimedia Commons" }
  ],
  "shanghai-xintiandi": [
    { file:"images/shanghai-xintiandi/01.jpg?v=2", caption:"001_DJI_0219-3000x1999", credit:"via 上海新天地官方" },
    { file:"images/shanghai-xintiandi/02.jpg?v=2", caption:"002_DJI_0233-1-3000x1999", credit:"via 上海新天地官方" },
    { file:"images/shanghai-xintiandi/03.jpg?v=2", caption:"003_DSC01133-3000x2001", credit:"via 上海新天地官方" },
    { file:"images/shanghai-xintiandi/04.jpg?v=2", caption:"004_________________04-3000x2001", credit:"via 上海新天地官方" },
    { file:"images/shanghai-xintiandi/05.jpg?v=2", caption:"005_________________01-3000x2000", credit:"via 上海新天地官方" },
    { file:"images/shanghai-xintiandi/06.jpg?v=2", caption:"006_______Social-House____4F_01-3000x2000", credit:"via 上海新天地官方" },
    { file:"images/shanghai-xintiandi/07.jpg?v=2", caption:"007_WechatIMG1118-cut", credit:"via 上海新天地官方" },
    { file:"images/shanghai-xintiandi/08.jpg?v=2", caption:"008_WechatIMG1119", credit:"via 上海新天地官方" },
    { file:"images/shanghai-xintiandi/09.jpg?v=2", caption:"009_WechatIMG1120", credit:"via 上海新天地官方" },
    { file:"images/shanghai-xintiandi/10.jpg?v=2", caption:"010_WechatIMG1121", credit:"via 上海新天地官方" },
    { file:"images/shanghai-xintiandi/11.jpg?v=2", caption:"011_XINTIANDISHISHANG2", credit:"via 上海新天地官方" },
    { file:"images/shanghai-xintiandi/12.jpg?v=2", caption:"012___-THE-HOSUE", credit:"via 上海新天地官方" },
    { file:"images/shanghai-xintiandi/13.jpg?v=2", caption:"013________", credit:"via 上海新天地官方" },
    { file:"images/shanghai-xintiandi/14.jpg?v=2", caption:"014_048bd43b5694ad56013a46fc68193ae9", credit:"via 上海新天地官方" },
    { file:"images/shanghai-xintiandi/15.jpg?v=2", caption:"015______2-3000x2001", credit:"via 上海新天地官方" },
    { file:"images/shanghai-xintiandi/16.jpg?v=2", caption:"016_1", credit:"via 上海新天地官方" },
    { file:"images/shanghai-xintiandi/17.jpg?v=2", caption:"017__________-3000x2000", credit:"via 上海新天地官方" },
    { file:"images/shanghai-xintiandi/18.jpg?v=2", caption:"018_____-22-3000x2000", credit:"via 上海新天地官方" },
    { file:"images/shanghai-xintiandi/19.jpg?v=2", caption:"019_Feng_Mian_Tu_2_Xuan_1", credit:"via 上海新天地官方" },
    { file:"images/shanghai-xintiandi/20.jpg?v=2", caption:"020_8392272ecef8b3d3b38a106272f80d96", credit:"via 上海新天地官方" },
    { file:"images/shanghai-xintiandi/21.jpg?v=2", caption:"021_____-3000x1987", credit:"via 上海新天地官方" },
    { file:"images/shanghai-xintiandi/22.jpg?v=2", caption:"022_1-_Feng_Mian_Tu-1", credit:"via 上海新天地官方" },
    { file:"images/shanghai-xintiandi/23.jpg?v=2", caption:"023_____-3000x2002", credit:"via 上海新天地官方" },
    { file:"images/shanghai-xintiandi/24.jpg?v=2", caption:"024_____-3000x2002", credit:"via 上海新天地官方" },
    { file:"images/shanghai-xintiandi/25.png?v=2", caption:"025_IFCX-jpg", credit:"via 上海新天地官方" },
    { file:"images/shanghai-xintiandi/26.jpg?v=2", caption:"026_DJI_0233", credit:"via 上海新天地官方" }
  ],
  "shenzhen-dayun-tiandi": [
    { file:"images/shenzhen-dayun-tiandi/01.jpg?v=2", caption:"001_f048a1318b6e7c62", credit:"via www.ovalpartnership.com" },
    { file:"images/shenzhen-dayun-tiandi/02.jpg?v=2", caption:"002_P1019097", credit:"via www.ovalpartnership.com" },
    { file:"images/shenzhen-dayun-tiandi/03.jpg?v=2", caption:"003_DJI_0720", credit:"via www.ovalpartnership.com" }
  ],
  "shenzhen-happy-harbor": [
    { file:"images/shenzhen-happy-harbor/02.jpg", caption:"SZ 深圳 Shenzhen 寶安區 Bao'An 歡樂港灣商場 OH Bay Baoan Shopping Mall shop 57Cool War Games July ...", credit:"QINGFATTIEAM 2002 · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/shenzhen-happy-harbor/03.jpg", caption:"SZ 深圳 Shenzhen 寶安區 Bao'An 歡樂港灣商場 OH Bay Baoan Shopping Mall shop 57Cool War Games July ...", credit:"QINGFATTIEAM 2002 · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/shenzhen-happy-harbor/04.jpg", caption:"SZ 深圳 Shenzhen 寶安區 Bao'An 歡樂港灣商場 OH Bay Baoan Shopping Mall shop 57Cool War Games July ...", credit:"QINGFATTIEAM 2002 · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/shenzhen-happy-harbor/05.jpg", caption:"SZ 深圳 Shenzhen 寶安區 Bao'An 歡樂港灣商場 OH Bay Baoan Shopping Mall shop 57Cool War Games July ...", credit:"QINGFATTIEAM 2002 · CC BY-SA 4.0 · via Wikimedia Commons" }
  ],
  "siam-paragon": [
    { file:"images/siam-paragon/02.jpg", caption:"Paragon Shopping Mall by Trisorn Triboon 02", credit:"Tris T7 · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/siam-paragon/03.jpg", caption:"GE-paragon-20201210", credit:"DMS WIKI · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/siam-paragon/04.jpg", caption:"Meland SiamParagon 20251205", credit:"DMS WIKI · CC BY 4.0 · via Wikimedia Commons" },
    { file:"images/siam-paragon/05.jpg", caption:"Books Kinokuniya in Siam Paragon 201801", credit:"Wpcpey · CC BY-SA 4.0 · via Wikimedia Commons" }
  ],
  "suzhou-pingjiang": [
    { file:"images/suzhou-pingjiang/02.jpg", caption:"Suzhou Pingjiang Wanda Plaza Block B-20260311", credit:"Shwangtianyuan · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/suzhou-pingjiang/03.jpg", caption:"Suzhou Pingjiang Wanda Plaza Block C-20260311", credit:"Shwangtianyuan · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/suzhou-pingjiang/04.jpg", caption:"Pingjiang Rd Area (1)", credit:"Leiem · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/suzhou-pingjiang/05.jpg", caption:"Near-Pingjiang-Road", credit:"AlexHe34 · CC BY-SA 3.0 · via Wikimedia Commons" }
  ],
  "sydney-rocks": [
    { file:"images/sydney-rocks/02.jpg", caption:"Convict era building fronting a alley in the rocks district of Sydney", credit:"Returned dude12345 · CC0 · via Wikimedia Commons" },
    { file:"images/sydney-rocks/03.jpg", caption:"Argyle Street, The Rocks, Sydney during Vivid 01", credit:"Kgbo · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/sydney-rocks/04.jpg", caption:"Rockpool Restaurant - The Rocks, Sydney, NSW (7889973238)", credit:"sv1ambo · CC BY 2.0 · via Wikimedia Commons" },
    { file:"images/sydney-rocks/05.jpg", caption:"Rockpool Restaurant - The Rocks, Sydney, NSW (7889974926)", credit:"sv1ambo · CC BY 2.0 · via Wikimedia Commons" }
  ],
  "sz-bay-cultural-plaza": [
    { file:"images/sz-bay-cultural-plaza/02.jpg", caption:"Shenzhen Bay Cultural Square 2", credit:"liunanno · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/sz-bay-cultural-plaza/03.jpg", caption:"Shenzhen Bay Cultural Square 3", credit:"liunanno · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/sz-bay-cultural-plaza/04.jpg", caption:"深圳湾文化广场 - 54975951103", credit:"NAN LIU · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/sz-bay-cultural-plaza/05.jpg", caption:"深圳湾文化广场", credit:"NAN LIU · CC BY-SA 4.0 · via Wikimedia Commons" }
  ],
  "sz-huaihai": [
    { file:"images/sz-huaihai/01.png", caption:"苏州淮海街", credit:"AI 概念示意 · 请手动提供实拍（暂无可用 CC 实拍）" }
  ],
  "toronto-distillery": [
    { file:"images/toronto-distillery/02.jpg", caption:"DistilleryDistrictHeart", credit:"Raysonho @ Open Grid Scheduler / Scalable Grid Engine · CC0 · via Wikimedia Commons" },
    { file:"images/toronto-distillery/03.jpg", caption:"1Ukrainian War Veterans Distillery Toronto 1", credit:"Mykola Swarnyk · CC BY-SA 3.0 · via Wikimedia Commons" },
    { file:"images/toronto-distillery/04.jpg", caption:"Building 63 of the Distillery District", credit:"Óðinn · CC BY-SA 2.5 ca · via Wikimedia Commons" },
    { file:"images/toronto-distillery/05.jpg", caption:"Buildings 3 (grist mill) and 5 (stone distillery) of the Distillery District", credit:"Óðinn · CC BY-SA 2.5 ca · via Wikimedia Commons" }
  ],
  "us-16thstreet": [
    { file:"images/us-16thstreet/02.jpg", caption:"16th Street Mall northwest past Tremont Place", credit:"Dough4872 · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/us-16thstreet/03.jpg", caption:"16th St Plaza", credit:"RuralResurrection · CC BY 4.0 · via Wikimedia Commons" },
    { file:"images/us-16thstreet/04.jpg", caption:"16th St Mall, Denver, at sunset last night (2795970007)", credit:"Dave Winer from USA · CC BY-SA 2.0 · via Wikimedia Commons" },
    { file:"images/us-16thstreet/05.jpg", caption:"16th Street Mall Construction2 Denver CO 2024", credit:"Larry D. Moore · CC BY 4.0 · via Wikimedia Commons" }
  ],
  "us-thegrove": [
    { file:"images/us-thegrove/02.jpg", caption:"THE GROVE Los Angeles", credit:"Prayitno from Los Angeles, USA · CC BY 2.0 · via Wikimedia Commons" },
    { file:"images/us-thegrove/03.jpg", caption:"Santa Claus at Willow Grove Park Mall at Christmas", credit:"Dough4872 · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/us-thegrove/04.jpg", caption:"Willow Grove Park Mall carousel", credit:"Dough4872 · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/us-thegrove/05.jpg", caption:"Willow Grove Park Mall first floor near Bloomingdale's", credit:"Dough4872 · CC BY-SA 4.0 · via Wikimedia Commons" }
  ],
  "xian-qujiang": [
    { file:"images/xian-qujiang/01.png", caption:"西安曲江创意谷", credit:"AI 概念示意 · 请手动提供实拍（暂无可用 CC 实拍）" }
  ],
  "yunnan-dongfengyun": [
    { file:"images/yunnan-dongfengyun/02.jpg", caption:"東方韻特色小鎮 20191224155438 01", credit:"Ping an Chang · CC BY-SA 4.0 · via Wikimedia Commons" },
    { file:"images/yunnan-dongfengyun/03.jpg", caption:"東方韻特色小鎮 20191224155438 04", credit:"Ping an Chang · CC BY-SA 4.0 · via Wikimedia Commons" }
  ]
};

if (typeof module !== "undefined" && module.exports) { module.exports = { CASE_IMAGES }; }