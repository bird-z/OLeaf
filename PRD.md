# 生物启扉协会官网 · PRD（待完成事项与任务流程）

> 盘点时间：2025-09-27 ｜ 盘点人：pi-doc
> 本文档梳理**当前站点已上线骨架、但尚未完成**的页面与占位项，按任务流程组织。
> 事实来源：`src/` 代码、`design.md` §12 变更记录、`docs/api.md`、`docs/fonts.md`、`.agent-claims.md`。
> 协作纪律遵循 `AGENT.md`：改文件前先认领；高危共享文件（Nav/App.jsx/tokens.css…）默认上锁。

---

## 0. 页面完成度总览

| 路由 / 区块 | 文件 | 状态 | 缺口 |
|---|---|---|---|
| `/#/` Home 整页 | `src/pages/Home.jsx` | ⚠️ 基本完成 | 轮播依赖 CMS + CORS 白名单；多处 CTA 占位 |
| ├ NewsCarousel（启扉快讯） | `MainCp/NewsCarousel.jsx` | ⚠️ | 线上仅 1 篇 BANNER 文章；GitHub Pages origin 未进 CMS 白名单 |
| ├ Slogan / About | `MainCp/Slogan.jsx` `About.jsx` | ✅ 完成 | — |
| ├ QifNewsSection（#news） | `MainCp/QifNewsSection.jsx` | ⚠️ | CMS 文章少时为空态文案「第一批标本正在制作中」 |
| ├ Studios | `MainCp/Studios.jsx` | ⚠️ | 「发起工作室」CTA 为 `<span>` 占位，落地未定 |
| ├ Members（含校园墙） | `MainCp/Members.jsx` | ⚠️ | 6 名成员信息 + 引文为示例数据，待真实名单 |
| └ Join + Footer | `MainCp/Join.jsx` `Footer.jsx` | ⚠️ | 「了解部门」「在线报名」「B站」均为占位 |
| `/#/science` 科学与工程 | `src/pages/SciencePage.jsx` | ⚠️ 骨架完成 | 全部 4 个项目为「（示例）」占位，待真实项目资料 |
| `/#/events` 教育活动 | `src/pages/EventsPage.jsx` | ⚠️ 骨架完成 | 2026 春两项活动无照片（`照片待补充` 占位卡）；学期/日期待定 |
| `/#/popular` 知识普及 | `src/pages/PopularPage.jsx` | ✅ 可用 | 数据走本地 `articles.json`，文章由内容团队补充 |
| `/#/popular/:category/:title` | `src/pages/ArticlePage.jsx` | ✅ 完成 | — |
| `/#/news/:id` 新闻详情 | `src/pages/NewsDetailPage.jsx` | ✅ 完成 | 依赖 CMS 列表接口（无详情接口，列表内查找） |
| `/#/specimen`（dev-only） | `src/pages/FontSpecimen.jsx` | ✅ 完成 | 仅 dev；V1–V10 已全部「已实现」，无遗留 |

**结论：没有「整页未做」的页面；待完成项集中在三类——①内容占位待补真实资料 ②CTA/链接占位待确认落地 ③导航与外链待收敛。**

---

## 1. 任务流 A：CTA / 链接占位（需业务决策后落地）

> 阻塞点：全部是「先不链接」的产品决策，需负责人给出落地目标。

| # | 位置 | 现状 | 需要确认 | 落地动作 |
|---|---|---|---|---|
| A1 | `Join.jsx` 「在线报名」button | 占位 button + 光泽动效 | 报名渠道（表单？问卷星？邮箱？） | 换成 `<a>` 指向确认渠道 |
| A2 | `Join.jsx` 每个部门卡「了解部门」 | `<span>` 占位 | 部门详情载体（子页/弹层/外链） | 换 `<a>` 或接详情页路由 |
| A3 | `Studios.jsx` 「发起工作室」招募卡 | `<span>` 占位 | 发起入口（联系邮箱/表单/跳 Join） | 换 `<a>`；多数场景应锚到 `#join` |
| A4 | `Footer.jsx` 「B站」 | `<span>` 占位 | B站账号 URL | 换 `<a target=_blank>` |
| A5 | `Join.jsx` 咨询邮箱 `office@bioqif.com` | 纯文本 | 是否启用 mailto | 包 `<a href="mailto:…">`（Footer 已是 mailto，口径对齐） |
| A6 | `Nav.jsx`（档案页 CardNav） | `Research` / `Publications` / `Team` / `Contact` 四个 `href="#"` 死链；组名 `Academic/Services/About` 与 `homeNav.js` 的中文档案导航不一致 | 是否复用 `homeNav.js` 的 `CARD_GROUPS` | **建议整卡换用 `CARD_GROUPS`**，一次消灭全部死链并统一导航口径 |

**流程**：负责人逐项给出落地目标 → 认领对应文件 → 换真实 `<a>`（含 `aria-label`）→ `pnpm lint && pnpm build` → 提交。
A6 可独立先做（不依赖业务输入，只复用已有数据源）。

---

## 2. 任务流 B：内容占位（需内容团队供稿后替换）

| # | 页面 | 文件 / 数据位置 | 占位内容 | 替换方式 |
|---|---|---|---|---|
| B1 | 科学与工程 | `SciencePage.jsx` `STAGES` | 4 个项目 desc 均标「（示例）」 | 拿到真实项目资料后改数组项，结构不变 |
| B2 | 教育活动 | `EventsPage.jsx` `EVENT_GROUPS` | 2026 春两项 `image: null` + 日期「待定」 | 补照片入 `src/assets/`、填日期；无图项保留占位卡机制 |
| B3 | 成员风采 | `Members.jsx` 成员数组 | 6 名成员姓名/部门/引文为示例 | 收齐真实名单与照片后替换 |
| B4 | 快讯/详情数据 | CMS（线上仅 1 篇） | 空态文案兜底已就绪 | 协会在 CMS 发布更多 `BANNER`/`工作动态` 文章，前端零改动 |

**流程**：内容团队供稿 → 认领文件 → 替换数组项 → build/lint → 提交。B4 无代码任务。

---

## 3. 任务流 C：导航结构（栏目无独立页面）

`homeNav.js` 的 `HERO_LINKS` 中三项栏目**没有独立页面**，当前借最近区块锚点承载：

| 栏目 | 当前落点 | 决策项 |
|---|---|---|
| 组织机构 | `#about`（协会概况） | 维持借锚 或 未来做组织机构子页/区块 |
| 校园墙 | `#members`（成员照片墙 = DriftWall） | 维持借锚（校园墙已并入成员节）或独立区块 |
| 资源共享 | `/popular`（知识普及） | 名称口径：导航叫「资源共享」、页面叫「知识普及」，**建议统一为「知识普及」** |

**流程**：先确认三栏是否长期借锚 → 若长期维持，仅需统一「资源共享」文案（改 `homeNav.js` 一行）→ 若要独立页面，另行立项（走 `docs/前端开发文档.md` §8 新页面清单）。

---

## 4. 任务流 D：部署 / 外部依赖（非代码项）

| # | 事项 | 阻塞 | 负责方 |
|---|---|---|---|
| D1 | CMS CORS 白名单加 `https://bird-z.github.io` | 否则 GitHub Pages 上 `public-articles` 被拦 → 首屏轮播整节卸载 | CMS 服务端（docs/api.md §2.1 已记录） |
| D2 | API 中转站 `localhost:3000` 生产地址 | `Nav.jsx` 直链 localhost，生产不可达 | 运维确认中转站线上地址 → 改 Nav.jsx 一处 |

---

## 5. 后端接口清单（API Inventory）

> 前端网络出口**唯一收敛在 `src/lib/payload.js`**（内部服务层），组件不直接 `fetch`。
> 接口契约已冻结（`docs/api.md` §8）：地址/方法/参数/归一化/防刷不可改，新增调用只能消费归一化后的 `Article` 模型。

### 5.1 已连接接口（2 个，全部冻结）

| # | 接口 | 方法 | 出口位置 | 消费方（代码位置） | 用途 |
|---|---|---|---|---|---|
| E1 | `{CMS_URL}/api/public-articles` | `GET` | `payload.js` → `getArticles()`（模块级 Promise 缓存） | `useArticles()` hook → ① `NewsCarousel.jsx:29`（筛 `BANNER` 栏目做首屏轮播）② `QifNewsSection.jsx:10`（#news 快讯卡）③ `NewsDetailPage.jsx:17`（列表内查详情，**无详情接口**） | 全站新闻数据唯一来源 |
| E2 | `{CMS_URL}/api/article-view/{id}` | `POST` | `payload.js` → `incrementArticleView()`（30min localStorage 节流 + 在飞去重） | `NewsDetailPage.jsx:37`（详情页打开后 +1，失败静默） | 浏览量计数 |

环境差异：`payload.js` 的 `API_BASE`——dev/localhost 走 Vite 同源代理（`vite.config.js`：`/api → cms.bioqif.com`），生产直连 `CMS_URL`。

### 5.2 待连接接口 / 外部依赖（尚未接入，按依赖方整理）

| # | 待连位置 | 前端落点 | 需要的后端/外部输入 | 阻塞状态 |
|---|---|---|---|---|
| P1 | **在线报名** | `Join.jsx` 「在线报名」button | 报名渠道：表单服务 URL / 报名 API / 或仅 mailto | 🔴 等决策：渠道未定 |
| P2 | **部门详情** | `Join.jsx` 部门卡「了解部门」 | 部门内容载体：CMS 新集合 / 静态子页 / 外链 | 🔴 等决策 |
| P3 | **发起工作室** | `Studios.jsx` 招募卡 CTA | 发起入口（建议锚 `#join` 或联系邮箱） | 🔴 等决策 |
| P4 | **B站账号** | `Footer.jsx` 「B站」span | B站主页 URL（纯外链，无 API） | 🔴 等账号 |
| P5 | **API 中转站控制台** | `Nav.jsx` `href="http://localhost:3000"` | 中转站**生产地址** | 🔴 运维未给线上 URL |
| P6 | **CMS CORS 白名单** | `getArticles()` 生产直连 | CMS 白名单加 `https://bird-z.github.io` | 🔴 服务端配置（不修前端代码） |

### 5.3 现为本地数据、未来可能接 CMS 的位置（备查，非待办）

| 位置 | 当前数据源 | 若接后端 |
|---|---|---|
| `PopularPage` / `ArticlePage` | 本地 `src/data/articles.json` + `.md`（`sync-articles.mjs` 生成） | 需 CMS 新集合 + 新接口（走变更流程立项） |
| `SciencePage` `STAGES` | 写死数组（含「（示例）」） | 同上 |
| `EventsPage` `EVENT_GROUPS` | 写死数组 + 本地图 | 同上 |
| `Members.jsx` 成员数组 | 写死数组 | 同上 |

### 5.4 接口侧硬性约束（改动红线）

- `payload.js` 是 CMS 唯一通道：禁止组件内 `fetch`、禁止加 query 参数/请求头/分页。
- CORS 是固定白名单：任何新部署 origin 必须先加白名单，否则首屏轮播静默卸载。
- `incrementArticleView` 仅接受 `^\d+$` 的 id；CMS 改 UUID 则该功能静默失效（已知约束）。
- 线上仅 **1 篇文章**（docs/api.md §A.3）：空态/单篇态是常态，任何列表 UI 须在该规模下成立。

---

## 6. 建议执行顺序

```
D1（CMS 白名单，外部依赖先行，不阻塞代码）
  │
A6（Nav 换 CARD_GROUPS，无外部依赖，可立即做）
  │
C（确认组织机构/校园墙借锚 + 统一「知识普及」文案）
  │
A1–A5（等报名渠道/B站/部门页决策，到齐即改，小步提交）
  │
B1–B3（等内容供稿，随来随改）
```

- 每一步独立完成、独立提交（`[标识] type: 摘要`），互不阻塞。
- 所有改动遵循 `design.md`：新增 display 文案须跑 `pnpm fonts:build && pnpm fonts:check` 更新行楷子集。
- A2/A3 若引入新页面 → 走 §8 新页面清单（令牌、8 态、响应式底线、reduced-motion）。

---

## 7. 已确认完成（不在待办）

- V1–V10 字体规划全项落地（docs/fonts.md §3 全部「已实现」）
- NewsCarousel→Slogan 离散覆盖翻页、`usePageTurn`、`page-covered` 单一事实源
- Vite 模板死样式、孤儿 Mapp 演示链清除
- dev 环境 `/api → cms.bioqif.com` 同源代理（本地联调已通）
- 行楷子集化管线 `pnpm fonts:build / fonts:check`（prebuild 挂缺字校验）
