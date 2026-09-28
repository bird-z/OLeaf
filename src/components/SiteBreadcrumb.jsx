import { Link } from 'react-router-dom';
import { useAnchorScroll } from '../lib/scrollTo.js';
import './SiteBreadcrumb.css';

/* 子页统一面包屑（参考 jxau.edu.cn 「您现在的位置：首页 > 栏目」）。
 * items: [{ label, to? , anchor? }] —— to 走 <Link>（站内路由），
 * anchor 走 useAnchorScroll（首页页内锚点，子页先回 Home 再滚），
 * 均无则为当前页纯文本。首项恒为「首页」。 */
function SiteBreadcrumb({ items = [] }) {
  const anchorScroll = useAnchorScroll();

  const renderItem = (item, i) => {
    if (item.to) {
      return <Link to={item.to}>{item.label}</Link>;
    }
    if (item.anchor) {
      return (
        <a href={`#${item.anchor}`} onClick={anchorScroll(item.anchor)}>
          {item.label}
        </a>
      );
    }
    return <span aria-current={i === items.length - 1 ? 'page' : undefined}>{item.label}</span>;
  };

  return (
    <nav className="site-breadcrumb" aria-label="面包屑导航">
      <div className="site-breadcrumb__inner">
        {items.map((item, i) => (
          <span className="site-breadcrumb__item" key={`${item.label}-${i}`}>
            {i > 0 && <i aria-hidden="true">›</i>}
            {renderItem(item, i)}
          </span>
        ))}
      </div>
    </nav>
  );
}

export default SiteBreadcrumb;
