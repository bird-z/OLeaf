import { useState } from 'react';
import ScrollMask from './ScrollMask.jsx';
import DepthCarousel from '../DepthCarousel.jsx';
import pscImg from '../../assets/psc.jpg';
import hackathonImg from '../../assets/hackathon.jpg';
import lifeImg from '../../assets/生命.jpeg';
import './About.css';

const GALLERY = [
  { image: pscImg, alt: '生物启扉协会第一次全体（扩大）会议合影', caption: '第一次全体（扩大）会议' },
  { image: hackathonImg, alt: '第一届「黑客松」AI 创作大赛合影', caption: '第六届科技文化节 · 第一届「黑客松」AI 创作大赛' },
  { image: lifeImg, alt: '校园星轨夜景', caption: '校园星轨' }
];

function About() {
  const [active, setActive] = useState(0);

  return (
    <section className="about" id="about" aria-labelledby="about-title">
      <ScrollMask>
        <header className="about__head">
          <h2 className="about__title" id="about-title">
            因热爱而启程
          </h2>
          <span className="about__index" aria-hidden="true">01 · About</span>
        </header>

        <div className="about__grid">
        <div className="about__copy">
          <p className="about__lede">
            <strong>生物启扉协会</strong>是江西农业大学面向全校学生的学术科创类、多学科交叉类学生社团。协会秉持“启迪生命、扉向未来”的理念，围绕学术交流、科技创新、实验实践、自然观察和公益科普等方向开展活动，致力于搭建开放、协作、富有创新活力的跨学科交流平台。
          </p>
          <p>
            我们致力于降低学习与实践的入门门槛，和同学一起从兴趣启蒙走向系统学习，从课堂知识走向真实探索，在协作与实践中培养严谨、开放、求实、互助的科学精神。
          </p>
          <p>
            协会汇聚不同学科背景与专业技能，鼓励知识共享、跨界协作与创新实践，持续建设一个开放包容、富有活力、兼具专业性与温度的青年学术科创共同体。
          </p>

          <ul className="about__tags">
            <li>学术交流</li>
            <li>科创实践</li>
            <li>自然探索</li>
            <li>公益科普</li>
          </ul>
        </div>

        <div className="about__gallery">
          <DepthCarousel
            items={GALLERY}
            cardWidth={440}
            cardHeight={310}
            tint="var(--color-ink)"
            aria-label="协会活动相册"
            onChange={i => setActive(i)}
          />
          <p className="about__gallery-caption" key={active}>
            <span className="about__gallery-count">
              {String(active + 1).padStart(2, '0')} / {String(GALLERY.length).padStart(2, '0')}
            </span>
            {GALLERY[active].caption}
          </p>
        </div>
      </div>
      </ScrollMask>
    </section>
  );
}

export default About;
