import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAnchorScroll } from '../lib/scrollTo.js';
import ThemeToggle from './ThemeToggle.jsx';
import CardNav from './CardNav.jsx';
import schoolLogo from '../assets/logo.png';
import qifLogo from '../assets/logo2.png';
import { HERO_LINKS, CARD_GROUPS } from '../data/homeNav.js';
import './QifSiteNav.css';

/* 融合导航：nav1 两行头部（双徽+校会名/标语⇄HERO_LINKS 平铺）⇄ nav2（CardNav 玻璃胶囊）。
 * - 触发点：p = clamp((scrollY - 参照顶) / (0.7 × 参照高), 0, 1)，rAF 节流写 --nav-p；
 *   mode='home' 参照 .hero（Slogan），mode='subpage' 参照 .subpage-banner（子页横幅）。
 * - data-active 在 p 0.5 处切换，用于 inert / aria-hidden 门控（避免两个导航同级可聚焦）；
 * - 页内锚点一律走 useAnchorScroll（HashRouter 下原生 # 会覆盖 hash 路由）；「首页」= 回页顶；
 * - <1024px 恒为 nav2 胶囊；nav1 压暗场媒体期间强制白字（首页看轮播、子页看横幅）。 */

const HERO_EXIT_RATIO = 0.7; // 参照块滚出 70% 完成模式切换
const DESKTOP_MQ = '(min-width: 1024px)';

function QifSiteNav({ mode = 'home' }) {
  const [active, setActive] = useState('hero'); // 'hero' | 'card'
  const wrapRef = useRef(null);
  const headerRef = useRef(null);
  const activeRef = useRef('hero');
  const anchorScroll = useAnchorScroll();

  /* 滚动进度驱动 nav1 ⇄ nav2 丝滑转化；<1024px 强制 nav2 胶囊 */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const desktop = window.matchMedia(DESKTOP_MQ);
    let raf = 0;

    const update = () => {
      raf = 0;
      // 首页第一屏是新闻轮播：切换进度以 Slogan（.hero）顶边为起点，
      // 轮播停留期间保持 nav1 两行头部；子页以横幅顶边为起点。
      const hero = document.querySelector(mode === 'subpage' ? '.subpage-banner' : '.hero');
      const heroTop = hero ? hero.getBoundingClientRect().top + window.scrollY : 0;
      const range = Math.max(1, (hero ? hero.offsetHeight : window.innerHeight) * HERO_EXIT_RATIO);
      const raw = desktop.matches ? Math.min(1, Math.max(0, (window.scrollY - heroTop) / range)) : 1;
      const p = reduce ? (raw >= 0.5 ? 1 : 0) : raw;
      el.style.setProperty('--nav-p', p.toFixed(4));

      const next = p >= 0.5 ? 'card' : 'hero';
      if (next !== activeRef.current) {
        activeRef.current = next;
        setActive(next);
      }

      // 压暗场媒体期间固定暗场令牌（强制白字），避免浅色主题下两行头部
      // 压在暗色照片上出现深字压暗图。
      // 首页判定分两路：轮播为 sticky 钉屏时 rect 恒在视口顶、bottom 永真，
      // 须改看 .page-covered（usePageTurn 写的覆盖事实源）；
      // reduced-motion/卸载时是普通流块，回落为底部边界几何判定。
      // 子页无轮播：直接看横幅底边是否还在 nav 中线之下。
      const navMid = (headerRef.current?.offsetHeight || 0) / 2;
      let overMedia = false;
      if (mode === 'subpage') {
        overMedia = !!hero && hero.getBoundingClientRect().bottom > navMid;
      } else {
        const carousel = document.querySelector('.news-carousel');
        const carouselBottom = carousel ? carousel.getBoundingClientRect().bottom : 0;
        const covered = document.documentElement.classList.contains('page-covered');
        overMedia = !!carousel && !covered && carouselBottom > navMid;
      }
      el.classList.toggle('qif-site-nav--over-media', overMedia);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    desktop.addEventListener('change', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      desktop.removeEventListener('change', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [mode]);

  /* 头部实测高度 → --nav1-height：Hero 顶部 padding 引用该令牌让位。
   * 写死值会小于真实渲染高度，导致 hero__meta 行透到导航行上叠层；
   * ResizeObserver 捕获字体加载 / 断点切换 / 行显隐等一切高度变化。
   * 仅桌面写入：移动端两行头部 display:none（offsetHeight=0），
   * 写入 0 会让 hero padding 坍缩 —— 移动端交给 CSS 的 72px 兜底。 */
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const root = document.documentElement;
    const desktop = window.matchMedia(DESKTOP_MQ);
    const apply = () => {
      if (desktop.matches) {
        root.style.setProperty('--nav1-height', `${header.offsetHeight}px`);
      } else {
        root.style.removeProperty('--nav1-height');
      }
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(header);
    desktop.addEventListener('change', apply);
    return () => {
      observer.disconnect();
      desktop.removeEventListener('change', apply);
      root.style.removeProperty('--nav1-height');
    };
  }, []);

  const { pathname } = useLocation();

  /* 品牌区点击：在首页平滑回页顶并阻止 <Link> 默认跳转；
   * 在子页放行为 <Link to="/"> 常规导航回首页（子页 scrollTop 无意义）。 */
  const scrollTop = event => {
    if (pathname !== '/') return;
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const anchorProps = anchor => ({
    href: `#${anchor}`,
    onClick: anchorScroll(anchor),
  });

  const renderLink = item => {
    if (item.home) {
      return (
        <a key={item.key} className="qif-hero-header__link" href="#" onClick={scrollTop}>
          {item.label}
        </a>
      );
    }
    if (item.to) {
      return (
        <Link key={item.key} className="qif-hero-header__link" to={item.to}>
          {item.label}
        </Link>
      );
    }
    if (item.key === 'join') {
      return (
        <a key={item.key} className="qif-hero-header__cta" {...anchorProps(item.anchor)}>
          {item.label}
        </a>
      );
    }
    return (
      <a key={item.key} className="qif-hero-header__link" {...anchorProps(item.anchor)}>
        {item.label}
      </a>
    );
  };

  return (
    <div ref={wrapRef} className="qif-site-nav" data-active={active}>
      {/* nav1：slogan 态两行头部（透明底压 Hero，参考 bioqif 排版，令牌化） */}
      <header ref={headerRef} className="qif-hero-header" inert={active !== 'hero' || undefined} aria-hidden={active !== 'hero'}>
        <div className="qif-hero-header__inner">
          <div className="qif-hero-header__brand">
            <Link to="/" className="qif-hero-header__identity" aria-label="返回首页" onClick={scrollTop}>
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
            {HERO_LINKS.map(renderLink)}
            <div className="qif-hero-header__actions">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </header>

      {/* nav2：CardNav 玻璃胶囊（滚动后显现；<1024px 恒显） */}
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
