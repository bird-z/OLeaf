# 全站字体规划 · 字体档案与裁决记录（docs/fonts.md）

> 本文件是 `design.md §4.3`「全站字体规划」的**执行文档**：字体识别、风格分析、
> V1–V10 逐项裁决状态。结构化数据源在 `src/data/fontCatalog.js`，可视化验证载体在
> **dev-only 样张页 `/#/specimen`**（`pnpm dev` 后打开；生产构建不含该页）。
>
> 规则：**每个设计先经人工验证，再实现**。本文件的 V1–V10 逐项确认后才改
> `tokens.css` / `design.md` / 组件；未确认项不实现。

---

## 0. 怎么用

1. `pnpm dev` → 打开 `http://localhost:5173/#/specimen`。
2. 在样张页对照 display / mono / body 三台，切 18px / 16px 根字号、五档宽度、亮暗主题。
3. 逐项（V1 → V10）在对话中确认；确认结果回写本文件第 3 节状态列。
4. 确认一项、实现一项、小步提交一项（英文一行 commit message，前缀 `[pi-F]`）。

## 1. 字体识别结论（由 fontTools 读取 name / cmap / OS-2 表）

| 字体 | 文件 / 来源 | 体积 | 字形 | 字重 | 许可 | 现状 |
| --- | --- | --- | --- | --- | --- | --- |
| Zhi Mang Xing（志莽行书） | `src/assets/fonts/zhi-mang-xing-subset.woff2`（自托管子集） | 33 KB | 120 | 400 | OFL-1.1 | 生产在用（display） |
| LemiQiuXuShouShuTi（乐米秋序手书体） | `src/assets/fonts/lemie-qiuxu.woff2` | 3.05 MB | 7043 | 400 | **版权声明 All rights reserved，仓库无许可文件** | 全站无人引用 |
| Alimama ShuHeiTi（阿里妈妈数黑体） | `src/assets/fonts/AlimamaShuHeiTi-Bold.woff2` | 663 KB | 6993 | 700（仅 Bold） | 免费商用（随附法律声明） | 全站无人引用 |
| IBM Plex Mono | `IBMPlexMono-400.woff2` + `IBMPlexMono-500.woff2` | ~15 KB ×2 | 229 | 400 / 500 | OFL-1.1 | 全站无人引用 |
| iconfont（主题切换图标） | `src/assets/font_f3y78zakpcq/iconfont.ttf` | 2 KB | 1 | 400 | iconfont 导出 | 生产在用（ThemeToggle U+E6E8） |
| Geist Variable | `@fontsource-variable/geist` | 按分包 | 拉丁/西里尔 | 100–900 可变 | OFL-1.1 | 生产在用（body 拉丁） |
| Noto Sans SC Variable | `@fontsource-variable/noto-sans-sc` | 按分包 | 简体中文 | 100–900 可变 | OFL-1.1 | 生产在用（body 中文） |
| Geist Mono | `@fontsource/geist-mono` | 按分包 | 拉丁/symbols2 | 100–900 | OFL-1.1 | 生产在用（mono） |

**关键结论**：`lemie-qiuxu` 的版权为「©️2026 Hangzhou Lemi Network Technology Co., Ltd.,
All rights reserved」，仓库内无授权文件 —— **默认不接入生产**，样张仅供风格比较。

## 2. 风格分析

| 字体 | 骨架 | 对比 | 端点 | 中宫/字面 | 字宽 | 语气 | 适配角色 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Zhi Mang Xing | 毛笔行楷，赵体一路，取横势 | 中等，提按可见 | 出锋、牵丝连带 | 中宫收紧、字面偏小 | 偏窄 | 书卷、沉静、田野笔记 | D1/D2/D3（现用） |
| LemiQiuXu | 硬笔手书，比行楷规整现代 | 低，近似等宽 | 圆头/平切，少连带 | 中宫开阔、字面大 | 偏宽 | 清新、笔记感、偏年轻 | D 候选（未授权，不接入） |
| Alimama ShuHeiTi | 几何数黑，切角方端 | 无，笔画等宽 | 平切 | 中宫开阔、字面大 | 偏宽 | 科技、数据、数字仪表 | 数字/数据（仅 700） |
| IBM Plex Mono | 人文 + 几何混合等宽 | 低 | 方形端点 | 等宽、字面中等 | 等宽 | 技术仪器、终端 | M 候选 |
| Geist Variable | 几何无衬线 | 无 | 平切 | 中性 | 常规 | 现代、精密、界面 | W/T/L/U |
| Noto Sans SC | 人文无衬线 | 无 | 平切 | 中性偏开 | 常规 | 中性、易读 | L/T 中文 |
| Geist Mono | 几何等宽 | 无 | 平切 | 中性 | 等宽 | 现代、克制、仪器 | M（现用） |

## 3. V1–V10 裁决记录

> 状态：待验证（默认） / 已确认 / 已实现 / 已删除 / 已否决

| 项 | 主题 | 推荐 | 备选 | 状态 |
| --- | --- | --- | --- | --- |
| V1 | display 主字体去留（Zhi Mang Xing vs LemiQiuXu） | 保留 Zhi Mang Xing；LemiQiuXu 未授权，不接入 | 取得授权后替换 / 并存为第二 display 角色 | 待验证 |
| V2 | 阿里妈妈数黑体去留 | 删除（仅 Bold，会引入第三套中文字族） | 仅用于数字/数据（须改 §4.1「M 一律 mono」） | 待验证 |
| V3 | mono 去留（Geist Mono vs IBM Plex Mono） | 删除 IBM Plex Mono，保持「2+1」 | 替换为 IBM Plex Mono / 并存 | 待验证 |
| V4 | iconfont 去留 | 保留（ThemeToggle 唯一字形 U+E6E8） | 改用 lucide-react，删 @font-face | 待验证 |
| V5 | 字阶补齐（--text-2xs / xl / 2xl） | xl 1.953rem、2xl 2.441rem、2xs 0.5625rem | 2xs 严格比例 0.512rem / 归入 --text-xs | 待验证 |
| V6 | 字距 / 行高令牌（D/T/L/U/M） | D 0.04em/1.1 · T −0.01em/1.3 · L 0/1.8 · U 0.06em/1.45 · M 0.16em/1.65 | 样张微调 / 仅令牌化 M 级 | 待验证 |
| V7 | 34 处刻度外 font-size 映射 | live 吸附令牌；orphan/template 随死代码删除；clamp 收敛；图标标注图形尺寸 | 全部替换为 rem / 仅集中为组件变量 | 待验证 |
| V8 | 中文字重对齐 | T=700、W=800、L=400/700 | T=600 / 中文统一 500/700 | 待验证 |
| V9 | 子集化 + 缺字校验 | Node 原生 subset-font（免 Python，可进 CI） | fontTools/pyftsubset（本机 4.63.0） / 仅缺字校验 | 待验证 |
| V10 | 未引用资产最终清单 | 按 V1–V3 执行删除或接入 | 保留 Alimama / 全删只用 fontsource | 待验证 |

## 4. 已知风险与前置条件

- `LemiQiuXu` 无授权文件：未确认许可前不得进入 `src/index.css` 或任何生产样式。
- `Alimama ShuHeiTi` 仅 700：`font-synthesis: none` 下不会伪粗，非 700 场景会回退其他字族。
- 根字号 18px / 16px 两档会让 rem 令牌与旧 px 值产生视觉漂移，V7 映射必须两档都核对。
- V9 若采用 `subset-font`，需改动 `package.json` / `pnpm-lock.yaml`（高危共享文件，先认领）。
- display 字体一旦替换，全站 display 文案必须重新子集化并校验中英标点码位（防 tofu）。

## 5. 变更记录

- 2026-09-27 · pi-F · 建立字体档案与 dev-only 样张页（阶段 0+1）：新增
  `src/data/fontCatalog.js`（结构化资产表 + V1–V10 待验证项）、`docs/fonts.md`（本文件）、
  `src/pages/FontSpecimen.{jsx,css}`（`/#/specimen`，生产构建不含）；
  `src/App.jsx` 增 dev-only 动态路由；`design.md §3` 增本文件引用。纯识别/验证载体，
  未改 `tokens.css`、未动任何生产字体。
