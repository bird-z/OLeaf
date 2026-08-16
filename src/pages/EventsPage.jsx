import PageShell from '../components/MainCp/PageShell.jsx';
import pscImg from '../assets/psc.jpg';
import hackathonImg from '../assets/hackathon.jpg';
import './EventsPage.css';

/* 数据驱动·可扩展：新增活动往对应学期数组加一项即可。
 * 真实活动照片已就位；无图项渲染「待补充」占位卡（诚实占位，不装成最终设计）。 */
const EVENT_GROUPS = [
  {
    term: '2025 秋',
    events: [
      {
        title: '第一次全体（扩大）会议',
        date: '2025.09',
        image: pscImg,
        desc: '协会扬帆第一站：章程发布、部门亮相、新成员破冰，启扉大家庭第一次全员到齐。'
      },
      {
        title: '第六届科技文化节 · 第一届「黑客松」AI 创作大赛',
        date: '2025.10',
        image: hackathonImg,
        desc: 'TRAE on Campus @ 江西农业大学——48 小时极限创作，用 AI 把点子做成作品。'
      }
    ]
  },
  {
    term: '2026 春',
    events: [
      {
        title: '校园自然观察日',
        date: '待定',
        image: null,
        desc: '带上放大镜和好奇心，走遍校园认植物、观飞鸟、读生态。'
      },
      {
        title: '科普进课堂',
        date: '待定',
        image: null,
        desc: '把有趣的科学带出校园，给中小学生们上一堂不一样的自然课。'
      }
    ]
  }
];

function EventCard({ event }) {
  return (
    <article className={`event-card${event.image ? '' : ' event-card--empty'}`}>
      {event.image ? (
        <img className="event-card__img" src={event.image} alt={event.title} loading="lazy" />
      ) : (
        <div className="event-card__placeholder" aria-hidden="true">
          <span>照片待补充</span>
        </div>
      )}
      <div className="event-card__body">
        <span className="event-card__date">{event.date}</span>
        <h3 className="event-card__title">{event.title}</h3>
        <p className="event-card__desc">{event.desc}</p>
      </div>
    </article>
  );
}

function EventsPage() {
  return (
    <PageShell
      no="04"
      id="events"
      title="教育活动"
      en="Events"
      lede="从黑客松到自然观察，从全员大会到科普课堂——每一场活动都是一粒落地的种子，在参与者心里继续生长。"
      accent="eco"
    >
      <div className="events">
        {EVENT_GROUPS.map(group => (
          <section className="events__group" key={group.term} aria-label={group.term}>
            <h2 className="events__term">{group.term}</h2>
            <div className="events__grid">
              {group.events.map(event => (
                <EventCard key={event.title} event={event} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageShell>
  );
}

export default EventsPage;
