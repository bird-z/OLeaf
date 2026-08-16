import { Link } from 'react-router-dom';
import Nav from './Nav.jsx';
import ScrollMask from './ScrollMask.jsx';
import './PageShell.css';

/* PageShell — 活动档案页统一骨架（科学/科普/活动三页锁定语言）
 * 锁定：mono 节序 + 行楷页头 + 双语 lede · 粗规则线页尾 CTA → /#join
 * 放开：children 内容区（每页一种宏观结构，各不相同）
 * accent: 'eco'（叶绿侧重）| 'accent'（品牌紫侧重），驱动节序号与 CTA  hover 色
 */
function PageShell({ no, id, title, en, lede, accent = 'eco', displayTitle = true, children }) {
  return (
    <div className={`page-shell page-shell--${accent}`} id={id}>
      <Nav />
      {/* threshold=0：整页包装高度常远超视口，0.15 比例阈值可能永不达成（页面永久不可见），
          全页幕布改为「任一像素可见即揭开」 */}
      <ScrollMask threshold={0}>
        <header className="page-shell__head">
          <span className="page-shell__index" aria-hidden="true">
            {no} · {en}
          </span>
          {/* displayTitle=false：动态/拉丁标题走 body 字体，行楷子集只管策展标题 */}
          <h1 className={`page-shell__title${displayTitle ? '' : ' page-shell__title--sans'}`}>{title}</h1>
          <p className="page-shell__lede">{lede}</p>
        </header>

        <div className="page-shell__body">{children}</div>

        <footer className="page-shell__tail">
          <p className="page-shell__tail-text">想一起做点有意思的事？</p>
          <Link className="page-shell__tail-cta" to="/#join">
            加入我们
            <span aria-hidden="true">→</span>
          </Link>
        </footer>
      </ScrollMask>
    </div>
  );
}

export default PageShell;
