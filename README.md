# OLeaf · 生物启扉协会官网

江西农业大学生物启扉协会（EcoRem）官网 —— 修护生态，共生未来。

## 技术栈

React 19 · Vite 8 · Tailwind CSS 4 · GSAP · motion · react-router（HashRouter）

## 常用命令

```bash
pnpm dev        # 开发
pnpm build      # 构建 → dist/
pnpm preview    # 预览构建产物
pnpm lint       # oxlint
```

## 部署（GitHub Pages）

站点发布于 `https://bird-z.github.io/OLeaf/`：

1. `vite.config.js` 已设 `base: '/OLeaf/'`，资源路径自带子路径前缀
2. 部署方式：`dist/` 推送到 `gh-pages` 干净分支，Pages 源选该分支 `/(root)`
3. 前端路由为 HashRouter（`/#/science`），规避 Pages 无 SPA 回退的 404

## 设计体系

- `tokens.css` 是全站唯一设计令牌源（Cobalt 骨架 + 品牌紫交互 + 叶绿 eco 语义）
- 字体：行楷（display 标题，子集化 woff2 于 `src/assets/fonts/`）· Geist（正文）· Geist Mono（数据/标签）
- 新增 display 文案需更新行楷子集字形

## 贡献者

- [@yu-mao-code](https://github.com/yu-mao-code)
- [@wanfeng785](https://github.com/wanfeng785)
- [@leo4146](https://github.com/leo4146)
