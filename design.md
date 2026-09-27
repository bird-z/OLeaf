# 生物启扉协会 BioQif · 设计体系(design.md)

> 本文件是全站**唯一设计系统事实来源**。任何页面、组件、动效的新建与修改,必须引用
> `tokens.css` 中的令牌,禁止内联原始色值 / 字体栈 / 随意时长。
> 令牌缺失时,先在 `tokens.css` 中新增命名令牌,再引用。
>
> 依据:Anthropic `frontend-design` skill(独特、有主张、反模板)+ Hallmark(纪律与门禁)。

---

## 1. 设计主张(Point of View)

- **主题**:夜空下的生命观测。暗底星轨摄影 + 行楷书法标题 + 精确的数据排版,
  是「生命 × 启扉(Bio × Qif)」这一双重身份的直接表达。
- **签名元素(Signature)**:行楷手写标题压在星轨 / 生态摄影之上,配 Geist Mono 的
  英文小字标签——「古典笔墨 × 现代科学仪器」的并置是全站记忆点,其他装饰为之让路。
- **语气**:沉静的、田野笔记式的科学叙事。不卖弄、不吆喝;用事实和影像说话。
- **受众**:校内对生物 / 生态 / 科创感兴趣的学生;**页面唯一任务**:让人了解协会并
  完成「加入」动作(Join 节为转化终点)。

## 2. 色彩(锚定紫 hue 290,中性色带微量紫调)

| 令牌 | 用途 |
| --- | --- |
| `--color-paper` / `--color-paper-2` | 冷白微紫纸面(亮节 / 卡片次级表面) |
| `--color-paper-dark` | **全局暗底**(夜空主题底色,各节共用,消除节间底色差) |
| `--color-paper-green` | 夜绿交替节底色,与暗底节强对比交替 |
| `--color-ink` / `--color-neutral` / `--color-muted` | 亮底上的三级文字 |
| `--color-photo-ink` / `--color-photo-muted` | **摄影 / 暗底上的**主文字 / 次级文字 |
| `--color-accent` | 品牌紫(≈ #7c3aed),**交互语义专用**:链接、按钮、焦点 |
| `--color-eco` / `--color-eco-bright` | 叶绿,**生态语义专用**(BioQif 相关、亮 / 暗底) |
| `--color-photo-warm` | 照片上的暖纸白,行楷标题专用(呼应夜景立柱暖光) |
| `--color-brass` | 黄铜金,仅用于页底英文 caps 与联系标题短划 |
| `--color-focus` / `--color-focus-on-dark` | 焦点环(亮底 / 暗底) |

**纪律**:accent 与 eco 各守语义,不混用、不渐变叠加;暗底一律换用 `photo-*` /
`*-bright` 变体;禁止出现第四个彩色色相。

## 3. 字体(2+1 制)

| 角色 | 字体栈 | 场景 |
| --- | --- | --- |
| display | `--font-display`(行楷 Zhi Mang Xing) | 各节中文标题、成员姓氏字头像、成员引文 |
| body | `--font-body`(Geist Variable + Noto Sans SC) | 正文、导航、按钮、界面文字 |
| outlier | `--font-mono`(Geist Mono) | 数据、编号、英文 caps 标签、时间戳 |

**纪律**:
- 标题一律 roman(禁斜体);强调靠字重、accent 色或手绘下划线。
- 行楷为**子集化 woff2**(`src/assets/fonts/`,116 字形 / 33KB)。**新增 display 文案
  必须重新生成子集**(fontTools 合并 fontsource 分包后 `pyftsubset`)。
- 行楷仅用于短标题(≤12 字),长句正文绝不使用 display 字体。
- 字体资产识别、风格分析与 **V1–V10 逐项裁决记录**见 `docs/fonts.md`；
  可视化验证用 dev-only 样张页 `/#/specimen`（`pnpm dev`；生产构建不含）。

## 4. 字阶(1.25 major third)

`--text-xs(0.64rem)` → `--text-sm` → `--text-base(1rem)` → `--text-md` →
`--text-lg` → `--text-display-s(clamp 2.25–3.8rem)` → `--text-display(clamp 3–7rem)`

根字号 18px(≤1024px 降 16px),行高 145%,字距 0.18px。新尺寸必须落在刻度上,
禁止 `font-size: 17px` 之类的刻度外值。

### 4.1 文字分级(Type Roles)

与字阶并列的**第二套一致性**:同一「角色」跨页必须同字族、同字重、同字距、同颜色。
尺寸只是其中一列——**选角色,不是只选字号**。共六级,从「展示」到「仪器」:

| 级 | 语义角色 | 字族 | 尺寸 | 字重 | 字距 / 大小写 | 颜色令牌 | 现有锚点 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **D1** | 展示·首屏主标 | `--font-display`(行楷) | `--text-display` | 400 | 0.04em / 原样 | `--color-photo-warm` | `Slogan .hero__title` |
| **D2** | 展示·节标 | 行楷 | `--text-display-s` | 400 | 0.04em / 原样 | `--color-photo-warm` | About / Studios / Members / Join `__title`、`PageShell__title`、新闻详情标题 |
| **D3** | 展示·短句 | 行楷 | `--text-lg` ~ `--text-md` ~ 局部 clamp | 400 | 0.02–0.04em | `--color-photo-warm` / `--color-eco-bright` | 成员引文与姓氏字头像、`QifSlideCard__name`、`DriftWall` 揭示句 |
| **W** | 品牌字标 | `--font-body` | 导航 `--text-md` · 首屏 clamp(2.25–4.5rem) | 800 | -0.02 ~ -0.035em / 原样 | `--color-eco-bright` + `--color-photo-ink` 两段分色 | `Slogan__wordmark`、`CardNav .logo-wordmark` |
| **T** | 标题(界面黑体) | `--font-body` | `--text-md` / `--text-lg`(页面 `h1/h2` 待归位,见 §4.2) | 600–800 | -0.01em / 原样 | `--color-photo-ink` | 卡片名 / 部门名 / 面板标题 / `h1,h2` |
| **L** | 行文 | `--font-body` | L1 导语 `--text-md` · L2 正文 `--text-base` · L3 次级 `--text-sm` | 400(强调 700) | 0 / 原样 | 主 `--color-photo-ink`,次 `--color-photo-muted` | `About__copy`、文章 body、卡片 desc |
| **U** | 界面 | `--font-body` | CTA `--text-base` · 导航 `--text-sm`~`--text-base` · 标签 `--text-xs` | 400–600 | 0.04–0.08em(中文标签) | 交互色 `--color-accent-bright` / `--color-photo-ink` | `hero__cta`、导航、筛选标签 |
| **M** | 仪器·元数据 | `--font-mono` | M1 结构 caps `--text-xs` · M2 编号/计数/时间戳 `--text-xs` · M3 微型 caps 10–11px(待引入 `--text-2xs`) | 400–500 | 0.12–0.2em / **uppercase** | `--color-photo-muted`(编号可 `--color-eco-bright`) | 节序 `__index`、`__gloss`、`__no`、`__cue`、时间戳 |

**级间纪律**:
- **D 只承载短文本(≤12 字)**,同屏不超过两级;D1 全站仅首屏一处。
- **W 是唯一允许 body 字体升到展示级体量的特例**(品牌英文名),靠 800 字重 + 负字距成立,
  不得复制到其他文案。
- **T / L / U 同族**,靠**尺寸 + 字重 + 颜色**分层,不靠换字体。
- **M 一律 mono**,是「科学仪器」记忆点的一半;无序列语义不得编号(见 §10.6)。
- 行高按级固定:D 1.05–1.15 / T 1.2–1.4 / L 1.65–1.9 / U 1.4–1.5 / M 1.6–1.7。

### 4.2 现状缺口(全站字体规划的输入)

> 本节是**待归位债务清单**,不是许可。新增样式必须走 §4 / §4.1 的令牌,
> 不得照抄下列字面量。

- **未定义令牌**:`ArticlePage.css .article__body h1` 引用 `var(--text-xl)` → 该令牌不存在,
  回退继承值(≈1rem)。字阶在 `--text-lg`(1.5625rem) 与 `--text-display-s`(2.25rem) 之间
  **比值为 1.44**,已断出 1.25 主三度,缺少 `--text-xl` / `--text-2xl` 中间档。
- **刻度外字面量(34 处 `font-size`)**:`10px`×6、`11px`×8、`12px`×2、`13px`×1、
  `15px`×4、`16px`×7、`18px`×2,以及 `20px`/`24px`/`36px`/`56px` 各 1;另有
  `ArticlePage` 的 `0.88em`。集中在 NewsDetail / QifSiteNav / SiteHeader / QifSlideCard / qifObs。
- **临时 clamp(5 处)**:`Slogan__wordmark`(2.25–4.5rem)、`DriftWall`(2.5–3.5rem)、
  `NewsDetail__title`(1.9–3rem)、`qifObs`(2.25–3.8rem,与 `--text-display-s` 重复)、
  `Slogan` 移动端(2.25–7rem)。应各自收敛为令牌。
- **字距未令牌化**:全站 105 处 `letter-spacing`,20+ 个离散值(0.02–0.35em);
  至少 M 级 caps 应统一为一档。
- **遗留模板样式**:`index.css` / `App.css` 的 `h1/h2`(56/36/24/20px) 与
  `#center` / `#next-steps` / `#docs` / `.counter` 来自 Vite 模板,与站点令牌体系并行;
  `h1/h2` 全局生效,可能覆盖组件级标题。
- **未引用的字体资产**:`src/assets/fonts/` 下 `AlimamaShuHeiTi-Bold.woff2`、
  `IBMPlexMono-400/500.woff2`、`lemie-qiuxu.woff2` 全站无人引用;
  `iconfont.ttf` 仅 `ThemeToggle.css` 经 `@font-face` 取字形。

### 4.3 后续:全站字体规划(待排期)

1. **补齐字阶**:定 `--text-xl`(≈1.953rem) / `--text-2xl`,让面板标题与 `--text-display-s`
   之间连续;加 `--text-2xs`(10px) 收纳 M3 微型 caps。
2. **收编 34 处刻度外值**:逐一映射到新刻度,或明确标注为「图形化尺寸」并集中注释。
3. **字距 / 行高入令牌**:为 D/T/L/U/M 每级各定一档 `--tracking-*` 与 `--leading-*`,
   消灭 20+ 离散字距。
4. **裁决未引用字体资产**:Alimama 黑体(中文标题候选) / IBM Plex Mono(mono 候选) /
   lemie-qiuxu(display 候选) —— 决定引入或删除;若引入需同行楷一样做子集化。
5. **子集化流程固化**:display 文案新增即需重生成子集(见 §3);规划应给出脚本或
   构建期缺字校验。
6. **中文字重纪律**:`font-synthesis: none` 已全局生效,中文仅 `Noto Sans SC Variable`
   一档可变字重;需确认 700/800 与英文 Geist 的字重对齐。

## 5. 间距与版式

- **4pt 制**:`--space-3xs(2px)` 到 `--space-3xl(96px)`,共 9 档,禁止刻度外值。
- 节间用底色交替(`paper-dark` ⇄ `paper-green ⇄ 摄影节)制造节奏,而非分割线堆砌。
- 网格轨道含图片时一律 `minmax(0, 1fr)`,禁止裸 `1fr`(防溢出)。
- 整页翻屏(Home)+ 常规滚动(档案页族)两种节奏并存,各自内部保持一致。

## 6. 动效

| 令牌 | 值 | 场景 |
| --- | --- | --- |
| `--dur-micro` + `--ease-out` | 120ms | hover / 微交互 |
| `--dur-short` | 220ms | 状态切换、tooltip |
| `--dur-long` | 420ms | 翻屏、区块揭示 |

- GSAP / motion 已装,用于编排过的「一个时刻」(入场序列、滚动揭示),
  **不做**零散特效堆砌;每页动效原语 ≤3 个。
- 必须尊重 `prefers-reduced-motion`(参见 `src/lib/scrollTo.js` 的既有实现)。
- ClickSpark 为全站唯一环境性点缀,不再新增同类氛围组件。

## 7. 文案语气

- 主动语态、句子级大小写、动词具体:「查看活动档案」而非「点击这里」。
- 失败与空态是给方向的:「未找到该分类的文章,返回知识普及浏览全部」。
- **禁止编造数据**:没有真实统计就不用 stat-led 版式;成员数、活动场次必须可溯源。
- 中英并置时,英文用 Geist Mono caps 作结构标签(如 `SCIENCE · 科学与工程`)。

## 8. 组件与状态

- 交互组件必须覆盖 8 态:default / hover / focus-visible / active / disabled /
  loading / error / success。
- 焦点环:亮底 `--color-focus`,暗底 `--color-focus-on-dark`,禁止 `outline: none` 无替代。
- 圆角只有两档:`--radius-card(6px)` 与 `--radius-pill`;不引入第三档。
- shadcn/base-ui 组件(如 `components/ui/button.tsx`)消费 tokens,样式经 `cn()` 合并。

## 9. 响应式硬底线

验证档位:**320 / 375 / 414 / 768 / 1440 px**。
- 任何宽度无横向滚动;`html, body` 用 `overflow-x: clip`(禁 `hidden`)。
- 可点击文字不折行(按钮、导航、CTA);长词标题 `overflow-wrap: anywhere`。
- 行楷 display 在移动端用 `--text-display-s`,不使用桌面大标题尺寸。

## 10. 反模式(出现即打回)

1. 内联 hex / rgb / 字体栈,绕过令牌
2. 斜体标题、紫蓝渐变、emoji 当图标、圆角卡片 + 阴影堆叠
3. 假浏览器 / 假手机框等重绘 chrome(用真实截图 + `<figure>`)
4. 编造指标与 testimonials
5. hero 用「大数字 + 小标签 + 渐变」的模板答案
6. 无信息量的装饰性编号(01/02/03)——内容不是序列就不用编号

## 11. 变更流程

改设计 = 先改本文件与 `tokens.css`,再改实现。Hallmark 项目记忆见 `.hallmark/log.json`,
连续两次构建的宏观结构 / 主题 / nav / footer 原型不得重复。

## 12. 变更记录（Change log）

- 2026-09-25 · 首页顶部新增「启扉快讯」全屏新闻轮播（`MainCp/NewsCarousel.jsx`）：
  - 置于 `Slogan` 首屏之上（首屏=轮播，第二屏=Slogan），两节均为 100svh 叠放。
  - 数据 = `public-articles` 的 `BANNER` 栏目（接口冻结：纯客户端筛选、不新增请求、
    图片走 `payload.js` 归一化后的 `article.image`）；最多 5 张。
  - 动态标题不用行楷（CMS 标题字符不在字体子集内），一律 `--font-body`/`--font-mono`。
  - 归入 `tokens.css`「影像恒定组」：昼夜恒暗场、白字；新增令牌 `--dur-carousel`(6s) 作
    自动播放/缩放/进度的唯一时长源，JS 侧经 `getComputedStyle` 读取，失败回退 6s。
  - 交互：自动播放（悬停/聚焦/离开视口暂停）+ 箭头 + mono 计数进度；点击字幕滚到 `#news`。
  - 失败/0 条 BANNER → 整节卸载，Slogan 回到第一屏；加载中为满屏暗底占位。
  - 联动：`useFullpage` 增 `.hero`/`.qif-news` 停靠点；`Slogan` 的 `--hero-p` 与 `QifSiteNav`
    的 nav1⇄nav2 进度改以 `.hero` 顶边为起点；浅色主题下轮播期间头部加
    `qif-site-nav--over-media` 强制白字；挂载 `QifNewsSection`（OBS-02，About 后），
    `Studios/Members/Join` 序号为 03/04/05；`App.jsx` 接 `/news/:id` 路由（详情页已存在）。

- 2026-09-26 · 修复首页轮播不显示（本地 dev 被 CMS 的 CORS 白名单拦下）：
  - 根因：CMS 的 CORS 是**固定 origin 白名单**（仅 `http://127.0.0.1:8000`、
    `https://www.bioqif.com`）；本地跑在 `localhost:5173` 时 `public-articles` 被浏览器
    拦截 → `getArticles()` 失败 → 轮播走 `error` 分支整节卸载，Slogan 顶到第一屏。
  - `vite.config.js` 增 `server`/`preview` 代理 `/api → https://cms.bioqif.com`；
    `payload.js` 仅在 dev / localhost 下改用相对路径走同源代理，生产仍直连 `CMS_URL`，
    请求地址/方式/参数不变（接口冻结）。
  - 同时修 `index.html` 内联脚本注释提前闭合导致的 `Uncaught SyntaxError`
    （防闪与首屏预载脚本此前整段未执行）。
  - 待办：生产若部署在 GitHub Pages，须先把 `https://bird-z.github.io` 加入 CMS 白名单。

- 2026-09-26 · NewsCarousel → Slogan 离散覆盖翻页 + Slogan 入场时机修正：
  - 新 hook `MainCp/usePageTurn.js`（Home.jsx 调用）：滚轮向下 / 触摸上滑 /
    点击轮播非控件区域 → 瞬时 scrollTo 到 heroTop（钉住的轮播遮住位移）+ 轮播淡出，
    Slogan 直接在场；反向对称。900ms 动画锁吞触控板尾流；不做滚动 scrub
    （transform 钉屏与合成器抢帧会抖）。滚动条/键盘等原生路径也归一：
    documentElement `.page-covered` = scrollY ≥ heroTop 的唯一事实源。
  - NewsCarousel：`position:sticky; top:0; z-index:1` 合成器钉屏，Slogan 滚过其上；
    `.page-covered` 经 MutationObserver 读回 `covered` 态 → `is-covered`
    （opacity 淡出，`visibility` 延时淡出结束才切 hidden，回滚方向 0s 即时恢复）
    + `inert` + 暂停自动播放。加载态 `.news-carousel--loading` 不钉屏。
    轮播卸载（heroTop ≤ 0）→ 全部放行原生滚动。
  - 新增令牌 `--dur-turn`(720ms) = 翻页淡出时长（仅作用于轮播自身，不动其他组件）；
    JS 侧 `LOCK_MS`(900) 与之同步。曾试过的 dip-through-dark（hero 照片门控）已回退：
    会波及 Slogan 组件的呈现。
  - 修复 `qif-site-nav--over-media` 永不撤销：轮播改 sticky 后 `getBoundingClientRect().bottom`
    恒为视口高，几何判定失效 → 浅色主题被强制白字/深令牌全站污染（Join Us 深底深字）。
    现 sticky 模式下改看 `.page-covered`，reduced-motion/卸载回落原几何判定。
  - Slogan：入场编排（data-reveal stagger / 逐字 reveal / foot 规则线）从「页面加载即播」
    改为 IntersectionObserver `threshold: 0.4` 触发 `.is-live`（只播一次），修复入场被提前播完；
    reduced-motion 塌缩为直接终态（不依赖 is-live）。
  - 不新增令牌（暗纱系数非令牌类）；缝接处不加装饰线。

- 2026-09-26 · 协会英文名全站改名 EcoRem → BioQif：
  - 词源：Bio · 生命 + Qif · 启扉（与 Footer `Biology Qif Association`、bioqif.com 域名一致）。
  - Slogan / CardNav wordmark 沿用两段式分色：Bio 叶绿（`--color-eco-bright`）+ Qif 照片白；
    gloss 改为「Bio · 生命 — Qif · 启扉」。
  - `--color-eco*` 令牌与 `*-wordmark-eco` 类名中的 eco 为「叶绿」色彩语义，不随品牌改名。

- 2026-09-26 · 新增文字/字体分级（design.md §4.1–§4.3，纯文档，未改实现）：
  - §4.1 定义六级语义角色 D1/D2/D3/W/T/L/U/M（字族 + 尺寸令牌 + 字重 + 字距 + 大小写 + 颜色），
    把「选字号」升级为「选角色」；锚点取自现有组件（Slogan/About/Studios/Members/Join/ProfileCard 等）。
  - §4.2 盘点现状缺口：`--text-xl` 引用但未定义、34 处刻度外 `font-size`、5 处临时 clamp、
    105 处未令牌化字距、`index.css` 遗留 Vite 模板 `h1/h2`、4 个未引用字体资产。
  - §4.3 登记「全站字体规划」待办（补字阶 / 收编离群值 / 字距行高令牌化 / 裁决字体资产 /
    子集化校验 / 中文字重对齐）。本次只落文档，实现改动另行排期。

- 2026-09-27 · 建立「全站字体规划」执行文档与 dev-only 样张页（阶段 0+1，未改生产字体）：
  - 新增 `docs/fonts.md`：字体识别结论（fontTools 读 name/cmap/OS-2）、风格分析、V1–V10
    逐项裁决记录与风险清单；`design.md §3` 增引用。
  - 新增 `src/data/fontCatalog.js`：资产表 + 文字角色锚点 + 字阶/字距候选 + 刻度外
    `font-size` 清单 + V1–V10 验证项（样张与文档共用单一数据源）。
  - 新增 `src/pages/FontSpecimen.{jsx,css}` + `src/App.jsx` dev-only 动态路由 `/#/specimen`：
    候选字体用 specimen 专属 `@font-face`，样式收紧在 `.font-specimen`，不改 `tokens.css`。
  - 关键发现：`lemie-qiuxu.woff2` 版权为 All rights reserved 且仓库无授权文件，默认不接入生产。
  - 待办：按 V1–V10 逐项人工验证后，才进入阶段 3（改 tokens/组件/删除资产/子集化脚本）。

- 2026-09-27 · 字体令牌补齐（V5/V6，样张验证后落地）：
  - `tokens.css` 新增字阶 `--text-2xs`/`--text-xl`/`--text-2xl`/`--text-wordmark`
    （1.25 主三度；修复 §4.2 的 `--text-xl` 引用未定义与 lg→display-s 断层，
    `--text-wordmark` 收敛 W 词标的临时 clamp）。
  - 新增 `--tracking-{display,title,body,ui,mono}` 与 `--leading-{display,title,body,ui,mono}`
    两组令牌（按 §4.1 角色定档）；既有字距/行高的收编属于 V7 后续。

- 2026-09-27 · 刻度外 font-size 收编 + 死样式删除（V7）：
  - live 值吸附令牌：NewsDetailPage（11px→`--text-xs`、10px→`--text-2xs`、16px→`--text-base`、
    标题 clamp→`--text-display-s`）、QifFocusLoader/qifObs（11px/15px→`--text-xs`/`--text-sm`、
    obs 标题 clamp→`--text-display-s`）、QifSiteNav/SiteHeader（10px→`--text-2xs`）、
    ArticlePage 行内 code（0.88em→`--text-sm`）。
  - **Bug 修复**：NewsDetailPage 的 `.qif-news-detail__title` 与 `.qif-article-body h2/h3`
    是 CMS 动态文本却用 `--font-display`（行楷），字符不在子集内会缺字 →
    按 §12「动态标题不用行楷」改回 `--font-body`（700）。
  - 收敛临时 clamp：`hero__wordmark` → 新令牌 `--text-wordmark`；`qif-obs-title` →
    `--text-display-s`（与令牌重复）。`hero__title` 矮屏 vh 兜底与 `.drift-wall__char`
    单字瓷砖为**图形尺寸**，有意保留本地 clamp 并注释（不收编）。
  - 删除死样式：`index.css` 的 Vite 模板 `h1/h2`（56/36/24/20px）与 `code`/`.counter`/
    `#center`/`.card`/`.news-*`/`.card-rank`/`.loading-spinner`/`.empty-state`/`.animated-list`；
    `App.css` 整文件删除（`.counter`/`#next-steps`/`#docs`/`#spacer`/`.ticks` 均为 Vite/Mapp
    遗留），并从 `App.jsx` 移除导入。对应 JS 组件 Mapp/NewsCard/AnimatedList 仍待后续清理。
  - `ThemeToggle` 图标 18px 标注为图形尺寸（非令牌）。
  - 待办：`QifSlideCard.css` 两处 11px（他人在途改动，待其提交后再动）；`Mapp.jsx`/
    `NewsCard.jsx`/`AnimatedList.jsx` 与 `test.json`/`pnpm server` 的死代码删除另开任务。

## 13.AGENT>
Agent:
默认不调用视觉模型检查:compile是例外，允许对可视
绘图板的离线栅格化结果做视觉检查和选代。则试:compile 以外的视觉效果可以默认正确，人发现问题会让你修复。不要调用任何浏览器工具。功能性的东西应该直接用API可能有并行的任务-但没有冲突。提交时留意它们即可。实现时小步提交，英文一行commit message。保持线性提交历史，远端有提交时 rebase。