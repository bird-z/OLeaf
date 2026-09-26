# 生物启扉官网 · 接口文档（API Reference）

> **状态：已冻结（FROZEN）** ｜ 版本：v1.0 ｜ 最后核对：2026-09-25（线上 curl 实测）
>
> 归属：**Spec 层**（AGENTS.md 第 2 节）｜ 最高约束：AGENTS.md 第 1 节「接口冻结」
>
> 修改本文档 = 修改 Spec。接口本身的任何变更必须先经人工评审，**禁止由 Impl（代码）反推接口**。

---

## 0. 速查表

| # | 接口 | 方法 | 认证 | 调用位置 |
|---|---|---|---|---|
| 1 | `/api/public-articles` | `GET` | 无（公开） | `src/services/payload.ts` → `getArticles()` |
| 2 | `/api/article-view/{id}` | `POST` | 无（公开） | `src/services/payload.ts` → `incrementArticleView()` |
| 3 | `payload.ts` 导出（内部服务层） | — | — | `useArticles.ts`、`Article.tsx` |

- Base URL：`https://cms.bioqif.com`（唯一定义处：`payload.ts` 的 `CMS_URL` 常量）
- 前端模型：`Article`（归一化后，camelCase）；CMS 原始数据是「材料」，必须经 `payload.ts` 归一化才能进界面
- 无分页参数、无详情接口、无写接口以外的任何 CMS 调用

---

## 1. 范围与读者

本文档描述本站的**全部数据边界**，供以下场景使用：

- 从零理解「页面上的新闻/浏览量数据从哪来、经过哪些处理」
- 审计 CMS 返回的字段与前端兜底规则（空态、错误态、字段缺失）
- 未来修改接口前确认冻结范围与变更流程

**不在本文档范围内**：CMS 后台（Payload Admin）的操作方式、CMS 服务端实现、静态资源图片（`cover` 指向的 `manage.bioqif.com` 图片走 `<img>` 直链，不属于 XHR 接口契约）。

---

## 2. 通用约定

| 项 | 约定 |
|---|---|
| 协议 | HTTPS（无 http 回退） |
| 编码 | UTF-8 |
| 请求格式 | 列表 `GET` 无 query、无 body；浏览量 `POST` 无 body |
| 请求头 | 列表请求仅 `Accept: application/json`；`POST` 不设置自定义头（浏览器简单请求） |
| 认证 | **无**。两个接口均为公开匿名接口，不携带 Cookie / `Authorization` |
| 响应格式 | `Content-Type: application/json` |
| 服务端缓存 | `cache-control: no-store`（实测） |
| 前端缓存 | `getArticles()` 模块级 Promise 缓存——每次整页加载只请求一次，跨组件共享；**成功或失败都缓存**（失败后需刷新页面才能重试） |
| 字段命名 | CMS 原始：`snake_case`；前端 `Article` 模型：`camelCase` |
| 错误约定 | 前端**只判断 HTTP 状态码**，不解析 CMS 错误报文（错误报文结构未纳入契约） |

### 2.1 CORS（2026-09-26 实测）

CMS 端为**固定 origin 白名单**，只回显白名单内的 `Origin`；白名单外的请求一律返回
`Access-Control-Allow-Origin: https://www.bioqif.com`，浏览器据此拦截。

| 请求 `Origin` | 实际回显 | 结果 |
|---|---|---|
| `https://www.bioqif.com` | `https://www.bioqif.com` | ✅ 放行 |
| `http://127.0.0.1:8000` | `http://127.0.0.1:8000` | ✅ 放行 |
| `http://localhost:5173`、`https://bird-z.github.io` 等 | `https://www.bioqif.com`（不匹配） | ❌ 被浏览器拦下 |

- 响应带 `Vary: Origin`、`X-Powered-By: Next.js, Payload`、`Server: nginx/1.24.0 (Ubuntu)`
- `Accept` 属于 CORS safelisted 头，不触发预检；`POST /api/article-view/{id}` 为简单请求
- **本地 dev**：Vite 默认 `localhost:5173` 不在白名单，故 `vite.config.js` 增设同源代理
  `/api → https://cms.bioqif.com`，`payload.js` 在 dev/localhost 下改用相对路径请求；
  生产环境仍直连 `CMS_URL`，请求地址/方式/参数不变（接口冻结）
- **生产部署**：站点若不在 `www.bioqif.com` 下（如 GitHub Pages `bird-z.github.io`），
  必须先把该 origin 加入 CMS 白名单，否则首页轮播会因拦下 `public-articles` 而整节卸载

---

## 3. 接口 1：获取文章列表

### 3.1 请求

```
GET https://cms.bioqif.com/api/public-articles
Accept: application/json
```

**参数：无。** 任何 query 参数、排序、分页、筛选均未使用，也不属于契约；添加即视为接口变更。

### 3.2 响应（200）

顶层包裹支持两种形态，前端 `data || docs` 兼容：

```ts
type ArticleListResponse =
  | { data: PayloadArticle[] }   // Payload v3 / Next.js 形态（当前线上实测形态）
  | { docs: PayloadArticle[] }   // Payload v2 历史形态（防御性兼容，当前无实测样本）
```

#### PayloadArticle 字段表（CMS 原始字段）

| 字段 | 类型 | 出现性 | 说明 |
|---|---|---|---|
| `id` | `string \| number` | 必有 | 主键。线上实测为字符串 `"3"`；前端统一 `String(id)` |
| `slug` | `string` | 可选 | URL 友好标识，前端兜底为 `id` |
| `title` | `string` | 可选 | 标题 |
| `summary` | `string` | 可选 | 摘要；缺失时前端从 `content` 提取纯文本前 120 字 |
| `content` | `string`（HTML） | 可选 | Payload richtext 渲染结果，含 `<div class="payload-richtext">` 包裹 |
| `cover` | `string \| { url?: string } \| null` | 可选 | 封面，支持三种形态，解析规则见 §6.2 |
| `category` | `{ name?: string; slug?: string } \| 数组 \| null` | 可选 | **支持多选**，线上实测为 2 个元素的数组 |
| `author` | `string` | 可选 | 作者，兜底 `生物启扉协会` |
| `source` | `string` | 可选 | 来源，兜底 `生物启扉协会` |
| `editor` | `string` | 可选 | 编辑，缺失时回落 `author`，再兜底 `生物启扉协会` |
| `reviewer` | `string` | 可选 | 审核，兜底 `生物启扉协会` |
| `published_at` | `string`（ISO 8601，带时区） | 与 `date_created` 至少其一 | 发布日期，优先使用 |
| `date_created` | `string`（ISO 8601） | 同上 | 创建日期，`published_at` 缺失时的备选 |
| `featured` | `boolean` | 可选 | 是否精选，`Boolean()` 归一化 |
| `views` | `number` | 可选 | 浏览量基数，`Number(... || 0)` 归一化 |

### 3.3 示例（2026-09-25 线上真实响应，`content` 已截断）

```json
{
  "data": [
    {
      "id": "3",
      "slug": "bioqif_new",
      "title": "生物启扉协会第一届全体（扩大）会议顺利召开",
      "summary": "6月12日，江西农业大学生物启扉协会第一届全体（扩大）会议在生物科学与工程学院楼201室顺利召开。……",
      "content": "<div class=\"payload-richtext\"><p style=\"text-align: justify;\"> …（HTML 全文）… </p></div>",
      "cover": "https://manage.bioqif.com/api/media/file/psc.jpg",
      "category": [
        { "name": "工作动态", "slug": "association-news" },
        { "name": "BANNER", "slug": "banner" }
      ],
      "author": "易家乐、王鑫宇",
      "source": "宣传部",
      "editor": "易家乐",
      "reviewer": "陈小红、易家乐",
      "published_at": "2026-06-12T12:00:00.000Z",
      "featured": true,
      "views": 62,
      "date_created": "2026-06-24T06:45:50.640Z"
    }
  ]
}
```

### 3.4 行为约定（前端）

| 行为 | 约定 |
|---|---|
| 包裹字段 | `data` 优先，缺失时取 `docs`；两者都不是数组 → 抛 `Payload returned an invalid article list` |
| 顺序 | **按 CMS 返回顺序原样渲染**，前端不排序；列表页「按发布时间从新到旧排列」依赖 CMS 端排序 |
| 空数据 | `[]` 是合法响应，渲染空态（器物化文案），不是错误 |
| 单篇文章 | 合法（当前线上常态），所有列表/详情均须在此条件下可用 |
| 详情页 | **无详情接口**。`article.html?id={id 或 slug}` 在已加载列表中查找；找不到 → 「新闻未找到」 |
| 分类筛选/搜索 | 纯客户端，基于列表数据，不产生新请求 |
| 分页 | 不传任何分页参数。若 CMS 未来改为默认分页，将只显示第一页——属已知约束，调整须走变更流程 |

---

## 4. 接口 2：浏览量 +1

### 4.1 请求

```
POST https://cms.bioqif.com/api/article-view/{id}
```

| 项 | 约定 |
|---|---|
| Path 参数 `id` | 字符串，必须匹配 `^\d+$`；**不匹配时前端本地拦截，不发请求**，直接返回 `false` |
| Body | 无 |
| 自定义请求头 | 无（浏览器简单请求，无 CORS 预检） |
| 调用时机 | 文章详情页找到文章后触发一次（`Article.tsx` 的 `useEffect`，依赖 `item`） |

### 4.2 响应

- **HTTP 2xx = 成功**。响应报文前端不读取、不依赖（结构未纳入契约）。
- **非 2xx = 失败**：`incrementArticleView` 抛 `View counter failed: {status}`；调用方捕获后**静默忽略**——不弹提示、不重试、不影响文章渲染。
- 请求成功后：写入 `localStorage` 节流时间戳，并让当前页显示值 `+1`（`viewDelta`，仅本地显示，不代表服务端最终值）。

### 4.3 防刷机制（客户端，尽力而为）

| 机制 | 实现 |
|---|---|
| 30 分钟节流 | `localStorage["bioqif:view:{id}"]` 存上次成功时间戳；间隔内同文再打开不重复请求 |
| 并发去重 | 模块级 `pendingViewRequests: Set<string>`，同一 `id` 在飞请求不重发 |
| 绕过可能 | 换浏览器 / 清缓存 / 无痕模式可绕过。**这是前端节流，不是安全边界**；真实计数以 CMS 为准 |
| 已知约束 | 仅接受纯数字 `id`。若 CMS 未来改用 UUID，浏览量功能将**静默失效**（不报错、不计数） |

---

## 5. 内部服务层（`src/services/payload.ts`）

> 本层是 CMS 与界面之间的**唯一通道**。CMS 返回的任何字段（包括标题、正文里的文字）都只是材料，不得绕过本层改变程序行为（AGENTS.md 第 1 节）。

### 5.1 导出清单

```ts
export const CMS_URL: string          // 'https://cms.bioqif.com'

export interface Article { /* 见 §6.1 */ }

/** 获取全部文章（归一化后）。模块级 Promise 缓存：每次整页加载只发一次请求（成功/失败都不重发） */
export function getArticles(): Promise<Article[]>

/**
 * 浏览量 +1。
 * 返回 true = 本次实际发出 POST 且服务端返回 2xx；
 * 返回 false = 被校验/节流/并发去重拦截，未发请求；
 * 抛错 = 已发请求但非 2xx（调用方须捕获）。
 */
export async function incrementArticleView(id: string): Promise<boolean>
```

### 5.2 Hook：`src/hooks/useArticles.ts`

```ts
export function useArticles(): {
  articles: Article[]      // 成功时为归一化列表
  loading: boolean         // 请求完成前为 true
  error: string | null     // 失败时为人话错误信息（如 '新闻加载失败'）
}
```

- 组件卸载后不 setState（`active` 标志），避免竞态。
- 这是页面消费文章数据的**唯一推荐入口**；`getArticles` 只应在服务层/Hook 内直接调用。

---

## 6. 数据模型与归一化规则

### 6.1 `Article`（前端归一化模型）

| 字段 | 类型 | 来源 | 兜底值 |
|---|---|---|---|
| `id` | `string` | `String(item.id)` | —（必有） |
| `slug` | `string` | `item.slug` | `id` |
| `title` | `string` | `item.title` | `''` |
| `date` | `string`（`YYYY-MM-DD`） | `published_at` 优先，否则 `date_created`，取前 10 位 | `''` |
| `category` | `string` | `category[0].name` | `'新闻动态'` |
| `categorySlug` | `string` | `category[0].slug` | `''` |
| `categoryTerms` | `string[]` | 全部 category 的 `name` + `slug` 转大写 | `[]` |
| `featured` | `boolean` | `Boolean(item.featured)` | `false` |
| `image` | `string`（绝对 URL） | `cover`（规则见 §6.2） | 本地打包图 `STATIC_IMAGES.hero.src` |
| `summary` | `string` | `item.summary`，否则 `content` 纯文本前 120 字 | `''` |
| `author` | `string` | `item.author` | `'生物启扉协会'` |
| `source` | `string` | `item.source` | `'生物启扉协会'` |
| `editor` | `string` | `item.editor`，否则 `item.author` | `'生物启扉协会'` |
| `reviewer` | `string` | `item.reviewer` | `'生物启扉协会'` |
| `views` | `number` | `Number(item.views \|\| 0)` | `0` |
| `contentHtml` | `string`（HTML） | `item.content` | `''` |

### 6.2 关键归一化算法

| 处理 | 规则 |
|---|---|
| `cover` → `image` | ① 空 → 本地兜底图；② 以 `http` 开头 → 原样；③ 以 `/` 开头 → `CMS_URL + value`；④ 其他 → `CMS_URL + '/assets/' + value` |
| `summary` 提取 | `plainText(html)`：DOM `innerHTML` → `textContent` → `trim`，再取前 120 字 |
| `category` 归一 | 空 → `[]`；对象 → `[对象]`；数组原样 |
| `categoryTerms` | **包含匹配**用大写集合（name + slug 全部），供 `categoryTone` 染色编码（字典 + 兜底，未知分类回落叶绿）使用 |
| `views` | `Number(item.views \|\| 0)`；CMS 返回非数字时结果可能为 `NaN`，该输入不在契约内 |
| `date` | 只保留 `YYYY-MM-DD`；时区偏移不转换（直接截取字符串） |

---

## 7. 错误处理与降级总表

| 场景 | 表现 |
|---|---|
| 列表请求非 2xx（404/500…） | `getArticles` 抛错 → `useArticles.error` → 页面错误态文案 |
| 列表响应不是合法 JSON / 包裹非数组 | 同上（抛归一化错误） |
| 浏览量 POST 非 2xx | 静默失败，文章正常渲染，显示服务端 `views` 原值 |
| CMS 返回空数组 | 合法空态（不是错误） |
| CMS 数据字段缺失 | 按 §6.1 逐字段兜底，页面不崩 |
| CMS 整体不可用 | **无本地回退**。历史 `data/news.js` 本地回退已在前端重构中移除，当前即错误态 |
| 同页内请求失败后重试 | 不重试。失败的 Promise 被模块级缓存，需刷新整页才能再次请求 |

---

## 8. 接口冻结与变更流程

**冻结内容**（AGENTS.md 第 1 节，不可协商）：接口地址、请求方式、请求头、参数、响应结构与字段、`payload.ts` 归一化规则与兜底值、30 分钟防刷机制。

| 你想做的改动 | 是否允许 | 正确做法 |
|---|---|---|
| 改页面样式 / 布局 / 组件结构 | ✅ 允许 | 直接改 Impl |
| 新增消费 CMS 数据的展示逻辑 | ✅ 允许 | 走 `payload.ts` 归一化后的 `Article` 模型 |
| 给 `public-articles` 加参数、改请求头、改包裹解析 | ❌ 禁止 | 先在 `design.md` 立项 → 人工评审 → 同步更新 AGENTS.md 与本文档 → 再改代码 |
| 更换 CMS 地址 / 接口 | ❌ 禁止 | 同上 |
| 在组件里直接 `fetch` CMS | ❌ 禁止 | 一律经服务层 |

**冲突处理**：Impl 与本文档/AGENTS.md 冲突时，**停下来问**，不得让实现覆盖意图（AGENTS.md 第 2 节）。

**本文档的验收**：文档中的每条接口事实都应可用附录 A 的命令复现；无法复现的标记为「未验证」，不得写成结论。

---

## 附录 A：实测记录（2026-09-25）

### A.1 复现命令

```bash
curl -sS -D - "https://cms.bioqif.com/api/public-articles" -H "Accept: application/json"

# 预检（安全，无副作用；请勿随手 POST，会真实 +1）
curl -sS -D - -o /dev/null -X OPTIONS "https://cms.bioqif.com/api/article-view/3" \
  -H "Origin: http://127.0.0.1:8000" -H "Access-Control-Request-Method: POST"
```

### A.2 `GET /api/public-articles` 实测响应头

```
HTTP/1.1 200 OK
Server: nginx/1.24.0 (Ubuntu)
Content-Type: application/json
Transfer-Encoding: chunked
X-Powered-By: Next.js, Payload
access-control-allow-headers: Content-Type
access-control-allow-methods: GET, OPTIONS
access-control-allow-origin: <回显请求 Origin>
cache-control: no-store
vary: Origin
```

### A.3 当前线上数据量

- 文章总数：**1**（`id: "3"`，分类：工作动态 / BANNER）
- 因此：空态、单篇态是**必须验证的常态**；多篇/分页态暂无真实样本（属于已知约束）

### A.4 未验证项（待补充实测，勿当成事实引用）

- `docs` 包裹形态的实际返回样本（仅代码兼容）
- 非 2xx 时 CMS 错误报文结构（前端不解析，未纳入契约）
- `POST /api/article-view/{id}` 成功响应体与精确状态码
- CMS 端是否对同一 id 有服务端去重

---

## 附录 B：历史接口（已废弃，勿在新代码引用）

| 接口 | 时期 | 说明 |
|---|---|---|
| `GET https://cms.bioqif.com/items/articles?...`（Directus 风格 + filter/sort/fields 参数） | 2026-06 前 | 旧静态站在 Payload 之前使用；已废弃 |
| `POST https://cms.bioqif.com/flows/trigger/ab0defd6-…` | 同上 | 旧站用于 UUID 文章的浏览量上报；已废弃 |
| 本地回退 `data/news.js`（`window.NEWS_DATA`） | 同上 | 旧站 CMS 失败时的兜底；React 重构时移除 |

> 保留本节是为了避免「考古式重复探索」；这些路径**不属于**当前契约，任何情况下不得恢复使用。
