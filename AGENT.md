# AGENT.md — 多 Agent 协作公约

> 本文件是所有在本仓库工作的 AI agent（pi / Claude Code / Codex / 其他终端会话）必须遵守的协作协议。
> **目的**：多个 agent 可能同时操作同一工作目录，先读此文件再动手。

---

## 1. 项目速览

- 站点：江西农业大学生物启扉协会官网（OLeaf / BioQif）
- 栈：React 19 · Vite 8 · Tailwind 4 · GSAP · motion · HashRouter
- 命令：`pnpm dev` / `pnpm build` / `pnpm lint`（oxlint）/ `pnpm server`（mock :3001）
- 设计规范：`tokens.css` 是全站唯一令牌源；`design.md` 记录设计决策与变更；`PLAN.md` 是当前任务计划

## 2. 开工前必读（每次会话开始执行）

```bash
git status                    # 看工作区有没有别人的未提交改动
git log --oneline -10         # 看最近谁提交了什么
git stash list                # 有没有 stash 中的在途工作
cat .agent-claims.md          # 看其他 agent 当前认领了哪些文件
```

- 工作区存在**不是你改**的未提交文件 → 视为他人在途工作，**不得** `checkout` / `restore` / `stash` / 覆盖。
- `.agent-claims.md` 中已被认领的文件 → 不要碰，或等对方释放。

## 3. 文件认领机制（核心）

编辑任何文件**之前**，先往 `.agent-claims.md` 追加一行：

```
| 文件路径 | agent 标识 | 开始时间 | 任务一句话 | 状态 |
```

- agent 标识：用终端名/会话特征区分（如 `pi-A`、`pi-B`、`claude-1`），整个会话保持一致。
- 完成后把状态改为 `done` 或删除该行；**提交信息前缀也带同一标识**（如 `[pi-A] fix: ...`）。
- 认领以 `.agent-claims.md` 为准；若该文件自身有并发写入冲突，小步重试，不要整文件重写他人行。

## 4. 高危共享文件（默认上锁，改动前必须确认无人认领）

这些文件被多处引用，并发改必炸：

- `tokens.css`、`src/index.css`、`src/App.css` —— 全局样式/令牌
- `index.html`、`vite.config.js`、`package.json`、`pnpm-lock.yaml`、`tsconfig.json`
- `src/main.jsx`、`src/App.jsx`、`src/Mapp.jsx` —— 入口与路由
- `design.md`、`PLAN.md`、`docs/api.md` —— 共享文档（追加段落即可，别重写）
- `src/components/QifSiteNav.jsx`、`src/components/SiteHeader.jsx` —— 全站导航

规则：改这些文件前先认领 + 读最新磁盘内容（不要凭旧记忆改）。

## 5. Git 纪律

- **允许**：`git add <自己改的文件>`（精确路径，不用 `git add -A`）、小步 `git commit`、读取类命令。
- **禁止**：
  - `git push`（本地领先 origin/main，推送由人类决定）
  - `git reset --hard` / `git clean -f` / `git checkout -- <他人文件>`
  - `git rebase` / `git merge` / 切分支 / 新建分支（分支策略归人类管）
  - `git stash`（会收走别人的在途改动）
  - 改 `dist/`、`node_modules/`、`pi-session-*.html`
- commit message 格式：`[标识] type: 摘要`，一次提交只做一件事，方便他人 `git log` 识别。

## 6. 写代码约定（摘自 design.md / PLAN.md，防风格冲突）

- 新样式优先用 `tokens.css` 现有令牌，新增令牌要同时在 `design.md` 变更记录说明。
- 动画必须处理 `prefers-reduced-motion`（塌缩为终态）。
- JS 驱动滚动的进度变量写 `document.documentElement` CSS 变量（如 `--page-turn`），不直接改元素 style。
- 文档同步：行为/接口变更要在 `design.md` 追加变更记录；计划写 `PLAN.md`（追加式，不覆盖已有内容）。

## 7. 冲突处理

- 发现目标文件被别人认领或有未提交改动 → **停下**，在 `.agent-claims.md` 记一条 `conflict:` 备注并向用户说明，不要强行覆盖。
- 不小心覆盖了他人改动 → 立即 `git diff` 定位、尽量恢复，并在 claims 文件里说明。
- 两个 agent 需要改同一文件的不同区块 → 由后到者等前者 commit 后再动手（文件认领是整文件粒度）。

## 8. 收尾清单（每次任务结束前）

- [ ] `pnpm build` + `pnpm lint` 通过（至少确认自己改的文件无告警）
- [ ] `.agent-claims.md` 中自己的行已标记 done 或清除
- [ ] `git status` 输出干净、变更已按标识前缀提交
- [ ] 若改了共享行为，`design.md` 已追加变更记录
