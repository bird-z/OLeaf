import PageShell from '../components/MainCp/PageShell.jsx';
import { useSection } from '../lib/sectionData.js';
import './SectionPage.css';

/* 板块占位页共享骨架：PageShell（subpage 导航 + gate.jpg 横幅 + 面包屑）
 * + 「开发中…」占位面板 + 数据字段契约清单。
 * 占位文案一律 --font-body（不进行楷子集，避免缺字回退）。 */
function SectionPage({ section }) {
  const { status, meta, fields /*, data */ } = useSection(section);

  return (
    <PageShell
      no={meta.no}
      id={section}
      title={meta.title}
      en={meta.en}
      lede={meta.lede}
      accent={meta.accent}
    >
      {status === 'pending' && (
        <div className="section-page__empty" role="status">
          <p className="section-page__badge">UNDER DEVELOPMENT</p>
          <h2 className="section-page__title">开发中…</h2>
          <p className="section-page__hint">
            本板块已预留独立页面与数据接口，内容尚未接入。
          </p>
          <dl className="section-page__fields">
            {fields.map(f => (
              <div className="section-page__field" key={f.name}>
                <dt>
                  <code>{f.name}</code>
                  <em>{f.type}</em>
                </dt>
                <dd>{f.note}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
      {/* status === 'ready'：接入真实数据后在此渲染板块内容 */}
      {/* status === 'error'：数据接口失败时在此渲染错误态 */}
    </PageShell>
  );
}

export default SectionPage;
