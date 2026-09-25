import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAnchorScroll } from '../lib/scrollTo.js';
import ThemeToggle from './ThemeToggle.jsx';
import CardNav from './CardNav.jsx';
import schoolLogo from '../assets/logo.png';
import qifLogo from '../assets/logo2.png';
import { PRIMARY_LINKS, ARCHIVE_LINKS, JOIN_LINK, CARD_GROUPS } from '../data/homeNav.js';
import './QifSiteNav.css';

/* 首页融合导航：页顶 = nav1（bioqif 原版两行头部，令牌化）⇄ 滚动后 = nav2（CardNav 玻璃胶囊）。
 * - 滚动进度 --nav-p = clamp(scrollY / 140, 0, 1)，rAF 节流写在外层容器上；
 * - data-active 在 p 0.5 处切换，用于 inert / aria-hidden 门控（避免两个导航同级可聚焦）；
 * - 页内锚点一律走 useAnchorScroll（HashRouter 下原生 # 会覆盖 hash 路由）；
 * - 仅首页使用；子页继续各自现有导航。 */

const NAV_TRIGGER = 140;

function QifSiteNav() {
  const [active, setActive] = useState('hero'); // 'hero' | 'card'
  const [mobileOpen, setMobileOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const wrapRef = useRef(null);
  const headerRef = useRef(null);
  const archiveRef = useRef(null);
  const activeRef = useRef('hero');
  const anchorScroll = useAnchorScroll();

  /* 滚动进度驱动 nav1 ⇄ nav2 丝滑转化 */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;

    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const p = Math.min(1, Math.max(0, y / NAV_TRIGGER));
      el.style.setProperty('--nav-p', (reduce ? (p >= 0.5 ? 1 : 0) : p).toFixed(4));

      const next = p >= 0.5 ? 'card' : 'hero';
      if (next !== activeRef.current) {
        activeRef.current = next;
        setActive(next);
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* 头部实测高度 → --nav1-height：Hero 顶部 padding 引用该令牌让位。
   * 写死值会小于真实渲染高度，导致 hero__meta 行透到导航行上叠层；
   * ResizeObserver 捕获字体加载 / 断点切换 / 移动端行显隐等一切高度变化。 */
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const root = document.documentElement;
    const apply = () => {
      root.style.setProperty('--nav1-height', `${header.offsetHeight}px`);
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(header);
    return () => {
      observer.disconnect();
      root.style.removeProperty('--nav1-height');
    };
  }, []);

  /* 档案下拉：点击外部 / Esc 关闭 */
  useEffect(() => {
    if (!archiveOpen) return;
    const onDocClick = (event) => {
      if (archiveRef.current && !archiveRef.current.contains(event.target)) setArchiveOpen(false);
    };
    const onKey = (event) => {
      if (event.key === 'Escape') setArchiveOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [archiveOpen]);

  const anchorProps = (anchor, close) => ({
    href: `#${anchor}`,
    onClick: (event) => {
      if (close) close();
      anchorScroll(anchor)(event);
    },
  });

  const mobileItems = [...PRIMARY_LINKS, ...ARCHIVE_LINKS, JOIN_LINK];

  return (
    <div ref={wrapRef} className="qif-site-nav" data-active={active}>
      {/* nav1：页顶两行头部（bioqif 原版排版 / 色彩 / 款式，令牌化） */}
      <header ref={headerRef} className="qif-hero-header" inert={active !== 'hero' || undefined} aria-hidden={active !== 'hero'}>
        <div className="qif-hero-header__inner">
          <div className="qif-hero-header__brand">
            <Link to="/" className="qif-hero-header__identity" aria-label="返回首页">
              <img src={schoolLogo} alt="江西农业大学校徽" className="qif-hero-header__logo" />
              <span className="qif-hero-header__divider" aria-hidden="true" />
              <img src={qifLogo} alt="生物启扉协会会徽" className="qif-hero-header__logo" />
              <span className="qif-hero-header__names">
                <span className="qif-hero-header__school">江西农业大学</span>
                <span className="qif-hero-header__cn">生物启扉协会</span>
                <span className="qif-hero-header__en">BIOQIF ASSOCIATION</span>
              </span>
            </Link>
            <div className="qif-hero-header__slogan">
              <span className="qif-hero-header__slogan-cn">启迪生命 · 扉向未来</span>
              <span className="qif-hero-header__slogan-en">ENLIGHTENMENT · INNOVATION · FUTURE</span>
            </div>
          </div>

          <nav className="qif-hero-header__nav" aria-label="主导航">
            {PRIMARY_LINKS.map((item) => (
              <a key={item.key} className="qif-hero-header__link" {...anchorProps(item.anchor)}>
                {item.label}
              </a>
            ))}

            <div className="qif-hero-header__archive" ref={archiveRef}>
              <button
                type="button"
                className={`qif-hero-header__link qif-hero-header__archive-btn${archiveOpen ? ' is-open' : ''}`}
                aria-expanded={archiveOpen}
                aria-haspopup="true"
                onClick={() => setArchiveOpen((value) => !value)}
              >
                档案 <span aria-hidden="true">▾</span>
              </button>
              {archiveOpen && (
                <div className="qif-hero-header__menu" role="menu">
                  {ARCHIVE_LINKS.map((item) =>
                    item.to ? (
                      <Link
                        key={item.key}
                        to={item.to}
                        role="menuitem"
                        className="qif-hero-header__menu-item"
                        onClick={() => setArchiveOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <a key={item.key} role="menuitem" className="qif-hero-header__menu-item" {...anchorProps(item.anchor, () => setArchiveOpen(false))}>
                        {item.label}
                      </a>
                    ),
                  )}
                </div>
              )}
            </div>

            <a className="qif-hero-header__cta" {...anchorProps(JOIN_LINK.anchor)}>
              {JOIN_LINK.label}
            </a>

            <div className="qif-hero-header__actions">
              <ThemeToggle />
            </div>
          </nav>

          {/* 移动端行：协会名 + 主题切换 + 汉堡 */}
          <div className="qif-hero-header__mobile">
            <span className="qif-hero-header__mobile-name">生物启扉协会</span>
            <div className="qif-hero-header__mobile-actions">
              <ThemeToggle />
              <button
                type="button"
                className="qif-hero-header__toggle"
                aria-expanded={mobileOpen}
                aria-label={mobileOpen ? '关闭菜单' : '打开菜单'}
                onClick={() => setMobileOpen((value) => !value)}
              >
                <span className={`qif-hero-header__burger${mobileOpen ? ' is-open' : ''}`}>
                  <span />
                  <span />
                  <span />
                </span>
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="qif-hero-header__panel">
            {mobileItems.map((item) =>
              item.to ? (
                <Link
                  key={item.key}
                  to={item.to}
                  className="qif-hero-header__panel-link"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <a key={item.key} className="qif-hero-header__panel-link" {...anchorProps(item.anchor, () => setMobileOpen(false))}>
                  {item.label}
                </a>
              ),
            )}
          </div>
        )}
      </header>

      {/* nav2：CardNav 玻璃胶囊（滚动后显现） */}
      <div className="qif-site-nav__pill" inert={active !== 'card' || undefined} aria-hidden={active !== 'card'}>
        <CardNav
          logo={qifLogo}
          logoAlt="生物启扉协会会徽"
          actions={<ThemeToggle />}
          items={CARD_GROUPS}
        />
      </div>
    </div>
  );
}

export default QifSiteNav;
