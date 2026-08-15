import { useEffect, useRef } from 'react';
import './Slogan.css';

const SUBTITLE = '一粒因热爱播种的种子 在江农的土壤里生根发芽';

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
      const p = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
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

  return (
    <section className="hero" ref={heroRef} aria-labelledby="hero-title">
      {/* 第一幕背景：星轨下的校园（LCP · AVIF/WebP 多尺寸，JPEG 兜底，直引不懒加载） */}
      <picture>
        <source
          type="image/avif"
          srcSet="/hero/life-768.avif 768w, /hero/life-1536.avif 1536w, /hero/life-2048.avif 2048w"
          sizes="100vw"
        />
        <source
          type="image/webp"
          srcSet="/hero/life-768.webp 768w, /hero/life-1536.webp 1536w, /hero/life-2048.webp 2048w"
          sizes="100vw"
        />
        <img
          className="hero__bg"
          src="/hero/life-2048.jpg"
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          width="2048"
          height="1367"
        />
      </picture>

      <div className="hero__meta" data-reveal style={{ '--i': 0 }}>
        <span>JXAU · EcoRem</span>
        <span>Slogan</span>
      </div>

      <div className="hero__brand" data-reveal style={{ '--i': 1 }}>
        <span className="hero__wordmark">
          <span className="hero__wordmark-eco">Eco</span>Rem
        </span>
        <span className="hero__brand-gloss">Eco · 生态 — Rem · 修护</span>
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
        {/* TODO: 报名区块上线后改回 #join */}
        <a className="hero__cta" href="#about" data-reveal style={{ '--i': 5 }}>
          Join Us
          <span className="hero__cta-arrow" aria-hidden="true">→</span>
        </a>
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
