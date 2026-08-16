import { useMemo, useState } from 'react';
import PageShell from '../components/MainCp/PageShell.jsx';
import ARTICLES from '../data/articles.json';
import './PopularPage.css';

/* 数据驱动：文章索引由 scripts/sync-articles.mjs 从本地笔记仓库生成。
 * 分类筛选 chips + 目录式索引行（Catalogue 宏观结构，与活动页卡片墙刻意不同）。 */

function PopularPage() {
  const [cat, setCat] = useState('all');

  const categories = useMemo(() => {
    const map = new Map();
    for (const a of ARTICLES) map.set(a.category, (map.get(a.category) || 0) + 1);
    return [...map.entries()];
  }, []);

  const filtered = useMemo(
    () => (cat === 'all' ? ARTICLES : ARTICLES.filter(a => a.category === cat)),
    [cat]
  );

  return (
    <PageShell
      no="05"
      id="popular"
      title="知识普及"
      en="Acknowledgment"
      lede="把课堂上学不到的、实验里踩过的坑，写成人人可读的笔记。这里沉淀协会成员的学习记录，也欢迎每一个路过的你取走。"
      accent="eco"
    >
      {/* 分类筛选：mono chips，带篇数 */}
      <div className="popular__filters" role="tablist" aria-label="按分类筛选">
        <button
          type="button"
          role="tab"
          aria-selected={cat === 'all'}
          className={`popular__chip${cat === 'all' ? ' is-active' : ''}`}
          onClick={() => setCat('all')}
        >
          全部 <span className="popular__chip-count">{ARTICLES.length}</span>
        </button>
        {categories.map(([name, count]) => (
          <button
            key={name}
            type="button"
            role="tab"
            aria-selected={cat === name}
            className={`popular__chip${cat === name ? ' is-active' : ''}`}
            onClick={() => setCat(name)}
          >
            {name} <span className="popular__chip-count">{count}</span>
          </button>
        ))}
      </div>

      {/* 目录式索引行 */}
      <div className="popular__list">
        {filtered.map(a => (
          <article className="popular__row" key={a.path}>
            <div className="popular__row-main">
              <h3 className="popular__row-title">{a.title}</h3>
              <p className="popular__row-excerpt">{a.excerpt}</p>
            </div>
            <div className="popular__row-meta">
              <span className="popular__row-cat">{a.category}</span>
              <span className="popular__row-minutes">{a.minutes} min</span>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}

export default PopularPage;
