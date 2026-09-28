import CardNav from "../CardNav";
import ThemeToggle from "../ThemeToggle.jsx";
import { CARD_GROUPS } from "../../data/homeNav.js";
import logo from "../../assets/logo2.png";

/* 子页导航（PageShell 骨架）：与首页 nav2 共用 CARD_GROUPS，
 * 一次消灭全部 href="#" 死链并统一导航口径（PRD A6）。
 * 锚点项（#about 等）由 CardNav 内部走 useAnchorScroll：子页先回 Home 再滚动。 */
function Nav() {
  return (
    <CardNav
      logo={logo}
      logoAlt="BioQif · 江农学生协会"
      actions={<ThemeToggle />}
      items={CARD_GROUPS}
    />
  )
}

export default Nav
