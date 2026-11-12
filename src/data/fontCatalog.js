/* 字体资产档案（全站字体规划的单一数据源）
 *
 * 只读来源：fontTools ttLib 直接读取各 woff2/ttf 的 name / cmap / OS-2 表（2026-09-27），
 * 以及 @fontsource 各包的 metadata.json。样张页 src/pages/FontSpecimen.jsx 与
 * docs/fonts.md 都消费本文件，避免「页面/文档各写一份」而漂移。
 *
 * 本文件只做「识别 + 风格分析 + 待裁决」的数据登记，不改变任何生产字体决策；
 * 生产是否采纳由 V1–V10 逐项验证后，再回写 design.md / tokens.css。
 */

/* ── 一、字体资产总表 ───────────────────────────────────────────── */
export const FONT_ASSETS = [
  {
    id: 'zhi-mang-xing',
    family: 'Zhi Mang Xing',
    cn: '志莽行书（行楷）',
    kind: 'display',
    status: 'in-use',
    file: 'src/assets/fonts/zhi-mang-xing-subset.woff2',
    origin: '自托管子集 · @fontsource/zhi-mang-xing v19',
    size: '33 KB',
    codepoints: 120,
    unitsPerEm: 1000,
    weight: '400（单字重）',
    license: 'OFL-1.1',
    copyright: 'Copyright 2018 The ZhiMangXing Project Authors',
    usedBy: '`--font-display`：各节中文标题 / 成员姓氏字头像 / 成员引文',
    style: {
      skeleton: '毛笔行楷，赵体一路，结体取横势',
      contrast: '中等，提按可见',
      terminals: '出锋、牵丝连带，起笔多藏锋',
      counter: '字面偏小，中宫收紧',
      width: '偏窄，长句会挤',
      mood: '书卷、沉静、田野笔记',
      mix: '拉丁与数字为辅，字形弱、不建议承载英文'
    },
    verdict: 'V1'
  },
  {
    id: 'iconfont',
    family: 'iconfont',
    cn: '主题切换图标字形',
    kind: 'icon',
    status: 'in-use',
    file: 'src/assets/font_f3y78zakpcq/iconfont.ttf',
    origin: '阿里 iconfont 导出包',
    size: '2 KB',
    codepoints: 1,
    unitsPerEm: 1024,
    weight: '400',
    license: 'iconfont 导出（未单列许可）',
    copyright: 'Created by iconfont',
    usedBy: 'ThemeToggle：单字形 U+E6E8',
    style: null,
    verdict: 'V4'
  },
  {
    id: 'geist-variable',
    family: 'Geist Variable',
    cn: 'Geist 可变无衬线（拉丁）',
    kind: 'body',
    status: 'in-use',
    file: '@fontsource-variable/geist',
    origin: 'Vercel Geist（Google Fonts 分发）',
    size: '按分包 unicode-range 加载',
    codepoints: '拉丁 / 西里尔 / 越南语',
    unitsPerEm: '—',
    weight: '100–900（可变 wght）',
    license: 'OFL-1.1',
    copyright: 'Copyright 2024 The Geist Project Authors',
    usedBy: '`--font-body` 拉丁部分：导航 / 按钮 / 品牌字标 / 正文英文',
    style: {
      skeleton: '几何无衬线',
      contrast: '无',
      terminals: '平切',
      counter: '中性',
      width: '常规',
      mood: '现代、精密、界面',
      mix: '与 Noto Sans SC 搭配承担中英混排'
    },
    verdict: null
  },
  {
    id: 'noto-sans-sc',
    family: 'Noto Sans SC Variable',
    cn: '思源黑体（简体中文）',
    kind: 'body',
    status: 'in-use',
    file: '@fontsource-variable/noto-sans-sc',
    origin: 'Google Noto（Google Fonts 分发）',
    size: '按分包 unicode-range 加载',
    codepoints: '简体中文 / 拉丁 / 西里尔',
    unitsPerEm: '—',
    weight: '100–900（可变 wght）',
    license: 'OFL-1.1',
    copyright: 'Google Inc.',
    usedBy: '`--font-body` 中文部分：正文 / 标题 / 界面文字',
    style: {
      skeleton: '人文无衬线',
      contrast: '无',
      terminals: '平切',
      counter: '中性偏开',
      width: '常规',
      mood: '中性、易读、无主张',
      mix: '中文主力；700/800 用于 T / W 级'
    },
    verdict: 'V8'
  },
  {
    id: 'geist-mono',
    family: 'Geist Mono',
    cn: 'Geist 等宽（拉丁）',
    kind: 'mono',
    status: 'in-use',
    file: '@fontsource/geist-mono',
    origin: 'Vercel Geist（Google Fonts 分发）',
    size: '按分包 unicode-range 加载（100–900 静态）',
    codepoints: '拉丁 / 西里尔 / symbols2',
    unitsPerEm: '—',
    weight: '100–900',
    license: 'OFL-1.1',
    copyright: 'Copyright 2024 The Geist Project Authors',
    usedBy: '`--font-mono`：节序 / 编号 / 英文 caps 标签 / 时间戳',
    style: {
      skeleton: '几何等宽',
      contrast: '无',
      terminals: '平切',
      counter: '中性',
      width: '等宽',
      mood: '现代、克制、仪器',
      mix: '拉丁与数字；中文回退 Noto Sans SC'
    },
    verdict: 'V3'
  }
];

/* ── 二、文字分级（design.md §4.1 的锚点，供样张按角色陈列） ────── */
export const TYPE_ROLES = [
  { id: 'D1', name: '展示·首屏主标', family: '--font-display', size: '--text-display', weight: 400, tracking: '0.04em', cases: '原样', color: '--color-photo-warm', anchor: 'Slogan .hero__title', sample: '启迪生命 / 扉向未来' },
  { id: 'D2', name: '展示·节标', family: '--font-display', size: '--text-display-s', weight: 400, tracking: '0.04em', cases: '原样', color: '--color-photo-warm', anchor: 'About/Studios/Members/Join __title', sample: '因热爱而启程 · 特色工作室 · 繁花 · 从好奇出发' },
  { id: 'D3', name: '展示·短句', family: '--font-display', size: '--text-lg ~ --text-md', weight: 400, tracking: '0.02–0.04em', cases: '原样', color: '--color-photo-warm / --color-eco-bright', anchor: '成员引文 / 姓氏字头像 / DriftWall', sample: '在显微镜下第一次看清花粉的形态时' },
  { id: 'W', name: '品牌字标', family: '--font-body', size: '导航 --text-md · 首屏 clamp(2.25–4.5rem)', weight: 800, tracking: '-0.02 ~ -0.035em', cases: '原样', color: '--color-eco-bright + --color-photo-ink', anchor: 'Slogan__wordmark / CardNav .logo-wordmark', sample: 'EcoRem · Eco · 生态 — Rem · 修护' },
  { id: 'T', name: '标题（界面黑体）', family: '--font-body', size: '--text-md / --text-lg', weight: '600–800', tracking: '-0.01em', cases: '原样', color: '--color-photo-ink', anchor: '卡片名 / 部门名 / 面板标题 / h1,h2', sample: '生生不息 · DATASEEK · 秘书部' },
  { id: 'L', name: '行文', family: '--font-body', size: 'L1 --text-md · L2 --text-base · L3 --text-sm', weight: '400（强调 700）', tracking: '0', cases: '原样', color: '主 --color-photo-ink / 次 --color-photo-muted', anchor: 'About__copy / 文章 body / 卡片 desc', sample: '协会秉持「启迪生命、扉向未来」的理念，围绕学术交流、科技创新开展活动。' },
  { id: 'U', name: '界面', family: '--font-body', size: 'CTA --text-base · 导航 --text-sm~--text-base · 标签 --text-xs', weight: '400–600', tracking: '0.04–0.08em（中文标签）', cases: '原样', color: '--color-accent-bright / --color-photo-ink', anchor: 'hero__cta / 导航 / 筛选标签', sample: '加入我们 · 学术交流 · 科创实践' },
  { id: 'M', name: '仪器·元数据', family: '--font-mono', size: 'M1 --text-xs · M2 --text-xs · M3 10–11px', weight: '400–500', tracking: '0.12–0.2em', cases: 'UPPERCASE', color: '--color-photo-muted（编号可 --color-eco-bright）', anchor: '节序 __index / __gloss / __no / __cue / 时间戳', sample: '01 · ABOUT · STUDIO NO.01 · JXAU · BIQIF' }
];

/* ── 三、字阶候选（V5） ─────────────────────────────────────────── */
/* px18 = 在 18px 根字号下的换算值；1.25 主三度：lg 1.5625 → xl 1.953 → 2xl 2.441 */
export const TYPE_SCALE = [
  { token: '--text-2xs', value: '0.5625rem', px18: '≈10.1px', px16: '9px', note: '新增（V5），收纳 M3 微型 caps' },
  { token: '--text-xs', value: '0.64rem', px18: '≈11.5px', px16: '10.2px' },
  { token: '--text-sm', value: '0.8rem', px18: '14.4px', px16: '12.8px' },
  { token: '--text-base', value: '1rem', px18: '18px', px16: '16px' },
  { token: '--text-md', value: '1.25rem', px18: '22.5px', px16: '20px' },
  { token: '--text-lg', value: '1.5625rem', px18: '28.1px', px16: '25px' },
  { token: '--text-xl', value: '1.953rem', px18: '≈35.2px', px16: '31.3px', note: '新增（V5），补上 lg 与 display-s 之间的断层' },
  { token: '--text-2xl', value: '2.441rem', px18: '≈43.9px', px16: '39.1px', note: '新增（V5）' },
  { token: '--text-display-s', value: 'clamp(2.25rem, 3.5vw + 1rem, 3.8rem)', px18: '40.5–68.4px', px16: '36–60.8px' },
  { token: '--text-display', value: 'clamp(3rem, 11vw, 7rem)', px18: '54–126px', px16: '48–112px' }
];

/* ── 四、字距 / 行高候选（V6） ──────────────────────────────────── */
export const TRACKING_LEADING = [
  { role: 'D', family: 'display', tracking: '0.04em', leading: '1.1' },
  { role: 'T', family: 'body', tracking: '-0.01em', leading: '1.3' },
  { role: 'L', family: 'body', tracking: '0em', leading: '1.8' },
  { role: 'U', family: 'body', tracking: '0.06em', leading: '1.45' },
  { role: 'M', family: 'mono', tracking: '0.16em', leading: '1.65' }
];

/* ── 五、刻度外 font-size 清单（V7） ─────────────────────────────
 * kind：live=生产在用；orphan=Mapp 演示页孤儿样式（无人 import）；template=Vite 模板遗留；
 *       root=根字号定义（非离群，列此仅供对照）。
 * proposal：推荐的令牌吸附；若 kind 为 orphan/template，推荐「随死代码一并删除」。
 */
export const OFF_SCALE = [
  { file: 'src/index.css', line: 52, value: '16px', context: ':root @media(max-width:1024px)', kind: 'root', proposal: '保留（根字号，非离群）' },
  { file: 'src/index.css', line: 116, value: '56px', context: 'h1（Vite 模板）', kind: 'template', proposal: '删除模板遗留' },
  { file: 'src/index.css', line: 120, value: '36px', context: 'h1 @media', kind: 'template', proposal: '删除模板遗留' },
  { file: 'src/index.css', line: 125, value: '24px', context: 'h2（Vite 模板）', kind: 'template', proposal: '删除模板遗留' },
  { file: 'src/index.css', line: 130, value: '20px', context: 'h2 @media', kind: 'template', proposal: '删除模板遗留' },
  { file: 'src/index.css', line: 146, value: '15px', context: 'code', kind: 'orphan', proposal: '已随死代码删除' },
  { file: 'src/index.css', line: 168, value: '15px', context: '.error-msg（Mapp）', kind: 'orphan', proposal: '已随死代码删除（Mapp 链）' },
  { file: 'src/index.css', line: 211, value: '18px !important', context: '.news-title（Mapp）', kind: 'orphan', proposal: '已随死代码删除（Mapp 链）' },
  { file: 'src/index.css', line: 219, value: '16px !important', context: '.news-title @media', kind: 'orphan', proposal: '已随死代码删除（Mapp 链）' },
  { file: 'src/index.css', line: 224, value: '13px', context: '.news-desc（Mapp）', kind: 'orphan', proposal: '已随死代码删除（Mapp 链）' },
  { file: 'src/index.css', line: 230, value: '12px', context: '.news-desc @media', kind: 'orphan', proposal: '已随死代码删除（Mapp 链）' },
  { file: 'src/index.css', line: 250, value: '12px', context: '.card-rank（Mapp）', kind: 'orphan', proposal: '已随死代码删除（Mapp 链）' },
  { file: 'src/index.css', line: 269, value: '15px', context: '.loading-spinner p（Mapp）', kind: 'orphan', proposal: '已随死代码删除（Mapp 链）' },
  { file: 'src/index.css', line: 292, value: '16px', context: '.empty-state（Mapp）', kind: 'orphan', proposal: '已随死代码删除（Mapp 链）' },
  { file: 'src/App.css', line: 2, value: '16px', context: '.counter（Vite 模板）', kind: 'template', proposal: '删除模板遗留' },
  { file: 'src/App.css', line: 81, value: '16px', context: '#next-steps a（Vite 模板）', kind: 'template', proposal: '删除模板遗留' },
  { file: 'src/pages/ArticlePage.css', line: 78, value: '0.88em', context: '文章行内/相对尺寸', kind: 'live', proposal: '已实现：--text-sm' },
  { file: 'src/pages/NewsDetailPage.css', line: 13, value: '11px', context: '元数据标签', kind: 'live', proposal: '--text-xs' },
  { file: 'src/pages/NewsDetailPage.css', line: 96, value: '11px', context: '元数据标签', kind: 'live', proposal: '--text-xs' },
  { file: 'src/pages/NewsDetailPage.css', line: 103, value: 'clamp(1.9rem, 3vw + 1rem, 3rem)', context: '详情页标题', kind: 'live', proposal: '--text-display-s（收敛 clamp）' },
  { file: 'src/pages/NewsDetailPage.css', line: 114, value: '11px', context: '元数据', kind: 'live', proposal: '--text-xs' },
  { file: 'src/pages/NewsDetailPage.css', line: 133, value: '10px', context: '微型 caps', kind: 'live', proposal: '--text-2xs' },
  { file: 'src/pages/NewsDetailPage.css', line: 165, value: '10px', context: '微型 caps', kind: 'live', proposal: '--text-2xs' },
  { file: 'src/pages/NewsDetailPage.css', line: 177, value: '16px', context: '正文/图注', kind: 'live', proposal: '--text-sm' },
  { file: 'src/pages/NewsDetailPage.css', line: 243, value: '10px', context: '微型 caps', kind: 'live', proposal: '--text-2xs' },
  { file: 'src/components/QifFocusLoader.css', line: 47, value: '11px', context: '加载屏标签', kind: 'live', proposal: '--text-xs' },
  { file: 'src/components/qifObs.css', line: 47, value: '11px', context: 'obs 标签', kind: 'live', proposal: '--text-xs' },
  { file: 'src/components/qifObs.css', line: 74, value: '11px', context: 'obs 标签', kind: 'live', proposal: '--text-xs' },
  { file: 'src/components/qifObs.css', line: 112, value: 'clamp(2.25rem, 3.5vw + 1rem, 3.8rem)', context: 'obs 标题（与 display-s 重复）', kind: 'live', proposal: '--text-display-s' },
  { file: 'src/components/qifObs.css', line: 120, value: '15px', context: 'obs 正文', kind: 'live', proposal: '--text-sm' },
  { file: 'src/components/QifSiteNav.css', line: 107, value: '10px', context: '微型 caps', kind: 'live', proposal: '--text-2xs' },
  { file: 'src/components/QifSiteNav.css', line: 129, value: '10px', context: '微型 caps', kind: 'live', proposal: '--text-2xs' },
  { file: 'src/components/SiteHeader.css', line: 59, value: '10px', context: '微型 caps', kind: 'live', proposal: '--text-2xs' },
  { file: 'src/components/QifSlideCard.css', line: 71, value: '11px', context: '卡片元数据', kind: 'live', proposal: '已实现：--text-xs' },
  { file: 'src/components/QifSlideCard.css', line: 125, value: '11px', context: '卡片日期', kind: 'live', proposal: '已实现：--text-xs' },
  { file: 'src/components/ThemeToggle.css', line: 55, value: '18px', context: 'iconfont 图标尺寸', kind: 'live', proposal: '标注为图形尺寸（图标字号）' },
  { file: 'src/components/DriftWall.css', line: 136, value: 'clamp(2.5rem, 4vw, 3.5rem)', context: '单字瓷砖', kind: 'live', proposal: '保留本地 clamp（图形尺寸，防爆瓷）' },
  { file: 'src/components/MainCp/Slogan.css', line: 122, value: 'clamp(2.25rem, 6vw, 4.5rem)', context: 'W 词标', kind: 'live', proposal: '已实现：--text-wordmark' },
  { file: 'src/components/MainCp/Slogan.css', line: 455, value: 'clamp(2.25rem, min(11vw, 12.5vh), 7rem)', context: 'D1 矮屏', kind: 'live', proposal: '保留本地 clamp（矮屏 vh 兜底）' }
];

/* ── 六、V1–V10 验证项（逐项验证的唯一清单） ───────────────────── */
export const VALIDATION_ITEMS = [
  {
    id: 'V1',
    title: 'display 主字体去留',
    question: '行楷 Zhi Mang Xing 保持，还是换成 lemie-qiuxu / 其他？',
    recommendation: '保留 Zhi Mang Xing。lemie-qiuxu 版权为 All rights reserved 且仓库无许可文件，默认不接入生产（样张仅供风格比较）。',
    alternatives: ['替换为 lemie-qiuxu（须先取得/确证商用授权 + 全量重新子集化）', '两个都保留（新增第二 display 角色，需先改 §4.1 纪律）']
  },
  {
    id: 'V2',
    title: '阿里妈妈数黑体去留',
    question: '是否引入 Alimama ShuHeiTi Bold？用于哪个角色？',
    recommendation: '删除。仅 Bold 单字重，会引入第三套中文字族，与 T 级 600–800 分层冲突。',
    alternatives: ['仅用于「数字/数据」展示（须同步修改 §4.1「M 一律 mono」纪律）', '保留文件但暂不接入']
  },
  {
    id: 'V3',
    title: 'mono 去留',
    question: 'Geist Mono 保持，还是换成 IBM Plex Mono？',
    recommendation: '删除 IBM Plex Mono，Geist Mono 保持 mono 唯一，维护「2+1」制。',
    alternatives: ['替换为 IBM Plex Mono 400/500（须重审所有 M 级锚点与字宽）', '两者并存（需新增角色，不推荐）']
  },
  {
    id: 'V4',
    title: 'iconfont 去留',
    question: '主题切换图标字体是否保留？',
    recommendation: '保留。ThemeToggle 唯一图标字形 U+E6E8。',
    alternatives: ['改用 lucide-react 现有图标（需删 @font-face 与 iconfont.ttf）']
  },
  {
    id: 'V5',
    title: '字阶补齐',
    question: '新增 --text-2xs / --text-xl / --text-2xl 的取值？',
    recommendation: '--text-xl: 1.953rem、--text-2xl: 2.441rem（严格 1.25 主三度）；--text-2xs: 0.5625rem（18px 根 ≈10.1px，贴合 M3 的 10–11px）。',
    alternatives: ['--text-2xs 取严格比例 0.512rem（≈9.2px）', '不加 --text-2xs，把 10px 归入 --text-xs', '调整 xl/2xl 比例']
  },
  {
    id: 'V6',
    title: '字距 / 行高令牌',
    question: 'D/T/L/U/M 每级的 tracking / leading 定值？',
    recommendation: 'D 0.04em/1.1 · T −0.01em/1.3 · L 0/1.8 · U 0.06em/1.45 · M 0.16em/1.65（新增 --tracking-* / --leading-* 两组令牌）。',
    alternatives: ['在样张上按级微调后定稿', '只令牌化 M 级 caps，其余维持现状']
  },
  {
    id: 'V7',
    title: '刻度外 font-size 映射',
    question: '34 处 px/em 如何收编？',
    recommendation: 'live 值吸附到最近令牌；orphan（Mapp）与 template（Vite h1/h2、#next-steps、.counter）随死代码删除；clamp 收敛为 display-s / 新增 W 词标令牌；ThemeToggle 图标标注为图形尺寸。',
    alternatives: ['全部替换为 rem 令牌（含图形尺寸）', '仅集中为组件级 CSS 变量，不改令牌']
  },
  {
    id: 'V8',
    title: '中文字重对齐',
    question: 'T / W 级中文权重？',
    recommendation: 'T=700、W=800、L=400/700；Noto Sans SC Variable 支持 100–900 已核实，样张核对中英混排视觉重量。',
    alternatives: ['T=600 更轻', '中文统一 500/700 两档']
  },
  {
    id: 'V9',
    title: '子集化 + 缺字校验',
    question: '用 Node 原生 subset-font 还是 fontTools/pyftsubset？',
    recommendation: 'Node 原生 subset-font（免 Python、可进 CI）+ scripts/build-font-subsets.mjs / check-font-subsets.mjs + font-subsets.config.json，新增 pnpm fonts:build / fonts:check（缺字即失败）。',
    alternatives: ['沿用 fontTools/pyftsubset（本机已有 4.63.0）', '只做构建期缺字校验，子集仍手工生成']
  },
  {
    id: 'V10',
    title: '资产最终清单',
    question: '未引用文件的最终去留？',
    recommendation: '按 V1–V3 结果执行删除或接入；删除即从 src/assets/fonts/ 移除并核对全站无引用。',
    alternatives: ['保留 Alimama（未来复用于数字展示）', '全部删除并只用 fontsource']
  }
];

/* 逐项裁决结果（V1–V10 已确认并落地）。样张页据此显示状态徽标与结果。 */
export const VALIDATION_STATUS = {
  V1: { status: '已实现', outcome: '保留 Zhi Mang Xing；lemie-qiuxu.woff2 已删除（未授权，不接入生产）' },
  V2: { status: '已删除', outcome: 'AlimamaShuHeiTi-Bold.woff2 与 LICENSE 已删除' },
  V3: { status: '已删除', outcome: 'IBMPlexMono-400/500.woff2 已删除；--font-mono 仍为 Geist Mono' },
  V4: { status: '已实现', outcome: '保留 iconfont.ttf（ThemeToggle 唯一字形 U+E6E8）' },
  V5: { status: '已实现', outcome: 'tokens.css 新增 --text-2xs/--text-xl/--text-2xl/--text-wordmark' },
  V6: { status: '已实现', outcome: 'tokens.css 新增 --tracking-* 与 --leading-*；既有字距逐一收编留待后续' },
  V7: { status: '已实现', outcome: 'live 值已吸附令牌；Vite/Mapp 死样式、App.css 与孤儿 Mapp 演示链（Mapp/NewsCard/AnimatedList/test.json/json-server/axios）已删除；QifSlideCard 两处 11px 已收编 --text-xs' },
  V8: { status: '已实现', outcome: '维持 §4.1 的 600–800 分层；W=800、CMS 标题补 700；无需改重' },
  V9: { status: '已实现', outcome: 'subset-font + fontkit devDep；prebuild 挂 fonts:check；子集重建至 232 字形，补入快讯/调焦等缺字' },
  V10: { status: '已实现', outcome: '保留 Zhi Mang Xing 子集 + iconfont；删除 lemie-qiuxu / Alimama / IBM Plex Mono 共 5 个文件' }
};

/* ── 七、样张文案（真实站内字符串，避免占位「示例文字」） ───────── */
export const SPECIMEN_COPY = {
  d1Lines: ['启迪生命', '扉向未来'],
  wordmark: { eco: 'Bio', rest: 'Qif', gloss: 'Bio · 生命 — Qif · 启扉' },
  sectionTitles: ['因热爱而启程', '特色工作室', '繁花', '从好奇出发', '启扉快讯'],
  cardNames: ['生生不息', 'DATASEEK', '秘书部', '宣传部', '学术实践部', '活动服务部'],
  memberQuote: '在显微镜下第一次看清花粉的形态时，我知道自己来对了地方。',
  memberName: '林沛然',
  memberRole: '会长',
  body: '协会秉持“启迪生命、扉向未来”的理念，围绕学术交流、科技创新、实验实践、自然观察和公益科普等方向开展活动，致力于搭建开放、协作、富有创新活力的跨学科交流平台。',
  ui: ['加入我们', '学术交流', '科创实践', '自然探索', '公益科普'],
  monoLabels: ['01 · ABOUT', '03 · STUDIOS', '04 · MEMBERS', '05 · JOIN', 'STUDIO NO.01', 'JXAU · EcoRem', 'SCIENCE · 科学与工程'],
  numerals: '0123456789 · 2026-09-27 · 06:41'
};
