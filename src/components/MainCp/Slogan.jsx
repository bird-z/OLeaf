import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import groundLight from '../../assets/gate.jpg';
import './Slogan.css';

const SUBTITLE = '一粒因热爱播种的种子 在江农的土壤里生根发芽';

/* 部署在 GitHub Pages /OLeaf/ 子路径：public 资源一律用 BASE_URL 拼接 */
const BASE = import.meta.env.BASE_URL;
const HERO_SRCSET = fmt =>
  `${BASE}hero/life-768.${fmt} 768w, ${BASE}hero/life-1536.${fmt} 1536w, ${BASE}hero/life-2048.${fmt} 2048w`;

function Slogan() {
  const heroRef = useRef(null);

  /* 滚动视差：--hero-p ∈ [0,1] 驱动背景缩放/位移，与 useFullpage 弹性翻页衔接。
   * rAF 节流 + passive 监听；reduced-motion 下不启用（CSS 侧同步塌缩）。 */
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      // 首页第一屏现在是新闻轮播：视差进度以 Slogan 自身顶边为起点，
      // 避免被上方轮播的高度偏移（heroTop 会随轮播挂载/卸载变化）。
      const heroTop = el.getBoundingClientRect().top + window.scrollY;
      const p = Math.min(
        1,
        Math.max(0, (window.scrollY - heroTop) / window.innerHeight)
      );
      el.style.setProperty('--hero-p', p.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* 入场编排改为「进视口播一次」：hero 约 40% 可见时加 .is-live 并断开。
   * 此前动画挂在元素本身，页面加载即播，等滚到第二屏早已播完 —— 入场不可见。
   * 与翻页节奏衔接：Slogan 升至 ~40% 覆盖时开播（总长 ≈1.1s），
   * 与 useFullpage 的 1.25s 弹性滚动大致同步收束。 */
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add('is-live');
        ob.disconnect();
      },
      { threshold: 0.4 }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);

  return (
    <section className="hero" ref={heroRef} aria-labelledby="hero-title">
      {/* 第一幕背景（LCP）—— 两幕叠层，由 [data-theme] 用 opacity 交叉溶解。
          两层图片都常驻 DOM：切主题只是透明度变化，不重新请求/解码，因此无白闪。
          夜间 = 星轨校园（AVIF/WebP 多尺寸 + JPEG 兜底）；昼间 = 白昼校园。 */}
      <div className="hero__media" aria-hidden="true">
        <picture className="hero__layer hero__layer--night">
          <source type="image/avif" srcSet={HERO_SRCSET('avif')} sizes="100vw" />
          <source type="image/webp" srcSet={HERO_SRCSET('webp')} sizes="100vw" />
          <img
            className="hero__bg"
            src={`${BASE}hero/life-2048.jpg`}
            alt=""
            fetchPriority="high"
            width="2048"
            height="1367"
          />
        </picture>
        <img
          className="hero__bg hero__layer hero__layer--day"
          src={groundLight}
          alt=""
          width="1000"
          height="677"
        />
      </div>

      <div className="hero__meta" data-reveal style={{ '--i': 0 }}>
        <span>JXAU · BioQif</span>
        <span>Slogan</span>
      </div>

      <div className="hero__brand" data-reveal style={{ '--i': 1 }}>
        <span className="hero__wordmark">
          <span className="hero__wordmark-eco">Bio</span>Qif
        </span>
        <span className="hero__brand-gloss">Bio · 生命 — Qif · 启扉</span>
      </div>

      <h1 className="hero__title" id="hero-title">
        <span className="hero__title-line" data-reveal style={{ '--i': 2 }}>
          启迪生命
        </span>
        <span className="hero__title-line hero__title-line--marked" data-reveal style={{ '--i': 3 }}>
          <span className="hero__mark" aria-hidden="true" />
          扉向未来
        </span>
      </h1>

      <div className="hero__foot">
        {/* 副标语：纯 CSS 逐字 reveal（无 JS 依赖，reduced-motion 塌缩为淡入）。
            aria-label 承载完整文本，逐字 span 对读屏隐藏 */}
        <p className="hero__sub" aria-label={SUBTITLE}>
          <span aria-hidden="true">
            {[...SUBTITLE].map((ch, i) => (
              <span className="hero__letter" style={{ '--i': i }} key={`${ch}-${i}`}>
                {ch === ' ' ? ' ' : ch}
              </span>
            ))}
          </span>
        </p>
        <Link className="hero__cta" to="/join" data-reveal style={{ '--i': 5 }}>
          Join Us
          <span className="hero__cta-arrow" aria-hidden="true">→</span>
        </Link>
      </div>

      {/* 滚动提示：mono 细线脉动，随视差进度淡出 */}
      <div className="hero__cue" aria-hidden="true">
        <span className="hero__cue-label">Scroll</span>
        <span className="hero__cue-line" />
      </div>
    </section>
  );
}

export default Slogan;
