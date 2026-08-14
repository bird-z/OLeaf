import BlurText from '../BlurText.jsx';
import heroBg from '../../assets/生命.jpeg';
import './Slogan.css';

function Slogan() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      {/* 第一幕背景：星轨下的校园（LCP 元素，直引不懒加载） */}
      <img
        className="hero__bg"
        src={heroBg}
        alt=""
        aria-hidden="true"
        fetchpriority="high"
        width="2048"
        height="1367"
      />

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

      <div className="hero__foot" data-reveal style={{ '--i': 4 }}>
        <div className="hero__sub">
          <BlurText
            text="一粒因热爱播种的种子 在江农的土壤里生根发芽"
            animateBy="letters"
            delay={45}
            direction="top"
          />
        </div>
        <a className="hero__cta" href="#join">
          Join Us
          <span className="hero__cta-arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}

export default Slogan;
