import { Link } from 'react-router-dom'
import { categoryTone, TONE } from '../lib/tone.js'
import './QifSlideCard.css'

/* 载玻片卡（重设计版）：左标签区 + 右视野图，移动端上下结构。
 * 标签区 = meta 仪表行（Nº.观察编号 + 类别）/ 行楷标题 / 2 行摘要 / hairline 底栏（日期 + 阅读文章）。
 * 染色条与 hover 描边跟 --qif-tone 各自成色（leaf / crystal / safran）。 */
function QifSlideCard({ article, index = 0 }) {
  const tone = categoryTone(article)
  const to = `/news/${encodeURIComponent(article.id)}`
  const no = String(index + 1).padStart(2, '0')

  return (
    <Link
      to={to}
      className="qif-slide-card"
      style={{ '--qif-tone': TONE[tone].hex }}
      aria-label={`${article.category} · ${article.title} · ${article.date}`}
    >
      <div className="qif-slide-card__label">
        <p className="qif-slide-card__meta">
          <span className="qif-slide-card__no">Nº.{no}</span>
          <span className="qif-slide-card__category">{article.category}</span>
        </p>
        <h3 className="qif-slide-card__title">{article.title}</h3>
        <p className="qif-slide-card__excerpt">{article.summary}</p>
        <p className="qif-slide-card__foot">
          <time className="qif-slide-card__date" dateTime={article.date}>
            {article.date.replaceAll('-', '.')}
          </time>
          <span className="qif-slide-card__more">阅读文章 ›</span>
        </p>
      </div>
      <div className="qif-slide-card__field qif-field-mask">
        <img src={article.image} alt="" loading="lazy" decoding="async" />
      </div>
    </Link>
  )
}

export default QifSlideCard
