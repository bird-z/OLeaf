import { useArticles } from '../../lib/useArticles.js'
import { QifObsHeader, QifReveal } from '../qifObs.jsx'
import QifSlideCard from '../QifSlideCard.jsx'
import './QifNewsSection.css'

/* 首页新闻区块「启扉快讯」：自 bioqif NewsSection 迁移。
 * 数据源沿用线上 CMS（cms.bioqif.com），保留 loading / error / 空态三态。
 * 节根带 .news 类，作为 useFullpage 的翻屏停靠点。 */
function QifNewsSection() {
  const { articles, loading, error } = useArticles()

  return (
    <section id="news" className="news qif-news" aria-label="启扉快讯">
      <div className="qif-news__inner">
        <QifObsHeader
          no="02"
          en="NEWS & EVENTS"
          title="启扉快讯"
          desc="记录启扉的每一次探索、实践与成长。"
        />

        {loading ? (
          <div className="qif-empty">
            <h2>正在调焦</h2>
            <p>正在连接标本库，请稍候。</p>
          </div>
        ) : error ? (
          <div className="qif-empty">
            <h2>标本库暂时不可用</h2>
            <p>新闻服务暂未返回内容，请稍后刷新页面。</p>
          </div>
        ) : articles.length > 0 ? (
          <div className="qif-news__grid">
            {articles.slice(0, 3).map((article, i) => (
              <QifReveal key={article.id}>
                <QifSlideCard article={article} index={i} />
              </QifReveal>
            ))}
          </div>
        ) : (
          <div className="qif-empty">
            <h2>观察记录尚少</h2>
            <p>第一批标本正在制作中，敬请期待。</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default QifNewsSection
