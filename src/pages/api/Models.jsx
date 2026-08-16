import { MODELS } from '../../data/api.js';
import '../../components/ApiCp/api.css';
import './Models.css';

/* 模型广场：数据驱动卡片网格，价格统一 $ / 1M tokens */
function Models() {
  return (
    <div className="api-page">
      <div className="api-page__head">
        <h1 className="api-page__title">
          模型广场
          <span className="mono-tag">{MODELS.length} models · $ / 1M tokens</span>
        </h1>
      </div>

      <div className="model-grid">
        {MODELS.map(m => (
          <article className="model-card" key={m.name}>
            <header className="model-card__head">
              <code className="model-card__name">{m.name}</code>
              {m.hot && <span className="dot dot--eco">HOT</span>}
            </header>
            <p className="model-card__vendor">{m.vendor}</p>
            <p className="model-card__desc">{m.desc}</p>
            <div className="model-card__tags">
              {m.tags.map(t => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <footer className="model-card__foot">
              <span className="model-card__price">${m.price.toFixed(2)}</span>
              <span className="model-card__per">/ 1M tokens</span>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Models;
