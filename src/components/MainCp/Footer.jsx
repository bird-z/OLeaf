import { MapPin, Mail } from 'lucide-react';
import ScrollMask from './ScrollMask.jsx';
import logoJxau from '../../assets/logo.png';
import logoAssoc from '../../assets/logo2.png';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer" id="contact" aria-label="页底信息与联系方式">
      <ScrollMask>
        <div className="footer__main">
          {/* ── 左：品牌区（校徽 + 会徽 + 双语名 + 格言 + 社交位） ── */}
          <div className="footer__brand">
            <div className="footer__logos">
              <img className="footer__logo" src={logoJxau} alt="江西农业大学校徽" />
              <span className="footer__logo-divider" aria-hidden="true" />
              <img className="footer__logo" src={logoAssoc} alt="生物启扉协会会徽" />
              <div className="footer__org">
                <p className="footer__org-cn">
                  江西农业大学 <span className="footer__org-name">生物启扉协会</span>
                </p>
                <p className="footer__org-en">Biology Qif Association</p>
              </div>
            </div>
            <p className="footer__motto">Enlightenment · Innovation · Future</p>
            {/* B站链接待定（沿用「先不链接」决策），span 占位，确认后换 <a> */}
            <span className="footer__social">B站</span>
          </div>

          {/* ── 右：联系我们 ── */}
          <div className="footer__contact">
            <h2 className="footer__contact-title">联系我们</h2>
            <ul className="footer__contact-list">
              <li>
                <MapPin size={17} strokeWidth={1.8} aria-hidden="true" />
                <span>江西省南昌市经济技术开发区志敏大道 1101 号</span>
              </li>
              <li>
                <Mail size={17} strokeWidth={1.8} aria-hidden="true" />
                <span>
                  校外合作 / 企业交流：
                  <a href="mailto:contact@bioqif.com">contact@bioqif.com</a>
                </span>
              </li>
              <li>
                <Mail size={17} strokeWidth={1.8} aria-hidden="true" />
                <span>
                  校内报名 / 活动咨询：
                  <a href="mailto:office@bioqif.com">office@bioqif.com</a>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* ── 底栏：版权 + 行楷格言收尾（与 hero 标题首尾呼应） ── */}
        <div className="footer__bar">
          <p className="footer__copyright">© 2026 江西农业大学生物启扉协会</p>
          <p className="footer__slogan">启迪生命 · 扉向未来</p>
        </div>
      </ScrollMask>
    </footer>
  );
}

export default Footer;
