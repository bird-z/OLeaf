# NewsCarousel → Slogan 覆盖翻页转场

## 摘要

在第一屏（BANNER 轮播）与第二屏（Slogan hero）之间实现「覆盖翻页」缝接：滚动过程中轮播被原地钉住并随暗纱渐暗，Slogan 从底部整屏盖上来；回滚时对称反向（拉下揭示）。同时把 Slogan 的入场编排（data-reveal stagger / 逐字 reveal / foot 规则线）从「页面加载即播」改为「进入视口播放一次」——后者顺带修复现存的入场被提前播完的问题。全程滚动驱动、零额外滚动距离，不新增定时器动画。

## 行为与接口变更

### 1. 新增 `src/components/MainCp/usePageTurn.js`（新 hook）
- 在 `Home.jsx` 中调用一次。`prefers-reduced-motion` 下直接 return（与 `useFullpage` 逃生一致）。
- 每次 scroll/resize（rAF 节流、passive）计算：
  - `heroTop = hero.getBoundingClientRect().top + scrollY`；`heroTop <= 0`（轮播卸载/未挂载）时变量归零并跳过。
  - `--page-turn` = `clamp(scrollY / heroTop, 0, 1)`（无单位进度）。
  - `--page-shift` = `min(scrollY, heroTop)`，单位 px（钉屏位移量，避免 CSS 端换算 svh）。
- 两个变量写在 `document.documentElement` 上，供两个兄弟区块共用。

### 2. `NewsCarousel.css`（钉屏 + 暗纱）
- `.news-carousel` 增加 `transform: translate3d(0, var(--page-shift, 0px), 0)` 与 `will-change: transform` → 滚动时反向补偿天然位移，视觉上钉在视口顶部，Slogan 依 DOM 顺序自然覆盖其上。
- 新增 `.news-carousel::before` 暗纱（`z-index: 4`，`background: var(--color-ink)`，`opacity: calc(var(--page-turn) * 0.55)`，`pointer-events: none`）→ 未被覆盖的残余区域随进度压暗，复用「影像恒定组」的暗场语义。
- `prefers-reduced-motion` 下重置：`transform: none`、暗纱 `opacity: 0`。
- 备注：暗纱覆盖整块（含底部字幕）——字幕位于轮播底部，被 Slogan 自下而上最先盖住，无需单独退场动画。

### 3. `NewsCarousel.jsx`（被覆盖时休眠）
- 新增 `covered` 状态：当 `--page-turn` 达到 1（可复用现有 IntersectionObserver 思路，或直接由 usePageTurn 写入状态/类名）时：
  - 根节加 `is-covered` 类 → CSS `visibility: hidden`（不再渲染/命中测试）。
  - 加 `inert` 属性（React 19 支持）→ 字幕链接与箭头不可聚焦，避免键盘焦点落入被覆盖区。
  - `canPlay` 追加 `!covered` → 被覆盖期间暂停自动播放，不再空转。

### 4. `Slogan.jsx`（入场改为进视口播一次）
- 新增 IntersectionObserver（`threshold: 0.4`）：hero 约 40% 可见时给 `heroRef` 加 `is-live` 类并 `disconnect()`（只播一次）。
- 与翻页节奏衔接：Slogan 升至约 40% 覆盖率时开始入场编排（总长 ≈1.1s），与 `useFullpage` 的 1.25s 弹性滚动大致同步收束。

### 5. `Slogan.css`（入场动画挂到 `.is-live`）
- 保持初始隐藏态不变，仅把 `animation` 属性从无条件移到 `.hero.is-live` 作用域下：
  - `.hero [data-reveal]` → `.hero.is-live [data-reveal]`（`hero-reveal` + `--i` stagger）。
  - `.hero__letter` → `.hero.is-live .hero__letter`（`hero-letter` + 340ms 起 24ms 步进）。
  - `.hero__foot::before` → `.hero.is-live .hero__foot::before`（`hero-rule` scaleX）。
- `prefers-reduced-motion` 块改写为「直接终态、不依赖 is-live」：`data-reveal`/逐字 `animation: none; opacity: 1; transform: none`，foot 规则线 `transform: scaleX(1)`（替换现有 `animation-duration: 150ms` 写法）。

### 6. `design.md`
- 变更记录追加一条：覆盖翻页转场 + Slogan 入场时机修正（含 `--page-turn`/`--page-shift`/`is-live`/`is-covered` 新约定）。不新增令牌（暗纱透明度系数非令牌类）。

## 边界与失败模式
- **轮播整节卸载**（接口失败/0 BANNER）：`heroTop ≈ 0` → 变量保持 0，无钉屏无暗纱；hero 入场仍由 IO 正常触发。
- **弹性过冲**：`--page-shift` 按 `heroTop` 封顶、`--page-turn` 按 1 封顶，easeOutBack 过冲段不越界。
- **reduced-motion**：JS 不写变量，CSS 强制钉屏/暗纱/入场全部塌缩为终态或原生行为。
- **滚动回退**：对称反向，轮播自顶部揭示、暗纱收回。
- **无快照回滚风险**：`visibility/inert` 仅在完全覆盖时置位，回滚即恢复。

## 测试与验证
- `npx vite build` 通过；`npx oxlint` 对改动文件无告警；`node --check` 校验新 hook。
- 视觉验证按项目约定（design.md §13 不调用浏览器工具）交人工确认：依次覆盖——轮播单张/多张、快滚/慢滚、回滚、reduced-motion、轮播卸载（断网或空 BANNER）、移动端窄高视口。

## 假设与默认（已随选项锁定）
- 转场形态 = 覆盖翻页；Slogan 入场 = 进视口播一次（均按推荐项锁定）。
- 不做「字幕形变」等复杂转场；缝接处不加额外装饰线（保持 modern-minimal）。
- `usePageTurn` 放 `MainCp`、由 `Home.jsx` 调用，变量作用域在 documentElement（不侵入 `useFullpage`）。
