# 生物启扉协会 EcoRem · 设计体系(design.md)

> 本文件是全站**唯一设计系统事实来源**。任何页面、组件、动效的新建与修改,必须引用
> `tokens.css` 中的令牌,禁止内联原始色值 / 字体栈 / 随意时长。
> 令牌缺失时,先在 `tokens.css` 中新增命名令牌,再引用。
>
> 依据:Anthropic `frontend-design` skill(独特、有主张、反模板)+ Hallmark(纪律与门禁)。

---

## 1. 设计主张(Point of View)

- **主题**:夜空下的生命观测。暗底星轨摄影 + 行楷书法标题 + 精确的数据排版,
  是「生物 × 修护(Eco × Rem)」这一双重身份的直接表达。
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
| `--color-eco` / `--color-eco-bright` | 叶绿,**生态语义专用**(EcoRem 相关、亮 / 暗底) |
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

## 4. 字阶(1.25 major third)

`--text-xs(0.64rem)` → `--text-sm` → `--text-base(1rem)` → `--text-md` →
`--text-lg` → `--text-display-s(clamp 2.25–3.8rem)` → `--text-display(clamp 3–7rem)`

根字号 18px(≤1024px 降 16px),行高 145%,字距 0.18px。新尺寸必须落在刻度上,
禁止 `font-size: 17px` 之类的刻度外值。

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

## 12.AGENT>
Agent:
默认不调用视觉模型检查:compile是例外，允许对可视
绘图板的离线栅格化结果做视觉检查和选代。则试:compile 以外的视觉效果可以默认正确，人发现问题会让你修复。不要调用任何浏览器工具。功能性的东西应该直接用API可能有并行的任务-但没有冲突。提交时留意它们即可。实现时小步提交，英文一行commit message。保持线性提交历史，远端有提交时 rebase。