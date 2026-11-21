import PageShell from '../components/MainCp/PageShell.jsx';
import { SECTIONS } from '../data/sectionRegistry.js';
import { ABOUT_INTRO, ABOUT_MILESTONES, ABOUT_CHARTER } from '../data/about.js';
import './AboutPage.css';

/* AboutPage — 协会概况 · Editorial Dossier
 * 结构：编者按式简介（大字号 lede + 正文 + 方向标签）→ 大事记时间线 → 章程入口。
 * 与科学页（项目流程轴）、活动页（学期卡片墙）、科普页（目录索引）刻意不同。
 * 数据源 src/data/about.js；区块小标题走 body 字体，不进行楷子集以免缺字回退。 */

const meta = SECTIONS.about;

function BlockHead({ index, title }) {
  return (
    <header className="about-page__block-head">
      <span className="about-page__block-index" aria-hidden="true">
        {index}
      </span>
      <h2 className="about-page__block-title">{title}</h2>
    </header>
  );
}

function AboutPage() {
  return (
    <PageShell
      no={meta.no}
      id="about"
      title={meta.title}
      en={meta.en}
      lede={meta.lede}
      accent={meta.accent}
    >
      <div className="about-page">
        {/* ── 01 协会简介 ── */}
        <section className="about-page__intro" aria-labelledby="about-intro">
          <BlockHead index="01" title="协会简介" />
          <p className="about-page__lede" id="about-intro">
            {ABOUT_INTRO.lede}
          </p>
          <div className="about-page__body">
            {ABOUT_INTRO.paragraphs.map(text => (
              <p key={text}>{text}</p>
            ))}
          </div>
          <ul className="about-page__tags" aria-label="协会活动方向">
            {ABOUT_INTRO.tags.map(tag => (
              <li className="about-page__tag" key={tag}>
                {tag}
              </li>
            ))}
          </ul>
        </section>

        {/* ── 02 发展大事记 ── */}
        <section className="about-page__block" aria-labelledby="about-milestones">
          <BlockHead index="02" title="发展大事记" />
          <ol className="about-milestones" id="about-milestones">
            {ABOUT_MILESTONES.map(item => (
              <li className="about-milestones__item" key={`${item.year}-${item.event}`}>
                <time className="about-milestones__year">{item.year}</time>
                <p className="about-milestones__event">{item.event}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ── 03 协会章程 ── */}
        <section className="about-page__block" aria-labelledby="about-charter">
          <BlockHead index="03" title="协会章程" />
          <div id="about-charter">
            {ABOUT_CHARTER.href ? (
              <a
                className="about-charter"
                href={ABOUT_CHARTER.href}
                target="_blank"
                rel="noreferrer"
              >
                <span className="about-charter__text">
                  <span className="about-charter__label">{ABOUT_CHARTER.label}</span>
                  <span className="about-charter__note">{ABOUT_CHARTER.note}</span>
                </span>
                <span className="about-charter__arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            ) : (
              <div className="about-charter about-charter--pending">
                <span className="about-charter__text">
                  <span className="about-charter__label">{ABOUT_CHARTER.label}</span>
                  <span className="about-charter__note">章程文件待补充</span>
                </span>
              </div>
            )}
          </div>
        </section>
      </div>
    </PageShell>
  );
}

export default AboutPage;
