import PageShell from '../components/MainCp/PageShell.jsx';
import './SciencePage.css';

/* 数据驱动·可扩展：两个工作室的共同推送流。
 * 项目资料取自协会真实活动与在办事项（黑客松、校园自然观察日、官网标本库栏目），
 * 有更完整的项目信息时直接改数组项即可，结构、样式都不用动。
 * accent 仅两档：生生不息 = eco，DATASEEK = accent（与 /studios 工作室卡一致）。 */
const STAGES = [
  {
    step: '1.0',
    label: '立项孵化',
    gloss: '先想清楚要解决什么，再用最小成本跑通一次验证。',
    projects: [
      {
        studio: '生生不息',
        accent: 'eco',
        name: '节气视觉模板库',
        status: '孵化中',
        desc: '把二十四节气的意象、配色与提示词沉淀成模板，让协会每一张海报、每一条推文都有一致的视觉底子。'
      },
      {
        studio: 'DATASEEK',
        accent: 'accent',
        name: '校园物种观察档案',
        status: '孵化中',
        desc: '从「校园自然观察日」的记录出发，整理校园常见动植物名录与照片，做成一份可检索的物种档案。'
      }
    ]
  },
  {
    step: '2.0',
    label: '开发进行时',
    gloss: '素材、脚本、提示词反复打磨，把雏形做到能拿出来看。',
    projects: [
      {
        studio: '生生不息',
        accent: 'eco',
        name: '第一届「黑客松」影像回顾',
        status: '进行中',
        desc: '整理 2025 年 10 月 TRAE on Campus 创作现场的照片与素材，剪成一支赛事回顾短片。'
      },
      {
        studio: 'DATASEEK',
        accent: 'accent',
        name: '协会图文数据整理',
        status: '进行中',
        desc: '把公众号与活动档案里的图文整理成结构化数据，支撑官网「标本库」与快讯栏目的持续更新。'
      }
    ]
  },
  {
    step: '3.0',
    label: '成果发布',
    gloss: '作品上线、归档、对外展映，再回到下一个想法。',
    projects: [
      {
        studio: '生生不息',
        accent: 'eco',
        name: '「黑客松」AI 创作作品集',
        status: '已发布',
        desc: '入围作品与现场影像已归档成册，用于招新宣讲与校园展映。'
      }
    ]
  }
];

function ProjectCard({ project }) {
  return (
    <article className="science__card" data-accent={project.accent}>
      <div className="science__card-head">
        <span className="science__studio">{project.studio}</span>
        <span className={`science__status science__status--${project.status}`}>
          <span className="science__dot" aria-hidden="true" />
          {project.status}
        </span>
      </div>
      <h3 className="science__name">{project.name}</h3>
      <p className="science__desc">{project.desc}</p>
    </article>
  );
}

function SciencePage() {
  return (
    <PageShell
      no="06"
      id="science"
      title="科学与工程"
      en="Science"
      lede="生生不息与 DATASEEK 两个工作室的共同推送：从一个点子的立项孵化，到开发进行时，再到成果发布——这里是项目生长的完整轨迹。"
      accent="accent"
    >
      <div className="science">
        {STAGES.map(stage => (
          <section className="science__stage" key={stage.step} aria-labelledby={`science-stage-${stage.step}`}>
            {/* 时间线左轨：mono 阶段号 + 竖线 */}
            <div className="science__rail" aria-hidden="true">
              <span className="science__step">{stage.step}</span>
              <span className="science__line" />
            </div>
            <div className="science__content">
              <div className="science__head">
                <h2 className="science__label" id={`science-stage-${stage.step}`}>
                  {stage.label}
                </h2>
                {stage.projects.length > 0 ? (
                  <span className="science__count">{stage.projects.length} 个项目</span>
                ) : null}
              </div>
              {stage.gloss ? <p className="science__gloss">{stage.gloss}</p> : null}
              {stage.projects.length > 0 ? (
                <div className="science__cards">
                  {stage.projects.map(project => (
                    <ProjectCard project={project} key={project.name} />
                  ))}
                </div>
              ) : (
                <p className="science__empty">本阶段暂无公开项目，欢迎带着想法来发起。</p>
              )}
            </div>
          </section>
        ))}
      </div>
    </PageShell>
  );
}

export default SciencePage;
