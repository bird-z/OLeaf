import { useEffect, useMemo } from 'react';
import ScrollMask from './ScrollMask.jsx';
import DepthCarousel from '../DepthCarousel.jsx';
import { useTheme } from '../../lib/useTheme.js';
import pscImg from '../../assets/psc.jpg';
import hackathonImg from '../../assets/hackathon.jpg';
import lifeImg from '../../assets/生命.jpeg';
import groundImg from '../../assets/ground1.jpg';
import './About.css';

/* 前两张是活动合影，无昼夜属性，两个主题下不变。
 * 第三张是「校园」主题影像，承担昼夜切换：
 *   夜间 = 星轨夜景（生命.jpeg） · 昼间 = 白昼校园广场（ground1.jpg）
 * 与首屏星轨、成员墙同一逻辑：夜空归夜，白昼归昼。 */
const GALLERY_BASE = [
  { image: pscImg, alt: '生物启扉协会第一次全体（扩大）会议合影' },
  { image: hackathonImg, alt: '第一届「黑客松」AI 创作大赛合影' }
];

function About() {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === 'light';

  /* 两张昼夜替代图预先解码：切换主题时不再现发请求，相册换图瞬时完成。
   * （ground1 与星轨图都会用到，提前预热浏览器缓存与解码结果） */
  useEffect(() => {
    [groundImg, lifeImg].forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const GALLERY = useMemo(
    () => [
      ...GALLERY_BASE,
      isLight
        ? { image: groundImg, alt: '白昼的校园广场 · 升旗仪式' }
        : { image: lifeImg, alt: '校园星轨夜景' }
    ],
    [isLight]
  );

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
          {/* 卡片尺寸：改这两个数即可整体放大/缩小相册卡片（比例保持 1.42:1）；
              相册列宽不够时组件会自动等比缩小，卡片位置/图文间距见 About.css 顶部调参区。
              reserveFan={false}：扇出不再占列宽（允许溢出到图片右侧留白里），
              所以窄列里卡片也不会被挤小。 */}
          <DepthCarousel
            items={GALLERY}
            cardWidth={520}
            cardHeight={366}
            reserveFan={false}
            tint="var(--color-ink)"
            aria-label="协会活动相册"
          />
        </div>
      </div>
      </ScrollMask>
    </section>
  );
}

export default About;
