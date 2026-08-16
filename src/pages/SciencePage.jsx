import PageShell from '../components/MainCp/PageShell.jsx';
import './SciencePage.css';

/* 数据驱动·可扩展：工作室共同推送流。
 * 工作室名为真实信息（生生不息 / DATASEEK）；项目细节为占位示例（标「示例」），
 * 有真实项目资料后替换对应数组项即可。 */
const STAGES = [
  {
    step: '1.0',
    label: '立项孵化',
    projects: [
      {
        studio: 'DATASEEK',
        name: '校园物种数据图谱',
        status: '孵化中',
        desc: '把自然观察节积累的照片与记录结构化，给校园里的动植物建一份可检索的数据档案。（示例）'
      }
    ]
  },
  {
    step: '2.0',
    label: '开发进行时',
    projects: [
      {
        studio: '生生不息',
        name: 'AI 节气海报流水线',
        status: '进行中',
        desc: '提示词模板 + 批量生成 + 人工精选，让每个节气都有一张协会专属海报。（示例）'
      },
      {
        studio: 'DATASEEK',
        name: '竞赛数据集工具箱',
        status: '进行中',
        desc: '把常用爬虫脚本和数据清洗流程封装成开箱即用的工具包，降低参赛门槛。（示例）'
      }
    ]
  },
  {
    step: '3.0',
    label: '成果发布',
    projects: [
      {
        studio: '生生不息',
        name: '黑客松 AI 创作大赛作品集',
        status: '已发布',
        desc: '第一届「黑客松」AI 创作大赛的全部入围作品整理成册，线上展映中。（示例）'
      }
    ]
  }
];

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
          <section className="science__stage" key={stage.step}>
            {/* 时间线左轨：mono 阶段号 + 竖线 */}
            <div className="science__rail" aria-hidden="true">
              <span className="science__step">{stage.step}</span>
              <span className="science__line" />
            </div>
            <div className="science__content">
              <h2 className="science__label">{stage.label}</h2>
              <div className="science__cards">
                {stage.projects.map(p => (
                  <article className="science__card" key={p.name}>
                    <div className="science__card-head">
                      <span className="science__studio">{p.studio}</span>
                      <span className={`science__status science__status--${p.status}`}>{p.status}</span>
                    </div>
                    <h3 className="science__name">{p.name}</h3>
                    <p className="science__desc">{p.desc}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </PageShell>
  );
}

export default SciencePage;
