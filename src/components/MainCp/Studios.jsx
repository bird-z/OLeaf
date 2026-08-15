import { Sparkles, Database, Plus, ArrowUpRight } from 'lucide-react';
import ScrollMask from './ScrollMask.jsx';
import './Studios.css';

/* 数据驱动·可扩展：新增工作室只需在数组末尾加一项，招募卡永远在最后。
 * accent 仅支持 'eco' | 'accent' 两档（对应全站双 accent 提亮版），
 * 图标从 lucide-react 引入后随项传入即可。 */
const STUDIOS = [
  {
    no: '01',
    category: 'AIGC Studio',
    name: '生生不息',
    icon: Sparkles,
    accent: 'eco',
    desc: '一句提示词，一帧好画面。我们用 AI 生成视频与图片，把天马行空的想象，做成看得见、摸得着的作品。',
    tags: ['AI 视频生成', 'AI 图片生成', '提示词创作']
  },
  {
    no: '02',
    category: 'Big Data Studio',
    name: 'DATASEEK',
    icon: Database,
    accent: 'accent',
    desc: '从网页到数据集：写爬虫、挖数据、做整理，把散落各处的信息收拢成干净的数据，再从中读出故事。',
    tags: ['数据挖掘', '数据提取', '爬虫', '数据整理']
  }
];

function StudioCard({ studio }) {
  const Icon = studio.icon;
  return (
    <li className="studios__card" data-accent={studio.accent}>
      <div className="studios__card-top">
        <span className="studios__icon">
          <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
        </span>
        <span className="studios__no">Studio No.{studio.no}</span>
      </div>
      <p className="studios__category">{studio.category}</p>
      <h3 className="studios__name">{studio.name}</h3>
      <p className="studios__desc">{studio.desc}</p>
      <ul className="studios__tags">
        {studio.tags.map(tag => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </li>
  );
}

function Studios() {
  return (
    <section className="studios" id="studios" aria-labelledby="studios-title">
      <ScrollMask>
        <header className="studios__head">
          <h2 className="studios__title" id="studios-title">
            特色工作室
          </h2>
          <div className="studios__head-side">
            <span className="studios__index" aria-hidden="true">02 · Studios</span>
            <p className="studios__gloss">
              工作室由会员自发发起、自由生长——把共同的兴趣，做成看得见的作品。
            </p>
          </div>
        </header>

        <ul className="studios__grid">
          {STUDIOS.map(studio => (
            <StudioCard key={studio.no} studio={studio} />
          ))}

          {/* 招募空状态卡：永远位于网格最后。
              CTA 链接待定（决策：先不链接），用 span 占位，确认后换成 <a>。 */}
          <li className="studios__card studios__card--join">
            <span className="studios__plus" aria-hidden="true">
              <Plus size={22} strokeWidth={1.5} />
            </span>
            <p className="studios__category">Next Studio</p>
            <h3 className="studios__name">等待你的加入</h3>
            <p className="studios__desc">
              下一间工作室，等你来发起。带上你的兴趣与想法，协会出同伴、出场地、出资源，一起把它做出来。
            </p>
            <span className="studios__cta">
              发起工作室
              <ArrowUpRight size={16} aria-hidden="true" />
            </span>
          </li>
        </ul>
      </ScrollMask>
    </section>
  );
}

export default Studios;
