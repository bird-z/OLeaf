import gateImg from '../assets/gate.jpg';
import './SiteBanner.css';

/* 子页统一照片横幅：gate.jpg 校门照 + 双层 scrim（顶部给 nav1 让读、整体压暗）。
 * 影像恒定组成员（tokens.css）：昼夜间恒为暗场白字。
 * children 可选：PageShell 把页头（节序/行楷标题/lede）压在横幅下缘，呼应首页 Hero
 * 与参考站的标题卡；NewsDetailPage 不传 children，只做纯横幅。 */
function SiteBanner({ children }) {
  return (
    <div className="subpage-banner" role="presentation">
      <img className="subpage-banner__img" src={gateImg} alt="" aria-hidden="true" />
      <div className="subpage-banner__scrim" aria-hidden="true" />
      {children ? <div className="subpage-banner__head">{children}</div> : null}
    </div>
  );
}

export default SiteBanner;
