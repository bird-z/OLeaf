import { ArrowUpRight, Mail } from 'lucide-react';
import ScrollMask from './ScrollMask.jsx';
import './Join.css';

/* 数据驱动·可扩展：新增部门只需在数组末尾加一项，网格自动重排。
 * accent 仅支持 'eco' | 'accent' 两档（对应全站双 accent 提亮版）。 */
const DEPARTMENTS = [
  {
    no: '01',
    en: 'Secretariat',
    name: '秘书部',
    accent: 'eco',
    desc: '负责协会文件起草、会议组织、档案与物资管理、值班安排及人员考勤等日常行政事务。'
  },
  {
    no: '02',
    en: 'Publicity',
    name: '宣传部',
    accent: 'accent',
    desc: '负责协会新媒体平台运营、宣传物料设计、活动采编记录及品牌形象建设与推广。'
  },
  {
    no: '03',
    en: 'Academic Practice',
    name: '学术实践部',
    accent: 'accent',
    desc: '负责组织专业知识与实践技能培训，开展生命科学及相关交叉领域的学习实践，并为会员提供科研与专业学习指导。'
  },
  {
    no: '04',
    en: 'Event Service',
    name: '活动服务部',
    accent: 'eco',
    desc: '负责协会常规活动和品牌活动的策划实施、场地物料及人员统筹，并做好活动复盘与优化。'
  }
];

const RECRUIT_POINTS = [
  '招募对象：江西农业大学全日制在校学生',
  '专业与年级不限，从热爱出发',
  '集中招新时间以协会正式通知为准'
];

function DeptCard({ dept }) {
  return (
    <li className="join__dept" data-accent={dept.accent}>
      <div className="join__dept-top">
        <span className="join__dept-no">{dept.no}</span>
        <span className="join__dept-en">{dept.en}</span>
      </div>
      <h3 className="join__dept-name">{dept.name}</h3>
      <p className="join__dept-desc">{dept.desc}</p>
      {/* 决策：「了解部门」先不链接（与 Studios CTA 同一决策），span 占位，
          仅保留弱 hover 变色，不做位移/箭头动效，避免假 affordance。 */}
      <span className="join__dept-more">
        了解部门
        <ArrowUpRight size={14} aria-hidden="true" />
      </span>
    </li>
  );
}

function Join() {
  const year = new Date().getFullYear(); // 招新年份动态取当前年，不写死

  return (
    <section className="join" id="join" aria-labelledby="join-title">
      <ScrollMask>
        <header className="join__head">
          <h2 className="join__title" id="join-title">
            从好奇出发
          </h2>
          <div className="join__head-side">
            <span className="join__index" aria-hidden="true">04 · Join</span>
            <p className="join__gloss">
              不必已经专业，只需要保有好奇——找到与你气味相投的部门。
            </p>
          </div>
        </header>

        <div className="join__layout">
          <ul className="join__depts">
            {DEPARTMENTS.map(dept => (
              <DeptCard key={dept.no} dept={dept} />
            ))}
          </ul>

          <aside className="join__panel" aria-label="招新信息">
            <p className="join__panel-eyebrow">Recruit · {year} 招新</p>
            <h3 className="join__panel-title">
              欢迎加入生物启扉协会
              <em>从好奇出发</em>
            </h3>

            <ul className="join__points">
              {RECRUIT_POINTS.map(point => (
                <li key={point}>{point}</li>
              ))}
            </ul>

            <div className="join__contact">
              <p className="join__contact-label">
                <Mail size={14} aria-hidden="true" />
                咨询邮箱
              </p>
              {/* 邮箱暂作纯文本展示，确认后再包 mailto: */}
              <p className="join__contact-mail">office@bioqif.com</p>
            </div>

            {/* 决策：「在线报名」先不链接，button 占位 + 动态光泽效果，
                报名渠道确认后换成 <a>。 */}
            <button type="button" className="join__cta">
              在线报名
              <ArrowUpRight size={16} aria-hidden="true" />
            </button>
            <p className="join__panel-note">
              非集中招新期间，可通过邮件了解加入方式
            </p>
          </aside>
        </div>
      </ScrollMask>
    </section>
  );
}

export default Join;
